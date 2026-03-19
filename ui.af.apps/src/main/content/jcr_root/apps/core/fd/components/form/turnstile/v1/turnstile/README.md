<!--
Copyright 2024 Adobe

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
Adaptive Form Turnstile (v1)
====
Adaptive Form Cloudflare Turnstile field component written in HTL.

## Features

* Provides the following type of input:
  * Turnstile
* The following widgets are supported for Turnstile: 
  * Managed
  * Non-Interactive
  * Invisible
* Styles
* Custom constraint messages for the above types

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.Turnstile` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Turnstile component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/turnstile.authoring.schema.yaml`](../../../../../../../../../../docs/authoring-schema/components/turnstile.authoring.schema.yaml) for the full machine-readable schema.

#### Base properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field label | `./jcr:title` | String | — | Visible label rendered next to the field |
| Hide label | `./hideTitle` | Boolean | `false` | When true the label is hidden but available to screen readers |
| Field name | `./name` | String | — | Data key submitted with form data |
| Required message | `./mandatoryMessage` | String | — | Error shown when the required captcha is not completed |

#### Field properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read only | `./readOnly` | Boolean | `false` | Prevents user input |

#### Turnstile-specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Cloud service path | `./cloudServicePath` | String | — | Path to the Cloudflare Turnstile cloud configuration resource. TurnstileImpl resolves the site key, widget type (managed/non-interactive/invisible), and client-side JS URL from this path via `CloudConfigurationProvider`. Injected via `@Named("cloudServicePath")`. |
| Widget size | `./size` | String | — | Controls the display size of the Turnstile widget. Injected by TurnstileImpl via `@Named("size")`. The widget type (managed/non-interactive/invisible) is resolved from the cloud configuration at runtime, not from this property. |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |

## Client Libraries
The component provides a `core.forms.components.turnstile.v1.runtime` client library category that contains the Javascript runtime for the component.
It should be added to a relevant site client library using the `embed` property.


## BEM Description
```
BLOCK cmp-adaptiveform-turnstile
    ELEMENT cmp-adaptiveform-turnstile__label
    ELEMENT cmp-adaptiveform-turnstile__widget
    ELEMENT cmp-adaptiveform-turnstile__errormessage
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the hCaptcha component in the form view:
1. `data-cmp-is="adaptiveFormTurnstile"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`



The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
