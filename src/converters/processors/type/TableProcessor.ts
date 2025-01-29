import { Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';
import TableRowProcessor from './TableRowProcessor.js';

/**
 * Handles the processing of Markdown tables.
 */
class TableProcessor extends Processor {
  private columns: string[] = [];
  private items: string[] = [];

  public constructProperties(node: RootContent): Record<string, string> {
    this.columns = [];
    this.items = [];

    this.processChildren(node as Parent);
    return {
      columns: this.columns.join(''),
      items: this.items.join(''),
    };
  }

  /**
   * Processes children of the table node, distinguishing between headers and data rows.
   *
   * @param node - The table node to process.
   */
  private processChildren(node: Parent): void {
    node.children.forEach((child, index) => {
      if (child.type === 'tableRow') {
        const rowProcessor = ProcessorFactory.getProcessor(
          'tableRow',
        ) as TableRowProcessor;
        if (index === 0) {
          this.columns.push(rowProcessor.processHeaderCells(child));
        } else {
          this.items.push(rowProcessor.processDataCells(child));
        }
      }
    });
  }
}

export default TableProcessor;
