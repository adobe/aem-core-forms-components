<!--
Copyright 2021 Adobe

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<!-- ToDo: Add edit dialog properties -->

Search And Lister Component  (v1)
====
Search and Lister component written in HTL.

## Features

### Use Object
The Search and Lister component uses the `com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister` Sling model as its Use-object.

### Behavior
Pagination is implemented via Load More button, which loads more results lazily. Provided clientlib loads at max `resultLimit` element at a time.

### Edit Dialog Properties
The following properties are written to JCR for the AEM Forms Portal Link component and are expected to be available as `Resource` properties:
1. `./title`     - Title shown on the Search and Lister
2. `./limit`    - Number of items to retrieve and list at a time
3. `./layout` - Type of view (e.g *LIST* or *CARD*)
4. `./disableSearch` - Don't render Search Box
5. `./disableSort` - Don't render Sort dropdown

`./assetFolders` and `./assetSources` are set as child nodes on the resource indicating
folders from where forms are to be listed and types which should be displayed (currently only HTML)
respectively.  

## BEM Description
```
BLOCK cmp-searchlister
    ELEMENT cmp-searchlister__heading
    ELEMENT cmp-searchlister__seperator
    BLOCK cmp-searchlister-search
        ELEMENT cmp-searchlister-search__box
            MOD cmp-searchlister-search__box--text
        ELEMENT cmp-searchlister-search__sortbutton
            MOD cmp-searchlister-search__sortbutton--wrapper
            MOD cmp-searchlister-search__sortbutton--right
    BLOCK cmp-searchlister__results
        ELEMENT cmp-searchlister__item
    ELEMENT cmp-searchlister__more
```
## JavaScript Data Attribute Bindings
There can be only multiple search and lister instances in a page. It is initialized by the clientlib on window state as ready (i.e all dom instances loaded).

A hook attribute from the following should be added to the corresponding element/template so that the JavaScript is able to target it:

```
data-cmp-hook-formssearch="input"
data-cmp-hook-formssearch="filter"
data-cmp-hook-formssearch="sort"
data-cmp-hook-formssearch="results"
data-cmp-hook-formssearch="itemTemplate"
data-cmp-hook-formssearch="item"
data-cmp-hook-item-template="itemTitle"
data-cmp-hook-item-template="description"
data-cmp-hook-item-template="formLink"
data-cmp-hook-formssearch="more"
```


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM Forms as a cloud service
* **Status**: production-ready

_If you were involved in the authoring of this component and are not credited above, please reach out to us on [GitHub](https://github.com/adobe/aem-core-forms-components)._
