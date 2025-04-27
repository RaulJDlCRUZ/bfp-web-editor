import React, { useRef, JSX } from "react";
import { uploadFile } from "@/services/fileOperations";

function FileUploader(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleButtonClick(): void {
    fileInputRef.current?.click();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <button
        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
        onClick={handleButtonClick}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUploader;
