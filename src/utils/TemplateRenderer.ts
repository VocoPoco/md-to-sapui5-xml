import nunjucks from 'nunjucks';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesPath = path.resolve(__dirname, '../../templates');

console.log('[Nunjucks] Template directory:', templatesPath);

nunjucks.configure(templatesPath, { autoescape: false });

export function renderTemplate<T extends Record<string, unknown>>(
  templateFile: string,
  context: T,
): string {
  const fullPath = path.join(templatesPath, templateFile);
  console.log('[Nunjucks] Attempting to render:', fullPath);

  if (!fs.existsSync(fullPath)) {
    console.error('[Nunjucks] Template file not found:', fullPath);
    throw new Error(`Template file not found: ${fullPath}`);
  }

  try {
    const result = nunjucks.render(templateFile, context);
    console.log('[Nunjucks] Rendered successfully');
    return result;
  } catch (error) {
    console.error('[Nunjucks] Failed to render:', templateFile);
    console.error(error);
    throw error;
  }
}
