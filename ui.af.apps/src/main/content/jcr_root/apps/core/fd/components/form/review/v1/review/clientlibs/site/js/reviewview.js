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
      this.#attacheIntersectionObserver();
      this.#attacheClickEvent();
      this.setTemplateMapping();
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

    #attacheClickEvent() {
      this.getContainer().addEventListener('click', this.#clickHandler.bind(this))
    }
    #attacheIntersectionObserver() {
      let observer = new IntersectionObserver(this.intersectionObserverHandler.bind(this), Review.intersectionOptions);
      const ele = this.getIntersectionElement();
      if(ele){
        observer.observe(ele);
      }
    }
    #clickHandler(event) {
      if (event?.target?.nodeName === 'BUTTON') {
        const id = event.target.getAttribute(Review.templateAttribute + '-fieldId');
        this.formContainer.setFocus(id);
      }
    }
    setTemplateMapping() {
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
    getValue(item, value) {
      if (!value) return '';
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
    getAllPanels() {
      let state = this.formContainer._model.getState();
      while (state?.items?.length === 1) {
        state = state.items[0];
      }
      return state.items || [];
    }
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
    setLabel(cloneNode, item) {
      const label = cloneNode.querySelector('[' + Review.templateAttribute + '-label]');
      label.innerHTML = item.fieldType === 'plain-text' ? item.value : item?.label?.value;
      if (item.required) {
        label.setAttribute('data-cmp-required', item.required);
      }
    }
    setEditButton(cloneNode, item) {
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
    setValue(cloneNode, item) {
      const value = cloneNode.querySelector('[' + Review.templateAttribute + '-value]');
      if (value) {
        value.innerHTML = this.getValue(item, item.value) || '';
      }
    }
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
          this.setLabel(cloneNode, item);
          this.setEditButton(cloneNode, item);
          if (item.fieldType === 'panel') {
            const fields = this.renderReviewFields(item.items);
            if (this.hasChild(fields)) {
              if(item?.label?.visible !== false){
                currentFragment.appendChild(cloneNode);
              }
              currentFragment.appendChild(fields);
            }
          } else if (item.fieldType !== 'button' && !item[':type'].endsWith('review')) {
            this.setValue(cloneNode, item);
            currentFragment.appendChild(cloneNode);
          }
        }
      });
      return currentFragment;
    }
  }

  FormView.Utils.setupField(({ element, formContainer }) => {
    return new Review({ element, formContainer })
  }, Review.selectors.self);

})();
