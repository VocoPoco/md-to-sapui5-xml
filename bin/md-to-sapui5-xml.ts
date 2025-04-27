#!/usr/bin/env ts-node

import { convertMarkdownToXml } from '../src/index.js';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_NAME = 'md-to-sapui5-xml.config.json';
const CONFIG_PATH = path.resolve(process.cwd(), CONFIG_NAME);

if (!fs.existsSync(CONFIG_PATH)) {
  console.error(
    `ERROR: Could not find config file: md-to-sapui5-xml.config.json`,
  );
  process.exit(1);
}

const configRaw = fs.readFileSync(CONFIG_PATH, 'utf-8');
const config = JSON.parse(configRaw);

const { markdownFile, xmlOutFile, controllerOutFile, withNav } = config;
if (!markdownFile || !xmlOutFile || !controllerOutFile || !withNav) {
  throw new Error(
    'Config must contain "markdownFile", "xmlOutFile", "withNav" and "controllerOutFile" properties.',
  );
}
if (!fs.existsSync(markdownFile)) {
  throw new Error(`Markdown file not found: ${markdownFile}`);
}

fs.mkdirSync(path.dirname(xmlOutFile), { recursive: true });
fs.mkdirSync(path.dirname(controllerOutFile), { recursive: true });

const outDir = path.dirname(xmlOutFile);

convertMarkdownToXml(markdownFile, outDir, withNav, controllerOutFile)
  .then(({ xmlPath, navPath, controllerPath }) => {
    console.log(`Conversion successful! XML saved at: ${xmlPath}`);
    if (withNav) {
      console.log(`Navigation fragment saved at: ${navPath}`);
    }
    if (controllerPath) {
      console.log(`Controller saved at: ${controllerPath}`);
    }
  })
  .catch((error: Error) => {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  });
