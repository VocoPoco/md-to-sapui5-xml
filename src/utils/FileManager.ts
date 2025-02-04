import { promises as fsPromises } from 'fs';
import * as path from 'path';

class FileManager {
  private static _instance: FileManager;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public static async saveAsFile(
    filePath: string,
    content: string,
    encoding: BufferEncoding = 'utf8',
  ) {
    const dir = path.dirname(filePath);
    await fsPromises.mkdir(dir, { recursive: true });

    await fsPromises.writeFile(filePath, content, { encoding });
  }

  public static readFile(
    filePath: string,
    encoding: BufferEncoding = 'utf8',
  ): Promise<string> {
    return fsPromises.readFile(filePath, { encoding });
  }
}

export default FileManager;
