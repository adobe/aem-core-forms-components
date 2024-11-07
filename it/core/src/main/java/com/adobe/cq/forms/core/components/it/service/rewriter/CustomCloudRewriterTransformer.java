package com.adobe.cq.forms.core.components.it.service.rewriter;

import org.apache.sling.rewriter.DefaultTransformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

@Component(
    service = TransformerFactory.class,
    property = {
        "pipeline.type=" + CustomCloudRewriterTransformer.TYPE,
    }
)
public class CustomCloudRewriterTransformer implements TransformerFactory {

  private static final Logger log = LoggerFactory.getLogger(CustomCloudRewriterTransformer.class);

  public static final String TYPE = "custom-linkrewriter";

  public static final String PATH_PREFIX = "custom";


  @Reference
  private CustomRunModeConfiguration customRunModeConfiguration;

  @Override
  public TransformerImpl createTransformer() {
    String runmode = customRunModeConfiguration.getRunMode();
    log.info("current runmode = " + runmode);
    boolean isPublish = "publish".equals(runmode);
    return new TransformerImpl(isPublish);
  }


  protected static class TransformerImpl extends DefaultTransformer {

    private final boolean isPublish;

    public TransformerImpl(boolean isPublish) {
      super();
      this.isPublish = isPublish;
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes)
        throws SAXException {
      AttributesImpl mutableAttributes =
          attributes instanceof AttributesImpl ? (AttributesImpl) attributes
              : null;
      if (isPublish) {
        if ("link".equals(localName)) {
          mutableAttributes = mutableAttributes != null ? mutableAttributes : new AttributesImpl(attributes);
          replaceLinkPaths(mutableAttributes);
        } else if ("script".equals(localName)) {
          mutableAttributes = mutableAttributes != null ? mutableAttributes : new AttributesImpl(attributes);
          replaceScriptPaths(mutableAttributes);
        }
      }
      super.startElement(uri, localName, qName,
          mutableAttributes != null ? mutableAttributes : attributes);
    }

    private void replaceLinkPaths(AttributesImpl attributes) {
      if (attributes.getIndex("href") >= 0 && attributes.getIndex("rel") >= 0) {
        String rel = attributes.getValue("rel");
        if ("preload stylesheet".equals(rel) || "stylesheet".equals(rel)) {
          int index = attributes.getIndex("href");
          String value = attributes.getValue(index);
          setAttribute(attributes, index, addPathPrefix(value));
        }
      }
    }

    private void replaceScriptPaths(AttributesImpl attributes) {
      if (attributes.getIndex("src") >= 0) {
        int index = attributes.getIndex("src");
        String value = attributes.getValue(index);
        setAttribute(attributes, index, addPathPrefix(value));
      }
    }

    private String addPathPrefix(String url) {
      return "/" + PATH_PREFIX + url;
    }

    private void setAttribute(AttributesImpl attributes, int index, String value) {
      String attrUri = attributes.getURI(index);
      String attrLocalName = attributes.getLocalName(index);
      String attrQName = attributes.getQName(index);
      String attrType = attributes.getType(index);
      attributes.setAttribute(index, attrUri, attrLocalName, attrQName, attrType, value);
    }
  }
}
