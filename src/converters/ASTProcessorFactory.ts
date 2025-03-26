// import CodeProcessor from './processors/type/CodeProcessor.js';
import DefinitionProcessor from './processors/type/DefinitionProcessor.js';
import HeadingProcessor from './processors/type/HeadingProcessor.js';
import ImageProcessor from './processors/type/ImageProcessor.js';
import ImageReferenceProcessor from './processors/type/ImageReferenceProcessor.js';
import LinkProcessor from './processors/type/LinkProcessor.js';
import LinkReferenceProcessor from './processors/type/LinkReferenceProcessor.js';
import ListItemProcessor from './processors/type/ListItemProcessor.js';
import ListProcessor from './processors/type/ListProcessor.js';
import Processor from './processors/type/Processor.js';
import SpecialTextProcessor from './processors/type/SpecialTextProcessor.js';
import StaticProcessor from './processors/type/StaticProcessor.js';
import TableProcessor from './processors/type/TableProcessor.js';
import TableRowProcessor from './processors/type/TableRowProcessor.js';
import TextProcessor from './processors/type/TextProcessor.js';

/**
 * Factory class to manage processors for different AST node types.
 * Provides a centralized way to retrieve processors for converting AST nodes into SAPUI5-specific XML templates.
 */
class ProcessorFactory {
  private static processors: Record<string, Processor> = {
    heading: new HeadingProcessor('<Title level="{depth}" text="{value}"/>'),
    text: new TextProcessor('<Text text="{value}" />'),
    emphasis: new SpecialTextProcessor(
      '<FormattedText htmlText="&lt;em>My Column&lt;/em>" />',
    ),
    strong: new SpecialTextProcessor(
      '  <FormattedText htmlText="&lt;strong>My Column&lt;/strong>" />',
    ),
    delete: new SpecialTextProcessor(
      '  <FormattedText htmlText="&lt;s>My Column&lt;/s>" />',
    ),
    // code: new CodeProcessor(
    // '<code:CodeEditor editable="false" lineNumbers="false" type="{lang}" value="{value}" />',
    // ),
    thematicBreak: new StaticProcessor("<ToolBar width='100%' height='1px'/>"),
    link: new LinkProcessor(
      '<Link text="{value}" href="{url}" tooltip="{title}"/>',
    ),
    image: new ImageProcessor(
      '<Image src="{url}" alt="{alt}" tooltip="{title}"/>',
    ),
    list: new ListProcessor('<List>{value}</List>'),
    listItem: new ListItemProcessor('<CustomListItem>{value}</CustomListItem>'),
    table: new TableProcessor(
      '<Table><columns>{columns}</columns><items>{items}</items></Table>',
    ),
    tableRow: new TableRowProcessor(''),
    imageReference: new ImageReferenceProcessor(
      '<Link text="{value}" href="{url}" />',
    ),
    linkReference: new LinkReferenceProcessor(
      '<Link text="{value}" href="{url}" />',
    ),
    definition: new DefinitionProcessor(''),
  };

  /**
   * Retrieves the processor for the given node type.
   *
   * @param type - The type of the AST node.
   * @returns The corresponding processor instance.
   * @throws {Error} If no processor is registered for the given type.
   */
  public static getProcessor(type: string): Processor {
    return this.processors[type];
  }
}

export default ProcessorFactory;
