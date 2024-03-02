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
%><%@ page import="java.util.HashMap,
                  org.apache.commons.lang3.StringUtils,
                  org.apache.sling.api.wrappers.ValueMapDecorator,
                  org.apache.sling.api.SlingHttpServletRequest,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.ComponentHelper,
                  com.adobe.granite.ui.components.ComponentHelper.Options,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Field,
                  com.adobe.granite.ui.components.FormData,
                  com.adobe.granite.ui.components.FormData.NameNotFoundMode,
                  com.adobe.granite.ui.components.Tag,
                  com.adobe.granite.toggle.api.ToggleRouter,
                  com.adobe.granite.ui.components.Value" %><%

ToggleRouter toggleRouter = sling.getService(ToggleRouter.class);

Config cfg = cmp.getConfig();

ValueMap vm = (ValueMap) request.getAttribute(Field.class.getName());

final String HAS_ROOT_ATTR = this.getClass().getName();
Boolean hasRoot = (Boolean) request.getAttribute(HAS_ROOT_ATTR);

if (hasRoot == null) {
    hasRoot = false;
    request.setAttribute(HAS_ROOT_ATTR, true);
}

Tag tag = cmp.consumeTag();
AttrBuilder attrs = tag.getAttrs();
cmp.populateCommonAttrs(attrs);



String fieldLabel = cfg.get("fieldLabel", String.class);
String fieldDesc = cfg.get("fieldDescription", String.class);
String labelledBy = null;

if (fieldLabel != null && fieldDesc != null) {
    labelledBy = vm.get("labelId", String.class) + " " + vm.get("descriptionId", String.class);
} else if (fieldLabel != null) {
    labelledBy = vm.get("labelId", String.class);
} else if (fieldDesc != null) {
    labelledBy = vm.get("descriptionId", String.class);
}

if (StringUtils.isNotBlank(labelledBy)) {
    attrs.add("aria-labelledby", labelledBy);
}

if (cfg.get("required", false)) {
    attrs.add("aria-required", true);
}

String validation = StringUtils.join(cfg.get("validation", new String[0]), " ");
attrs.add("data-foundation-validation", validation);
attrs.add("data-validation", validation); // Compatibility
attrs.add("min", cfg.get("min", 0));

Resource field = cfg.getChild("field");

Config fieldCfg = new Config(field);
String name = fieldCfg.get("name", String.class);
Object[] values = vm.get("value", new Object[0]); // don't convert; pass empty Object array as default value
boolean isComposite = cfg.get("composite", false);
boolean isUpAndDownRequired = cfg.get("showUpAndDownButtons", false);

attrs.add("data-granite-coral-multifield-name", name);
attrs.addBoolean("data-granite-coral-multifield-composite", isComposite);
attrs.addBoolean("reorderupdown", isUpAndDownRequired);


%><coral-multifield <%= attrs.build() %>><%
try {
		 int counter=0;
	
         Resource contentResource = getContentResource(slingRequest, name);
		 if (contentResource != null) {
		  for (Resource item : contentResource.getChildren()) {
				counter++;
		 }}
		 if (contentResource != null && counter>0) {
                int index = 0;
                for (Resource item : contentResource.getChildren()) {
                    %><coral-multifield-item>
                        <coral-multifield-item-content><% include(field, item, cmp, slingRequest, index++); %></coral-multifield-item-content>
                    </coral-multifield-item><%
                }}else{ %><coral-multifield-item>
                        <coral-multifield-item-content><% include(field, cmp, slingRequest); %></coral-multifield-item-content>
                    </coral-multifield-item>
					<coral-multifield-item>
                        <coral-multifield-item-content><% include(field, cmp, slingRequest); %></coral-multifield-item-content>
                    </coral-multifield-item>
					<coral-multifield-item>
                        <coral-multifield-item-content><% include(field, cmp, slingRequest); %></coral-multifield-item-content>
                    </coral-multifield-item>
			
         <%
				
			}
		 
    %>
    <template coral-multifield-template><% include(field, cmp, slingRequest); %></template><%

    if (!StringUtils.isBlank(name)) {
        if (cfg.get("deleteHint", true) && !hasRoot) {
            AttrBuilder deleteAttrs = new AttrBuilder(request, xssAPI);
            deleteAttrs.addClass("foundation-field-related");
            deleteAttrs.add("type", "hidden");
            deleteAttrs.add("name", name + "@Delete");

            %><input <%= deleteAttrs.build() %>><%
        }

        String typeHint = cfg.get("typeHint", String.class);
        if (!StringUtils.isBlank(typeHint)) {
            AttrBuilder typeAttrs = new AttrBuilder(request, xssAPI);
            typeAttrs.addClass("foundation-field-related");
            typeAttrs.add("type", "hidden");
            typeAttrs.add("name", name + "@TypeHint");
            typeAttrs.add("value", typeHint);

            %><input <%= typeAttrs %>><%
        }
    }
} finally {
    if (!hasRoot) {
        request.removeAttribute(HAS_ROOT_ATTR);
    }
}
%></coral-multifield><%!

/**
 * Includes the field with no value set at all.
 */
@SuppressWarnings({ "deprecation", "null" })
private static void include(Resource field, ComponentHelper cmp, SlingHttpServletRequest request) throws Exception {
    FormData.push(request, new ValueMapDecorator(new HashMap<String, Object>()), NameNotFoundMode.IGNORE_FRESHNESS);

    // Setting the attributes below is superceded by FormData above, but maintained for compatibility
    ValueMap existingVM = (ValueMap) request.getAttribute(Value.FORM_VALUESS_ATTRIBUTE);
    String existingPath = (String) request.getAttribute(Value.CONTENTPATH_ATTRIBUTE);

    request.removeAttribute(Value.FORM_VALUESS_ATTRIBUTE);
    request.removeAttribute(Value.CONTENTPATH_ATTRIBUTE);

    cmp.include(field, new Options().rootField(false));

    FormData.pop(request);
    request.setAttribute(Value.FORM_VALUESS_ATTRIBUTE, existingVM);
    request.setAttribute(Value.CONTENTPATH_ATTRIBUTE, existingPath);
}

/**
 * Includes the field with the given values set.
 */
@SuppressWarnings({ "deprecation", "null" })
private static void include(Resource field, ValueMap vm, ComponentHelper cmp, SlingHttpServletRequest request) throws Exception {
    FormData formData = FormData.from(request);
    NameNotFoundMode mode = NameNotFoundMode.IGNORE_FRESHNESS;
    if (formData != null) {
        mode = formData.getMode();
    }
    FormData.push(request, vm, mode); // The mode is irrelevant actually, as the name-value pair is always set.

    // Setting the attribute below is superceded by FormData above, but maintained for compatibility
    ValueMap existing = (ValueMap) request.getAttribute(Value.FORM_VALUESS_ATTRIBUTE);
    request.setAttribute(Value.FORM_VALUESS_ATTRIBUTE, vm);

    cmp.include(field, new Options().rootField(false));

    FormData.pop(request);
    request.setAttribute(Value.FORM_VALUESS_ATTRIBUTE, existing);
}

/**
 * Includes the field for composite multifield.
 */
@SuppressWarnings({ "deprecation", "null" })
private static void include(Resource field, Resource item, ComponentHelper cmp, SlingHttpServletRequest request, int index) throws Exception {
    FormData formData = FormData.from(request);
    NameNotFoundMode mode = NameNotFoundMode.IGNORE_FRESHNESS;
    if (formData != null) {
        mode = formData.getMode();
    }
    FormData.push(request, item.getValueMap(), mode);

    ValueMap existingVM = (ValueMap) request.getAttribute(Value.FORM_VALUESS_ATTRIBUTE);
    String existingPath = (String) request.getAttribute(Value.CONTENTPATH_ATTRIBUTE);

    request.setAttribute(Value.CONTENTPATH_ATTRIBUTE, item.getPath());
    request.setAttribute(Value.FORM_VALUESS_ATTRIBUTE, item.getValueMap());
    request.setAttribute("multifield_composite", true);
    request.setAttribute("multifield_index", index);

    cmp.include(field, new Options().rootField(false));

    FormData.pop(request);
    request.setAttribute(Value.FORM_VALUESS_ATTRIBUTE, existingVM);
    request.setAttribute(Value.CONTENTPATH_ATTRIBUTE, existingPath);
    request.removeAttribute("multifield_composite");
    request.removeAttribute("multifield_index");
}

/**
 * Returns the content resource based on the given name.
 */
private static Resource getContentResource(SlingHttpServletRequest slingRequest, String name) {
    @SuppressWarnings("deprecation")
    String contentPath = (String) slingRequest.getAttribute(Value.CONTENTPATH_ATTRIBUTE);
    if (contentPath != null) {
        return slingRequest.getResourceResolver().getResource(contentPath + "/" + name);
    }
    return null;
}

/**
 * Creates a single entry value map with the given name and value.
 */
private static ValueMap createValueMap(String name, Object value) {
    ValueMap map = new ValueMapDecorator(new HashMap<String, Object>());
    map.put(name, value);

    return map;
}
%>