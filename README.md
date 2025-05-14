# md-to-sapui5-xml

## 📘 Introduction

**md-to-sapui5-xml** is a CLI tool that converts Markdown files (`.md`) into SAPUI5 XML views.

It reads Markdown content and transforms it into structured SAPUI5-compatible XML using a configurable processor pipeline. This tool is ideal for generating documentation views dynamically in SAPUI5 applications.

---

## 📦 What the Library Includes

- ✅ Support for various Markdown elements:
  - Headings (h1–h6)
  - Paragraphs
  - Bold / Italic / Inline Code / Strikethrough
  - Blockquotes
  - Links
  - Ordered & Unordered Lists
  - Code blocks
  - Horizontal rules
  - Escaped HTML
- 🧭 **Optional Navigation Panel**
- 🛠️ Easily configurable through a JSON config file

---

## ⚙️ Setup & Usage

### 1. Install the CLI

```bash
npm install md-to-sapui5-xml@latest
```

or use directly via NPX:

```bash
npm install md-to-sapui5-xml@latest
```

### 2. Add a Config File

Create a md-to-sapui5.config.json file in the root of your project (or specify --config path/to/config.json):

```bash
{
  "paths": {
    "markdownFilePath": "./webapp/data/md.md",
    "documentationViewPath": "./webapp/view/Main.view.xml",
    "navigationFragmentPath": "./webapp/view/NavigationFragment.fragment.xml",
    "navigationControllerPath": "./webapp/controller/Main.controller.ts"
  },
  "withNav": false
}
```

#### 🧾 Config File Options

| Property                         | Type    | Description                                                                             |
| -------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `paths.markdownFilePath`         | string  | Path to the input Markdown file                                                         |
| `paths.documentationViewPath`    | string  | Path where the generated SAPUI5 XML View will be saved                                  |
| `paths.navigationFragmentPath`   | string  | (Required if `withNav: true`) Path for the generated Navigation Fragment                |
| `paths.navigationControllerPath` | string  | (Required if `withNav: true`) Controller path for the navigation-enabled view           |
| `withNav`                        | boolean | Whether to generate the view with a side navigation panel (`true`) or without (`false`) |
