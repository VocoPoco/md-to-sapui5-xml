import { RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Processor for definition nodes.
 */
class DefinitionProcessor extends Processor {
  private _definitions: Map<string, string>;

  /**
   * Gets the definitions map.
   */
  public get definitions(): Map<string, string> {
    return this._definitions;
  }

  constructor(template: string) {
    super(template);
    this._definitions = new Map();
  }

  public constructProperties(node: RootContent): Record<string, string> {
    const identifier = 'identifier' in node ? node.identifier : '';
    const url = 'url' in node ? node.url : '';

    if (identifier && !this._definitions.has(identifier)) {
      this._definitions.set(identifier, url);
    }

    return { value: '' };
  }
}

export default DefinitionProcessor;
