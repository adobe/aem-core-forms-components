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
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;


@Component(
        service={DataProvider.class, RepeatableAFPrefillService.class},
        immediate = true
)
public class RepeatableAFPrefillService implements DataProvider {
    private Logger logger = LoggerFactory.getLogger(RepeatableAFPrefillService.class);

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProviderBase#getServiceDescription()
     */
    @Override
    public String getServiceDescription() {
        return "Repeatable AF Pre-fill Service";
    }

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProviderBase#getServiceName()
     */
    @Override
    public String getServiceName() {
        return "Repeatable AF Pre-fill Service";
    }

    /* (non-Javadoc)
     * @see com.adobe.forms.common.service.DataProvider#getPrefillData(com.adobe.forms.common.service.DataOptions)
     */
    @Override
    public PrefillData getPrefillData(DataOptions dataOptions) throws FormsException {
        logger.info("Invoking Repeatable AF prefill service");
        Resource formResource = dataOptions.getFormResource();
        Resource aemFormContainer = dataOptions.getAemFormContainer();
        InputStream dataInputStream = null;
        ContentType contentType = dataOptions.getContentType();
        Map<String, Object> extras = dataOptions.getExtras();
        String data = "{\"aPanel\":null}";
        List<FileAttachmentWrapper> fileAttachmentWrappers = null;
        PrefillData prefillData = null;
        Map<String, String> customContext = null;
        dataInputStream = getDataInputStream(data);
        prefillData = new PrefillData(dataInputStream, contentType, fileAttachmentWrappers, customContext);
        return prefillData;
    }


    private InputStream getDataInputStream(String data) {
        InputStream dataInputStream = null;
        try {
            dataInputStream = new ByteArrayInputStream(data.getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            logger.error("[Repeatable AF Prefill] Exception in custom af prefill service", e);
        }
        return dataInputStream;
    }
}