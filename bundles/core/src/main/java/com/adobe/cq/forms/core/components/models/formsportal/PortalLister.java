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

import java.util.List;

import org.osgi.annotation.versioning.ConsumerType;

@ConsumerType
public interface PortalLister {

    default List<Item> getResultList() {
        throw new UnsupportedOperationException();
    }

    default String getLimit() {
        throw new UnsupportedOperationException();
    }

    default Long getNextOffset() {
        throw new UnsupportedOperationException();
    }

    @ConsumerType
    public interface Item {
        default String getTitle() {
            throw new UnsupportedOperationException();
        }

        default String getDescription() {
            throw new UnsupportedOperationException();
        }

        default String getTooltip() {
            throw new UnsupportedOperationException();
        }

        default String getFormLink() {
            throw new UnsupportedOperationException();
        }
    }
}
