# JSON i18n Translation Tool

<p align="center">
  <img src="public/logo-blue.png" alt="JSON Translate Logo" width="200"/>
</p>

<p align="center">
  <strong>🌐 AI-Powered JSON Internationalization Translation Tool</strong>
</p>

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="package.json">
    <img src="https://img.shields.io/badge/version-0.1.0-green.svg" alt="Version">
  </a>
  <a href="https://cursor.sh">
    <img src="https://img.shields.io/badge/Built%20with-Cursor-blue?style=flat" alt="Built with Cursor">
  </a>
</p>

<p align="center">
  <a href="/README.md">English</a> | 
  <a href="/README.zh.md">简体中文</a>
</p>

<p align="center">
  An open-source project developed with Cursor AI, sharing not just code but the entire product design process
</p>

<p align="center">
  This project demonstrates how to use AI tools for product development. We've open-sourced:
</p>

<p align="center">
  🔸 Complete Product Requirements Document (PRD) - Showing how AI assists in product design<br>
  🔸 Full Source Code - Demonstrating AI-assisted code implementation<br>
  🔸 Development Process Documentation - Helping developers understand AI-assisted workflow
</p>

<p align="center">
  Our goal is to help developers and product managers understand and utilize AI tools to improve development efficiency
</p>

## ✨ Features

- 🤖 Smart translation powered by OpenAI GPT models
- 🔄 Maintains JSON structure integrity
- 🌍 Supports 40+ languages
- 🌐 Multi-language interface
- ⚡️ Real-time translation preview
- 🛡️ Local API key usage for security
- 📦 Export translation results
- 🎯 Accurate technical term translation
- 💻 Fully open source, transparent code

## 📖 AI-Driven Product Design

This project not only open-sources the code but also includes a complete [Product Requirements Document (PRD)](./json-translator-prd.md). This PRD was created with the assistance of Cursor AI and serves as:

### 🎯 Reference for Product Managers
- How to conduct product requirement analysis
- How to define target user groups
- How to design feature modules
- How to plan product iterations

## 🚀 Quick Start

### Requirements

- Node.js >= 16.0.0
- npm or yarn or pnpm
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/ViggoZ/json-translate.git

# Enter the project directory
cd json-translate

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```
Visit http://localhost:3000 to view the development environment.

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📖 Usage Guide

1. **Preparation**
   - Prepare your JSON file for translation
   - Get your OpenAI API key (https://platform.openai.com)

2. **Getting Started**
   - Visit the website
   - Upload JSON file (drag & drop supported)
   - Select target language
   - Enter API key
   - Start translation

3. **Features**
   - Single JSON file translation
   - Real-time translation preview
   - Export in JSON format

## 💡 Best Practices

- Split large files into smaller ones for translation
- Verify JSON format before translation
- Use preview feature to confirm translation quality
- Regularly backup important translation files

## 🛠 Tech Stack

- **Development Tool**: 
  - Cursor (AI-assisted development)
- **Framework**: Next.js 14
- **UI**: 
  - React 18
  - Tailwind CSS
  - Radix UI
  - HeadlessUI
- **Language**: TypeScript
- **API**: OpenAI API
- **Libraries**:
  - JSZip (file handling)
  - React Syntax Highlighter
  - React Window (virtual list)

## 🤝 Contributing

We welcome all forms of contributions, whether it's new features, bug fixes, or documentation improvements.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Ensure code passes `npm run lint`
- Test functionality before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙋 FAQ

**Q: Is the API key secure?**  
A: Yes. API keys are only used temporarily in the browser and are never saved or transmitted to servers.

**Q: Which languages are supported?**  
A: 40+ major languages including but not limited to:
- Chinese (Simplified/Traditional)
- English
- Japanese
- Korean
- French
- German
- Spanish
- Russian
etc.

**Q: Is there a file size limit?**  
A: Single files are limited to 10MB.

## 📞 Contact

- Author: Viggo
- Email: viggo.zw@gmail.com
- Twitter: [@viggo](https://twitter.com/decohack)

## 🌟 Acknowledgments

Thanks to all users who provided feedback. Special thanks to:

- OpenAI team for their powerful API
- Next.js team for the excellent framework
- All project contributors

---

If this project helps you, please give it a star ⭐️!

<p align="center">Made with ❤️ by [@viggo](https://twitter.com/decohack)</p>