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

// The adapter is exercised in af-webmcp's own suite; here we only assert the CC
// runtime hands the af-core model to WebMCP once per form load.
jest.mock('@aemforms/af-webmcp', () => ({registerFormWebMCP: jest.fn()}));
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

afterEach(() => {
    document.body.innerHTML = '';
    delete window.adaptiveFormsWebMcpAdditionalTools;
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

test('setupFormContainer forwards the domain-specific additionalTools factory', async () => {
    HTTPAPILayer.getFormDefinition.mockResolvedValue(formJson);
    const unregister = jest.fn();
    const additionalTools = jest.fn();
    window.adaptiveFormsWebMcpAdditionalTools = additionalTools;
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
});
