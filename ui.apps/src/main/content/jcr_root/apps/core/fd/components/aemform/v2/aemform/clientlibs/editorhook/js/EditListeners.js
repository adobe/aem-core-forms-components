/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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
(function (Granite, ns) {
    ns.aemform.v2.constants = {
        "AEM_FORM_SELECTOR" : "[data-form-page-path]",
        "AEM_FORM_CONTAINER_SELECTOR" : ".cmp-aemform",
        "AEM_FORM_WIZARD_LINK" : "/libs/fd/fm/base/content/commons/wizardspalink.html"
    };

    ns.aemform.v2.actions.openFormForEditing = function (editable) {
        var htmlElement = $(ns.aemform.v2.constants.AEM_FORM_SELECTOR, editable.dom).addBack("[data-form-page-path]"),
            formPath = htmlElement.attr("data-form-page-path"),
            url = Granite.HTTP.externalize("/editor.html" + formPath + ".html");
        window.open(url);
    };

    ns.aemform.v2.actions.openCreateFormWizard = function (editable) {
        $.ajax({
            url: Granite.HTTP.externalize(ns.aemform.v2.constants.AEM_FORM_WIZARD_LINK),
            type: "GET",
            success: function(data){
                var wizardURL = new URL($(data).get(0).href);
                wizardURL.searchParams.append('embedAt', btoa(editable.path));
                wizardURL.searchParams.append('redirectUrl', btoa(window.location.href));
                window.open(Granite.HTTP.externalize(wizardURL.href), "_top");
            },
            error: function (error) {
                console.log("Error: " + error);
            }
        });
    }

    ns.aemform.v2.actions.formExists = function (editable) {
        return $(ns.aemform.v2.constants.AEM_FORM_SELECTOR, editable.dom).addBack(ns.aemform.v2.constants.AEM_FORM_SELECTOR).length > 0;
    };

    ns.aemform.v2.actions.aemFormExistsInPage = function () {
        return Granite.author.ContentFrame.getDocument().find(ns.aemform.v2.constants.AEM_FORM_CONTAINER_SELECTOR).length > 0;
    };

    ns.aemform.v2.actions.featureEnabled = function (editable) {
        return Granite.Toggles.isEnabled("FT_CQ-4343036");
    };

}(window.Granite, CQ.FormsCoreComponents));
