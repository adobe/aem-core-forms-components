/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
package com.adobe.cq.forms.core.components.models.form;

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ProviderType;

/**
 * Defines per-signer configuration for Adobe Sign Electronic Signature.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.13.0
 */
@ProviderType
public interface SignerInfo {

    /**
     * Returns the signer's display title.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getSignerTitle() {
        return null;
    }

    /**
     * Returns the source of the signer's email address.
     * Possible values: {@code form}, {@code userProfile}, {@code typed}.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getEmailSource() {
        return null;
    }

    /**
     * Returns the typed email address (used when emailSource is {@code typed}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getEmail() {
        return null;
    }

    /**
     * Returns the form field path for email autocomplete (used when emailSource is {@code form}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String[] getEmailAutocomplete() {
        return null;
    }

    /**
     * Returns the signer authentication/security option.
     * Possible values: {@code NONE}, {@code PHONE}, {@code KBA}, {@code WEB_IDENTITY}.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getSecurityOption() {
        return null;
    }

    /**
     * Returns the source of the country code (used when securityOption is {@code PHONE}).
     * Possible values: {@code form}, {@code typed}.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getCountryCodeSource() {
        return null;
    }

    /**
     * Returns the typed country code (used when countryCodeSource is {@code typed}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getCountryCode() {
        return null;
    }

    /**
     * Returns the form field path for country code autocomplete (used when countryCodeSource is {@code form}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String[] getCountryCodeAutocomplete() {
        return null;
    }

    /**
     * Returns the source of the phone number (used when securityOption is {@code PHONE}).
     * Possible values: {@code form}, {@code typed}.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getPhoneSource() {
        return null;
    }

    /**
     * Returns the typed phone number (used when phoneSource is {@code typed}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String getPhone() {
        return null;
    }

    /**
     * Returns the form field path for phone autocomplete (used when phoneSource is {@code form}).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String[] getPhoneAutocomplete() {
        return null;
    }

    /**
     * Returns the Adobe Sign block field names that this signer should fill or sign.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String[] getSignFieldBlocks() {
        return null;
    }

    /**
     * Returns the Adaptive Form field paths assigned to this signer.
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    @Nullable
    default String[] getSignerAfFieldsBlock() {
        return null;
    }

    /**
     * Returns the unique signer number (1-based index within the signer list).
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.13.0
     */
    default int getSignerNumber() {
        return 1;
    }
}
