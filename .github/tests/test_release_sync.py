import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / ".github/scripts/sync-master-to-release-650.sh"


class ReleaseSyncTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.remote = self.root / "remote.git"
        self.env = os.environ.copy()
        self.env.update({
            "GH_REPO": "test/components",
            "RELEASE_TAG": "",
            "GIT_CONFIG_NOSYSTEM": "1",
            "GIT_CONFIG_GLOBAL": os.devnull,
            "GH_LOG": str(self.root / "gh.log"),
            "GH_BODY": str(self.root / "pr-body"),
        })
        self.env.pop("EXISTING_PR", None)
        self.env.pop("FAIL_CREATE", None)
        self.git("init", "--bare", str(self.remote))
        self.git("init", "-b", "master")
        self.git("config", "user.name", "Release sync test")
        self.git("config", "user.email", "test@example.invalid")
        template = self.repo / ".github/PULL_REQUEST_TEMPLATE.md"
        template.parent.mkdir(parents=True)
        shutil.copyfile(ROOT / ".github/PULL_REQUEST_TEMPLATE.md", template)
        self.write_lines("base", "base")
        self.commit("Shared base")
        self.git("branch", "release/650")
        self.write_lines("master", "master non-conflicting change")
        self.commit("Master changes")
        self.source = self.git("rev-parse", "HEAD").strip()
        self.git("tag", "test-release")
        self.git("switch", "release/650")
        self.write_lines("release", "base")
        self.commit("Release-specific changes")
        self.base = self.git("rev-parse", "HEAD").strip()
        self.git("remote", "add", "origin", str(self.remote))
        self.git("push", "origin", "master", "release/650", "--tags")
        self.git("switch", "master")
        self.branch = f"automation/sync-master-to-release-650-{self.source}"
        bin_dir = self.root / "bin"
        bin_dir.mkdir()
        gh = bin_dir / "gh"
        gh.write_text("""#!/usr/bin/env python3
import os
from pathlib import Path
import sys
with open(os.environ["GH_LOG"], "a") as log:
    log.write(repr(sys.argv[1:]) + "\\n")
if sys.argv[1:3] == ["pr", "list"]:
    print(os.environ.get("EXISTING_PR", ""))
elif sys.argv[1:3] == ["pr", "create"]:
    if os.environ.get("FAIL_CREATE"):
        raise SystemExit(1)
    body = Path(sys.argv[sys.argv.index("--body-file") + 1]).read_text()
    Path(os.environ["GH_BODY"]).write_text(body)
    print("https://example.invalid/pull/1")
else:
    raise SystemExit("Unexpected gh invocation")
""")
        gh.chmod(0o755)
        self.env["PATH"] = str(bin_dir) + os.pathsep + self.env["PATH"]

    def git(self, *args):
        return subprocess.check_output(
            ["git", "-c", "core.hooksPath=/dev/null", *args],
            cwd=self.repo, env=self.env, text=True, stderr=subprocess.PIPE,
        )

    def write_lines(self, first, last):
        lines = [first, *[f"unchanged {i}" for i in range(20)], last]
        (self.repo / "shared.txt").write_text("\n".join(lines) + "\n")

    def commit(self, message):
        self.git("add", ".")
        self.git("commit", "-m", message)

    def run_sync(self):
        return subprocess.run(
            ["bash", str(SCRIPT)], cwd=self.repo, env=self.env,
            text=True, capture_output=True,
        )

    def assert_no_sync_branch(self):
        self.assertEqual(self.git("ls-remote", "origin", f"refs/heads/{self.branch}"), "")

    def test_release_wins_conflict_and_master_non_conflicting_hunk_survives(self):
        self.env["RELEASE_TAG"] = "test-release"
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        lines = (self.repo / "shared.txt").read_text().splitlines()
        self.assertEqual(lines[0], "release")
        self.assertEqual(lines[-1], "master non-conflicting change")
        self.assertEqual(self.git("rev-parse", "HEAD^1").strip(), self.base)
        self.assertEqual(self.git("rev-parse", "HEAD^2").strip(), self.source)
        body = (self.root / "pr-body").read_text()
        self.assertIn("## Checklist:", body)
        self.assertIn("<!--- Describe your changes in detail -->", body)
        self.assertIn(self.source, body)
        self.assertIn("CI and maintainer review are required", body)
        self.assertIn(self.branch, self.git("ls-remote", "origin", f"refs/heads/{self.branch}"))

    def test_already_synced_master_is_a_no_op(self):
        self.git("push", "origin", "master:refs/heads/release/650", "--force")
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("already contains master", result.stdout)
        self.assert_no_sync_branch()
        self.assertFalse((self.root / "gh.log").exists())

    def test_existing_pr_is_not_duplicated(self):
        self.env["EXISTING_PR"] = "https://example.invalid/pull/7"
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("pull/7", result.stdout)
        self.assert_no_sync_branch()
        self.assertNotIn("'create'", (self.root / "gh.log").read_text())

    def test_modify_delete_conflict_aborts_without_push(self):
        self.git("rm", "shared.txt")
        self.commit("Master deletes file modified on release")
        self.git("push", "origin", "master")
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Merge needs manual resolution", result.stdout)
        self.assertEqual(self.git("rev-parse", "HEAD").strip(), self.base)
        self.assertEqual(self.git("diff", "--name-only", "--diff-filter=U"), "")
        self.assertEqual(self.git("ls-remote", "origin", "refs/heads/automation/*"), "")
        self.assertNotIn("'create'", (self.root / "gh.log").read_text())

    def test_release_not_on_master_is_rejected(self):
        self.git("switch", "release/650")
        self.git("tag", "release-only")
        self.git("push", "origin", "refs/tags/release-only")
        self.git("switch", "master")
        self.env["RELEASE_TAG"] = "release-only"
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("release tag is not on master", result.stdout)
        self.assert_no_sync_branch()
        self.assertFalse((self.root / "gh.log").exists())

    def test_retry_reuses_branch_after_pr_creation_failure(self):
        self.env["FAIL_CREATE"] = "1"
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        pushed = self.git("ls-remote", "origin", f"refs/heads/{self.branch}")
        self.assertTrue(pushed)
        self.git("switch", "master")
        self.git("branch", "-D", self.branch)
        self.env.pop("FAIL_CREATE")
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(self.git("ls-remote", "origin", f"refs/heads/{self.branch}"), pushed)
        self.assertTrue((self.root / "pr-body").exists())

    def test_existing_unrelated_branch_is_not_overwritten(self):
        self.git("push", "origin", f"release/650:refs/heads/{self.branch}")
        pushed = self.git("ls-remote", "origin", f"refs/heads/{self.branch}")
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("refusing to overwrite", result.stdout)
        self.assertEqual(self.git("ls-remote", "origin", f"refs/heads/{self.branch}"), pushed)
        self.assertNotIn("'create'", (self.root / "gh.log").read_text())


if __name__ == "__main__":
    unittest.main()
