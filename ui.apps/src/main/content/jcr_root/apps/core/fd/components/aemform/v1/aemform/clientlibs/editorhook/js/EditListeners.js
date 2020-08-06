/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function (Granite) {
    window.fd = window.fd || {};
    window.fd.core = window.fd.core || {};
    window.fd.core.constants = window.fd.core.constants || {};
    window.fd.core.constants = {
        "AEM_FORM_SELECTOR" : "[data-form-page-path]",
        "AEM_FORM_CONTAINER_SELECTOR" : ".cmp-aemform"
    };

    window.fd.core.openFormForEditing = function (editable) {
        var htmlElement = $(window.fd.core.constants.AEM_FORM_SELECTOR, editable.dom).addBack("[data-form-page-path]"),
            formPath = htmlElement.attr("data-form-page-path"),
            url = Granite.HTTP.externalize("/editor.html" + formPath + ".html");
        window.open(url);
    };

    window.fd.core.formExists = function (editable) {
        return $(window.fd.core.constants.AEM_FORM_SELECTOR, editable.dom).addBack(window.fd.core.constants.AEM_FORM_SELECTOR).length > 0;
    };

    window.fd.core.aemFormExistsInPage = function () {
        return Granite.author.ContentFrame.getDocument().find(window.fd.core.constants.AEM_FORM_CONTAINER_SELECTOR).length > 0;
    };

}(window.Granite));
