package com.adobe.cq.forms.core.components.it.service.rewriter;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Runmode OSGI Configuration", description = "Configuration for Identifying Run Mode")
public @interface CustomRunMode {

  @AttributeDefinition(name = "Runmode Information", description = "Runmode Info")
  String runmode_info() default "default";
}
