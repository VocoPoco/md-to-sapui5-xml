import nunjucks from 'nunjucks';
import path from 'path';

nunjucks.configure(path.resolve('templates'), { autoescape: false });

export function renderTemplate(
  templateFile: string,
  context: Record<string, unknown>,
): string {
  return nunjucks.render(templateFile, context);
}
