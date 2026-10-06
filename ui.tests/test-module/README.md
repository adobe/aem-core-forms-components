Sample Tests Project
====================

Sample UI tests using [Cypress](https://www.cypress.io//) framework


* `package.json` Project definition: dependencies, npm scripts, ...
* `cypress.config.js` Cypress configuration: reporters, browser capabilities, ...
* `specs` Tests


* [Node.js LTS](https://nodejs.org/en/)


```
npm install
```


* AEM instance (example: `http://localhost:4502`)

  > For local testing we suggest to use the [AEM as a Cloud Service SDK](https://docs.adobe.com/content/help/en/experience-manager-cloud-service/implementing/developing/aem-as-a-cloud-service-sdk.html)

* Chrome or Firefox browser installed locally in default location


* Chrome
  ```
  mvn verify -Pcypress
  ```

After execution, reports and logs are available in `target/reports` folder

## Remote authoring and stability checks

Override `baseUrl` rather than changing the committed localhost configuration:

```sh
npx --no-install cypress run --browser chrome --headless \
  --spec 'specs/wizard/wizard.authoring.cy.js,specs/checkboxgroup/checkboxgroup.authoring.cy.js,specs/dropdown/dropdown.authoring.cy.js,specs/contentfragment/contentfragment.authoring.cy.js,specs/telephoneinput/telephoneinput.authoring.cy.js' \
  --config 'baseUrl=https://author.example,retries=0,video=false' \
  --env 'crx.loginViaRequest=true'
```

`crx.loginViaRequest` is optional and defaults to the existing UI login flow.
Enable it when an external author endpoint requires a session before navigation
or its UI login redirects escape the Cypress frame. It uses AEM's form-login
endpoint and the existing `crx.username`, `crx.password`, and `crx.contextPath`
settings. Supply credentials using Cypress environment configuration; do not
commit them. For an ngrok browser-warning endpoint, a non-browser `userAgent`
override can be supplied together with request login.

Component insertion must finish the editor refresh before a caller configures
or deletes the new component.
Use `cleanTest` after entering the Edit layer, `cancelConfigureDialog` for
configure-dialog cancellation, and `submitConfigureDialog` when a save must
finish before the next toolbar action. Select classic Coral options through
`selectCoralOption`, rather than assuming a native `select` or modern Coral
CSS classes.

Use `createRule` to wait for the rule editor's statement builder, rather than
assuming its first Create click is handled while the iframe initializes.

Use `cleanTestFixture` in teardown to remove only the named test-owned component
through authenticated requests, even if the editor or configure dialog failed.
Tutorial preferences are saved through awaited requests; request-login authoring
does not depend on the landing-page redirect.

Repeat stability runs with retries disabled, including per-test retry overrides.
Verify that test-owned components are removed and the telephone policy matches
its original snapshot after both passing and failing runs.
