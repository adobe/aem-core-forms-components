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

package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form {@code TermsAndConditions} Sling Model used for the
 * {@code /apps/core/fd/components/form/termsandconditions/v1/termsandconditions} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 4.5.0
 */
@ConsumerType
public interface TermsAndConditions extends Container, ContainerConstraint {

    String FD_TERMS_AND_CONDITIONS = "fd:tnc";

    /**
     *
     * @return {@code true} if approval checkbox should be shown, otherwise {@code false}
     */
    boolean isShowApprovalOption();

    /**
     *
     * @return {@code true} if links to external Terms & Conditions pages are to be shown, otherwise
     *         {@code false if consent text is to be shown}
     */
    boolean isShowLink();

    /**
     *
     * @return @return {@code true} if the content is to be shown as pop-up , otherwise {@code false}
     */
    boolean isShowAsPopup();
}
