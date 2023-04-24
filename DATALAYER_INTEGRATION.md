
# Data Layer Integration with the Form Core Components

The Core Components provide an out-of-the-box integration with the [Adobe Client Data Layer](https://github.com/adobe/adobe-client-data-layer), which for convenience is called data layer in this page.

## Enabling the Data Layer

The data layer is disabled by default.

To enable the data layer for your site:
1. Create the following structure below the `/conf` node:
   `<sling:configRef-path-at-jcr:content-of-form>/sling:configs/com.adobe.cq.wcm.core.components.internal.DataLayerConfig`
2. Add the `enabled` boolean property and set it to `true`.

## Preventing the Data Layer client library from being included

The data layer client library is included by default by the Page component. As there are other ways to include this library (e.g. through Adobe Launch), it might be needed to prevent its inclusion through the Page component.

To prevent the data layer client library from being included by the Page component:
1. Create the following structure below the `/conf` node:
   `<sling:configRef-path-at-jcr:content-of-form>/sling:configs/com.adobe.cq.wcm.core.components.internal.DataLayerConfig`
2. Add the `skipClientlibInclude` boolean property and set it to `true`.

## Data Layer State Structure

When the data layer is enabled, the javascript `adobeDataLayer` object is available on the page and is populated with the components and their properties that are used on the page.

The data layer state (returned by calling `adobeDataLayer.getState()`) is an object with two objects (`page` and `component`). All the components are stored below the `component` object as a flat structure. The structure looks as follows:
```
{
  "page": {
    "page-id": {
      "key1": "value1,
      "key2": "value2,
    }
  },
  "component": {
    "component-id1": {
      "key1": "value1,
      "key2": "value2,
    },
    "component-id2": {
      "key1": "value1,
      "key2": "value2,
    },
    ...
  }
}
```

Calling `adobeDataLayer.getState()` in the browser console will return e.g.:

```
{
    "page": {
        "page-12266a293b": {
            "@type": "forms-components-examples/components/page",
            "repo:modifyDate": "2023-04-24T07:08:11Z",
            "dc:title": "af2",
            "xdm:template": "/conf/core-components-examples/settings/wcm/templates/af-blank-v2",
            "xdm:language": "en",
            "xdm:tags": [],
            "repo:path": "/content/forms/af/af2.html"
        }
    },
    "component": {
        "textinput-1c7bc238a6": {
            "dc:title": "Name",
            "repo:modifyDate": "2023-04-24T07:10:10Z",
            "@type": "forms-components-examples/components/form/textinput",
            "fieldType": "text-input",
            "parentId": "page-12266a293b"
        },
        "numberinput-3bf4611d5a": {
            "dc:title": "Phone Number",
            "repo:modifyDate": "2023-04-24T07:10:26Z",
            "@type": "forms-components-examples/components/form/numberinput",
            "fieldType": "number-input",
            "parentId": "page-12266a293b"
        },
        "button-961d435b34": {
            "dc:title": "Submit Form",
            "repo:modifyDate": "2023-04-24T07:10:37Z",
            "@type": "forms-components-examples/components/form/button",
            "fieldType": "button",
            "parentId": "page-12266a293b"
        }
    }
}
```

## Form Components supporting the Data Layer

The following table shows the components supporting the data layer:

Form Components | Data Layer Support
---------- | -------------------
formContainer | x
PanelContainer | x
Accordion | x
CheckBoxGroup | x
CheckBoxGroup | x
DropDown | x
FileInput | x
FormContainer | x
NumberInput | x
RadioButton | x
TextInput | x
StaticImage | x
Button | x
Title | x

## Form Core Component Schemas

#### Component and Container Item

Schema used for all the components that are not listed below.

```
id: {                   // component ID
    @type               // resource type
    repo:modifyDate     // last modified date
    dc:title            // title
    dc:description      // description
    xdm:text            // text
    xdm:linkURL         // link URL
    parentId            // parent component ID
    fieldType           // field type
}
```

#### Page

Schema used for the Page component:

```
id: {
    @type
    repo:modifyDate
    dc:title
    dc:description
    xdm:text
    xdm:linkURL
    parentId
    xdm:tags            // page tags
    repo:path           // page path
    xdm:template        // page template
    xdm:language        // page language
}
```


## HTML attributes

When the data layer is enabled, the body element has a `data-cmp-data-layer-enabled` attribute.

The Core Components supporting the data layer have a `data-cmp-data-layer` attribute populated with the component properties as defined by the component model.

## Default Events

### Default Events

Manipulating the accordion (expand/collapse), the carousel (next/previous buttons) and the tabs (tab select) components makes the data layer trigger respectively a `cmp:show` and a `cmp:hide` event.

As soon as the data layer is populated with the core components available on the page, the data layer triggers a `cmp:loaded` event.

### DX Setup Automation Analytics Events

If the DX Setup Automation is enabled, the data layer triggers analytics event `FormFastTrackAnalyticsEvent` with following `eventName`:
1. Form renditions - triggers when a form is rendered        
2. Form submission - triggers when a form is submitted
3. Validation Errors - triggers when there is a validation error on field
4. Field Visits - triggers when a field is visited
5. Help views - triggers when a help icon is clicked
6. Abandoned Form - triggers when a form is abandoned
7. Time Spent - triggers when a form is submitted or abandoned

Other MetaData of the event are as follows:
1. Field Type - fieldType property of the component
2. Field Title - label of the component
3. Form title - title of the form
4. Panel Title - title of the panel containing the component

for more information, please visit: https://www.adobe.com/go/learn_aem_forms_integrate_adobe_analytics_forms_cs

## JSON Rendering

The JSON rendering of a Core Component exposes a `dataLayer` property that is populated with the data layer specific properties defined by the component model. E.g.:

```
"dataLayer": {
    "button-961d435b34": {
        "dc:title": "Submit Form",
        "repo:modifyDate": "2023-04-24T07:10:37Z",
        "@type": "forms-components-examples/components/form/button",
        "fieldType": "button"
    }
}
```

## Enabling the Data Layer for Custom Components

To automatically add a custom component to the data layer:
1. Define the properties of the custom component model that needs to be tracked.
1. Add the `data-cmp-data-layer` attribute to the custom component HTL. E.g. `data-cmp-data-layer="${mycomponent.data.json}"`.


The `data-cmp-data-layer-enabled` attribute can be queried client side to check if the data layer is enabled.

### Examples

This section shows how to add some data from a `HelloWorld` component to the data layer.

#### Pre-requisite: create a HelloWorld component

Create a `HelloWorld` model and HTL script that prints "Hello World!" to the page:

`HelloWorld` model:

```
package mymodels;
...
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
...

@Model(adaptables = SlingHttpServletRequest.class)
public class HelloWorld {

    @SlingObject
    protected Resource resource;

    public String getMessage() {
        return "Hello World!";
    }
}
```

`HelloWorld` HTL script:
```
<div data-sly-use.hello="mymodels.HelloWorld">
    ${hello.message}
</div>

```

Deploy the model and the HTL script to a running AEM instance and add this component to a page.
Run the following code in your browser console:
```
adobeDataLayer.getState()
```
The `HelloWorld` component does not yet write to the data layer.

#### Add HelloWorld data to the data layer

Let's add custom properties (ID, description and parent ID) based on custom implementations to the data layer.

Extend `HelloWorld` model from `AbstractFormComponentImpl`.

Add the `data-cmp-data-layer` attribute to the component HTL:
```
<div data-sly-use.hello="mymodels.HelloWorld"
     data-cmp-data-layer="${hello.data.json}">
    ${hello.message}
</div>
```

Deploy the changes to AEM (model and HTL script). Refresh the page and in your browser console, get the state of the data layer:
```
adobeDataLayer.getState()
```

It displays something like:
```
hello-123:
    dc:description: "Hello World!"
    parentId: "parent-12"
```

