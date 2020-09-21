<!--
Copyright 2020 Adobe

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
AEM Forms Container (v1)
====
AEM Forms Container component written in HTL.

## Features
* Acts as a container to use AEM Forms pages (ie) Adaptive Form or Interactive Communication inside an AEM Sites Page
* Customizable to use AEM Forms Theme
* AEM Forms Pages could be used inside iframe or non-iframe mode

### Use Object
The AEM Forms Container component uses the `com.adobe.cq.forms.core.components.models.aemform.AEMForm` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Form component and are expected to be available as `Resource` properties:

1. `./useIframe` - defines whether to use iframe as container for AEM Form Pages
2. `./thankyouPage` - defines the thank you page to use for submit
3. `./thankyouMessage` - defines the thank you message to use for submit
4. `./themeRef` - defines an AEM Form Theme to be used for the corresponding AEM Form Page
5. `./id` - defines the component HTML ID attribute.


## BEM Description
```
BLOCK cmp-aemform
    ELEMENT cmp-aemform__iframecontent
    ELEMENT cmp-aemform__content
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-wcm-components)._
