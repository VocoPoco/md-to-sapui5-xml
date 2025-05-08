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

const {
  markdownFile,
  documentationViewPath,
  navigationControllerPath,
  navigationFragmentPath,
  withNav,
} = config;
if (
  !markdownFile ||
  !documentationViewPath ||
  !navigationControllerPath ||
  !navigationFragmentPath ||
  !withNav
) {
  throw new Error(
    'Config must contain "markdownFile", "documentationViewPath", "withNav", "navigationFragmentPath" and "navigationControllerPath" properties.',
  );
}
if (!fs.existsSync(markdownFile)) {
  throw new Error(`Markdown file not found: ${markdownFile}`);
}

fs.mkdirSync(path.dirname(documentationViewPath), { recursive: true });
fs.mkdirSync(path.dirname(navigationFragmentPath), { recursive: true });
fs.mkdirSync(path.dirname(navigationControllerPath), { recursive: true });

convertMarkdownToXml(
  markdownFile,
  documentationViewPath,
  withNav,
  navigationFragmentPath,
  navigationControllerPath,
)
  .then(
    ({
      documentationViewPath,
      navigationFragmentPath,
      navigationControllerPath,
    }) => {
      console.log(
        `Conversion successful! XML saved at: ${documentationViewPath}`,
      );
      if (withNav) {
        console.log(`Navigation fragment saved at: ${navigationFragmentPath}`);
      }
      if (navigationControllerPath) {
        console.log(`Controller saved at: ${navigationControllerPath}`);
      }
    },
  )
  .catch((error: Error) => {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  });
