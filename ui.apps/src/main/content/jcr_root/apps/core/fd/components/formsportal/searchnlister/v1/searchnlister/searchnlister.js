/*******************************************************************************
 * Copyright 2021 Adobe
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

// Seperator is created using synthetic resource
// Reference for synthetic resource https://gist.github.com/gabrielwalt/0da85e4855070dc6264652269729eddf

use(function () {
    var clientlibsArr = ['core.forms.components.formsportal.searchnlister.v1'];
    if (this.layout === 'Card') {
        clientlibsArr.push('core.forms.components.formsportal.searchnlister.v1.card');
    }
    return {
        clientlibs: clientlibsArr,
        seperator: {
            resourceName: "seperator",
            "sling:resourceType": "core/wcm/components/separator/v1/separator"
        }
    }
});