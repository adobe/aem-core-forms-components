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
        SAVE: 'Drafts' // TODO: implement when portal is available for CC
    }

    const getFormName = () => {
        const guidePath = guideBridge.getFormModel().getState().properties['fd:path'].substring(0,guideBridge.getFormModel().getState().properties['fd:path'].indexOf('/jcr:content/guideContainer'));
        const formPath = guidePath.substring(0,guidePath.lastIndexOf('/'));
        const name = guidePath.substring(guidePath.lastIndexOf('/') + 1)
        return name + '(' + formPath + ')';
    }

    const _getEventInfo = (_eventName, _fieldName, _fieldType, _panelName,_formName ) => {
        // global variables to be used in abandon event which can be triggered anytime
        formName = _formName;
        fieldName = _fieldName;
        fieldType = _fieldType;
        panelName = _panelName;
        return {
            formTitle: _formName,
            fieldTitle: _fieldName,
            fieldType: _fieldType,
            panelTitle: _panelName,
            eventName: _eventName
        }
    }

    const registerGuideBridgeEvents = () => {
        window.guideBridge.connect(()=>{
            formName = getFormName();

            dataLayer.push({
                event: FASTTRACK_ANALYTICS_EVENT,
                eventInfo: {
                    formTitle: formName,
                    eventName: FormEvents.RENDER
                }
            });

            guideBridge.on('elementFocusChanged', function(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: _getEventInfo(FormEvents.FIELD, event.detail.fieldLabel, event.detail.fieldType, event.detail.panelTitle, formName)
                });
            });

            guideBridge.on('elementHelpShown', function(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: _getEventInfo(FormEvents.HELP, event.detail.fieldLabel, event.detail.fieldType, event.detail.panelTitle, formName)
                });
            });

            guideBridge.on('elementErrorShown', function(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: _getEventInfo(FormEvents.ERROR, event.detail.fieldLabel, event.detail.fieldType, event.detail.panelTitle, formName)
                });
            });

            guideBridge.on('submitStart', function(event){
                let eventInfo = _getEventInfo(FormEvents.SUBMIT, event.detail.fieldLabel, event.detail.fieldType, event.detail.panelTitle, formName)
                eventInfo.timeSpentOnForm = ((new Date()).getTime() - startTime)/1000;
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: eventInfo
                });
            });
        });
    }


    const onDocumentReady = () => {
        const dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        if (dataLayerEnabled) {
            registerGuideBridgeEvents();

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
