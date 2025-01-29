import { Root } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm-configurable';
import remarkParse from 'remark-parse';
import Converter from './Converter.js';

/**
 * Converts Markdown content into an Abstract Syntax Tree (AST) using Remark.
 */
class MarkdownToASTConverter extends Converter<string, Root> {
  private readonly gfmOptions: Record<string, any>;

  constructor(gfmOptions?: Record<string, any>) {
    super();
    this.gfmOptions = gfmOptions ?? {
      plugins: {
        table: true,
        footnote: true,
      },
      singleTilde: false,
      tableCellPadding: true,
    };
  }

  /**
   * Converts a Markdown string into an AST representation.
   * @param content - The Markdown content to be converted.
   * @returns Parsed Markdown AST (mdast Root).
   * @throws Error if parsing fails.
   */
  public convert(content: string): Root {
    try {
      return remark()
        .use(remarkParse)
        .use(remarkGfm, this.gfmOptions)
        .parse(content) as Root;
    } catch (error) {
      throw new Error(`Markdown parsing failed: ${(error as Error).message}`);
    }
  }
}

export default MarkdownToASTConverter;
