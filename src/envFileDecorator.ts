import * as vscode from 'vscode';
import * as path from 'path';

export class EnvFileDecorator implements vscode.FileDecorationProvider {
    private _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined> = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
    readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[] | undefined> = this._onDidChangeFileDecorations.event;

    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
        const fileName = path.basename(uri.fsPath);

        // Check if this is an .env file
        if (fileName.match(/^\.env/)) {
            return {
                badge: '•',
                tooltip: 'Environment file - Right-click to preview or press Ctrl+Shift+E',
                color: new vscode.ThemeColor('charts.green')
            };
        }

        return undefined;
    }
}
