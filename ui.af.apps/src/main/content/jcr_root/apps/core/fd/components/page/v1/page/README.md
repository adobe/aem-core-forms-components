
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
Adaptive Form Core Page (v1)
====
Adaptive Form Core Page component v1 which extends the wcm  [Page](https://github.com/adobe/aem-core-wcm-components/tree/main/content/src/content/jcr_root/apps/core/wcm/components/page/v3/page) Component.

## Features

* This is the page component for the Adaptive Form Core Components. The v1 version of the component extends the site
  page component. This component loads all the required javascripts in the footers and all the required css clientlibs
  in the headers.
* A request `themeOverride` that resolves to a usable Theme Editor client library category takes precedence over the
  form container's saved `themeClientLibRef` category used by AEM 6.5. Without a usable override, the saved category
  is loaded only when present. The generic `clientLibRef` is loaded independently, after runtime CSS.
* Cloud configuration-based `themeRef` loading remains separate and unchanged. The shared header's saved-category
  lookup normally returns null for Cloud forms without `themeClientLibRef`; an explicitly saved category can also
  be used on Cloud. This compatibility fallback is property-based, not platform-gated.




