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


(function() {
    "use strict";

    let dataLayer;
    let formName, fieldName, fieldType, panelName;
    let startTime = (new Date()).getTime();

    const FASTTRACK_ANALYTICS_EVENT = "FormFastTrackAnalyticsEvent";
    const FormEvents = {
        RENDER: "Form renditions",
        SUBMIT: "Form submissions",
        ERROR: "Validation errors",
        FIELD: "Field visits",
        ABANDON: "Abandoned forms",
        HELP: "Help views",
        TIMESPENT: "Time Spent",
        SAVE: 'Drafts'
    }

    const getFormName = () => {
        const guidePath = guideBridge.getFormModel().getState().properties['fd:path'].substring(0,guideBridge.getFormModel().getState().properties['fd:path'].indexOf('/jcr:content/guideContainer'));
        const formPath = guidePath.substring(0,guidePath.lastIndexOf('/'));
        const name = guidePath.substring(guidePath.lastIndexOf('/') + 1)
        return name + '(' + formPath + ')';
    }

    const getFieldName = (element) => {
        return element.getAttribute('aria-label') || '';
    }

    const getFieldType = (element) => {
        const dataElement = element.dataset.cmpDataLayer
        if (dataElement) {
            return JSON.parse(element.dataset.cmpDataLayer)[Object.keys(JSON.parse(element.dataset.cmpDataLayer))[0]]['@type'] || '';
        } else {
            return '';
        }
    }

    const getPanelName = (element) => {
        let panel = element;
        while(panel.getAttribute('data-cmp-is')!=='adaptiveFormPanel' && panel.getAttribute('data-cmp-is')!=='adaptiveFormContainer'){
            panel = panel.parentElement;
        }

        if(panel.getElementsByTagName('label').length > 0  && panel.getElementsByTagName('label')[0].parentElement === panel)
            return panel.getElementsByTagName('label')[0].textContent;
        else
            return 'Root Panel';
    }

    const _getEventInfo = (_eventName, _fieldName, _fieldType, _panelName,_formName ) => {
        return {
            formTitle: _formName,
            fieldTitle: _fieldName,
            fieldType: _fieldType,
            panelTitle: _panelName,
            eventName: _eventName
        }
    }



    function dispatchRenderEvent(){
        window.guideBridge.connect(()=>{
            formName = getFormName();

            dataLayer.push({
                event: FASTTRACK_ANALYTICS_EVENT,
                eventInfo: {
                    formTitle: formName,
                    eventName: FormEvents.RENDER
                }
            });
        });
    }

    function addFocusToDataLayer(event) {
        const element = event.currentTarget;
        fieldName = getFieldName(element);
        panelName = getPanelName(element);
        fieldType = getFieldType(element);

        dataLayer.push({
            event: FASTTRACK_ANALYTICS_EVENT,
            eventInfo: _getEventInfo(FormEvents.FIELD, fieldName, fieldType, panelName, formName)
        });
    }

    function attachFocusEventListener(element) {
        element.addEventListener("focus", addFocusToDataLayer);
    }


    function onDocumentReady() {
        const dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer        = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        if (dataLayerEnabled) {

            var components        = document.querySelectorAll("[data-cmp-data-layer]");
            var clickableElements = document.querySelectorAll("[data-cmp-clickable]");

            dispatchRenderEvent();
            clickableElements.forEach(function(element) {
                attachFocusEventListener(element);
            });


            window.addEventListener('beforeunload', function(){
                let eventInfo = _getEventInfo(FormEvents.ABANDON, fieldName, fieldType, panelName, formName)
                eventInfo.timeSpentOnForm = ((new Date()).getTime() - startTime)/1000;
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: eventInfo
                });
            });
        }
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

}());