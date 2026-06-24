/*******************************************************************************
 * Copyright 2026 Adobe
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
(function (window, $) {
    "use strict";

    const author = (window.Granite && window.Granite.author) ? window.Granite.author : null;
    const FORM_CONTAINER_SELECTOR = "[data-cmp-is='adaptiveFormContainer']";

    const FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES = {
        "fd/afaddon/components/esign": "core/fd/components/form/signaturestep/v1/signaturestep",
        "fd/afaddon/components/summary": "core/fd/components/form/summarystep/v1/summarystep",
        "fd/afaddon/components/adobeSignBlock": "core/fd/components/form/adobesignblock/v1/adobesignblock"
    };

    const CORE_FORM_CONTAINER_RESOURCE_TYPES = [
        "core/fd/components/form/container/v2/container",
        "core/fd/components/form/container/v1/container"
    ];

    function isFoundationSigningResourceType(resourceType) {
        return !!resourceType && Object.prototype.hasOwnProperty.call(
            FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES,
            resourceType
        );
    }

    function toCoreSigningResourceType(resourceType) {
        if (!resourceType) {
            return resourceType;
        }
        return FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES[resourceType] || resourceType;
    }

    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks = window.CQ.FormsCoreComponents.editorhooks || {};
    window.CQ.FormsCoreComponents.editorhooks.toCoreSigningResourceType = toCoreSigningResourceType;

    function hasCoreFormContainerInContentFrame(doc) {
        if (!doc) {
            return false;
        }
        const $doc = $(doc);
        return $doc.find(FORM_CONTAINER_SELECTOR).length > 0
            || $doc.find("[data-cmp-is='formcontainer']").length > 0
            || $doc.find("[data-cmp-adaptiveformcontainer-path]").length > 0;
    }

    function hasCoreFormContainerEditable() {
        if (!author || !author.editables || typeof author.editables.find !== "function") {
            return false;
        }

        return CORE_FORM_CONTAINER_RESOURCE_TYPES.some(function (resourceType) {
            const matches = author.editables.find({ resourceType: resourceType });
            return matches && matches.length > 0;
        });
    }

    function isCoreComponentsBasedForm() {
        if (window.guidelib && window.guidelib.touchlib && window.guidelib.touchlib.utils
            && typeof window.guidelib.touchlib.utils.checkIfCoreComponentsBasedForm === "function"
            && window.guidelib.touchlib.utils.checkIfCoreComponentsBasedForm()) {
            return true;
        }
        if (author && author.afUtils && typeof author.afUtils.checkIfCoreComponentsBasedForm === "function"
            && author.afUtils.checkIfCoreComponentsBasedForm()) {
            return true;
        }

        if (author && author.ContentFrame && author.ContentFrame.getDocument) {
            const contentFrameDocument = author.ContentFrame.getDocument();
            if (contentFrameDocument && contentFrameDocument.length > 0
                && hasCoreFormContainerInContentFrame(contentFrameDocument[0])) {
                return true;
            }
        }

        if (window._afAuthorHook && typeof window._afAuthorHook._getAfWindow === "function") {
            const afWindow = window._afAuthorHook._getAfWindow();
            if (afWindow && afWindow.document && hasCoreFormContainerInContentFrame(afWindow.document)) {
                return true;
            }
        }

        return hasCoreFormContainerEditable();
    }

    function remapSigningPath(path) {
        if (!path || typeof path !== "string") {
            return path;
        }
        let remapped = path;
        Object.keys(FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES).forEach(function (foundationRt) {
            if (remapped.indexOf(foundationRt) !== -1) {
                remapped = remapped.split(foundationRt).join(FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES[foundationRt]);
            }
        });
        return remapped;
    }

    function remapSigningContentPayload(content) {
        if (!content || typeof content !== "object") {
            return;
        }

        delete content.guideNodeClass;

        if (content._value !== undefined && content.value === undefined) {
            content.value = content._value;
            delete content._value;
        }
    }

    function remapSigningContentTree(content) {
        if (!content || typeof content !== "object") {
            return false;
        }

        let changed = false;

        if (isFoundationSigningResourceType(content["sling:resourceType"])) {
            content["sling:resourceType"] = toCoreSigningResourceType(content["sling:resourceType"]);
            remapSigningContentPayload(content);
            changed = true;
        }

        if (content.items && typeof content.items === "object") {
            Object.keys(content.items).forEach(function (key) {
                if (remapSigningContentTree(content.items[key])) {
                    changed = true;
                }
            });
        }

        return changed;
    }

    window.CQ.FormsCoreComponents.editorhooks.remapSigningContentPayload = remapSigningContentPayload;

    function remapPostParamValue(name, value) {
        if (value === undefined || value === null) {
            return value;
        }

        if (name === "./sling:resourceType" || name === "sling:resourceType") {
            return isFoundationSigningResourceType(value) ? toCoreSigningResourceType(value) : value;
        }

        if ((name === "./@CopyFrom" || name.indexOf("@CopyFrom") !== -1) && typeof value === "string") {
            return remapSigningPath(value);
        }

        if (name === ":content" && typeof value === "string") {
            try {
                const content = JSON.parse(value);
                if (remapSigningContentTree(content)) {
                    return JSON.stringify(content);
                }
            } catch (e) {
                // Not JSON content.
            }
        }

        return value;
    }

    function remapPostParams(params) {
        if (!params || !isCoreComponentsBasedForm()) {
            return;
        }

        Object.keys(params).forEach(function (name) {
            params[name] = remapPostParamValue(name, params[name]);
        });
    }

    if (!author || !author.persistence || !author.persistence.PostRequest) {
        return;
    }

    const PostRequest = author.persistence.PostRequest;

    if (PostRequest.prototype) {
        const _superSetParam = PostRequest.prototype.setParam;
        const _superSetParams = PostRequest.prototype.setParams;
        const _superSend = PostRequest.prototype.send;

        PostRequest.prototype.setParam = function (name, value) {
            if (isCoreComponentsBasedForm()) {
                value = remapPostParamValue(name, value);
            }
            return _superSetParam.call(this, name, value);
        };

        PostRequest.prototype.setParams = function (params) {
            if (isCoreComponentsBasedForm() && params) {
                remapPostParams(params);
            }
            return _superSetParams.call(this, params);
        };

        PostRequest.prototype.send = function () {
            if (isCoreComponentsBasedForm() && this.params) {
                remapPostParams(this.params);
            }
            return _superSend.apply(this, arguments);
        };

        if (typeof PostRequest.prototype.prepareCreateParagraph === "function") {
            const _superPrepareCreateParagraph = PostRequest.prototype.prepareCreateParagraph;
            PostRequest.prototype.prepareCreateParagraph = function (config) {
                if (isCoreComponentsBasedForm() && config && isFoundationSigningResourceType(config.resourceType)) {
                    config.resourceType = toCoreSigningResourceType(config.resourceType);
                    if (config.templatePath) {
                        config.templatePath = remapSigningPath(config.templatePath);
                    }
                }
                return _superPrepareCreateParagraph.call(this, config);
            };
        }

        if (typeof PostRequest.prototype.prepareCopyParagraph === "function") {
            const _superPrepareCopyParagraph = PostRequest.prototype.prepareCopyParagraph;
            PostRequest.prototype.prepareCopyParagraph = function (config) {
                const request = _superPrepareCopyParagraph.apply(this, arguments);

                if (!isCoreComponentsBasedForm() || !config || !config.path) {
                    return request;
                }

                try {
                    const nodeData = window.CQ && window.CQ.shared && window.CQ.shared.HTTP
                        ? window.CQ.shared.HTTP.eval(config.path + ".infinity.json")
                        : null;
                    const resourceType = nodeData && nodeData["sling:resourceType"];

                    if (isFoundationSigningResourceType(resourceType)) {
                        this.setParam("./sling:resourceType", toCoreSigningResourceType(resourceType));

                        if (nodeData._value !== undefined && nodeData.value === undefined) {
                            this.setParam("./value", nodeData._value);
                            this.setParam("./_value@Delete", "deleted value");
                        }
                        if (nodeData.guideNodeClass !== undefined) {
                            this.setParam("./guideNodeClass@Delete", "deleted value");
                        }
                    }
                } catch (e) {
                    // Keep default copy behavior when source lookup fails.
                }

                return request;
            };
        }
    }

    function remapInsertComponentArgument(value) {
        if (typeof value !== "string") {
            return value;
        }

        if (isFoundationSigningResourceType(value)) {
            return toCoreSigningResourceType(value);
        }

        return remapSigningPath(value);
    }

    function wrapInsertExecute(insertAction) {
        if (!insertAction || typeof insertAction.execute !== "function" || insertAction._coreSigningInsertHooked) {
            return;
        }

        const originalExecute = insertAction.execute;

        insertAction.execute = function () {
            if (isCoreComponentsBasedForm()) {
                for (let i = 0; i < arguments.length; i++) {
                    arguments[i] = remapInsertComponentArgument(arguments[i]);
                }
            }
            return originalExecute.apply(this, arguments);
        };

        insertAction._coreSigningInsertHooked = true;
    }

    function installInsertHooks() {
        if (author && author.edit) {
            wrapInsertExecute(author.edit.EditableActions && author.edit.EditableActions.INSERT);
            wrapInsertExecute(author.edit.ToolbarActions && author.edit.ToolbarActions.INSERT);
        }
    }

    function remapAjaxData(data) {
        if (!data) {
            return data;
        }

        if (typeof data === "string") {
            let remapped = data;
            Object.keys(FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES).forEach(function (foundationRt) {
                const coreRt = FOUNDATION_TO_CORE_SIGNING_RESOURCE_TYPES[foundationRt];
                remapped = remapped.split(encodeURIComponent(foundationRt)).join(encodeURIComponent(coreRt));
                remapped = remapped.split(foundationRt).join(coreRt);
            });
            return remapped;
        }

        if (typeof data === "object") {
            remapPostParams(data);
        }

        return data;
    }

    $(document).ajaxSend(function (event, jqXHR, settings) {
        if (!isCoreComponentsBasedForm() || !settings) {
            return;
        }

        const requestType = (settings.type || "GET").toUpperCase();
        if (requestType !== "POST") {
            return;
        }

        settings.data = remapAjaxData(settings.data);
    });

    function installDataDropHook() {
        const dataObjects = window.guidelib
            && window.guidelib.touchlib
            && window.guidelib.touchlib.editLayer
            && window.guidelib.touchlib.editLayer.editLayerDataObjects;

        if (!dataObjects || typeof dataObjects.handleDataDrop !== "function"
            || dataObjects._coreSigningDataDropHooked) {
            return;
        }

        const originalHandleDataDrop = dataObjects.handleDataDrop;

        dataObjects.handleDataDrop = function (event) {
            if (isCoreComponentsBasedForm() && event && event.dragTarget && event.dragTarget.dataset
                && event.dragTarget.dataset.xpathtype) {
                const sourceContent = this.getXpathJson(event.dragTarget.dataset.xpathtype.substring(1));
                if (sourceContent) {
                    remapSigningContentTree(sourceContent);
                }
            }
            return originalHandleDataDrop.apply(this, arguments);
        };

        dataObjects._coreSigningDataDropHooked = true;
    }

    function installHooks() {
        installInsertHooks();
        installDataDropHook();
    }

    $(document).on("cq-layer-activated", installHooks);
    $(document).ready(installHooks);

    if (author && typeof author.on === "function") {
        author.on("cq-editor-loaded", installHooks);
    }

})(window, jQuery);
