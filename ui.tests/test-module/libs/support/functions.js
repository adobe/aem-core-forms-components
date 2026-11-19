/*
 *  Copyright 2021 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// global functions
cy.af = {
    getEditorUrl : (pagePath) => {
        return (Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "") + "/editor.html" + pagePath + ".html"
    },

    isLatestAddon : () => {
        // if not defined always return true for local execution to pass
        return Cypress.env("forms.far") == null || Cypress.env("forms.far") === "classic-latest" || Cypress.env("forms.far") === "classic-latest-cp";
    },

    isLatestAddonWithContextPath : () => {
        // if not defined always return true for local execution to pass
        return Cypress.env("forms.far") === "classic-latest-cp";
    },

    isLtsAddon : () => {
        // True only on the 6.6.0/LTS add-on line (6.1.x -> forms.far "classic-lts").
        // Use this for features that ship only on LTS (e.g. EDS form creation), which are
        // absent from the 6.5 line ("classic"/"classic-latest"). Undefined => local run.
        return Cypress.env("forms.far") == null || Cypress.env("forms.far") === "classic-lts";
    },

    isReleasedAddon : () => {
        // if not defined always return true for local execution to pass
        return Cypress.env("forms.far") == null || Cypress.env("forms.far") === "classic";
    },

    getFormJsonUrl : (pagePath) => {
        return (Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "") + pagePath + ".model.json"
    }
};
