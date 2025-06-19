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
            line-height: 1.4;
            position: relative;
            min-height: 100vh;
            box-sizing: border-box;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding: 0 20px 20px 20px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }

        .header h1 {
            margin: 0;
            font-size: 1.4em;
            font-weight: 600;
            color: var(--vscode-foreground);
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 16px;
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

        .format-and-quotes {
            display: flex;
            align-items: center;
            gap: 24px;
            margin: 0 20px 28px 20px;
        }

        .format-tabs {
            display: flex;
            background-color: var(--vscode-tab-inactiveBackground);
            border-radius: 4px;
            padding: 2px;
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

        .quotes-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background-color: var(--vscode-tab-inactiveBackground);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--vscode-tab-inactiveForeground);
            font-size: 13px;
        }

        .quotes-toggle:hover {
            background-color: var(--vscode-tab-hoverBackground);
        }

        .quotes-toggle.active {
            background-color: var(--vscode-tab-activeBackground);
            color: var(--vscode-tab-activeForeground);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .quotes-toggle input[type="checkbox"] {
            margin: 0;
            opacity: 0;
            position: absolute;
        }

        .quotes-toggle label {
            font-size: 13px;
            margin: 0;
            cursor: pointer;
            color: inherit;
        }

        .variable-list {
            overflow-x: hidden;
            overflow-y: auto;
            padding-bottom: 80px; /* Space for floating button */
            width: 100%;
            max-width: 100%;
        }

        .variable-item {
            padding: 20px;
            border-bottom: 1px solid var(--vscode-widget-border);
            transition: background-color 0.2s ease;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        .variable-item:hover {
            background-color: var(--vscode-list-hoverBackground);
            border-radius: 4px;
        }

        .variable-item:last-child {
            border-bottom: none;
        }

        .variable-fields {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
            max-width: 100%;
        }

        .variable-row {
            display: grid;
            grid-template-columns: 1fr 2fr auto auto;
            gap: 20px;
            align-items: end;
        }

        .field-group {
            display: flex;
            flex-direction: column;
        }

        .field-group label {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .field-group input,
        .field-group textarea {
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            padding: 8px 10px;
            font-family: var(--vscode-editor-font-family);
            font-size: 13px;
            transition: border-color 0.2s ease;
            width: 100%;
            box-sizing: border-box;
            height: 36px; /* Fixed height for inputs */
        }

        .field-group input:focus,
        .field-group textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .field-group textarea {
            resize: none;
            min-height: 20px;
            height: auto;
            line-height: 1.4;
            overflow: hidden;
        }

        .delete-btn {
            background-color: #f14c4c;
            color: white;
            border: none;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 2px;
            font-size: 11px;
            font-family: var(--vscode-font-family);
            font-weight: normal;
            height: 36px; /* Match input height */
            white-space: nowrap;
            transition: background-color 0.2s ease;
        }

        .delete-btn:hover {
            background-color: #e73c3c;
        }

        .button-group {
            display: flex;
            gap: 12px;
        }

        .toggle-btn {
            border: none;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 2px;
            font-size: 11px;
            font-family: var(--vscode-font-family);
            font-weight: normal;
            height: 36px; /* Match input height */
            white-space: nowrap;
            transition: background-color 0.2s ease;
        }

        .btn-disable {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-disable:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }

        .btn-enable {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        .btn-enable:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        /* Disabled variable styles */
        .variable-item.disabled {
            opacity: 0.6;
        }

        .variable-item.disabled label {
            color: var(--vscode-descriptionForeground);
        }

        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state h2 {
            color: var(--vscode-foreground);
            font-weight: 600;
            margin-bottom: 12px;
        }

        .floating-add-btn {
            position: fixed;
            bottom: 24px;
            right: 44px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 13px;
            font-family: var(--vscode-font-family);
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
            z-index: 100;
        }

        .floating-add-btn:hover {
            background-color: var(--vscode-button-hoverBackground);
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

        /* Debug View Styles */
        .debug-view {
            padding: 20px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 4px;
            margin: 0 20px 20px 20px;
        }

        .debug-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .debug-icon {
            font-size: 20px;
            color: var(--vscode-inputValidation-errorForeground);
        }

        .debug-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--vscode-inputValidation-errorForeground);
            margin: 0;
        }

        .debug-subtitle {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
            margin: 4px 0 0 0;
        }

        .error-list {
            margin: 16px 0;
        }

        .error-item {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border);
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 12px;
        }

        .error-line-number {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .error-content {
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-textCodeBlock-background);
            padding: 8px 10px;
            border-radius: 2px;
            font-size: 13px;
            margin: 6px 0;
            border-left: 3px solid var(--vscode-inputValidation-errorBorder);
        }

        .error-message {
            font-size: 13px;
            color: var(--vscode-inputValidation-errorForeground);
            margin: 6px 0 0 0;
        }

        .debug-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .btn-open-raw {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        .btn-open-raw:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Environment Variables</h1>
    </div>

    <div class="format-and-quotes">
        <div class="format-tabs">
            <button class="format-tab active" data-format="equals" onclick="changeFormat('equals')">
                KEY=value
            </button>
            <button class="format-tab" data-format="colon" onclick="changeFormat('colon')">
                KEY: "value"
            </button>
        </div>

        <div class="quotes-toggle" onclick="toggleQuotesClick()">
            <input type="checkbox" id="global-quotes" onchange="toggleGlobalQuotes(this.checked)">
            <label for="global-quotes">Use quotes for all values</label>
        </div>
    </div>

    <div id="variables-container">
        <div class="empty-state">
            <h2>No Environment Variables</h2>
            <p>Click the + button to get started</p>
        </div>
    </div>

    <button class="floating-add-btn" onclick="addVariable()" title="Add Variable">
        + Add Variable
    </button>

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
        let envData = { variables: [], format: 'equals', globalQuotes: false };
        let autoSaveTimeout;
        let pendingDeleteIndex = -1;

        function scheduleAutoSave() {
            clearTimeout(autoSaveTimeout);

            autoSaveTimeout = setTimeout(() => {
                saveFile(true);
            }, 500);
        }

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    envData = message.data;
                    if (!envData.hasOwnProperty('globalQuotes')) {
                        envData.globalQuotes = false;
                    }
                    renderVariables();
                    updateFormatTabs();
                    updateGlobalQuotes();
                    break;
            }
        });

        function renderVariables() {
            const container = document.getElementById('variables-container');

            // Show debug view if there are parsing errors
            if (envData.hasErrors && envData.parseErrors && envData.parseErrors.length > 0) {
                renderDebugView(container);
                return;
            }

            // Show/hide normal controls
            document.querySelector('.format-and-quotes').style.display = 'flex';
            document.querySelector('.floating-add-btn').style.display = 'flex';

            if (envData.variables.length === 0) {
                container.innerHTML = \`
                    <div class="empty-state">
                        <h2>No Environment Variables</h2>
                        <p>Click the + button to get started</p>
                    </div>
                \`;
                return;
            }

            container.innerHTML = \`
                <div class="variable-list">
                    \${envData.variables.map((variable, index) => \`
                        <div class="variable-item \${variable.disabled ? 'disabled' : ''}">
                            <div class="variable-fields">
                                <div class="variable-row">
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
                                    </div>
                                    <div class="field-group">
                                        <label>&nbsp;</label>
                                        <button class="toggle-btn \${variable.disabled ? 'btn-enable' : 'btn-disable'}"
                                                onclick="toggleVariable(\${index})"
                                                title="\${variable.disabled ? 'Enable variable' : 'Disable variable'}">
                                            \${variable.disabled ? 'Enable' : 'Disable'}
                                        </button>
                                    </div>
                                    <div class="field-group">
                                        <label>&nbsp;</label>
                                        <button class="delete-btn" onclick="showDeleteConfirm(\${index}, '\${variable.key}')">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div class="field-group">
                                    <label>Description</label>
                                    <textarea oninput="updateVariable(\${index}, 'description', this.value); autoResize(this)"
                                              placeholder="Describe what this variable is used for...">\${variable.description || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;

            // Auto-resize all textareas after rendering
            setTimeout(resizeAllTextareas, 0);
        }

        function renderDebugView(container) {
            const errorCount = envData.parseErrors.length;
            const errorWord = errorCount === 1 ? 'error' : 'errors';

            container.innerHTML = \`
                <div class="debug-view">
                    <div class="debug-header">
                        <span class="debug-icon">⚠️</span>
                        <div>
                            <h2 class="debug-title">Parsing Error</h2>
                            <p class="debug-subtitle">Found \${errorCount} \${errorWord} in environment file</p>
                        </div>
                    </div>

                    <div class="error-list">
                        \${envData.parseErrors.map(error => \`
                            <div class="error-item">
                                <div class="error-line-number">Line \${error.line}</div>
                                <div class="error-content">\${error.content}</div>
                                <div class="error-message">\${error.error}</div>
                            </div>
                        \`).join('')}
                    </div>

                    <div class="debug-actions">
                        <button class="btn btn-open-raw" onclick="openRawFile()">
                            Open Raw File
                        </button>
                        <button class="btn btn-secondary" onclick="retryParsing()">
                            Retry Parsing
                        </button>
                    </div>
                </div>
            \`;

            // Hide format controls and add button when in debug mode
            document.querySelector('.format-and-quotes').style.display = 'none';
            document.querySelector('.floating-add-btn').style.display = 'none';
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
                isQuoted: envData.globalQuotes || false
            });
            renderVariables();
            // Don't auto-save when adding empty variable - wait for user input
        }

        function toggleGlobalQuotes(useQuotes) {
            envData.globalQuotes = useQuotes;
            // Update all existing variables
            envData.variables.forEach(variable => {
                variable.isQuoted = useQuotes;
            });
            updateGlobalQuotes();
            scheduleAutoSave();
        }

        function toggleQuotesClick() {
            const checkbox = document.getElementById('global-quotes');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                toggleGlobalQuotes(checkbox.checked);
            }
        }

        function updateGlobalQuotes() {
            const checkbox = document.getElementById('global-quotes');
            const toggleDiv = document.querySelector('.quotes-toggle');
            if (checkbox && toggleDiv) {
                checkbox.checked = envData.globalQuotes || false;
                if (envData.globalQuotes) {
                    toggleDiv.classList.add('active');
                } else {
                    toggleDiv.classList.remove('active');
                }
            }
        }

        function autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
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

                // Only auto-save if the variable has a key (meaningful content)
                const hasValidKey = envData.variables.some(variable =>
                    variable.key && variable.key.trim().length > 0
                );

                if (hasValidKey) {
                    scheduleAutoSave();
                }
            }
        }

        function toggleVariable(index) {
            if (envData.variables[index]) {
                envData.variables[index].disabled = !envData.variables[index].disabled;
                renderVariables();
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

        function resizeAllTextareas() {
            document.querySelectorAll('textarea').forEach(autoResize);
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

        // Debug view action handlers
        window.openRawFile = function() {
            vscode.postMessage({ type: 'openRawFile' });
        };

        window.retryParsing = function() {
            vscode.postMessage({ type: 'retryParsing' });
        };

        vscode.postMessage({ type: 'ready' });

        // Auto-resize textareas after rendering
        const observer = new MutationObserver(() => {
            setTimeout(resizeAllTextareas, 0);
        });

        observer.observe(document.getElementById('variables-container'), {
            childList: true,
            subtree: true
        });
    </script>
</body>
</html>`;
}
