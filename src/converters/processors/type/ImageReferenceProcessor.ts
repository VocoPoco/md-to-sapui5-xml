import { RootContent } from 'mdast';
import ReferenceProcessor from './ReferenceProcessor.js';

/**
 * Processor for image reference nodes
 */
class ImageReferenceProcessor extends ReferenceProcessor {
  protected extractAdditionalProperties(
    node: RootContent,
  ): Record<string, string> {
    const alt = 'alt' in node && typeof node.alt === 'string' ? node.alt : '';

    return { value: alt };
  }
}

export default ImageReferenceProcessor;
