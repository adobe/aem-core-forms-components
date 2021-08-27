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

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aem.formsndocuments.assets.models.AdaptiveFormAsset;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.components.models.formsportal.Operation;
import com.adobe.cq.forms.core.components.models.formsportal.OperationManager;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.models.DraftModel;
import com.adobe.fd.fp.api.models.SubmitModel;
import com.adobe.fd.fp.api.service.DraftService;
import com.adobe.fd.fp.api.service.PendingSignService;
import com.adobe.fd.fp.api.service.SubmitService;
import com.adobe.forms.foundation.usc.model.Query;
import com.adobe.forms.foundation.usc.model.Statement;
import com.adobe.forms.foundation.usc.model.StatementGroup;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    private static final String DRAFT_LINK = "service://FP/draft/%s";
    private static final String TOOLTIP = "Open";
    private static final String OPERATION = "operation";

    private static final Logger LOGGER = LoggerFactory.getLogger(DraftsAndSubmissionsImpl.class);

    private SimpleDateFormat dateFormatter = new SimpleDateFormat("hh:mm:ss dd-M-yy");

    @Self
    @Required
    private SlingHttpServletRequest request;

    @SlingObject
    private ResourceResolver resolver;

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

    private PortalLister.Item getItem(final String formPath, final TypeEnum typeEnum, final String id, final String timeInfo) {
        String title = "<Non Existent Form>";
        String description = null;
        String thubmnail = null;
        String formLink = null;

        ResourceResolver resourceResolver = request.getResourceResolver();
        String formAssetPath = GuideUtils.convertGuideContainerPathToFMAssetPath(formPath);
        Resource formAssetResource = resourceResolver.getResource(formAssetPath);
        if (formAssetResource != null) {
            AdaptiveFormAsset asset = formAssetResource.adaptTo(AdaptiveFormAsset.class);
            title = asset.getTitle();
            description = asset.getDescription();
            thubmnail = asset.getThumbnailPath();
            formLink = asset.getRenderLink();

            if (TypeEnum.DRAFT == typeEnum) {
                try {
                    URI newLink = new URIBuilder(formLink).addParameter("dataRef", String.format(DRAFT_LINK, id)).build();
                    formLink = newLink.toString();
                } catch (URISyntaxException e) {
                    LOGGER.error("[FP] Could not parse render link", e);
                }
            }
        }

        PortalListerImpl.Item item = new PortalListerImpl.Item();
        item.setTitle(title);
        item.setDescription(description);
        item.setFormLink(formLink);
        item.setTooltip(TOOLTIP);
        item.setFormThumbnail(thubmnail);
        item.setId(id);
        item.setOperations(operationManager.getOperationList(typeEnum));
        item.setTimeInfo(timeInfo);
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
        return operation.execute(request.getParameter(Operation.OPERATION_MODEL_ID));
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

        // Add information about currently logged in user
        StatementImpl currentUserStatement = new StatementImpl();
        currentUserStatement.setAttributeName("owner");
        currentUserStatement.setAttributeValue(resolver.getUserID());
        currentUserStatement.setOperator(Statement.Operator.EQUALS);
        StatementGroupImpl stmtGroup = new StatementGroupImpl();
        stmtGroup.addStatement(currentUserStatement);
        query.setStatementGroup(stmtGroup);

        switch (typeEnum) {
            case DRAFT:
                try {
                    List<DraftModel> list = draftService.getAllDraft(query);
                    for (DraftModel draftModel : list) {
                        PortalLister.Item item = getItem(draftModel.getFormPath(), typeEnum, draftModel.getId(),
                            dateFormatter.format(draftModel.getLastModifiedTime().getTime()));
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
                        PortalLister.Item item = getItem(submitModel.getFormPath(), typeEnum, submitModel.getId(),
                            dateFormatter.format(submitModel.getLastModifiedTime().getTime()));
                        itemList.add(item);
                    }
                } catch (FormsPortalException e) {
                    LOGGER.error("Failed to fetch Form Submissions.", e);
                }
                break;
        }

        // might create holes during pagination
        return itemList.stream().filter(Objects::nonNull).collect(Collectors.toList());
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
    @JsonIgnore
    public Integer getLimit() {
        if (isOperationCall()) {
            return null;
        }
        return super.getLimit();
    }

    private static class QueryImpl implements Query {

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

    private static class StatementImpl implements Statement {

        private String attributeName;
        private String attributeValue;
        private Operator operator;

        public void setAttributeName(String attributeName) {
            this.attributeName = attributeName;
        }

        public void setAttributeValue(String attributeValue) {
            this.attributeValue = attributeValue;
        }

        public void setOperator(Operator operator) {
            this.operator = operator;
        }

        @Override
        public String getAttributeName() {
            return attributeName;
        }

        @Override
        public String getAttributeValue() {
            return attributeValue;
        }

        @Override
        public Operator getOperator() {
            return operator;
        }
    }

    private static class StatementGroupImpl implements StatementGroup {

        private List<Statement> statements = new ArrayList<>();

        public void addStatement(Statement statement) {
            this.statements.add(statement);
        }

        @Override
        public List<Statement> getStatements() {
            return this.statements;
        }

        @Override
        public JoinOperator getJoinOperator() {
            return null;
        }
    }
}
