/*******************************************************************************
 * Copyright 2023 Adobe
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

/**
 * This class is responsible for interacting with the file input widget. It implements the file preview,
 * file list, handling invalid file size, file name, file mime type functionality
 */
if (typeof window.IdentityVerifierWidget === 'undefined') {
    window.IdentityVerifierWidget = class {
        constructor(widget, identityVerifierElements) {
            this.#attachEventHandlers(widget, identityVerifierElements);
        }

        #attachEventHandlers(widget, identityVerifierElements) {
            const {
                firstName,
                lastName,
                address,
                city,
                zipCode,
                ssn,
                aadhar,
                phone,
                submit,
                identityProvider,
                otpContainer,
                verifiedContainer
            } = identityVerifierElements;

            const payload = {};

            firstName?.addEventListener('change', (e)=> {
                payload.firstName = e.target.value;
            });
            lastName?.addEventListener('change', (e)=> {
                payload.lastName = e.target.value;
            });
            address?.addEventListener('change', (e)=> {
                payload.address = e.target.value;
            });
            city?.addEventListener('change', (e)=> {
                payload.city = e.target.value;
            });
            zipCode?.addEventListener('change', (e)=> {
                payload.zipCode = e.target.value;
            });
            ssn?.addEventListener('change', (e)=> {
                payload.ssn = e.target.value;
            });
            aadhar?.addEventListener('change', (e)=> {
                payload.aadhar = e.target.value;
            });
            phone?.addEventListener('change', (e)=> {
                payload.phone = e.target.value;
            });
            submit?.addEventListener('click', (e)=> {
                otpContainer.style.display = "block";
                identityProvider.style.display = "none";
            });
            otpContainer?.querySelector('.cmp-adaptiveform-identityverifier_verifyotp').addEventListener('click', () => {
                otpContainer.style.display = "none";
                verifiedContainer.style.display = "block";
            })
        }

    }
}
