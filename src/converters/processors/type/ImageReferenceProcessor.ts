import { RootContent } from 'mdast';
import ReferenceProcessor from './ReferenceProcessor.js';

/**
 * Processor for image reference nodes
 */
class ImageReferenceProcessor extends ReferenceProcessor {
  protected extractAdditionalProperties(
    node: RootContent,
  ): Record<string, string> {
    const alt = 'alt' in node ? (node as any).alt : '';

    return { value: alt };
  }
}

export default ImageReferenceProcessor;
