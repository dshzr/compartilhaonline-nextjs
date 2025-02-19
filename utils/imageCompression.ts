import imageCompression from 'browser-image-compression';

export async function compressBase64Image(base64: string) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  try {
    // Converte base64 para File
    const file = base64ToFile(base64);
    // Comprime
    const compressedFile = await imageCompression(file, options);
    // Converte volta para base64
    return await fileToBase64(compressedFile);
  } catch (error) {
    console.error('Erro na compressão:', error);
    return base64;
  }
} 