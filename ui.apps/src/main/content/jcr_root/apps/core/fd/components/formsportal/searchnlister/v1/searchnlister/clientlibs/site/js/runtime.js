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
    var NS = 'cmp',
        IS = 'formssearch',
        ATTR_PREFIX = "data-" + NS + "-hook-" + IS;

    var keyCodes = {
        ENTER: 13
    }

    var selectors = {
        item: {
            self: "[" + ATTR_PREFIX + "=\"item\"]",
            title: "[" + ATTR_PREFIX + "=\"itemTitle\"]",
            formLink:  "[" + ATTR_PREFIX + "=\"formLink\"]",
            description:  "[" + ATTR_PREFIX + "=\"description\"]",
        },
        results: "[" + ATTR_PREFIX + "=\"results\"]",
        searchInput: "[" + ATTR_PREFIX + "=\"input\"]",
        itemTemplate: "[" + ATTR_PREFIX + "=\"itemTemplate\"]",
        loadMore: "[" + ATTR_PREFIX + "=\"more\"]",
        sortButton: "[" + ATTR_PREFIX + "=\"sort\"]",
        filterButton: "[" + ATTR_PREFIX + "=\"filter\"]",
    };

    var addTextWithTooltip = function (element, text) {
        if (text) {
            element.appendChild(document.createTextNode(text));
            element.setAttribute("title", text);
        }
    }

    // All instances are stored in this object with key being their model's id
    var componentStore = {};

    var cleanup = function (id) {
            var componentConfig = componentStore[id];
            componentConfig.resultsNode.innerHTML = "";
            componentConfig.loadmoreNode.style.display = "inline-block";
        },
        hideLoadMore = function (id) {
            var componentConfig = componentStore[id];
            if (componentConfig.loadmoreNode) {
                componentConfig.loadmoreNode.style.display = "none";
            }
        },
        updateSearchResults = function (response, id) {
            var componentConfig = componentStore[id],
                queryResults = response.searchResults;
            componentConfig.nextOffset = queryResults.nextOffset;
            queryResults.data.forEach(function(item) {
                // choice of tag doesn't matter here because it's unwrapped
                var el = document.createElement("span");
                el.innerHTML = componentConfig.itemTemplate;
                var titleElem = el.querySelector(selectors.item.title),
                    linkElem = el.querySelector(selectors.item.formLink),
                    descElem = el.querySelector(selectors.item.description);

                addTextWithTooltip(titleElem, item.title);
                addTextWithTooltip(descElem, item.description);

                linkElem.setAttribute("href", item.formLink);
                linkElem.appendChild(document.createTextNode("HTML5"));

                componentConfig.resultsNode.innerHTML += el.innerHTML;
            })
        },
        queryFPAssets = function (id, offset) {
            var parameters = new URLSearchParams(),
                componentConfig = componentStore[id];
            if (componentConfig.inputNode && componentConfig.inputNode.value) {
                if (componentConfig.filter) {
                    parameters.append(componentConfig.filter, componentConfig.inputNode.value);
                } else {
                    parameters.append("searchText", componentConfig.inputNode.value);
                }
            }
            if (componentConfig.sort) {
                parameters.append("orderby", "name");
                parameters.append("sort", componentConfig.sort);
            }
            if (componentConfig.limit) {
                parameters.append("limit", componentConfig.limit);
            }
            if (offset) {
                parameters.append("offset", offset);
            }
            var queryPath = componentConfig.queryPath + "?" + parameters.toString();
            fetch(queryPath)
                .then(response => response.json())
                .then(data => updateSearchResults(data, id));
        },
        handleKeyPresses = function (event, id) {
            switch (event.keyCode) {
                case keyCodes.ENTER:
                    event.preventDefault();
                    cleanup(id);
                    queryFPAssets(id);
                    break;
                default:
                    return;
            }
        },
        paginateNext = function (event, id) {
            var componentConfig = componentStore[id];
            if (componentConfig.nextOffset) {
                queryFPAssets(id, componentConfig.nextOffset);
            } else {
                hideLoadMore(id);
            }
        },
        initializeSearchAndListerComponent = function (config) {
            if (componentStore[config.id]) {
                // to prevent multiple initializations of same component
                // especially needed due to presence of script inside markup tab of demo component
                return;
            }
            var componentConfig = config;

            componentConfig.componentNode = document.getElementById(config.id);
            componentConfig.resultsNode = componentConfig.componentNode.querySelector(selectors.results);
            componentConfig.inputNode = componentConfig.componentNode.querySelector(selectors.searchInput);
            componentConfig.loadmoreNode = componentConfig.componentNode.querySelector(selectors.loadMore);
            componentConfig.sortBtnNode = componentConfig.componentNode.querySelector(selectors.sortButton);
            componentConfig.filterBtnNode = componentConfig.componentNode.querySelector(selectors.filterButton);
            componentConfig.itemTemplate = componentConfig.componentNode.querySelector(selectors.itemTemplate).innerHTML;

            componentStore[config.id] = componentConfig;

            // input node, sort button and filter button are rendered conditionally
            if (componentConfig.inputNode) {
                componentConfig.inputNode.addEventListener("keydown", (event) => {
                    handleKeyPresses(event, config.id);
                });
            }
            if (componentConfig.sortBtnNode) {
                componentConfig.sortBtnNode.addEventListener("change", (event) => {
                    componentConfig.sort = componentConfig.sortBtnNode.value;
                    cleanup(config.id);
                    queryFPAssets(config.id);
                });
            }
            if (componentConfig.filterBtnNode) {
                componentConfig.filterBtnNode.addEventListener("change", (event) => {
                    componentConfig.filter = componentConfig.filterBtnNode.value;
                    cleanup(config.id);
                    queryFPAssets(config.id);
                });
            }
            componentConfig.loadmoreNode.addEventListener("click", (event) => {
                paginateNext(event, config.id)
            });

            cleanup(config.id);
            queryFPAssets(config.id);
        },
        tmpEvent = {
            detail: {
                searchAndLister: {
                    initializeComponent: initializeSearchAndListerComponent
                }
            }
        };

    // Using jQuery event api to allow multiple instances to catch this event via namespacing
    //    $(window).on("searchnlister-onload.instanceid", tmpEvent);
    // wait for window to prevent any race condition
    $(window).load(function() {
        $(window).trigger("searchnlister-onload", tmpEvent);
    });

}(jQuery));