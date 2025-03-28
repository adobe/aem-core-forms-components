
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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form.print;

import com.adobe.cq.forms.core.components.models.form.print.Picture;
import com.adobe.cq.forms.core.components.models.form.print.Ui;
import com.adobe.cq.forms.core.components.models.form.print.ui.BarcodeEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.ButtonEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.CheckButtonEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.DateTimeEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.ImageEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.NumericEdit;
import com.adobe.cq.forms.core.components.models.form.print.ui.TextEdit;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.BarcodeEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.ButtonEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.CheckButtonEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.DateTimeEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.ImageEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.NumericEditImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.ui.TextEditImpl;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UiImpl implements Ui {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private TextEditImpl textEdit;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CheckButtonEditImpl checkButton;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DateTimeEditImpl dateTimeEdit;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private NumericEditImpl numericEdit;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ImageEditImpl imageEdit;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private PictureImpl picture;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ButtonEditImpl button;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BarcodeEditImpl barcode;

    @Override
    public TextEdit getTextEdit() {
        return textEdit;
    }

    @Override
    public CheckButtonEdit getCheckButton() {
        return checkButton;
    }

    @Override
    public DateTimeEdit getDateTimeEdit() {
        return dateTimeEdit;
    }

    @Override
    public NumericEdit getNumericEdit() {
        return numericEdit;
    }

    @Override
    public ImageEdit getImageEdit() {
        return imageEdit;
    }

    @Override
    public Picture getPicture() {
        return picture;
    }

    @Override
    public ButtonEdit getButton() {
        return button;
    }

    @Override
    public BarcodeEdit getBarcode() {
        return barcode;
    }

    public static Ui fromString(String ui) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(ui, UiImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }

}
