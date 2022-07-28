<%--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--%>
<%@page session="false" %>
<%@include file="/libs/granite/ui/global.jsp" %>
<%
    String formPath = slingRequest.getRequestPathInfo().getSuffix();
    String fieldPath = slingRequest.getParameter("fieldPath");
    String fieldId = slingRequest.getParameter("fieldId");
    String editorMode = slingRequest.getParameter("editorMode");
    if(editorMode == null) {
        editorMode = (String) slingRequest.getAttribute("editorMode");
        if(editorMode == null) {
            editorMode = "edit";
        }
    }
%>
<div id= "rule-meta-info" data-formPath= "<%= xssAPI.encodeForHTMLAttr(formPath) %>"  data-fieldPath= "<%= xssAPI.encodeForHTMLAttr(fieldPath) %>" data-fieldId = "<%= xssAPI.encodeForHTMLAttr(fieldId) %>"  data-editorMode= "<%= xssAPI.encodeForHTMLAttr(editorMode) %>" ></div>