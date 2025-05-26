import { Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';

/**
 * Handles the processing of rows in Markdown tables,
 * converting each table cell's content into SAPUI5-compatible XML,
 * wrapped inside layout components like <HBox>, <Column>, and <ColumnListItem>.
 */
class TableRowProcessor extends Processor {
  protected constructProperties(_node: RootContent): Record<string, string> {
    void _node;
    return {};
  }

  /**
   * Processes a data row and returns a formatted <ColumnListItem> XML string.
   * Each cell's children are wrapped inside an <HBox> with spacing between elements.
   *
   * @param node - The tableRow node containing tableCell nodes.
   * @returns The formatted SAPUI5 XML string for the row.
   */
  public processDataCells(node: Parent): string {
    return this.processEachTableCell<string>(node, (hboxContent) =>
      this.wrapInListItem(hboxContent.join('')),
    );
  }

  /**
   * Processes a header row and returns formatted <Column> elements with headers.
   * Each cell's children are wrapped inside an <HBox> with spacing between elements.
   *
   * @param node - The tableRow node containing tableCell nodes.
   * @returns The formatted SAPUI5 XML string for the table header row.
   */
  public processHeaderCells(node: Parent): string {
    return this.processEachTableCell<string[]>(
      node,
      this.wrapInColumnHeaderArray,
    ).join('');
  }

  /**
   * Iterates over each tableCell node in the row and processes its children.
   * Each group of children is rendered, spaced, and wrapped in an <HBox>,
   * then passed to a wrapper function (e.g., for <Column> or <ColumnListItem>).
   *
   * @param rowNode - The parent node representing a tableRow.
   * @param applyWrapper - A function that wraps the <HBox> in a final container.
   * @returns The full XML string for all cells in the row.
   */
  private processEachTableCell<T>(
    rowNode: Parent,
    applyWrapper: (hboxWrappedContent: string[]) => T,
  ): T {
    const allCellNodes = rowNode.children
      .filter((child) => child.type === 'tableCell')
      .map((tableCell) => {
        const content = this.processCellChildren(tableCell as Parent);
        const spaced = this.interleaveSpaces(content);
        return this.wrapInHBox(spaced);
      });

    return applyWrapper(allCellNodes);
  }

  /**
   * Processes all child nodes of a single tableCell using their appropriate processors.
   *
   * @param cell - The tableCell node.
   * @returns An array of rendered XML strings for each child.
   */
  private processCellChildren(cell: Parent): string[] {
    return cell.children.map((child) => {
      const processor = ProcessorFactory.getProcessor(child.type);
      return processor?.processPlaceholders(child) ?? '';
    });
  }

  /**
   * Inserts a non-breaking space Text element (<Text text=" "/>) between each element.
   *
   * @param elements - Array of rendered XML strings.
   * @returns A new array with spacing inserted between each element.
   */
  private interleaveSpaces(elements: string[]): string[] {
    const result: string[] = [];

    for (let i = 0; i < elements.length; i++) {
      result.push(elements[i]);
      if (i < elements.length - 1) {
        result.push('<Text text=" "/>');
      }
    }

    return result;
  }

  /**
   * Wraps an array of XML strings inside an <HBox> container.
   *
   * @param content - An array of XML elements.
   * @returns A single string wrapped in <HBox>.
   */
  private wrapInHBox(content: string[]): string {
    return `<HBox>${content.join('')}</HBox>`;
  }

  /**
   * Wraps content inside a <ColumnListItem> with <cells>.
   * Used for rendering data rows in SAPUI5.
   *
   * @param content - The XML content to wrap.
   * @returns The full <ColumnListItem> string.
   */
  private wrapInListItem(content: string): string {
    return `<ColumnListItem><cells>${content}</cells></ColumnListItem>`;
  }

  /**
   * Wraps content inside a <Column><header>...</header></Column> element.
   * Used for rendering header rows in SAPUI5.
   *
   * @param content - The XML content to wrap.
   * @returns The full <Column> string.
   */
  private wrapInColumnHeaderArray(content: string[]): string[] {
    return content.map((hbox) => `<Column><header>${hbox}</header></Column>`);
  }
}

export default TableRowProcessor;
