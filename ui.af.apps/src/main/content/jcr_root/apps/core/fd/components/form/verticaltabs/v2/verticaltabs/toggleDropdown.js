/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function() {
    'use strict';

    // Get all parent vertical tabs
    var parentTabs = document.querySelectorAll('.cmp-verticaltabs__tab--vertical');

    // Add click event listener to each parent tab
    parentTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Get the associated child tab list
            var childTabList = tab.nextElementSibling;

            // Toggle the active class on the child tab list
            childTabList.classList.toggle('cmp-verticaltabs__tablist--active');
        });
    });
})();