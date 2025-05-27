import LinkReferenceProcessor from '@src/converters/processors/type/LinkReferenceProcessor';
import { LinkReference } from 'mdast';

describe('LinkReferenceProcessor', () => {
  let processor: LinkReferenceProcessor;

  beforeEach(() => {
    processor = new LinkReferenceProcessor(
      '<Link text="{value}" href="{url}" />',
    );
  });

  it('should correctly populate referenceMap and lineMap from a valid link reference node', () => {
    const linkReferenceNode = {
      type: 'linkReference',
      identifier: 'link1',
      children: [{ type: 'text', value: 'Example Link' }],
      position: { start: { line: 5, column: 1 }, end: { line: 5, column: 30 } },
    };

    processor.constructProperties(linkReferenceNode as LinkReference);

    expect(processor.referenceMap.get('link1')).toBe(
      '<Link text="{value}" href="{url}" />',
    );
    expect(processor.lineMap.get('link1')).toBe(5);
  });

  it('should handle a link reference node with missing identifier', () => {
    const invalidNode = {
      type: 'linkReference',
      children: [{ type: 'text', value: 'Invalid Link' }],
    };

    processor.constructProperties(invalidNode as LinkReference);

    expect(processor.referenceMap.size).toBe(0);
    expect(processor.lineMap.size).toBe(0);
  });
});
