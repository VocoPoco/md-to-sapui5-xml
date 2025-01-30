import { RootContent } from 'mdast';
import ReferenceProcessor from './ReferenceProcessor.js';

/**
 * Processor for link reference nodes.
 */
class LinkReferenceProcessor extends ReferenceProcessor {
  protected extractAdditionalProperties(
    node: RootContent,
  ): Record<string, string> {
    const value =
      'children' in node &&
      node.children.length > 0 &&
      'value' in node.children[0] &&
      typeof node.children[0].value === 'string'
        ? node.children[0].value
        : '';

    return { value };
  }
}

export default LinkReferenceProcessor;
