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
(function (window, author, Coral, channel) {

    /**
     * Send a request to replace an existing component
     * @param {String} config.resourceType The resource type of the new paragraph.
     * @param {Object} [config.configParams] The config parameters to be set upon the new paragraph's creation.
     * @param {Object} [config.extraParams] The extra parameters (would override other params) to be set upon the new paragraph's creation.
     * @param  {String} [config.templatePath] The path to the template definition that should be used.
     * @param {Object} [editable] editable to replace
     * @param {Object} [preservedProperties] properties that will be preserved after replace
     * @return {$.Deferred} A deferred object that will be resolved when the request is completed.
     */
    let sendReplaceParagraph = function (config, editable, preservedProperties) {
        return (
            new RequestManager.PostRequest()
                .prepareReplaceParagraph(config, editable, preservedProperties)
                .send()
        );
    };

    let RequestManager = {};
    RequestManager.PostRequest = function () {
        RequestManager.Request.call(this, arguments);
        this.type = "POST"
    };
    RequestManager.Request = function (config) {
        this.params = {};
        this.url = undefined;
        if (!config)
            return;
        this.type = config.type;
        this.async = config.async;
        this.dataType = config.dataType
    };

    RequestManager.PostRequest.prototype.prepareReplaceParagraph = function (config, editable, preservedProperties) {
        if (config.templatePath) {
            let comTemplatePath = Granite.HTTP.externalize(config.templatePath),
                comData = CQ.shared.HTTP.eval(comTemplatePath + ".infinity.json"); // get component default json

            // Delete properties that are not preserved
            for (p in comData) {
                if ((!Array.isArray(comData[p]) && typeof comData[p] === 'object') || preservedProperties.includes(p)) {
                    delete comData[p];
                }
            }

            comData["sling:resourceType"] = config.resourceType;
            this.setParam(":content", JSON.stringify(comData));    // write component properties
        }

        // overwrite editable properties with component properties so that data is not lost while replace operation
        return (
            this
                .setURL(editable.path)
                .setParam("_charset_", "utf-8")
                .setParams(config.configParams)
                .setParams(config.extraParams)
                .setParam(":operation", "import")
                .setParam(":contentType", "json")
                .setParam(":replace", true)
                .setParam(":replaceProperties", true)
        );
    };

    RequestManager.PostRequest.prototype.send = function () {
        return $.ajax({
            type: this.type,
            dataType: this.dataType && this.dataType.toLowerCase() || "html",
            url: this.url,
            data: this.params,
            async: this.async
        });
    };

    RequestManager.PostRequest.prototype.setURL = function (url) {
        this.url = url;
        return this;
    };

    RequestManager.PostRequest.prototype.setDataType = function (dataType) {
        this.dataType = dataType;
        return this;
    };

    RequestManager.PostRequest.prototype.setParam = function (name, value) {
        this.params[name] = value;
        return this;
    };

    RequestManager.PostRequest.prototype.setParams = function (params) {
        if (!params) {
            return this;
        }

        let i;
        for (i in params) {
            if (params.hasOwnProperty(i)) {
                this.setParam(i, params[i]);
            }
        }
        return this;
    };

    /**
     * Replace an existing component
     * @param {Object} component The component that has to be instantiated
     * @param {Object} [editable] editable which has to be replaced
     * @param {Object} [preservedProperties] properties that will be preserved after replace
     * @return {$.Deferred} A deferred object that will be resolved when the request is completed.
     */
    window.CQ.FormsCoreComponents.editorhooks.doReplace = function (component, editable, preservedProperties) {
        let args = arguments;

        channel.trigger("cq-persistence-before-replace", args);

        return (
            sendReplaceParagraph({
                resourceType: component.getResourceType(),
                configParams: component.getConfigParams(),
                extraParams: component.getExtraParams(),
                templatePath: component.getTemplatePath()
            }, editable, preservedProperties)
                .done(function () {
                    editable.refresh();
                    channel.trigger("cq-persistence-after-replace", args);
                })
                .fail(function () {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("Paragraph replace operation failed."),
                        type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                    });
                })
        );
    };

    window.CQ.FormsCoreComponents.editorhooks.allowedCompFieldTypes = [];

})(window, Granite.author, Coral, jQuery(document));
