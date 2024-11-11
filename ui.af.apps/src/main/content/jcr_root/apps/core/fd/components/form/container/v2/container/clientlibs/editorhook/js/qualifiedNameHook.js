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
(function (window, author, Coral) {
    "use strict";

    /**
     * Get Qualified name for a component
     * @param {Object} component The component that has to be instantiated
     */
    window.CQ.FormsCoreComponents.editorhooks.viewQualifiedName = function (component) {
        author.afUtils.getQualifiedName(component).then(function (componentQualifiedName) {
            const localisedQualifiedNameMessage = CQ.I18n.getMessage('Qualified Name');
            const localizedWaringMessageForQualifiedName = CQ.I18n.getMessage("A Qualified Name is based on the position of the component. It changes if a component is moved.");
            const dialog = new Coral.Dialog().set({
                id: 'getQualifiedNameDialog',
                header: {
                    innerHTML: localisedQualifiedNameMessage
                },
                content: {
                    innerHTML: componentQualifiedName + '<br/> <br/>' + "<strong>*</strong>" + localizedWaringMessageForQualifiedName
                },
                footer: {},
                closable: "on"
            });
            document.body.appendChild(dialog);

            dialog.show();
        });
    };

    window.CQ.FormsCoreComponents.editorhooks.hasXfaScripts = function (editable) {
        const result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(editable.path + ".json"),
            cache: false
        });
        const json = result.responseJSON;

        if (json && json.dataRef?.startsWith('xfa[0]')) {
            if (json['fd:xfaScripts']) {
                try {
                    const scripts = JSON.parse(json['fd:xfaScripts']);
                    return scripts.length > 0;
                } catch(e) {
                    console.error('Error parsing xfaScripts', e, json['fd:xfaScripts']);
                }
            }
        }
        return false
    }

    window.CQ.FormsCoreComponents.editorhooks.viewXfaScripts = function (editable) {
        fetch(Granite.HTTP.externalize(editable.path + ".json")).then(async function (resp) {
            const json = await resp.json();
            // Assuming `resp` contains the JSON string with `fd:xfaScripts`
            var xfaScripts = JSON.parse(json['fd:xfaScripts']);
            var dialogContent = document.createElement('div');

            // Create a Coral Table
            var table = document.createElement('coral-table');

            // Create the header
            var thead = document.createElement('coral-table-head');
            var headerRow = document.createElement('coral-table-row');

            var eventNameHeader = document.createElement('coral-table-headercell');
            eventNameHeader.textContent = 'Event Name';
            var eventContentHeader = document.createElement('coral-table-headercell');
            eventContentHeader.textContent = 'Event Content';
            var disableHeader = document.createElement('coral-table-headercell');
            disableHeader.textContent = 'Disable';

            headerRow.appendChild(eventNameHeader);
            headerRow.appendChild(eventContentHeader);
            headerRow.appendChild(disableHeader);
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Populate the table with data from xfaScripts
            var tbody = document.createElement('coral-table-body');
            xfaScripts.forEach(function(script) {
                var row = document.createElement('coral-table-row');

                var nameCell = document.createElement('coral-table-cell');
                nameCell.textContent = script.runAt === "server" ? `${script.activity}(server)` : script.activity;
                var contentCell = document.createElement('coral-table-cell');
                contentCell.innerHTML = script.value.replaceAll("\n", "<br />");

                var checkboxCell = document.createElement('coral-table-cell');
                var checkbox = new Coral.Checkbox();
                checkbox.name = 'disableCheckbox';
                checkbox.on('change', function() {
                    script.disabled = this.checked;
                });
                checkboxCell.appendChild(checkbox);
                checkbox.checked = !!script.disabled;
                if (script.runAt === "server") {
                    checkbox.disabled = true;
                }
                row.appendChild(nameCell);
                row.appendChild(contentCell);
                row.appendChild(checkboxCell);

                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            dialogContent.appendChild(table);

            // Create the dialog
            var dialog = new Coral.Dialog().set({
                id: 'xfaScriptsDialog',
                header: {
                    innerHTML: 'XFA Scripts'
                },
                content: {
                    innerHTML: ''
                },
                footer: {},
                closable: "on"
            });

            // Add the table to the dialog content
            //dialog.content.appendChild(dialogContent);

            var okButton = new Coral.Button();
            okButton.label.textContent = 'OK';
            okButton.variant = Coral.Button.variant.PRIMARY;
            okButton.addEventListener('click', function() {
                // Prepare the modified xfaScripts for POST request
                var modifiedXfaScripts = JSON.stringify({ 'fd:xfaScripts': JSON.stringify(xfaScripts) });
                $.ajax({
                    url: editable.path,
                    type: 'POST',
                    data: {
                        "_charset_" : "UTF-8",
                        ':operation': 'import',
                        ':contentType': 'json',
                        ':content': modifiedXfaScripts,
                        ':replaceProperties': true
                    },
                    success: function(response) {
                        console.log('Successfully posted the data');
                        dialog.remove();
                    },
                    error: function(xhr, status, error) {
                        console.error('Error posting the data', error);
                        dialog.remove();
                    }
                });
            });
            dialog.footer.appendChild(okButton);

// Append and show the dialog
            document.body.appendChild(dialog);

    // add a listener on dialog show event
            dialog.on('coral-overlay:open', function() {
                dialog.content.appendChild(dialogContent);
            });
            dialog.show();

        })
        return true;
    };

})(window, Granite.author, Coral);
