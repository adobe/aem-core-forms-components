
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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
package com.adobe.cq.forms.core.components.models.form.print;

import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.print.ui.BarcodeEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.ButtonEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.CheckButtonEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.DateTimeEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.ImageEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.NumericEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.TextEdit;

public interface Ui {

    @Nullable
    default TextEdit getTextEdit() {
        return null;
    }

    @Nullable
    default CheckButtonEdit getCheckButton() {
        return null;
    }

    @Nullable
    default DateTimeEdit getDateTimeEdit() {
        return null;
    }

    @Nullable
    default NumericEdit getNumericEdit() {
        return null;
    }

    @Nullable
    default ImageEdit getImageEdit() {
        return null;
    }

    @Nullable
    default ButtonEdit getButton() {
        return null;
    }

    @Nullable
    default BarcodeEdit getBarcode() {
        return null;
    }

    @Nullable
    default Picture getPicture() {
        return null;
    }
}
