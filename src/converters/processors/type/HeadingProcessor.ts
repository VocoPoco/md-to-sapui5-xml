import { Literal, Parent, RootContent } from 'mdast';
import Processor from './Processor.js';
import NavFragmentHandler from '../NavFragmentHandler.js';

/**
 * Processor for title nodes
 */
class HeadingProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    const depth = 'depth' in node ? `H${node.depth}` : '';
    const value = this._extractChildValue(node);
    const id = value.toLowerCase().replace(/\s+/g, '-');

    if (depth && value && id) {
      NavFragmentHandler.addHeading(depth, value, id);
    }

    return { depth, value, id };
  }

  private _extractChildValue(node: RootContent): string {
    return 'children' in node &&
      Array.isArray((node as Parent).children) &&
      (node as Parent).children.length > 0 &&
      'value' in (node as Parent).children[0]
      ? ((node as Parent).children[0] as Literal).value || ''
      : '';
  }
}

export default HeadingProcessor;
