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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.components.models.formsportal.Operation;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.service.PendingSignService;

@Component(
    service = Operation.class,
    immediate = true)
public class CancelAgreementOperation implements Operation {
    private static final String OPERATION_NAME = "cancelAgreement";
    private static final String OPERATION_TITLE = "Cancel Agreement";

    private static final Logger LOGGER = LoggerFactory.getLogger(CancelAgreementOperation.class);

    @Reference
    private PendingSignService pendingSignService;

    @Override
    public String getName() {
        return OPERATION_NAME;
    }

    @Override
    public String getTitle() {
        return OPERATION_TITLE;
    }

    @Override
    public String getIcon() {
        return null;
    }

    @Override
    public DraftsAndSubmissions.TypeEnum getType() {
        return DraftsAndSubmissions.TypeEnum.PENDING_SIGN;
    }

    @Override
    public OperationResult execute(SlingHttpServletRequest request) {
        String operationModelId = request.getParameter(OPERATION_MODEL_ID);
        Map<String, Object> result = new HashMap<>();
        try {
            boolean x = pendingSignService.cancelPendingSign(operationModelId);
            result.put("status", x ? "success" : "fail");
        } catch (FormsPortalException e) {
            LOGGER.error("Failed to cancel agreement with id " + operationModelId, e);
            result.put("status", "fail");
        }
        return new OperationResult() {
            @Override
            public Map<String, Object> getResult() {
                return result;
            }
        };
    }
}
