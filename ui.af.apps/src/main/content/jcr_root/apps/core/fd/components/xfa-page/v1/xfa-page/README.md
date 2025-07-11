<!--
Copyright 2025 Adobe

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
Adaptive Form XFA Core Page (v1)
====
Adaptive Form XFA Core Page component v1 which extends the forms  [Page](https://github.com/adobe/aem-core-forms-components/tree/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/page/v1/page) Component.

## Features

* This is the page component for the Adaptive Form Core Components with XFA support. 
* Loads all required XFA-specific clientlibs in the headers and footers:
  * Base runtime clientlib (core.forms.components.runtime.base.xfa) which includes:
    * XFA core dependencies:
      * xfaforms.3rdparty
      * xfaforms.I18N.en
      * xfaforms.formbridge
      * xfaforms.xfalibutil
      * xfaforms.xfalibwidgets
      * xfaforms.formcalc
      * xfaforms.xfalibModel
    * Common dependencies:
      * granite.csrf.standalone.fetchsupport
      * af.rum
      * dompurify
  * All-in-one clientlib (core.forms.components.runtime.all.xfa) which includes:
    * Base XFA runtime (core.forms.components.runtime.base.xfa)
    * All form component runtimes (textinput, dropdown, etc.)





