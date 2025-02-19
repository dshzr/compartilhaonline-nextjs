declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    margin?: number;
    width?: number;
    scale?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  interface QRCodeRenderersOptions extends QRCodeToDataURLOptions {
    type?: string;
    quality?: number;
  }

  function toDataURL(
    text: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  function toString(
    text: string,
    options?: QRCodeRenderersOptions
  ): Promise<string>;

  export { toDataURL, toString };
  export default { toDataURL, toString };
} 