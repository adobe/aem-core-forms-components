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
    static FIELD_TYPE = FormView.Constants.FIELD_TYPE;
    static HIDE_FIELD_FROM_REVIEW = [Review.FIELD_TYPE.BUTTON, Review.FIELD_TYPE.PLAIN_TEXT, Review.FIELD_TYPE.CAPTCHA, Review.FIELD_TYPE.IMAGE];
    static panelModifier = '__panel--repeatable';
    static fieldModifier = '__field--';
    static selectors = {
      self: "[data-" + this.NS + '-is="' + this.IS + '"]',
      container: `.${Review.bemBlock}__container`,
      templates: "template[data-cmp-review-fieldType]",
      label: '[' + Review.templateAttribute + '-label]',
      value: '[' + Review.templateAttribute + '-value]',
      editButton:'[' + Review.templateAttribute + '-editButton]',
      fieldId: Review.templateAttribute + '-fieldId',
      fieldType: Review.templateAttribute + '-fieldType',
      panelContent:'[' + Review.templateAttribute + '-content]',
      labelContainer: `.${Review.bemBlock}__label-container`,
      intersection: Review.templateAttribute + "-intersection="
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

    static sanitizedValue(value, options) {
      if(options){
        return window.DOMPurify ?  window.DOMPurify.sanitize(value, options) : value;
      }
      return window.DOMPurify ?  window.DOMPurify.sanitize(value) : value;
    }

    static hasChild(element) {
      return element && element.children && element.children.length;
    }

    static addClassModifier(element, item) {
      if(item.fieldType !== Review.FIELD_TYPE.PANEL){
        element.querySelector('div').classList.add(Review.bemBlock + Review.fieldModifier + item.fieldType);
      }
      if(item.repeatable){
        element.querySelector('div').classList.add(Review.bemBlock + Review.panelModifier);
      }
      if(item.name){
        element.querySelector('div').classList.add(item.name);
      }
    }

    static renderLabel(element, item) {
      const label = element.querySelector(Review.selectors.label);
      label.innerHTML = item.fieldType === Review.FIELD_TYPE.PLAIN_TEXT ? Review.sanitizedValue(item.value) : Review.sanitizedValue(item?.label?.value, {ALLOWED_TAGS: [] });
      if (item.required) {
        label.setAttribute('data-cmp-required', item.required);
      }
    }

    static renderValue(element, item) {
      const value = element.querySelector(Review.selectors.value);
      if (value) {
        const plainText = Review.getValue(item, item.value) || '';
        value.innerHTML = Review.sanitizedValue(plainText);
      }
    }

    static addAccessibilityAttributes(element, item) {
      const container = element.querySelector('div');
      const label = element.querySelector(Review.selectors.label);
      const value = element.querySelector(Review.selectors.value);
      const editButton = element.querySelector(Review.selectors.editButton);
      const id = `${item.id}-review-label`;
      if(label){
        label.setAttribute('id', id);
        container.setAttribute('role', 'region');  
        container.setAttribute('aria-labelledby', id);
      }
      if(value){
        value.setAttribute('aria-labelledby', id);
      }
    }

    static isRepeatable(item) {
      return item.fieldType === Review.FIELD_TYPE.PANEL && item.type === 'array'
    }

    /* return value of the field, if value is array then return comma separated string and 
      if value is file then return file name
    */
    static getValue(item, value) {
      if (value === undefined || value === null) return '';
      if (item.fieldType === Review.FIELD_TYPE.FILE_INPUT) {
        return Array.isArray(value) ? value.filter(file => file && file.name).map(file => file.name).join(', ') : (value.name || '');
      }
      if (Array.isArray(item.enumNames)) {
        const values = Array.isArray(value) ? value : [value];
        return values.reduce((names, val) => {
          const index = item.enum.indexOf(val);
          if (index >= 0) {
            names.push(item.enumNames[index]);
          }
          return names;
        }, []).join(', ');
      }
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value;
    }

    constructor(params) {
      super(params);
      this.#attachIntersectionObserver();
      this.#attachClickEventOnEdit();
      this.#setFieldTemplateMapping();
    }
    getContainer() {
      return this.element.querySelector(Review.selectors.container);
    }
    getTemplates() {
      return this.element.querySelectorAll(Review.selectors.templates);
    }
    getIntersectionElement() {
      return this.element.querySelector("[" + Review.selectors.intersection + this.id + "]");
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

    // attach intersection observer to the review container for lazy loading
    #attachIntersectionObserver() {
      let observer = new IntersectionObserver(this.#intersectionObserverHandler.bind(this), Review.intersectionOptions);
      const ele = this.getIntersectionElement();
      if(ele){
        observer.observe(ele);
      }
    }

    // attach click event on edit button to set focus on the field
    #attachClickEventOnEdit() {
      this.getContainer().addEventListener('click', this.#clickHandler.bind(this))
    }

    // create template mapping based on field type and use it to render review fields
    #setFieldTemplateMapping() {
      const templates = this.getTemplates();
      let mappings = {};
      templates.forEach(template => {
        const type = template.getAttribute(Review.selectors.fieldType);
        mappings[type || 'default'] = template;
      });
      this.templateMappings = mappings;
    }

    // click handler to set focus on the field when use click on edit button
    #clickHandler(event) {
      if (event?.target?.nodeName === 'BUTTON') {
        const id = event.target.getAttribute(Review.selectors.fieldId);
        const form = this.formContainer.getModel();;
        const field = this.formContainer.getField(id);
        if (form && field) {
          form.setFocus(field._model);
        }
      }
    }

     // if review container is in view port then render review fields
    #intersectionObserverHandler(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && this._model) {
          const panels = this.#getPanels();
          const reviewContainer = this.getContainer();
          const children = this.#renderReviewFields(panels);
          reviewContainer.innerHTML = '';
          reviewContainer.appendChild(children);
        }
      })
    }

    // iterate over all the panels or linked panels and render child of each panel
    #renderReviewFields(items) {
      if (!items) return;
      const currentFragment = document.createDocumentFragment();
      items.filter(item => item.visible !== false && item.fieldType && item[':type']).forEach(item => {
        if (Review.isRepeatable(item)) {
          const repeatableItems = this.getModel().form.getElement(item.id).getState();
          const repeatablePanel = this.#renderReviewFields(repeatableItems.items);
          if (Review.hasChild(repeatablePanel)) {
            currentFragment.appendChild(repeatablePanel);
          }
        } else {
          let template = this.templateMappings[item.fieldType] || this.templateMappings['default'];
          const cloneNode = template.content.cloneNode(true);
          Review.addClassModifier(cloneNode, item);
          Review.renderLabel(cloneNode, item);
          this.#renderEditButton(cloneNode, item);
          if (item.fieldType === Review.FIELD_TYPE.PANEL) {
            const fields = this.#renderReviewFields(item.items);
            if (Review.hasChild(fields)) {
              const labelContainer = cloneNode.querySelector(Review.selectors.labelContainer);
              if(item?.label?.visible === false && labelContainer){
                labelContainer.remove();
              }
              Review.addAccessibilityAttributes(cloneNode, item);
              const contentElement = cloneNode.querySelector(Review.selectors.panelContent);
              if(contentElement){
                contentElement.appendChild(fields);
              }
              currentFragment.appendChild(cloneNode);
            }
          } else if (!Review.HIDE_FIELD_FROM_REVIEW.includes(item.fieldType) && !item[':type'].endsWith('review')) {
            Review.renderValue(cloneNode, item);
            Review.addAccessibilityAttributes(cloneNode, item);
            currentFragment.appendChild(cloneNode);
          }
        }
      });
      return currentFragment;
    }

    #getPanels() {
      const linkedPanels = this.getModel().properties["fd:linkedPanels"] || [];
      if (linkedPanels.length) {
        return this.#getLinkedPanels([...linkedPanels]);
      }
      return this.#getAllPanels();
    }

    // return all top lavel panels if author has not linked any panel
    #getAllPanels() {
      let state = this.getModel().form.getState();
      while (state?.items?.length === 1) {
        state = state.items[0];
      }
      return state.items || [];
    }

    // return linked panels if author has linked any panel
    #getLinkedPanels(linkedPanels) {
      let queue = [], result = [];
      let state = this.getModel().form.getState();
      queue.push(state);
      while (queue.length && linkedPanels.length) {
        const items = Array.isArray(queue[0]) ? queue[0] : [queue[0]];
        items.forEach(item => {
          const index = linkedPanels.indexOf(item.name);
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

    // render edit button of the field
    #renderEditButton(cloneNode, item) {
      const editButton = cloneNode.querySelector(Review.selectors.editButton);
      if (editButton) {
        editButton.setAttribute(Review.selectors.fieldId, item.id);
        const currentItemLabel = item?.label?.value;
        editButton.setAttribute('aria-label', Granite.I18n.get('Edit') + (currentItemLabel ?  " " + currentItemLabel : ""));
        if (item.enabled === false) {
          editButton.setAttribute('disabled', true);
        }
        editButton.setAttribute(Review.DATA_ATTRIBUTE_VISIBLE, this.#isVisibleEditButton(item.fieldType));
      }
    }
    #isVisibleEditButton(fieldType) {
      let editModeAction = this.getModel().properties?.['fd:editModeAction'];
      if (editModeAction === 'both' ||
        (editModeAction === Review.FIELD_TYPE.PANEL && fieldType === Review.FIELD_TYPE.PANEL) ||
        (editModeAction === 'field' && fieldType !== Review.FIELD_TYPE.PANEL)) {
        return true;
      }
      return false;
    }
  }

  FormView.Utils.setupField(({ element, formContainer }) => {
    return new Review({ element, formContainer })
  }, Review.selectors.self);

})();
