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

var formsConstants = {
    components : {
        forms : {
            resourceType : {
                "aemformcontainer" : "/apps/forms-components-examples/components/aemform",
                "formcontainer" : "/apps/forms-components-examples/components/form/container",
                "fplinkcomponent"  : "/apps/forms-components-examples/components/linkcomponent",
                "fpsnlcomponent"  : "/apps/forms-components-examples/components/searchlister",
                "fpdnscomponent"  : "/apps/forms-components-examples/components/draftsandsubmissions",
                "formtextinput": "/apps/forms-components-examples/components/form/textinput",
                "panelcontainer": "/apps/forms-components-examples/components/form/panelcontainer",
                "formtext": "/apps/forms-components-examples/components/form/text",
                "footer": "/apps/forms-components-examples/components/form/footer",
                "datepicker": "/apps/forms-components-examples/components/form/datepicker"
            }
        }
    },
    RESPONSIVE_GRID_DEMO_SUFFIX : "/jcr:content/root/responsivegrid/demo/component",
    FORM_EDITOR_FORM_CONTAINER_SUFFIX : "/jcr:content/guideContainer",
    RESPONSIVE_GRID_SUFFIX : "/jcr:content/root/responsivegrid",
    EVENT_NAME_GUIDE_REFRESH_DONE : "guideRefreshDone.cypress",
    events : {
        LOADING_SHOW : "loading-show.cypress",
        LOADING_HIDE : "loading-hide.cypress",
        DIALOG_READY : "dialog-ready.cypress"
    }
};

module.exports = formsConstants;
