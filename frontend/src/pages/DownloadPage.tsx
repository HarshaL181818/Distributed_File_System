import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DownloadPage = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);  
    const token = params.get('token');

    if (token) {
      const downloadUrl = `${process.env.REACT_APP_API_BASE_URL}/files/download-by-token?token=${token}`;
      // Trigger download automatically
      window.location.href = downloadUrl;
    }
  }, [location]);

  return (
    <div>
      <h2>Downloading...</h2>
      <p>If your download does not start automatically, the link may have expired.</p>
    </div>
  );
};

export default DownloadPage;
