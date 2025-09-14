import React from 'react';

interface QRDisplayProps {
  qrCodeDataUrl: string;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ qrCodeDataUrl }) => {
  return (
    <div>
      <h3>Share this QR Code</h3>
      <img src={qrCodeDataUrl} alt="Download QR Code" />
      <p>Scan this to get a 10-minute download link.</p>
    </div>
  );
};

export default QRDisplay;