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

(function() {
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

    var componentConfig,
        componentNode, resultsNode, itemTemplate, inputNode, loadmoreNode,
        sortBtnNode, filterBtnNode,
        cleanup = function () {
            resultsNode.innerHTML = "";
            loadmoreNode.style.display = "block";
        },
        hideLoadMore = function () {
            if (loadmoreNode) {
                loadmoreNode.style.display = "none";
            }
        }
        updateSearchResults = function (queryResults) {
            console.log(queryResults);
            componentConfig.nextOffset = queryResults.nextOffset;
            queryResults.data.forEach(function(item) {
                // choice of tag doesn't matter here because it's unwrapped
                var el = document.createElement("span");
                el.innerHTML = itemTemplate;
                var titleElem = el.querySelector(selectors.item.title),
                    linkElem = el.querySelector(selectors.item.formLink),
                    descElem = el.querySelector(selectors.item.description);

                addTextWithTooltip(titleElem, item.title);
                addTextWithTooltip(descElem, item.description);

                linkElem.setAttribute("href", item.path);
                linkElem.appendChild(document.createTextNode("HTML5"));

                resultsNode.innerHTML += el.innerHTML;
            })
        },
        queryFPAssets = function (offset) {
            var parameters = new URLSearchParams();
            if (inputNode && inputNode.value) {
                parameters.append("searchText", inputNode.value);
                if (componentConfig.filter) {
                    parameters.append(componentConfig.filter, inputNode.value);
                }
            }
            if (componentConfig.sort) {
                parameters.append("orderby", "name");
                parameters.append("sort", componentConfig.sort);
            }
            if (componentConfig.paths) {
                componentConfig.paths.forEach(function(path) {
                    parameters.append("path", path);
                });
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
                .then(data => updateSearchResults(data));
        },
        handleKeyPresses = function (event) {
            switch (event.keyCode) {
                case keyCodes.ENTER:
                    event.preventDefault();
                    cleanup();
                    queryFPAssets();
                    break;
                default:
                    return;
            }
        },
        paginateNext = function () {
            if (componentConfig.nextOffset) {
                queryFPAssets(componentConfig.nextOffset);
            } else {
                loadmoreNode.style.display = "none";
            }
        },
        initializeSearchAndListerComponent = function (config) {
            componentConfig = config;
            if (componentConfig.paths && typeof(componentConfig.paths) === "string") {
                componentConfig.paths = componentConfig.paths.split(",");
            }
            componentNode = document.getElementById(config.id);
            resultsNode = componentNode.querySelector(selectors.results);
            inputNode = componentNode.querySelector(selectors.searchInput);
            loadmoreNode = componentNode.querySelector(selectors.loadMore);
            sortBtnNode = componentNode.querySelector(selectors.sortButton);
            filterBtnNode = componentNode.querySelector(selectors.filterButton);
            itemTemplate = componentNode.querySelector(selectors.itemTemplate).innerHTML;

            if (inputNode) {
                inputNode.addEventListener("keydown", handleKeyPresses);
            }
            if (sortBtnNode) {
                sortBtnNode.addEventListener("change", (event) => {
                    cleanup();
                    componentConfig.sort = sortBtnNode.value;
                    queryFPAssets();
                });
            }
            if (filterBtnNode) {
                filterBtnNode.addEventListener("change", (event) => {
                    cleanup();
                    componentConfig.filter = filterBtnNode.value;
                    queryFPAssets();
                })
            }
            loadmoreNode.addEventListener("click", paginateNext);

            cleanup();
            queryFPAssets();
        },
        tmpEvent = new CustomEvent("searchnlister-onload", {
            detail: {
                searchAndLister: {
                    initializeComponent: initializeSearchAndListerComponent
                }
            }
        });

    // Using newer CustomEvent api instead of deprecated initCustomEvent
    window.dispatchEvent(tmpEvent);

}());