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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal.draftsandsubmissions;

import java.util.Calendar;
import java.util.Collections;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import com.adobe.aem.formsndocuments.assets.models.AdaptiveFormAsset;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.services.formsportal.DiscardDraftOperation;
import com.adobe.cq.forms.core.components.internal.services.formsportal.OpenDraftOperation;
import com.adobe.cq.forms.core.components.internal.services.formsportal.OperationManagerImpl;
import com.adobe.cq.forms.core.components.models.formsportal.DraftsAndSubmissions;
import com.adobe.cq.forms.core.components.models.services.formsportal.OperationManager;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.adobe.fd.fp.api.models.DraftModel;
import com.adobe.fd.fp.api.models.SubmitModel;
import com.adobe.fd.fp.api.service.DraftService;
import com.adobe.fd.fp.api.service.SubmitService;
import com.adobe.forms.foundation.usc.model.Query;
import com.adobe.forms.foundation.usc.model.Statement;
import com.adobe.forms.foundation.usc.model.Statement.Operator;
import com.adobe.forms.foundation.usc.model.StatementGroup;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class DraftsAndSubmissionsImplTest {
    private static final String TEST_BASE = "/draftsandsubmission";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fpdns";
    private static final String DRAFT_COMPONENT_PATH = ROOT_PAGE + "/dns-draft-v1";
    private static final String SUBMISSION_COMPONENT_PATH = ROOT_PAGE + "/dns-submission-v1";
    private static final String DEFAULT_COMPONENT_PATH = ROOT_PAGE + "/dns-default-v1";
    private static final String SAMPLE_FORM = CONTENT_ROOT + "/dam/formsanddocuments/sample-form";
    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private DraftService draftService;
    private DraftModel draftModel;
    private SubmitService submitService;
    private SubmitModel submitModel;
    private OperationManager operationManager;

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        draftService = Mockito.mock(DraftService.class);
        draftModel = Mockito.spy(new DraftModel());
        draftModel.setDraftId("abc123");

        submitService = Mockito.mock(SubmitService.class);
        submitModel = Mockito.spy(new SubmitModel());
        submitModel.setSubmitId("abc123");

        operationManager = new OperationManagerImpl();
        context.registerInjectActivateService(operationManager);
        try {
            Mockito.when(draftService.getAllDraft(Mockito.any())).thenReturn(Collections.singletonList(draftModel));
            Mockito.when(submitService.getAllSubmission(Mockito.any())).thenReturn(Collections.singletonList(submitModel));
        } catch (FormsPortalException e) {
            e.printStackTrace();
        }
        context.registerService(DraftService.class, draftService);
        context.registerService(SubmitService.class, submitService);
    }

    @Test
    public void testExportedType() {
        DraftsAndSubmissions component = getInstanceUnderTest(DRAFT_COMPONENT_PATH);
        Assertions.assertEquals("core/fd/components/formsportal/draftsandsubmissions/v1/draftsandsubmissions", component.getExportedType());
    }

    @Test
    public void testExportedDraftJson() {
        Mockito.when(draftModel.getLastModifiedTime()).thenReturn(new Calendar.Builder().setInstant(12345678)
            .build());
        Mockito.when(draftModel.getFormPath()).thenReturn(SAMPLE_FORM);
        Resource afDamRes = context.resourceResolver().getResource(SAMPLE_FORM);
        AdaptiveFormAsset mockAsset = getMockAFAssetOf(afDamRes);
        context.registerAdapter(Resource.class, AdaptiveFormAsset.class, mockAsset);
        context.registerInjectActivateService(new OpenDraftOperation());
        context.registerInjectActivateService(new DiscardDraftOperation());

        DraftsAndSubmissions component = getInstanceUnderTest(DRAFT_COMPONENT_PATH);
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(TEST_BASE, DRAFT_COMPONENT_PATH));
    }

    @Test
    public void testExportedSubmissionJson() {
        Mockito.when(submitModel.getLastModifiedTime()).thenReturn(new Calendar.Builder().setInstant(12345678)
            .build());
        Mockito.when(submitModel.getFormPath()).thenReturn(SAMPLE_FORM);
        Resource afDamRes = context.resourceResolver().getResource(SAMPLE_FORM);
        AdaptiveFormAsset mockAsset = getMockAFAssetOf(afDamRes);
        context.registerAdapter(Resource.class, AdaptiveFormAsset.class, mockAsset);

        DraftsAndSubmissions component = getInstanceUnderTest(SUBMISSION_COMPONENT_PATH);
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(TEST_BASE, SUBMISSION_COMPONENT_PATH));
    }

    @Test
    public void testMainInterface() {
        DraftsAndSubmissions component = Mockito.mock(DraftsAndSubmissions.class);

        Mockito.when(component.getType()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getType);
    }

    @Test
    public void testDefaultTitle() {
        DraftsAndSubmissions component = getInstanceUnderTest(DEFAULT_COMPONENT_PATH);
        Assertions.assertEquals("Drafts", component.getTitle());
    }

    @Test
    public void testException() throws FormsPortalException {
        Resource afDamRes = context.resourceResolver().getResource(SAMPLE_FORM);
        AdaptiveFormAsset mockAsset = getMockAFAssetOf(afDamRes, true);
        context.registerAdapter(Resource.class, AdaptiveFormAsset.class, mockAsset);

        Mockito.when(draftModel.getLastModifiedTime()).thenReturn(new Calendar.Builder().setInstant(12345678)
            .build());
        Mockito.when(draftModel.getFormPath()).thenReturn(SAMPLE_FORM);

        // to assert private getters inside QueryImpl, StatementImpl and StatementGroup Impl
        Mockito.when(draftService.getAllDraft(Mockito.any())).then(new Answer<List<DraftModel>>() {
            @Override
            public List<DraftModel> answer(InvocationOnMock invocation) throws Throwable {
                Query q = (Query) invocation.getArgument(0);
                Assert.assertEquals(8, q.getLimit());
                Assert.assertEquals(0, q.getOffset());
                Assert.assertNotNull(q.getStatementGroup());

                StatementGroup sg = q.getStatementGroup();
                Assert.assertNull(sg.getJoinOperator());
                Assert.assertEquals(1, sg.getStatements().size());

                Statement stmt = sg.getStatements().get(0);
                Assert.assertNotNull(stmt);
                Assert.assertEquals("owner", stmt.getAttributeName());
                Assert.assertEquals("admin", stmt.getAttributeValue());
                Assert.assertEquals(Operator.EQUALS, stmt.getOperator());
                return Collections.singletonList(draftModel);
            }
        });

        DraftsAndSubmissions component = getInstanceUnderTest(DEFAULT_COMPONENT_PATH);
        Assert.assertEquals(2, component.getElements().size());
    }

    private DraftsAndSubmissions getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(DraftsAndSubmissions.class);
    }

    private AdaptiveFormAsset getMockAFAssetOf(Resource res) {
        return getMockAFAssetOf(res, false);
    }

    private AdaptiveFormAsset getMockAFAssetOf(Resource res, boolean invalidLink) {
        AdaptiveFormAsset mockAsset = Mockito.mock(AdaptiveFormAsset.class);
        ValueMap vm = res.getChild("jcr:content/metadata").getValueMap();
        if (invalidLink) {
            Mockito.when(mockAsset.getRenderLink()).thenReturn("/render/link/by/backend with spaces to make it invalid/api");
        } else {
            Mockito.when(mockAsset.getRenderLink()).thenReturn("/render/link/by/backend/api");
        }
        Mockito.when(mockAsset.getTitle()).thenReturn(vm.get("title", "Form Title"));
        Mockito.when(mockAsset.getDescription()).thenReturn(vm.get("description", "Form Description"));
        Mockito.when(mockAsset.getThumbnailPath()).thenReturn("/thumbnail/path/by/backend");
        return mockAsset;
    }
}
