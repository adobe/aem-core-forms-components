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

var formsConstants = require('./formsConstants');

var selectors = {
    components : {
        repeatableControls : {
            row : ".guideTableRuntimeControls",
            panel : ".repeatableButtons"
        }
    },
    sidePanel : {
        self : "#SidePanel",
        content : ".sidepanel-content",
        tabs : {
            properties : {
                self : "#guideSidePanelProperties",
                submit : ".enableAfTouchDialogSubmitButton",
                submitButtonEnabled : "button.enableAfTouchDialogSubmitButton",
                submitButtonDisabled : "button.disableAfTouchDialogSubmitButton",
                defaultValue : ".plainTextValue",
                colspan : "form coral-dialog-content .coral-Autocomplete [name='./colspan']",
                dorColspan : "form coral-dialog-content coral-select[name='./dorColspan']",
                maximumFileSize : "input[name$=fileSizeLimit]",
                showComment : "[name$=showComment] > input",
                allowMultipleFiles : "[name$=multiSelection] > input",
                imageComponent : {
                    browseAssets : "#imageUploadId",
                    cancelImage : ".fdImageCancelButton"
                },
                imageChoiceComponent : {
                    items : {
                        self : ".imageUploadWithTextWrapperClass",
                        add : "button:last",
                        item : {
                            self : "coral-multifield-item",
                            imgUpload : {
                                self : ".fdImageUploadWithTextIcon",
                                browseAssets : ".fdImageUploadWithTextAssetBrowser"
                            },
                            textField : ".fdImageUploadTextField input",
                            del : "button"
                        }
                    }
                }
            },
            errors : {
                self : "#guideSidePanelErrors",
                content : {
                    self : "#sidepanel-guide-errors",
                    syncMessage : {
                        self : ".syncMessage",
                        syncLink : ".syncMessage a"
                    },
                    errorMessage : ".errorMessage"
                }
            }
        }
    },
    editableToolbar : {
        actions : {
            configure : "[data-action='CONFIGURE']",
            deleteToolbar : '[data-action="deleteToolbar"]',
            insert : "[data-action='INSERT']",
            more : {
                self : "#EditableToolbar [data-action='nonIconAction']",
                actions : {
                    viewsom : "[data-action='som']",
                    groupObjects : "[data-action='saveInPanel']",
                    replace : "[data-action='replace']",
                    saveAsFragment : "[data-action='Save as Fragment']",
                    addToolbar : "[data-action='Add Panel Toolbar']",
                    rootPanelAddChildPanel : "[data-action='addPanel']",
                    addChildPanel : "[data-action='Add Child Panel']",
                    merge : "[data-action='merge']",
                    splitCells : "[data-action='split']",
                    addRow : "[data-action='addrow']",
                    delRow : "[data-action='deleterow']",
                    moveUp : "[data-action='moveup']",
                    moveDown : "[data-action='movedown']",
                    addCol : "[data-action='addcolumn']",
                    delCol : "[data-action='delcolumn']"
                }
            }
        }
    },
    groupInPanelDialog : {
        self : '.afSaveInPanelDialog',
        actions : {
            done : 'coral-dialog coral-dialog-header .cq-dialog-submit'
        }
    },
    addChildPanelDialog : {
        self : '.afAddChildPanelDialog',
        actions : {
            done : 'coral-dialog coral-dialog-header button:last'
        }
    },
    deleteToolbarDialog : {
        self : '#deleteToolbarDialog',
        actions : {
            del : '#deleteToolbar'
        }
    },
    deleteRowDialog : {
        self : '#deleteRowDialog',
        actions : {
            del : '#deleteRow'
        }
    },
    viewSomDialog : {
        self : '#getSomDialog',
        content : '#getSomDialog coral-dialog-content',
        closeButton : '#getSomDialog button',
        header : '#getSomDialog coral-dialog-header'
    },
    saveAsFragmentDialog : {
        header : "form coral-dialog-header:contains(Save as Fragment)",
        fragmentName : "form coral-dialog-content input[name='name']",
        targetPathSelectionControl : "form coral-dialog-content [name='targetPath'] button:visible",
        submitButton : "form coral-dialog-header button.cq-dialog-submit"
    },
    afMoreActionsPopOver : {
        self : "coral-popover#afMoreActionsPopover"
    },
    guideImageDom : ".guideImage img",
    guideImageItemDom : ".guideCheckBoxGroupItems.guideImageChoice .guideCheckBoxItem",
    formPicker : {
        self : ".granite-pickerdialog-content",
        columnView : "#granite-ui-pathfield-picker-collection",
        columnItem : "[data-foundation-picker-collection-item-text='%s']",
        submit : ".granite-pickerdialog-submit",
        columnItemThumbnail : "coral-columnview-item-thumbnail"
    },
    replaceComponentDialog : {
        self : '.ReplaceComponentDialog',
        components : '.ReplaceComponentDialog-components'
    },
    guideContainerForm : "#guideContainerForm",
    guideContainerSelector : ".guideContainer",

    pathBrowser : {
        dialog : "form.granite-pickerdialog-content",
        submitButtonEnabled : "form button.granite-pickerdialog-submit",
        submitButtonDisabled : "form button.granite-pickerdialog-submit[disabled]"
    },

    insertComponentDialog : {
        dialog : ".InsertComponentDialog-components",
        item : ".InsertComponentDialog-list [value='%s']",
        searchBar : ".InsertComponentDialog-search input"
    },

    ruleEditor : {
        action : {
            editRule : "#EditableToolbar [data-action='editexpression']",
            createRuleButton : "#create-rule-button",
            saveRule : ".exp-Save-Button",
            cancelRule : ".exp-Cancel-Button",
            closeRuleEditor : ".exp-Close-Button",
            sideToggleButton : "#exp-toggle-sidepanel-button",
            sidePanelFormObjectTab: ".exp-sidepanel-formobject-tab-label",
            sidePanelFunctionObjectTab: ".exp-sidepanel-function-tab-label"
        },
        choiceModels : {
            STATEMENT : ".choice-model.u-coral-clearFix.STATEMENT",
            EVENT_AND_COMPARISON_OPERATOR : ".choice-model.u-coral-clearFix.EVENT_AND_COMPARISON_OPERATOR",
            PRIMITIVE_EXPRESSION : ".choice-model.u-coral-clearFix.PRIMITIVE_EXPRESSION.choice-model-inline",
            BLOCK_STATEMENT : ".choice-model.u-coral-clearFix.BLOCK_STATEMENT",
            PARAMETER : ".Parameters .choice-model.u-coral-clearFix.EXPRESSION"
        },
        ruleSummary : {
            CREATED_RULE: "#rule-summary table[handle='table'] tr[title='Button - Click']",
            DATE_PICKER_RULE: "#rule-summary table[handle='table'] tr[title='Date Input - Validate']",
            SUBMISSION_SUCCESS_RULE: "#rule-summary table[handle='table'] tr[title='FORM - Successful Submission']",
            SUBMISSION_FAILURE_RULE: "#rule-summary table[handle='table'] tr[title='FORM - Error in Submission']",
            CUSTOM_SUBMIT_FORM_RULE: "#rule-summary table[handle='table'] tr[title='Submit - Click']",
        },
        operator : {
            CONTAINS : "coral-selectlist [value='CONTAINS']",
            HIDE : "coral-selectlist [value='HIDE_STATEMENT']",
            SAVE_FORM: "coral-selectlist [value='SAVE_FORM']",
            FUNCTION_CALL : "coral-selectlist [value='FUNCTION_CALL']",
            IS_CLICKED : "coral-selectlist [value='is clicked']",
            IS_SUBMITTED_SUCCESSFULLY : "coral-selectlist [value='is submitted successfully']",
            SUBMISSION_FAILS : "coral-selectlist [value='submission fails']",
            NAVIGATE_TO : "coral-selectlist [value='NAVIGATE_TO']"
        }
    }
};

module.exports = selectors;
