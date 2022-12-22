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
package com.coreformscomponents.core.service;


import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.forms.common.service.FileAttachmentWrapper;
import com.coreformscomponents.core.servlets.FileAttachmentServlet;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;


@Component(
        service=FormSubmitActionService.class,
        immediate = true
        )
public class CustomAFSubmitService implements FormSubmitActionService {
    private static final String serviceName = "Custom AF Submit";
    private static Logger logger = LoggerFactory.getLogger(CustomAFSubmitService.class);

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
        try {
            String guideContainerPath = formSubmitInfo.getFormContainerPath();
            String data = formSubmitInfo.getData();
            String uniqueID = UUID.randomUUID().toString();
            JSONObject fileAttachmentMapJsonObject = null;
            // String key = getDataKey("firstName", formSubmitInfo);
            // walk through the file attachment list
            if(StringUtils.isNotBlank(formSubmitInfo.getFileAttachmentMap())) {
                fileAttachmentMapJsonObject = new org.json.JSONObject(formSubmitInfo.getFileAttachmentMap());
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
                            fileAttachmentMapJsonObject = updateMapWithFileUrl(fileAttachmentMapJsonObject, fileAttachment.getFileName(), fileUrl);
                            dataManager.put(fileAttachmentUuid, fileAttachment);
                        }
                    }
                }
            }
            if(dataManager != null) {
                dataManager.put(uniqueID, data);
                if(fileAttachmentMapJsonObject != null) {
                    dataManager.put(DataManager.getFileAttachmentMapKey(uniqueID), fileAttachmentMapJsonObject.toString());
                }
            }
            logger.info("AF Submission successful using custom submit service for: {}", guideContainerPath);
            result.put(GuideConstants.FORM_SUBMISSION_COMPLETE, Boolean.TRUE);
            // adding id here so that this available in redirect parameters in final thank you page
            result.put(DataManager.UNIQUE_ID, uniqueID);
        } catch (Exception ex) {
            logger.error("Error while using the AF Submit service", ex);

        }

        return result;
    }

    private JSONObject updateMapWithFileUrl(JSONObject fileAttachmentJsonObject, String fileName, String fileUrl) throws Exception {
        Iterator iterator = fileAttachmentJsonObject.keys();
        while(iterator.hasNext()) {
            String fileSom = (String)iterator.next();
            String[] fileNames = ((String)fileAttachmentJsonObject.get(fileSom)).split("\\\n");
            for (int i = 0; i < fileNames.length; i++) {
                String fName = fileNames[i];
                if(StringUtils.contains(fName, fileName)) {
                    fileNames[i] = fileUrl;
                    break;
                }
            }
            fileAttachmentJsonObject.put(fileSom, StringUtils.join(fileNames, '\n'));

        }
        return fileAttachmentJsonObject;
    }

}