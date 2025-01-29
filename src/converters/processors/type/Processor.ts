import { RootContent } from 'mdast';

/**
 * Abstract base class for processing Markdown AST nodes into formatted output.
 * Provides a template-based approach for transforming nodes with customizable placeholders.
 */
abstract class Processor {
  /**
   * Constructor to initialize a processor with a specified template.
   *
   * @param template - The template string with placeholders for dynamic values.
   */
  constructor(protected readonly template: string) {}

  /**
   * Determines if special characters in the `value` property should be escaped.
   * Override this method in derived classes to change escaping behavior.
   *
   * @returns `true` if escaping is enabled, otherwise `false`.
   */
  protected shouldEscape(): boolean {
    return true;
  }

  /**
   * Constructs a map of properties to replace placeholders in the template.
   * Must be implemented by derived classes to define how placeholders are mapped.
   *
   * @param node - The AST node to process.
   * @returns A record of placeholder keys and their corresponding values.
   */
  protected abstract constructProperties(
    node: RootContent,
  ): Record<string, string>;

  /**
   * Escapes special characters in the provided value for safe inclusion in XML.
   *
   * @param value - The string to escape.
   * @returns The escaped string.
   */
  private escapeSpecialCharacters(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Processes the provided AST node, replacing placeholders in the template with mapped properties.
   *
   * @param node - The AST node to process.
   * @returns The processed string with placeholders replaced by dynamic values.
   */
  public processPlaceholders(node: RootContent): string {
    const properties = this.constructProperties(node);

    if ('value' in properties && this.shouldEscape()) {
      properties.value = this.escapeSpecialCharacters(properties.value);
    }

    return Object.entries(properties).reduce(
      (result, [key, value]) => result.replace(`{${key}}`, value),
      this.template,
    );
  }
}

export default Processor;
