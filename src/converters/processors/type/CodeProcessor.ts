import { RootContent } from 'mdast';
import Processor from './Processor.js';
/**
 * Processor for code nodes
 */
class CodeProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      lang: 'lang' in node ? node.lang || '' : '',
      value: 'value' in node ? node.value || '' : '',
    };
  }
}

export default CodeProcessor;
