#!/usr/bin/env python3
#
# Copyright 2026 Adobe
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("sync-master-to-release-650.sh").resolve()
TEMPLATE = SCRIPT.parent.parent / "PULL_REQUEST_TEMPLATE.md"


class SyncMasterToReleaseTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory(prefix="release650-sync-test-")
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.source = self.root / "source"
        self.origin = self.root / "origin.git"
        self.runner = self.root / "runner"
        self.source.mkdir()
        self.git(self.source, "init", "--initial-branch=master")
        self.configure(self.source)
        (self.source / "shared.txt").write_text("base\n")
        template = self.source / ".github" / "PULL_REQUEST_TEMPLATE.md"
        template.parent.mkdir()
        shutil.copyfile(TEMPLATE, template)
        self.commit(self.source, "base")

        self.calls = self.root / "gh-calls.jsonl"
        binary = self.root / "bin"
        binary.mkdir()
        gh = binary / "gh"
        gh.write_text(
            "#!/usr/bin/env python3\n"
            "import json, os, sys\n"
            "with open(os.environ['GH_CALL_LOG'], 'a') as log:\n"
            "    log.write(json.dumps(sys.argv[1:]) + '\\n')\n"
            "if sys.argv[1:3] == ['pr', 'create']:\n"
            "    print('https://example.invalid/pull/1')\n"
        )
        gh.chmod(0o755)
        self.env = os.environ.copy()
        for name in ("GH_TOKEN", "GITHUB_TOKEN", "RELEASE_TAG"):
            self.env.pop(name, None)
        self.env.update(
            GH_REPO="test/forms",
            GH_CALL_LOG=str(self.calls),
            PATH=str(binary) + os.pathsep + self.env["PATH"],
        )

    def git(self, repository, *arguments):
        location = ["--git-dir", str(repository)] if repository == self.origin else ["-C", str(repository)]
        return subprocess.check_output(
            ["git", *location, *arguments],
            stderr=subprocess.STDOUT,
            text=True,
        ).strip()

    def configure(self, repository):
        self.git(repository, "config", "user.name", "Sync Test")
        self.git(repository, "config", "user.email", "sync@example.invalid")
        self.git(repository, "config", "commit.gpgsign", "false")
        self.git(repository, "config", "core.hooksPath", "/dev/null")

    def commit(self, repository, message):
        self.git(repository, "add", ".")
        self.git(repository, "commit", "-m", message)

    def prepare_branches(self, conflicting):
        self.git(self.source, "checkout", "-b", "release/650")
        release_file = "shared.txt" if conflicting else "release.txt"
        (self.source / release_file).write_text("release\n")
        self.commit(self.source, "release change")
        self.release_head = self.git(self.source, "rev-parse", "HEAD")
        self.git(self.source, "checkout", "master")
        master_file = "shared.txt" if conflicting else "master.txt"
        (self.source / master_file).write_text("master\n")
        self.commit(self.source, "master change")
        self.master_head = self.git(self.source, "rev-parse", "HEAD")

        self.origin.mkdir()
        self.git(self.origin, "init", "--bare", "--initial-branch=master")
        self.git(self.origin, "config", "core.hooksPath", "/dev/null")
        self.git(self.source, "remote", "add", "origin", str(self.origin))
        self.git(self.source, "push", "origin", "master", "release/650")
        subprocess.run(
            ["git", "clone", str(self.origin), str(self.runner)],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        self.configure(self.runner)
        return "automation/sync-master-to-release-650-" + self.master_head

    def run_sync(self):
        return subprocess.run(
            ["bash", str(SCRIPT)],
            cwd=self.runner,
            env=self.env,
            capture_output=True,
            text=True,
        )

    def created_pr(self):
        return any(
            json.loads(line)[:2] == ["pr", "create"]
            for line in self.calls.read_text().splitlines()
        )

    def test_conflict_aborts_without_pushing_or_creating_pr(self):
        branch = self.prepare_branches(conflicting=True)
        result = self.run_sync()
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertFalse(
            self.git(self.origin, "for-each-ref", "--format=%(refname)", "refs/heads/" + branch)
        )
        self.assertFalse(self.created_pr())
        self.assertEqual(self.git(self.runner, "rev-parse", "HEAD"), self.release_head)
        self.assertEqual((self.runner / "shared.txt").read_text(), "release\n")
        self.assertEqual(self.git(self.runner, "status", "--porcelain"), "")

    def test_non_conflicting_merge_preserves_both_branches_and_creates_pr(self):
        branch = self.prepare_branches(conflicting=False)
        result = self.run_sync()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        parents = self.git(self.origin, "show", "-s", "--format=%P", branch).split()
        self.assertEqual(parents, [self.release_head, self.master_head])
        self.assertEqual(self.git(self.origin, "show", branch + ":release.txt"), "release")
        self.assertEqual(self.git(self.origin, "show", branch + ":master.txt"), "master")
        self.assertTrue(self.created_pr())


if __name__ == "__main__":
    unittest.main()
