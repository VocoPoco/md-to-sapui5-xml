import { RootContent } from 'mdast';
import Processor from './Processor.js';

class StaticProcessor extends Processor {
  protected constructProperties(_node: RootContent): Record<string, string> {
    void _node;
    return {};
  }
}

export default StaticProcessor;
