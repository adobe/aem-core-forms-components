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
    /**
     * Adds the toolbar component as a child of the panel 
     * @param {Object} component The component that has to be instantiated
     */
     window.CQ.FormsCoreComponents.editorhooks.addPanelToolbar = function (component) {
        console.log(component);
        let toolbarJson = {
            'name'                  : 'toolbar',
            'sling:resourceType'    : 'forms-components-examples/components/form/toolbar'
        };
        const options = {
            ':content' : JSON.stringify(toolbarJson),
            ':operation' : 'import',
            ':contentType' : 'json',
            ':replace' : true,
            ':replaceProperties' : true
        };
        let result = $.ajax({
            type: 'POST',
            async: false,
            url: Granite.HTTP.externalize(temp1.path + "/toolbar")
        })
    };
})(Granite.author);
