
# UI tests

This folder contains UI tests that test some client-side (= clientlib) features of the forms components. The tests are based on the sample content of the [Forms components library](../examples). To execute the tests with a local AEM instance, simply setup and install the Forms components library.

To execute the tests in debug mode, simply run

```
mvn verify -Pcypress
```

To execute the tests in headless mode, simply run

```
mvn verify -Pcypress-ci
```

To run a particular spec file in headless mode,

```
cd ui.tests/test-module
npm run cypress:run:file -- ./specs/textinput/textinput.runtime.spec.js
```

## Requirements

* Maven
* Chrome and/or Firefox browser installed locally in default location
* An AEM author instance running at http://localhost:4502


#### Remarks
* After execution, reports and logs are available in `test-module/target/reports` folder

### Parameters

| Parameter | Required | Default| Description |
| --- | --- | --- | --- |
| `AEM_AUTHOR_URL`        | false     | `http://localhost:4502` | URL of the author instance |
| `AEM_AUTHOR_USERNAME`   | false     | `admin`                 | Username used to access the author instance |
| `AEM_AUTHOR_PASSWORD`   | false     | `admin`                 | Password used to access the author instance |
| `AEM_PUBLISH_URL`       | false     | -                       | URL of the publish instance |
| `AEM_PUBLISH_USERNAME`  | false     | `admin`                 | Username used to access the publish instance |
| `AEM_PUBLISH_PASSWORD`  | false     | `admin`                 | Password used to access the publish instance |

#### Example

Run tests on <span style="color:green">local</span> <span style="color:orange">headless</span> <span style="color:purple">firefox</span>, targeting a <span style="color:blue">custom AEM author instance</span>:

<PRE>
mvn test \
    <span style="color:green">-Plocal-execution</span> \
    <span style="color:orange">-DHEADLESS_BROWSER=true</span> \
    <span style="color:purple">-DSELENIUM_BROWSER=firefox</span> \
    <span style="color:blue">-DAEM_AUTHOR_URL=http://my-aem-author-instance.com</span> \
    <span style="color:blue">-DAEM_AUTHOR_USERNAME=testuser</span> \
    <span style="color:blue">-DAEM_AUTHOR_PASSWORD=aVVe5om3</span>
</PRE>

