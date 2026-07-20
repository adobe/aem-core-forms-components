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
            /** @type {HTMLElement|null} */
            this._mobileSortOverlay = null;
            /** @type {HTMLElement|null} */
            this._mobileFilterOverlay = null;
        }

        setModel(model) {
            super.setModel(model);
            queueMicrotask(() => {
                this.#initColumnSortingIfEnabled();
                this.#stampMobileLabels();
                this.#initMobileSortBar();
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
         * Mobile card layout (CSS-driven, via @media max-width:768px) stacks each
         * row into a card and renders the column header as a ::before label sourced
         * from each cell's data-label attribute. This method is the single point that
         * stamps that attribute: it reads the header text from each <th> and copies
         * it onto the matching column index in every body <td>.
         *
         * Layout itself is pure CSS — this only supplies the label text. It runs on
         * init and again after rows are added so dynamically-cloned rows are covered.
         * It never touches field state, visibility, or DOM structure.
         *
         * @param {HTMLElement} [scope] - Optional row element to limit stamping to
         *        (used after a single row is added); defaults to the whole tbody.
         */
        #stampMobileLabels(scope) {
            const widget = this.element.querySelector(Table.selectors.widget);
            if (!widget) {
                return;
            }
            const thead = widget.querySelector("thead");
            const tbody = widget.querySelector("tbody");
            if (!thead || !tbody) {
                return;
            }
            const headers = Array.from(thead.querySelectorAll("th.cmp-adaptiveform-tablehead"))
                .map((th) => th.innerText.replace(/\s+/g, " ").trim());
            if (headers.length === 0) {
                return;
            }
            const rows = scope && scope.matches && scope.matches("tr")
                ? [scope]
                : Array.from(tbody.querySelectorAll(":scope > tr"));
            rows.forEach((row) => {
                Array.from(row.cells).forEach((cell, index) => {
                    if (index < headers.length && headers[index]) {
                        cell.setAttribute("data-label", headers[index]);
                    }
                });
            });
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
                if (firstChild && firstChild.element && firstChild.element.isConnected) {
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
                        const prevElement = document.getElementById(prevModel.id);
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

            // Stamp mobile card labels on the freshly added row.
            this.#stampMobileLabels(htmlElement);

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
            const minOccur = (typeof model.minOccur === 'number' && model.minOccur >= 0) ? model.minOccur : 0;
            const maxOccur = (typeof model.maxOccur === 'number' && model.maxOccur >= 0) ? model.maxOccur : -1;
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
                    removeBtn.setAttribute(dataVisible, items.length > minOccur);
                }
            });
        }

        #initColumnSortingIfEnabled() {
            const widget = this.element.querySelector(Table.selectors.widget);
            if (!widget) {
                return;
            }
            const thead = widget.querySelector("thead");
            const tbody = widget.querySelector("tbody");
            if (!thead || !tbody) {
                return;
            }
            thead.querySelectorAll("th.cmp-adaptiveform-tablehead").forEach((th, index) => {
                const btn = th.querySelector(".cmp-adaptiveform-table__sort-button");
                if (!btn) {
                    return;
                }
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
        #sortTableByColumn(tbody, thead, colIndex, forceDir = null) {
            const rows = Array.from(tbody.querySelectorAll(":scope > tr"));
            if (rows.length <= 1) {
                return;
            }
            let dir = forceDir ?? "asc";
            if (!forceDir && this._tableSortState && this._tableSortState.col === colIndex) {
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
         * Builds the mobile action bar (Sort | Filter) inserted before the table widget.
         * Bar is hidden on desktop via CSS. Overlays appended to document.body so
         * position:fixed works freely. Sort requires enableSorting; filter is always on.
         */
        #initMobileSortBar() {
            const widget = this.element.querySelector(Table.selectors.widget);
            if (!widget) return;
            const thead = widget.querySelector('thead');
            const tbody = widget.querySelector('tbody');
            if (!thead || !tbody) return;

            const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const headers = Array.from(thead.querySelectorAll('th.cmp-adaptiveform-tablehead'))
                .map((th) => th.innerText.replace(/\s+/g, ' ').trim());
            if (headers.length === 0) return;

            const sortingEnabled = this.element.dataset.cmpSortingEnabled === 'true';

            // --- Action bar (inserted BEFORE the widget) ---
            const bar = document.createElement('div');
            bar.className = 'cmp-adaptiveform-table__mobile-bar';
            bar.innerHTML = `
                <button type="button"
                        class="cmp-adaptiveform-table__mobile-bar-btn cmp-adaptiveform-table__mobile-bar-btn--sort"
                        aria-haspopup="listbox"
                        aria-label="Sort table"
                        ${sortingEnabled ? '' : 'disabled'}>
                    <span aria-hidden="true">⇅</span><span>Sort</span>
                </button>
                <div class="cmp-adaptiveform-table__mobile-bar-divider" role="separator" aria-orientation="vertical"></div>
                <button type="button"
                        class="cmp-adaptiveform-table__mobile-bar-btn cmp-adaptiveform-table__mobile-bar-btn--filter"
                        aria-haspopup="dialog"
                        aria-label="Filter table">
                    <span aria-hidden="true">▼</span><span>Filter</span>
                </button>`;
            widget.before(bar);

            // --- Sort overlay ---
            if (sortingEnabled) {
                const optionsHtml = headers.map((h, i) => `
                    <li class="cmp-adaptiveform-table__sort-option"
                        role="option" tabindex="0" data-col-index="${i}" aria-selected="false">
                        <span class="cmp-adaptiveform-table__sort-option-label">${esc(h)}</span>
                        <span class="cmp-adaptiveform-table__sort-option-indicator" aria-hidden="true"></span>
                    </li>`).join('');

                const sortOverlay = document.createElement('div');
                sortOverlay.className = 'cmp-adaptiveform-table__sort-overlay';
                sortOverlay.setAttribute('role', 'dialog');
                sortOverlay.setAttribute('aria-modal', 'true');
                sortOverlay.setAttribute('aria-label', 'Sort options');
                sortOverlay.innerHTML = `
                    <div class="cmp-adaptiveform-table__sort-sheet">
                        <div class="cmp-adaptiveform-table__sort-sheet-handle" aria-hidden="true"></div>
                        <p class="cmp-adaptiveform-table__sort-sheet-title">Sort by</p>
                        <ul class="cmp-adaptiveform-table__sort-options" role="listbox" aria-label="Sort columns">
                            ${optionsHtml}
                        </ul>
                    </div>`;
                document.body.appendChild(sortOverlay);
                this._mobileSortOverlay = sortOverlay;

                bar.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--sort').addEventListener('click', () => {
                    this.#openMobileSortSheet();
                });
                sortOverlay.addEventListener('click', (e) => {
                    if (e.target === sortOverlay) this.#closeMobileSortSheet();
                });
                sortOverlay.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.#closeMobileSortSheet();
                });
                sortOverlay.querySelectorAll('.cmp-adaptiveform-table__sort-option').forEach((opt) => {
                    const activate = () => {
                        const colIndex = parseInt(opt.dataset.colIndex, 10);
                        this.#sortTableByColumn(tbody, thead, colIndex);
                        this.#updateMobileSortIndicators();
                        this.#closeMobileSortSheet();
                    };
                    opt.addEventListener('click', activate);
                    opt.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
                    });
                });
            }

            // --- Filter overlay (Ascending / Descending direction picker) ---
            const filterOverlay = document.createElement('div');
            filterOverlay.className = 'cmp-adaptiveform-table__sort-overlay';
            filterOverlay.setAttribute('role', 'dialog');
            filterOverlay.setAttribute('aria-modal', 'true');
            filterOverlay.setAttribute('aria-label', 'Sort order');
            filterOverlay.innerHTML = `
                <div class="cmp-adaptiveform-table__sort-sheet">
                    <div class="cmp-adaptiveform-table__sort-sheet-handle" aria-hidden="true"></div>
                    <p class="cmp-adaptiveform-table__sort-sheet-title">Sort order</p>
                    <ul class="cmp-adaptiveform-table__sort-options" role="listbox" aria-label="Sort direction">
                        <li class="cmp-adaptiveform-table__sort-option"
                            role="option" tabindex="0" data-dir="asc" aria-selected="false">
                            <span>Ascending</span>
                            <span class="cmp-adaptiveform-table__sort-option-indicator" aria-hidden="true"></span>
                        </li>
                        <li class="cmp-adaptiveform-table__sort-option"
                            role="option" tabindex="0" data-dir="desc" aria-selected="false">
                            <span>Descending</span>
                            <span class="cmp-adaptiveform-table__sort-option-indicator" aria-hidden="true"></span>
                        </li>
                    </ul>
                </div>`;
            document.body.appendChild(filterOverlay);
            this._mobileFilterOverlay = filterOverlay;

            bar.querySelector('.cmp-adaptiveform-table__mobile-bar-btn--filter').addEventListener('click', () => {
                this.#openMobileFilterSheet();
            });
            filterOverlay.addEventListener('click', (e) => {
                if (e.target === filterOverlay) this.#closeMobileFilterSheet();
            });
            filterOverlay.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.#closeMobileFilterSheet();
            });
            filterOverlay.querySelectorAll('.cmp-adaptiveform-table__sort-option').forEach((opt) => {
                const activate = () => {
                    const dir = opt.dataset.dir;
                    const colIndex = this._tableSortState ? this._tableSortState.col : 0;
                    this.#sortTableByColumn(tbody, thead, colIndex, dir);
                    this.#updateMobileFilterIndicators();
                    this.#closeMobileFilterSheet();
                };
                opt.addEventListener('click', activate);
                opt.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
                });
            });
        }

        #openMobileSortSheet() {
            if (!this._mobileSortOverlay) return;
            this.#updateMobileSortIndicators();
            this._mobileSortOverlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            const first = this._mobileSortOverlay.querySelector('.cmp-adaptiveform-table__sort-option');
            if (first) first.focus();
        }

        #closeMobileSortSheet() {
            if (!this._mobileSortOverlay) return;
            this._mobileSortOverlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        #openMobileFilterSheet() {
            if (!this._mobileFilterOverlay) return;
            this.#updateMobileFilterIndicators();
            this._mobileFilterOverlay.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            const first = this._mobileFilterOverlay.querySelector('.cmp-adaptiveform-table__sort-option');
            if (first) first.focus();
        }

        #closeMobileFilterSheet() {
            if (!this._mobileFilterOverlay) return;
            this._mobileFilterOverlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        #updateMobileFilterIndicators() {
            if (!this._mobileFilterOverlay) return;
            this._mobileFilterOverlay.querySelectorAll('.cmp-adaptiveform-table__sort-option').forEach((opt) => {
                const active = !!this._tableSortState && this._tableSortState.dir === opt.dataset.dir;
                opt.setAttribute('aria-selected', active ? 'true' : 'false');
                const indicator = opt.querySelector('.cmp-adaptiveform-table__sort-option-indicator');
                if (indicator) indicator.textContent = active ? '✓' : '';
            });
        }

        #updateMobileSortIndicators() {
            if (!this._mobileSortOverlay) return;
            this._mobileSortOverlay.querySelectorAll('.cmp-adaptiveform-table__sort-option').forEach((opt) => {
                const colIndex = parseInt(opt.dataset.colIndex, 10);
                const indicator = opt.querySelector('.cmp-adaptiveform-table__sort-option-indicator');
                const active = this._tableSortState && this._tableSortState.col === colIndex;
                opt.setAttribute('aria-selected', active ? 'true' : 'false');
                if (indicator) {
                    indicator.textContent = active ? (this._tableSortState.dir === 'asc' ? '↑' : '↓') : '';
                }
            });
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
