import type { Table, TableRow, TableCell, Text } from 'mdast';
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
      .mockReturnValue('<Column><header>Header 1</header></Column>');
    jest
      .spyOn(TableRowProcessor.prototype, 'processDataCells')
      .mockReturnValue(
        '<ColumnListItem><cells>Cell 1</cells></ColumnListItem>',
      );

    const headerText: Text = { type: 'text', value: 'Header 1' };
    const dataText: Text = { type: 'text', value: 'Cell 1' };

    const headerCell: TableCell = {
      type: 'tableCell',
      children: [headerText],
    };
    const dataCell: TableCell = {
      type: 'tableCell',
      children: [dataText],
    };

    const headerRow: TableRow = {
      type: 'tableRow',
      children: [headerCell],
    };
    const dataRow: TableRow = {
      type: 'tableRow',
      children: [dataCell],
    };

    const tableNode: Table = {
      type: 'table',
      children: [headerRow, dataRow],
    };

    const output = processor.processPlaceholders(tableNode);

    expect(output).toBe(
      '<Table>' +
        '<columns><Column><header>Header 1</header></Column></columns>' +
        '<items><ColumnListItem><cells>Cell 1</cells></ColumnListItem></items>' +
        '</Table>',
    );
  });

  it('should handle a table node with no rows', () => {
    const emptyTable: Table = {
      type: 'table',
      children: [],
    };

    const output = processor.processPlaceholders(emptyTable);

    expect(output).toBe('<Table><columns></columns><items></items></Table>');
  });
});
