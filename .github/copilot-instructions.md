# Copilot Instructions for EnView Extension

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Overview

EnView is a VS Code extension that provides a visual interface for managing .env files. The extension includes:

1. **Preview Button**: Adds a preview button to .env files for opening the visual editor
2. **Visual Interface**: A custom webview panel for editing environment variables
3. **Comment Support**: Ability to add descriptions that become comments in the file
4. **Format Conversion**: Convert between different .env formats (var=val vs var: "val")
5. **File Pattern Support**: Works with .env, .env.local, .env.development, etc.

## Key Features to Implement

- Custom editor provider for .env files
- Webview panel with React-like interface
- Environment variable parsing and serialization
- Comment preservation and generation
- Format detection and conversion
- File watching for external changes

## VS Code APIs Used

- vscode.window.createWebviewPanel
- vscode.workspace.registerTextDocumentContentProvider
- vscode.languages.registerDocumentLinkProvider
- vscode.commands.registerCommand
- vscode.workspace.onDidChangeTextDocument
