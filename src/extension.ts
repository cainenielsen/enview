// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EnvEditorProvider } from './envEditorProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('EnView - Environment File Viewer is now active!');

	// Register the custom editor provider for .env files
	const envEditorProvider = new EnvEditorProvider(context);

	context.subscriptions.push(
		vscode.window.registerCustomEditorProvider(
			'enview.envEditor',
			envEditorProvider,
			{
				webviewOptions: {
					retainContextWhenHidden: true,
					enableFindWidget: true
				},
				supportsMultipleEditorsPerDocument: false
			}
		)
	);

	// Register the preview command
	const openPreviewCommand = vscode.commands.registerCommand('enview.openPreview', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const document = activeEditor.document;
			if (document.fileName.match(/\.env/)) {
				// Open the file with our custom editor
				vscode.commands.executeCommand('vscode.openWith', document.uri, 'enview.envEditor');
			} else {
				vscode.window.showWarningMessage('Please open an .env file first');
			}
		} else {
			vscode.window.showWarningMessage('No file is currently open');
		}
	});

	context.subscriptions.push(openPreviewCommand);
}

// This method is called when your extension is deactivated
export function deactivate() { }
