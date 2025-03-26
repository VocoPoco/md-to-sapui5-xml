class NavFragmentHandler {
  private static headings: { level: string; text: string; id: string }[] = [];

  /**
   * Adds a heading to the storage.
   * @param level - The heading level.
   * @param text - The heading text content.
   */
  public static addHeading(level: string, text: string): void {
    const id = text.toLowerCase().replace(/\s+/g, '-');
    this.headings.push({ level, text, id });
  }

  /**
   * Returns all stored headings.
   * @returns An array of heading objects.
   */
  public static getHeadings(): { level: string; text: string; id: string }[] {
    return this.headings;
  }
}

export default NavFragmentHandler;
