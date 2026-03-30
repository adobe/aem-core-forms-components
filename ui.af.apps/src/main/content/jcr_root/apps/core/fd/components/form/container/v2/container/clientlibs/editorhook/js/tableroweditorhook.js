/*******************************************************************************
 * Copyright 2024 Adobe
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
(function (window, author, $, Coral) {
    "use strict";

    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks = window.CQ.FormsCoreComponents.editorhooks || {};

    var RESOURCE_TYPE_TABLEROW = "core/fd/components/form/tablerow/v1/tablerow";
    var RESOURCE_TYPE_TEXTINPUT = "core/fd/components/form/textinput/v1/textinput";
    var DELETE_ROW_DIALOG_ID = "core-forms-delete-table-row-dialog";

    function getEditableDom(editable) {
        if (editable.dom && editable.dom.length) {
            return editable.dom;
        }
        if (editable.element && editable.element.dom) {
            return editable.element.dom;
        }
        return $();
    }

    /**
     * Wrapper for the row in the authoring DOM (data vs header).
     * @param {Granite.author.Editable} editable
     * @returns {jQuery}
     */
    function getRowWrapper(editable) {
        var $dom = $(getEditableDom(editable));
        var $row = $dom.closest(".cmp-adaptiveform-tablerow, .cmp-adaptiveform-tableheader");
        if ($row.length) {
            return $row;
        }
        return $dom.closest(".cmp-adaptiveform-table__body > *, .cmp-adaptiveform-table__head > *");
    }

    /**
     * Path of the row resource (direct child of table parent), not a nested cell.
     * @param {jQuery} $row row wrapper in the authoring DOM
     * @param {string} tableParentPath editable.getParentPath() of the selected row
     * @returns {string|null}
     */
    function getRowPathUnderTableParent($row, tableParentPath) {
        if (!$row || !$row.length || !tableParentPath) {
            return null;
        }
        var normalizedParent = tableParentPath.replace(/\/$/, "");
        var prefix = normalizedParent + "/";
        var $cur = $row;
        var depth;
        for (depth = 0; depth < 20 && $cur.length; depth++) {
            var p = $cur.attr("data-cq-data-path") ||
                $cur.attr("data-path") ||
                $cur.attr("data-editpath") ||
                $cur.attr("data-ajax-viewable");
            if (typeof p === "string") {
                try {
                    p = decodeURIComponent(p);
                } catch (e) {
                    // ignore
                }
                if (p.indexOf(prefix) === 0) {
                    var rest = p.substring(prefix.length);
                    if (rest.indexOf("/") === -1) {
                        return p;
                    }
                }
            }
            $cur = $cur.parent();
        }
        return null;
    }

    /**
     * Ordered child node names under the table parent (JCR order from Sling .1.json).
     * Supports direct children, :items + :itemsOrder (responsive / container JSON).
     * @param {object} parentJson
     * @returns {string[]}
     */
    function getOrderedChildResourceNames(parentJson) {
        if (!parentJson || typeof parentJson !== "object") {
            return [];
        }
        function isResourceChild(key, obj) {
            if (!key || key.indexOf("jcr:") === 0 || key.indexOf("sling:") === 0 || key.indexOf("cq:") === 0) {
                return false;
            }
            if (key.charAt(0) === ":") {
                return false;
            }
            var v = obj[key];
            return !!(v && typeof v === "object" && !Array.isArray(v) && v["sling:resourceType"]);
        }
        var container = parentJson[":items"] && typeof parentJson[":items"] === "object"
            ? parentJson[":items"]
            : parentJson;
        var order = parentJson[":itemsOrder"];
        if (Array.isArray(order) && order.length) {
            return order.filter(function (key) {
                return isResourceChild(key, container);
            });
        }
        var names = [];
        Object.keys(container).forEach(function (key) {
            if (isResourceChild(key, container)) {
                names.push(key);
            }
        });
        if (names.length === 0 && parentJson[":items"] && container === parentJson[":items"]) {
            Object.keys(parentJson).forEach(function (key) {
                if (isResourceChild(key, parentJson)) {
                    names.push(key);
                }
            });
        }
        return names;
    }

    /**
     * When DOM has no path on sibling wrappers, resolve neighbor name from repository order.
     * @param {string} tableParentPath
     * @param {Granite.author.Editable} editable
     * @param {"up"|"down"} direction
     * @returns {jQuery.jqXHR|JQuery.Promise}
     */
    function fetchNeighborNameFromParentJson(tableParentPath, editable, direction) {
        var myName = editable.path.substring(editable.path.lastIndexOf("/") + 1);
        return $.ajax({
            url: Granite.HTTP.externalize(tableParentPath + ".1.json"),
            type: "GET",
            dataType: "json",
            cache: false
        }).then(function (json) {
            var names = getOrderedChildResourceNames(json);
            var idx = names.indexOf(myName);
            if (idx < 0) {
                return null;
            }
            if (direction === "up") {
                return idx > 0 ? names[idx - 1] : null;
            }
            if (direction === "down") {
                return idx < names.length - 1 ? names[idx + 1] : null;
            }
            return null;
        });
    }

    /**
     * Neighbor row node name for Sling :order (DOM first, then parent .1.json).
     * @param {Granite.author.Editable} editable
     * @param {"up"|"down"} direction
     * @returns {jQuery.Promise<string|null>}
     */
    function resolveNeighborRowName(editable, direction) {
        var tableParentPath = editable.getParentPath();
        var $row = getRowWrapper(editable);
        var $sibling = direction === "up" ? $row.prev() : $row.next();
        var siblingPath = getRowPathUnderTableParent($sibling, tableParentPath);
        if (siblingPath) {
            return $.when(siblingPath.substring(siblingPath.lastIndexOf("/") + 1));
        }
        return fetchNeighborNameFromParentJson(tableParentPath, editable, direction);
    }

    function isTableHeaderRow(editable) {
        var rt = editable.type;
        if (typeof rt === "string" && rt.indexOf("tableheader") !== -1) {
            return true;
        }
        return $(getEditableDom(editable)).closest(".cmp-adaptiveform-tableheader").length > 0;
    }

    /**
     * @param {Granite.author.Editable} editable
     * @returns {boolean} true if this is the table header row (delete/move must stay disabled).
     */
    window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderRow = function (editable) {
        return isTableHeaderRow(editable);
    };

    /**
     * @param {Granite.author.Editable} editable
     * @returns {boolean} true if the row cannot move up (first data row or header).
     */
    window.CQ.FormsCoreComponents.editorhooks.isFirstCoreTableRow = function (editable) {
        if (isTableHeaderRow(editable)) {
            return true;
        }
        var $row = getRowWrapper(editable);
        return $row.prev().length === 0;
    };

    /**
     * @param {Granite.author.Editable} editable
     * @returns {boolean} true if the row cannot move down (last row or header).
     */
    window.CQ.FormsCoreComponents.editorhooks.isLastCoreTableRow = function (editable) {
        if (isTableHeaderRow(editable)) {
            return true;
        }
        var $row = getRowWrapper(editable);
        return $row.is(":last-child");
    };

    function getSlingOrderParam() {
        if (Granite.Sling && Granite.Sling.ORDER) {
            return Granite.Sling.ORDER;
        }
        if (window.CQ && CQ.Sling && CQ.Sling.ORDER) {
            return CQ.Sling.ORDER;
        }
        return "sling:order";
    }

    function getDeleteParams() {
        var p = { "_charset_": "UTF-8" };
        if (Granite.Sling && Granite.Sling.OPERATION) {
            p[Granite.Sling.STATUS] = Granite.Sling.STATUS_BROWSER;
            p[Granite.Sling.OPERATION] = Granite.Sling.OPERATION_DELETE;
        } else if (window.CQ && CQ.Sling && CQ.Sling.OPERATION) {
            p[CQ.Sling.STATUS] = CQ.Sling.STATUS_BROWSER;
            p[CQ.Sling.OPERATION] = CQ.Sling.OPERATION_DELETE;
        } else {
            p["sling:status"] = "browser";
            p[":operation"] = "delete";
        }
        return p;
    }

    function refreshParentTable(editable) {
        var tableEditable = Granite.author.editables.getParent(editable);
        if (tableEditable) {
            tableEditable.refresh();
        }
    }

    /**
     * Number of columns from the table header row in the authoring DOM, or from the current row.
     * @param {Granite.author.Editable} editable selected table row
     * @returns {number}
     */
    function getColumnCount(editable) {
        var $dom = $(getEditableDom(editable));
        var $table = $dom.closest(".cmp-adaptiveform-table");
        var headerCols = $table.find(".cmp-adaptiveform-table__head .cmp-adaptiveform-tablehead").length;
        if (headerCols > 0) {
            return headerCols;
        }
        var rowCells = $dom.find(".cmp-adaptiveform-tablecell").length;
        return rowCells > 0 ? rowCells : 1;
    }

    /**
     * JSON for a new tablerow matching core table defaults (see table _cq_template / examples).
     * @param {number} numCols
     * @returns {object}
     */
    function buildRowContent(numCols) {
        var baseTime = Date.now();
        var content = {
            "jcr:primaryType": "nt:unstructured",
            "sling:resourceType": RESOURCE_TYPE_TABLEROW,
            "fieldType": "panel",
            "jcr:title": Granite.I18n.get("Row")
        };
        var i;
        for (i = 0; i < numCols; i++) {
            var cellName = "cell" + baseTime + "_" + i;
            content[cellName] = {
                "jcr:primaryType": "nt:unstructured",
                "sling:resourceType": RESOURCE_TYPE_TEXTINPUT,
                "fieldType": "text-input",
                "jcr:title": Granite.I18n.get("Cell") + " " + (i + 1)
            };
        }
        return content;
    }

    /**
     * Inserts a new table row after the selected row (same parent path, Sling import + order).
     * @param {Granite.author.Editable} editable selected core tablerow
     */
    window.CQ.FormsCoreComponents.editorhooks.addTableRow = function (editable) {
        var tableParentPath = editable.getParentPath();
        var selectedNodeName = editable.path.substring(editable.path.lastIndexOf("/") + 1);
        var newNodePath = tableParentPath + "/row" + Date.now();
        var numCols = getColumnCount(editable);
        var templateJson = buildRowContent(numCols);
        var importParams = {
            "_charset_": "UTF-8",
            ":operation": "import",
            ":contentType": "json",
            ":replace": true,
            ":replaceProperties": true,
            ":content": JSON.stringify(templateJson)
        };
        var orderKey = getSlingOrderParam();
        var orderParams = { "_charset_": "UTF-8" };
        orderParams[orderKey] = "after " + selectedNodeName;

        $.ajax({
            url: Granite.HTTP.externalize(newNodePath),
            type: "POST",
            data: importParams
        }).then(function () {
            return $.ajax({
                url: Granite.HTTP.externalize(newNodePath),
                type: "POST",
                data: orderParams
            });
        }).done(function () {
            refreshParentTable(editable);
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to add table row."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    /**
     * Deletes the selected data row after confirmation (header row is gated via edit config condition).
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.deleteTableRow = function (editable) {
        var rowPath = editable.path;
        var tableEditable = Granite.author.editables.getParent(editable);

        $("#" + DELETE_ROW_DIALOG_ID).remove();

        var dialog = new Coral.Dialog().set({
            id: DELETE_ROW_DIALOG_ID,
            header: {
                innerHTML: Granite.I18n.get("Delete Row")
            },
            content: {
                innerHTML: Granite.I18n.get("Do you want to delete the selected row?")
            },
            footer: {},
            closable: "on"
        });

        var yesBtn = new Coral.Button();
        yesBtn.label.textContent = Granite.I18n.get("Yes");
        yesBtn.variant = Coral.Button.variant.PRIMARY;
        yesBtn.on("click", function () {
            $.ajax({
                url: Granite.HTTP.externalize(rowPath),
                type: "POST",
                data: getDeleteParams()
            }).done(function () {
                if (tableEditable) {
                    tableEditable.refresh();
                }
            }).fail(function () {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Failed to delete table row."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
            });
            dialog.hide();
            dialog.remove();
        });

        var noBtn = new Coral.Button();
        noBtn.label.textContent = Granite.I18n.get("No");
        noBtn.on("click", function () {
            dialog.hide();
            dialog.remove();
        });

        dialog.footer.appendChild(yesBtn);
        dialog.footer.appendChild(noBtn);
        document.body.appendChild(dialog);
        dialog.show();
    };

    /**
     * Moves the row up (Sling order before previous sibling row).
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.moveTableRowUp = function (editable) {
        resolveNeighborRowName(editable, "up").done(function (neighborName) {
            if (!neighborName) {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Could not resolve the previous row for reorder."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
                return;
            }
            var orderKey = getSlingOrderParam();
            var orderParams = { "_charset_": "UTF-8" };
            orderParams[orderKey] = "before " + neighborName;

            $.ajax({
                url: Granite.HTTP.externalize(editable.path),
                type: "POST",
                data: orderParams
            }).done(function () {
                refreshParentTable(editable);
            }).fail(function () {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Failed to move table row."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
            });
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Could not resolve the previous row for reorder."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    /**
     * Moves the row down (Sling order after next sibling row).
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.moveTableRowDown = function (editable) {
        resolveNeighborRowName(editable, "down").done(function (neighborName) {
            if (!neighborName) {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Could not resolve the next row for reorder."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
                return;
            }
            var orderKey = getSlingOrderParam();
            var orderParams = { "_charset_": "UTF-8" };
            orderParams[orderKey] = "after " + neighborName;

            $.ajax({
                url: Granite.HTTP.externalize(editable.path),
                type: "POST",
                data: orderParams
            }).done(function () {
                refreshParentTable(editable);
            }).fail(function () {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Failed to move table row."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
            });
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Could not resolve the next row for reorder."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };
})(window, Granite.author, jQuery, Coral);
