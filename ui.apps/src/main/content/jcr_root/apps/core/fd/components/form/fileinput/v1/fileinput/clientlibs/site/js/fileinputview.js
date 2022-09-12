/*******************************************************************************
 * Copyright 2022 Adobe
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
(function() {

	"use strict";
	class FileInput extends FormView.FormFieldBase {

		static NS = FormView.Constants.NS;
		/**
		 * Each FormField has a data attribute class that is prefixed along with the global namespace to
		 * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
		 * data-{NS}-{IS}-x=""
		 * @type {string}
		 */
		static IS = "adaptiveFormFileInput";
		static bemBlock = 'cmp-adaptiveform-fileinput'
		static selectors = {
			self: "[data-" + this.NS + '-is="' + this.IS + '"]',
			widget: `.${FileInput.bemBlock}__widget`,
			label: `.${FileInput.bemBlock}__label`,
			description: `.${FileInput.bemBlock}__longdescription`,
			qm: `.${FileInput.bemBlock}__questionmark`,
			errorDiv: `.${FileInput.bemBlock}__errormessage`
		};

		constructor(params) {
			super(params);
			this.qm = this.element.querySelector(FileInput.selectors.qm)
		}

		getWidget() {
			return this.element.querySelector(FileInput.selectors.widget);
		}

		getDescription() {
			return this.element.querySelector(FileInput.selectors.description);
		}

		getLabel() {
			return this.element.querySelector(FileInput.selectors.label);
		}

		getErrorDiv() {
			return this.element.querySelector(FileInput.selectors.errorDiv);
		}

		setModel(model) {
			super.setModel(model);
			this.widget.addEventListener('blur', (e) => {
				this._model.value = e.target.value;
			})
		}
	}

	var attachedFilesCount = 0;
	var fileID = document.getElementById("fileInput");
	fileID.addEventListener("change", function(event) {
		var file = event.target.files[0];
		if (fileID.getAttribute("multi") == 'FILE') {
			if (attachedFilesCount === 0) {
				var _a = document.createElement('a');
				var linkText = document.createTextNode(file.name);
				_a.appendChild(linkText);
				_a.setAttribute("id", "linkId");
				_a.title = file.name;
				_a.href = "#stockContent";
				document.body.appendChild(_a);
			} else if (attachedFilesCount !== 0) {
				var element = document.getElementById("linkId");
				element.remove(); // Removes the anchor element
				var _a = document.createElement('a');
				var linkText = document.createTextNode(file.name);
				_a.appendChild(linkText);
				_a.setAttribute("id", "linkId");
				_a.title = file.name;
				_a.href = "#stockContent";
				document.body.appendChild(_a);
			}
			var element = document.getElementById("linkId");
			element.onclick = function() {
				if (file) {
					if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
						window.navigator.msSaveOrOpenBlob(file, file.name);
					} else {
						var url = window.URL.createObjectURL(file);
						window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
					}
				}
			}
			attachedFilesCount = parseInt(attachedFilesCount + event.target.files.length);
		}

		if (fileID.getAttribute("multi") == 'FILE_ARRAY') {
			var linkId = "linkId";
			var id = linkId.concat(attachedFilesCount);
			if (attachedFilesCount < fileID.getAttribute("maxFiles")) {
				attachedFilesCount = parseInt(attachedFilesCount + event.target.files.length);
				var _a = document.createElement('a');
				var linkText = document.createTextNode(file.name);
				_a.appendChild(linkText);
				_a.setAttribute("id", id);
				_a.title = file.name;
				_a.href = "#stockContent";
				document.body.appendChild(_a);
				var br = document.createElement("br");
				document.body.appendChild(br);

				var element = document.getElementById(id);
				element.onclick = function() {
					if (file) {
						if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
							window.navigator.msSaveOrOpenBlob(file, file.name);
						} else {
							var url = window.URL.createObjectURL(file);
							window.open(url, '', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
						}
					}
				}
			}
		}


	}, false);


	FormView.Utils.setupField(({
		element,
		formContainer
	}) => {
		return new FileInput({
			element
		})
	}, FileInput.selectors.self);

})();