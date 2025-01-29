import SpecialTextProcessor from '@src/converters/processors/type/SpecialTextProcessor';

describe('SpecialTextProcessor', () => {
  let processor: SpecialTextProcessor;

  beforeEach(() => {
    processor = new SpecialTextProcessor('<FormattedText htmlText="{value}"/>');
  });

  it('should correctly process an emphasis node', () => {
    const emphasisNode = {
      type: 'emphasis',
      children: [
        {
          type: 'text',
          value: 'italic text',
          position: {
            start: { line: 12, column: 4, offset: 140 },
            end: { line: 12, column: 16, offset: 152 },
          },
        },
      ],
      position: {
        start: { line: 12, column: 1, offset: 137 },
        end: { line: 12, column: 16, offset: 152 },
      },
    };

    const output = processor.processPlaceholders(emphasisNode as any);

    expect(output).toBe('<FormattedText htmlText="italic text"/>');
  });

  it('should correctly process a strong node', () => {
    const strongNode = {
      type: 'strong',
      children: [
        {
          type: 'text',
          value: 'bold text',
          position: {
            start: { line: 13, column: 4, offset: 160 },
            end: { line: 13, column: 14, offset: 170 },
          },
        },
      ],
      position: {
        start: { line: 13, column: 1, offset: 157 },
        end: { line: 13, column: 14, offset: 170 },
      },
    };

    const output = processor.processPlaceholders(strongNode as any);

    expect(output).toBe('<FormattedText htmlText="bold text"/>');
  });

  it('should correctly process a delete node', () => {
    const deleteNode = {
      type: 'delete',
      children: [
        {
          type: 'text',
          value: 'strikethrough text',
          position: {
            start: { line: 14, column: 4, offset: 180 },
            end: { line: 14, column: 24, offset: 200 },
          },
        },
      ],
      position: {
        start: { line: 14, column: 1, offset: 177 },
        end: { line: 14, column: 24, offset: 200 },
      },
    };

    const output = processor.processPlaceholders(deleteNode as any);

    expect(output).toBe('<FormattedText htmlText="strikethrough text"/>');
  });
});
