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
    var RESOURCE_TYPE_TABLEHEADER = "core/fd/components/form/tableheader/v1/tableheader";
    var RESOURCE_TYPE_TEXTINPUT = "core/fd/components/form/textinput/v1/textinput";
    var RESOURCE_TYPE_TEXT_DRAW = "core/fd/components/form/text/v1/text";
    var DELETE_ROW_DIALOG_ID = "core-forms-delete-table-row-dialog";
    var DELETE_HEADER_ROW_DIALOG_ID = "core-forms-delete-table-header-row-dialog";
    var DELETE_COLUMN_DIALOG_ID = "core-forms-delete-table-column-dialog";

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
     * Number of header rows under the table (each tableheader renders a tr.cmp-adaptiveform-tableheader).
     * @param {Granite.author.Editable} editable
     * @returns {number}
     */
    function countCoreTableHeaderRowsInDom(editable) {
        var $dom = $(getEditableDom(editable));
        var $table = $dom.closest(".cmp-adaptiveform-table");
        if (!$table.length) {
            return 0;
        }
        return $table.find(".cmp-adaptiveform-table__head .cmp-adaptiveform-tableheader").length;
    }

    /**
     * True when the selected row is a header row and another header row exists (delete allowed).
     * @param {Granite.author.Editable} editable
     * @returns {boolean}
     */
    window.CQ.FormsCoreComponents.editorhooks.canDeleteCoreTableHeaderRow = function (editable) {
        if (!isTableHeaderRow(editable)) {
            return false;
        }
        return countCoreTableHeaderRowsInDom(editable) > 1;
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
     * Logical column span for one header cell (native colspan or legacy data-colspan).
     * @param {jQuery} $cell .cmp-adaptiveform-tablehead element
     * @returns {number}
     */
    function getTableHeadCellColspan($cell) {
        var cs = parseInt($cell.attr("data-colspan"), 10);
        if (isNaN(cs) || cs < 1) {
            cs = parseInt($cell.attr("colspan"), 10);
        }
        return isNaN(cs) || cs < 1 ? 1 : cs;
    }

    /**
     * Sum of colspans for a set of header cells (logical table width).
     * @param {jQuery} $headerCells
     * @returns {number}
     */
    function sumTableHeadCellColspans($headerCells) {
        var total = 0;
        if (!$headerCells || !$headerCells.length) {
            return 0;
        }
        $headerCells.each(function () {
            total += getTableHeadCellColspan($(this));
        });
        return total;
    }

    /**
     * Number of logical columns: first header row's colspan sum, else cell count from the data row.
     * @param {Granite.author.Editable} editable selected table row
     * @returns {number}
     */
    function getColumnCount(editable) {
        var $dom = $(getEditableDom(editable));
        var $table = $dom.closest(".cmp-adaptiveform-table");
        var $firstHeaderRow = $table.find(".cmp-adaptiveform-table__head .cmp-adaptiveform-tableheader").first();
        var fromHeader = sumTableHeadCellColspans($firstHeaderRow.find(".cmp-adaptiveform-tablehead"));
        if (fromHeader > 0) {
            return fromHeader;
        }
        var $dataRow = $dom.closest(".cmp-adaptiveform-tablerow");
        var rowCells = $dataRow.length ? $dataRow.find(".cmp-adaptiveform-tablecell").length : 0;
        if (rowCells > 0) {
            return rowCells;
        }
        rowCells = $dom.find(".cmp-adaptiveform-tablecell").length;
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
                "fieldType": "text-input"
            };
        }
        return content;
    }

    /**
     * Column count for the header row that contains the selection (for new header rows).
     * @param {Granite.author.Editable} editable
     * @returns {number}
     */
    function getHeaderRowColumnCount(editable) {
        var $row = getRowWrapper(editable);
        var fromRow = sumTableHeadCellColspans($row.find(".cmp-adaptiveform-tablehead"));
        if (fromRow > 0) {
            return fromRow;
        }
        var $table = $(getEditableDom(editable)).closest(".cmp-adaptiveform-table");
        var $firstHeadRow = $table.find(".cmp-adaptiveform-table__widget > .cmp-adaptiveform-table__head .cmp-adaptiveform-tableheader").first();
        var fallback = sumTableHeadCellColspans($firstHeadRow.find(".cmp-adaptiveform-tablehead"));
        return fallback > 0 ? fallback : 1;
    }

    /**
     * JSON for a new table header row (plain-text header cells), matching table _cq_template.
     * @param {number} numCols
     * @returns {object}
     */
    function buildHeaderRowContent(numCols) {
        var baseTime = Date.now();
        var content = {
            "jcr:primaryType": "nt:unstructured",
            "sling:resourceType": RESOURCE_TYPE_TABLEHEADER,
            "fieldType": "panel",
            "jcr:title": Granite.I18n.get("Header Row")
        };
        var i;
        for (i = 0; i < numCols; i++) {
            var uid = baseTime + "_" + i;
            var cellName = "column_" + uid;
            content[cellName] = buildHeaderTextColumnJson(uid);
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
     * Inserts a new table header row after the selected header row (same column count).
     * @param {Granite.author.Editable} editable selected core tableheader
     */
    window.CQ.FormsCoreComponents.editorhooks.addTableHeaderRow = function (editable) {
        var tableParentPath = editable.getParentPath();
        var selectedNodeName = editable.path.substring(editable.path.lastIndexOf("/") + 1);
        var newNodePath = tableParentPath + "/header" + Date.now();
        var numCols = getHeaderRowColumnCount(editable);
        var templateJson = buildHeaderRowContent(numCols);
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
                content: Granite.I18n.get("Failed to add table header row."),
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
     * Deletes the selected header row after confirmation; keeps at least one header row on the table.
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.deleteTableHeaderRow = function (editable) {
        var rowPath = editable.path;
        var tableEditable = Granite.author.editables.getParent(editable);
        var tablePath = editable.getParentPath();

        $("#" + DELETE_HEADER_ROW_DIALOG_ID).remove();

        var dialog = new Coral.Dialog().set({
            id: DELETE_HEADER_ROW_DIALOG_ID,
            header: {
                innerHTML: Granite.I18n.get("Delete Header Row")
            },
            content: {
                innerHTML: Granite.I18n.get("Do you want to delete the selected header row?")
            },
            footer: {},
            closable: "on"
        });

        var yesBtn = new Coral.Button();
        yesBtn.label.textContent = Granite.I18n.get("Yes");
        yesBtn.variant = Coral.Button.variant.PRIMARY;
        yesBtn.on("click", function () {
            $.ajax({
                url: Granite.HTTP.externalize(tablePath + ".1.json"),
                type: "GET",
                dataType: "json",
                cache: false
            }).done(function (tableJson) {
                var rowNames = getOrderedChildResourceNames(tableJson);
                var headerCount = 0;
                rowNames.forEach(function (rowName) {
                    if (getResourceTypeFromTableJson(tableJson, rowName) === RESOURCE_TYPE_TABLEHEADER) {
                        headerCount += 1;
                    }
                });
                if (headerCount <= 1) {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("The table must keep at least one header row."),
                        type: author.ui.helpers.NOTIFICATION_TYPES.INFO
                    });
                    dialog.hide();
                    dialog.remove();
                    return;
                }
                $.ajax({
                    url: Granite.HTTP.externalize(rowPath),
                    type: "POST",
                    data: getDeleteParams()
                }).done(function () {
                    if (tableEditable) {
                        tableEditable.refresh();
                    }
                    dialog.hide();
                    dialog.remove();
                }).fail(function () {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("Failed to delete table header row."),
                        type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                    });
                    dialog.hide();
                    dialog.remove();
                });
            }).fail(function () {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Failed to read table structure."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
                dialog.hide();
                dialog.remove();
            });
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

    var MERGE_HEADER_CELLS_DIALOG_ID = "core-forms-merge-header-cells-dialog";
    var SPLIT_HEADER_CELL_DIALOG_ID = "core-forms-split-header-cell-dialog";

    /**
     * Returns the header cell colspan from .cmp-adaptiveform-tablehead (data-colspan or native colspan).
     * @param {Granite.author.Editable} editable
     * @returns {number}
     */
    function getHeaderCellColspan(editable) {
        var $wrapper = $(getEditableDom(editable)).closest(".cmp-adaptiveform-tablehead");
        return getTableHeadCellColspan($wrapper);
    }

    /**
     * True when the editable is Adaptive Form Text (draw) used inside a core table header column.
     * @param {Granite.author.Editable} editable
     * @returns {boolean}
     */
    window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCell = function (editable) {
        if (!editable || typeof editable.type !== "string") {
            return false;
        }
        if (editable.type !== RESOURCE_TYPE_TEXT_DRAW) {
            return false;
        }
        return $(getEditableDom(editable)).closest(".cmp-adaptiveform-table__head").length > 0;
    };

    function getTableEditableFromHeaderCellText(editable) {
        var headerEditable = Granite.author.editables.getParent(editable);
        if (!headerEditable) {
            return null;
        }
        return Granite.author.editables.getParent(headerEditable);
    }

    function fetchOrderedChildNames(parentPath) {
        return $.ajax({
            url: Granite.HTTP.externalize(parentPath + ".1.json"),
            type: "GET",
            dataType: "json",
            cache: false
        }).then(function (json) {
            return getOrderedChildResourceNames(json);
        });
    }

    function getResourceTypeFromTableJson(tableJson, nodeName) {
        var container = tableJson[":items"] && typeof tableJson[":items"] === "object"
            ? tableJson[":items"]
            : tableJson;
        var item = container[nodeName];
        return item && item["sling:resourceType"] ? item["sling:resourceType"] : null;
    }

    function buildHeaderTextColumnJson(uniqueSuffix) {
        return {
            "jcr:primaryType": "nt:unstructured",
            "sling:resourceType": RESOURCE_TYPE_TEXT_DRAW,
            "fieldType": "plain-text",
            "jcr:title": Granite.I18n.get("Column"),
            "name": "column_" + uniqueSuffix,
            "value": Granite.I18n.get("Column")
        };
    }

    function buildBodyTextInputJson() {
        return {
            "jcr:primaryType": "nt:unstructured",
            "sling:resourceType": RESOURCE_TYPE_TEXTINPUT,
            "fieldType": "text-input",
        };
    }

    function postImportAndOrderAfter(targetPath, jsonContent, orderAfterNodeName) {
        var importParams = {
            "_charset_": "UTF-8",
            ":operation": "import",
            ":contentType": "json",
            ":replace": true,
            ":replaceProperties": true,
            ":content": JSON.stringify(jsonContent)
        };
        var orderKey = getSlingOrderParam();
        var orderParams = { "_charset_": "UTF-8" };
        orderParams[orderKey] = "after " + orderAfterNodeName;
        return $.ajax({
            url: Granite.HTTP.externalize(targetPath),
            type: "POST",
            data: importParams
        }).then(function () {
            return $.ajax({
                url: Granite.HTTP.externalize(targetPath),
                type: "POST",
                data: orderParams
            });
        });
    }

    /**
     * Adds a column to the right of the selected header cell (new header label + one cell per body row).
     * @param {Granite.author.Editable} editable selected header text field
     */
    window.CQ.FormsCoreComponents.editorhooks.addTableColumn = function (editable) {
        var headerPath = editable.getParentPath();
        var tablePath = headerPath.substring(0, headerPath.lastIndexOf("/"));
        var selectedCellName = editable.path.substring(editable.path.lastIndexOf("/") + 1);
        var tableEditable = getTableEditableFromHeaderCellText(editable);

        fetchOrderedChildNames(headerPath).done(function (headerOrder) {
            var colIndex = headerOrder.indexOf(selectedCellName);
            if (colIndex < 0) {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Could not resolve the selected column."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
                return;
            }
            var orderAfterName = headerOrder[colIndex];
            var uid = Date.now();
            var newHeaderName = "column_" + uid;
            var newHeaderPath = headerPath + "/" + newHeaderName;

            postImportAndOrderAfter(newHeaderPath, buildHeaderTextColumnJson(uid), orderAfterName)
                .then(function () {
                    return $.ajax({
                        url: Granite.HTTP.externalize(tablePath + ".1.json"),
                        type: "GET",
                        dataType: "json",
                        cache: false
                    });
                })
                .then(function (tableJson) {
                    var rowNames = getOrderedChildResourceNames(tableJson);
                    var chain = $.when();
                    var dataRowIndex = 0;
                    rowNames.forEach(function (rowName) {
                        var rt = getResourceTypeFromTableJson(tableJson, rowName);
                        if (rt !== RESOURCE_TYPE_TABLEROW) {
                            return;
                        }
                        var rowPath = tablePath + "/" + rowName;
                        (function (rp, rIndex) {
                            chain = chain.then(function () {
                                return fetchOrderedChildNames(rp).then(function (cellNames) {
                                    if (colIndex < 0 || colIndex >= cellNames.length) {
                                        return $.when();
                                    }
                                    var afterCell = cellNames[colIndex];
                                    var newCellName = "cell_" + uid + "_" + rIndex;
                                    var newCellPath = rp + "/" + newCellName;
                                    return postImportAndOrderAfter(
                                        newCellPath,
                                        buildBodyTextInputJson(),
                                        afterCell
                                    );
                                });
                            });
                        })(rowPath, dataRowIndex);
                        dataRowIndex += 1;
                    });
                    return chain;
                })
                .done(function () {
                    if (tableEditable) {
                        tableEditable.refresh();
                    }
                })
                .fail(function () {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("Failed to add table column."),
                        type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                    });
                });
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to read table header."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    /**
     * Deletes the column for the selected header cell (header label + same index cell in each body row).
     * @param {Granite.author.Editable} editable selected header text field
     */
    window.CQ.FormsCoreComponents.editorhooks.deleteTableColumn = function (editable) {
        var headerPath = editable.getParentPath();
        var tablePath = headerPath.substring(0, headerPath.lastIndexOf("/"));
        var selectedCellName = editable.path.substring(editable.path.lastIndexOf("/") + 1);
        var tableEditable = getTableEditableFromHeaderCellText(editable);

        fetchOrderedChildNames(headerPath).done(function (headerOrder) {
            if (headerOrder.length <= 1) {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("The table must keep at least one column."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.INFO
                });
                return;
            }
            var colIndex = headerOrder.indexOf(selectedCellName);
            if (colIndex < 0) {
                author.ui.helpers.notify({
                    content: Granite.I18n.get("Could not resolve the selected column."),
                    type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                });
                return;
            }

            $("#" + DELETE_COLUMN_DIALOG_ID).remove();

            var dialog = new Coral.Dialog().set({
                id: DELETE_COLUMN_DIALOG_ID,
                header: {
                    innerHTML: Granite.I18n.get("Delete Column")
                },
                content: {
                    innerHTML: Granite.I18n.get("Do you want to delete the selected column from the table?")
                },
                footer: {},
                closable: "on"
            });

            var yesBtn = new Coral.Button();
            yesBtn.label.textContent = Granite.I18n.get("Yes");
            yesBtn.variant = Coral.Button.variant.PRIMARY;
            yesBtn.on("click", function () {
                var headerCellPath = headerPath + "/" + selectedCellName;

                $.ajax({
                    url: Granite.HTTP.externalize(headerCellPath),
                    type: "POST",
                    data: getDeleteParams()
                }).then(function () {
                    return $.ajax({
                        url: Granite.HTTP.externalize(tablePath + ".1.json"),
                        type: "GET",
                        dataType: "json",
                        cache: false
                    });
                }).then(function (tableJson) {
                    var rowNames = getOrderedChildResourceNames(tableJson);
                    var chain = $.when();
                    rowNames.forEach(function (rowName) {
                        var rt = getResourceTypeFromTableJson(tableJson, rowName);
                        if (rt !== RESOURCE_TYPE_TABLEROW) {
                            return;
                        }
                        var rowPath = tablePath + "/" + rowName;
                        chain = chain.then(function () {
                            return fetchOrderedChildNames(rowPath).then(function (cellNames) {
                                if (colIndex >= cellNames.length) {
                                    return $.when();
                                }
                                var cellToRemove = rowPath + "/" + cellNames[colIndex];
                                return $.ajax({
                                    url: Granite.HTTP.externalize(cellToRemove),
                                    type: "POST",
                                    data: getDeleteParams()
                                });
                            });
                        });
                    });
                    return chain;
                }).done(function () {
                    if (tableEditable) {
                        tableEditable.refresh();
                    }
                }).fail(function () {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("Failed to delete table column."),
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
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to read table header."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };
    /**
     * True when the header cell has a colspan > 1 (has been merged).
     * Used as the condition for the "Split Cell" action config.
     * @param {Granite.author.Editable} editable
     * @returns {boolean}
     */
    window.CQ.FormsCoreComponents.editorhooks.isMergedHeaderCell = function (editable) {
        if (!window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCell(editable)) {
            return false;
        }
        return getHeaderCellColspan(editable) > 1;
    };

    /**
     * Merges 2+ consecutive, same-row selected header cells into one by:
     * - summing their colspan values
     * - deleting all but the first (DOM-order) cell
     * - posting the total colspan to the first cell
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.mergeTableHeaderCells = function (editable) {
        var currentSelectionItems = Granite.author.selection.getAllSelected();
        var selectedCount = currentSelectionItems ? currentSelectionItems.length : 0;

        function showError(message) {
            $("#" + MERGE_HEADER_CELLS_DIALOG_ID).remove();
            var dialog = new Coral.Dialog().set({
                id: MERGE_HEADER_CELLS_DIALOG_ID,
                header: { innerHTML: Granite.I18n.get("Invalid Selection") },
                content: { innerHTML: Granite.I18n.get(message) },
                footer: {
                    innerHTML: '<button is="coral-button" variant="primary" coral-close>' + Granite.I18n.get("Ok") + '</button>'
                },
                closable: "on",
                variant: "error"
            });
            document.body.appendChild(dialog);
            dialog.show();
        }

        if (!currentSelectionItems || selectedCount < 2) {
            showError("Select two or more header cells to merge.");
            return;
        }

        // All selected items must be header cells
        var allHeaderCells = currentSelectionItems.every(function (item) {
            return window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCell(item);
        });
        if (!allHeaderCells) {
            showError("All selected cells must be table header cells.");
            return;
        }

        // All must share the same parent header row path
        var firstParentPath = currentSelectionItems[0].getParentPath();
        var allSameRow = currentSelectionItems.every(function (item) {
            return item.getParentPath() === firstParentPath;
        });
        if (!allSameRow) {
            showError("All selected cells must be in the same header row.");
            return;
        }

        // Determine DOM order within the header row and verify cells are consecutive.
        var $headerRow = $(getEditableDom(currentSelectionItems[0]))
            .closest(".cmp-adaptiveform-tableheader");
        var $allWrappers = $headerRow.find(".cmp-adaptiveform-tablehead");

        var indices = currentSelectionItems.map(function (item) {
            return $allWrappers.index($(getEditableDom(item)).closest(".cmp-adaptiveform-tablehead"));
        }).sort(function (a, b) { return a - b; });

        var isConsecutive = indices.every(function (idx, i) {
            return i === 0 || idx === indices[i - 1] + 1;
        });
        if (!isConsecutive) {
            showError("Select consecutive header cells in the same row to merge.");
            return;
        }

        // Re-sort items by DOM index so the first in DOM order is kept
        var sortedItems = currentSelectionItems.slice().sort(function (a, b) {
            var aIdx = $allWrappers.index($(getEditableDom(a)).closest(".cmp-adaptiveform-tablehead"));
            var bIdx = $allWrappers.index($(getEditableDom(b)).closest(".cmp-adaptiveform-tablehead"));
            return aIdx - bIdx;
        });

        var firstItem = sortedItems[0];
        var firstCellPath = firstItem.path;
        var totalColspan = 0;
        sortedItems.forEach(function (item) {
            totalColspan += getHeaderCellColspan(item);
        });

        var deleteParams = getDeleteParams();
        var chain = $.when();

        // Delete all cells except the first (in DOM order)
        sortedItems.slice(1).forEach(function (item) {
            var itemPath = item.path;
            chain = chain.then(function () {
                return $.ajax({
                    url: Granite.HTTP.externalize(itemPath),
                    type: "POST",
                    data: deleteParams
                });
            });
        });

        // Set the accumulated colspan on the surviving first cell
        chain.then(function () {
            return $.ajax({
                url: Granite.HTTP.externalize(firstCellPath),
                type: "POST",
                data: { "_charset_": "UTF-8", "colspan": String(totalColspan) }
            });
        }).done(function () {
            var tableEditable = getTableEditableFromHeaderCellText(firstItem);
            if (tableEditable) {
                tableEditable.refresh();
            }
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to merge header cells."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    /**
     * Splits a merged header cell (colspan > 1) back into individual cells by:
     * - removing the colspan property from the current cell
     * - inserting (colspan - 1) new header text cells immediately after it
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.splitTableHeaderCell = function (editable) {
        var colSpan = getHeaderCellColspan(editable);

        if (colSpan <= 1) {
            $("#" + SPLIT_HEADER_CELL_DIALOG_ID).remove();
            var dialog = new Coral.Dialog().set({
                id: SPLIT_HEADER_CELL_DIALOG_ID,
                header: { innerHTML: Granite.I18n.get("Invalid Selection") },
                content: { innerHTML: Granite.I18n.get("Select a merged cell to split.") },
                footer: {
                    innerHTML: '<button is="coral-button" variant="primary" coral-close>' + Granite.I18n.get("Ok") + '</button>'
                },
                closable: "on",
                variant: "error"
            });
            document.body.appendChild(dialog);
            dialog.show();
            return;
        }

        var cellPath = editable.path;
        var headerPath = editable.getParentPath();
        var cellName = cellPath.substring(cellPath.lastIndexOf("/") + 1);
        var tableEditable = getTableEditableFromHeaderCellText(editable);
        var numNewCells = colSpan - 1;

        // Pre-build the new cell descriptors so each closure captures the right values
        var uid = Date.now();
        var cellsToCreate = [];
        for (var i = 0; i < numNewCells; i++) {
            var suffix = uid + "_" + i;
            var newName = "column_" + suffix;
            cellsToCreate.push({
                name: newName,
                path: headerPath + "/" + newName,
                content: buildHeaderTextColumnJson(suffix)
            });
        }

        // Remove the colspan property from the current cell, then insert new cells sequentially
        $.ajax({
            url: Granite.HTTP.externalize(cellPath),
            type: "POST",
            data: { "_charset_": "UTF-8", "colspan@Delete": "true" }
        }).then(function () {
            var chain = $.when();
            cellsToCreate.forEach(function (cell, i) {
                var orderAfter = i === 0 ? cellName : cellsToCreate[i - 1].name;
                chain = chain.then(function () {
                    return postImportAndOrderAfter(cell.path, cell.content, orderAfter);
                });
            });
            return chain;
        }).done(function () {
            if (tableEditable) {
                tableEditable.refresh();
            }
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to split header cell."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    // When a tablerow/tableheader editable's .dom gets resolved to the <table>
    // wrapper (foster-parented markers, refresh edge cases) instead of the real
    // <tr>, relocate it by data-cq-data-path before the overlay paints.
    // See cq-guides GuideTouchAuthoringEditListeners.js for the original pattern.
    function isTableRowLikeEditable(editable) {
        if (!editable || typeof editable.type !== "string") {
            return false;
        }
        return editable.type.indexOf("tablerow") !== -1
            || editable.type.indexOf("tableheader") !== -1;
    }

    function installOverlayRenderOverride() {
        if (!author.edit || !author.edit.Overlay || !author.edit.Overlay.prototype
            || typeof author.edit.Overlay.prototype.render !== "function") {
            return false;
        }
        if (author.edit.Overlay.prototype.render.__afTableWrapped) {
            return true;
        }
        var _superOverlayRender = author.edit.Overlay.prototype.render;
        var wrapped = function (editable, container) {
            if (isTableRowLikeEditable(editable)
                && editable.dom
                && typeof editable.dom.attr === "function"
                && editable.dom.attr("data-cq-data-path") !== editable.path) {
                var $real = editable.dom.find('[data-cq-data-path="' + editable.path + '"]');
                if ($real.length) {
                    editable.dom = $real;
                }
            }
            return _superOverlayRender.apply(this, [editable, container]);
        };
        wrapped.__afTableWrapped = true;
        author.edit.Overlay.prototype.render = wrapped;
        return true;
    }

    if (!installOverlayRenderOverride()) {
        $(function () { installOverlayRenderOverride(); });
    }

    /**
     * True when the header cell currently has a sort button rendered (table-level sorting is on
     * and this column has not had its sort button individually removed).
     * Used as the condition for the "Remove Sorting" action config.
     * @param {Granite.author.Editable} editable
     * @returns {boolean}
     */
    window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCellSortingEnabled = function (editable) {
        if (!window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCell(editable)) {
            return false;
        }
        return $(getEditableDom(editable))
            .closest(".cmp-adaptiveform-tablehead")
            .find(".cmp-adaptiveform-table__sort-button")
            .length > 0;
    };

    /**
     * True when table-level sorting is on but this column's sort button has been individually
     * removed (disableSorting=true on the cell node).
     * Used as the condition for the "Enable Sorting" action config.
     * @param {Granite.author.Editable} editable
     * @returns {boolean}
     */
    window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCellSortingDisabled = function (editable) {
        if (!window.CQ.FormsCoreComponents.editorhooks.isCoreTableHeaderCell(editable)) {
            return false;
        }
        var $dom = $(getEditableDom(editable));
        var tableSortingOn = $dom.closest(".cmp-adaptiveform-table")
            .attr("data-cmp-sorting-enabled") === "true";
        if (!tableSortingOn) {
            return false;
        }
        return $dom.closest(".cmp-adaptiveform-tablehead")
            .find(".cmp-adaptiveform-table__sort-button")
            .length === 0;
    };

    /**
     * Removes the sort button from a single header column by writing disableSorting=true
     * on the cell's JCR node, then refreshes the parent table editable.
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.removeColumnSorting = function (editable) {
        var cellPath = editable.path;
        var tableEditable = getTableEditableFromHeaderCellText(editable);

        $.ajax({
            url: Granite.HTTP.externalize(cellPath),
            type: "POST",
            data: {
                "_charset_": "UTF-8",
                "disableSorting": "true",
                "disableSorting@TypeHint": "Boolean"
            }
        }).done(function () {
            if (tableEditable) {
                tableEditable.refresh();
            }
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to remove sorting for this column."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

    /**
     * Re-enables the sort button for a single header column by deleting the disableSorting
     * property from the cell's JCR node, then refreshes the parent table editable.
     * @param {Granite.author.Editable} editable
     */
    window.CQ.FormsCoreComponents.editorhooks.enableColumnSorting = function (editable) {
        var cellPath = editable.path;
        var tableEditable = getTableEditableFromHeaderCellText(editable);

        $.ajax({
            url: Granite.HTTP.externalize(cellPath),
            type: "POST",
            data: {
                "_charset_": "UTF-8",
                "disableSorting@Delete": "true"
            }
        }).done(function () {
            if (tableEditable) {
                tableEditable.refresh();
            }
        }).fail(function () {
            author.ui.helpers.notify({
                content: Granite.I18n.get("Failed to enable sorting for this column."),
                type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
            });
        });
    };

})(window, Granite.author, jQuery, Coral);
