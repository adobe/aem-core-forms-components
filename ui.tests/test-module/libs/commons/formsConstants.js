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
                "formtelephoneinput": "/apps/forms-components-examples/components/form/telephoneinput",
                "formemailinput": "/apps/forms-components-examples/components/form/emailinput",
                "formnumberinput": "/apps/forms-components-examples/components/form/numberinput",
                "panelcontainer": "/apps/forms-components-examples/components/form/panelcontainer",
                "pageheader": "/apps/forms-components-examples/components/form/pageheader",
                "accordion": "/apps/forms-components-examples/components/form/accordion",
                "formtext": "/apps/forms-components-examples/components/form/text",
                "footer": "/apps/forms-components-examples/components/form/footer",
                "formcheckboxgroup": "/apps/forms-components-examples/components/form/checkboxgroup",
                "tabsontop": "/apps/forms-components-examples/components/form/tabsontop",
                "datepicker": "/apps/forms-components-examples/components/form/datepicker",
                "formdropdown": "/apps/forms-components-examples/components/form/dropdown",
                "formbutton": "/apps/forms-components-examples/components/form/button",
                "formimage": "/apps/forms-components-examples/components/form/image",
                "formradiobutton": "/apps/forms-components-examples/components/form/radiobutton",
                "formfileinput": "/apps/forms-components-examples/components/form/fileinput",
                "wizard": "/apps/forms-components-examples/components/form/wizard",
                "title": "/apps/forms-components-examples/components/form/title"
            }
        }
    },
    RESPONSIVE_GRID_DEMO_SUFFIX : "/jcr:content/root/responsivegrid/demo/component",
    FORM_EDITOR_FORM_CONTAINER_SUFFIX : "/jcr:content/guideContainer",
    FORM_EDITOR_LAYOUT_CONTAINER_SUFFIX : "/jcr:content/parsys1",
    RESPONSIVE_GRID_SUFFIX : "/jcr:content/root/responsivegrid",
    EVENT_NAME_GUIDE_REFRESH_DONE : "guideRefreshDone.cypress",
    events : {
        LOADING_SHOW : "loading-show.cypress",
        LOADING_HIDE : "loading-hide.cypress",
        DIALOG_READY : "dialog-ready.cypress"
    }
};

module.exports = formsConstants;
