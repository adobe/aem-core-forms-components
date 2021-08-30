/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
package com.adobe.cq.forms.core.components.models.formcontainer;

import java.util.Map;

import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.wcm.core.components.models.Component;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the {@code FormContainer} Sling Model used for the {@code /apps/core/fd/components/formcontainer} component.
 *
 * @since com.adobe.cq.forms.core.components.models.formcontainer 0.0.1
 */
@ConsumerType
public interface FormContainer extends Component {

    /**
     * Name of the resource property that defines the thank you config.
     *
     * @since com.adobe.cq.forms.core.components.models.formcontainer 0.0.1
     */
    String PN_RUNTIME_DOCUMENT_PATH = "formRuntimeDocumentPath";

    /**
     * Returns the document path
     *
     * @return the document path, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.formcontainer 0.0.1;
     */
    @JsonIgnore
    default String getDocumentPath() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the form runtime model
     *
     * @return the form runtime model, if document path was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.formcontainer 0.0.1;
     */
    default Map<String, Object> getModel() {
        throw new UnsupportedOperationException();
    }

    default String getPath() {
        throw new UnsupportedOperationException();
    }

}
