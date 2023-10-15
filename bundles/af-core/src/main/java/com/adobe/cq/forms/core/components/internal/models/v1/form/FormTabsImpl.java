package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.forms.core.components.models.form.FormTabs;
import com.adobe.cq.wcm.core.components.internal.models.v1.TabsImpl;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.adobe.cq.wcm.core.components.models.Tabs;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.annotation.Nullable;
import javax.annotation.PostConstruct;
import java.util.List;

public class FormTabsImpl extends PanelImpl implements FormTabs {

    private Tabs tabs;

    @PostConstruct
    private void initFormTabsModel() {
        tabs = new TabsImpl();
    }
    @Override
    @JsonIgnore
    public List<ListItem>  getItems() {
        return tabs.getItems();
    }

    @Override
    public String getActiveItem() {
        return tabs.getActiveItem();
    }

    @Override
    @Nullable
    public String getAccessibilityLabel() {
        return tabs.getAccessibilityLabel();
    }

}
