import ProcessorFactory from '@src/converters/ASTProcessorFactory';
import ListProcessor from '@src/converters/processors/type/ListProcessor';

describe('ListProcessor', () => {
  let processor: ListProcessor;

  beforeEach(() => {
    jest.spyOn(ProcessorFactory, 'getProcessor').mockImplementation((type) => {
      if (type === 'listItem') {
        return {
          processPlaceholders: jest
            .fn()
            .mockReturnValue('<MockedListItem>{value}</MockedListItem>'),
        } as any;
      }
      throw new Error(`Unsupported processor type: ${type}`);
    });

    processor = new ListProcessor('<List>{value}</List>');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly process a list node with mocked list items', () => {
    const listNode = {
      type: 'list',
      children: [{ type: 'listItem' }, { type: 'listItem' }],
    };

    const output = processor.processPlaceholders(listNode as any);

    expect(output).toBe(
      `<List><MockedListItem>{value}</MockedListItem>
<MockedListItem>{value}</MockedListItem></List>`,
    );
  });

  it('should handle a list node with no list items', () => {
    const listNode = {
      type: 'list',
      children: [],
    };

    const output = processor.processPlaceholders(listNode as any);

    expect(output).toBe('<List></List>');
  });

  it('should handle a list node with invalid children', () => {
    const listNode = {
      type: 'list',
      children: [{ type: 'invalid', value: 'Invalid Node' }],
    };

    const output = processor.processPlaceholders(listNode as any);

    expect(output).toBe('<List></List>');
  });
});
