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

var selectors = {
    overlays : {
        self : '#OverlayWrapper',
        overlay : {
            self : '.cq-Overlay',
            component : '.cq-Overlay--component',
            container : '.cq-Overlay--container',
            placeholder : '.cq-Overlay--placeholder'
        }
    },
    confirmDialog : {
        self : "coral-dialog.is-open[role='dialog']",
        actions : {
            first : "coral-dialog.is-open[role='dialog'] coral-dialog-footer [is='coral-button']:first-child",
            last : "coral-dialog.is-open[role='dialog'] coral-dialog-footer [is='coral-button']:last-child"
        }
    },
    alertDialog : {
        self : "coral-dialog.is-open[role='alertdialog']",
        actions : {
            first : "coral-dialog.is-open[role='alertdialog'] coral-dialog-footer [is='coral-button']:first-child",
            last : "coral-dialog.is-open[role='alertdialog'] coral-dialog-footer [is='coral-button']:last-child"
        }
    },
    selectLayer : {
        current : '.js-editor-GlobalBar-layerCurrent',
        trigger : '.editor-GlobalBar-layerSwitcher',
        popover : {
            self : '#selectlayer-popover',
            edit : '#selectlayer-popover [data-layer="Edit"]',
            scaffolding : '#selectlayer-popover [data-layer="Scaffolding"]',
            design : '#selectlayer-popover [data-layer="Design"]',
            targeting : '#selectlayer-popover [data-layer="Targeting"]'
        },
        edit : '.js-editor-LayerSwitcherTrigger[data-layer="Edit"]',
        preview : '.js-editor-GlobalBar-previewTrigger',
        structure : '.js-editor-LayerSwitcherTrigger[data-layer="structure"]',
        initial : '.js-editor-LayerSwitcherTrigger[data-layer="initial"]',
        layout : '.js-editor-LayerSwitcherTrigger[data-layer="Layouting"]',
        annotate : '.js-editor-LayerSwitcherTrigger[data-layer="Annotate"]'
    },
    preview : {
        trigger : '.js-editor-GlobalBar-previewTrigger'
    },
    sidePanel : {
        self : "#SidePanel",
        content : ".sidepanel-content",
        tabs : {
            assets : {
                self : ".editor-AssetFinder",
                card : ".card-asset",
                editorCard : ".editor-Card-asset",
                emptyResult : ".emptyresult",
                resultSpinner : ".resultspinner",
                grid : {
                    self : ".grid"
                },
                masonry : {
                    self : "coral-masonry"
                },
                filter : {
                    self : "#assetfinder-filter",
                    search : "#assetsearch",
                    type : '.assetfilter.type',
                    path : '.assetfilter.path:visible input[is="coral-textfield"]',
                    tag : "#assetfinder-filter .assetfilter.tags-predicate"
                },
                mimetypes : {
                    images : '[data-asset-mimetype^="image/"]',
                    videos : '[data-asset-mimetype^="video/"], [data-asset-mimetype^="application/"]',
                    documents : '[data-asset-mimetype="application/pdf"]',
                    products : '[data-asset-group="product"]',
                    contentFragments : '[data-asset-mimetype="text/x-markdown"]',
                    pages : '[data-asset-group="page"]',
                    adaptiveForms : '[data-type="Adaptive Forms"]'
                }
            },
            components : {
                component : "#SidePanel:has(coral-columnview-item) [data-type='Component']",
                self : ".sidepanel-tab-components",
                list : {
                    self : ".editor-ComponentBrowser-components"
                },
                filter : {
                    self : "#components-filter",
                    search : "[data-editor-searchfilter-search]",
                    group : "[data-editor-searchfilter-group]",
                    groupHiddenField : 'coral-select[data-editor-searchfilter-group] [name=componentfilter_group_selector]'
                }
            },
            contentTree : {
                self : ".editor-ContentTree",
                item : "coral-tree-item",
                openDialog : ".js-editor-ContentTree-openDialog"
            },
            componentInspector : {
                self : "#ComponentInspector",
                itemStart : "#ComponentInspector ",
                itemEnd : " > [role='presentation'] > [role='tab']",
                itemSelectedEnd : " .is-selected[role='presentation'] > [role='tab']",
                itemViewDetailsEnd : " .is-selected[role='presentation'] .js-details-activator:first",
                itemImageViewDetails : {
                    getLink : ".cq-DeveloperRail-detailsSectionContent a[href$=\"/crx/de/index.jsp#/libs/foundation/components/parbase/img.GET.java\"]",
                    scriptLink : ".cq-DeveloperRail-detailsSectionContent a[href$=\"/crx/de/index.jsp#/libs/wcm/foundation/components/image/image.html\"]",
                    contentLink : ".cq-DeveloperRail-detailsSectionContent a[href$=\"/crx/de/index.jsp#/content/integrationtests/ui-touch-optimized/page1/jcr%3Acontent/par/image\"]"
                },
                itemImageEditScript : "a[href$=\"/crx/de/index.jsp#/libs/wcm/foundation/components/page/page.html\"]",
                itemImageViewComponentDetails : "a[href$=\"/mnt/overlay/wcm/core/content/sites/components/details.html/apps/integrationtests/ui-touch-optimized/components/page\"]"
            },
            errorInspector : {
                self : "#ErrorInspector",
                noError : "#ErrorInspector .js-error-list .u-emptyMessage"
            }
        }
    },
    editable : '[data-type="Editable"]',
    editable2 : '[data-type="Editable"][data-path%c="%s"]',
    editableActive : '.is-active[data-type="Editable"]',
    editableToolbar : {
        self : '#EditableToolbar',
        action : '.cq-editable-action',
        elementDom : '#EditableToolbar button[data-path="%s"]',
        actions : {
            edit : '#EditableToolbar [data-action="EDIT"]',
            design : '#EditableToolbar [data-action="DESIGN"]',
            policy : '#EditableToolbar [data-action="POLICY"]',
            'delete' : '#EditableToolbar [data-action="DELETE"]',
            insert : '#EditableToolbar [data-action="INSERT"]',
            parent : '#EditableToolbar [data-action="PARENT"]',
            layout : '#EditableToolbar [data-action="LAYOUT"]',
            hide : '#EditableToolbar [data-action="HIDE"]',
            unhide : '#EditableToolbar [data-action="UNHIDE"]',
            unhideEditableResponsive : '.editor-ResponsiveGrid-unHideButton',
            amount : '#EditableToolbar [data-action="AMOUNT"]',
            newline : '#EditableToolbar [data-action="NEWLINE"]',
            reset : '#EditableToolbar [data-action="RESET"]',
            close : '#EditableToolbar [data-action="CLOSE"]',
            cut : '#EditableToolbar [data-action="CUT"]',
            copy : '#EditableToolbar [data-action="COPY"]',
            configure : '#EditableToolbar [data-action="CONFIGURE"]',
            paste : '#EditableToolbar [data-action="PASTE"]',
            group : '#EditableToolbar [data-action="GROUP"]',
            structureOn : '#EditableToolbar [data-action="STRUCTURE_ON"]',
            structureOff : '#EditableToolbar [data-action="STRUCTURE_OFF"]',
            msmCancelInheritance : '#EditableToolbar [data-action="MSM_CANCEL_INHERITANCE"]',
            msmReenableInheritance : '#EditableToolbar [data-action="MSM_REENABLE_INHERITANCE"]'
        }
    },
    undoButtonSelector : "button[data-history-control='undo']",
    redoButtonSelector : "button[data-history-control='redo']",
    inlineEditorToolbar : {
        self : '#InlineEditingUI',
        actions : {
            dataAdd : '#InlineEditingUI [data-type="inline"] coral-buttongroup [data-action="dfvariableplugin#dfvariablecommand"]',
            tick : '#InlineEditingUI [data-type="inline"] coral-buttongroup [data-action="control#save"]',
            dataModelTree : {
                filter : "#InlineEditingUI [data-type='global'] coral-popover-content coral-search .editor-contenttree-searchfield-class",
                item : "#InlineEditingUI [data-type='global'] coral-popover-content .sidepanel-tree-component-items [data-elementid='%s'] label"
            }
        }
    },
    emulator : {
        toggle : ".js-editor-EmulatorBar-toggle",
        bar : {
            self : ".editor-EmulatorBar",
            deviceList : ".js-editor-EmulatorDeviceList"
        }
    },
    locale : {
        shell : {
            userProperties : '[data-foundation-toggleable-control-src*="/shell/userproperties.html"]',
            userPreferences : '[data-foundation-toggleable-control-src*="/shell/userpreferences.html"]'
        },
        language : 'coral-select[name="language"]',
        accept : '[trackingelement="accept"]'
    }
};

module.exports = selectors;