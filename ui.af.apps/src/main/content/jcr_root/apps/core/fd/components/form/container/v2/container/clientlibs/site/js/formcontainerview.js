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
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        };
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
                    window.alert("Draft has been saved successfully");
                }
            }, "saveSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on custom:saveError event.
                if (!state.events['custom:saveError'] || state.events['custom:saveError'].length === 0) {
                    window.alert("Issue while saving draft");
                }
            }, "saveError");
            this._model.subscribe((action) => {
                const payload = action.payload;
                const changes = payload.changes;
                const items  = payload.field.items;
                if (changes && changes.length > 0) {
                    changes.forEach((change) => {
                        if(change.propertyName === "items" ) {
                            if(change?.prevValue !== null) {
                                document.querySelector("[data-cmp-id='"+ change.prevValue.id + "']").remove();
                            } else {
                                items.forEach((item) => {
                                    if(item.id == change.currentValue.id) {
                                        const prevListItem = document.querySelector("[data-cmp-id='"+ items[change.currentValue.index-1].id + "']");
                                        const li = document.createElement('li');
                                        const link = document.createElement('a');
                                        link.href = "#";
                                        link.textContent = change.currentValue?.label?.value;
                                        li.appendChild(link);
                                        li.setAttribute('data-cmp-id', change.currentValue?.id);
                                        li.setAttribute('data-cmp-visible', change.currentValue?.visible);
                                        prevListItem.parentNode.insertBefore(li, prevListItem.nextSibling);
                                    }
                                });
                            }
                        }
                        if(change.propertyName === "visible") {
                            const fieldChanged = document.querySelector("[data-cmp-id='"+ payload.field.id + "']");
                            fieldChanged.setAttribute('data-cmp-visible', payload.field.visible);
                        }
                        if(change.propertyName === "enabled") {
                            const fieldChanged = document.querySelector("[data-cmp-id='"+ payload.field.id + "']");
                            fieldChanged.setAttribute('data-cmp-enabled', payload.field.enabled);
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

    function hoverHandler() {
        const listItems = document.querySelectorAll('.cmp-adaptiveform-container-hamburgerMenu li');
        listItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                listItems.forEach(li => {
                    const subMenu = li.querySelector('.cmp-adaptiveform-container-submenu');
                    if (subMenu) {
                        subMenu.style.display = 'none';
                    }
                });

                let currentItem = event.target.closest('li');
                while (currentItem) {
                    const subMenu = currentItem.querySelector('.cmp-adaptiveform-container-submenu');
                    if (subMenu) {
                        subMenu.style.display = 'block';
                    }
                    currentItem = currentItem.parentElement.closest('li');
                }
            });
        });
    }

    function getFirstNonPanelChild(json) {
        if(json?.items?.length > 0) {
            const items = json?.items;
            for (let index = 0; index < items.length; index++) {
                const it = items[index];
                if(it?.items?.length) {
                    getFirstNonPanelChild(it?.items);
                } else {
                    return it.id;
                }
            }
        } else {
            return json?.[0]?.id;
        }
    }

    function clickHandler(e) {
        const formContainer = formContainerGlobal;
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-cmp-id') ? e.target.parentElement.getAttribute('data-cmp-id') : activeItemId;
        formContainer.setFocus(id);
        const newID = getFirstNonPanelChild(formContainer.getModel(id));

        const listItems = document.querySelectorAll('.cmp-adaptiveform-container-hamburgerMenu li');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                listItems.forEach(li => {
                    li.classList.remove('active');
                });
            });
        });
        setTimeout(function () {
            formContainer.setFocus(newID);
        }, 100);
        e.target.closest('li')?.classList?.add('active');
    }

    function createHamburgerMenu(formContainer, items) {
        if(items?.length > 0) {
            const ul = document.createElement('ul');
            items.forEach((item) => {
                if (item?.fieldType === "panel") {
                    if(isRepeatable(item)) {
                        const subMenu = createHamburgerMenu(formContainer, item.items);
                        subMenu.childNodes.forEach(child => {
                            ul.appendChild(child);
                        });
                    } else {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = "#";
                    link.textContent = item?.label?.value;
                    link.style.visibility = item?.label?.visible ? 'visible' : 'hidden';
                    li.appendChild(link);
                    li.setAttribute('data-cmp-id', item?.id);
                    li.setAttribute('data-cmp-visible', item?.visible);
                    if (Array.isArray(item.items) && item.items.length > 0) {
                        const subMenu = createHamburgerMenu(formContainer, item.items);
                        if(subMenu?.childNodes?.length){ 
                            subMenu.classList.add('cmp-adaptiveform-container-submenu');
                            li.appendChild(subMenu);
                        }
                        // Toggle submenu visibility on link click
                        link.addEventListener('click', (e) => {
                            if (subMenu.style.display === 'flex') {
                                subMenu.style.display = 'none';
                            } else {
                                subMenu.style.display = 'flex';
                            }
                        });
                    }
                    ul.appendChild(li);
                }
            }
            });
            return ul;
        }
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
      Array.from(wizardTabsLists).forEach(tabsList => {
          tabsList.style.display = 'none';
      });
  }

    // Function to find the currently active li
    function findActiveLi() {
        return document.querySelector('.active');
    }


    function isVisible(element) {
        if (element.getAttribute('data-cmp-visible') === 'false') {
            return false;
        } else if (element.parentNode && element.parentNode !== document) {
            return isVisible(element.parentNode);
        } else {
            return true;
        }
    }

    // Function to move to the previous li
    function movePrev(menuListItems, formContainer) {
        const currentActive = findActiveLi();
        if (!currentActive) return; // No active item found
        let newActiveItemIndex = "";
        menuListItems.forEach((item, index) => {
            if(item.getAttribute('data-cmp-id') === currentActive.getAttribute('data-cmp-id')) {
                newActiveItemIndex = index-1;
            }
        });
        if(newActiveItemIndex <= 0){
            newActiveItemIndex = 0;
        }
        // Find the next visible item
        while (!isVisible(menuListItems[newActiveItemIndex])) {
            newActiveItemIndex = (newActiveItemIndex - 1) % menuListItems.length;
        }
        const newActiveItem =  menuListItems[newActiveItemIndex];
        activeItemId = newActiveItem.getAttribute('data-cmp-id');
        newActiveItem.click();
        newActiveItem.classList.remove('active');
        newActiveItem.classList.add('active');
    }

    // Function to move to the next li
    function moveNext(menuListItems, formContainer) {
        const currentActive = findActiveLi();
        if (!currentActive) return; // No active item found
        let newActiveItemIndex = "";
        menuListItems.forEach((item, index) => {
            if(item.getAttribute('data-cmp-id') === currentActive.getAttribute('data-cmp-id')) {
                newActiveItemIndex = index+1;
            }
        });
        if(menuListItems.length === newActiveItemIndex){
            newActiveItemIndex = 0;
        }
        // Find the next visible item
        while (!isVisible(menuListItems[newActiveItemIndex])) {
            newActiveItemIndex = (newActiveItemIndex + 1) % menuListItems.length;
        }

        const newActiveItem =  menuListItems[newActiveItemIndex];
        activeItemId = newActiveItem.getAttribute('data-cmp-id');
        newActiveItem.click();
        newActiveItem.classList.remove('active');
        newActiveItem.classList.add('active');
      }

    function addNavigationButtons(menu, formContainer) {
        const div = document.createElement('div');
        div.classList.add('cmp-adaptiveform-container-nav-buttons');
        const leftNavButton = document.createElement('div');
        leftNavButton.classList.add('cmp-adaptiveform-container-left-nav-button');

        const rightNavButton = document.createElement('div');
        rightNavButton.classList.add('cmp-adaptiveform-container-right-nav-button');

        div.appendChild(leftNavButton);
        div.appendChild(rightNavButton);
        const menuListItems = document.querySelector('.cmp-adaptiveform-container-hamburgerMenu').querySelectorAll('li');

        leftNavButton.addEventListener('click', () => movePrev(menuListItems,formContainer));
        rightNavButton.addEventListener('click', () => moveNext(menuListItems,formContainer));

        menu.insertBefore(div, menu.firstChild);
    }

    function renderHamburgerItems(panels, formContainer) {
        const parentContainer = document.querySelector(".cmp-adaptiveform-container");
        const hamburgerMenuIcon = document.querySelector(".hamburger");
        // Creating the hamburger icon
        if(!hamburgerMenuIcon) {
            const hamburger = document.createElement('div');
            hamburger.classList.add('cmp-adaptiveform-container-hamburger');
            hideIndividualComponentsNavigation();

            // Create the menu
            const menu = createHamburgerMenu(formContainer, panels);
            menu.addEventListener('click', (e) => {
                clickHandler(e);
            })

            // Check if the device supports touch events
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

            // Function to handle hover or equivalent touch event
            const hoverOrTouchHandler = () => {
                hoverHandler();
            };

            // Add event listener based on device type
            if (isTouchDevice) {
                // For touch devices, use touchstart (or tap) event
                menu.addEventListener('touchstart', hoverOrTouchHandler);
            } else {
                // For non-touch devices, use mouseenter event
                menu.addEventListener('mouseover', hoverOrTouchHandler);
            }

            menu.classList.add('cmp-adaptiveform-container-hamburgerMenu');
            parentContainer.insertBefore(hamburger, parentContainer.firstChild);
            parentContainer.appendChild(menu);

            // Toggle menu visibility on hamburger click
            hamburger.addEventListener('click', (e) => {
                hamburger.classList.toggle('hamburgerClose');
                if (menu.style.display === 'flex') {
                    menu.style.display = 'none';
                } else {
                    menu.style.display = 'flex';
                }
            });

            // adding padding to each level of submenu
            const rootListItems = menu.querySelectorAll('.cmp-adaptiveform-container-hamburgerMenu > li')
            rootListItems.forEach((item) => {
                let padding = 15;
                const submenus = item.querySelectorAll('.cmp-adaptiveform-container-submenu');
                submenus.forEach((submenu) => {
                    const links = submenu.querySelectorAll('a');
                    links.forEach((link) => {
                        link.style.paddingLeft = `${padding}px`;
                    });
                    padding += 10;
                });
            });

            addNavigationButtons(menu, formContainer);
        
            // Close the menu when clicking outside of it
            window.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
                    if(menu.style.display == 'flex') { hamburger.classList.toggle('hamburgerClose'); }
                    menu.style.display = 'none';
                }
            });
        }
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
            const hamburgerMenuVisible = formContainer._model.properties["fd:hamburgerMenu"];
            const items = getAllItems(formContainer);
            const menuData = structureMenuData(items);
            if(hamburgerMenuVisible) {
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
