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
import Utils from "./utils.js";
import LanguageUtils from "./LanguageUtils.js";
import {createFormInstance, FileObject, extractFileInfo, Click, Change, Submit, Blur, AddItem, RemoveItem} from "@aemforms/af-core";
import {FormField, FormContainer, FormFieldBase, FormPanel, FormTabs, FormCheckBox} from "./view/index.js";
import {Constants} from "./constants.js";
import GuideBridge from "./GuideBridge.js";
import HTTPAPILayer from "./HTTPAPILayer.js";
import {formatDate, parseDate} from "@aemforms/af-formatters";
import {FunctionRuntime} from '@aemforms/af-core';

/**
 * The `FormView` module provides access to all the helper functions and exposes
 * the form model defined by the core runtime model.
 *
 * @module FormView
 */

/**
 * The `guideBridge` object represents the GuideBridge instance.
 * @type {GuideBridge}
 */
window.guideBridge = new GuideBridge();

/**
 * The `Actions` object contains predefined action constants.
 * @type {object}
 * @property {string} Click - The action for a click event.
 * @property {string} Change - The action for a change event.
 * @property {string} Submit - The action for a submit event.
 * @property {string} Blur - The action for a blur event.
 * @property {string} AddItem - The action for adding an item.
 * @property {string} RemoveItem - The action for removing an item.
 */
const Actions = {
    Click, Change, Submit, Blur, AddItem, RemoveItem
}

/**
 * The `Formatters` object contains predefined formatter functions.
 * @type {object}
 * @property {function} formatDate - The function for formatting a date.
 * @property {function} parseDate - The function for parsing a date.
 */
const Formatters = {
    formatDate, parseDate
}

/**
 * The `FileAttachmentUtils` object provides utility functions for file attachments.
 * @type {object}
 * @property {function} FileObject - The constructor function for a file object.
 * @property {function} extractFileInfo - The function for extracting file information.
 */
const FileAttachmentUtils = {
    FileObject, extractFileInfo
};

/**
 * The `createFormInstance` function creates a new form instance.
 * @function createFormInstance
 * @returns {object} - The created form instance.
 */


export {createFormInstance, FormTabs, FormField, FormFieldBase, FormPanel, FormContainer, Constants, Utils, Actions, HTTPAPILayer, FileAttachmentUtils, Formatters, LanguageUtils, FunctionRuntime, FormCheckBox};
