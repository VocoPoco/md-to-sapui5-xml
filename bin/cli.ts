#!/usr/bin/env ts-node
import { convertMarkdownToXml } from 'src/index.js';

const [, , inputFilePath, outputDir] = process.argv;

if (!inputFilePath || !outputDir) {
  console.error('Usage: md-to-sapui5-xml <path-to-md-file> <output-directory>');
  process.exit(1);
}

convertMarkdownToXml(inputFilePath, outputDir)
  .then((xmlPath: string) => {
    console.log(`Conversion successful! XML saved at: ${xmlPath}`);
  })
  .catch((error: Error) => {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  });
