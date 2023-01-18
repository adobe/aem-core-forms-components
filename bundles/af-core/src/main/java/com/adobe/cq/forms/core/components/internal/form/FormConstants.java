/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.internal.form;

/**
 * Some constants for the form components.
 */
public final class FormConstants {

    private FormConstants() {

    }

    public static final String ITEMS_PATH = "items";
    /** The prefixes for all core form related resource types */
    public final static String RT_FD_FORM_PREFIX = "core/fd/components/form/";

    /** The resource type for form container v1 */
    public final static String RT_FD_FORM_CONTAINER_V1 = RT_FD_FORM_PREFIX + "container/v1/container";

    /** The resource type for form container v2 */
    public final static String RT_FD_FORM_CONTAINER_V2 = RT_FD_FORM_PREFIX + "container/v2/container";

    /** The resource type for text input v1 */
    public static final String RT_FD_FORM_TEXT_V1 = RT_FD_FORM_PREFIX + "textinput/v1/textinput";

    /** The resource type for telephone input v1 */
    public static final String RT_FD_FORM_TELEPHONE_V1 = RT_FD_FORM_PREFIX + "telephoneinput/v1/telephoneinput";

    /** The resource type for email input v1 */
    public static final String RT_FD_FORM_EMAIL_V1 = RT_FD_FORM_PREFIX + "emailinput/v1/emailinput";

    /** The resource type for button v1 */
    public static final String RT_FD_FORM_BUTTON_V1 = RT_FD_FORM_PREFIX + "button/v1/button";

    /** The resource type for checkbox v1 */
    public static final String RT_FD_FORM_CHECKBOX_V1 = RT_FD_FORM_PREFIX + "checkbox/v1/checkbox";

    /** The resource type for date picker v1 */
    public static final String RT_FD_FORM_DATE_PICKER_V1 = RT_FD_FORM_PREFIX + "datepicker/v1/datepicker";

    /** The resource type for number input v1 */
    public static final String RT_FD_FORM_NUMBER_INPUT_V1 = RT_FD_FORM_PREFIX + "numberinput/v1/numberinput";

    /** The resource type for drop down v1 */
    public static final String RT_FD_FORM_DROP_DOWN_V1 = RT_FD_FORM_PREFIX + "dropdown/v1/dropdown";

    /** The resource type for file input v1 */
    public static final String RT_FD_FORM_FILE_INPUT_V1 = RT_FD_FORM_PREFIX + "fileinput/v1/fileinput";

    /** The resource type for check box group v1 */
    public static final String RT_FD_FORM_CHECKBOX_GROUP_V1 = RT_FD_FORM_PREFIX + "checkboxgroup/v1/checkboxgroup";

    /** The resource type for radio button v1 */
    public static final String RT_FD_FORM_RADIO_BUTTON_V1 = RT_FD_FORM_PREFIX + "radiobutton/v1/radiobutton";

    /** The resource type for panel v1 */
    public static final String RT_FD_FORM_PANEL_V1 = RT_FD_FORM_PREFIX + "panel/v1/panel";

    public static final String RT_FD_FORM_WIZARD_V1 = RT_FD_FORM_PREFIX + "wizard/v1/wizard";

    /** The resource type for text v1 */
    public static final String RT_FD_FORM_TEXT_DRAW_V1 = RT_FD_FORM_PREFIX + "text/v1/text";

    public static final String RT_FD_FORM_PANEL_CONTAINER_V1 = RT_FD_FORM_PREFIX + "panelcontainer/v1/panelcontainer";

    public static final String RT_FD_FORM_TABS_ON_TOP_V1 = RT_FD_FORM_PREFIX + "tabsontop/v1/tabsontop";

    /* The resource type prefix for the form container related datasources */
    public final static String RT_FD_FORM_CONTAINER_DATASOURCE_V1 = RT_FD_FORM_PREFIX + "container/v1/datasource";

    /** The resource type for accordion v1 */
    public final static String RT_FD_FORM_ACCORDION_V1 = RT_FD_FORM_PREFIX + "accordion/v1/accordion";

    /** The resource type for image v1 */
    public static final String RT_FD_FORM_IMAGE_V1 = RT_FD_FORM_PREFIX + "image/v1/image";

    /** The resource type for title v1 */
    public static final String RT_FD_FORM_TITLE_V1 = RT_FD_FORM_PREFIX + "title/v1/title";

    /** The resource type for submit button v1 */
    public static final String RT_FD_FORM_SUBMIT_BUTTON_V1 = RT_FD_FORM_PREFIX + "actions/submit/v1/submit";

    /** The resource type for submit button v1 */
    public static final String RT_FD_FORM_RESET_BUTTON_V1 = RT_FD_FORM_PREFIX + "actions/reset/v1/reset";
}
