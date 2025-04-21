import React, { useRef } from 'react';
import { uploadFile } from '@/services/fileOperations';

const FileUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
      alert(`Archivo ${file.name} subido con éxito`);
    } catch (err) {
      alert(`Error al subir ${file.name}`);
      console.error(`Error al subir ${file.name}:`, err);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Optionally, you can refresh the file list or perform other actions here
    // loadFiles();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button onClick={handleButtonClick}>Subir archivo</button>
    </div>
  );
};

export default FileUploader;
