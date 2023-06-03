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
    
    let dataLayer, bridge;
    let containerState = {};
    let startTime = (new Date()).getTime();

    const FASTTRACK_ANALYTICS_EVENT = "FormEvent";
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
    
    const getFieldPanelTitle = (fieldData, dataLayerContent, formContainerID) => {
        if(fieldData !== undefined){
            if(dataLayerContent.component[fieldData[PARENT_ID]] === undefined) {
                return containerState[formContainerID].formTitle;
            }
            return dataLayerContent.component[fieldData[PARENT_ID]][DC_TITLE] ;
        } else {
            return '';
        }
    }

    const getEventInfo = (_eventTitle, _formTitle, _fieldId, dataLayerContent, formContainerID) => {
        // global variables to be used in abandon event which can be triggered anytime
        const fieldData = getCurrentFieldData(_fieldId, dataLayerContent);
        containerState[formContainerID].formTitle = _formTitle;
        containerState[formContainerID].fieldTitle = fieldData ? fieldData[DC_TITLE] : containerState[formContainerID].fieldTitle;
        containerState[formContainerID].fieldType = fieldData ? fieldData[FIELD_TYPE] : containerState[formContainerID].fieldType;
        containerState[formContainerID].panelTitle = getFieldPanelTitle(fieldData, dataLayerContent, formContainerID);
        return {
            target: _fieldId,
            originalTarget: _fieldId,
            type: _eventTitle,
            payload: {
                formTitle: containerState[formContainerID].formTitle,
                fieldTitle: containerState[formContainerID].fieldTitle,
                fieldType: containerState[formContainerID].fieldType,
                panelTitle: containerState[formContainerID].panelTitle,
                formPath: containerState[formContainerID].formPath,
            }
        }
    }

    const registerGuideBridgeEvents = (e) => {
        const formContainerPath = e.detail.getPath();
        containerState[formContainerPath] = { 
            submitted: false,
            formPath: formContainerPath
        }

        bridge.connect(()=>{
            const dataLayerContent = dataLayer.getState();
            containerState[formContainerPath].formTitle = bridge.getFormModel().title;

            dataLayer.push({
                event: FASTTRACK_ANALYTICS_EVENT,
                eventInfo: {
                    type: FormEvents.RENDER,
                    payload: {
                        formTitle: containerState[formContainerPath].formTitle,
                        formPath: containerState[formContainerPath].formPath,
                    }
                }
            });

            function onElementFocusChanged(event){
                let fieldData = getCurrentFieldData(event.detail.fieldId, dataLayerContent);
                if(fieldData[FIELD_TYPE] === 'button'){
                    return;
                }
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.FIELD, event.detail.formTitle, event.detail.fieldId, dataLayerContent, formContainerPath)
                });
            }

            function onElementHelpShown(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.HELP, event.detail.formTitle, event.detail.fieldId, dataLayerContent, formContainerPath)
                });
            }

            function onElementErrorShown(event){
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: getEventInfo(FormEvents.ERROR, event.detail.formTitle, event.detail.fieldId, dataLayerContent, formContainerPath)
                });
            }

            function onSubmitStart(event){
                containerState[formContainerPath].submitted = true;
                dataLayer.push({
                    event: FASTTRACK_ANALYTICS_EVENT,
                    eventInfo: {
                        type: FormEvents.SUBMIT,
                        target: event.detail.fieldId,
                        originalTarget: event.detail.fieldId,
                        payload: {
                            fieldTitle: containerState[formContainerPath].fieldTitle,
                            fieldType: containerState[formContainerPath].fieldType,
                            panelTitle: containerState[formContainerPath].panelTitle,
                            formTitle : containerState[formContainerPath].formTitle,
                            formPath : containerState[formContainerPath].formPath,
                            timeSpentOnForm : ((new Date()).getTime() - startTime) / 1000
                        }
                    }
                });
            }

            function onBeforeunload(){
                if(!containerState[formContainerPath].submitted){
                    dataLayer.push({
                        event: FASTTRACK_ANALYTICS_EVENT,
                        eventInfo: {
                            type: FormEvents.ABANDON,
                            payload: {
                                fieldTitle: containerState[formContainerPath].fieldTitle,
                                fieldType: containerState[formContainerPath].fieldType,
                                panelTitle: containerState[formContainerPath].panelTitle,
                                formTitle: containerState[formContainerPath].formTitle,
                                formPath: containerState[formContainerPath].formPath,
                                timeSpentOnForm : ((new Date()).getTime() - startTime)/1000
                            }
                        }
                    });
                }
            }

            bridge.on('elementFocusChanged', onElementFocusChanged);
            bridge.on('elementHelpShown', onElementHelpShown);
            bridge.on('elementErrorShown', onElementErrorShown);
            bridge.on('submitStart', onSubmitStart);
            window.addEventListener('beforeunload', onBeforeunload );
            
        }, null, formContainerPath);
    }


    const onDocumentReady = () => {
        const dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        if (dataLayerEnabled) {
            if(window.guideBridge !== undefined){
                bridge = window.guideBridge;
            } else {
                window.addEventListener("bridgeInitializeStart", (event)=>{
                    bridge = event.detail.guideBridge;
                });
            }
            document.addEventListener("AF_FormContainerInitialised", registerGuideBridgeEvents);
        }
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

}());
