<!--
Copyright 2022 Adobe

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
Adaptive Form Container (v2)
====
Adaptive Form container written in HTL.

## Features
* Form submit actions like sending emails, submit to rest end point
* Pre-filling of Form
* Configurable list of allowed components
* Thank you page
* Thank you message
* Ability to drop other adaptive form components
* Auto save feature for Drafts
* Loader overlay during form submission to prevent multiple submits

### Use Object
The Adaptive Form Container component uses the `com.adobe.cq.forms.core.components.models.form.FormContainer` Sling Model for its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./components` - defines the allowed components that can be dropped onto a Form Container associated to this component policy
2. `./columns` - defines the number of columns for the container's grid for a Form Container associated to this component policy

### Edit Dialog Properties

The following properties are written to JCR by the Edit Dialog and consumed by the Sling Model.

> **Important**: In the runtime JSON model, auto-save properties are grouped under the `fd:autoSave` key
> and submission properties under `fd:submit`. These are output-time groupings only — JCR stores all
> of them as flat properties directly on this FormContainer node.

#### Inherited container properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Visible | `./visible` | Boolean | `true` | Whether the container is visible |
| Enabled | `./enabled` | Boolean | `true` | Whether the container is enabled |
| Title | `./title` | String | — | Form title |
| Description | `./description` | String | — | Form description |
| Repeatable | `./repeatable` | Boolean | `false` | Whether the container is repeatable |
| Min items | `./minItems` | Integer | — | Minimum number of instances (repeatable) |
| Max items | `./maxItems` | Integer | — | Maximum number of instances (repeatable) |
| Fragment path | `./fragmentPath` | String | — | Path to fragment definition (lazy containers) |
| Lazy | `./lazy` | Boolean | `false` | Defers loading children until navigation |

#### Auto-save properties (flat JCR, grouped under `fd:autoSave` in JSON output)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Enable auto-save | `./fd:enableAutoSave` | Boolean | `false` | Enables automatic draft saving |
| Auto-save strategy | `./fd:autoSaveStrategyType` | String | — | `time` or `fieldFocus` |
| Auto-save interval | `./fd:autoSaveInterval` | Integer | — | Interval in seconds (for `time` strategy) |

#### Submission properties (flat JCR, grouped under `fd:submit` in JSON output)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Action type | `./actionType` | String | — | Submit action type |
| Action name | `./actionName` | String | — | Submit action name |
| Email To | `./mailto` | String | — | Recipient email address(es) |
| Email From | `./from` | String | — | Sender email address |
| Email Subject | `./subject` | String | — | Email subject line |
| Email CC | `./cc` | String | — | CC email address(es) |
| Email BCC | `./bcc` | String | — | BCC email address(es) |
| Spreadsheet URL | `./spreadsheetUrl` | String | — | OneDrive/SharePoint spreadsheet URL |

#### Post-submission properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Thank you option | `./thankYouOption` | String | — | `message` or `redirect` |
| Thank you message (v2) | `./thankYouMessage` | String | — | Message shown after submit (capital Y) |
| Redirect URL | `./redirect` | String | — | URL to redirect to after submit |

#### General

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Prefill service | `./prefillService` | String | — | Prefill service sling selector |
| Spec version | `./specVersion` | String | — | AF spec version (e.g. `1.0.0`) |
| Client library ref | `./clientLibRef` | String | — | Custom client library category |

#### v2-only: `fd:view/print` child node

> Available in v2 only. `excludeFromDoRIfHidden` is stored at the child node path `fd:view/print`,
> not as a flat property on the FormContainer node.

| Property | Child node path | Type | Default | Description |
|----------|----------------|------|---------|-------------|
| Exclude hidden from DOR | `fd:view/print/excludeFromDoRIfHidden` | Boolean | `false` | Excludes hidden fields from Document of Record |

## Client Libraries

The component provides a `core.forms.components.container.v2.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

The component provides a `core.forms.components.container.v2.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## Pre-filling of Form using Form Data Servlet

The form is pre-filled based on the `fd:formDataEnabled` property, which is set when the prefill service is enabled or when the `dataRef` is provided in the request parameter.
This approach is implemented to optimize performance by avoiding additional network call.


## BEM Description
```
BLOCK cmp-adaptiveform-container
    ELEMENT cmp-adaptiveform-container__wrapper
    ELEMENT cmp-adaptiveform-container__hamburger-menu
    ELEMENT cmp-adaptiveform-container__hamburger-menu-top
    ELEMENT cmp-adaptiveform-container__hamburger-menu-icon-container
    ELEMENT cmp-adaptiveform-container__hamburger-menu-icon
    ELEMENT cmp-adaptiveform-container__hamburger-menu-middle
    ELEMENT cmp-adaptiveform-container__hamburger-menu-bottom
    ELEMENT cmp-adaptiveform-container__hamburger-menu-active-item-title
    MODIFIER cmp-adaptiveform-container__hamburger-menu-button--prev
    MODIFIER cmp-adaptiveform-container__hamburger-menu-button--next
```

In edit mode, the BEM structure includes a modifier for the cmp-adaptiveform-container block,

```
BLOCK cmp-adaptiveform-container
    MODIFIER cmp-adaptiveform-container--edit
    ELEMENT cmp-adaptiveform-container__wrapper
```


## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormContainer"` attribute to the `cmp-adaptiveform-container` block to enable initialization of the JavaScript component.

Applying `data-cmp-adaptiveform-container-loader` attribute to the div specifically for applying the loader class on it, it is to ensure that the loading icon should not appear over components. 

During the form submission, the form element `form.cmp-adaptiveform-container` toggles the class `cmp-adaptiveform-container--submitting` and the loader inside becomes visible. The class is removed once validation fails, submission succeeds or errors out, or the thank you page/message is shown.

Applying `data-cmp-custom-functions-module-url` attribute to the div to point to the edge delivery URL of the custom functions file. Custom Functions exported from this file will be registered in Function Runtime. 
This Url should whitelist the AEM author/publish domain in the Cross Origin Resource Sharing (CORS) configuration.

Applying `data-cmp-auto-save` attribute to the `cmp-adaptiveform-container` block to control the auto-save functionality. If the attribute's value is set to true, auto-save will be enabled for the form; otherwise, it will not be triggered. This attribute will be set to true in published mode if enableAutoSave is enabled.

Applying `data-cmp-schema-type` attribute to the `cmp-adaptiveform-container` block to indicate the schema type of the form. This attribute is used to determine the appropriate form loading mechanism, particularly for XDP forms which require special handling. The value corresponds to the schema type from the FormContainer model (e.g., 'XDP', 'XSD', 'JSON', etc.).

Applying `data-cmp-hamburger-menu-enabled` attribute to the `cmp-adaptiveform-container` block to control the hamburger meu. If the attribute's value is set to true, hamburger menu will be enabled in the mobile view.