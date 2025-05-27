import DefinitionProcessor from '@src/converters/processors/type/DefinitionProcessor';
import { Definition } from 'mdast';

describe('DefinitionProcessor', () => {
  let processor: DefinitionProcessor;

  beforeEach(() => {
    processor = new DefinitionProcessor('<Definition/>');
  });

  it('should correctly populate definitions map with identifier and URL', () => {
    const definitionNode = {
      type: 'definition',
      identifier: 'example',
      url: 'https://example.com',
    };

    processor.constructProperties(definitionNode as Definition);

    expect(processor.definitions.get('example')).toBe('https://example.com');
  });

  it('should handle a definition node with missing URL', () => {
    const definitionNode = {
      type: 'definition',
      identifier: 'example',
    };

    processor.constructProperties(definitionNode as Definition);

    expect(processor.definitions.get('example')).toBe('');
  });

  it('should handle a definition node with missing identifier', () => {
    const definitionNode = {
      type: 'definition',
      url: 'https://example.com',
    };

    processor.constructProperties(definitionNode as Definition);

    expect(processor.definitions.size).toBe(0);
  });

  it('should not overwrite existing entries in the definitions map', () => {
    const firstNode = {
      type: 'definition',
      identifier: 'example',
      url: 'https://first.com',
    };

    const secondNode = {
      type: 'definition',
      identifier: 'example',
      url: 'https://second.com',
    };

    processor.constructProperties(firstNode as Definition);
    processor.constructProperties(secondNode as Definition);

    expect(processor.definitions.get('example')).toBe('https://first.com');
  });
});
