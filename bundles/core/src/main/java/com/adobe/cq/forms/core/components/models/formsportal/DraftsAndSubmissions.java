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
package com.adobe.cq.forms.core.components.models.formsportal;

import java.util.*;

import org.osgi.annotation.versioning.*;

public interface DraftsAndSubmissions extends PortalLister {

    /**
     * Returns type - DRAFT / SUBMISSION / PENDING_SIGN
     *
     * @return Type - DRAFT / SUBMISSION / PENDING_SIGN
     * @since com.adobe.cq.forms.core.components.models.formsportal 2.1.0
     */
    default String getType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Operation name that is to be performed.
     *
     * @return Operation name
     */
    default String getOperationName() {
        throw new UnsupportedOperationException();
    }

    /**
     * Result of performed operation.
     * 
     * @return
     */
    default Operation.OperationResult getOperationResult() {
        throw new UnsupportedOperationException();
    }

    @ProviderType
    public enum TypeEnum {
        DRAFT,
        SUBMISSION,
        PENDING_SIGN
    }

}
