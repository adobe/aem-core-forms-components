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

import {createFormInstance} from '@aemforms/af-core';
import {registerFormWebMCP} from '@aemforms/af-webmcp';
import Utils from '../src/utils';

describe('published WebMCP runtime integration', () => {
    let unregister;
    let tools;
    let handles;
    let host;
    let rum;

    beforeEach(() => {
        tools = new Map();
        handles = [];
        host = {registerTool: jest.fn(tool => {
            tools.set(tool.name, tool);
            const handle = {unregister: jest.fn(() => tools.delete(tool.name))};
            handles.push(handle);
            return handle;
        })};
        document.modelContext = host;
        rum = jest.fn();
        window.hlx = {sampleRUM: rum};
    });

    afterEach(() => {
        if (unregister) { unregister(); }
        unregister = undefined;
        delete document.modelContext;
        delete window.hlx;
        document.body.innerHTML = '';
    });

    function form(enabled) {
        return createFormInstance({
            id: 'published-runtime',
            properties: {'fd:webMcpEnabled': enabled},
            items: [{id: 'name', name: 'name', type: 'string', fieldType: 'text-input', value: 'before'}]
        });
    }

    test('registers actual tools, changes values, bridges DOM focus, and cleans up', async () => {
        const model = form(true);
        const input = document.createElement('input');
        document.body.appendChild(input);
        const view = {setFocus: jest.fn(() => input.focus())};
        unregister = registerFormWebMCP(model, Utils.getWebMcpOptions(view));

        expect(tools.get('validate_form_completeness').annotations)
            .toEqual(expect.objectContaining({readOnlyHint: true, untrustedContentHint: true}));
        expect(await tools.get('set_field_value').execute({field: 'name', value: 'after'}))
            .toEqual(expect.objectContaining({success: true, changed: true}));
        expect(model.getElement('name').value).toBe('after');
        expect(rum).toHaveBeenCalledWith('fill', {source: 'af-webmcp', target: 'set_field_value'});
        rum.mockClear();
        await tools.get('set_field_value').execute({field: 'name', value: 'after'});
        expect(rum).not.toHaveBeenCalled();

        expect((await tools.get('focus_field').execute({field: 'name'})).success).toBe(true);
        expect(view.setFocus).toHaveBeenCalledWith('name');
        expect(document.activeElement).toBe(input);
        expect(rum).toHaveBeenCalledWith('click', {source: 'af-webmcp', target: 'focus_field'});

        unregister();
        expect(tools.size).toBe(0);
        handles.forEach(handle => expect(handle.unregister).toHaveBeenCalledTimes(1));
        unregister = undefined;
    });

    test('does not expose tools for a form that did not opt in', () => {
        unregister = registerFormWebMCP(form(false));
        expect(host.registerTool).not.toHaveBeenCalled();
        expect(tools.size).toBe(0);
    });
});
