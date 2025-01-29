import { Literal, Parent, RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Processor for special text nodes - emphasis, strong, delete
 */
class SpecialTextProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      value: this._extractChildValue(node),
    };
  }

  /**
   * Extracts the value from the child node.
   *
   * @param node - The parent node.
   * @returns The value of the child node or an empty string.
   */
  private _extractChildValue(node: RootContent): string {
    if (
      'children' in node &&
      Array.isArray((node as Parent).children) &&
      (node as Parent).children.length > 0
    ) {
      const firstChild = (node as Parent).children[0];
      if ('value' in firstChild) {
        return (firstChild as Literal).value || '';
      }
    }
    return '';
  }
}

export default SpecialTextProcessor;
