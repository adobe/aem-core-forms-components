/*******************************************************************************
 * Copyright 2021 Adobe
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

(function($) {
    var  NS = "cmp",
         TEMPLATE = 'item-template',
         ATTR_PREFIX = "data-" + NS + "-hook-" + TEMPLATE;

    // handler for operations
    var operationHandlers = {};

    var selectors = {
        self: "[" + ATTR_PREFIX + "=\"item\"]",
        container: "[" + ATTR_PREFIX + "=\"container\"]",
        title: "[" + ATTR_PREFIX + "=\"itemTitle\"]",
        formLink:  "[" + ATTR_PREFIX + "=\"formLink\"]",
        description:  "[" + ATTR_PREFIX + "=\"description\"]",
        includes:  "[" + ATTR_PREFIX + "=\"includes\"]",
        thumbnail: "[" + ATTR_PREFIX + "=\"thumbnail\"",
        operations: "[" + ATTR_PREFIX + "=\"operations\""
    };

    var addTextWithTooltip = function (element, text, tooltip) {
        if (text) {
            element.appendChild(document.createTextNode(text));
            element.setAttribute("title", tooltip || text);
        }
    },
    linkClickHandler = function (event) {
        var link = event.currentTarget.getAttribute('link');
        window.open(link, "_blank");
    },
    operationClickHandler = function (event) {
        var operation_dataStr = event.currentTarget.getAttribute('operation_data'),
            operation_data = JSON.parse(operation_dataStr);
        operationHandlers[operation_data.name].call(this, event, operation_data);
    };

    class Menu {
        static ATTR_PREFIX = "data-cmp-hook-menu-template";
        static selectors = {
            menuContainer: "[" + Menu.ATTR_PREFIX + "=\"container\"]",
            menuItemTemplate: "[" + Menu.ATTR_PREFIX + "=\"menuItemTemplate\"]",
            list:  "[" + Menu.ATTR_PREFIX + "=\"list\"]",
            item:  "[" + Menu.ATTR_PREFIX + "=\"item\"]",
            itemLabel: "[" + Menu.ATTR_PREFIX + "=\"itemLabel\"]",
            includes:  "[" + Menu.ATTR_PREFIX + "=\"includes\"]"
        };
        constructor (menuTemplate, queryPath) {
            this.menuTemplate = menuTemplate;
            this.queryPath = queryPath;
            this.menuElement = null;
            this.containerElement = null;
        }
        static addMenuItem(operation, menuItemTemplate, listEl) {
            var el = document.createElement("span");
            el.innerHTML = menuItemTemplate;
            var item = el.querySelector(Menu.selectors.item),
                itemLabel = item.querySelector(Menu.selectors.itemLabel);
            item.setAttribute("operation_data", JSON.stringify(operation));
            addTextWithTooltip(itemLabel, operation.title);
            item.addEventListener('click', operationClickHandler);
            listEl.appendChild(item);
        }
        constructMenu () {
            // choice of tag doesn't matter here because it's unwrapped
            var el = document.createElement("span");
            el.innerHTML = this.menuTemplate;
            var menuEl = el.querySelector(Menu.selectors.menuContainer),
                menuItemTemplate = el.querySelector(Menu.selectors.menuItemTemplate).innerHTML,
                listEl = el.querySelector(Menu.selectors.list),
                operationsStr = this.containerElement.getAttribute("operations"),
                operationModelId = this.containerElement.getAttribute("operation_model_id"),
                queryPath = this.queryPath,
                operations = JSON.parse(operationsStr),
                addListItem = function (operation) {
                    operation.operation_model_id = operationModelId;
                    operation.queryPath = queryPath;
                    Menu.addMenuItem(operation, menuItemTemplate, listEl);
                };
            operations.forEach(addListItem);
            return menuEl;
        }
        show (containerElement) {
            this.containerElement = containerElement;
            this.menuElement = this.constructMenu();
            this.containerElement.appendChild(this.menuElement);
        }
        hide () {
            this.menuElement.remove();
            this.menuElement = null;
            this.containerElement = null;
        }
        showHidePopover (containerElement) {
            if (this.containerElement == containerElement) {
                // clicked on the same button again to close menu
                this.hide();
            } else if (this.menuElement) {
                // clicked on a different button, when menu was already open
                this.hide();
                this.show(containerElement);
            } else {
                // clicked on button to open menu
                this.show(containerElement);
            }
        }
    };


    var ItemAPI = {
        createAndInject: function (componentConfig, data) {
            var template = componentConfig.itemTemplate,
                container = componentConfig.resultsNode,
                menu = componentConfig.menu;
            /* data has schema:
                {
                    title,
                    description,
                    tooltip,
                    formLink,
                    thumbnailLink
                }
            */
            // choice of tag doesn't matter here because it's unwrapped
            var el = document.createElement("span");
            el.innerHTML = template;

            var item = el.querySelector(selectors.self),
                titleElem = el.querySelector(selectors.title),
                linkElem = el.querySelector(selectors.formLink),
                descElem = el.querySelector(selectors.description),
                thumbnailElem = el.querySelector(selectors.thumbnail),
                operationsElem = el.querySelector(selectors.operations),
                itemContainer = container.querySelector(selectors.container);

            addTextWithTooltip(titleElem, data.title);
            addTextWithTooltip(descElem, data.description);
            if (data.formLink) {
                linkElem.setAttribute("link", data.formLink);
                linkElem.classList.add('item-link');
                linkElem.addEventListener("click", linkClickHandler);
            }

            if (data.thumbnailLink) {
                thumbnailElem.setAttribute("src", data.thumbnailLink);
            } else {
                thumbnailElem.style.display = "none";
            }

            if (data.operations) {
                operationsElem.setAttribute("operation_model_id", data.id);
                operationsElem.setAttribute("operations", JSON.stringify(data.operations));
                operationsElem.addEventListener('click',function (event) {
                    menu.showHidePopover(operationsElem);
                });
            } else {
                operationsElem.style.display = "none";
            }

            itemContainer.appendChild(item);
        },
        init: function (config) {
            var itemTemplate = config.itemTemplate,
                container = config.resultsNode;

            //add menuTemplate if there, initialize menu for component config
            if (config.menuTemplate) {
                config.menu = new Menu(config.menuTemplate, config.queryPath);
                var el = document.createElement("span");
                el.innerHTML = config.menuTemplate;
                var menuInclude = el.querySelector(Menu.selectors.includes);
                container.appendChild(menuInclude);
            }

            // Initialize container
            var el = document.createElement("span");
            el.innerHTML = itemTemplate;

            var resultContainer = el.querySelector(selectors.container),
                includeElements = el.querySelector(selectors.includes);

            container.appendChild(includeElements);
            container.appendChild(resultContainer);
        },
        clear: function (template, container) {
            var el = document.createElement("span");
            el.innerHTML = template;

            var originalState = el.querySelector(selectors.container),
                resultContainer = container.querySelector(selectors.container);

            resultContainer.innerHTML = originalState.innerHTML;
        }
    };

    var onScriptLoad = function (event, additionalParams) {
        var componentApp = additionalParams.detail.portalLister;
        componentApp.initializeItemAPI(ItemAPI);
    };

    $(window).on("core-forms-itemapi-onload", onScriptLoad);

    var registerOperation = function (event, operationConfig) {
        operationHandlers[operationConfig.name] = operationConfig.handler;
    }

    $(window).on("core-forms-register-operation", registerOperation);
}(jQuery));