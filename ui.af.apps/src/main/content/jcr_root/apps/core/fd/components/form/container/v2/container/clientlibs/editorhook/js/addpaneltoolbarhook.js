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
     * @param {Object} panel The component for which the toolbar has to be added
     */
     window.CQ.FormsCoreComponents.editorhooks.addPanelToolbar = function (panel) {
        if(!containsToolbarChild(panel)) {
            author.afUtils.addToolbar(panel.path).then(() => {
                panel.refresh();
            })
        };
    };

    const containsToolbarChild = function (panel) {
        return panel.getChildren().some(child => child.getNodeName() === 'toolbar');
    }
})(Granite.author);
