import LinkProcessor from '@src/converters/processors/type/LinkProcessor';

describe('LinkProcessor', () => {
  let processor: LinkProcessor;

  beforeEach(() => {
    processor = new LinkProcessor(
      '<Link text="{value}" href="{url}" tooltip="{title}"/>',
    );
  });

  it('should correctly process a link node with all properties', () => {
    const linkNode = {
      type: 'link',
      url: 'https://example.com',
      title: 'Example Link',
      children: [
        {
          type: 'text',
          value: 'Click here',
        },
      ],
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe(
      '<Link text="Click here" href="https://example.com" tooltip="Example Link"/>',
    );
  });

  it('should correctly process a link node with missing optional properties', () => {
    const linkNode = {
      type: 'link',
      url: 'https://example.com',
      title: null,
      children: [
        {
          type: 'text',
          value: 'Go to site',
        },
      ],
      position: {
        start: { line: 11, column: 1, offset: 135 },
        end: { line: 11, column: 20, offset: 155 },
      },
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe(
      '<Link text="Go to site" href="https://example.com" tooltip=""/>',
    );
  });

  it('should handle a link node with `url` and `title` being null', () => {
    const linkNode = {
      type: 'link',
      url: null,
      title: null,
      children: [
        {
          type: 'text',
          value: 'Broken link',
        },
      ],
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe('<Link text="Broken link" href="" tooltip=""/>');
  });

  it('should handle a link node with `children` being null', () => {
    const linkNode = {
      type: 'link',
      url: 'https://example.com',
      title: 'Example Title',
      children: null,
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe(
      '<Link text="" href="https://example.com" tooltip="Example Title"/>',
    );
  });

  it('should handle a link node with an empty `children` array', () => {
    const linkNode = {
      type: 'link',
      url: 'https://example.com',
      title: 'Example Title',
      children: [],
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe(
      '<Link text="" href="https://example.com" tooltip="Example Title"/>',
    );
  });

  it('should handle a link node with invalid children structure', () => {
    const linkNode = {
      type: 'link',
      url: 'https://example.com',
      title: 'Example Title',
      children: [{ type: 'paragraph', children: [] }],
    };

    const output = processor.processPlaceholders(linkNode as any);

    expect(output).toBe(
      '<Link text="" href="https://example.com" tooltip="Example Title"/>',
    );
  });
});
