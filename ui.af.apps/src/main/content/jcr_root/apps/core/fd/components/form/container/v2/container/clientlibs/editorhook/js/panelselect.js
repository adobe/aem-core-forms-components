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

(function(ns) {

    var PanelSelector = CQ.CoreComponents.PanelSelector;

    if (PanelSelector) {
        var getPanelTitle = PanelSelector.prototype.getTitle;
        PanelSelector.prototype.getTitle = function (editable, item, index) {
            var title = "<span class='foundation-layout-util-subtletext cmp-panelselector__indexMarker'>" + index + "</span>&nbsp;&nbsp;";
            var subTitle = "";

            title = title + " " + Granite.I18n.getVar(ns.editableHelper.getEditableDisplayableName(editable));

            if (item && item.label && item.label.value) {
                subTitle = item.label.value;
            }

            if (subTitle) {
                title = title + ": <span class='foundation-layout-util-subtletext'>" + subTitle + "</span>";
            } else {
                return getPanelTitle.call(this, editable, item, index);
            }
            return title;
        }
    }

})(Granite.author);