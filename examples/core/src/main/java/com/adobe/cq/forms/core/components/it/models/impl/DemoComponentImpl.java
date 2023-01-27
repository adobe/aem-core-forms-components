/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
package com.adobe.cq.forms.core.components.it.models.impl;


import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.wcm.core.components.models.Container;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(
    adaptables = { SlingHttpServletRequest.class },
    adapters = { ComponentExporter.class },
    resourceType = { "forms-components-examples/components/demo/component" })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DemoComponentImpl extends AbstractComponentImpl implements Container {

  @Self(injectionStrategy = InjectionStrategy.OPTIONAL)
  protected SlingHttpServletRequest request;

  protected List<Resource> filteredChildComponents;

  @OSGiService
  private SlingModelFilter slingModelFilter;

  @OSGiService
  private ModelFactory modelFactory;

  private List<? extends ComponentExporter> childrenModels;

  private static final Logger logger = LoggerFactory.getLogger(DemoComponentImpl.class);

  public @NotNull List<ListItem> getItems() {
    logger.error("Getting Items ... ");
    if (childrenModels == null) {
      childrenModels = getChildrenModels(request, ComponentExporter.class);
    }
    return (List<ListItem>) childrenModels;
  }

  protected <T> List<T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
    List<T> models = new ArrayList<>();
    List<Resource> filteredChildrenResources = getFilteredChildrenResources();
    for (Resource child : filteredChildrenResources) {
      T model;
      if (request != null) {
        model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
      } else {
        model = child.adaptTo(modelClass);
      }
      if (model != null) {
        models.add(model);
      }
    }
    return models;
  }

  private List<Resource> getFilteredChildrenResources() {
    if (filteredChildComponents == null) {
      filteredChildComponents = new LinkedList<>();
      for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
        if (!child.getName().startsWith("fd:")) {
          filteredChildComponents.add(child);
        }
      }
    }
    return filteredChildComponents;
  }
}
