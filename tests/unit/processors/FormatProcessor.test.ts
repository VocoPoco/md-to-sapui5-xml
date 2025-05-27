import FormatProcessor from '@src/converters/processors/FormatProcessor';

describe('FormatProcessor', () => {
  let processor: FormatProcessor;

  beforeEach(() => {
    processor = FormatProcessor.Instance;
    processor.templateMap = new Map();
  });

  it('should add a template to the correct line', () => {
    processor.addTemplate(1, '<Text text="Line 1"/>');
    processor.addTemplate(1, '<Text text="Line 1 - Extra"/>');
    processor.addTemplate(2, '<Text text="Line 2"/>');

    expect(processor.getTemplates(1)).toEqual([
      '<Text text="Line 1"/>',
      '<Text text="Line 1 - Extra"/>',
    ]);
    expect(processor.getTemplates(2)).toEqual(['<Text text="Line 2"/>']);
    expect(processor.getTemplates(3)).toEqual([]);
  });

  it('should not overwrite existing templates on the same line when adding', () => {
    processor.addTemplate(1, '<Text text="Line 1"/>');
    processor.addTemplate(1, '<Text text="Line 1 - Extra"/>');

    expect(processor.getTemplates(1)).toEqual([
      '<Text text="Line 1"/>',
      '<Text text="Line 1 - Extra"/>',
    ]);
  });

  it('should retrieve the entire template map', () => {
    processor.addTemplate(1, '<Text text="Line 1"/>');
    processor.addTemplate(2, '<Text text="Line 2"/>');

    const templateMap = processor.getMap();
    expect(templateMap).toBeInstanceOf(Map);
    expect(templateMap.size).toBe(2);
    expect(templateMap.get(1)).toEqual(['<Text text="Line 1"/>']);
    expect(templateMap.get(2)).toEqual(['<Text text="Line 2"/>']);
  });

  it('should wrap templates into HBox elements correctly', () => {
    processor.addTemplate(1, '<Text text="Line 1"/>');
    processor.addTemplate(2, '<Text text="Line 2"/>');
    processor.addTemplate(2, '<Text text="Line 2 - Extra"/>');
    processor.addTemplate(4, '<Text text="Line 4"/>');

    const wrappedTemplates = processor.wrapTemplates();

    expect(wrappedTemplates).toEqual([
      '<HBox><Text text="Line 1"/></HBox>',
      '<HBox><Text text="Line 2"/><Text text="Line 2 - Extra"/></HBox>',
      '<Text text="‎"/>',
      '<HBox><Text text="Line 4"/></HBox>',
    ]);
  });

  it('should handle a map with no templates when wrapping', () => {
    const wrappedTemplates = processor.wrapTemplates();
    expect(wrappedTemplates).toEqual([]);
  });
});
