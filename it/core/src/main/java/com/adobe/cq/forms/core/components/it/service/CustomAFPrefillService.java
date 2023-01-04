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


import com.adobe.forms.common.service.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.gson.Gson;
import com.google.common.reflect.TypeToken;
import java.lang.reflect.Type;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;


@Component(
        service={DataProvider.class, CustomAFPrefillService.class},
        immediate = true
)
public class CustomAFPrefillService implements DataProvider {

    @Reference
    DataManager dataManager;

    private Logger logger = LoggerFactory.getLogger(CustomAFPrefillService.class);

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProviderBase#getServiceDescription()
     */
    @Override
    public String getServiceDescription() {
        return "Custom Pre-fill Service";
    }

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProviderBase#getServiceName()
     */
    @Override
    public String getServiceName() {
        return "Custom Pre-fill Service";
    }

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProvider#getPrefillData(com.adobe.forms.common.service.DataOptions)
     */
    @Override
    public PrefillData getPrefillData(DataOptions dataOptions) throws FormsException {
        logger.info("Invoking AF custom prefill service");
        Resource formResource = dataOptions.getFormResource();
        Resource aemFormContainer = dataOptions.getAemFormContainer();
        InputStream dataInputStream = null;
        ContentType contentType = dataOptions.getContentType();
        Map<String, Object> extras = dataOptions.getExtras();
        String data = null;
        String fileAttachmentMapAsString = null;
        Map<String, String> fileAttachmentMap = null;
        PrefillData prefillData = null;
        if(extras != null && extras.containsKey(DataManager.UNIQUE_ID) && dataManager != null) {
            String dataKey = extras.get(DataManager.UNIQUE_ID).toString();
            if(dataManager.get(dataKey) != null) {
                data = (String) dataManager.get(dataKey);
                fileAttachmentMapAsString = (String) dataManager.get(DataManager.getFileAttachmentMapKey(dataKey));
            }
        }
        if(StringUtils.isNotBlank(data)) {
            dataInputStream = getDataInputStream(data);
            if(fileAttachmentMapAsString != null) {
                Type mapType = new TypeToken<Map<String, String>>() {
                }.getType();
                fileAttachmentMap = new Gson().fromJson(fileAttachmentMapAsString, mapType);
            }
            prefillData = new PrefillData(dataInputStream, contentType, fileAttachmentMap, null);
        }
        return prefillData;
    }


    private InputStream getDataInputStream(String data) {
        InputStream dataInputStream = null;
        try {
            dataInputStream = new ByteArrayInputStream(data.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            logger.error("[Custom AF Prefill] Exception in custom af prefill service", e);
        }
        return dataInputStream;
    }
}