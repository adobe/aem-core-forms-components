/*******************************************************************************
 * Copyright 2021 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/*
Example usage:

Replaces IIFE calls, such as
    (function($) {
        // IIFE style invocation
        // do something with the dependency
    }(jQuery));

with
    _tpa_helper(['jQuery'], function($) {
        ...
    });
the dependencies to use are specified as a string than a jquery object, so that loader can use it to poll global objects
*/

if (!window['_tpa_helper']) {
    // kind of a header guard to prevent function overwrites / includes due to multiple embeds
    function _tpa_helper (libsToCheck, callback) {
        var _waitForLoad = function (libsToCheck, callback) {
            // libsToCheck is an array of dependencies which will be checked
            // callback is a function to be invoked with the libraries in libsToCheck 
            var isFeasible = true;
            var argsArr = [];
            libsToCheck.forEach(library => {
                if (!window[library]) {
                    isFeasible = false;
                }
                else {
                    argsArr.push(window[library]);
                }
            });
        
            if (isFeasible === true) {
                // all objects defined in libsToCheck are available, proceed with invocation
                callback.apply(null, argsArr);
            }
            else {
                return setTimeout(function () {
                    _waitForLoad(libsToCheck, callback);
                }, 50);
            }
        };
        if (document.readyState !== 'loading') {
            _waitForLoad(libsToCheck, callback);
        }
        else {
            window.addEventListener('DOMContentLoaded', () => {
                _waitForLoad(libsToCheck, callback);
            });
        }
    }   
}
