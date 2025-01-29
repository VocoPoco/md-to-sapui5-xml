import { Literal, Parent, RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Processor for link nodes
 */
class LinkProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      url: 'url' in node ? node.url || '' : '',
      title: 'title' in node ? node.title || '' : '',
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

export default LinkProcessor;
