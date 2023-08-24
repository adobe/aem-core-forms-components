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
package com.adobe.cq.forms.core.components.internal.form;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;

@Model(
    adaptables = { SlingHttpServletRequest.class },
    adapters = FormClientLibManager.class)
public class FormClientLibManagerImpl implements FormClientLibManager {

    @SlingObject(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private SlingHttpServletRequest request;

    public static final String REQ_ATTR_CLIENT_LIBS = "clientLibs";

    @Override
    public void addClientLibRef(@NotNull String clientLibRef) {
        if (request == null) {
            return;
        }
        Set<String> clientLibSet = (Set<String>) request.getAttribute(REQ_ATTR_CLIENT_LIBS);
        if (clientLibSet == null) {
            clientLibSet = new HashSet<>();
            request.setAttribute(REQ_ATTR_CLIENT_LIBS, clientLibSet);
        }
        clientLibSet.add(clientLibRef);
    }

    @Override
    public List<String> getClientLibRefList() {
        if (request != null && request.getAttribute(REQ_ATTR_CLIENT_LIBS) != null) {
            Set<String> clientLibSet = (Set<String>) request.getAttribute(REQ_ATTR_CLIENT_LIBS);
            return new ArrayList<>(clientLibSet);
        }
        return new ArrayList<>();
    }
}
