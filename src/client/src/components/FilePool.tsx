import React, { useEffect, useState } from "react";

interface FileItem {
  name: string;
  size: number;
  type: string;
  // TODO: Add more properties as needed, e.g., content** or edition flags
}

const FilePool: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [changedFiles, setChangedFiles] = useState<{
    deletions: string[];
    updates: { filename: string; content: string }[];
    additions: { filename: string; content: string }[];
  }>({ deletions: [], updates: [], additions: [] });

  useEffect(() => {
    fetch("/files") // API Call
      .then((res) => res.json())
      .then((data) => {
        const filesList = data.files.map((f: string) => ({ name: f }));
        setFiles(filesList);
      })
      .catch((err) => console.error("Error al obtener los ficheros", err));
  }, []);

  return (
    <div>
      <h2>Listado de Ficheros</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name} draggable>
            {file.name}
            {/* Aquí se pueden agregar botones de eliminar o interfaz de edición */}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          fetch("/files/update", {
            // API Call
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changedFiles),
          })
            .then((res) => res.json())
            .then((data) => console.log("Actualización enviada", data))
            .catch((err) => console.error("Error al enviar cambios", err));
        }}
      >
        Aplicar cambios
      </button>
    </div>
  );
};

export default FilePool;
