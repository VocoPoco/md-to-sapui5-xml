import ImageReferenceProcessor from '@src/converters/processors/type/ImageReferenceProcessor';

describe('ImageReferenceProcessor', () => {
  let processor: ImageReferenceProcessor;

  beforeEach(() => {
    processor = new ImageReferenceProcessor(
      '<Image src="{url}" alt="{value}" />',
    );
  });

  it('should correctly populate referenceMap and lineMap from a valid image reference node', () => {
    const imageReferenceNode = {
      type: 'imageReference',
      identifier: 'image1',
      alt: 'Example Image',
      position: { start: { line: 3, column: 1 }, end: { line: 3, column: 20 } },
    };

    processor.constructProperties(imageReferenceNode as any);

    expect(processor.referenceMap.get('image1')).toBe(
      '<Image src="{url}" alt="{value}" />',
    );
    expect(processor.lineMap.get('image1')).toBe(3);
  });

  it('should handle an image reference node with missing identifier', () => {
    const invalidNode = {
      type: 'imageReference',
      alt: 'Invalid Image',
    };

    processor.constructProperties(invalidNode as any);

    expect(processor.referenceMap.size).toBe(0);
    expect(processor.lineMap.size).toBe(0);
  });
});
