import React from 'react';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { HiOutlineDownload } from 'react-icons/hi';

interface QRCodeProps {
  qrCodeData: string;
  apresentacaoId: number;
}

export default function QRCodeComponent({ qrCodeData, apresentacaoId }: QRCodeProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        QR Code para Visualização
      </h3>
      <div className="mb-4">
        <Image 
          src={qrCodeData}
          alt="QR Code"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>
      <p className="text-center text-sm text-gray-600">
        Escaneie para acessar a apresentação
      </p>
      <Button
        color="blue"
        className="mt-4"
        onClick={() => {
          const link = document.createElement("a");
          link.href = qrCodeData;
          link.download = `qrcode-apresentacao-${apresentacaoId}.png`;
          link.click();
        }}
      >
        <HiOutlineDownload className="mr-2 h-5 w-5" />
        Baixar QR Code
      </Button>
    </div>
  );
} 