import path from 'path';
import ASTToSapui5XML from './converters/ASTToSapui5XML.js';
import MarkdownToASTConverter from './converters/MarkdownToAST.js';
import FileManager from './utils/FileManager.js';
import NavigationFragmentGenerator from './converters/NavFragmentGenerator.js';
import { renderTemplate } from './utils/TemplateRenderer.js';
import Paths from './types/Paths.js';

/**
 * Converts a Markdown file to SAPUI5 XML.
 * @param paths - Object that stores all paths for conversion.
 * @param withNavigation - Whether to include navigation fragment.
 * @throws {Error} If the input parameters are invalid.
 */
export async function convertMarkdownToXml(
  paths: Paths,
  withNavigation: boolean,
) {
  const {
    markdownFilePath,
    documentationViewPath,
    navigationFragmentPath,
    navigationControllerPath,
  } = paths;

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

function convertPathToNamespace(
  filePath: string,
  baseDir = 'webapp',
  rootNamespace = 'com.thesistues.ui5app',
): string {
  const normalized = filePath.replace(/\\/g, '/');

  const relative = normalized.split(`${baseDir}/`).pop() || '';

  const cleaned = relative
    .replace(/\.controller|\.fragment/, '') // remove those suffixes
    .replace(/\.[^/.]+$/, ''); // remove file extension

  return `${rootNamespace}.${cleaned.replace(/\//g, '.')}`;
}

function getClassNameFromPath(controllerPath: string): string {
  return path
    .basename(controllerPath)
    .replace('.controller.ts', '')
    .replace('.ts', '');
}
