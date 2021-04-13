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

import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.wcm.core.components.models.Component;
import com.fasterxml.jackson.annotation.JsonIgnore;

@ConsumerType
public interface Link extends Component {
    enum AssetType {
        ADAPTIVE_FORM
    }

    default String getUrl() {
        throw new UnsupportedOperationException();
    }

    default String getTitle() {
        throw new UnsupportedOperationException();
    }

    default String getTooltip() {
        throw new UnsupportedOperationException();
    }

    @JsonIgnore
    default String getTarget() {
        throw new UnsupportedOperationException();
    }

    default AssetType getAssetType() {
        throw new UnsupportedOperationException();
    }

    default String getAssetPath() {
        throw new UnsupportedOperationException();
    }
}
