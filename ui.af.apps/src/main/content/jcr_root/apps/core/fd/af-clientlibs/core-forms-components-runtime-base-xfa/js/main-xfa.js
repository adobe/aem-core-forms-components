/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js":
/*!************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseNode = exports.exclude = exports.include = exports.dependencyTracked = exports.qualifiedName = exports.target = exports.staticFields = exports.dynamicProps = exports.editableProperties = void 0;
const index_1 = __webpack_require__(/*! ./types/index */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const DataRefParser_1 = __webpack_require__(/*! ./utils/DataRefParser */ "./node_modules/@aemforms/af-core-xfa/lib/utils/DataRefParser.js");
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./data/EmptyDataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js"));
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js");
const Schema_1 = __importDefault(__webpack_require__(/*! ./types/Schema */ "./node_modules/@aemforms/af-core-xfa/lib/types/Schema.js"));
exports.editableProperties = [
    'value',
    'label',
    'description',
    'visible',
    'enabled',
    'valid',
    'errorMessage',
    'readOnly',
    'enum',
    'enumNames',
    'required',
    'properties',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'maximum',
    'maxItems',
    'minimum',
    'minItems',
    'checked'
];
exports.dynamicProps = [
    ...exports.editableProperties,
    'index',
    'activeChild'
];
exports.staticFields = ['plain-text', 'image'];
class ActionImplWithTarget {
    constructor(_action, _target) {
        this._action = _action;
        if (_action.target) {
            this._currentTarget = _target;
            this._target = _action.target;
        }
        else {
            this._target = _target;
            this._currentTarget = _target;
        }
    }
    get type() {
        return this._action.type;
    }
    get payload() {
        return this._action.payload;
    }
    get metadata() {
        return this._action.metadata;
    }
    get target() {
        return this._target;
    }
    get currentTarget() {
        return this._currentTarget;
    }
    get isCustomEvent() {
        return this._action.isCustomEvent;
    }
    get originalAction() {
        return this._action.originalAction;
    }
    toString() {
        return this._action.toString();
    }
}
exports.target = Symbol('target');
exports.qualifiedName = Symbol('qualifiedName');
function dependencyTracked() {
    return function (target, propertyKey, descriptor) {
        const get = descriptor.get;
        if (get != undefined) {
            descriptor.get = function () {
                this.ruleEngine.trackDependency(this);
                return get.call(this);
            };
        }
    };
}
exports.dependencyTracked = dependencyTracked;
const addOnly = (includeOrExclude) => (...fieldTypes) => (target, propertyKey, descriptor) => {
    const get = descriptor.get;
    if (get != undefined) {
        descriptor.get = function () {
            if (fieldTypes.indexOf(this.fieldType) > -1 === includeOrExclude) {
                return get.call(this);
            }
            return undefined;
        };
    }
    const set = descriptor.set;
    if (set != undefined) {
        descriptor.set = function (value) {
            if (fieldTypes.indexOf(this.fieldType) > -1 === includeOrExclude) {
                set.call(this, value);
            }
        };
    }
};
exports.include = addOnly(true);
exports.exclude = addOnly(false);
class BaseNode {
    constructor(params, _options) {
        var _a, _b;
        this._options = _options;
        this._lang = '';
        this._callbacks = {};
        this._dependents = [];
        this._tokens = [];
        this._eventSource = index_1.EventSource.CODE;
        this._fragment = '$form';
        this.xfaNode = null;
        this[exports.qualifiedName] = null;
        this._jsonModel = Object.assign(Object.assign({}, params), { id: 'id' in params ? params.id : this.form.getUniqueId() });
        if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isFragment) {
            this._fragment = this.parent.qualifiedName;
        }
        else if ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.fragment) {
            this._fragment = this.parent.fragment;
        }
    }
    get isContainer() {
        return false;
    }
    get fragment() {
        return this._fragment;
    }
    setupRuleNode() {
        const self = this;
        this._ruleNode = new Proxy(this.ruleNodeReference(), {
            get: (ruleNodeReference, prop) => {
                return self.getFromRule(ruleNodeReference, prop);
            }
        });
    }
    ruleNodeReference() {
        return this;
    }
    getRuleNode() {
        return this._ruleNode;
    }
    getFromRule(ruleNodeReference, prop) {
        if (prop === Symbol.toPrimitive || (prop === 'valueOf' && !ruleNodeReference.hasOwnProperty('valueOf'))) {
            return this.valueOf;
        }
        else if (prop === exports.target) {
            return this;
        }
        else if (typeof (prop) === 'string') {
            if (prop.startsWith('$')) {
                prop = prop.substr(1);
                if (typeof this[prop] !== 'function') {
                    const retValue = this[prop];
                    if (retValue instanceof BaseNode) {
                        return retValue.getRuleNode();
                    }
                    else if (retValue instanceof Array) {
                        return retValue.map(r => r instanceof BaseNode ? r.getRuleNode() : r);
                    }
                    else {
                        return retValue;
                    }
                }
            }
            else {
                if (ruleNodeReference.hasOwnProperty(prop)) {
                    return ruleNodeReference[prop];
                }
                else if (typeof ruleNodeReference[prop] === 'function') {
                    return ruleNodeReference[prop];
                }
            }
        }
    }
    get id() {
        return this._jsonModel.id;
    }
    get index() {
        if (this.parent) {
            return this.parent.indexOf(this);
        }
        return 0;
    }
    get parent() {
        return this._options.parent;
    }
    get type() {
        return this._jsonModel.type;
    }
    get repeatable() {
        var _a;
        return (_a = this.parent) === null || _a === void 0 ? void 0 : _a.hasDynamicItems();
    }
    get fieldType() {
        return this._jsonModel.fieldType || 'text-input';
    }
    get ':type'() {
        return this._jsonModel[':type'] || this.fieldType;
    }
    get name() {
        return this._jsonModel.name;
    }
    get screenReaderText() {
        return this._jsonModel.screenReaderText;
    }
    get description() {
        return this._jsonModel.description;
    }
    set description(d) {
        this._setProperty('description', d);
    }
    get dataRef() {
        var _a;
        if (((_a = this._jsonModel.dataRef) === null || _a === void 0 ? void 0 : _a.startsWith('xfa[0]')) && this.xfaNode) {
            return this.xfaNode.somExpression;
        }
        return this._jsonModel.dataRef;
    }
    get visible() {
        var _a, _b;
        if (this.xfaNode) {
            return Schema_1.default.getPropertyFromXfaNode(this.xfaNode, 'visible');
        }
        if (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.visible) !== undefined) {
            return ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.visible) ? this._jsonModel.visible : false;
        }
        else {
            return this._jsonModel.visible;
        }
    }
    set visible(v) {
        if (v !== this._jsonModel.visible) {
            const changeAction = (0, Events_1.propertyChange)('visible', v, this._jsonModel.visible);
            this._jsonModel.visible = v;
            this.notifyDependents(changeAction);
        }
    }
    get form() {
        return this._options.form;
    }
    get ruleEngine() {
        return this.form.ruleEngine;
    }
    get label() {
        return this._jsonModel.label;
    }
    set label(l) {
        if (l !== this._jsonModel.label) {
            const changeAction = (0, Events_1.propertyChange)('label', l, this._jsonModel.label);
            this._jsonModel = Object.assign(Object.assign({}, this._jsonModel), { label: l });
            this.notifyDependents(changeAction);
        }
    }
    get uniqueItems() {
        return this._jsonModel.uniqueItems;
    }
    isTransparent() {
        var _a, _b;
        const isNonTransparent = ((_b = (_a = this.parent) === null || _a === void 0 ? void 0 : _a._jsonModel) === null || _b === void 0 ? void 0 : _b.type) === 'array';
        return !this._jsonModel.name && !isNonTransparent;
    }
    getDependents() {
        return this._dependents.map(x => x.node.id);
    }
    getState(forRestore = false) {
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this._jsonModel), (this.xfaNode ? {
            visible: this.visible
        } : {})), { properties: this.properties, index: this.index, parent: undefined, qualifiedName: this.qualifiedName }), (this.repeatable === true ? {
            repeatable: true,
            minOccur: this.parent.minItems,
            maxOccur: this.parent.maxItems
        } : {})), { ':type': this[':type'] }), (forRestore ? {
            _dependents: this._dependents.length ? this.getDependents() : undefined,
            allowedComponents: undefined,
            columnClassNames: undefined,
            columnCount: undefined,
            gridClassNames: undefined
        } : {}));
    }
    subscribe(callback, eventName = 'change') {
        this._callbacks[eventName] = this._callbacks[eventName] || [];
        this._callbacks[eventName].push(callback);
        return {
            unsubscribe: () => {
                this._callbacks[eventName] = this._callbacks[eventName].filter(x => x !== callback);
            }
        };
    }
    _addDependent(dependent) {
        if (this._dependents.find(({ node }) => node === dependent) === undefined) {
            const subscription = this.subscribe((change) => {
                const changes = change.payload.changes;
                const propsToLook = [...exports.dynamicProps, 'items'];
                const isPropChanged = changes.findIndex(x => {
                    return propsToLook.indexOf(x.propertyName) > -1;
                }) > -1;
                if (isPropChanged) {
                    if (this.form.changeEventBehaviour === 'deps') {
                        dependent.dispatch(change);
                    }
                    else {
                        dependent.dispatch(new Events_1.ExecuteRule());
                    }
                }
            });
            this._dependents.push({ node: dependent, subscription });
        }
    }
    removeDependent(dependent) {
        const index = this._dependents.findIndex(({ node }) => node === dependent);
        if (index > -1) {
            this._dependents[index].subscription.unsubscribe();
            this._dependents.splice(index, 1);
        }
    }
    queueEvent(action) {
        const actionWithTarget = new ActionImplWithTarget(action, this);
        this.form.getEventQueue().queue(this, actionWithTarget, ['valid', 'invalid'].indexOf(actionWithTarget.type) > -1);
    }
    dispatch(action) {
        this.queueEvent(action);
        this.form.getEventQueue().runPendingQueue();
    }
    notifyDependents(action) {
        const depsToRestore = this._jsonModel._dependents;
        if (depsToRestore) {
            depsToRestore.forEach((x) => {
                const node = this.form.getElement(x);
                if (node) {
                    this._addDependent(node);
                }
            });
            this._jsonModel._dependents = undefined;
        }
        const handlers = this._callbacks[action.type] || [];
        handlers.forEach(x => {
            x(new ActionImplWithTarget(action, this));
        });
    }
    isEmpty(value = this._jsonModel.value) {
        return value === undefined || value === null || value === '';
    }
    _setProperty(prop, newValue, notify = true, notifyChildren = (action) => { }) {
        const oldValue = this._jsonModel[prop];
        let isValueSame = false;
        if (newValue !== null && oldValue !== null &&
            typeof newValue === 'object' && typeof oldValue === 'object') {
            isValueSame = JSON.stringify(newValue) === JSON.stringify(oldValue);
        }
        else {
            isValueSame = oldValue === newValue;
        }
        if (!isValueSame) {
            let xfaProperty = false;
            if (this.xfaNode) {
                xfaProperty = Schema_1.default.setPropertyToXfaNode(this.xfaNode, prop, newValue);
            }
            if (!xfaProperty) {
                this._jsonModel[prop] = newValue;
                const changeAction = (0, Events_1.propertyChange)(prop, newValue, oldValue);
                if (notify) {
                    this.notifyDependents(changeAction);
                }
                notifyChildren.call(this, changeAction);
                if (ValidationUtils_1.validationConstraintsList.includes(prop)) {
                    this.validate();
                }
                return changeAction.payload.changes;
            }
        }
        return [];
    }
    bindToDataModel(contextualDataModel) {
        if (this.fieldType === 'form' || this.id === '$form') {
            this._data = contextualDataModel;
            return;
        }
        const dataRef = this._jsonModel.dataRef;
        if (dataRef === null || dataRef === void 0 ? void 0 : dataRef.startsWith('xfa[0]')) {
            return;
        }
        let _data, _parent = contextualDataModel, _key = '';
        if (dataRef === null) {
            _data = EmptyDataValue_1.default;
        }
        else if (dataRef !== undefined && !this.repeatable) {
            if (this._tokens.length === 0) {
                this._tokens = (0, DataRefParser_1.tokenize)(dataRef);
            }
            let searchData = contextualDataModel;
            if (this._tokens[0].type === DataRefParser_1.TOK_GLOBAL) {
                searchData = this.form.getDataNode();
            }
            else if (this._tokens[0].type === DataRefParser_1.TOK_REPEATABLE) {
                let repeatRoot = this.parent;
                while (!repeatRoot.repeatable && repeatRoot !== this.form) {
                    repeatRoot = repeatRoot.parent;
                }
                searchData = repeatRoot.getDataNode();
            }
            if (typeof searchData !== 'undefined') {
                const name = this._tokens[this._tokens.length - 1].value;
                const create = this.defaultDataModel(name);
                _data = (0, DataRefParser_1.resolveData)(searchData, this._tokens, create);
                _parent = (0, DataRefParser_1.resolveData)(searchData, this._tokens.slice(0, -1));
                _key = name;
            }
        }
        else {
            if (contextualDataModel !== EmptyDataValue_1.default && exports.staticFields.indexOf(this.fieldType) === -1) {
                _parent = contextualDataModel;
                const name = this._jsonModel.name || '';
                const key = contextualDataModel.$type === 'array' ? this.index : name;
                _key = key;
                if (key !== '') {
                    const create = this.defaultDataModel(key);
                    if (create !== undefined) {
                        _data = contextualDataModel.$getDataNode(key);
                        if (_data === undefined) {
                            _data = create;
                            contextualDataModel.$addDataNode(key, _data);
                        }
                    }
                }
                else {
                    _data = undefined;
                }
            }
        }
        if (_data) {
            if (!this.isContainer && _parent !== EmptyDataValue_1.default && _data !== EmptyDataValue_1.default) {
                _data = _data === null || _data === void 0 ? void 0 : _data.$convertToDataValue();
                _parent.$addDataNode(_key, _data, true);
            }
            _data === null || _data === void 0 ? void 0 : _data.$bindToField(this);
            this._data = _data;
        }
        return this._data;
    }
    getDataNode() {
        return this._data;
    }
    get lang() {
        if (this._jsonModel.lang) {
            this._lang = this._jsonModel.lang;
        }
        if (!this._lang) {
            if (this.parent) {
                this._lang = this.parent.lang;
            }
            else {
                this._lang = Intl.DateTimeFormat().resolvedOptions().locale;
            }
        }
        return this._lang;
    }
    get properties() {
        return this._jsonModel.properties || {};
    }
    set properties(p) {
        this._setProperty('properties', Object.assign({}, p));
    }
    getNonTransparentParent() {
        let nonTransparentParent = this.parent;
        while (nonTransparentParent != null && nonTransparentParent.isTransparent()) {
            nonTransparentParent = nonTransparentParent.parent;
        }
        return nonTransparentParent;
    }
    _syncXfaProps() {
        if (this.xfaNode) {
            const getOrElse = (obj, path, defaultValue) => {
                return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue;
            };
            Object.entries(Schema_1.default.schemaObject).forEach(([attrName, attr]) => {
                const xfaProp = attr === null || attr === void 0 ? void 0 : attr.xfaProp;
                const propChain = (xfaProp || '').split('.');
                const xfaAttr = propChain.length > 0 ? propChain[propChain.length - 1] : undefined;
                let afVal = getOrElse(this._jsonModel, attrName, attr === null || attr === void 0 ? void 0 : attr.default);
                if (!xfaAttr || afVal === undefined) {
                    return;
                }
                const objChain = propChain.slice(0, propChain.length - 1);
                const obj = objChain.reduce((obj, prop) => {
                    if (typeof obj === 'object' && obj !== null) {
                        return obj[prop];
                    }
                    return undefined;
                }, this.xfaNode);
                if (afVal !== undefined) {
                    afVal = Schema_1.default.getTypedValue(attr === null || attr === void 0 ? void 0 : attr.type, afVal);
                }
                const convertor = Schema_1.default.convertor[attrName];
                const xfaVal = convertor ? convertor.guideToXfa(afVal) : afVal;
                let currentXfaVal;
                try {
                    if (obj) {
                        currentXfaVal = obj[xfaAttr];
                        if (xfaVal !== undefined) {
                            if (xfaAttr === 'items') {
                            }
                            else if (xfaVal !== currentXfaVal) {
                                obj[xfaAttr] = xfaVal;
                            }
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
    }
    _initialize(mode) {
        var _a;
        if (((_a = this.dataRef) === null || _a === void 0 ? void 0 : _a.startsWith('xfa[0]')) && window.xfalib) {
            this.xfaNode = window.xfalib.runtime.xfa.resolveNode(this.dataRef);
            return;
        }
        if (typeof this._data === 'undefined') {
            let dataNode, parent = this.parent;
            do {
                dataNode = parent.getDataNode();
                parent = parent.parent;
            } while (dataNode === undefined);
            this.bindToDataModel(dataNode);
        }
    }
    _applyUpdates(propNames, updates) {
        return propNames.reduce((acc, propertyName) => {
            const currentValue = updates[propertyName];
            const changes = this._setProperty(propertyName, currentValue, false);
            if (changes.length > 0) {
                acc[propertyName] = changes[0];
            }
            return acc;
        }, {});
    }
    get qualifiedName() {
        if (this.isTransparent()) {
            return null;
        }
        if (this[exports.qualifiedName] !== null) {
            return this[exports.qualifiedName];
        }
        const parent = this.getNonTransparentParent();
        if (parent && parent.type === 'array') {
            this[exports.qualifiedName] = `${parent.qualifiedName}[${this.index}]`;
        }
        else {
            this[exports.qualifiedName] = `${parent.qualifiedName}.${this.name}`;
        }
        return this[exports.qualifiedName];
    }
    focus() {
        if (this.parent) {
            this.parent.activeChild = this;
        }
    }
    _getDefaults() {
        return {};
    }
    _applyDefaultsInModel() {
        Object.entries(this._getDefaults()).map(([key, value]) => {
            if (this._jsonModel[key] === undefined && value !== undefined) {
                this._jsonModel[key] = value;
            }
            else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                Object.keys(value).forEach((keyOfValue) => {
                    if (this._jsonModel[key][keyOfValue] === undefined) {
                        this._jsonModel[key][keyOfValue] = value[keyOfValue];
                    }
                });
            }
        });
    }
}
__decorate([
    dependencyTracked()
], BaseNode.prototype, "index", null);
__decorate([
    dependencyTracked()
], BaseNode.prototype, "description", null);
__decorate([
    dependencyTracked()
], BaseNode.prototype, "visible", null);
__decorate([
    dependencyTracked()
], BaseNode.prototype, "label", null);
__decorate([
    dependencyTracked()
], BaseNode.prototype, "properties", null);
exports.BaseNode = BaseNode;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Button.js":
/*!**********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Button.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
class Button extends Field_1.default {
    click() {
        var _a;
        if (((_a = this._events) === null || _a === void 0 ? void 0 : _a.click) || !this._jsonModel.buttonType) {
            return;
        }
        if (this._jsonModel.buttonType === 'submit') {
            return this.form.dispatch(new Events_1.Submit({ validate_form: true }));
        }
        if (this._jsonModel.buttonType === 'reset') {
            return this.form.dispatch(new Events_1.Reset());
        }
    }
}
exports["default"] = Button;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Captcha.js":
/*!***********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Captcha.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
class Captcha extends Field_1.default {
    constructor(params, _options) {
        super(params, _options);
        this._captchaDisplayMode = params.captchaDisplayMode;
        this._captchaProvider = params.captchaProvider;
        this._captchaSiteKey = params.siteKey;
    }
    getDataNode() {
        return undefined;
    }
    custom_setProperty(action) {
        this.applyUpdates(action.payload);
    }
    get captchaDisplayMode() {
        return this._captchaDisplayMode;
    }
    get captchaProvider() {
        return this._captchaProvider;
    }
    get captchaSiteKey() {
        return this._captchaSiteKey;
    }
}
exports["default"] = Captcha;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Checkbox.js":
/*!************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Checkbox.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js");
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
const requiredConstraint = (offValue) => (constraint, value) => {
    const valid = ValidationUtils_1.Constraints.required(constraint, value).valid && (!constraint || value != offValue);
    return { valid, value };
};
class Checkbox extends Field_1.default {
    offValue() {
        const opts = this.enum;
        return opts.length > 1 ? opts[1] : null;
    }
    _getConstraintObject() {
        const baseConstraints = Object.assign({}, super._getConstraintObject());
        baseConstraints.required = requiredConstraint(this.offValue());
        return baseConstraints;
    }
    _applyDefaults() {
        var _a, _b;
        if (typeof this._jsonModel.checked === 'boolean') {
            if (this._jsonModel.checked) {
                this._jsonModel.default = (_a = this._jsonModel.enum) === null || _a === void 0 ? void 0 : _a[0];
            }
            else {
                this._jsonModel.default = (_b = this._jsonModel.enum) === null || _b === void 0 ? void 0 : _b[1];
            }
        }
        super._applyDefaults();
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { enforceEnum: true });
    }
    get enum() {
        return this._jsonModel.enum || [];
    }
    updateDataNodeAndTypedValue(val) {
        var _a, _b;
        const changes = super.updateDataNodeAndTypedValue(val);
        const valueChange = changes.find((c) => c.propertyName === 'value');
        if (valueChange) {
            const oldChecked = valueChange.prevValue === ((_a = this._jsonModel.enum) === null || _a === void 0 ? void 0 : _a[0]);
            const newChecked = valueChange.currentValue === ((_b = this._jsonModel.enum) === null || _b === void 0 ? void 0 : _b[0]);
            if (oldChecked !== newChecked) {
                changes.push({
                    propertyName: 'checked',
                    prevValue: oldChecked,
                    currentValue: newChecked
                });
            }
        }
        return changes;
    }
    set checked(check) {
        var _a, _b;
        if (check) {
            this.value = (_a = this._jsonModel.enum) === null || _a === void 0 ? void 0 : _a[0];
        }
        else {
            this.value = (_b = this._jsonModel.enum) === null || _b === void 0 ? void 0 : _b[1];
        }
    }
    get checked() {
        var _a;
        return this.value === ((_a = this._jsonModel.enum) === null || _a === void 0 ? void 0 : _a[0]);
    }
    getState(isRepeatableChild = false, forRestore = false) {
        return Object.assign(Object.assign({}, super.getState(isRepeatableChild, forRestore)), { checked: this.checked });
    }
}
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Checkbox.prototype, "checked", null);
exports["default"] = Checkbox;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/CheckboxGroup.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/CheckboxGroup.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
class CheckboxGroup extends Field_1.default {
    constructor(params, _options) {
        super(params, _options);
    }
    _getFallbackType() {
        const fallbackType = super._getFallbackType();
        if (typeof fallbackType === 'string') {
            return `${fallbackType}[]`;
        }
        else {
            return 'string[]';
        }
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { enforceEnum: true, enum: [] });
    }
}
exports["default"] = CheckboxGroup;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Container.js":
/*!*************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Container.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core-xfa/lib/Scriptable.js"));
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const DataGroup_1 = __importDefault(__webpack_require__(/*! ./data/DataGroup */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js"));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
const notifyChildrenAttributes = [
    'readOnly', 'enabled'
];
class Container extends Scriptable_1.default {
    constructor(json, _options) {
        var _a, _b;
        super(json, { form: _options.form, parent: _options.parent, mode: _options.mode });
        this._children = [];
        this._itemTemplate = null;
        this._isFragment = false;
        this._insideFragment = false;
        this._activeChild = null;
        this._isFragment = ((_b = (_a = this._jsonModel) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b['fd:fragment']) === true;
        this.fieldFactory = _options.fieldFactory;
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { enabled: true, readOnly: false });
    }
    ruleNodeReference() {
        return this._childrenReference;
    }
    get items() {
        return this._children;
    }
    get maxItems() {
        return this._jsonModel.maxItems;
    }
    set maxItems(m) {
        this._jsonModel.maxItems = m;
        const minItems = this._jsonModel.minItems || 1;
        const itemsLength = this._children.length;
        const items2Remove = Math.min(itemsLength - m, itemsLength - minItems);
        if (items2Remove > 0) {
            for (let i = 0; i < items2Remove; i++) {
                this.getDataNode().$removeDataNode(m + i);
                this._childrenReference.pop();
            }
            const elems = this._children.splice(m, items2Remove);
            this.notifyDependents((0, Events_1.propertyChange)('items', elems, null));
        }
    }
    get minItems() {
        return this._jsonModel.minItems;
    }
    set minItems(m) {
        this._jsonModel.minItems = m;
        const itemsLength = this._children.length;
        const difference = itemsLength - m;
        const items2Add = Math.abs(difference);
        if (difference < 0) {
            const elems = [];
            for (let i = 0; i < items2Add; i++) {
                elems.push(this._addChild(this._itemTemplate, null, true));
            }
            this.notifyDependents((0, Events_1.propertyChange)('items', elems, null));
        }
    }
    hasDynamicItems() {
        return this._itemTemplate != null;
    }
    get isContainer() {
        return true;
    }
    isSiteContainer(item) {
        return (':items' in item || 'cqItems' in item) && !('fieldType' in item);
    }
    isAFormField(item) {
        return ('fieldType' in item || 'id' in item || 'name' in item || 'dataRef' in item || 'type' in item);
    }
    _getFormAndSitesState(isRepeatableChild = false, forRestore = false) {
        return this._jsonModel.items ? this._jsonModel.items.map((x) => {
            var _a;
            if (this.isSiteContainer(x)) {
                const newObjWithId = Object.assign({}, (((_a = x) === null || _a === void 0 ? void 0 : _a.id) ? { id: this.form.getUniqueId() } : {}));
                return Object.assign(Object.assign(Object.assign({}, x), newObjWithId), { ':items': this.walkSiteContainerItems(x) });
            }
            else if (this.isAFormField(x)) {
                return Object.assign({}, this.form.getElement(x === null || x === void 0 ? void 0 : x.id).getState(isRepeatableChild, forRestore));
            }
            else {
                return x;
            }
        }) : [];
    }
    getItemsState(isRepeatableChild = false, forRestore = false) {
        if (this._jsonModel.type === 'array' || (0, JsonUtils_1.isRepeatable)(this._jsonModel) || isRepeatableChild) {
            if (isRepeatableChild) {
                return this._getFormAndSitesState(isRepeatableChild, forRestore);
            }
            else {
                return this._children.map(x => {
                    return Object.assign({}, x.getState(true, forRestore));
                });
            }
        }
        else {
            return this._getFormAndSitesState(isRepeatableChild, forRestore);
        }
    }
    getState(isRepeatableChild = false, forRestore = false) {
        return Object.assign(Object.assign(Object.assign({}, super.getState(forRestore)), (forRestore ? {
            ':items': undefined,
            ':itemsOrder': undefined
        } : {})), { items: this.getItemsState(isRepeatableChild, forRestore), enabled: this.enabled, readOnly: this.readOnly });
    }
    _createChild(child, options) {
        return this.fieldFactory.createField(child, options);
    }
    walkSiteContainerItems(x) {
        return Object.fromEntries(Object.entries(x[':items']).map(([key, value]) => {
            var _a;
            if (this.isAFormField(value)) {
                return [key, this.form.getElement(value === null || value === void 0 ? void 0 : value.id).getState()];
            }
            else if (this.isSiteContainer(value)) {
                return this.walkSiteContainerItems(value);
            }
            else {
                if (typeof value === 'object') {
                    const newObjWithId = Object.assign({}, (((_a = value) === null || _a === void 0 ? void 0 : _a.id) ? { id: this.form.getUniqueId() } : {}));
                    return [key, Object.assign(Object.assign({}, value), newObjWithId)];
                }
                else {
                    return [key, value];
                }
            }
        }));
    }
    _addChildToRuleNode(child, options) {
        const self = this;
        const { parent = this } = options;
        const name = parent.type == 'array' ? parent._children.length + '' : child.name || '';
        if (name.length > 0) {
            Object.defineProperty(parent._childrenReference, name, {
                get: () => {
                    if (child.isContainer && child.hasDynamicItems()) {
                        self.ruleEngine.trackDependency(child);
                    }
                    if (self.hasDynamicItems()) {
                        self.ruleEngine.trackDependency(self);
                        if (this._children[name] !== undefined) {
                            return this._children[name].getRuleNode();
                        }
                    }
                    else {
                        return child.getRuleNode();
                    }
                },
                configurable: true,
                enumerable: true
            });
        }
    }
    _addChild(itemJson, index, cloneIds = false, mode = 'create', xfaNode) {
        let nonTransparentParent = this;
        while (nonTransparentParent != null && nonTransparentParent.isTransparent()) {
            nonTransparentParent = nonTransparentParent.parent;
        }
        if (typeof index !== 'number' || index > nonTransparentParent._children.length) {
            index = this._children.length;
        }
        const form = this.form;
        let itemTemplate;
        if (xfaNode) {
            itemTemplate = Object.assign({ index }, (0, JsonUtils_1.deepClone)(itemJson, cloneIds ? {
                'id': () => form.getUniqueId(),
                'dataRef': (copy) => {
                    var _a;
                    if (copy.dataRef.startsWith(itemJson.dataRef)) {
                        return copy.dataRef.replace(itemJson.dataRef, xfaNode.somExpression);
                    }
                    else if (copy.dataRef === itemJson.dataRef) {
                        return xfaNode.somExpression;
                    }
                    else if (((_a = copy.dataRef) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        this.form.logger.error(`dataRef ${copy.dataRef} is not supported in XFA`);
                    }
                    return copy.dataRef;
                }
            } : undefined));
        }
        else {
            itemTemplate = Object.assign({ index }, (0, JsonUtils_1.deepClone)(itemJson, cloneIds ? () => {
                return form.getUniqueId();
            } : undefined));
        }
        const retVal = this._createChild(itemTemplate, { parent: this, form: this.form, mode });
        itemJson.id = retVal.id;
        this.form.fieldAdded(retVal);
        this._addChildToRuleNode(retVal, { parent: nonTransparentParent });
        if (index === this._children.length) {
            this._children.push(retVal);
        }
        else {
            this._children.splice(index, 0, retVal);
        }
        return retVal;
    }
    indexOf(f) {
        return this._children.indexOf(f);
    }
    defaultDataModel(name) {
        const type = this._jsonModel.type || undefined;
        if (type === undefined || this.xfaNode) {
            return undefined;
        }
        else {
            const instance = type === 'array' ? [] : {};
            return new DataGroup_1.default(name, instance, type);
        }
    }
    _canHaveRepeatingChildren(mode = 'create') {
        const items = this._jsonModel.items;
        return this._jsonModel.type == 'array' && this.getDataNode() != null &&
            (items.length === 1 || (items.length > 0 && items[0].repeatable == true && mode === 'restore'));
    }
    get isFragment() {
        var _a, _b;
        return this._isFragment || ((_b = (_a = this._jsonModel) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b['fd:fragment']);
    }
    _initialize(mode) {
        var _a, _b, _c, _d;
        super._initialize(mode);
        const items = this._jsonModel.items || [];
        this._childrenReference = this._jsonModel.type == 'array' ? [] : {};
        if (this._canHaveRepeatingChildren(mode)) {
            this._itemTemplate = (0, JsonUtils_1.deepClone)(items[0]);
            if (mode === 'restore') {
                this._itemTemplate.repeatable = undefined;
            }
            if (typeof (this._jsonModel.minItems) !== 'number') {
                this._jsonModel.minItems = 0;
            }
            if (typeof (this._jsonModel.maxItems) !== 'number') {
                this._jsonModel.maxItems = -1;
            }
            if (typeof (this._jsonModel.initialItems) !== 'number') {
                const max = ((_b = (_a = this.xfaNode) === null || _a === void 0 ? void 0 : _a.instanceManager) === null || _b === void 0 ? void 0 : _b.count) || this._jsonModel.minItems;
                this._jsonModel.initialItems = Math.max(1, max);
            }
            for (let i = 0; i < this._jsonModel.initialItems; i++) {
                let child;
                if (mode === 'restore') {
                    let itemTemplate = this._itemTemplate;
                    if (i < this._jsonModel.items.length) {
                        itemTemplate = (0, JsonUtils_1.deepClone)(items[i]);
                        itemTemplate.repeatable = undefined;
                    }
                    if (this.xfaNode) {
                        this.form.logger.error('XFA form cannot be restored');
                    }
                    child = this._addChild(itemTemplate, undefined, i > this._jsonModel.items.length - 1, mode);
                }
                else {
                    child = this._addChild(this._itemTemplate, undefined, i > this._jsonModel.items.length - 1, 'create', (_d = (_c = this.xfaNode) === null || _c === void 0 ? void 0 : _c.instanceManager) === null || _d === void 0 ? void 0 : _d.instances[i]);
                }
                if (mode === 'create') {
                    items[0].id = child.id;
                }
                child._initialize(mode);
            }
        }
        else if (items.length > 0) {
            items.forEach((item) => {
                if (this.isSiteContainer(item)) {
                    this._initializeSiteContainer(item);
                }
                else if (this.isAFormField(item)) {
                    const child = this._addChild(item, undefined, false, mode);
                    child._initialize(mode);
                }
                else {
                    this.form.logger.warn(`A container item was not initialized. ${item}`);
                }
            });
            this._jsonModel.minItems = this._children.length;
            this._jsonModel.maxItems = this._children.length;
            this._jsonModel.initialItems = this._children.length;
        }
        else {
            this.form.logger.warn('A container exists with no items.');
        }
        this.setupRuleNode();
    }
    _initializeSiteContainer(item) {
        Object.entries(item[':items']).forEach(([key, value]) => {
            if (this.isAFormField(value)) {
                const child = this._addChild(value);
                child._initialize();
            }
            else if (this.isSiteContainer(value)) {
                return this._initializeSiteContainer(value);
            }
        });
    }
    _syncXfaProps() {
        super._syncXfaProps();
        this.items.forEach(x => {
            x._syncXfaProps();
        });
    }
    addItem(action) {
        if ((action.type === 'addItem' || action.type == 'addInstance') && this._itemTemplate != null) {
            if ((this._jsonModel.maxItems === -1) || (this._children.length < this._jsonModel.maxItems)) {
                const dataNode = this.getDataNode();
                let instanceIndex = action.payload;
                let xfaNode;
                if (typeof action.payload === 'object') {
                    instanceIndex = action.payload.index;
                    xfaNode = action.payload.xfaNode;
                }
                const retVal = this._addChild(this._itemTemplate, instanceIndex, true, 'create', xfaNode);
                if (typeof instanceIndex !== 'number' || instanceIndex > this._children.length) {
                    instanceIndex = this._children.length;
                }
                const _data = retVal.defaultDataModel(instanceIndex);
                if (_data && dataNode) {
                    dataNode.$addDataNode(instanceIndex, _data, false, this);
                }
                retVal._initialize('create');
                this.notifyDependents((0, Events_1.propertyChange)('items', retVal.getState(), null));
                retVal.dispatch(new Events_1.Initialize());
                retVal.dispatch(new Events_1.ExecuteRule());
                for (let i = instanceIndex + 1; i < this._children.length; i++) {
                    this._children[i].dispatch(new Events_1.ExecuteRule());
                }
            }
        }
    }
    removeItem(action) {
        if ((action.type === 'removeItem' || action.type == 'removeInstance') && this._itemTemplate != null) {
            if (this._children.length == 0) {
                return;
            }
            let instanceIndex = action.payload;
            if (typeof action.payload === 'object') {
                instanceIndex = action.payload.index;
            }
            if (typeof instanceIndex !== 'number') {
                instanceIndex = this._children.length - 1;
            }
            const state = this._children[instanceIndex].getState();
            if (this._children.length > this._jsonModel.minItems) {
                this._childrenReference.pop();
                this._children.splice(instanceIndex, 1);
                const data = this.getDataNode();
                if (data) {
                    data.$removeDataNode(instanceIndex, this);
                }
                for (let i = instanceIndex; i < this._children.length; i++) {
                    this._children[i].dispatch(new Events_1.ExecuteRule());
                }
                this.notifyDependents((0, Events_1.propertyChange)('items', null, state));
            }
        }
    }
    queueEvent(action) {
        var _a;
        super.queueEvent(action);
        if ((_a = action.metadata) === null || _a === void 0 ? void 0 : _a.dispatch) {
            this.items.forEach(x => {
                x.queueEvent(action);
            });
        }
    }
    reset() {
        if (this.type === 'array' || (0, JsonUtils_1.isRepeatable)(this._jsonModel)) {
            if (this.items.length > this._jsonModel.initialItems) {
                const itemsToBeRemoved = this.items.length - this._jsonModel.initialItems;
                for (let i = 0; i < itemsToBeRemoved; i++) {
                    this.dispatch(new Events_1.RemoveItem());
                }
            }
        }
        this.items.forEach(x => {
            x.reset();
        });
    }
    validate() {
        return this.items.flatMap(x => {
            return x.validate();
        }).filter(x => x.fieldName !== '');
    }
    dispatch(action) {
        super.dispatch(action);
    }
    importData(dataModel) {
        var _a;
        if (typeof this._data !== 'undefined' && this.type === 'array' && Array.isArray(dataModel)) {
            const dataGroup = new DataGroup_1.default(this._data.$name, dataModel, this._data.$type, this._data.parent);
            try {
                (_a = this._data.parent) === null || _a === void 0 ? void 0 : _a.$addDataNode(dataGroup.$name, dataGroup, true);
            }
            catch (e) {
                this.form.logger.error(`unable to setItems for ${this.qualifiedName} : ${e}`);
                return;
            }
            this._data = dataGroup;
            const result = this.syncDataAndFormModel(dataGroup);
            const newLength = this.items.length;
            result.added.forEach((item) => {
                this.notifyDependents((0, Events_1.propertyChange)('items', item.getState(), null));
                item.dispatch(new Events_1.Initialize());
            });
            for (let i = 0; i < newLength; i += 1) {
                this._children[i].dispatch(new Events_1.ExecuteRule());
            }
            result.removed.forEach((item) => {
                this.notifyDependents((0, Events_1.propertyChange)('items', null, item.getState()));
            });
        }
    }
    syncDataAndFormModel(contextualDataModel) {
        const result = {
            added: [],
            removed: []
        };
        if ((contextualDataModel === null || contextualDataModel === void 0 ? void 0 : contextualDataModel.$type) === 'array' && this._itemTemplate != null) {
            const dataLength = contextualDataModel === null || contextualDataModel === void 0 ? void 0 : contextualDataModel.$value.length;
            const itemsLength = this._children.length;
            const maxItems = this._jsonModel.maxItems === -1 ? dataLength : this._jsonModel.maxItems;
            const minItems = this._jsonModel.minItems;
            let items2Add = Math.min(dataLength - itemsLength, maxItems - itemsLength);
            const items2Remove = Math.min(itemsLength - dataLength, itemsLength - minItems);
            while (items2Add > 0) {
                items2Add--;
                const child = this._addChild(this._itemTemplate, this.items.length, true);
                child._initialize('create');
                result.added.push(child);
            }
            if (items2Remove > 0) {
                for (let i = 0; i < items2Remove; i++) {
                    this._childrenReference.pop();
                    this._children.pop();
                }
                result.removed.push(...this._children);
            }
        }
        this._children.forEach(x => {
            let dataModel = x.bindToDataModel(contextualDataModel);
            if (x.isContainer && !dataModel) {
                dataModel = contextualDataModel;
            }
            x.syncDataAndFormModel(dataModel);
        });
        return result;
    }
    get activeChild() {
        return this._activeChild;
    }
    set activeChild(c) {
        if (c !== this._activeChild) {
            let activeChild = this._activeChild;
            while (activeChild instanceof Container) {
                const temp = activeChild.activeChild;
                activeChild.activeChild = null;
                activeChild = temp;
            }
            const change = (0, Events_1.propertyChange)('activeChild', c, this._activeChild);
            this._activeChild = c;
            if (this.parent && c !== null) {
                this.parent.activeChild = this;
            }
            this._jsonModel.activeChild = c === null || c === void 0 ? void 0 : c.id;
            this.notifyDependents(change);
        }
    }
    get enabled() {
        var _a;
        const parentEnabled = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.enabled;
        if (parentEnabled !== undefined) {
            return parentEnabled ? this._jsonModel.enabled : false;
        }
        return this._jsonModel.enabled;
    }
    set enabled(e) {
        this._setProperty('enabled', e, true, this.notifyChildren);
    }
    get readOnly() {
        var _a;
        if (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.readOnly) !== undefined) {
            return this.parent.readOnly ? true : this._jsonModel.readOnly;
        }
        else {
            return this._jsonModel.readOnly;
        }
    }
    set readOnly(e) {
        this._setProperty('readOnly', e, true, this.notifyChildren);
    }
    notifyChildren(action) {
        if (action.payload !== undefined && action.payload.changes !== undefined) {
            for (const change of action.payload.changes) {
                if (change.propertyName !== undefined && notifyChildrenAttributes.includes(change.propertyName)) {
                    this.items.forEach((child) => {
                        this.notifyDependents.call(child, (0, Events_1.propertyChange)(change.propertyName, child.getState()[change.propertyName], null));
                        if (child.fieldType === 'panel') {
                            this.notifyChildren.call(child, action);
                        }
                    });
                }
            }
        }
    }
}
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Container.prototype, "maxItems", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Container.prototype, "minItems", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Container.prototype, "activeChild", null);
exports["default"] = Container;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/DateField.js":
/*!*************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/DateField.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
const af_formatters_1 = __webpack_require__(/*! @aemforms/af-formatters */ "./node_modules/@aemforms/af-formatters/lib/index.js");
class DateField extends Field_1.default {
    constructor() {
        super(...arguments);
        this._dataFormat = 'yyyy-MM-dd';
    }
    _applyDefaults() {
        super._applyDefaults();
        this.locale = new Intl.DateTimeFormat().resolvedOptions().locale;
        if (!this._jsonModel.editFormat) {
            this._jsonModel.editFormat = 'short';
        }
        if (!this._jsonModel.displayFormat) {
            this._jsonModel.displayFormat = this._jsonModel.editFormat;
        }
        if (!this._jsonModel.placeholder) {
            this._jsonModel.placeholder = (0, af_formatters_1.parseDateSkeleton)(this._jsonModel.editFormat, this.locale);
        }
    }
    get value() {
        return super.value;
    }
    set value(value) {
        if (typeof value === 'number') {
            const coercedValue = (0, af_formatters_1.numberToDatetime)(value);
            if (!isNaN(coercedValue)) {
                super.value = (0, af_formatters_1.formatDate)(coercedValue, this.locale, this._dataFormat);
            }
        }
        else {
            if (this._jsonModel.editFormat !== 'short' && this._jsonModel.editFormat !== 'date|short') {
                const parsedDate = (0, af_formatters_1.parseDate)(value, this.locale, this._jsonModel.editFormat) || (0, af_formatters_1.parseDate)(value, this.locale, 'yyyy-MM-dd');
                if (parsedDate instanceof Date) {
                    super.value = (0, af_formatters_1.formatDate)(parsedDate, this.locale, this._dataFormat);
                }
                else {
                    super.value = value;
                }
            }
            else {
                super.value = value;
            }
        }
    }
}
exports["default"] = DateField;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/EmailInput.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/EmailInput.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
class EmailInput extends Field_1.default {
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { format: 'email' });
    }
}
exports["default"] = EmailInput;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Field.js":
/*!*********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Field.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Field_instances, _Field_triggerValidationEvent;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const types_1 = __webpack_require__(/*! ./types */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js");
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core-xfa/lib/Scriptable.js"));
const SchemaUtils_1 = __webpack_require__(/*! ./utils/SchemaUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/SchemaUtils.js");
const DataValue_1 = __importDefault(__webpack_require__(/*! ./data/DataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataValue.js"));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./data/EmptyDataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js"));
const af_formatters_1 = __webpack_require__(/*! @aemforms/af-formatters */ "./node_modules/@aemforms/af-formatters/lib/index.js");
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const Schema_1 = __importDefault(__webpack_require__(/*! ./types/Schema */ "./node_modules/@aemforms/af-core-xfa/lib/types/Schema.js"));
const validTypes = ['string', 'number', 'integer', 'boolean', 'file', 'string[]', 'number[]', 'integer[]', 'boolean[]', 'file[]', 'array', 'object'];
class Field extends Scriptable_1.default {
    constructor(params, _options) {
        super(params, _options);
        _Field_instances.add(this);
        this._ruleNodeReference = [];
        if (_options.mode !== 'restore') {
            this._applyDefaults();
            this.queueEvent(new Events_1.Initialize());
            if (this.form.changeEventBehaviour === 'deps') {
                this.queueEvent(new Events_1.Change({ changes: [] }));
            }
            else {
                this.queueEvent(new Events_1.ExecuteRule());
            }
        }
    }
    _initialize() {
        super._initialize();
        if (this.xfaNode && window && window.xfalib) {
            this.xfaNode.on(window.xfalib.script.XfaModelEvent.FORM_MODEL_CHANGED, (event) => {
                console.log(`${event.target.somExpression} ${event._property}  : ${event.prevText} -> ${event.newText}`);
                let newValue, oldValue, updates, changeAction, changes;
                switch (event._property) {
                    case 'rawValue':
                        oldValue = this._jsonModel.value;
                        this._jsonModel.value = event.prevText;
                        if (oldValue !== this._jsonModel.value) {
                            changes = [
                                {
                                    propertyName: 'value',
                                    currentValue: this._jsonModel.value,
                                    prevValue: oldValue
                                }
                            ];
                            updates = this.evaluateConstraints();
                            if (updates.valid) {
                                this.triggerValidationEvent(updates);
                            }
                            changeAction = new Events_1.Change({ changes: changes.concat(Object.values(updates)) });
                            this.dispatch(changeAction);
                        }
                        break;
                    case 'ValidationState':
                        this.valid = false;
                        this.errorMessage = event.newText;
                        break;
                    case 'ClearError':
                        updates = this.evaluateConstraints();
                        if (this.validity.valid === false) {
                            if (updates.valid) {
                                this.triggerValidationEvent(updates);
                            }
                        }
                        else {
                            this.valid = true;
                            this.errorMessage = '';
                        }
                        break;
                    case 'presence':
                        switch (event.newText) {
                            case 'visible':
                                oldValue = false;
                                newValue = true;
                                break;
                            case 'invisible':
                            case 'hidden':
                            case 'inactive':
                                oldValue = true;
                                newValue = false;
                                break;
                        }
                        this.notifyDependents((0, Events_1.propertyChange)('visible', newValue, oldValue));
                        break;
                    case 'access':
                        this.notifyDependents((0, Events_1.propertyChange)('enabled', event.newText === 'open', event.prevText === 'open'));
                        break;
                }
            });
            this.xfaNode.on(window.xfalib.script.XfaModelEvent.DOM_CHANGED, (event) => {
                console.log(`${event.target.somExpression} ${event._property}  : ${event.prevText} -> ${event.newText}`);
                if (event._property === 'nullTest' && event.newText !== event.prevText) {
                    let changeAction;
                    if (event.newText === 'error') {
                        changeAction = (0, Events_1.propertyChange)('required', true, false);
                    }
                    else {
                        changeAction = (0, Events_1.propertyChange)('required', false, true);
                    }
                    this.notifyDependents(changeAction);
                }
            });
            if (this.fieldType === 'drop-down') {
                const enums = [], enumNames = [];
                const saveItems = this.xfaNode.resolveNodes('items[1].#text[*]');
                for (let i = 0; i < saveItems.length; i++) {
                    enums.push(saveItems.item(i).value);
                }
                const displayItems = this.xfaNode.resolveNodes('items[0].#text[*]');
                for (let i = 0; i < displayItems.length; i++) {
                    enumNames.push(displayItems.item(i).value);
                }
                this.enum = enums;
                this.enumNames = enumNames;
            }
        }
        this.setupRuleNode();
    }
    ruleNodeReference() {
        var _a;
        if ((_a = this.type) === null || _a === void 0 ? void 0 : _a.endsWith('[]')) {
            this._ruleNodeReference = [];
        }
        else {
            this._ruleNodeReference = this;
        }
        return this._ruleNodeReference;
    }
    _getDefaults() {
        return {
            readOnly: false,
            enabled: true,
            visible: true,
            label: {
                visible: true,
                richText: false
            },
            required: false,
            type: this._getFallbackType()
        };
    }
    _getFallbackType() {
        const type = this._jsonModel.type;
        let finalType = type;
        if (typeof type !== 'string' || validTypes.indexOf(type) === -1) {
            const _enum = this.enum;
            finalType = typeof (_enum === null || _enum === void 0 ? void 0 : _enum[0]);
            if (finalType === 'undefined' && typeof this._jsonModel.default !== 'undefined') {
                if (this._jsonModel.default instanceof Array && this._jsonModel.default.length > 0) {
                    finalType = `${typeof (this._jsonModel.default[0])}[]`;
                }
                else {
                    finalType = typeof (this._jsonModel.default);
                }
            }
            if (finalType.indexOf('undefined') === 0) {
                const typeMappings = {
                    'text-input': 'string',
                    'multiline-input': 'string',
                    'number-input': 'number',
                    'date-input': 'string',
                    'email': 'string',
                    'plain-text': 'string',
                    'image': 'string',
                    'checkbox': 'boolean'
                };
                finalType = typeMappings[this.fieldType];
            }
        }
        return finalType;
    }
    _applyDefaults() {
        super._applyDefaultsInModel();
        this.coerceParam('required', 'boolean');
        this.coerceParam('readOnly', 'boolean');
        this.coerceParam('enabled', 'boolean');
        const type = this._jsonModel.type;
        if (typeof type !== 'string' || validTypes.indexOf(type) === -1) {
            this._jsonModel.type = this._getFallbackType();
        }
        if (['plain-text', 'image'].indexOf(this.fieldType) === -1) {
            this._jsonModel.value = undefined;
        }
        else {
            this._jsonModel.default = this._jsonModel.default || this._jsonModel.value;
        }
        const value = this._jsonModel.value;
        if (value === undefined) {
            const typedRes = ValidationUtils_1.Constraints.type(this.getInternalType() || 'string', this._jsonModel.default);
            this._jsonModel.value = typedRes.value;
        }
        if (this._jsonModel.type !== 'string') {
            this.unset('emptyValue');
        }
        if (this._jsonModel.fieldType === undefined) {
            this.form.logger.debug('fieldType property is mandatory. Please ensure all the fields have a fieldType');
            if (this._jsonModel.viewType) {
                if (this._jsonModel.viewType.startsWith('custom:')) {
                    this.form.logger.error('viewType property has been removed. For custom types, use :type property');
                }
                else {
                    this.form.logger.error('viewType property has been removed. Use fieldType property');
                }
                this._jsonModel.fieldType = this._jsonModel.viewType;
            }
            else {
                this._jsonModel.fieldType = (0, SchemaUtils_1.defaultFieldTypes)(this._jsonModel);
            }
        }
        if (this._jsonModel.enum === undefined) {
            const type = this._jsonModel.type;
            if (type === 'boolean') {
                this._jsonModel.enum = [true, false];
            }
        }
        else {
            if (typeof this._jsonModel.enumNames === 'undefined') {
                this._jsonModel.enumNames = this._jsonModel.enum.map(_ => _.toString());
            }
            while (this._jsonModel.enumNames.length < this._jsonModel.enum.length) {
                this._jsonModel.enumNames.push(this._jsonModel.enum[this._jsonModel.enumNames.length].toString());
            }
        }
        const props = ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'];
        if (this._jsonModel.type !== 'string') {
            this.unset('format', 'pattern', 'minLength', 'maxLength');
        }
        else if (this._jsonModel.fieldType === 'date-input') {
            this._jsonModel.format = 'date';
        }
        this.coerceParam('minLength', 'number');
        this.coerceParam('maxLength', 'number');
        if (this._jsonModel.type !== 'number' && this._jsonModel.format !== 'date' && this._jsonModel.type !== 'integer') {
            this.unset('step', ...props);
        }
        props.forEach(c => {
            this.coerceParam(c, this._jsonModel.type === 'integer' ? 'number' : this._jsonModel.type);
        });
        if (typeof this._jsonModel.step !== 'number') {
            this.coerceParam('step', 'number');
        }
    }
    unset(...props) {
        props.forEach(p => this._jsonModel[p] = undefined);
    }
    coerceParam(param, type) {
        const val = this._jsonModel[param];
        if (typeof val !== 'undefined' && typeof val !== type) {
            this.form.logger.info(`${param} is not of type ${type}. Trying to coerce.`);
            try {
                this._jsonModel[param] = (0, ValidationUtils_1.coerceType)(val, type);
            }
            catch (e) {
                this.form.logger.warn(e);
                this.unset(param);
            }
        }
    }
    get editFormat() {
        return this.withCategory(this._jsonModel.editFormat);
    }
    get displayFormat() {
        return this.withCategory(this._jsonModel.displayFormat);
    }
    get displayValueExpression() {
        return this._jsonModel.displayValueExpression;
    }
    get placeholder() {
        return this._jsonModel.placeholder;
    }
    get readOnly() {
        if (this.xfaNode) {
            return Schema_1.default.getPropertyFromXfaNode(this.xfaNode, 'readOnly');
        }
        if (this.parent.readOnly !== undefined) {
            return this.parent.readOnly === true ? true : this._jsonModel.readOnly;
        }
        else {
            return this._jsonModel.readOnly;
        }
    }
    set readOnly(e) {
        this._setProperty('readOnly', e);
    }
    get enabled() {
        var _a;
        if (this.xfaNode) {
            return Schema_1.default.getPropertyFromXfaNode(this.xfaNode, 'enabled');
        }
        const parentEnabled = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.enabled;
        if (parentEnabled !== undefined) {
            return parentEnabled ? this._jsonModel.enabled : false;
        }
        return this._jsonModel.enabled;
    }
    set enabled(e) {
        this._setProperty('enabled', e);
    }
    get valid() {
        var _a, _b;
        return (_b = (_a = this._jsonModel) === null || _a === void 0 ? void 0 : _a.validity) === null || _b === void 0 ? void 0 : _b.valid;
    }
    set valid(e) {
        const validity = Object.assign({ valid: e }, (e ? {} : { customConstraint: true }));
        this._setProperty('valid', e);
        this._setProperty('validity', validity);
    }
    get validity() {
        return this._jsonModel.validity;
    }
    get emptyValue() {
        if (this._jsonModel.emptyValue === 'null') {
            return null;
        }
        else if (this._jsonModel.emptyValue === '' && this.type === 'string') {
            return '';
        }
        else {
            return undefined;
        }
    }
    get enum() {
        return this._jsonModel.enum;
    }
    set enum(e) {
        this._setProperty('enum', e);
    }
    get enumNames() {
        return this._jsonModel.enumNames;
    }
    set enumNames(e) {
        this._setProperty('enumNames', e);
    }
    get required() {
        if (this.xfaNode) {
            return this.xfaNode.mandatory !== 'disabled';
        }
        return this._jsonModel.required || false;
    }
    set required(r) {
        this._setProperty('required', r);
    }
    get maximum() {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            return this._jsonModel.maximum;
        }
    }
    set maximum(m) {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            this._setProperty('maximum', m);
        }
    }
    get minimum() {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            return this._jsonModel.minimum;
        }
    }
    set minimum(m) {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            this._setProperty('minimum', m);
        }
    }
    withCategory(df) {
        if (df) {
            const hasCategory = df === null || df === void 0 ? void 0 : df.match(/^(?:date|num)\|/);
            if (hasCategory === null) {
                if (this.format === 'date') {
                    df = `date|${df}`;
                }
                else if (this.type === 'number' || this.type === 'integer') {
                    df = `num|${df}`;
                }
                return df;
            }
        }
        return df;
    }
    get editValue() {
        const df = this.editFormat;
        if (df && this.isNotEmpty(this.value) && this.valid !== false) {
            try {
                return (0, af_formatters_1.format)(this.value, this.lang, df);
            }
            catch (e) {
                return this.value;
            }
        }
        else {
            return this.value;
        }
    }
    get displayValue() {
        if (this.displayValueExpression && typeof this.displayValueExpression === 'string' && this.displayValueExpression.length !== 0) {
            return this.executeExpression(this.displayValueExpression);
        }
        const df = this.displayFormat;
        if (df && this.isNotEmpty(this.value) && this.valid !== false) {
            try {
                return (0, af_formatters_1.format)(this.value, this.lang, df);
            }
            catch (e) {
                return this.value;
            }
        }
        else {
            return this.value;
        }
    }
    getDataNodeValue(typedValue) {
        return this.isEmpty() ? this.emptyValue : typedValue;
    }
    updateDataNodeAndTypedValue(val) {
        const dataNode = this.getDataNode();
        if (BaseNode_1.staticFields.indexOf(this.fieldType) > -1 && typeof dataNode !== 'undefined' && dataNode !== EmptyDataValue_1.default) {
            return;
        }
        const Constraints = this._getConstraintObject();
        const typeRes = Constraints.type(this.getInternalType() || 'string', val);
        const changes = this._setProperty('value', typeRes.value, false);
        if (changes.length > 0) {
            this._updateRuleNodeReference(typeRes.value);
            if (typeof dataNode !== 'undefined') {
                dataNode.setValue(this.getDataNodeValue(this._jsonModel.value), this._jsonModel.value, this);
            }
        }
        return changes;
    }
    get value() {
        if (this.xfaNode) {
            return Schema_1.default.getPropertyFromXfaNode(this.xfaNode, 'value');
        }
        if (this._jsonModel.value === undefined) {
            return null;
        }
        else {
            return this._jsonModel.value;
        }
    }
    set value(v) {
        if (this.xfaNode) {
            Schema_1.default.setPropertyToXfaNode(this.xfaNode, 'value', v);
        }
        else {
            const changes = this.updateDataNodeAndTypedValue(v);
            let uniqueRes = { valid: true };
            let constraint = 'type';
            if ((changes === null || changes === void 0 ? void 0 : changes.length) > 0) {
                let updates = {};
                const typeRes = ValidationUtils_1.Constraints.type(this.getInternalType() || 'string', v);
                if (this.parent.uniqueItems && this.parent.type === 'array') {
                    uniqueRes = ValidationUtils_1.Constraints.uniqueItems(this.parent.uniqueItems, this.parent.getDataNode().$value);
                    constraint = 'uniqueItems';
                }
                if (typeRes.valid && uniqueRes.valid) {
                    updates = this.evaluateConstraints();
                }
                else {
                    const valid = typeRes.valid && uniqueRes.valid;
                    const changes = Object.assign({ valid, 'errorMessage': typeRes.valid && uniqueRes.valid ? '' : this.getErrorMessage('type') }, (valid ? {} : {
                        'validationMessage': valid ? '' : this.getErrorMessage(constraint),
                        'validity': {
                            valid,
                            [types_1.constraintKeys[constraint]]: true
                        }
                    }));
                    updates = this._applyUpdates(['valid', 'errorMessage', 'validationMessage', 'validity'], changes);
                }
                if (updates.valid) {
                    this.triggerValidationEvent(updates);
                }
                const changeAction = new Events_1.Change({ changes: changes.concat(Object.values(updates)), eventSource: this._eventSource });
                this.dispatch(changeAction);
            }
        }
    }
    uiChange(action) {
        this._eventSource = types_1.EventSource.UI;
        if ('value' in action.payload) {
            this.value = action.payload.value;
        }
        else if ('checked' in action.payload) {
            this.checked = action.payload.checked;
        }
        this._eventSource = types_1.EventSource.CODE;
    }
    reset() {
        const changes = this.updateDataNodeAndTypedValue(this.default);
        if (!changes) {
            return;
        }
        const validationStateChanges = {
            'valid': undefined,
            'errorMessage': '',
            'validationMessage': '',
            'validity': {
                valid: undefined
            }
        };
        const updates = this._applyUpdates(['valid', 'errorMessage', 'validationMessage', 'validity'], validationStateChanges);
        const changeAction = new Events_1.Change({ changes: changes.concat(Object.values(updates)) });
        this.dispatch(changeAction);
    }
    _updateRuleNodeReference(value) {
        var _a;
        if ((_a = this.type) === null || _a === void 0 ? void 0 : _a.endsWith('[]')) {
            if (value != null) {
                value.forEach((val, index) => {
                    this._ruleNodeReference[index] = val;
                });
                while (value.length !== this._ruleNodeReference.length) {
                    this._ruleNodeReference.pop();
                }
            }
            else {
                while (this._ruleNodeReference.length !== 0) {
                    this._ruleNodeReference.pop();
                }
            }
        }
    }
    getInternalType() {
        return this.type;
    }
    valueOf() {
        const obj = this[BaseNode_1.target];
        const actualField = obj === undefined ? this : obj;
        actualField.ruleEngine.trackDependency(actualField);
        return actualField._jsonModel.value || null;
    }
    toString() {
        var _a;
        const obj = this[BaseNode_1.target];
        const actualField = obj === undefined ? this : obj;
        return ((_a = actualField._jsonModel.value) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    }
    getErrorMessage(constraint) {
        var _a;
        const afConstraintKey = constraint;
        const html5ConstraintType = types_1.constraintKeys[afConstraintKey];
        const constraintTypeMessages = (0, types_1.getConstraintTypeMessages)();
        return ((_a = this._jsonModel.constraintMessages) === null || _a === void 0 ? void 0 : _a[afConstraintKey === 'exclusiveMaximum' ? 'maximum' :
            afConstraintKey === 'exclusiveMinimum' ? 'minimum' :
                afConstraintKey])
            || (0, FormUtils_1.replaceTemplatePlaceholders)(constraintTypeMessages[html5ConstraintType], [this._jsonModel[afConstraintKey]]);
    }
    get errorMessage() {
        return this._jsonModel.errorMessage;
    }
    set errorMessage(e) {
        this._setProperty('errorMessage', e);
        this._setProperty('validationMessage', e);
    }
    _getConstraintObject() {
        return ValidationUtils_1.Constraints;
    }
    isArrayType() {
        return this.type ? this.type.indexOf('[]') > -1 : false;
    }
    checkEnum(value, constraints) {
        if (this._jsonModel.enforceEnum === true && value != null) {
            const fn = constraints.enum;
            if (value instanceof Array && this.isArrayType()) {
                return value.every(x => fn(this.enum || [], x).valid);
            }
            else {
                return fn(this.enum || [], value).valid;
            }
        }
        return true;
    }
    checkStep() {
        var _a, _b;
        const value = this._jsonModel.value;
        const step = this._jsonModel.step;
        if (typeof step === 'number') {
            const prec = ((_b = (_a = step.toString().split('.')) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.length) || 0;
            const factor = Math.pow(10, prec);
            const fStep = step * factor;
            const fVal = value * factor;
            const iv = this._jsonModel.minimum || this._jsonModel.default || 0;
            const fIVal = iv * factor;
            const qt = (fVal - fIVal) / fStep;
            const valid = Math.abs(fVal - fIVal) % fStep < .001;
            let next, prev;
            if (!valid) {
                next = (Math.ceil(qt) * fStep + fIVal) / factor;
                prev = (next - fStep) / factor;
            }
            return {
                valid,
                next,
                prev
            };
        }
        return {
            valid: true
        };
    }
    checkValidationExpression() {
        const validationExp = this._jsonModel.validationExpression;
        if (typeof validationExp === 'string' && validationExp.length !== 0) {
            return this.executeExpression(validationExp);
        }
        return true;
    }
    getConstraints() {
        switch (this.type) {
            case 'string':
                switch (this.format) {
                    case 'date':
                        return ValidationUtils_1.ValidConstraints.date;
                    case 'email':
                        return ValidationUtils_1.ValidConstraints.email;
                    case 'binary':
                        return ValidationUtils_1.ValidConstraints.file;
                    case 'data-url':
                        return ValidationUtils_1.ValidConstraints.file;
                    default:
                        return ValidationUtils_1.ValidConstraints.string;
                }
            case 'file':
                return ValidationUtils_1.ValidConstraints.file;
            case 'number':
            case 'integer':
                return ValidationUtils_1.ValidConstraints.number;
        }
        if (this.isArrayType()) {
            return ValidationUtils_1.ValidConstraints.array;
        }
        return [];
    }
    get format() {
        if (typeof this._jsonModel.format === 'undefined') {
            if (this.type === 'string') {
                switch (this.fieldType) {
                    case 'date-input':
                        this._jsonModel.format = 'date';
                        break;
                    case 'file-input':
                        this._jsonModel.format = 'data-url';
                        break;
                }
            }
        }
        return this._jsonModel.format;
    }
    get enforceEnum() {
        return this._jsonModel.enforceEnum;
    }
    get tooltip() {
        return this._jsonModel.tooltip;
    }
    get maxLength() {
        return this._jsonModel.maxLength;
    }
    get minLength() {
        return this._jsonModel.minLength;
    }
    get pattern() {
        return this._jsonModel.pattern;
    }
    get step() {
        if (this.type === 'number' || this.format === 'date') {
            return this._jsonModel.step;
        }
    }
    get exclusiveMinimum() {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            return this._jsonModel.exclusiveMinimum;
        }
    }
    set exclusiveMinimum(eM) {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            this._jsonModel.exclusiveMinimum = eM;
        }
    }
    get exclusiveMaximum() {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            return this._jsonModel.exclusiveMaximum;
        }
    }
    set exclusiveMaximum(eM) {
        if (this.type === 'number' || this.format === 'date' || this.type === 'integer') {
            this._jsonModel.exclusiveMaximum = eM;
        }
    }
    get default() {
        return this._jsonModel.default;
    }
    isNotEmpty(value) {
        return value != null && value !== '';
    }
    evaluateConstraints() {
        let constraint = 'type';
        const elem = this._jsonModel;
        const value = this._jsonModel.value;
        const Constraints = this._getConstraintObject();
        const supportedConstraints = this.getConstraints();
        let valid = true;
        if (valid) {
            valid = Constraints.required(this.required, value).valid &&
                (this.isArrayType() && this.required ? value.length > 0 : true);
            constraint = 'required';
        }
        if (valid && this.isNotEmpty(value)) {
            const invalidConstraint = supportedConstraints.find(key => {
                if (key in elem && elem[key] !== undefined) {
                    const restriction = elem[key];
                    const fn = Constraints[key];
                    if (value instanceof Array && this.isArrayType()) {
                        if (ValidationUtils_1.ValidConstraints.array.indexOf(key) !== -1) {
                            return !fn(restriction, value).valid;
                        }
                        else {
                            return value.some(x => !(fn(restriction, x).valid));
                        }
                    }
                    else if (typeof fn === 'function') {
                        return !fn(restriction, value).valid;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            });
            if (invalidConstraint != null) {
                valid = false;
                constraint = invalidConstraint;
            }
            else {
                valid = this.checkEnum(value, Constraints);
                constraint = 'enum';
                if (valid && this.type === 'number') {
                    valid = this.checkStep().valid;
                    constraint = 'step';
                }
                if (valid) {
                    valid = this.checkValidationExpression();
                    constraint = 'validationExpression';
                }
            }
        }
        if (!valid) {
            this.form.logger.info(`${constraint} constraint evaluation failed ${this._jsonModel[constraint]}. Received ${this._jsonModel.value}`);
        }
        const changes = Object.assign({ 'valid': valid, 'errorMessage': valid ? '' : this.getErrorMessage(constraint) }, ({
            'validationMessage': valid ? '' : this.getErrorMessage(constraint),
            'validity': Object.assign({ valid }, (valid ? {} : { [types_1.constraintKeys[constraint]]: true }))
        }));
        return this._applyUpdates(['valid', 'errorMessage', 'validationMessage', 'validity'], changes);
    }
    triggerValidationEvent(changes) {
        if (changes.validity) {
            __classPrivateFieldGet(this, _Field_instances, "m", _Field_triggerValidationEvent).call(this);
        }
    }
    validate() {
        var _a;
        if (this.visible === false) {
            return [];
        }
        if (this.valid === false && this.errorMessage && ((_a = this === null || this === void 0 ? void 0 : this.validity) === null || _a === void 0 ? void 0 : _a.customConstraint)) {
            return [new types_1.ValidationError(this.id, [this._jsonModel.errorMessage])];
        }
        const changes = this.evaluateConstraints();
        __classPrivateFieldGet(this, _Field_instances, "m", _Field_triggerValidationEvent).call(this);
        if (changes.validity) {
            this.notifyDependents(new Events_1.Change({ changes: Object.values(changes) }));
        }
        return this.valid ? [] : [new types_1.ValidationError(this.id, [this._jsonModel.errorMessage])];
    }
    syncDataAndFormModel(dataNode) {
        if (dataNode !== undefined && dataNode !== EmptyDataValue_1.default && dataNode.$value !== this._jsonModel.value) {
            const changeAction = (0, Events_1.propertyChange)('value', dataNode.$value, this._jsonModel.value);
            this._jsonModel.value = dataNode.$value;
            this.queueEvent(changeAction);
        }
    }
    defaultDataModel(name) {
        const value = BaseNode_1.staticFields.indexOf(this.fieldType) > -1 ? undefined : this.getDataNodeValue(this._jsonModel.value);
        return new DataValue_1.default(name, value, this.type || 'string');
    }
    getState(isRepeatableChild = false, forRestore = false) {
        return Object.assign(Object.assign({}, super.getState(forRestore)), { editFormat: this.editFormat, displayFormat: this.displayFormat, editValue: this.editValue, displayValue: this.displayValue, enabled: this.enabled, readOnly: this.readOnly });
    }
    markAsInvalid(message, constraint = null) {
        const changes = {
            'valid': false,
            'errorMessage': message,
            'validationMessage': message,
            'validity': Object.assign({ valid: false }, (constraint != null ? { [types_1.constraintKeys[constraint]]: true } : { customConstraint: true }))
        };
        const updates = this._applyUpdates(['valid', 'errorMessage', 'validationMessage', 'validity'], changes);
        const changeAction = new Events_1.Change({ changes: [].concat(Object.values(updates)) });
        if (changeAction.payload.changes.length !== 0) {
            this.triggerValidationEvent(updates);
            this.dispatch(changeAction);
        }
    }
}
_Field_instances = new WeakSet(), _Field_triggerValidationEvent = function _Field_triggerValidationEvent() {
    if (this.validity.valid) {
        this.dispatch(new Events_1.Valid());
    }
    else {
        this.dispatch(new Events_1.Invalid());
    }
};
__decorate([
    (0, BaseNode_1.dependencyTracked)(),
    (0, BaseNode_1.exclude)('button', 'image', 'plain-text')
], Field.prototype, "readOnly", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)(),
    (0, BaseNode_1.exclude)('image', 'plain-text')
], Field.prototype, "enabled", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "valid", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "validity", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "enum", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "enumNames", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "required", null);
__decorate([
    (0, BaseNode_1.include)('date-input', 'number-input')
], Field.prototype, "editValue", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "value", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "errorMessage", null);
__decorate([
    (0, BaseNode_1.include)('text-input', 'date-input', 'file-input', 'email')
], Field.prototype, "format", null);
__decorate([
    (0, BaseNode_1.include)('text-input')
], Field.prototype, "maxLength", null);
__decorate([
    (0, BaseNode_1.include)('text-input')
], Field.prototype, "minLength", null);
__decorate([
    (0, BaseNode_1.include)('text-input')
], Field.prototype, "pattern", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "exclusiveMinimum", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], Field.prototype, "exclusiveMaximum", null);
exports["default"] = Field;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Fieldset.js":
/*!************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Fieldset.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fieldset = void 0;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core-xfa/lib/Container.js"));
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
class Fieldset extends Container_1.default {
    constructor(params, _options) {
        super(params, _options);
        if (_options.mode !== 'restore') {
            this._applyDefaults();
            this.queueEvent(new Events_1.Initialize());
            this.queueEvent(new Events_1.ExecuteRule());
        }
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { visible: true, required: false, label: {
                visible: true,
                richText: false
            } });
    }
    _applyDefaults() {
        super._applyDefaultsInModel();
        if (this._jsonModel.dataRef && this._jsonModel.type === undefined) {
            this._jsonModel.type = 'object';
        }
    }
    get type() {
        const ret = super.type;
        if (ret === 'array' || ret === 'object') {
            return ret;
        }
        return undefined;
    }
    get items() {
        return super.items ? super.items : [];
    }
    get value() {
        var _a;
        return (_a = this.getDataNode()) === null || _a === void 0 ? void 0 : _a.$value;
    }
    get fieldType() {
        return 'panel';
    }
    _initialize(mode) {
        super._initialize(mode);
    }
}
exports.Fieldset = Fieldset;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/FileObject.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileObject = void 0;
class FileObject {
    constructor(init) {
        this.mediaType = 'application/octet-stream';
        this.name = 'unknown';
        this.size = 0;
        Object.assign(this, init);
    }
    get type() {
        return this.mediaType;
    }
    set type(type) {
        this.mediaType = type;
    }
    toJSON() {
        return {
            'name': this.name,
            'size': this.size,
            'mediaType': this.mediaType,
            'data': this.data.toString()
        };
    }
    equals(obj) {
        return (this.data === obj.data &&
            this.mediaType === obj.mediaType &&
            this.name === obj.name &&
            this.size === obj.size);
    }
}
exports.FileObject = FileObject;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/FileUpload.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/FileUpload.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const FileObject_1 = __webpack_require__(/*! ./FileObject */ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js");
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js");
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./data/EmptyDataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js"));
function addNameToDataURL(dataURL, name) {
    return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}
function processFiles(files) {
    return Promise.all([].map.call(files, processFile));
}
function processFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, size, type } = file;
        const fileObj = yield new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                resolve(new FileObject_1.FileObject({
                    data: addNameToDataURL(event.target.result, name),
                    type,
                    name,
                    size
                }));
            };
            reader.readAsDataURL(file.data);
        });
        return fileObj;
    });
}
class FileUpload extends Field_1.default {
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { accept: ['audio/*', 'video/*', 'image/*', 'text/*', 'application/pdf'], maxFileSize: '2MB' });
    }
    _getFallbackType() {
        return 'file';
    }
    get maxFileSize() {
        return (0, FormUtils_1.getFileSizeInBytes)(this._jsonModel.maxFileSize);
    }
    get accept() {
        return this._jsonModel.accept;
    }
    _applyUpdates(propNames, updates) {
        return propNames.reduce((acc, propertyName) => {
            const prevValue = this._jsonModel[propertyName];
            const currentValue = updates[propertyName];
            if (currentValue !== prevValue) {
                acc[propertyName] = {
                    propertyName,
                    currentValue,
                    prevValue
                };
                if (prevValue instanceof FileObject_1.FileObject && typeof currentValue === 'object' && propertyName === 'value') {
                    this._jsonModel[propertyName] = new FileObject_1.FileObject(Object.assign(Object.assign({}, prevValue), { 'data': currentValue.data }));
                }
                else {
                    this._jsonModel[propertyName] = currentValue;
                }
            }
            return acc;
        }, {});
    }
    getInternalType() {
        var _a;
        return ((_a = this.type) === null || _a === void 0 ? void 0 : _a.endsWith('[]')) ? 'file[]' : 'file';
    }
    getDataNodeValue(typedValue) {
        var _a;
        let dataNodeValue = typedValue;
        if (dataNodeValue != null) {
            if (this.type === 'string') {
                dataNodeValue = (_a = dataNodeValue.data) === null || _a === void 0 ? void 0 : _a.toString();
            }
            else if (this.type === 'string[]') {
                dataNodeValue = dataNodeValue instanceof Array ? dataNodeValue : [dataNodeValue];
                dataNodeValue = dataNodeValue.map((_) => { var _a; return (_a = _ === null || _ === void 0 ? void 0 : _.data) === null || _a === void 0 ? void 0 : _a.toString(); });
            }
        }
        return dataNodeValue;
    }
    serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const val = this._jsonModel.value;
            if (val === undefined) {
                return null;
            }
            const filesInfo = yield processFiles(val instanceof Array ? val : [val]);
            return filesInfo;
        });
    }
    syncDataAndFormModel(dataNode) {
        if (dataNode !== undefined && dataNode !== EmptyDataValue_1.default) {
            const value = dataNode === null || dataNode === void 0 ? void 0 : dataNode.$value;
            if (value != null) {
                const res = ValidationUtils_1.Constraints.type(this.getInternalType(), value);
                if (!res.valid) {
                    this.form.logger.debug(`unable to bind ${this.name} to data`);
                }
                this.form.getEventQueue().queue(this, (0, Events_1.propertyChange)('value', res.value, this._jsonModel.value));
                this._jsonModel.value = res.value;
            }
            else {
                this._jsonModel.value = null;
            }
        }
    }
}
exports["default"] = FileUpload;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Form.js":
/*!********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Form.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Form_instances, _Form_getNavigableChildren, _Form_getFirstNavigableChild, _Form_setActiveFirstDeepChild, _Form_getNextItem, _Form_getPreviousItem, _Form_clearCurrentFocus;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.currentVersion = void 0;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core-xfa/lib/Container.js"));
const FormMetaData_1 = __importDefault(__webpack_require__(/*! ./FormMetaData */ "./node_modules/@aemforms/af-core-xfa/lib/FormMetaData.js"));
const SubmitMetaData_1 = __importDefault(__webpack_require__(/*! ./SubmitMetaData */ "./node_modules/@aemforms/af-core-xfa/lib/SubmitMetaData.js"));
const EventQueue_1 = __importDefault(__webpack_require__(/*! ./controller/EventQueue */ "./node_modules/@aemforms/af-core-xfa/lib/controller/EventQueue.js"));
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const Logger_1 = __webpack_require__(/*! ./controller/Logger */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Logger.js");
const DataGroup_1 = __importDefault(__webpack_require__(/*! ./data/DataGroup */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js"));
const FunctionRuntime_1 = __webpack_require__(/*! ./rules/FunctionRuntime */ "./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js");
const index_1 = __webpack_require__(/*! ./types/index */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const Version_1 = __webpack_require__(/*! ./utils/Version */ "./node_modules/@aemforms/af-core-xfa/lib/utils/Version.js");
exports.currentVersion = new Version_1.Version('0.13');
const changeEventVersion = new Version_1.Version('0.13');
class Form extends Container_1.default {
    constructor(n, fieldFactory, _ruleEngine, _eventQueue = new EventQueue_1.default(), logLevel = 'off', mode = 'create') {
        super(n, { fieldFactory: fieldFactory, mode });
        this._ruleEngine = _ruleEngine;
        this._eventQueue = _eventQueue;
        _Form_instances.add(this);
        this.additionalSubmitMetadata = {};
        this._fields = {};
        this._invalidFields = [];
        this._exportDataAttachmentMap = {};
        this._captcha = null;
        this.dataRefRegex = /("[^"]+?"|[^.]+?)(?:\.|$)/g;
        this._logger = new Logger_1.Logger(logLevel);
        this._applyDefaultsInModel();
        if (mode === 'create') {
            this.queueEvent(new Events_1.Initialize());
            if (this.changeEventBehaviour === 'deps') {
                this.queueEvent(new Events_1.Change({ changes: [] }));
            }
            else {
                this.queueEvent(new Events_1.ExecuteRule());
            }
        }
        this._ids = (0, FormUtils_1.IdGenerator)();
        this.bindToDataModel(new DataGroup_1.default('$form', {}));
        this._initialize(mode);
        if (mode === 'create') {
            this.queueEvent(new Events_1.FormLoad());
        }
    }
    _applyDefaultsInModel() {
        const current = this.specVersion;
        this._jsonModel.properties = this._jsonModel.properties || {};
        this._jsonModel.fieldType = this._jsonModel.fieldType || 'form';
        if (current.lessThan(changeEventVersion) ||
            typeof this._jsonModel.properties['fd:changeEventBehaviour'] !== 'string') {
            this._jsonModel.properties['fd:changeEventBehaviour'] = 'self';
        }
    }
    get activeField() {
        return this._findActiveField(this);
    }
    _findActiveField(field) {
        if (!(field === null || field === void 0 ? void 0 : field.isContainer)) {
            return field;
        }
        return this._findActiveField(field === null || field === void 0 ? void 0 : field.activeChild);
    }
    get logger() {
        return this._logger;
    }
    get changeEventBehaviour() {
        return this.properties['fd:changeEventBehaviour'] === 'deps' ? 'deps' : 'self';
    }
    get metaData() {
        const metaData = this._jsonModel.metadata || {};
        return new FormMetaData_1.default(metaData);
    }
    get action() {
        return this._jsonModel.action;
    }
    get isFragment() {
        return false;
    }
    importData(dataModel) {
        this.bindToDataModel(new DataGroup_1.default('$form', dataModel));
        this.syncDataAndFormModel(this.getDataNode());
        this._eventQueue.runPendingQueue();
    }
    exportData(attachmentSerializedMap = {}) {
        var _a;
        this._exportDataAttachmentMap = attachmentSerializedMap;
        const finalData = (_a = this.getDataNode()) === null || _a === void 0 ? void 0 : _a.$value;
        this._exportDataAttachmentMap = {};
        return finalData;
    }
    setAdditionalSubmitMetadata(metadata) {
        this.additionalSubmitMetadata = Object.assign(Object.assign({}, this.additionalSubmitMetadata), metadata);
    }
    get specVersion() {
        if (typeof this._jsonModel.adaptiveform === 'string') {
            try {
                return new Version_1.Version(this._jsonModel.adaptiveform);
            }
            catch (e) {
                console.log(e);
                console.log('Falling back to default version' + exports.currentVersion.toString());
                return exports.currentVersion;
            }
        }
        else {
            return exports.currentVersion;
        }
    }
    resolveQualifiedName(qualifiedName) {
        let foundFormElement = null;
        this.visit(formElement => {
            if (formElement.qualifiedName === qualifiedName) {
                foundFormElement = formElement;
            }
        });
        return foundFormElement;
    }
    exportSubmitMetaData() {
        const captchaInfoObj = {};
        this.visit(field => {
            if (field.fieldType === 'captcha') {
                captchaInfoObj[field.qualifiedName] = field.value;
            }
        });
        const options = Object.assign({ lang: this.lang, captchaInfo: captchaInfoObj }, this.additionalSubmitMetadata);
        return new SubmitMetaData_1.default(options);
    }
    setFocus(field, focusOption) {
        if (!focusOption) {
            __classPrivateFieldGet(this, _Form_instances, "m", _Form_clearCurrentFocus).call(this, field);
            __classPrivateFieldGet(this, _Form_instances, "m", _Form_setActiveFirstDeepChild).call(this, field);
            return;
        }
        const parent = ((field === null || field === void 0 ? void 0 : field.isContainer) ? field : field.parent);
        const navigableChidren = __classPrivateFieldGet(this, _Form_instances, "m", _Form_getNavigableChildren).call(this, parent.items);
        let activeChild = parent.activeChild;
        let currActiveChildIndex = activeChild !== null ? navigableChidren.indexOf(activeChild) : -1;
        if (parent.activeChild === null) {
            __classPrivateFieldGet(this, _Form_instances, "m", _Form_setActiveFirstDeepChild).call(this, navigableChidren[0]);
            currActiveChildIndex = 0;
            return;
        }
        if (focusOption === index_1.FocusOption.NEXT_ITEM) {
            activeChild = __classPrivateFieldGet(this, _Form_instances, "m", _Form_getNextItem).call(this, currActiveChildIndex, navigableChidren);
        }
        else if (focusOption === index_1.FocusOption.PREVIOUS_ITEM) {
            activeChild = __classPrivateFieldGet(this, _Form_instances, "m", _Form_getPreviousItem).call(this, currActiveChildIndex, navigableChidren);
        }
        if (activeChild !== null) {
            __classPrivateFieldGet(this, _Form_instances, "m", _Form_setActiveFirstDeepChild).call(this, activeChild);
        }
    }
    getState(forRestore = false) {
        const self = this;
        const res = super.getState(false, forRestore);
        res.id = '$form';
        Object.defineProperty(res, 'data', {
            get: function () {
                return self.exportData();
            }
        });
        Object.defineProperty(res, 'attachments', {
            get: function () {
                return (0, FormUtils_1.getAttachments)(self);
            }
        });
        return res;
    }
    get type() {
        return 'object';
    }
    isTransparent() {
        return false;
    }
    get form() {
        return this;
    }
    get ruleEngine() {
        return this._ruleEngine;
    }
    getUniqueId() {
        if (this._ids == null) {
            return '';
        }
        return this._ids.next().value;
    }
    fieldAdded(field) {
        if (field.fieldType === 'captcha' && !this._captcha) {
            this._captcha = field;
        }
        this._fields[field.id] = field;
        field.subscribe((action) => {
            if (this._invalidFields.indexOf(action.target.id) === -1) {
                this._invalidFields.push(action.target.id);
            }
        }, 'invalid');
        field.subscribe((action) => {
            const index = this._invalidFields.indexOf(action.target.id);
            if (index > -1) {
                this._invalidFields.splice(index, 1);
            }
        }, 'valid');
        field.subscribe((action) => {
            const field = action.target.getState();
            if (action.payload.changes.length > 0 && field) {
                const shallowClone = (obj) => {
                    if (obj && typeof obj === 'object') {
                        if (Array.isArray(obj)) {
                            return obj.map(shallowClone);
                        }
                        else {
                            return Object.assign({}, obj);
                        }
                    }
                    return obj;
                };
                const changes = action.payload.changes.map(({ propertyName, currentValue, prevValue }) => {
                    return {
                        propertyName,
                        currentValue: shallowClone(currentValue),
                        prevValue: shallowClone(prevValue)
                    };
                });
                const fieldChangedAction = new Events_1.FieldChanged(changes, field, action.payload.eventSource);
                this.notifyDependents(fieldChangedAction);
            }
        });
    }
    visit(callBack) {
        this.traverseChild(this, callBack);
    }
    traverseChild(container, callBack) {
        container.items.forEach((field) => {
            if (field.isContainer) {
                this.traverseChild(field, callBack);
            }
            callBack(field);
        });
    }
    validate() {
        const validationErrors = super.validate();
        this.dispatch(new Events_1.ValidationComplete(validationErrors));
        return validationErrors;
    }
    isValid() {
        return this._invalidFields.length === 0;
    }
    dispatch(action) {
        if (action.type === 'submit') {
            super.queueEvent(action);
            this._eventQueue.runPendingQueue();
        }
        else {
            super.dispatch(action);
        }
    }
    submit(action, context) {
        var _a;
        const validate_form = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.validate_form;
        if (validate_form === false || this.validate().length === 0) {
            const payload = (action === null || action === void 0 ? void 0 : action.payload) || {};
            const successEventName = (payload === null || payload === void 0 ? void 0 : payload.success) ? payload === null || payload === void 0 ? void 0 : payload.success : 'submitSuccess';
            const failureEventName = (payload === null || payload === void 0 ? void 0 : payload.error) ? payload === null || payload === void 0 ? void 0 : payload.error : 'submitError';
            const formAction = payload.action || this.action;
            const metadata = payload.metadata || {
                'submitMetadata': this.exportSubmitMetaData()
            };
            const contentType = (payload === null || payload === void 0 ? void 0 : payload.save_as) || (payload === null || payload === void 0 ? void 0 : payload.submit_as);
            (0, FunctionRuntime_1.submit)(context, successEventName, failureEventName, contentType, payload === null || payload === void 0 ? void 0 : payload.data, formAction, metadata);
        }
    }
    save(action, context) {
        var _a;
        const payload = (action === null || action === void 0 ? void 0 : action.payload) || {};
        payload.save_as = 'multipart/form-data';
        payload.metadata = {
            'draftMetadata': {
                'lang': this.lang,
                'draftId': ((_a = this.properties) === null || _a === void 0 ? void 0 : _a.draftId) || ''
            }
        };
        payload.success = 'custom:saveSuccess';
        payload.error = 'custom:saveError';
        this.submit(action, context);
        this.subscribe((action) => {
            this._saveSuccess(action);
        }, 'saveSuccess');
    }
    _saveSuccess(action) {
        var _a, _b;
        const draftId = ((_b = (_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.draftId) || '';
        const properties = this.properties;
        if (draftId && properties) {
            properties.draftId = draftId;
        }
    }
    reset() {
        super.reset();
        this._invalidFields = [];
    }
    getElement(id) {
        if (id == this.id) {
            return this;
        }
        return this._fields[id];
    }
    get qualifiedName() {
        return '$form';
    }
    getEventQueue() {
        return this._eventQueue;
    }
    get name() {
        return '$form';
    }
    get value() {
        return null;
    }
    get id() {
        return this._jsonModel.id || '$form';
    }
    get title() {
        return this._jsonModel.title || '';
    }
    get captcha() {
        return this._captcha;
    }
}
_Form_instances = new WeakSet(), _Form_getNavigableChildren = function _Form_getNavigableChildren(children) {
    return children.filter(child => child.visible === true);
}, _Form_getFirstNavigableChild = function _Form_getFirstNavigableChild(container) {
    const navigableChidren = __classPrivateFieldGet(this, _Form_instances, "m", _Form_getNavigableChildren).call(this, container.items);
    if (navigableChidren) {
        return navigableChidren[0];
    }
    return null;
}, _Form_setActiveFirstDeepChild = function _Form_setActiveFirstDeepChild(currentField) {
    if (!currentField.isContainer) {
        const parent = currentField.parent;
        parent.activeChild = currentField;
        return;
    }
    __classPrivateFieldGet(this, _Form_instances, "m", _Form_clearCurrentFocus).call(this, currentField);
    let currentActiveChild = currentField.activeChild;
    currentActiveChild = (currentActiveChild === null) ? __classPrivateFieldGet(this, _Form_instances, "m", _Form_getFirstNavigableChild).call(this, currentField) : currentField.activeChild;
    __classPrivateFieldGet(this, _Form_instances, "m", _Form_setActiveFirstDeepChild).call(this, currentActiveChild);
}, _Form_getNextItem = function _Form_getNextItem(currIndex, navigableChidren) {
    if (currIndex < (navigableChidren.length - 1)) {
        return navigableChidren[currIndex + 1];
    }
    return null;
}, _Form_getPreviousItem = function _Form_getPreviousItem(currIndex, navigableChidren) {
    if (currIndex > 0) {
        return navigableChidren[currIndex - 1];
    }
    return null;
}, _Form_clearCurrentFocus = function _Form_clearCurrentFocus(field) {
    const parent = field.parent;
    if (parent != null && parent.activeChild != null) {
        parent.activeChild = null;
    }
};
exports["default"] = Form;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/FormInstance.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/FormInstance.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerFunctions = exports.fetchForm = exports.validateFormData = exports.validateFormInstance = exports.restoreFormInstance = exports.createFormInstance = void 0;
const Form_1 = __importStar(__webpack_require__(/*! ./Form */ "./node_modules/@aemforms/af-core-xfa/lib/Form.js"));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
const Fetch_1 = __webpack_require__(/*! ./utils/Fetch */ "./node_modules/@aemforms/af-core-xfa/lib/utils/Fetch.js");
const RuleEngine_1 = __importDefault(__webpack_require__(/*! ./rules/RuleEngine */ "./node_modules/@aemforms/af-core-xfa/lib/rules/RuleEngine.js"));
const EventQueue_1 = __importDefault(__webpack_require__(/*! ./controller/EventQueue */ "./node_modules/@aemforms/af-core-xfa/lib/controller/EventQueue.js"));
const Logger_1 = __webpack_require__(/*! ./controller/Logger */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Logger.js");
const FormCreationUtils_1 = __webpack_require__(/*! ./utils/FormCreationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormCreationUtils.js");
const FunctionRuntime_1 = __webpack_require__(/*! ./rules/FunctionRuntime */ "./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js");
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const DataGroup_1 = __importDefault(__webpack_require__(/*! ./data/DataGroup */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js"));
const createFormInstance = (formModel, callback, logLevel = 'error', fModel = undefined) => {
    try {
        let f = fModel;
        {
            if (f == null) {
                formModel = (0, FormUtils_1.sitesModelToFormModel)(formModel);
                f = new Form_1.default(Object.assign({}, formModel), FormCreationUtils_1.FormFieldFactory, new RuleEngine_1.default(), new EventQueue_1.default(new Logger_1.Logger(logLevel)), logLevel);
            }
        }
        const formData = formModel === null || formModel === void 0 ? void 0 : formModel.data;
        if (formData) {
            f.importData(formData);
        }
        if (typeof callback === 'function') {
            callback(f);
        }
        f.getEventQueue().runPendingQueue();
        f.getState();
        return f;
    }
    catch (e) {
        console.error(`Unable to create an instance of the Form ${e}`);
        throw new Error(e);
    }
};
exports.createFormInstance = createFormInstance;
exports.createFormInstance.currentVersion = Form_1.currentVersion;
const defaultOptions = {
    logLevel: 'error'
};
const restoreFormInstance = (formModel, data = null, { logLevel } = defaultOptions) => {
    try {
        const form = new Form_1.default(Object.assign({}, formModel), FormCreationUtils_1.FormFieldFactory, new RuleEngine_1.default(), new EventQueue_1.default(new Logger_1.Logger(logLevel)), logLevel, 'restore');
        if (data) {
            form.bindToDataModel(new DataGroup_1.default('$form', data));
            form.syncDataAndFormModel(form.getDataNode());
        }
        form.getEventQueue().empty();
        return form;
    }
    catch (e) {
        console.error(`Unable to restore an instance of the Form ${e}`);
        throw new Error(e);
    }
};
exports.restoreFormInstance = restoreFormInstance;
const validateFormInstance = (formModel, data) => {
    try {
        const f = new Form_1.default(Object.assign({}, formModel), FormCreationUtils_1.FormFieldFactory, new RuleEngine_1.default());
        if (data) {
            f.importData(data);
        }
        return f.validate().length === 0;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.validateFormInstance = validateFormInstance;
const validateFormData = (formModel, data) => {
    try {
        const f = new Form_1.default(Object.assign({}, formModel), FormCreationUtils_1.FormFieldFactory, new RuleEngine_1.default());
        if (data) {
            f.importData(data);
        }
        const res = f.validate();
        return {
            messages: res,
            valid: res.length === 0
        };
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.validateFormData = validateFormData;
const fetchForm = (url, headers = {}) => {
    const headerObj = new Headers();
    Object.entries(headers).forEach(([key, value]) => {
        headerObj.append(key, value);
    });
    return new Promise((resolve, reject) => {
        (0, Fetch_1.request)(`${url}.model.json`, null, { headers }).then((response) => {
            if (response.status !== 200) {
                reject('Not Found');
            }
            else {
                let formObj = response.body;
                if ('model' in formObj) {
                    const { model } = formObj;
                    formObj = model;
                }
                resolve((0, JsonUtils_1.jsonString)(formObj));
            }
        });
    });
};
exports.fetchForm = fetchForm;
const registerFunctions = (functions) => {
    FunctionRuntime_1.FunctionRuntime.registerFunctions(functions);
};
exports.registerFunctions = registerFunctions;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/FormMetaData.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/FormMetaData.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Node_1 = __importDefault(__webpack_require__(/*! ./Node */ "./node_modules/@aemforms/af-core-xfa/lib/Node.js"));
class FormMetaData extends Node_1.default {
    get version() {
        return this.getP('version', '');
    }
    get grammar() {
        return this.getP('grammar', '');
    }
}
exports["default"] = FormMetaData;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/InstanceManager.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/InstanceManager.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstanceManager = void 0;
const Fieldset_1 = __webpack_require__(/*! ./Fieldset */ "./node_modules/@aemforms/af-core-xfa/lib/Fieldset.js");
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
const Events_1 = __webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
class InstanceManager extends Fieldset_1.Fieldset {
    _canHaveRepeatingChildren(mode = 'create') {
        var _a, _b;
        return ((_b = (_a = this.xfaNode) === null || _a === void 0 ? void 0 : _a.instanceManager) === null || _b === void 0 ? void 0 : _b._isRepeatable()) || super._canHaveRepeatingChildren(mode);
    }
    _initialize(mode) {
        var _a, _b;
        super._initialize(mode);
        if (this.xfaNode && window.xfalib && ((_b = (_a = this.xfaNode) === null || _a === void 0 ? void 0 : _a.instanceManager) === null || _b === void 0 ? void 0 : _b._isRepeatable())) {
            this.xfaNode.parent.on(window.xfalib.script.XfaModelEvent.CHILD_ADDED, (event) => {
                const xfaNode = event.newText;
                const action = new Events_1.AddItem({
                    index: xfaNode.instanceIndex,
                    source: 'xfa',
                    xfaNode
                });
                this.addItem(action);
            });
            this.xfaNode.parent.on(window.xfalib.script.XfaModelEvent.CHILD_REMOVED, (event) => {
                console.log('Child removed', event);
                const xfaNode = event.prevText;
                const jsonModel = this._jsonModel;
                const action = new Events_1.RemoveItem({
                    index: xfaNode.instanceIndex,
                    source: 'xfa',
                    xfaNode
                });
                this.removeItem(action);
                console.log('Child added', event);
                console.log(xfaNode);
                console.log(jsonModel);
            });
            this.xfaNode.parent.on(window.xfalib.script.XfaModelEvent.CHILD_MOVED, (event) => {
                console.log('Child moved', event);
            });
        }
    }
    get maxOccur() {
        return this._jsonModel.maxItems;
    }
    set maxOccur(m) {
        this.maxItems = m;
    }
    get minOccur() {
        return this.minItems;
    }
    addInstance(action) {
        return this.addItem(action);
    }
    removeInstance(action) {
        return this.removeItem(action);
    }
    addItem(action) {
        var _a;
        if (((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.source) !== 'xfa' && this.xfaNode) {
            let index;
            if (typeof action.payload === 'number') {
                index = action.payload;
            }
            else {
                index = action.payload.index;
            }
            this.xfaNode.instanceManager.insertInstance(index);
        }
        else {
            super.addItem(action);
        }
    }
    removeItem(action) {
        var _a;
        if (((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.source) !== 'xfa' && this.xfaNode) {
            let index;
            if (typeof action.payload === 'number') {
                index = action.payload;
            }
            else {
                index = action.payload.index;
            }
            this.xfaNode.instanceManager.removeInstance(index);
        }
        else {
            super.removeItem(action);
        }
    }
}
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], InstanceManager.prototype, "maxOccur", null);
__decorate([
    (0, BaseNode_1.dependencyTracked)()
], InstanceManager.prototype, "minOccur", null);
exports.InstanceManager = InstanceManager;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Node.js":
/*!********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Node.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
class Node {
    constructor(inputModel) {
        this._jsonModel = Object.assign({}, inputModel);
    }
    getP(key, def) {
        return (0, JsonUtils_1.getProperty)(this._jsonModel, key, def);
    }
    get isContainer() {
        return false;
    }
}
exports["default"] = Node;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/Scriptable.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/Scriptable.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
const xfaEvents = ['click', 'xfaexit', 'xfaenter'];
const mappings = {
    'xfaexit': 'exit',
    'xfaenter': 'enter'
};
class Scriptable extends BaseNode_1.BaseNode {
    constructor() {
        super(...arguments);
        this._events = {};
        this._rules = {};
    }
    getRules() {
        return typeof this._jsonModel.rules !== 'object' ? {} : this._jsonModel.rules;
    }
    getCompiledRule(eName, rule) {
        if (!(eName in this._rules)) {
            const eString = rule || this.getRules()[eName];
            if (typeof eString === 'string' && eString.length > 0) {
                try {
                    let updatedRule = eString;
                    if (this.fragment !== '$form') {
                        updatedRule = eString.replaceAll('$form', this.fragment);
                    }
                    this._rules[eName] = this.ruleEngine.compileRule(updatedRule, this.lang);
                }
                catch (e) {
                    this.form.logger.error(`Unable to compile rule \`"${eName}" : "${eString}"\` Exception : ${e}`);
                }
            }
            else {
                throw new Error(`only expression strings are supported. ${typeof (eString)} types are not supported`);
            }
        }
        return this._rules[eName];
    }
    getCompiledEvent(eName) {
        var _a;
        if (!(eName in this._events)) {
            let eString = (_a = this._jsonModel.events) === null || _a === void 0 ? void 0 : _a[eName];
            if (typeof eString === 'string' && eString.length > 0) {
                eString = [eString];
            }
            if (typeof eString !== 'undefined' && eString.length > 0) {
                this._events[eName] = eString.map(x => {
                    try {
                        let updatedExpr = x;
                        if (this.fragment !== '$form') {
                            updatedExpr = x.replaceAll('$form', this.fragment);
                        }
                        return this.ruleEngine.compileRule(updatedExpr, this.lang);
                    }
                    catch (e) {
                        this.form.logger.error(`Unable to compile expression \`"${eName}" : "${eString}"\` Exception : ${e}`);
                    }
                    return null;
                }).filter(x => x !== null);
            }
        }
        return this._events[eName] || [];
    }
    applyUpdates(updates) {
        if (typeof updates === 'object') {
            if (updates !== null) {
                Object.entries(updates).forEach(([key, value]) => {
                    if (key in BaseNode_1.editableProperties || (key in this && typeof this[key] !== 'function')) {
                        try {
                            this[key] = value;
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                });
            }
        }
        else if (typeof updates !== 'undefined') {
            this.value = updates;
        }
    }
    executeAllRules(context) {
        const entries = Object.entries(this.getRules());
        if (entries.length > 0) {
            const scope = this.getExpressionScope();
            entries.forEach(([prop, rule]) => {
                const node = this.getCompiledRule(prop, rule);
                if (node) {
                    const newVal = this.ruleEngine.execute(node, scope, context, true, rule);
                    if (BaseNode_1.editableProperties.indexOf(prop) > -1) {
                        const oldAndNewValueAreEmpty = this.isEmpty() && this.isEmpty(newVal) && prop === 'value';
                        if (!oldAndNewValueAreEmpty) {
                            this[prop] = newVal;
                        }
                    }
                    else {
                        this.form.logger.warn(`${prop} is not a valid editable property.`);
                    }
                }
            });
        }
    }
    getExpressionScope() {
        const parent = this.getNonTransparentParent();
        const target = {
            self: this.getRuleNode(),
            siblings: (parent === null || parent === void 0 ? void 0 : parent.ruleNodeReference()) || {}
        };
        const scope = new Proxy(target, {
            get: (target, prop) => {
                if (prop === Symbol.toStringTag) {
                    return 'Object';
                }
                if (typeof prop === 'string' && prop.startsWith('$')) {
                    const retValue = target.self[prop];
                    if (retValue instanceof BaseNode_1.BaseNode) {
                        return retValue.getRuleNode();
                    }
                    else if (retValue instanceof Array) {
                        return retValue.map(r => r instanceof BaseNode_1.BaseNode ? r.getRuleNode() : r);
                    }
                    else {
                        return retValue;
                    }
                }
                else {
                    if (prop in target.siblings) {
                        return target.siblings[prop];
                    }
                    else {
                        return target.self[prop];
                    }
                }
            },
            has: (target, prop) => {
                prop = prop;
                const selfPropertyOrChild = target.self[prop];
                const sibling = target.siblings[prop];
                return typeof selfPropertyOrChild != 'undefined' || typeof sibling != 'undefined';
            }
        });
        return scope;
    }
    executeEvent(context, node, eString) {
        let updates;
        if (node) {
            updates = this.ruleEngine.execute(node, this.getExpressionScope(), context, false, eString);
        }
        if (typeof updates !== 'undefined' && updates != null) {
            this.applyUpdates(updates);
        }
    }
    executeRule(event, context) {
        if (typeof event.payload.ruleName === 'undefined') {
            this.executeAllRules(context);
        }
    }
    executeExpression(expr) {
        const ruleContext = {
            'form': this.form,
            '$form': this.form.getRuleNode(),
            '$field': this.getRuleNode(),
            'field': this
        };
        const node = this.ruleEngine.compileRule(expr, this.lang);
        return this.ruleEngine.execute(node, this.getExpressionScope(), ruleContext, false, expr);
    }
    change(event, context) {
        if (this.form.changeEventBehaviour === 'deps') {
            this.executeAllRules(context);
        }
    }
    executeAction(action) {
        var _a;
        if (this.xfaNode && xfaEvents.includes(action.type)) {
            const evntName = mappings[action.type] || action.type;
            const disabledEvents = this.properties['fd:disabledXfaScripts'] || [];
            if (disabledEvents.indexOf(evntName) === -1) {
                this.xfaNode.execEvent(evntName);
            }
        }
        const context = {
            'form': this.form,
            '$form': this.form.getRuleNode(),
            '$field': this.getRuleNode(),
            'field': this,
            '$event': {
                type: action.type,
                payload: action.payload,
                target: this.getRuleNode()
            }
        };
        const eventName = action.isCustomEvent ? `custom:${action.type}` : action.type;
        const funcName = action.isCustomEvent ? `custom_${action.type}` : action.type;
        const node = this.getCompiledEvent(eventName);
        const events = (_a = this._jsonModel.events) === null || _a === void 0 ? void 0 : _a[eventName];
        if (funcName in this && typeof this[funcName] === 'function') {
            this[funcName](action, context);
        }
        node.forEach((n, index) => {
            let eString = '';
            if (Array.isArray(events)) {
                eString = events[index];
            }
            else if (typeof events === 'string') {
                eString = events;
            }
            this.executeEvent(context, n, eString);
        });
        if (action.target === this) {
            this.notifyDependents(action);
        }
    }
}
exports["default"] = Scriptable;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/SubmitMetaData.js":
/*!******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/SubmitMetaData.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class SubmitMetaData {
    constructor(options = {}) {
        this.lang = options.lang || 'en';
        this.captchaInfo = options.captchaInfo || {};
        Object.keys(options).forEach(key => {
            if (key !== 'lang' && key !== 'captchaInfo') {
                this[key] = options[key];
            }
        });
    }
}
exports["default"] = SubmitMetaData;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/controller/EventQueue.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/controller/EventQueue.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Logger_1 = __webpack_require__(/*! ./Logger */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Logger.js");
class EventNode {
    constructor(_node, _event) {
        this._node = _node;
        this._event = _event;
    }
    get node() {
        return this._node;
    }
    get event() {
        return this._event;
    }
    isEqual(that) {
        return that !== null && that !== undefined && this._node == that._node && this._event.type == that._event.type;
    }
    toString() {
        return this._node.id + '__' + this.event.type;
    }
    valueOf() {
        return this.toString();
    }
}
class EventQueue {
    constructor(logger = new Logger_1.Logger('off')) {
        this.logger = logger;
        this._isProcessing = false;
        this._pendingEvents = [];
        this._runningEventCount = {};
    }
    get length() {
        return this._pendingEvents.length;
    }
    get isProcessing() {
        return this._isProcessing;
    }
    isQueued(node, event) {
        const evntNode = new EventNode(node, event);
        return this._pendingEvents.find(x => evntNode.isEqual(x)) !== undefined;
    }
    queue(node, events, priority = false) {
        if (!node || !events) {
            return;
        }
        if (!(events instanceof Array)) {
            events = [events];
        }
        events.forEach(e => {
            const evntNode = new EventNode(node, e);
            const counter = this._runningEventCount[evntNode.valueOf()] || 0;
            if (counter < EventQueue.MAX_EVENT_CYCLE_COUNT) {
                this.logger.info(`Queued event : ${e.type} node: ${node.id} - ${node.name}`);
                if (priority) {
                    const index = this._isProcessing ? 1 : 0;
                    this._pendingEvents.splice(index, 0, evntNode);
                }
                else {
                    this._pendingEvents.push(evntNode);
                }
                this._runningEventCount[evntNode.valueOf()] = counter + 1;
            }
            else {
                this.logger.info(`Skipped queueing event : ${e.type} node: ${node.id} - ${node.name} with count=${counter}`);
            }
        });
    }
    empty() {
        this._pendingEvents = [];
    }
    runPendingQueue() {
        if (this._isProcessing) {
            return;
        }
        this._isProcessing = true;
        while (this._pendingEvents.length > 0) {
            const e = this._pendingEvents[0];
            this.logger.info(`Dequeued event : ${e.event.type} node: ${e.node.id} - ${e.node.name}`);
            e.node.executeAction(e.event);
            this._pendingEvents.shift();
        }
        this._runningEventCount = {};
        this._isProcessing = false;
    }
}
EventQueue.MAX_EVENT_CYCLE_COUNT = 10;
exports["default"] = EventQueue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoveInstance = exports.AddInstance = exports.RemoveItem = exports.AddItem = exports.CustomEvent = exports.FieldChanged = exports.Reset = exports.SubmitError = exports.SubmitFailure = exports.SubmitSuccess = exports.Save = exports.Submit = exports.Focus = exports.ValidationComplete = exports.Blur = exports.Click = exports.FormLoad = exports.Initialize = exports.propertyChange = exports.ExecuteRule = exports.Valid = exports.Invalid = exports.UIChange = exports.Change = void 0;
var EventSource;
(function (EventSource) {
    EventSource["CODE"] = "code";
    EventSource["UI"] = "ui";
})(EventSource || (EventSource = {}));
class ActionImpl {
    constructor(payload, type, _metadata) {
        this._metadata = _metadata;
        this._payload = payload;
        this._type = type;
    }
    get type() {
        return this._type;
    }
    get payload() {
        return this._payload;
    }
    get metadata() {
        return this._metadata;
    }
    get target() {
        return this._target;
    }
    get currentTarget() {
        return this._currentTarget;
    }
    get isCustomEvent() {
        return false;
    }
    payloadToJson() {
        return this.payload;
    }
    toJson() {
        return {
            payload: this.payloadToJson(),
            type: this.type,
            isCustomEvent: this.isCustomEvent
        };
    }
    toString() {
        return JSON.stringify(this.toJson());
    }
}
class Change extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'change', { dispatch });
    }
    withAdditionalChange(change) {
        return new Change(this.payload.changes.concat(change.payload.changes), this.metadata);
    }
}
exports.Change = Change;
class UIChange extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'uiChange', { dispatch });
    }
}
exports.UIChange = UIChange;
class Invalid extends ActionImpl {
    constructor(payload = {}) {
        super(payload, 'invalid', {});
    }
}
exports.Invalid = Invalid;
class Valid extends ActionImpl {
    constructor(payload = {}) {
        super(payload, 'valid', {});
    }
}
exports.Valid = Valid;
class ExecuteRule extends ActionImpl {
    constructor(payload = {}, dispatch = false) {
        super(payload, 'executeRule', { dispatch });
    }
}
exports.ExecuteRule = ExecuteRule;
const propertyChange = (propertyName, currentValue, prevValue) => {
    return new Change({
        changes: [
            {
                propertyName,
                currentValue,
                prevValue
            }
        ]
    });
};
exports.propertyChange = propertyChange;
class Initialize extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'initialize', { dispatch });
    }
}
exports.Initialize = Initialize;
class FormLoad extends ActionImpl {
    constructor() {
        super({}, 'load', { dispatch: false });
    }
}
exports.FormLoad = FormLoad;
class Click extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'click', { dispatch });
    }
}
exports.Click = Click;
class Blur extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'blur', { dispatch });
    }
}
exports.Blur = Blur;
class ValidationComplete extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'validationComplete', { dispatch });
    }
}
exports.ValidationComplete = ValidationComplete;
class Focus extends ActionImpl {
    constructor() {
        super({}, 'focus', { dispatch: false });
    }
}
exports.Focus = Focus;
class Submit extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'submit', { dispatch });
    }
}
exports.Submit = Submit;
class Save extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'save', { dispatch });
    }
}
exports.Save = Save;
class SubmitSuccess extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'submitSuccess', { dispatch });
    }
}
exports.SubmitSuccess = SubmitSuccess;
class SubmitFailure extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'submitFailure', { dispatch });
    }
}
exports.SubmitFailure = SubmitFailure;
class SubmitError extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'submitError', { dispatch });
    }
}
exports.SubmitError = SubmitError;
class Reset extends ActionImpl {
    constructor(payload, dispatch = false) {
        super(payload, 'reset', { dispatch });
    }
}
exports.Reset = Reset;
class FieldChanged extends ActionImpl {
    constructor(changes, field, eventSource = EventSource.CODE) {
        super({
            field,
            changes,
            eventSource
        }, 'fieldChanged');
    }
}
exports.FieldChanged = FieldChanged;
class CustomEvent extends ActionImpl {
    constructor(eventName, payload = {}, dispatch = false) {
        super(payload, eventName, { dispatch });
    }
    get isCustomEvent() {
        return true;
    }
}
exports.CustomEvent = CustomEvent;
class AddItem extends ActionImpl {
    constructor(payload) {
        super(payload, 'addItem');
    }
}
exports.AddItem = AddItem;
class RemoveItem extends ActionImpl {
    constructor(payload) {
        super(payload, 'removeItem');
    }
}
exports.RemoveItem = RemoveItem;
class AddInstance extends ActionImpl {
    constructor(payload) {
        super(payload, 'addInstance');
    }
}
exports.AddInstance = AddInstance;
class RemoveInstance extends ActionImpl {
    constructor(payload) {
        super(payload, 'removeInstance');
    }
}
exports.RemoveInstance = RemoveInstance;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/controller/Logger.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/controller/Logger.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const levels = {
    off: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};
class Logger {
    constructor(logLevel = 'off') {
        this.logLevel = levels[logLevel];
    }
    debug(msg) {
        this.log(msg, 'debug');
    }
    info(msg) {
        this.log(msg, 'info');
    }
    warn(msg) {
        this.log(msg, 'warn');
    }
    error(msg) {
        this.log(msg, 'error');
    }
    log(msg, level) {
        if (this.logLevel !== 0 && this.logLevel <= levels[level]) {
            console[level](msg);
        }
    }
}
exports.Logger = Logger;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js":
/*!******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const DataValue_1 = __importDefault(__webpack_require__(/*! ./DataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataValue.js"));
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./EmptyDataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js"));
class DataGroup extends DataValue_1.default {
    constructor(_name, _value, _type = typeof _value, parent) {
        super(_name, _value, _type, parent);
        if (_value instanceof Array) {
            this.$_items = _value.map((value, index) => {
                return this.createEntry(index, value, this);
            });
        }
        else {
            this.$_items = Object.fromEntries(Object.entries(_value).map(([key, value]) => {
                return [key, this.createEntry(key, value, this)];
            }));
        }
    }
    createEntry(key, value, parent) {
        const t = Array.isArray(value) ? 'array' : typeof value;
        if (typeof value === 'object' && value != null) {
            return new DataGroup(key, value, t, parent);
        }
        else {
            return new DataValue_1.default(key, value, t, parent);
        }
    }
    get $value() {
        if (this.$type === 'array') {
            return Object.values(this.$_items).filter(x => typeof x !== 'undefined' && !x.disabled).map(x => x.$value);
        }
        else {
            return Object.fromEntries(Object.values(this.$_items).filter(x => typeof x !== 'undefined' && !x.disabled).map(x => {
                return [x.$name, x.$value];
            }));
        }
    }
    get $length() {
        return Object.entries(this.$_items).length;
    }
    $convertToDataValue() {
        return new DataValue_1.default(this.$name, this.$value, this.$type, this.parent);
    }
    syncDataAndFormModel(fromContainer) {
        this.$_fields.forEach(x => {
            if (fromContainer && fromContainer !== x) {
                x.syncDataAndFormModel(this);
            }
        });
    }
    $addDataNode(name, value, override = false, fromContainer = null) {
        if (value !== EmptyDataValue_1.default) {
            if (this.$type === 'array') {
                const index = name;
                if (!override) {
                    this.$_items.splice(index, 0, value);
                }
                else {
                    this.$_items[name] = value;
                }
                this.syncDataAndFormModel(fromContainer);
            }
            else {
                this.$_items[name] = value;
            }
            value.parent = this;
        }
    }
    $removeDataNode(name, fromContainer = null) {
        if (this.$type === 'array') {
            this.$_items.splice(name, 1);
            this.syncDataAndFormModel(fromContainer);
        }
        else {
            this.$_items[name] = undefined;
        }
    }
    $getDataNode(name) {
        if (this.$_items.hasOwnProperty(name)) {
            return this.$_items[name];
        }
    }
    $containsDataNode(name) {
        return this.$_items.hasOwnProperty(name) && typeof (this.$_items[name]) !== 'undefined';
    }
    get $isDataGroup() {
        return true;
    }
}
exports["default"] = DataGroup;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/data/DataValue.js":
/*!******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/data/DataValue.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonUtils_1 = __webpack_require__(/*! ../utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
class DataValue {
    constructor($_name, $_value, $_type = typeof $_value, parent) {
        this.$_name = $_name;
        this.$_value = $_value;
        this.$_type = $_type;
        this.$_fields = [];
        this.parent = parent;
    }
    valueOf() {
        return this.$_value;
    }
    get $name() {
        return this.$_name;
    }
    get disabled() {
        const enabled = this.$_fields.find(x => x.enabled !== false);
        return (!enabled && this.$_fields.length);
    }
    get $value() {
        const formInFileInput = this.$_fields.find(x => {
            if ((0, JsonUtils_1.isFile)(x)) {
                return x;
            }
        });
        if (formInFileInput && (this.$_fields.every(_ => ['string', 'string[]'].includes(_.type)))) {
            const attachmentMap = formInFileInput.form._exportDataAttachmentMap;
            if (attachmentMap && attachmentMap[formInFileInput.id]) {
                const attachment = attachmentMap[formInFileInput.id];
                if (Array.isArray(attachment)) {
                    return attachment.map(item => item.data);
                }
                else {
                    return attachment.data;
                }
            }
        }
        return this.$_value;
    }
    setValue(typedValue, originalValue, fromField) {
        this.$_value = typedValue;
        this.$_fields.forEach(x => {
            if (fromField !== x) {
                x.value = originalValue;
            }
        });
    }
    get $type() {
        return this.$_type;
    }
    $bindToField(field) {
        if (this.$_fields.indexOf(field) === -1) {
            this.$_fields.push(field);
        }
    }
    $convertToDataValue() {
        return this;
    }
    get $isDataGroup() {
        return false;
    }
    $addDataNode(name, value, override = false) {
        throw 'add Data Node is called on a data value';
    }
}
exports["default"] = DataValue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/data/EmptyDataValue.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const DataValue_1 = __importDefault(__webpack_require__(/*! ./DataValue */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataValue.js"));
const value = Symbol('NullValue');
class NullDataValueClass extends DataValue_1.default {
    constructor() {
        super('', value, 'null');
    }
    setValue() {
    }
    $bindToField() {
    }
    $length() {
        return 0;
    }
    $convertToDataValue() {
        return this;
    }
    $addDataNode() {
    }
    $removeDataNode() {
    }
    $getDataNode() {
        return this;
    }
    $containsDataNode() {
        return false;
    }
}
const NullDataValue = new NullDataValueClass();
exports["default"] = NullDataValue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Captcha = exports.EmailInput = exports.SubmitMetaData = exports.isEmpty = exports.request = exports.FunctionRuntime = exports.readAttachments = exports.extractFileInfo = exports.getFileSizeInBytes = exports.Scriptable = exports.Node = exports.FormMetaData = exports.FileUpload = exports.FileObject = exports.Fieldset = exports.Field = exports.Container = exports.CheckboxGroup = exports.Checkbox = exports.BaseNode = exports.Form = void 0;
__exportStar(__webpack_require__(/*! ./FormInstance */ "./node_modules/@aemforms/af-core-xfa/lib/FormInstance.js"), exports);
__exportStar(__webpack_require__(/*! ./types/index */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js"), exports);
__exportStar(__webpack_require__(/*! ./controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/TranslationUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/TranslationUtils.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/SchemaUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/SchemaUtils.js"), exports);
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
Object.defineProperty(exports, "getFileSizeInBytes", ({ enumerable: true, get: function () { return FormUtils_1.getFileSizeInBytes; } }));
Object.defineProperty(exports, "extractFileInfo", ({ enumerable: true, get: function () { return FormUtils_1.extractFileInfo; } }));
Object.defineProperty(exports, "isEmpty", ({ enumerable: true, get: function () { return FormUtils_1.isEmpty; } }));
Object.defineProperty(exports, "readAttachments", ({ enumerable: true, get: function () { return FormUtils_1.readAttachments; } }));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core-xfa/lib/BaseNode.js");
Object.defineProperty(exports, "BaseNode", ({ enumerable: true, get: function () { return BaseNode_1.BaseNode; } }));
const Checkbox_1 = __importDefault(__webpack_require__(/*! ./Checkbox */ "./node_modules/@aemforms/af-core-xfa/lib/Checkbox.js"));
exports.Checkbox = Checkbox_1.default;
const CheckboxGroup_1 = __importDefault(__webpack_require__(/*! ./CheckboxGroup */ "./node_modules/@aemforms/af-core-xfa/lib/CheckboxGroup.js"));
exports.CheckboxGroup = CheckboxGroup_1.default;
const EmailInput_1 = __importDefault(__webpack_require__(/*! ./EmailInput */ "./node_modules/@aemforms/af-core-xfa/lib/EmailInput.js"));
exports.EmailInput = EmailInput_1.default;
const Captcha_1 = __importDefault(__webpack_require__(/*! ./Captcha */ "./node_modules/@aemforms/af-core-xfa/lib/Captcha.js"));
exports.Captcha = Captcha_1.default;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core-xfa/lib/Container.js"));
exports.Container = Container_1.default;
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
exports.Field = Field_1.default;
const Fieldset_1 = __webpack_require__(/*! ./Fieldset */ "./node_modules/@aemforms/af-core-xfa/lib/Fieldset.js");
Object.defineProperty(exports, "Fieldset", ({ enumerable: true, get: function () { return Fieldset_1.Fieldset; } }));
const FileObject_1 = __webpack_require__(/*! ./FileObject */ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js");
Object.defineProperty(exports, "FileObject", ({ enumerable: true, get: function () { return FileObject_1.FileObject; } }));
const FileUpload_1 = __importDefault(__webpack_require__(/*! ./FileUpload */ "./node_modules/@aemforms/af-core-xfa/lib/FileUpload.js"));
exports.FileUpload = FileUpload_1.default;
const FormMetaData_1 = __importDefault(__webpack_require__(/*! ./FormMetaData */ "./node_modules/@aemforms/af-core-xfa/lib/FormMetaData.js"));
exports.FormMetaData = FormMetaData_1.default;
const SubmitMetaData_1 = __importDefault(__webpack_require__(/*! ./SubmitMetaData */ "./node_modules/@aemforms/af-core-xfa/lib/SubmitMetaData.js"));
exports.SubmitMetaData = SubmitMetaData_1.default;
const Node_1 = __importDefault(__webpack_require__(/*! ./Node */ "./node_modules/@aemforms/af-core-xfa/lib/Node.js"));
exports.Node = Node_1.default;
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core-xfa/lib/Scriptable.js"));
exports.Scriptable = Scriptable_1.default;
const Form_1 = __importDefault(__webpack_require__(/*! ./Form */ "./node_modules/@aemforms/af-core-xfa/lib/Form.js"));
exports.Form = Form_1.default;
const FunctionRuntime_1 = __webpack_require__(/*! ./rules/FunctionRuntime */ "./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js");
Object.defineProperty(exports, "FunctionRuntime", ({ enumerable: true, get: function () { return FunctionRuntime_1.FunctionRuntime; } }));
Object.defineProperty(exports, "request", ({ enumerable: true, get: function () { return FunctionRuntime_1.request; } }));


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FunctionRuntime = exports.submit = exports.request = void 0;
const Events_1 = __webpack_require__(/*! ../controller/Events */ "./node_modules/@aemforms/af-core-xfa/lib/controller/Events.js");
const Fetch_1 = __webpack_require__(/*! ../utils/Fetch */ "./node_modules/@aemforms/af-core-xfa/lib/utils/Fetch.js");
const FileObject_1 = __webpack_require__(/*! ../FileObject */ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js");
const FormUtils_1 = __webpack_require__(/*! ../utils/FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const JsonUtils_1 = __webpack_require__(/*! ../utils/JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
const types_1 = __webpack_require__(/*! ../types */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
const getCustomEventName = (name) => {
    const eName = name;
    if (eName.length > 0 && eName.startsWith('custom:')) {
        return eName.substring('custom:'.length);
    }
    return eName;
};
const request = (context, uri, httpVerb, payload, success, error, headers) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const endpoint = uri;
    const requestOptions = {
        method: httpVerb
    };
    let inputPayload;
    if (payload && payload instanceof FileObject_1.FileObject && payload.data instanceof File) {
        const formData = new FormData();
        formData.append(payload.name, payload.data);
        inputPayload = formData;
    }
    else if (payload instanceof FormData) {
        inputPayload = payload;
    }
    else if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
        const headerNames = Object.keys(headers);
        if (headerNames.length > 0) {
            requestOptions.headers = Object.assign(Object.assign({}, headers), (headerNames.indexOf('Content-Type') === -1 ? { 'Content-Type': 'application/json' } : {}));
        }
        else {
            requestOptions.headers = { 'Content-Type': 'application/json' };
        }
        const contentType = ((_a = requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.headers) === null || _a === void 0 ? void 0 : _a['Content-Type']) || 'application/json';
        if (contentType === 'application/json') {
            inputPayload = JSON.stringify(payload);
        }
        else if (contentType.indexOf('multipart/form-data') > -1) {
            inputPayload = multipartFormData(payload);
        }
        else if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
            inputPayload = urlEncoded(payload);
        }
    }
    const result = yield (0, Fetch_1.request)(endpoint, inputPayload, requestOptions);
    if ((result === null || result === void 0 ? void 0 : result.status) >= 200 && (result === null || result === void 0 ? void 0 : result.status) <= 299) {
        const eName = getCustomEventName(success);
        if (success === 'submitSuccess') {
            context.form.dispatch(new Events_1.SubmitSuccess(result, true));
        }
        else {
            context.form.dispatch(new Events_1.CustomEvent(eName, result, true));
        }
    }
    else {
        context.form.logger.error('Error invoking a rest API');
        const eName = getCustomEventName(error);
        if (error === 'submitError') {
            context.form.dispatch(new Events_1.SubmitError(result, true));
            context.form.dispatch(new Events_1.SubmitFailure(result, true));
        }
        else {
            context.form.dispatch(new Events_1.CustomEvent(eName, result, true));
        }
    }
});
exports.request = request;
const urlEncoded = (data) => {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
        if (value != null && typeof value === 'object') {
            formData.append(key, (0, JsonUtils_1.jsonString)(value));
        }
        else {
            formData.append(key, value);
        }
    });
    return formData;
};
const submit = (context, success, error, submitAs = 'multipart/form-data', input_data = null, action = '', metadata = null) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = action || context.form.action;
    let data = input_data;
    const attachments = yield (0, FormUtils_1.readAttachments)(context.form, true);
    if (typeof data != 'object' || data == null) {
        data = context.form.exportData(attachments);
    }
    let submitContentType = submitAs;
    const submitDataAndMetaData = Object.assign({ 'data': data }, metadata);
    let formData = submitDataAndMetaData;
    if (Object.keys(attachments).length > 0 || submitAs === 'multipart/form-data') {
        formData = multipartFormData(submitDataAndMetaData, attachments);
        submitContentType = 'multipart/form-data';
    }
    yield (0, exports.request)(context, endpoint, 'POST', formData, success, error, {
        'Content-Type': submitContentType
    });
});
exports.submit = submit;
const multipartFormData = (data, attachments) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value != null && typeof value === 'object') {
            formData.append(key, (0, JsonUtils_1.jsonString)(value));
        }
        else {
            formData.append(key, value);
        }
    });
    const addAttachmentToFormData = (objValue, formData) => {
        if ((objValue === null || objValue === void 0 ? void 0 : objValue.data) instanceof File) {
            let attIdentifier = `${objValue === null || objValue === void 0 ? void 0 : objValue.dataRef}/${objValue === null || objValue === void 0 ? void 0 : objValue.name}`;
            if (!attIdentifier.startsWith('/')) {
                attIdentifier = `/${attIdentifier}`;
            }
            formData.append(attIdentifier, objValue.data);
        }
    };
    if (attachments) {
        Object.keys(attachments).reduce((acc, curr) => {
            const objValue = attachments[curr];
            if (objValue && objValue instanceof Array) {
                return [...acc, ...objValue.map((x) => addAttachmentToFormData(x, formData))];
            }
            else {
                return [...acc, addAttachmentToFormData(objValue, formData)];
            }
        }, []);
    }
    return formData;
};
const createAction = (name, payload = {}, dispatch = false) => {
    switch (name) {
        case 'change':
            return new Events_1.Change(payload);
        case 'submit':
            return new Events_1.Submit(payload);
        case 'save':
            return new Events_1.Save(payload);
        case 'click':
            return new Events_1.Click(payload);
        case 'addItem':
            return new Events_1.AddItem(payload);
        case 'removeItem':
            return new Events_1.RemoveItem(payload);
        case 'reset':
            return new Events_1.Reset(payload);
        case 'addInstance':
            return new Events_1.AddInstance(payload);
        case 'removeInstance':
            return new Events_1.RemoveInstance(payload);
        case 'invalid':
            return new Events_1.Invalid(payload);
        case 'valid':
            return new Events_1.Valid(payload);
        case 'initialize':
            return new Events_1.Initialize(payload);
        default:
            console.error('invalid action');
    }
};
class FunctionRuntimeImpl {
    constructor() {
        this.customFunctions = {};
    }
    static getInstance() {
        if (!FunctionRuntimeImpl.instance) {
            FunctionRuntimeImpl.instance = new FunctionRuntimeImpl();
        }
        return FunctionRuntimeImpl.instance;
    }
    registerFunctions(functions) {
        Object.entries(functions).forEach(([name, funcDef]) => {
            let finalFunction = funcDef;
            if (typeof funcDef === 'function') {
                finalFunction = {
                    _func: (args, data, interpreter) => {
                        const globals = {
                            form: interpreter.globals.$form,
                            field: interpreter.globals.$field,
                            event: interpreter.globals.$event,
                            functions: {
                                setProperty: (target, payload) => {
                                    const eventName = 'custom:setProperty';
                                    const args = [target, eventName, payload];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().dispatchEvent._func.call(undefined, args, data, interpreter);
                                },
                                reset: (target) => {
                                    const eventName = 'reset';
                                    target = target || 'reset';
                                    const args = [target, eventName];
                                    interpreter.globals.form.logger.warn('This usage of reset is deprecated. Please see the documentation and update.');
                                    return FunctionRuntimeImpl.getInstance().getFunctions().dispatchEvent._func.call(undefined, args, data, interpreter);
                                },
                                validate: (target) => {
                                    const args = [target];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().validate._func.call(undefined, args, data, interpreter);
                                },
                                importData: (inputData, qualifiedName) => {
                                    const args = [inputData, qualifiedName];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().importData._func.call(undefined, args, data, interpreter);
                                },
                                exportData: () => {
                                    return FunctionRuntimeImpl.getInstance().getFunctions().exportData._func.call(undefined, args, data, interpreter);
                                },
                                submitForm: (payload, validateForm, contentType) => {
                                    const submitAs = contentType || 'multipart/form-data';
                                    const args = [payload, validateForm, submitAs];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().submitForm._func.call(undefined, args, data, interpreter);
                                },
                                markFieldAsInvalid: (fieldIdentifier, validationMessage, option) => {
                                    var _a, _b;
                                    if (!option || option.useId) {
                                        (_a = interpreter.globals.form.getElement(fieldIdentifier)) === null || _a === void 0 ? void 0 : _a.markAsInvalid(validationMessage);
                                    }
                                    else if (option && option.useDataRef) {
                                        interpreter.globals.form.visit(function callback(f) {
                                            if (f.dataRef === fieldIdentifier) {
                                                f.markAsInvalid(validationMessage);
                                            }
                                        });
                                    }
                                    else if (option && option.useQualifiedName) {
                                        (_b = interpreter.globals.form.resolveQualifiedName(fieldIdentifier)) === null || _b === void 0 ? void 0 : _b.markAsInvalid(validationMessage);
                                    }
                                },
                                setFocus: (target, flag) => {
                                    const args = [target, flag];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().setFocus._func.call(undefined, args, data, interpreter);
                                },
                                dispatchEvent: (target, eventName, payload, dispatch) => {
                                    const args = [target, eventName, payload, dispatch];
                                    return FunctionRuntimeImpl.getInstance().getFunctions().dispatchEvent._func.call(undefined, args, data, interpreter);
                                },
                                getFiles: (qualifiedName) => {
                                    const filesMap = {};
                                    if (!qualifiedName) {
                                        interpreter.globals.form.visit(function callback(f) {
                                            if (f.fieldType === 'file-input' && f.value) {
                                                filesMap[f.qualifiedName] = f.serialize();
                                            }
                                        });
                                    }
                                    const field = interpreter.globals.form.resolveQualifiedName(qualifiedName);
                                    if ((field === null || field === void 0 ? void 0 : field.fieldType) === 'file-input' && (field === null || field === void 0 ? void 0 : field.value)) {
                                        filesMap[qualifiedName] = field.serialize();
                                    }
                                    return filesMap;
                                }
                            }
                        };
                        return funcDef(...args, globals);
                    },
                    _signature: []
                };
            }
            if (!finalFunction.hasOwnProperty('_func')) {
                console.warn(`Unable to register function with name ${name}.`);
                return;
            }
            FunctionRuntimeImpl.getInstance().customFunctions[name] = finalFunction;
        });
    }
    unregisterFunctions(...names) {
        names.forEach(name => {
            if (name in FunctionRuntimeImpl.getInstance().customFunctions) {
                FunctionRuntimeImpl === null || FunctionRuntimeImpl === void 0 ? true : delete FunctionRuntimeImpl.getInstance().customFunctions[name];
            }
        });
    }
    getFunctions() {
        function isArray(obj) {
            if (obj !== null) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
            return false;
        }
        function valueOf(a) {
            if (a === null || a === undefined) {
                return a;
            }
            if (isArray(a)) {
                return a.map(i => valueOf(i));
            }
            return a.valueOf();
        }
        function toString(a) {
            if (a === null || a === undefined) {
                return '';
            }
            return a.toString();
        }
        const defaultFunctions = {
            validate: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    let validation;
                    if (typeof element === 'string' || typeof element === 'undefined') {
                        validation = interpreter.globals.form.validate();
                    }
                    else {
                        validation = interpreter.globals.form.getElement(element.$id).validate();
                    }
                    if (Array.isArray(validation) && validation.length) {
                        interpreter.globals.form.logger.warn('Form Validation Error');
                    }
                    return validation;
                },
                _signature: []
            },
            setFocus: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    const flag = args[1];
                    try {
                        const field = interpreter.globals.form.getElement(element === null || element === void 0 ? void 0 : element.$id) || interpreter.globals.field;
                        interpreter.globals.form.setFocus(field, flag);
                    }
                    catch (e) {
                        interpreter.globals.form.logger.error('An error has occurred within the setFocus API.');
                    }
                },
                _signature: []
            },
            getData: {
                _func: (args, data, interpreter) => {
                    interpreter.globals.form.logger.warn('The `getData` function is depricated. Use `exportData` instead.');
                    return interpreter.globals.form.exportData();
                },
                _signature: []
            },
            exportData: {
                _func: (args, data, interpreter) => {
                    return interpreter.globals.form.exportData();
                },
                _signature: []
            },
            importData: {
                _func: (args, data, interpreter) => {
                    const inputData = args[0];
                    const qualifiedName = args[1];
                    if (typeof inputData === 'object' && inputData !== null && !qualifiedName) {
                        interpreter.globals.form.importData(inputData);
                    }
                    else {
                        const field = interpreter.globals.form.resolveQualifiedName(qualifiedName);
                        if (field === null || field === void 0 ? void 0 : field.isContainer) {
                            field.importData(inputData, qualifiedName);
                        }
                        else {
                            interpreter.globals.form.logger.error('Invalid argument passed in importData. A container is expected');
                        }
                    }
                    return {};
                },
                _signature: []
            },
            submitForm: {
                _func: (args, data, interpreter) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    let success = null;
                    let error = null;
                    let submit_data;
                    let validate_form;
                    let submit_as;
                    if (args.length > 0 && typeof valueOf(args[0]) === 'object') {
                        submit_data = args.length > 0 ? valueOf(args[0]) : null;
                        validate_form = args.length > 1 ? valueOf(args[1]) : true;
                        submit_as = args.length > 2 ? toString(args[2]) : 'multipart/form-data';
                    }
                    else {
                        interpreter.globals.form.logger.warn('This usage of submitForm is deprecated. Please see the documentation and update');
                        success = toString(args[0]);
                        error = toString(args[1]);
                        submit_as = args.length > 2 ? toString(args[2]) : 'multipart/form-data';
                        submit_data = args.length > 3 ? valueOf(args[3]) : null;
                        validate_form = args.length > 4 ? valueOf(args[4]) : true;
                    }
                    const form = interpreter.globals.form;
                    if (form.captcha && (form.captcha.captchaDisplayMode === types_1.CaptchaDisplayMode.INVISIBLE ||
                        (((_b = (_a = form.captcha.properties['fd:captcha']) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.version) === 'enterprise' && ((_d = (_c = form.captcha.properties['fd:captcha']) === null || _c === void 0 ? void 0 : _c.config) === null || _d === void 0 ? void 0 : _d.keyType) === 'score'))) {
                        if (typeof ((_e = interpreter.runtime.functionTable.fetchCaptchaToken) === null || _e === void 0 ? void 0 : _e._func) !== 'function') {
                            interpreter.globals.form.logger.error('fetchCaptchaToken is not defined');
                            interpreter.globals.form.dispatch(new Events_1.SubmitError({ type: 'FetchCaptchaTokenNotDefined' }));
                            return {};
                        }
                        try {
                            const token = yield interpreter.runtime.functionTable.fetchCaptchaToken._func([], data, interpreter);
                            form.captcha.value = token;
                        }
                        catch (e) {
                            interpreter.globals.form.logger.error('Error while fetching captcha token');
                            interpreter.globals.form.dispatch(new Events_1.SubmitError({ type: 'FetchCaptchaTokenFailed' }));
                            return {};
                        }
                    }
                    interpreter.globals.form.dispatch(new Events_1.Submit({
                        success,
                        error,
                        submit_as,
                        validate_form: validate_form,
                        data: submit_data
                    }));
                    return {};
                }),
                _signature: []
            },
            saveForm: {
                _func: (args, data, interpreter) => {
                    const action = toString(args[0]);
                    const validate_form = args[2] || false;
                    interpreter.globals.form.dispatch(new Events_1.Save({
                        action,
                        validate_form
                    }));
                    return {};
                },
                _signature: []
            },
            request: {
                _func: (args, data, interpreter) => {
                    const uri = toString(args[0]);
                    const httpVerb = toString(args[1]);
                    const payload = valueOf(args[2]);
                    let success, error, headers = {};
                    if (typeof (args[3]) === 'string') {
                        interpreter.globals.form.logger.warn('This usage of request is deprecated. Please see the documentation and update');
                        success = valueOf(args[3]);
                        error = valueOf(args[4]);
                    }
                    else {
                        headers = valueOf(args[3]);
                        success = valueOf(args[4]);
                        error = valueOf(args[5]);
                    }
                    (0, exports.request)(interpreter.globals, uri, httpVerb, payload, success, error, headers);
                    return {};
                },
                _signature: []
            },
            awaitFn: {
                _func: (args, data, interpreter) => __awaiter(this, void 0, void 0, function* () {
                    const success = args[1];
                    const currentField = interpreter.globals.$field;
                    try {
                        const result = yield args[0];
                        defaultFunctions.dispatchEvent._func([currentField, success, result], data, interpreter);
                    }
                    catch (err) {
                        const error = args[2];
                        if (error) {
                            defaultFunctions.dispatchEvent._func([currentField, error, err], data, interpreter);
                        }
                    }
                    return {};
                }),
                _signature: []
            },
            addInstance: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    const payload = args.length > 2 ? valueOf(args[2]) : undefined;
                    try {
                        const formElement = interpreter.globals.form.getElement(element.$id);
                        const action = createAction('addInstance', payload);
                        formElement.addItem(action);
                    }
                    catch (e) {
                        interpreter.globals.form.logger.error('Invalid argument passed in addInstance. An element is expected');
                    }
                },
                _signature: []
            },
            removeInstance: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    const payload = args.length > 2 ? valueOf(args[2]) : undefined;
                    try {
                        const formElement = interpreter.globals.form.getElement(element.$id);
                        const action = createAction('removeInstance', payload);
                        formElement.removeItem(action);
                    }
                    catch (e) {
                        interpreter.globals.form.logger.error('Invalid argument passed in removeInstance. An element is expected');
                    }
                },
                _signature: []
            },
            dispatchEvent: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    if (element === null && typeof interpreter !== 'string') {
                        interpreter.debug.push('Invalid argument passed in dispatchEvent. An element is expected');
                        return {};
                    }
                    let eventName = valueOf(args[1]);
                    let payload = args.length > 2 ? valueOf(args[2]) : undefined;
                    let dispatch = args.length > 3 ? valueOf(args[3]) : false;
                    if (typeof element === 'string') {
                        payload = eventName;
                        eventName = element;
                        dispatch = true;
                    }
                    let event;
                    if (eventName.startsWith('custom:')) {
                        event = new Events_1.CustomEvent(eventName.substring('custom:'.length), payload, dispatch);
                    }
                    else {
                        event = createAction(eventName, payload, dispatch);
                    }
                    if (event != null) {
                        if (typeof element === 'string') {
                            interpreter.globals.form.dispatch(event);
                        }
                        else {
                            const dispatchEventOnElement = (element, event, interpreter) => {
                                interpreter.globals.form.getElement(element.$id).dispatch(event);
                            };
                            if (Array.isArray(element) && element.length > 0 && typeof element.$id === 'undefined') {
                                element.forEach(el => {
                                    dispatchEventOnElement(el, event, interpreter);
                                });
                            }
                            else {
                                dispatchEventOnElement(element, event, interpreter);
                            }
                        }
                    }
                    return {};
                },
                _signature: []
            }
        };
        return Object.assign(Object.assign({}, defaultFunctions), FunctionRuntimeImpl.getInstance().customFunctions);
    }
}
FunctionRuntimeImpl.instance = null;
exports.FunctionRuntime = FunctionRuntimeImpl.getInstance();


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/rules/RuleEngine.js":
/*!********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/rules/RuleEngine.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const json_formula_1 = __importDefault(__webpack_require__(/*! @adobe/json-formula */ "./node_modules/@adobe/json-formula/src/json-formula.js"));
const FunctionRuntime_1 = __webpack_require__(/*! ./FunctionRuntime */ "./node_modules/@aemforms/af-core-xfa/lib/rules/FunctionRuntime.js");
const CoercionUtils_1 = __webpack_require__(/*! ../utils/CoercionUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/CoercionUtils.js");
function getStringToNumberFn(locale) {
    if (locale == null) {
        const localeOptions = new Intl.DateTimeFormat().resolvedOptions();
        locale = localeOptions.locale;
    }
    return (str) => (0, CoercionUtils_1.stringToNumber)(str, locale);
}
class RuleEngine {
    constructor() {
        this._globalNames = [
            '$form',
            '$field',
            '$event'
        ];
        this.debugInfo = [];
        this.customFunctions = FunctionRuntime_1.FunctionRuntime.getFunctions();
    }
    compileRule(rule, locale) {
        const formula = new json_formula_1.default(this.customFunctions, getStringToNumberFn(locale), this.debugInfo);
        return { formula, ast: formula.compile(rule, this._globalNames) };
    }
    execute(node, data, globals, useValueOf = false, eString) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const { formula, ast } = node;
        const oldContext = this._context;
        this._context = globals;
        let res = undefined;
        try {
            res = formula.run(ast, data, 'en-US', globals);
        }
        catch (err) {
            (_c = (_b = (_a = this._context) === null || _a === void 0 ? void 0 : _a.form) === null || _b === void 0 ? void 0 : _b.logger) === null || _c === void 0 ? void 0 : _c.error(err);
        }
        if (this.debugInfo.length) {
            (_f = (_e = (_d = this._context) === null || _d === void 0 ? void 0 : _d.form) === null || _e === void 0 ? void 0 : _e.logger) === null || _f === void 0 ? void 0 : _f.warn(`Form rule expression string: ${eString}`);
            while (this.debugInfo.length > 0) {
                (_j = (_h = (_g = this._context) === null || _g === void 0 ? void 0 : _g.form) === null || _h === void 0 ? void 0 : _h.logger) === null || _j === void 0 ? void 0 : _j.warn(this.debugInfo.pop());
            }
        }
        let finalRes = res;
        if (useValueOf) {
            if (typeof res === 'object' && res !== null) {
                finalRes = Object.getPrototypeOf(res).valueOf.call(res);
            }
        }
        this._context = oldContext;
        return finalRes;
    }
    trackDependency(subscriber) {
        if (this._context && this._context.field !== undefined && this._context.field !== subscriber) {
            subscriber._addDependent(this._context.field);
        }
    }
}
exports["default"] = RuleEngine;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/types/Json.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/types/Json.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConstraintTypeMessages = exports.setCustomDefaultConstraintTypeMessages = exports.constraintKeys = exports.ConstraintType = exports.constraintProps = exports.translationProps = void 0;
exports.translationProps = ['description', 'placeholder', 'enum', 'enumNames', 'label.value', 'constraintMessages.accept',
    'constraintMessages.enum', 'constraintMessages.exclusiveMinimum', 'constraintMessages.exclusiveMaximum', 'constraintMessages.format', 'constraintMessages.maxFileSize', 'constraintMessages.maxLength',
    'constraintMessages.maximum', 'constraintMessages.maxItems', 'constraintMessages.minLength', 'constraintMessages.minimum', 'constraintMessages.minItems', 'constraintMessages.pattern', 'constraintMessages.required',
    'constraintMessages.step', 'constraintMessages.type', 'constraintMessages.validationExpression'];
exports.constraintProps = ['accept', 'enum', 'exclusiveMinimum', 'exclusiveMaximum',
    'format', 'maxFileSize', 'maxLength', 'maximum', 'maxItems',
    'minLength', 'minimum', 'minItems', 'pattern', 'required', 'step', 'validationExpression', 'enumNames'];
exports.ConstraintType = Object.freeze({
    PATTERN_MISMATCH: 'patternMismatch',
    TOO_SHORT: 'tooShort',
    TOO_LONG: 'tooLong',
    RANGE_OVERFLOW: 'rangeOverflow',
    RANGE_UNDERFLOW: 'rangeUnderflow',
    TYPE_MISMATCH: 'typeMismatch',
    VALUE_MISSING: 'valueMissing',
    STEP_MISMATCH: 'stepMismatch',
    FORMAT_MISMATCH: 'formatMismatch',
    ACCEPT_MISMATCH: 'acceptMismatch',
    FILE_SIZE_MISMATCH: 'fileSizeMismatch',
    UNIQUE_ITEMS_MISMATCH: 'uniqueItemsMismatch',
    MIN_ITEMS_MISMATCH: 'minItemsMismatch',
    MAX_ITEMS_MISMATCH: 'maxItemsMismatch',
    EXPRESSION_MISMATCH: 'expressionMismatch',
    EXCLUSIVE_MAXIMUM_MISMATCH: 'exclusiveMaximumMismatch',
    EXCLUSIVE_MINIMUM_MISMATCH: 'exclusiveMinimumMismatch'
});
exports.constraintKeys = Object.freeze({
    pattern: exports.ConstraintType.PATTERN_MISMATCH,
    minLength: exports.ConstraintType.TOO_SHORT,
    maxLength: exports.ConstraintType.TOO_LONG,
    maximum: exports.ConstraintType.RANGE_OVERFLOW,
    minimum: exports.ConstraintType.RANGE_UNDERFLOW,
    type: exports.ConstraintType.TYPE_MISMATCH,
    required: exports.ConstraintType.VALUE_MISSING,
    step: exports.ConstraintType.STEP_MISMATCH,
    format: exports.ConstraintType.FORMAT_MISMATCH,
    accept: exports.ConstraintType.ACCEPT_MISMATCH,
    maxFileSize: exports.ConstraintType.FILE_SIZE_MISMATCH,
    uniqueItems: exports.ConstraintType.UNIQUE_ITEMS_MISMATCH,
    minItems: exports.ConstraintType.MIN_ITEMS_MISMATCH,
    maxItems: exports.ConstraintType.MAX_ITEMS_MISMATCH,
    validationExpression: exports.ConstraintType.EXPRESSION_MISMATCH,
    exclusiveMinimum: exports.ConstraintType.EXCLUSIVE_MINIMUM_MISMATCH,
    exclusiveMaximum: exports.ConstraintType.EXCLUSIVE_MAXIMUM_MISMATCH
});
const defaultConstraintTypeMessages = Object.freeze({
    [exports.ConstraintType.PATTERN_MISMATCH]: 'Please match the format requested.',
    [exports.ConstraintType.TOO_SHORT]: 'Please lengthen this text to ${0} characters or more.',
    [exports.ConstraintType.TOO_LONG]: 'Please shorten this text to ${0} characters or less.',
    [exports.ConstraintType.RANGE_OVERFLOW]: 'Value must be less than or equal to ${0}.',
    [exports.ConstraintType.RANGE_UNDERFLOW]: 'Value must be greater than or equal to ${0}.',
    [exports.ConstraintType.TYPE_MISMATCH]: 'Please enter a valid value.',
    [exports.ConstraintType.VALUE_MISSING]: 'Please fill in this field.',
    [exports.ConstraintType.STEP_MISMATCH]: 'Please enter a valid value.',
    [exports.ConstraintType.FORMAT_MISMATCH]: 'Specify the value in allowed format : ${0}.',
    [exports.ConstraintType.ACCEPT_MISMATCH]: 'The specified file type not supported.',
    [exports.ConstraintType.FILE_SIZE_MISMATCH]: 'File too large. Reduce size and try again.',
    [exports.ConstraintType.UNIQUE_ITEMS_MISMATCH]: 'All the items must be unique.',
    [exports.ConstraintType.MIN_ITEMS_MISMATCH]: 'Specify a number of items equal to or greater than ${0}.',
    [exports.ConstraintType.MAX_ITEMS_MISMATCH]: 'Specify a number of items equal to or less than ${0}.',
    [exports.ConstraintType.EXPRESSION_MISMATCH]: 'Please enter a valid value.',
    [exports.ConstraintType.EXCLUSIVE_MINIMUM_MISMATCH]: 'Value must be greater than ${0}.',
    [exports.ConstraintType.EXCLUSIVE_MAXIMUM_MISMATCH]: 'Value must be less than ${0}.'
});
const transformObjectKeys = (obj, transformer) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => transformObjectKeys(item, transformer));
    }
    return Object.keys(obj).reduce((transformedObj, key) => {
        const transformedKey = transformer(key);
        const value = obj[key];
        transformedObj[transformedKey] = transformObjectKeys(value, transformer);
        return transformedObj;
    }, {});
};
let customConstraintTypeMessages = {};
const setCustomDefaultConstraintTypeMessages = (messages) => {
    customConstraintTypeMessages = transformObjectKeys(messages, (key) => {
        return exports.constraintKeys[key];
    });
};
exports.setCustomDefaultConstraintTypeMessages = setCustomDefaultConstraintTypeMessages;
const getConstraintTypeMessages = () => {
    return Object.assign(Object.assign({}, defaultConstraintTypeMessages), customConstraintTypeMessages);
};
exports.getConstraintTypeMessages = getConstraintTypeMessages;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/types/Model.js":
/*!***************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/types/Model.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CaptchaDisplayMode = exports.FocusOption = exports.ValidationError = exports.EventSource = void 0;
var EventSource;
(function (EventSource) {
    EventSource["CODE"] = "code";
    EventSource["UI"] = "ui";
})(EventSource = exports.EventSource || (exports.EventSource = {}));
class ValidationError {
    constructor(fieldName = '', errorMessages = []) {
        this.errorMessages = errorMessages;
        this.fieldName = fieldName;
    }
}
exports.ValidationError = ValidationError;
var FocusOption;
(function (FocusOption) {
    FocusOption["NEXT_ITEM"] = "nextItem";
    FocusOption["PREVIOUS_ITEM"] = "previousItem";
})(FocusOption = exports.FocusOption || (exports.FocusOption = {}));
var CaptchaDisplayMode;
(function (CaptchaDisplayMode) {
    CaptchaDisplayMode["INVISIBLE"] = "invisible";
    CaptchaDisplayMode["VISIBLE"] = "visible";
})(CaptchaDisplayMode = exports.CaptchaDisplayMode || (exports.CaptchaDisplayMode = {}));


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/types/Schema.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/types/Schema.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CrisprXfaSchema {
    static createSchema(type, defaultValue, xfaProp = null, priority = 'XFA') {
        return { type, default: defaultValue, xfaProp, priority };
    }
    static getAttributeProps(attribute) {
        try {
            return this.schemaObject[attribute];
        }
        catch (e) {
            console.error('AF', 'schema has no attribute ' + attribute);
        }
    }
    static getTypedValue(type, value) {
        if (value === null || value === undefined) {
            return value;
        }
        switch (type) {
            case 'string':
                return value + '';
            case 'integer':
                return parseInt(value);
            case 'boolean':
                return value === true || value === 'true';
            case 'float':
                return parseFloat(value);
            default:
                return value;
        }
    }
    static getConvertor(attr) {
        return this.convertor[attr];
    }
    static getPropertyFromXfaNode(xfaNode, property) {
        const attributeProps = this.getAttributeProps(property);
        if (attributeProps && attributeProps.xfaProp && xfaNode) {
            let xfaValue = xfaNode[attributeProps.xfaProp];
            const convertor = this.getConvertor(property);
            if (convertor && convertor.xfaToGuide) {
                xfaValue = convertor.xfaToGuide(xfaValue);
            }
            return this.getTypedValue(attributeProps.type, xfaValue);
        }
        return null;
    }
    static setPropertyToXfaNode(xfaNode, property, value) {
        const attributeProps = this.getAttributeProps(property);
        if (attributeProps && attributeProps.xfaProp && xfaNode) {
            const convertor = this.getConvertor(property);
            if (convertor && convertor.guideToXfa) {
                xfaNode[attributeProps.xfaProp] = convertor.guideToXfa(value);
            }
            else {
                xfaNode[attributeProps.xfaProp] = value;
            }
            return true;
        }
        return false;
    }
}
exports["default"] = CrisprXfaSchema;
CrisprXfaSchema.schemaObject = {
    'label.value': CrisprXfaSchema.createSchema('string', null, 'caption.value.oneOfChild.value'),
    'rules.value': CrisprXfaSchema.createSchema('string', null, 'calculate.script.value', 'Guide'),
    validationExpression: CrisprXfaSchema.createSchema('string', null, 'validate.script.value', 'Guide'),
    enabled: CrisprXfaSchema.createSchema('boolean', true, 'access'),
    readOnly: CrisprXfaSchema.createSchema('boolean', false, 'access'),
    visible: CrisprXfaSchema.createSchema('boolean', true, 'presence'),
    required: CrisprXfaSchema.createSchema('boolean', false, 'validate.nullTest'),
    value: CrisprXfaSchema.createSchema('string', null, 'rawValue'),
    'constraintMessages.required': CrisprXfaSchema.createSchema('string', null, 'mandatoryMessage'),
    'constraintMessages.expression': CrisprXfaSchema.createSchema('string', undefined, 'validationMessage')
};
CrisprXfaSchema.convertor = {
    visible: {
        xfaToGuide: (xfaValue) => xfaValue === 'visible',
        guideToXfa: (guideValue) => guideValue === true ? 'visible' : 'hidden'
    },
    enabled: {
        xfaToGuide: (xfaValue) => xfaValue === 'open' || xfaValue === 'readOnly',
        guideToXfa: (guideValue) => guideValue === true ? 'open' : 'readOnly'
    },
    readOnly: {
        xfaToGuide: (xfaValue) => xfaValue === 'readOnly',
        guideToXfa: (guideValue) => guideValue === true ? 'readOnly' : 'open'
    },
    mandatory: {
        xfaToGuide: (xfaValue) => xfaValue === 'error',
        guideToXfa: (guideValue) => guideValue === true ? 'error' : 'disabled'
    },
    calcExp: {
        xfaToGuide: (xfaValue) => xfaValue !== null && xfaValue !== '' ? null : undefined,
        guideToXfa: (guideValue) => guideValue !== null && guideValue !== '' ? null : undefined
    },
    validationExpression: {
        xfaToGuide: (xfaValue) => xfaValue !== null && xfaValue !== '' ? null : undefined,
        guideToXfa: (guideValue) => guideValue !== null && guideValue !== '' ? null : undefined
    },
    'rules.value': {
        xfaToGuide: (xfaValue) => xfaValue !== null && xfaValue !== '' ? null : undefined,
        guideToXfa: (guideValue) => guideValue !== null && guideValue !== '' ? null : undefined
    }
};


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/types/index.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Json */ "./node_modules/@aemforms/af-core-xfa/lib/types/Json.js"), exports);
__exportStar(__webpack_require__(/*! ./Model */ "./node_modules/@aemforms/af-core-xfa/lib/types/Model.js"), exports);


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/CoercionUtils.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/CoercionUtils.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringToNumber = void 0;
const af_formatters_1 = __webpack_require__(/*! @aemforms/af-formatters */ "./node_modules/@aemforms/af-formatters/lib/index.js");
function stringToNumber(str, language) {
    if (str === null) {
        return 0;
    }
    const n = +str;
    if (!isNaN(n)) {
        return n;
    }
    if (language) {
        const date = (0, af_formatters_1.parseDefaultDate)(str, language, true);
        if (date !== str) {
            return (0, af_formatters_1.datetimeToNumber)(date);
        }
    }
    return 0;
}
exports.stringToNumber = stringToNumber;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/DataRefParser.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/DataRefParser.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveData = exports.tokenize = exports.repeatable = exports.global$ = exports.bracket = exports.identifier = exports.TOK_REPEATABLE = exports.TOK_GLOBAL = void 0;
const DataGroup_1 = __importDefault(__webpack_require__(/*! ../data/DataGroup */ "./node_modules/@aemforms/af-core-xfa/lib/data/DataGroup.js"));
const TOK_DOT = 'DOT';
const TOK_IDENTIFIER = 'Identifier';
exports.TOK_GLOBAL = 'Global';
exports.TOK_REPEATABLE = 'Repeatable';
const TOK_BRACKET = 'bracket';
const TOK_NUMBER = 'Number';
const globalStartToken = '$';
const repeatableStartToken = '#';
const identifier = (value, start) => {
    return {
        type: TOK_IDENTIFIER,
        value,
        start
    };
};
exports.identifier = identifier;
const bracket = (value, start) => {
    return {
        type: TOK_BRACKET,
        value,
        start
    };
};
exports.bracket = bracket;
const global$ = () => {
    return {
        type: exports.TOK_GLOBAL,
        start: 0,
        value: globalStartToken
    };
};
exports.global$ = global$;
const repeatable = () => {
    return {
        type: exports.TOK_REPEATABLE,
        start: 0,
        value: repeatableStartToken
    };
};
exports.repeatable = repeatable;
const isAlphaNum = function (ch) {
    return (ch >= 'a' && ch <= 'z')
        || (ch >= 'A' && ch <= 'Z')
        || (ch >= '0' && ch <= '9')
        || ch === '_';
};
const isGlobal = (prev, stream, pos) => {
    return prev === null && stream[pos] === globalStartToken;
};
const isRepeatable = (prev, stream, pos) => {
    return prev === null && stream[pos] === repeatableStartToken;
};
const isIdentifier = (stream, pos) => {
    const ch = stream[pos];
    if (ch === '$') {
        return stream.length > pos && isAlphaNum(stream[pos + 1]);
    }
    return (ch >= 'a' && ch <= 'z')
        || (ch >= 'A' && ch <= 'Z')
        || ch === '_';
};
const isNum = (ch) => {
    return (ch >= '0' && ch <= '9');
};
class Tokenizer {
    constructor(stream) {
        this.stream = stream;
        this._tokens = [];
        this._result_tokens = [];
        this._current = 0;
    }
    _consumeGlobal() {
        this._current += 1;
        return (0, exports.global$)();
    }
    _consumeRepeatable() {
        this._current += 1;
        return (0, exports.repeatable)();
    }
    _consumeUnquotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        while (this._current < stream.length && isAlphaNum(stream[this._current])) {
            this._current += 1;
        }
        return (0, exports.identifier)(stream.slice(start, this._current), start);
    }
    _consumeQuotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (stream[this._current] !== '"' && this._current < maxLength) {
            let current = this._current;
            if (stream[current] === '\\' && (stream[current + 1] === '\\'
                || stream[current + 1] === '"')) {
                current += 2;
            }
            else {
                current += 1;
            }
            this._current = current;
        }
        this._current += 1;
        return (0, exports.identifier)(JSON.parse(stream.slice(start, this._current)), start);
    }
    _consumeNumber(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (isNum(stream[this._current]) && this._current < maxLength) {
            this._current += 1;
        }
        const n = stream.slice(start, this._current);
        const value = parseInt(n, 10);
        return { type: TOK_NUMBER, value, start };
    }
    _consumeBracket(stream) {
        const start = this._current;
        this._current += 1;
        let value;
        if (isNum(stream[this._current])) {
            value = this._consumeNumber(stream).value;
        }
        else {
            throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
        }
        if (this._current < this.stream.length && stream[this._current] !== ']') {
            throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
        }
        this._current++;
        return (0, exports.bracket)(value, start);
    }
    tokenize() {
        const stream = this.stream;
        while (this._current < stream.length) {
            const prev = this._tokens.length ? this._tokens.slice(-1)[0] : null;
            if (isGlobal(prev, stream, this._current)) {
                const token = this._consumeGlobal();
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (isRepeatable(prev, stream, this._current)) {
                const token = this._consumeRepeatable();
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (isIdentifier(stream, this._current)) {
                const token = this._consumeUnquotedIdentifier(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (stream[this._current] === '.' && prev != null && prev.type !== TOK_DOT) {
                this._tokens.push({
                    type: TOK_DOT,
                    value: '.',
                    start: this._current
                });
                this._current += 1;
            }
            else if (stream[this._current] === '[') {
                const token = this._consumeBracket(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (stream[this._current] === '"') {
                const token = this._consumeQuotedIdentifier(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else {
                const p = Math.max(0, this._current - 2);
                const s = Math.min(this.stream.length, this._current + 2);
                throw new Error(`Exception at parsing stream ${this.stream.slice(p, s)}`);
            }
        }
        return this._result_tokens;
    }
}
const tokenize = (stream) => {
    return new Tokenizer(stream).tokenize();
};
exports.tokenize = tokenize;
const resolveData = (data, input, create) => {
    let tokens;
    if (typeof input === 'string') {
        tokens = (0, exports.tokenize)(input);
    }
    else {
        tokens = input;
    }
    let result = data;
    let i = 0;
    const createIntermediateNode = (token, nextToken, create) => {
        return nextToken === null ? create :
            (nextToken.type === TOK_BRACKET) ? new DataGroup_1.default(token.value, [], 'array') :
                new DataGroup_1.default(token.value, {});
    };
    while (i < tokens.length && result != null) {
        const token = tokens[i];
        if (token.type === exports.TOK_GLOBAL) {
            result = data;
        }
        else if (token.type === TOK_IDENTIFIER) {
            if (result instanceof DataGroup_1.default && result.$type === 'object') {
                if (result.$containsDataNode(token.value) && result.$getDataNode(token.value).$value !== null) {
                    result = result.$getDataNode(token.value);
                }
                else if (create) {
                    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
                    const toCreate = createIntermediateNode(token, nextToken, create);
                    result.$addDataNode(token.value, toCreate);
                    result = toCreate;
                }
                else {
                    result = undefined;
                }
            }
            else {
                throw new Error(`Looking for ${token.value} in ${result.$value}`);
            }
        }
        else if (token.type === TOK_BRACKET) {
            if (result instanceof DataGroup_1.default && result.$type === 'array') {
                const index = token.value;
                if (index < result.$length) {
                    result = result.$getDataNode(index);
                }
                else if (create) {
                    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
                    const toCreate = createIntermediateNode(token, nextToken, create);
                    result.$addDataNode(index, toCreate);
                    result = toCreate;
                }
                else {
                    result = undefined;
                }
            }
            else {
                throw new Error(`Looking for index ${token.value} in non array${result.$value}`);
            }
        }
        i += 1;
    }
    return result;
};
exports.resolveData = resolveData;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/Fetch.js":
/*!***************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/Fetch.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertQueryString = exports.request = void 0;
const request = (url, data = null, options = {}) => {
    const opts = Object.assign(Object.assign({}, defaultRequestOptions), options);
    const updatedUrl = opts.method === 'GET' && data ? (0, exports.convertQueryString)(url, data) : url;
    if (opts.method !== 'GET') {
        opts.body = data;
    }
    return fetch(updatedUrl, Object.assign({}, opts)).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let body;
        if (!response.ok) {
            console.error(`Error while fetching response from ${url} : ${response.statusText}`);
        }
        if ((_b = (_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a.get('Content-Type')) === null || _b === void 0 ? void 0 : _b.includes('application/json')) {
            body = yield response.json();
        }
        else {
            body = yield response.text();
        }
        const headers = {};
        (_c = response === null || response === void 0 ? void 0 : response.headers) === null || _c === void 0 ? void 0 : _c.forEach((value, key) => {
            headers[key] = value;
        });
        return {
            status: response.status,
            body,
            headers
        };
    }));
};
exports.request = request;
const defaultRequestOptions = {
    method: 'GET'
};
const convertQueryString = (endpoint, payload) => {
    if (!payload) {
        return endpoint;
    }
    let updatedPayload = {};
    try {
        updatedPayload = JSON.parse(payload);
    }
    catch (err) {
        console.log('Query params invalid');
    }
    const params = [];
    Object.keys(updatedPayload).forEach((key) => {
        if (Array.isArray(updatedPayload[key])) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(updatedPayload[key]))}`);
        }
        else {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(updatedPayload[key])}`);
        }
    });
    if (!params.length) {
        return endpoint;
    }
    return endpoint.includes('?') ? `${endpoint}&${params.join('&')}` : `${endpoint}?${params.join('&')}`;
};
exports.convertQueryString = convertQueryString;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormCreationUtils.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/FormCreationUtils.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormFieldFactory = void 0;
const InstanceManager_1 = __webpack_require__(/*! ../InstanceManager */ "./node_modules/@aemforms/af-core-xfa/lib/InstanceManager.js");
const Fieldset_1 = __webpack_require__(/*! ../Fieldset */ "./node_modules/@aemforms/af-core-xfa/lib/Fieldset.js");
const JsonUtils_1 = __webpack_require__(/*! ./JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
const FileUpload_1 = __importDefault(__webpack_require__(/*! ../FileUpload */ "./node_modules/@aemforms/af-core-xfa/lib/FileUpload.js"));
const Checkbox_1 = __importDefault(__webpack_require__(/*! ../Checkbox */ "./node_modules/@aemforms/af-core-xfa/lib/Checkbox.js"));
const CheckboxGroup_1 = __importDefault(__webpack_require__(/*! ../CheckboxGroup */ "./node_modules/@aemforms/af-core-xfa/lib/CheckboxGroup.js"));
const DateField_1 = __importDefault(__webpack_require__(/*! ../DateField */ "./node_modules/@aemforms/af-core-xfa/lib/DateField.js"));
const Field_1 = __importDefault(__webpack_require__(/*! ../Field */ "./node_modules/@aemforms/af-core-xfa/lib/Field.js"));
const EmailInput_1 = __importDefault(__webpack_require__(/*! ../EmailInput */ "./node_modules/@aemforms/af-core-xfa/lib/EmailInput.js"));
const Captcha_1 = __importDefault(__webpack_require__(/*! ../Captcha */ "./node_modules/@aemforms/af-core-xfa/lib/Captcha.js"));
const Button_1 = __importDefault(__webpack_require__(/*! ../Button */ "./node_modules/@aemforms/af-core-xfa/lib/Button.js"));
const alternateFieldTypeMapping = {
    'text': 'text-input',
    'number': 'number-input',
    'email': 'email',
    'file': 'file-input',
    'range': 'range',
    'textarea': 'multiline-input'
};
class FormFieldFactoryImpl {
    createField(child, _options) {
        let retVal;
        const options = Object.assign(Object.assign({}, _options), { fieldFactory: this });
        child.fieldType = child.fieldType ? (child.fieldType in alternateFieldTypeMapping ?
            alternateFieldTypeMapping[child.fieldType] : child.fieldType)
            : 'text-input';
        if ((0, JsonUtils_1.isRepeatable)(child)) {
            const newChild = Object.assign(Object.assign(Object.assign({}, child), ('items' in child && { 'type': 'object' })), { minOccur: undefined, maxOccur: undefined, repeatable: undefined, name: undefined });
            const newJson = Object.assign({
                minItems: child.minOccur || 0,
                maxItems: child.maxOccur || -1,
                fieldType: child.fieldType,
                type: 'array',
                name: child.name,
                dataRef: child.dataRef,
                events: {
                    'custom:setProperty': '$event.payload'
                }
            }, {
                'items': [newChild]
            });
            retVal = new InstanceManager_1.InstanceManager(newJson, options);
        }
        else if ('items' in child || child.fieldType === 'panel') {
            retVal = new Fieldset_1.Fieldset(child, options);
        }
        else {
            if ((0, JsonUtils_1.isFile)(child) || child.fieldType === 'file-input') {
                retVal = new FileUpload_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isCheckbox)(child)) {
                retVal = new Checkbox_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isCheckboxGroup)(child)) {
                retVal = new CheckboxGroup_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isEmailInput)(child)) {
                retVal = new EmailInput_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isDateField)(child)) {
                retVal = new DateField_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isCaptcha)(child)) {
                retVal = new Captcha_1.default(child, options);
            }
            else if ((0, JsonUtils_1.isButton)(child)) {
                retVal = new Button_1.default(child, options);
            }
            else {
                retVal = new Field_1.default(child, options);
            }
        }
        return retVal;
    }
}
exports.FormFieldFactory = new FormFieldFactoryImpl();


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceTemplatePlaceholders = exports.sitesModelToFormModel = exports.dataURItoBlob = exports.extractFileInfo = exports.isDataUrl = exports.IdGenerator = exports.getFileSizeInBytes = exports.getAttachments = exports.readAttachments = exports.isEmpty = exports.randomWord = void 0;
const JsonUtils_1 = __webpack_require__(/*! ./JsonUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js");
const FileObject_1 = __webpack_require__(/*! ../FileObject */ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js");
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');
const fileSizeRegex = /^(\d*\.?\d+)(\\?(?=[KMGT])([KMGT])(?:i?B)?|B?)$/i;
const randomWord = (l) => {
    const ret = [];
    for (let i = 0; i <= l; i++) {
        let randIndex;
        if (i === 0) {
            randIndex = Math.floor(Math.random() * (chars.length - 11));
        }
        else {
            randIndex = Math.floor(Math.random() * (chars.length));
        }
        ret.push(chars[randIndex]);
    }
    return ret.join('');
};
exports.randomWord = randomWord;
const isEmpty = (value) => {
    return value === '' || value === null || value === undefined;
};
exports.isEmpty = isEmpty;
const processItem = (item, excludeUnbound, isAsync) => {
    if (excludeUnbound && item.dataRef === null) {
        return isAsync ? Promise.resolve(null) : null;
    }
    let ret = null;
    if (item.isContainer) {
        return isAsync
            ? (0, exports.readAttachments)(item, excludeUnbound).then(res => res)
            : (0, exports.getAttachments)(item, excludeUnbound);
    }
    else {
        if ((0, JsonUtils_1.isFile)(item.getState())) {
            ret = {};
            const name = item.name || '';
            const dataRef = (item.dataRef != null)
                ? item.dataRef
                : (name.length > 0 ? item.name : undefined);
            if (item.value instanceof Array) {
                if (item.type === 'string[]') {
                    if (isAsync) {
                        return item.serialize().then(serializedFiles => {
                            ret[item.id] = serializedFiles.map((x) => {
                                return Object.assign(Object.assign({}, x), { 'dataRef': dataRef });
                            });
                            return ret;
                        });
                    }
                    else {
                        ret[item.id] = item.value.map((x) => {
                            return Object.assign(Object.assign({}, x), { 'dataRef': dataRef });
                        });
                    }
                }
                else {
                    ret[item.id] = item.value.map((x) => {
                        return Object.assign(Object.assign({}, x), { 'dataRef': dataRef });
                    });
                }
            }
            else if (item.value != null) {
                if (item.type === 'string') {
                    if (isAsync) {
                        return item.serialize().then(serializedFile => {
                            ret[item.id] = Object.assign(Object.assign({}, serializedFile[0]), { 'dataRef': dataRef });
                            return ret;
                        });
                    }
                    else {
                        ret[item.id] = Object.assign(Object.assign({}, item.value), { 'dataRef': dataRef });
                    }
                }
                else {
                    ret[item.id] = Object.assign(Object.assign({}, item.value), { 'dataRef': dataRef });
                }
            }
        }
    }
    return isAsync ? Promise.resolve(ret) : ret;
};
const readAttachments = (input, excludeUnbound = false) => __awaiter(void 0, void 0, void 0, function* () {
    const items = input.items || [];
    return items.reduce((accPromise, item) => __awaiter(void 0, void 0, void 0, function* () {
        const acc = yield accPromise;
        const ret = yield processItem(item, excludeUnbound, true);
        return Object.assign(acc, ret);
    }), Promise.resolve({}));
});
exports.readAttachments = readAttachments;
const getAttachments = (input, excludeUnbound = false) => {
    const items = input.items || [];
    return items.reduce((acc, item) => {
        const ret = processItem(item, excludeUnbound, false);
        return Object.assign(acc, ret);
    }, {});
};
exports.getAttachments = getAttachments;
const getFileSizeInBytes = (str) => {
    let retVal = 0;
    if (typeof str === 'string') {
        const matches = fileSizeRegex.exec(str.trim());
        if (matches != null) {
            retVal = sizeToBytes(parseFloat(matches[1]), (matches[2] || 'kb').toUpperCase());
        }
    }
    return retVal;
};
exports.getFileSizeInBytes = getFileSizeInBytes;
const sizeToBytes = (size, symbol) => {
    const sizes = { 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4 };
    const i = Math.pow(1024, sizes[symbol]);
    return Math.round(size * i);
};
const IdGenerator = function* (initial = 50) {
    const initialize = function () {
        const arr = [];
        for (let i = 0; i < initial; i++) {
            arr.push((0, exports.randomWord)(10));
        }
        return arr;
    };
    const passedIds = {};
    let ids = initialize();
    do {
        let x = ids.pop();
        while (x in passedIds) {
            if (ids.length === 0) {
                ids = initialize();
            }
            x = ids.pop();
        }
        passedIds[x] = true;
        yield ids.pop();
        if (ids.length === 0) {
            ids = initialize();
        }
    } while (ids.length > 0);
};
exports.IdGenerator = IdGenerator;
const isDataUrl = (str) => {
    const dataUrlRegex = /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;
    return dataUrlRegex.exec(str.trim()) != null;
};
exports.isDataUrl = isDataUrl;
const extractFileInfo = (file) => {
    if (file !== null) {
        let retVal = null;
        if (file instanceof FileObject_1.FileObject) {
            retVal = file;
        }
        else if (typeof File !== 'undefined' && file instanceof File) {
            retVal = {
                name: file.name,
                mediaType: file.type,
                size: file.size,
                data: file
            };
        }
        else if (typeof file === 'string' && (0, exports.isDataUrl)(file)) {
            const result = (0, exports.dataURItoBlob)(file);
            if (result !== null) {
                const { blob, name } = result;
                retVal = {
                    name: name,
                    mediaType: blob.type,
                    size: blob.size,
                    data: blob
                };
            }
        }
        else {
            let jFile = file;
            try {
                jFile = JSON.parse(file);
                retVal = jFile;
                if (!retVal.mediaType) {
                    retVal.mediaType = retVal.type;
                }
            }
            catch (ex) {
            }
            if (typeof (jFile === null || jFile === void 0 ? void 0 : jFile.data) === 'string' && (0, exports.isDataUrl)(jFile === null || jFile === void 0 ? void 0 : jFile.data)) {
                const result = (0, exports.dataURItoBlob)(jFile === null || jFile === void 0 ? void 0 : jFile.data);
                if (result !== null) {
                    const blob = result.blob;
                    retVal = {
                        name: jFile === null || jFile === void 0 ? void 0 : jFile.name,
                        mediaType: (jFile === null || jFile === void 0 ? void 0 : jFile.type) || (jFile === null || jFile === void 0 ? void 0 : jFile.mediaType),
                        size: blob.size,
                        data: blob
                    };
                }
            }
            else if (typeof jFile === 'string') {
                const fileName = jFile.split('/').pop();
                retVal = {
                    name: fileName,
                    mediaType: 'application/octet-stream',
                    size: 0,
                    data: jFile
                };
            }
            else if (typeof jFile === 'object') {
                retVal = {
                    name: jFile === null || jFile === void 0 ? void 0 : jFile.name,
                    mediaType: (jFile === null || jFile === void 0 ? void 0 : jFile.type) || (jFile === null || jFile === void 0 ? void 0 : jFile.mediaType),
                    size: jFile === null || jFile === void 0 ? void 0 : jFile.size,
                    data: jFile === null || jFile === void 0 ? void 0 : jFile.data
                };
            }
        }
        if (retVal !== null && retVal.data != null) {
            return new FileObject_1.FileObject(retVal);
        }
        return null;
    }
    else {
        return null;
    }
};
exports.extractFileInfo = extractFileInfo;
const dataURItoBlob = (dataURI) => {
    const regex = /^data:([a-z]+\/[a-z0-9-+.]+)?(?:;name=([^;]+))?(;base64)?,(.+)$/;
    const groups = regex.exec(dataURI);
    if (groups !== null) {
        const type = groups[1] || '';
        const name = groups[2] || 'unknown';
        const isBase64 = typeof groups[3] === 'string';
        if (isBase64) {
            const binary = atob(groups[4]);
            const array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            const blob = new window.Blob([new Uint8Array(array)], { type });
            return { name, blob };
        }
        else {
            const blob = new window.Blob([groups[4]], { type });
            return { name, blob };
        }
    }
    else {
        return null;
    }
};
exports.dataURItoBlob = dataURItoBlob;
const isFormOrSiteContainer = (model) => {
    return (':items' in model || 'cqItems' in model) && (':itemsOrder' in model || 'cqItemsOrder' in model);
};
const sitesModelToFormModel = (sitesModel) => {
    if (!sitesModel || !Object.keys(sitesModel).length) {
        return sitesModel;
    }
    if (isFormOrSiteContainer(sitesModel)) {
        const itemsArr = [];
        const itemsOrder = sitesModel[':itemsOrder'] || sitesModel.cqItemsOrder;
        const items = sitesModel[':items'] || sitesModel.cqItems;
        itemsOrder.forEach((elemName) => {
            itemsArr.push((0, exports.sitesModelToFormModel)(items[elemName]));
        });
        sitesModel.items = itemsArr;
    }
    return sitesModel;
};
exports.sitesModelToFormModel = sitesModelToFormModel;
const replaceTemplatePlaceholders = (str, values = []) => {
    return str === null || str === void 0 ? void 0 : str.replace(/\${(\d+)}/g, (match, index) => {
        const replacement = values[index];
        return typeof replacement !== 'undefined' ? replacement : match;
    });
};
exports.replaceTemplatePlaceholders = replaceTemplatePlaceholders;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/JsonUtils.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRepeatable = exports.jsonString = exports.checkIfKeyAdded = exports.deepClone = exports.isButton = exports.isCaptcha = exports.isDateField = exports.isEmailInput = exports.isCheckboxGroup = exports.isCheckbox = exports.checkIfConstraintsArePresent = exports.isFile = exports.getProperty = void 0;
const index_1 = __webpack_require__(/*! ../types/index */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
const SchemaUtils_1 = __webpack_require__(/*! ./SchemaUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/SchemaUtils.js");
const getProperty = (data, key, def) => {
    if (key in data) {
        return data[key];
    }
    else if (!key.startsWith(':')) {
        const prefixedKey = `:${key}`;
        if (prefixedKey in data) {
            return data[prefixedKey];
        }
    }
    return def;
};
exports.getProperty = getProperty;
const isFile = function (item) {
    return ((item === null || item === void 0 ? void 0 : item.type) === 'file' || (item === null || item === void 0 ? void 0 : item.type) === 'file[]') ||
        (((item === null || item === void 0 ? void 0 : item.type) === 'string' || (item === null || item === void 0 ? void 0 : item.type) === 'string[]') &&
            ((item === null || item === void 0 ? void 0 : item.format) === 'binary' || (item === null || item === void 0 ? void 0 : item.format) === 'data-url')) ||
        (item === null || item === void 0 ? void 0 : item.fieldType) === 'file-input';
};
exports.isFile = isFile;
const checkIfConstraintsArePresent = function (item) {
    return index_1.constraintProps.some(cp => item[cp] !== undefined);
};
exports.checkIfConstraintsArePresent = checkIfConstraintsArePresent;
const isCheckbox = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return fieldType === 'checkbox';
};
exports.isCheckbox = isCheckbox;
const isCheckboxGroup = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return fieldType === 'checkbox-group';
};
exports.isCheckboxGroup = isCheckboxGroup;
const isEmailInput = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return (fieldType === 'text-input' && (item === null || item === void 0 ? void 0 : item.format) === 'email') || fieldType === 'email';
};
exports.isEmailInput = isEmailInput;
const isDateField = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return (fieldType === 'text-input' && (item === null || item === void 0 ? void 0 : item.format) === 'date') || fieldType === 'date-input';
};
exports.isDateField = isDateField;
const isCaptcha = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return fieldType === 'captcha';
};
exports.isCaptcha = isCaptcha;
const isButton = function (item) {
    return (item === null || item === void 0 ? void 0 : item.fieldType) === 'button';
};
exports.isButton = isButton;
function deepClone(obj, idGenerator) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    let result;
    if (Array.isArray(obj)) {
        result = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            result[i] = deepClone(obj[i], idGenerator);
        }
    }
    else {
        result = {};
        for (const key of Object.keys(obj)) {
            result[key] = deepClone(obj[key], idGenerator);
        }
    }
    if (typeof idGenerator === 'function' && result && result.id) {
        result.id = idGenerator();
    }
    else if (idGenerator) {
        Object.entries(idGenerator).forEach(([key, value]) => {
            if (result && result[key] && typeof value === 'function') {
                result[key] = value(result, obj);
            }
        });
    }
    return result;
}
exports.deepClone = deepClone;
function checkIfKeyAdded(currentObj, prevObj, objKey) {
    if (currentObj != null && prevObj != null) {
        const newPrvObj = Object.assign({}, prevObj);
        newPrvObj[objKey] = currentObj[objKey];
        const newJsonStr = (0, exports.jsonString)(currentObj).replace((0, exports.jsonString)(newPrvObj), '');
        return newJsonStr === '';
    }
    else {
        return false;
    }
}
exports.checkIfKeyAdded = checkIfKeyAdded;
const jsonString = (obj) => {
    return JSON.stringify(obj, null, 2);
};
exports.jsonString = jsonString;
const isRepeatable = (obj) => {
    return ((obj.repeatable &&
        ((obj.minOccur === undefined && obj.maxOccur === undefined) ||
            (obj.minOccur !== undefined && obj.maxOccur !== undefined && obj.maxOccur !== 0) ||
            (obj.minOccur !== undefined && obj.maxOccur !== undefined && obj.minOccur !== 0 && obj.maxOccur !== 0) ||
            (obj.minOccur !== undefined && obj.minOccur >= 0) ||
            (obj.maxOccur !== undefined && obj.maxOccur !== 0))) || false);
};
exports.isRepeatable = isRepeatable;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/SchemaUtils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/SchemaUtils.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportDataSchema = exports.defaultFieldTypes = void 0;
const objToMap = (o) => new Map(Object.entries(o));
const stringViewTypes = objToMap({ 'date': 'date-input', 'data-url': 'file-input', 'binary': 'file-input' });
const typeToViewTypes = objToMap({
    'number': 'number-input',
    'boolean': 'checkbox',
    'object': 'panel',
    'array': 'panel',
    'file': 'file-input',
    'file[]': 'file-input'
});
const arrayTypes = ['string[]', 'boolean[]', 'number[]', 'array'];
const defaultFieldTypes = (schema) => {
    const type = schema.type || 'string';
    if ('enum' in schema) {
        const enums = schema.enum;
        if (enums.length > 2 || arrayTypes.indexOf(type) > -1) {
            return 'drop-down';
        }
        else {
            return 'checkbox';
        }
    }
    if (type === 'string' || type === 'string[]') {
        return stringViewTypes.get(schema.format) || 'text-input';
    }
    return typeToViewTypes.get(type) || 'text-input';
};
exports.defaultFieldTypes = defaultFieldTypes;
const fieldSchema = (input) => {
    var _a;
    if ('items' in input) {
        const fieldset = input;
        const items = fieldset.items;
        if (fieldset.type === 'array') {
            return {
                type: 'array',
                items: fieldSchema(items[0]),
                minItems: fieldset === null || fieldset === void 0 ? void 0 : fieldset.minItems,
                maxItems: fieldset === null || fieldset === void 0 ? void 0 : fieldset.maxItems
            };
        }
        else {
            const iter = items.filter(x => x.name != null);
            return {
                type: 'object',
                properties: Object.fromEntries(iter.map(item => [item.name, fieldSchema(item)])),
                required: iter.filter(x => x.required).map(x => x.name)
            };
        }
    }
    else {
        const field = input;
        const schemaProps = ['type', 'maxLength', 'minLength', 'minimum', 'maximum', 'format', 'pattern', 'step', 'enum'];
        const schema = schemaProps.reduce((acc, prop) => {
            const p = prop;
            if (prop in field && field[p] != undefined) {
                acc[prop] = field[p];
            }
            return acc;
        }, {});
        if (field.dataRef === 'none' || Object.keys(schema).length == 0) {
            return undefined;
        }
        return Object.assign({ title: (_a = field.label) === null || _a === void 0 ? void 0 : _a.value, description: field.description }, schema);
    }
};
const exportDataSchema = (form) => {
    return fieldSchema(form);
};
exports.exportDataSchema = exportDataSchema;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/TranslationUtils.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/TranslationUtils.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTranslationObject = exports.createTranslationObj = exports.getOrElse = exports.addTranslationId = exports.invalidateTranslation = exports.CUSTOM_PROPS_KEY = exports.TRANSLATION_ID = exports.TRANSLATION_TOKEN = void 0;
const index_1 = __webpack_require__(/*! ../types/index */ "./node_modules/@aemforms/af-core-xfa/lib/types/index.js");
exports.TRANSLATION_TOKEN = '##';
exports.TRANSLATION_ID = 'afs:translationIds';
exports.CUSTOM_PROPS_KEY = 'properties';
const defaultBcp47LangTags = [
    'de-DE',
    'en-US',
    'es-ES',
    'fr-FR',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'pt-BR',
    'zh-CN',
    'zh-TW'
];
const invalidateTranslation = (input, updates) => {
    index_1.translationProps.forEach((prop) => {
        var _a, _b, _c, _d;
        if (prop in updates && ((_b = (_a = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _a === void 0 ? void 0 : _a[exports.TRANSLATION_ID]) === null || _b === void 0 ? void 0 : _b[prop])) {
            (_d = (_c = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _c === void 0 ? void 0 : _c[exports.TRANSLATION_ID]) === null || _d === void 0 ? true : delete _d[prop];
        }
    });
};
exports.invalidateTranslation = invalidateTranslation;
const addTranslationId = (input, additionalTranslationProps = []) => {
    const model = input;
    const transProps = [...index_1.translationProps, ...additionalTranslationProps];
    _createTranslationId(model, '', transProps);
    return model;
};
exports.addTranslationId = addTranslationId;
const _createTranslationId = (input, path, transProps) => {
    Object.entries(input).forEach(([key, value]) => {
        if (typeof value == 'object') {
            if (input instanceof Array) {
                if (value && 'name' in value) {
                    _createTranslationId(value, `${path === '' ? path : path + exports.TRANSLATION_TOKEN}${value.name}`, transProps);
                }
            }
            else {
                _createTranslationId(value, ((key === 'items') ? path : `${path === '' ? path : path + exports.TRANSLATION_TOKEN}${key}`), transProps);
            }
        }
        else {
            if (':type' in input ||
                'type' in input ||
                'fieldType' in input) {
                for (const transProp of transProps) {
                    if ((0, exports.getOrElse)(input, transProp) != null) {
                        if (!(exports.CUSTOM_PROPS_KEY in input)) {
                            input[exports.CUSTOM_PROPS_KEY] = {};
                        }
                        if (!(exports.TRANSLATION_ID in input[exports.CUSTOM_PROPS_KEY])) {
                            input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID] = {};
                        }
                        if (!(transProp in input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID])) {
                            input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][transProp] = `${path}${exports.TRANSLATION_TOKEN}${transProp}${exports.TRANSLATION_TOKEN}${Math.floor(Math.random() * 10000) + 1}`;
                        }
                    }
                }
            }
        }
    });
};
const _createTranslationObj = (input, translationObj, translationProps) => {
    Object.values(input).forEach((value) => {
        var _a, _b;
        if (typeof value == 'object') {
            _createTranslationObj(value, translationObj, translationProps);
        }
        else {
            for (const translationProp of translationProps) {
                const objValue = (0, exports.getOrElse)(input, translationProp);
                if (objValue && ((_b = (_a = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _a === void 0 ? void 0 : _a[exports.TRANSLATION_ID]) === null || _b === void 0 ? void 0 : _b[translationProp])) {
                    if (objValue instanceof Array) {
                        objValue.forEach((item, index) => {
                            if (typeof item === 'string') {
                                translationObj[`${input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][translationProp]}${exports.TRANSLATION_TOKEN}${index}`] = item;
                            }
                        });
                    }
                    else {
                        translationObj[`${input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][translationProp]}`] = objValue;
                    }
                }
            }
        }
    });
};
const getOrElse = (input, key, defaultValue = null) => {
    if (!key) {
        return defaultValue;
    }
    const arr = Array.isArray(key) ? key : key.split('.');
    let objValue = input, index = 0;
    while (index < arr.length && objValue.hasOwnProperty(arr[index])) {
        objValue = objValue[arr[index]];
        index++;
    }
    return index == arr.length ? objValue : defaultValue;
};
exports.getOrElse = getOrElse;
const createTranslationObj = (input, additionalTranslationProps = []) => {
    const obj = {};
    const transProps = [...index_1.translationProps, ...additionalTranslationProps];
    _createTranslationObj(input, obj, transProps);
    return obj;
};
exports.createTranslationObj = createTranslationObj;
const createTranslationObject = (input, additionalTranslationProps = [], bcp47LangTags = []) => {
    const transProps = [...index_1.translationProps, ...additionalTranslationProps];
    const inputCopy = JSON.parse(JSON.stringify(input));
    const obj = (0, exports.createTranslationObj)((0, exports.addTranslationId)(inputCopy, additionalTranslationProps), transProps);
    const langTags = [...defaultBcp47LangTags, ...bcp47LangTags];
    const allLangs = {};
    for (const langTag of langTags) {
        allLangs[langTag] = JSON.parse(JSON.stringify(obj));
    }
    return [inputCopy, allLangs];
};
exports.createTranslationObject = createTranslationObject;


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/ValidationUtils.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Constraints = exports.validationConstraintsList = exports.ValidConstraints = exports.coerceType = void 0;
const FormUtils_1 = __webpack_require__(/*! ./FormUtils */ "./node_modules/@aemforms/af-core-xfa/lib/utils/FormUtils.js");
const FileObject_1 = __webpack_require__(/*! ../FileObject */ "./node_modules/@aemforms/af-core-xfa/lib/FileObject.js");
const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysInMonth = (leapYear, month) => {
    if (leapYear && month == 2) {
        return 29;
    }
    return days[month - 1];
};
const isLeapYear = (year) => {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
};
const coerceType = (param, type) => {
    let num;
    switch (type) {
        case 'string':
            return param + '';
        case 'number':
            num = +param;
            if (!isNaN(num)) {
                return num;
            }
            break;
        case 'boolean':
            if (typeof param === 'string') {
                return param === 'true';
            }
            else if (typeof param === 'number') {
                return param !== 0;
            }
    }
    throw `${param} has invalid type. Expected : ${type}, Actual ${typeof param}`;
};
exports.coerceType = coerceType;
const checkNumber = (inputVal) => {
    if (inputVal === '' || inputVal == null) {
        return {
            value: '', valid: true
        };
    }
    let value = parseFloat(inputVal);
    const valid = !isNaN(value);
    if (!valid) {
        value = inputVal;
    }
    return {
        value, valid
    };
};
const checkInteger = (inputVal) => {
    if (inputVal === '' || inputVal == null) {
        return {
            value: '', valid: true
        };
    }
    let value = parseFloat(inputVal);
    const valid = !isNaN(value) && Math.round(value) === value;
    if (!valid) {
        value = inputVal;
    }
    return {
        value, valid
    };
};
const toArray = (inputVal) => {
    if (inputVal != null && !(inputVal instanceof Array)) {
        return [inputVal];
    }
    return inputVal;
};
const checkBool = (inputVal) => {
    const valid = typeof inputVal === 'boolean' || inputVal === 'true' || inputVal === 'false';
    const value = typeof inputVal === 'boolean' ? inputVal : (valid ? inputVal === 'true' : inputVal);
    return { valid, value };
};
const checkFile = (inputVal) => {
    const value = (0, FormUtils_1.extractFileInfo)(inputVal);
    const valid = value !== null;
    return {
        value: valid ? value : inputVal,
        valid
    };
};
const matchMediaType = (mediaType, accepts) => {
    return !mediaType || accepts.some((accept) => {
        const trimmedAccept = accept.trim();
        const prefixAccept = trimmedAccept.split('/')[0];
        const suffixAccept = trimmedAccept.split('.')[1];
        return ((trimmedAccept.includes('*') && mediaType.startsWith(prefixAccept)) ||
            (trimmedAccept.includes('.') && mediaType.endsWith(suffixAccept)) ||
            (trimmedAccept === mediaType));
    });
};
const partitionArray = (inputVal, validatorFn) => {
    const value = toArray(inputVal);
    if (value == null) {
        return [[], [value]];
    }
    return value.reduce((acc, x) => {
        if (acc[1].length == 0) {
            const r = validatorFn(x);
            const index = r.valid ? 0 : 1;
            acc[index].push(r.value);
        }
        return acc;
    }, [[], []]);
};
exports.ValidConstraints = {
    date: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'format'],
    string: ['minLength', 'maxLength', 'pattern'],
    number: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
    array: ['minItems', 'maxItems', 'uniqueItems'],
    file: ['accept', 'maxFileSize'],
    email: ['minLength', 'maxLength', 'format', 'pattern']
};
exports.validationConstraintsList = ['type', 'format', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'minItems',
    'maxItems', 'uniqueItems', 'minLength', 'maxLength', 'pattern', 'required', 'enum', 'accept', 'maxFileSize'];
exports.Constraints = {
    type: (constraint, inputVal) => {
        let value = inputVal;
        if (inputVal == undefined) {
            return {
                valid: true,
                value: inputVal
            };
        }
        let valid = true, res;
        switch (constraint) {
            case 'string':
                valid = true;
                value = inputVal.toString();
                break;
            case 'string[]':
                value = toArray(inputVal);
                break;
            case 'number':
                res = checkNumber(inputVal);
                value = res.value;
                valid = res.valid;
                break;
            case 'boolean':
                res = checkBool(inputVal);
                valid = res.valid;
                value = res.value;
                break;
            case 'integer':
                res = checkInteger(inputVal);
                valid = res.valid;
                value = res.value;
                break;
            case 'integer[]':
                res = partitionArray(inputVal, checkInteger);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
            case 'file':
                res = checkFile(inputVal instanceof Array ? inputVal[0] : inputVal);
                valid = res.valid;
                value = res.value;
                break;
            case 'file[]':
                res = partitionArray(inputVal, checkFile);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
            case 'number[]':
                res = partitionArray(inputVal, checkNumber);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
            case 'boolean[]':
                res = partitionArray(inputVal, checkBool);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
        }
        return {
            valid,
            value
        };
    },
    format: (constraint, input) => {
        let valid = true;
        const value = input;
        if (input === null) {
            return { value, valid };
        }
        let res;
        switch (constraint) {
            case 'date':
                res = dateRegex.exec((input || '').trim());
                if (res != null) {
                    const [match, year, month, date] = res;
                    const [nMonth, nDate] = [+month, +date];
                    const leapYear = isLeapYear(+year);
                    valid = (nMonth >= 1 && nMonth <= 12) &&
                        (nDate >= 1 && nDate <= daysInMonth(leapYear, nMonth));
                }
                else {
                    valid = false;
                }
                break;
            case 'email':
                valid = new RegExp(emailRegex).test((input || '').trim());
                break;
            case 'data-url':
                valid = true;
                break;
        }
        return { valid, value };
    },
    minimum: (constraint, value) => {
        return { valid: value >= constraint, value };
    },
    maximum: (constraint, value) => {
        return { valid: value <= constraint, value };
    },
    exclusiveMinimum: (constraint, value) => {
        return { valid: value > constraint, value };
    },
    exclusiveMaximum: (constraint, value) => {
        return { valid: value < constraint, value };
    },
    minItems: (constraint, value) => {
        return { valid: (value instanceof Array) && value.length >= constraint, value };
    },
    maxItems: (constraint, value) => {
        return { valid: (value instanceof Array) && value.length <= constraint, value };
    },
    uniqueItems: (constraint, value) => {
        return { valid: !constraint || ((value instanceof Array) && value.length === new Set(value).size), value };
    },
    minLength: (constraint, value) => {
        return Object.assign(Object.assign({}, exports.Constraints.minimum(constraint, typeof value === 'string' ? value.length : 0)), { value });
    },
    maxLength: (constraint, value) => {
        return Object.assign(Object.assign({}, exports.Constraints.maximum(constraint, typeof value === 'string' ? value.length : 0)), { value });
    },
    pattern: (constraint, value) => {
        let regex;
        if (typeof constraint === 'string') {
            regex = new RegExp(constraint);
        }
        else {
            regex = constraint;
        }
        return { valid: regex.test(value), value };
    },
    required: (constraint, value) => {
        const valid = constraint ? value != null && value !== '' : true;
        return { valid, value };
    },
    enum: (constraint, value) => {
        return {
            valid: constraint.indexOf(value) > -1,
            value
        };
    },
    accept: (constraint, value) => {
        if (!constraint || constraint.length === 0 || value === null || value === undefined) {
            return {
                valid: true,
                value
            };
        }
        const tempValue = value instanceof Array ? value : [value];
        const invalidFile = tempValue.some((file) => !matchMediaType(file.type, constraint));
        return {
            valid: !invalidFile,
            value
        };
    },
    maxFileSize: (constraint, value) => {
        const sizeLimit = typeof constraint === 'string' ? (0, FormUtils_1.getFileSizeInBytes)(constraint) : constraint;
        return {
            valid: !(value instanceof FileObject_1.FileObject) || value.size <= sizeLimit,
            value
        };
    }
};


/***/ }),

/***/ "./node_modules/@aemforms/af-core-xfa/lib/utils/Version.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core-xfa/lib/utils/Version.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports) {


var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Version_minor, _Version_major, _Version_subVersion, _Version_invalid;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Version = void 0;
class Version {
    constructor(n) {
        _Version_minor.set(this, void 0);
        _Version_major.set(this, void 0);
        _Version_subVersion.set(this, void 0);
        _Version_invalid.set(this, true);
        const match = n.match(/([^.]+)\.([^.]+)(?:\.(.+))?/);
        if (match) {
            __classPrivateFieldSet(this, _Version_major, +match[1], "f");
            __classPrivateFieldSet(this, _Version_minor, +match[2], "f");
            __classPrivateFieldSet(this, _Version_subVersion, match[3] ? +match[3] : 0, "f");
            if (isNaN(__classPrivateFieldGet(this, _Version_major, "f")) || isNaN(__classPrivateFieldGet(this, _Version_minor, "f")) || isNaN(__classPrivateFieldGet(this, _Version_subVersion, "f"))) {
                throw new Error('Invalid version string ' + n);
            }
        }
        else {
            throw new Error('Invalid version string ' + n);
        }
    }
    get major() {
        return __classPrivateFieldGet(this, _Version_major, "f");
    }
    get minor() {
        return __classPrivateFieldGet(this, _Version_minor, "f");
    }
    get subversion() {
        return __classPrivateFieldGet(this, _Version_subVersion, "f");
    }
    completeMatch(v) {
        return this.major === v.major &&
            this.minor === v.minor &&
            __classPrivateFieldGet(this, _Version_subVersion, "f") === v.subversion;
    }
    lessThan(v) {
        return this.major < v.major || (this.major === v.major && (this.minor < v.minor)) || (this.major === v.major && this.minor === v.minor && __classPrivateFieldGet(this, _Version_subVersion, "f") < v.subversion);
    }
    toString() {
        return `${this.major}.${this.minor}.${this.subversion}`;
    }
    valueOf() {
        return this.toString();
    }
}
exports.Version = Version;
_Version_minor = new WeakMap(), _Version_major = new WeakMap(), _Version_subVersion = new WeakMap(), _Version_invalid = new WeakMap();


/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/date/DateParser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/date/DateParser.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.adjustTimeZone = adjustTimeZone;
exports.datetimeToNumber = datetimeToNumber;
exports.formatDate = formatDate;
exports.numberToDatetime = numberToDatetime;
exports.offsetMS = offsetMS;
exports.offsetMSFallback = offsetMSFallback;
exports.parseDate = parseDate;
exports.parseDefaultDate = parseDefaultDate;

var _SkeletonParser = __webpack_require__(/*! ./SkeletonParser.js */ "./node_modules/@aemforms/af-formatters/lib/date/SkeletonParser.js");

/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.

 * Adobe permits you to use and modify this file solely in accordance with
 * the terms of the Adobe license agreement accompanying it.
 *************************************************************************/

/**
 * Credit: https://git.corp.adobe.com/dc/dfl/blob/master/src/patterns/dates.js
 */
// Test Japanese full/half width character support
// get the localized month names resulting from a given pattern
const twelveMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => new Date(2000, m, 1));
/**
 * returns the name of all the months for a given locale and given Date Format Settings
 * @param locale {string}
 * @param options {string} instance of Intl.DateTimeFormatOptions
 */

function monthNames(locale, options) {
  return twelveMonths.map(month => {
    const parts = new Intl.DateTimeFormat(locale, options).formatToParts(month);
    const m = parts.find(p => p.type === 'month');
    return m && m.value;
  });
}
/**
 * return an array of digits used by a given locale
 * @param locale {string}
 */


function digitChars(locale) {
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    useGrouping: false
  }).format(9876543210).split('').reverse();
}
/**
 * returns the calendar name used in a given locale
 * @param locale {string}
 */


function calendarName(locale) {
  var _parts$find;

  const parts = new Intl.DateTimeFormat(locale, {
    era: 'short'
  }).formatToParts(new Date());
  const era = (_parts$find = parts.find(p => p.type === 'era')) === null || _parts$find === void 0 ? void 0 : _parts$find.value;
  return era === 'هـ' ? 'islamic' : 'gregory';
}
/**
 * returns the representation of the time of day for a given language
 * @param language {string}
 */


function getDayPeriod(language) {
  const morning = new Date(2000, 1, 1, 1, 1, 1);
  const afternoon = new Date(2000, 1, 1, 16, 1, 1);
  const df = new Intl.DateTimeFormat(language, {
    dateStyle: 'full',
    timeStyle: 'full'
  });
  const am = df.formatToParts(morning).find(p => p.type === 'dayPeriod');
  const pm = df.formatToParts(afternoon).find(p => p.type === 'dayPeriod');
  if (!am || !pm) return null;
  return {
    regex: `(${am.value}|${pm.value})`,
    fn: (period, obj) => obj.hour += period === pm.value ? 12 : 0
  };
}
/**
 * get the offset in MS, given a date and timezone
 * @param dateObj {Date}
 * @param timeZone {string}
 */


function offsetMS(dateObj, timeZone) {
  let tzOffset;

  try {
    tzOffset = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset'
    }).format(dateObj);
  } catch (e) {
    return offsetMSFallback(dateObj, timeZone);
  }

  const offset = /GMT([+\-−])?(\d{1,2}):?(\d{0,2})?/.exec(tzOffset);
  if (!offset) return 0;
  const [sign, hours, minutes] = offset.slice(1);
  const nHours = isNaN(parseInt(hours)) ? 0 : parseInt(hours);
  const nMinutes = isNaN(parseInt(minutes)) ? 0 : parseInt(minutes);
  const result = (nHours * 60 + nMinutes) * 60 * 1000;
  return sign === '-' ? -result : result;
}

function getTimezoneOffsetFrom(otherTimezone) {
  var date = new Date();

  function objFromStr(str) {
    var array = str.replace(":", " ").split(" ");
    return {
      day: parseInt(array[0]),
      hour: parseInt(array[1]),
      minute: parseInt(array[2])
    };
  }

  var str = date.toLocaleString('en-US', {
    timeZone: otherTimezone,
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  });
  var other = objFromStr(str);
  str = date.toLocaleString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  });
  var myLocale = objFromStr(str);
  var otherOffset = other.day * 24 * 60 + other.hour * 60 + other.minute; // utc date + otherTimezoneDifference

  var myLocaleOffset = myLocale.day * 24 * 60 + myLocale.hour * 60 + myLocale.minute; // utc date + myTimeZoneDifference
  // (utc date + otherZoneDifference) - (utc date + myZoneDifference) - (-1 * myTimeZoneDifference)

  return otherOffset - myLocaleOffset - date.getTimezoneOffset();
}

function offsetMSFallback(dateObj, timezone) {
  //const defaultOffset = dateObj.getTimezoneOffset();
  const timezoneOffset = getTimezoneOffsetFrom(timezone);
  return timezoneOffset * 60 * 1000;
}
/**
 * adjust from the default JavaScript timezone to the default timezone
 * @param dateObj {Date}
 * @param timeZone {string}
 */


function adjustTimeZone(dateObj, timeZone) {
  if (dateObj === null) return null; // const defaultOffset = new Intl.DateTimeFormat('en-US', { timeZoneName: 'longOffset'}).format(dateObj);

  let baseDate = dateObj.getTime() - dateObj.getTimezoneOffset() * 60 * 1000;
  const offset = offsetMS(dateObj, timeZone);
  const fallBackOffset = offsetMSFallback(dateObj, timeZone);
  baseDate += -offset; // get the offset for the default JS environment
  // return days since the epoch

  return new Date(baseDate);
}
/**
 * Our script object model treats dates as numbers where the integer portion is days since the epoch,
 * the fractional portion is the number hours in the day
 * @param dateObj {Date}
 * @returns {number}
 */


function datetimeToNumber(dateObj) {
  if (dateObj === null) return 0; // return days since the epoch

  return dateObj.getTime() / (1000 * 60 * 60 * 24);
}
/**
 * Our script object model treats dates as numbers where the integer portion is days since the epoch,
 * the fractional portion is the number hours in the day
 * @param num
 * @returns {Date}
 */


function numberToDatetime(num) {
  return new Date(Math.round(num * 1000 * 60 * 60 * 24));
}
/**
 * in some cases, DateTimeFormat doesn't respect the 'numeric' vs. '2-digit' setting
 * for time values. The function corrects that
 * @param formattedParts instance of Intl.DateTimeFormatPart[]
 * @param parsed
 */


function fixDigits(formattedParts, parsed) {
  ['hour', 'minute', 'second'].forEach(type => {
    const defn = formattedParts.find(f => f.type === type);
    if (!defn) return;
    const fmt = parsed.find(pair => pair[0] === type)[1];
    if (fmt === '2-digit' && defn.value.length === 1) defn.value = `0${defn.value}`;
    if (fmt === 'numeric' && defn.value.length === 2 && defn.value.charAt(0) === '0') defn.value = defn.value.slice(1);
  });
}

function fixYear(formattedParts, parsed) {
  // two digit years are handled differently in DateTimeFormat. 00 becomes 1900
  // providing a two digit year 0010 gets formatted to 10 and when parsed becomes 1910
  // Hence we need to pad the year with 0 as required by the skeleton and mentioned in
  // unicode. https://www.unicode.org/reports/tr35/tr35-dates.html#dfst-year
  const defn = formattedParts.find(f => f.type === 'year');
  if (!defn) return; // eslint-disable-next-line no-unused-vars

  const chars = parsed.find(pair => pair[0] === 'year')[2];

  while (defn.value.length < chars) {
    defn.value = `0${defn.value}`;
  }
}
/**
 *
 * @param dateValue {Date}
 * @param language {string}
 * @param skeleton {string}
 * @param timeZone {string}
 * @returns {T}
 */


function formatDateToParts(dateValue, language, skeleton, timeZone) {
  // DateTimeFormat renames some of the options in its formatted output
  //@ts-ignore
  const mappings = key => ({
    hour12: 'dayPeriod',
    fractionalSecondDigits: 'fractionalSecond'
  })[key] || key; // produces an array of name/value pairs of skeleton parts


  const allParameters = (0, _SkeletonParser.parseDateTimeSkeleton)(skeleton, language);
  allParameters.push(['timeZone', timeZone]);
  const parsed = allParameters.filter(p => !p[0].startsWith('x-'));
  const nonStandard = allParameters.filter(p => p[0].startsWith('x-')); // reduce to a set of options that can be used to format

  const options = Object.fromEntries(parsed);
  delete options.literal;
  const df = new Intl.DateTimeFormat(language, options); // formattedParts will have all the pieces we need for our date -- but not in the correct order

  const formattedParts = df.formatToParts(dateValue);
  fixDigits(formattedParts, allParameters);
  fixYear(formattedParts, parsed); // iterate through the original parsed components and use its ordering and literals,
  // and add  the formatted pieces

  return parsed.reduce((result, cur) => {
    if (cur[0] === 'literal') result.push(cur);else {
      const v = formattedParts.find(p => p.type === mappings(cur[0]));

      if (v && v.type === 'timeZoneName') {
        const tz = nonStandard.find(p => p[0] === 'x-timeZoneName')[1];
        const category = tz[0];

        if (category === 'Z') {
          if (tz.length < 4) {
            // handle 'Z', 'ZZ', 'ZZZ' Time Zone: ISO8601 basic hms? / RFC 822
            v.value = v.value.replace(/(GMT|:)/g, '');
            if (v.value === '') v.value = '+0000';
          } else if (tz.length === 5) {
            // 'ZZZZZ' Time Zone: ISO8601 extended hms?
            if (v.value === 'GMT') v.value = 'Z';else v.value = v.value.replace(/GMT/, '');
          }
        }

        if (category === 'X' || category === 'x') {
          if (tz.length === 1) {
            // 'X' ISO8601 basic hm?, with Z for 0
            // -08, +0530, Z
            // 'x' ISO8601 basic hm?, without Z for 0
            v.value = v.value.replace(/(GMT|:(00)?)/g, '');
          }

          if (tz.length === 2) {
            // 'XX' ISO8601 basic hm, with Z
            // -0800, Z
            // 'xx' ISO8601 basic hm, without Z
            v.value = v.value.replace(/(GMT|:)/g, '');
          }

          if (tz.length === 3) {
            // 'XXX' ISO8601 extended hm, with Z
            // -08:00, Z
            // 'xxx' ISO8601 extended hm, without Z
            v.value = v.value.replace(/GMT/g, '');
          }

          if (category === 'X' && v.value === '') v.value = 'Z';
        } else if (tz === 'O') {
          // eliminate 'GMT', leading and trailing zeros
          v.value = v.value.replace(/GMT/g, '').replace(/0(\d+):/, '$1:').replace(/:00/, '');
          if (v.value === '') v.value = '+0';
        }
      }

      if (v) result.push([v.type, v.value]);
    }
    return result;
  }, []);
}
/**
 *
 * @param dateValue {Date}
 * @param language {string}
 * @param skeleton {string}
 * @param timeZone {string}
 */


function formatDate(dateValue, language, skeleton, timeZone) {
  if (skeleton.startsWith('date|')) {
    skeleton = skeleton.split('|')[1];
  }

  if (_SkeletonParser.ShorthandStyles.find(type => skeleton.includes(type))) {
    const options = {
      timeZone
    }; // the skeleton could have two keywords -- one for date, one for time

    const parts = skeleton.split(/\s/).filter(s => s.length);

    if (_SkeletonParser.ShorthandStyles.indexOf(parts[0]) > -1) {
      options.dateStyle = parts[0];
    }

    if (parts.length > 1 && _SkeletonParser.ShorthandStyles.indexOf(parts[1]) > -1) {
      options.timeStyle = parts[1];
    }

    return new Intl.DateTimeFormat(language, options).format(dateValue);
  }

  const parts = formatDateToParts(dateValue, language, skeleton, timeZone);
  return parts.map(p => p[1]).join('');
}
/**
 *
 * @param dateString {string}
 * @param language {string}
 * @param skeleton {string}
 * @param timeZone {string}
 */


function parseDate(dateString, language, skeleton, timeZone) {
  let bUseUTC = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // start by getting all the localized parts of a date/time picture:
  // digits, calendar name
  if (skeleton.startsWith('date|')) {
    skeleton = skeleton.split('|')[1];
  }

  const lookups = [];
  const regexParts = [];
  const calendar = calendarName(language);
  const digits = digitChars(language);
  const twoDigit = `([${digits[0]}-${digits[9]}]{1,2})`;
  const threeDigit = `([${digits[0]}-${digits[9]}]{1,3})`;
  const fourDigit = `([${digits[0]}-${digits[9]}]{1,4})`;
  let hourCycle = 'h12';
  let _bUseUTC = bUseUTC;
  let _setFullYear = false; // functions to process the results of the regex match

  const isSeparator = str => str.length === 1 && ':-/.'.includes(str);

  const monthNumber = str => getNumber(str) - 1;

  const getNumber = str => str.split('').reduce((total, digit) => total * 10 + digits.indexOf(digit), 0);

  const yearNumber = templateDigits => str => {
    let year = getNumber(str); //todo: align with AF

    year = year < 100 && templateDigits === 2 ? year + 2000 : year;
    if (calendar === 'islamic') year = Math.ceil(year * 0.97 + 622);

    if (templateDigits > 2 && year < 100) {
      _setFullYear = true;
    }

    return year;
  };

  const monthLookup = list => month => list.indexOf(month);

  const parsed = (0, _SkeletonParser.parseDateTimeSkeleton)(skeleton, language);
  const months = monthNames(language, Object.fromEntries(parsed)); // build up a regex expression that identifies each option in the skeleton
  // We build two parallel structures:
  // 1. the regex expression that will extract parts of the date/time
  // 2. a lookup array that will convert the matched results into date/time values

  parsed.forEach(_ref => {
    let [option, value, len] = _ref;

    // use a generic regex pattern for all single-character separator literals.
    // Then we'll be forgiving when it comes to separators: / vs - vs : etc
    if (option === 'literal') {
      regexParts.push(value);
    } else if (option === 'month' && ['numeric', '2-digit'].includes(value)) {
      regexParts.push(twoDigit);
      lookups.push(['month', monthNumber]);
    } else if (option === 'month' && ['formatted', 'long', 'short', 'narrow'].includes(value)) {
      regexParts.push(`(${months.join('|')})`);
      lookups.push(['month', monthLookup(months)]);
    } else if (['day', 'minute', 'second'].includes(option)) {
      if (option === 'minute' || option === 'second') {
        _bUseUTC = false;
      }

      regexParts.push(twoDigit);
      lookups.push([option, getNumber]);
    } else if (option === 'fractionalSecondDigits') {
      _bUseUTC = false;
      regexParts.push(threeDigit);
      lookups.push([option, (v, obj) => obj.fractionalSecondDigits + getNumber(v)]);
    } else if (option === 'hour') {
      _bUseUTC = false;
      regexParts.push(twoDigit);
      lookups.push([option, (v, obj) => obj.hour + getNumber(v)]);
    } else if (option === 'year') {
      regexParts.push('numeric' === value ? fourDigit : twoDigit);
      lookups.push(['year', yearNumber(len)]);
    } else if (option === 'dayPeriod') {
      _bUseUTC = false;
      const dayPeriod = getDayPeriod(language);

      if (dayPeriod) {
        regexParts.push(dayPeriod.regex);
        lookups.push(['hour', dayPeriod.fn]);
      } // Any other part that we don't need, we'll just add a non-greedy consumption

    } else if (option === 'hourCycle') {
      _bUseUTC = false;
      hourCycle = value;
    } else if (option === 'x-timeZoneName') {
      _bUseUTC = false; // we handle only the GMT offset picture

      regexParts.push('(?:GMT|UTC|Z)?([+\\-−0-9]{0,3}:?[0-9]{0,2})');
      lookups.push([option, (v, obj) => {
        _bUseUTC = true; // v could be undefined if we're on GMT time

        if (!v) return; // replace the unicode minus, then extract hours [and minutes]

        const timeParts = v.replace(/−/, '-').match(/([+\-\d]{2,3}):?(\d{0,2})/);
        const hours = timeParts[1] * 1;
        obj.hour -= hours;
        const mins = timeParts.length > 2 ? timeParts[2] * 1 : 0;
        obj.minute -= hours < 0 ? -mins : mins;
      }]);
    } else if (option !== 'timeZoneName') {
      _bUseUTC = false;
      regexParts.push('.+?');
    }

    return regexParts;
  }, []);
  const regex = new RegExp(`^${regexParts.join('')}$`);
  const match = dateString.match(regex);
  if (match === null) return null; // now loop through all the matched pieces and build up an object we'll use to create a Date object

  const dateObj = {
    year: 1972,
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    fractionalSecondDigits: 0
  };
  match.slice(1).forEach((m, index) => {
    const [element, func] = lookups[index];
    dateObj[element] = func(m, dateObj);
  });
  if (hourCycle === 'h24' && dateObj.hour === 24) dateObj.hour = 0;
  if (hourCycle === 'h12' && dateObj.hour === 12) dateObj.hour = 0;

  if (_bUseUTC) {
    const utcDate = new Date(Date.UTC(dateObj.year, dateObj.month, dateObj.day, dateObj.hour, dateObj.minute, dateObj.second, dateObj.fractionalSecondDigits));

    if (_setFullYear) {
      utcDate.setUTCFullYear(dateObj.year);
    }

    return utcDate;
  }

  const jsDate = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.hour, dateObj.minute, dateObj.second, dateObj.fractionalSecondDigits);

  if (_setFullYear) {
    jsDate.setFullYear(dateObj.year);
  }

  return timeZone == null ? jsDate : adjustTimeZone(jsDate, timeZone);
}

function parseDefaultDate(dateString, language, bUseUTC) {
  return parseDate(dateString, language, 'yyyy-MM-dd', null, bUseUTC);
}

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/date/SkeletonParser.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/date/SkeletonParser.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShorthandStyles = void 0;
exports.getSkeleton = getSkeleton;
exports.parseDateTimeSkeleton = parseDateTimeSkeleton;

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2022 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/

/**
 * https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * Credit: https://git.corp.adobe.com/dc/dfl/blob/master/src/patterns/parseDateTimeSkeleton.js
 * Created a separate library to be used elsewhere as well.
 */
const DATE_TIME_REGEX = // eslint-disable-next-line max-len
/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvV]{1,5}|[zZOvVxX]{1,3}|S{1,3}|'(?:[^']|'')*')|[^a-zA-Z']+/g;
const ShorthandStyles = ["full", "long", "medium", "short"];
exports.ShorthandStyles = ShorthandStyles;
const testDate = new Date(2000, 2, 1, 2, 3, 4);
/**
 * Since the formatted month names are different than standalone month names, we need to identify the correct option
 * to pass for formatting
 * @param value {string} formatted value of the month
 * @param language {string} language in which the month is formatted
 * @param isMediumFormatStyle {boolean} if shorthand style used for formatting was medium
 */

function deduceMonthOption(value, language, isMediumFormatStyle) {
  const formattedMarch = value;
  const longMarch = new Intl.DateTimeFormat(language, {
    month: 'long'
  }).formatToParts(testDate)[0].value;
  const shortMarch = new Intl.DateTimeFormat(language, {
    month: 'short'
  }).formatToParts(testDate)[0].value;
  const monthOptions = {
    [longMarch]: 'long',
    [shortMarch]: 'short',
    '03': '2-digit',
    '3': 'numeric'
  };

  if (formattedMarch !== undefined) {
    monthOptions[formattedMarch] = isMediumFormatStyle ? 'short' : 'long';
  }

  return monthOptions[value];
}

function getSkeleton(skeleton, language) {
  if (ShorthandStyles.find(type => skeleton.includes(type))) {
    const parsed = parseDateStyle(skeleton, language);
    const result = [];
    const symbols = {
      month: 'M',
      year: 'Y',
      day: 'd'
    };
    parsed.forEach(_ref => {
      let [type, option, length] = _ref;

      if (type in symbols) {
        result.push(Array(length).fill(symbols[type]).join(''));
      } else if (type === 'literal') {
        result.push(option);
      }
    });
    return result.join('');
  }

  return skeleton;
}
/**
 *
 * @param skeleton shorthand style for the date concatenated with shorthand style of time. The
 * Shorthand style for both date and time is one of ['full', 'long', 'medium', 'short'].
 * @param language {string} language to parse the date shorthand style
 * @returns {[*,string][]}
 */


function parseDateStyle(skeleton, language) {
  const options = {}; // the skeleton could have two keywords -- one for date, one for time

  const styles = skeleton.split(/\s/).filter(s => s.length);
  options.dateStyle = styles[0];
  if (styles.length > 1) options.timeStyle = styles[1];
  const testDate = new Date(2000, 2, 1, 2, 3, 4);
  const parts = new Intl.DateTimeFormat(language, options).formatToParts(testDate); // oddly, the formatted month name can be different from the standalone month name

  const formattedMarch = parts.find(p => p.type === 'month').value;
  const longMarch = new Intl.DateTimeFormat(language, {
    month: 'long'
  }).formatToParts(testDate)[0].value;
  const shortMarch = new Intl.DateTimeFormat(language, {
    month: 'short'
  }).formatToParts(testDate)[0].value;
  const result = [];
  parts.forEach(_ref2 => {
    let {
      type,
      value
    } = _ref2;
    let option;

    if (type === 'month') {
      option = {
        [formattedMarch]: skeleton === 'medium' ? 'short' : 'long',
        [longMarch]: 'long',
        [shortMarch]: 'short',
        '03': '2-digit',
        '3': 'numeric'
      }[value];
    }

    if (type === 'year') option = {
      '2000': 'numeric',
      '00': '2-digit'
    }[value];
    if (['day', 'hour', 'minute', 'second'].includes(type)) option = value.length === 2 ? '2-digit' : 'numeric';
    if (type === 'literal') option = value;
    if (type === 'dayPeriod') option = 'short';
    result.push([type, option, value.length]);
  });
  return result;
}
/**
 * Parse Date time skeleton into Intl.DateTimeFormatOptions parts
 * Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 */


function parseDateTimeSkeleton(skeleton, language) {
  if (ShorthandStyles.find(type => skeleton.includes(type))) {
    return parseDateStyle(skeleton, language);
  }

  const result = [];
  skeleton.replace(DATE_TIME_REGEX, match => {
    const len = match.length;

    switch (match[0]) {
      // Era
      case 'G':
        result.push(['era', len === 4 ? 'long' : len === 5 ? 'narrow' : 'short', len]);
        break;
      // Year

      case 'y':
        result.push(['year', len === 2 ? '2-digit' : 'numeric', len]);
        break;

      case 'Y':
      case 'u':
      case 'U':
      case 'r':
        throw new RangeError('`Y/u/U/r` (year) patterns are not supported, use `y` instead');
      // Quarter

      case 'q':
      case 'Q':
        throw new RangeError('`q/Q` (quarter) patterns are not supported');
      // Month

      case 'M':
      case 'L':
        result.push(['month', ['numeric', '2-digit', 'short', 'long', 'narrow'][len - 1], len]);
        break;
      // Week

      case 'w':
      case 'W':
        throw new RangeError('`w/W` (week) patterns are not supported');

      case 'd':
        result.push(['day', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'D':
      case 'F':
      case 'g':
        throw new RangeError('`D/F/g` (day) patterns are not supported, use `d` instead');
      // Weekday

      case 'E':
        result.push(['weekday', ['short', 'short', 'short', 'long', 'narrow', 'narrow'][len - 1], len]);
        break;

      case 'e':
        if (len < 4) {
          throw new RangeError('`e..eee` (weekday) patterns are not supported');
        }

        result.push(['weekday', ['short', 'long', 'narrow', 'short'][len - 4], len]);
        break;

      case 'c':
        if (len < 3 || len > 5) {
          throw new RangeError('`c, cc, cccccc` (weekday) patterns are not supported');
        }

        result.push(['weekday', ['short', 'long', 'narrow', 'short'][len - 3], len]);
        break;
      // Period

      case 'a':
        // AM, PM
        result.push(['hour12', true, 1]);
        break;

      case 'b': // am, pm, noon, midnight

      case 'B':
        // flexible day periods
        throw new RangeError('`b/B` (period) patterns are not supported, use `a` instead');
      // Hour

      case 'h':
        result.push(['hourCycle', 'h12']);
        result.push(['hour', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'H':
        result.push(['hourCycle', 'h23', 1]);
        result.push(['hour', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'K':
        result.push(['hourCycle', 'h11', 1]);
        result.push(['hour', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'k':
        result.push(['hourCycle', 'h24', 1]);
        result.push(['hour', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'j':
      case 'J':
      case 'C':
        throw new RangeError('`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead');
      // Minute

      case 'm':
        result.push(['minute', ['numeric', '2-digit'][len - 1], len]);
        break;
      // Second

      case 's':
        result.push(['second', ['numeric', '2-digit'][len - 1], len]);
        break;

      case 'S':
        result.push(['fractionalSecondDigits', len, len]);
        break;

      case 'A':
        throw new RangeError('`S/A` (millisecond) patterns are not supported, use `s` instead');
      // Zone

      case 'O':
        // timeZone GMT-8 or GMT-08:00
        result.push(['timeZoneName', len < 4 ? 'shortOffset' : 'longOffset', len]);
        result.push(['x-timeZoneName', len < 4 ? 'O' : 'OOOO', len]);
        break;

      case 'X': // 1, 2, 3, 4: The ISO8601 varios formats

      case 'x': // 1, 2, 3, 4: The ISO8601 varios formats

      case 'Z':
        // 1..3, 4, 5: The ISO8601 varios formats
        // Z, ZZ, ZZZ should produce -0800
        // ZZZZ should produce GMT-08:00
        // ZZZZZ should produce -8:00 or -07:52:58
        result.push(['timeZoneName', 'longOffset', 1]);
        result.push(['x-timeZoneName', match, 1]);
        break;

      case 'z': // 1..3, 4: specific non-location format

      case 'v': // 1, 4: generic non-location format

      case 'V':
        // 1, 2, 3, 4: time zone ID or city
        throw new RangeError('z/v/V` (timeZone) patterns are not supported, use `X/x/Z/O` instead');

      case '\'':
        result.push(['literal', match.slice(1, -1).replace(/''/g, '\''), -1]);
        break;

      default:
        result.push(['literal', match, -1]);
    }

    return '';
  });
  return result;
}

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/date/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/date/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "datetimeToNumber", ({
  enumerable: true,
  get: function () {
    return _DateParser.datetimeToNumber;
  }
}));
Object.defineProperty(exports, "formatDate", ({
  enumerable: true,
  get: function () {
    return _DateParser.formatDate;
  }
}));
Object.defineProperty(exports, "getSkeleton", ({
  enumerable: true,
  get: function () {
    return _SkeletonParser.getSkeleton;
  }
}));
Object.defineProperty(exports, "numberToDatetime", ({
  enumerable: true,
  get: function () {
    return _DateParser.numberToDatetime;
  }
}));
Object.defineProperty(exports, "parseDate", ({
  enumerable: true,
  get: function () {
    return _DateParser.parseDate;
  }
}));
Object.defineProperty(exports, "parseDefaultDate", ({
  enumerable: true,
  get: function () {
    return _DateParser.parseDefaultDate;
  }
}));

var _DateParser = __webpack_require__(/*! ./DateParser */ "./node_modules/@aemforms/af-formatters/lib/date/DateParser.js");

var _SkeletonParser = __webpack_require__(/*! ./SkeletonParser */ "./node_modules/@aemforms/af-formatters/lib/date/SkeletonParser.js");

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "datetimeToNumber", ({
  enumerable: true,
  get: function () {
    return _index.datetimeToNumber;
  }
}));
exports.format = void 0;
Object.defineProperty(exports, "formatDate", ({
  enumerable: true,
  get: function () {
    return _index.formatDate;
  }
}));
Object.defineProperty(exports, "formatNumber", ({
  enumerable: true,
  get: function () {
    return _NumberParser.formatNumber;
  }
}));
Object.defineProperty(exports, "numberToDatetime", ({
  enumerable: true,
  get: function () {
    return _index.numberToDatetime;
  }
}));
exports.parse = void 0;
Object.defineProperty(exports, "parseDate", ({
  enumerable: true,
  get: function () {
    return _index.parseDate;
  }
}));
Object.defineProperty(exports, "parseDateSkeleton", ({
  enumerable: true,
  get: function () {
    return _index.getSkeleton;
  }
}));
Object.defineProperty(exports, "parseDefaultDate", ({
  enumerable: true,
  get: function () {
    return _index.parseDefaultDate;
  }
}));
Object.defineProperty(exports, "parseNumber", ({
  enumerable: true,
  get: function () {
    return _NumberParser.parseNumber;
  }
}));

var _index = __webpack_require__(/*! ./date/index.js */ "./node_modules/@aemforms/af-formatters/lib/date/index.js");

var _NumberParser = __webpack_require__(/*! ./number/NumberParser.js */ "./node_modules/@aemforms/af-formatters/lib/number/NumberParser.js");

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2022 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/
const getCategory = function (skeleton) {
  const chkCategory = skeleton === null || skeleton === void 0 ? void 0 : skeleton.match(/^(?:(num|date)\|)?(.+)/);
  return [chkCategory === null || chkCategory === void 0 ? void 0 : chkCategory[1], chkCategory === null || chkCategory === void 0 ? void 0 : chkCategory[2]];
};

const format = function (value, locale, skeleton, timezone) {
  const [category, skelton] = getCategory(skeleton);

  switch (category) {
    case 'date':
      // var date = new Date("2011-09-24");
      // console.log(date);
      // Fri Sep 23 2011 20:00:00 GMT-0400 (Eastern Daylight Time)
      // to fix the above issue,
      if (!(value instanceof Date)) {
        // this will take care of time zones other than GMT also
        value = new Date(value.replace(/-/g, '\/').replace(/T.+/, ''));
      }

      return (0, _index.formatDate)(value, locale, skelton, timezone);

    case 'num':
      return (0, _NumberParser.formatNumber)(value, locale, skelton);

    default:
      throw `unable to deduce the format. The skeleton should be date|<format> for date formats and num|<format> for numbers`;
  }
};

exports.format = format;

const parse = function (value, locale, skeleton, timezone) {
  const [category, skelton] = getCategory(skeleton);

  switch (category) {
    case 'date':
      return (0, _index.parseDate)(value, locale, skelton, timezone);

    case 'number':
      return (0, _NumberParser.parseNumber)(value, locale, skelton);

    default:
      throw `unable to deduce the format. The skeleton should be date|<format> for date formats and num|<format> for numbers`;
  }
};

exports.parse = parse;

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/number/NumberParser.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/number/NumberParser.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.formatNumber = formatNumber;
exports.parseDefaultNumber = parseDefaultNumber;
exports.parseNumber = parseNumber;

var _SkeletonParser = __webpack_require__(/*! ./SkeletonParser.js */ "./node_modules/@aemforms/af-formatters/lib/number/SkeletonParser.js");

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2022 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/
function formatNumber(numberValue, language, skeletn) {
  if (skeletn.startsWith('num|')) {
    skeletn = skel.split('|')[1];
  }

  if (!skeletn) return numberValue;
  language = language || "en";
  const {
    options,
    order
  } = (0, _SkeletonParser.parseNumberSkeleton)(skeletn, language);
  return new Intl.NumberFormat(language, options).format(numberValue);
}

function getMetaInfo(language, skel) {
  const parts = {}; // gather digits and radix symbol

  let options = new Intl.NumberFormat(language, {
    style: 'decimal',
    useGrouping: false
  }).formatToParts(9876543210.1);
  parts.digits = options.find(p => p.type === 'integer').value.split('').reverse();
  parts.decimal = options.find(p => p.type === 'decimal').value; // extract type values from the parts

  const gather = type => {
    const find = options.find(p => p.type === type);
    if (find) parts[type] = find.value;
  }; // now gather the localized parts that correspond to the provided skeleton.


  const parsed = (0, _SkeletonParser.parseNumberSkeleton)(skel);
  const nf = new Intl.NumberFormat(language, parsed);
  options = nf.formatToParts(-987654321);
  gather('group');
  gather('minusSign');
  gather('percentSign'); // it's possible to have multiple currency representations in a single value

  parts.currency = options.filter(p => p.type === 'currency').map(p => p.value); // collect all literals.  Most likely a literal is an accounting bracket

  parts.literal = options.filter(p => p.type === 'literal').map(p => p.value);
  options = nf.formatToParts(987654321);
  gather('plusSign');
  gather('exponentSeparator');
  gather('unit');
  return parts;
}

function parseNumber(numberString, language, skel) {
  try {
    // factor will be updated to reflect: negative, percent, exponent etc.
    if (skel.startsWith('num|')) {
      skel = skel.split('|')[1];
    }

    let factor = 1;
    let number = numberString;
    const meta = getMetaInfo(language, skel);
    if (meta.group) number = number.replaceAll(meta.group, '');
    number = number.replace(meta.decimal, '.');
    if (meta.unit) number = number.replaceAll(meta.unit, '');

    if (meta.minusSign && number.includes(meta.minusSign)) {
      number = number.replace(meta.minusSign, '');
      factor *= -1;
    }

    if (meta.percentSign && number.includes(meta.percentSign)) {
      factor = factor / 100;
      number = number.replace(meta.percentSign, '');
    }

    meta.currency.forEach(currency => number = number.replace(currency, ''));
    meta.literal.forEach(literal => {
      if (number.includes(literal)) {
        if (literal === '(') factor = factor * -1;
        number = number.replace(literal, '');
      }
    });
    if (meta.plusSign) number = number.replace(meta.plusSign, '');

    if (meta.exponentSeparator) {
      let e;
      [number, e] = number.split(meta.exponentSeparator);
      factor = factor * Math.pow(10, e);
    }

    const result = factor * number;
    return isNaN(result) ? numberString : result;
  } catch (e) {
    console.dir(e);
    return numberString;
  }
}

function parseDefaultNumber(numberString, language) {
  const currency = currencies[language] || 'USD';
  return parseNumber(numberString, language, `currency/${currency}`);
}

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/number/SkeletonParser.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/number/SkeletonParser.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShorthandStyles = void 0;
exports.parseNumberSkeleton = parseNumberSkeleton;

var _currencies = __webpack_require__(/*! ./currencies.js */ "./node_modules/@aemforms/af-formatters/lib/number/currencies.js");

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2022 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/
const NUMBER_REGEX = // eslint-disable-next-line max-len
/(?:[#]+|[@]+(#+)?|[0]+|[,]|[.]|[-]|[+]|[%]|[¤]{1,4}(?:\/([a-zA-Z]{3}))?|[;]|[K]{1,2}|E{1,2}[+]?|'(?:[^']|'')*')|[^a-zA-Z']+/g;
const options = {
  compactDisplay: ['short', 'long'],
  //valid only when notation is compact
  currency: '',
  // must be provided if the style is currency
  currencyDisplay: ["symbol", 'narrowSymbol', 'code', 'name'],
  currencySign: ['accounting', 'standard'],
  localeMatcher: ['lookup', 'best fit'],
  notation: ['standard', 'scientific', 'engineering', 'compact'],
  numberingSystem: '',
  signDisplay: ['auto', 'always', 'exceptZero', 'negative', 'never'],
  style: ['decimal', 'currency', 'percent', 'unit'],
  unit: '',
  //https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier
  unitDisplay: ['long', 'short', 'narrow'],
  useGrouping: ['always', 'auto', 'min2', false, true],
  roundingMode: '',
  roundingPriority: '',
  roundingIncrement: '',
  trailingZeroDisplay: ['auto', 'stripIfInteger'],
  minimumIntegerDigits: '',
  minimumFractionDigits: '',
  maximumFractionDigits: '',
  minimumSignificantDigits: '',
  maximumSignificantDigits: ''
};
const supportedUnits = ['acre', 'bit', 'byte', 'celsius', 'centimeter', 'day', 'degree', 'fahrenheit', 'fluid-ounce', 'foot', 'gallon', 'gigabit', 'gigabyte', 'gram', 'hectare', 'hour', 'inch', 'kilobit', 'kilobyte', 'kilogram', 'kilometer', 'liter', 'megabit', 'megabyte', 'meter', 'mile', 'mile-scandinavian', 'milliliter', 'millimeter', 'millisecond', 'minute', 'month', 'ounce', 'percent', 'petabyte', 'pound', 'second', 'stone', 'terabit', 'terabyte', 'week', 'yard', 'year'].join('|');
const ShorthandStyles = [/^currency(?:\/([a-zA-Z]{3}))?$/, /^decimal$/, /^integer$/, /^percent$/, new RegExp(`^unit\/(${supportedUnits})$`)];
exports.ShorthandStyles = ShorthandStyles;

function parseNumberSkeleton(skeleton, language) {
  const options = {};
  const order = [];
  let match, index;

  for (index = 0; index < ShorthandStyles.length && match == null; index++) {
    match = ShorthandStyles[index].exec(skeleton);
  }

  if (match) {
    switch (index) {
      case 1:
        options.style = 'currency';
        options.currencyDisplay = 'narrowSymbol';

        if (match[1]) {
          options.currency = match[1];
        } else {
          options.currency = (0, _currencies.getCurrency)(language);
        }

        break;

      case 2:
        const defaultOptions = new Intl.NumberFormat(language, {}).resolvedOptions();
        options.minimumFractionDigits = options.minimumFractionDigits || 2;
        break;

      case 3:
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
        break;

      case 4:
        options.style = 'percent';
        options.maximumFractionDigits = 2;
        break;

      case 5:
        options.style = "unit";
        options.unitDisplay = "long";
        options.unit = match[1];
        break;
    }

    return {
      options,
      order
    };
  }

  options.useGrouping = false;
  options.minimumIntegerDigits = 1;
  options.maximumFractionDigits = 0;
  options.minimumFractionDigits = 0;
  skeleton.replace(NUMBER_REGEX, (match, maxSignificantDigits, currencySymbol, offset) => {
    const len = match.length;

    switch (match[0]) {
      case '#':
        order.push(['digit', len]);

        if ((options === null || options === void 0 ? void 0 : options.decimal) === true) {
          options.maximumFractionDigits = options.minimumFractionDigits + len;
        }

        break;

      case '@':
        if (options !== null && options !== void 0 && options.minimumSignificantDigits) {
          throw "@ symbol should occur together";
        }

        const hashes = maxSignificantDigits || "";
        order.push(['@', len - hashes.length]);
        options.minimumSignificantDigits = len - hashes.length;
        options.maximumSignificantDigits = len;
        order.push(['digit', hashes.length]);
        break;

      case ',':
        if ((options === null || options === void 0 ? void 0 : options.decimal) === true) {
          throw "grouping character not supporting for fractions";
        }

        order.push(['group', 1]);
        options.useGrouping = 'auto';
        break;

      case '.':
        if (options !== null && options !== void 0 && options.decimal) {
          console.error("only one decimal symbol is allowed");
        } else {
          order.push(['decimal', 1]);
          options.decimal = true;
        }

        break;

      case '0':
        order.push('0', len);

        if (options.minimumSignificantDigits || options.maximumSignificantDigits) {
          throw "0 is not supported with @";
        }

        if ((options === null || options === void 0 ? void 0 : options.decimal) === true) {
          options.minimumFractionDigits = len;

          if (!options.maximumFractionDigits) {
            options.maximumFractionDigits = len;
          }
        } else {
          options.minimumIntegerDigits = len;
        }

        break;

      case '-':
        if (offset !== 0) {
          console.error("sign display is always in the beginning");
        }

        options.signDisplay = 'negative';
        order.push(['signDisplay', 1, '-']);
        break;

      case '+':
        if (offset !== 0 && order[order.length - 1][0] === 'E') {
          console.error("sign display is always in the beginning");
        }

        if (offset === 0) {
          options.signDisplay = 'always';
        }

        order.push(['signDisplay', 1, '+']);
        break;

      case '¤':
        if (offset !== 0 && offset !== skeleton.length - 1) {
          console.error("currency display should be either in the beginning or at the end");
        } else {
          options.style = 'currency';
          options.currencyDisplay = ['symbol', 'code', 'name', 'narrowSymbol'][len - 1];
          options.currency = currencySymbol || (0, _currencies.getCurrency)(language);
          order.push(['currency', len]);
        }

        break;

      case '%':
        if (offset !== 0 && offset !== skeleton.length - 1) {
          console.error("percent display should be either in the beginning or at the end");
        } else {
          order.push(['%', 1]);
          options.style = 'percent';
        }

        break;

      case 'E':
        order.push(['E', len]);
        options.style = ['scientific', 'engineering'](len - 1);
        break;

      default:
        console.error("unknown chars" + match);
    }
  });
  return {
    options,
    order
  };
}

/***/ }),

/***/ "./node_modules/@aemforms/af-formatters/lib/number/currencies.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@aemforms/af-formatters/lib/number/currencies.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getCurrency = void 0;

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2022 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.

* Adobe permits you to use and modify this file solely in accordance with
* the terms of the Adobe license agreement accompanying it.
*************************************************************************/
const currencies = {
  'da-DK': 'DKK',
  'de-DE': 'EUR',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'es-ES': 'EUR',
  'fi-FI': 'EUR',
  'fr-FR': 'EUR',
  'it-IT': 'EUR',
  'ja-JP': 'JPY',
  'nb-NO': 'NOK',
  'nl-NL': 'EUR',
  'pt-BR': 'BRL',
  'sv-SE': 'SEK',
  'zh-CN': 'CNY',
  'zh-TW': 'TWD',
  'ko-KR': 'KRW',
  'cs-CZ': 'CZK',
  'pl-PL': 'PLN',
  'ru-RU': 'RUB',
  'tr-TR': 'TRY'
};
const locales = Object.keys(currencies);

const getCurrency = function (locale) {
  if (locales.indexOf(locale) > -1) {
    return currencies[locale];
  } else {
    const matchingLocale = locales.find(x => x.startsWith(locale));

    if (matchingLocale) {
      return currencies[matchingLocale];
    }
  }

  return '';
};

exports.getCurrency = getCurrency;

/***/ }),

/***/ "./src/FormData.js":
/*!*************************!*\
  !*** ./src/FormData.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*******************************************************************************
 * Copyright 2022 Adobe
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
/**
 * Class to represent Adaptive Form data
 */
class AfFormData {
    data;  // keeping public as per AF v1
    contentType;
    attachments;

    /**
     * Creates an instance of AfFormData.
     * @param {object} params - The parameters for initializing the AfFormData object.
     * @param {object} params.data - The form data.
     * @param {string} params.attachments - The attachments.
     * @constructor AfFormData
     */
    constructor(params) {
        this.data = params.data;
        this.contentType = "application/json";
        this.attachments = params.attachments;
    }

    /**
     * Returns the actual form data.
     * @returns {*} The form data.
     */
    getData() {
        return this.data;
    }

    /**
     * Returns the content type of the form data.
     * @returns {string} The content type.
     */
    getContentType() {
        return this.contentType;
    }

    /**
     * Returns the list of attachments.
     * @returns {Array} The attachments.
     */
    getAttachments() {
        return this.attachments;
    }

    /**
     * This returns the html form data representation of adaptive form data. This could be used to submit the adaptive form data to
     * external end point from the client. The HTML form data contains the following the key / value pairs:
     * 1. data -> contains form data represented as string
     * 2. contentType -> contains content type of form data (it would be application/xml or application/json)
     * 2. fileAttachments -> list of blobs containing the file (in case of fileUrl's the type of blob would be application/json)
     * 3. fileAttachmentBindRefs -> list of string containing file bindRef's, this has one to one mapping with fileAttachments
     * @returns {*} The HTML form data.
     */
    toHTMLFormData() {
        let formData = new FormData();
        if (this.contentType) {
            formData.append("contentType", this.contentType);
        }
        formData.append("data", this.data);
        for (let index = 0; index < this.attachments.length; index++) {
            let fileAttachmentWrapper = this.attachments[index];
            // 2nd parameter should be of blob type, hence adding an explicit check here
            // we could have created dataURL for all the files in the client, but this would cause the browser
            // to slow down since it would serialize the binary, hence following the below approach
            if (typeof File !== 'undefined' && fileAttachmentWrapper.data instanceof File) {
                formData.append("fileAttachments", fileAttachmentWrapper.data, fileAttachmentWrapper.name);
            } else {
                // blob is supported on all major browsers
                let urlBlob = new Blob([
                    JSON.stringify({
                        "data" : fileAttachmentWrapper.data,
                        "name" : fileAttachmentWrapper.name,
                        "contentType" : fileAttachmentWrapper.contentType
                    })
                ], { type: 'application/json' });
                formData.append("fileAttachments", urlBlob);
            }
            // af v2 new property name for bindRef is dataRef
            formData.append("fileAttachmentBindRefs", fileAttachmentWrapper.dataRef);
        }
        return formData;
    }

    /**
     * Returns the JavaScript object representation of adaptive form data.
     * @returns {object} The JavaScript object.
     */
    toJsObject() {
        return {
            "data" : this.data,
            "contentType" : this.contentType,
            "attachments" : this.attachments
        }
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AfFormData);

/***/ }),

/***/ "./src/GuideBridge.js":
/*!****************************!*\
  !*** ./src/GuideBridge.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _Response_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Response.js */ "./src/Response.js");
/* harmony import */ var _FormData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FormData.js */ "./src/FormData.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__);
/*******************************************************************************
 * Copyright 2022 Adobe
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






/**
 * The GuideBridge class represents the bridge between an adaptive form and JavaScript APIs.
 */
class GuideBridge {

    /**
     * Map to store the form container views.
     * @member {Object}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #formContainerViewMap = {};
    /**
     * Array to store the guide bridge connect handlers.
     * @member {Array}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #guideBridgeConnectHandlers = [];
    /**
     * Path of the form container.
     * @member {string}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #formContainerPath = "";


    /**
     * Object to store user configurations.
     * @member {Object}
     * @private
     * @memberof GuideBridge
     * @instance
     */
    #userConfig = {};


    /**
     * Predefined key values for user configurations.
     * @member {Object}
     * @memberof GuideBridge
     * @instance
     */
    ConfigKeys = {
        LOCALE_CONFIG: 'localeConfig',
        RENDER_CONFIG: 'renderConfig', // todo: needs to be added
        SUBMIT_CONFIG: 'submitConfig'  // todo: needs to be added
    };

    /**
     * Constructs a new GuideBridge instance.
     * @constructor GuideBridge
     */
    constructor() {
        let customEvent = document.createEvent("CustomEvent");
        customEvent.initCustomEvent(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.GUIDE_BRIDGE_INITIALIZE_START, true, true, {"guideBridge": this});
        window.dispatchEvent(customEvent);
        // Safely handle cross-origin parent window communication
        if (window !== window.parent) {
            try {
                // Try to access parent window
                window.parent.document.getElementById(window.name);
                window.parent.dispatchEvent(customEvent);
            } catch (e) {
                // Silently handle cross-origin security errors
                console.debug('Cross-origin access to parent window blocked');
            }
        }
        let self = this;
        function onFormContainerInitialised(e) {
            let formContainer = e.detail;
            self.#formContainerViewMap[formContainer.getPath()] = formContainer;
            self.#invokeConnectHandlers(formContainer.getPath());
        }
        document.addEventListener(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.FORM_CONTAINER_INITIALISED, onFormContainerInitialised);
    }

    #invokeConnectHandlers(formContainerPath) {
        this.#guideBridgeConnectHandlers.forEach(function (connectHandler) {
            if (connectHandler.formContainerPath === formContainerPath) {
                connectHandler.handler.call(connectHandler.context);
            }
            if (!connectHandler.formContainerPath) {
                //backward compatibility
                connectHandler.handler.call(connectHandler.context);
            }
        });
    }


    /**
     * Returns the string representation of the form data.
     *
     * @param {Object} options - Input options for the getFormDataString API.
     * @param {Function} [options.success] - Callback function that receives the result of the API in case of success.
     * @method
     * @memberof GuideBridge
     */
    getFormDataString(options) {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        (0,_aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__.readAttachments)(formModel).then(attachmentAsObj => {
            let attachmentAsArray = Object.keys(attachmentAsObj).flatMap((key) => attachmentAsObj[key]);
            let formData = new _FormData_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
                "data": JSON.stringify(formModel.exportData()),
                "attachments": attachmentAsArray
            });
            let resultObject = new _Response_js__WEBPACK_IMPORTED_MODULE_1__["default"]({"data": formData});
            if (options && typeof options.success === 'function') {
                options.success(resultObject);
            }
        });
    }


    /**
     * Returns a FormData object containing form data and attachments.
     *
     * @param {Object} options - Input options for the getFormDataObject API.
     * @param {Function} [options.success] - Callback function that receives the result of the API in case of success.
     * @method
     * @memberof GuideBridge
     */
    getFormDataObject(options) {
        this.getFormDataString({success: function (resultObject) {
            if (options && typeof options.success === 'function') {
                options.success(resultObject);
            }
        }});
    }

    /**
     * Returns the Form Instance associated with the GuideBridge.
     * Can return null if no form instance is found.
     *
     * @returns {null|Object} - The Form Instance associated with the GuideBridge.
     * @method
     * @memberof GuideBridge
     */
    getFormModel() {
        if (this.#formContainerPath) {
            return this.#formContainerViewMap[this.#formContainerPath]? this.#formContainerViewMap[this.#formContainerPath].getModel() : null;
        } else {
            //choose any form container in case no formContainerPath is provided in GuideBridge#connect API
            const formContainerPath = this.#getFormContainerPath();
            this.#formContainerPath = formContainerPath;
            return this.#formContainerViewMap[formContainerPath] ? this.#formContainerViewMap[formContainerPath].getModel(): null;
        }
    }

    /**
     * Retrieves the path of the form container.
     * @returns {string} The path of the form container.
     * @method
     * @memberof GuideBridge
     * @private
     */
    #getFormContainerPath() {
        let actualFormContainerPath = this.#formContainerPath;
        if (!actualFormContainerPath) {
            for(let formContainerPath in this.#formContainerViewMap) {
                if(this.#formContainerViewMap.hasOwnProperty(formContainerPath)) {
                    actualFormContainerPath =  formContainerPath;
                }
            }
        }
        return actualFormContainerPath;
    }

    /**
     * Validates the Adaptive Form.
     *
     * @returns {boolean} - True if the form is valid, false otherwise.
     * @method
     * @memberof GuideBridge
     */
    validate() {
        let formModel = this.getFormModel();
        if (!formModel) {
            throw new Error("formModel is not defined");
        }
        let validationErrors = formModel.validate();
        return !(validationErrors && validationErrors.length > 0);
    }

    /**
     * Specify a callback function which is called/notified when Adaptive Form gets initialized. After Adaptive
     * Form is initialized GuideBridge is ready for interaction and one can call any API.
     *
     * The callback can also be registered after the Form gets initialized. In that case, the callback will be
     * called immediately.
     *
     * @summary Register a callback to be executed when the Adaptive Form gets initialized
     * @param handler {function} function that would be called when guideBridge is ready for interaction. The
     * signature of the callback should be
     * ```
     * function() {
     *     // app specific code here
     * }
     * ```
     * @param {object} [context] _this_ object in the callback function will point to context
     * @param formContainerPath optional param. It captures the form container you want the GuideBridge APIs to interact with.
     * @example
     * guideBridge.connect(function() {
     *    console.log("Hurrah! Guide Bridge Activated");
     * })
     *
     * @method
     * @memberof GuideBridge
     */
    connect(handler, context, formContainerPath) {
        context = context || this;
        if (formContainerPath) {
            this.#formContainerPath = formContainerPath;
        }
        if (!handler) {
            throw new Error("handler arg is null");
        }
        if (this.isConnected()) {
            handler.call(context);
        } else {
            this.#guideBridgeConnectHandlers.push({
                handler,
                context,
                formContainerPath
            });
        }
    }

    /**
     * All GuideBridge APIs (except {@link GuideBridge#connect|connect}) require Adaptive Form to be initialized.
     * Checking the return value of this API is not necessary if guideBridge API is called only after the
     * <a href="#wait-form-ready">Form is initialized</a>
     * @summary Whether the Adaptive Form has been initialized or not
     *
     * @returns {boolean} true if the Adaptive Form is ready for interaction, false otherwise
     * @method
     * @memberof GuideBridge
     */
    isConnected() {
        return !!this.getFormModel();
    }

    /**
     * @summary Disables the adaptive form, i.e. it disables all the fields and buttons.
     * @method
     * @memberof GuideBridge
     */
    disableForm() {
        let formModel = this.getFormModel();
        if (formModel) {
            formModel.enabled = false;
        } else {
            throw new Error("formModel is not defined");
        }
    }

    /**
     * Resets the adaptive form, clearing all entered values.
     * @method
     * @memberof GuideBridge
     */
    reset() {
        let formModel = this.getFormModel();
        if (formModel) {
            formModel.dispatch({type: 'reset'});
        } else {
            throw new Error("formModel is not defined");
        }
    }

    /**
     * @summary Hides all the submit buttons present in the Adaptive Form
     * @method
     * @memberof GuideBridge
     *
     */
    hideSubmitButtons() {
        if (this.isConnected()) {
            this.#hideButtons('submit');
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * @summary Hides all the reset buttons present in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideResetButtons() {
        if (this.isConnected()) {
            this.#hideButtons('reset');
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * Hides buttons of the specified type in the Adaptive Form.
     *
     * @param {string} buttonType - The type of buttons to hide (e.g., 'submit', 'reset').
     * @private
     * @method
     * @memberof GuideBridge
     */
    #hideButtons(buttonType) {
        let formModel = this.getFormModel();
        formModel.visit((field) => {
            if (field.properties["fd:buttonType"] === buttonType) {
                field.visible = false;
                field.subscribe((action) => {
                    let state = action.target.getState();
                    const changes = action.payload.changes;
                    changes.forEach(change => {
                        if (change.propertyName === 'visible' && change.currentValue) {
                            field.visible = false;
                        }
                    })
                });
            }
        })
    }

    /**
     * Hides all the save buttons present in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideSaveButtons() {
        //TODO: implement it later. NO-OP for now.
    }

    /**
     * Hides the summary panel in the Adaptive Form.
     * @method
     * @memberof GuideBridge
     */
    hideSummaryPanel() {
        //TODO: implement it later. NO-OP for now.
    }

    /**
     * Triggers an event on the GuideBridge object.
     *
     * @param {string} eventName - The name of the event to trigger on GuideBridge.
     * @param {any} eventPayload - The payload to be passed with the event.
     * @param {string} [formContainerPath] - If no argument is passed, use any form container.
     *
     * @method
     * @memberof GuideBridge
     */
    trigger(eventName, eventPayload, formContainerPath) {
        let formContainer;
        if (formContainerPath) {
            formContainer = this.#formContainerViewMap[formContainerPath];
        } else {
            formContainer = this.#formContainerViewMap[this.#getFormContainerPath()];
        }
        if (formContainer && formContainer.getFormElement()) {
            const formElement = formContainer.getFormElement();
            formElement.dispatchEvent(new CustomEvent(eventName, {detail: eventPayload}));
        }
    }

    /**
     * @method
     * @memberof GuideBridge
     * @summary Adds an event listener for events triggered by the GuideBridge object.
     * The subscriber must first be connected to GuideBridge to be able to use this API.
     *
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} handler - The event handler function.
     */
    on(eventName, handler) {
        if (this.isConnected()) {
            const formContainer = this.#formContainerViewMap[this.#formContainerPath];
            if (formContainer && formContainer.getFormElement()) {
                const formElement = formContainer.getFormElement();
                formElement.addEventListener(eventName, handler);
            }
        } else {
            throw new Error("GuideBridge is not connected");
        }
    }

    /**
     * Register a configuration for a specific key.
     * @param {string} key - The key for which to register the configuration.
     * @param {Object|Function} config - The configuration object or function.
     * @returns {Array} - An array of configurations associated with the key.
     * @example
     *
     * // Register a function configuration for additional behavior
     * guideBridge.registerConfig(guideBridge.ConfigKeys.LOCALE_CONFIG, () => console.log('Function config'));
     */
    registerConfig(key, config) {
        if (!this.#userConfig[key]) {
            this.#userConfig[key] = [];
        }
        const configEntry = typeof config === 'function' ?
            { fn: config, formContainerPath : this.#formContainerPath } :
            { ...config, formContainerPath : this.#formContainerPath };
        this.#userConfig[key].push(configEntry);
        return this.#userConfig[key];
    }


    /**
     * Given a qualifiedName, returns the form element model having the same qualified name.
     * @param {string} qualifiedName qualified name of the Adaptive Form component
     * @returns form element model having the same qualified name or null if not found
     */
    resolveNode(qualifiedName) {
        let formModel = this.getFormModel();
        return formModel.resolveQualifiedName(qualifiedName);
    }

    /**
     * Get configurations associated with a specific key.
     * @param {string} key - The key for which to retrieve configurations.
     * @returns {Array} - An array of configurations associated with the key.
     */
    getConfigsForKey(key) {
        return this.#userConfig[key] || [];
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GuideBridge);




/***/ }),

/***/ "./src/HTTPAPILayer.js":
/*!*****************************!*\
  !*** ./src/HTTPAPILayer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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



/**
 * @module FormView
 */

/**
 * HTTP API layer for interacting with server-side APIs.
 */
class HTTPAPILayer {

    /**
     * Constant representing the request parameter key for data reference.
     * @type {string}
     */
    static REQ_PARAMETER_DATA_REF = "dataRef";

    /**
     * Retrieves the form model for the specified form container path using the open api
     * @param {string} formContainerPath - The path of the form container.
     * @returns {Promise<Object|null>} - A Promise that resolves to the form model or null if there was an error.
     * @see {@link https://opensource.adobe.com/aem-forms-af-runtime/api/#tag/Get-Form-Definition} - API documentation
     */
    static async getForm(formContainerPath) {
        const guideContainerIndex = formContainerPath.indexOf("/jcr:content/guideContainer");
        let _formPath = formContainerPath;
        if (guideContainerIndex !== -1) {
            _formPath = formContainerPath.substring(0, guideContainerIndex);
        }
        const _formsList =  await this.#getFormsList();
        if (_formsList) {
            return await this.#findForm(_formPath, _formsList);
        } else {
            //TODO: throw errors once API is available on Circle CI set up
            console.debug("Error in fetching form");
        }
    }

    /**
     * Retrieves the form definition for the specified form container path using the json exporter API
     * @param {string} formContainerPath - The path of the form container.
     * @param {string} pageLang - Language of the containing sites page
     * @returns {Promise<Object>} - A Promise that resolves to the form definition.
     */
    static async getFormDefinition(formContainerPath, pageLang) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        let lang = null;
        if ('afAcceptLang' in params) {
            lang = `${params['afAcceptLang']}`
        } else {
            // check for selector in the URL
            const parts = window.location.pathname.split('.');
            if (parts?.length >= 3) {
                lang = `${parts[parts.length - 2]}`;
            }
        }
        // If 'afAcceptLang' is not set and URL selector is not present, use sites page language
        if (lang === null && pageLang != null) {
            lang = pageLang;
        }
        return await this.getJson(`${formContainerPath}.model.${lang !== null ? `${lang}.` : ""}json${this.REQ_PARAMETER_DATA_REF in params ? `?${this.REQ_PARAMETER_DATA_REF}=${params[this.REQ_PARAMETER_DATA_REF]}` : ''}`);
    }

    /**
     * Recursive function to find a specific form in the forms list.
     * @param {string} formPath - The path of the form.
     * @param {Object} formsList - The list of forms.
     * @returns {Promise<Object|null>} - A Promise that resolves to the found form or null if not found.
     * @private
     */
    static async #findForm(formPath, formsList) {
        const _form = formsList.items.find((form) => {return form.path === formPath});
        if (_form) {
            return _form;
        } else if (formsList.cursor) {
            const _nextList = await this.#getFormsList(formsList.cursor);
            return await this.#findForm(formPath, _nextList);
        } else {
            //TODO: throw errors once API is available on Circle CI set up
            console.debug("Form at " + formPath +  " Not Found");
        }
    }

    /**
     * Retrieves the list of forms.
     * @returns {Promise<Object>} - A Promise that resolves to the list of forms.
     * @private
     */
    static async #getFormsList(cursor = "") {
        return await this.getJson(`${_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.API_PATH_PREFIX}/listforms?cursor=${cursor}`);
    }

    /**
     * Retrieves the prefill data for the specified form and parameters.
     * @param {string} formId - The ID of the form.
     * @param {Object} params - The parameters for prefilling the form.
     * @returns {Promise<Object>} - A Promise that resolves to the prefill data.
     * @see {@link https://opensource.adobe.com/aem-forms-af-runtime/api/#tag/Get-Form-Data} - API documentation
     */
    static async getPrefillData(formId, params) {
        return await this.getJson(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.API_PATH_PREFIX + "/data/" + formId + "?" + Object.keys(params).map(p => p+"="+params[p]).join("&"));
    }

    /**
     * Retrieves JSON data from the specified URL.
     * @param {string} url - The URL to fetch JSON data from.
     * @returns {Promise<Object|null>} - A Promise that resolves to the fetched JSON data or null if there was an error.
     */
    static async getJson(url) {
        // prefix context path in url
        let urlWithContextPath = `${_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].getContextPath()}${url}`
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', urlWithContextPath, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                let status = xhr.status;
                if (status === 200) {
                    resolve(xhr.response);
                } else {
                    resolve(null);
                }
            };
            xhr.send();
        });
    }

    /**
     * Retrieves the custom function configuration for the specified form ID.
     * @param {string} formId - The ID of the form.
     * @returns {Promise<Object>} - A Promise that resolves to the custom function configuration.
     */
    static async getCustomFunctionConfig(formId) {
        return await this.getJson(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.API_PATH_PREFIX + "/customfunctions/" + formId);
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTTPAPILayer);


/***/ }),

/***/ "./src/LanguageUtils.js":
/*!******************************!*\
  !*** ./src/LanguageUtils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HTTPAPILayer.js */ "./src/HTTPAPILayer.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__);
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





/**
 * @module FormView
 */

/**
 * Utility class for language-related operations.
 */
class LanguageUtils {
    /**
     * Internal map to store loaded language data.
     * @type {Object.<string, Object>}
     * @private
     */
    static #langData = {};

    /**
     * Load language data from the given URL.
     * @param {string} lang - The language.
     * @param {string} url - The URL of the language strings.
     * @returns {Promise<void>} A promise that resolves when the language data is loaded.
     * @fires module:FormView~Constants#FORM_LANGUAGE_INITIALIZED
     */
    static async loadLang(lang, url, executeConfigsAndFireEvent = false) {
        // someone can override the product locale as well, hence not adding this check --- if (!(lang in this.#langData))
        const _langData = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getJson(url);
        if(_langData) {
            console.debug("fetched language data", _langData);
            this.#langData[lang] = _langData;
            (0,_aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.setCustomDefaultConstraintTypeMessages)(_langData);
        }
        if (executeConfigsAndFireEvent) {
            await this.#executeLanguageConfigs(lang);
            const event = new CustomEvent(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.FORM_LANGUAGE_INITIALIZED, {"detail": lang});
            document.dispatchEvent(event);
        }
    }

    /**
     * Execute language-specific configuration functions for the given language.
     * @param {string} lang - The language code for which to execute configurations.
     * @private
     * @static
     * @async
     */
    static async #executeLanguageConfigs(lang) {
        let functionConfigs = guideBridge.getConfigsForKey(guideBridge.ConfigKeys.LOCALE_CONFIG) || [];
        functionConfigs = functionConfigs.map(configEntry => configEntry.fn).filter(fn => typeof fn === 'function');
        for (const fn of functionConfigs) {
            await fn(lang);
        }
    }



    /**
     * Returns the translated string for the given language and key.
     * @param {string} lang - The language.
     * @param {string} key - The key for which the translation needs to be fetched.
     * @param {string[]} snippets - An array of template values.
     * @returns {string} The translated string.
     */
    static getTranslatedString(lang, key, snippets) {
        let translatedText = "";
        if (lang in this.#langData)
        {
            translatedText = this.#langData[lang][key];
            if (snippets) {
                //resolve message with snippet
                translatedText = translatedText.replace(/\${(\d+)}/g, function (match, number) {
                    return typeof snippets[number] != 'undefined'
                        ? snippets[number]
                        : match;
                });
            }
        }
        return translatedText;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LanguageUtils);


/***/ }),

/***/ "./src/Response.js":
/*!*************************!*\
  !*** ./src/Response.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*******************************************************************************
 * Copyright 2022 Adobe
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

/**
 * @module FormView
 */

/**
 * Represents a response object with message and error information.
 */
class Response {

    /**
     * The array of messages.
     * @type {string[]}
     */
    #message;
    /**
     * The array of messages.
     * @type {string[]}
     */
    #errorCode;
    /**
     * The array of SOM expressions. (deprecated)
     * @type {any[]}
     */
    #somExpression;
    /**
     * The array of qualified names.
     * @type {any[]}
     */
    #qualifiedName;

    /**
     * Constructs a new Response object.
     * @param {Object} params - The parameters for constructing the Response.
     * @param {any} params.data - The data associated with the Response.
     */
    constructor(params) {
        this.errors = false;
        this.data = params.data;
        this.#message = [];
        this.#errorCode = [];
        this.#somExpression = []; //deprecated
        this.#qualifiedName = this.#somExpression;
    }

    /**
     * Adds a message to the response.
     * @param {number} code - The error code.
     * @param {string} msg - The message.
     * @param {any} som - The SOM expression. (deprecated)
     */
    addMessage(code, msg, som) {
        this.errors = true;
        this.#message.push(msg);
        this.#somExpression.push(som);
        this.#errorCode.push(code);
    };

    /**
     * Retrieves the next message from the response.
     * @returns {Object|null} An object containing the error code, SOM expression (deprecated),
     * qualified name, and message; or null if there are no more messages.
     */
    getNextMessage () {
        if (this.#errorCode.length === 0) {
            return null;
        }
        let somExpression = this.#somExpression.pop();
        return {
            code : this.#errorCode.pop(),
            somExpression : somExpression, //deprecated
            qualifiedName: somExpression,
            message : this.#message.pop()
        };
    };

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Response);




/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Constants: () => (/* binding */ Constants)
/* harmony export */ });
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__);
/*******************************************************************************
 * Copyright 2022 Adobe
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


/**
 * @module FormView
 */

/**
 * Constants for the core components.
 * @exports FormView/Constants
 * @namespace Constants
 */
const Constants = {
    /**
     * Namespace of the data-attribute. Any data attribute will be prefixed with this name.
     * i.e. data-name would be data-{NS}-{ComponentClass}-name. Each component will have a different component class.
     * @type {string}
     */
    NS : "cmp",

    /**
     * Event triggered when a Form container is initialized.
     * @event module:FormView~Constants#FORM_CONTAINER_INITIALISED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of FormContainer that is initialized.
     * @example
     * document.addEventListener("AF_FormContainerInitialised" , function(event) {
     *      var formContainer = event.detail;
     *      // Handle the event
     * });
     */
    FORM_CONTAINER_INITIALISED : "AF_FormContainerInitialised",

    /**
     * Event triggered when a panel instance view is added.
     * @event module:FormView~Constants#PANEL_INSTANCE_ADDED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of child view that is added.
     * @example
     * document.addEventListener("AF_FormContainerInitialised" , function(event) {
     *      var formContainer = event.detail;
     *      // Handle the event
     *      formcontainer.getFormElement().addEventListener("AF_PanelInstanceAdded" , function(event) {
     *          var childView = event.detail;
     *          // Handle the event
     *       });
     * });
     *
     */
    PANEL_INSTANCE_ADDED : "AF_PanelInstanceAdded",

    /**
     * Event triggered when a panel instance view is removed.
     * @event module:FormView~Constants#PANEL_INSTANCE_REMOVED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of child view that was removed.
     * @example
     * document.addEventListener("AF_FormContainerInitialised" , function(event) {
     *      var formContainer = event.detail;
     *      // Handle the event
     *      formcontainer.getFormElement().addEventListener("AF_PanelInstanceRemoved" , function(event) {
     *          var childView = event.detail;
     *          // Handle the event
     *      });
     * });
     */
    PANEL_INSTANCE_REMOVED : "AF_PanelInstanceRemoved",

    /**
     * Event triggered when the clientlibs for the locale passed have finished loading.
     * @event module:FormView~Constants#FORM_LANGUAGE_INITIALIZED
     * @property {object} event - The event object.
     * @property {object} event.detail - The locale that has loaded.
     * @example
     * document.addEventListener("AF_LanguageInitialised" , function(event) {
     *      var locale = event.detail;
     *      // Handle the event
     * });
     */
    FORM_LANGUAGE_INITIALIZED: "AF_LanguageInitialised",

    /**
     * Event triggered when focus is changed on a form element
     * @event module:FormView~Constants#ELEMENT_FOCUS_CHANGED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element which is in focus
     * @property {string} event.detail.fieldId - The ID of the current field in focus
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @property {string} event.detail.fieldQualifiedName - The qualified name of the field
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_FOCUS_CHANGED" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onFocusChange = (event) => {
     *          console.log(event.detail.fieldId) // id of the field in focus
     *          console.log(event.detail.formTitle)
     *      };
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementFocusChanged", onFocusChange);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementFocusChanged", onFocusChange);
     *           });
     *      }
     */
    ELEMENT_FOCUS_CHANGED : "elementFocusChanged",


    /**
     * Event triggered when help is shown on a form element
     * @event module:FormView~Constants#ELEMENT_HELP_SHOWN
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which help was shown.
     * @property {string} event.detail.fieldId - The ID of the field on which the help was shown.
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @property {string} event.detail.fieldQualifiedName - The qualified name of the field
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_HELP_SHOWN" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onHelpShown = (event) => {
     *          console.log(event.detail.fieldId) // id of the field on which help was shown
     *          console.log(event.detail.formTitle)
     *      };
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementHelpShown", onHelpShown);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementHelpShown", onHelpShown);
     *           });
     *      }
     */
    ELEMENT_HELP_SHOWN : "elementHelpShown",


    /**
     * Event triggered when error is shown on a form element.
     * @event module:FormView~Constants#ELEMENT_ERROR_SHOWN
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which error was shown
     * @property {string} event.detail.fieldId - The ID of the field on which the error was shown.
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @property {string} event.detail.fieldQualifiedName - The qualified name of the field
     * @property {string} event.detail.validationMessage - The validation message shown on the field
     * @property {string} event.detail.validationType    - The type of validation which failed on field as per, https://opensource.adobe.com/aem-forms-af-runtime/js-docs/README.html#constrainttype
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_ERROR_SHOWN" event.
     *      // For a complete example, refer to: https://github.com/adobe/aem-core-forms-components/blob/master/ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/af-commons/v1/datalayer/datalayer.js
     *      const onErrorShown = (event) => {
     *          console.log(event.detail.fieldId) // id of the field on which error was shown
     *          console.log(event.detail.formTitle)
     *      };
     *      if (window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementErrorShown", onErrorShown);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementErrorShown", onErrorShown);
     *           });
     *      }
     */
    ELEMENT_ERROR_SHOWN : "elementErrorShown",

    /**
     * Event triggered when value is change of a form element
     * @event module:FormView~Constants#ELEMENT_VALUE_CHANGED
     * @property {object} event - The event object.
     * @property {object} event.detail - Instance of form element on which error was shown
     * @property {string} event.detail.fieldId - The ID of the field on which the value has changed
     * @property {string} event.detail.formId - The ID of the form.
     * @property {string} event.detail.fieldName - The name of the form.
     * @property {string} event.detail.panelName - The name of the panel (ie parent of the form element).
     * @property {string} event.detail.formTitle - The title of the form.
     * @property {string} event.detail.fieldQualifiedName - The qualified name of the field
     * @property {string} event.detail.prevText - Previous value of the form element
     * @property {string} event.detail.newText - Current value of the form element
     * @example
     *      // Sample usage:
     *      // The following code snippet demonstrates how to use the "ELEMENT_VALUE_CHANGED" event.
     *      const onValueChange = (event) => {
     *          console.log(event.detail.fieldId) // id of the form element on which value has changed
     *          console.log(event.detail.formTitle)
     *      };
     *      if (window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *              bridge.on("elementValueChanged", onValueChange);
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *               bridge.on("elementValueChanged", onValueChange);
     *           });
     *      }
     */
    ELEMENT_VALUE_CHANGED : "elementValueChanged",

    /**
     * Data attribute to store the form container path. In HTML, it will be namespaced as data-{NS}-{ComponentClass}-adaptiveformcontainerPath.
     * @type {string}
     */
    FORM_CONTAINER_DATA_ATTRIBUTE: "adaptiveformcontainerPath",

    /**
     * Data attribute to be added on clickable element to repeat a repeatable panel.
     * @type {string}
     */
    DATA_HOOK_ADD_INSTANCE:"data-cmp-hook-add-instance",

    /**
     * Data attribute to be added on element to remove a repeatable panel.
     * @type {string}
     */
    DATA_HOOK_REMOVE_INSTANCE:"data-cmp-hook-remove-instance",

    /**
     * Data attribute to mark the dragged component valid or invalid.
     * Value true for valid, value false for invalid.
     * @type {string}
     */
    DATA_ATTRIBUTE_VALID : "data-cmp-valid",

    /**
     * Data attribute to mark the dragged component enabled or disabled.
     * Value true for enabled, value false for disabled.
     * @type {string}
     */
    DATA_ATTRIBUTE_ENABLED : "data-cmp-enabled",

    /**
     * Data attribute to mark the dragged component visible or invisible.
     * Value true for visible, value false for invisible.
     * @type {string}
     */
    DATA_ATTRIBUTE_VISIBLE : "data-cmp-visible",

    /**
     * Data attribute to mark the dragged component required or not.
     * Value true for required, value false for not required.
     * @type {string}
     */
    DATA_ATTRIBUTE_REQUIRED : "data-cmp-required",

    /**
     * Data attribute to mark the dragged component readonly or not.
     * Value true for readonly, value false for not readonly.
     * @type {string}
     */
    DATA_ATTRIBUTE_READONLY : "data-cmp-readonly",

    /**
     * Data attribute to mark the dragged component active or inactive.
     * Value true for active, value false for inactive.
     * @type {string}
     */
    DATA_ATTRIBUTE_ACTIVE : "data-cmp-active",

    /**
     * ARIA attribute to mark the dragged component disabled.
     * @type {string}
     */
    ARIA_DISABLED : "aria-disabled",

    /**
     * ARIA attribute to mark the dragged component hidden.
     * @type {string}
     */
    ARIA_HIDDEN : "aria-hidden",

    /**
     * ARIA attribute to mark the dragged component invalid.
     * @type {string}
     */
    ARIA_INVALID : "aria-invalid",

    /**
     * ARIA attribute to mark the dragged component checked.
     * @type {string}
     */
    ARIA_CHECKED : "aria-checked",

    /**
     * ARIA attribute to mark component selected.
     * @type {string}
     */
    ARIA_SELECTED : "aria-selected",

    /**
     * Event triggered when GuideBridge initialization begins.
     * @event module:FormView~Constants#GUIDE_BRIDGE_INITIALIZE_START
     * @property {object} event - The event object.
     * @property {object} event.detail.guideBridge - The guideBridge {@link GuideBridge} object
     * @type {string}
     * @example
     *      if(window.guideBridge !== undefined){
     *              bridge = window.guideBridge;
     *      } else {
     *           window.addEventListener("bridgeInitializeStart", (event)=>{
     *               bridge = event.detail.guideBridge;
     *           });
     *      }
     */
    GUIDE_BRIDGE_INITIALIZE_START: "bridgeInitializeStart",

    /**
     * HTML attributes.
     * @type {object}
     * @memberof module:FormView~Constants
     * @namespace HTML_ATTRS
     */
    HTML_ATTRS : {
        /**
         * Attribute to mark the dragged component disabled.
         * @type {string}
         */
        DISABLED : "disabled",

        /**
         * Attribute to mark the dragged component checked.
         * @type {string}
         */
        CHECKED : "checked"
    },

    /**
     * Tab index attribute.
     * @type {string}
     */
    TABINDEX : "tabindex",

    /**
     * Aria Current attribute.
     * @type {string}
     */
    ARIA_CURRENT : "aria-current",


    /**
     * Prefix path for all AF HTTP APIs.
     * @type {string}
     */
    API_PATH_PREFIX : "/adobe/forms/af",

    /**
     * Field type object.
     * @type {object}
     * @memberof module:FormView~Constants
     * @namespace FIELD_TYPE
     */
    FIELD_TYPE: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__.FIELD_TYPE
};



/***/ }),

/***/ "./src/customFunctions.js":
/*!********************************!*\
  !*** ./src/customFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customFunctions: () => (/* binding */ customFunctions)
/* harmony export */ });
/* harmony import */ var _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aemforms/af-custom-functions */ "./node_modules/@aemforms/af-custom-functions/src/index.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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



/**
 * @module FormView
 */

/**
 * Namespace for custom functions.
 * @description Contains custom functions which can be used in the rule editor.
 * @exports FormView/customFunctions
 * @namespace customFunctions
 */
const customFunctions = {
    /**
     * Converts a JSON string to an object.
     * @param {string} str - The JSON string to convert to an object.
     * @returns {object} - The parsed JSON object. Returns an empty object if an exception occurs.
     */
    toObject: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.toObject,

    /**
     * Prefixes the URL with the context path.
     * @param {string} url - The URL to externalize.
     * @returns {string} - The externalized URL.
     */
    externalize: (url) => {
        // Check if Granite.HTTP.externalize is available, otherwise return the original URL
        if (window?.Granite?.HTTP && typeof window.Granite.HTTP.externalize === "function") {
            return window.Granite.HTTP.externalize(url);
        } else {
            return url;
        }
    },

    /**
     * Validates if the given URL is correct.
     * @param {string} url - The URL to validate.
     * @returns {boolean} - True if the URL is valid, false otherwise.
     */
    validateURL: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.validateURL,

    /**
     * Navigates to the specified URL.
     * @param {string} destinationURL - The URL to navigate to. If not specified, a new blank window will be opened.
     * @param {string} destinationType - The type of destination. Supports the following values: "_newwindow", "_blank", "_parent", "_self", "_top", or the name of the window.
     * @returns {Window} - The newly opened window.
     */
    navigateTo: (destinationURL, destinationType) => _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.navigateTo(customFunctions.externalize(destinationURL), destinationType),

    /**
     * Default error handler for the invoke service API.
     * @param {object} response - The response body of the invoke service API.
     * @param {object} headers - The response headers of the invoke service API.
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultErrorHandler: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.defaultErrorHandler,

    /**
     * Handles the success response after a form submission.
     *
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultSubmitSuccessHandler: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.defaultSubmitSuccessHandler,

    /**
     * Handles the error response after a form submission.
     *
     * @param {string} defaultSubmitErrorMessage - The default error message.
     * @param {object} globals - An object containing form instance and invoke method to call other custom functions.
     * @returns {void}
     */
    defaultSubmitErrorHandler: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.defaultSubmitErrorHandler,

    /**
     * Fetches the captcha token for the form.
     *
     * This function uses the Google reCAPTCHA Enterprise service to fetch the captcha token.
     *
     * @async
     * @param {object} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
     * @returns {string} - The captcha token.
     */
    fetchCaptchaToken: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.fetchCaptchaToken,

    /**
     * Converts a date to the number of days since the Unix epoch (1970-01-01).
     *
     * If the input date is a number, it is assumed to represent the number of days since the epoch,
     * including both integer and decimal parts. In this case, only the integer part is returned as the number of days.
     *
     * @param {string|Date|number} date - The date to convert.
     * Can be:
     * - An ISO string (yyyy-mm-dd)
     * - A Date object
     * - A number representing the days since the epoch, where the integer part is the number of days and the decimal part is the fraction of the day
     *
     * @returns {number} - The number of days since the Unix epoch
     */
    dateToDaysSinceEpoch: _aemforms_af_custom_functions__WEBPACK_IMPORTED_MODULE_0__.dateToDaysSinceEpoch
};


/***/ }),

/***/ "./src/handleXfa.js":
/*!**************************!*\
  !*** ./src/handleXfa.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadXfa: () => (/* binding */ loadXfa)
/* harmony export */ });
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

function loadXfa(formdom, renderContext) {
    if (window.xfalib) {
        formBridge.registerConfig("disabledServerScripts", ["initialize", "$formready", "$layoutready"])
        const xfaJson = JSON.parse(JSON.parse(JSON.stringify(formdom)));
        xfalib.runtime.renderContext = JSON.parse(JSON.parse(JSON.stringify(renderContext)));
        xfalib.script.XfaModelRegistry.prototype.createModel(xfaJson);
        //initialize Acrobat specific scripts
        new xfalib.acrobat.Acrobat();
        return function (model) {
            model._syncXfaProps();
            xfalib.runtime.xfa.form._initialize(true);
            $(window).trigger("XfaInitialized");
        }
    }
}


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HTTPAPILayer.js */ "./src/HTTPAPILayer.js");
/* harmony import */ var _customFunctions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./customFunctions.js */ "./src/customFunctions.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _handleXfa__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handleXfa */ "./src/handleXfa.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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







/**
 * @module FormView
 */

/**
 * Utility class with various helper functions.
 * These functions provide various utility operations related to form model creation and management.
 */
class Utils {
    /**
     * The context path.
     * @private
     * @type {string}
     */
    static #contextPath = "";
    /**
     * Object of field creator sets.
     * @private
     */
    static #fieldCreatorSets = {};
    /**
     * The array of field creator order.
     * This is to store the insertion order
     * @private
     * @type {String[]}
     */
    static #fieldCreatorOrder = [];

    /**
     * Returns the data attributes of the specific element.
     * Ignores "data-cmp-is-*" and "data-cmp-hook-*" attributes.
     * @param {Element} element - The element to read data attributes from.
     * @param {string} clazz - The class name.
     * @returns {Object} The data attributes.
     */
    static readData(element, clazz) {
        const data = element.dataset;
        let options = {};
        const reserved = ["is"];
        //clazz is never passed, do we need this?
        if (clazz) {
            const capitalized = clazz.charAt(0).toUpperCase() + clazz.substring(1);
            reserved.push("hook" + capitalized);
        }

        for (let key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                let value = data[key];
                if (key.indexOf(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.NS) === 0) {
                    key = key.slice(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);
                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }
        return options;
    }

    /**
     * Registers the mutation observer for a form component.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     * @param {Function} fieldCreator - The function to create a field.
     * @param {string} fieldSelector - The field selector.
     * @param {string} dataAttributeClass - The data attribute class.
     */
    static registerMutationObserver(formContainer, fieldCreator, fieldSelector, dataAttributeClass) {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function (addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(fieldSelector));
                            Utils.#createFormContainerFields(elementsArray, fieldCreator, formContainer);
                        }
                    });
                }
            });
        });

        const pathAttr = '[data-cmp-path="' + formContainer.getPath() + '"]';
        const formContainerElement = document.querySelector(pathAttr);
        observer.observe(formContainerElement, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    /**
     * Creates fields from given elements of fieldCreator, for given form container.
     * @private
     * @param {Element[]} fieldElements - The field elements.
     * @param {Function} fieldCreator - The function to create a field.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static #createFormContainerFields(fieldElements, fieldCreator, formContainer) {
        for (let i = 0; i < fieldElements.length; i++) {
            const elementId = fieldElements[i].id;
            const formPathInField = fieldElements[i].getAttribute('data-cmp-adaptiveformcontainer-path');
            const formPath = formContainer.getFormElement().getAttribute('data-cmp-path');
            //check if field is already created, to avoid creating a new field for same id
            if (formContainer.getField(elementId) == null && formPathInField == formPath) {
                let field = fieldCreator({
                    "element" : fieldElements[i],
                    "formContainer" : formContainer
                });
                formContainer.addField(field);
            }
        }
    }

    /**
     * Creates fields from all registered fieldCreators present inside addedElement, for given form container.
     * @param {Element} addedElement - The added element.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static createFieldsForAddedElement(addedElement, formContainer) {
        Object.values(Utils.#fieldCreatorOrder).forEach(function (fieldSelector) {
            let fieldCreatorSet = Utils.#fieldCreatorSets[fieldSelector];
            const fieldElements = addedElement.querySelectorAll(fieldCreatorSet['fieldSelector']);
            Utils.#createFormContainerFields(fieldElements, fieldCreatorSet['fieldCreator'], formContainer);
        });
    }

    /**
     * Execute a callback after the Form Container is initialized.
     * @param {Function} fieldCreator - The function to return an instance of FormField.
     * @param {string} fieldSelector - The CSS selector to identify the HTML element.
     * @param {string} fieldClass - The data attribute to read the field data from.
     */
    static setupField(fieldCreator, fieldSelector, fieldClass) {
        // there should be only one view for each fieldSelector in case of multiple view registrations in case of extension
        // if customer needs to create two views for each field selector, they need to do it via themservles
        if (!(fieldSelector in Utils.#fieldCreatorSets)) {
            Utils.#fieldCreatorOrder.push(fieldSelector);
        }
        Utils.#fieldCreatorSets[fieldSelector] = {
            fieldCreator,
            fieldSelector,
            fieldClass
        };
    }

    static initializeAllFields(formContainer) {
        console.debug("Initializing field views ", formContainer);
        Object.values(Utils.#fieldCreatorOrder).forEach(function (fieldSelectorInCreator) {
            const {fieldSelector, fieldCreator, fieldClass} = Utils.#fieldCreatorSets[fieldSelectorInCreator];
            console.debug("Initializing all fields of field selector ", fieldSelector);
            let fieldElements = document.querySelectorAll(fieldSelector);
            Utils.#createFormContainerFields(fieldElements, fieldCreator, formContainer);
            Utils.registerMutationObserver(formContainer, fieldCreator, fieldSelector, fieldClass);
        });
    }
    /**
     * Removes field reference from form container.
     * @private
     * @param {module:FormView~FormContainer} formContainer - The form container.
     * @param {string} fieldId - The field ID.
     */
    static #removeFieldId(formContainer, fieldId) {
        if (formContainer && formContainer.getAllFields()) {
            delete formContainer.getAllFields()[fieldId];
        }
    }

    /**
     * Removes all child references (including instance manager) of field from views, Form Container.
     * @private
     * @param {Object} fieldView - The field view.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static #removeChildReferences(fieldView, formContainer) {
        let childViewList = fieldView.children;
        if (childViewList) {
            for (let index = 0; index < childViewList.length; index++) {
                Utils.#removeChildReferences(childViewList[index]);
            }
        }
        //remove instanceManger for child repeatable panel
        if (fieldView.getInstanceManager && fieldView.getInstanceManager()) {
            Utils.#removeFieldId(formContainer, fieldView.getInstanceManager().id);
        }
        Utils.#removeFieldId(formContainer, fieldView.id);
    }

    /**
     * Removes all references of field from views, Form Container.
     * @param {Object} fieldView - The field view.
     * @param {module:FormView~FormContainer} formContainer - The form container.
     */
    static removeFieldReferences(fieldView, formContainer) {
        let childViewList = fieldView.children;
        if (childViewList) {
            for (let index = 0; index < childViewList.length; index++) {
                Utils.#removeChildReferences(childViewList[index]);
            }
        }
        Utils.#removeFieldId(formContainer, fieldView.id);
    }

    /**
     * Update the id inside the given html element.
     * @param {Element} htmlElement - The HTML element.
     * @param {string} oldId - The old ID.
     * @param {string} newId - The new ID.
     */
    static updateId(htmlElement, oldId, newId) {
        let elementWithId = htmlElement.querySelectorAll("#" + oldId)[0];
        if (elementWithId) {
            elementWithId.id = newId;
        }
    }

    /**
     * API to set the context path. All external HTTP API calls would by default prefix with this context path.
     * @param {string} contextPath - The context path of the system.
     */
    static setContextPath(contextPath) {
        if (Utils.#contextPath == null || Utils.#contextPath.length === 0) {
            Utils.#contextPath = contextPath;
        }
    }

    /**
     * API to get the context path.
     * @returns {string} - The context path of the system.
     */
    static getContextPath() {
        return Utils.#contextPath;
    }

    /**
     * Registers handler on elements on hook.
     * @param {Element} parentElement - The parent element.
     * @param {string} hook - The hook.
     * @param {Function} handler - The event handler.
     */
    static registerClickHandler(parentElement, hook, handler) {
        const dataAttr = "[" + hook + "]";
        const buttons = parentElement.querySelectorAll(dataAttr);
        buttons.forEach(
          (button) => button.addEventListener('click', handler));
    }

    /**
     * @deprecated Use `registerCustomFunctionsV2` instead.
     * Registers custom functions from clientlibs.
     * @param {string} formId - The form ID.
     */
    static async registerCustomFunctions(formId) {
        const funcConfig = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getCustomFunctionConfig(formId);
        console.debug("Fetched custom functions: " + JSON.stringify(funcConfig));
        if (funcConfig && funcConfig.customFunction) {
            const funcObj = funcConfig.customFunction.reduce((accumulator, func) => {
                if (window[func.id]) {
                    accumulator[func.id] = window[func.id];
                }
                return accumulator;
            }, {});
            _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__.FunctionRuntime.registerFunctions(funcObj);
        }
    }

    /**
     * Registers custom functions from clientlibs.
     * @param {object} formJson - The Sling model exporter representation of the form
     */
    static async registerCustomFunctionsV2(formJson) {
        let funcConfig;
        const customFunctionsUrl = formJson.properties['fd:customFunctionsUrl'];
        if (customFunctionsUrl) {
            funcConfig = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getJson(customFunctionsUrl);
        } else {
            funcConfig = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getCustomFunctionConfig(formJson.id);
        }
        console.debug("Fetched custom functions: " + JSON.stringify(funcConfig));
        if (funcConfig && funcConfig.customFunction) {
            const funcObj = funcConfig.customFunction.reduce((accumulator, func) => {
                if (window[func.id]) {
                    accumulator[func.id] = window[func.id];
                }
                return accumulator;
            }, {});
            _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__.FunctionRuntime.registerFunctions(funcObj);
        }
    }

    /**
     * Sets up the Form Container.
     * @param {Function} createFormContainer - The function to create a form container.
     * @param {string} formContainerSelector - The CSS selector to identify the form container.
     * @param {string} formContainerClass - The form container class.
     * @fires module:FormView~Constants#FORM_CONTAINER_INITIALISED
     */
    static async setupFormContainer(createFormContainer, formContainerSelector, formContainerClass) {
        _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__.FunctionRuntime.registerFunctions(_customFunctions_js__WEBPACK_IMPORTED_MODULE_2__.customFunctions);
        let elements = document.querySelectorAll(formContainerSelector);
        for (let i = 0; i < elements.length; i++) {
            const dataset = Utils.readData(elements[i], formContainerClass);
            const customFunctionUrl = dataset["customFunctionsModuleUrl"];
            const _path = dataset["path"];
            const _pageLang = dataset["pageLang"];
            if ('contextPath' in dataset) {
                Utils.setContextPath(dataset['contextPath']);
            }
            if (_path == null) {
                console.error(`data-${_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.NS}-${formContainerClass}-path attribute is not present in the HTML element. Form cannot be initialized` )
            } else {
                let _formJson, callback;
                const loader = elements[i].parentElement?.querySelector('[data-cmp-adaptiveform-container-loader]');
                // Get the schema type from the data attribute with null safety
                const schemaType = elements[i].getAttribute('data-cmp-schema-type');
                // Check if this is an XDP form based on the schema type
                // According to GuideSchemaType enum, XDP has value of FORM_TEMPLATES, not 'XFA'
                if (loader && schemaType && (schemaType === 'XDP' || schemaType === 'FORM_TEMPLATES')) {
                    const id = loader.getAttribute('data-cmp-adaptiveform-container-loader');
                    const response = await fetch(`/adobe/forms/af/${id}`)
                    _formJson = (await response.json()).afModelDefinition;
                    _formJson.id = id;
                    //window.formJson = _formJson
                    callback = (0,_handleXfa__WEBPACK_IMPORTED_MODULE_4__.loadXfa)(_formJson.formdom, _formJson.xfaRenderContext);
                } else {
                    _formJson = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getFormDefinition(_path, _pageLang);
                }
                console.debug("fetched model json", _formJson);
                await this.registerCustomFunctionsV2( _formJson);
                await this.registerCustomFunctionsByUrl(customFunctionUrl);
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                let _prefillData = {};
                if (_formJson?.properties?.['fd:formDataEnabled'] === true) {
                    // only execute when fd:formDataEnabled is present and set to true
                    _prefillData = await _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_1__["default"].getJson(_formJson.properties['fd:dataUrl'] + "?" + Object.keys(params).map(p => p+"="+params[p]).join("&"))
                    _prefillData = _prefillData || {};
                    _prefillData = Utils.stripIfWrapped(_prefillData);
                    if(window.formBridge){
                        window.formBridge.restoreFormState({
                            formState : {xfaDom: _prefillData.data.xfaDom, xfaRenderContext: _prefillData.data.xfaRenderContext},
                            context : this,
                            error : function() {},
                            success : function () {}
                        });
                    }
                }
                const formContainer = await createFormContainer({
                    _formJson,
                    _prefillData,
                    _path,
                    _element: elements[i]
                });
                if (typeof callback === 'function') {
                    callback(formContainer.getModel());
                }
                Utils.initializeAllFields(formContainer);
                const event = new CustomEvent(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.FORM_CONTAINER_INITIALISED, { "detail": formContainer });
                document.dispatchEvent(event);
            }
        }
    }

    static async registerCustomFunctionsByUrl(url) {
        try {
            if (url != null && url.trim().length > 0) {
                // webpack ignore is added because webpack was converting this to a static import upon bundling resulting in error.
                //This Url should whitelist the AEM author/publish domain in the Cross Origin Resource Sharing (CORS) configuration.
                const customFunctionModule = await import(/*webpackIgnore: true*/ url);
                const keys = Object.keys(customFunctionModule);
                const functions = [];
                for (const name of keys) {
                    const funcDef = customFunctionModule[name];
                    if (typeof funcDef === 'function') {
                        functions[name] = funcDef;
                    }
                }
                _aemforms_af_core__WEBPACK_IMPORTED_MODULE_3__.FunctionRuntime.registerFunctions(functions);
            }
        } catch (e) {
            if(window.console){
                console.error("error in loading custom functions from url "+url+" with message "+e.message);
            }
        }
    }

    /**
     * For backward compatibility with older data formats of prefill services like FDM.
     * @param {object} prefillJson - The prefill JSON object.
     * @returns {object} - The stripped prefill JSON object.
     */
    static stripIfWrapped(prefillJson) {
        if (prefillJson && prefillJson.hasOwnProperty("data")) {
            const data = prefillJson.data;
            if (data && data.hasOwnProperty("afData")) {
                const afData = data.afData;
                if (afData && afData.hasOwnProperty("afBoundData")) {
                    return afData.afBoundData;
                }
            }
        }
        return prefillJson;
    }

    /**
     * Checks if the current browser matches with the agentName passed.
     * @param {string} agentName - The agent name to match with the browser's user agent.
     * @returns {boolean} - True if the browser's user agent matches the agentName, otherwise false.
     */
    static isUserAgent(agentName) {
        if(navigator.userAgent) {
            let regex = "^((?!chrome|android).)*" + agentName;
            const re = new RegExp(regex, 'i');
            return re.test(navigator.userAgent);
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Utils);


/***/ }),

/***/ "./src/view/FormCheckBox.js":
/*!**********************************!*\
  !*** ./src/view/FormCheckBox.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFieldBase.js */ "./src/view/FormFieldBase.js");
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



/**
 * Class representing components based on CheckBox.
 * @extends module:FormView~FormCheckBox
 */
class FormCheckBox extends _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {

    constructor(params) {
        super(params);
    }

    updateValue(modelValue) {
        if (modelValue === this._model._jsonModel.enum[0]) {
            this.widget.checked = true
            this.widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED)
        } else {
            this.widget.checked = false
            this.widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
        }
        this.widget.value = modelValue;
        super.updateEmptyStatus();
    }

    setModel(model) {
        super.setModel(model);
        this._onValue = this._model._jsonModel.enum[0];
        this._offValue = this._model._jsonModel.enum[1];
        this.widget.addEventListener('change', (e) => {
            const value = this.widget.checked ? this._onValue : this._offValue;
            this._model.dispatch(new FormView.Actions.UIChange({'value': value}));
        })
        this.widget.addEventListener('focus', (e) => {
            this.setActive();
            this.triggerEnter();
        });
        this.widget.addEventListener('blur', (e) => {
            this.setInactive();
            this.triggerExit();
        });
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormCheckBox);

/***/ }),

/***/ "./src/view/FormContainer.js":
/*!***********************************!*\
  !*** ./src/view/FormContainer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__);
/*******************************************************************************
 * Copyright 2022 Adobe
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


/**
 * @module FormView
 */

/**
 * Represents a FormContainer class.
 */
class FormContainer {
    /**
     * Creates an instance of the FormContainer class.
     * @param {object} params - The parameters for constructing the FormContainer instance.
     */
    constructor(params) {
        // bug in af-core, if data is set to empty object, model is not created correctly
        let prefillData = ((params._prefillData.data && Object.keys(params._prefillData.data).length === 0) ? null: params._prefillData.data);
        this._model = (0,_aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__.createFormInstance)({...params._formJson, data: prefillData});
        this._path = params._path;
        this._fields = {};
        this._deferredParents = {};
        this._element = params._element;

        // Prevent default behaviour on form container.
        this.#preventDefaultSubmit();
    }

    /**
     * Prevents the default behavior of the Enter key on components within the formContainer
     * from triggering a form submission and redirecting to the Thank-You Page.
     */
    #preventDefaultSubmit(){
        if(this._element) {
            this._element.addEventListener('keydown', (event) => {
                const target = event.target;
                const isSubmitOrReset = target.tagName === 'INPUT' && (target.type === 'submit' || target.type === 'reset');
                if (event.key === 'Enter' && target.tagName !== 'SELECT' && target.tagName !== 'BUTTON' && !isSubmitOrReset) {
                    event.preventDefault();
                }
            });
        }
    }

    /**
     * Adds an instance manager view to the fields of the formContainer.
     * @param {object} instanceManager - The instance manager view to be added.
     */
    addInstanceManager(instanceManager) {
        this._fields[instanceManager.id] = instanceManager;
    }

    /**
     * Returns the form field view with the specified field ID.
     * @param {string} fieldId - The ID of the form field.
     * @returns {object|null} The form field view, or null if not found.
     */
    getField(fieldId) {
        if (this._fields.hasOwnProperty(fieldId)) {
            return this._fields[fieldId];
        }
        return null;
    }

    /**
     * Returns the model with the specified ID. If no ID is provided, returns the entire model.
     * @param {string} [id] - The ID of the model element.
     * @returns {object} The model element or the entire model.
     */
    getModel(id) {
        return id ? this._model.getElement(id) : this._model;
    }

    /**
     * Returns the language code of the form.
     * @returns {string} The language code (e.g., "en").
     */
    getLang() {
        return this._model.lang || "en";
    }

    /**
     * Returns the ID of the form element's parent in the HTML structure.
     * @param {object} model - The form element model.
     * @returns {string} The parent ID.
     */
    getParentFormElementId(model) {
        const parentModel = (model.fieldType && model.repeatable) ? model.parent.parent : model.parent;
        if (parentModel.fieldType === 'form') {
            return '$form';
        } else {
            return parentModel.id;
        }
    }

    /**
     * Adds a field view to the form container.
     * @param {object} fieldView - The field view to be added.
     */
    addField(fieldView) {
        if (fieldView.getFormContainerPath() === this._path) {
            let fieldId = fieldView.getId();
            this._fields[fieldId] = fieldView;
            let model = this.getModel(fieldId);
            fieldView.setModel(model);
            fieldView.syncMarkupWithModel();
            const parentId = this.getParentFormElementId(model);
            if (parentId != '$form') {
                let parentView = this._fields[parentId];
                //if parent view has been initialized then add parent relationship, otherwise add it to deferred parent-child relationship
                if (parentView) {
                    fieldView.setParent(parentView);
                } else {
                    if (!this._deferredParents[parentId]) {
                        this._deferredParents[parentId] = [];
                    }
                    this._deferredParents[parentId].push(fieldView);
                }
            } else {
                fieldView.setParent(this);
            }

            // check if field id is in deferred relationship, if it is add parent child relationships
            if (this._deferredParents[fieldId]) {
                let childList = this._deferredParents[fieldId];
                for (let index = 0; index < childList.length; index++) {
                    childList[index].setParent(fieldView);
                }
                // remove the parent from deferred parents, once child-parent relationship is established
                delete this._deferredParents[fieldId];
            }
            fieldView.subscribe();
        }
    }

    /**
     * Sets the focus on the specified field ID.
     * @param {string} id - The ID of the field to set the focus on.
     */
    setFocus(id) {
        if (id) {
            let fieldView = this._fields[id];
            if (fieldView && fieldView.setFocus) {
                fieldView.setFocus();
            } else {
                // todo proper error handling, for AF 2.0 model exceptions as well
                // logging the error right now.
                console.log("View on which focus is to be set, not initialized.");
            }
        } else {
            //todo
            // if id is not defined, focus on the first field of the form
            // should be governed by a configuration to be done later on
        }
    }

    /**
     * Returns the ID of the form.
     * @returns {string} The form ID.
     */
    getFormId() {
        return this._model._jsonModel.id;
    }

    /**
     * Returns the title of the form.
     * @returns {string} The form title.
     */
    getFormTitle() {
        return this._model._jsonModel.title;
    }

    /**
     * Returns the path of the form container.
     * @returns {string} The form container path.
     */
    getPath() {
        return this._path;
    }

    /**
     * Returns the form element associated with the form container.
     * @returns {HTMLElement} The form element.
     */
    getFormElement() {
        return this._element;
    }

    /**
     * Returns all fields of the form container.
     * @returns {object} An object containing all fields of the form container.
     */
    getAllFields() {
        return this._fields;
    }

    /**
       * Updates the active child of the form container.
       * @param {Object} activeChild - The active child.
    */
    updateActiveChild(activeChild) {
      this.setFocus(activeChild?._activeChild?.id || activeChild?.id);
    }

    #focusOnFirstInvalidField(invalidFields) {
        const id = invalidFields[0].fieldName;
        this.setFocus(id);
    }

    /**
       * Subscribes to model changes and updates the corresponding properties in the view.
       * @override
     */
    subscribe() {
        const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state);
                } else {
                    console.warn(`changes to ${change.propertyName} are not supported at form. Please raise an issue`)
                }
            })
        });

        this._model.subscribe((action) => {
            if(action.payload.length > 0) {
                this.#focusOnFirstInvalidField(action.payload)
            }
        }, 'validationComplete');
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormContainer);


/***/ }),

/***/ "./src/view/FormField.js":
/*!*******************************!*\
  !*** ./src/view/FormField.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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




/**
 * @module FormView
 */


/**
 * Represents a FormField class.
 */
class FormField {

    /**
     * Creates a new instance of the FormField class.
     * @param {object} params - The parameters for initializing the FormField.
     * @param {object} params.formContainer - The form container that the field belongs to.
     * @param {HTMLElement} params.element - The HTML element of the field.
     */
    constructor(params) {
        this.formContainer = params.formContainer;
        this.element = params.element; //html element of field
        this.options = _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].readData(this.element, this.getClass());  //dataset of field
        this.setId(this.element.id);
        this.active = false;
    }

    /**
     * Sets the ID of the form field.
     * @param {string} id - The ID to set for the form field.
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Sets the parent view of the form field.
     * @param {object} parentView - The parent view to set for the form field.
     */
    setParent(parentView) {
        this.parentView = parentView;
        if (this.parentView.addChild) {
            this.parentView.addChild(this);
        }
        if (this.getInstanceManager() && !(this.getInstanceManager().getRepeatableParentView())) {
            this.getInstanceManager().setRepeatableParentView(parentView);
        }
    }

    /**
     * Sets the instance manager for the form field.
     * @param {object} instanceManager - The instance manager to set for the form field.
     */
    setInstanceManager(instanceManager) {
        this.instanceManager = instanceManager;
    }

    /**
     * Sets the form field as active.
     */
    setActive() {
        if (!this.isActive()) {
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_ACTIVE, true);
            // optimizing the performance to check if the activeChild is different, else this will be a redundant call
            if (this.parentView?._model?.activeChild !== this._model) {
                this.parentView._model.activeChild = this._model; // updating the activeChild of the model when a field is focused in view
            }
            this.active = true;
        }
    }

    /**
     * Sets the form field as inactive.
     */
    setInactive() {
        if (this.isActive()) {
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_ACTIVE, false);
        }
    }

    /**
     * Checks if the form field is active.
     * @returns {boolean} True if the form field is active, false otherwise.
     */
    isActive() {
        return this.element.getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_ACTIVE) === 'true';
    }

    triggerExit() {
        this._model.dispatch(new FormView.Actions.CustomEvent('xfaexit'));
    }

    triggerEnter() {
        this._model.dispatch(new FormView.Actions.CustomEvent('xfaenter'));
    }

    /**
     * Returns the form container path of the form field.
     * @returns {string} The form container path.
     */
    getFormContainerPath() {
        return this.options["adaptiveformcontainerPath"];
    }

    /**
     * Returns the ID of the form field.
     * @returns {string} The form field ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Sets the model for the form field.
     * @param {object} model - The model to set for the form field.
     * @throws {string} Throws an error if the model is already initialized.
     */
    setModel(model) {
        if (typeof this._model === "undefined" || this._model === null) {
            this._model = model;
        } else {
            throw "Re-initializing model is not permitted"
        }
    }

    setModelValue(value) {
        this._model.dispatch(new FormView.Actions.UIChange({'value': value}));
    }

    /**
     * Updates the HTML with the respective model.
     * This is for the markup that is generated on the client-side (e.g., repeatable panel).
     * @throws {string} Throws an error if the method is not implemented.
     */
    syncMarkupWithModel() {
        throw "method not implemented";
    }

    /**
     * Toggles the HTML element based on the property. If the property is false, then adds the data-attribute and CSS class.
     * @param {boolean} property - The property to toggle.
     * @param {string} dataAttribute - The data attribute to set or remove.
     * @param {string} value - The value to set for the data attribute.
     */
    toggle(property, dataAttribute, value) {
       this.toggleAttribute(this.element, property, dataAttribute, value);
    }

    /**
     * Toggles the given element based on the property. If the property is false, then adds the data-attribute and CSS class.
     * @param {HTMLElement} element - The element to toggle.
     * @param {boolean} property - The property to toggle.
     * @param {string} dataAttribute - The data attribute to set or remove.
     * @param {string} value - The value to set for the data attribute.
     */
    toggleAttribute(element, property, dataAttribute, value) {
        if (element) {
            if (property === false) {
                element.setAttribute(dataAttribute, value);
            } else {
                element.removeAttribute(dataAttribute);
            }
        }
    }

    /**
     * Returns the 'afs:layout' properties. Empty object if no layout property is present.
     * @returns {object} The 'afs:layout' properties.
     */
    getLayoutProperties() {
        let layoutProperties = {};
        const state = this.getModel().getState();
        if (state && state.properties && state.properties['afs:layout']) {
            layoutProperties =  state.properties['afs:layout'];
        }
        return layoutProperties;
    }

    /**
     * Returns the model of the form field.
     * @returns {object} The model of the form field.
     */
    getModel() {
        return this._model;
    }

    /**
     * Subscribes the field to the model.
     * @throws {string} Throws an error if the field does not subscribe to the model.
     */
    subscribe() {
        throw "the field does not subscribe to the model"
    }

    /**
     * Initializes the help content based on the state.
     * @throws {string} Throws an error if the method is not implemented.
     */
    initializeHelpContent(state) {
        throw "method not implemented";
    }

    /**
     * Returns the instance manager of the form field.
     * @returns {object} The instance manager of the form field.
     */
    getInstanceManager() {
        return this.instanceManager;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormField);


/***/ }),

/***/ "./src/view/FormFieldBase.js":
/*!***********************************!*\
  !*** ./src/view/FormFieldBase.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _FormField_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormField.js */ "./src/view/FormField.js");
/* harmony import */ var _LanguageUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LanguageUtils.js */ "./src/LanguageUtils.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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





/**
 * @module FormView
 */

/**
 * Base class for form fields.
 * @extends module:FormView~FormField
 */
class FormFieldBase extends _FormField_js__WEBPACK_IMPORTED_MODULE_1__["default"] {

    /**
     * Constructor for FormFieldBase.
     * @param {object} params - The parameters for initializing the form field.
     */
    constructor(params) {
        super(params)
        this.widget = this.getWidget();
        this.description = this.getDescription();
        this.label = this.getLabel();
        this.errorDiv = this.getErrorDiv();
        this.qm = this.getQuestionMarkDiv();
        this.tooltip = this.getTooltipDiv();
        this.updateEmptyStatus();
    }

    /**
     * Event constant for element focus change.
     * @type {string}
     */
    ELEMENT_FOCUS_CHANGED = _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ELEMENT_FOCUS_CHANGED;

    /**
     * Event constant for element help shown.
     * @type {string}
     */
    ELEMENT_HELP_SHOWN = _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ELEMENT_HELP_SHOWN;

    /**
     * Event constant for element error shown.
     * @type {string}
     */
    ELEMENT_ERROR_SHOWN = _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ELEMENT_ERROR_SHOWN;


    /**
     * Event constant for value change.
     * @type {string}
     */
    ELEMENT_VALUE_CHANGED = _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ELEMENT_VALUE_CHANGED;

    /**
     * Gets the widget element used to capture the value from the user.
     * Implementations should return the widget element that is used to capture the value from the user.
     * @returns {HTMLElement} - The widget element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getWidget() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the description of the field.
     * Implementations should return the description element that is used to capture the description
     * @returns {HTMLElement} - The description element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getDescription() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the label of the field.
     * Implementations should return the label element that is used to capture the label
     * @returns {HTMLElement} - The label element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getLabel() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the error on the field.
     * Implementations should return the error element that is used to capture the error
     * @returns {HTMLElement} - The error element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getErrorDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the tooltip / short description div.
     * Implementations should return the tooltip element that is used to capture the tooltip or short description
     * @returns {HTMLElement} - The tooltip element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getTooltipDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the question mark div.
     * Implementations should return the question mark element
     * @returns {HTMLElement} - The question mark element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getQuestionMarkDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the class of the form field.
     * @returns {string} - The class of the form field.
     */
    getClass() {
        return this.constructor.IS;
    }

    /**
     * Sets the model for the form field.
     * @param {object} model - The model object.
     */
    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this.applyState(state);
        this.#registerEventListeners();
    }

    getWidgetId(){
      return this.getId() + '-widget';
    }

    #syncWidget() {
      let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
      let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
      widgetElement = widgetElements || widgetElement;
      if (widgetElement) {
          widgetElement.setAttribute('id', this.getWidgetId());
      }
    }

    /**
     * Synchronizes the label element with the model.
     * @private
     */
    #syncLabel() {
        let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
        if (labelElement) {
            labelElement.setAttribute('for', this.getWidgetId());
        }
    }


    #syncError() {
        let errorElement = typeof this.getErrorDiv === 'function' ? this.getErrorDiv() : null;
        if (errorElement) {
            errorElement.setAttribute('id', `${this.getId()}__errormessage`);
        }
    }   

    #syncShortDesc() {
        let shortDescElement = typeof this.getTooltipDiv === 'function' ? this.getTooltipDiv() : null;
        if (shortDescElement) {
            shortDescElement.setAttribute('id', `${this.getId()}__shortdescription`);
        }
    } 

    #syncLongDesc() {
        let longDescElement = typeof this.getDescription === 'function' ? this.getDescription() : null;
        if (longDescElement) {
            longDescElement.setAttribute('id', `${this.getId()}__longdescription`);
        }
    } 

    #syncAriaDescribedBy() {
        let ariaDescribedby = '';
        let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
        let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
        widgetElement = widgetElements || widgetElement;
        
        function appendDescription(descriptionType, id) {
            if (ariaDescribedby) {
               ariaDescribedby += ` ${id}__${descriptionType}`;
             } else {
                 ariaDescribedby = `${id}__${descriptionType}`;
             }
         }
            
        if (widgetElement) {

           if (this.getDescription()) {
            const descriptionDiv = this.getDescription();
            if (!(descriptionDiv.innerHTML.trim() === '' || descriptionDiv.children.length === 0)) {
                appendDescription('longdescription', this.getId());
            }
          }
          
           if (this.getTooltipDiv()) {
            appendDescription('shortdescription', this.getId());
          }

           if (this.getErrorDiv() && this.getErrorDiv().innerHTML) {
            appendDescription('errormessage', this.getId());
          }

            widgetElement.setAttribute('aria-describedby', ariaDescribedby);
        }
    }

    #syncAriaLabel() {
        let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
        let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
        widgetElement = widgetElements || widgetElement;
        const model = this.getModel?.();
    
        if (widgetElement && model?.screenReaderText) {
            // Use DOMPurify to sanitize and strip HTML tags
            const screenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(model.screenReaderText, { ALLOWED_TAGS: [] }) : model.screenReaderText;
            widgetElement.setAttribute('aria-label', screenReaderText);
        }
    }

    /**
     * Synchronizes the markup with the model.
     * @method
     */
    syncMarkupWithModel() {
        this.#syncLabel()
        this.#syncWidget()
        this.#syncShortDesc()
        this. #syncLongDesc()
        this.#syncAriaDescribedBy()
        this.#syncError()
        this.#syncAriaLabel()
    }

    /**
     * Sets the focus on the component's widget.
     * @param {string} id - The ID of the component's widget.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView.setFocus) {
            this.parentView.setFocus(this.getId());
        }
        if(!this.isActive()) {
            this.widget = this.getWidget(); // updating to the latest widget in case of datepicker widget with a formatter
            if (this.widget instanceof NodeList) { // only checkbox and radiobutton returns NodeList
                this.widget[0].focus(); // If multiple widgets like radio-button or checkbox-group, then focus on the first widget
            } else if(this.getClass() === 'adaptiveFormFileInput') {
                this.getAttachButtonLabel().focus();
            } else {
                this.widget.focus();
            }
        }
    }

    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state object.
     */
    applyState(state) {
        if (state.value) {
            this.updateValue(state.value);
        }
        this.updateVisible(state.visible, state)
        this.updateReadOnly(state.readOnly)
        this.updateEnabled(state.enabled, state)
        this.initializeHelpContent(state);
        this.updateLabel(state.label);
        this.updateRequired(state.required, state);
        this.updateDescription(state.description);
    }

    /**
     * Initializes the hint ('?') and long description.
     * @param {Object} state - The state object.
     */
    initializeHelpContent(state) {
        this.#showHideLongDescriptionDiv(false);
        if (this.getDescription()) {
            this.#addHelpIconHandler(state);
        }
    }

    /**
     * Registers all event listeners on this field.
     * @private
     */
    #registerEventListeners() {
        this.#addOnFocusEventListener();
        this.#addOnHelpIconClickEventListener();
    }

    /**
     * Adds an event listener for the help icon click event.
     * @private
     */
    #addOnHelpIconClickEventListener() {
        const questionMarkDiv = this.qm;
        if (questionMarkDiv) {
            questionMarkDiv.addEventListener('click', () => {
                this.#triggerEventOnGuideBridge(this.ELEMENT_HELP_SHOWN)
            })
        }
    }

    /**
     * Adds an event listener for the focus event.
     * @private
     */
    #addOnFocusEventListener() {
        const widget = this.getWidget();
        if (widget) {
            if (widget.length && widget.length > 1) {
                for (let opt of widget) {
                    opt.onfocus = () => {
                        this.#triggerEventOnGuideBridge(this.ELEMENT_FOCUS_CHANGED)
                    };
                }
            } else {
                widget.onfocus = () => {
                    this.#triggerEventOnGuideBridge(this.ELEMENT_FOCUS_CHANGED)
                };
            }
        }
    }

    /**
     * Triggers an event on GuideBridge.
     * @param {string} eventType - The event type.
     * @private
     */
    #triggerEventOnGuideBridge(eventType, originalEventPayload) {
        const formId = this.formContainer.getFormId();
        const formTitle = this.formContainer.getFormTitle();
        const panelName = this.#getPanelName();
        const fieldName = this._model.name;
        const fieldId = this._model.id;
        const fieldQualifiedName = this._model.qualifiedName;
        const eventPayload = {
            formId,
            formTitle,
            fieldName,
            fieldId,
            panelName,
            fieldQualifiedName,
            ...(originalEventPayload?.prevValue !== undefined ? { prevText: originalEventPayload?.prevValue } : {}),
            ...(originalEventPayload?.currentValue !== undefined ? { newText: originalEventPayload?.currentValue } : {}),
            ...((typeof originalEventPayload === 'object' && originalEventPayload !== null) ? originalEventPayload : {})
        };
        const formContainerPath = this.formContainer.getPath();
        window.guideBridge.trigger(eventType, eventPayload, formContainerPath);
    }


    /**
     * Gets the panel name.
     * @returns {string} The panel name.
     * @private
     */
    #getPanelName() {
        return this.parentView.getModel().name;
    }

    setWidgetValueToDisplayValue() {
        if(this._model.displayValueExpression && this._model.displayValue) { // only do this if displayValueExpression is set
            this.widget.value = this._model.displayValue;
        }
    }

    setWidgetValueToModelValue() {
        if(this._model.displayValueExpression && this._model.displayValue) { // only do this if displayValueExpression is set
            this.widget.value = this._model.value;
        }
    }

    /**
     * Shows or hides the tooltip <div> based on the provided flag.
     * @param {boolean} show - If true, the tooltip <div> will be shown; otherwise, it will be hidden.
     * @private
     */
    #showHideTooltipDiv(show) {
        if (this.tooltip) {
            this.toggleAttribute(this.getTooltipDiv(), show, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     * Shows or hides the long description <div> based on the provided flag.
     * @param {boolean} show - If true, the long description <div> will be shown; otherwise, it will be hidden.
     * @private
     */
    #showHideLongDescriptionDiv(show) {
        if (this.getDescription()) {
            this.toggleAttribute(this.getDescription(), show, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     * Checks if the tooltip is always visible.
     * @returns {boolean} True if the tooltip is always visible; otherwise, false.
     * @private
     */
    #isTooltipAlwaysVisible() {
        return !!this.getLayoutProperties()['tooltipVisible'];
    }

    /**
     * Updates the HTML based on the visible state.
     * @param {boolean} visible - The visible state.
     * @param {Object} state - The state object.
     */
    updateVisible(visible, state) {
        this.toggle(visible, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN, true);
        this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        if (this.parentView != undefined && this.parentView.getModel().fieldType === 'panel') {
            this.parentView.updateChildVisibility(visible, state);
        }
    }

     /**
     * Updates the HTML state based on the enabled state of the field.
     * @param {boolean} enabled - The enabled state.
     * @param {Object} state - The state object.
     */
    updateEnabled(enabled, state) {
        if (this.widget) {
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            if (enabled === false) {
                this.widget.setAttribute("disabled", "disabled");
            } else {
                this.widget.removeAttribute("disabled");
            }
        }
    }

    /**
     * Updates the HTML state based on the read-only state of the field.
     * @param {boolean} readOnly - The read-only state.
     * @param {Object} state - The state object.
     */
    updateReadOnly(readOnly) {
        if (this.widget) {
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_READONLY, readOnly);
            if (readOnly === true) {
                this.widget.setAttribute("readonly", "readonly");
            } else {
                this.widget.removeAttribute("readonly");
            }
        }
    }

    /**
     * Updates the HTML state based on the required state of the field.
     * @param {boolean} required - The required state.
     * @param {Object} state - The state object.
     */
    updateRequired(required, state) {
        if (this.widget) {
            this.element.toggleAttribute("required", required);
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_REQUIRED, required);
            if (required === true) {
                this.widget.setAttribute("required", "required");
            } else {
                this.widget.removeAttribute("required");
            }
        }
    }

    /**
     * Updates the HTML state based on the valid state of the field.
     * @param {boolean} valid - The valid state.
     * @param {Object} state - The state object.
     * @deprecated Use the new method updateValidity() instead.
     */
    updateValid(valid, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidity
    }

    /**
     * Updates the HTML state based on the validity state of the field.
     * @param {Object} validity - The validity state.
     * @param {Object} state - The state object.
     */
    updateValidity(validity, state) {
        // todo: handle the type of validity if required later
        const valid = validity.valid;
        if (this.errorDiv) {
            this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VALID, valid);
            this.widget.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_INVALID, !valid);
            this.updateValidationMessage(state.validationMessage, state);
        }
    }

    /**
     * Updates the HTML state based on the error message state of the field.
     * @param {string} errorMessage - The error message.
     * @param {Object} state - The state object.
     * @deprecated Use the new method updateValidationMessage() instead.
     */
    updateErrorMessage(errorMessage, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidationMessage
    }


    /**
     * Updates the HTML state based on the validation message state of the field.
     * @param {string} validationMessage - The validation message.
     * @param {Object} state - The state object.
     */
    updateValidationMessage(validationMessage, state) {
        if (this.errorDiv) {
            // Check if the validationMessage is different from the current content
            if (this.errorDiv.innerHTML !== state.validationMessage) {
                this.errorDiv.innerHTML = state.validationMessage;
                if (state.validity.valid === false) {
                    // Find the first key whose value is true
                    const validationType = Object.keys(state.validity).find(key => key !== 'valid' && state.validity[key] === true);
                    this.#triggerEventOnGuideBridge(this.ELEMENT_ERROR_SHOWN, {
                        'validationMessage': state.validationMessage,
                        'validationType': validationType
                    });
                    
                    // if there is no error message in model, set a default error in the view
                    if (!state.validationMessage) {
                        this.errorDiv.innerHTML = _LanguageUtils_js__WEBPACK_IMPORTED_MODULE_2__["default"].getTranslatedString(this.formContainer.getModel().lang, "defaultError");
                    }
                } 
                this.#syncAriaDescribedBy();
            }
        }
    }

    /**
     * Updates the HTML state based on the value state of the field.
     * @param {any} value - The value.
     */
    updateValue(value) {
        // html sets undefined value as undefined string in input value, hence this check is added
        let widgetValue = typeof value === "undefined" ? null : value;
        if (this.widget) {
            this.widget.value = widgetValue;
            this.updateEmptyStatus();
        }
    }

    /**
     * Updates the HTML class based on the existence of a value in a field.
     */
    updateEmptyStatus() {
        if (!this.getWidget()){
          return;
        }
        let value = '';
        const checkedWidget = ['radio', 'checkbox'];
        // radiobutton, checkbox, datefield(AFv1, not datepicker), etc. have multiple widgets in the form of a NodeList
        if (this.widget instanceof NodeList) {
          value = Array.from(this.widget).map((widget) => checkedWidget.includes(widget.type) ? widget.checked : widget.value).find(value => value);
        } else {
          value = checkedWidget.includes(this.widget.type) ? this.widget.checked : this.widget.value;
        }
        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0]
        const filledModifierClass = `${bemClass}--filled`;
        const emptyModifierClass = `${bemClass}--empty`;
        this.element.classList.add(value ? filledModifierClass : emptyModifierClass);
        this.element.classList.remove(value ? emptyModifierClass : filledModifierClass);
    }

    /**
     * Updates the HTML state based on the label state of the field.
     * @param {Object} label - The label.
     */
    updateLabel(label) {
        if (this.label) {
            if (label.hasOwnProperty("value")) {
                this.label.innerHTML = label.value;
            }
            if (label.hasOwnProperty("visible")) {
                this.toggleAttribute(this.label, label.visible, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN, true);
                this.label.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE, label.visible);
            }
        }
    }


    /**
     * Updates the active child of the form container.
     * @param {Object} activeChild - The active child.
     */
    updateActiveChild(activeChild) {
      this.formContainer.setFocus(activeChild?._activeChild?.id || activeChild?.id);
    }

    /**
     * Updates the HTML state based on the description state of the field.
     * @param {string} descriptionText - The description.
     */
   
    updateDescription(descriptionText) {
        if (typeof descriptionText !== 'undefined') {
            const sanitizedDescriptionText = window.DOMPurify ? window.DOMPurify.sanitize(descriptionText, { ALLOWED_TAGS: [] }).trim() : descriptionText;
            let descriptionElement = this.getDescription();

            if (descriptionElement) {
                 // Check if the content inside the descriptionElement needs updating
                 let currentTextContent = descriptionElement.innerText.trim();

                 if (currentTextContent === sanitizedDescriptionText) {
                   // No update needed if the text content already matches
                   return;
               }
                 
                // Find the existing <p> element
                let pElements = descriptionElement.querySelectorAll('p');

                if (!pElements)  {
                    // If no <p> tag exists, create one and set it as the content
                    pElements = document.createElement('p');
                    descriptionElement.innerHTML = ''; // Clear existing content
                    descriptionElement.appendChild(pElement);
                }

                // Update the <p> element's content with sanitized content
                   pElements.length === 1 ? (pElements[0].innerHTML = sanitizedDescriptionText) : null;
               
            } else {    
                // If no description was set during authoring
                this.#addDescriptionInRuntime(sanitizedDescriptionText);
            }
        }
    }

    #addDescriptionInRuntime(descriptionText) {
        // add question mark icon
        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0];
        const labelContainer = this.element.querySelector(`.${bemClass}__label-container`);
        if (labelContainer) {
            const qmButton = document.createElement('button');
            qmButton.className = `${bemClass}__questionmark`;
            qmButton.title = 'Help text';
            labelContainer.appendChild(qmButton);
        } else {
            console.error('label container not found');
            return;
        }
        // add description div
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = `${bemClass}__longdescription`;
        descriptionDiv.id = `${this.getId()}__longdescription`;
        descriptionDiv.setAttribute('aria-live', 'polite');
        descriptionDiv.setAttribute('data-cmp-visible', false);
        const pElement = document.createElement('p');
        pElement.textContent = descriptionText;
        descriptionDiv.appendChild(pElement)
        var errorDiv = this.getErrorDiv();
        if (errorDiv) {
            this.element.insertBefore(descriptionDiv, errorDiv);
        } else {
            console.log('error div not found');
            return;
        }
        // attach event handler for question mark icon
        this.#addHelpIconHandler();
    }

    /**
     * Adds an event listener for the '?' icon click.
     * @param {Object} state - The state object.
     * @private
     */
    #addHelpIconHandler(state) {
        const questionMarkDiv = this.getQuestionMarkDiv(),
            descriptionDiv = this.getDescription(),
            tooltipAlwaysVisible = this.#isTooltipAlwaysVisible();
        const self = this;
        if (questionMarkDiv && descriptionDiv) {
            questionMarkDiv.addEventListener('click', (e) => {
                e.preventDefault();
                const longDescriptionVisibleAttribute = descriptionDiv.getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE);
                if (longDescriptionVisibleAttribute === 'false') {
                    self.#showHideLongDescriptionDiv(true);
                    if (tooltipAlwaysVisible) {
                        self.#showHideTooltipDiv(false);
                    }
                } else {
                    self.#showHideLongDescriptionDiv(false);
                    if (tooltipAlwaysVisible) {
                        self.#showHideTooltipDiv(true);
                    }
                }
            });
        }
    }

    /**
     * Subscribes to model changes and updates the corresponding properties in the view.
     * @override
     */
    subscribe() {
        const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (change.propertyName === 'value') {
                    this.#triggerEventOnGuideBridge(this.ELEMENT_VALUE_CHANGED, change);
                }
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state);
                } else {
                    console.warn(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormFieldBase);


/***/ }),

/***/ "./src/view/FormFileInput.js":
/*!***********************************!*\
  !*** ./src/view/FormFileInput.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFieldBase.js */ "./src/view/FormFieldBase.js");
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



    /**
     * Class representing components based on FileInput.
     * @extends module:FormView~FormFileInput
     */
    class FormFileInput extends _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {

        constructor(params) {
            super(params);
        }

        setModel(model) {
            super.setModel(model);
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields);
            }
        }

        updateValue(value) {
            if (this.widgetObject == null) {
                this.widgetObject = new FileInputWidget(this.widgetFields);
            }
            this.widgetObject.setValue(value);
            super.updateEmptyStatus();
        }

        syncWidget() {
            let widgetElement = this.getWidget ? this.getWidget() : null;
            if (widgetElement) {
                widgetElement.id = this.getId() + "__widget";
                this.getAttachButtonLabel().setAttribute('for', this.getId() + "__widget");
            }
        }

        /*
          We are overriding the syncLabel method of the FormFieldBase class because for all components, 
          we pass the widgetId in 'for' attribute. However, for the file input component, 
          we already have a widget, so we should not pass the widgetId twice
        */
        syncLabel() {
          let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
          if (labelElement) {
              labelElement.setAttribute('for', this.getId());
          }
        }

        syncMarkupWithModel() {
            super.syncMarkupWithModel();
            this.syncWidget();
            this.syncLabel();
        }
    }
    
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormFileInput);

/***/ }),

/***/ "./src/view/FormFileInputWidget.js":
/*!*****************************************!*\
  !*** ./src/view/FormFileInputWidget.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FormFileInputWidgetBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFileInputWidgetBase */ "./src/view/FormFileInputWidgetBase.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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



/**
 * This class is responsible for interacting with the file input widget. It implements the file preview,
 * file list, handling invalid file size, file name, file mime type functionality
 */

 class FormFileInputWidget extends _FormFileInputWidgetBase__WEBPACK_IMPORTED_MODULE_0__["default"] {
        attachEventHandlers(widget, dragArea, model) {
            super.attachEventHandlers(widget, model)
            dragArea?.addEventListener("dragover", (event)=>{
                event.preventDefault();
                dragArea.classList.add("cmp-adaptiveform-fileinput__dragarea--active");
            });
            dragArea?.addEventListener("dragleave", (event)=>{
                dragArea.classList.remove("cmp-adaptiveform-fileinput__dragarea--active");
            });
            dragArea?.addEventListener("drop", (event)=>{
            event.preventDefault(); 
            dragArea.classList.remove("cmp-adaptiveform-fileinput__dragarea--active");
            this.handleChange(event?.dataTransfer?.files);
            });
            dragArea?.addEventListener("paste", (event)=>{
                event.preventDefault();
                this.handleChange(event?.clipboardData?.files);
            });
        }
        /**
         * This event listener gets called on click of close button in file upload
         *
         * @param event
         */
        handleClick (event){
            let elem = event.target,
                text = elem.parentElement.previousSibling.textContent,
                index = this.getIndexOfText(text, elem),
                url = elem.parentElement.previousSibling.dataset.key,
                objectUrl = elem.parentElement.previousSibling.dataset.objectUrl;   
            if (index !== -1) {
                this.values.splice(index, 1);
                this.fileArr.splice(index, 1);
                // set the model with the new value
                this.model.value = this.fileArr;
                // value and fileArr contains items of both URL and file types, hence while removing from DOM
                // get the correct index as per this.#widget.files
                let domIndex = Array.from(this.widget.files).findIndex(function(file) {
                return file.name === text;
                });
                this.deleteFilesFromInputDom([domIndex]);
                if (url != null) {
                    // remove the data so that others don't use this url
                    delete elem.parentElement.previousSibling.dataset.key;
                }
                if(objectUrl) {
                    // revoke the object URL to avoid memory leaks in browser
                    // since file is anyways getting deleted, remove the object URL's too
                    window.URL.revokeObjectURL(objectUrl);
                }
            }
            // Remove the dom from view
            //All bound events and jQuery data associated with the element are also removed
            elem.parentElement.parentElement.remove();
            // Set the focus on file upload button after click of close
            this.widget.focus();

        }

        formatBytes(bytes, decimals = 0) {
            if (!+bytes) return '0 Bytes'
            const k = 1024
            const dm = decimals < 0 ? 0 : decimals
            const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
        
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        }

        setValue(value) {
            let isValueSame = false;
            if (value != null) {
                // change to array since we store array internally
                value = Array.isArray(value) ? value : [value];
            }
            // check if current values and new values are same
            if (this.fileArr != null && value != null) {
                isValueSame = JSON.stringify(FormView.FileAttachmentUtils.extractFileInfo(this.fileArr)) === JSON.stringify(value);
            }
            // if new values, update the DOM
            if (!isValueSame) {
                let oldUrls = {};
                // Cache the url before deletion
                this.fileList.querySelectorAll(".cmp-adaptiveform-fileinput__filename").forEach(function (elem) {
                    let url = elem.dataset.key;
                    if (typeof url !== "undefined") {
                        let fileName = url.substring(url.lastIndexOf("/") + 1);
                        oldUrls[fileName] = url;
                    }
                });
                // empty the file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
                // set the new value
                if (value != null) {
                    let self = this;
                    // Update the value array with the file
                    this.values = value.map(function (file, index) {
                        // Check if file Name is a path, if yes get the last part after "/"
                        let isFileObject= window.File ? file.data instanceof window.File : false,
                            fileName = typeof file === "string" ? file : file.name,
                            fileUrl = typeof file === "string" ? file : (isFileObject ? "" : file.data),
                            fileSize = file.size,
                            fileUploadUrl = fileUrl;
                        if (oldUrls[fileName]) {
                            fileUploadUrl = oldUrls[fileName];
                        }
                        self.showFileList(fileName, fileSize, null, fileUploadUrl);
                        return fileName;
                    });
                    this.fileArr = [...value];
                }
            }
        }

        fileItem(fileName, fileSize, comment, fileUrl) {
            let self = this;
            let fileItem = document.createElement('li');
            fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
            let fileNameDom = document.createElement('span');
            let fileSizeDom = document.createElement('span');

            fileSizeDom.setAttribute('class', "cmp-adaptiveform-fileinput__filesize");
            fileSizeDom.textContent = this.formatBytes(fileSize);

            fileNameDom.setAttribute('tabindex', '0');
            fileNameDom.setAttribute('class', "cmp-adaptiveform-fileinput__filename");
            fileNameDom.setAttribute('aria-label', fileName);
            fileNameDom.textContent = fileName;
            fileNameDom.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileNameDom.addEventListener('click', function(e) {
                self.handleFilePreview(e);
            });
            fileItem.appendChild(fileNameDom);
            if(fileUrl != null){
                fileNameDom.dataset.key = fileUrl;
            }
            let fileEndContainer = document.createElement('span');
            let fileClose = document.createElement('span');
            fileEndContainer.setAttribute('class', "cmp-adaptiveform-fileinput__fileendcontainer");
            fileClose.setAttribute('tabindex', '0');
            fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
            fileClose.setAttribute('aria-label', FormView.LanguageUtils.getTranslatedString(this.lang, "FileCloseAccessText") + fileName);
            fileClose.setAttribute('role', 'button');
            fileClose.textContent = "x";
            fileClose.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileClose.addEventListener('click', function(e) {
                self.handleClick(e);
            });
            fileEndContainer.appendChild(fileSizeDom);
            fileEndContainer.appendChild(fileClose);
            fileItem.appendChild(fileEndContainer);
            return fileItem;
        }

        showFileList(fileName, fileSize, comment, fileUrl) {
            if(!this.isMultiSelect() || fileName === null || typeof fileName === "undefined") {
                // if not multiselect, remove all the children of file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
            }

            // Add the file item
            // On click of close, remove the element and update the model
            // handle on click of preview button
            if(fileName != null) {
            this.fileList.append(this.fileItem(fileName, fileSize, comment, fileUrl));
            }
        }

    }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormFileInputWidget);

/***/ }),

/***/ "./src/view/FormFileInputWidgetBase.js":
/*!*********************************************!*\
  !*** ./src/view/FormFileInputWidgetBase.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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


/**
 * This class is responsible for interacting with the file input widget. It implements the file preview,
 * file list, handling invalid file size, file name, file mime type functionality
 */
class FormFileInputWidgetBase {
    fileItemSelector = '.cmp-adaptiveform-fileinput__fileitem'
    widget = null
    fileArr = []
    fileList = null
    lang = "en"
    model = null // passed by reference
    isFileUpdate = false // handle safari state
    options = null // initialize options
    regexMimeTypeList = [] // initialize
    values = [] // initialize
    invalidFeature = {
        "SIZE": 1,
        "NAME": 2,
        "MIMETYPE": 3
    }
    extensionToMimeTypeMap = {
        "bat": "application/x-msdownload",
        "com": "application/x-msdownload",
        "dll": "application/x-msdownload",
        "exe": "application/x-msdownload",
        "msi": "application/x-msdownload",
        "msg": "application/vnd.ms-outlook",
        "dwg": "image/vnd.dwg",
        "jxr": "image/vnd.ms-photo",
        "psd": "image/vnd.adobe.photoshop",
        "ico": "image/vnd.microsoft.icon",
        "cab": "application/vnd.ms-cab-compressed",
        "deb": "application/vnd.debian.binary-package",
        "sqlite": "application/vnd.sqlite3",
        "inf2": "image/vnd.cns.inf2",
        "djv": "image/vnd.djvu",
        "djvu": "image/vnd.djvu",
        "dxf": "image/vnd.dxf",
        "fbs": "image/vnd.fastbidsheet",
        "fpx": "image/vnd.fpx",
        "fst": "image/vnd.fst",
        "mmr": "image/vnd.fujixerox.edmics-mmr",
        "rlc": "image/vnd.fujixerox.edmics-rlc",
        "pgb": "image/vnd.globalgraphics.pgb",
        "mix": "image/vnd.mix",
        "mdi": "image/vnd.ms-modi",
        "npx": "image/vnd.net-fpx",
        "radiance": "image/vnd.radiance",
        "sealed.png": "image/vnd.sealed.png",
        "softseal.gif": "image/vnd.sealedmedia.softseal.gif",
        "softseal.jpg": "image/vnd.sealedmedia.softseal.jpg",
        "svf": "image/vnd.svf"
    }
    initialFileValueFileNameMap;

    constructor(widgetFields) {
        // initialize the widget and model
        this.widget = widgetFields.widget;
        this.model = widgetFields.model();
        this.fileList = widgetFields.fileListDiv;
        // get the current lang
        this.lang = this.model.lang;
        // initialize options for backward compatibility
        this.options = Object.assign({}, {
            "contextPath": ""
            }, this.model._jsonModel);
            this.attachEventHandlers(widgetFields?.widget, widgetFields?.dragArea);
            // initialize the regex initially
            this.regexMimeTypeList = this.options.accept.map(function (value, i) {
                try {
                    return new RegExp(value.trim());
                } catch (e) {
                    // failure during regex parsing, don't return anything specific to this value since the value contains
                    // incorrect regex string
                    if (window.console) {
                        console.log(e);
                    }
                }
            });
        }

        attachEventHandlers(widget, model) {
            widget.addEventListener('change', (e)=> {
                this.handleChange(e?.target?.files);
            });
        }

        // checks if file name is valid or not to prevent security threats
        static isValid(fname) {
            let rg1=/^[^\\/:\*\;\$\%\?"<>\|]+$/; // forbidden characters \ / : * ? " < > | ; % $
            let rg2=/^\./; // cannot start with dot (.)
            let rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
            return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
        }

        /***
         * Finds the value in the array, if the value is a url then it uses the filename in the url to search for the text
         * This is done since our model stores the URL too in case of draft restore or clicking on save in guide
         * @param text          string representing the text of which the index is to be found
         * @param elem         reference to the jquery element. This is used if there are duplicate file names present in the file upload.
         * @returns {number}
         * @private
         */
        getIndexOfText (text, elem){
            let index = -1,
                self = this,
                isDuplicatePresent = false;
            this.values.find(function(value, iter){
                // if value is a url, then compare with last
                let tempValue = value,
                    // can't use getOrElse here since value can have "." in URL and getOrElse splits based on period to find key inside object
                    fileName =  (typeof self.initialFileValueFileNameMap === "object" && typeof self.initialFileValueFileNameMap[value] !== undefined) ? self._initialFileValueFileNameMap[value] : null;
                if(tempValue.match(/\//g) && tempValue.match(/\//g).length > 1){
                    tempValue =  value.substring(value.lastIndexOf("/")+1);
                }
                // we pass file name explicity as options, if passed use that as fallback to find the URL
                if(tempValue === text || fileName === text){
                    index = iter;
                    isDuplicatePresent = self.values.indexOf(value, index + 1) !== -1;
                    if(elem && isDuplicatePresent){
                        // now check if duplicate present and get its correct index
                        // today all files are wrapped under .guide-fu-fileItem node
                        let fileEntry = elem.parentNode.parentNode;
                        // index = Array.prototype.indexOf.call(elem, fileEntry);
                        index = Array.prototype.indexOf.call(fileEntry.children, elem.parentElement);
                    }
                    // check if there is a duplicate
                    // this is to just break the loop
                    return value;
                }
            });
            return index;
        }

        static displaySVG(objectUrl) {
            const url = objectUrl;
            const img = document.createElement('img');
            img.src = url;
            const newTab = window.open('', '_blank', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
            newTab?.document?.body.appendChild(img);
        }

        static previewFileUsingObjectUrl(file) {
            if (file) {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                    window.navigator.msSaveOrOpenBlob(file, file.name);
                } else {
                    let url = window.URL.createObjectURL(file);
                    if (file.type === 'image/svg+xml') {
                        this.displaySVG(url)
                     } else {
                        window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
                     }
                    return url;
                }
            }
        }

        static previewFile (event){
            let url = arguments[1].fileUrl;
            let lastIndex = url.lastIndexOf('/');
            //to make sure url has a slash '/'
            // added check for query param since sas url contains query params & does not have file name, encoding is not required in this case
            if(lastIndex >= 0 && url.indexOf('?') === -1) {
                //encode the filename after last slash to ensure the handling of special characters
                url = url.substr(0, lastIndex) +'/'+ encodeURIComponent(url.substr(lastIndex + 1));
            }
            // this would work for dataURl or normal URL
            window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
        }
        // this function maintains a map for
        handleFilePreview (event){
            let elem = event.target,
                text = elem.textContent,
                index = this.getIndexOfText(text, elem),
                fileDom = null,
                fileName = null,
                fileUrl = null;

            // for draft usecase, if text contains "/" in it, it means the file is already uploaded
            // text should contain the path, assuming that the fileUrl is stored in data element
            if (index !== -1) {
                // Store the url of file as data
                if(typeof elem.dataset.key !== "undefined")
                    fileUrl = elem.dataset.key;

                if(fileUrl && fileUrl !== "[object Blob]")  {
                    //prepend context path if not already appended
                    if (!(fileUrl.lastIndexOf(this.options.contextPath, 0) === 0)) {
                        fileUrl =  this.options.contextPath + fileUrl;
                    }
                    FileInputWidget.previewFile.apply(this, [null, {"fileUrl" : fileUrl}]);
                } else {
                    // todo: add support here
                    //let previewFileObjIdx = this._getFileObjIdx(index);
                    let previewFile = this.fileArr[index]?.data;
                    let objectUrl = FileInputWidget.previewFileUsingObjectUrl(previewFile);
                    if (objectUrl) {
                        elem.dataset.objectUrl = objectUrl;
                    }
                }
            }
        }

        /**
         * This event listener gets called on click of close button in file upload
         *
         * @param event
         */
        handleClick (event){
            let elem = event.target,
                text = elem.previousSibling.textContent,
                index = this.getIndexOfText(text, elem),
                url = elem.previousSibling.dataset.key,
                objectUrl = elem.previousSibling.dataset.objectUrl;
            if (index !== -1) {
                this.values.splice(index, 1);
                this.fileArr.splice(index, 1);
                // set the model with the new value
                this.model.value = this.fileArr;
                // value and fileArr contains items of both URL and file types, hence while removing from DOM
                // get the correct index as per this.widget.files
                let domIndex = Array.from(this.widget.files).findIndex(function(file) {
                    return file.name === text;
                });
                this.deleteFilesFromInputDom([domIndex]);
                if (url != null) {
                    // remove the data so that others don't use this url
                    delete elem.previousSibling.dataset.key;
                }
                if(objectUrl) {
                    // revoke the object URL to avoid memory leaks in browser
                    // since file is anyways getting deleted, remove the object URL's too
                    window.URL.revokeObjectURL(objectUrl);
                }
            }
            // Remove the dom from view
            //All bound events and jQuery data associated with the element are also removed
            elem.parentElement.remove();
            // Set the focus on file upload button after click of close
            this.widget.focus();

        }

        fileItem(fileName, comment, fileUrl) {
            let self = this;
            let fileItem = document.createElement('li');
            fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
            let fileNameDom = document.createElement('span');
            fileNameDom.setAttribute('tabindex', '0');
            fileNameDom.setAttribute('class', "cmp-adaptiveform-fileinput__filename");
            fileNameDom.setAttribute('aria-label', fileName);
            fileNameDom.textContent = fileName;
            fileNameDom.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileNameDom.addEventListener('click', function(e) {
                self.handleFilePreview(e);
            });
            fileItem.appendChild(fileNameDom);
            if(fileUrl != null){
                fileNameDom.dataset.key = fileUrl;
            }
            let fileClose = document.createElement('span');
            fileClose.setAttribute('tabindex', '0');
            fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
            fileClose.setAttribute('aria-label', FormView.LanguageUtils.getTranslatedString(this.lang, "FileCloseAccessText") + fileName);
            fileClose.setAttribute('role', 'button');
            fileClose.textContent = "x";
            fileClose.addEventListener('keypress', function(e) {
                if (e.keyCode === 13 || e.charCode === 32) {
                    e.target.click();
                }
            });
            fileClose.addEventListener('click', function(e) {
                self.handleClick(e);
            });
            fileItem.appendChild(fileClose);
            return fileItem;
        }

        isMultiSelect() {
            return this.options.type === "file[]" || this.options.type === "string[]";
        }

        showFileList(fileName, comment, fileUrl) {
            if(!this.isMultiSelect() || fileName === null || typeof fileName === "undefined") {
                // if not multiselect, remove all the children of file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
            }

            // Add the file item
            // On click of close, remove the element and update the model
            // handle on click of preview button
            if(fileName != null) {
                this.fileList.append(this.fileItem(fileName, comment, fileUrl));
            }
        }

        showInvalidMessage(fileName, invalidFeature){
            let that = this;
            let IS_IPAD = navigator.userAgent.match(/iPad/i) !== null,
                IS_IPHONE = (navigator.userAgent.match(/iPhone/i) !== null);
            if(IS_IPAD || IS_IPHONE){
                setTimeout(function() {
                    that.invalidMessage(that,fileName, invalidFeature);
                }, 0);
            }
            else {
                this.invalidMessage(fileName, invalidFeature);
            }
        }

        invalidMessage(fileName, invalidFeature) {
            const customMessages = this.options.constraintMessages || {};
        
            const messages = {
                [this.invalidFeature.SIZE]: customMessages.maxFileSize || FormView.LanguageUtils.getTranslatedString(this.lang, "FileSizeGreater", [fileName, this.options.maxFileSize]),
                [this.invalidFeature.NAME]: customMessages.invalidFileName || FormView.LanguageUtils.getTranslatedString(this.lang, "FileNameInvalid", [fileName]),
                [this.invalidFeature.MIMETYPE]: customMessages.invalidMimeType || FormView.LanguageUtils.getTranslatedString(this.lang, "FileMimeTypeInvalid", [fileName])
            };
        
            alert(messages[invalidFeature]);
        }


        /*
         * This function returns FileList object of the passed file array
         */
        getFileListItem(files) {
            try {
                let dataContainer = new DataTransfer() || (new ClipboardEvent("")).clipboardData;
                files.forEach(function (file) {
                    dataContainer.items.add(file);
                });
                return dataContainer.files;
            } catch(err) {
                console.error(err);
                throw err;
            }
        }

        updateFilesInDom(files) {
            // in safari, a change event is trigged if files property is changed dynamically
            // hence adding this check to clear existing state only for safari browsers
            this.isFileUpdate = true;
            this.widget.files = this.getFileListItem(files);
            this.isFileUpdate = false;
        }

        /*
         * This function deletes files at specified indexes from input dom elt
         */
        deleteFilesFromInputDom(deletedIndexes) {
            let remainingFiles = [];
            Array.from(this.widget.files).forEach(function(file,idx){
                if(!deletedIndexes.includes(idx)){
                    remainingFiles.push(file);
                }
            });
            try {
                // in safari, a change event is trigged if files property is changed dynamically
                // hence adding this check to clear existing state only for safari browsers
                this.updateFilesInDom(remainingFiles);
            } catch(err){
                console.error("Deleting files is not supported in your browser");
            }
        }

        setValue(value) {
            let isValueSame = false;
            if (value != null) {
                // change to array since we store array internally
                value = Array.isArray(value) ? value : [value];
            }
            // check if current values and new values are same
            if (this.fileArr != null && value != null) {
                isValueSame = JSON.stringify(FormView.FileAttachmentUtils.extractFileInfo(this.fileArr)) === JSON.stringify(value);
            }
            // if new values, update the DOM
            if (!isValueSame) {
                let oldUrls = {};
                // Cache the url before deletion
                this.fileList.querySelectorAll(".cmp-adaptiveform-fileinput__filename").forEach(function (elem) {
                    let url = elem.dataset.key;
                    if (typeof url !== "undefined") {
                        let fileName = url.substring(url.lastIndexOf("/") + 1);
                        oldUrls[fileName] = url;
                    }
                });
                // empty the file list
                while (this.fileList.lastElementChild) {
                    this.fileList.removeChild(this.fileList.lastElementChild);
                }
                // set the new value
                if (value != null) {
                    let self = this;
                    // Update the value array with the file
                    this.values = value.map(function (file, index) {
                        // Check if file Name is a path, if yes get the last part after "/"
                        let isFileObject= window.File ? file.data instanceof window.File : false,
                            fileName = typeof file === "string" ? file : file.name,
                            fileUrl = typeof file === "string" ? file : (isFileObject ? "" : file.data),
                            fileUploadUrl = fileUrl;
                        if (oldUrls[fileName]) {
                            fileUploadUrl = oldUrls[fileName];
                        }
                        self.showFileList(fileName, null, fileUploadUrl);
                        return fileName;
                    });
                    this.fileArr = [...value];
                }
            }
        }

        handleChange(filesUploaded) {
            if (!this.isFileUpdate) {
                let currFileName = '',
                    inValidSizefileNames = '',
                    inValidNamefileNames = '',
                    inValidMimeTypefileNames = '',
                    self = this,
                    files = filesUploaded;
                // Initially set the invalid flag to false
                let isInvalidSize = false,
                    isInvalidFileName = false,
                    isInvalidMimeType = false;
                //this.resetIfNotMultiSelect();
                if (typeof files !== "undefined") {
                    let invalidFilesIndexes = [];
                    Array.from(files).forEach(function (file, fileIndex) {
                        let isCurrentInvalidFileSize = false,
                            isCurrentInvalidFileName = false,
                            isCurrentInvalidMimeType = false;
                        currFileName = file.name.split("\\").pop();
                        // Now size is in MB
                        let size = file.size / 1024 / 1024;
                        // check if file size limit is within limits
                        if ((size > parseFloat(this.options.maxFileSize))) {
                            isInvalidSize = isCurrentInvalidFileSize = true;
                            inValidSizefileNames = currFileName + "," + inValidSizefileNames;
                        } else if (!FileInputWidget.isValid(currFileName)) {
                            // check if file names are valid (ie) there are no control characters in file names
                            isInvalidFileName = isCurrentInvalidFileName = true;
                            inValidNamefileNames = currFileName + "," + inValidNamefileNames;
                        } else {
                            let isMatch = false;
                            let extension = currFileName.split('.').pop();
                            let mimeType = (file.type) ? file.type : self.extensionToMimeTypeMap[extension];
                            if (mimeType != undefined && mimeType.trim().length > 0) {
                                isMatch = this.regexMimeTypeList.some(function (rx) {
                                    return rx.test(mimeType);
                                });
                            }
                            if (!isMatch) {
                                isInvalidMimeType = isCurrentInvalidMimeType = true;
                                inValidMimeTypefileNames = currFileName + "," + inValidMimeTypefileNames;
                            }
                        }

                        // if the file is not invalid, show it and push it to internal array
                        if (!isCurrentInvalidFileSize && !isCurrentInvalidFileName && !isCurrentInvalidMimeType) {
                            this.showFileList(currFileName);
                            if(this.isMultiSelect()) {
                                this.values.push(currFileName);
                                this.fileArr.push(file);
                            } else {
                                this.values = [currFileName];
                                this.fileArr = [file];
                            }
                        } else {
                            invalidFilesIndexes.push(fileIndex);
                        }


                    }, this);

                    if (invalidFilesIndexes.length > 0 && this.widget !== null) {
                        this.deleteFilesFromInputDom(invalidFilesIndexes);
                    }
                }

                // set the new model value.
                this.model.value = this.fileArr;
                //this.model.validate();

                if (isInvalidSize) {
                    this.showInvalidMessage(inValidSizefileNames.substring(0, inValidSizefileNames.lastIndexOf(',')), this.invalidFeature.SIZE);
                } else if (isInvalidFileName) {
                    this.showInvalidMessage(inValidNamefileNames.substring(0, inValidNamefileNames.lastIndexOf(',')), this.invalidFeature.NAME);
                } else if (isInvalidMimeType) {
                    this.showInvalidMessage(inValidMimeTypefileNames.substring(0, inValidMimeTypefileNames.lastIndexOf(',')), this.invalidFeature.MIMETYPE);
                }
            }
            this.widget.value = null;
        }
    }

    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormFileInputWidgetBase);

/***/ }),

/***/ "./src/view/FormOptionFieldBase.js":
/*!*****************************************!*\
  !*** ./src/view/FormOptionFieldBase.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFieldBase.js */ "./src/view/FormFieldBase.js");
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



/**
 * Class containing common view code for dropdown, checkboxgroup and radiobutton
 * @extends module:FormView~FormOptionFieldBase
 */
class FormOptionFieldBase extends _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(params) {
        super(params);
    }


    /**
     * Placeholder method for updating the saved value in the option field.
     * This method is intended to be overridden by the child class.
     * The overriding method should contain the logic for updating the 'enum' value.
     *
     * @param {Array} enums - An array of primitive values to be saved in the option field.
     */
    updateEnum(enums) {
        // Placeholder method, needs to be overridden by the child class
    }

    /**
     * Placeholder method for updating the display value in the option field.
     * This method is intended to be overridden by the child class.
     * The overriding method should contain the logic for updating the 'enumNames' value.
     *
     * @param {Array} enumNames - An array of display values for the option field.
     */
    updateEnumNames(enumNames) {
        // Placeholder method, needs to be overridden by the child class
    }


    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state object.
     */
    applyState(state) {
        super.applyState(state);
        if (state?.enum) {
            this.updateEnum(state.enum)
        }
        if (state?.enumNames) {
            this.updateEnumNames(state.enumNames)
        }
    }

    /**
     * Common method to update the enums of checkbox and radiobutton
     * @param {Array} newEnums - updated enum values
     * @param {CallableFunction} createItemCallback - function to create options
     */
    updateEnumForRadioButtonAndCheckbox(newEnums, createItemCallback) {
        let currentEnumSize = this.getWidget().length;
        if(currentEnumSize === 0) {         // case 1: create option with new enums
            newEnums.forEach(value => {
                this.getWidgets().appendChild(createItemCallback.call(this, value, value));
            });
        } else if(currentEnumSize === newEnums.length) {    // case 2: replace existing enums
            this.widget.forEach((input, index) => {
                input.value = newEnums[index];
            })
        } else if(currentEnumSize < newEnums.length) {  // case 3: replace existing enums and create options with remaining
            this.widget.forEach((input, index) => {
                input.value = newEnums[index];
            })

            newEnums.forEach((value, index) => {
                if(index > currentEnumSize - 1) {
                    this.getWidgets().appendChild(createItemCallback.call(this, value, value));
                }
            });
        } else {
            this.widget.forEach((input, index) => {  // case 4: replace existing enums and remove extra ones
                if(index < newEnums.length){
                    input.value = newEnums[index];
                } else {
                    let optionToRemove = input.parentElement.parentElement;
                    this.getWidgets().removeChild(optionToRemove);
                }
            })
        }
    }

    /**
     * Common method to update the enums Names of checkbox and radiobutton
     * @param {Array} newEnumsNames - updated enum Names values
     * @param {CallableFunction} createItemCallback - function to create options
     */
    updateEnumNamesForRadioButtonAndCheckbox(newEnumNames, createItemCallback) {
        let currentEnumNameSize = this.getWidget().length;
        if(currentEnumNameSize === 0) {
            newEnumNames.forEach((value) => {
                this.getWidgets().appendChild(createItemCallback.call(this, value, value));
            })
        } else if(currentEnumNameSize > newEnumNames.length) {
            [...this.getOptions()].forEach((option, index) => {
                let span = option.querySelector('span');
                let input = option.querySelector('input');
                let valueToSet = index < newEnumNames.length ? newEnumNames[index] : input.value;
                span.innerHTML = window.DOMPurify ?  window.DOMPurify.sanitize(valueToSet) : valueToSet;
            });
        } else {
            [...this.getOptions()].forEach((option, index) => {
                let span = option.querySelector('span');
                span.innerHTML = window.DOMPurify ?  window.DOMPurify.sanitize(newEnumNames[index]) : newEnumNames[index];
            });
        }
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormOptionFieldBase);


/***/ }),

/***/ "./src/view/FormPanel.js":
/*!*******************************!*\
  !*** ./src/view/FormPanel.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormFieldBase.js */ "./src/view/FormFieldBase.js");
/* harmony import */ var _InstanceManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InstanceManager.js */ "./src/view/InstanceManager.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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





/**
 * @module FormView
 */

/**
 * FormPanel class represents a panel within a form.
 * @extends module:FormView~FormFieldBase
 */
class FormPanel extends _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    /**
     * Creates an instance of FormPanel.
     * @param {Object} params - The parameters for initializing the FormPanel.
     */
    constructor(params) {
        super(params);
        this.children = [];
    }

    /**
     * Instantiates the InstanceManager for the FormPanel.
     * @returns {InstanceManager} The newly instantiated InstanceManager.
     */
    instantiateInstanceManager() {
        return new _InstanceManager_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
            "formContainer": this.formContainer,
            "model": this._model.parent,
            "parentElement": this.element.parentElement.parentElement
        });
    }

    /**
     * Sets the model for the FormPanel.
     * @param {Object} model - The model to be set for the FormPanel.
     */
    setModel(model) {
        super.setModel(model);
        if (model.repeatable) {
            let instanceManager = this.formContainer.getField(model.parent.id);
            if (instanceManager == null) {
                instanceManager = this.instantiateInstanceManager();
                this.formContainer.addInstanceManager(instanceManager);
            }
            this.setInstanceManager(instanceManager);
            instanceManager.addChild(this);
        }
    }

    /**
     * Sets the focus to a child element within the FormPanel.
     * @param {string} id - The ID of the child element to set focus to.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView.setFocus) {
            this.parentView.setFocus(this.getId());
        }
    }

    /**
     * Adds a child view to the FormPanel.
     * @param {Object} childView - The child view to be added.
     */
    addChild(childView) {
        this.children.push(childView);
    }

    /**
     * Gets the count of all children in the model.
     * @returns {number} The count of all children in the model.
     */
    getCountOfAllChildrenInModel() {
        var countOfChildren = 0;
        for (let key in this.getModel()._children) {
            var child = this.getModel()._children[key];
            if (child.minOccur != undefined && child.maxOccur != undefined && child._children != undefined) {
                //(child._children.length == 0) this can happen in cases of prefill or removeInstance onLoad via rules
                countOfChildren += (child._children.length == 0) ? 1 : child._children.length;
            } else {
                countOfChildren += 1;
            }
        }
        return countOfChildren;
    }

    /**
     * Gets a child view by its ID.
     * @param {string} id - The ID of the child view to retrieve.
     * @returns {Object} The child view with the specified ID.
     */
    getChild(id) {
        for (let key in this.children) {
            if (this.children[key].id === id) {
                return this.children[key];
            }
        }
    }

    /**
     * Handles the addition of a child view.
     * This method needs to be implemented in tabs, accordion, and wizard.
     * @param {Object} childView - The child view that was added.
     */
    handleChildAddition(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * Handles the removal of a child view.
     * This method needs to be implemented in tabs, accordion, and wizard.
     * @param {Object} childView - The child view that was removed.
     */
    handleChildRemoval(childView) {
        //This needs to be handled in tabs, accordion, wizard
    }

    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state to be applied.
     */
    applyState(state) {
        this.updateVisible(state.visible);
        this.updateEnabled(state.enabled);
        this.initializeHelpContent(state);
        this.updateLabel(state.label);
    }

    /**
     * Updates the HTML state based on the enable state of the panel.
     * @param {boolean} enable - The enable state of the panel.
     * @override
     */
    updateEnabled(enable) {
        this.toggle(enable, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_DISABLED, true);
        this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_ENABLED, enable);
    }

    /**
     * Updates the HTML state based on the valid state of the panel.
     * @param {boolean} valid - The valid state of the panel.
     * @param {Object} state - The state object.
     * @override
     * @deprecated Use the new method updateValidity() instead.
     */
    updateValid(valid, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidity
    }

    /**
     * Updates the HTML state based on the validity state of the panel.
     * @param {object} validity - The validity state of the panel.
     * @param {Object} state - The state object.
     * @override
     */
    updateValidity(validity, state) {
        // todo: handle the type of validity later
        const valid = validity.valid;
        this.toggle(valid, _constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_INVALID, true);
        this.element.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VALID, valid);
    }

    /**
     * Gets the child view at the specified index.
     * This method needs to be implemented in every layout.
     * @param {number} index - The index of the child view.
     */
    getChildViewByIndex(index) {
        //everyLayout needs to implement this method
    }

    /**
     * Gets the closest fields for a given index.
     * @param {number} index - The index to search for closest fields.
     * @returns {Object} An object containing the closest fields information.
     * @private
     */
    #getClosestFields(index) {
        var result = {};
        result["closestRepeatableFieldInstanceManagerIds"] = [];
        for (let i = index - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() == null) {
                result["closestNonRepeatableFieldId"] = fieldView.getId();
                break;
            } else {
                result["closestRepeatableFieldInstanceManagerIds"].push(fieldView.getInstanceManager().getId());
                if (fieldView.getInstanceManager().getModel().minOccur != 0) {
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Caches the closest fields within the view.
     * @private
     */
    cacheClosestFieldsInView() {
        for (let i = 0; i < this.children.length; i++) {
            var fieldView = this.getChildViewByIndex(i);
            if (fieldView.getInstanceManager() != null && fieldView.getInstanceManager().getModel().minOccur == 0) {
                var instanceManagerId = fieldView.getInstanceManager().getId();
                if (this._templateHTML[instanceManagerId] == null) {
                    this._templateHTML[instanceManagerId] = {};
                }
                if (this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] == null &&
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] == null) {
                    var result = this.#getClosestFields(i);
                    this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'] = result["closestNonRepeatableFieldId"];
                    this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'] = result["closestRepeatableFieldInstanceManagerIds"];
                }
            }
        }
    }

    /**
     * Gets the index at which to insert a new field.
     * @param {string} closestNonRepeatableFieldId - The ID of the closest non-repeatable field.
     * @param {string[]} closestRepeatableFieldInstanceManagerIds - The IDs of the closest repeatable field instance managers.
     * @returns {number} The index at which to insert the new field.
     */
    getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds) {
        var resultIndex = -1;
        for (let i = this.children.length - 1; i >= 0; i--) {
            var fieldView = this.getChildViewByIndex(i);
            if (closestNonRepeatableFieldId === fieldView.getId()) {
                resultIndex = i;
                break;
            } else {
                if (fieldView.getInstanceManager() != null && closestRepeatableFieldInstanceManagerIds.includes(fieldView.getInstanceManager().getId())) {
                    resultIndex = i;
                    break;
                }
            }
        }
        return resultIndex + 1;
    }

    /**
     * Gets the repeatable root element of a child view.
     * @param {Object} childView - The child view.
     * @returns {HTMLElement} The repeatable root element.
     */
    getRepeatableRootElement(childView){
      return childView.element.parentElement;
    }

    /**
     * Updates the visibility of a child element.
     * This method needs to be implemented in individual layouts.
     * @param {boolean} visible - The visibility state of the child element.
     * @param {Object} state - The state object.
     */
    updateChildVisibility(visible, state) {
        // implement in individual layouts
    }

    /**
     * Handles the visibility of hidden children.
     * @private
     */
    handleHiddenChildrenVisibility() {
        for (let i = 0; i < this.children.length; i++) {
            let isVisible = this.children[i].element.getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible === 'false') {
                this.updateChildVisibility(false, this.children[i].getModel().getState());
            }
        }
    }

    /**
     * Finds the first visible child element from the given children.
     * @param {HTMLElement[]} children - The children elements to search.
     * @returns {HTMLElement} The first visible child element, or null if none found.
     */
    findFirstVisibleChild(children) {
        for (let i = 0; i < children.length; i++) {
            let isVisible = children[i].getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE);
            if (isVisible != 'false') {
                return children[i];
            }
        }
    }

    /**
     * Updates the visibility of a navigation element.
     * @param {HTMLElement} navigationTabElement - The navigation tab element.
     * @param {boolean} visible - The visibility state of the navigation element.
     * @private
     */
    updateVisibilityOfNavigationElement(navigationTabElement, visible) {
        if (navigationTabElement) {
            if (visible === false) {
                navigationTabElement.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN, true);
            } else {
                navigationTabElement.removeAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN);
            }
            navigationTabElement.setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        }
    }

    /**
     * Updates the HTML class based on the existence of a value in a field. 
     * For the layout components, there's no need to do this, so override the updateEmptyStatus method.
     */
    updateEmptyStatus() {

    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormPanel);


/***/ }),

/***/ "./src/view/FormTabs.js":
/*!******************************!*\
  !*** ./src/view/FormTabs.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
/* harmony import */ var _FormPanel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormPanel.js */ "./src/view/FormPanel.js");
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




/**
 * @module FormView
 */

/**
 * Class representing a FormTabs component.
 * @extends module:FormView~FormPanel
 */
class FormTabs extends _FormPanel_js__WEBPACK_IMPORTED_MODULE_1__["default"] {

    /**
     * Keycodes for various keyboard keys.
     * @type {object}
     */
    static keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    /**
     * Private property for storing the active tab ID.
     * @type {string}
     */
    #_active;

    /**
     * Private property for storing the IS.
     * @type {string}
     */
    #_IS;
    /**
     * Private property for storing the namespace.
     * @type {string}
     */
    #_NS;
    /**
     * Private property for storing the selectors.
     * @type {object}
     */
    #_selectors;
    /**
     * Suffix for tab IDs.
     * @type {string}
     */
    #tabIdSuffix = "__tab";
    /**
     * Suffix for tab panel IDs.
     * @type {string}
     */
    #tabPanelIdSuffix = "__tabpanel";
    /**
     * Template HTML object.
     * @type {object}
     */
    _templateHTML = {};

    /**
     * Create a FormTabs instance.
     * @param {object} params - The parameters object.
     * @param {HTMLElement} params.element - The element for the FormTabs component.
     * @param {string} ns - The namespace.
     * @param {string} is - The IS.
     * @param {object} selectors - The selectors object.
     */
    constructor(params, ns, is, selectors) {
        super(params);
        this.#_NS = ns;
        this.#_IS = is;
        this.#_selectors = selectors;
        const {element} = params;
        this.#cacheElements(element);
        this.#_active = this.getActiveTabId(this.#getCachedTabs());
        this.#refreshActive();
        this.#bindEvents();
    }

    /**
     * Refreshes the tab markup based on the current active index.
     * @private
     */
    #refreshActive() {
        var tabpanels = this.#getCachedTabPanels();
        var tabs = this.#getCachedTabs();
        if (tabpanels) {
            for (var i = 0; i < tabpanels.length; i++) {
                // In case of repeatability ( adding instance via loop) tabs and tabpanels may be out of sync, it will sync in future
                if(tabs[i]) {
                    if (tabs[i].id === this.#_active) {
                        tabpanels[i].classList.add(this.#_selectors.active.tabpanel);
                        tabpanels[i].removeAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN);
                        tabs[i].classList.add(this.#_selectors.active.tab);
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_SELECTED, true);
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.TABINDEX, "0");
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_CURRENT, "true");
                    } else {
                        tabpanels[i].classList.remove(this.#_selectors.active.tabpanel);
                        tabpanels[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_HIDDEN, true);
                        tabs[i].classList.remove(this.#_selectors.active.tab);
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_SELECTED, false);
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.TABINDEX, "-1");
                        tabs[i].setAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_0__.Constants.ARIA_CURRENT, "false");
                    }
                }
            }
        }
    }

    /**
     * Binds Tabs event handling.
     * @private
     */
    #bindEvents() {
        var tabs = this.#getCachedTabs();
        if (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                var _self = this;
                (function (index) {
                    tabs[index].addEventListener("click", function (event) {
                        // Check if the clicked element is the tab itself
                        if (event?.target?.id === tabs[index].id) {
                            _self.navigateAndFocusTab(tabs[index].id);
                        }

                    });
                }(i));
                tabs[i].addEventListener("keydown", function (event) {
                    _self.#onKeyDown(event);
                });
            }
            ;
        }
    }

    /**
     * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API.
     * @private
     * @param {HTMLElement} wrapper - The Tabs wrapper element.
     */
    #cacheElements(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll("[data-" + this.#_NS + "-hook-" + this.#_IS + "]");

        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            if (hook.closest("[data-cmp-is=" + this.#_IS + "]") === this._elements.self) { // only process own tab elements
                var lowerCased = this.#_IS.toLowerCase();
                var capitalized = lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
                var key = hook.dataset[this.#_NS + "Hook" + capitalized];
                if (this._elements[key]) {
                    if (!Array.isArray(this._elements[key])) {
                        var tmp = this._elements[key];
                        this._elements[key] = [tmp];
                    }
                    this._elements[key].push(hook);
                } else {
                    this._elements[key] = [hook];
                }
            }
        }
    }

    /**
     * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API.
     * @private
     * @param {HTMLElement} wrapper - The Tabs wrapper element.
     */
    #onKeyDown(event) {
        var index = this.#getTabIndexById(this.#_active);
        var tabs = this.#getCachedTabs();
        var lastIndex = tabs.length - 1;

        switch (event.keyCode) {
            case FormTabs.keyCodes.ARROW_LEFT:
            case FormTabs.keyCodes.ARROW_UP:
                event.preventDefault();
                if (index > 0) {
                    this.navigateAndFocusTab(tabs[index - 1].id);
                }
                break;
            case FormTabs.keyCodes.ARROW_RIGHT:
            case FormTabs.keyCodes.ARROW_DOWN:
                event.preventDefault();
                if (index < lastIndex) {
                    this.navigateAndFocusTab(tabs[index + 1].id);
                }
                break;
            case FormTabs.keyCodes.HOME:
                event.preventDefault();
                this.navigateAndFocusTab(tabs[0].id);
                break;
            case FormTabs.keyCodes.END:
                event.preventDefault();
                this.navigateAndFocusTab(tabs[lastIndex].id);
                break;
            default:
                return;
        }
    }

    /**
     * Retrieves the index of a tab element by its ID.
     * @param {string} tabId - The ID of the tab element.
     * @returns {number} The index of the tab element, or -1 if not found.
     */
    #getTabIndexById(tabId) {
        var tabs = this.#getCachedTabs();
        if (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].id === tabId) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * Navigates to the item at the provided index and ensures the active tab gains focus.
     * @private
     * @param {string} tabId - The ID of the tab to navigate to.
     */
    navigateAndFocusTab(tabId) {
        this.setActive();
        // if current active tab and the new tabId is not same, only then set the new tab as active
        if (this.#_active !== tabId) {
            this.navigate(tabId);
            this.focusWithoutScroll(this.#getTabNavElementById(tabId));
        }
    }



    #getTabNavElementById(tabId) {
        var tabs = this.#getCachedTabs();
        if (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].id === tabId) {
                    return tabs[i];
                }
            }
        }
    }

    /**
     * Focuses the element and prevents scrolling the element into view.
     * @param {HTMLElement} element - Element to focus.
     */
    focusWithoutScroll(element) {
        if(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }
    }

    /**
     * Navigates to the tab at the provided index
     *
     * @private
     * @param {Number} index The index of the tab to navigate to
     */
    navigate(tabId) {
        this.#_active = tabId;
        this.addSteppedClass(tabId);
        this.#refreshActive();
    }


    addSteppedClass(tabId) {
        var tabs = this.#getCachedTabs();
        var tabpanels= this.#getCachedTabPanels();
        const activeTabId = this.getActiveTabId(tabs); 
        const activeTabElement = this.#getTabNavElementById(activeTabId);
        if (activeTabElement.classList.contains(this.#_selectors.active.tab)) {
            activeTabElement.classList.add(this.#_selectors.stepped.tab);

            const correspondingPanel = Array.from(tabpanels).find(panel =>
                panel.getAttribute("aria-labelledby") === activeTabElement.id
            );
    
            if (correspondingPanel) {
                correspondingPanel.classList.add(this.#_selectors.stepped.tabpanel);
            }
        }
    }

    /**
     * Returns the id of the active tab, if no tab is active returns 0th element id
     *
     * @param {Array} tabs Tab elements
     * @returns {Number} Id of the active tab, 0th element id if none is active
     */
    getActiveTabId(tabs) {
        if (tabs) {
            var result = tabs[0].id;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].classList.contains(this.#_selectors.active.tab)) {
                    result = tabs[i].id;
                    break;
                }
            }
            return result;
        }
    }


    /**
     * Synchronizes tab labels with their corresponding tab panels.
     * Updates the ID and aria-controls attribute of each tab label.
     * @private
     */
    #syncTabLabels() {
        var tabs = this.#getCachedTabs();
        var tabPanels = this.#getCachedTabPanels();
        if (tabPanels) {
            for (var i = 0; i < tabPanels.length; i++) {
                var childViewId = tabPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                tabs[i].id = childViewId + this.#tabIdSuffix;
                tabs[i].setAttribute("aria-controls", childViewId + this.#tabPanelIdSuffix);
            }
        }
    }

    /**
     * Synchronizes tab panels with their corresponding tab labels.
     * Updates the ID and aria-labelledby attribute of each tab panel.
     * @private
     */
    #syncTabPanels() {
        var tabPanels = this.#getCachedTabPanels();
        if (tabPanels) {
            for (var i = 0; i < tabPanels.length; i++) {
                var childViewId = tabPanels[i].querySelectorAll("[data-cmp-is]")[0].id;
                tabPanels[i].id = childViewId + this.#tabPanelIdSuffix;
                tabPanels[i].setAttribute("aria-labelledby", childViewId + this.#tabIdSuffix);
            }
        }
    }

    /**
     * Synchronizes the markup with the component model.
     * Calls the syncMarkupWithModel method of the superclass.
     * Calls #syncTabLabels and #syncTabPanels methods.
     */
    syncMarkupWithModel() {
        super.syncMarkupWithModel();
        this.#syncTabLabels();
        this.#syncTabPanels();
    }

    /**
     * Handles the addition of a child view.
     * @param {Object} childView - The child view being added.
     * @override
     */
    handleChildAddition(childView) {
        if (childView.getInstanceManager() != null && this._templateHTML[childView.getInstanceManager().getId()] != null) {
            var navigationTabToBeRepeated = this._templateHTML[childView.getInstanceManager().getId()]['navigationTab'].cloneNode(true);
            navigationTabToBeRepeated.id = childView.id + this.#tabIdSuffix;
            navigationTabToBeRepeated.setAttribute("aria-controls", childView.id + this.#tabPanelIdSuffix);
            var instanceIndex = childView.getModel().index;
            var instanceManagerId = childView.getInstanceManager().getId();
            if (instanceIndex == 0) {
                var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
                var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
                var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
                if (indexToInsert == 0) {
                    var tabListParentElement = this.#getTabListElement();
                    tabListParentElement.insertBefore(navigationTabToBeRepeated, tabListParentElement.firstChild);
                } else {
                    var beforeElement = this.#getCachedTabs()[indexToInsert - 1];
                    beforeElement.after(navigationTabToBeRepeated);
                }
            } else {
                var beforeTabNavElementId = childView.getInstanceManager().children[instanceIndex - 1].element.id + this.#tabIdSuffix
                var beforeElement = this.#getTabNavElementById(beforeTabNavElementId);
                beforeElement.after(navigationTabToBeRepeated);
            }
            this.#cacheElements(this._elements.self);
            var repeatedTabPanel = this.#getTabPanelElementById(childView.id + this.#tabPanelIdSuffix);
            repeatedTabPanel.setAttribute("aria-labelledby", childView.id + this.#tabIdSuffix);
            const steppedTabClass = Array.from(navigationTabToBeRepeated.classList).find(cls => cls.includes('--stepped'));
            if (steppedTabClass) {
                navigationTabToBeRepeated.classList.remove(steppedTabClass);
            }
            const steppedTabpanelClass = Array.from(repeatedTabPanel.classList).find(cls => cls.includes('--stepped'));
            if (steppedTabpanelClass) {
                repeatedTabPanel.classList.remove(steppedTabpanelClass);
            }
            this.#bindEventsToTab(navigationTabToBeRepeated.id);
            this.#refreshActive();
            if (childView.getInstanceManager().getModel().minOccur != undefined && childView.getInstanceManager().children.length > childView.getInstanceManager().getModel().minOccur) {
                this.navigateAndFocusTab(navigationTabToBeRepeated.id);
            } else {
                //this will run at initial loading of runtime and keep the first tab active
                this.navigateAndFocusTab(this.findFirstVisibleChild(this.#getCachedTabs()).id);
            }
        }
    }


    /**
     * Handles the removal of a child view.
     * @param {Object} removedInstanceView - The removed child view.
     * @override
     */
    handleChildRemoval(removedInstanceView) {
        var removedTabPanelId = removedInstanceView.element.id + this.#tabPanelIdSuffix;
        var removedTabNavId = removedInstanceView.element.id + this.#tabIdSuffix;
        var tabPanelElement = this.#getTabPanelElementById(removedTabPanelId);
        var tabNavElement = this.#getTabNavElementById(removedTabNavId);
        tabNavElement.remove();
        tabPanelElement.remove();
        this.children.splice(this.children.indexOf(removedInstanceView), 1);
        this.#cacheElements(this._elements.self);
        this.#_active = this.getActiveTabId(this._elements["tab"]);
        this.#refreshActive();
    }

    /**
     * Adds a child view.
     * @param {Object} childView - The child view to be added.
     * @override
     */
    addChild(childView) {
        super.addChild(childView);
        this.#cacheTemplateHTML(childView);
        if (this.getCountOfAllChildrenInModel() === this.children.length) {
            this.cacheClosestFieldsInView();
            this.handleHiddenChildrenVisibility();
        }
    }

    /**
     * Caches the HTML template for a child view.
     * @param {Object} childView - The child view.
     * @private
     */
    #cacheTemplateHTML(childView) {
        if (childView.getInstanceManager() != null && (this._templateHTML == null || this._templateHTML[childView.getInstanceManager().getId()] == null)) {
            var tabId = childView.element.id + this.#tabIdSuffix;
            var tabPanelId = childView.element.id + this.#tabPanelIdSuffix;
            var instanceManagerId = childView.getInstanceManager().getId();
            var navigationTabToBeRepeated = this.#getTabNavElementById(tabId);
            var tabPanelToBeRepeated = this.#getTabPanelElementById(tabPanelId);
            this._templateHTML[instanceManagerId] = {};
            this._templateHTML[instanceManagerId]['navigationTab'] = navigationTabToBeRepeated;
            this._templateHTML[instanceManagerId]['targetTabPanel'] = tabPanelToBeRepeated;
        }
    }

    /**
     * Gets the tab panel element by its ID.
     * @param {string} tabPanelId - The ID of the tab panel element.
     * @returns {HTMLElement} The tab panel element.
     * @private
     */
    #getTabPanelElementById(tabPanelId) {
        var tabPanels = this.#getCachedTabPanels();
        if (tabPanels) {
            for (var i = 0; i < tabPanels.length; i++) {
                if (tabPanels[i].id === tabPanelId) {
                    return tabPanels[i];
                }
            }
        }
    }

    /**
     * Binds events to a tab element.
     * @param {string} tabId - The ID of the tab element.
     * @private
     */
    #bindEventsToTab(tabId) {
        var _self = this;
        var tabs = this.#getCachedTabs();
        var index = this.#getTabIndexById(tabId);
        tabs[index].addEventListener("click", function (event) {
            // Check if the clicked element is the tab itself
            if (event?.target?.id === tabId) {
                _self.navigateAndFocusTab(tabId);
            }
        });
        tabs[index].addEventListener("keydown", function (event) {
            _self.#onKeyDown(event);
        });
    }

    /**
     * Gets the tab list element.
     * @returns {HTMLElement} The tab list element.
     * @private
     */
    #getTabListElement() {
        return this.element.querySelector(this.#_selectors.olTabList)
    }

    /**
     * Gets the cached tab panels.
     * @returns {NodeList} The cached tab panels.
     * @private
     */
    #getCachedTabPanels() {
        return this._elements["tabpanel"]
    }

    /**
     * Gets the cached tabs.
     * @returns {NodeList} The cached tabs.
     * @private
     */
    #getCachedTabs() {
        return this._elements["tab"];
    }

    /**
     * Adds unique HTML for an added instance corresponding to the requirements of different types of repeatable parents.
     * @param {Object} instanceManager - The instance manager of the repeated component.
     * @param {Object} addedModel - The added model of the repeated component.
     * @param {HTMLElement} htmlElement - The HTML element of the repeated component.
     * @returns {HTMLElement} The enclosed element containing the added instance HTML.
     */
    addRepeatableMarkup(instanceManager, addedModel, htmlElement) {
        let elementToEnclose = this._templateHTML[instanceManager.getId()]['targetTabPanel'].cloneNode(false);
        elementToEnclose.id = addedModel.id + this.#tabPanelIdSuffix;
        let result = this.#getBeforeViewElement(instanceManager, addedModel.index);
        let beforeViewElement = result.beforeViewElement;
        beforeViewElement.after(elementToEnclose);
        elementToEnclose.append(htmlElement);
        return elementToEnclose;
    }

    /**
     * Gets the element before which a new view should be inserted.
     * @param {Object} instanceManager - The instance manager.
     * @param {number} instanceIndex - The index of the instance.
     * @returns {Object} An object with the before view element.
     * @private
     */
    #getBeforeViewElement(instanceManager, instanceIndex) {
        var result = {};
        var instanceManagerId = instanceManager.getId();
        if (instanceIndex == 0) {
            var closestNonRepeatableFieldId = this._templateHTML[instanceManagerId]['closestNonRepeatableFieldId'];
            var closestRepeatableFieldInstanceManagerIds = this._templateHTML[instanceManagerId]['closestRepeatableFieldInstanceManagerIds'];
            var indexToInsert = this.getIndexToInsert(closestNonRepeatableFieldId, closestRepeatableFieldInstanceManagerIds);
            if (indexToInsert > 0) {
                result.beforeViewElement = this.#getCachedTabPanels()[indexToInsert - 1];
            } else {
                result.beforeViewElement = this.#getTabListElement();
            }
        } else {
            let previousInstanceElement = this.#getRepeatableElementAt(instanceManager, instanceIndex - 1);
            result.beforeViewElement = previousInstanceElement;
        }
        return result;
    }

    #getRepeatableElementAt(instanceManager, index) {
        let childId = instanceManager._model.items.find((model) => model.index === index)?.id;
        return this.element.querySelector(`#${childId}${this.#tabPanelIdSuffix}`);
    }

    /**
     * Gets the child view at the specified index.
     * @param {number} index - The index of the child view.
     * @returns {Object} The child view at the specified index.
     * @override
     */
    getChildViewByIndex(index) {
        var allTabPanels = this.#getCachedTabPanels();
        var fieldId = allTabPanels[index].id.substring(0, allTabPanels[index].id.lastIndexOf("__"));
        return this.getChild(fieldId);
    }


    /**
     * Updates the visibility of a child element based on the provided state.
     * @param {boolean} visible - The visibility state of the child element.
     * @param {Object} state - The state of the child element.
     * @override
     */
    updateChildVisibility(visible, state) {
        this.updateVisibilityOfNavigationElement(this.#getTabNavElementById(state.id + this.#tabIdSuffix), visible);
        var activeTabId = this.getActiveTabId(this._elements["tab"]);
        if (!visible && activeTabId === state.id + this.#tabIdSuffix) {
            let child = this.findFirstVisibleChild(this.#getCachedTabs());
            if (child) {
                this.navigateAndFocusTab(child.id)
            }
        }
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormTabs);


/***/ }),

/***/ "./src/view/InstanceManager.js":
/*!*************************************!*\
  !*** ./src/view/InstanceManager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants.js */ "./src/constants.js");
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





/**
 * @module FormView
 */

/**
 * Class representing an instance manager to manage repeatable instances.
 */
class InstanceManager {

    /**
     * Creates an instance of the InstanceManager.
     * @param {object} params - The parameters for the InstanceManager.
     * @param {module:FormView~FormContainer} params.formContainer - The form container object
     * @param {object} params.model - The model associated with the instance manager.
     * @param {HTMLElement} params.parentElement - The parent element of the instance manager.
     */
    constructor(params) {
        this.formContainer = params.formContainer;
        this._model = params.model;
        this.parentElement = params.parentElement;
        this.id = this._model.id;
        this.children = [];
        this.subscribe();
    }

    /**
     * Syncs Instance View HTML with Instance Model
     * @param instanceView
     * @param instanceModel
     * @param beforeElement
     * @returns addedHtmlElement, if HTML is added, otherwise null
     */
    #syncViewModel(instanceView, instanceModel, beforeElement) {
        //todo can be optimized if the instance model has shifted to a new index - complex
        let addedHtmlElement = null;
        if (instanceView == null) {
            addedHtmlElement = this.#addChildInstance(instanceModel, beforeElement);
            _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].createFieldsForAddedElement(addedHtmlElement, this.formContainer);
        } else if (instanceModel == null) {
            this.#removeChildInstance(instanceView.getModel());
        } else if (instanceView.getId() != instanceModel.id) {
            addedHtmlElement = this.#addChildInstance(instanceModel, beforeElement);
            _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].createFieldsForAddedElement(addedHtmlElement, this.formContainer);
            this.#removeChildInstance(instanceView.getModel());
        }
        return addedHtmlElement;
    }

    /**
     * Syncs instanceManager model items with HTML
     * @private
     */
    #syncInstancesHTML() {
        const views = this.children;
        const models = this._model.items;
        const viewInstancesLength = views.length;
        const modelInstancesLength = models.length;
        const maxLength = viewInstancesLength > modelInstancesLength ? viewInstancesLength : modelInstancesLength;
        let addedHtmlElement = null;
        for (let index = 0; index < maxLength; index++) {
            const instanceView = (index < viewInstancesLength) ? views[index] : null;
            const instanceModel = (index < modelInstancesLength) ? models[index] : null;
            addedHtmlElement = this.#syncViewModel(instanceView, instanceModel, addedHtmlElement);            
        }
    }

    /**
     * Updates template IDs in the HTML based on the model
     * @param html {HTMLElement} The HTML element to update
     * @param model {object} The model associated with the HTML element
     * @param newId {string} The new ID to assign to the HTML element
     * @private
     */
    #updateTemplateIds(html, model, newId) {
        //In case of instance manager, type is an array, which doesn't have presence in HTML
        if (model.type != 'array') {
            _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateId(html, model.id, newId);
        }
        if (model.fieldType == 'panel' && model.items) {
            for (let i = 0; i < model.items.length; i++) {
                this.#updateTemplateIds(html, model.items[i], newId + "_" + i);
            }
        }
    }

    /**
     * Updates clone IDs in the HTML based on the old ID and new model
     * @param html {HTMLElement} The HTML element to update
     * @param oldId {string} The old ID to replace
     * @param newModel {object} The new model associated with the HTML element
     */
    updateCloneIds(html, oldId, newModel) {
        //In case of instance manager, type is an array, which doesn't have presence in HTML
        if (newModel.type != 'array') {
            _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateId(html, oldId, newModel.id);
        }
        if (newModel.fieldType == 'panel' && newModel.items) {
            for (let i = 0; i < newModel.items.length; i++) {
                this.updateCloneIds(html, oldId + "_" + i, newModel.items[i]);
            }
        }
    }

    /**
     * Updates the template with the given child view
     * @param childView {object} The child view to update the template with
     */
    updateTemplate(childView) {
        const repeatableElement = childView.element.parentElement;
        /**
         //inserting marker
         let markerElement = document.createElement('div');
         markerElement.setAttribute("id", this.getId());
         markerElement.classList.add("form-instance-marker");
         this.parentElement.insertBefore(markerElement, repeatableElement);
         this.markerElement = markerElement;
         **/
        //adding template
        this._templateHTML = repeatableElement.cloneNode(true);
        let childModel = childView.getModel();
        // In case of removed instance by prefill, that is index is -1, model is not associated with view
        if (!childModel) {
            childModel = this.formContainer.getModel(childView.getId());
        }
        this.#updateTemplateIds(this._templateHTML, childModel, 'temp_0');
    }

    /**
     * Dispatches a model event with the given event name and payload
     * @param event {object} The event object
     * @param eventName {string} The name of the event to dispatch
     * @param payload {object} The payload to include in the event
     * @private
     */
    #dispatchModelEvent(event, eventName, payload) {
        const customEvent = new CustomEvent(eventName);
        if (payload) {
            customEvent.payload = payload;
        }
        // todo else derive the index and count from event
        this.getModel().dispatch(customEvent);
    }

    /**
     * Adds a child instance based on the added model and position before the element
     * @param addedModel {object} The model of the added instance
     * @param beforeElement {HTMLElement} The element before which the instance should be added
     * @returns {HTMLElement} The added HTML element
     * @private
     */
    #addChildInstance(addedModel, beforeElement) {
        if (!(this._templateHTML)) {
            console.error('Panel needs to have templateHTML to support repeatability.');
            return;
        }
        return this.handleAddition(addedModel, beforeElement);
    }

    /**
     * Removes a child instance based on the removed model
     * @param removedModel {object} The model of the removed instance
     * @private
     */
    #removeChildInstance(removedModel) {
        const removedIndex = removedModel.index;
        let removedChildView = this.children[removedIndex];
        if (removedIndex == -1) {
            //That is, model was removed by prefill, and instance manager was synced with child already removed
            removedChildView = this.formContainer.getField(removedModel.id);
        }
        _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].removeFieldReferences(removedChildView, this.formContainer);
        this.handleRemoval(removedChildView);
        this.children.splice(removedIndex, 1);

        const event = new CustomEvent(_constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.PANEL_INSTANCE_REMOVED, {"detail": removedChildView});
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    /**
     * Adds an instance based on the event and payload
     * @param event {object} The event object
     * @param payload {object} The payload associated with the event
     */
    addInstance(event, payload) {
        this.#dispatchModelEvent(event, "addInstance", payload);
    }

    /**
     * Removes an instance based on the event and payload
     * @param event {object} The event object
     * @param payload {object} The payload associated with the event
     */
    removeInstance(event, payload) {
        this.#dispatchModelEvent(event, "removeInstance", payload);
    }

    /**
     * Adds or removes an instance based on the ID, event name, index, and event
     * @param id {string} The ID of the instance
     * @param eventName {string} The name of the event
     * @param index {number} The index of the instance
     * @param event {object} The event object
     * @private
     */
    #addRemoveInstance(id, eventName, index, event){
      const model = this.formContainer.getModel(id);
      const customEvent = new CustomEvent(eventName);
      customEvent.payload = model.index + index;
      model.parent.dispatch(customEvent);
      event.stopPropagation();
    }

    /**
     * Registers instance handlers for the child view
     * @param childView {object} The child view to register handlers for
     * @private
     */
    #registerInstanceHandlers(childView) {
        if(typeof this?.repeatableParentView?.getRepeatableRootElement === "function"){
          const parentElement = this.repeatableParentView.getRepeatableRootElement(childView);
          _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].registerClickHandler(parentElement, _constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.DATA_HOOK_ADD_INSTANCE, (event) => {
              const id = event.currentTarget.getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.DATA_HOOK_ADD_INSTANCE);
              if(!id){
                this.addInstance(event);
              }else {
                this.#addRemoveInstance(id, 'addInstance', 1, event);
              }
          });
          _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].registerClickHandler(parentElement, _constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.DATA_HOOK_REMOVE_INSTANCE, (event) => {
              const id = event.currentTarget.getAttribute(_constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.DATA_HOOK_REMOVE_INSTANCE);
              if(!id){
                this.removeInstance(event);
              }else {
                this.#addRemoveInstance(id, 'removeInstance', 0, event);
              }
          });
        }
    }

    /**
     * Inserts HTML for the added instance
     * @param addedInstanceJson {object} The JSON representation of the added instance
     * @param beforeElement {HTMLElement} The element before which the instance should be added
     * @returns {HTMLElement} The added HTML element
     */
    handleAddition(addedInstanceJson, beforeElement) {
        const instanceIndex = addedInstanceJson.index;
        let htmlElement = this._templateHTML.cloneNode(true);
        //get the model from added instance state
        let addedModel = this.formContainer.getModel(addedInstanceJson.id);
        this.updateCloneIds(htmlElement, 'temp_0', addedModel);
        if (this.repeatableParentView && (typeof this.repeatableParentView.addRepeatableMarkup === "function")) {
            htmlElement = this.repeatableParentView.addRepeatableMarkup(this, addedModel, htmlElement);
        } else {
            // this is required if repeatableParentView is the formContainer.
            //no child exist in the view
            if (this.children.length == 0) {
                this.parentElement.append(htmlElement);
                //this.markerElement.after(htmlElement);
            } else if (addedModel.index == 0) {
                //special case for first element
                let afterElement = this.children[0].element.parentElement;
                this.parentElement.insertBefore(htmlElement, afterElement);
            } else {
                let beforeViewElement = this.getElementAt(instanceIndex - 1);
                beforeViewElement.after(htmlElement);
            }
        }
        return htmlElement;
    }

    /**
     * Gets the HTML element at the given index
     * @param index {number} The index of the element
     * @returns {Element}
     */
    getElementAt(index) {
        let childModel = this._model.items.find((model) => model.index === index);
        let viewElement = this.parentElement.querySelector(`#${childModel.id}`);
        if (viewElement) {
            while (viewElement.parentElement !== this.parentElement) {
                viewElement = viewElement.parentElement;
            }
        }
        return viewElement;
    }

    /**
     * Removes HTML for the removed instance
     * @param removedInstanceView {object} The view of the removed instance
     */
    handleRemoval(removedInstanceView) {
        if (this.repeatableParentView && (typeof this.repeatableParentView.handleChildRemoval === "function")) {
            //give parentView chance to adjust to removed instance
            this.repeatableParentView.handleChildRemoval(removedInstanceView);
        }
        //removing just the parent view HTML child instance, to avoid repainting of UI for removal of each child HTML
        removedInstanceView.element.parentElement.remove();
    }

    /**
     * Adds a repeatable instance view
     * @param childView {object} The child view to add
     * @fires module:FormView~Constants#PANEL_INSTANCE_ADDED
     */
    addChild(childView) {
        //Add template when first view is added
        if (!(this._templateHTML)) {
            this.updateTemplate(childView);
        }
        //adding view post mutation observer has added view for repeatable instance
        this.children.splice(childView.getModel().index, 0, childView);
        this.#registerInstanceHandlers(childView);
        const event = new CustomEvent(_constants_js__WEBPACK_IMPORTED_MODULE_1__.Constants.PANEL_INSTANCE_ADDED, {"detail": childView});
        if (this.repeatableParentView && (typeof this.repeatableParentView.handleChildAddition === "function")) {
            //give parentView chance to adjust to added instance
            this.repeatableParentView.handleChildAddition(childView);
        }
        this.formContainer.getFormElement().dispatchEvent(event);
    }

    /**
     * Adds or removes repeatable children
     * @param {object} prevValue - The previous value (removed instance) or null
     * @param {object} currentValue - The current value (added instance) or null
     * @param {object} state - The state object
     */
    updateItems(prevValue, currentValue, state) {
        //if previous value exists it means remove item is invoked
        if (prevValue) {
            this.#removeChildInstance(prevValue);
        } else if (currentValue) {
            this.#addChildInstance(currentValue);
        }
    }

    /**
     * Subscribes model for change handler
     */
    subscribe() {
        this.getModel().subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                if ("items" === change.propertyName) {
                    this.updateItems(change.prevValue, change.currentValue, state);
                } else {
                    console.warn(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }

    /**
     * Gets the ID of the instance manager
     * @returns {string} The ID
     */
    getId() {
        return this.id;
    }

    /**
     * Gets the model associated with the instance manager
     * @returns {object} The model
     */
    getModel() {
        return this._model;
    }

    /**
     * Sets the repeatable parent view
     * @param {object} parentView - The repeatable parent view
     */
    setRepeatableParentView(parentView) {
        //adding repeatable parent view
        this.repeatableParentView = parentView;
        //setting parent view ensures view is now fully functional,
        // so proceed with syncing instanceManager model items with HTML
        this.#syncInstancesHTML();
        if(this.children.length > 0) {
          this.#registerInstanceHandlers(this.children[0]);
        }
    }

    /**
     * Gets the repeatable parent view
     * @returns {object} The repeatable parent view
     */
    getRepeatableParentView() {
        return this.repeatableParentView;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InstanceManager);


/***/ }),

/***/ "./src/view/index.js":
/*!***************************!*\
  !*** ./src/view/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormCheckBox: () => (/* reexport safe */ _FormCheckBox_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   FormContainer: () => (/* reexport safe */ _FormContainer_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   FormField: () => (/* reexport safe */ _FormField_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   FormFieldBase: () => (/* reexport safe */ _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   FormFileInput: () => (/* reexport safe */ _FormFileInput_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   FormFileInputWidget: () => (/* reexport safe */ _FormFileInputWidget_js__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   FormFileInputWidgetBase: () => (/* reexport safe */ _FormFileInputWidgetBase_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   FormOptionFieldBase: () => (/* reexport safe */ _FormOptionFieldBase__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   FormPanel: () => (/* reexport safe */ _FormPanel_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   FormTabs: () => (/* reexport safe */ _FormTabs_js__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var _FormContainer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormContainer.js */ "./src/view/FormContainer.js");
/* harmony import */ var _FormField_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormField.js */ "./src/view/FormField.js");
/* harmony import */ var _FormFieldBase_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FormFieldBase.js */ "./src/view/FormFieldBase.js");
/* harmony import */ var _FormPanel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FormPanel.js */ "./src/view/FormPanel.js");
/* harmony import */ var _FormTabs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FormTabs.js */ "./src/view/FormTabs.js");
/* harmony import */ var _FormCheckBox_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./FormCheckBox.js */ "./src/view/FormCheckBox.js");
/* harmony import */ var _FormFileInput_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FormFileInput.js */ "./src/view/FormFileInput.js");
/* harmony import */ var _FormFileInputWidgetBase_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./FormFileInputWidgetBase.js */ "./src/view/FormFileInputWidgetBase.js");
/* harmony import */ var _FormOptionFieldBase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./FormOptionFieldBase */ "./src/view/FormOptionFieldBase.js");
/* harmony import */ var _FormFileInputWidget_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./FormFileInputWidget.js */ "./src/view/FormFileInputWidget.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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















/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/Lexer.js":
/*!****************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/Lexer.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lexer)
/* harmony export */ });
/* harmony import */ var _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tokenDefinitions.js */ "./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js");
/* eslint-disable no-underscore-dangle */


const {
  TOK_UNQUOTEDIDENTIFIER,
  TOK_QUOTEDIDENTIFIER,
  TOK_RBRACKET,
  TOK_RPAREN,
  TOK_COMMA,
  TOK_COLON,
  TOK_CONCATENATE,
  TOK_RBRACE,
  TOK_NUMBER,
  TOK_CURRENT,
  TOK_GLOBAL,
  TOK_EXPREF,
  TOK_PIPE,
  TOK_OR,
  TOK_AND,
  TOK_ADD,
  TOK_SUBTRACT,
  TOK_UNARY_MINUS,
  TOK_MULTIPLY,
  TOK_POWER,
  TOK_DIVIDE,
  TOK_UNION,
  TOK_EQ,
  TOK_GT,
  TOK_LT,
  TOK_GTE,
  TOK_LTE,
  TOK_NE,
  TOK_FLATTEN,
  TOK_STAR,
  TOK_FILTER,
  TOK_DOT,
  TOK_NOT,
  TOK_LBRACE,
  TOK_LBRACKET,
  TOK_LPAREN,
  TOK_LITERAL,
} = _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// The "&", "[", "<", ">" tokens
// are not in basicToken because
// there are two token variants
// ("&&", "[?", "<=", ">=").  This is specially handled
// below.

const basicTokens = {
  '.': TOK_DOT,
  // "*": TOK_STAR,
  ',': TOK_COMMA,
  ':': TOK_COLON,
  '{': TOK_LBRACE,
  '}': TOK_RBRACE,
  ']': TOK_RBRACKET,
  '(': TOK_LPAREN,
  ')': TOK_RPAREN,
  '@': TOK_CURRENT,
};

const globalStartToken = '$';
const operatorStartToken = {
  '<': true,
  '>': true,
  '=': true,
  '!': true,
};

const skipChars = {
  ' ': true,
  '\t': true,
  '\n': true,
};

function isNum(ch) {
  return (ch >= '0' && ch <= '9') || (ch === '.');
}

function isAlphaNum(ch) {
  return (ch >= 'a' && ch <= 'z')
           || (ch >= 'A' && ch <= 'Z')
           || (ch >= '0' && ch <= '9')
           || ch === '_';
}

function isIdentifier(stream, pos) {
  const ch = stream[pos];
  // $ is special -- it's allowed to be part of an identifier if it's the first character
  if (ch === '$') {
    return stream.length > pos && isAlphaNum(stream[pos + 1]);
  }
  // return whether character 'isAlpha'
  return (ch >= 'a' && ch <= 'z')
          || (ch >= 'A' && ch <= 'Z')
          || ch === '_';
}

class Lexer {
  constructor(allowedGlobalNames = [], debug = []) {
    this._allowedGlobalNames = allowedGlobalNames;
    this.debug = debug;
  }

  tokenize(stream) {
    const tokens = [];
    this._current = 0;
    let start;
    let identifier;
    let token;
    while (this._current < stream.length) {
      const prev = tokens.length ? tokens.slice(-1)[0].type : null;

      if (this._isGlobal(prev, stream, this._current)) {
        tokens.push(this._consumeGlobal(stream));
      } else if (isIdentifier(stream, this._current)) {
        start = this._current;
        identifier = this._consumeUnquotedIdentifier(stream);
        tokens.push({
          type: TOK_UNQUOTEDIDENTIFIER,
          value: identifier,
          start,
        });
      } else if (basicTokens[stream[this._current]] !== undefined) {
        tokens.push({
          type: basicTokens[stream[this._current]],
          value: stream[this._current],
          start: this._current,
        });
        this._current += 1;
      } else if (stream[this._current] === '-' && ![TOK_GLOBAL, TOK_CURRENT, TOK_NUMBER, TOK_RPAREN, TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_RBRACKET].includes(prev)) {
        token = this._consumeUnaryMinus(stream);
        tokens.push(token);
      } else if (isNum(stream[this._current])) {
        token = this._consumeNumber(stream);
        tokens.push(token);
      } else if (stream[this._current] === '[') {
        // No need to increment this._current.  This happens
        // in _consumeLBracket
        token = this._consumeLBracket(stream);
        tokens.push(token);
      } else if (stream[this._current] === '"') {
        start = this._current;
        identifier = this._consumeQuotedIdentifier(stream);
        tokens.push({
          type: TOK_QUOTEDIDENTIFIER,
          value: identifier,
          start,
        });
      } else if (stream[this._current] === "'") {
        start = this._current;
        identifier = this._consumeRawStringLiteral(stream);
        tokens.push({
          type: TOK_LITERAL,
          value: identifier,
          start,
        });
      } else if (stream[this._current] === '`') {
        start = this._current;
        const literal = this._consumeLiteral(stream);
        tokens.push({
          type: TOK_LITERAL,
          value: literal,
          start,
        });
      } else if (operatorStartToken[stream[this._current]] !== undefined) {
        tokens.push(this._consumeOperator(stream));
      } else if (skipChars[stream[this._current]] !== undefined) {
        // Ignore whitespace.
        this._current += 1;
      } else if (stream[this._current] === '&') {
        start = this._current;
        this._current += 1;
        if (stream[this._current] === '&') {
          this._current += 1;
          tokens.push({ type: TOK_AND, value: '&&', start });
        } else if (prev === TOK_COMMA || prev === TOK_LPAREN) {
          // based on previous token we'll know if this & is a JMESPath expression-type
          // or if it's a concatenation operator
          // if we're a function arg then it's an expression-type
          tokens.push({ type: TOK_EXPREF, value: '&', start });
        } else {
          tokens.push({ type: TOK_CONCATENATE, value: '&', start });
        }
      } else if (stream[this._current] === '~') {
        start = this._current;
        this._current += 1;
        tokens.push({ type: TOK_UNION, value: '~', start });
      } else if (stream[this._current] === '+') {
        start = this._current;
        this._current += 1;
        tokens.push({ type: TOK_ADD, value: '+', start });
      } else if (stream[this._current] === '-') {
        start = this._current;
        this._current += 1;
        tokens.push({ type: TOK_SUBTRACT, value: '-', start });
      } else if (stream[this._current] === '*') {
        start = this._current;
        this._current += 1;
        // based on previous token we'll know if this asterix is a star -- not a multiply
        // might be better to list the prev tokens that are valid for multiply?
        const prevToken = tokens.length && tokens.slice(-1)[0].type;
        if (tokens.length === 0 || [
          TOK_LBRACKET,
          TOK_DOT,
          TOK_PIPE,
          TOK_AND,
          TOK_OR,
          TOK_COMMA,
          TOK_COLON,
        ].includes(prevToken)) {
          tokens.push({ type: TOK_STAR, value: '*', start });
        } else {
          tokens.push({ type: TOK_MULTIPLY, value: '*', start });
        }
      } else if (stream[this._current] === '/') {
        start = this._current;
        this._current += 1;
        tokens.push({ type: TOK_DIVIDE, value: '/', start });
      } else if (stream[this._current] === '^') {
        start = this._current;
        this._current += 1;
        tokens.push({ type: TOK_POWER, value: '^', start });
      } else if (stream[this._current] === '|') {
        start = this._current;
        this._current += 1;
        if (stream[this._current] === '|') {
          this._current += 1;
          tokens.push({ type: TOK_OR, value: '||', start });
        } else {
          tokens.push({ type: TOK_PIPE, value: '|', start });
        }
      } else {
        const error = new Error(`Unknown character:${stream[this._current]}`);
        error.name = 'LexerError';
        throw error;
      }
    }
    return tokens;
  }

  _consumeUnquotedIdentifier(stream) {
    const start = this._current;
    this._current += 1;
    while (this._current < stream.length && isAlphaNum(stream[this._current])) {
      this._current += 1;
    }
    return stream.slice(start, this._current);
  }

  _consumeQuotedIdentifier(stream) {
    const start = this._current;
    this._current += 1;
    const maxLength = stream.length;
    let foundNonAlpha = !isIdentifier(stream, start + 1);
    while (stream[this._current] !== '"' && this._current < maxLength) {
      // You can escape a double quote and you can escape an escape.
      let current = this._current;
      if (!isAlphaNum(stream[current])) foundNonAlpha = true;
      if (stream[current] === '\\' && (stream[current + 1] === '\\'
                                             || stream[current + 1] === '"')) {
        current += 2;
      } else {
        current += 1;
      }
      this._current = current;
    }
    this._current += 1;
    const val = stream.slice(start, this._current);
    // Check for unnecessary double quotes.
    // json-formula uses double quotes to escape characters that don't belong in names names.
    // e.g. "purchase-order".address
    // If we find a double-quoted entity with spaces or all legal characters, issue a warning
    try {
      if (!foundNonAlpha || val.includes(' ')) {
        this.debug.push(`Suspicious quotes: ${val}`);
        this.debug.push(`Did you intend a literal? '${val.replace(/"/g, '')}'?`);
      }
    // eslint-disable-next-line no-empty
    } catch (e) {}
    return JSON.parse(val);
  }

  _consumeRawStringLiteral(stream) {
    const start = this._current;
    this._current += 1;
    const maxLength = stream.length;
    while (stream[this._current] !== "'" && this._current < maxLength) {
      // You can escape a single quote and you can escape an escape.
      let current = this._current;
      if (stream[current] === '\\' && (stream[current + 1] === '\\'
                                             || stream[current + 1] === "'")) {
        current += 2;
      } else {
        current += 1;
      }
      this._current = current;
    }
    this._current += 1;
    const literal = stream.slice(start + 1, this._current - 1);
    return literal.replaceAll("\\'", "'");
  }

  _consumeNumber(stream) {
    const start = this._current;
    this._current += 1;
    const maxLength = stream.length;
    while (isNum(stream[this._current]) && this._current < maxLength) {
      this._current += 1;
    }
    const n = stream.slice(start, this._current);
    let value;
    if (n.includes('.')) {
      value = parseFloat(n);
    } else {
      value = parseInt(n, 10);
    }
    return { type: TOK_NUMBER, value, start };
  }

  _consumeUnaryMinus() {
    const start = this._current;
    this._current += 1;
    return { type: TOK_UNARY_MINUS, value: '-', start };
  }

  _consumeLBracket(stream) {
    const start = this._current;
    this._current += 1;
    if (stream[this._current] === '?') {
      this._current += 1;
      return { type: TOK_FILTER, value: '[?', start };
    }
    if (stream[this._current] === ']') {
      this._current += 1;
      return { type: TOK_FLATTEN, value: '[]', start };
    }
    return { type: TOK_LBRACKET, value: '[', start };
  }

  _isGlobal(prev, stream, pos) {
    // global tokens occur only at the start of an expression
    if (prev !== null && prev === TOK_DOT) return false;
    const ch = stream[pos];
    if (ch !== globalStartToken) return false;
    // $ is special -- it's allowed to be part of an identifier if it's the first character
    let i = pos + 1;
    while (i < stream.length && isAlphaNum(stream[i])) i += 1;
    const global = stream.slice(pos, i);
    return this._allowedGlobalNames.includes(global);
  }

  _consumeGlobal(stream) {
    const start = this._current;
    this._current += 1;
    while (this._current < stream.length && isAlphaNum(stream[this._current])) this._current += 1;
    const global = stream.slice(start, this._current);

    return { type: TOK_GLOBAL, name: global, start };
  }

  _consumeOperator(stream) {
    const start = this._current;
    const startingChar = stream[start];
    this._current += 1;
    if (startingChar === '!') {
      if (stream[this._current] === '=') {
        this._current += 1;
        return { type: TOK_NE, value: '!=', start };
      }
      return { type: TOK_NOT, value: '!', start };
    }
    if (startingChar === '<') {
      if (stream[this._current] === '=') {
        this._current += 1;
        return { type: TOK_LTE, value: '<=', start };
      }
      return { type: TOK_LT, value: '<', start };
    }
    if (startingChar === '>') {
      if (stream[this._current] === '=') {
        this._current += 1;
        return { type: TOK_GTE, value: '>=', start };
      }
      return { type: TOK_GT, value: '>', start };
    }
    // startingChar is '='
    if (stream[this._current] === '=') {
      this._current += 1;
      return { type: TOK_EQ, value: '==', start };
    }
    return { type: TOK_EQ, value: '=', start };
  }

  _consumeLiteral(stream) {
    function _looksLikeJSON(str) {
      if (str === '') return false;
      if ('[{"'.includes(str[0])) return true;
      if (['true', 'false', 'null'].includes(str)) return true;

      if ('-0123456789'.includes(str[0])) {
        try {
          JSON.parse(str);
          return true;
        } catch (ex) {
          return false;
        }
      } else {
        return false;
      }
    }

    this._current += 1;
    const start = this._current;
    const maxLength = stream.length;
    let literal;
    let inQuotes = false;
    while ((inQuotes || stream[this._current] !== '`') && this._current < maxLength) {
      let current = this._current;
      // bypass escaped double quotes when we're inside quotes
      if (inQuotes && stream[current] === '\\' && stream[current + 1] === '"') current += 2;
      else {
        if (stream[current] === '"') inQuotes = !inQuotes;
        if (inQuotes && stream[current + 1] === '`') current += 2;
        else if (stream[current] === '\\' && (stream[current + 1] === '\\'
                                              || stream[current + 1] === '`')) {
        // You can escape a literal char or you can escape the escape.
          current += 2;
        } else {
          current += 1;
        }
      }
      this._current = current;
    }
    let literalString = stream.slice(start, this._current).trimStart();
    literalString = literalString.replaceAll('\\`', '`');
    if (_looksLikeJSON(literalString)) {
      literal = JSON.parse(literalString);
    } else {
      // Try to JSON parse it as "<literal>"
      literal = JSON.parse(`"${literalString}"`);
    }
    // +1 gets us to the ending "`", +1 to move on to the next char.
    this._current += 1;
    return literal;
  }
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/Parser.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/Parser.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _Lexer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Lexer.js */ "./node_modules/@adobe/json-formula/src/jmespath/Lexer.js");
/* harmony import */ var _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokenDefinitions.js */ "./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js");



/* eslint-disable no-underscore-dangle */
const {
  TOK_LITERAL,
  TOK_COLON,
  TOK_EOF,
  TOK_UNQUOTEDIDENTIFIER,
  TOK_QUOTEDIDENTIFIER,
  TOK_RBRACKET,
  TOK_RPAREN,
  TOK_COMMA,
  TOK_CONCATENATE,
  TOK_RBRACE,
  TOK_NUMBER,
  TOK_CURRENT,
  TOK_GLOBAL,
  TOK_FIELD,
  TOK_EXPREF,
  TOK_PIPE,
  TOK_OR,
  TOK_AND,
  TOK_ADD,
  TOK_SUBTRACT,
  TOK_UNARY_MINUS,
  TOK_MULTIPLY,
  TOK_POWER,
  TOK_DIVIDE,
  TOK_UNION,
  TOK_EQ,
  TOK_GT,
  TOK_LT,
  TOK_GTE,
  TOK_LTE,
  TOK_NE,
  TOK_FLATTEN,
  TOK_STAR,
  TOK_FILTER,
  TOK_DOT,
  TOK_NOT,
  TOK_LBRACE,
  TOK_LBRACKET,
  TOK_LPAREN,
} = _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_1__["default"];

const bindingPower = {
  [TOK_EOF]: 0,
  [TOK_UNQUOTEDIDENTIFIER]: 0,
  [TOK_QUOTEDIDENTIFIER]: 0,
  [TOK_RBRACKET]: 0,
  [TOK_RPAREN]: 0,
  [TOK_COMMA]: 0,
  [TOK_RBRACE]: 0,
  [TOK_NUMBER]: 0,
  [TOK_CURRENT]: 0,
  [TOK_GLOBAL]: 0,
  [TOK_FIELD]: 0,
  [TOK_EXPREF]: 0,
  [TOK_PIPE]: 1,
  [TOK_OR]: 2,
  [TOK_AND]: 3,
  [TOK_CONCATENATE]: 5,
  [TOK_ADD]: 6,
  [TOK_SUBTRACT]: 6,
  [TOK_MULTIPLY]: 7,
  [TOK_DIVIDE]: 7,
  [TOK_POWER]: 7,
  [TOK_UNION]: 7,
  [TOK_EQ]: 5,
  [TOK_GT]: 5,
  [TOK_LT]: 5,
  [TOK_GTE]: 5,
  [TOK_LTE]: 5,
  [TOK_NE]: 5,
  [TOK_FLATTEN]: 9,
  [TOK_STAR]: 20,
  [TOK_FILTER]: 21,
  [TOK_DOT]: 40,
  [TOK_NOT]: 30,
  [TOK_UNARY_MINUS]: 30,
  [TOK_LBRACE]: 50,
  [TOK_LBRACKET]: 55,
  [TOK_LPAREN]: 60,
};

class Parser {
  constructor(allowedGlobalNames = []) {
    this._allowedGlobalNames = allowedGlobalNames;
  }

  parse(expression, debug) {
    this._loadTokens(expression, debug);
    this.index = 0;
    const ast = this.expression(0);
    if (this._lookahead(0) !== TOK_EOF) {
      const t = this._lookaheadToken(0);
      const error = new Error(
        `Unexpected token type: ${t.type}, value: ${t.value}`,
      );
      error.name = 'ParserError';
      throw error;
    }
    return ast;
  }

  _loadTokens(expression, debug) {
    const lexer = new _Lexer_js__WEBPACK_IMPORTED_MODULE_0__["default"](this._allowedGlobalNames, debug);
    const tokens = lexer.tokenize(expression);
    tokens.push({ type: TOK_EOF, value: '', start: expression.length });
    this.tokens = tokens;
  }

  expression(rbp) {
    const leftToken = this._lookaheadToken(0);
    this._advance();
    let left = this.nud(leftToken);
    let currentToken = this._lookahead(0);
    while (rbp < bindingPower[currentToken]) {
      this._advance();
      left = this.led(currentToken, left);
      currentToken = this._lookahead(0);
    }
    return left;
  }

  _lookahead(number) {
    return this.tokens[this.index + number].type;
  }

  _lookaheadToken(number) {
    return this.tokens[this.index + number];
  }

  _advance() {
    this.index += 1;
  }

  _getIndex() {
    return this.index;
  }

  _setIndex(index) {
    this.index = index;
  }

  // eslint-disable-next-line consistent-return
  nud(token) {
    let left;
    let right;
    let expression;
    let node;
    let args;
    switch (token.type) {
      case TOK_LITERAL:
        return { type: 'Literal', value: token.value };
      case TOK_NUMBER:
        return { type: 'Number', value: token.value };
      case TOK_UNQUOTEDIDENTIFIER:
        return { type: 'Field', name: token.value };
      case TOK_QUOTEDIDENTIFIER:
        node = { type: 'Field', name: token.value };
        if (this._lookahead(0) === TOK_LPAREN) {
          throw new Error('Quoted identifier not allowed for function names.');
        }
        return node;
      case TOK_NOT:
        right = this.expression(bindingPower.Not);
        return { type: 'NotExpression', children: [right] };
      case TOK_UNARY_MINUS:
        right = this.expression(bindingPower.UnaryMinus);
        return { type: 'UnaryMinusExpression', children: [right] };
      case TOK_STAR:
        left = { type: 'Identity' };
        if (this._lookahead(0) === TOK_RBRACKET) {
          // This can happen in a multiselect,
          // [a, b, *]
          right = { type: 'Identity' };
        } else {
          right = this._parseProjectionRHS(bindingPower.Star);
        }
        return { type: 'ValueProjection', children: [left, right] };
      case TOK_FILTER:
        return this.led(token.type, { type: 'Identity' });
      case TOK_LBRACE:
        return this._parseMultiselectHash();
      case TOK_FLATTEN:
        left = { type: TOK_FLATTEN, children: [{ type: 'Identity' }] };
        right = this._parseProjectionRHS(bindingPower.Flatten);
        return { type: 'Projection', children: [left, right] };
      case TOK_LBRACKET:
        if (this._lookahead(0) === TOK_STAR
            && this._lookahead(1) === TOK_RBRACKET) {
          this._advance();
          this._advance();
          right = this._parseProjectionRHS(bindingPower.Star);
          return {
            type: 'Projection',
            children: [{ type: 'Identity' }, right],
          };
        }
        return this._parseUnchainedIndexExpression();
      case TOK_CURRENT:
        return { type: TOK_CURRENT };
      case TOK_GLOBAL:
        return { type: TOK_GLOBAL, name: token.name };
      case TOK_FIELD:
        return { type: TOK_FIELD };
      case TOK_EXPREF:
        expression = this.expression(bindingPower.Expref);
        return { type: 'ExpressionReference', children: [expression] };
      case TOK_LPAREN:
        args = [];
        while (this._lookahead(0) !== TOK_RPAREN) {
          expression = this.expression(0);
          args.push(expression);
        }
        this._match(TOK_RPAREN);
        return args[0];
      default:
        this._errorToken(token);
    }
  }

  // eslint-disable-next-line consistent-return
  led(tokenName, left) {
    let condition;
    let right;
    let name;
    let args;
    let expression;
    let node;
    let rbp;
    let leftNode;
    let rightNode;
    switch (tokenName) {
      case TOK_CONCATENATE:
        right = this.expression(bindingPower.Concatenate);
        return { type: 'ConcatenateExpression', children: [left, right] };
      case TOK_DOT:
        rbp = bindingPower.Dot;
        if (this._lookahead(0) !== TOK_STAR) {
          right = this._parseDotRHS(rbp);
          return { type: 'Subexpression', children: [left, right] };
        }
        // Creating a projection.
        this._advance();
        right = this._parseProjectionRHS(rbp);
        return { type: 'ValueProjection', children: [left, right] };
      case TOK_PIPE:
        right = this.expression(bindingPower.Pipe);
        return { type: TOK_PIPE, children: [left, right] };
      case TOK_OR:
        right = this.expression(bindingPower.Or);
        return { type: 'OrExpression', children: [left, right] };
      case TOK_AND:
        right = this.expression(bindingPower.And);
        return { type: 'AndExpression', children: [left, right] };
      case TOK_ADD:
        right = this.expression(bindingPower.Add);
        return { type: 'AddExpression', children: [left, right] };
      case TOK_SUBTRACT:
        right = this.expression(bindingPower.Subtract);
        return { type: 'SubtractExpression', children: [left, right] };
      case TOK_MULTIPLY:
        right = this.expression(bindingPower.Multiply);
        return { type: 'MultiplyExpression', children: [left, right] };
      case TOK_DIVIDE:
        right = this.expression(bindingPower.Divide);
        return { type: 'DivideExpression', children: [left, right] };
      case TOK_POWER:
        right = this.expression(bindingPower.Power);
        return { type: 'PowerExpression', children: [left, right] };
      case TOK_UNION:
        right = this.expression(bindingPower.Power);
        return { type: 'UnionExpression', children: [left, right] };
      case TOK_LPAREN:
        name = left.name;
        args = [];
        while (this._lookahead(0) !== TOK_RPAREN) {
          expression = this.expression(0);
          if (this._lookahead(0) === TOK_COMMA) {
            this._match(TOK_COMMA);
          }
          args.push(expression);
        }
        this._match(TOK_RPAREN);
        node = { type: 'Function', name, children: args };
        return node;
      case TOK_FILTER:
        condition = this.expression(0);
        this._match(TOK_RBRACKET);
        if (this._lookahead(0) === TOK_FLATTEN) {
          right = { type: 'Identity' };
        } else {
          right = this._parseProjectionRHS(bindingPower.Filter);
        }
        return { type: 'FilterProjection', children: [left, right, condition] };
      case TOK_FLATTEN:
        leftNode = { type: TOK_FLATTEN, children: [left] };
        rightNode = this._parseProjectionRHS(bindingPower.Flatten);
        return { type: 'Projection', children: [leftNode, rightNode] };
      case TOK_EQ:
      case TOK_NE:
      case TOK_GT:
      case TOK_GTE:
      case TOK_LT:
      case TOK_LTE:
        return this._parseComparator(left, tokenName);
      case TOK_LBRACKET:
        if (this._lookahead(0) === TOK_STAR
            && this._lookahead(1) === TOK_RBRACKET) {
          this._advance();
          this._advance();
          right = this._parseProjectionRHS(bindingPower.Star);
          return { type: 'Projection', children: [left, right] };
        }
        right = this._parseChainedIndexExpression();
        return this._projectIfSlice(left, right);
      default:
        this._errorToken(this._lookaheadToken(0));
    }
  }

  _match(tokenType) {
    if (this._lookahead(0) === tokenType) {
      this._advance();
    } else {
      const t = this._lookaheadToken(0);
      const error = new Error(`Expected ${tokenType}, got: ${t.type}`);
      error.name = 'ParserError';
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _errorToken(token) {
    const error = new Error(`Invalid token (${
      token.type}): "${
      token.value}"`);
    error.name = 'ParserError';
    throw error;
  }

  _parseChainedIndexExpression() {
    const oldIndex = this._getIndex();
    if (this._lookahead(0) === TOK_COLON) {
      return this._parseSliceExpression();
    }
    // look ahead of the first expression to determine the type
    const first = this.expression(0);
    const token = this._lookahead(0);
    if (token === TOK_COLON) {
      // now that we know the type revert back to the old position and parse
      this._setIndex(oldIndex);
      return this._parseSliceExpression();
    }
    this._match(TOK_RBRACKET);
    return {
      type: 'Index',
      value: first,
    };
  }

  _parseUnchainedIndexExpression() {
    const oldIndex = this._getIndex();
    const firstToken = this._lookahead(0);
    if (firstToken === TOK_COLON) {
      const right = this._parseSliceExpression();
      return this._projectIfSlice({ type: 'Identity' }, right);
    }
    const first = this.expression(0);
    const currentToken = this._lookahead(0);
    if (currentToken === TOK_COMMA) {
      this._setIndex(oldIndex);
      return this._parseMultiselectList();
    }
    if (currentToken === TOK_COLON) {
      this._setIndex(oldIndex);
      const right = this._parseSliceExpression();
      return this._projectIfSlice({ type: 'Identity' }, right);
    }
    if (firstToken === TOK_NUMBER || firstToken === TOK_UNARY_MINUS) {
      this._match(TOK_RBRACKET);
      return {
        type: 'Index',
        value: first,
      };
    }
    this._setIndex(oldIndex);
    return this._parseMultiselectList();
  }

  _projectIfSlice(left, right) {
    const indexExpr = { type: 'IndexExpression', children: [left, right] };
    if (right.type === 'Slice') {
      return {
        type: 'Projection',
        children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)],
      };
    }
    return indexExpr;
  }

  _parseSliceExpression() {
    // [start:end:step] where each part is optional, as well as the last
    // colon.
    const parts = [null, null, null];
    let index = 0;
    let currentToken = this._lookahead(0);
    while (currentToken !== TOK_RBRACKET && index < 3) {
      if (currentToken === TOK_COLON && index < 2) { // there can't be more than 2 colons
        index += 1;
        this._advance();
      } else {
        parts[index] = this.expression(0);
        // check next token to be either colon or rbracket
        const t = this._lookahead(0);
        if (t !== TOK_COLON && t !== TOK_RBRACKET) {
          const error = new Error(`Syntax error, unexpected token: ${
            t.value}(${t.type})`);
          error.name = 'Parsererror';
          throw error;
        }
      }
      currentToken = this._lookahead(0);
    }
    this._match(TOK_RBRACKET);
    return {
      type: 'Slice',
      children: parts,
    };
  }

  _parseComparator(left, comparator) {
    const right = this.expression(bindingPower[comparator]);
    return { type: 'Comparator', name: comparator, children: [left, right] };
  }

  // eslint-disable-next-line consistent-return
  _parseDotRHS(rbp) {
    const lookahead = this._lookahead(0);
    const exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
    if (exprTokens.indexOf(lookahead) >= 0) {
      return this.expression(rbp);
    }
    if (lookahead === TOK_LBRACKET) {
      this._match(TOK_LBRACKET);
      return this._parseMultiselectList();
    }
    if (lookahead === TOK_LBRACE) {
      this._match(TOK_LBRACE);
      return this._parseMultiselectHash();
    }
  }

  _parseProjectionRHS(rbp) {
    let right;
    if (bindingPower[this._lookahead(0)] < 10) {
      right = { type: 'Identity' };
    } else if (this._lookahead(0) === TOK_LBRACKET) {
      right = this.expression(rbp);
    } else if (this._lookahead(0) === TOK_FILTER) {
      right = this.expression(rbp);
    } else if (this._lookahead(0) === TOK_DOT) {
      this._match(TOK_DOT);
      right = this._parseDotRHS(rbp);
    } else {
      const t = this._lookaheadToken(0);
      const error = new Error(`Sytanx error, unexpected token: ${
        t.value}(${t.type})`);
      error.name = 'ParserError';
      throw error;
    }
    return right;
  }

  _parseMultiselectList() {
    const expressions = [];
    while (this._lookahead(0) !== TOK_RBRACKET) {
      const expression = this.expression(0);
      expressions.push(expression);
      if (this._lookahead(0) === TOK_COMMA) {
        this._match(TOK_COMMA);
        if (this._lookahead(0) === TOK_RBRACKET) {
          throw new Error('Unexpected token Rbracket');
        }
      }
    }
    this._match(TOK_RBRACKET);
    return { type: 'MultiSelectList', children: expressions };
  }

  _parseMultiselectHash() {
    const pairs = [];
    const identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
    let keyToken; let keyName; let value; let
      node;
    if (this._lookahead(0) === TOK_RBRACE) {
      this._advance();
      return { type: 'MultiSelectHash', children: [] };
    }
    for (;;) {
      keyToken = this._lookaheadToken(0);
      if (identifierTypes.indexOf(keyToken.type) < 0) {
        throw new Error(`Expecting an identifier token, got: ${
          keyToken.type}`);
      }
      keyName = keyToken.value;
      this._advance();
      this._match(TOK_COLON);
      value = this.expression(0);
      node = { type: 'KeyValuePair', name: keyName, value };
      pairs.push(node);
      if (this._lookahead(0) === TOK_COMMA) {
        this._match(TOK_COMMA);
      } else if (this._lookahead(0) === TOK_RBRACE) {
        this._match(TOK_RBRACE);
        break;
      }
    }
    return { type: 'MultiSelectHash', children: pairs };
  }
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/TreeInterpreter.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/TreeInterpreter.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TreeInterpreter)
/* harmony export */ });
/* harmony import */ var _matchType_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matchType.js */ "./node_modules/@adobe/json-formula/src/jmespath/matchType.js");
/* harmony import */ var _dataTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dataTypes.js */ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js");
/* harmony import */ var _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tokenDefinitions.js */ "./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@adobe/json-formula/src/jmespath/utils.js");





const {
  TOK_CURRENT,
  TOK_GLOBAL,
  TOK_EXPREF,
  TOK_PIPE,
  TOK_EQ,
  TOK_GT,
  TOK_LT,
  TOK_GTE,
  TOK_LTE,
  TOK_NE,
  TOK_FLATTEN,
} = _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_2__["default"];

const {
  TYPE_STRING,
  TYPE_ARRAY_STRING,
  TYPE_ARRAY,
} = _dataTypes_js__WEBPACK_IMPORTED_MODULE_1__["default"];

function isFalse(value) {
  // From the spec:
  // A false value corresponds to the following values:
  // Empty list
  // Empty object
  // Empty string
  // False boolean
  // null value
  // (new) use JS truthy evaluation.  This changes the spec behavior.
  // Where in the past a zero (0) would be True, it's now false

  // First check the scalar values.
  if (value === null) return true;
  // in case it's an object with a valueOf defined
  const obj = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getValueOf)(value);
  if (obj === '' || obj === false || obj === null) {
    return true;
  }
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(obj) && obj.length === 0) {
    // Check for an empty array.
    return true;
  }
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isObject)(obj)) {
    // Check for an empty object.
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // If there are any keys, then
      // the object is not empty so the object
      // is not false.
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  return !obj;
}

function objValues(obj) {
  return Object.values(obj);
}

class TreeInterpreter {
  constructor(runtime, globals, toNumber, toString, debug, language) {
    this.runtime = runtime;
    this.globals = globals;
    this.toNumber = toNumber;
    this.toString = toString;
    this.debug = debug;
    this.language = language;
  }

  search(node, value) {
    return this.visit(node, value);
  }

  visit(n, v) {
    const visitFunctions = {
      Field: (node, value) => {
        // we used to check isObject(value) here -- but it is possible for an array-based
        // object to have properties.  So we'll allow the child check on objects and arrays.
        if (value !== null && ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isObject)(value) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(value))) {
          let field = value[node.name];
          // fields can be objects with overridden methods. e.g. valueOf
          // so don't resolve to a function...
          if (typeof field === 'function') field = undefined;
          if (field === undefined) {
            try {
              this.debug.push(`Failed to find: '${node.name}'`);
              const available = Object.keys(value).map(a => `'${a}'`).toString();
              if (available.length) this.debug.push(`Available fields: ${available}`);
            // eslint-disable-next-line no-empty
            } catch (e) {}
            return null;
          }
          return field;
        }
        return null;
      },

      Subexpression: (node, value) => {
        let result = this.visit(node.children[0], value);
        for (let i = 1; i < node.children.length; i += 1) {
          result = this.visit(node.children[1], result);
          if (result === null) return null;
        }
        return result;
      },

      IndexExpression: (node, value) => {
        const left = this.visit(node.children[0], value);
        return this.visit(node.children[1], left);
      },

      Index: (node, value) => {
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(value)) {
          let index = this.toNumber(this.visit(node.value, value));
          if (index < 0) {
            index = value.length + index;
          }
          const result = value[index];
          if (result === undefined) {
            this.debug.push(`Index ${index} out of range`);
            return null;
          }
          return result;
        }
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isObject)(value)) {
          const key = this.toString(this.visit(node.value, value));
          const result = value[key];
          if (result === undefined) {
            this.debug.push(`Key ${key} does not exist`);
            return null;
          }
          return result;
        }
        this.debug.push(`left side of index expression ${value} is not an array or object.`);
        return null;
      },

      Slice: (node, value) => {
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(value)) return null;
        const sliceParams = node.children.slice(0).map(
          param => (param != null ? this.toNumber(this.visit(param, value)) : null),
        );
        const computed = this.computeSliceParams(value.length, sliceParams);
        const [start, stop, step] = computed;
        const result = [];
        if (step > 0) {
          for (let i = start; i < stop; i += step) {
            result.push(value[i]);
          }
        } else {
          for (let i = start; i > stop; i += step) {
            result.push(value[i]);
          }
        }
        return result;
      },

      Projection: (node, value) => {
      // Evaluate left child.
        const base = this.visit(node.children[0], value);
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(base)) return null;
        const collected = [];
        base.forEach(b => {
          const current = this.visit(node.children[1], b);
          if (current !== null) {
            collected.push(current);
          }
        });
        return collected;
      },

      ValueProjection: (node, value) => {
      // Evaluate left child.
        const projection = this.visit(node.children[0], value);
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isObject)((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getValueOf)(projection))) return null;
        const collected = [];
        const values = objValues(projection);
        values.forEach(val => {
          const current = this.visit(node.children[1], val);
          if (current !== null) collected.push(current);
        });
        return collected;
      },

      FilterProjection: (node, value) => {
        const base = this.visit(node.children[0], value);
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(base)) return null;
        const filtered = base.filter(b => {
          const matched = this.visit(node.children[2], b);
          return !isFalse(matched);
        });

        const finalResults = [];
        filtered.forEach(f => {
          const current = this.visit(node.children[1], f);
          if (current !== null) finalResults.push(current);
        });
        return finalResults;
      },

      Comparator: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);

        if (node.name === TOK_EQ) return (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.strictDeepEqual)(first, second);
        if (node.name === TOK_NE) return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.strictDeepEqual)(first, second);
        if (node.name === TOK_GT) return first > second;
        if (node.name === TOK_GTE) return first >= second;
        if (node.name === TOK_LT) return first < second;
        if (node.name === TOK_LTE) return first <= second;
        throw new Error(`Unknown comparator: ${node.name}`);
      },

      [TOK_FLATTEN]: (node, value) => {
        const original = this.visit(node.children[0], value);
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(original)) return null;
        const merged = [];
        original.forEach(current => {
          if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(current)) {
            merged.push(...current);
          } else {
            merged.push(current);
          }
        });
        return merged;
      },

      Identity: (_node, value) => value,

      MultiSelectList: (node, value) => {
        if (value === null) return null;
        return node.children.map(child => this.visit(child, value));
      },

      MultiSelectHash: (node, value) => {
        if (value === null) return null;
        const collected = {};
        node.children.forEach(child => {
          collected[child.name] = this.visit(child.value, value);
        });
        return collected;
      },

      OrExpression: (node, value) => {
        let matched = this.visit(node.children[0], value);
        if (isFalse(matched)) matched = this.visit(node.children[1], value);
        return matched;
      },

      AndExpression: (node, value) => {
        const first = this.visit(node.children[0], value);

        if (isFalse(first) === true) return first;
        return this.visit(node.children[1], value);
      },

      AddExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '+');
      },

      ConcatenateExpression: (node, value) => {
        let first = this.visit(node.children[0], value);
        let second = this.visit(node.children[1], value);
        first = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.matchType)((0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.getTypeNames)(first), [TYPE_STRING, TYPE_ARRAY_STRING], first, 'concatenate', this.toNumber, this.toString);
        second = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.matchType)((0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.getTypeNames)(second), [TYPE_STRING, TYPE_ARRAY_STRING], second, 'concatenate', this.toNumber, this.toString);
        return this.applyOperator(first, second, '&');
      },

      UnionExpression: (node, value) => {
        let first = this.visit(node.children[0], value);
        let second = this.visit(node.children[1], value);
        first = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.matchType)((0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.getTypeNames)(first), [TYPE_ARRAY], first, 'union', this.toNumber, this.toString);
        second = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.matchType)((0,_matchType_js__WEBPACK_IMPORTED_MODULE_0__.getTypeNames)(second), [TYPE_ARRAY], second, 'union', this.toNumber, this.toString);
        return first.concat(second);
      },

      SubtractExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '-');
      },

      MultiplyExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '*');
      },

      DivideExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '/');
      },

      PowerExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        const second = this.visit(node.children[1], value);
        return this.applyOperator(first, second, '^');
      },

      NotExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        return isFalse(first);
      },

      UnaryMinusExpression: (node, value) => {
        const first = this.visit(node.children[0], value);
        return first * -1;
      },

      Literal: node => node.value,

      Number: node => node.value,

      [TOK_PIPE]: (node, value) => {
        const left = this.visit(node.children[0], value);
        return this.visit(node.children[1], left);
      },

      [TOK_CURRENT]: (_node, value) => value,

      [TOK_GLOBAL]: node => {
        const result = this.globals[node.name];
        return result === undefined ? null : result;
      },

      Function: (node, value) => {
      // Special case for if()
      // we need to make sure the results are called only after the condition is evaluated
      // Otherwise we end up with both results invoked -- which could include side effects
      // For "if", the last parameter to callFunction is false (bResolved) to indicate there's
      // no point in validating the argument type.
        if (node.name === 'if') return this.runtime.callFunction(node.name, node.children, value, this, false);
        const resolvedArgs = node.children.map(child => this.visit(child, value));
        return this.runtime.callFunction(node.name, resolvedArgs, value, this);
      },

      ExpressionReference: node => {
        const [refNode] = node.children;
        // Tag the node with a specific attribute so the type
        // checker verify the type.
        refNode.jmespathType = TOK_EXPREF;
        return refNode;
      },
    };
    const fn = n && visitFunctions[n.type];
    if (!fn) throw new Error(`Unknown/missing node type ${(n && n.type) || ''}`);
    return fn(n, v);
  }

  // eslint-disable-next-line class-methods-use-this
  computeSliceParams(arrayLength, sliceParams) {
    function capSliceRange(arrayLen, actual, stp) {
      let actualValue = actual;
      if (actualValue < 0) {
        actualValue += arrayLen;
        if (actualValue < 0) {
          actualValue = stp < 0 ? -1 : 0;
        }
      } else if (actualValue >= arrayLen) {
        actualValue = stp < 0 ? arrayLen - 1 : arrayLen;
      }
      return actualValue;
    }

    let [start, stop, step] = sliceParams;
    if (step === null) {
      step = 1;
    } else if (step === 0) {
      const error = new Error('Invalid slice, step cannot be 0');
      error.name = 'RuntimeError';
      throw error;
    }
    const stepValueNegative = step < 0;

    if (start === null) {
      start = stepValueNegative ? arrayLength - 1 : 0;
    } else {
      start = capSliceRange(arrayLength, start, step);
    }

    if (stop === null) {
      stop = stepValueNegative ? -1 : arrayLength;
    } else {
      stop = capSliceRange(arrayLength, stop, step);
    }
    return [start, stop, step];
  }

  applyOperator(first, second, operator) {
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(first) && (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(second)) {
      // balance the size of the arrays
      const shorter = first.length < second.length ? first : second;
      const diff = Math.abs(first.length - second.length);
      shorter.length += diff;
      shorter.fill(null, shorter.length - diff);
      const result = [];
      for (let i = 0; i < first.length; i += 1) {
        result.push(this.applyOperator(first[i], second[i], operator));
      }
      return result;
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(first)) return first.map(a => this.applyOperator(a, second, operator));
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(second)) return second.map(a => this.applyOperator(first, a, operator));

    if (operator === '*') return this.toNumber(first) * this.toNumber(second);
    if (operator === '&') return first + second;
    if (operator === '+') {
      return this.toNumber(first) + this.toNumber(second);
    }
    if (operator === '-') return this.toNumber(first) - this.toNumber(second);
    if (operator === '/') {
      const result = first / second;
      return Number.isFinite(result) ? result : null;
    }
    if (operator === '^') {
      return first ** second;
    }
    throw new Error(`Unknown operator: ${operator}`);
  }
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js":
/*!********************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Type constants used to define functions.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  TYPE_NUMBER: 0,
  TYPE_ANY: 1,
  TYPE_STRING: 2,
  TYPE_ARRAY: 3,
  TYPE_OBJECT: 4,
  TYPE_BOOLEAN: 5,
  TYPE_EXPREF: 6,
  TYPE_NULL: 7,
  TYPE_ARRAY_NUMBER: 8,
  TYPE_ARRAY_STRING: 9,
  TYPE_CLASS: 10,
  TYPE_ARRAY_ARRAY: 11,
});


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/functions.js":
/*!********************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/functions.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ functions)
/* harmony export */ });
/* harmony import */ var _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataTypes.js */ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js");
/*
Copyright 2014 James Saryerwinnie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

NOTICE:
This file is substantially modified from the original source taken from:
https://github.com/jmespath/jmespath.js

*/

/* eslint-disable no-underscore-dangle */


function functions(
  runtime,
  isObject,
  isArray,
  toNumber,
  getTypeName,
  valueOf,
  toString,
  debug,
) {
  const {
    TYPE_NUMBER,
    TYPE_ANY,
    TYPE_STRING,
    TYPE_ARRAY,
    TYPE_OBJECT,
    TYPE_BOOLEAN,
    TYPE_EXPREF,
    TYPE_NULL,
    TYPE_ARRAY_NUMBER,
    TYPE_ARRAY_STRING,
  } = _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"];

  function createKeyFunction(exprefNode, allowedTypes) {
    return x => {
      const current = runtime.interpreter.visit(exprefNode, x);
      if (allowedTypes.indexOf(getTypeName(current)) < 0) {
        const msg = `TypeError: expected one of ${allowedTypes
        }, received ${getTypeName(current)}`;
        throw new Error(msg);
      }
      return current;
    };
  }

  const functionMap = {
    // name: [function, <signature>]
    // The <signature> can be:
    //
    // {
    //   args: [[type1, type2], [type1, type2]],
    //   variadic: true|false
    // }
    //
    // Each arg in the arg list is a list of valid types
    // (if the function is overloaded and supports multiple
    // types.  If the type is "any" then no type checking
    // occurs on the argument.  Variadic is optional
    // and if not provided is assumed to be false.
    /**
     * Returns the absolute value of the provided argument `value`.
     * @param {number} value argument whose absolute value has to be returned
     * @return {number} returns the absolute value of the `value` argument
     * @function abs
     * @example
     * abs(-1) //returns 1
     * @category jmespath
     */
    abs: {
      _func: resolvedArgs => Math.abs(resolvedArgs[0]),
      _signature: [{ types: [TYPE_NUMBER] }],
    },
    /**
     * Returns the average of the elements in the provided array.
     * An empty array will produce a return value of `null`.
     * @param {number[]} elements array of elements whose average has to be computed
     * @return {number} average value
     * @function avg
     * @example
     * avg([]) //returns null
     * @example
     * avg([1, 2, 3]) //returns 2
     * @category jmespath
     */
    avg: {
      _func: resolvedArgs => {
        let sum = 0;
        const inputArray = resolvedArgs[0];
        inputArray.forEach(a => {
          sum += a;
        });
        return sum / inputArray.length;
      },
      _signature: [{ types: [TYPE_ARRAY_NUMBER] }],
    },

    /**
     * Returns the next highest integer value of the argument `num` by rounding up if necessary.
     * @param {number} num number whose next highest integer value has to be computed
     * @return {number}
     * @function ceil
     * @example
     * ceil(10) //returns 10
     * @example
     * ceil(10.4) //return 11
     * @category jmespath
     */
    ceil: {
      _func: resolvedArgs => Math.ceil(resolvedArgs[0]),
      _signature: [{ types: [TYPE_NUMBER] }],
    },
    /**
     * Returns true if the given `subject` contains the provided `search` string.
     * If `subject` is an array, this function returns true if one of the elements
     * in the array is equal to the provided `search` value. If the provided `subject`
     *  is a string, this function returns true if the string contains the provided
     * `search` argument.
     * @param {array|string} subject the subject in which the element has to be searched
     * @param {string|boolean|number|date} search element to search
     * @return {boolean}
     * @function contains
     * @example
     * contains([1, 2, 3, 4], 2) //returns true
     * @example
     * contains([1, 2, 3, 4], -1) //returns false
     * @example
     * contains('Abcd', 'd') //returns true
     * @example
     * contains('Abcd', 'x') //returns false
     * @category jmespath
     */
    contains: {
      _func: resolvedArgs => valueOf(resolvedArgs[0]).indexOf(valueOf(resolvedArgs[1])) >= 0,
      _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] },
        { types: [TYPE_ANY] }],
    },
    /**
     * Returns true if the `subject` ends with the `suffix`, otherwise this function returns false.
     * @param {string} subject subject in which the `suffix` is being searched for
     * @param {string} suffix suffix to search in the subject
     * @return {boolean}
     * @function endsWith
     * @example
     * endsWith('Abcd', 'd') //returns true
     * @example
     * endsWith('Abcd', 'A') //returns false
     * @category jmespath
     */
    endsWith: {
      _func: resolvedArgs => {
        const searchStr = valueOf(resolvedArgs[0]);
        const suffix = valueOf(resolvedArgs[1]);
        return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
      },
      _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
    },

    /**
     * Returns the next lowest integer value of the argument `num` by rounding down if necessary.
     * @param {number} num number whose next lowest integer value has to be returned
     * @return {number}
     * @function floor
     * @example
     * floor(10.4) //returns 10
     * @example
     * floor(10) //returns 10
     * @category jmespath
     */
    floor: {
      _func: resolvedArgs => Math.floor(resolvedArgs[0]),
      _signature: [{ types: [TYPE_NUMBER] }],
    },

    /**
     * Returns all the elements from the provided `stringsarray`
     * array joined together using the `glue` argument as a separator between each.
     * @param {string} glue
     * @param {string[]} stringsarray
     * @return {string}
     * @function join
     * @example
     * join(',', ['a', 'b', 'c']) //returns 'a,b,c'
     * @category jmespath
     */
    join: {
      _func: resolvedArgs => {
        const joinChar = resolvedArgs[0];
        const listJoin = resolvedArgs[1];
        return listJoin.join(joinChar);
      },
      _signature: [
        { types: [TYPE_STRING] },
        { types: [TYPE_ARRAY_STRING] },
      ],
    },

    /**
     * Returns an array containing the keys of the provided object `obj`. If the passed
     * object is null, the value returned is an empty array
     * @param {object} obj the object whose keys need to be extracted
     * @return {array}
     * @function keys
     * @example
     * keys({a : 3, b : 4}) //returns ['a', 'b']
     * @category jmespath
     */
    keys: {
      _func: resolvedArgs => {
        if (resolvedArgs[0] === null) return [];
        return Object.keys(resolvedArgs[0]);
      },
      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * Returns the length of the given argument `subject` using the following types rules:
     * * string: returns the number of code points in the string
     * * array: returns the number of elements in the array
     * * object: returns the number of key-value pairs in the object
     * @param {string | array | object} subject subject whose length has to be calculated
     * @return {number}
     * @function length
     * @example
     * length([]) //returns 0
     * @example
     * length('') //returns 0
     * @example
     * length('abcd') //returns 4
     * @example
     * length([1, 2, 3, 4]) //returns 4
     * @example
     * length({}) // returns 0
     * @example
     * length({a : 3, b : 4}) //returns 2
     * @category jmespath
     */
    length: {
      _func: resolvedArgs => {
        const arg = valueOf(resolvedArgs[0]);
        if (isObject(arg)) return Object.keys(arg).length;

        return isArray(arg) ? arg.length : toString(arg).length;
      },
      _signature: [{ types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT] }],
    },

    /**
     * Apply the `expr` to every element in the `elements` array and return the array of results.
     * An elements of length N will produce a return array of length N. Unlike a projection,
     * `[*].bar`, `map()` will include the result of applying the `expr` for every element
     * in the elements array, even if the result is `null`.
     * @param {expression} expr expression to evaluate on each element
     * @param {array} elements array of elements on which the expression will be evaluated
     * @return {array}
     * @function map
     * @example
     * map(&(@ + 1), [1, 2, 3, 4]) // returns [2, 3, 4, 5]
     * @example
     * map(&length(@), ['doe', 'nick', 'chris']) // returns [3,4, 5]
     * @category jmespath
     */
    map: {
      _func: resolvedArgs => {
        const exprefNode = resolvedArgs[0];
        return resolvedArgs[1].map(arg => runtime.interpreter.visit(exprefNode, arg));
      },
      _signature: [{ types: [TYPE_EXPREF] }, { types: [TYPE_ARRAY] }],
    },

    /**
     * Returns the highest value in the provided `collection` arguments.
     * If all collections are empty `null` is returned.
     * max() can work on numbers or strings.
     * If a mix of numbers and strings are provided, the type of the first value will be used.
     * @param {number[]|string[]} collection array in which the maximum element is to be calculated
     * @return {number}
     * @function max
     * @example
     * max([1, 2, 3], [4, 5, 6], 7) //returns 7
     * @example
     * max([]) // returns null
     * @example
     * max(['a', 'a1', 'b']) // returns 'b'
     * @category jmespath
     */
    max: {
      _func: args => {
        // flatten the args into a single array
        const array = args.reduce((prev, cur) => {
          if (Array.isArray(cur)) prev.push(...cur);
          else prev.push(cur);
          return prev;
        }, []);

        const first = array.find(r => r !== null);
        if (array.length === 0 || first === undefined) return null;
        // use the first value to determine the comparison type
        const isNumber = getTypeName(first, true) === TYPE_NUMBER;
        const compare = isNumber
          ? (prev, cur) => {
            const current = toNumber(cur);
            return prev <= current ? current : prev;
          }
          : (prev, cur) => {
            const current = toString(cur);
            return prev.localeCompare(current) === 1 ? prev : current;
          };

        return array.reduce(compare, isNumber ? toNumber(first) : toString(first));
      },
      _signature: [{ types: [TYPE_ARRAY, TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING], variadic: true }],
    },

    /**
     * Returns the maximum element in an array using the expression `expr` as the comparison key.
     * The entire element is returned.
     * @param {array} elements the array in which the maximum element is to be found
     * @param {expression} expr the expr to use as the `comparison` key
     * @return {any}
     * @function maxBy
     * @example
     * maxBy(['abcd', 'e', 'def'], &length(@)) //returns 'abcd'
     * @example
     * maxBy([{year: 2010}, {year: 2020}, {year: 1910}], &year) //returns {year: 2020}
     * @category jmespath
     */
    maxBy: {
      _func: resolvedArgs => {
        const exprefNode = resolvedArgs[1];
        const resolvedArray = resolvedArgs[0];
        const keyFunction = createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
        let maxNumber = -Infinity;
        let maxRecord;
        let current;
        resolvedArray.forEach(arg => {
          current = keyFunction(arg);
          if (current > maxNumber) {
            maxNumber = current;
            maxRecord = arg;
          }
        });
        return maxRecord;
      },
      _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
    },

    /**
     * Accepts 0 or more objects as arguments, and returns a single object with
     * subsequent objects merged. Each subsequent object’s key/value pairs are
     * added to the preceding object. This function is used to combine multiple
     * objects into one. You can think of this as the first object being the base object,
     * and each subsequent argument being overrides that are applied to the base object.
     * @param {...object} args
     * @return {object}
     * @function merge
     * @example
     * merge({a: 1, b: 2}, {c : 3, d: 4}) // returns {a :1, b: 2, c: 3, d: 4}
     * @example
     * merge({a: 1, b: 2}, {a : 3, d: 4}) // returns {a :3, b: 2, d: 4}
     * @category jmespath
     */
    merge: {
      _func: resolvedArgs => {
        const merged = {};
        resolvedArgs.forEach(current => {
          Object.entries(current || {}).forEach(([key, value]) => {
            merged[key] = value;
          });
        });
        return merged;
      },
      _signature: [{ types: [TYPE_OBJECT], variadic: true }],
    },

    /**
     * Returns the lowest value in the provided `collection` arguments.
     * If all collections are empty `null` is returned.
     * min() can work on numbers or strings.
     * If a mix of numbers and strings are provided, the type of the first value will be used.
     * @param {number[]|string[]} collection array in which the minimum element is to be calculated
     * @return {number}
     * @function min
     * @example
     * min([1, 2, 3], [4, 5, 6], 7) //returns 1
     * @example
     * min([]) // returns null
     * @example
     * min(['a', 'a1', 'b']) // returns 'a'
     * @category jmespath
     */
    min: {
      _func: args => {
        // flatten the args into a single array
        const array = args.reduce((prev, cur) => {
          if (Array.isArray(cur)) prev.push(...cur);
          else prev.push(cur);
          return prev;
        }, []);

        const first = array.find(r => r !== null);
        if (array.length === 0 || first === undefined) return null;
        // use the first value to determine the comparison type
        const isNumber = getTypeName(first, true) === TYPE_NUMBER;
        const compare = isNumber
          ? (prev, cur) => {
            const current = toNumber(cur);
            return prev <= current ? prev : current;
          }
          : (prev, cur) => {
            const current = toString(cur);
            return prev.localeCompare(current) === 1 ? current : prev;
          };

        return array.reduce(compare, isNumber ? toNumber(first) : toString(first));
      },
      _signature: [{ types: [TYPE_ARRAY, TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING], variadic: true }],
    },

    /**
     * Returns the minimum element in `elements` array using the expression `expr`
     * as the comparison key.
     * @param {array} elements
     * @param {expression} expr expression that returns either a string or a number
     * @return {any}
     * @function minBy
     * @example
     * minBy(['abcd', 'e', 'def'], &length(@)) //returns 'e'
     * @example
     * minBy([{year: 2010}, {year: 2020}, {year: 1910}], &year) //returns {year: 1910}
     * @category jmespath
     */
    minBy: {
      _func: resolvedArgs => {
        const exprefNode = resolvedArgs[1];
        const resolvedArray = resolvedArgs[0];
        const keyFunction = createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
        let minNumber = Infinity;
        let minRecord;
        let current;
        resolvedArray.forEach(arg => {
          current = keyFunction(arg);
          if (current < minNumber) {
            minNumber = current;
            minRecord = arg;
          }
        });
        return minRecord;
      },
      _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
    },

    /**
     * Returns the first argument that does not resolve to `null`.
     * This function accepts one or more arguments, and will evaluate
     * them in order until a non null argument is encounted. If all
     * arguments values resolve to null, then a value of null is returned.
     * @param {...any} argument
     * @return {any}
     * @function notNull
     * @example
     * notNull(1, 2, 3, 4, `null`) //returns 1
     * @example
     * notNull(`null`, 2, 3, 4, `null`) //returns 2
     * @category jmespath
     */
    notNull: {
      _func: resolvedArgs => resolvedArgs.find(arg => getTypeName(arg) !== TYPE_NULL) || null,
      _signature: [{ types: [TYPE_ANY], variadic: true }],
    },

    /**
     * executes a user-supplied reducer expression `expr` on each element of the
     * array, in order, passing in the return value from the calculation on the preceding element.
     * The final result of running the reducer across all elements of the `elements` array is a
     * single value.
     * The expression can access the following properties
     * * accumulated: accumulated value based on the previous calculations. Initial value is `null`
     * * current: current element to process
     * * index: index of the `current` element in the array
     * * array: original array
     * @param {expression} expr reducer expr to be executed on each element
     * @param {array} elements array of elements on which the expression will be evaluated
     * @return {any}
     * @function reduce
     * @example
     * reduce(&(accumulated + current), [1, 2, 3]) //returns 6
     * @example
     * reduce(&(accumulated - current), [3, 3, 3]) //returns -9
     * @example
     * reduce(&if(accumulated == `null`, current, accumulated * current), [3, 3, 3]) //returns 27
     * @category jmespath
     */
    reduce: {
      _func: resolvedArgs => {
        const exprefNode = resolvedArgs[0];
        return resolvedArgs[1].reduce(
          (accumulated, current, index, array) => runtime.interpreter.visit(exprefNode, {
            accumulated, current, index, array,
          }),
          resolvedArgs.length === 3 ? resolvedArgs[2] : null,
        );
      },
      _signature: [
        { types: [TYPE_EXPREF] },
        { types: [TYPE_ARRAY] },
        { types: [TYPE_ANY], optional: true },
      ],
    },

    /**
     * Register a function to allow code re-use.  The registered function may take one parameter.
     * If more parameters are needed, combine them in an array or map.
     * @param {string} functionName Name of the function to register
     * @param {expression} expr Expression to execute with this function call
     * @return {{}} returns an empty object
     * @function register
     * @example
     * register('product', &@[0] * @[1]) // can now call: product([2,21]) => returns 42
     * @category jmespath
     */
    register: {
      _func: resolvedArgs => {
        const functionName = resolvedArgs[0];
        const exprefNode = resolvedArgs[1];

        if (functionMap[functionName]) {
          debug.push(`Cannot re-register '${functionName}'`);
          return {};
        }
        functionMap[functionName] = {
          _func: args => runtime.interpreter.visit(exprefNode, ...args),
          _signature: [{ types: [TYPE_ANY], optional: true }],
        };
        return {};
      },
      _signature: [
        { types: [TYPE_STRING] },
        { types: [TYPE_EXPREF] },
      ],
    },
    /**
     * Reverses the order of the `argument`.
     * @param {string|array} argument
     * @return {array}
     * @function reverse
     * @example
     * reverse(['a', 'b', 'c']) //returns ['c', 'b', 'a']
     * @category jmespath
     */
    reverse: {
      _func: resolvedArgs => {
        const originalStr = valueOf(resolvedArgs[0]);
        const typeName = getTypeName(originalStr);
        if (typeName === TYPE_STRING) {
          let reversedStr = '';
          for (let i = originalStr.length - 1; i >= 0; i -= 1) {
            reversedStr += originalStr[i];
          }
          return reversedStr;
        }
        const reversedArray = resolvedArgs[0].slice(0);
        reversedArray.reverse();
        return reversedArray;
      },
      _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] }],
    },

    /**
     * This function accepts an array `list` argument and returns the sorted elements of
     * the `list` as an array. The array must be a list of strings or numbers.
     * Sorting strings is based on code points. Locale is not taken into account.
     * @param {number[]|string[]} list
     * @return {number[]|string[]}
     * @function sort
     * @example
     * sort([1, 2, 4, 3, 1]) // returns [1, 1, 2, 3, 4]
     * @category jmespath
     */
    sort: {
      _func: resolvedArgs => {
        const sortedArray = resolvedArgs[0].slice(0);
        if (sortedArray.length > 0) {
          const normalize = getTypeName(resolvedArgs[0][0]) === TYPE_NUMBER ? toNumber : toString;
          sortedArray.sort((a, b) => {
            const va = normalize(a);
            const vb = normalize(b);
            if (va < vb) return -1;
            if (va > vb) return 1;
            return 0;
          });
        }
        return sortedArray;
      },
      _signature: [{ types: [TYPE_ARRAY, TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER] }],
    },

    /**
     * Sort an array using an expression `expr` as the sort key. For each element
     * in the array of elements, the `expr` expression is applied and the resulting
     * value is used as the key used when sorting the elements. If the result of
     * evaluating the `expr` against the current array element results in type
     * other than a number or a string, a type error will occur.
     * @param {array} elements
     * @param {expression} expr
     * @return {array}
     * @function sortBy
     * @example
     * sortBy(['abcd', 'e', 'def'], &length(@)) //returns ['e', 'def', 'abcd']
     * @example
     * // returns [{year: 1910}, {year: 2010}, {year: 2020}]
     * sortBy([{year: 2010}, {year: 2020}, {year: 1910}], &year)
     * @category jmespath
     */
    sortBy: {
      _func: resolvedArgs => {
        const sortedArray = resolvedArgs[0].slice(0);
        if (sortedArray.length === 0) {
          return sortedArray;
        }
        const exprefNode = resolvedArgs[1];
        const requiredType = getTypeName(
          runtime.interpreter.visit(exprefNode, sortedArray[0]),
        );
        if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
          throw new Error('TypeError');
        }
        // In order to get a stable sort out of an unstable
        // sort algorithm, we decorate/sort/undecorate (DSU)
        // by creating a new list of [index, element] pairs.
        // In the cmp function, if the evaluated elements are
        // equal, then the index will be used as the tiebreaker.
        // After the decorated list has been sorted, it will be
        // undecorated to extract the original elements.
        const decorated = [];
        for (let i = 0; i < sortedArray.length; i += 1) {
          decorated.push([i, sortedArray[i]]);
        }
        decorated.sort((a, b) => {
          const exprA = runtime.interpreter.visit(exprefNode, a[1]);
          const exprB = runtime.interpreter.visit(exprefNode, b[1]);
          if (getTypeName(exprA) !== requiredType) {
            throw new Error(
              `TypeError: expected ${requiredType}, received ${
                getTypeName(exprA)}`,
            );
          } else if (getTypeName(exprB) !== requiredType) {
            throw new Error(
              `TypeError: expected ${requiredType}, received ${
                getTypeName(exprB)}`,
            );
          }
          if (exprA > exprB) {
            return 1;
          }
          if (exprA < exprB) {
            return -1;
          }
          // If they're equal compare the items by their
          // order to maintain relative order of equal keys
          // (i.e. to get a stable sort).
          return a[0] - b[0];
        });
        // Undecorate: extract out the original list elements.
        for (let j = 0; j < decorated.length; j += 1) {
          [, sortedArray[j]] = decorated[j];
        }
        return sortedArray;
      },
      _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }],
    },

    /**
     * Returns true if the `subject` starts with the `prefix`, otherwise returns false.
     * @param {string} subject subject in which the `prefix` is being searched for
     * @param {string} prefix prefix to search in the subject
     * @return {boolean}
     * @function startsWith
     * @example
     * startsWith('jack is at home', 'jack') // returns true
     * @category jmespath
     */
    startsWith: {
      _func: resolvedArgs => valueOf(resolvedArgs[0]).startsWith(valueOf(resolvedArgs[1])),
      _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
    },

    /**
     * Returns the sum of the provided `collection` array argument.
     * An empty array will produce a return value of 0.
     * @param {number[]} collection array whose element's sum has to be computed
     * @return {number}
     * @function sum
     * @example
     * sum([1, 2, 3]) //returns 6
     * @category jmespath
     */
    sum: {
      _func: resolvedArgs => {
        let sum = 0;
        resolvedArgs[0].forEach(arg => {
          sum += arg * 1;
        });
        return sum;
      },
      _signature: [{ types: [TYPE_ARRAY_NUMBER] }],
    },

    /**
     * converts the passed `arg` to an array. The conversion happens as per the following rules
     * * array - Returns the passed in value.
     * * number/string/object/boolean - Returns a one element array containing the argument.
     * @param {any} arg
     * @return {array}
     * @function toArray
     * @example
     * toArray(1) // returns [1]
     * @example
     * toArray(null()) // returns [`null`]
     * @category jmespath
     */
    toArray: {
      _func: resolvedArgs => {
        if (getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
          return resolvedArgs[0];
        }
        return [resolvedArgs[0]];
      },

      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * converts the passed arg to a number. The conversion happens as per the following rules
     * * string - Returns the parsed number.
     * * number - Returns the passed in value.
     * * array - null
     * * object - null
     * * boolean - null
     * * null - null
     * @param {any} arg
     * @return {number}
     * @function toNumber
     * @example
     * toNumber(1) //returns 1
     * @example
     * toNumber('10') //returns 10
     * @example
     * toNumber({a: 1}) //returns null
     * @example
     * toNumber(true()) //returns null
     * @category jmespath
     */
    toNumber: {
      _func: resolvedArgs => {
        const typeName = getTypeName(resolvedArgs[0]);
        if (typeName === TYPE_NUMBER) {
          return resolvedArgs[0];
        }
        if (typeName === TYPE_STRING) {
          return toNumber(resolvedArgs[0]);
        }
        return null;
      },
      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * converts the passed `arg` to a string. The conversion happens as per the following rules
     * * string - Returns the passed in value.
     * * number/array/object/boolean - The JSON encoded value of the object.
     * @param {any} arg
     * @return {string}
     * @function toString
     * @example
     * toString(1) //returns '1'
     * @example
     * toString(true()) //returns 'true'
     * @category jmespath
     */
    toString: {
      _func: resolvedArgs => {
        if (getTypeName(resolvedArgs[0]) === TYPE_STRING) {
          return resolvedArgs[0];
        }
        return JSON.stringify(resolvedArgs[0]);
      },

      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * Returns the JavaScript type of the given `subject` argument as a string value.
     *
     * The return value MUST be one of the following:
     * * number
     * * string
     * * boolean
     * * array
     * * object
     * * null
     * @param {any} subject
     * @return {string}
     *
     * @function type
     * @example
     * type(1) //returns 'number'
     * @example
     * type('') //returns 'string'
     * @category jmespath
     */
    type: {
      _func: resolvedArgs => ({
        [TYPE_NUMBER]: 'number',
        [TYPE_STRING]: 'string',
        [TYPE_ARRAY]: 'array',
        [TYPE_OBJECT]: 'object',
        [TYPE_BOOLEAN]: 'boolean',
        [TYPE_EXPREF]: 'expref',
        [TYPE_NULL]: 'null',
      }[getTypeName(resolvedArgs[0])]),
      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * Returns the values of the provided object `obj`. Note that because JSON hashes are
     * inherently unordered, the values associated with the provided object obj are
     * inherently unordered.
     * @param {object} obj
     * @return {array}
     * @function values
     * @example
     * values({a : 3, b : 4}) //returns [3, 4]
     * @category jmespath
     */
    values: {
      _func: resolvedArgs => {
        const arg = valueOf(resolvedArgs[0]);
        if (arg === null) return [];
        return Object.values(arg);
      },
      _signature: [{ types: [TYPE_ANY] }],
    },

    /**
     * Returns a convolved (zipped) array containing grouped arrays of values from
     * the array arguments from index 0, 1, 2, etc.
     * This function accepts a variable number of arguments.
     * The length of the returned array is equal to the length of the shortest array.
     * @param {...array} arrays array of arrays to zip together
     * @return {array} An array of arrays with elements zipped together
     * @function zip
     * @example
     * zip([1, 2, 3], [4, 5, 6]) //returns [[1, 4], [2, 5], [3, 6]]
     * @category jmespath
     */
    zip: {
      _func: args => {
        const count = args.reduce((min, current) => Math.min(min, current.length), args[0].length);
        const result = new Array(count);
        for (let i = 0; i < count; i += 1) {
          result[i] = [];
          args.forEach(a => {
            result[i].push(a[i]);
          });
        }
        return result;
      },
      _signature: [{ types: [TYPE_ARRAY], variadic: true }],
    },
  };
  return functionMap;
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/jmespath.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/jmespath.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Formula)
/* harmony export */ });
/* harmony import */ var _TreeInterpreter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TreeInterpreter.js */ "./node_modules/@adobe/json-formula/src/jmespath/TreeInterpreter.js");
/* harmony import */ var _Parser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Parser.js */ "./node_modules/@adobe/json-formula/src/jmespath/Parser.js");
/* harmony import */ var _dataTypes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataTypes.js */ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js");
/* harmony import */ var _matchType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./matchType.js */ "./node_modules/@adobe/json-formula/src/jmespath/matchType.js");
/* harmony import */ var _openFormulaFunctions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./openFormulaFunctions.js */ "./node_modules/@adobe/json-formula/src/jmespath/openFormulaFunctions.js");
/* harmony import */ var _functions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./functions.js */ "./node_modules/@adobe/json-formula/src/jmespath/functions.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@adobe/json-formula/src/jmespath/utils.js");
/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */








// Type constants used to define functions.
const {
  TYPE_CLASS,
  TYPE_ANY,
} = _dataTypes_js__WEBPACK_IMPORTED_MODULE_2__["default"];

function getToNumber(stringToNumber, debug = []) {
  return value => {
    const n = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.getValueOf)(value); // in case it's an object that implements valueOf()
    if (n === null) return null;
    if (n instanceof Array) {
      debug.push('Converted array to zero');
      return 0;
    }
    const type = typeof n;
    if (type === 'number') return n;
    if (type === 'string') return stringToNumber(n, debug);
    if (type === 'boolean') return n ? 1 : 0;
    debug.push('Converted object to zero');
    return 0;
  };
}
function toString(a) {
  if (a === null || a === undefined) return '';
  // don't call a 'toString' method, since we could have a child named 'toString()'
  return a.toString();
}

const defaultStringToNumber = (str => {
  const n = +str;
  return Number.isNaN(n) ? 0 : n;
});

function isClass(obj) {
  if (obj === null) return false;
  if (Array.isArray(obj)) return false;
  return obj.constructor.name !== 'Object';
}

function matchClass(arg, expectedList) {
  // checking isClass() generates a dependency -- so call it only if necessary
  return expectedList.includes(TYPE_CLASS) && isClass(arg);
}

class Runtime {
  constructor(debug, toNumber, customFunctions = {}) {
    this.strictDeepEqual = _utils_js__WEBPACK_IMPORTED_MODULE_6__.strictDeepEqual;
    this.toNumber = toNumber;
    this.functionTable = (0,_functions_js__WEBPACK_IMPORTED_MODULE_5__["default"])(
      this,
      _utils_js__WEBPACK_IMPORTED_MODULE_6__.isObject,
      _utils_js__WEBPACK_IMPORTED_MODULE_6__.isArray,
      toNumber,
      _matchType_js__WEBPACK_IMPORTED_MODULE_3__.getTypeName,
      _utils_js__WEBPACK_IMPORTED_MODULE_6__.getValueOf,
      toString,
      debug,
    );

    Object.entries(
      (0,_openFormulaFunctions_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_6__.getValueOf, toString, toNumber, debug),
    ).forEach(([fname, func]) => {
      this.functionTable[fname] = func;
    });

    Object.entries(customFunctions).forEach(([fname, func]) => {
      this.functionTable[fname] = func;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _validateArgs(argName, args, signature, bResolved) {
    // Validating the args requires validating
    // the correct arity and the correct type of each arg.
    // If the last argument is declared as variadic, then we need
    // a minimum number of args to be required.  Otherwise it has to
    // be an exact amount.
    if (signature.length === 0) {
      return;
    }
    let pluralized;
    const argsNeeded = signature.filter(arg => !arg.optional).length;
    if (signature[signature.length - 1].variadic) {
      if (args.length < signature.length) {
        pluralized = signature.length === 1 ? ' argument' : ' arguments';
        throw new Error(`ArgumentError: ${argName}() `
        + `takes at least${signature.length}${pluralized
        } but received ${args.length}`);
      }
    } else if (args.length < argsNeeded || args.length > signature.length) {
      pluralized = signature.length === 1 ? ' argument' : ' arguments';
      throw new Error(`ArgumentError: ${argName}() `
      + `takes ${signature.length}${pluralized
      } but received ${args.length}`);
    }
    // if the arguments are unresolved, there's no point in validating types
    if (!bResolved) return;
    let currentSpec;
    let actualType;
    const limit = Math.min(signature.length, args.length);
    for (let i = 0; i < limit; i += 1) {
      currentSpec = signature[i].types;
      // Try to avoid checks that will introspect the object and generate dependencies
      if (!matchClass(args[i], currentSpec) && !currentSpec.includes(TYPE_ANY)) {
        actualType = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_3__.getTypeNames)(args[i]);
        // eslint-disable-next-line no-param-reassign
        args[i] = (0,_matchType_js__WEBPACK_IMPORTED_MODULE_3__.matchType)(actualType, currentSpec, args[i], argName, this.toNumber, toString);
      }
    }
  }

  callFunction(name, resolvedArgs, data, interpreter, bResolved = true) {
    // this check will weed out 'valueOf', 'toString' etc
    if (!Object.prototype.hasOwnProperty.call(this.functionTable, name)) throw new Error(`Unknown function: ${name}()`);

    const functionEntry = this.functionTable[name];
    this._validateArgs(name, resolvedArgs, functionEntry._signature, bResolved);
    return functionEntry._func.call(this, resolvedArgs, data, interpreter);
  }
}

class Formula {
  constructor(debug, customFunctions, stringToNumberFn) {
    this.debug = debug;
    this.toNumber = getToNumber(stringToNumberFn || defaultStringToNumber, debug);
    this.runtime = new Runtime(debug, this.toNumber, customFunctions);
  }

  compile(stream, allowedGlobalNames = []) {
    let ast;
    try {
      const parser = new _Parser_js__WEBPACK_IMPORTED_MODULE_1__["default"](allowedGlobalNames);
      ast = parser.parse(stream, this.debug);
    } catch (e) {
      this.debug.push(e.toString());
      throw e;
    }
    return ast;
  }

  search(node, data, globals = {}, language = 'en-US') {
    // This needs to be improved.  Both the interpreter and runtime depend on
    // each other.  The runtime needs the interpreter to support exprefs.
    // There's likely a clean way to avoid the cyclic dependency.
    this.runtime.interpreter = new _TreeInterpreter_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      this.runtime,
      globals,
      this.toNumber,
      toString,
      this.debug,
      language,
    );

    try {
      return this.runtime.interpreter.search(node, data);
    } catch (e) {
      this.debug.push(e.message || e.toString());
      throw e;
    }
  }
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/matchType.js":
/*!********************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/matchType.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTypeName: () => (/* binding */ getTypeName),
/* harmony export */   getTypeNames: () => (/* binding */ getTypeNames),
/* harmony export */   matchType: () => (/* binding */ matchType)
/* harmony export */ });
/* harmony import */ var _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataTypes.js */ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js");
/* harmony import */ var _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokenDefinitions.js */ "./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js");



const {
  TYPE_NUMBER,
  TYPE_ANY,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT,
  TYPE_BOOLEAN,
  TYPE_EXPREF,
  TYPE_NULL,
  TYPE_ARRAY_NUMBER,
  TYPE_ARRAY_STRING,
  TYPE_CLASS,
  TYPE_ARRAY_ARRAY,
} = _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"];

const {
  TOK_EXPREF,
} = _tokenDefinitions_js__WEBPACK_IMPORTED_MODULE_1__["default"];

const TYPE_NAME_TABLE = {
  [TYPE_NUMBER]: 'number',
  [TYPE_ANY]: 'any',
  [TYPE_STRING]: 'string',
  [TYPE_ARRAY]: 'array',
  [TYPE_OBJECT]: 'object',
  [TYPE_BOOLEAN]: 'boolean',
  [TYPE_EXPREF]: 'expression',
  [TYPE_NULL]: 'null',
  [TYPE_ARRAY_NUMBER]: 'Array<number>',
  [TYPE_ARRAY_STRING]: 'Array<string>',
  [TYPE_CLASS]: 'class',
  [TYPE_ARRAY_ARRAY]: 'Array<array>',
};

function getTypeName(inputObj, useValueOf = true) {
  if (inputObj === null) return TYPE_NULL;
  let obj = inputObj;
  if (useValueOf) {
    // check for the case where there's a child named 'valueOf' that's not a function
    // if so, then it's an object...
    if (typeof inputObj.valueOf === 'function') obj = inputObj.valueOf.call(inputObj);
    else return TYPE_OBJECT;
  }
  switch (Object.prototype.toString.call(obj)) {
    case '[object String]':
      return TYPE_STRING;
    case '[object Number]':
      return TYPE_NUMBER;
    case '[object Array]':
      return TYPE_ARRAY;
    case '[object Boolean]':
      return TYPE_BOOLEAN;
    case '[object Null]':
      return TYPE_NULL;
    case '[object Object]':
      // Check if it's an expref.  If it has, it's been
      // tagged with a jmespathType attr of 'Expref';
      if (obj.jmespathType === TOK_EXPREF) {
        return TYPE_EXPREF;
      }
      return TYPE_OBJECT;
    default:
      return TYPE_OBJECT;
  }
}

function getTypeNames(inputObj) {
  // return the types with and without using valueOf
  // needed for the cases where we really need an object passed to a function -- not it's value
  const type1 = getTypeName(inputObj);
  const type2 = getTypeName(inputObj, false);
  return [type1, type2];
}

function matchType(actuals, expectedList, argValue, context, toNumber, toString) {
  const actual = actuals[0];
  if (expectedList.findIndex(
    type => type === TYPE_ANY || actual === type,
  ) !== -1
  ) return argValue;
  // Can't coerce Objects to any other type,
  // and cannot coerce anything to a Class
  let wrongType = false;
  if (actual === TYPE_OBJECT || (expectedList.length === 1 && expectedList[0] === TYPE_CLASS)) {
    wrongType = true;
  }
  if (actual === TYPE_ARRAY && (expectedList.length === 1 && expectedList[0] === TYPE_OBJECT)) {
    wrongType = true;
  }
  if (expectedList.includes(TYPE_ARRAY_ARRAY)) {
    if (actual === TYPE_ARRAY) {
      argValue.forEach(a => {
        if (!(a instanceof Array)) wrongType = true;
      });
      if (!wrongType) return argValue;
    }
    wrongType = true;
  }
  if (wrongType) {
    throw new Error(`TypeError: ${context} expected argument to be type ${TYPE_NAME_TABLE[expectedList[0]]} but received type ${TYPE_NAME_TABLE[actual]} instead.`);
  }
  // no exact match in the list of possible types, see if we can coerce an array type
  let expected = -1;
  if (actual === TYPE_ARRAY) {
    if (expectedList.includes(TYPE_ARRAY_STRING) && expectedList.includes(TYPE_ARRAY_NUMBER)) {
      // choose the array type based on the first element
      if (argValue.length > 0 && typeof argValue[0] === 'string') expected = TYPE_ARRAY_STRING;
      else expected = TYPE_ARRAY_NUMBER;
    }
  }
  if (expected === -1 && [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER, TYPE_ARRAY].includes(actual)) {
    expected = expectedList.find(
      e => [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER, TYPE_ARRAY].includes(e),
    );
  }
  // no match, just take the first type
  if (expected === -1) [expected] = expectedList;
  if (expected === TYPE_ANY) return argValue;
  if (expected === TYPE_ARRAY_STRING
      || expected === TYPE_ARRAY_NUMBER
      || expected === TYPE_ARRAY) {
    if (expected === TYPE_ARRAY) {
      if (actual === TYPE_ARRAY_NUMBER || actual === TYPE_ARRAY_STRING) return argValue;
      return argValue === null ? [] : [argValue];
    }
    // The expected type can either just be array,
    // or it can require a specific subtype (array of numbers).
    const subtype = expected === TYPE_ARRAY_NUMBER ? TYPE_NUMBER : TYPE_STRING;
    if (actual === TYPE_ARRAY) {
      // Otherwise we need to check subtypes.
      // We're going to modify the array, so take a copy
      const returnArray = argValue.slice();
      for (let i = 0; i < returnArray.length; i += 1) {
        const indexType = getTypeNames(returnArray[i]);
        returnArray[i] = matchType(
          indexType,
          [subtype],
          returnArray[i],
          context,
          toNumber,
          toString,
        );
      }
      return returnArray;
    }
    if ([TYPE_NUMBER, TYPE_STRING, TYPE_NULL, TYPE_BOOLEAN].includes(subtype)) {
      return [matchType(actuals, [subtype], argValue, context, toNumber, toString)];
    }
  } else {
    if (expected === TYPE_NUMBER) {
      if ([TYPE_STRING, TYPE_BOOLEAN, TYPE_NULL].includes(actual)) return toNumber(argValue);
      /* TYPE_ARRAY, TYPE_EXPREF, TYPE_OBJECT, TYPE_ARRAY, TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING */
      return 0;
    }
    if (expected === TYPE_STRING) {
      if (actual === TYPE_NULL || actual === TYPE_OBJECT) return '';
      return toString(argValue);
    }
    if (expected === TYPE_BOOLEAN) {
      return !!argValue;
    }
    if (expected === TYPE_OBJECT && actuals[1] === TYPE_OBJECT) {
      return argValue;
    }
  }
  throw new Error(`TypeError: ${context} expected argument to be type ${TYPE_NAME_TABLE[expectedList[0]]} but received type ${TYPE_NAME_TABLE[actual]} instead.`);
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/openFormulaFunctions.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/openFormulaFunctions.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adjustTimeZone: () => (/* binding */ adjustTimeZone),
/* harmony export */   "default": () => (/* binding */ openFormulaFunctions)
/* harmony export */ });
/* harmony import */ var _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataTypes.js */ "./node_modules/@adobe/json-formula/src/jmespath/dataTypes.js");
/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/


// get the offset in MS, given a date and timezone
// timezone is an IANA name. e.g. 'America/New_York'
function offsetMS(dateObj, timeZone) {
  const tzOffset = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' }).format(dateObj);
  const offset = /GMT([+\-−])?(\d{1,2}):?(\d{0,2})?/.exec(tzOffset);
  if (!offset) return 0;
  const [sign, hours, minutes] = offset.slice(1);
  const result = (((hours || 0) * 60) + 1 * (minutes || 0)) * 60 * 1000;
  return sign === '-' ? result * -1 : result;
}

function round(num, digits) {
  const precision = 10 ** digits;
  return Math.round(num * precision) / precision;
}

const MS_IN_DAY = 24 * 60 * 60 * 1000;

// If we create a non-UTC date, then we need to adjust from the default JavaScript timezone
// to the default timezone
function adjustTimeZone(dateObj, timeZone) {
  if (dateObj === null) return null;
  let baseDate = Date.UTC(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds(),
    dateObj.getMilliseconds(),
  );
  baseDate += offsetMS(dateObj, timeZone);

  // get the offset for the default JS environment
  // return days since the epoch
  return new Date(baseDate);
}

function openFormulaFunctions(valueOf, toString, toNumber, debug = []) {
  return {
    /**
     * Returns the logical AND result of all parameters.
     * If the parameters are not boolean they will be cast to boolean as per the following rules
     * * null -> false
     * * number -> false if the number is 0, true otherwise
     * * string -> false if the string is empty, true otherwise. String "false" resolves to true
     * * array -> true
     * * object -> true
     * @param {any} firstOperand logical expression
     * @param {...any} [additionalOperands] any number of additional expressions
     * @returns {boolean} The logical result of applying AND to all parameters
     * @example
     * and(10 > 8, length('foo') < 5) // returns true
     * @example
     * and(`null`, length('foo') < 5) // returns false
     * @function
     * @category openFormula
     */
    and: {
      _func: resolvedArgs => {
        let result = !!valueOf(resolvedArgs[0]);
        resolvedArgs.slice(1).forEach(arg => {
          result = result && !!valueOf(arg);
        });
        return result;
      },
      _signature: [{ types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY], variadic: true }],
    },

    /**
     * Returns a lower-case string of the `input` string using locale-specific mappings.
     * e.g. Strings with German lowercase letter 'ß' can be compared to 'ss'
     * @param {string} input string to casefold
     * @returns {string} A new string converted to lower case
     * @function casefold
     * @example
     * casefold('AbC') // returns 'abc'
     * @category JSONFormula
     */
    casefold: {
      _func: (args, _data, interpreter) => {
        const str = toString(args[0]);
        return str.toLocaleUpperCase(interpreter.language).toLocaleLowerCase(interpreter.language);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Return difference between two date values.
     * @param {number} start_date The starting date.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @param {number} end_date The end date -- must be greater or equal to start_date.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @param {string} unit  One of:
     * * `y` the number of whole years between start_date and end_date
     * * `m` the number of whole months between start_date and end_date.
     * * `d` the number of days between start_date and end_date
     * * `md` the number of days between start_date and end_date after subtracting whole months.
     * * `ym` the number of whole months between start_date and end_date
     * after subtracting whole years.
     * * `yd` the number of days between start_date and end_date, assuming start_date
     * and end_date were no more than one year apart
     * @returns {integer} The number of days/months/years difference
     * @function
     * @category openFormula
     * @example
     * datedif(datetime(2001, 1, 1), datetime(2003, 1, 1), 'y') // returns 2
     * @example
     * datedif(datetime(2001, 6, 1), datetime(2003, 8, 15), 'D') // returns 440
     * // 440 days between June 1, 2001, and August 15, 2002 (440)
     * @example
     * datedif(datetime(2001, 6, 1), datetime(2003, 8, 15), 'YD') // returns 440
     * // 75 days between June 1 and August 15, ignoring the years of the dates (75)
     */
    datedif: {
      _func: args => {
        const d1 = toNumber(args[0]);
        const d2 = toNumber(args[1]);
        const unit = toString(args[2]).toLowerCase();
        if (d2 === d1) return 0;
        if (d2 < d1) return null;
        if (unit === 'd') return Math.floor(d2 - d1);
        const date1 = new Date(d1 * MS_IN_DAY);
        const date2 = new Date(d2 * MS_IN_DAY);
        const yearDiff = date2.getFullYear() - date1.getFullYear();
        let monthDiff = date2.getMonth() - date1.getMonth();
        const dayDiff = date2.getDate() - date1.getDate();

        if (unit === 'y') {
          let y = yearDiff;
          if (monthDiff < 0) y -= 1;
          if (monthDiff === 0 && dayDiff < 0) y -= 1;
          return y;
        }
        if (unit === 'm') {
          return yearDiff * 12 + monthDiff + (dayDiff < 0 ? -1 : 0);
        }
        if (unit === 'ym') {
          if (dayDiff < 0) monthDiff -= 1;
          if (monthDiff <= 0 && yearDiff > 0) return 12 + monthDiff;
          return monthDiff;
        }
        if (unit === 'yd') {
          if (dayDiff < 0) monthDiff -= 1;
          if (monthDiff < 0) date2.setFullYear(date1.getFullYear() + 1);
          else date2.setFullYear(date1.getFullYear());
          return Math.floor((date2.getTime() - date1.getTime()) / MS_IN_DAY);
        }
        throw new TypeError(`Unrecognized unit parameter "${unit}" for datedif()`);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Return a date/time value.
     * @param {integer} year Integer value representing the year.
     * Values from 0 to 99 map to the years 1900 to 1999. All other values are the actual year
     * @param {integer} month Integer value representing the month, beginning with 1 for
     * January to 12 for December.
     * @param {integer} day Integer value representing the day of the month.
     * @param {integer} [hours] Integer value between 0 and 23 representing the hour of the day.
     * Defaults to 0.
     * @param {integer} [minutes] Integer value representing the minute segment of a time.
     * The default is 0 minutes past the hour.
     * @param {integer} [seconds] Integer value representing the second segment of a time.
     * The default is 0 seconds past the minute.
     * @param {integer} [milliseconds] Integer value representing the millisecond segment of a time.
     * The default is 0 milliseconds past the second.
     * @param {string} [timeZoneName] according to IANA time zone names. e.g. "America/Toronto"
     * @returns {number} A date/time value represented by number of seconds since 1 January 1970.
     * @kind function
     * @function
     * @category JSONFormula
     * @example
     * datetime(2010, 10, 10) // returns representation of October 10, 2010
     * @example
     * datetime(2010, 2, 28) // returns representation of February 28, 2010
     */
    datetime: {
      _func: args => {
        const year = toNumber(args[0]);
        const month = toNumber(args[1]);
        const day = toNumber(args[2]);
        const hours = args.length > 3 ? toNumber(args[3]) : 0;
        const minutes = args.length > 4 ? toNumber(args[4]) : 0;
        const seconds = args.length > 5 ? toNumber(args[5]) : 0;
        const ms = args.length > 6 ? toNumber(args[6]) : 0;
        const tz = args.length > 7 ? toString(args[7]) : null;
        // javascript months starts from 0
        let jsDate = new Date(year, month - 1, day, hours, minutes, seconds, ms);
        if (tz) {
          jsDate = adjustTimeZone(jsDate, tz);
        }
        return jsDate.getTime() / MS_IN_DAY;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING], optional: true },
      ],
    },

    /**
     * Returns the day of a date, represented by a serial number.
     * The day is given as an integer ranging from 1 to 31.
     * @param {number} The date of the day you are trying to find.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @return {number}
     * @function day
     * @category openFormula
     * @example
     * day(datetime(2008,5,23)) //returns 23
     */
    day: {
      _func: args => {
        const date = toNumber(args[0]);
        const jsDate = new Date(date * MS_IN_DAY);
        return jsDate.getDate();
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Searches a nested hierarchy of objects to return an array of elements that match a `name`.
     * The name can be either a key into a map or an array index.
     * This is similar to the JSONPath deep scan operator (..)
     * @param {object} object The starting object or array where we start the search
     * @param {string} name The name (or index position) of the elements to find
     * @returns {any}
     * @function
     * @category JSONFormula
     * @example
     * deepScan({a : {b1 : {c : 2}, b2 : {c : 3}}}, 'c') //returns [2, 3]
     */
    deepScan: {
      _func: resolvedArgs => {
        const [source, n] = resolvedArgs;
        const name = n.toString();
        const items = [];
        if (source === null) return items;
        function scan(node) {
          Object.entries(node).forEach(([k, v]) => {
            if (k === name) items.push(v);
            if (typeof v === 'object') scan(v);
          });
        }
        scan(source);
        return items;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_OBJECT, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NULL] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * returns an array of a given object's property `[key, value]` pairs.
     * @param {object} obj Object whose `[key, value]` pairs need to be extracted
     * @returns {any[]} an array of [key, value] pairs
     * @function entries
     * @category JSONFormula
     * @example
     * entries({a: 1, b: 2}) //returns [['a', 1], ['b', 2]]
     */
    entries: {
      _func: args => {
        const obj = valueOf(args[0]);
        return Object.entries(obj);
      },
      _signature: [
        {
          types: [
            _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER,
            _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING,
            _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY,
            _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_OBJECT,
            _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_BOOLEAN,
          ],
        },
      ],
    },

    /**
     * Returns the serial number of the end of a month, given `startDate` plus `monthAdd` months
     * @param {number} startDate The base date to start from.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @param {integer} monthAdd Number of months to add to start date
     * @return {integer} the number of days in the computed month
     * @function
     * @category openFormula
     * @example
     * eomonth(datetime(2011, 1, 1), 1) //returns datetime(2011, 2, 28)
     * @example
     * eomonth(datetime(2011, 1, 1), -3) //returns datetime(2010, 10, 31)
     */
    eomonth: {
      _func: args => {
        const date = toNumber(args[0]);
        const months = toNumber(args[1]);
        const jsDate = new Date(date * MS_IN_DAY);
        // We can give the constructor a month value > 11 and it will increment the years
        // Since day is 1-based, giving zero will yield the last day of the previous month
        const newDate = new Date(jsDate.getFullYear(), jsDate.getMonth() + months + 1, 0);
        return newDate.getTime() / MS_IN_DAY;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Returns e (the base of natural logarithms) raised to a power x. (i.e. e<sup>x</sup>)
     * @param x {number} A numeric expression representing the power of e.
     * @returns {number} e (the base of natural logarithms) raised to a power x
     * @function exp
     * @category openFormula
     * @example
     * exp(10) //returns e^10
     */
    exp: {
      _func: args => {
        const value = toNumber(args[0]);
        return Math.exp(value);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Return constant boolean false value.
     * Note that expressions may also use the JSON literal false: `` `false` ``
     * @returns {boolean} constant boolean value `false`
     * @function
     * @category openFormula
     */
    false: {
      _func: () => false,
      _signature: [],
    },

    /**
     * finds and returns the index of query in text from a start position
     * @param {string} query string to search
     * @param {string} text text in which the query has to be searched
     * @param {number} [start] starting position: defaults to 0
     * @returns {number|null} the index of the query to be searched in the text. If not found
     * returns null
     * @function
     * @category openFormula
     * @example
     * find('m', 'abm') //returns 2
     * @example
     * find('M', 'abMcdM', 3) //returns 2
     * @example
     * find('M', 'ab') //returns `null`
     * @example
     * find('M', 'abMcdM', 2) //returns 2
     */
    find: {
      _func: args => {
        const query = toString(args[0]);
        const text = toString(args[1]);
        const startPos = args.length > 2 ? toNumber(args[2]) : 0;
        const result = text.indexOf(query, startPos);
        if (result === -1) {
          return null;
        }
        return result;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * returns an object by transforming a list of key-value `pairs` into an object.
     * @param {any[]} pairs list of key-value pairs to create the object from
     * @returns {object}
     * @category JSONFormula
     * @function fromEntries
     * @example
     * fromEntries([['a', 1], ['b', 2]]) //returns {a: 1, b: 2}
     */
    fromEntries: {
      _func: args => {
        const array = args[0];
        return Object.fromEntries(array);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY_ARRAY] },
      ],
    },

    /**
     * Extract the hour (0 through 23) from a time/datetime representation
     * @param {number} The datetime/time for which the hour is to be returned.
     * Dates should be specified using the [datetime]{@link datetime} or [time]{@link time} function
     * @return {number}
     * @function hour
     * @category openFormula
     * @example
     * hour(datetime(2008,5,23,12, 0, 0)) //returns 12
     * hour(time(12, 0, 0)) //returns 12
     */
    hour: {
      _func: args => {
        // grab just the fraction part
        const time = toNumber(args[0]) % 1;
        if (time < 0) {
          return null;
        }
        // Normally we'd round to 15 digits, but since we're also multiplying by 24,
        // a reasonable precision is around 14 digits.

        const hour = round(time * 24, 14);

        return Math.floor(hour % 24);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Return one of two values `result1` or `result2`, depending on the `condition`
     * @returns {boolean} True
     * @param {any} condition logical expression to evaluate
     * @param {any} result1 if logical condition is true
     * @param {any} result2 if logical condition is false
     * @return {any} either result1 or result2
     * @function
     * @category openFormula
     * @example
     * if(true(), 1, 2) // returns 1
     * @example
     * if(false(), 1, 2) // returns 2
     */
    if: {
      _func: (unresolvedArgs, data, interpreter) => {
        const conditionNode = unresolvedArgs[0];
        const leftBranchNode = unresolvedArgs[1];
        const rightBranchNode = unresolvedArgs[2];
        const condition = interpreter.visit(conditionNode, data);
        if (valueOf(condition)) {
          return interpreter.visit(leftBranchNode, data);
        }
        return interpreter.visit(rightBranchNode, data);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY] }],
    },

    /**
     * Return a selected number of text characters from the left or
     * in case of array selected number of elements from the start
     * @param {string|array} subject The text/array of characters/elements to extract.
     * @param {number} [elements] number of elements to pick. Defaults to 1
     * @return {string|array}
     * @function left
     * @category openFormula
     * @example
     * left('Sale Price', 4) //returns 'Sale'
     * @example
     * left('Sweden') // returns 'S'
     * @example
     * left([4, 5, 6], 2) // returns [4, 5]
     */
    left: {
      _func: args => {
        const numEntries = args.length > 1 ? toNumber(args[1]) : 1;
        if (numEntries < 0) return null;
        if (args[0] instanceof Array) {
          return args[0].slice(0, numEntries);
        }
        const text = toString(args[0]);
        return text.substr(0, numEntries);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * Converts all the alphabetic characters in a string to lowercase. If the value
     * is not a string it will be converted into string
     * using the default toString method
     * @param {string} input input string
     * @returns {string} the lower case value of the input string
     * @function lower
     * @category openFormula
     * @example
     * lower('E. E. Cummings') //returns e. e. cummings
     */
    lower: {
      _func: args => {
        const value = toString(args[0]);
        return value.toLowerCase();
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Returns extracted text, given an original text, starting position, and length.
     * or in case of array, extracts a subset of the array from start till the length
     * number of elements.
     * Returns null if the `startPos` is greater than the length of the array
     * @param {string|array} subject the text string or array of characters or elements to extract.
     * @param {number} startPos the position of the first character or element to extract.
     * The position starts with 0
     * @param {number} length The number of characters or elements to return from text. If it
     * is greater then the length of `subject` the argument is set to the length of the subject.
     * @return {string|array}
     * @function mid
     * @category openFormula
     * @example
     * mid("Fluid Flow",1,5) //returns 'Fluid'
     * @example
     * mid("Fluid Flow",7,20) //returns 'Flow'
     * @example
     * mid("Fluid Flow",20,5) //returns `null`
     */
    mid: {
      _func: args => {
        const startPos = toNumber(args[1]);
        const numEntries = toNumber(args[2]);
        if (startPos < 0) return null;
        if (args[0] instanceof Array) {
          return args[0].slice(startPos, startPos + numEntries);
        }
        const text = toString(args[0]);
        return text.substr(startPos, numEntries);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Extract the minute (0 through 59) from a time/datetime representation
     * @param {number} The datetime/time for which the minute is to be returned.
     * Dates should be specified using the [datetime]{@link datetime} or [time]{@link time} function
     * @return {number}
     * @function minute
     * @category openFormula
     * @example
     * month(datetime(2008,5,23,12, 10, 0)) //returns 10
     * month(time(12, 10, 0)) //returns 10
     */
    minute: {
      _func: args => {
        const time = toNumber(args[0]) % 1;
        if (time < 0) {
          return null;
        }

        // Normally we'd round to 15 digits, but since we're also multiplying by 1440,
        // a reasonable precision is around 10 digits.
        const minute = Math.round(time * 1440, 10);
        return Math.floor(minute % 60);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Return the remainder when one number is divided by another number.
     * The sign is the same as divisor
     * @param {number} dividend The number for which to find the remainder.
     * @param {number} divisor The number by which to divide number.
     * @return {number} Computes the remainder of `dividend`/`divisor`.
     * @function mod
     * @category openFormula
     * @example
     * mod(3, 2) //returns 1
     * @example
     * mod(-3, 2) //returns 1
     */
    mod: {
      _func: args => {
        const p1 = toNumber(args[0]);
        const p2 = toNumber(args[1]);
        return p1 % p2;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Returns the month of a date represented by a serial number.
     * The month is given as an integer, ranging from 1 (January) to 12 (December).
     * @param {number} The date for which the month is to be returned.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @return {number}
     * @function month
     * @category openFormula
     * @example
     * month(datetime(2008,5,23)) //returns 5
     */
    month: {
      _func: args => {
        const date = toNumber(args[0]);
        const jsDate = new Date(date * MS_IN_DAY);
        // javascript months start from 0ß
        return jsDate.getMonth() + 1;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Compute logical NOT of a `value`. If the parameter is not boolean it will be cast to boolean
     * as per the following rules
     * * null -> false
     * * number -> false if the number is 0, true otherwise
     * * string -> false if the string is empty, true otherwise. String "false" resolves to true
     * * array -> true
     * * object -> true
     * Note that it is also possible to use the logical and operator: `A && B`
     * @param {any} value - any data type
     * @returns {boolean} The logical NOT applied to the input parameter
     * @example
     * not(length('bar') > 0) // returns false
     * @example
     * not(false()) // returns true
     * @example
     * not('abcd') // returns false
     * @example
     * not('') // returns true
     * @function
     * @category openFormula
     */
    not: {
      _func: resolveArgs => !valueOf(resolveArgs[0]),
      _signature: [{ types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY] }],
    },

    /**
     * returns the time since epoch with days as exponent and time of day as fraction
     * @return {number} representation of current time as a number
     * @function now
     * @category openFormula
     */
    now: {
      _func: () => Date.now() / MS_IN_DAY,
      _signature: [],
    },

    /**
     * Return constant null value.
     * Note that expressions may also use the JSON literal null: `` `null` ``
     * @returns {boolean} True
     * @function
     * @category JSONFormula
     */
    null: {
      _func: () => null,
      _signature: [],
    },

    /**
     * Returns the logical OR result of two parameters.
     * If the parameters are not boolean they will be cast to boolean as per the following rules
     * * null -> false
     * * number -> false if the number is 0, true otherwise
     * * string -> false if the string is empty, true otherwise. String "false" resolves to true
     * * array -> true
     * * object -> true
     * @param {any} first logical expression
     * @param {...any} [operand] any number of additional expressions
     * @returns {boolean} The logical result of applying OR to all parameters
     * @example
     * or((x / 2) == y, (y * 2) == x)
     * // true
     * @function
     * @category openFormula
     */
    or: {
      _func: resolvedArgs => {
        let result = !!valueOf(resolvedArgs[0]);
        resolvedArgs.slice(1).forEach(arg => {
          result = result || !!valueOf(arg);
        });
        return result;
      },
      _signature: [{ types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ANY], variadic: true }],
    },

    /**
     * Computes `a` raised to a power `x`. (a<sup>x</sup>)
     * @param {number} a The base number. It can be any real number.
     * @param {number} x The exponent to which the base number is raised.
     * @return {number}
     * @function power
     * @category openFormula
     * @example
     * power(10, 2) //returns 100 (10 raised to power 2)
     */
    power: {
      _func: args => {
        const base = toNumber(args[0]);
        const power = toNumber(args[1]);
        return base ** power;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Return the input string with the first letter of each word converted to an
     * uppercase letter and the rest of the letters in the word converted to lowercase.
     * @param {string} text the text to partially capitalize.
     * @returns {string}
     * @function proper
     * @category openFormula
     * @example
     * proper('this is a TITLE') //returns 'This Is A Title'
     * @example
     * proper('2-way street') //returns '2-Way Street'
     * @example
     * proper('76BudGet') //returns '76Budget'
     */
    proper: {
      _func: args => {
        const text = toString(args[0]);
        const words = text.split(' ');
        const properWords = words.map(word => word.charAt(0).toUpperCase()
            + word.slice(1).toLowerCase());
        return properWords.join(' ');
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Returns text where an old text is substituted at a given start position and
     * length, with a new text.
     * @param {string} text original text
     * @param {number} start index in the original text from where to begin the replacement.
     * @param {number} length number of characters to be replaced
     * @param {string} replacement string to replace at the start index
     * @returns {string}
     * @function replace
     * @category openFormula
     * @example
     * replace('abcdefghijk', 6, 5, '*') //returns abcde*k
     * @example
     * replace('2009',3,2,'10') //returns  2010
     * @example
     * replace('123456',1,3,'@') //returns @456
     */
    replace: {
      _func: args => {
        const oldText = toString(args[0]);
        const startNum = toNumber(args[1]);
        const numChars = toNumber(args[2]);
        const newText = toString(args[3]);
        if (startNum < 0) {
          return null;
        }

        const lhs = oldText.substr(0, startNum);
        const rhs = oldText.substr(startNum + numChars);
        return lhs + newText + rhs;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Return text repeated Count times.
     * @param {string} text text to repeat
     * @param {number} count number of times to repeat the text
     * @returns {string}
     * @function rept
     * @category openFormula
     * @example
     * rept('x', 5) //returns 'xxxxx'
     */
    rept: {
      _func: args => {
        const text = toString(args[0]);
        const count = toNumber(args[1]);
        if (count < 0) {
          return null;
        }
        return text.repeat(count);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Return a selected number of text characters from the right of a `subject` or
     * in case of array selected number of elements from the end of `subject` array
     * Returns null if the number of elements is less than 0
     * @param {string|array} subject The text/array containing the characters/elements to extract.
     * @param {number} [elements] number of elements to pick. Defaults to 1
     * @return {string|array}
     * @function right
     * @category openFormula
     * @example
     * right('Sale Price', 4) //returns 'rice'
     * @example
     * left('Sweden') // returns 'n'
     * @example
     * left([4, 5, 6], 2) // returns [5, 6]
     */
    right: {
      _func: args => {
        const numEntries = args.length > 1 ? toNumber(args[1]) : 1;
        if (numEntries < 0) return null;
        if (args[0] instanceof Array) {
          if (numEntries === 0) return [];
          return args[0].slice(numEntries * -1);
        }
        const text = toString(args[0]);
        const start = text.length - numEntries;
        return text.substr(start, numEntries);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * Round a number to a specified `precision`.
     * ### Remarks
     * * If `precision` is greater than zero, round to the specified number of decimal places.
     * * If `precision` is 0, round to the nearest integer.
     * * If `precision` is less than 0, round to the left of the decimal point.
     * @param {number} num number to round off
     * @param {number} precision number is rounded to the specified precision.
     * @returns {number}
     * @function round
     * @category openFormula
     * @example
     * round(2.15, 1) //returns 2.2
     * @example
     * round(626.3,-3) //returns 1000 (Rounds 626.3 to the nearest multiple of 1000)
     * @example
     * round(626.3, 0) //returns 626
     * @example
     * round(1.98,-1) //returns 0 (Rounds 1.98 to the nearest multiple of 10)
     * @example
     * round(-50.55,-2) // -100 (round -50.55 to the nearest multiple of 100)
     */
    round: {
      _func: args => {
        const number = toNumber(args[0]);
        const digits = toNumber(args[1]);
        return round(number, digits);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Perform a wildcard search.  The search is case-sensitive and supports two forms of wildcards:
     * "*" finds a a sequence of characters and "?" finds a single character.
     * To use "*" or "?" as text values, precede them with a tilde ("~") character.
     * Note that the wildcard search is not greedy.
     * e.g. search('a*b', 'abb') will return [0, 'ab'] Not [0, 'abb']
     * @param {string} findText the search string -- which may include wild cards.
     * @param {string} withinText The string to search.
     * @param {integer} startPos The zero-based position of withinText to start searching.
     * Defaults to zero.
     * @returns {array} returns an array with two values:
     * The start position of the found text and the text string that was found.
     * If a match was not found, an empty array is returned.
     * @function search
     * @category openFormula
     * @example
     * search('a?c', 'acabc') //returns [2, 'abc']
     */
    search: {
      _func: args => {
        const findText = toString(args[0]);
        const withinText = toString(args[1]);
        const startPos = toNumber(args[2]);
        if (findText === null || withinText === null || withinText.length === 0) return [];
        // escape all characters that would otherwise create a regular expression
        const reString = findText.replace(/([[.\\^$()+{])/g, '\\$1')
          // add the single character wildcard
          .replace(/~?\?/g, match => match === '~?' ? '\\?' : '.')
          // add the multi-character wildcard
          .replace(/~?\*/g, match => match === '~*' ? '\\*' : '.*?')
          // get rid of the escape characters
          .replace(/~~/g, '~');
        const re = new RegExp(reString);
        const result = withinText.substring(startPos).match(re);
        if (result === null) return [];
        return [result.index + startPos, result[0]];
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],

    },
    /**
     * Extract the second (0 through 59) from a time/datetime representation
     * @param {number} The datetime/time for which the second is to be returned.
     * Dates should be specified using the [datetime]{@link datetime} or [time]{@link time} function
     * @return {number}
     * @function second
     * @category openFormula
     * @example
     * second(datetime(2008,5,23,12, 10, 53)) //returns 53
     * second(time(12, 10, 53)) //returns 53
     */
    second: {
      _func: args => {
        const time = toNumber(args[0]) % 1;
        if (time < 0) {
          return null;
        }

        // Normally we'd round to 15 digits, but since we're also multiplying by 86400,
        // a reasonable precision is around 10 digits.
        const seconds = round(time * 86400, 10);
        return Math.floor(seconds % 60);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * split a string into an array, given a separator
     * @param {string} string string to split
     * @param {string} separator separator where the split should occur
     * @return {string[]}
     * @function split
     * @category openFormula
     * @example
     * split('abcdef', '') //returns ['a', 'b', 'c', 'd', 'e', 'f']
     * @example
     * split('abcdef', 'e') //returns ['abcd', 'f']
     */
    split: {
      _func: args => {
        const str = toString(args[0]);
        const separator = toString(args[1]);
        return str.split(separator);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Return the square root of a number
     * @param {number} num number whose square root has to be calculated
     * @return {number}
     * @function sqrt
     * @category openFormula
     * @example
     * sqrt(4) //returns 2
     */
    sqrt: {
      _func: args => {
        const result = Math.sqrt(toNumber(args[0]));
        if (Number.isNaN(result)) {
          return null;
        }
        return result;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Estimates standard deviation based on a sample.
     * `stdev` assumes that its arguments are a sample of the entire population.
     * If your data represents a entire population,
     * then compute the standard deviation using [stdevp]{@link stdevp}.
     * @param {number[]} numbers The array of numbers comprising the population
     * @returns {number}
     * @category openFormula
     * @function stdev
     * @example
     * stdev([1345, 1301, 1368]) //returns 34.044089061098404
     * stdevp([1345, 1301, 1368]) //returns 27.797
     */
    stdev: {
      _func: args => {
        const values = args[0] || [];
        if (values.length <= 1) {
          return null;
        }
        const coercedValues = values.map(value => toNumber(value));
        const mean = coercedValues.reduce((a, b) => a + b, 0) / values.length;
        const sumSquare = coercedValues.reduce((a, b) => a + b * b, 0);
        const result = Math.sqrt((sumSquare - values.length * mean * mean) / (values.length - 1));
        if (Number.isNaN(result)) {
          // this would never happen
          return null;
        }
        return result;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY_NUMBER] },
      ],
    },

    /**
     * Calculates standard deviation based on the entire population given as arguments.
     * `stdevp` assumes that its arguments are the entire population.
     * If your data represents a sample of the population,
     * then compute the standard deviation using [stdev]{@link stdev}.
     * @param {number[]} numbers The array of numbers comprising the population
     * @returns {number}
     * @category openFormula
     * @function stdevp
     * @example
     * stdevp([1345, 1301, 1368]) //returns 27.797
     * stdev([1345, 1301, 1368]) //returns 34.044
     */
    stdevp: {
      _func: args => {
        const values = args[0] || [];
        if (values.length === 0) {
          return null;
        }
        const coercedValues = values.map(value => toNumber(value));
        const mean = coercedValues.reduce((a, b) => a + b, 0) / values.length;
        const meanSumSquare = coercedValues.reduce((a, b) => a + b * b, 0) / values.length;
        const result = Math.sqrt(meanSumSquare - mean * mean);
        if (Number.isNaN(result)) {
          // this would never happen
          return null;
        }
        return result;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY_NUMBER] },
      ],
    },

    /**
     * Returns input `text`, with text `old` replaced by text `new` (when searching from the left).
     * If `which` parameter is omitted, every occurrence of `old` is replaced with `new`;
     * If `which` is provided, only that occurrence of `old` is replaced by `new`
     * (starting the count from 1).
     * If there is no match, or if `old` has length 0, `text` is returned unchanged.
     * Note that `old` and `new` may have different lengths. If `which` < 1, return `text` unchanged
     * @param {string} text The text for which to substitute characters.
     * @param {string} old The text to replace.
     * @param {string} new The text to replace `old` with.
     * @param {integer} [which] The one-based occurrence of `old` text to replace with `new` text.
     * @returns {string} replaced string
     * @function
     * @category openFormula
     * @example
     * substitute('Sales Data', 'Sales', 'Cost') //returns 'Cost Data'
     * @example
     * substitute('Quarter 1, 2008', '1', '2', 1) //returns 'Quarter 2, 2008'
     * @example
     * substitute('Quarter 1, 1008', '1', '2', 2) //returns 'Quarter 1, 2008'
     */
    substitute: {
      _func: args => {
        const src = toString(args[0]);
        const old = toString(args[1]);
        const replacement = toString(args[2]);
        // no third parameter? replace all instances
        if (args.length <= 3) return src.replaceAll(old, replacement);
        const whch = toNumber(args[3]);
        if (whch < 1) return src;
        // find the instance to replace
        let pos = -1;
        for (let i = 0; i < whch; i += 1) {
          pos += 1;
          const nextFind = src.slice(pos).indexOf(old);
          // no instance to match 'Which'
          if (nextFind === -1) return src;
          pos += nextFind;
        }
        return src.slice(0, pos) + src.slice(pos).replace(old, replacement);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * Construct and returns time from hours, minutes, and seconds.
     * @param {integer} hours Integer value between 0 and 23 representing the hour of the day.
     * Defaults to 0.
     * @param {integer} minutes Integer value representing the minute segment of a time.
     * The default is 0 minutes past the hour.
     * @param {integer} seconds Integer value representing the second segment of a time.
     * The default is 0 seconds past the minute.
     * @return {number} Returns the fraction of the day consumed by the given time
     * @function time
     * @category openFormula
     * @example
     * time(12, 0, 0) //returns 0.5 (half day)
     */
    time: {
      _func: args => {
        const hours = toNumber(args[0]);
        const minutes = toNumber(args[1]);
        const seconds = toNumber(args[2]);
        const time = (hours * 3600 + minutes * 60 + seconds) / 86400;
        if (time < 0) {
          return null;
        }
        return time - Math.floor(time);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * returns the number of days since epoch
     * @return number
     * @function today
     * @category openFormula
     */
    today: {
      _func: () => Math.floor(Date.now() / MS_IN_DAY),
      _signature: [],
    },

    /**
     * Remove leading and trailing spaces, and replace all internal multiple spaces
     * with a single space.
     * @param {string} text string to trim
     * @return {string} removes all leading and trailing space.
     * Any other sequence of 2 or more spaces is replaced with a single space.
     * @function trim
     * @category openFormula
     * @example
     * trim('   ab    c   ') //returns 'ab c'
     */
    trim: {
      _func: args => {
        const text = toString(args[0]);
        // only removes the space character
        // other whitespace characters like \t \n left intact
        return text.split(' ').filter(x => x).join(' ');
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Return constant boolean true value.
     * Note that expressions may also use the JSON literal true: `` `true` ``
     * @returns {boolean} True
     * @function
     * @category openFormula
     */
    true: {
      _func: () => true,
      _signature: [],
    },

    /**
     * Truncates a number to an integer by removing the fractional part of the number.
     * @param {number} numA number to truncate
     * @param {number} [numB] A number specifying the precision of the truncation. Default is 0
     * @return {number}
     * @function trunc
     * @category openFormula
     * @example
     * trunc(8.9) //returns 8
     * trunc(-8.9) //returns -8
     * trunc(8.912, 2) //returns 8.91
     */
    trunc: {
      _func: args => {
        const number = toNumber(args[0]);
        const digits = args.length > 1 ? toNumber(args[1]) : 0;
        const method = number >= 0 ? Math.floor : Math.ceil;
        return method(number * 10 ** digits) / 10 ** digits;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * takes an array and returns unique elements within it
     * @param {array} input input array
     * @return {array} array with duplicate elements removed
     * @function unique
     * @category JSONFormula
     * @example
     * unique([1, 2, 3, 4, 1, 1, 2]) //returns [1, 2, 3, 4]
     */
    unique: {
      _func: args => {
        // create an array of values for searching.  That way if the array elements are
        // represented by objects with a valueOf(), then we'll locate them in the valueArray
        const valueArray = args[0].map(a => valueOf(a));
        return args[0].filter((v, index) => valueArray.indexOf(valueOf(v)) === index);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY] },
      ],
    },

    /**
     * Converts all the alphabetic characters in a string to uppercase.
     * If the value is not a string it will be converted into string
     * using the default toString method
     * @param {string} input input string
     * @returns {string} the upper case value of the input string
     * @function upper
     * @category openFormula
     * @example
     * upper('abcd') //returns 'ABCD'
     */
    upper: {
      _func: args => {
        const value = toString(args[0]);
        return value.toUpperCase();
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    /**
     * Perform an indexed lookup on a map or array
     * @param {map | array} object on which to perform the lookup
     * @param {string | integer} index: a named child for a map or an integer offset for an array
     * @returns {any} the result of the lookup -- or `null` if not found.
     * @function
     * @category JSONFormula
     * @example
     * value({a: 1, b:2, c:3}, a) //returns 1
     * @example
     * value([1, 2, 3, 4], 2) //returns 3
     */
    value: {
      _func: args => {
        const obj = args[0] || {};
        const index = args[1];
        const result = obj[index];
        if (result === undefined) {
          debug.push(`Failed to find: '${index}'`);
          const available = Object.keys(obj).map(a => `'${a}'`).toString();
          if (available.length) debug.push(`Available fields: ${available}`);

          return null;
        }
        return result;
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_OBJECT, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_ARRAY, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NULL] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING, _dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    /**
     * Extract the day of the week from a date; if text, uses current locale to convert to a date.
     * @param {number} The datetime for which the day of the week is to be returned.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @param {number} [returnType] A number that determines the
     * numeral representation (a number from 0 to 7) of the
     * day of week. Default is 1. Supports the following values
     * * 1 : Sunday (1), Monday (2), ..., Saturday (7)
     * * 2 : Monday (1), Tuesday (2), ..., Sunday(7)
     * * 3 : Monday (0), Tuesday (2), ...., Sunday(6)
     * @returns {number} day of the week
     * @function weekday
     * @category openFormula
     * @example
     * weekday(datetime(2006,5,21)) // 1
     * @example
     * weekday(datetime(2006,5,21), 2) // 7
     * @example
     * weekday(datetime(2006,5,21), 3) // 6
     */
    weekday: {
      _func: args => {
        const date = toNumber(args[0]);
        const type = args.length > 1 ? toNumber(args[1]) : 1;
        const jsDate = new Date(date * MS_IN_DAY);
        const day = jsDate.getDay();
        // day is in range [0-7) with 0 mapping to sunday
        switch (type) {
          case 1:
            // range = [1, 7], sunday = 1
            return day + 1;
          case 2:
            // range = [1, 7] sunday = 7
            return ((day + 6) % 7) + 1;
          case 3:
            // range = [0, 6] sunday = 6
            return (day + 6) % 7;
          default:
            return null;
        }
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER], optional: true },
      ],
    },

    /**
     * Returns the year of a date represented by a serial number.
     * @param {number} The date for which the year is to be returned.
     * Dates should be entered by using the [datetime]{@link datetime} function
     * @return {number}
     * @function year
     * @category openFormula
     * @example
     * year(datetime(2008,5,23)) //returns 2008
     */
    year: {
      _func: args => {
        const date = toNumber(args[0]);
        const jsDate = new Date(date * MS_IN_DAY);
        return jsDate.getFullYear();
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    charCode: {
      _func: args => {
        const code = toNumber(args[0]);
        if (!Number.isInteger(code)) {
          return null;
        }
        return String.fromCharCode(code);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_NUMBER] },
      ],
    },

    codePoint: {
      _func: args => {
        const text = toString(args[0]);
        if (text.length === 0) {
          return null;
        }
        return text.codePointAt(0);
      },
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    encodeUrlComponent: {
      _func: args => encodeURIComponent(args[0]),
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    encodeUrl: {
      _func: args => encodeURI(args[0]),
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    decodeUrlComponent: {
      _func: args => decodeURIComponent(args[0]),
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },

    decodeUrl: {
      _func: args => decodeURI(args[0]),
      _signature: [
        { types: [_dataTypes_js__WEBPACK_IMPORTED_MODULE_0__["default"].TYPE_STRING] },
      ],
    },
  };
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/tokenDefinitions.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  TOK_EOF: 'EOF',
  TOK_UNQUOTEDIDENTIFIER: 'UnquotedIdentifier',
  TOK_QUOTEDIDENTIFIER: 'QuotedIdentifier',
  TOK_RBRACKET: 'Rbracket',
  TOK_RPAREN: 'Rparen',
  TOK_COMMA: 'Comma',
  TOK_COLON: 'Colon',
  TOK_CONCATENATE: 'Concatenate',
  TOK_RBRACE: 'Rbrace',
  TOK_NUMBER: 'Number',
  TOK_CURRENT: 'Current',
  TOK_GLOBAL: 'Global',
  TOK_FIELD: 'Field',
  TOK_EXPREF: 'Expref',
  TOK_PIPE: 'Pipe',
  TOK_OR: 'Or',
  TOK_AND: 'And',
  TOK_ADD: 'Add',
  TOK_SUBTRACT: 'Subtract',
  TOK_UNARY_MINUS: 'UnaryMinus',
  TOK_MULTIPLY: 'Multiply',
  TOK_POWER: 'Power',
  TOK_UNION: 'Union',
  TOK_DIVIDE: 'Divide',
  TOK_EQ: 'EQ',
  TOK_GT: 'GT',
  TOK_LT: 'LT',
  TOK_GTE: 'GTE',
  TOK_LTE: 'LTE',
  TOK_NE: 'NE',
  TOK_FLATTEN: 'Flatten',
  TOK_STAR: 'Star',
  TOK_FILTER: 'Filter',
  TOK_DOT: 'Dot',
  TOK_NOT: 'Not',
  TOK_LBRACE: 'Lbrace',
  TOK_LBRACKET: 'Lbracket',
  TOK_LPAREN: 'Lparen',
  TOK_LITERAL: 'Literal',
});


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/jmespath/utils.js":
/*!****************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/jmespath/utils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getValueOf: () => (/* binding */ getValueOf),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   strictDeepEqual: () => (/* binding */ strictDeepEqual)
/* harmony export */ });
function isArray(obj) {
  if (obj !== null) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
  return false;
}

function isObject(obj) {
  if (obj !== null) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  return false;
}

function getValueOf(a) {
  if (a === null || a === undefined) return a;
  if (isArray(a)) {
    return a.map(i => getValueOf(i));
  }
  // if we have a child named 'valueOf' then we're an object,
  // and just return the object.
  if (typeof (a.valueOf) !== 'function') return a;
  return a.valueOf();
}

function strictDeepEqual(lhs, rhs) {
  const first = getValueOf(lhs);
  const second = getValueOf(rhs);
  // Check the scalar case first.
  if (first === second) {
    return true;
  }

  // Check if they are the same type.
  const firstType = Object.prototype.toString.call(first);
  if (firstType !== Object.prototype.toString.call(second)) {
    return false;
  }
  // We know that first and second have the same type so we can just check the
  // first type from now on.
  if (isArray(first) === true) {
    // Short circuit if they're not the same length;
    if (first.length !== second.length) {
      return false;
    }
    for (let i = 0; i < first.length; i += 1) {
      if (strictDeepEqual(first[i], second[i]) === false) {
        return false;
      }
    }
    return true;
  }
  if (isObject(first) === true) {
    // An object is equal if it has the same key/value pairs.
    const keysSeen = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in first) {
      if (hasOwnProperty.call(first, key)) {
        if (strictDeepEqual(first[key], second[key]) === false) {
          return false;
        }
        keysSeen[key] = true;
      }
    }
    // Now check that there aren't any keys in second that weren't
    // in first.
    // eslint-disable-next-line no-restricted-syntax
    for (const key2 in second) {
      if (hasOwnProperty.call(second, key2)) {
        if (keysSeen[key2] !== true) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}


/***/ }),

/***/ "./node_modules/@adobe/json-formula/src/json-formula.js":
/*!**************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/src/json-formula.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JsonFormula),
/* harmony export */   jsonFormula: () => (/* binding */ jsonFormula)
/* harmony export */ });
/* harmony import */ var _jmespath_jmespath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jmespath/jmespath.js */ "./node_modules/@adobe/json-formula/src/jmespath/jmespath.js");
/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/


/**
 * Returns an instance of JSON JsonFormula Expression that can be executed later on with
 * multiple instances of JSON Data. The instance of the class has a single search
 * function that can be used to evaluate the expression on a json payload. The advantage
 * of using this over {jsonJsonFormula} function is that it can be performant if a single expression
 * has to be used for multiple json data instances.
 */
class JsonFormula {
  /**
   * @param customFunctions {*} custom functions needed by a hosting application.
   * @param stringToNumber {function} A function that converts string values to numbers.
   * Can be used to convert currencies/dates to numbers
   * @param language
   * @param debug {array} will be populated with any errors/warnings
   */
  constructor(
    customFunctions = {},
    stringToNumber = null,
    debug = [],
  ) {
    this.customFunctions = { ...customFunctions };
    this.stringToNumber = stringToNumber;
    this.debug = debug;
    this.formula = new _jmespath_jmespath_js__WEBPACK_IMPORTED_MODULE_0__["default"](debug, customFunctions, stringToNumber);
  }

  /**
   * Evaluates the JsonFormula on a particular json payload and return the result
   * @param json {object} the json data on which the expression needs to be evaluated
   * @param globals {*} global objects that can be accessed via custom functions.
   * @returns {*} the result of the expression being evaluated
   */
  search(expression, json, globals = {}, language = 'en-US') {
    const ast = this.compile(expression, Object.keys(globals));
    return this.run(ast, json, language, globals);
  }

  /**
   * Execute a previously compiled expression against a json object and return the result
   * @param ast {object} The abstract syntax tree returned from compile()
   * @param json {object} the json data on which the expression needs to be evaluated
   * @param globals {*} set of objects available in global scope
   * @returns {*} the result of the expression being evaluated
   */
  run(ast, json, language, globals) {
    return this.formula.search(
      ast,
      json,
      globals,
      language,
    );
  }

  /*
   * Creates a compiled expression that can be executed later on with some data.
   * @param expression {string} the expression to evaluate
   * @param allowedGlobalNames {string[]} A list of names of the global variables
   * being used in the expression.
   * @param debug {array} will be populated with any errors/warnings
   */
  compile(expression, allowedGlobalNames = []) {
    this.debug.length = 0;
    return this.formula.compile(expression, allowedGlobalNames);
  }
}

function jsonFormula(
  json,
  globals,
  expression,
  customFunctions = {},
  stringToNumber = null,
  debug = [],
  language = 'en-US',
) {
  return new JsonFormula(customFunctions, stringToNumber, debug)
    .search(expression, json, globals, language);
}


/***/ }),

/***/ "./node_modules/@aemforms/af-custom-functions/src/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@aemforms/af-custom-functions/src/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dateToDaysSinceEpoch: () => (/* binding */ dateToDaysSinceEpoch),
/* harmony export */   defaultErrorHandler: () => (/* binding */ defaultErrorHandler),
/* harmony export */   defaultSubmitErrorHandler: () => (/* binding */ defaultSubmitErrorHandler),
/* harmony export */   defaultSubmitSuccessHandler: () => (/* binding */ defaultSubmitSuccessHandler),
/* harmony export */   fetchCaptchaToken: () => (/* binding */ fetchCaptchaToken),
/* harmony export */   navigateTo: () => (/* binding */ navigateTo),
/* harmony export */   toObject: () => (/* binding */ toObject),
/* harmony export */   validateURL: () => (/* binding */ validateURL)
/* harmony export */ });
/**
 * Validates if the given URL is correct.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function validateURL(url) {
    try {
        const validatedUrl = new URL(url, window.location.href);
        return (validatedUrl.protocol === 'http:' || validatedUrl.protocol === 'https:');
    }
    catch (err) {
        return false;
    }
}

/**
 * Converts a JSON string to an object.
 * @param {string} str - The JSON string to convert to an object.
 * @returns {object} - The parsed JSON object. Returns an empty object if an exception occurs.
 * @memberof module:FormView~customFunctions
 */
function toObject(str) {
    if (typeof str === 'string') {
        try {
            return JSON.parse(str);
        } catch (e) {
            return {};
        }
    }
    return str;
}


/**
 * Navigates to the specified URL.
 * @param {string} destinationURL - The URL to navigate to. If not specified, a new blank window will be opened.
 * @param {string} destinationType - The type of destination. Supports the following values: "_newwindow", "_blank", "_parent", "_self", "_top", or the name of the window.
 * @returns {Window} - The newly opened window.
 */
function navigateTo(destinationURL, destinationType) {
    let param = null,
        windowParam = window,
        arg = null;
    switch (destinationType){
        case "_newwindow":
            param = "_blank";
            arg = "width=1000,height=800";
            break;
    }
    if (!param) {
        if (destinationType) {
            param = destinationType;
        } else {
            param = "_blank";
        }
    }
    if (validateURL(destinationURL)){
        windowParam.open(destinationURL, param, arg);
    }
}

/**
 * Default error handler for the invoke service API.
 * @param {object} response - The response body of the invoke service API.
 * @param {object} headers - The response headers of the invoke service API.
 * @param {scope} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
 * @returns {void}
 */
function defaultErrorHandler(response, headers, globals) {
    if(response && response.validationErrors) {
        response.validationErrors?.forEach(function (violation) {
            if (violation.details) {
                if (violation.fieldName) {
                    globals.functions.markFieldAsInvalid(violation.fieldName, violation.details.join("\n"), {useQualifiedName: true});
                } else if (violation.dataRef) {
                    globals.functions.markFieldAsInvalid(violation.dataRef, violation.details.join("\n"), {useDataRef: true});
                }
            }
        });
    }
}

/**
 * Handles the success response after a form submission.
 *
 * @param {scope} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
 * @returns {void}
 */
function defaultSubmitSuccessHandler(globals) {
    const event = globals.event;
    const submitSuccessResponse = event?.payload?.body;
    const form = globals.form;
    if (submitSuccessResponse) {
        if (submitSuccessResponse.redirectUrl) {
            window.location.href = encodeURI(submitSuccessResponse.redirectUrl);
        } else if (submitSuccessResponse.thankYouMessage) {
            let formContainerElement = document.getElementById(`${form.$id}`);
            let thankYouMessage = document.createElement("div");
            thankYouMessage.setAttribute("class", "tyMessage");
            thankYouMessage.setAttribute("tabindex", "-1");
            thankYouMessage.setAttribute("role","alertdialog");
            thankYouMessage.innerHTML = submitSuccessResponse.thankYouMessage;
            formContainerElement.replaceWith(thankYouMessage);
            thankYouMessage.focus();
        }
    }
}

/**
 * Handles the error response after a form submission.
 *
 * @param {string} defaultSubmitErrorMessage - The default error message.
 * @param {scope} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
 * @returns {void}
 */
function defaultSubmitErrorHandler(defaultSubmitErrorMessage, globals) {
    // view layer should send localized error message here
    window.alert(defaultSubmitErrorMessage);
}

/**
 * Fetches the captcha token for the form.
 *
 * This function uses the Google reCAPTCHA Enterprise/turnstile service to fetch the captcha token.
 *
 * @async
 * @param {object} globals - An object containing read-only form instance, read-only target field instance and methods for form modifications.
 * @returns {string} - The captcha token.
 */
async function fetchCaptchaToken(globals) {
    return new Promise((resolve, reject) => {
        // successCallback and errorCallback can be reused for different captcha implementations
        const successCallback = function(token) {
            resolve(token);
        };

        const errorCallback = function(error) {
            reject(error);
        };

        try{
            const captcha = globals.form.$captcha;
            if (captcha.$captchaProvider === "turnstile") {
                const turnstileContainer = document.getElementsByClassName("cmp-adaptiveform-turnstile__widget")[0];
                const turnstileParameters = {
                    'sitekey': captcha.$captchaSiteKey,
                    'callback': successCallback,
                    'error-callback': errorCallback
                }
                if(turnstile != undefined) {
                    const widgetId = turnstile.render(turnstileContainer, turnstileParameters);
                    if (widgetId) {
                        turnstile.execute(widgetId);
                    } else {
                        reject({error: "Failed to render turnstile captcha"});
                    }
                } else {
                    reject({error: "Turnstile captcha not loaded"});
                }
            } else {
                const siteKey = captcha?.$properties['fd:captcha']?.config?.siteKey;
                const captchaElementName = captcha.$name.replaceAll('-', '_');
                let captchaPath = captcha?.$properties['fd:path'];
                const index = captchaPath.indexOf('/jcr:content');
                let formName = '';
                if (index > 0) {
                    captchaPath = captchaPath.substring(0, index);
                    formName = captchaPath.substring(captchaPath.lastIndexOf("/") + 1).replaceAll('-', '_');
                }
                let actionName = `submit_${formName}_${captchaElementName}`;
                grecaptcha.enterprise.ready(() => {
                    grecaptcha.enterprise.execute(siteKey, {action: actionName})
                        .then((token) => resolve(token))
                        .catch((error) => reject(error));
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Converts a date to the number of days since the Unix epoch (1970-01-01).
 * 
 * If the input date is a number, it is assumed to represent the number of days since the epoch, 
 * including both integer and decimal parts. In this case, only the integer part is returned as the number of days.
 * 
 * @param {string|Date|number} date - The date to convert. 
 * Can be:
 * - An ISO string (yyyy-mm-dd)
 * - A Date object
 * - A number representing the days since the epoch, where the integer part is the number of days and the decimal part is the fraction of the day
 * 
 * @returns {number} - The number of days since the Unix epoch
 */
function dateToDaysSinceEpoch(date) {
    let dateObj;
    if (typeof date === 'string') {
        dateObj = new Date(date); 
    } else if (typeof date === 'number') {
        return Math.floor(date);
    } else if (date instanceof Date) {
        dateObj = date;
    } else {
        throw new Error('Invalid date input');
    }

    // Validate that date is valid after parsing
    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date input');
    }
    return Math.floor(dateObj.getTime() / (1000 * 60 * 60 * 24));
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Actions: () => (/* binding */ Actions),
/* harmony export */   Constants: () => (/* reexport safe */ _constants_js__WEBPACK_IMPORTED_MODULE_4__.Constants),
/* harmony export */   FileAttachmentUtils: () => (/* binding */ FileAttachmentUtils),
/* harmony export */   FormCheckBox: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormCheckBox),
/* harmony export */   FormContainer: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormContainer),
/* harmony export */   FormField: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormField),
/* harmony export */   FormFieldBase: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormFieldBase),
/* harmony export */   FormFileInput: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormFileInput),
/* harmony export */   FormFileInputWidget: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormFileInputWidget),
/* harmony export */   FormFileInputWidgetBase: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormFileInputWidgetBase),
/* harmony export */   FormOptionFieldBase: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormOptionFieldBase),
/* harmony export */   FormPanel: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormPanel),
/* harmony export */   FormTabs: () => (/* reexport safe */ _view_index_js__WEBPACK_IMPORTED_MODULE_3__.FormTabs),
/* harmony export */   Formatters: () => (/* binding */ Formatters),
/* harmony export */   FunctionRuntime: () => (/* reexport safe */ _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.FunctionRuntime),
/* harmony export */   HTTPAPILayer: () => (/* reexport safe */ _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   LanguageUtils: () => (/* reexport safe */ _LanguageUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   Utils: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   createFormInstance: () => (/* reexport safe */ _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.createFormInstance),
/* harmony export */   customFunctions: () => (/* reexport safe */ _customFunctions__WEBPACK_IMPORTED_MODULE_8__.customFunctions)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _LanguageUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LanguageUtils.js */ "./src/LanguageUtils.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core-xfa/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _view_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/index.js */ "./src/view/index.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants.js */ "./src/constants.js");
/* harmony import */ var _GuideBridge_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./GuideBridge.js */ "./src/GuideBridge.js");
/* harmony import */ var _HTTPAPILayer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./HTTPAPILayer.js */ "./src/HTTPAPILayer.js");
/* harmony import */ var _aemforms_af_formatters__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @aemforms/af-formatters */ "./node_modules/@aemforms/af-formatters/lib/index.js");
/* harmony import */ var _customFunctions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./customFunctions */ "./src/customFunctions.js");
/*******************************************************************************
 * Copyright 2022 Adobe
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











/**
 * The `FormView` module provides access to all the helper functions and exposes
 * the form model defined by the core runtime model.
 *
 * @module FormView
 */

/**
 * The `guideBridge` object represents the GuideBridge instance.
 * @type {GuideBridge}
 */
window.guideBridge = new _GuideBridge_js__WEBPACK_IMPORTED_MODULE_5__["default"]();

/**
 * The `Actions` object contains predefined action constants.
 * @type {object}
 * @property {string} Click - The action for a click event.
 * @property {string} Change - The action for a change event.
 * @property {string} Submit - The action for a submit event.
 * @property {string} Blur - The action for a blur event.
 * @property {string} AddItem - The action for adding an item.
 * @property {string} RemoveItem - The action for removing an item.
 * @property {string} Save - The action for save event.
 */
const Actions = {
    Click: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.Click, Change: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.Change, Submit: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.Submit, Blur: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.Blur, AddItem: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.AddItem, RemoveItem: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.RemoveItem, UIChange: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.UIChange, Save: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.Save, CustomEvent: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.CustomEvent
}

/**
 * The `Formatters` object contains predefined formatter functions.
 * @type {object}
 * @property {function} formatDate - The function for formatting a date.
 * @property {function} parseDate - The function for parsing a date.
 */
const Formatters = {
    formatDate: _aemforms_af_formatters__WEBPACK_IMPORTED_MODULE_7__.formatDate, parseDate: _aemforms_af_formatters__WEBPACK_IMPORTED_MODULE_7__.parseDate
}

/**
 * The `FileAttachmentUtils` object provides utility functions for file attachments.
 * @type {object}
 * @property {function} FileObject - The constructor function for a file object.
 * @property {function} extractFileInfo - The function for extracting file information.
 */
const FileAttachmentUtils = {
    FileObject: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.FileObject, extractFileInfo: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.extractFileInfo, readAttachments: _aemforms_af_core__WEBPACK_IMPORTED_MODULE_2__.readAttachments
};

/**
 * The `createFormInstance` function creates a new form instance.
 * @function createFormInstance
 * @returns {object} - The created form instance.
 */




})();

window.FormView = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=/libs/core/fd/clientlibs/core-forms-components-runtime-xfa/resources/main.js.map