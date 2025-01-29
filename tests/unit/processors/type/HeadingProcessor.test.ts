import HeadingProcessor from '@src/converters/processors/type/HeadingProcessor';

describe('HeadingProcessor', () => {
  let processor: HeadingProcessor;

  beforeEach(() => {
    processor = new HeadingProcessor('<Title level="{depth}" text="{value}"/>');
  });

  it('should correctly process a heading node with depth=2', () => {
    const headingNode = {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'h2 Heading',
        },
      ],
    };
    const output = processor.processPlaceholders(headingNode as any);

    expect(output).toBe('<Title level="H2" text="h2 Heading"/>');
  });

  it('should handle a heading node with children=null', () => {
    const headingNode = {
      type: 'heading',
      depth: 3,
      children: null,
    };
    const output = processor.processPlaceholders(headingNode as any);

    expect(output).toBe('<Title level="H3" text=""/>');
  });

  it('should handle a heading node with empty children array', () => {
    const headingNode = {
      type: 'heading',
      depth: 1,
      children: [],
    };
    const output = processor.processPlaceholders(headingNode as any);

    expect(output).toBe('<Title level="H1" text=""/>');
  });

  it('should handle a heading node with invalid children structure', () => {
    const headingNode = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'paragraph', children: [] }],
    };
    const output = processor.processPlaceholders(headingNode as any);

    expect(output).toBe('<Title level="H2" text=""/>');
  });
});
