import ImageProcessor from '@src/converters/processors/type/ImageProcessor';

describe('ImageProcessor', () => {
  let processor: ImageProcessor;

  beforeEach(() => {
    processor = new ImageProcessor(
      '<Image src="{url}" alt="{alt}" tooltip="{title}"/>',
    );
  });

  it('should correctly process an image node with all properties', () => {
    const imageNode = {
      type: 'image',
      url: 'https://example.com/image.png',
      title: 'Example Image',
      alt: 'An example image',
      position: {
        start: { line: 10, column: 1, offset: 100 },
        end: { line: 10, column: 50, offset: 150 },
      },
    };

    const output = processor.processPlaceholders(imageNode as any);

    expect(output).toBe(
      '<Image src="https://example.com/image.png" alt="An example image" tooltip="Example Image"/>',
    );
  });

  it('should correctly process an image node with missing optional properties', () => {
    const imageNode = {
      type: 'image',
      url: 'https://example.com/image.png',
      title: null,
      alt: null,
      position: {
        start: { line: 11, column: 1, offset: 160 },
        end: { line: 11, column: 50, offset: 210 },
      },
    };

    const output = processor.processPlaceholders(imageNode as any);

    expect(output).toBe(
      '<Image src="https://example.com/image.png" alt="" tooltip=""/>',
    );
  });
});
