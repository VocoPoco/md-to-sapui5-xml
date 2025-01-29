import ProcessorFactory from '@src/converters/ASTProcessorFactory';
import TableProcessor from '@src/converters/processors/type/TableProcessor';
import TableRowProcessor from '@src/converters/processors/type/TableRowProcessor';

describe('TableProcessor', () => {
  let processor: TableProcessor;

  beforeEach(() => {
    jest.spyOn(ProcessorFactory, 'getProcessor').mockImplementation((type) => {
      if (type === 'tableRow') {
        return new TableRowProcessor('');
      }
      throw new Error(`Unsupported processor type: ${type}`);
    });

    processor = new TableProcessor(
      '<Table><columns>{columns}</columns><items>{items}</items></Table>',
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly process a table node with header and data rows', () => {
    jest
      .spyOn(TableRowProcessor.prototype, 'processHeaderCells')
      .mockImplementation(() => {
        return '<Column><header>Header 1</header></Column>';
      });
    jest
      .spyOn(TableRowProcessor.prototype, 'processDataCells')
      .mockImplementation(() => {
        return '<ColumnListItem><cells>Cell 1</cells></ColumnListItem>';
      });

    const tableNode = {
      type: 'table',
      children: [
        { type: 'tableRow', children: [{ type: 'text', value: 'Header 1' }] },
        { type: 'tableRow', children: [{ type: 'text', value: 'Cell 1' }] },
      ],
    };

    const output = processor.processPlaceholders(tableNode as any);

    expect(output).toBe(
      '<Table><columns><Column><header>Header 1</header></Column></columns><items><ColumnListItem><cells>Cell 1</cells></ColumnListItem></items></Table>',
    );
  });

  it('should handle a table node with no rows', () => {
    const tableNode = {
      type: 'table',
      children: [],
    };

    const output = processor.processPlaceholders(tableNode as any);

    expect(output).toBe('<Table><columns></columns><items></items></Table>');
  });
});
