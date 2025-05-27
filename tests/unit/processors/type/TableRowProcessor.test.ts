import ProcessorFactory from '@src/converters/ASTProcessorFactory';
import TableRowProcessor from '@src/converters/processors/type/TableRowProcessor';
import TextProcessor from '@src/converters/processors/type/TextProcessor';
import { TableRow } from 'mdast';

describe('TableRowProcessor', () => {
  let processor: TableRowProcessor;

  beforeEach(() => {
    jest.spyOn(ProcessorFactory, 'getProcessor').mockImplementation((type) => {
      if (type === 'text') {
        return new TextProcessor('<Text text="{value}"/>');
      }
      throw new Error(`Unsupported processor type: ${type}`);
    });

    processor = new TableRowProcessor('');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should correctly process header cells in a table row', () => {
    const tableRowNode = {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{ type: 'text', value: 'Header 1' }],
        },
      ],
    };

    const output = processor.processHeaderCells(tableRowNode as TableRow);

    expect(output).toBe(
      '<Column><header><Text text="Header 1"/></header></Column>',
    );
  });

  it('should correctly process data cells in a table row', () => {
    const tableRowNode = {
      type: 'tableRow',
      children: [
        {
          type: 'tableCell',
          children: [{ type: 'text', value: 'Cell 1' }],
        },
      ],
    };

    const output = processor.processDataCells(tableRowNode as TableRow);

    expect(output).toBe(
      '<ColumnListItem><cells><Text text="Cell 1"/></cells></ColumnListItem>',
    );
  });
});
