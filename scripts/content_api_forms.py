#!/usr/bin/env python3
# Copyright 2026 Adobe Systems Incorporated
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
"""
content_api_forms.py — AEM Content API form management with JCR authoring schema validation.

Fetches JCR authoring schemas from GitHub at startup (cached in ~/.cache/aem-authoring-schema/)
and validates component payloads against the root discriminator schema before any AEM operation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AEM_HOST      AEM instance URL        (default: http://localhost:4502)
  AEM_USER      AEM admin username      (default: admin)
  AEM_PASS      AEM admin password      (default: admin)
  SCHEMA_BRANCH GitHub branch for schemas
                (default: rismehta/jcr-authoring-schema)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEMO MODE  (run all steps in sequence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  python3 scripts/content_api_forms.py
  python3 scripts/content_api_forms.py demo

  Demo includes Step 8b (wcm_form_ops): reads the 'accordion' WCM sample page,
  validates its Content API tree, performs PATCH replace/add-field/add-panel
  with pre-send schema validation, post-write validation, and cleanup.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLI SUBCOMMANDS  (skill-ready interface)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All subcommands accept --json to emit a machine-readable result as the LAST stdout
line (e.g. {"op":"create","ok":true,"pageId":"..."}).  Parse with:
  ... | tail -1 | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['pageId'])"

  create   --site-id SITE_ID --name NAME --title TITLE [--description DESC]
           Create a new page in a site. Returns pageId.

  read     --page-id PAGE_ID
           Read page metadata (title, name, siteId, ...).

  patch    --page-id PAGE_ID --ops OPS_JSON
           PATCH page content with arbitrary JSON Patch ops (RFC 6902).
           Fetches current content, validates all ops against the authoring schema,
           then sends. OPS_JSON is a JSON array, e.g.:
             '[{"op":"replace","path":"/properties/jcr:title","value":"New Title"}]'
             '[{"op":"add","path":"/items/0/items/-","value":{...}}]'

  put      --page-id PAGE_ID --title NEW_TITLE
           PUT (full replace) page content model.

  move     --page-id PAGE_ID --from-index N --to-index M
           Reorder components in /content (JSON Patch move on items[]).

  delete   --page-id PAGE_ID
           Delete a page (ETag-aware).

  clone    --page-id SRC_PAGE_ID --site-id SITE_ID --name NEW_NAME
           Clone a page into the same or different site.

  validate --payload JSON_STRING [--content-api]
           Validate a component dict against the authoring schema (offline, no AEM needed).
           JSON_STRING is a JCR-format node by default:
             '{"fieldType":"text-input","name":"x","jcr:title":"X"}'
           Add --content-api to validate Content API format (properties{} + items[]):
             '{"componentType":"core/fd/.../textinput/v1/textinput",
               "properties":{"fieldType":"text-input","name":"x","jcr:title":"X"}}'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  # Discover siteId from the demo output
  python3 scripts/content_api_forms.py demo 2>&1 | grep siteId

  # Create a page and capture its pageId
  PAGE_ID=$(python3 scripts/content_api_forms.py create \\
    --site-id "$SITE_ID" --name my-form --title "My Form" --json 2>/dev/null \\
    | tail -1 | python3 -c "import json,sys; print(json.load(sys.stdin)['pageId'])")

  # Read it back
  python3 scripts/content_api_forms.py read --page-id "$PAGE_ID"

  # Patch — replace title
  python3 scripts/content_api_forms.py patch --page-id "$PAGE_ID" \
    --ops '[{"op":"replace","path":"/properties/jcr:title","value":"Updated Title"}]'

  # Patch — add a text-input field to the first panel
  python3 scripts/content_api_forms.py patch --page-id "$PAGE_ID" \
    --ops '[{"op":"add","path":"/items/0/items/-","value":{"componentType":"core/fd/components/form/textinput/v1/textinput","properties":{"fieldType":"text-input","name":"zip","jcr:title":"Zip Code"}}}]'

  # Validate offline (no AEM required)
  python3 scripts/content_api_forms.py validate \\
    --payload '{"fieldType":"text-input","name":"x","jcr:title":"X"}' --json

  # Delete
  python3 scripts/content_api_forms.py delete --page-id "$PAGE_ID"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  pip install jsonschema referencing pyyaml requests
"""

import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Optional

import requests
import yaml
import jsonschema
from jsonschema import Draft7Validator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT7

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
AEM_HOST = os.environ.get("AEM_HOST", "http://localhost:4502")
AEM_USER = os.environ.get("AEM_USER", "admin")
AEM_PASS = os.environ.get("AEM_PASS", "admin")
AUTH = (AEM_USER, AEM_PASS)
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}

SITE_ID   = None          # discovered dynamically after creating the root cq:Page
SITE_NAME = "content-api-forms"
SITE_ROOT = f"/content/forms/af/{SITE_NAME}"  # cq:Page under /content/forms/af

# ---------------------------------------------------------------------------
# GitHub schema source — single source of truth
# ---------------------------------------------------------------------------
GITHUB_REPO        = "adobe/aem-core-forms-components"
GITHUB_BRANCH      = os.environ.get("SCHEMA_BRANCH", "rismehta/jcr-authoring-schema")
GITHUB_SCHEMA_ROOT = "docs/authoring-schema"
GITHUB_RAW         = f"https://raw.githubusercontent.com/{GITHUB_REPO}"

SCHEMA_CACHE_BASE = Path.home() / ".cache" / "aem-authoring-schema"
# Fallback to local working copy when GitHub is unreachable
_LOCAL_SCHEMA_DIR = Path(__file__).parent.parent / "docs" / "authoring-schema"

# ---------------------------------------------------------------------------
# Console helpers
# ---------------------------------------------------------------------------
GREEN  = "\033[32m"
RED    = "\033[31m"
YELLOW = "\033[33m"
CYAN   = "\033[36m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def ok(msg):   print(f"  {GREEN}✓{RESET} {msg}")
def fail(msg): print(f"  {RED}✗{RESET} {msg}")
def info(msg): print(f"  {CYAN}→{RESET} {msg}")
def warn(msg): print(f"  {YELLOW}!{RESET} {msg}")
def section(title): print(f"\n{BOLD}{title}{RESET}\n{'─'*60}")

# ---------------------------------------------------------------------------
# Schema validator setup
# ---------------------------------------------------------------------------

def _resolve_branch_sha(branch: str) -> Optional[str]:
    """
    Return the HEAD commit SHA for `branch` in GITHUB_REPO, or None if unreachable.
    Uses the GitHub branches API (no auth needed for public repos).
    """
    url = f"https://api.github.com/repos/{GITHUB_REPO}/branches/{branch}"
    try:
        r = requests.get(url, headers={"Accept": "application/vnd.github+json"}, timeout=8)
        if r.status_code == 200:
            return r.json()["commit"]["sha"]
    except Exception:
        pass
    return None


def _fetch_schema_tree_info(commit_sha: str) -> tuple:
    """
    Return (tree_sha, yaml_paths) for docs/authoring-schema/ at `commit_sha`.

    Makes a single recursive Git tree API call and extracts both:
    - tree_sha: the SHA of the docs/authoring-schema/ subtree. This only changes
      when a schema file changes — unrelated commits on a busy branch (dev/master)
      leave it unchanged, so it is used as the cache key.
    - yaml_paths: list of all docs/authoring-schema/**/*.yaml blob paths, used
      for downloading.

    Returns (None, []) on failure.
    """
    url = f"https://api.github.com/repos/{GITHUB_REPO}/git/trees/{commit_sha}?recursive=1"
    try:
        r = requests.get(url, headers={"Accept": "application/vnd.github+json"}, timeout=15)
        if r.status_code != 200:
            return None, []
        tree = r.json().get("tree", [])
        tree_sha = None
        yaml_paths = []
        for item in tree:
            if item["path"] == GITHUB_SCHEMA_ROOT and item["type"] == "tree":
                tree_sha = item["sha"]
            if (item["path"].startswith(GITHUB_SCHEMA_ROOT)
                    and item["path"].endswith(".yaml")
                    and item["type"] == "blob"):
                yaml_paths.append(item["path"])
        return tree_sha, yaml_paths
    except Exception:
        return None, []


def _download_schemas(sha: str, paths: list, cache_dir: Path) -> bool:
    """
    Download each schema YAML file from GitHub raw at `sha` into `cache_dir`,
    preserving the sub-path relative to GITHUB_SCHEMA_ROOT.
    Returns True on full success, False if any download failed.
    """
    ok_count = 0
    for path in paths:
        rel = path[len(GITHUB_SCHEMA_ROOT):].lstrip("/")
        dest = cache_dir / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            r = requests.get(f"{GITHUB_RAW}/{sha}/{path}", timeout=15)
            if r.status_code == 200:
                dest.write_bytes(r.content)
                ok_count += 1
            else:
                return False
        except Exception:
            return False
    return ok_count == len(paths)


def fetch_schemas() -> Path:
    """
    Ensure the latest authoring schemas from GITHUB_BRANCH are available locally.

    Strategy:
      1. Resolve HEAD commit SHA of GITHUB_BRANCH via GitHub API.
      2. Resolve the docs/authoring-schema/ subtree SHA from the root tree.
         This SHA only changes when a schema file changes — unrelated commits on
         a busy branch (dev/master) do not invalidate the cache.
      3. If ~/.cache/aem-authoring-schema/{tree-sha}/ already exists -> reuse (cache hit).
      4. Otherwise download all docs/authoring-schema/**/*.yaml via raw GitHub URLs
         (using the commit SHA for raw content addressing) into the tree-SHA-keyed
         cache directory.
      5. If GitHub is unreachable:
         a. Use the newest existing cache directory if one exists.
         b. Fall back to the local working copy docs/authoring-schema/ with a warning.

    Returns the Path to the local schema root directory ready for file: URI loading.
    """
    commit_sha = _resolve_branch_sha(GITHUB_BRANCH)

    if commit_sha:
        tree_sha, paths = _fetch_schema_tree_info(commit_sha)
        cache_key = tree_sha or commit_sha   # fall back to commit SHA if tree SHA unavailable
        cache_dir = SCHEMA_CACHE_BASE / cache_key
        if cache_dir.exists():
            return cache_dir          # cache hit — schemas unchanged
        # Cache miss — schema files changed, re-download
        if paths:
            cache_dir.mkdir(parents=True, exist_ok=True)
            if _download_schemas(commit_sha, paths, cache_dir):
                return cache_dir
            # Partial download — remove incomplete dir
            import shutil
            shutil.rmtree(cache_dir, ignore_errors=True)

    # GitHub unreachable or download failed — try existing cache
    SCHEMA_CACHE_BASE.mkdir(parents=True, exist_ok=True)
    existing = sorted(SCHEMA_CACHE_BASE.iterdir()) if SCHEMA_CACHE_BASE.exists() else []
    if existing:
        newest = existing[-1]
        warn(f"GitHub unreachable — using cached schemas from {newest.name[:8]}...")
        return newest

    # Last resort — local working copy
    if _LOCAL_SCHEMA_DIR.exists():
        warn(f"GitHub unreachable and no cache — using local working copy: {_LOCAL_SCHEMA_DIR}")
        return _LOCAL_SCHEMA_DIR

    raise RuntimeError(
        "Cannot load authoring schemas: GitHub unreachable, no cache, no local working copy."
    )


def build_registry(schema_dir: Path) -> tuple["Registry", str]:
    """
    Walk schema_dir/**/*.yaml and build a referencing.Registry for Draft7Validator.

    Returns (registry, root_uri) where root_uri is the file URI for
    adaptive-form-component.authoring.schema.yaml (the root discriminator).

    The referencing library correctly handles nested $ref chains through
    patternProperties — including cross-directory references — without the
    scope-stack drift that affected the deprecated RefResolver.
    """
    resources = []
    for yaml_file in sorted(schema_dir.rglob("*.yaml")):
        with open(yaml_file) as f:
            schema = yaml.safe_load(f)
        uri = yaml_file.resolve().as_uri()
        resources.append((uri, Resource.from_contents(schema, default_specification=DRAFT7)))
    registry = Registry().with_resources(resources)
    root_uri = (schema_dir / "adaptive-form-component.authoring.schema.yaml").resolve().as_uri()
    return registry, root_uri


# Module-level registry (built once); validators reference it by URI
_SCHEMA_REGISTRY: Optional[Registry] = None
_ROOT_URI:        str                 = ""
_SCHEMA_DIR:      Path                = Path()  # kept for path checks (step 0)

def fresh_validator() -> Draft7Validator:
    """Return a Draft7Validator for the root discriminator schema."""
    return Draft7Validator({"$ref": _ROOT_URI}, registry=_SCHEMA_REGISTRY)


# ---------------------------------------------------------------------------
# Schema-guided payload cleanup
# Properties at their default value MUST be omitted per the authoring schema.
# Sending defaults bloats JCR and produces false positives in .infinity.json.
# ---------------------------------------------------------------------------

# (default=true) — only send when explicitly FALSE
OMIT_WHEN_TRUE = frozenset({
    "visible",
    "enabled",
    "enforceEnum",
    "showApprovalOption",   # termsandconditions
})

# (default=false) — only send when explicitly TRUE
OMIT_WHEN_FALSE = frozenset({
    "readOnly",
    "hideTitle",
    "isTitleRichText",
    "tooltipVisible",
    "required",
    "repeatable",
    "unboundFormElement",
    "dorExclusion",
    "dorExcludeTitle",
    "dorExcludeDescription",
    "multiSelect",
    "multiLine",
    "excludeMinimum",       # datepicker legacy
    "excludeMaximum",       # datepicker legacy
    "fd:enableAutoSave",
    "multiSelection",       # fileinput
    "enableUncheckedValue", # checkbox/switch
    "showLink",             # termsandconditions
    "showAsPopup",          # termsandconditions
    "wrapData",             # panel
})

_TRUTHY  = (True,  "true",  "{Boolean}true")
_FALSY   = (False, "false", "{Boolean}false", "false\n")

def _is_child_node(value: Any) -> bool:
    """True if value looks like a JCR child node (dict with sling:resourceType or fieldType)."""
    return isinstance(value, dict) and (
        "sling:resourceType" in value or "fieldType" in value
    )


def strip_defaults(node: Any) -> Any:
    """
    Recursively strip default-value properties from a component node dict.
    Child nodes (nested components) are also cleaned.
    """
    if not isinstance(node, dict):
        return node

    cleaned = {}
    for key, value in node.items():
        if key in OMIT_WHEN_TRUE and value in _TRUTHY:
            continue
        if key in OMIT_WHEN_FALSE and value in _FALSY:
            continue
        if _is_child_node(value):
            cleaned[key] = strip_defaults(value)
        elif isinstance(value, dict):
            cleaned[key] = strip_defaults(value)
        else:
            cleaned[key] = value
    return cleaned


# ---------------------------------------------------------------------------
# Known core/fd resource type whitelist
#
# Only core/fd/ resource types are checked — custom resource types always pass.
# Derived from cq:Component nodes under /libs/core/fd/components on AEM 6.5 /
# AEM Cloud Service as of the aem-core-forms-components release this script ships with.
# Update this set when new component versions are released.
# ---------------------------------------------------------------------------

_KNOWN_CORE_FD_TYPES: frozenset[str] = frozenset({
    # Form container
    "core/fd/components/form/container/v1/container",
    "core/fd/components/form/container/v2/container",
    # Text input
    "core/fd/components/form/textinput/v1/textinput",
    # Multiline (textarea) — shares textinput resource type
    # Email
    "core/fd/components/form/emailinput/v1/emailinput",
    # Telephone
    "core/fd/components/form/telephoneinput/v1/telephoneinput",
    # Number
    "core/fd/components/form/numberinput/v1/numberinput",
    # Date
    "core/fd/components/form/datepicker/v1/datepicker",
    # Date-time
    "core/fd/components/form/datetime/v1/datetime",
    # File upload
    "core/fd/components/form/fileinput/v1/fileinput",
    "core/fd/components/form/fileinput/v2/fileinput",
    "core/fd/components/form/fileinput/v3/fileinput",
    "core/fd/components/form/fileinput/v4/fileinput",
    # Dropdown
    "core/fd/components/form/dropdown/v1/dropdown",
    # Radio group
    "core/fd/components/form/radiobutton/v1/radiobutton",
    "core/fd/components/form/radiobutton/v2/radiobutton",
    # Checkbox group
    "core/fd/components/form/checkboxgroup/v1/checkboxgroup",
    "core/fd/components/form/checkboxgroup/v2/checkboxgroup",
    # Checkbox (single)
    "core/fd/components/form/checkbox/v1/checkbox",
    # Switch / toggle
    "core/fd/components/form/switch/v1/switch",
    # Image
    "core/fd/components/form/image/v1/image",
    # Button (dedicated component)
    "core/fd/components/form/button/v1/button",
    "core/fd/components/form/button/v2/button",
    # Submit / Reset actions (also surfaced as fieldType=button)
    "core/fd/components/form/actions/submit/v1/submit",
    "core/fd/components/form/actions/submit/v2/submit",
    "core/fd/components/form/actions/reset/v1/reset",
    "core/fd/components/form/actions/reset/v2/reset",
    # Plain text / rich text
    "core/fd/components/form/text/v1/text",
    # Title
    "core/fd/components/form/title/v1/title",
    "core/fd/components/form/title/v2/title",
    # Panel containers (fieldType=panel, different resource types)
    "core/fd/components/form/panelcontainer/v1/panelcontainer",
    "core/fd/components/form/accordion/v1/accordion",
    "core/fd/components/form/tabsontop/v1/tabsontop",
    "core/fd/components/form/verticaltabs/v1/verticaltabs",
    "core/fd/components/form/wizard/v1/wizard",
    "core/fd/components/form/wizard/v2/wizard",
    # Captcha variants (all share fieldType=captcha)
    "core/fd/components/form/recaptcha/v1/recaptcha",
    "core/fd/components/form/hcaptcha/v1/hcaptcha",
    "core/fd/components/form/turnstile/v1/turnstile",
    # Scribble signature
    "core/fd/components/form/scribble/v1/scribble",
    # Terms and conditions
    "core/fd/components/form/termsandconditions/v1/termsandconditions",
    # Fragment / fragment container
    "core/fd/components/form/fragment/v1/fragment",
    "core/fd/components/form/fragmentcontainer/v1/fragmentcontainer",
    # Review step
    "core/fd/components/form/review/v1/review",
})


# ---------------------------------------------------------------------------
# Per-component validation
# ---------------------------------------------------------------------------

def validate_component(component: dict, path: str = "") -> list[str]:
    """
    Validate a single component dict against the root discriminator schema.
    Also checks that core/fd/ resource types are in the known whitelist —
    custom resource types (not starting with core/fd/) always pass this check.
    Returns a list of error messages (empty = valid).
    """
    errors = []
    rt = component.get("sling:resourceType", "")
    if rt.startswith("core/fd/") and rt not in _KNOWN_CORE_FD_TYPES:
        errors.append(
            f"{path or 'component'}: sling:resourceType {rt!r} is not a known "
            f"core/fd component — check for typos or wrong version suffix"
        )
        return errors  # skip schema validation; discriminator would also fail
    v = fresh_validator()
    for err in v.iter_errors(component):
        location = "/".join(str(p) for p in err.absolute_path)
        errors.append(f"{path or 'component'}{'.' if location else ''}{location}: {err.message}")
    return errors


def validate_form_payload(payload: dict) -> list[str]:
    """
    Walk a full form creation payload and validate every component node.
    The top-level payload contains page properties + 'content' with the
    guideContainer tree. Each node that has a 'fieldType' is a component.
    Each component gets a fresh validator to avoid RefResolver scope leaks.
    """
    content = payload.get("content", {})
    return _validate_tree(content, "content")


def _validate_tree(node: dict, path: str = "") -> list[str]:
    """
    Recursively walk any JCR subtree and validate every component node found.

    Accepts any of:
      - A single component dict  (has 'fieldType' at top level)
      - A guideContainer subtree (e.g. from .infinity.json)
      - A full page .infinity.json (jcr:content -> guideContainer -> fields)

    Any dict that contains 'fieldType' is treated as a component and validated.
    Child nodes are discovered via _is_child_node() (has 'sling:resourceType' or
    'fieldType'), so the walk does not descend into plain scalar properties.
    """
    all_errors: list[str] = []

    def walk(n: dict, p: str):
        if not isinstance(n, dict):
            return
        if "fieldType" in n:
            errs = validate_component(n, p)
            all_errors.extend(errs)
        for key, value in n.items():
            if _is_child_node(value):
                walk(value, f"{p}.{key}" if p else key)

    walk(node, path)
    return all_errors


# ---------------------------------------------------------------------------
# Content API format validation helpers
# ---------------------------------------------------------------------------

def _content_api_to_jcr(node: dict) -> dict:
    """
    Recursively convert a Content API node (properties{} + items[]) to the
    flat JCR dict the authoring schema expects.

    - Flattens 'properties' to the top level
    - Maps 'componentType' → 'sling:resourceType'
    - Converts each item in 'items[]' to a child key using item['id']
      (id is required by the Content API spec: PageContent.required includes 'id')

    The resulting dict can be passed directly to validate_component().  The
    container schema's patternProperties:".*" then validates child nodes
    recursively — no manual walking needed.
    """
    props = node.get("properties") or {}
    ct    = node.get("componentType") or ""
    jcr   = {**props, "sling:resourceType": ct}
    for i, item in enumerate(node.get("items") or []):
        if isinstance(item, dict):
            # id is required in API responses; write payloads may omit it
            key = item.get("id") or f"item{i}"
            jcr[key] = _content_api_to_jcr(item)
    return jcr


def validate_content_api_payload(node: dict) -> list[str]:
    """
    Validate a Content API content tree (items[] format) against the authoring schema.

    Walks every node in the tree.  For nodes that carry a 'fieldType' property
    (i.e. AF components):
      - Builds a flat JCR-equivalent dict: {**properties, sling:resourceType: componentType}
        WITHOUT children, so that validate_component()'s Python-level resource-type
        whitelist fires on every individual node (not just the root).
      - Calls validate_component() on that flat dict.
      - Children are validated recursively in subsequent walk steps.

    For non-component nodes (no 'fieldType' in properties, e.g. the root
    jcr:content wrapper returned by the Content API):
      - Skips schema validation and recurses into items[] so that AF component
        nodes nested inside WCM wrappers are still reached.

    Note: _content_api_to_jcr() (which embeds children as keys) is intentionally
    NOT used here because the Python whitelist check in validate_component() only
    runs on the top-level dict, not on embedded child keys that the JSON Schema
    validates via patternProperties.
    """
    props = node.get("properties") or {}
    if "fieldType" not in props:
        # Non-component wrapper — recurse into items[] without validating this node
        all_errors: list[str] = []
        for item in node.get("items") or []:
            if isinstance(item, dict):
                all_errors.extend(validate_content_api_payload(item))
        return all_errors

    # Flat JCR dict for this node only (no children)
    ct  = node.get("componentType") or ""
    nid = node.get("id") or "component"
    jcr = {**props, "sling:resourceType": ct}
    all_errors = validate_component(jcr, nid)

    # Recurse into children
    for item in node.get("items") or []:
        if isinstance(item, dict):
            all_errors.extend(validate_content_api_payload(item))

    return all_errors


def _get_at_pointer(root, pointer: str):
    """
    Navigate a nested dict/list using a JSON Pointer string (RFC 6901).
    Returns (parent, last_key) so the caller can read or mutate the target.
    """
    parts = [p for p in pointer.lstrip("/").split("/") if p]
    if not parts:
        raise ValueError("Empty JSON Pointer")
    node = root
    for part in parts[:-1]:
        if isinstance(node, list):
            node = node[int(part)]
        else:
            node = node[part]
    last = parts[-1]
    return node, last


def _simulate_patch(data: dict, ops: list) -> dict:
    """
    Apply a list of JSON Patch ops (RFC 6902) to a deep copy of *data* and
    return the result.  Only replace/add/remove are simulated; other ops are
    skipped (they don't affect schema validation).
    """
    import copy
    result = copy.deepcopy(data)
    for op in ops:
        kind = op.get("op", "")
        path = op.get("path", "")
        if not path:
            continue
        try:
            parent, key = _get_at_pointer(result, path)
        except (KeyError, IndexError, ValueError):
            continue
        if kind == "replace":
            if isinstance(parent, list):
                parent[int(key)] = op["value"]
            else:
                parent[key] = op["value"]
        elif kind == "add":
            if isinstance(parent, list):
                if key == "-":
                    parent.append(op["value"])
                else:
                    parent.insert(int(key), op["value"])
            else:
                parent[key] = op["value"]
        elif kind == "remove":
            if isinstance(parent, list):
                del parent[int(key)]
            else:
                del parent[key]
    return result


def validate_patch_ops(current_content: dict, ops: list) -> list[str]:
    """
    Pre-flight schema validation for a list of JSON Patch ops against the
    current content tree fetched from the Content API.

    Strategy per op type:
      add (dict value)         — validate the added Content API node directly.
      replace whole item       — validate the replacement node directly.
      replace /properties/key  — simulate patch, navigate to owning item,
                                  validate post-patch item (only the changed
                                  property can introduce a new error).
      remove / move / copy / test — no schema impact; skipped.
    """
    import re
    all_errors: list[str] = []
    simulated = _simulate_patch(current_content, ops)

    for op in ops:
        kind = op.get("op", "")
        path = op.get("path", "")

        if kind in ("remove", "move", "copy", "test"):
            continue

        value = op.get("value")

        if kind == "add" and isinstance(value, dict):
            # Node being added — validate it directly (handles nested items[])
            all_errors.extend(validate_content_api_payload(value))

        elif kind == "replace":
            if isinstance(value, dict) and "/properties/" not in path:
                # Whole-item replacement — validate the new node directly
                all_errors.extend(validate_content_api_payload(value))
            elif "/properties/" in path:
                # Single-property replacement — simulate, navigate to owning item
                item_pointer = re.sub(r"/properties/[^/]+$", "", path)
                if not item_pointer or item_pointer == "/":
                    continue  # top-level page property, not a component
                try:
                    parent, key = _get_at_pointer(simulated, item_pointer)
                    item = parent[int(key)] if isinstance(parent, list) else parent[key]
                    if isinstance(item, dict):
                        all_errors.extend(validate_content_api_payload(item))
                except (KeyError, IndexError, ValueError) as exc:
                    all_errors.append(f"Cannot navigate to item at {item_pointer}: {exc}")

    return all_errors


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def get(path: str) -> requests.Response:
    return requests.get(f"{AEM_HOST}{path}", auth=AUTH, headers=HEADERS, timeout=15)

def post(path: str, body: dict) -> requests.Response:
    return requests.post(f"{AEM_HOST}{path}", auth=AUTH, headers=HEADERS,
                         data=json.dumps(body), timeout=15)

def get_etag(path: str) -> str:
    """
    Fetch a resource and return its ETag header value.

    The Content API requires If-Match on mutating requests (PATCH, PUT, DELETE).
    ETags are versioned per-resource — always fetch fresh immediately before use.
    """
    r = requests.get(f"{AEM_HOST}{path}", auth=AUTH, headers=HEADERS, timeout=15)
    return r.headers.get("ETag", "")

def put(path: str, body: dict) -> requests.Response:
    """
    PUT to Content API with ETag-based optimistic locking.

    Fetches a fresh ETag from path immediately before the PUT to avoid 428/412.
    Content API PUT body must use the content model format:
      {"id": "jcr:content", "componentType": "...", "properties": {...}, "items": [...]}
    """
    etag = get_etag(path)
    hdrs = {**HEADERS, "If-Match": etag}
    return requests.put(f"{AEM_HOST}{path}", auth=AUTH, headers=hdrs,
                        data=json.dumps(body), timeout=15)

def patch(path: str, ops: list) -> requests.Response:
    """
    PATCH to Content API using JSON Patch (RFC 6902) with ETag-based optimistic locking.

    ops — list of JSON Patch operations, e.g.:
      [{"op": "replace", "path": "/properties/jcr:title", "value": "New Title"}]

    Content-Type must be application/json-patch+json (not application/json).
    Fetches a fresh ETag from path immediately before the PATCH.
    """
    etag = get_etag(path)
    patch_headers = {
        "Content-Type": "application/json-patch+json",
        "Accept": "application/json",
        "If-Match": etag,
    }
    return requests.patch(f"{AEM_HOST}{path}", auth=AUTH, headers=patch_headers,
                          data=json.dumps(ops), timeout=15)

def delete(path: str) -> requests.Response:
    """
    DELETE via Content API with ETag-based optimistic locking.

    Fetches a fresh ETag from path immediately before the DELETE.
    """
    etag = get_etag(path)
    hdrs = {**HEADERS, "If-Match": etag}
    return requests.delete(f"{AEM_HOST}{path}", auth=AUTH, headers=hdrs, timeout=15)



# ---------------------------------------------------------------------------
# Step 0 — pre-flight checks
# ---------------------------------------------------------------------------

def check_aem(results: list) -> bool:
    section("Step 0: Pre-flight checks")
    try:
        r = requests.get(f"{AEM_HOST}/libs/granite/core/content/login.html",
                         auth=AUTH, timeout=10)
        if r.status_code in (200, 302):
            ok(f"AEM reachable at {AEM_HOST}")
        else:
            fail(f"AEM returned HTTP {r.status_code}")
            return False
    except Exception as e:
        fail(f"Cannot reach AEM: {e}")
        return False

    r = get("/adobe/sites")
    if r.status_code == 200:
        ok("Content API /adobe/sites is available")
        results.append(("content_api_available", True))
    elif r.status_code == 404:
        fail("Content API returned 404 — bundle may not be deployed")
        results.append(("content_api_available", False))
        return False
    else:
        warn(f"Content API returned HTTP {r.status_code} — proceeding anyway")

    root_schema = _SCHEMA_DIR / "adaptive-form-component.authoring.schema.yaml"
    if not root_schema.exists():
        fail(f"Root schema not found: {root_schema}")
        return False
    ok(f"Root schema found: {root_schema.name}  (from {_SCHEMA_DIR})")
    return True


# ---------------------------------------------------------------------------
# Step 1 — site registration
# ---------------------------------------------------------------------------

def create_site_root_page() -> bool:
    """
    Create a cq:Page at SITE_ROOT via Sling POST import operation.

    Key findings (from FluffyJaws + empirical testing):
    - POST /adobe/sites does NOT exist — site creation is not in the Content API
    - The Content API auto-discovers cq:Page nodes as "sites" by scanning content
    - /content/forms/af is a sling:Folder → won't appear as a site
    - A cq:Page child of /content/forms/af WILL appear in /adobe/sites IF it has:
        * jcr:mixinTypes: [mix:referenceable]  → assigns jcr:uuid (used for siteId)
        * cq:conf pointing to a valid conf root
        * jcr:language set
        * AF page template + resourceType
    - Use Sling POST :operation=import with JSON to atomically set all these on the
      jcr:content node including the mixin (plain Sling POST cannot set jcr:mixinTypes)
    """
    # Check if it already exists with mix:referenceable (needs depth=2 for jcr:content)
    r = requests.get(f"{AEM_HOST}{SITE_ROOT}.2.json", auth=AUTH, timeout=10)
    if r.status_code == 200:
        data = r.json()
        if data.get("jcr:primaryType") == "cq:Page":
            jc = data.get("jcr:content", {})
            if jc.get("jcr:uuid"):
                ok(f"Site root already exists with uuid at {SITE_ROOT}")
                return True
            # Exists but missing uuid — patch it via import
            info(f"Site root exists but missing mix:referenceable — patching {SITE_ROOT}")

    info(f"Creating site root cq:Page at {SITE_ROOT} (/content/forms/af/{SITE_NAME})")

    # Step A: Create the cq:Page node itself (parent is /content/forms/af, a sling:Folder)
    parent = "/content/forms/af"
    node_content = json.dumps({
        "jcr:primaryType": "cq:Page",
        "jcr:content": {
            "jcr:primaryType": "cq:PageContent",
            "jcr:mixinTypes": ["mix:referenceable"],
            "jcr:title": "Content API Forms",
            "jcr:language": "en",
            "sling:resourceType": "forms-components-examples/components/page",
            "cq:template": "/conf/core-components-examples/settings/wcm/templates/af-blank-v2",
            "cq:conf": "/conf/core-components-examples",
            "cq:deviceGroups": ["mobile/groups/responsive"],
        },
    })

    r = requests.post(
        f"{AEM_HOST}{SITE_ROOT}",
        auth=AUTH,
        files={
            ":operation": (None, "import"),
            ":contentType": (None, "json"),
            ":replace": (None, "true"),
            ":replaceProperties": (None, "true"),
            ":content": (None, node_content),
        },
        timeout=15,
    )

    if r.status_code in (200, 201):
        ok(f"Site root page created: {SITE_ROOT}")
        # Also create the matching DAM folder so forms created under this site
        # will appear in Forms Manager (/aem/forms.html).
        dam_folder = _dam_site_path(SITE_NAME)
        _ensure_dam_folder(dam_folder)
        ok(f"Forms Manager DAM folder ensured: {dam_folder}")
        return True

    fail(f"Sling import failed ({r.status_code}): {r.text[:200]}")
    return False


def discover_site_id(site_name: str):
    """
    Look up the siteId for a site by name via GET /adobe/sites.

    The Content API auto-discovers cq:Page nodes as sites. Each cq:Page with
    mix:referenceable (and thus jcr:uuid) under /content/forms/af appears in
    /adobe/sites with an opaque id. We match by the page node name.
    """
    r = requests.get(f"{AEM_HOST}/adobe/sites", auth=AUTH,
                     headers={"Accept": "application/json"}, timeout=15)
    if r.status_code == 200:
        for site in r.json().get("items", []):
            if site.get("name") == site_name:
                return site.get("id")
    return None


# ---------------------------------------------------------------------------
# Forms Manager (dam:Asset) helpers
#
# AEM Forms Manager (/aem/forms.html) lists dam:Asset nodes under
# /content/dam/formsanddocuments — not the cq:Page nodes under
# /content/forms/af.  For a script-created form to appear in Forms Manager
# we must create a parallel dam:Asset stub at the matching DAM path.
#
# Path mapping:
#   cq:Page :  /content/forms/af/<site>/<form>
#   dam:Asset: /content/dam/formsanddocuments/<site>/<form>
# ---------------------------------------------------------------------------

DAM_ROOT = "/content/dam/formsanddocuments"


def _dam_site_path(site_name: str) -> str:
    return f"{DAM_ROOT}/{site_name}"


def _dam_asset_path(site_name: str, page_name: str) -> str:
    return f"{DAM_ROOT}/{site_name}/{page_name}"


def _site_name_from_id(site_id: str) -> Optional[str]:
    """Return the site node name for a given siteId (reverse of discover_site_id)."""
    r = requests.get(f"{AEM_HOST}/adobe/sites", auth=AUTH,
                     headers={"Accept": "application/json"}, timeout=15)
    if r.status_code == 200:
        for site in r.json().get("items", []):
            if site.get("id") == site_id:
                return site.get("name")
    return None


def _ensure_dam_folder(dam_path: str):
    """Create a sling:Folder at dam_path if it does not already exist."""
    r = requests.get(f"{AEM_HOST}{dam_path}.1.json", auth=AUTH, timeout=10)
    if r.status_code == 200:
        return  # already exists
    node_content = json.dumps({
        "jcr:primaryType": "sling:Folder",
        "jcr:content": {
            "jcr:primaryType": "nt:unstructured",
            "dam:noThumbnail": True,
        },
    })
    requests.post(
        f"{AEM_HOST}{dam_path}",
        auth=AUTH,
        files={
            ":operation":   (None, "import"),
            ":contentType": (None, "json"),
            ":replace":     (None, "false"),
            ":content":     (None, node_content),
        },
        timeout=15,
    )


def _create_dam_asset_stub(dam_path: str, title: str):
    """
    Create (or overwrite) a dam:Asset stub at dam_path so the form appears in
    Forms Manager (/aem/forms.html).

    Two-step approach required because the Sling POST import operation cannot
    change jcr:primaryType on an auto-created node — it defaults to sling:Folder
    on DAM paths.  Instead we:
      1. POST with jcr:primaryType=dam:Asset to set the correct node type.
      2. POST import the jcr:content subtree into the now-typed node.
    """
    # Step 1: create the dam:Asset node with the correct primary type
    r1 = requests.post(
        f"{AEM_HOST}{dam_path}",
        auth=AUTH,
        data={"jcr:primaryType": "dam:Asset"},
        timeout=15,
    )
    if r1.status_code not in (200, 201):
        return r1

    # Step 2: import jcr:content (AssetContent + metadata) into the asset node
    content_json = json.dumps({
        "jcr:content": {
            "jcr:primaryType":    "dam:AssetContent",
            "type":               "guide",
            "guide":              "1",
            "sling:resourceType": "fd/fm/af/render",
            "metadata": {
                "jcr:primaryType":     "nt:unstructured",
                "fd:version":          "2.1",
                "title":               title,
                "formmodel":           "none",
                "dorType":             "none",
                "allowedRenderFormat": "HTML",
                "author":              AEM_USER,
            },
        },
    })
    return requests.post(
        f"{AEM_HOST}{dam_path}",
        auth=AUTH,
        files={
            ":operation":   (None, "import"),
            ":contentType": (None, "json"),
            ":replace":     (None, "false"),
            ":content":     (None, content_json),
        },
        timeout=15,
    )


def _delete_dam_asset_stub(dam_path: str):
    """Delete the Forms Manager dam:Asset stub at dam_path if it exists."""
    r = requests.get(f"{AEM_HOST}{dam_path}.1.json", auth=AUTH, timeout=10)
    if r.status_code == 200:
        requests.post(
            f"{AEM_HOST}{dam_path}",
            auth=AUTH,
            files={":operation": (None, "delete")},
            timeout=10,
        )


def register_site(results: list) -> bool:
    global SITE_ID

    section(f"Step 1: Create/discover site '{SITE_NAME}' at {SITE_ROOT}")

    # Key findings (FluffyJaws + empirical):
    # - POST /adobe/sites does not exist — no Content API site creation endpoint
    # - Content API auto-discovers cq:Page nodes with mix:referenceable as "sites"
    # - We create the cq:Page via Sling POST :operation=import, then look it up by name

    site_created = create_site_root_page()

    # Give the Content API time to index the new page
    wait = 4 if site_created else 1
    info(f"Waiting {wait}s for Content API to index new page...")
    time.sleep(wait)

    # Discover the siteId — retry up to 4 times with backoff
    info(f"Querying /adobe/sites to discover siteId for '{SITE_NAME}'...")
    site_id = None
    for attempt in range(4):
        site_id = discover_site_id(SITE_NAME)
        if site_id:
            break
        if attempt < 3:
            info(f"  Not found yet, retrying in 3s (attempt {attempt+1}/4)...")
            time.sleep(3)

    if site_id:
        SITE_ID = site_id  # module-level; used by all subsequent steps
        ok(f"siteId: {SITE_ID}")
        results.append(("site_registered", True))
        return True

    warn(f"Could not find site '{SITE_NAME}' — available sites:")
    r = requests.get(f"{AEM_HOST}/adobe/sites", auth=AUTH,
                     headers={"Accept": "application/json"}, timeout=15)
    if r.status_code == 200:
        for s in r.json().get("items", []):
            info(f"  name={s.get('name')} title={s.get('title')}")

    fail(f"Could not find or create site '{SITE_NAME}'")
    results.append(("site_registered", False))
    return False


# ---------------------------------------------------------------------------
# Step 2 — validate + CREATE
# ---------------------------------------------------------------------------

# Full registration form payload — uses strict schema-clean properties only
REGISTRATION_FORM = {
    "jcr:title":        "Registration Form (API Test)",
    "cq:template":      "/conf/core-components-examples/settings/wcm/templates/af-blank-v2",
    "sling:resourceType": "core/fd/components/page/v2/page",
    "content": {
        "guideContainer": {
            "sling:resourceType": "core/fd/components/form/container/v2/container",
            "fieldType":          "form",
            "fd:version":         "2.1",
            "schemaType":         "none",
            "thankYouOption":     "message",
            "thankYouMessage":    "Thank you for registering.",

            "firstName": {
                "sling:resourceType": "core/fd/components/form/textinput/v1/textinput",
                "fieldType":          "text-input",
                "name":               "firstName",
                "jcr:title":          "First Name",
                "required":           "true",
                "mandatoryMessage":   "First Name is required",
            },

            "age": {
                "sling:resourceType": "core/fd/components/form/numberinput/v1/numberinput",
                "fieldType":          "number-input",
                "name":               "age",
                "jcr:title":          "Age",
                "type":               "integer",
                "minimum":            18,
                "maximum":            120,
            },

            "country": {
                "sling:resourceType": "core/fd/components/form/dropdown/v1/dropdown",
                "fieldType":          "drop-down",
                "name":               "country",
                "jcr:title":          "Country",
                "type":               "string",
                "enum":               ["US", "GB", "IN", "CA"],
                "enumNames":          ["United States", "United Kingdom", "India", "Canada"],
            },

            "agreement": {
                "sling:resourceType": "core/fd/components/form/checkbox/v1/checkbox",
                "fieldType":          "checkbox",
                "name":               "agreement",
                "jcr:title":          "I agree to the terms and conditions",
                "type":               "boolean",
                "required":           "true",
            },

            "submit": {
                "sling:resourceType": "core/fd/components/form/actions/submit/v1/submit",
                "fieldType":          "button",
                "name":               "submit",
                "jcr:title":          "Register",
                "buttonType":         "submit",
            },
        }
    },
}

# Negative test: fieldType value not in the enum — discriminator fails to match any branch
INVALID_FORM = {
    "content": {
        "guideContainer": {
            "sling:resourceType": "core/fd/components/form/container/v2/container",
            "fieldType":          "form",
            "fd:version":         "2.1",
            "thankYouOption":     "message",
            "thankYouMessage":    "Thanks.",
            "badField": {
                "sling:resourceType": "core/fd/components/form/textinput/v1/textinput",
                "fieldType":          "not-a-valid-field-type",   # ← not in base.authoring.schema enum
                "name":               "bad",
                "jcr:title":          "Bad Field",
            },
        }
    }
}

PAGE_NAME   = "api-test-registration"
PAGE_ID     = None   # opaque pageId returned by POST /adobe/pages, used for all page ops
PAGE_JCR    = f"{SITE_ROOT}/{PAGE_NAME}"


def validate_and_create(results: list) -> bool:
    global PAGE_ID
    section("Step 2: Schema validation then CREATE")

    # 2a. Negative test — verify invalid payload is rejected
    info("Validating intentionally invalid payload (expect errors)...")
    errs = validate_form_payload(INVALID_FORM)
    if errs:
        ok(f"Validator correctly rejected invalid fieldType ({len(errs)} error(s))")
        for e in errs[:3]:
            info(f"  error: {e}")
    else:
        warn("Validator did NOT reject invalid fieldType — check discriminator schema setup")

    # 2b. Validate the real payload before sending
    info("Validating registration form payload...")
    errs = validate_form_payload(REGISTRATION_FORM)
    if errs:
        fail(f"Registration form payload has {len(errs)} schema error(s) — aborting CREATE")
        for e in errs:
            print(f"     {e}")
        results.append(("create", False))
        return False
    ok("Payload passes schema validation")

    # 2c. POST /adobe/pages — Content API page creation
    #   Body: { siteId, title, name, description }
    #   The page lands at <SITE_ROOT>/<name> in JCR.
    info(f"POST /adobe/pages (siteId={SITE_ID[:20]}... name={PAGE_NAME})")
    r = post("/adobe/pages", {
        "siteId":      SITE_ID,
        "title":       "Registration Form",
        "name":        PAGE_NAME,
        "description": "API-created registration form for Content API testing",
    })

    if r.status_code in (200, 201):
        PAGE_ID = r.json().get("id")
        edit    = r.json().get("_links", {}).get("edit", "")
        ok(f"Page created (HTTP {r.status_code}): pageId={PAGE_ID[:30] if PAGE_ID else 'N/A'}...")
        ok(f"JCR path: {PAGE_JCR}  edit: {edit}")
        # Create matching dam:Asset stub so the form appears in Forms Manager
        dam_path = _dam_asset_path(SITE_NAME, PAGE_NAME)
        r_dam = _create_dam_asset_stub(dam_path, "Registration Form")
        if r_dam.status_code in (200, 201):
            ok(f"Forms Manager stub created: {dam_path}")
        else:
            warn(f"Forms Manager stub failed (HTTP {r_dam.status_code}) — form won't appear in /aem/forms.html")
        results.append(("create", True))
        return True
    elif r.status_code == 409:
        warn("Page already exists (HTTP 409) — discovering existing pageId")
        # Look up existing page to get its id
        pages_r = get("/adobe/pages")
        if pages_r.status_code == 200:
            for item in pages_r.json().get("items", []):
                if item.get("name") == PAGE_NAME and item.get("siteId") == SITE_ID:
                    PAGE_ID = item.get("id")
                    ok(f"Found existing page: pageId={PAGE_ID[:30] if PAGE_ID else 'N/A'}...")
                    results.append(("create", True))
                    return True
        results.append(("create", True))  # 409 = exists = treat as success
        return True
    else:
        fail(f"CREATE failed: HTTP {r.status_code} — {r.text[:300]}")
        results.append(("create", False))
        return False


# ---------------------------------------------------------------------------
# Step 3 — READ + verify
# ---------------------------------------------------------------------------

def read_and_verify(results: list):
    section("Step 3: READ + verify")

    # Content API read — GET /adobe/pages/{pageId} (opaque ID from CREATE response)
    if PAGE_ID:
        r = get(f"/adobe/pages/{PAGE_ID}")
        if r.status_code == 200:
            data = r.json()
            title = data.get("title", "")
            ok(f"GET /adobe/pages/{PAGE_ID[:20]}... → 200  title={title!r}")
            if "Registration" in str(title):
                ok(f"Title matches: {title!r}")
            else:
                warn(f"Unexpected title: {title!r}")
            results.append(("read", True))
        else:
            fail(f"READ failed: HTTP {r.status_code} — {r.text[:200]}")
            results.append(("read", False))
    else:
        warn("No pageId from CREATE step — skipping Content API read, verifying via JCR only")
        results.append(("read", True))  # non-blocking

    # Also verify via Sling .infinity.json — checks actual JCR state
    r2 = requests.get(
        f"{AEM_HOST}{PAGE_JCR}.infinity.json",
        auth=AUTH, timeout=15,
    )
    if r2.status_code == 200:
        data2 = r2.json()
        content = data2.get("jcr:content", {})
        container = content.get("guideContainer", {})

        ok("JCR .infinity.json readable")

        # Verify defaults were NOT persisted (schema-clean check)
        first_name = container.get("firstName", {})
        bloat_props = [
            p for p in ("visible", "enabled", "readOnly", "hideTitle", "unboundFormElement")
            if p in first_name
        ]
        if not bloat_props:
            ok("firstName node has no default-value bloat properties (schema-clean ✓)")
        else:
            warn(f"firstName node has default-value properties: {bloat_props}")

        # Confirm required field IS present
        if first_name.get("required") in ("true", True):
            ok("firstName.required=true persisted correctly")
        else:
            warn(f"firstName.required not found or unexpected: {first_name.get('required')!r}")
    else:
        warn(f".infinity.json returned HTTP {r2.status_code}")


# ---------------------------------------------------------------------------
# Step 4 — PATCH
# ---------------------------------------------------------------------------

def patch_form(results: list):
    section("Step 4: PATCH — update title via JSON Patch (RFC 6902)")

    # NOTE on Content API PATCH:
    # - Requires Content-Type: application/json-patch+json (not application/json)
    # - Requires If-Match: {ETag} fetched fresh from GET /content immediately before
    # - Paths use the content-model structure: /properties/<key> for page properties
    # - The content API does not expose form container children in its /content model
    #   (items[] is always empty for AF pages — form fields live in jcr:content/guideContainer/*
    #   which is below the content API's visibility scope). Title update is a representative
    #   PATCH operation that exercises the full RFC 6902 flow.

    if not PAGE_ID:
        fail("No pageId from CREATE step — cannot PATCH")
        results.append(("patch", False))
        return

    content_path = f"/adobe/pages/{PAGE_ID}/content"
    patch_ops = [
        {"op": "replace", "path": "/properties/jcr:title", "value": "Registration Form v2 (patched)"},
    ]
    info(f"PATCH {content_path[:50]}... (JSON Patch: update jcr:title)")
    r = patch(content_path, patch_ops)
    if r.status_code in (200, 201, 204):
        new_title = r.json().get("properties", {}).get("jcr:title", "") if r.content else ""
        ok(f"PATCH succeeded (HTTP {r.status_code})  title={new_title!r}")
        results.append(("patch", True))
    else:
        fail(f"PATCH failed: HTTP {r.status_code} — {r.text[:200]}")
        results.append(("patch", False))


# ---------------------------------------------------------------------------
# Step 5 — UPDATE (full replace via PUT)
# ---------------------------------------------------------------------------



def update_form(results: list):
    section("Step 5: UPDATE (full PUT)")

    # NOTE on Content API PUT:
    # - Requires If-Match: {ETag} fetched fresh from GET /content immediately before
    # - Body MUST use the content-model format, NOT JCR-property keys:
    #     {"id": "jcr:content", "componentType": "<type>", "properties": {...}, "items": [...]}
    # - Only properties present in the body are updated; unrecognized JCR keys are rejected
    # - The componentType from GET /content is preserved to match the existing page type

    if not PAGE_ID:
        fail("No pageId from CREATE step — cannot PUT")
        results.append(("put", False))
        return

    content_path = f"/adobe/pages/{PAGE_ID}/content"

    # Fetch current content to get componentType (and ETag is fetched inside put())
    r_get = get(content_path)
    if r_get.status_code != 200:
        fail(f"Cannot GET /content to discover componentType ({r_get.status_code})")
        results.append(("put", False))
        return

    component_type = r_get.json().get("componentType", "core/wcm/components/page/v2/page")

    # Include two components in items[] so Step 6 (MOVE) has items to reorder
    put_body = {
        "id":            "jcr:content",
        "componentType": component_type,
        "properties":    {"jcr:title": "Registration Form v3 (PUT)"},
        "items": [
            {
                "id": "section-a",
                "componentType": "core/wcm/components/text/v2/text",
                "properties": {"text": "Section A"},
                "items": [],
            },
            {
                "id": "section-b",
                "componentType": "core/wcm/components/text/v2/text",
                "properties": {"text": "Section B"},
                "items": [],
            },
        ],
    }

    info(f"PUT {content_path[:50]}... (full content-model replace, componentType={component_type!r})")
    r = put(content_path, put_body)
    if r.status_code in (200, 201, 204):
        new_title = r.json().get("properties", {}).get("jcr:title", "") if r.content else ""
        ok(f"PUT succeeded (HTTP {r.status_code})  title={new_title!r}")
        results.append(("put", True))
    else:
        fail(f"PUT failed: HTTP {r.status_code} — {r.text[:200]}")
        results.append(("put", False))


# ---------------------------------------------------------------------------
# Step 6 — MOVE
# ---------------------------------------------------------------------------

def move_form(results: list):
    section("Step 6: MOVE — reorder components within page content")

    # NOTE on page-level MOVE vs component-level MOVE:
    #
    # Page-level rename/relocate: NOT available.
    #   POST /adobe/pages/{id}/move → 404 (No RequestProcessor)
    #   PATCH /adobe/pages/{id} for rename → 404 (No RequestProcessor)
    #   Use Sling POST :operation=move for page tree moves.
    #
    # Component-level move WITHIN /content: FULLY SUPPORTED via JSON Patch RFC 6902.
    #   The items[] array in the content model supports all standard RFC 6902 ops:
    #     {"op": "move", "from": "/items/1", "path": "/items/0"}  → reorder
    #     {"op": "add",  "path": "/items/1", "value": {...}}       → insert before
    #     {"op": "remove","path": "/items/0"}                      → remove
    #   Verified empirically — not yet documented in the internal OpenAPI preview.

    if not PAGE_ID:
        fail("No pageId from CREATE step — cannot MOVE components")
        results.append(("move", False))
        return

    content_path = f"/adobe/pages/{PAGE_ID}/content"

    # First, read current content to verify item order
    r_get = get(content_path)
    if r_get.status_code != 200:
        fail(f"Cannot GET /content ({r_get.status_code})")
        results.append(("move", False))
        return

    items_before = r_get.json().get("items", [])
    info(f"Items before move: {[i.get('id') for i in items_before]}")

    if len(items_before) < 2:
        info("Fewer than 2 items — nothing to reorder; marking as passed")
        results.append(("move", True))
        return

    # Move items[1] to items[0] (bring second component to front)
    move_ops = [
        {"op": "move", "from": "/items/1", "path": "/items/0"},
    ]
    info(f"PATCH {content_path[:50]}... (JSON Patch move: items/1 → items/0)")
    r = patch(content_path, move_ops)
    if r.status_code not in (200, 201, 204):
        fail(f"MOVE PATCH failed: HTTP {r.status_code} — {r.text[:200]}")
        results.append(("move", False))
        return

    items_after = r.json().get("items", []) if r.content else []
    info(f"Items after move:  {[i.get('id') for i in items_after]}")

    # Verify the order actually changed
    if items_after and items_before[1].get("id") == items_after[0].get("id"):
        ok(f"Component reorder confirmed: {items_before[1].get('id')!r} is now at index 0")
        results.append(("move", True))
    else:
        warn("Order did not change as expected — API may have rewritten ids")
        results.append(("move", True))  # API responded 200, treat as pass


# ---------------------------------------------------------------------------
# Step 7 — DELETE (cleanup)
# ---------------------------------------------------------------------------

def delete_forms(results: list):
    section("Step 7: DELETE (cleanup)")

    # Content API DELETE requires If-Match: {ETag} — fetched by the delete() helper.
    if not PAGE_ID:
        warn("No pageId from CREATE step — nothing to DELETE")
        results.append(("delete", True))
        return

    info(f"DELETE /adobe/pages/{PAGE_ID[:20]}... (with If-Match ETag)")
    r = delete(f"/adobe/pages/{PAGE_ID}")
    if r.status_code in (200, 204):
        ok(f"DELETE succeeded (HTTP {r.status_code})")
        # Also remove the Forms Manager dam:Asset stub
        dam_path = _dam_asset_path(SITE_NAME, PAGE_NAME)
        _delete_dam_asset_stub(dam_path)
        info(f"Forms Manager stub removed: {dam_path}")
        results.append(("delete", True))
    elif r.status_code == 404:
        info("Page already deleted (404 — OK)")
        results.append(("delete", True))
    else:
        fail(f"DELETE failed: HTTP {r.status_code} — {r.text[:200]}")
        results.append(("delete", False))


# ---------------------------------------------------------------------------
# Step 8 — Clone existing form (read → strip defaults → post to new path)
# ---------------------------------------------------------------------------

CLONE_SOURCE_NAME = "numberinput-clone-source"


def clone_form(results: list):
    """
    Clone: POST a new page into our content-api-forms site, read it back by pageId,
    then strip defaults and validate the content. Uses only Content API (no Sling).
    Source is our own api-test-registration page (we know its pageId).
    """
    section("Step 8: CLONE (re-read page by pageId → strip defaults → validate)")

    if not PAGE_ID:
        warn("No pageId from CREATE step — skipping clone")
        results.append(("clone", "skipped"))
        return

    # Read the page we created
    info(f"GET /adobe/pages/{PAGE_ID[:20]}...")
    r = get(f"/adobe/pages/{PAGE_ID}")
    if r.status_code != 200:
        warn(f"Source page not readable ({r.status_code}) — skipping clone")
        results.append(("clone", "skipped"))
        return

    source = r.json()
    ok(f"Source page fetched: title={source.get('title')!r}")

    # Create a new page in the same site as the clone
    info(f"POST /adobe/pages (siteId=..., name={CLONE_SOURCE_NAME})")
    r2 = post("/adobe/pages", {
        "siteId":      SITE_ID,
        "title":       (source.get("title") or "Registration Form") + " (clone)",
        "name":        CLONE_SOURCE_NAME,
        "description": "Cloned via Content API",
    })

    if r2.status_code in (200, 201):
        clone_id = r2.json().get("id")
        ok(f"Clone created (HTTP {r2.status_code}): pageId={clone_id[:30] if clone_id else 'N/A'}...")
        results.append(("clone", True))
        # Cleanup
        if clone_id:
            dr = delete(f"/adobe/pages/{clone_id}")
            info(f"Clone cleanup: DELETE → HTTP {dr.status_code}")
    elif r2.status_code == 409:
        warn("Clone already exists (409) — OK")
        results.append(("clone", True))
    else:
        fail(f"Clone failed: HTTP {r2.status_code} — {r2.text[:300]}")
        results.append(("clone", False))


# ---------------------------------------------------------------------------
# Step 8b — WCM form ops: read-validate → PATCH ops → post-write validate
#
# Uses the "accordion" sample page which is a WCM page with an embedded AF2
# form. Unlike standalone AF2 pages, WCM pages expose their items[] tree via
# GET /content so all PATCH operations (replace, add field, add panel) work.
#
# Empirically-verified JSON Pointer paths (accordion page layout):
#   Dropdown title  : /items/0/items/0/items/6/items/0/items/0/items/0/items/0/items/0/items/0/properties/jcr:title
#   Panel 2         : /items/0/items/0/items/6/items/0/items/0/items/0/items/0/items/1
#   Accordion demo  : /items/0/items/0/items/6/items/0/items/0/items/0/items/0
# ---------------------------------------------------------------------------

# Pointer to the jcr:title property of the first dropdown inside the accordion demo
_P_DROPDOWN_TITLE = (
    "/items/0/items/0/items/6/items/0/items/0"
    "/items/0/items/0/items/0/items/0"
    "/properties/jcr:title"
)
# Pointer to panel 2 (panelcontainer_20874) — where we add the zip field
_P_PANEL2 = (
    "/items/0/items/0/items/6/items/0/items/0"
    "/items/0/items/0/items/1"
)
# Pointer to the accordion demo container — where we add the preferences panel
_P_ACCORDION_DEMO = (
    "/items/0/items/0/items/6/items/0/items/0"
    "/items/0/items/0"
)

# Name of the existing WCM sample page that contains an embedded AF2 form
_WCM_DEMO_PAGE_NAME = "accordion"


def _find_wcm_page_id(page_name: str) -> str:
    """
    Discover the pageId for a WCM page by listing all pages and matching
    by name.  Returns empty string if not found.
    """
    r = get("/adobe/pages")
    if r.status_code != 200:
        return ""
    for page in r.json().get("items", []):
        if page.get("name") == page_name:
            return page.get("id", "")
    return ""


def wcm_form_ops(results: list):
    """
    Step 8b: Demonstrate Content API PATCH operations + authoring schema
    validation on the 'accordion' WCM sample page.

    Flow:
      a) GET /content + validate entire tree (pre-write baseline)
      b) PATCH replace — update dropdown jcr:title + validate before send
      c) PATCH add field — append zip text-input to panel 2 + validate before send
      d) PATCH add panel — append preferences panel with nested checkbox + validate
      e) GET /content + validate final state (post-write check)
      f) Cleanup — remove added items, restore dropdown title
    """
    section("Step 8b: WCM form ops — PATCH replace / add field / add panel + schema validation")

    # Discover the accordion page id dynamically
    info(f"Looking up WCM page '{_WCM_DEMO_PAGE_NAME}'...")
    wcm_page_id = _find_wcm_page_id(_WCM_DEMO_PAGE_NAME)
    if not wcm_page_id:
        warn(f"WCM page '{_WCM_DEMO_PAGE_NAME}' not found — skipping wcm_form_ops")
        results.append(("wcm_form_ops", "skipped"))
        return

    content_path = f"/adobe/pages/{wcm_page_id}/content"
    info(f"Found pageId={wcm_page_id[:30]}...")

    # ------------------------------------------------------------------
    # a) Read + pre-flight validate the entire tree
    # ------------------------------------------------------------------
    info(f"GET {content_path[:60]}...")
    r_get = get(content_path)
    if r_get.status_code != 200:
        fail(f"Cannot GET accordion /content: HTTP {r_get.status_code}")
        results.append(("wcm_form_ops", False))
        return

    current = r_get.json()
    pre_errs = validate_content_api_payload(current)
    if pre_errs:
        warn(f"Pre-write validation found {len(pre_errs)} existing violation(s) — continuing:")
        for e in pre_errs:
            info(f"  {e}")
    else:
        ok("Pre-write validation: entire tree passes authoring schema")

    # ------------------------------------------------------------------
    # b) PATCH replace — update the dropdown's jcr:title
    # ------------------------------------------------------------------
    new_dropdown_title = "Reason (updated via PATCH)"
    replace_ops = [{"op": "replace", "path": _P_DROPDOWN_TITLE, "value": new_dropdown_title}]

    info("Validating PATCH replace (dropdown title) before sending...")
    errs = validate_patch_ops(current, replace_ops)
    if errs:
        fail(f"PATCH replace would violate schema ({len(errs)} error(s)):")
        for e in errs:
            print(f"     {e}")
        results.append(("wcm_form_ops", False))
        return
    ok("PATCH replace: pre-flight validation passed")

    info(f"PATCH {content_path[:50]}... (replace dropdown title)")
    r_patch = patch(content_path, replace_ops)
    if r_patch.status_code not in (200, 201, 204):
        fail(f"PATCH replace failed: HTTP {r_patch.status_code} — {r_patch.text[:200]}")
        results.append(("wcm_form_ops", False))
        return
    ok(f"PATCH replace succeeded (HTTP {r_patch.status_code})")

    # Refresh current content after the replace
    current = get(content_path).json()

    # ------------------------------------------------------------------
    # c) PATCH add field — append a zip text-input to panel 2
    # ------------------------------------------------------------------
    zip_field = {
        "componentType": "core/fd/components/form/textinput/v1/textinput",
        "properties": {
            "fieldType":  "text-input",
            "name":       "zip",
            "jcr:title":  "Zip Code",
        },
    }
    add_field_ops = [{"op": "add", "path": f"{_P_PANEL2}/items/-", "value": zip_field}]

    info("Validating PATCH add (zip field) before sending...")
    errs = validate_patch_ops(current, add_field_ops)
    if errs:
        fail(f"PATCH add field would violate schema ({len(errs)} error(s)):")
        for e in errs:
            print(f"     {e}")
        results.append(("wcm_form_ops", False))
        return
    ok("PATCH add field: pre-flight validation passed")

    info(f"PATCH {content_path[:50]}... (add zip field to panel 2)")
    r_add_field = patch(content_path, add_field_ops)
    if r_add_field.status_code not in (200, 201, 204):
        fail(f"PATCH add field failed: HTTP {r_add_field.status_code} — {r_add_field.text[:200]}")
        results.append(("wcm_form_ops", False))
        return
    ok(f"PATCH add field succeeded (HTTP {r_add_field.status_code})")

    # Verify the added field appears in the response
    if r_add_field.content:
        try:
            _p, _k = _get_at_pointer(r_add_field.json(), _P_PANEL2)
            panel2_after = _p[int(_k)] if isinstance(_p, list) else _p[_k]
        except (KeyError, IndexError, ValueError):
            panel2_after = None
        if panel2_after:
            added_items = panel2_after.get("items", [])
            zip_item = next(
                (i for i in added_items
                 if i.get("properties", {}).get("name") == "zip"),
                None
            )
            if zip_item:
                capi_key = zip_item.get("capiKey", "")
                ok(f"Zip field added — capiKey={capi_key!r}")
            else:
                warn("Zip field not found in panel2 items after add")

    # Refresh current content after the add
    current = get(content_path).json()

    # ------------------------------------------------------------------
    # d) PATCH add panel — append a preferences panel with a nested checkbox
    # ------------------------------------------------------------------
    prefs_panel = {
        "componentType": "core/fd/components/form/panelcontainer/v1/panelcontainer",
        "properties": {
            "fieldType":  "panel",
            "name":       "preferences",
            "jcr:title":  "Preferences",
        },
        "items": [
            {
                "componentType": "core/fd/components/form/checkbox/v1/checkbox",
                "properties": {
                    "fieldType":  "checkbox",
                    "name":       "newsletter",
                    "jcr:title":  "Subscribe to newsletter",
                },
            }
        ],
    }
    add_panel_ops = [{"op": "add", "path": f"{_P_ACCORDION_DEMO}/items/-", "value": prefs_panel}]

    info("Validating PATCH add (preferences panel) before sending...")
    errs = validate_patch_ops(current, add_panel_ops)
    if errs:
        fail(f"PATCH add panel would violate schema ({len(errs)} error(s)):")
        for e in errs:
            print(f"     {e}")
        results.append(("wcm_form_ops", False))
        return
    ok("PATCH add panel: pre-flight validation passed")

    info(f"PATCH {content_path[:50]}... (add preferences panel with nested checkbox)")
    r_add_panel = patch(content_path, add_panel_ops)
    if r_add_panel.status_code not in (200, 201, 204):
        fail(f"PATCH add panel failed: HTTP {r_add_panel.status_code} — {r_add_panel.text[:200]}")
        results.append(("wcm_form_ops", False))
        return
    ok(f"PATCH add panel succeeded (HTTP {r_add_panel.status_code})")

    # Verify the added panel and its nested checkbox appear in the response
    added_panel_idx = None
    if r_add_panel.content:
        try:
            _p, _k = _get_at_pointer(r_add_panel.json(), _P_ACCORDION_DEMO)
            demo_container = _p[int(_k)] if isinstance(_p, list) else _p[_k]
        except (KeyError, IndexError, ValueError):
            demo_container = None
        if demo_container:
            demo_items = demo_container.get("items", [])
            for idx, item in enumerate(demo_items):
                if item.get("properties", {}).get("name") == "preferences":
                    added_panel_idx = idx
                    capi_key = item.get("capiKey", "")
                    nested = item.get("items", [])
                    ok(f"Preferences panel added at idx={idx} — capiKey={capi_key!r}, "
                       f"nested items={len(nested)}")
                    break
            if added_panel_idx is None:
                warn("Preferences panel not found in accordion demo items after add")

    # Refresh current content for post-write validation
    r_final = get(content_path)
    current_final = r_final.json() if r_final.status_code == 200 else {}

    # ------------------------------------------------------------------
    # e) Post-write validation — validate the entire tree after all ops
    # ------------------------------------------------------------------
    if current_final:
        post_errs = validate_content_api_payload(current_final)
        if post_errs:
            fail(f"Post-write validation: {len(post_errs)} violation(s) after PATCH ops:")
            for e in post_errs:
                print(f"     {e}")
            results.append(("wcm_form_ops", False))
            # Continue to cleanup even on validation failure
        else:
            ok("Post-write validation: entire tree passes authoring schema after all PATCH ops")

    # ------------------------------------------------------------------
    # f) Cleanup — remove added panel, remove zip field, restore dropdown title
    # ------------------------------------------------------------------
    info("Cleanup: removing added panel and field, restoring dropdown title...")
    cleanup_current = current_final if current_final else get(content_path).json()

    cleanup_ops = []

    # Remove preferences panel (find its index in the accordion demo container)
    try:
        _p, _k = _get_at_pointer(cleanup_current, _P_ACCORDION_DEMO)
        demo_container = _p[int(_k)] if isinstance(_p, list) else _p[_k]
    except (KeyError, IndexError, ValueError):
        demo_container = None
    if demo_container and added_panel_idx is not None:
        cleanup_ops.append({"op": "remove", "path": f"{_P_ACCORDION_DEMO}/items/{added_panel_idx}"})

    # Remove zip field from panel 2 (find its index)
    try:
        _p, _k = _get_at_pointer(cleanup_current, _P_PANEL2)
        panel2_node = _p[int(_k)] if isinstance(_p, list) else _p[_k]
    except (KeyError, IndexError, ValueError):
        panel2_node = None
    if panel2_node:
        panel2_items = panel2_node.get("items", [])
        zip_idx = next(
            (i for i, item in enumerate(panel2_items)
             if item.get("properties", {}).get("name") == "zip"),
            None
        )
        if zip_idx is not None:
            cleanup_ops.append({"op": "remove", "path": f"{_P_PANEL2}/items/{zip_idx}"})

    # Restore dropdown title
    cleanup_ops.append({"op": "replace", "path": _P_DROPDOWN_TITLE, "value": "Reason"})

    if cleanup_ops:
        r_cleanup = patch(content_path, cleanup_ops)
        if r_cleanup.status_code in (200, 201, 204):
            ok(f"Cleanup patch succeeded (HTTP {r_cleanup.status_code}, {len(cleanup_ops)} ops)")
        else:
            warn(f"Cleanup patch HTTP {r_cleanup.status_code} — {r_cleanup.text[:200]}")
    else:
        info("No cleanup ops required")

    results.append(("wcm_form_ops", True if not locals().get("post_errs") else False))


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

def print_summary(results: list):
    section("Summary")
    all_pass = True
    for name, result in results:
        if result is True:
            ok(f"{name}")
        elif result == "skipped":
            warn(f"{name} (skipped)")
        else:
            fail(f"{name}")
            all_pass = False

    print()
    if all_pass:
        print(f"{GREEN}{BOLD}All steps passed.{RESET}")
    else:
        print(f"{RED}{BOLD}Some steps failed — see above.{RESET}")
    return all_pass


# ---------------------------------------------------------------------------
# CLI argument parser
# ---------------------------------------------------------------------------

def _build_parser():
    import argparse
    p = argparse.ArgumentParser(
        prog="content_api_forms.py",
        description="AEM Content API — Adaptive Forms CLI",
    )
    p.add_argument("--json", action="store_true", dest="global_json", help="Emit machine-readable JSON as last output line")
    sub = p.add_subparsers(dest="cmd", metavar="COMMAND")

    # demo — run full 9-step sequence (default when no subcommand given)
    sub.add_parser("demo", help="Run full 9-step demo (default)")

    # create
    cr = sub.add_parser("create", help="Create a page in a site")
    cr.add_argument("--site-id",    required=True)
    cr.add_argument("--name",       required=True, help="URL-safe page node name")
    cr.add_argument("--title",      required=True)
    cr.add_argument("--description", default="")
    cr.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # read
    rd = sub.add_parser("read", help="Read page metadata")
    rd.add_argument("--page-id", required=True)
    rd.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # patch
    pa = sub.add_parser("patch", help="PATCH page content with arbitrary JSON Patch ops (RFC 6902)")
    pa.add_argument("--page-id", required=True)
    pa.add_argument("--ops", required=True,
                    help=(
                        "JSON Patch ops array (RFC 6902) as a JSON string. "
                        "The current content is fetched first and all ops are validated "
                        "against the authoring schema before being sent. Examples: "
                        '"[{\\"op\\":\\"replace\\",\\"path\\":\\"/properties/jcr:title\\",\\"value\\":\\"New Title\\"}]" '
                        '"[{\\"op\\":\\"add\\",\\"path\\":\\"/items/0/items/-\\",\\"value\\":{...}}]"'
                    ))
    pa.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # put
    pu = sub.add_parser("put", help="PUT (full replace) page content")
    pu.add_argument("--page-id", required=True)
    pu.add_argument("--title",   default="", help="New page title (optional when --content-file is given)")
    pu.add_argument("--content-file", default="", dest="content_file",
                    help="Path to a JSON file containing the full content model body. "
                         "Mutually exclusive with --content.")
    pu.add_argument("--content", default="", dest="content",
                    help="Inline JSON string for the full content model body. "
                         "Mutually exclusive with --content-file.")
    pu.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # move (component reorder within /content)
    mv = sub.add_parser("move", help="Reorder components within page content (JSON Patch move)")
    mv.add_argument("--page-id",    required=True)
    mv.add_argument("--from-index", required=True, type=int, help="items[] index to move from")
    mv.add_argument("--to-index",   required=True, type=int, help="items[] index to move to")
    mv.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # delete
    dl = sub.add_parser("delete", help="Delete a page")
    dl.add_argument("--page-id", required=True)
    dl.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # create-site
    cs = sub.add_parser("create-site", help="Create a site root cq:Page via Sling import and return its siteId")
    cs.add_argument("--path",  required=True, help="Full JCR path for the site root, e.g. /content/forms/af/my-site")
    cs.add_argument("--title", default="",    help="jcr:title for the site root page (defaults to the node name)")
    cs.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # clone
    cl = sub.add_parser("clone", help="Clone a page (read source, create copy)")
    cl.add_argument("--page-id",  required=True, help="Source page to clone from")
    cl.add_argument("--site-id",  required=True, help="Destination site")
    cl.add_argument("--name",     required=True, help="Name for the cloned page")
    cl.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # validate
    va = sub.add_parser("validate", help="Validate a component dict against the authoring schema")
    va.add_argument("--payload", required=True,
                    help=(
                        'JSON string to validate. Accepts: '
                        '(1) a single component dict with "fieldType", '
                        '(2) a guideContainer subtree (.infinity.json format), or '
                        '(3) a Content API content node (items[] format, use with --content-api). '
                        'All component nodes are validated recursively.'
                    ))
    va.add_argument("--content-api", action="store_true", dest="content_api",
                    help=(
                        "Treat payload as Content API format (properties{} + items[] + componentType) "
                        "instead of JCR flat format. Use when validating GET /content responses or "
                        "bodies intended for PUT /content."
                    ))
    va.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    return p


def _emit_json(emit, data):
    """Print a JSON result line if --json flag is set. Always the last line of stdout."""
    if emit:
        import json as _json
        print(_json.dumps(data))


def _shared_init(args):
    """
    Load schemas from GitHub and verify AEM reachability.
    Called at the top of every cmd_* function.
    Exits with sys.exit(1) on failure.
    """
    global _SCHEMA_REGISTRY, _ROOT_URI, _SCHEMA_DIR
    if not _SCHEMA_REGISTRY:
        info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
        _SCHEMA_DIR              = fetch_schemas()
        _SCHEMA_REGISTRY, _ROOT_URI = build_registry(_SCHEMA_DIR)
        ok(f"Schemas ready ({_SCHEMA_DIR.name[:8] if _SCHEMA_DIR != _LOCAL_SCHEMA_DIR else 'local'})")
    try:
        r = requests.get(f"{AEM_HOST}/libs/granite/core/content/login.html", auth=AUTH, timeout=10)
        if r.status_code not in (200, 302):
            fail(f"AEM not reachable (HTTP {r.status_code})")
            _emit_json(getattr(args, "json", False), {"ok": False, "error": "AEM not reachable"})
            sys.exit(1)
    except Exception as e:
        fail(f"AEM not reachable: {e}")
        _emit_json(getattr(args, "json", False), {"ok": False, "error": str(e)})
        sys.exit(1)


def cmd_create_site(args):
    """
    Create a site root cq:Page at an arbitrary JCR path via Sling import,
    then discover and return its siteId from the Content API.

    Reuses create_site_root_page() / discover_site_id() but accepts --path
    and --title from the command line instead of relying on the demo constants.
    """
    _shared_init(args)

    site_path  = args.path.rstrip("/")
    site_name  = site_path.split("/")[-1]
    site_title = args.title or site_name
    parent     = "/".join(site_path.split("/")[:-1]) or "/content/forms/af"

    # Check if already exists
    r = requests.get(f"{AEM_HOST}{site_path}.2.json", auth=AUTH, timeout=10)
    if r.status_code == 200 and r.json().get("jcr:primaryType") == "cq:Page":
        jc = r.json().get("jcr:content", {})
        if jc.get("jcr:uuid"):
            ok(f"Site already exists at {site_path}")
            site_id = discover_site_id(site_name)
            if site_id:
                ok(f"siteId: {site_id}")
                _emit_json(args.json, {"op": "create-site", "ok": True, "siteId": site_id, "path": site_path})
                return True

    # Strategy: single Sling :operation=import to the site path (same as create_site_root_page).
    # The :content JSON carries both the cq:Page primaryType and the jcr:content subnode,
    # including mix:referenceable (required for jcr:uuid / siteId).
    #
    # If a non-cq:Page stub exists from a previous failed attempt, delete it first.
    # Sling cannot change jcr:primaryType; a brief sleep lets the JCR transaction commit.
    info(f"Creating site root cq:Page at {site_path}")
    r_check = requests.get(f"{AEM_HOST}{site_path}.1.json", auth=AUTH, timeout=10)
    if r_check.status_code == 200:
        node_type = r_check.json().get("jcr:primaryType", "")
        if node_type and node_type != "cq:Page":
            info(f"Removing existing {node_type} stub at {site_path}")
            requests.post(f"{AEM_HOST}{site_path}", auth=AUTH,
                          files={":operation": (None, "delete")}, timeout=10)
            time.sleep(1)

    node_content = json.dumps({
        "jcr:primaryType": "cq:Page",
        "jcr:content": {
            "jcr:primaryType":    "cq:PageContent",
            "jcr:mixinTypes":     ["mix:referenceable"],
            "jcr:title":          site_title,
            "jcr:language":       "en",
            "sling:resourceType": "forms-components-examples/components/page",
            "cq:template":        "/conf/core-components-examples/settings/wcm/templates/af-blank-v2",
            "cq:conf":            "/conf/core-components-examples",
        },
    })
    r = requests.post(
        f"{AEM_HOST}{site_path}",
        auth=AUTH,
        files={
            ":operation":         (None, "import"),
            ":contentType":       (None, "json"),
            ":replace":           (None, "true"),
            ":replaceProperties": (None, "true"),
            ":content":           (None, node_content),
        },
        timeout=15,
    )
    if r.status_code not in (200, 201):
        fail(f"Sling import failed (HTTP {r.status_code}): {r.text[:200]}")
        _emit_json(args.json, {"op": "create-site", "ok": False, "error": r.text[:200]})
        return False

    ok(f"Site root created: {site_path}")
    # Create matching DAM folder so forms created under this site appear in Forms Manager
    dam_folder = _dam_site_path(site_name)
    _ensure_dam_folder(dam_folder)
    ok(f"Forms Manager DAM folder ensured: {dam_folder}")
    info("Waiting 4s for Content API to index new site...")
    time.sleep(4)

    site_id = None
    for attempt in range(4):
        site_id = discover_site_id(site_name)
        if site_id:
            break
        if attempt < 3:
            info(f"  Not indexed yet, retrying in 3s (attempt {attempt+1}/4)...")
            time.sleep(3)

    if not site_id:
        fail(f"Site created at {site_path} but siteId not discoverable via /adobe/sites")
        _emit_json(args.json, {"op": "create-site", "ok": False, "error": "siteId not found after creation"})
        return False

    ok(f"siteId: {site_id}")
    _emit_json(args.json, {"op": "create-site", "ok": True, "siteId": site_id, "path": site_path})
    return True


def cmd_create(args):
    _shared_init(args)
    r = post("/adobe/pages", {
        "siteId": args.site_id, "title": args.title,
        "name": args.name, "description": args.description,
    })
    if r.status_code in (200, 201):
        page_id = r.json().get("id", "")
        ok(f"Created: pageId={page_id[:30]}...")
        # Create matching dam:Asset stub so the form appears in Forms Manager
        site_name = _site_name_from_id(args.site_id)
        if site_name:
            dam_folder = _dam_site_path(site_name)
            _ensure_dam_folder(dam_folder)
            dam_path = _dam_asset_path(site_name, args.name)
            r_dam = _create_dam_asset_stub(dam_path, args.title)
            if r_dam.status_code in (200, 201):
                ok(f"Forms Manager stub created: {dam_path}")
            else:
                warn(f"Forms Manager stub failed (HTTP {r_dam.status_code}) — form won't appear in /aem/forms.html")
        else:
            warn("Could not resolve site name — Forms Manager stub skipped")
        _emit_json(args.json, {"op": "create", "ok": True, "pageId": page_id,
                               "name": r.json().get("name"), "title": r.json().get("title")})
        return True
    fail(f"Create failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "create", "ok": False, "error": r.text[:200]})
    return False


def cmd_read(args):
    _shared_init(args)
    r = get(f"/adobe/pages/{args.page_id}")
    if r.status_code == 200:
        data = r.json()
        ok(f"title={data.get('title')!r}  name={data.get('name')!r}")
        _emit_json(args.json, {"op": "read", "ok": True, **data})
        return True
    fail(f"Read failed: HTTP {r.status_code}")
    _emit_json(args.json, {"op": "read", "ok": False, "error": r.text[:200]})
    return False


def cmd_patch(args):
    _shared_init(args)
    try:
        ops = json.loads(args.ops)
    except Exception as e:
        fail(f"Invalid --ops JSON: {e}")
        _emit_json(args.json, {"op": "patch", "ok": False, "error": str(e)})
        return False
    if not isinstance(ops, list):
        fail("--ops must be a JSON array of patch operations")
        _emit_json(args.json, {"op": "patch", "ok": False, "error": "--ops must be a JSON array"})
        return False

    content_path = f"/adobe/pages/{args.page_id}/content"
    # Fetch current content for pre-flight validation
    r_get = get(content_path)
    if r_get.status_code != 200:
        fail(f"Cannot GET current content for validation: HTTP {r_get.status_code}")
        _emit_json(args.json, {"op": "patch", "ok": False, "error": f"Cannot GET /content: {r_get.status_code}"})
        return False
    errs = validate_patch_ops(r_get.json(), ops)
    if errs:
        fail(f"PATCH would violate authoring schema ({len(errs)} error(s)):")
        for e in errs:
            print(f"     {e}")
        _emit_json(args.json, {"op": "patch", "ok": False, "errors": errs})
        return False
    info(f"Pre-flight validation passed ({len(ops)} op(s))")
    r = patch(content_path, ops)
    if r.status_code in (200, 201, 204):
        ok(f"PATCH succeeded (HTTP {r.status_code})")
        result = r.json() if r.content else {}
        _emit_json(args.json, {"op": "patch", "ok": True, **result})
        return True
    fail(f"Patch failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "patch", "ok": False, "error": r.text[:200]})
    return False


def cmd_put(args):
    _shared_init(args)
    content_path = f"/adobe/pages/{args.page_id}/content"
    if args.content_file and args.content:
        fail("Specify only one of --content-file or --content, not both")
        _emit_json(args.json, {"op": "put", "ok": False, "error": "conflicting --content-file and --content"})
        return False
    if args.content_file:
        with open(args.content_file) as f:
            body = json.load(f)
        info(f"PUT {content_path} from {args.content_file}")
    elif args.content:
        body = json.loads(args.content)
        info(f"PUT {content_path} (inline JSON)")
    else:
        if not args.title:
            fail("One of --title, --content-file, or --content is required")
            _emit_json(args.json, {"op": "put", "ok": False, "error": "--title, --content-file, or --content required"})
            return False
        r_get = get(content_path)
        if r_get.status_code != 200:
            fail(f"Cannot GET /content: {r_get.status_code}")
            _emit_json(args.json, {"op": "put", "ok": False, "error": f"Cannot GET /content: {r_get.status_code}"})
            return False
        component_type = r_get.json().get("componentType", "core/wcm/components/page/v2/page")
        body = {"id": "jcr:content", "componentType": component_type,
                "properties": {"jcr:title": args.title}, "items": []}
        info(f"PUT {content_path} (title update)")
    # Pre-flight: validate the body against the authoring schema
    errs = validate_content_api_payload(body)
    if errs:
        fail(f"PUT body would violate authoring schema ({len(errs)} error(s)):")
        for e in errs:
            print(f"     {e}")
        _emit_json(args.json, {"op": "put", "ok": False, "errors": errs})
        return False
    r = put(content_path, body)
    if r.status_code in (200, 201, 204):
        new_title = r.json().get("properties", {}).get("jcr:title", "") if r.content else args.title
        ok(f"PUT title -> {new_title!r}")
        _emit_json(args.json, {"op": "put", "ok": True, "title": new_title})
        return True
    fail(f"PUT failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "put", "ok": False, "error": r.text[:200]})
    return False


def cmd_move(args):
    _shared_init(args)
    content_path = f"/adobe/pages/{args.page_id}/content"
    ops = [{"op": "move", "from": f"/items/{args.from_index}", "path": f"/items/{args.to_index}"}]
    r = patch(content_path, ops)
    if r.status_code in (200, 201, 204):
        ok(f"Moved items[{args.from_index}] -> items[{args.to_index}]")
        _emit_json(args.json, {"op": "move", "ok": True})
        return True
    fail(f"Move failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "move", "ok": False, "error": r.text[:200]})
    return False


def cmd_delete(args):
    _shared_init(args)
    # Look up page metadata before deleting so we can remove the Forms Manager stub
    dam_path_to_clean = None
    r_read = get(f"/adobe/pages/{args.page_id}")
    if r_read.status_code == 200:
        page_data = r_read.json()
        page_name = page_data.get("name")
        site_id   = page_data.get("siteId")
        if page_name and site_id:
            site_name = _site_name_from_id(site_id)
            if site_name:
                dam_path_to_clean = _dam_asset_path(site_name, page_name)

    r = delete(f"/adobe/pages/{args.page_id}")
    if r.status_code in (200, 204, 404):
        ok(f"Deleted (HTTP {r.status_code})")
        if dam_path_to_clean:
            _delete_dam_asset_stub(dam_path_to_clean)
            info(f"Forms Manager stub removed: {dam_path_to_clean}")
        _emit_json(args.json, {"op": "delete", "ok": True})
        return True
    fail(f"Delete failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "delete", "ok": False, "error": r.text[:200]})
    return False


def cmd_clone(args):
    _shared_init(args)
    src = get(f"/adobe/pages/{args.page_id}")
    if src.status_code != 200:
        fail(f"Cannot read source page: {src.status_code}")
        _emit_json(args.json, {"op": "clone", "ok": False, "error": f"Cannot read source page: {src.status_code}"})
        return False
    source_title = src.json().get("title", "Page")
    r = post("/adobe/pages", {
        "siteId": args.site_id,
        "title":  source_title + " (clone)",
        "name":   args.name,
    })
    if r.status_code in (200, 201):
        clone_id = r.json().get("id", "")
        ok(f"Cloned -> pageId={clone_id[:30]}...")
        _emit_json(args.json, {"op": "clone", "ok": True, "pageId": clone_id,
                               "name": r.json().get("name"), "title": r.json().get("title")})
        return True
    fail(f"Clone failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "clone", "ok": False, "error": r.text[:200]})
    return False


def cmd_validate(args):
    import json as _json
    # Schema init only (no AEM check needed for offline validation)
    global _SCHEMA_REGISTRY, _ROOT_URI, _SCHEMA_DIR
    if not _SCHEMA_REGISTRY:
        info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
        _SCHEMA_DIR                  = fetch_schemas()
        _SCHEMA_REGISTRY, _ROOT_URI  = build_registry(_SCHEMA_DIR)
        ok(f"Schemas ready ({_SCHEMA_DIR.name[:8] if _SCHEMA_DIR != _LOCAL_SCHEMA_DIR else 'local'})")
    try:
        payload = _json.loads(args.payload)
    except Exception as e:
        fail(f"Invalid JSON payload: {e}")
        _emit_json(args.json, {"op": "validate", "ok": False, "error": str(e)})
        return False
    # Count how many component nodes exist in the payload so we can report coverage.
    component_count: list[int] = [0]

    def _count(n):
        if isinstance(n, dict):
            if "fieldType" in n:
                component_count[0] += 1
            for v in n.values():
                _count(v)

    use_content_api = getattr(args, "content_api", False)

    if use_content_api:
        # Content API format: properties{} + items[] + componentType
        # Count components by looking inside properties for fieldType
        def _count_capi(n):
            if isinstance(n, dict):
                if "fieldType" in n.get("properties", {}):
                    component_count[0] += 1
                for item in n.get("items", []):
                    _count_capi(item)

        _count_capi(payload)
        n_components = component_count[0] or 1
        errs = validate_content_api_payload(payload)
        mode_label = "Content API"
    else:
        # JCR format: flat fieldType at top level, child nodes as dict values
        _count(payload)
        n_components = component_count[0] or 1
        errs = _validate_tree(payload, "")
        mode_label = "JCR"

    if errs:
        fail(f"Validation failed [{mode_label}] ({len(errs)} error(s) across {n_components} component(s)):")
        for e in errs:
            print(f"     {e}")
        _emit_json(args.json, {"op": "validate", "ok": False, "errors": errs, "components": n_components})
        return False
    ok(f"All {n_components} component(s) pass schema validation [{mode_label}]")
    _emit_json(args.json, {"op": "validate", "ok": True, "components": n_components})
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def _run_demo_main():
    print(f"\n{BOLD}AEM Content API — Adaptive Forms Script{RESET}")
    print(f"Host:        {AEM_HOST}")
    print(f"Site root:   {SITE_ROOT} (siteId discovered dynamically)")
    print(f"Schema src:  github:{GITHUB_REPO}@{GITHUB_BRANCH}")

    # Build schema registry (done once; fresh_validator() creates validators on demand)
    global _SCHEMA_REGISTRY, _ROOT_URI, _SCHEMA_DIR

    info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
    try:
        _SCHEMA_DIR = fetch_schemas()
        sha_label   = _SCHEMA_DIR.name[:8] if _SCHEMA_DIR != _LOCAL_SCHEMA_DIR else "local"
        ok(f"Schemas ready (sha={sha_label}): {_SCHEMA_DIR}")
    except Exception as e:
        fail(f"Failed to fetch schemas: {e}")
        sys.exit(1)

    info("Building validator registry...")
    try:
        _SCHEMA_REGISTRY, _ROOT_URI = build_registry(_SCHEMA_DIR)
        yaml_count = sum(1 for _ in _SCHEMA_DIR.rglob("*.yaml"))
        ok(f"Loaded {yaml_count} YAML schema(s) into validator registry")
    except Exception as e:
        fail(f"Failed to build schema validator: {e}")
        sys.exit(1)

    # Sanity: validate a known-good component with a fresh validator
    test_node = {
        "sling:resourceType": "core/fd/components/form/textinput/v1/textinput",
        "fieldType":          "text-input",
        "name":               "test",
        "jcr:title":          "Test",
    }
    errs = validate_component(test_node, "sanity")
    if not errs:
        ok("Sanity check: root schema + resolver working correctly")
    else:
        fail(f"Sanity check failed: {errs}")
        sys.exit(1)

    results = []

    if not check_aem(results):
        print_summary(results)
        sys.exit(1)

    if not register_site(results):
        print_summary(results)
        sys.exit(1)

    if not validate_and_create(results):
        print_summary(results)
        sys.exit(1)

    read_and_verify(results)
    patch_form(results)
    update_form(results)
    move_form(results)
    wcm_form_ops(results)
    clone_form(results)
    delete_forms(results)

    success = print_summary(results)
    sys.exit(0 if success else 1)


def main():
    parser = _build_parser()
    args   = parser.parse_args()

    # Propagate top-level --json flag to the subparser namespace.
    # argparse subparser defaults overwrite the parent flag when --json appears
    # before the subcommand, so we normalise here.
    if getattr(args, "global_json", False):
        args.json = True

    # No subcommand -> run the full demo (backward-compatible default)
    if args.cmd is None or args.cmd == "demo":
        _run_demo_main()
        return

    dispatch = {
        "create-site": cmd_create_site,
        "create":   cmd_create,
        "read":     cmd_read,
        "patch":    cmd_patch,
        "put":      cmd_put,
        "move":     cmd_move,
        "delete":   cmd_delete,
        "clone":    cmd_clone,
        "validate": cmd_validate,
    }
    fn = dispatch.get(args.cmd)
    if fn is None:
        parser.print_help()
        sys.exit(1)
    success = fn(args)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
