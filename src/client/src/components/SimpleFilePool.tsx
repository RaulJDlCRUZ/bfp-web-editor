import React, { useEffect, useState } from "react";
import { fetchFiles, downloadFile } from "@/services/fileOperations";
// import { File, FileItem } from '@/common/types';
import { File } from '@/common/types';

function SimpleFileList(): React.ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar archivos cuando el componente se monta
    async function loadFiles() {
      try {
        setLoading(true);
        const fileList: File[] = await fetchFiles();
        console.log(fileList);
        setFiles(fileList); // Extract file names as strings
      } catch (error) {
        alert("Error al cargar archivos");
        console.error("Error al cargar archivos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="file-list">
        <p className="text-gray-500 text-xl mt-4">
          Listado de ficheros
        </p>

      {files.length === 0 ? (
        <p>No hay archivos disponibles</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={`${index}_${file.name}`} className="flex justify-between">
              <span className="text-gray-700">{file.name}</span>
              {" "}
              <button onClick={() => downloadFile(file.name)}>Descargar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SimpleFileList;
