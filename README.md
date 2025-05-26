# md-to-sapui5-xml

## 📘 Introduction

**md-to-sapui5-xml** is a CLI tool that converts Markdown files (`.md`) into SAPUI5 XML views.

It reads Markdown content and transforms it into structured SAPUI5-compatible XML using a configurable processor pipeline. This tool is ideal for generating documentation views dynamically in SAPUI5 applications.

> 💡 **This README.md file serves as a full Markdown example**.  
> You can run it directly through the CLI to see how every Markdown type is rendered into SAPUI5.

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

Currently, **md-to-sapui5-xml** does **not** support the following Markdown features:

- Highlight
- Subscript
- Superscript
- Heading IDs
- Definition Lists
- Emoji
- Fenced Code Block Info Strings (language labels)
- Inline Code with complex formatting (beyond basic inline code)
- Blockquotes with nested complex elements

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

## 📄 Full Markdown Syntax Example

This section demonstrates every Markdown type supported by the library.  
✅ You can use this README directly to test rendering output.

---

### Headings

# H1 Heading

## H2 Heading

### H3 Heading

#### H4 Heading

##### H5 Heading

###### H6 Heading

---

### Text Formatting

This is a normal paragraph with:

- **Bold**
- _Italic_
- **_Bold & Italic_**
- ~~Strikethrough~~

---

### Links

Inline link: [SAP](https://www.sap.com)

Reference-style link: [GitHub][github]

[github]: https://github.com/

---

### Lists

#### Unordered List

- First item
- Second item
  - Nested item
  - Another nested item

#### Ordered List

1. Step one
2. Step two
3. Step three

### Images

Inline image:  
![SAP Logo](https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg)
