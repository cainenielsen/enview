# Enview - Visual Environment File Editor

Transform your `.env` file management with a beautiful, intuitive visual editor for VS Code.

![Enview Editor](https://raw.githubusercontent.com/cainenielsen/enview/main/assets/homepage.png)

## ✨ Features

### 🎨 Visual Interface

Replace messy text editing with a clean, organized interface that makes managing environment variables a breeze.

![Visual Interface](https://raw.githubusercontent.com/cainenielsen/enview/main/assets/ui.png)

### 🚀 Smart Parsing & Error Handling

Automatically detects syntax errors and provides helpful debugging information with clear error messages and line highlighting.

![Error Handling](https://raw.githubusercontent.com/cainenielsen/enview/main/assets/errors.png)

### 💡 Intelligent Features

- **Auto-save**: Changes are saved automatically as you type
- **Comment Support**: Add descriptions that become proper comments
- **Format Conversion**: Switch between `KEY=value` and `KEY: "value"` formats
- **Disable/Enable Variables**: Comment out variables without deleting them
- **Multi-line Descriptions**: Full support for detailed variable documentation

![Feature Showcase](https://raw.githubusercontent.com/cainenielsen/enview/main/assets/features.png)

### 📁 Universal File Support

Works seamlessly with all common environment file patterns:

- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.staging`
- `.env.test`
- Any `*.env*` pattern

## 🚀 Quick Start

1. **Install** Enview from the VS Code Marketplace
2. **Open** any `.env` file in VS Code
3. **Click** the preview button (👁️) in the editor toolbar
4. **Start editing** with the beautiful visual interface!

![Preview](https://raw.githubusercontent.com/cainenielsen/enview/main/assets/preview.png)

## 🎯 Why Choose Enview?

| Traditional Text Editor | 📝  | Enview Visual Editor      | ✨  |
| ----------------------- | --- | ------------------------- | --- |
| Manual syntax checking  | ❌  | Automatic error detection | ✅  |
| Easy to make mistakes   | ❌  | Input validation          | ✅  |
| Hard to organize        | ❌  | Visual organization       | ✅  |
| No descriptions         | ❌  | Rich documentation        | ✅  |
| Manual commenting       | ❌  | One-click disable/enable  | ✅  |

## 🔧 Format Support

### Equals Format

```bash
# Database configuration
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY="secret-key-with-spaces"
DEBUG_MODE=true
```

### Colon Format

```yaml
# Database configuration
DATABASE_URL: "postgresql://localhost:5432/mydb"
API_KEY: "secret-key-with-spaces"
DEBUG_MODE: "true"
```

## 🌟 What Users Say

> "Enview transformed how our team manages environment variables. No more syntax errors!" - Developer

> "The visual interface makes onboarding new team members so much easier." - Team Lead

> "Finally, a tool that makes .env files actually manageable." - DevOps Engineer

## 📋 Requirements

- VS Code `^1.101.0`
- No additional dependencies required!

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for development setup, building instructions, and how to get involved.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=cainenielsen.enview)
- [GitHub Repository](https://github.com/cainenielsen/enview)
- [Report Issues](https://github.com/cainenielsen/enview/issues)
- [Feature Requests](https://github.com/cainenielsen/enview/issues/new?template=feature_request.md)

---

Made with ❤️ for developers who deserve better tools.
