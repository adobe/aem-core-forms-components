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

(function() {

    "use strict";
    class FormContainerV2 extends FormView.FormContainer {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormContainer";
        static bemBlock = 'cmp-adaptiveform-container';
        static hamburgerSupport = false;
        static nestingSupport = 5;

        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            menu: `.${FormContainerV2.bemBlock}-menu`,
            hamburgerMenu: `.${FormContainerV2.bemBlock}-hamburgerMenu`,
            hamburgerMenuIcon: `.${FormContainerV2.bemBlock}-hamburger-icon`,
            hamburgerSubMenu: `.${FormContainerV2.bemBlock}-submenu`,
            hamburgerMenuContainer: `.${FormContainerV2.bemBlock}-hamburgerMenuContainer`,
            topContainer: `.${FormContainerV2.bemBlock}-top-container`,
            containerMenu: `.${FormContainerV2.bemBlock}-container-menu`,
            navBar: `.${FormContainerV2.bemBlock}-nav-bar`,
            navTitle: `.${FormContainerV2.bemBlock}-nav-title`,
            navLink: `.${FormContainerV2.bemBlock}-nav-link`,
            upNavButton: `.${FormContainerV2.bemBlock}-nav-button-up`,
            downNavButton: `.${FormContainerV2.bemBlock}-nav-button-down`,
            leftNavButton: `.${FormContainerV2.bemBlock}-nav-button-left`,
            rightNavButton: `.${FormContainerV2.bemBlock}-nav-button-right`,
            navButtonsContainer: `.${FormContainerV2.bemBlock}-nav-buttons`,
            active: `.${FormContainerV2.bemBlock}-hamburger-menu-item-active`,
            breadCrumbsContainer: `.${FormContainerV2.bemBlock}-breadcrumbs-container`
        };

        static cssClasses = {
            active: `${FormContainerV2.bemBlock}-hamburger-menu-item-active`,
            activeParent: `${FormContainerV2.bemBlock}-hamburger-menu-item-activeparent`,
            hamburgerMenu: `${FormContainerV2.bemBlock}-hamburgerMenu`,
            upNavButton: `${FormContainerV2.bemBlock}-nav-button-up`,
            downNavButton: `${FormContainerV2.bemBlock}-nav-button-down`,
            navLink: `${FormContainerV2.bemBlock}-nav-link`,
            hamburgerSubMenu: `${FormContainerV2.bemBlock}-submenu`,
        }

        handleActiveItem(field) {
            const menu = document.querySelector(FormContainerV2.selectors.hamburgerMenu);
            const formContainer = formContainerGlobal;
            if (field !== null && field) {
                const activeListItem = document.querySelector(`[data-cmp-id='${field.id}']`);
                if(activeListItem && activeListItem.tagName === 'LI') {
                    const menuItems = document.querySelectorAll(FormContainerV2.selectors.hamburgerMenu + ' li');
                    const fieldModel = formContainer?.getField(activeListItem?.getAttribute('data-cmp-id'))?.getModel();
                    const elementID = checkFirstNonPanel(fieldModel)
                    const targetElement = menu.querySelector("[data-cmp-id='"+ elementID + "']");
                    resetMenuItems(menuItems);
                    activateCurrentItem(targetElement);
                    const anchorElement = targetElement?.querySelector('a');
                    anchorElement?.classList.add(FormContainerV2.cssClasses.active);
                    anchorElement?.querySelector('button')?.classList?.toggle(FormContainerV2.cssClasses.upNavButton);
                    updateSelectedPanelTitle(anchorElement);
                    highlightMenuTree(anchorElement);
                    renderBreadCrumbs(menu);
                }
            }
        }

        handleItemsChange(change, items) {
            if (change?.prevValue !== null) {
                document.querySelector(`[data-cmp-id='${change?.prevValue?.id}']`)?.remove();
            } else {
                items.forEach((item) => {
                    if (item.id === change.currentValue.id) {
                        const prevListItem = document.querySelector(`[data-cmp-id='${items[change.currentValue.index - 1]?.id}']`);
                        const newListItem = this.createListItem(change.currentValue);
                        prevListItem?.parentNode?.insertBefore(newListItem, prevListItem.nextSibling);
                    }
                });
            }
        }

        updateAttribute(id, attributeName, value) {
            const element = document.querySelector(`[data-cmp-id='${id}']`);
            if (attributeName === 'data-cmp-enabled' && element) {
                if (value === 'false') {
                    element.setAttribute('disabled', 'true');
                } else {
                    element.removeAttribute('disabled');
                }
            }
            if (element) {
                element.setAttribute(attributeName, value);
            }
        }

        createListItem(item) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            const textSpan = document.createElement('span');
            link.href = "#";
            textSpan.textContent = item?.label?.value;
            link.appendChild(textSpan);
            li.appendChild(link);
            li.setAttribute('data-cmp-id', item?.id);
            li.setAttribute('data-cmp-visible', item?.visible);
            li.setAttribute('data-cmp-enabled', item?.enabled);
            return li;
        }

        static loadingClass = `${FormContainerV2.bemBlock}--loading`;
        constructor(params) {
            super(params);
            let self = this;
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on submitSuccess event.
                if (!state.events.submitSuccess || state.events.submitSuccess.length === 0) {
                    const globals = {
                        form: self.getModel().getRuleNode(),
                        event: {
                            type: action.type,
                            payload: action.payload,
                        }
                    };
                    FormView.customFunctions.defaultSubmitSuccessHandler(globals);
                }
            }, "submitSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on submitError event.
                if (!state.events.submitError || state.events.submitError.length === 0) {
                    let defaultSubmissionError = FormView.LanguageUtils.getTranslatedString(self.getLang(), "InternalFormSubmissionError");
                    const globals = {
                        form: self.getModel().getRuleNode(),
                        event: {
                            type: action.type,
                            payload: action.payload,
                        }
                    };
                    FormView.customFunctions.defaultSubmitErrorHandler(defaultSubmissionError, globals);
                }
            }, "submitError");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on custom:saveSuccess event.
                if (!state.events['custom:saveSuccess'] || state.events['custom:saveSuccess'].length === 0) {
                    console.log("Draft id = " + action?.payload?.body?.draftId);
                    window.alert(FormView.LanguageUtils.getTranslatedString(self.getLang(), "saveDraftSuccessMessage"));
                }
            }, "saveSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on custom:saveError event.
                if (!state.events['custom:saveError'] || state.events['custom:saveError'].length === 0) {
                    window.alert(FormView.LanguageUtils.getTranslatedString(self.getLang(), "saveDraftErrorMessage"));
                }
            }, "saveError");
            this.#setupAutoSave(self.getModel());
        }

        /**
         * Register time based auto save
         * @param formModel.
         */
         #setupAutoSave(formModel) {
            const autoSaveProperties = formModel?.properties?.['fd:autoSave'];
            const enableAutoSave = autoSaveProperties?.['fd:enableAutoSave'];
            if (enableAutoSave) {
                const autoSaveStrategyType = autoSaveProperties['fd:autoSaveStrategyType'];
                const autoSaveInterval = autoSaveProperties['fd:autoSaveInterval'];
                const saveEndPoint = FormView.Utils.getContextPath() + '/adobe/forms/af/save/' + formModel.id;
                if (autoSaveStrategyType === 'time' && autoSaveInterval) {
                    console.log("Registering time based auto save");
                    setInterval(() => {
                        formModel.dispatch(new FormView.Actions.Save({
                            'action': saveEndPoint
                        }));
                    }, parseInt(autoSaveInterval) * 1000);
                }
            }
            this._model.subscribe((action) => {
                const { payload } = action;
                const { changes, field } = payload;
                const { items } = field;
                // console.log('action changed log: ', action);
                if (changes && changes.length > 0) {
                    changes.forEach((change) => {
                        switch (change.propertyName) {
                            case "activeChild":
                                this.handleActiveItem(field, change);
                                break;
                            case "items":
                                this.handleItemsChange(change, items);
                                break;
                            case "visible":
                                this.updateAttribute(field.id, 'data-cmp-visible', field.visible);
                                break;
                            case "enabled":
                                this.updateAttribute(field.id, 'data-cmp-enabled', field.enabled);
                                break;
                        }
                    });
                }
            }, "fieldChanged");
        }
    }

    let formContainerGlobal = '';
    let activeItemId = '';

    function isRepeatable(item) {
        return item.fieldType === 'panel' && item.type === 'array'
    }

    function getAllItems(formContainer) {
        let state = formContainer._model.getState(true);
        while (state?.items?.length === 1) {
          state = state.items[0];
        }
        return state.items || [];
    }

    function findDeeplyNestedFirstLi(rootListItem) {
        // Base case: if the current item has no children, return it
        const firstChildLi = rootListItem.querySelector('li');
        if (!firstChildLi) {
            return rootListItem;
        }
        // Recursive case: continue searching in the first child
        return findDeeplyNestedFirstLi(firstChildLi);
    }

    function updateSelectedPanelTitle(anchorElement) {
        const navTitleText = anchorElement?.innerText;
        const navTitle = document.querySelector(FormContainerV2.selectors.navTitle);
        navTitle.innerText = navTitleText;
    }

    function checkFirstNonPanel(fieldModel) {
        if(fieldModel && fieldModel._children && fieldModel?._children[0]) {
            if(fieldModel._children[0]?.fieldType !== 'panel') {
                return fieldModel._children[0].parent.id;
            }
            return checkFirstNonPanel(fieldModel?._children[0])
        }
        return fieldModel.id;
    }


    function clickHandler(event) {
        const formContainer = formContainerGlobal;
        const menu = document.querySelector(FormContainerV2.selectors.hamburgerMenu);
        event.stopPropagation(); 
        let targetElement = event.target.closest('li');    
        if(targetElement.getAttribute('data-cmp-enabled') === 'false') {
            return;
        }
        if(event.target.tagName === "BUTTON")  {
            event.target.classList.toggle(FormContainerV2.cssClasses.upNavButton);
            return;
        }
        const menuItems = document.querySelectorAll(FormContainerV2.selectors.hamburgerMenu + ' li');
        const fieldModel = formContainer?.getField(targetElement?.getAttribute('data-cmp-id'))?.getModel();
        const elementID = checkFirstNonPanel(fieldModel)
        targetElement = menu.querySelector("[data-cmp-id='"+ elementID + "']");
        resetMenuItems(menuItems);
        activateCurrentItem(targetElement);
        const anchorElement = targetElement?.querySelector('a');
        anchorElement?.classList.add(FormContainerV2.cssClasses.active);
        anchorElement?.querySelector('button')?.classList?.toggle(FormContainerV2.cssClasses.upNavButton);
        updateSelectedPanelTitle(anchorElement);
        highlightMenuTree(anchorElement);
                    
        const itemId = targetElement.getAttribute('data-cmp-id') || activeItemId;
        const form = formContainer.getModel();;
        const field = formContainer.getField(itemId);
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        if (form && field && field._model) {
          form.setFocus(field._model);
        }
        renderBreadCrumbs(menu);
    }

    function resetMenuItems(menuItems) {
        menuItems.forEach(item => {
            const subMenu = item.querySelector(FormContainerV2.selectors.hamburgerSubMenu);
            if (subMenu) subMenu.style.display = 'none';
            const link = item.querySelector('a');
            if(link) {
                link?.querySelector('button')?.classList.remove(FormContainerV2.cssClasses.upNavButton);
                link?.querySelector('button')?.classList.add(FormContainerV2.cssClasses.downNavButton);
                link?.classList.remove(FormContainerV2.cssClasses.active, FormContainerV2.cssClasses.activeParent);
                link.style.fontWeight = 'normal';
            }
        });
    }
    
    function activateCurrentItem(currentItem) {
        while (currentItem) {
            const subMenu = currentItem.querySelector(FormContainerV2.selectors.hamburgerSubMenu);
            if (subMenu) subMenu.style.display = 'block';
            currentItem = currentItem.parentElement.closest('li');
        }
    }

    function createDownArrowButton() {
        const downArrowButton = document.createElement('button');
        downArrowButton.type='button';
        downArrowButton.classList.add(FormContainerV2.cssClasses.downNavButton);
        return downArrowButton;
    }

    function createHamburgerMenu(formContainer, items, counter = 0) {
        if (counter >= FormContainerV2.nestingSupport) {
            return;
        }
        if (!items?.length) return;
    
        const ul = document.createElement('ul');
        ul.classList.add('cmp-adaptiveform-container-breadcrumbs-container-list');
        let navTitleUpdated = false;
        
        items.forEach((item) => {
            if (item?.fieldType !== "panel") return;

            if (!navTitleUpdated) {
                const navTitle = document.querySelector(FormContainerV2.selectors.navTitle);
                if(navTitle) {
                    navTitle.innerText = item?.label?.value;
                    navTitleUpdated = true;
                }
            }
    
            const li = document.createElement('li');
            const link = document.createElement('a');
            const textSpan = document.createElement('span');
            link.href = "#";
            textSpan.textContent = item?.label?.value;
            link.appendChild(textSpan);
            link.style.visibility = item?.label?.visible ? 'visible' : 'hidden';
            li.appendChild(link);
            
            li.setAttribute('data-cmp-id', item?.id);
            li.setAttribute('data-cmp-visible', item?.visible);
            li.setAttribute('data-cmp-enabled', item?.enabled);
            const children = formContainer?.getField(item.id)?._model?._children;
            let flag = false;
            if(children) {
                for(let i = 0; i< children.length; i++) {
                    if(children[i].fieldType !== 'panel') {
                        flag = true;
                    }
                }
            }

            if(flag) {
                li.setAttribute('data-cmp-has-input', flag);
            }

            link.classList.add(FormContainerV2.cssClasses.navLink);

            if (isRepeatable(item)) {
                const subMenu = createHamburgerMenu(formContainer, item.items, counter + 1);
                subMenu?.childNodes.forEach(child => ul.appendChild(child));
            } else if (Array.isArray(item.items) && item.items.length > 0) {
                const subMenu = createHamburgerMenu(formContainer, item.items, counter + 1);
                if (subMenu?.childNodes?.length) {
                    subMenu.classList.add(FormContainerV2.cssClasses.hamburgerSubMenu);
                    li.appendChild(subMenu);
                    link.insertBefore(createDownArrowButton(), link.firstChild);
                    link.addEventListener('click', () => {
                        event.preventDefault();
                        if (li.getAttribute('data-cmp-enabled') === 'false') {
                            return;
                        }
                        if (subMenu.style.display === 'flex' || subMenu.style.display === 'block') {
                            subMenu.style.display = 'none';
                        } else {
                            subMenu.style.display = 'flex';
                        }
                    });
                }
            }
            ul.appendChild(li);
        });
    
        return ul;
    }

    function hideIndividualComponentsNavigation() {
        // hide all the horizontal tabs list
        const tabsLists = document.getElementsByClassName('cmp-tabs__tablist');
        Array.from(tabsLists).forEach(tabsList => {
            tabsList.style.display = 'none';
        });

        // hide all the vertical tabs list
        const verticalTabsLists = document.getElementsByClassName('cmp-verticaltabs__tablist');
        Array.from(verticalTabsLists).forEach(tabsList => {
            tabsList.style.display = 'none';
        });
        // hide all the wizard tabs list
        const wizardTabsLists = document.getElementsByClassName('cmp-adaptiveform-wizard__tabList');
        const wizardTabsNavButton = document.querySelector('.cmp-adaptiveform-wizard__containerNav');
        if(wizardTabsNavButton) wizardTabsNavButton.style.display = 'none';
        Array.from(wizardTabsLists).forEach(tabsList => {
            tabsList.style.display = 'none';
        });
    }

    // Function to find the currently active li
    function findActiveLi() {
        return document.querySelector(FormContainerV2.selectors.active).parentElement;
    }

    function highlightMenuTree(element) {
        const closestLI = element.closest('li');
    
        if (!closestLI || closestLI === document.body) {
            return;
        }
        let anchorElement = closestLI.querySelector('a');
        if(anchorElement) {
            anchorElement?.classList.add(FormContainerV2.cssClasses.activeParent);
            anchorElement?.querySelector('button')?.classList.add(FormContainerV2.cssClasses.upNavButton);
            if(closestLI.parentElement.classList.contains(FormContainerV2.cssClasses.hamburgerMenu)) {
                anchorElement.style.fontWeight = 'bold'
            }
            highlightMenuTree(closestLI.parentElement);
        }
    }

    function isEligible(element, direction) {
        if (element && element?.getAttribute('data-cmp-visible') === 'false' || element?.getAttribute('data-cmp-enabled') === 'false' || (direction === 'prev' && element?.getAttribute('data-cmp-has-input') !== 'true')) {
            return false;
        } else if (element && element.parentNode && element.parentNode !== document) {
            return isEligible(element.parentNode);
        } else {
            return true;
        }
    }
    function moveTo(menuListItems, direction) {
        const currentActive = findActiveLi();
        if (!currentActive) return;
    
        let newActiveItemIndex = -1;
        menuListItems.forEach((item, index) => {
            if (item.getAttribute('data-cmp-id') === currentActive.getAttribute('data-cmp-id')) {
                newActiveItemIndex = direction === 'prev' ? index - 1 : index + 1;
            }
        });
    
        if (direction === 'prev' && newActiveItemIndex < 0) {
            newActiveItemIndex = menuListItems.length - 1;
        } 
        // else if (direction === 'next' && newActiveItemIndex >= menuListItems.length) {
        //     newActiveItemIndex = 0;
        // }

        // Find the next visible item
        while (!isEligible(menuListItems[newActiveItemIndex], direction)) {
            newActiveItemIndex = direction === 'prev' 
                ? (newActiveItemIndex - 1 + menuListItems.length) % menuListItems.length 
                : (newActiveItemIndex + 1) % menuListItems.length;
        }
    
        const newActiveItem = menuListItems[newActiveItemIndex];
        activeItemId = newActiveItem?.getAttribute('data-cmp-id');
        newActiveItem?.click();
    }

    function movePrev(menuListItems) {
        moveTo(menuListItems, 'prev');
    }
    
    function moveNext(menuListItems) {
        moveTo(menuListItems, 'next');
    }

    function addEventsToNavigationButtons() {
        const leftNavButton = document.querySelector(FormContainerV2.selectors.leftNavButton);
        const rightNavButton = document.querySelector(FormContainerV2.selectors.rightNavButton);
        const menuListItems = document.querySelector(FormContainerV2.selectors.hamburgerMenu).querySelectorAll('li');
        leftNavButton.addEventListener('click', () => movePrev(menuListItems));
        rightNavButton.addEventListener('click', () => moveNext(menuListItems));
    }

    function generateBreadcrumbs(breadcrumbs) {
        const container = document.createElement('nav');
        container.setAttribute('aria-label', 'Breadcrumb');
        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';
        list.style.margin = '0';
        if(breadcrumbs && breadcrumbs.length) {
            [...breadcrumbs].forEach((breadcrumb, index) => {
                const listItem = document.createElement('li');
                listItem.style.display = 'inline';
                const span = document.createElement('span');
                span.textContent = breadcrumb.innerText;
                listItem.appendChild(span);
                if (index < breadcrumbs.length - 1) {
                    const separator = document.createElement('span');
                    separator.textContent = ' > ';
                    separator.style.margin = '0 5px';
                    listItem.appendChild(separator);
                }
                if(index  ===  breadcrumbs?.length-1) {
                    listItem.style.fontWeight = 'bold';
                }
                list.appendChild(listItem);
            });
        }
        container.appendChild(list);
        return container;
    }

    function renderBreadCrumbs(menu) {
        const selectedPanels = menu.getElementsByClassName(FormContainerV2.cssClasses.activeParent);
        const breadCrumbsContainer = document.querySelector(FormContainerV2.selectors.breadCrumbsContainer);
        breadCrumbsContainer.innerHTML = '';
        const breadCrumbs = generateBreadcrumbs(selectedPanels)
        breadCrumbsContainer.appendChild(breadCrumbs);
        breadCrumbsContainer.scrollLeft = breadCrumbs.scrollWidth;
    }

    function renderHamburgerItems(panels, formContainer) {
        const parentContainer = document.querySelector(FormContainerV2.selectors.menu);
        const hamburgerIcon = document.querySelector(FormContainerV2.selectors.hamburgerMenuIcon);
        const hamburgerMenuContainer = document.querySelector(FormContainerV2.selectors.hamburgerMenuContainer);

        const menu = createHamburgerMenu(formContainer, panels);
        if(menu) {
            menu.classList.add(FormContainerV2.cssClasses.hamburgerMenu);

            setupHamburgerEventListeners(hamburgerIcon, menu);

            setupOutsideClickListener(hamburgerIcon, menu);

            hideIndividualComponentsNavigation();
            setupMenuEventListeners(menu);
            styleSubmenuItems(menu);
            parentContainer.innerHTML='';
            parentContainer.appendChild(hamburgerMenuContainer);
            parentContainer.appendChild(menu);

            addEventsToNavigationButtons();
            const rootListItems = menu.querySelectorAll(FormContainerV2.selectors.hamburgerMenu + ' > li');

            // let deeplyNestedFirstLi = findDeeplyNestedFirstLi(rootListItems[0]);
            if (rootListItems[0] && rootListItems[0].tagName === 'LI') {
                rootListItems[0].click();
                menu.style.display = 'none';
            }
        }
    }

    function setupMenuEventListeners(menu) {
        menu.addEventListener('click', clickHandler);
        menu.addEventListener('ontouchstart', clickHandler);
    }

    function setupHamburgerEventListeners(hamburgerIcon, menu) {
        const toggleMenuVisibility = () => {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        };
        hamburgerIcon?.addEventListener('click', toggleMenuVisibility);
        hamburgerIcon?.addEventListener('ontouchstart', toggleMenuVisibility);
    }
    
    function styleSubmenuItems(menu) {
        const rootListItems = menu.querySelectorAll(FormContainerV2.selectors.hamburgerMenu + ' > li');
        rootListItems.forEach((item) => {
            let padding = 30;
            const submenus = item.querySelectorAll(FormContainerV2.selectors.hamburgerSubMenu);
            submenus.forEach((submenu) => {
                const links = submenu.querySelectorAll('a');
                links.forEach((link) => {
                    if(link.querySelector('button')) {
                         link.style.paddingInlineStart = `${padding}px`;
                    } else {
                        link.style.paddingInlineStart = `${padding + 30}px`;
                    }
                });
                padding += 15;
            });
        });
    }

    function setupOutsideClickListener(hamburger, menu) {
        window.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !menu.contains(e.target) && menu.style.display === 'flex') {
                menu.style.display = 'none';
            }
        });
    }

    function structureMenuData(data) {
        const panels = data.filter(item => item?.fieldType ===  "panel");
        return panels;
    }

    async function onDocumentReady() {
        const startTime = new Date().getTime();
        let elements = document.querySelectorAll(FormContainerV2.selectors.self);
        for (let i = 0; i < elements.length; i++) {
            let loaderToAdd = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ elements[i].id + "']");
            if(loaderToAdd){
                loaderToAdd.classList.add(FormContainerV2.loadingClass);
            }
            console.debug("Form loading started", elements[i].id);
        }
        function onInit(e) {
            let formContainer =  e.detail;
            formContainerGlobal = formContainer;
            const items = getAllItems(formContainer);
            const menuData = structureMenuData(items);
            if(formContainer?.getModel()?.properties?.['fd:hamburgerMenu']) {
                renderHamburgerItems(menuData, formContainer);
            }
            let formEl = formContainer.getFormElement();
            setTimeout(() => {
                let loaderToRemove = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ formEl.id + "']");
                if(loaderToRemove){
                    loaderToRemove.classList.remove(FormContainerV2.loadingClass);
                }
                const timeTaken = new Date().getTime() - startTime;
                console.debug("Form loading complete", formEl.id, timeTaken);
                }, 10);
        }
        document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, onInit);
        await FormView.Utils.setupFormContainer(async ({
            _formJson, _prefillData, _path, _element
        }) => {
            let formContainer = new FormContainerV2({_formJson, _prefillData, _path, _element});
            // before initializing the form container load all the locale specific json resources
            // for runtime
            const formLanguage = formContainer.getLang();
            const aemLangUrl = `/etc.clientlibs/core/fd/af-clientlibs/core-forms-components-runtime-all/resources/i18n/${formLanguage}.json`;
            await FormView.LanguageUtils.loadLang(formLanguage, aemLangUrl, true);
            formContainer.subscribe();
            return formContainer;
        }, FormContainerV2.selectors.self, FormContainerV2.IS);
    }

    // This is to ensure that the there is no WCM Mode cookie when Form Container is rendered.
    // max-age=0 ensures that the cookie is deleted.
    document.cookie="wcmmode=disabled; max-age=0; path=/";
    
    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();
