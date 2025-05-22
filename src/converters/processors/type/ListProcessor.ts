import { List, Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';
import ListItemProcessor from './ListItemProcessor.js';

/**
 * Processor for list nodes.
 */
class ListProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    const listNode = node as List;
    const isOrdered = listNode.ordered === true;
    const start = typeof listNode.start === 'number' ? listNode.start : 1;

    return {
      value: this.processListItems(node as Parent, isOrdered, start),
    };
  }

  protected shouldEscape(): boolean {
    return false;
  }

  /**
   * Processes the list items within the list node.
   *
   * @param node - The parent node containing list items.
   * @returns A string representation of the processed list items.
   */
  private processListItems(
    node: Parent,
    isOrdered: boolean,
    start: number,
  ): string {
    let count = start;
    return node.children
      .map((child) => {
        if (child.type === 'listItem') {
          const processor = ProcessorFactory.getProcessor(
            'listItem',
          ) as ListItemProcessor;
          const contextPrefix = isOrdered ? `${count++}.` : '-';

          processor.setPrefix(contextPrefix);
          return processor.processPlaceholders(child);
        }
        return '';
      })
      .join('\n');
  }
}

export default ListProcessor;
