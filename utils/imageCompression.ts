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
    // Convert base64 to blob
    const fetchResponse = await fetch(base64);
    const blob = await fetchResponse.blob();

    // Convert blob to File
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

    // Compress the image
    const compressedBlob = await imageCompression(file, options);

    // Convert compressed blob back to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob);
    });
  } catch (error) {
    console.error('Erro na compressão:', error);
    return base64;
  }
}