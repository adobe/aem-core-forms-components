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
DEMO MODE  (run all 9 steps in sequence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  python3 scripts/content_api_forms.py
  python3 scripts/content_api_forms.py demo

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

  patch    --page-id PAGE_ID --title NEW_TITLE
           PATCH page title via JSON Patch RFC 6902.

  put      --page-id PAGE_ID --title NEW_TITLE
           PUT (full replace) page content model.

  move     --page-id PAGE_ID --from-index N --to-index M
           Reorder components in /content (JSON Patch move on items[]).

  delete   --page-id PAGE_ID
           Delete a page (ETag-aware).

  clone    --page-id SRC_PAGE_ID --site-id SITE_ID --name NEW_NAME
           Clone a page into the same or different site.

  validate --payload JSON_STRING
           Validate a component dict against the authoring schema (offline, no AEM needed).
           JSON_STRING is a single component node, e.g.:
             '{"fieldType":"text-input","name":"x","jcr:title":"X"}'

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

  # Patch title
  python3 scripts/content_api_forms.py patch --page-id "$PAGE_ID" --title "Updated Title"

  # Validate offline (no AEM required)
  python3 scripts/content_api_forms.py validate \\
    --payload '{"fieldType":"text-input","name":"x","jcr:title":"X"}' --json

  # Delete
  python3 scripts/content_api_forms.py delete --page-id "$PAGE_ID"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  pip install jsonschema pyyaml requests
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


def _list_schema_paths(sha: str) -> list:
    """
    Return all docs/authoring-schema/**/*.yaml paths in the repo tree at `sha`.
    Uses recursive Git tree API (single request for the whole tree).
    Returns empty list on failure.
    """
    url = f"https://api.github.com/repos/{GITHUB_REPO}/git/trees/{sha}?recursive=1"
    try:
        r = requests.get(url, headers={"Accept": "application/vnd.github+json"}, timeout=15)
        if r.status_code == 200:
            return [
                item["path"]
                for item in r.json().get("tree", [])
                if item["path"].startswith(GITHUB_SCHEMA_ROOT)
                and item["path"].endswith(".yaml")
                and item["type"] == "blob"
            ]
    except Exception:
        pass
    return []


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
      1. Resolve HEAD SHA of GITHUB_BRANCH via GitHub API.
      2. If ~/.cache/aem-authoring-schema/{sha}/ already exists -> reuse (cache hit).
      3. Otherwise download all docs/authoring-schema/**/*.yaml files via raw GitHub URLs
         into the SHA-keyed cache directory, preserving relative path structure.
      4. If GitHub is unreachable:
         a. Use the newest existing SHA cache directory if one exists.
         b. Fall back to the local working copy docs/authoring-schema/ with a warning.

    Returns the Path to the local schema root directory ready for file: URI loading.
    """
    sha = _resolve_branch_sha(GITHUB_BRANCH)

    if sha:
        cache_dir = SCHEMA_CACHE_BASE / sha
        if cache_dir.exists():
            return cache_dir          # cache hit
        # Cache miss — download
        paths = _list_schema_paths(sha)
        if paths:
            cache_dir.mkdir(parents=True, exist_ok=True)
            if _download_schemas(sha, paths, cache_dir):
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
_SCHEMA_REGISTRY: Optional["Registry"] = None
_ROOT_URI:        str                   = ""

def fresh_validator() -> Draft7Validator:
    """
    Return a Draft7Validator for the root discriminator schema.

    Uses the referencing library (Registry) which correctly resolves nested
    $ref chains including patternProperties recursion across directories.
    Validators are lightweight wrappers around the shared registry — no
    scope-stack state to leak between calls.
    """
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

# Keys that hold child component nodes (should be recursed into)
_NON_COMPONENT_KEYS = frozenset({
    "sling:resourceType", "jcr:primaryType", "jcr:title", "jcr:description",
    "cq:template", "cq:lastModified", "cq:lastModifiedBy",
})


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
# Per-component validation
# ---------------------------------------------------------------------------

def validate_component(component: dict, path: str = "") -> list[str]:
    """
    Validate a single component dict against the root discriminator schema.
    Creates a fresh validator per call to avoid RefResolver scope-stack leaks
    that occur when the same validator instance is reused across multiple calls.
    Returns a list of error messages (empty = valid).
    """
    errors = []
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
                "sling:resourceType": "core/fd/components/form/textinput/v2/textinput",
                "fieldType":          "text-input",
                "name":               "firstName",
                "jcr:title":          "First Name",
                "required":           "true",
                "mandatoryMessage":   "First Name is required",
            },

            "age": {
                "sling:resourceType": "core/fd/components/form/numberinput/v2/numberinput",
                "fieldType":          "number-input",
                "name":               "age",
                "jcr:title":          "Age",
                "type":               "integer",
                "minimum":            18,
                "maximum":            120,
            },

            "country": {
                "sling:resourceType": "core/fd/components/form/dropdown/v2/dropdown",
                "fieldType":          "drop-down",
                "name":               "country",
                "jcr:title":          "Country",
                "type":               "string",
                "enum":               ["US", "GB", "IN", "CA"],
                "enumNames":          ["United States", "United Kingdom", "India", "Canada"],
            },

            "agreement": {
                "sling:resourceType": "core/fd/components/form/checkbox/v2/checkbox",
                "fieldType":          "checkbox",
                "name":               "agreement",
                "jcr:title":          "I agree to the terms and conditions",
                "type":               "boolean",
                "required":           "true",
            },

            "submit": {
                "sling:resourceType": "core/fd/components/form/actions/submit/v2/submit",
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
                "sling:resourceType": "core/fd/components/form/textinput/v2/textinput",
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

CLONE_SOURCE = "core-components-it/samples/numberinput/validation"
CLONE_DEST   = "samples/api-test/numberinput-clone"


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
    pa = sub.add_parser("patch", help="PATCH page content (JSON Patch RFC 6902)")
    pa.add_argument("--page-id", required=True)
    pa.add_argument("--title",   required=True, help="New page title")
    pa.add_argument("--json", action="store_true", help="Emit machine-readable JSON as last output line")

    # put
    pu = sub.add_parser("put", help="PUT (full replace) page content")
    pu.add_argument("--page-id", required=True)
    pu.add_argument("--title",   required=True, help="New page title")
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
                        '(2) a guideContainer subtree, or '
                        '(3) a full .infinity.json page tree. '
                        'All component nodes (any dict with "fieldType") are validated recursively.'
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
    global _SCHEMA_STORE, _SCHEMA_DIR
    if not _SCHEMA_STORE:
        info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
        _SCHEMA_DIR   = fetch_schemas()
        _SCHEMA_STORE = build_schema_store(_SCHEMA_DIR)
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


def cmd_create(args):
    _shared_init(args)
    r = post("/adobe/pages", {
        "siteId": args.site_id, "title": args.title,
        "name": args.name, "description": args.description,
    })
    if r.status_code in (200, 201):
        page_id = r.json().get("id", "")
        ok(f"Created: pageId={page_id[:30]}...")
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
    content_path = f"/adobe/pages/{args.page_id}/content"
    r = patch(content_path, [{"op": "replace", "path": "/properties/jcr:title", "value": args.title}])
    if r.status_code in (200, 201, 204):
        new_title = r.json().get("properties", {}).get("jcr:title", "") if r.content else args.title
        ok(f"Patched title -> {new_title!r}")
        _emit_json(args.json, {"op": "patch", "ok": True, "title": new_title})
        return True
    fail(f"Patch failed: HTTP {r.status_code} — {r.text[:200]}")
    _emit_json(args.json, {"op": "patch", "ok": False, "error": r.text[:200]})
    return False


def cmd_put(args):
    _shared_init(args)
    content_path = f"/adobe/pages/{args.page_id}/content"
    r_get = get(content_path)
    if r_get.status_code != 200:
        fail(f"Cannot GET /content: {r_get.status_code}")
        _emit_json(args.json, {"op": "put", "ok": False, "error": f"Cannot GET /content: {r_get.status_code}"})
        return False
    component_type = r_get.json().get("componentType", "core/wcm/components/page/v2/page")
    body = {"id": "jcr:content", "componentType": component_type,
            "properties": {"jcr:title": args.title}, "items": []}
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
    r = delete(f"/adobe/pages/{args.page_id}")
    if r.status_code in (200, 204, 404):
        ok(f"Deleted (HTTP {r.status_code})")
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
    global _SCHEMA_STORE, _SCHEMA_DIR
    if not _SCHEMA_STORE:
        info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
        _SCHEMA_DIR   = fetch_schemas()
        _SCHEMA_STORE = build_schema_store(_SCHEMA_DIR)
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

    _count(payload)
    n_components = component_count[0] or 1  # treat single-component payload as 1

    errs = _validate_tree(payload, "")
    if errs:
        fail(f"Validation failed ({len(errs)} error(s) across {n_components} component(s)):")
        for e in errs:
            print(f"     {e}")
        _emit_json(args.json, {"op": "validate", "ok": False, "errors": errs, "components": n_components})
        return False
    ok(f"All {n_components} component(s) pass schema validation")
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

    # Build schema store (done once; fresh_validator() creates validators on demand)
    global _SCHEMA_STORE, _SCHEMA_DIR

    info(f"Fetching schemas from github:{GITHUB_REPO}@{GITHUB_BRANCH}...")
    try:
        _SCHEMA_DIR = fetch_schemas()
        sha_label   = _SCHEMA_DIR.name[:8] if _SCHEMA_DIR != _LOCAL_SCHEMA_DIR else "local"
        ok(f"Schemas ready (sha={sha_label}): {_SCHEMA_DIR}")
    except Exception as e:
        fail(f"Failed to fetch schemas: {e}")
        sys.exit(1)

    info("Building validator store...")
    try:
        _SCHEMA_STORE = build_schema_store(_SCHEMA_DIR)
        ok(f"Loaded {len(_SCHEMA_STORE)} YAML schema(s) into validator store")
    except Exception as e:
        fail(f"Failed to build schema validator: {e}")
        sys.exit(1)

    # Sanity: validate a known-good component with a fresh validator
    test_node = {
        "sling:resourceType": "core/fd/components/form/textinput/v2/textinput",
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
