import TextProcessor from '@src/converters/processors/type/TextProcessor';

describe('TextProcessor', () => {
  let processor: TextProcessor;

  beforeEach(() => {
    processor = new TextProcessor('<Text text="{value}"/>');
  });

  it('should correctly process a text node', () => {
    const textNode = {
      type: 'text',
      value: 'Emphasis, aka italics, with ',
      position: {
        start: { line: 10, column: 1, offset: 100 },
        end: { line: 10, column: 30, offset: 129 },
      },
    };

    const output = processor.processPlaceholders(textNode as any);

    expect(output).toBe('<Text text="Emphasis, aka italics, with "/>');
  });
});
