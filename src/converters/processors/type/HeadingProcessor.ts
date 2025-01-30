import { Literal, Parent, RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Processor for link nodes
 */
class HeadingProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      depth: 'depth' in node ? `H${node.depth}` : '',
      value: _extractChildValue(),
    };

    function _extractChildValue(): string {
      return 'children' in node &&
        Array.isArray((node as Parent).children) &&
        (node as Parent).children.length > 0 &&
        'value' in (node as Parent).children[0]
        ? ((node as Parent).children[0] as Literal).value || ''
        : '';
    }
  }
}

export default HeadingProcessor;
