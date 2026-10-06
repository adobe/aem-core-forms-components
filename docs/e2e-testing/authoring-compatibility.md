# Authoring test compatibility: 6.5 SP and LTS

Authoring assertions must describe the field or editor behavior, not the markup
of one Coral implementation. A passing repetition on one server does not prove
compatibility with another AEM service pack or LTS instance.

## Selectors and validation

- Scope fields through our component classes and field names, for example
  `.cmp-adaptiveform-checkboxgroup__value input[name='./default']`.
- Avoid internal presentation classes such as `.coral3-Search-input`,
  `.coral-Form-errorlabel`, and `.coral-Form-fielderror`. Error UI can be a
  tooltip, an icon, or an inline label. Covered or hidden error UI is not proof
  that the field is valid.
- Use `cy.assertFieldInvalid(selector, message)` to require one field,
  `aria-invalid="true"`, and the expected Granite validation message. It reads
  the validation state after submission; it does not manufacture an error.
- The served AEM 6.5.25.0 `foundation-validation` adapter exposes
  `getValidationMessage()`. The published Granite API also describes
  `validationMessage()`. The shared command checks the available accessor
  instead of branching on an AEM version string. A missing adapter, unsupported
  accessor, ambiguous field, or unexpected message must fail explicitly.
- Use public Coral elements and values for selection through
  `cy.selectCoralOption()`. Do not assume every `coral-select` has a native
  `select[handle="nativeSelect"]`.
- Scope component insertion to the visible Insert dialog and require a unique
  visible native input. Use the public dialog `open` property rather than
  Coral's internal state classes when checking for a leftover dialog.

The [Granite validation reference](https://developer.adobe.com/experience-manager/reference-materials/6-5/granite-ui/api/jcr_root/libs/granite/ui/components/coral/foundation/clientlibs/foundation/js/validation/index.html)
describes the adapter contract. Check the served clientlib when its API differs
from the reference; do not assume a documented method exists on every instance.

## Layer selection and synchronization

`cy.selectLayer()` waits for the requested layer to be visibly selected.
An overlay-reposition event is not an unconditional layer-selection contract.
Requiring it caused existing tests to time out on both SP and LTS even after
the selected-layer assertion succeeded.

Keep operation-specific refresh waits for insertion, save, and deletion.
An event wait justified for one operation must not be imposed on every editor
transition. Test an actual layer change as well as an already-selected layer:
the latter returns early and cannot validate a transition wait.

## Button inline editing

An empty caption can remove both `jcr:title` and the rendered caption span.
Do not require a nonempty span after explicitly clearing the label. The inline
test saves a nonempty caption and verifies preview text and persisted title,
then repeats the original empty-label edit and verifies the empty native button
and absent/empty title before deletion. Both edits wait for the inline toolbar
to close. API teardown removes only the named test fixture if an assertion fails.

## Authentication and browser user agents

Use the normal browser user agent for acceptance. Sling's referrer filter
classifies browser requests using `Mozilla`/`Opera` in the user agent; changing
it to a non-browser value can hide a missing-referrer POST regression.

Authenticated preferences, policy restoration, and fixture cleanup POSTs need
the session, CSRF token, and same-server referrer. Request-based login also
includes the configured `baseUrl` as its referrer. Await requests and preserve
HTTP failures; do not set `failOnStatusCode: false` to make rejected writes pass.

## Remote ngrok runs with normal Chrome

An ngrok browser warning can return HTTP 200 HTML instead of AEM JSON or
JavaScript (`ERR_NGROK_6024`). A missing `body.token` or JavaScript
`Unexpected token '<'` can therefore be a tunnel response, not an AEM selector
failure. Inspect the response content type before changing application code.

For temporary remote support, forward
`ngrok-skip-browser-warning: true` on the initial `cy.visit()` and node-side
`cy.request()` calls. Browser subresources need the header too. The following
Chrome-only support hook was used successfully on the remote SP instance:

```js
before(() => {
  cy.then(() => Cypress.automation('remote:debugger:protocol', {
    command: 'Network.enable'
  }).then(() => Cypress.automation('remote:debugger:protocol', {
    command: 'Network.setExtraHTTPHeaders',
    params: {headers: {'ngrok-skip-browser-warning': 'true'}}
  })));
});
```

This is tunnel-specific support, not a replacement for the normal CI browser
configuration. Broad middleware interception introduced while debugging stalled
the remote runner; removing it and setting the native browser header allowed the
same Text case to complete. Do not diagnose an AEM `visit()` problem solely from
a stalled custom runner.

When inspecting Chrome, use the test browser's actual
`--remote-debugging-port`. The first `DevTools listening` line can belong to
Cypress's Electron process, not the test Chrome. An empty target list from the
wrong debugger does not show that the test browser has no page.

## Acceptance order

1. Verify the actual product version from
   `/system/console/status-productinfo.txt` and the active component bundles.
   A Core Components bundle version does not distinguish SP from LTS.
2. Capture fixture and policy baselines; preserve unrelated authored content.
3. Run every reported failing case once with global and per-test retries
   disabled. Verify selected cases were collected and actually passed.
4. Include earlier reported cases when changing shared helpers. New-case passes
   are not evidence that the original fixes still work.
5. Publish the verified fixes, then run the entire configured Cypress suite.
   In `release/650`, the current inventory is 153 JavaScript specs.
6. Verify cleanup/restoration and obtain results for each CI variant. Record
   pending, unsupported, skipped-after-hook, and retry-assisted results
   separately from clean passes.

A helper contract check against both accessor shapes is not a live LTS test.
Finite repetitions cannot guarantee that a race never recurs. Keep the PR
evidence explicit about the server, source revision, selected cases, and
remaining validation gaps.
