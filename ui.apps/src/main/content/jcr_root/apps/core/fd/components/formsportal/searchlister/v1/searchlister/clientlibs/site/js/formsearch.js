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
        results: "[" + ATTR_PREFIX + "=\"results\"]",
        searchInput: "[" + ATTR_PREFIX + "=\"input\"]",
        itemTemplate: "[" + ATTR_PREFIX + "=\"itemTemplate\"]",
        loadMore: "[" + ATTR_PREFIX + "=\"more\"]",
        sortButton: "[" + ATTR_PREFIX + "=\"sort\"]",
        filterButton: "[" + ATTR_PREFIX + "=\"filter\"]",
        self: "[data-" + NS + '-is="' + IS + '"]',
    };

    // All instances are stored in the store object with key being their model's id
    // and ItemAPI is used for item creation and injection
    var componentStore = {}, ItemAPI;

    var cleanup = function (id) {
            var componentConfig = componentStore[id];
            ItemAPI.clear(componentConfig.itemTemplate, componentConfig.resultsNode);
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
                ItemAPI.createAndInject(componentConfig, item);
            });
        },
        queryFPAssets = function (id, offset) {
            var parameters = new URLSearchParams(),
                componentConfig = componentStore[id];
            if (componentConfig.inputNode && componentConfig.inputNode.value) {
                // Filtering to come with Advanced Search
                // if (componentConfig.filter) {
                //     parameters.append(componentConfig.filter, componentConfig.inputNode.value);
                // }
                parameters.append("searchText", componentConfig.inputNode.value);
            }
            if (componentConfig.sort) {
                parameters.append("orderby", "title");
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
            if (componentConfig.nextOffset && componentConfig.nextOffset > 0) {
                queryFPAssets(id, componentConfig.nextOffset);
            } else {
                hideLoadMore(id);
            }
        },
        initializeSearchAndListerInstance = function (config) {
            if (componentStore[config.id]) {
                // to prevent multiple initializations of same component
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

            ItemAPI.init(componentConfig);

            cleanup(config.id);
            queryFPAssets(config.id);
        },
        queryDomForAllInstances = function () {
            // This function should execute after DOM is safe to manipulate
            // and we've received ItemAPI, i.e some equivalent of $.ready
            var elements = document.querySelectorAll(selectors.self);
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                initializeSearchAndListerInstance({
                    "id": element.getAttribute("id"),
                    "queryPath": element.getAttribute("data-queryPath")
                })
            }
        },
        initializeItemAPI = function (api) {
            if (!ItemAPI) {
                ItemAPI = api;
                queryDomForAllInstances();
            }
        },
        tmpEvent = {
            detail: {
                portalLister: {
                    initializeItemAPI: initializeItemAPI,
                }
            }
        };

    // Using jQuery event api trigger on $.ready
    // wait for window load to prevent any race condition
    $(function() {
        $(window).trigger("core-forms-itemapi-onload", tmpEvent);
    });

}(jQuery));