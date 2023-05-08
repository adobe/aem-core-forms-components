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
    const DC_TITLE = 'dc:title';
    const FIELD_TYPE = 'fieldType';
    const PARENT_ID = 'parentId';
    
    let dataLayer;
    let formTitle, fieldTitle, fieldType, panelTitle;
    let startTime = (new Date()).getTime();

    const FASTTRACK_ANALYTICS_EVENT = "FormFastTrackAnalyticsEvent";
    const FormEvents = {
        RENDER: "Form renditions",
        SUBMIT: "Form submissions",
        ERROR: "Validation errors",
        FIELD: "Field visits",
        ABANDON: "Abandoned forms",
        HELP: "Help views",
        TIMESPENT: "Time Spent"
    }
    
    const getCurrentFieldData = (fieldId, dataLayerContent) => {
        return dataLayerContent.component[fieldId];
    }
    
    const getFieldPanelTitle = (fieldData, dataLayerContent) => {
        if(fieldData !== undefined){
            if(dataLayerContent.component[fieldData[PARENT_ID]] === undefined) {
                return dataLayerContent.page[fieldData[PARENT_ID]][DC_TITLE];
            }
            return dataLayerContent.component[fieldData[PARENT_ID]][DC_TITLE] ;
        } else {
            return '';
        }
    }

    const getEventInfo = (_eventTitle, _formTitle, _fieldId, dataLayerContent) => {
        // global variables to be used in abandon event which can be triggered anytime
        const fieldData = getCurrentFieldData(_fieldId, dataLayerContent);
        formTitle = _formTitle;
        fieldTitle = fieldData ? fieldData[DC_TITLE] : fieldTitle;
        fieldType = fieldData ? fieldData[FIELD_TYPE] : fieldType;
        panelTitle = getFieldPanelTitle(fieldData, dataLayerContent);
        return {
            formTitle,
            fieldTitle,
            fieldType,
            panelTitle,
            eventName: _eventTitle
        }
    }

    const registerGuideBridgeEvents = (bridge) => {
        bridge.connect(()=>{
            const dataLayerContent = dataLayer.getState();
            formTitle = bridge.getFormModel().title;

            dataLayer.push({
                event: FASTTRACK_ANALYTICS_EVENT,
                eventInfo: {
                    formTitle: formTitle,
                    eventName: FormEvents.RENDER
                }
            });

            bridge.on('elementFocusChanged', function(event){
                let fieldData = getCurrentFieldData(event.detail.fieldId, dataLayerContent);
                if(fieldData[FIELD_TYPE] === 'button'){
                    return;
                }
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.FIELD, formTitle, event.detail.fieldId, dataLayerContent)
                });
            });

            bridge.on('elementHelpShown', function(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.HELP, event.detail.formTitle, event.detail.fieldId, dataLayerContent)
                });
            });

            bridge.on('elementErrorShown', function(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.ERROR, event.detail.formTitle, event.detail.fieldId, dataLayerContent)
                });
            });

            bridge.on('submitStart', function(event){
                let eventInfo = {
                    eventName : FormEvents.SUBMIT,
                    fieldTitle,
                    fieldType,
                    panelTitle,
                    formTitle
                }
                eventInfo.timeSpentOnForm = ((new Date()).getTime() - startTime) / 1000;
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
            if(window.guideBridge !== undefined){
                registerGuideBridgeEvents(window.guideBridge);
            } else {
                window.addEventListener("bridgeInitializeStart", (event)=>{
                    registerGuideBridgeEvents(event.detail.guideBridge);
                });
            }

            window.addEventListener('beforeunload', function(){
                let eventInfo = {
                    eventName : FormEvents.ABANDON, 
                    fieldTitle, 
                    fieldType, 
                    panelTitle, 
                    formTitle
                }
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
