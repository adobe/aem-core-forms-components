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

// Adapter behavior lives in af-webmcp's suite; these tests cover bootstrap and scoped forwarding.
jest.mock('@aemforms/af-webmcp', () => ({registerFormWebMCP: jest.fn()}), {virtual: true});
jest.mock('../src/HTTPAPILayer.js', () => ({
    __esModule: true,
    default: {getFormDefinition: jest.fn(), getJson: jest.fn()}
}));
jest.mock('../src/RuleUtils.js', () => ({
    __esModule: true,
    default: {registerCustomFunctionsV2: jest.fn(), registerCustomFunctionsByUrl: jest.fn()}
}));

import Utils from '../src/utils';
import FormContainer from '../src/view/FormContainer';
import {registerFormWebMCP} from '@aemforms/af-webmcp';
import HTTPAPILayer from '../src/HTTPAPILayer.js';
import formJson from './resources/form.json';
import GuideBridge from '../src/GuideBridge';
import {Constants} from '../src/constants';

afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
});

test('setupFormContainer registers the WebMCP catalog once with the form model', async () => {
    HTTPAPILayer.getFormDefinition.mockResolvedValue(formJson);
    const unregister = jest.fn();
    registerFormWebMCP.mockReturnValue(unregister);

    const el = document.createElement('div');
    el.classList.add('cmp-adaptiveform-container');
    el.dataset.cmpPath = '/content/a/b/c';
    document.body.appendChild(el);

    let container;
    const createFormContainer = (params) => {
        container = new FormContainer(params);
        return container;
    };

    await Utils.setupFormContainer(createFormContainer, '.cmp-adaptiveform-container', 'adaptiveFormContainer');

    expect(registerFormWebMCP).toHaveBeenCalledTimes(1);
    expect(registerFormWebMCP).toHaveBeenCalledWith(container.getModel());
    expect(container.getModel().id).toBe('/content/a/b/c');
    container._unregisterWebMcp();
    expect(unregister).toHaveBeenCalledTimes(1);
});

test('setupFormContainer preserves pre-initialization and connect callback tools', async () => {
    HTTPAPILayer.getFormDefinition.mockResolvedValue(formJson);
    const unregister = jest.fn();
    const additionalTools = jest.fn();
    const bridge = new GuideBridge();
    const path = '/content/a/b/domain-form';
    bridge.registerWebMcpAdditionalTools(path, additionalTools);
    const replacement = jest.fn();
    bridge.connect(() => bridge.registerWebMcpAdditionalTools(path, replacement), null, path);
    registerFormWebMCP.mockReturnValue(unregister);

    const el = document.createElement('div');
    el.classList.add('cmp-adaptiveform-container');
    el.dataset.cmpPath = '/content/a/b/domain-form';
    document.body.appendChild(el);

    let container;
    const createFormContainer = (params) => {
        container = new FormContainer(params);
        return container;
    };
    await Utils.setupFormContainer(createFormContainer, '.cmp-adaptiveform-container', 'adaptiveFormContainer');
    expect(registerFormWebMCP).toHaveBeenCalledWith(container.getModel(), {additionalTools});
    expect(registerFormWebMCP).toHaveBeenLastCalledWith(container.getModel(), {additionalTools: replacement});
    bridge.unloadAdaptiveForm(path);
});

test('explicit paths isolate two forms and stale disposers cannot remove replacements', () => {
    const bridge = new GuideBridge();
    const first = new FormContainer({_formJson: formJson, _prefillData: {}, _path: '/first', _element: document.createElement('div')});
    const second = new FormContainer({_formJson: formJson, _prefillData: {}, _path: '/second', _element: document.createElement('div')});
    const factory = jest.fn();
    const replacement = jest.fn();
    const dispose = bridge.registerWebMcpAdditionalTools('/first', factory);
    [first, second].forEach(container => {
        container._setWebMcpUnregister(jest.fn());
        document.dispatchEvent(new CustomEvent(Constants.FORM_CONTAINER_INITIALISED, {detail: container}));
    });
    expect(registerFormWebMCP).toHaveBeenCalledTimes(1);
    expect(registerFormWebMCP).toHaveBeenCalledWith(first.getModel(), {additionalTools: factory});
    const remove = bridge.registerWebMcpAdditionalTools('/first', replacement);
    dispose();
    expect(registerFormWebMCP).toHaveBeenCalledTimes(2);
    remove();
    expect(registerFormWebMCP).toHaveBeenLastCalledWith(first.getModel());
    bridge.registerWebMcpAdditionalTools('/second', factory);
    const unregister = jest.fn();
    second._setWebMcpUnregister(unregister);
    bridge.unloadAdaptiveForm('/second');
    expect(unregister).toHaveBeenCalledTimes(1);
    bridge.unloadAdaptiveForm('/first');
    registerFormWebMCP.mockClear();
    document.dispatchEvent(new CustomEvent(Constants.FORM_CONTAINER_INITIALISED, {detail: second}));
    expect(registerFormWebMCP).not.toHaveBeenCalled();
    bridge.unloadAdaptiveForm('/second');
});

test('registration rejects invalid factories and missing explicit targets before changing tools', () => {
    const bridge = new GuideBridge();
    expect(() => bridge.registerWebMcpAdditionalTools('', jest.fn())).toThrow(TypeError);
    expect(() => bridge.registerWebMcpAdditionalTools('/first', {})).toThrow(TypeError);
    expect(() => bridge.registerWebMcpAdditionalTools('/first', undefined)).toThrow(TypeError);
    expect(registerFormWebMCP).not.toHaveBeenCalled();
});

test('scoped configuration preserves the adapter opt-out gate and does not invoke the factory itself', () => {
    const bridge = new GuideBridge();
    const factory = jest.fn();
    const optedOutJson = {...formJson, properties: {...formJson.properties, 'fd:webMcpEnabled': false}};
    const view = new FormContainer({
        _formJson: optedOutJson, _prefillData: {}, _path: '/opted-out', _element: document.createElement('div')
    });
    registerFormWebMCP.mockImplementation((model, options) => {
        if (model.properties['fd:webMcpEnabled'] !== true) { return undefined; }
        options.additionalTools(model);
        return jest.fn();
    });
    bridge.registerWebMcpAdditionalTools('/opted-out', factory);
    document.dispatchEvent(new CustomEvent(Constants.FORM_CONTAINER_INITIALISED, {detail: view}));
    expect(factory).not.toHaveBeenCalled();
    expect(view._webMcpUnregister).toBeNull();
    bridge.unloadAdaptiveForm('/opted-out');
    registerFormWebMCP.mockReset();
});
