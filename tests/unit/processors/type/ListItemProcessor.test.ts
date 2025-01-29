import ProcessorFactory from '@src/converters/ASTProcessorFactory';
import ListItemProcessor from '@src/converters/processors/type/ListItemProcessor';
import TextProcessor from '@src/converters/processors/type/TextProcessor';

describe('ListItemProcessor', () => {
  let processor: ListItemProcessor;

  beforeEach(() => {
    jest.spyOn(ProcessorFactory, 'getProcessor').mockImplementation((type) => {
      if (type === 'text') {
        return new TextProcessor('<Text text="{value}"/>');
      }
      throw new Error(`Unsupported processor type: ${type}`);
    });

    processor = new ListItemProcessor(
      '<CustomListItem>{value}</CustomListItem>',
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly process a list item with text content', () => {
    const listItemNode = {
      type: 'listItem',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', value: 'List item content' }],
        },
      ],
    };

    const output = processor.processPlaceholders(listItemNode as any);

    expect(output).toBe(
      '<CustomListItem><HBox><Text text="List item content"/></HBox></CustomListItem>',
    );
  });

  it('should handle a list item with no children', () => {
    const listItemNode = {
      type: 'listItem',
      children: [],
    };

    const output = processor.processPlaceholders(listItemNode as any);

    expect(output).toBe('<CustomListItem><HBox></HBox></CustomListItem>');
  });

  it('should handle a list item with invalid children', () => {
    const listItemNode = {
      type: 'listItem',
      children: [{ type: 'invalid', value: 'Invalid content' }],
    };

    const output = processor.processPlaceholders(listItemNode as any);

    expect(output).toBe('<CustomListItem><HBox></HBox></CustomListItem>');
  });
});
