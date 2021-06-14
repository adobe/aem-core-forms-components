<!--
Copyright 2021 Adobe

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
Link Component  (v2)
====
Forms and Communications Portal Link component written in HTL.

## Features
Allows adding a hyperlink on a Sites Page to any of the following:
- An Adaptive Form
- A PDF
- An AEM asset
- An external link

User can also specify any query parameters they want in the link during authoring as well.

### Use Object
The Link component uses the `com.adobe.cq.forms.core.components.models.formsportal.Link` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the Link component and are expected to be available as `Resource` properties:

1. `./title`     - Text shown on the link
2. `./tooltip`   - Tooltip on the link
3. `./assetType` - Type of asset the link refers to (e.g *ADAPTIVE_FORM*)
4. `./adaptiveFormPath`, `./pdfPath`, `./otherAssetPath`, `./externalLinkPath` - Path to the asset linked, depending on it's type

In addition, the n<sup>th</sup> query parameter is saved as `key` and `value` properties on child node `queryParams/item<n>`.

## BEM Description
```
BLOCK cmp-link
    ELEMENT cmp-link__anchor
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
