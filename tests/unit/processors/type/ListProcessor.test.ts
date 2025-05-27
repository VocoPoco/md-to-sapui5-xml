import type { List, ListItem } from 'mdast';
import ProcessorFactory from '@src/converters/ASTProcessorFactory';
import ListProcessor from '@src/converters/processors/type/ListProcessor';
import type Processor from '@src/converters/processors/type/Processor';

describe('ListProcessor', () => {
  let processor: ListProcessor;

  beforeEach(() => {
    jest
      .spyOn(ProcessorFactory, 'getProcessor')
      .mockImplementation((type: string) => {
        if (type === 'listItem') {
          const stub: Partial<Processor> = {
            processPlaceholders: jest
              .fn()
              .mockReturnValue('<MockedListItem>{value}</MockedListItem>'),
          };
          return stub as Processor;
        }
        throw new Error(`Unsupported processor type: ${type}`);
      });

    processor = new ListProcessor('<List>{value}</List>');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly process a list node with mocked list items', () => {
    const listItem: ListItem = {
      type: 'listItem',
      spread: false,
      checked: null,
      children: [],
    };
    const listNode: List = {
      type: 'list',
      ordered: false,
      start: 1,
      spread: false,
      children: [listItem, listItem],
    };

    const output = processor.processPlaceholders(listNode);

    expect(output).toBe(
      `<List><MockedListItem>{value}</MockedListItem>
<MockedListItem>{value}</MockedListItem></List>`,
    );
  });

  it('should handle a list node with no list items', () => {
    const listNode: List = {
      type: 'list',
      ordered: false,
      start: 1,
      spread: false,
      children: [],
    };

    const output = processor.processPlaceholders(listNode);

    expect(output).toBe('<List></List>');
  });

  it('should handle a list node with invalid children', () => {
    const invalidChild = { type: 'invalid', value: 'Invalid Node' } as unknown;
    const listNode: List = {
      type: 'list',
      ordered: false,
      start: 1,
      spread: false,
      children: [invalidChild as ListItem],
    };

    const output = processor.processPlaceholders(listNode);

    expect(output).toBe('<List></List>');
  });
});
