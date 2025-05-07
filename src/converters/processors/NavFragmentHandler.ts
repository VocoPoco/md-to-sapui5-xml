class NavFragmentHandler {
  private static headings: { level: string; text: string; id: string }[] = [];
  private static ids: Set<string> = new Set();

  /**
   * Adds a heading to the storage.
   * @param level - The heading level.
   * @param text - The heading text content.
   */
  public static addHeading(level: string, text: string, id: string): void {
    this.headings.push({ level, text, id });
  }

  /**
   * Adds an ID to the storage.
   * @param id - The ID to be added.
   */
  public static addId(id: string): void {
    this.ids.add(id); // Use Set's add method to handle uniqueness automatically
  }

  /**
   * Returns all stored headings.
   * @returns An array of heading objects.
   */
  public static getHeadings(): { level: string; text: string; id: string }[] {
    return this.headings;
  }

  /**
   * Returns all stored IDs.
   * @returns A Set of IDs.
   */
  public static getIds(): Set<string> {
    return this.ids; // Return the Set of IDs
  }
}

export default NavFragmentHandler;
