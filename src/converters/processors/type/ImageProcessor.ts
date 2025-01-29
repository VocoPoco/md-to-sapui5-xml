import { RootContent } from 'mdast';
import Processor from './Processor.js';

/**
 * Processor for image nodes
 */
class ImageProcessor extends Processor {
  public constructProperties(node: RootContent): Record<string, string> {
    return {
      url: 'url' in node ? node.url || '' : '',
      title: 'title' in node ? node.title || '' : '',
      alt: 'alt' in node ? node.alt || '' : '',
    };
  }
}

export default ImageProcessor;
