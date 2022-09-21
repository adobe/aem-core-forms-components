/*******************************************************************************
 * Copyright 2022 Adobe
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

export const Constants = {
    /**
     * namespsace of the data-attribute. Any data attribute will be prefixed with this name.
     * i.e. data-name would be data-{NS}-{ComponentClass}-name. Each component will have a different
     * component class
     */
    NS : "cmp",

    /**
     * @summary Form event to be triggered with a Form container is initialized
     *
     * @name  AF_FormContainerInitialised
     * @event
     * @property {object} event
     * @property {object} event.detail instance of FormContainer that is initialzied
     * @example
     * document.on("AF_FormContainerInitialised" , function(event) {
     *      var formContainer = event.detail;
     *      ...
     * }
     */
    FORM_CONTAINER_INITIALISED : "AF_FormContainerInitialised",

    /**
     * @summary Panel event to be triggered when a child view is added to panel view
     *
     * @name  AF_PanelChildAdded
     * @event
     * @property {object} event
     * @property {object} event.detail instance of child view that is added
     * @example
     * panel.element.on("AF_PanelChildAdded" , function(event) {
     *      var childView = event.detail;
     *      ...
     * }
     */
    PANEL_CHILD_ADDED : "AF_PanelChildAdded",

    /**
     * @summary Panel event to be triggered when a child view is removed from panel view
     *
     * @name  AF_PanelChildRemoved
     * @event
     * @property {object} event
     * @property {object} event.detail instance of child view that was removed
     * @example
     * panel.element.on("AF_PanelChildRemoved" , function(event) {
     *      var childView = event.detail;
     *      ...
     * }
     */
    PANEL_CHILD_REMOVED : "AF_PanelChildRemoved",

    /**
     * data attribute to store the form container path. In HTML it will be namespaced
     * data-{NS}-{ComponentClass}-adaptiveformcontainerPath
     */
    FORM_CONTAINER_DATA_ATTRIBUTE: "adaptiveformcontainerPath",

    /**
     * data attribute to be added on clickable element to repeat a repeatable panel
     */
    DATA_HOOK_ADD_INSTANCE:"data-cmp-hook-add-instance",

    /**
     * data attribute to be added on element to remove a repeatable panel
     */
    DATA_HOOK_REMOVE_INSTANCE:"data-cmp-hook-remove-instance",

    /**
     * data attribute to mark the dragged component valid or invalid.
     * value true for valid
     * value false for invalid
     */
    DATA_ATTRIBUTE_VALID : "data-cmp-valid",

    /**
     * data attribute to mark the dragged component enabled or disabled.
     * value true for enabled
     * value false for disabled
     */
    DATA_ATTRIBUTE_ENABLED : "data-cmp-enabled",

    /**
     * data attribute to mark the dragged component visible or invisible.
     * value true for visible
     * value false for invisible
     */
    DATA_ATTRIBUTE_VISIBLE : "data-cmp-visible",

    /**
     * data attribute to mark the dragged component active or inactive.
     * value true for active
     * value false for inactive
     */
    DATA_ATTRIBUTE_ACTIVE : "data-cmp-active",

    /**
     * aria attribute to mark the dragged component disabled.
     */
    ARIA_DISABLED : "aria-disabled",

    /**
     * aria attribute to mark the dragged component hidden.
     */
    ARIA_HIDDEN : "aria-hidden",

    /**
     * aria attribute to mark the dragged component invalid.
     */
    ARIA_INVALID : "aria-invalid",

    /**
     * Event to trigger when GuideBridge Initialisation Begins
     */
    GUIDE_BRIDGE_INITIALIZE_START: "bridgeInitializeStart"
}

