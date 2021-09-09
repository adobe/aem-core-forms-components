/*
 * Copyright 2021 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.adobe.cq.forms.core.components.internal.services.formsportal;

import java.net.URISyntaxException;

import org.apache.http.client.utils.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.models.services.formsportal.Operation;

public class OperationUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(OperationUtils.class);

    private OperationUtils() {}

    public static String generateActionURL(String modelID, String opName, String requestURI) {
        String actionURL = null;
        try {
            URIBuilder uriBuilder = new URIBuilder(requestURI.replace(".model.json", ".execute.json"));
            uriBuilder.setParameter(Operation.OPERATION_KEY, opName);
            uriBuilder.setParameter(Operation.OPERATION_MODEL_ID, modelID);
            actionURL = uriBuilder.build().toString();
        } catch (URISyntaxException e) {
            LOGGER.error("[FP] Could not create action URL for {}", requestURI, e);
        }
        return actionURL;
    }
}
