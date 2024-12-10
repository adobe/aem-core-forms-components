/*******************************************************************************
 * Copyright 2024 Adobe
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

if(window.GeoLocationQuery === undefined) {
        window.GeoLocationQuery = class GeoLocationQuery {
        constructor() {
            this._active = false;
        }

        init(success, failure) {
            this._successHandler = success;
            this._errorHandler = failure;
            this._active = true;
            return this;
        }

        _handleSuccess(data) {
            if (this._successHandler) {
                this._successHandler(data);
            }
        }

        _handleError(err) {
            if (this._errorHandler) {
                this._errorHandler(err);
            }
        }

        query() {
            const onSuccess = (pos) => {
                if (this._active) {
                    this._handleSuccess(pos);
                }
                this._active = false;
            };

            const onError = (err) => {
                if (this._active) {
                    this._handleError(err);
                }
                this._active = false;
            };

            navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });
        }

        cancel() {
            this._active = false;
        }
    }
}