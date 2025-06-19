# Enview - Environment File Viewer

A VS Code extension that provides a visual interface for managing .env files with an intuitive, user-friendly editor.

## Features

- **Visual Editor**: Replace text editing with a clean, organized interface for environment variables
- **Preview Button**: Adds a preview button to .env files in the editor toolbar
- **Smart Parsing**: Automatically detects and preserves different .env file formats
- **Comment Support**: Add descriptions to variables that become comments in the file
- **Format Conversion**: Convert between `KEY=value` and `KEY: "value"` formats
- **File Pattern Support**: Works with `.env`, `.env.local`, `.env.development`, `.env.production`, and more

## Usage

1. Open any `.env` file in VS Code
2. Click the preview button (👁️) in the editor toolbar
3. Use the visual interface to:
   - Add new environment variables
   - Edit existing variables and values
   - Add descriptions that become comments
   - Toggle quote usage for values
   - Switch between different formats
4. Click "Save" to update the original file

## Supported File Patterns

- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.staging`
- `.env.test`
- Any file matching `*.env*`

## Format Support

### Equals Format (default)

```
# Database configuration
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY="secret-key-with-spaces"
```

### Colon Format

```
# Database configuration
DATABASE_URL: "postgresql://localhost:5432/mydb"
API_KEY: "secret-key-with-spaces"
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- VS Code
- Git

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/cainenielsen/enview.git
   cd enview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Building the Extension

1. **Compile TypeScript**:

   ```bash
   npm run compile
   ```

2. **Watch mode** (for development):

   ```bash
   npm run watch
   ```

3. **Production build**:
   ```bash
   npm run package
   ```

### Testing the Extension

#### Method 1: Extension Development Host (Recommended for development)

1. Open this folder in VS Code
2. Press `F5` to open a new Extension Development Host window
3. Create or open a `.env` file
4. Click the preview button to test the extension

#### Method 2: Unit Tests

```bash
npm test
```

### Creating a VSIX Package

To create an installable extension package:

1. **Install the VSCE tool** (if not already installed):

   ```bash
   npm install -g @vscode/vsce
   ```

2. **Generate the VSIX package**:

   ```bash
   vsce package
   ```

   This creates a file named `enview---environment-file-viewer-0.0.1.vsix`

### Installing the Extension

Once you have the VSIX file, you can install it using any of these methods:

#### Method 1: VS Code Command Palette (Recommended)

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: `Extensions: Install from VSIX...`
4. Select the command and browse to your `.vsix` file
5. Click Install

#### Method 2: Command Line

```bash
code --install-extension enview---environment-file-viewer-0.0.1.vsix
```

#### Method 3: Drag and Drop

1. Open VS Code
2. Open the Extensions view (`Ctrl+Shift+X`)
3. Drag your `.vsix` file into the Extensions view
4. Confirm installation

### Updating the Extension

When making changes:

1. Update the version in `package.json`
2. Build the extension: `npm run package`
3. Create new VSIX: `vsce package`
4. Install the updated VSIX using any method above

### Publishing to Marketplace (Optional)

To publish to the VS Code Marketplace:

1. **Create a publisher account** at [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)

2. **Update package.json** with your publisher name:

   ```json
   "publisher": "your-actual-publisher-name"
   ```

3. **Login to VSCE**:

   ```bash
   vsce login your-publisher-name
   ```

4. **Publish**:
   ```bash
   vsce publish
   ```

## Requirements

- VS Code ^1.101.0

## Extension Settings

This extension contributes the following settings:

- Custom editor for `.env` files
- Preview command in editor toolbar
- Language support for environment files

## Known Issues

- Large .env files (>1000 variables) may experience slower performance
- Complex variable values with special characters may need manual verification

## Release Notes

### 0.0.1

Initial release of Enview:

- Visual environment file editor
- Support for multiple .env file patterns
- Comment and description support
- Format conversion capabilities
- Preview button integration
