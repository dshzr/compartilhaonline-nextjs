import imageCompression from 'browser-image-compression';

const base64ToFile = (base64String: string): File => {
  // Remove o cabeçalho do data URL se existir
  const base64 = base64String.split(';base64,').pop() || base64String;
  
  // Converte base64 para array de bytes
  const byteString = atob(base64);
  const byteNumbers = new Array(byteString.length);
  
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
  // Cria um arquivo a partir do blob
  return new File([blob], 'image.jpg', { type: 'image/jpeg' });
};

const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export async function compressBase64Image(base64: string) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    // Converte base64 para File
    const file = base64ToFile(base64);
    // Comprime
    const compressedFile = await imageCompression(file, options);
    // Converte volta para base64
    return await fileToBase64(compressedFile);
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    return base64; // Retorna original em caso de erro
  }
} 