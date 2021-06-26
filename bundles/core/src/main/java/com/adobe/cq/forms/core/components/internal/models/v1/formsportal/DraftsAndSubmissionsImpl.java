/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.formsportal;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.vault.util.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.components.models.formsportal.Operation;
import com.adobe.cq.forms.core.components.models.formsportal.OperationManager;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.models.DraftModel;
import com.adobe.fd.fp.api.models.PendingSignModel;
import com.adobe.fd.fp.api.models.SubmitModel;
import com.adobe.fd.fp.api.service.DraftService;
import com.adobe.fd.fp.api.service.PendingSignService;
import com.adobe.fd.fp.api.service.SubmitService;
import com.adobe.forms.foundation.usc.model.Query;
import com.adobe.forms.foundation.usc.model.StatementGroup;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { DraftsAndSubmissions.class, ComponentExporter.class },
    resourceType = DraftsAndSubmissionsImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DraftsAndSubmissionsImpl extends PortalListerImpl implements DraftsAndSubmissions {

    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/draftsandsubmissions/v1/draftsandsubmissions";
    private static final String METADATA_NODE_PATH = JcrConstants.JCR_CONTENT + "/metadata";
    private static final String THUMBNAIL_PATH_SUFFIX = "/jcr:content/renditions/cq5dam.thumbnail.319.319.png";
    private static final String DRAFT_LINK = "%s.html?wcmmode=disabled&dataRef=service://FP/draft/%s";
    private static final String TOOLTIP = "Open";
    private static final String OPERATION = "operation";

    private static final Logger LOGGER = LoggerFactory.getLogger(DraftsAndSubmissionsImpl.class);

    @Self
    @Required
    private SlingHttpServletRequest request;

    @OSGiService
    private DraftService draftService;

    @OSGiService
    private SubmitService submitService;

    @OSGiService
    private PendingSignService pendingSignService;

    @OSGiService
    private OperationManager operationManager;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    @Default(values = "DRAFT")
    private String type;

    @Override
    protected String defaultTitle() {
        return "Drafts";
    }

    @Override
    public String getType() {
        return type;
    }

    private PortalLister.Item getItem(final String formPath, final TypeEnum typeEnum, final String id) {
        ResourceResolver resourceResolver = request.getResourceResolver();
        String formAssetPath = GuideUtils.convertGuideContainerPathToFMAssetPath(formPath);
        Resource formAssetResource = resourceResolver.getResource(formAssetPath);
        ValueMap valueMap = formAssetResource.getValueMap();
        ValueMap metaDataMap = null;
        if (formAssetResource.getChild(METADATA_NODE_PATH) != null) {
            metaDataMap = formAssetResource.getChild(METADATA_NODE_PATH).getValueMap();
        }
        String title = null;
        String description = null;
        String thubmnail = formAssetPath + THUMBNAIL_PATH_SUFFIX;
        String formLink = null;

        if (TypeEnum.DRAFT == typeEnum) {
            formLink = String.format(DRAFT_LINK, GuideUtils.convertFMAssetPathToFormPagePath(formAssetPath), id);
        }

        if (metaDataMap != null && metaDataMap.containsKey("title")) {
            title = metaDataMap.get("title", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_TITLE)) {
            title = valueMap.get(JcrConstants.JCR_TITLE, String.class);
        }
        if (metaDataMap != null && metaDataMap.containsKey("dc:description")) {
            description = metaDataMap.get("dc:description", String.class);
        } else if (metaDataMap != null && metaDataMap.containsKey("description")) {
            description = metaDataMap.get("description", String.class);
        } else if (valueMap.containsKey(JcrConstants.JCR_DESCRIPTION)) {
            description = valueMap.get(JcrConstants.JCR_DESCRIPTION, String.class);
        }

        if (resourceResolver.getResource(thubmnail) == null) {
            // thumbnail doesn't exist, set it to null
            thubmnail = null;
        }

        PortalListerImpl.Item item = new PortalListerImpl.Item();
        item.setTitle(title);
        item.setDescription(description);
        item.setFormLink(formLink);
        item.setTooltip(TOOLTIP);
        item.setFormThumbnail(thubmnail);
        item.setId(id);
        item.setOperations(operationManager.getOperationList(typeEnum));
        return item;
    }

    private Boolean isOperationCall() {
        String operationName = getOperationName();
        return StringUtils.isNotEmpty(operationName);
    }

    @Override
    public Operation.OperationResult getOperationResult() {
        if (!isOperationCall()) {
            return null;
        }
        Operation operation = operationManager.getOperation(getOperationName());
        if (operation == null) {
            return null;
        }
        return operation.execute(request);
    }

    @Override
    public String getOperationName() {
        String operationParam = request.getParameter(OPERATION);
        return operationParam;
    }

    @Override
    protected List<PortalLister.Item> getItemList() {
        List<PortalLister.Item> itemList = new ArrayList<>();
        TypeEnum typeEnum = TypeEnum.valueOf(getType());
        QueryImpl query = new QueryImpl();
        query.setOffset(getOffset());
        query.setLimit(getLimit());
        switch (typeEnum) {
            case DRAFT:
                try {
                    List<DraftModel> list = draftService.getAllDraft(query);
                    for (DraftModel draftModel : list) {
                        PortalLister.Item item = getItem(draftModel.getFormPath(), typeEnum, draftModel.getId());
                        itemList.add(item);
                    }
                } catch (FormsPortalException e) {
                    LOGGER.error("Failed to fetch Form Drafts.", e);
                }
                break;
            case SUBMISSION:
                try {
                    List<SubmitModel> list = submitService.getAllSubmission(query);
                    for (SubmitModel submitModel : list) {
                        PortalLister.Item item = getItem(submitModel.getFormPath(), typeEnum, submitModel.getId());
                        itemList.add(item);
                    }
                } catch (FormsPortalException e) {
                    LOGGER.error("Failed to fetch Form Submissions.", e);
                }
                break;
            case PENDING_SIGN:
                try {
                    List<PendingSignModel> list = pendingSignService.getAllPendingSign(query);
                    for (PendingSignModel pendingSignModel : list) {
                        PortalLister.Item item = getItem(pendingSignModel.getFormPath(), typeEnum, pendingSignModel.getId());
                        itemList.add(item);
                    }
                } catch (FormsPortalException e) {
                    LOGGER.error("Failed to fetch Pending Signs forms.", e);
                }
                break;
        }

        return itemList;
    }

    @Override
    public Map<String, Object> getSearchResults() {
        if (isOperationCall()) {
            return null;
        }
        return super.getSearchResults();
    }

    @Override
    public String getTitle() {
        if (isOperationCall()) {
            return null;
        }
        return super.getTitle();
    }

    @Override
    public String getLayout() {
        if (isOperationCall()) {
            return null;
        }
        return super.getLayout();
    }

    @Override
    public Integer getLimit() {
        if (isOperationCall()) {
            return null;
        }
        return super.getLimit();
    }

    private class QueryImpl implements Query {

        private StatementGroup statementGroup;
        private int offset;
        private int limit;

        public void setStatementGroup(StatementGroup statementGroup) {
            this.statementGroup = statementGroup;
        }

        public void setOffset(int offset) {
            this.offset = offset;
        }

        public void setLimit(int limit) {
            this.limit = limit;
        }

        @Override
        public StatementGroup getStatementGroup() {
            return statementGroup;
        }

        @Override
        public int getOffset() {
            return offset;
        }

        @Override
        public int getLimit() {
            return limit;
        }
    }
}
