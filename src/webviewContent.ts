import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environment File Editor</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            margin: 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .header h1 {
            margin: 0;
            font-size: 1.5em;
            color: var(--vscode-titleBar-activeForeground);
        }

        .controls {
            display: flex;
            gap: 10px;
        }

        .btn {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
        }

        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .btn-secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-secondary:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }

        .format-selector {
            margin-bottom: 20px;
            padding: 10px;
            background-color: var(--vscode-editorWidget-background);
            border-radius: 5px;
            border: 1px solid var(--vscode-editorWidget-border);
        }

        .format-selector label {
            margin-right: 20px;
            cursor: pointer;
        }

        .variable-list {
            max-height: 70vh;
            overflow-y: auto;
        }

        .variable-item {
            background-color: var(--vscode-list-inactiveSelectionBackground);
            border: 1px solid var(--vscode-list-inactiveSelectionBackground);
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            position: relative;
        }

        .variable-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }

        .variable-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .variable-key {
            font-weight: bold;
            color: var(--vscode-symbolIcon-variableForeground);
            font-family: var(--vscode-editor-font-family);
        }

        .delete-btn {
            background-color: var(--vscode-errorBackground);
            color: var(--vscode-errorForeground);
            border: none;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .variable-fields {
            display: grid;
            gap: 10px;
        }

        .field-group {
            display: flex;
            flex-direction: column;
        }

        .field-group label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 4px;
        }

        .field-group input,
        .field-group textarea {
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            padding: 6px 8px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
        }

        .field-group input:focus,
        .field-group textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .field-group textarea {
            resize: vertical;
            min-height: 60px;
        }

        .add-variable {
            margin-top: 20px;
            text-align: center;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state h2 {
            color: var(--vscode-titleBar-activeForeground);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
        }

        .checkbox-group input[type="checkbox"] {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Environment Variables</h1>
        <div class="controls">
            <button class="btn btn-secondary" onclick="addVariable()">Add Variable</button>
            <button class="btn" onclick="saveFile()">Save</button>
        </div>
    </div>

    <div class="format-selector">
        <strong>Format:</strong>
        <label>
            <input type="radio" name="format" value="equals" onchange="changeFormat('equals')">
            KEY=value
        </label>
        <label>
            <input type="radio" name="format" value="colon" onchange="changeFormat('colon')">
            KEY: "value"
        </label>
    </div>

    <div id="variables-container">
        <div class="empty-state">
            <h2>No Environment Variables</h2>
            <p>Click "Add Variable" to get started</p>
        </div>
    </div>

    <div class="add-variable">
        <button class="btn btn-secondary" onclick="addVariable()">Add Another Variable</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let envData = { variables: [], format: 'equals' };

        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    envData = message.data;
                    renderVariables();
                    updateFormatSelector();
                    break;
            }
        });

        function renderVariables() {
            const container = document.getElementById('variables-container');

            if (envData.variables.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <h2>No Environment Variables</h2>
                        <p>Click "Add Variable" to get started</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = \`
                <div class="variable-list">
                    \${envData.variables.map((variable, index) => \`
                        <div class="variable-item">
                            <div class="variable-header">
                                <div class="variable-key">\${variable.key || 'NEW_VARIABLE'}</div>
                                <button class="delete-btn" onclick="deleteVariable(\${index})">Delete</button>
                            </div>
                            <div class="variable-fields">
                                <div class="field-group">
                                    <label>Variable Name</label>
                                    <input type="text" value="\${variable.key || ''}"
                                           onchange="updateVariable(\${index}, 'key', this.value)"
                                           placeholder="VARIABLE_NAME">
                                </div>
                                <div class="field-group">
                                    <label>Value</label>
                                    <input type="text" value="\${variable.value || ''}"
                                           onchange="updateVariable(\${index}, 'value', this.value)"
                                           placeholder="variable value">
                                    <div class="checkbox-group">
                                        <input type="checkbox" id="quoted-\${index}"
                                               \${variable.isQuoted ? 'checked' : ''}
                                               onchange="updateVariable(\${index}, 'isQuoted', this.checked)">
                                        <label for="quoted-\${index}">Use quotes</label>
                                    </div>
                                </div>
                                <div class="field-group">
                                    <label>Description (optional)</label>
                                    <textarea onchange="updateVariable(\${index}, 'description', this.value)"
                                              placeholder="Describe what this variable is used for...">\${variable.description || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        function updateFormatSelector() {
            const formatRadios = document.querySelectorAll('input[name="format"]');
            formatRadios.forEach(radio => {
                radio.checked = radio.value === envData.format;
            });
        }

        function addVariable() {
            envData.variables.push({
                key: '',
                value: '',
                description: '',
                isQuoted: false
            });
            renderVariables();
        }

        function deleteVariable(index) {
            envData.variables.splice(index, 1);
            renderVariables();
        }

        function updateVariable(index, field, value) {
            if (envData.variables[index]) {
                envData.variables[index][field] = value;
            }
        }

        function changeFormat(format) {
            envData.format = format;
        }

        function saveFile() {
            vscode.postMessage({
                type: 'save',
                data: envData
            });
        }

        // Notify the extension that the webview is ready
        vscode.postMessage({ type: 'ready' });
    </script>
</body>
</html>`;
}
