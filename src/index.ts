import assert from 'assert';
import fs from 'fs';
import path from 'path';
import ASTToSapui5XML from './converters/ASTToSapui5XML.js';
import MarkdownToASTConverter from './converters/MarkdownToAST.js';
import FileManager from './utils/FileManager.js';
import NavigationFragmentGenerator from './converters/NavFragmentGenerator.js';
import { renderTemplate } from './utils/TemplateRenderer.js';

/**
 * Converts a Markdown file to SAPUI5 XML.
 * @param markdownFilePath - Path to the Markdown file.
 * @param documentationViewPath - Output path for the Main.view.xml file.
 * @param withNavigation - Whether to include navigation fragment.
 * @param navigationFragmentPath - Output path for the NavigationFragment.fragment.xml.
 * @param navigationControllerPath - Output path for the Main.controller.ts file.
 * @throws {Error} If the input parameters are invalid.
 */
export async function convertMarkdownToXml(
  markdownFilePath: string,
  documentationViewPath: string,
  withNavigation: boolean,
  navigationFragmentPath: string,
  navigationControllerPath: string,
) {
  assert(
    typeof markdownFilePath === 'string' && markdownFilePath.trim() !== '',
    'Invalid markdown file path.',
  );
  assert(
    typeof documentationViewPath === 'string' &&
      documentationViewPath.trim() !== '',
    'Invalid output directory.',
  );

  assert(
    fs.existsSync(markdownFilePath),
    `Markdown file not found: ${markdownFilePath}`,
  );

  fs.mkdirSync(path.dirname(documentationViewPath), { recursive: true });
  if (withNavigation) {
    fs.mkdirSync(path.dirname(navigationFragmentPath), { recursive: true });
  }
  fs.mkdirSync(path.dirname(navigationControllerPath), { recursive: true });

  const markdownContent = await FileManager.readFile(markdownFilePath);
  const astConverter = new MarkdownToASTConverter();
  const xmlConverter = new ASTToSapui5XML();

  const ast = await astConverter.convert(markdownContent);
  const wrappedTemplates = xmlConverter.convert(ast);

  const mainXml = renderTemplate('Main.view.njk', {
    controller_path: convertPathToNamespace(navigationControllerPath),
    fragment_path: convertPathToNamespace(navigationFragmentPath),
    content: wrappedTemplates.join('\n'),
    with_navigation: withNavigation,
  });

  await FileManager.saveAsFile(documentationViewPath, mainXml);

  if (withNavigation) {
    const navFragmentXml = renderTemplate('NavigationFragment.fragment.njk', {
      navigation_content: NavigationFragmentGenerator.generateFragment(),
    });
    await FileManager.saveAsFile(navigationFragmentPath, navFragmentXml);
  }

  const controllerContent = renderTemplate('Navigation.controller.njk', {
    class_name: getClassNameFromPath(navigationControllerPath),
  });
  await FileManager.saveAsFile(navigationControllerPath, controllerContent);

  return {
    documentationViewPath,
    navigationFragmentPath,
    navigationControllerPath,
  };
}

function convertPathToNamespace(filePath: string): string {
  return filePath
    .replace(/^.*?webapp\//, 'com/thesistues/ui5app/') // TODO: do not hardcode this. Think of a way!
    .replace(/\.[^/.]+$/, '') // remove file extension
    .replace(/\//g, '.'); // replace "/" with "."
}

function getClassNameFromPath(controllerPath: string): string {
  return path
    .basename(controllerPath)
    .replace('.controller.ts', '')
    .replace('.ts', '');
}
