package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

import javax.annotation.Nullable;

@ConsumerType
public interface FormTabs extends Panel {

    String getActiveItem();

    @Nullable
    String getAccessibilityLabel();
}
