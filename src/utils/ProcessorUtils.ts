function resolveReferences(
  lineMap: Map<string, number>,
  definitions: Map<string, string>,
  templateMap: Map<number, string[]>,
): void {
  definitions.forEach((url, identifier) => {
    const line = lineMap.get(identifier);

    if (line !== undefined) {
      _replaceUrlInTemplates(url, templateMap, line);
    }
  });
}

function _replaceUrlInTemplates(
  url: string,
  templateMap: Map<number, string[]>,
  line: number,
): void {
  const lineTemplates = templateMap.get(line);

  if (lineTemplates) {
    const updatedTemplates = _updateTemplatesWithUrl(lineTemplates, url);

    templateMap.set(line, updatedTemplates);
  }
}

function _updateTemplatesWithUrl(
  lineTemplates: string[],
  url: string,
): string[] {
  return lineTemplates.map((template) => {
    if (template.includes('{url}')) {
      return template.replace('{url}', url);
    }
    return template;
  });
}

/**
 * Escapes special characters in the provided value for safe inclusion in XML.
 *
 * @param value - The string to escape.
 * @returns The escaped string.
 */
function escapeXmlSpecialCharacters(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default { resolveReferences, escapeXmlSpecialCharacters };
