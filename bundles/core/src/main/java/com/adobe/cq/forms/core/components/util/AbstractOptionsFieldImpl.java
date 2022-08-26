/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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

import java.util.Arrays;
import java.util.Objects;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.Field;
import com.adobe.cq.forms.core.components.models.form.OptionsConstraint;

/**
 * Abstract class which can be used as base class for options {@link Field} implementations.
 */
public abstract class AbstractOptionsFieldImpl extends AbstractFieldImpl implements OptionsConstraint {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean enforceEnum;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enum")
    @Nullable
    private String[] enums; // todo: this needs to be thought through ?

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enumNames")
    @Nullable
    private String[] enumNames;

    @Override
    public boolean isEnforceEnum() {
        return enforceEnum;
    }

    @Override
    public Object[] getEnums() {
        if (enums == null) {
            return null;
        } else {
            // todo: we can only typecast to number or boolean if type is present in JCR, for array types, we need to store the type of each
            // array element in JCR
            // todo: and compute based on it (hence using typeJcr below)
            // may expose internal representation of mutable object, hence cloning
            if (Type.fromString(typeJcr).equals(Type.NUMBER) || Type.fromString(typeJcr).equals(Type.NUMBER_ARRAY)) {
                return Arrays.stream(enums)
                    .filter(Objects::nonNull)
                    .map(Integer::parseInt)
                    .toArray(Integer[]::new);
            } else if (Type.fromString(typeJcr).equals(Type.BOOLEAN) || Type.fromString(typeJcr).equals(Type.BOOLEAN_ARRAY)) {
                return Arrays.stream(enums)
                    .filter(Objects::nonNull)
                    .map(Boolean::parseBoolean)
                    .toArray(Boolean[]::new);
            } else {
                return ArrayUtils.clone(enums);
            }
        }
    }

    @Override
    public String[] getEnumNames() {
        // may expose internal representation of mutable object, hence cloning
        return ArrayUtils.clone(enumNames);
    }
}
