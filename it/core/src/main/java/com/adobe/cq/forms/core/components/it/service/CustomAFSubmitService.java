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
package com.adobe.cq.forms.core.components.it.service;


import com.adobe.aemds.guide.common.GuideValidationResult;
import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.forms.common.service.FileAttachmentWrapper;
import com.adobe.cq.forms.core.components.it.servlets.FileAttachmentServlet;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component(
        service=FormSubmitActionService.class,
        immediate = true
)
public class CustomAFSubmitService implements FormSubmitActionService {
    private static final String serviceName = "Core Custom AF Submit";
    private static final Logger logger = LoggerFactory.getLogger(CustomAFSubmitService.class);

    private static final String LOG_PREFIX = "[AF2Submit]";

    @Reference
    DataManager dataManager;

    @Override
    public String getServiceName() {
        return serviceName;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        Map<String, Object> result = new HashMap<>();
        result.put(GuideConstants.FORM_SUBMISSION_COMPLETE, Boolean.FALSE);
        String guideContainerPath = formSubmitInfo.getFormContainerPath();
        String formPath = StringUtils.substringBefore(guideContainerPath, "/jcr:content");
        String submissionId = formSubmitInfo.getSubmissionId();
        String actionType = null;
        String submitType = null;

        Resource formContainerResource = formSubmitInfo.getFormContainerResource();
        if (formContainerResource != null) {
            ValueMap valueMap = formContainerResource.getValueMap();
            actionType = valueMap.get("actionType", String.class);
            submitType = resolveSubmitTypeName(formContainerResource.getResourceResolver(), actionType);
        }

        try {
            String data = formSubmitInfo.getData();
            String uniqueID = UUID.randomUUID().toString();
            if(formSubmitInfo.getFileAttachments() != null && formSubmitInfo.getFileAttachments().size() > 0) {
                for (int i = 0; i < formSubmitInfo.getFileAttachments().size(); i++) {
                    FileAttachmentWrapper fileAttachment = formSubmitInfo.getFileAttachments().get(i);
                    String fileName = fileAttachment.getFileName();
                    if (StringUtils.isNotBlank(fileName)) {
                        // upload the binary to data manager (ie) current data source
                        String fileAttachmentUuid = UUID.randomUUID().toString();
                        fileAttachment.setUuid(fileAttachmentUuid);
                        if (dataManager != null) {
                            String originalFileName = StringUtils.substringAfterLast(fileAttachment.getFileName(), "/");
                            String fileUrl = formSubmitInfo.getFormContainerPath() + "." + FileAttachmentServlet.SELECTOR + "/" + fileAttachmentUuid + "/" + originalFileName;
                            fileAttachment.setUri(fileUrl);
                            dataManager.put(fileAttachmentUuid, fileAttachment); // used by file attachment servlet
                        }
                    }
                }
            }
            if(dataManager != null) {
                dataManager.put(uniqueID, data);
                if (formSubmitInfo.getFileAttachments() != null && formSubmitInfo.getFileAttachments().size() > 0) {
                    dataManager.put(DataManager.getFileAttachmentMapKey(uniqueID), formSubmitInfo.getFileAttachments());
                }
            }
            logger.info("{} Submission successful - formPath: {}, submissionId: {}, submitType: {}",
                LOG_PREFIX, formPath, submissionId, submitType);
            result.put(GuideConstants.FORM_SUBMISSION_COMPLETE, Boolean.TRUE);
            result.put(DataManager.UNIQUE_ID, uniqueID);
            // adding id here so that this available in redirect parameters in final thank you page
            Map<String, Object> redirectParamMap = new HashMap<String, Object>() {{
                put(DataManager.UNIQUE_ID, uniqueID);
            }};
            // todo: move this to constant, once forms SDK is released
            result.put("fd:redirectParameters", redirectParamMap);
        } catch (Exception ex) {
            logger.error("{} Submission failed - formPath: {}, submissionId: {}, submitType: {}",
                LOG_PREFIX, formPath, submissionId, submitType, ex);
            GuideValidationResult guideValidationResult = new GuideValidationResult();
            guideValidationResult.setOriginCode("500");
            guideValidationResult.setErrorMessage("Internal server error");
            result.put(GuideConstants.FORM_SUBMISSION_ERROR, guideValidationResult);
        }
        return result;
    }

    /**
     * Resolves the human-readable submit type name from the actionType resource type.
     * Looks up the resource at the actionType path and reads its jcr:description
     * (e.g. "Submit to REST endpoint", "Invoke an AEM workflow", "Core Custom AF Submit").
     * Falls back to the raw actionType path if the resource or description is unavailable.
     */
    private String resolveSubmitTypeName(ResourceResolver resourceResolver, String actionType) {
        if (StringUtils.isBlank(actionType)) {
            return "unknown";
        }
        try {
            Resource actionResource = resourceResolver.getResource(actionType);
            if (actionResource != null) {
                String description = actionResource.getValueMap().get("jcr:description", String.class);
                if (StringUtils.isNotBlank(description)) {
                    return description;
                }
            }
        } catch (Exception e) {
            logger.debug("{} Could not resolve submit type name for actionType: {}", LOG_PREFIX, actionType, e);
        }
        return actionType;
    }

}
