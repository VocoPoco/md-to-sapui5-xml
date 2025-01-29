import { Root, RootContent } from 'mdast';
import { XML_TEMPLATE } from '../templates/xmlTemplate.js';
import ProcessorUtils from './../utils/ProcessorUtils.js';
import ProcessorFactory from './ASTProcessorFactory.js';
import Converter from './Converter.js';
import FormatProcessor from './processors/FormatProcessor.js';
import DefinitionProcessor from './processors/type/DefinitionProcessor.js';
import ReferenceProcessor from './processors/type/ReferenceProcessor.js';

/**
 * Converts an AST (Abstract Syntax Tree) into SAPUI5 XML format.
 */
class ASTToSapui5XML extends Converter<Root, string> {
  private readonly formatProcessor: FormatProcessor;
  private readonly processorFactory: typeof ProcessorFactory;

  constructor(
    formatProcessor?: FormatProcessor,
    processorFactory?: typeof ProcessorFactory,
  ) {
    super();
    this.formatProcessor = formatProcessor ?? FormatProcessor.Instance;
    this.processorFactory = processorFactory ?? ProcessorFactory;
  }

  /**
   * Converts an AST node into SAPUI5 XML by processing its placeholders.
   * @param node - The AST node to process.
   */
  private processNode(node: RootContent): void {
    const processor = this.processorFactory.getProcessor(node.type);

    if (processor) {
      const result = processor.processPlaceholders(node);
      const line = node.position?.start.line;
      if (line !== undefined) {
        this.formatProcessor.addTemplate(line, result);
      }
    } else if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach((child) => this.processNode(child));
    }
  }

  /**
   * Converts the entire AST to SAPUI5 XML format.
   * @param ast - The root AST node.
   * @returns The formatted SAPUI5 XML.
   */
  public convert(ast: Root): string {
    ast.children.forEach((child) => this.processNode(child));

    this._resolveReferences();

    const wrappedTemplates = this.formatProcessor.wrapTemplates();
    return `${XML_TEMPLATE.top}\n${wrappedTemplates.join('\n')}\n${XML_TEMPLATE.bottom}`;
  }

  /**
   * Resolves references (links, images, definitions) in the AST.
   */
  private _resolveReferences(): void {
    const linkProcessor = this.processorFactory.getProcessor(
      'linkReference',
    ) as ReferenceProcessor;
    const imageProcessor = this.processorFactory.getProcessor(
      'imageReference',
    ) as ReferenceProcessor;
    const definitionProcessor = this.processorFactory.getProcessor(
      'definition',
    ) as DefinitionProcessor;

    ProcessorUtils.resolveReferences(
      linkProcessor.lineMap,
      definitionProcessor.definitions,
      this.formatProcessor.templateMap,
    );

    ProcessorUtils.resolveReferences(
      imageProcessor.lineMap,
      definitionProcessor.definitions,
      this.formatProcessor.templateMap,
    );
  }
}

export default ASTToSapui5XML;
