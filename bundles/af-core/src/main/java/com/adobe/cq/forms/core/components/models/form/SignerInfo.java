/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

@ConsumerType
public interface SignerInfo {

    /**
     * Check if first signer form filler
     *
     * @return the firstSignerFormFiller
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String getFirstSignerFormFiller();

    /**
     * Returns the workflow type
     *
     * @return the signer's email
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String getWorkflowType();

    /**
     * Returns the signer
     *
     * @return the signer
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    String[] getSigners();

}
