import { Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';

/**
 * Processor for list nodes.
 */
class ListProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      value: this.processListItems(node as Parent),
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
  private processListItems(node: Parent): string {
    return node.children
      .map((child) => {
        if (child.type === 'listItem') {
          const processor = ProcessorFactory.getProcessor('listItem');
          return processor.processPlaceholders(child);
        }
        return '';
      })
      .join('\n');
  }
}

export default ListProcessor;
