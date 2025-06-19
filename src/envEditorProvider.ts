import * as vscode from 'vscode';
import { EnvParser } from './envParser';
import { getWebviewContent } from './webviewContent';

export class EnvEditorProvider implements vscode.CustomTextEditorProvider {
  private isUpdatingDocument = false;

  constructor(private readonly context: vscode.ExtensionContext) { }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    // Set the HTML content
    webviewPanel.webview.html = getWebviewContent(webviewPanel.webview, this.context.extensionUri);

    // Update the webview when the document changes
    const updateWebview = () => {
      const envData = EnvParser.parse(document.getText());
      webviewPanel.webview.postMessage({
        type: 'update',
        data: envData
      });
    };

    // Listen for changes in the document (but ignore our own updates)
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString() && !this.isUpdatingDocument) {
        updateWebview();
      }
    });

    // Handle messages from the webview
    webviewPanel.webview.onDidReceiveMessage(
      async message => {
        switch (message.type) {
          case 'save':
            await this.saveDocument(document, message.data, webviewPanel, false);
            break;
          case 'autoSave':
            await this.saveDocument(document, message.data, webviewPanel, true);
            break;
          case 'ready':
            updateWebview();
            break;
          case 'preview':
            // Open preview in a new tab
            const previewContent = EnvParser.formatForPreview(message.data);
            const previewUri = vscode.Uri.parse(`enview-preview:${document.fileName}`);
            await vscode.commands.executeCommand('vscode.openWith', previewUri, 'default');
            break;
          case 'openRawFile':
            // Open the file in the default text editor
            await vscode.commands.executeCommand('vscode.openWith', document.uri, 'default');
            break;
          case 'retryParsing':
            // Re-parse the document and update the webview
            updateWebview();
            break;
        }
      },
      null,
      this.context.subscriptions
    );

    // Make sure we get rid of the listener when our editor is closed
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Send initial data
    updateWebview();
  }

  private async saveDocument(
    document: vscode.TextDocument,
    envData: any,
    webviewPanel: vscode.WebviewPanel,
    isAutoSave: boolean = false
  ): Promise<void> {
    try {
      // Set flag to prevent refresh loop
      this.isUpdatingDocument = true;

      const newContent = EnvParser.serialize(envData);

      // Create a WorkspaceEdit to update the document
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      edit.replace(document.uri, fullRange, newContent);

      // Apply the edit
      const success = await vscode.workspace.applyEdit(edit);

      if (success) {
        // Only save explicitly for manual saves, not auto-saves
        if (!isAutoSave) {
          await document.save();
        }
      } else {
        vscode.window.showErrorMessage('Failed to update environment file');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Error saving file: ${error}`);
    } finally {
      // Reset flag to allow external changes to trigger updates
      this.isUpdatingDocument = false;
    }
  }
}
