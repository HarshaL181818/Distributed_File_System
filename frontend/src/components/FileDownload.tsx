import React, { useState } from 'react';

const FileDownload = () => {
  const [fileId, setFileId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleDownload = async () => {
    if (!fileId.trim()) {
      setMessage('Please enter a valid File ID.');
      return;
    }

    setMessage('Starting download...');
    
    try {
      // Construct the full download URL
      const downloadUrl = `${process.env.REACT_APP_API_BASE_URL}/files/download/${fileId}`;
      
      // Use fetch to check if the file exists and is accessible
      const response = await fetch(downloadUrl);

      if (response.ok) {
        // Create a temporary link element to trigger the browser's download prompt
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // The 'download' attribute suggests a filename to the browser.
        // We don't know the original name here, so we let the browser handle it.
        link.setAttribute('download', ''); // An empty 'download' attribute works
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up the temporary link
        document.body.removeChild(link);
        
        setMessage('Download initiated successfully!');
      } else {
        // Handle HTTP errors like 404 Not Found
        setMessage(`Error: Could not find file. (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      setMessage('Download failed. Check the console for more details.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Download File by ID</h3>
      <input
        type="text"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        placeholder="Enter File ID"
        style={{ padding: '8px', marginRight: '10px', minWidth: '300px' }}
      />
      <button onClick={handleDownload} style={{ padding: '8px 12px' }}>
        Download
      </button>
      {message && <p style={{ marginTop: '10px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default FileDownload;