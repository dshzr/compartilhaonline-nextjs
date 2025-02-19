declare module 'browser-image-compression' {
  interface Options {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    maxIteration?: number;
  }

  export default function imageCompression(
    file: File | Blob,
    options?: Options
  ): Promise<File | Blob>;
} 