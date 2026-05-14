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

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the {@code SignatureStep} Sling Model used for the
 * {@code /apps/core/fd/components/form/signaturestep} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.12.4
 */
@ConsumerType
public interface SignatureStep extends Base {

    /**
     * Returns the signing service configured for this step (e.g. "echosign" for Adobe Sign).
     *
     * @return the signing service identifier
     * @since com.adobe.cq.forms.core.components.models.form 5.12.4
     */
    @JsonIgnore
    String getSigningService();

    /**
     * Returns the Adobe Sign cloud service configuration path.
     *
     * @return cloud service config path, or empty string if not configured
     * @since com.adobe.cq.forms.core.components.models.form 5.12.4
     */
    @JsonIgnore
    String getCloudServiceConfig();

    /**
     * Returns the template message displayed inside the signing area.
     *
     * @return display message, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.12.4
     */
    @JsonIgnore
    String getDisplayMsg();

    /**
     * Returns the Adobe Sign agreement target version.
     *
     * @return target version string, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.12.4
     */
    @JsonIgnore
    String getTargetVersion();
}
