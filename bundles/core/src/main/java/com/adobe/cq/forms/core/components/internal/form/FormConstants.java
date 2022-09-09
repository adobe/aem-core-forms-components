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
    public static final String RT_FD_FORM_HEADER_V1 = RT_FD_FORM_PREFIX + "header/v1/header";
    public static final String RT_FD_FORM_FOOTER_V1 = RT_FD_FORM_PREFIX + "footer/v1/footer";
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

    /** The resource type for panel v1 */
    public static final String RT_FD_FORM_PANEL_V1 = RT_FD_FORM_PREFIX + "panel/v1/panel";

    /* The resource type prefix for the form container related datasources */
    public final static String RT_FD_FORM_CONTAINER_DATASOURCE_V1 = RT_FD_FORM_PREFIX + "container/v1/datasource";
}
