<%--
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
--%><%
%><%@ include file="/libs/granite/ui/global.jsp" %><%
%><%@ page session="false"
          import="org.apache.commons.lang3.StringUtils,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Field,
                  javax.servlet.http.*,
                  com.adobe.granite.ui.components.Tag" %>
                  <%
                  HttpSession session = request.getSession(true);
                      Integer fieldNum = (Integer) session.getAttribute("fieldNum");
                      if (fieldNum == null) {
                          fieldNum = 0;
                      }
    String[] arrayCalendar={"Day","Month","Year"};
    Config cfg = cmp.getConfig();
    ValueMap vm = (ValueMap) request.getAttribute(Field.class.getName());
    Field field = new Field(cfg);
    boolean isMixed = field.isMixed(cmp.getValue());
    Tag tag = cmp.consumeTag();
    AttrBuilder attrs = tag.getAttrs();
    cmp.populateCommonAttrs(attrs);
    String val="";
    if(fieldNum==3){
    fieldNum=0;
    }else{
    if(vm.get("value", String.class).equals("")){
    val=arrayCalendar[fieldNum];
    }
    if(!vm.get("value", String.class).equals("")){
    val=vm.get("value", String.class);
    }
     fieldNum++;
    }
 session.setAttribute("fieldNum", fieldNum);
   out.print(i18n.getVar(val));
    attrs.add("type", "hidden");
    attrs.add("name", cfg.get("name", String.class));
    attrs.add("placeholder", i18n.getVar(cfg.get("emptyText", String.class)));
    attrs.add("aria-label", i18n.getVar(cfg.get("emptyText", String.class)));
    attrs.addDisabled(cfg.get("disabled", false));
    attrs.add("autocomplete", cfg.get("autocomplete", String.class));
    attrs.addBoolean("autofocus", cfg.get("autofocus", false));

    if (isMixed) {
        attrs.addClass("foundation-field-mixed");
        attrs.add("placeholder", i18n.get("<Mixed Entries>"));
        attrs.add("aria-label", i18n.get("<Mixed Entries>"));
    } else {
        attrs.add("value",val);
    }
    attrs.add("maxlength", cfg.get("maxlength", Integer.class));
    if (cfg.get("required", false)) {
        attrs.add("aria-required", true);
    }
    String validation = StringUtils.join(cfg.get("validation", new String[0]), " ");
    attrs.add("data-foundation-validation", validation);
    attrs.add("data-validation", validation); // Compatibility
    // @coral
    attrs.add("is", "coral-textfield");
%><input <%= attrs.build() %>>