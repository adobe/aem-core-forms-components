/*******************************************************************************
 * Copyright 2023 Adobe
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
  class Review extends FormView.FormFieldBase {

    static NS = FormView.Constants.NS;
    /**
     * Each FormField has a data attribute class that is prefixed along with the global namespace to
     * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
     * data-{NS}-{IS}-x=""
     * @type {string}
     */
    static IS = "adaptiveFormReview";
    static bemBlock = 'cmp-adaptiveform-review';
    static templateAttribute = 'data-cmp-review';
    static DATA_ATTRIBUTE_VISIBLE = 'data-cmp-visible';
    static selectors = {
      self: "[data-" + this.NS + '-is="' + this.IS + '"]',
      container: `.${Review.bemBlock}__container`,
      templates: "template[data-cmp-review-fieldType]"
    };
    static intersectionOptions = {
      root: null,
      rootMargin: "0px",
      threshold: Review.buildThresholdList(),
    };
    static buildThresholdList() {
      let thresholds = [];
      let numSteps = 20;
      for (let i = 1.0; i <= numSteps; i++) {
        thresholds.push(i / numSteps);
      }
      thresholds.push(0);
      return thresholds;
    }

    constructor(params) {
      super(params);
      this.#attachIntersectionObserver();
      this.#attachClickEventOnEdit();
      this.setFieldTemplateMapping();
    }
    getContainer() {
      return this.element.querySelector(Review.selectors.container);
    }
    getTemplates() {
      return this.element.querySelectorAll(Review.selectors.templates);
    }
    getIntersectionElement() {
      return this.element.querySelector("[" + Review.templateAttribute + "-intersection=" + this.id + "]");
    }
    getWidget() { return null }
    getDescription() { return null; }
    getLabel() { return null; }
    getErrorDiv() { return null; }
    getTooltipDiv() { return null; }
    getQuestionMarkDiv() { return null; }
    setModel(model) {
      super.setModel(model);
    }

    // attach click event on edit button to set focus on the field
    #attachClickEventOnEdit() {
      this.getContainer().addEventListener('click', this.#clickHandler.bind(this))
    }

    // attach intersection observer to the review container for lazy loading
    #attachIntersectionObserver() {
      let observer = new IntersectionObserver(this.intersectionObserverHandler.bind(this), Review.intersectionOptions);
      const ele = this.getIntersectionElement();
      if(ele){
        observer.observe(ele);
      }
    }

    // click handler to set focus on the field when use click on edit button
    #clickHandler(event) {
      if (event?.target?.nodeName === 'BUTTON') {
        const id = event.target.getAttribute(Review.templateAttribute + '-fieldId');
        const form = this.formContainer.getModel();;
        const field = this.formContainer.getField(id);
        if (form && field) {
          form.setFocus(field._model);
        }
      }
    }

    sanitizedValue(value, options) {
      if(options){
        return window.DOMPurify ?  window.DOMPurify.sanitize(value, options) : value;
      }
      return window.DOMPurify ?  window.DOMPurify.sanitize(value) : value;
    }

    // create template mapping based on field type and use it to render review fields
    setFieldTemplateMapping() {
      const templates = this.getTemplates();
      let mappings = {};
      templates.forEach(template => {
        const type = template.getAttribute(Review.templateAttribute + '-fieldType');
        mappings[type || 'default'] = template;
      });
      this.templateMappings = mappings;
    }

    hasChild(panel) {
      return panel && panel.children && panel.children.length;
    }
    isRepeatable(item) {
      return item.fieldType === 'panel' && item.type === 'array'
    }
    showEditButton(fieldType, editAction) {
      if (editAction === 'both' ||
        (editAction === 'panel' && fieldType === 'panel') ||
        (editAction === 'field' && fieldType !== 'panel')) {
        return true;
      }
      return false;
    }

    addClass(cloneNode, item) {
      if(item.fieldType !== 'panel'){
        cloneNode.querySelector('div').classList.add(Review.bemBlock + `__field--${item.fieldType}`);
      }
      if(item.repeatable){
        cloneNode.querySelector('div').classList.add(Review.bemBlock + `__panel--repeatable`);
      }
      if(item.name){
        cloneNode.querySelector('div').classList.add(item.name);
      }
    }

    /* return value of the field, if value is array then return comma separated string and 
    if value is file then return file name
    */
    getValue(item, value) {
      if (value === undefined || value === null) return '';
      if (item.fieldType === 'file-input') {
        return Array.isArray(value) ? value.filter(file => file && file.name).map(file => file.name).join(',') : (value.name || '');
      }
      if (Array.isArray(item.enumNames)) {
        const values = Array.isArray(value) ? value : [value];
        return values.reduce((names, val) => {
          const index = item.enum.indexOf(val);
          if (index >= 0) {
            names.push(item.enumNames[index]);
          }
          return names;
        }, []).join(',');
      }
      if (Array.isArray(value)) {
        return value.join(',');
      }
      return value;
    }

    // return all top lavel panels if author has not linked any panel
    getAllPanels() {
      let state = this.formContainer._model.getState();
      while (state?.items?.length === 1) {
        state = state.items[0];
      }
      return state.items || [];
    }

    // return linked panels if author has linked any panel
    getLinkedPanels() {
      let queue = [], result = [];
      let linkedPanels = [...(this._model?._jsonModel?.properties?.linkedPanels || [])];
      let state = this.formContainer._model.getState();
      queue.push(state);
      while (queue.length && linkedPanels.length) {
        const items = Array.isArray(queue[0]) ? queue[0] : [queue[0]];
        items.forEach(item => {
          const index = linkedPanels.indexOf(item.id);
          if (index > -1) {
            result.push(item);
            linkedPanels.splice(index, 1);
          }
          if (item.items) {
            queue.push(item.items);
          }
        })
        queue.shift();
      }
      return result;
    }

    getPanels() {
      let linkedPanels = this._model?._jsonModel?.properties?.linkedPanels || [];
      if (linkedPanels.length) {
        return this.getLinkedPanels();
      }
      return this.getAllPanels();
    }

    // render label of the field
    renderLabel(cloneNode, item) {
      const label = cloneNode.querySelector('[' + Review.templateAttribute + '-label]');
      label.innerHTML = item.fieldType === 'plain-text' ? this.sanitizedValue(item.value) : this.sanitizedValue(item?.label?.value, {ALLOWED_TAGS: [] });
      if (item.required) {
        label.setAttribute('data-cmp-required', item.required);
      }
    }

    renderValue(cloneNode, item) {
      const value = cloneNode.querySelector('[' + Review.templateAttribute + '-value]');
      if (value) {
        const plainText = this.getValue(item, item.value) || '';
        value.innerHTML = this.sanitizedValue(plainText);
      }
    }

    // render edit button of the field
    renderEditButton(cloneNode, item) {
      let editAction = this._model?._jsonModel?.properties?.editAction;
      const editButton = cloneNode.querySelector('[' + Review.templateAttribute + '-editButton]');
      if (editButton) {
        editButton.setAttribute(Review.templateAttribute + '-fieldId', item.id);
        editButton.setAttribute('aria-label', "Edit " + item?.label?.value);
        if (item.enabled === false) {
          editButton.setAttribute('disabled', true);
        }
        editButton.setAttribute(Review.DATA_ATTRIBUTE_VISIBLE, this.showEditButton(item.fieldType, editAction));
      }
    }

    addAccessibilityAttributes(cloneNode, item) {
      const container = cloneNode.querySelector('[' + Review.templateAttribute + '-container]');
      const label = cloneNode.querySelector('[' + Review.templateAttribute + '-label]');
      const value = cloneNode.querySelector('[' + Review.templateAttribute + '-value]');
      const editButton = cloneNode.querySelector('[' + Review.templateAttribute + '-editButton]');
      const id = `${item.id}-review-label`;
      if(label){
        label.setAttribute('id', id);
        container.setAttribute('role', 'region');  
        container.setAttribute('aria-labelledby', id);
      }
      if(value){
        value.setAttribute('aria-labelledby', id);
      }
      if(editButton && editButton.getAttribute(Review.DATA_ATTRIBUTE_VISIBLE) === 'true'){
        editButton.setAttribute('aria-describedby', id);
      }
    }

    // renderReviewFields(items) {
    //   if (!items) return;
    //   const currentFragment = document.createDocumentFragment();
    //   items.filter(item => item.visible !== false && item.fieldType && item[':type']).forEach(item => {
    //     if (this.isRepeatable(item)) {
    //       const repeatablePanel = this.renderReviewFields(item.items);
    //       if (this.hasChild(repeatablePanel)) {
    //         currentFragment.appendChild(repeatablePanel);
    //       }
    //     } else {
    //       let template = this.templateMappings[item.fieldType] || this.templateMappings['default'];
    //       const cloneNode = template.content.cloneNode(true);
    //       this.addClass(cloneNode, item);
    //       this.renderLabel(cloneNode, item);
    //       this.renderEditButton(cloneNode, item);
    //       if (item.fieldType === 'panel') {
    //         const fields = this.renderReviewFields(item.items);
    //         if (this.hasChild(fields)) {
    //           if(item?.label?.visible !== false){
    //             currentFragment.appendChild(cloneNode);
    //           }
    //           currentFragment.appendChild(fields);
    //         }
    //       } else if (item.fieldType !== 'button' && !item[':type'].endsWith('review')) {
    //         this.renderValue(cloneNode, item);
    //         currentFragment.appendChild(cloneNode);
    //       }
    //     }
    //   });
    //   return currentFragment;
    // }

    // iterate over all the panels or linked panels and render child of each panel
    renderReviewFields(items) {
      if (!items) return;
      const currentFragment = document.createDocumentFragment();
      items.filter(item => item.visible !== false && item.fieldType && item[':type']).forEach(item => {
        if (this.isRepeatable(item)) {
          const repeatablePanel = this.renderReviewFields(item.items);
          if (this.hasChild(repeatablePanel)) {
            currentFragment.appendChild(repeatablePanel);
          }
        } else {
          let template = this.templateMappings[item.fieldType] || this.templateMappings['default'];
          const cloneNode = template.content.cloneNode(true);
          this.addClass(cloneNode, item);
          this.renderLabel(cloneNode, item);
          this.renderEditButton(cloneNode, item);
          if (item.fieldType === 'panel') {
            const fields = this.renderReviewFields(item.items);
            if (this.hasChild(fields)) {
              const labelContainer = cloneNode.querySelector(`.${Review.bemBlock}__label-container`);
              if(item?.label?.visible === false && labelContainer){
                labelContainer.remove();
              }
              this.addAccessibilityAttributes(cloneNode, item);
              const contentElement = cloneNode.querySelector('[' + Review.templateAttribute + '-content]');
              if(contentElement){
                contentElement.appendChild(fields);
              }
              currentFragment.appendChild(cloneNode);
            }
          } else if (item.fieldType !== 'button' && item.fieldType !== 'plain-text' && !item[':type'].endsWith('review')) {
            this.renderValue(cloneNode, item);
            this.addAccessibilityAttributes(cloneNode, item);
            currentFragment.appendChild(cloneNode);
          }
        }
      });
      return currentFragment;
    }

    // if review container is in view port then render review fields
    intersectionObserverHandler(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && this._model) {
          const panels = this.getPanels();
          const reviewContainer = this.getContainer();
          const children = this.renderReviewFields(panels);
          reviewContainer.innerHTML = '';
          reviewContainer.appendChild(children);
        }
      })
    }
  }

  FormView.Utils.setupField(({ element, formContainer }) => {
    return new Review({ element, formContainer })
  }, Review.selectors.self);

})();
