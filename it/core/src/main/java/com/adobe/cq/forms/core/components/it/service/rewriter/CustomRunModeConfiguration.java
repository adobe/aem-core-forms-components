package com.adobe.cq.forms.core.components.it.service.rewriter;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

@Component(
    service = CustomRunModeConfiguration.class
)
public class CustomRunModeConfiguration {

  private CustomRunMode customRunMode;

  @Activate
  public void activate(CustomRunMode customRunMode) {
    this.customRunMode = customRunMode;
  }

  public String getRunMode() {
    if (customRunMode != null) {
      return customRunMode.runmode_info();
    } else {
      return "default";
    }
  }
}
