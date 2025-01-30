import { RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Abstract base class for processors handling reference nodes.
 */
abstract class ReferenceProcessor extends Processor {
  protected _referenceMap = new Map<string, string>();
  protected _lineMap = new Map<string, number>();

  /**
   * Gets the reference map.
   */
  public get referenceMap(): Map<string, string> {
    return this._referenceMap;
  }

  /**
   * Gets the line map.
   */
  public get lineMap(): Map<string, number> {
    return this._lineMap;
  }

  public constructProperties(node: RootContent): Record<string, string> {
    const identifier = 'identifier' in node ? node.identifier : '';
    const line = node.position?.start.line;

    if (identifier) {
      this._referenceMap.set(identifier, this.template);
      if (line !== undefined) {
        this._lineMap.set(identifier, line);
      }
    }

    return this.extractAdditionalProperties(node);
  }

  /**
   * Abstract method to extract additional properties specific to the reference type.
   *
   * @param node - The AST node to process.
   * @returns Extracted properties for the node.
   */
  protected abstract extractAdditionalProperties(
    node: RootContent,
  ): Record<string, string>;
}

export default ReferenceProcessor;
