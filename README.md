[![CircleCI](https://circleci.com/gh/adobe/aem-core-forms-components.svg?style=svg)](https://circleci.com/gh/adobe/aem-core-forms-components)
[![codecov](https://codecov.io/gh/adobe/aem-core-forms-components/branch/master/graph/badge.svg)](https://codecov.io/gh/adobe/aem-core-forms-components)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.adobe.aem/core-forms-components-all/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.adobe.aem/core-forms-components-all)
![GitHub](https://img.shields.io/github/license/adobe/aem-core-forms-components.svg)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=dev&repo=285932577&machine=standardLinux32gb&location=WestEurope&devcontainer_path=.devcontainer%2Fdevcontainer.json)

# AEM Forms Core Components

The AEM Forms Core Components project serves as accelerator to get started with projects using AEM Forms. The project contains re-useable Forms core components which are server-side rendered AEM components for dynamic experiences / data. 

This project is intended to be used in conjunction with the [AEM Sites Core Components](https://github.com/adobe/aem-core-wcm-components). AEM Forms Core Components use the AEM Sites Core Components as a foundation where possible and extending them.


## Documentation

See [AEM Sites Core Components](https://docs.adobe.com/content/help/en/experience-manager-core-components/using/introduction.html) for usage and configuration instructions of the AEM Forms Core Components.

## Available Components

### Page Authoring Components

-   [AEM Forms Container](ui.apps/src/main/content/jcr_root/apps/core/fd/components/aemform/v2/aemform)

### Forms And Communications Portal

-   [Link Component](ui.apps/src/main/content/jcr_root/apps/core/fd/components/formsportal/link/v1/link)
-   [Drafts and Submissions Component](ui.apps/src/main/content/jcr_root/apps/core/fd/components/formsportal/draftsandsubmissions/v1/draftsandsubmissions)
-   [Search and Lister Component](ui.apps/src/main/content/jcr_root/apps/core/fd/components/formsportal/searchlister/v1/searchlister)

### Adaptive Form


-   [Form Container](ui.apps/src/main/content/jcr_root/apps/core/fd/components/form/container/v2/container)
-   [Text Input](ui.apps/src/main/content/jcr_root/apps/core/fd/components/form/textinput/v1/textinput)

## System Requirements

The latest version of the AEM Forms Core Components, require the below minimum system requirements:

| Forms Core Components | WCM Core Components | AEM Forms as a cloud service | Java  | Maven  |  
| --------------------- |---------------------| ---------------------------- | ----- | ------ | 
| 1.0.16                | 2.20.2              | Continual                    | 8, 11 | 3.3.9+ |

For a list of requirements for previous versions, see [Historical System Requirements](VERSIONS.md).


### AEM Sites Core Components

This project relies on the [AEM Sites Core Components](https://github.com/adobe/aem-core-wcm-components). They are typically installed as part of AEM. If you install AEM without sample content option you have to [deploy them manually](https://github.com/adobe/aem-core-wcm-components#installation) before using the AEM Forms Core Components. See the System Requirements above for version requirements.  

## Building

### Compliling the Core Components

To compile your own version of the Core Components, you can build and install everything on your running AEM instance by issuing the following command in the top level folder of the project:
```shell
mvn clean install -PautoInstallPackage
```
You can also install individual packages/bundles by issuing the following command in the top-level folder of the project:

```shell
mvn clean install -PautoInstallPackage -pl <project_name(s)> -am
```

With AEM as a Cloud Service SDK, use the cloud profile as follows to deploy the components into `/libs` instead of `/apps`:
```shell
mvn clean install -PautoInstallPackage,cloud
```

Note that:

* `-pl/-projects` option specifies the list of projects that you want to install
* `-am/-also-make` options specifies that dependencies should also be built

For convenience, the following deployment profiles are provided when running the Maven install goal with `mvn install`:

* `autoInstallAll`: Install everything to the AEM author instance.
* `autoInstallPackage`: Install the ui.content and ui.apps content packages to the AEM author instance.
* `autoInstallPackagePublish`: Install the ui.content and ui.apps content packages to the AEM publish instance.

The hostname and port of the instance can be changed with the following user defined properties:

* `aem.host` and `aem.port` for the author instance.
* `aem.publish.host` and `aem.publish.port` for the publish instance.

### Building and Installing examples

We have a set of example proxy components to demonstrate how the existing components can be customized or
new components can be added. The `examples` module contains the code for all the components

To build and install that, from the examples directory (or from the root directory), 
run the following command

```shell
mvn clean install -PautoInstallExamples,include-wcm-components-examples
```

### AEM as a Cloud Service SDK
When compiling and deploying to AEM as a Cloud Service SDK, you can use the `cloud` profile 
(in conjunction with previously documented profiles) to generate cloud-ready artifacts 
(with components located in `/libs` instead of `/apps`). 
To allow recompilation of the HTL scripts, you should disable `aem-precompiled-scripts` bundle.

Due to [FELIX-6365](https://issues.apache.org/jira/browse/FELIX-6365), 
please only use `autoInstallPackage` and `autoInstallPackagePublish` when 
working with the AEM as a Cloud Service SDK!

### UberJar

This project relies on the AEM 6.4.4 `cq-quickstart` UberJar and [AEM Forms SDK API](https://repo.maven.apache.org/maven2/com/adobe/aem/aem-forms-sdk-api/). This is publicly available on https://repo.adobe.com

For more details about the UberJar please head over to the
[How to Build AEM Projects using Apache Maven](https://helpx.adobe.com/experience-manager/6-4/sites/developing/using/ht-projects-maven.html) documentation page.

## Include core components as subpackage into your own project maven build

The released version of the AEM Forms Core Components are available on the [maven central repository](https://search.maven.org/search?q=g:com.adobe.aem%20AND%20a:core-forms-components-all). To include the
AEM Forms Core Components package into your own project maven build you can add the dependency

```
<dependency>
    <groupId>com.adobe.aem</groupId>
    <artifactId>core-forms-components-all</artifactId>
    <type>zip</type>
    <version>x.y.z</version>
</dependency>
```

and sub package section

```
 <subPackage>
     <groupId>com.adobe.aem</groupId>
     <artifactId>core-forms-components-all</artifactId>
     <filter>true</filter>
 </subPackage>
```

to the `content-package-maven-plugin`.


## Using Pre-release versions
In order to use components under pre-release:  
1. Enable the pre-release channel. Instructions at https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/release-notes/prerelease.html?lang=en
   1. Replace `core-forms-components-*` version with the desired pre-release version (e.g `1.0.4-PRERELEASE-20211223`) in your Cloud Manager / AEM Archetype project. This can be done by updating `<core.forms.components.version>x.y.z</core.forms.components.version>` in the top level pom.xml of archetype project.

Contents in the pre-release are contained in the `pre-release` branch.

## Code Formatting

### Java

You can find the code formatting rules in the `eclipse-formatter.xml` file. The code formatting is automatically checked for each build. To automatically format your code, please run:

```bash
mvn clean install -Pformat-code
```

## Releases to Maven Central

Releases of this project are triggered by manually running `mvn -Pcloud release:prepare release:clean` on the `master` branch on the root folder of this repository. Once you choose the release and the next snapshot versions, this commits the change along with a release git tag like for example `core-forms-components-reactor-x.y.z`. Note that the commits are not automatically pushed to the git repository, so you have some time to check your changes and then manually push them. The push then triggers a dedicated `CircleCI` build that performs the deployment of the tagged artifact to Maven Central.

_Important_: this project does Maven reactor releases, do **not** trigger releases from sub modules!

Note: in case it is needed to update the version of a java bundle because of API changes and semantic versioning, one can easily update the parent POM version and all the POMs referencing the parent POM version by running the following command in the PARENT project folder: `mvn versions:set -DnewVersion=x.y.z-SNAPSHOT`. This will ensure all projects have the same version.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

---
