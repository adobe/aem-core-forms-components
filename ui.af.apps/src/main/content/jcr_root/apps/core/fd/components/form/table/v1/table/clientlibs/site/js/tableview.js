/*******************************************************************************
 * Copyright 2026 Adobe
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
(function () {
    "use strict";

    class Table extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTable";
        static bemBlock = 'cmp-adaptiveform-table';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Table.bemBlock}__widget`,
            description: `.${Table.bemBlock}__longdescription`,
            qm: `.${Table.bemBlock}__questionmark`,
            tooltipDiv: `.${Table.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
            this.children = [];
            /** @type {{ col: number, dir: 'asc'|'desc' }|null} */
            this._tableSortState = null;
        }

        setModel(model) {
            super.setModel(model);
            queueMicrotask(() => {
                this.#initColumnSortingIfEnabled();
            });
        }

        getClass() {
            return Table.IS;
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(Table.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(`.${Table.bemBlock}__title`);
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
            return this.element.querySelector(Table.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Table.selectors.qm);
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
        }

        getWidgetId() {
            return this.getId();
        }

        /**
         * Override updateLabel to handle the table's specific HTML structure.
         * The table uses __title instead of __label-container > __label.
         * @param {Object} label - The label state object.
         */
        updateLabel(label) {
            const labelElement = this.getLabel();
            if (labelElement) {
                if (label.hasOwnProperty("value")) {
                    labelElement.innerHTML = label.value;
                }
                if (label.hasOwnProperty("visible")) {
                    if (label.visible === false) {
                        labelElement.setAttribute("aria-hidden", "true");
                    } else {
                        labelElement.removeAttribute("aria-hidden");
                    }
                    labelElement.setAttribute("data-cmp-visible", label.visible);
                }
            }
        }

        /**
         * Override applyState to use the table's specific updateLabel.
         * @param {Object} state - The state to be applied.
         */
        applyState(state) {
            this.updateVisible(state.visible);
            this.updateEnabled(state.enabled);
            this.initializeHelpContent(state);
            this.updateLabel(state.label);
        }

        /**
         * Get the <tbody> element for row insertion.
         */
        #getTableBody() {
            return this.element.querySelector(`.${Table.bemBlock}__body`) ||
                   this.element.querySelector('tbody');
        }

        /**
         * Inserts a new table row into the <tbody> at the correct position.
         * This is called by InstanceManager.handleAddition() when repeatableParentView is set.
         * Foundation-style approach: insert <tr> directly as sibling within single <tbody>.
         *
         * @param {Object} instanceManager - The instance manager
         * @param {Object} addedModel - The model of the added row
         * @param {HTMLElement} htmlElement - The cloned row element (<tr>)
         * @returns {HTMLElement} The inserted element
         */
        addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
            const tbody = this.#getTableBody();
            if (!tbody) {
                console.error('Table: No tbody found for row insertion');
                return htmlElement;
            }

            const instanceIndex = addedModel.index;
            const children = instanceManager.children;

            if (children.length === 0) {
                tbody.appendChild(htmlElement);
            } else if (instanceIndex === 0) {
                const firstChild = children[0];
                if (firstChild && firstChild.element) {
                    tbody.insertBefore(htmlElement, firstChild.element);
                } else {
                    tbody.insertBefore(htmlElement, tbody.firstElementChild);
                }
            } else {
                const prevIndex = instanceIndex - 1;
                const prevChild = children.find(c => c.getModel && c.getModel().index === prevIndex);
                if (prevChild && prevChild.element) {
                    prevChild.element.after(htmlElement);
                } else {
                    const items = instanceManager._model.items || [];
                    const prevModel = items.find(m => m.index === prevIndex);
                    if (prevModel) {
                        const prevElement = tbody.querySelector(`#${prevModel.id}`);
                        if (prevElement) {
                            prevElement.after(htmlElement);
                        } else {
                            tbody.appendChild(htmlElement);
                        }
                    } else {
                        tbody.appendChild(htmlElement);
                    }
                }
            }

            // Utils.updateId only patches id attributes, not data-cmp-hook-* attrs.
            // Without this, cloned rows keep the template's stale row ID on their
            // add/remove buttons, causing every dynamically-added row to dispatch
            // the wrong model index when clicked.
            this.#syncTableRowHooks(htmlElement, addedModel.id);

            return htmlElement;
        }

        /**
         * Patches data-cmp-hook-add-instance / data-cmp-hook-remove-instance on a
         * freshly cloned row so they reference the row's own model ID.
         */
        #syncTableRowHooks(rowElement, rowId) {
            const addBtn = rowElement.querySelector('[data-cmp-hook-add-instance]');
            if (addBtn) {
                addBtn.setAttribute('data-cmp-hook-add-instance', rowId);
            }
            const removeBtn = rowElement.querySelector('[data-cmp-hook-remove-instance]');
            if (removeBtn) {
                removeBtn.setAttribute('data-cmp-hook-remove-instance', rowId);
            }
        }

        /**
         * Repeatable table rows: align add/remove control visibility with minOccur / maxOccur.
         */
        handleChildAddition(childView) {
            this.#syncTableRowRepeatableControls(childView.getInstanceManager());
        }

        handleChildRemoval(removedInstanceView) {
            this.#syncTableRowRepeatableControls(removedInstanceView.getInstanceManager());
        }

        #syncTableRowRepeatableControls(instanceManager) {
            if (!instanceManager || !instanceManager.children || instanceManager.children.length === 0) {
                return;
            }
            const model = instanceManager._model;
            const items = model.items || [];
            const activeIds = new Set(items.map((item) => item.id));
            const minOccur = model.minOccur;
            const maxOccur = model.maxOccur;
            const dataVisible = FormView.Constants.DATA_ATTRIBUTE_VISIBLE;
            instanceManager.children.forEach((childView) => {
                if (!activeIds.has(childView.id)) {
                    return;
                }
                const rowElement = childView.element;
                if (!rowElement) {
                    return;
                }
                const addBtn = rowElement.querySelector("[data-cmp-hook-add-instance]");
                const removeBtn = rowElement.querySelector("[data-cmp-hook-remove-instance]");
                if (addBtn) {
                    addBtn.setAttribute(dataVisible, !(items.length === maxOccur && maxOccur !== -1));
                }
                if (removeBtn) {
                    removeBtn.setAttribute(dataVisible, items.length > minOccur && minOccur !== -1);
                }
            });
        }

        /**
         * @returns {boolean}
         */
        #isSortingEnabled() {
            if (this._model && this._model.enableSorting === true) {
                return true;
            }
            return this.element.getAttribute("data-cmp-sorting-enabled") === "true";
        }

        #initColumnSortingIfEnabled() {
            if (!this.#isSortingEnabled()) {
                return;
            }
            const widget = this.element.querySelector(Table.selectors.widget);
            if (!widget) {
                return;
            }
            const thead = widget.querySelector("thead");
            const tbody = widget.querySelector("tbody");
            if (!thead || !tbody) {
                return;
            }
            const headerCells = thead.querySelectorAll("th.cmp-adaptiveform-tablehead");
            headerCells.forEach((th, index) => {
                if (th.querySelector(".cmp-adaptiveform-table__sort-button")) {
                    return;
                }
                const inner = document.createElement("div");
                inner.className = "cmp-adaptiveform-table__sort-header-inner";
                while (th.firstChild) {
                    inner.appendChild(th.firstChild);
                }
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "cmp-adaptiveform-table__sort-button";
                btn.setAttribute("data-cmp-hook-table-sort", String(index));
                btn.setAttribute("aria-label", "Sort column");
                inner.appendChild(btn);
                th.appendChild(inner);
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.#sortTableByColumn(tbody, thead, index);
                });
            });
        }

        /**
         * @param {HTMLTableSectionElement} tbody
         * @param {HTMLTableSectionElement} thead
         * @param {number} colIndex
         */
        #sortTableByColumn(tbody, thead, colIndex) {
            const rows = Array.from(tbody.querySelectorAll(":scope > tr"));
            if (rows.length <= 1) {
                return;
            }
            let dir = "asc";
            if (this._tableSortState && this._tableSortState.col === colIndex) {
                dir = this._tableSortState.dir === "asc" ? "desc" : "asc";
            }
            this._tableSortState = { col: colIndex, dir: dir };
            const mult = dir === "asc" ? 1 : -1;
            const sorted = rows.slice().sort((a, b) => {
                const va = this.#getCellSortValue(a.cells[colIndex]);
                const vb = this.#getCellSortValue(b.cells[colIndex]);
                return mult * va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" });
            });
            sorted.forEach((r) => tbody.appendChild(r));
            this.#syncInstanceManagerOrderAfterSort(sorted);
            const headerCells = thead.querySelectorAll("th.cmp-adaptiveform-tablehead");
            headerCells.forEach((th) => {
                th.removeAttribute("aria-sort");
                const b = th.querySelector(".cmp-adaptiveform-table__sort-button");
                if (b) {
                    b.classList.remove("cmp-adaptiveform-table__sort-button--asc");
                    b.classList.remove("cmp-adaptiveform-table__sort-button--desc");
                }
            });
            const activeTh = headerCells[colIndex];
            const activeBtn = activeTh && activeTh.querySelector(".cmp-adaptiveform-table__sort-button");
            if (activeTh && activeBtn) {
                activeBtn.classList.add(
                    dir === "asc" ? "cmp-adaptiveform-table__sort-button--asc" : "cmp-adaptiveform-table__sort-button--desc"
                );
                activeTh.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
            }
        }

        /**
         * Keep repeatable row views aligned with DOM order after a sort.
         * @param {HTMLTableRowElement[]} sortedRows
         */
        #syncInstanceManagerOrderAfterSort(sortedRows) {
            const firstId = sortedRows[0] && sortedRows[0].id;
            if (!firstId || !this.formContainer || !this.formContainer.getField) {
                return;
            }
            const firstView = this.formContainer.getField(firstId);
            const im = firstView && typeof firstView.getInstanceManager === "function" ? firstView.getInstanceManager() : null;
            if (!im || !im.children || im.children.length !== sortedRows.length) {
                return;
            }
            const byId = new Map(im.children.map((cv) => [cv.getId(), cv]));
            const reordered = sortedRows.map((r) => byId.get(r.id)).filter(Boolean);
            if (reordered.length === im.children.length) {
                im.children = reordered;
            }
        }

        /**
         * @param {HTMLTableCellElement|undefined} cell
         * @returns {string}
         */
        #getCellSortValue(cell) {
            if (!cell) {
                return "";
            }
            const control = cell.querySelector("input:not([type='hidden']):not([type='button']), select, textarea");
            if (control) {
                if (control.type === "checkbox" || control.type === "radio") {
                    return control.checked ? "1" : "0";
                }
                if (typeof control.value === "string") {
                    return control.value.trim();
                }
            }
            return cell.innerText.replace(/\s+/g, " ").trim();
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Table({element, formContainer})
    }, Table.selectors.self);
})();
