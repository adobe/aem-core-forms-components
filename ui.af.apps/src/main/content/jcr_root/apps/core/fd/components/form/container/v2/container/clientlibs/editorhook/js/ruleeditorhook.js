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
(function ($, ns) {

    "use strict";
    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks =  window.CQ.FormsCoreComponents.editorhooks || {};
    /**
     * Opens the rule editor in a separate iframe for an editable
     * @param editable
     */
    window.CQ.FormsCoreComponents.editorhooks.openRuleEditor = function (editable) {
        let existingRuleEditorFrame = document.getElementById('af-rule-editor');
        if (existingRuleEditorFrame) {
            existingRuleEditorFrame.parentNode.removeChild(existingRuleEditorFrame);
        }
        let ruleEditorFrame = document.createElement('iframe');
        ruleEditorFrame.setAttribute('id','af-rule-editor');
        let formContainerPath = getFormContainerPath(editable);
        if (!formContainerPath) {
            if (Granite.Toggles.isEnabled("FT_FORMS-14068")) {
                showAlert(Granite.I18n.get('Information'), Granite.I18n.get('Please initialise the component to open the rule editor'));
            } else {
                showAlert();
            }
        } else {
            let ruleEditorUri = '/aem/af/expeditor.html' + getFormContainerPath(editable) + "?fieldPath=" + editable.path + "&fieldId=" + getFieldId(editable);
            if (Granite.Toggles.isEnabled("FT_FORMS-14068")) { // feature toggle for rule-editor ui service
                try {
                    const lang = document.documentElement.lang || 'en';
                    if (window.isOriginatorUnifiedShellEnabled) { // author in unified-shell then load rule-editor app using /ui
                        ruleEditorUri = '/ui/solutions/livecycle-ruleeditor-ui-service/index.html?formpath=' + getFormContainerPath(editable) + "&fieldpath=" + editable.path + "&fieldid=" + getFieldId(editable) + "&lang=" + lang;
                        ruleEditorFrame.setAttribute('src', ruleEditorUri);
                        applyRuleEditorFrameStyles(ruleEditorFrame);
                    } else { // if author is not using unified shell - local setup/admin login instead of IMS then get markup and assets from spa and replace innerhtml
                        // The spa-html-repload route provides the CORS header to HTML files, that's how Unified Shell creates srcDoc
                        ruleEditorUri = 'https://experience.adobe.com/solutions/livecycle-ruleeditor-ui-service/spa-html-preload/index.html';
                        _openRuleEditorFromSPA(ruleEditorUri, getFormContainerPath(editable), editable.path, getFieldId(editable), lang)
                            .then(function (ruleEditorContent) {
                                ruleEditorFrame.setAttribute('srcdoc', ruleEditorContent);
                                applyRuleEditorFrameStyles(ruleEditorFrame);
                            })
                            .catch(function (error) {
                                console.error('Error while opening rule editor:', error);
                                showAlert(Granite.I18n.get('Error'), Granite.I18n.get('Error occurred while opening rule editor. Please try again later.'));
                            });
                    }
                } catch (e) {
                    console.error('Error while opening rule editor: ', e);
                    showAlert(Granite.I18n.get('Error'),Granite.I18n.get('Error occurred while opening rule editor. Please try again later.'));
                }
            } else {
                ruleEditorFrame.setAttribute('src', ruleEditorUri);
                applyRuleEditorFrameStyles(ruleEditorFrame);
            }
        }
    }

    function applyRuleEditorFrameStyles(ruleEditorFrame) {
        ruleEditorFrame.setAttribute('title', 'AF Rule Editor');
        ruleEditorFrame.style.display = "block";
        ruleEditorFrame.style.width = "100%";
        ruleEditorFrame.style.height = "100%";
        ruleEditorFrame.style.top = "0";
        ruleEditorFrame.style.left = "0";
        ruleEditorFrame.style.position = "fixed";
        ruleEditorFrame.style.zIndex = "10";
        document.body.appendChild(ruleEditorFrame);
    }

    function _openRuleEditorFromSPA(ruleEditorUri, formPath, selectedFieldPath, fieldDefinitionId, lang) {
        console.debug(`rule-editor fetchUrl: ${ruleEditorUri}`);

        return getContent(ruleEditorUri).then(fetchedContent => {
            let htmlDom = new DOMParser().parseFromString(fetchedContent, 'text/html');
            const base = document.createElement('base');
            base.href = window.location.origin;
            document.getElementsByTagName('head')[0].appendChild(base);

            const ruleMetaInfoElement = document.createElement('div');
            ruleMetaInfoElement.setAttribute('id', 'rule-meta-info');
            ruleMetaInfoElement.setAttribute('data-formpath', formPath);
            ruleMetaInfoElement.setAttribute('data-fieldpath', selectedFieldPath);
            if (fieldDefinitionId) {
                ruleMetaInfoElement.setAttribute('data-fieldid', fieldDefinitionId);
            }

            const existingMetaInfo = htmlDom.getElementById('rule-meta-info');
            if (existingMetaInfo) {
                existingMetaInfo.replaceWith(ruleMetaInfoElement);
            }

            htmlDom.documentElement.lang = lang;
            return htmlDom.documentElement.outerHTML;
        });
    }

    function getContent(fetchUrl) {
        return fetch(fetchUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            });
    }

    function getFormContainerPath(editable) {
        let path = editable.dom.find("[data-cmp-adaptiveformcontainer-path]").data("cmpAdaptiveformcontainerPath");
        if (typeof path !== 'string' || !path) {
            path = getFormContainerFromDom(editable);

        }
        return path;
    }

    function getFormContainerFromDom(editable) {
        let selector = "[data-cmp-is='adaptiveFormContainer']";
        let elem = $(editable.dom[0]).closest(selector);
        let path = null;
        if (elem.length > 0) {
            path = elem.data("cmp-path");
        }
        return path;
    }

    function getFieldId(editable) {
        // todo: dead code, not used
        return editable.dom.find("[data-cmp-adaptiveformcontainer-path]").attr('id');
    }

    function showAlert(level, message) {
        const ui = $(window).adaptTo('foundation-ui');
        if (Granite.Toggles.isEnabled("FT_FORMS-14068")) {
            ui.alert(level, message, 'notice');
        } else {
            ui.alert(Granite.I18n.get('Information'), Granite.I18n.get('Please initialise the component to open the rule editor'), 'notice');
        }
    }

})(jQuery, Granite.author);
