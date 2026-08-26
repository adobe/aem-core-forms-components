<!--
Copyright 2026 Adobe

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
Adaptive Form Custom File Upload (IT)
====
Integration-test component that extends the Adaptive Forms file input to
simulate uploads against a presign endpoint and store the uploaded URL(s) in
the form model.

## Features

* Validates file size, filename, and mime type.
* Uploads valid files to preasign URL.
* Stores uploaded URL(s) in the model.

Example export data (single file):

```
{
  "customfileupload1769598345994": {
    "name": "sample.pdf",
    "size": 0,
    "mediaType": "application/octet-stream",
    "data": "/services/s3/presign/sample.pdf"
  }
}
```

Example export data (multiple files):

```
{
  "customfileupload1769598345994": [
    {
      "name": "sample.txt",
      "size": 0,
      "mediaType": "application/octet-stream",
      "data": "/services/s3/presign/sample.txt"
    },
    {
      "name": "sample2.txt",
      "size": 0,
      "mediaType": "application/octet-stream",
      "data": "/services/s3/presign/sample2.txt"
    }
  ]
}
```

## Use Object

The component uses the `com.adobe.cq.forms.core.components.models.form.FileInput`
Sling Model.

## Client Libraries

The component provides the client library categories under its component path:

* `forms-core-components-it.components.customfileupload.site`

## BEM Description
```
BLOCK cmp-adaptiveform-fileinput
    ELEMENT cmp-adaptiveform-fileinput__label
    ELEMENT cmp-adaptiveform-fileinput__label-container
    ELEMENT cmp-adaptiveform-fileinput__widget
    ELEMENT cmp-adaptiveform-fileinput__questionmark
    ELEMENT cmp-adaptiveform-fileinput__shortdescription
    ELEMENT cmp-adaptiveform-fileinput__longdescription
    ELEMENT cmp-adaptiveform-fileinput__filelist
    ELEMENT cmp-adaptiveform-fileinput__fileitem
    ELEMENT cmp-adaptiveform-fileinput__filename
    ELEMENT cmp-adaptiveform-fileinput__filedelete
    ELEMENT cmp-adaptiveform-fileinput__widgetlabel
```

## Where It Is Used

* Sample page:
  `/content/forms/af/core-components-it/samples/fileinput/customfileinput/custom-file-uploader.html`
* Cypress spec:
  `ui.tests/test-module/specs/customfileupload/customfileupload.runtime.cy.js`

## Information
* **Vendor**: Adobe
* **Version**: IT
* **Compatibility**: Cloud
* **Status**: internal test component
