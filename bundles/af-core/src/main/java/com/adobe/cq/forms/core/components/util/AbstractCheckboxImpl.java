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
package com.adobe.cq.forms.core.components.util;

import javax.annotation.PostConstruct;

import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.forms.core.components.models.form.Base;

/**
 * Abstract class which can be used as base class for {@link Base} implementations.
 */
public abstract class AbstractCheckboxImpl extends AbstractOptionsFieldImpl {

    // when a checkbox is not checked, it will still have a value representing its unchecked state, rather than having
    // a null value. This configuration allows for a distinct value when the checkbox is in an unchecked state.
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enableUncheckedValue")
    protected Boolean enableUncheckedValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private String checkedValue;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private String uncheckedValue;

    @PostConstruct
    public void initBaseCheckboxModel() {
        if (!Type.BOOLEAN.equals(type)) {
            if (Boolean.TRUE.equals(enableUncheckedValue)) {
                enums = new String[] { checkedValue, uncheckedValue };
            } else {
                enums = new String[] { checkedValue };
            }
        }
    }

    @Override
    public Object[] getEnums() {
        if (enums == null) {
            return null;
        } else {
            return ComponentUtils.coerce(type, enums);
        }
    }
}