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
    // time related functionality
    var DATE_FORMATTER;

    const DIVISIONS = [
        { amount: 60, name: 'seconds' },
        { amount: 60, name: 'minutes' },
        { amount: 24, name: 'hours' },
        { amount: 7, name: 'days' },
        { amount: 4.34524, name: 'weeks' },
        { amount: 12, name: 'months' },
        { amount: Number.POSITIVE_INFINITY, name: 'years' }
    ];

    const OP_ICON_DESC = "Click to open menu";

    var formatTimeAgo = function (date, formatter) {
        var duration = (date - new Date()) / 1000
        for (let i = 0; i <= DIVISIONS.length; i++) {
            const division = DIVISIONS[i];
            if (Math.abs(duration) < division.amount) {
              return formatter.format(Math.round(duration), division.name);
            }
            duration /= division.amount;
        }
    };

    var  NS = "cmp",
         TEMPLATE = 'item-template',
         ERROR_CLASS = 'cmp-portallister__item--error',
         ATTR_PREFIX = "data-" + NS + "-hook-" + TEMPLATE,
         ATTR_PREFIX_MENU = "data-" + NS + "-hook-menu-template";

    // handler for operations
    var operationHandlers = {};

    var selectors = {
        self: "[" + ATTR_PREFIX + "=\"item\"]",
        container: "[" + ATTR_PREFIX + "=\"container\"]",
        title: "[" + ATTR_PREFIX + "=\"itemTitle\"]",
        formLink:  "[" + ATTR_PREFIX + "=\"formLink\"]",
        description:  "[" + ATTR_PREFIX + "=\"description\"]",
        includes:  "[" + ATTR_PREFIX + "=\"includes\"]",
        thumbnail: "[" + ATTR_PREFIX + "=\"thumbnail\"]",
        operations: "[" + ATTR_PREFIX + "=\"operations\"]",
        timeinfo: "[" + ATTR_PREFIX + "=\"timeinfo\"]"
    };

    var addTextWithTooltip = function (element, text, tooltip) {
        if (text) {
            element.appendChild(document.createTextNode(text));
            element.setAttribute("title", tooltip || text);
        }
    },
    addDateWithTooltip = function (element, dateInMillis) {
        var dt = new Date(Number.parseInt(dateInMillis)), tooltip = dt.toLocaleString(), text = dt.toDateString();
        if (window.Intl) {
            // not supported in I.E, so don't make relative dates there
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
            // automatically handles browser locale and timezone
            DATE_FORMATTER = DATE_FORMATTER || new Intl.RelativeTimeFormat(undefined, {
                                                 numeric: 'auto'
                                               });
            text = formatTimeAgo(dt, DATE_FORMATTER);
        }
        element.appendChild(document.createTextNode(text));
        element.setAttribute("title", tooltip);
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

    var Menu = {
        selectors: {
            menuContainer: "[" + ATTR_PREFIX_MENU + "=\"container\"]",
            menuItemTemplate: "[" + ATTR_PREFIX_MENU + "=\"menuItemTemplate\"]",
            list:  "[" + ATTR_PREFIX_MENU + "=\"list\"]",
            item:  "[" + ATTR_PREFIX_MENU + "=\"item\"]",
            itemLabel: "[" + ATTR_PREFIX_MENU + "=\"itemLabel\"]",
            includes:  "[" + ATTR_PREFIX_MENU + "=\"includes\"]"
        },
        constructor: function (menuTemplate, queryPath) {
            var MenuInstance = Menu || {};
            MenuInstance.menuTemplate = menuTemplate;
            MenuInstance.queryPath = queryPath;
            MenuInstance.menuElement = null;
            MenuInstance.containerElement = null;
            return MenuInstance;
        },
        addMenuItem: function (operation, menuItemTemplate, listEl) {
            var el = document.createElement("span");
            el.innerHTML = menuItemTemplate;
            var item = el.querySelector(Menu.selectors.item),
                itemLabel = item.querySelector(Menu.selectors.itemLabel);
            item.setAttribute("operation_data", JSON.stringify(operation));
            addTextWithTooltip(itemLabel, operation.title);
            item.addEventListener('click', operationClickHandler);
            listEl.appendChild(item);
        },
        constructMenu: function () {
            // choice of tag doesn't matter here because it's unwrapped
            var el = document.createElement("span");
            el.innerHTML = Menu.menuTemplate;
            var menuEl = el.querySelector(Menu.selectors.menuContainer),
                menuItemTemplate = el.querySelector(Menu.selectors.menuItemTemplate).innerHTML,
                listEl = el.querySelector(Menu.selectors.list),
                operationsStr = Menu.containerElement.getAttribute("operations"),
                operationModelId = Menu.containerElement.getAttribute("operation_model_id"),
                queryPath = Menu.queryPath,
                operations = JSON.parse(operationsStr),
                addListItem = function (operation) {
                    operation.operation_model_id = operationModelId;
                    operation.queryPath = queryPath;
                    Menu.addMenuItem(operation, menuItemTemplate, listEl);
                };
            operations.forEach(addListItem);
            return menuEl;
        },
        show: function (containerElement) {
            Menu.containerElement = containerElement;
            Menu.menuElement = Menu.constructMenu();
            Menu.containerElement.appendChild(Menu.menuElement);
        },
        hide: function () {
            Menu.menuElement.remove();
            Menu.menuElement = null;
            Menu.containerElement = null;
        },
        showHidePopover: function (containerElement) {
            if (Menu.containerElement == containerElement) {
                // clicked on the same button again to close menu
                Menu.hide();
            } else if (Menu.menuElement) {
                // clicked on a different button, when menu was already open
                Menu.hide();
                Menu.show(containerElement);
            } else {
                // clicked on button to open menu
                Menu.show(containerElement);
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
                timeInfoElem = el.querySelector(selectors.timeinfo),
                itemContainer = container.querySelector(selectors.container);

            addTextWithTooltip(titleElem, data.title);
            addTextWithTooltip(descElem, data.description);
            if (data.formLink) {
                linkElem.setAttribute("link", data.formLink);
                linkElem.classList.add('item-link');
                linkElem.addEventListener("click", linkClickHandler);

                if (data.tooltip) {
                    linkElem.setAttribute("title", data.tooltip);
                }
            }
            else {
                item.classList.add(ERROR_CLASS);
            }

            if (data.thumbnailLink) {
                thumbnailElem.setAttribute("src", data.thumbnailLink);
            } else {
                thumbnailElem.style.display = "none";
            }

            if (data.operations) {
                operationsElem.setAttribute("operation_model_id", data.id);
                operationsElem.setAttribute("title", OP_ICON_DESC);
                operationsElem.setAttribute("aria-label", OP_ICON_DESC);
                operationsElem.setAttribute("operations", JSON.stringify(data.operations));
                operationsElem.addEventListener('click',function (event) {
                    menu.showHidePopover(operationsElem);
                });
            } else if (operationsElem) {
                operationsElem.style.display = "none";
            }

            if (data.lastModified && timeInfoElem) {
                addDateWithTooltip(timeInfoElem, data.lastModified);
            }
            itemContainer.appendChild(item);
        },
        init: function (config) {
            var itemTemplate = config.itemTemplate,
                container = config.resultsNode;

            //add menuTemplate if there, initialize menu for component config
            if (config.menuTemplate) {
                config.menu = Menu.constructor(config.menuTemplate, config.queryPath);
                var elI = document.createElement("span");
                elI.innerHTML = config.menuTemplate;
                var menuInclude = elI.querySelector(Menu.selectors.includes);
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