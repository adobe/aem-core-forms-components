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

/**
 * @module FormView
 */

/**
 * Constants for the core components.
 * @exports FormView/Constants
 * @namespace Constants
 */
export const Constants = {
    /**
     * Namespace of the data-attribute. Any data attribute will be prefixed with this name.
     * i.e. data-name would be data-{NS}-{ComponentClass}-name. Each component will have a different component class.
     * @type {string}
     */
    NS : "cmp",

    /**
     * Event triggered when a Form container is initialized.
     * @event module:FormView~Constants#FORM_CONTAINER_INITIALISED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of FormContainer that is initialized.
     * @example
     * document.on("AF_FormContainerInitialised" , function(event) {
     *      var formContainer = event.detail;
     *      // Handle the event
     * });
     */
    FORM_CONTAINER_INITIALISED : "AF_FormContainerInitialised",

    /**
     * Event triggered when a panel instance view is added.
     * @event module:FormView~Constants#PANEL_INSTANCE_ADDED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of child view that is added.
     * @example
     * formcontainer.getFormElement().on("AF_PanelInstanceAdded" , function(event) {
     *      var childView = event.detail;
     *      // Handle the event
     * });
     */
    PANEL_INSTANCE_ADDED : "AF_PanelInstanceAdded",

    /**
     * Event triggered when a panel instance view is removed.
     * @event module:FormView~Constants#PANEL_INSTANCE_REMOVED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of child view that was removed.
     * @example
     * formcontainer.getFormElement().on("AF_PanelInstanceRemoved" , function(event) {
     *      var childView = event.detail;
     *      // Handle the event
     * });
     */
    PANEL_INSTANCE_REMOVED : "AF_PanelInstanceRemoved",

    /**
     * Event triggered when the clientlibs for the locale passed have finished loading.
     * @event module:FormView~Constants#FORM_LANGUAGE_INITIALIZED
     * @property {object} event - The event object.
     * @property {object} event.detail - The locale that has loaded.
     * @example
     * document.on("AF_LanguageInitialised" , function(event) {
     *      var locale = event.detail;
     *      // Handle the event
     * });
     */
    FORM_LANGUAGE_INITIALIZED: "AF_LanguageInitialised",

    /**
     * Event triggered when focus is changed on a form element
     * @event module:FormView~Constants#ELEMENT_FOCUS_CHANGED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element which is in focus
     * @property {string} event.detail.fieldId - The ID of the current field in focus
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_FOCUS_CHANGED" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onFocusChange = (event) => {
     *          console.log(event.detail.fieldId) // id of the field in focus
     *          console.log(event.detail.formTitle)
     *      };
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementFocusChanged", onFocusChange);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementFocusChanged", onFocusChange);
     *           });
     *      }
     */
    ELEMENT_FOCUS_CHANGED : "elementFocusChanged",


    /**
     * Event triggered when help is shown on a form element
     * @event module:FormView~Constants#ELEMENT_HELP_SHOWN
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which help was shown.
     * @property {string} event.detail.fieldId - The ID of the field on which the help was shown.
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_HELP_SHOWN" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onHelpShown = (event) => {
     *          console.log(event.detail.fieldId) // id of the field on which help was shown
     *          console.log(event.detail.formTitle)
     *      };
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementHelpShown", onHelpShown);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementHelpShown", onHelpShown);
     *           });
     *      }
     */
    ELEMENT_HELP_SHOWN : "elementHelpShown",


    /**
     * Event triggered when error is shown on a form element.
     * @event module:FormView~Constants#ELEMENT_ERROR_SHOWN
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which error was shown
     * @property {string} event.detail.fieldId - The ID of the field on which the error was shown.
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_ERROR_SHOWN" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onErrorShown = (event) => {
     *          console.log(event.detail.fieldId) // id of the field on which error was shown
     *          console.log(event.detail.formTitle)
     *      };
     *      if (window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementErrorShown", onErrorShown);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementErrorShown", onErrorShown);
     *           });
     *      }
     */
    ELEMENT_ERROR_SHOWN : "elementErrorShown",

    /**
     * Event triggered when value is change of a form element
     * @event module:FormView~Constants#ELEMENT_VALUE_CHANGED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which error was shown
     * @property {string} event.detail.fieldId - The ID of the field on which the value has changed
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.prevText - Previous value of the form element
     * @property {string} event.detail.newText - Current value of the form element
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_VALUE_CHANGED" event.
     *      const onValueChange = (event) => {
     *          console.log(event.detail.fieldId) // id of the form element on which value has changed
     *          console.log(event.detail.formTitle)
     *      };
     *      if (window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementValueChanged", onValueChange);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementValueChanged", onValueChange);
     *           });
     *      }
     */
    ELEMENT_VALUE_CHANGED : "elementValueChanged",

    /**
     * Data attribute to store the form container path. In HTML, it will be namespaced as data-{NS}-{ComponentClass}-adaptiveformcontainerPath.
     * @type {string}
     */
    FORM_CONTAINER_DATA_ATTRIBUTE: "adaptiveformcontainerPath",

    /**
     * Data attribute to be added on clickable element to repeat a repeatable panel.
     * @type {string}
     */
    DATA_HOOK_ADD_INSTANCE:"data-cmp-hook-add-instance",

    /**
     * Data attribute to be added on element to remove a repeatable panel.
     * @type {string}
     */
    DATA_HOOK_REMOVE_INSTANCE:"data-cmp-hook-remove-instance",

    /**
     * Data attribute to mark the dragged component valid or invalid.
     * Value true for valid, value false for invalid.
     * @type {string}
     */
    DATA_ATTRIBUTE_VALID : "data-cmp-valid",

    /**
     * Data attribute to mark the dragged component enabled or disabled.
     * Value true for enabled, value false for disabled.
     * @type {string}
     */
    DATA_ATTRIBUTE_ENABLED : "data-cmp-enabled",

    /**
     * Data attribute to mark the dragged component visible or invisible.
     * Value true for visible, value false for invisible.
     * @type {string}
     */
    DATA_ATTRIBUTE_VISIBLE : "data-cmp-visible",

    /**
     * Data attribute to mark the dragged component required or not.
     * Value true for required, value false for not required.
     * @type {string}
     */
    DATA_ATTRIBUTE_REQUIRED : "data-cmp-required",

    /**
     * Data attribute to mark the dragged component readonly or not.
     * Value true for readonly, value false for not readonly.
     * @type {string}
     */
    DATA_ATTRIBUTE_READONLY : "data-cmp-readonly",

    /**
     * Data attribute to mark the dragged component active or inactive.
     * Value true for active, value false for inactive.
     * @type {string}
     */
    DATA_ATTRIBUTE_ACTIVE : "data-cmp-active",

    /**
     * ARIA attribute to mark the dragged component disabled.
     * @type {string}
     */
    ARIA_DISABLED : "aria-disabled",

    /**
     * ARIA attribute to mark the dragged component hidden.
     * @type {string}
     */
    ARIA_HIDDEN : "aria-hidden",

    /**
     * ARIA attribute to mark the dragged component invalid.
     * @type {string}
     */
    ARIA_INVALID : "aria-invalid",

    /**
     * ARIA attribute to mark the dragged component checked.
     * @type {string}
     */
    ARIA_CHECKED : "aria-checked",

    /**
     * ARIA attribute to mark component selected.
     * @type {string}
     */
    ARIA_SELECTED : "aria-selected",

    /**
     * Event triggered when GuideBridge initialization begins.
     * @event module:FormView~Constants#GUIDE_BRIDGE_INITIALIZE_START
     * @property {object} event - The event object.
     * @property {object} event.detail.guideBridge - The guideBridge {@link GuideBridge} object
     * @type {string}
     * @example
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *           });
     *      }
     */
    GUIDE_BRIDGE_INITIALIZE_START: "bridgeInitializeStart",

    /**
     * HTML attributes.
     * @type {object}
     * @memberof module:FormView~Constants
     * @namespace HTML_ATTRS
     */
    HTML_ATTRS : {
        /**
         * Attribute to mark the dragged component disabled.
         * @type {string}
         */
        DISABLED : "disabled",

        /**
         * Attribute to mark the dragged component checked.
         * @type {string}
         */
        CHECKED : "checked"
    },

    /**
     * Tab index attribute.
     * @type {string}
     */
    TABINDEX : "tabindex",

    /**
     * Prefix path for all AF HTTP APIs.
     * @type {string}
     */
    API_PATH_PREFIX : "/adobe/forms/af"
};

