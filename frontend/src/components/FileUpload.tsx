import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api/axios.config';
import QRDisplay from './QRDisplay';

const FileUpload = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setQrCode(null);

    try {
      const uploadResponse = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileId = uploadResponse.data._id;
      
      const shareResponse = await api.get(`/files/share/${fileId}`);
      setQrCode(shareResponse.data.qrCode);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload Failed!');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag 'n' drop a file here, or click to select</p>}
      </div>
      {uploading && <p>Uploading...</p>}
      {qrCode && <QRDisplay qrCodeDataUrl={qrCode} />}
    </div>
  );
};

export default FileUpload;