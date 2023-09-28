/*******************************************************************************
 * Copyright 2023 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

(function(author){

    "use strict";
    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks =  window.CQ.FormsCoreComponents.editorhooks || {};

    const FRAGMENT_PLACEHOLDER_SELECTOR = ".cmp-adaptiveform-fragment__placeholderContainer";
    const ASSET_NODE_PATH_PREFIX = "/content/dam/formsanddocuments";
    const PAGE_NODE_PATH_PREFIX = "/content/forms/af";

    window.CQ.FormsCoreComponents.editorhooks.showFragmentToolbar = function (editable) {
        return $(editable.dom).find(FRAGMENT_PLACEHOLDER_SELECTOR).length > 0;
    }

    window.CQ.FormsCoreComponents.editorhooks.openFragmentInEditor = function (editable) {
        var fragmentPath = $(editable.dom).find(FRAGMENT_PLACEHOLDER_SELECTOR).data("cmp-fragmentpath");
        if(fragmentPath) {
            if(fragmentPath.indexOf(ASSET_NODE_PATH_PREFIX) != null) {
                fragmentPath = fragmentPath.replace(ASSET_NODE_PATH_PREFIX, PAGE_NODE_PATH_PREFIX);
            }
            var url = Granite.HTTP.externalize("/editor.html" + fragmentPath + ".html");
            window.open(url);
        }
    }

    var embedFragmentHandler = function (component, editable) {
        var resourceType = component.getResourceType();
        author.afUtils.embedFragment(editable, resourceType);
    }

    window.CQ.FormsCoreComponents.editorhooks.embedFragment = function (editable) {
        guidelib.author.editConfigListeners.openCmpSelectionDialog(editable, "Embed Fragment", embedFragmentHandler);
    }
})(Granite.author);