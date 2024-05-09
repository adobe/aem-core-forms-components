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

import java.util.*;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;

import com.adobe.aemds.guide.model.SignerInfo;
import com.adobe.aemds.guide.model.SignerResource;
import com.adobe.cq.export.json.ExporterConstants;

@Model(adaptables = Resource.class)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SignerInfoImpl {
    public static Map<String, Object> getSignerDetails(Resource signerInfoResource) {
        Map<String, Object> signerProperties = new LinkedHashMap<>();
        SignerResource signerResource = signerInfoResource.adaptTo(SignerResource.class);
        signerProperties.put("firstSignerFormFiller", signerResource.isFirstSignerFormFiller());
        signerProperties.put("workflowType", signerResource.getWorkflowType());
        if (signerResource.getAllSignerInfo().size() > 0) {
            List<SignerInfo> signersList = signerResource.getAllSignerInfo();
            signerProperties.put("signers", signersList);
        }
        return signerProperties;
    }

}
