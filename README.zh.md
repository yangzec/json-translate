# JSON i18n 翻译工具

<p align="center">
  <a href="https://json.uiboy.com">
    <img src="https://img.shields.io/badge/官网-json.uiboy.com-blue?style=flat-square" alt="官网">
  </a>
</p>

<p align="center">
  <strong>🔗 <a href="https://json.uiboy.com">https://json.uiboy.com</a></strong><br>
  免费在线JSON翻译工具，支持40+种语言，由AI驱动
</p>

<p align="center">
  <img src="public/logo-blue.png" alt="JSON Translate Logo" width="200"/>
</p>

<p align="center">
  <strong>🌐 AI驱动的JSON国际化翻译工具</strong>
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
  <strong>🎯 AI 辅助开发全过程开源</strong>
</p>

<p align="center">
  这个项目展示了一个完整的 AI 辅助开发过程，从产品设计到代码实现
</p>

<p align="center">
  <strong>开源内容包括：</strong>
</p>

<p align="center">
  🔸 <strong>产品需求文档</strong> - 完整的 AI 辅助产品需求文档<br>
  🔸 <strong>源代码</strong> - 全部项目代码与 AI 功能实现
</p>

## ✨ 特性

- 🤖 基于OpenAI GPT模型的智能翻译
- 🔄 保持JSON结构完整性
- 🌍 支持40+种语言
- 🌐 网站界面支持多语言切换
- ⚡️ 实时翻译预览
- 🛡️ API密钥本地使用,注重安全
- 📦 支持批量导出翻译结果
- 🎯 专业术语准确翻译
- 💻 完全开源,代码透明

## 📖 AI驱动的产品设计

本项目包含完整的产品需求文档（提供中英文版本）：
- [English PRD](./json-translator-prd.md)
- [中文 PRD](./json-translator-prd.zh.md)

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm 或 yarn 或 pnpm
- OpenAI API密钥

### 安装

```bash
# 克隆仓库
git clone https://github.com/ViggoZ/json-translate.git

# 进入项目目录
cd json-translate

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```
访问 http://localhost:3000 查看开发环境。

### 构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 📖 使用指南

1. **准备工作**
   - 准备需要翻译的JSON文件
   - 获取OpenAI API密钥 (https://platform.openai.com)

2. **开始使用**
   - 访问网站
   - 上传JSON文件 (支持拖拽上传)
   - 选择目标语言
   - 输入API密钥
   - 点击开始翻译

3. **功能说明**
   - 支持单个JSON文件翻译
   - 实时预览翻译结果
   - 支持导出JSON格式

## 💡 最佳实践

- 建议将大文件拆分成小文件翻译
- 翻译前检查JSON格式是否正确
- 使用预览功能确认翻译质量
- 定期备份重要的翻译文件

## 🛠 技术栈

- **开发工具**: 
  - Cursor (AI辅助开发)
- **框架**: Next.js 14
- **UI**: 
  - React 18
  - Tailwind CSS
  - Radix UI
  - HeadlessUI
- **语言**: TypeScript
- **API**: OpenAI API
- **工具库**:
  - JSZip (文件处理)
  - React Syntax Highlighter (代码高亮)
  - React Window (虚拟列表)

## 🤝 贡献指南

我欢迎所有形式的贡献，无论是新功能、bug修复还是文档改进。

1. Fork 项目
2. 创建分支 (`git checkout -b feature/YourFeature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/YourFeature`)
5. 提交 Pull Request

### 开发指南
- 遵循项目现有的代码风格
- 确保代码通过 `npm run lint` 检查
- 提交前测试功能是否正常工作

## 📝 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙋 常见问题

**Q: API密钥安全吗？**  
A: 是的。API密钥仅在浏览器中临时使用，不会保存或传输到服务器。

**Q: 支持哪些语言？**  
A: 支持40+种主流语言，包括但不限于：
- 中文(简体/繁体)
- 英语
- 日语
- 韩语
- 法语
- 德语
- 西班牙语
- 俄语
等

**Q: 文件大小有限制吗？**  
A: 单个文件限制为10MB。

## 📞 联系方式

- 作者：Viggo
- Email：viggo.zw@gmail.com
- Twitter：[@viggo](https://twitter.com/decohack)

## 🌟 致谢

感谢所有为这个项目提供反馈的用户。特别感谢：

- OpenAI 团队提供的强大API支持
- Next.js 团队的出色框架
- 所有项目贡献者

---

如果这个项目对你有帮助，欢迎 star ⭐️ 支持一下！

<p align="center">用 ❤️ 制作 by [@viggo](https://twitter.com/decohack)</p>