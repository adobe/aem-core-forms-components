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
AEM Forms Container (v2)
====
AEM Forms Container component written in HTL.

## Features
* Customizable to use AEM Forms Theme
* AEM Forms Pages could be used inside iframe or non-iframe mode
* Customizable to enable/disable focus on the form
* Provides an action config to create an Adaptive Form on the fly.

### Use Object
The AEM Forms Container component uses the `com.adobe.cq.forms.core.components.models.aemform.AEMForm` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Form component and are expected to be available as `Resource` properties:

1. `./useIframe` - specifies whether to use iframe as a container for the form or interactive communication.
2. `./thankyouPage` - specifies the thank you page to show on form submission.
3. `./thankyouMessage` - specifies the thank you message to show on form submission.
4. `./themeRef` - specifies the AEM Forms theme to use for the form or interactive communication.
5. `./enableFocusOnFirstField` - specifies whether to bring focus on the form or page containing the form or interactive communication.
6. `./submitType` - specifies a submit type for the form. It can be synchronous or asynchronous.
7. `./locale` - specifies the locale of the form or interactive communication. It could be sites page locale or a custom locale.
8. `./id` - specifies value for the component HTML ID attribute.


## BEM Description
```
BLOCK cmp-aemform
    ELEMENT cmp-aemform__iframecontent
    ELEMENT cmp-aemform__content
```

## Information
* **Vendor**: Adobe
* **Version**: v2
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
