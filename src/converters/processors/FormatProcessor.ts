/**
 * Singleton class for managing and formatting templates mapped by line numbers.
 * Provides utility methods to add, retrieve, and wrap templates in SAPUI5-specific XML structures.
 */
class FormatProcessor {
  private static _instance: FormatProcessor;

  /**
   * Internal map to store templates mapped by line numbers.
   */
  private _templateMap: Map<number, string[]> = new Map();

  /**
   * Getter for accessing the template map.
   */
  public get templateMap(): Map<number, string[]> {
    return this._templateMap;
  }

  /**
   * Setter for updating the template map.
   */
  public set templateMap(value: Map<number, string[]>) {
    this._templateMap = value;
  }

  private constructor() {}

  /**
   * Retrieves the singleton instance of the `FormatProcessor` class.
   */
  public static get Instance(): FormatProcessor {
    if (!this._instance) {
      this._instance = new FormatProcessor();
    }
    return this._instance;
  }

  /**
   * Adds a template to a specific line number.
   *
   * @param line - The line number where the template should be added.
   * @param template - The template to add.
   */
  public addTemplate(line: number, template: string): void {
    if (!this._templateMap.has(line)) {
      this._templateMap.set(line, []);
    }
    this._templateMap.get(line)!.push(template);
  }

  /**
   * Retrieves all templates associated with a specific line number.
   *
   * @param line - The line number to retrieve templates for.
   * @returns An array of templates for the specified line.
   */
  public getTemplates(line: number): string[] {
    return this._templateMap.get(line) || [];
  }

  /**
   * Retrieves the entire template map.
   *
   * @returns The template map containing all line-template mappings.
   */
  public getMap(): Map<number, string[]> {
    return this._templateMap;
  }

  /**
   * Wraps all templates into SAPUI5-compatible XML structures.
   * Missing lines are filled with a default empty text node.
   *
   * @returns An array of wrapped templates in line order.
   */
  public wrapTemplates(): string[] {
    if (this._templateMap.size === 0) {
      return [];
    }

    const wrappedResults: string[] = [];
    const keys = Array.from(this._templateMap.keys());
    const maxKey = Math.max(...keys);

    for (let i = 1; i <= maxKey; i++) {
      if (this._templateMap.has(i)) {
        const spacedTemplates = this.splitTemplatesWithSpaces(
          this._templateMap.get(i) ?? [],
        );
        wrappedResults.push(`<HBox>${spacedTemplates.join('')}</HBox>`);
      } else {
        wrappedResults.push('<Text text="‎"/>');
      }
    }

    return wrappedResults;
  }

  private splitTemplatesWithSpaces(templates: string[]): string[] {
    const space = '<Text text=" "/>';
    const result: string[] = [];

    templates.forEach((template, index) => {
      result.push(template);
      if (index < templates.length - 1) {
        result.push(space);
      }
    });

    return result;
  }
}

export default FormatProcessor;
