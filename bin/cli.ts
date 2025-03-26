#!/usr/bin/env ts-node
import { convertMarkdownToXml } from '../src/index.js';
import yargs from 'yargs';
import * as path from 'path';

interface IArgv {
  mdPath: string;
  outDir: string;
  withNav: boolean;
  controllerPath?: string;
  _: (string | number)[];
  $0: string;
}

const argv = yargs
  .option('mdPath', {
    describe: 'Path to the input markdown file',
    type: 'string',
    demandOption: true,
  })
  .option('outDir', {
    describe: 'Directory to save the output SAPUI5 files',
    type: 'string',
    demandOption: true,
  })
  .option('with-nav', {
    describe: 'Include navigation fragment in the generated view',
    type: 'boolean',
    default: false,
  })
  .option('controllerPath', {
    describe: 'Path to save the generated controller file',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv as IArgv;

const { mdPath, outDir, withNav, controllerPath } = argv;

const finalControllerPath =
  controllerPath || path.join(outDir, 'controller', 'Main.controller.ts');

convertMarkdownToXml(mdPath, outDir, withNav, finalControllerPath)
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
