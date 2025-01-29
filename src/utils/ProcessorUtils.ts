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

export default { resolveReferences };
