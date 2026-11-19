package com.adobe.cq.forms.core.components.it.models.embed;

import com.adobe.cq.wcm.core.components.models.Component;
import org.osgi.annotation.versioning.ConsumerType;

@ConsumerType
public interface FormsEmbed extends Component {

  String getFormsUrl();
}
