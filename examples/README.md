# AEM Forms Core Components Library

This folder contains the projects required to build the Form Components Library that extends the [WCM Core Components Library](https://www.aemcomponents.dev/) with the forms components.

## Prerequisites

The Forms Components Library must be installed on top of the WCM Core Components Library, so **make sure** you first install both the latest [ui.content](https://repo1.maven.org/maven2/com/adobe/cq/core.wcm.components.examples.ui.content/2.10.0/core.wcm.components.examples.ui.content-2.10.0.zip) and [ui.apps](https://repo1.maven.org/maven2/com/adobe/cq/core.wcm.components.examples.ui.apps/2.10.0/core.wcm.components.examples.ui.apps-2.10.0.zip) content packages of the WCM Core Components Library.

You will also need the latest version of the WCM Core Components, the easiest is to install the ["all" content package](https://repo1.maven.org/maven2/com/adobe/cq/core.wcm.components.all/2.10.0/core.wcm.components.all-2.10.0.zip).

Simply download the zip files, and install these three content packages directly in AEM's CRX Package Manager.

## Installation

There are two sub-projects for the Forms Core Components Library:
* **ui.apps**: this contains some application content for the library, including the OSGi configuration of the services required by the examples.
* **ui.content**: this contains the example pages demonstrating the use of the Forms Components.

You can install all the artifacts by running `mvn clean install -PautoInstallPackage`

_Note that the `ui.apps` examples content package depends on the same version of the `ui.apps` content package of the Forms components. This means that a developer working on the SNAPSHOT version of the library must ensure that the same SNAPSHOT version of the components `ui.apps` library is installed on AEM._

## Installation with 'examples-all' package
This folder also contains an all content package that can be used to deploy the Forms components library and most of its dependencies:

* the Forms Components and bundle
* the WCM Core Components library when building with the Maven -Pinclude-wcm-components-examples profile

Note that the WCM Core components are not included: they are installed by default in the AEM Cloud SDK, and should be installed separately on a classic AEM instance.

To build and install that content package in a running AEM instance, simply use mvn clean install content-package:install.

## How does it work?

When everything is correctly installed, you should be able to open the library page at [http://localhost:4502/content/core-components-examples/library.html](http://localhost:4502/content/core-components-examples/library.html) and see the "Forms" section at the bottom of the left-side panel and at the bottom of the page content.

