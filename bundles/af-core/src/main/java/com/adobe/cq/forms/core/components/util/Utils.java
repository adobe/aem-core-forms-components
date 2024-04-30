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

package com.adobe.cq.forms.core.components.util;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.views.Views;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Utils {
    private static final Logger logger = LoggerFactory.getLogger(Utils.class);

    public static String getDefinitionForPublishView(Object component) {
        String result = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            Writer writer = new StringWriter();
            // return publish view specific properties only for runtime
            mapper.writerWithView(Views.Publish.class).writeValue(writer, component);
            result = writer.toString();
        } catch (IOException e) {
            logger.error("Unable to generate json from resource");
        }
        return result;
    }

    public static Boolean isEdgeDeliveryRequest(SlingHttpServletRequest request) {
        if (request != null) {
            Object isEdgeDelivery = request.getAttribute("com.adobe.aem.wcm.franklin.internal.servlets.FranklinDeliveryServlet");
            Boolean res = true;
            if (isEdgeDelivery == null || isEdgeDelivery.equals(Boolean.FALSE)) {
                res = false;
            }
            return res;
        }
        return false;
    }
}
