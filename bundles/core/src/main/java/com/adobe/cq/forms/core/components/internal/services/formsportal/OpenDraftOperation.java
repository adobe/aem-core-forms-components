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

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.apache.sling.api.request.RequestParameterMap;
import org.apache.sling.settings.SlingSettingsService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.forms.core.components.internal.models.v1.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.components.models.services.formsportal.Operation;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.models.DraftModel;
import com.adobe.fd.fp.api.service.DraftService;
import com.day.cq.commons.Externalizer;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Component(
    service = Operation.class,
    immediate = true)
public class OpenDraftOperation implements Operation {
    private static final String OPERATION_NAME = "openDraft";
    private static final String OPERATION_TITLE = "Open";
    private static final String DRAFT_LINK = "%s.html?dataRef=service://FP/draft/%s%s";
    private static final String WCM_MODE = "&wcmmode=disabled";

    private static final Logger LOGGER = LoggerFactory.getLogger(OpenDraftOperation.class);

    private String actionURL;

    @Reference
    private DraftService draftService;

    @Reference
    private SlingSettingsService slingSettings;

    @Override
    public String getName() {
        return OPERATION_NAME;
    }

    @Override
    public String getTitle() {
        return OPERATION_TITLE;
    }

    @Override
    @JsonIgnore
    public String getIcon() {
        return null;
    }

    @Override
    public DraftsAndSubmissions.TypeEnum getType() {
        return DraftsAndSubmissions.TypeEnum.DRAFT;
    }

    @Override
    public OperationResult execute(Map parameterMap) {
        String suffix = slingSettings.getRunModes().contains(Externalizer.AUTHOR) ? WCM_MODE : "";
        Map<String, Object> result = new HashMap<>();
        RequestParameterMap map = (RequestParameterMap) parameterMap;
        String modelID = Objects.requireNonNull(map.getValue(Operation.OPERATION_MODEL_ID)).getString();
        try {
            DraftModel dm = draftService.getDraft(modelID);
            String formPath = GuideUtils.convertFMAssetPathToFormPagePath(GuideUtils.convertGuideContainerPathToFMAssetPath(dm
                .getFormPath()));
            String formLink = String.format(DRAFT_LINK, formPath, modelID, suffix);
            result.put("formLink", formLink);
            result.put("status", "success");
        } catch (FormsPortalException e) {
            LOGGER.error("Failed to fetch link for draft with id " + modelID, e);
            result.put("status", "fail");
        }
        return new OperationResult() {
            @Override
            public Map<String, Object> getResult() {
                return result;
            }
        };
    }

    @Override
    public Operation makeOperation(PortalLister.Item item, String requestURI) {
        OpenDraftOperation op = new OpenDraftOperation();
        op.actionURL = Utils.generateActionURL(item.getId(), getName(), requestURI);
        return op;
    }

    @Override
    public String getActionURL() {
        return actionURL;
    }
}
