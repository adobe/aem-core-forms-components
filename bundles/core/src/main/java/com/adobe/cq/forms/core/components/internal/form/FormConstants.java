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

    /** The resource type for text input v1 */
    public static final String RT_FD_FORM_TEXT_V1 = RT_FD_FORM_PREFIX + "textinput/v1/textinput";
    /** The resource type for checkbox v1 */
    public static final String RT_FD_FORM_CHECKBOX_V1 = RT_FD_FORM_PREFIX + "checkbox/v1/checkbox";

    /** The resource type for date picker v1 */
    public static final String RT_FD_FORM_DATE_PICKER_V1 = RT_FD_FORM_PREFIX + "datepicker/v1/datepicker";

    /* The resource type prefix for the form container related datasources */
    public final static String RT_FD_FORM_CONTAINER_DATASOURCE_V1 = RT_FD_FORM_PREFIX + "container/v1/datasource";
}
