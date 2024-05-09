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

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "signerTitle")
    private String signerTitle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "countryCodeSource")
    private String countryCodeSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "email")
    private String email;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "emailSource")
    private String emailSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "phoneSource")
    private String phoneSource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "recipientRole")
    private String recipientRole;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "delegatesTo")
    private String delegatesTo;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "securityOption")
    private String securityOption;

    public Map<String, Object> getSignerFieldMap() {
        Map<String, Object> signerField = new LinkedHashMap<>();
        ;
        signerField.put("signerTitle", signerTitle);
        signerField.put("countryCodeSource", countryCodeSource);
        signerField.put("email", email);
        signerField.put("emailSource", emailSource);
        signerField.put("phoneSource", phoneSource);
        signerField.put("recipientRole", recipientRole);
        signerField.put("delegatesTo", delegatesTo);
        signerField.put("securityOption", securityOption);
        return signerField;
    }

}
