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
    const sanitizedId = this.sanitizeId(id);

    if (depth && value && id) {
      NavFragmentHandler.addHeading(depth, value, sanitizedId);
      NavFragmentHandler.addId(sanitizedId);
    }

    return { depth, value, sanitizedId };
  }

  private _extractChildValue(node: RootContent): string {
    return 'children' in node &&
      Array.isArray((node as Parent).children) &&
      (node as Parent).children.length > 0 &&
      'value' in (node as Parent).children[0]
      ? ((node as Parent).children[0] as Literal).value || ''
      : '';
  }

  /**
   * Sanitizes the ID to ensure it is valid for HTML use and unique within the set of existing IDs.
   * @param id - The raw ID to be sanitized.
   * @param existingIds - The set of existing IDs.
   * @returns A sanitized and unique ID.
   */
  private sanitizeId(
    id: string,
    existingIds: Set<string> = NavFragmentHandler.getIds(),
  ): string {
    const sanitizedId = id.replace(/[^a-zA-Z0-9-_]/g, '_');

    let uniqueId = sanitizedId;
    let counter = 1;
    while (existingIds.has(uniqueId)) {
      uniqueId = `${sanitizedId}_${counter++}`;
    }

    existingIds.add(uniqueId);

    if (/^\d/.test(uniqueId)) {
      uniqueId = `id_${uniqueId}`;
    }

    return uniqueId;
  }
}

export default HeadingProcessor;
