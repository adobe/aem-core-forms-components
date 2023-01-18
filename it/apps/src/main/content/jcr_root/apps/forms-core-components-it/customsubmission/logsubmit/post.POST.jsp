<%@include file="/libs/fd/af/components/guidesglobal.jsp" %>
<%@page import="com.adobe.aemds.guide.model.FormSubmitInfo,
                com.adobe.aemds.guide.service.FormSubmitActionManagerService,
                com.adobe.aemds.guide.servlet.GuideSubmitServlet" %>

<%@ page import="com.adobe.aemds.guide.utils.GuideSubmitUtils" %>
<%@ page import="com.adobe.aemds.guide.utils.GuideUtils" %>
<%@ page import="com.adobe.forms.common.submitutils.CustomResponse" %>

<%@ page import="org.apache.http.Header" %>
<%@ page import="org.apache.http.HttpEntity" %>
<%@ page import="org.apache.http.HttpResponse" %>
<%@ page import="org.apache.http.HttpStatus" %>
<%@ page import="org.apache.http.client.HttpClient" %>
<%@ page import="org.apache.http.client.methods.HttpPost" %>
<%@ page import="org.apache.http.client.utils.URLEncodedUtils" %>
<%@ page import="org.apache.http.entity.ContentType" %>
<%@ page import="org.apache.http.entity.mime.MultipartEntity" %>
<%@ page import="org.apache.http.entity.mime.MultipartEntityBuilder" %>
<%@ page import="org.apache.http.entity.mime.content.InputStreamBody" %>
<%@ page import="org.apache.http.impl.client.DefaultHttpClient" %>
<%@ page import="org.apache.http.util.EntityUtils" %>

<%@ page import="org.apache.sling.api.SlingHttpServletResponse" %>
<%@ page import="org.slf4j.Logger" %>

<%@ page import="org.slf4j.LoggerFactory" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Set" %>

<%!

    private final Logger log = LoggerFactory.getLogger(getClass());

%>


<%@taglib prefix="sling" uri="http://sling.apache.org/taglibs/sling/1.0" %>
<%
%>
<%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %>
<sling:defineObjects/>
<%
    Map<String,String> redirectParameters;
    FormSubmitActionManagerService submitActionServiceManager = sling.getService(FormSubmitActionManagerService.class);
    FormSubmitInfo submitInfo = (FormSubmitInfo) request.getAttribute(GuideConstants.FORM_SUBMIT_INFO);
    Map<String, Object> resultMap = submitActionServiceManager.submit(submitInfo, Boolean.FALSE);
    GuideSubmitUtils.handleValidationError(request, response, resultMap);
    if (response.getStatus() == response.SC_OK) {
        redirectParameters = GuideSubmitUtils.getRedirectParameters(slingRequest);
        if(redirectParameters==null) {
            redirectParameters = new HashMap<String, String>();
        }
        if (resultMap != null) {
            if (!(Boolean)resultMap.get(GuideConstants.FORM_SUBMISSION_COMPLETE)) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "There was an issue in submitting the form.");
                log.error("There was an issue in submitting the form.");
            }
            for (Map.Entry<String, Object> stringObjectEntry : resultMap.entrySet()) {
                if (!GuideConstants.FORM_SUBMISSION_COMPLETE.equals(stringObjectEntry.getKey())) {
                    if(stringObjectEntry.getValue() != null) {
                        redirectParameters.put(stringObjectEntry.getKey(), stringObjectEntry.getValue().toString());
                    }
                }
            }
        }
        GuideSubmitUtils.setRedirectParameters(slingRequest,redirectParameters);
    }

%>