export interface StorageAdapter {
  uploadBuffer: (key: string, buffer: Buffer, mime: string) => Promise<void>;
  getPresignedUrl: (key: string, mime: string, expires: number) => Promise<string>;
}
