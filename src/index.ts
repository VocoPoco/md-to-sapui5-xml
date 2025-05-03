import assert from 'assert';
import fs from 'fs';
import path from 'path';
import ASTToSapui5XML from './converters/ASTToSapui5XML.js';
import MarkdownToASTConverter from './converters/MarkdownToAST.js';
import FileManager from './utils/FileManager.js';
import NavigationFragmentGenerator from './converters/NavFragmentGenerator.js';
import concatenateXML from './utils/xmlConcatenator.js';

/**
 * Converts a Markdown file to SAPUI5 XML.
 * @param markdownFilePath - Path to the Markdown file.
 * @param outputDir - Directory where the XML file will be saved.
 * @throws {Error} If the input parameters are invalid.
 */
export async function convertMarkdownToXml(
  markdownFilePath: string,
  outputDir: string,
  withNavigation: boolean,
  controllerPath: string,
) {
  assert(
    typeof markdownFilePath === 'string' && markdownFilePath.trim() !== '',
    'Invalid markdown file path.',
  );
  assert(
    typeof outputDir === 'string' && outputDir.trim() !== '',
    'Invalid output directory.',
  );

  assert(
    fs.existsSync(markdownFilePath),
    `Markdown file not found: ${markdownFilePath}`,
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const markdownContent = await FileManager.readFile(markdownFilePath);
  const astConverter = new MarkdownToASTConverter();
  const xmlConverter = new ASTToSapui5XML();

  const ast = await astConverter.convert(markdownContent);
  const wrappedTemplates = xmlConverter.convert(ast);

  const xml = concatenateXML(wrappedTemplates, withNavigation);

  const xmlPath = path.join(outputDir, 'Main.view.xml');

  await FileManager.saveAsFile(xmlPath, xml);

  let navPath = '';
  if (withNavigation) {
    const navFragmentXml = NavigationFragmentGenerator.generateFragment();
    navPath = path.join(outputDir, 'NavigationFragment.fragment.xml');
    await FileManager.saveAsFile(navPath, navFragmentXml);
  }

  let controllerPathSaved = '';
  if (controllerPath) {
    const controllerContent = NavigationFragmentGenerator.generateController();
    controllerPathSaved = controllerPath;
    await FileManager.saveAsFile(controllerPath, controllerContent);
  }
  return { xmlPath, navPath, controllerPath: controllerPathSaved };
}
