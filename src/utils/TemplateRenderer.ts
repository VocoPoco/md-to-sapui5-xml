import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesPath = path.resolve(__dirname, '../templates');

nunjucks.configure(templatesPath, { autoescape: false });

export function renderTemplate<T extends Record<string, unknown>>(
  templateFile: string,
  context: T,
): string {
  return nunjucks.render(templateFile, context);
}
