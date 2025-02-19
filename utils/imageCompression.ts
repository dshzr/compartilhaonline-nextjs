import imageCompression from 'browser-image-compression';

export async function compressBase64Image(base64: string) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
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
    console.error('Error compressing image:', error);
    return base64; // Return original if compression fails
  }
}