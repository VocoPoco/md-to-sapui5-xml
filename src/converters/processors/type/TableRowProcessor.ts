import { Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';

/**
 * Handles the processing of rows in Markdown tables.
 */
class TableRowProcessor extends Processor {
  protected constructProperties(node: RootContent): Record<string, string> {
    return {};
  }

  /**
   * Processes children of a node using the provided processing function.
   *
   * @param node - The parent node whose children are processed.
   * @param processFn - A function to apply to each child node.
   * @returns The concatenated processed results of the child nodes.
   */
  private processNodeChildren(
    node: Parent,
    processFn: (processor: Processor, childNode: RootContent) => string,
  ): string {
    return node.children
      .map((child) => {
        const childNode = (child as Parent).children[0];
        const processor = ProcessorFactory.getProcessor(childNode.type);
        return processor ? processFn(processor, childNode) : '';
      })
      .join('');
  }

  /**
   * Processes header cells in a table row.
   *
   * @param node - The table row node.
   * @returns The processed header cells as a string.
   */
  public processHeaderCells(node: Parent): string {
    return this.processNodeChildren(node, (processor, childNode) => {
      return this.createColumn(processor, childNode);
    });
  }

  /**
   * Processes data cells in a table row.
   *
   * @param node - The table row node.
   * @returns The processed data cells wrapped in a list item.
   */
  public processDataCells(node: Parent): string {
    const cells = this.processNodeChildren(node, (processor, childNode) => {
      return processor.processPlaceholders(childNode);
    });

    return this.createListItem(cells);
  }

  /**
   * Creates a column for a header cell.
   *
   * @param processor - The processor for the child node.
   * @param child - The child node to process.
   * @returns A string representing the header column.
   */
  private createColumn(processor: Processor, child: RootContent): string {
    return `<Column><header>${processor.processPlaceholders(child)}</header></Column>`;
  }

  /**
   * Wraps processed cells in a list item.
   *
   * @param cells - The processed cell content.
   * @returns A string representing the list item.
   */
  private createListItem(cells: string): string {
    return `<ColumnListItem><cells>${cells}</cells></ColumnListItem>`;
  }
}

export default TableRowProcessor;
