# EnView - Environment File Viewer

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

### Running the Extension

1. Open this folder in VS Code
2. Press `F5` to open a new Extension Development Host window
3. Create or open a `.env` file
4. Click the preview button to test the extension

### Building

```bash
npm run compile
```

### Testing

```bash
npm test
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

Initial release of EnView:

- Visual environment file editor
- Support for multiple .env file patterns
- Comment and description support
- Format conversion capabilities
- Preview button integration
