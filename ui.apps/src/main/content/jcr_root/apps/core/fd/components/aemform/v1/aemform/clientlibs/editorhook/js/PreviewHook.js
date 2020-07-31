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
(function (channel, ns) {

    var _superSanitizeCQHandler = ns.util.sanitizeCQHandler,
        _superExecuteListener = ns.Editable.prototype._executeListener;
    // adding hook for CQ Sanitize handler
    ns.util.sanitizeCQHandler = function (code) {
        // check if the handler belongs to form editor
        // code can be a function or a string, in case of form editor, for OOTB edit config listeners, we need to check for listeners prefixed with guidelib or guidelib.author
        if (window.guidelib == null && code != null && typeof code === 'string' &&  (code.indexOf("guidelib") === 0 || (code.indexOf("guidelib.author"))) >= 0) {
            // in case of an aem form handler, do nothing
        } else if (code && typeof code === "function") {
            return code;
        } else {
            return _superSanitizeCQHandler.call(this, code);
        }
    };

    // adding hook for execute listener
    // since on wcmmode preview, we dont have authoring code of form editor loaded in site editor
    ns.Editable.prototype._executeListener = function (listenerName, parameters) {
        if (this.config && this.config.editConfig.listeners[listenerName] == null && parameters && parameters[0].indexOf("guideContainer") >= 0) {
            // do nothing
        } else {
            return _superExecuteListener.call(this, listenerName, parameters);
        }
    };

    // once the layer is switched, check if AEM form component exists in the page
    // if aem form component exists, then refresh the page, so that we can show the test data in wcmmode preview
    channel.on("editor-frame-mode-changed.aemform", function () {
        if (window.fd.aemFormExistsInPage()) {
            // check if the cookie is wcmmode preview
            var wcModeCookie = $.cookie("wcmmode");
            if (wcModeCookie == "preview" || wcModeCookie == "edit") {
                // reload the page
                window.location.reload();
            }
        }
    });

}($(document), Granite.author));
