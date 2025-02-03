// utils/FileManager.ts

class FileManager {
  /**
   * Reads a file from a given URL.
   *
   * @param fileUrl - The URL from which to fetch the file.
   * @returns A promise that resolves with the file content as a string.
   */
  public static async readFile(fileUrl: string): Promise<string> {
    const response: Response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file at ${fileUrl}: ${response.statusText}`,
      );
    }
    return response.text();
  }

  /**
   * Triggers a download of the provided content as a file.
   *
   * @param fileName - The name of the file to be downloaded.
   * @param content - The file content.
   */
  public static saveAsFile(fileName: string, content: string): void {
    const blob: Blob = new Blob([content], { type: 'text/xml' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}

export default FileManager;
