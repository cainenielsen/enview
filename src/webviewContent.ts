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
            padding: 16px;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            margin: 0;
            line-height: 1.4;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        .header h1 {
            margin: 0;
            font-size: 1.4em;
            font-weight: 600;
            color: var(--vscode-foreground);
        }

        .controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 13px;
            font-family: var(--vscode-font-family);
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

        .btn-danger {
            background-color: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
        }

        .btn-danger:hover {
            background-color: var(--vscode-errorBackground);
        }

        .format-tabs {
            display: flex;
            margin-bottom: 20px;
            background-color: var(--vscode-tab-inactiveBackground);
            border-radius: 4px;
            padding: 2px;
            width: fit-content;
        }

        .format-tab {
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 2px;
            font-size: 13px;
            transition: all 0.2s ease;
            color: var(--vscode-tab-inactiveForeground);
            background: transparent;
            border: none;
            font-family: var(--vscode-font-family);
        }

        .format-tab.active {
            background-color: var(--vscode-tab-activeBackground);
            color: var(--vscode-tab-activeForeground);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .format-tab:hover:not(.active) {
            background-color: var(--vscode-tab-hoverBackground);
        }

        .variable-list {
            max-height: 70vh;
            overflow-y: auto;
        }

        .variable-item {
            padding: 12px 0;
            border-bottom: 1px solid var(--vscode-widget-border);
            transition: background-color 0.2s ease;
        }

        .variable-item:hover {
            background-color: var(--vscode-list-hoverBackground);
            margin: 0 -8px;
            padding: 12px 8px;
            border-radius: 3px;
        }

        .variable-item:last-child {
            border-bottom: none;
        }

        .variable-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .variable-key {
            font-weight: 600;
            color: var(--vscode-symbolIcon-variableForeground);
            font-family: var(--vscode-editor-font-family);
            font-size: 14px;
        }

        .delete-btn {
            opacity: 0;
            transition: opacity 0.2s ease;
            background: none;
            border: none;
            color: var(--vscode-errorForeground);
            cursor: pointer;
            padding: 4px;
            border-radius: 2px;
            font-size: 12px;
        }

        .variable-item:hover .delete-btn {
            opacity: 1;
        }

        .delete-btn:hover {
            background-color: var(--vscode-errorBackground);
        }

        .variable-fields {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 12px;
            align-items: start;
        }

        .field-group {
            display: flex;
            flex-direction: column;
        }

        .field-group label {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .field-group input,
        .field-group textarea {
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            padding: 6px 8px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            transition: border-color 0.2s ease;
        }

        .field-group input:focus,
        .field-group textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .field-group textarea {
            resize: vertical;
            min-height: 50px;
            grid-column: 1 / -1;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
        }

        .checkbox-group input[type="checkbox"] {
            margin: 0;
        }

        .checkbox-group label {
            font-size: 12px;
            margin: 0;
            text-transform: none;
            letter-spacing: normal;
            color: var(--vscode-foreground);
        }

        .add-variable {
            margin-top: 24px;
            text-align: center;
            padding: 16px;
            border: 1px dashed var(--vscode-widget-border);
            border-radius: 4px;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state h2 {
            color: var(--vscode-foreground);
            font-weight: 600;
            margin-bottom: 8px;
        }

        .auto-save-indicator {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .auto-save-indicator.saving {
            opacity: 1;
            color: var(--vscode-notificationsInfoIcon-foreground);
        }

        .auto-save-indicator.saved {
            opacity: 1;
            color: var(--vscode-notificationsSuccessIcon-foreground);
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            padding: 20px;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .modal h3 {
            margin: 0 0 12px 0;
            color: var(--vscode-foreground);
        }

        .modal p {
            margin: 0 0 20px 0;
            color: var(--vscode-descriptionForeground);
        }

        .modal-actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Environment Variables</h1>
        <div class="controls">
            <div class="auto-save-indicator" id="autoSaveIndicator">Auto-saved</div>
            <button class="btn btn-secondary" onclick="addVariable()">Add Variable</button>
        </div>
    </div>

    <div class="format-tabs">
        <button class="format-tab active" data-format="equals" onclick="changeFormat('equals')">
            KEY=value
        </button>
        <button class="format-tab" data-format="colon" onclick="changeFormat('colon')">
            KEY: "value"
        </button>
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

    <div id="confirmModal" class="modal-overlay" style="display: none;">
        <div class="modal">
            <h3>Confirm Delete</h3>
            <p id="confirmMessage">Are you sure you want to delete this variable?</p>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeConfirmModal()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDelete()">Delete</button>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let envData = { variables: [], format: 'equals' };
        let autoSaveTimeout;
        let pendingDeleteIndex = -1;

        function scheduleAutoSave() {
            clearTimeout(autoSaveTimeout);
            showSavingIndicator();

            autoSaveTimeout = setTimeout(() => {
                saveFile(true);
            }, 500);
        }

        function showSavingIndicator() {
            const indicator = document.getElementById('autoSaveIndicator');
            indicator.textContent = 'Saving...';
            indicator.className = 'auto-save-indicator saving';
        }

        function showSavedIndicator() {
            const indicator = document.getElementById('autoSaveIndicator');
            indicator.textContent = 'Auto-saved';
            indicator.className = 'auto-save-indicator saved';

            setTimeout(() => {
                indicator.className = 'auto-save-indicator';
            }, 2000);
        }

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    envData = message.data;
                    renderVariables();
                    updateFormatTabs();
                    break;
                case 'saved':
                    showSavedIndicator();
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
                                <button class="delete-btn" onclick="showDeleteConfirm(\${index}, '\${variable.key}')">
                                    ×
                                </button>
                            </div>
                            <div class="variable-fields">
                                <div class="field-group">
                                    <label>Variable Name</label>
                                    <input type="text" value="\${variable.key || ''}"
                                           oninput="updateVariable(\${index}, 'key', this.value)"
                                           placeholder="VARIABLE_NAME">
                                </div>
                                <div class="field-group">
                                    <label>Value</label>
                                    <input type="text" value="\${variable.value || ''}"
                                           oninput="updateVariable(\${index}, 'value', this.value)"
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
                                    <textarea oninput="updateVariable(\${index}, 'description', this.value)"
                                              placeholder="Describe what this variable is used for...">\${variable.description || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }

        function updateFormatTabs() {
            const tabs = document.querySelectorAll('.format-tab');
            tabs.forEach(tab => {
                if (tab.dataset.format === envData.format) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
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
            scheduleAutoSave();
        }

        function showDeleteConfirm(index, variableName) {
            pendingDeleteIndex = index;
            const modal = document.getElementById('confirmModal');
            const message = document.getElementById('confirmMessage');

            if (variableName && variableName !== 'NEW_VARIABLE') {
                message.textContent = \`Are you sure you want to delete "\${variableName}"?\`;
            } else {
                message.textContent = 'Are you sure you want to delete this variable?';
            }

            modal.style.display = 'flex';
        }

        function closeConfirmModal() {
            document.getElementById('confirmModal').style.display = 'none';
            pendingDeleteIndex = -1;
        }

        function confirmDelete() {
            if (pendingDeleteIndex >= 0) {
                envData.variables.splice(pendingDeleteIndex, 1);
                renderVariables();
                scheduleAutoSave();
            }
            closeConfirmModal();
        }

        function updateVariable(index, field, value) {
            if (envData.variables[index]) {
                envData.variables[index][field] = value;
                scheduleAutoSave();
            }
        }

        function changeFormat(format) {
            envData.format = format;
            updateFormatTabs();
            scheduleAutoSave();
        }

        function saveFile(isAutoSave = false) {
            vscode.postMessage({
                type: 'save',
                data: envData,
                isAutoSave: isAutoSave
            });
        }

        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeConfirmModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeConfirmModal();
            }
        });

        vscode.postMessage({ type: 'ready' });
    </script>
</body>
</html>`;
}
