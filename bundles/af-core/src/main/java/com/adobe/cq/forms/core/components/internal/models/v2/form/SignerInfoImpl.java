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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.SignerInfo;

@Model(
    adaptables = { Resource.class },
    adapters = { SignerInfo.class })
public class SignerInfoImpl implements SignerInfo {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "signerTitle")
    @Nullable
    private String signerTitle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "emailSource")
    @Nullable
    private String emailSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "email")
    @Nullable
    private String email;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "emailAutocomplete")
    @Nullable
    private String[] emailAutocomplete;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "securityOption")
    @Nullable
    private String securityOption;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "countryCodeSource")
    @Nullable
    private String countryCodeSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "countryCode")
    @Nullable
    private String countryCode;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "countryCodeAutocomplete")
    @Nullable
    private String[] countryCodeAutocomplete;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "phoneSource")
    @Nullable
    private String phoneSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "phone")
    @Nullable
    private String phone;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "phoneAutocomplete")
    @Nullable
    private String[] phoneAutocomplete;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "signFieldBlocks")
    @Nullable
    private String[] signFieldBlocks;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "signerAfFieldsBlock")
    @Nullable
    private String[] signerAfFieldsBlock;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "signerNumber")
    private int signerNumber = 1;

    @Override
    @Nullable
    public String getSignerTitle() {
        return signerTitle;
    }

    @Override
    @Nullable
    public String getEmailSource() {
        return emailSource;
    }

    @Override
    @Nullable
    public String getEmail() {
        return email;
    }

    @Override
    @Nullable
    public String[] getEmailAutocomplete() {
        return emailAutocomplete;
    }

    @Override
    @Nullable
    public String getSecurityOption() {
        return securityOption;
    }

    @Override
    @Nullable
    public String getCountryCodeSource() {
        return countryCodeSource;
    }

    @Override
    @Nullable
    public String getCountryCode() {
        return countryCode;
    }

    @Override
    @Nullable
    public String[] getCountryCodeAutocomplete() {
        return countryCodeAutocomplete;
    }

    @Override
    @Nullable
    public String getPhoneSource() {
        return phoneSource;
    }

    @Override
    @Nullable
    public String getPhone() {
        return phone;
    }

    @Override
    @Nullable
    public String[] getPhoneAutocomplete() {
        return phoneAutocomplete;
    }

    @Override
    @Nullable
    public String[] getSignFieldBlocks() {
        return signFieldBlocks;
    }

    @Override
    @Nullable
    public String[] getSignerAfFieldsBlock() {
        return signerAfFieldsBlock;
    }

    @Override
    public int getSignerNumber() {
        return signerNumber;
    }
}
