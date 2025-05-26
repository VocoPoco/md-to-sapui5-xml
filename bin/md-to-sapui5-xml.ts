#!/usr/bin/env ts-node

import { convertMarkdownToXml } from '../src/index.js';
import * as fs from 'fs';
import * as path from 'path';
import Paths from '../src/types/Paths.js';
import Config from '../src/types/Config.js';

const CONFIG_NAME = 'md-to-sapui5-xml.config.json';
const CONFIG_PATH = path.resolve(process.cwd(), CONFIG_NAME);

const REQUIRED_KEYS = [
  'appId',
  'paths.markdownFilePath',
  'paths.documentationViewPath',
  'paths.navigationFragmentPath',
  'paths.navigationControllerPath',
  'withNav',
];

const config = loadAndValidateConfig(CONFIG_PATH, REQUIRED_KEYS);

const { appId, paths, withNav } = config;

ensurePathsExist(paths);
ensureMarkdownFileExists(paths.markdownFilePath);

convertMarkdownToXml(appId, paths, withNav)
  .then(
    ({
      documentationViewPath,
      navigationFragmentPath,
      navigationControllerPath,
    }) => {
      console.log(`Documentation XML saved at: ${documentationViewPath}`);
      if (withNav) {
        console.log(`Navigation panel XML saved at: ${navigationFragmentPath}`);
        console.log(
          `Navigation controller saved at: ${navigationControllerPath}`,
        );
      }
    },
  )
  .catch((error) => {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  });

function loadAndValidateConfig(
  configPath: string,
  requiredKeys: string[],
): Config {
  if (!fs.existsSync(configPath)) {
    console.error(
      `ERROR: Could not find config file: ${path.basename(configPath)}`,
    );
    process.exit(1);
  }

  const configRaw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configRaw);

  validateConfig(config, requiredKeys);
  return config;
}

function ensurePathsExist(paths: Paths) {
  Object.values(paths)
    .filter(isPathToFile)
    .map(path.dirname)
    .forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

function ensureMarkdownFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }
}

function validateConfig(
  config: Record<string, unknown>,
  requiredKeys: string[],
) {
  const missingKeys = requiredKeys.filter((key) => {
    const [parent, child] = key.split('.');
    if (child) {
      const parentObj = config[parent];
      const isNestedKeyMissing =
        typeof parentObj === 'object' &&
        parentObj !== null &&
        !(child in parentObj);
      if (isNestedKeyMissing) {
        return true;
      }
    } else if (!(parent in config)) {
      return true;
    }

    return false;
  });

  if (missingKeys.length > 0) {
    throw new Error(
      `Invalid configuration. Missing keys: ${missingKeys.join(', ')}`,
    );
  }
}

function isPathToFile(value: unknown): value is string {
  return typeof value === 'string' && value.includes('.');
}
