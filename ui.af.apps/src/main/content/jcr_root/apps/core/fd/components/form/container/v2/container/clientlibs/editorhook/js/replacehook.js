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
(function (author) {

    window.CQ.FormsCoreComponents.editorhooks.replace = function (editable) {
        deleteItemsNode(editable)
            .done(function () {
                var component = getComponent(author);
                console.log(author.components.allowedComponents.find(item =>
                    item.resourceType = "forms-components-examples/components/form/accordion").getResourceType());
                sendReplaceParagraph({
                    resourceType: component.getResourceType(),
                    configParams: component.getConfigParams(),
                    extraParams: component.getExtraParams(),
                    templatePath: component.getTemplatePath()
                }, editable)
            });
    }

    var getComponent = function (author) {
        return author.components.allowedComponents.find(item => item.resourceType = "forms-components-examples/components/form/accordion");
    }

    var deleteItemsNode = function (editable) {
        console.log('deleting');
        return (
            new author.persistence.PostRequest()
                .deleteItemsNode(editable)
                .send()
        )
    }
    author.persistence.PostRequest.prototype.deleteItemsNode = function (editable) {
        // create params to delete the items node present inside composite field node
        console.log('calling prototype for deleting');
        return (
            this
                .setURL(editable.path + "/items")
                .setParam("_charset_", "utf-8")
                .setParam(":operation", "delete")
        );
    }

    /**
     * Send a request to replace an existing component
     * @param {String} config.resourceType The resource type of the new paragraph.
     * @param {Object} [config.configParams] The config parameters to be set upon the new paragraph's creation.
     * @param {Object} [config.extraParams] The extra parameters (would override other params) to be set upon the new paragraph's creation.
     * @param  {String} [config.templatePath] The path to the template definition that should be used.
     * @param {Object} [editable] editable to replace
     * @return {$.Deferred} A deferred object that will be resolved when the request is completed.
     */
    var sendReplaceParagraph = function (config, editable) {
        return (
            new author.persistence.PostRequest()
                .prepareReplaceParagraph(config, editable)
                .send()
        );
    };

})(Granite.author);
