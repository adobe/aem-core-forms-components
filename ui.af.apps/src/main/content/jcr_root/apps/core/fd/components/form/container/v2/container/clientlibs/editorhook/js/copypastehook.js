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
(function(author){

    const FORM_CONTAINER_SELECTOR = ".cmp-adaptiveform-container";

    var _superPrepareCopyParagraph = author.persistence.PostRequest.prototype.prepareCopyParagraph;
    /**
     * Overriding the default copy behavior of AEM, since we need to generate unique name
     * for all AF fields and need to notify about possible side effects during copy-paste
     * @param config
     */
    author.persistence.PostRequest.prototype.prepareCopyParagraph = function (config) {
        var request = _superPrepareCopyParagraph.apply(this, [config]),
            nodeNameToCopy = config.path.substring(config.path.lastIndexOf("/") + 1);
        if (config.parentPath 
            && author.editables.find(config.parentPath)[0].dom.closest(FORM_CONTAINER_SELECTOR).length > 0) {
            var uniqueName = getUniqueName(config.parentPath, nodeNameToCopy);
            return (
                this.setParam("./name", uniqueName)
                    .setParam("./dataRef@Delete", "deleted value")
            );
        } else {
            return (
                this.setParam("./dataRef@Delete", "deleted value")
            );
        }
    };

    getUniqueName = function (path, nodeNameToCopy) {
        var resourceExistSelector = ".fdResourceExists.json?childNodeName=" + nodeNameToCopy,
            url = path + resourceExistSelector,
            response = CQ.shared.HTTP.get(url);
        return JSON.parse(response.responseText).uniqueName;
    }
})(Granite.author);
