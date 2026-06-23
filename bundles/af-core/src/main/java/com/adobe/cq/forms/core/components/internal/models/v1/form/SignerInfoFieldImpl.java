/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~ Copyright 2026 Adobe
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

package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ExporterConstants;

@Model(adaptables = Resource.class)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SignerInfoFieldImpl {

    private static final String PN_SIGNER_TITLE = "signerTitle";
    private static final String PN_COUNTRY_CODE_SOURCE = "countryCodeSource";
    private static final String PN_EMAIL = "email";
    private static final String PN_EMAIL_SOURCE = "emailSource";
    private static final String PN_PHONE_SOURCE = "phoneSource";
    private static final String PN_RECIPIENT_ROLE = "recipientRole";
    private static final String PN_DELEGATES_TO = "delegatesTo";
    private static final String PN_SECURITY_OPTION = "securityOption";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_SIGNER_TITLE)
    private String signerTitle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_COUNTRY_CODE_SOURCE)
    private String countryCodeSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_EMAIL)
    private String email;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_EMAIL_SOURCE)
    private String emailSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_PHONE_SOURCE)
    private String phoneSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_RECIPIENT_ROLE)
    private String recipientRole;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_DELEGATES_TO)
    private String delegatesTo;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PN_SECURITY_OPTION)
    private String securityOption;

    public Map<String, Object> getSignerFieldMap() {
        Map<String, Object> signerField = new LinkedHashMap<>();
        signerField.put(PN_SIGNER_TITLE, signerTitle);
        signerField.put(PN_COUNTRY_CODE_SOURCE, countryCodeSource);
        signerField.put(PN_EMAIL, email);
        signerField.put(PN_EMAIL_SOURCE, emailSource);
        signerField.put(PN_PHONE_SOURCE, phoneSource);
        signerField.put(PN_RECIPIENT_ROLE, recipientRole);
        signerField.put(PN_DELEGATES_TO, delegatesTo);
        signerField.put(PN_SECURITY_OPTION, securityOption);
        return signerField;
    }

}