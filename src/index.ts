import path from 'path';
import ASTToSapui5XML from './converters/ASTToSapui5XML.js';
import MarkdownToASTConverter from './converters/MarkdownToAST.js';
import FileManager from './utils/FileManager.js';
import NavigationFragmentGenerator from './converters/NavFragmentGenerator.js';
import { renderTemplate } from './utils/TemplateRenderer.js';
import type Paths from './types/Paths.js';
import { Root } from 'mdast';

const MAIN_VIEW_TEMPLATE = 'Main.view.njk';
const NAV_FRAGMENT_TEMPLATE = 'NavigationFragment.fragment.njk';
const NAV_CONTROLLER_TEMPLATE = 'Navigation.controller.njk';

/**
 * Converts a Markdown file to SAPUI5 XML.
 * @param paths - Object that stores all paths for conversion.
 * @param withNavigation - Whether to include navigation fragment.
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

  const ast = await convertMarkdownToAst(markdownFilePath);
  const wrappedContent = generateXmlContent(ast);

  await generateMainView({
    content: wrappedContent,
    outputPath: documentationViewPath,
    controllerPath: navigationControllerPath,
    fragmentPath: navigationFragmentPath,
    withNavigation,
  });

  if (withNavigation) {
    await generateNavigationFragment(navigationFragmentPath);
  }

  await generateController(navigationControllerPath);

  return {
    documentationViewPath,
    navigationFragmentPath,
    navigationControllerPath,
  };
}

async function convertMarkdownToAst(filePath: string): Promise<Root> {
  const markdownContent = await FileManager.readFile(filePath);
  const converter = new MarkdownToASTConverter();
  return converter.convert(markdownContent);
}

function generateXmlContent(ast: Root): string {
  const xmlConverter = new ASTToSapui5XML();
  const wrappedTemplates: string[] = xmlConverter.convert(ast);
  return wrappedTemplates.join('\n');
}

async function generateMainView(options: {
  content: string;
  outputPath: string;
  controllerPath: string;
  fragmentPath: string;
  withNavigation: boolean;
}): Promise<void> {
  const mainViewXml = renderTemplate(MAIN_VIEW_TEMPLATE, {
    controller_path: convertPathToNamespace(options.controllerPath),
    fragment_path: convertPathToNamespace(options.fragmentPath),
    content: options.content,
    with_navigation: options.withNavigation,
  });

  await FileManager.saveAsFile(options.outputPath, mainViewXml);
}

async function generateNavigationFragment(outputPath: string): Promise<void> {
  const navFragmentXml = renderTemplate(NAV_FRAGMENT_TEMPLATE, {
    navigation_content: NavigationFragmentGenerator.generateFragment(),
  });

  await FileManager.saveAsFile(outputPath, navFragmentXml);
}

async function generateController(outputPath: string): Promise<void> {
  const className = getClassNameFromPath(outputPath);

  const controllerContent = renderTemplate(NAV_CONTROLLER_TEMPLATE, {
    class_name: className,
  });

  await FileManager.saveAsFile(outputPath, controllerContent);
}

export function convertPathToNamespace(
  filePath: string,
  baseDir: string = 'webapp',
  rootNamespace: string = 'com.thesistues.ui5app',
): string {
  const absoluteFilePath: string = path.resolve(filePath);
  const absoluteBasePath: string = path.resolve(baseDir);
  const relativePath: string = path.relative(
    absoluteBasePath,
    absoluteFilePath,
  );

  const segments: string[] = relativePath.split(path.sep);
  const lastSegment: string | undefined = segments.pop();
  if (!lastSegment) {
    throw new Error(`Invalid file path: ${filePath}`);
  }

  const nameParts: string[] = lastSegment.split('.');
  if (nameParts.length > 1) {
    nameParts.pop();
  }

  const cleanedNameParts: string[] = nameParts.filter(
    (part) => part !== 'controller' && part !== 'fragment',
  );

  segments.push(cleanedNameParts.join(''));
  return `${rootNamespace}.${segments.join('.')}`;
}

export function getClassNameFromPath(controllerPath: string): string {
  const baseName = path.basename(controllerPath);
  const nameParts = baseName.split('.');
  return nameParts[0];
}
