# Contributing to Enview

Thank you for your interest in contributing to Enview! This guide will help you get started with development.

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- VS Code
- Git

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/cainenielsen/enview.git
   cd enview
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development**:
   ```bash
   npm run watch
   ```

## 🏗️ Building the Extension

### Available Scripts

- `npm run compile` - Compile TypeScript for development
- `npm run watch` - Watch mode for development (recommended)
- `npm run package` - Production build with minification
- `npm run build-vsix` - Create installable VSIX package
- `npm run install-local` - Install the local VSIX package
- `npm run dev` - Full development cycle (build + install)

### Development Workflow

1. **Make changes** to the source code
2. **Run tests**: `npm test`
3. **Build and test locally**: `npm run dev`
4. **Test in Extension Development Host** (Press F5 in VS Code)

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Manual Testing

1. **Extension Development Host** (Recommended):

   - Open this folder in VS Code
   - Press `F5` to open Extension Development Host
   - Create/open a `.env` file
   - Test the visual editor

2. **Local Installation**:
   ```bash
   npm run dev
   ```

## 📦 Project Structure

```
src/
├── extension.ts              # Main extension entry point
├── envEditorProvider.ts      # Custom editor provider
├── envParser.ts             # Environment file parser
├── webviewContent.ts        # Visual editor UI
├── envFileDecorator.ts      # File explorer decorations
└── test/
    └── extension.test.ts    # Unit tests
```

## 🎨 Architecture

### Core Components

1. **EnvEditorProvider**: Manages the custom editor lifecycle
2. **EnvParser**: Handles parsing and serialization of .env files
3. **WebviewContent**: Provides the visual editing interface
4. **EnvFileDecorator**: Adds file explorer enhancements

### Key Features

- **Smart Parsing**: Handles multiple .env formats and syntax errors
- **Auto-save**: Debounced saves to prevent performance issues
- **Error Handling**: Visual debug view for parsing errors
- **Multi-line Comments**: Proper comment handling and formatting
- **Variable States**: Enable/disable variables with commenting

## 🔧 API Reference

### EnvParser

```typescript
interface EnvVariable {
  key: string;
  value: string;
  description?: string;
  isQuoted?: boolean;
  disabled?: boolean;
}

interface EnvData {
  variables: EnvVariable[];
  format: "equals" | "colon";
  parseErrors?: ParseError[];
  hasErrors?: boolean;
}
```

### Message API

The webview communicates with the extension through these message types:

- `ready` - Webview initialization complete
- `save` - Manual save request
- `autoSave` - Automatic save request
- `openRawFile` - Open file in text editor
- `retryParsing` - Re-parse after error fixes

## 📋 Guidelines

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions focused and testable

### Commit Messages

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Debugging

### VS Code Debug Configuration

The project includes debug configurations:

1. **Run Extension**: Launch Extension Development Host
2. **Extension Tests**: Run unit tests with debugging

### Common Issues

- **Webview not loading**: Check console for script errors
- **Auto-save not working**: Verify document change listeners
- **Parsing errors**: Test with various .env file formats

## 📈 Performance Considerations

- Auto-save is debounced to 1000ms to prevent excessive saves
- Large files (>1000 variables) may need optimization
- Webview rendering is optimized for typical .env file sizes

## 🚀 Release Process

### Quick Release (Recommended)

Use the convenient npm scripts for one-command releases:

```bash
# For bug fixes
npm run release:patch

# For new features  
npm run release:minor

# For breaking changes
npm run release:major
```

These scripts automatically:
- Bump the version in `package.json`
- Create a git tag
- Push changes and tags to trigger CI/CD

### Manual Release Process

The project uses GitHub Actions for automatic publishing to the VS Code Marketplace:

1. **Update version**:
   ```bash
   npm version patch  # or minor/major
   ```

2. **Push changes and tags**:
   ```bash
   git push origin main --tags
   ```

3. **Automatic workflow**:
   - Runs tests and builds extension
   - Publishes to VS Code Marketplace
   - Creates GitHub release with VSIX file

### Manual Publishing (Fallback)

If you need to publish manually:

1. **Build the extension**:

   ```bash
   npm run package
   npm run build-vsix
   ```

2. **Publish to marketplace**:
   ```bash
   npm run publish
   # or with explicit PAT:
   npx @vscode/vsce publish --pat YOUR_PAT_HERE
   ```

### CI/CD Setup

For maintainers setting up CI/CD:

1. **Create VS Code Marketplace Publisher Account**:

   - Visit [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
   - Note your publisher name

2. **Generate Personal Access Token (PAT)**:

   - Go to [Azure DevOps](https://dev.azure.com/)
   - Create PAT with `Marketplace > Manage` permissions

3. **Configure GitHub Repository**:

   - Add `VSCE_PAT` secret in GitHub repository settings
   - Update `publisher` field in `package.json`

4. **Workflow triggers automatically on**:
   - Version tags (e.g., `v1.0.1`)
   - Runs tests, builds, publishes, and creates releases

See [CI/CD Setup Guide](.github/CI-CD-SETUP.md) for detailed instructions.

### Version Management

Follow semantic versioning:

- `patch` (1.0.1) - Bug fixes
- `minor` (1.1.0) - New features (backward compatible)
- `major` (2.0.0) - Breaking changes

Update CHANGELOG.md with each release.

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create and test VSIX package
4. Tag release in Git
5. Publish to marketplace (automatic via CI/CD)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Getting Help

- [Open an issue](https://github.com/cainenielsen/enview/issues/new)
- [Join discussions](https://github.com/cainenielsen/enview/discussions)
- Review existing [documentation](README.md)

Thank you for contributing to Enview! 🙏
