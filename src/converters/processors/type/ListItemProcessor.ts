import { Parent, RootContent } from 'mdast';
import ProcessorFactory from './../../ASTProcessorFactory.js';
import Processor from './Processor.js';

/**
 * Processor for list item nodes.
 */
class ListItemProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      value: this.processChildren(node as Parent),
    };
  }

  protected shouldEscape(): boolean {
    return false;
  }

  /**
   * Processes child nodes of the list item.
   *
   * @param node - The parent node.
   * @returns A string representation of the processed children.
   */
  private processChildren(node: Parent): string {
    if (!node.children || node.children.length === 0) {
      return '<HBox></HBox>';
    }

    const firstChild = node.children[0] as Parent;
    if (!firstChild.children || firstChild.children.length === 0) {
      return '<HBox></HBox>';
    }

    return `<HBox>${firstChild.children
      .map((child) => {
        const processor = ProcessorFactory.getProcessor(child.type);
        return processor ? processor.processPlaceholders(child) : '';
      })
      .join('')}</HBox>`;
  }
}

export default ListItemProcessor;
