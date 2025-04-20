import React, { useEffect, useState } from "react";
import {
  fetchFiles,
  createFile,
  downloadFile,
  deleteFile,
} from "@/services/fileOperations";
// import { File, FileItem } from '@/common/types';
import { File } from "@/common/types";

function checkFileName(filename: string): string {
  // Validar el nombre del archivo
  const regex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!regex.test(filename)) {
    throw new Error("Nombre de archivo no válido");
  }
  // Comprobar si tiene extensión, si no, establecer .md por defecto
  if (!filename.includes(".")) {
    filename += ".md";
  }
  return filename;
}

async function handleDownload(filename: string): Promise<void> {
  try {
    const blob = await downloadFile(filename);
    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    alert(`Archivo ${filename} se descargará en breve`);
  } catch (err) {
    alert(`Error al descargar ${filename}`);
    console.error(`Error al descargar ${filename}:`, err);
  }
}

function SimpleFileList(): React.ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  async function handleCreate(filename: string): Promise<void> {
    try {
      await createFile(filename);
      setFiles([...files, { name: filename, selected: false }]);
      alert(`Archivo ${filename} creado con éxito`);
    } catch (err) {
      alert(`Error al crear ${filename}`);
      console.error(`Error al crear ${filename}:`, err);
    }
  }

  async function handleDelete(filename: string): Promise<void> {
    try {
      // TODO: Confirmación antes de eliminar (¿window.confirm o similar?)
      await deleteFile(filename);
      setFiles(files.filter((file) => file.name !== filename));
      alert(`Archivo ${filename} eliminado con éxito`);
    } catch (err) {
      alert(`Error al eliminar ${filename}`);
    }
  }

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

  // UseEffect to load files when the component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="file-list">
      <p className="text-gray-500 text-xl mt-4">Listado de ficheros</p>

      {files.length === 0 ? (
        <p>No hay archivos disponibles</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li
              key={`${index}_${file.name.replace("/", "-")}`}
              className="flex justify-between"
            >
              <span className="text-gray-700">{file.name}</span>{" "}
              <button onClick={() => handleDownload(file.name)}>
                Descargar
              </button>{" "}
              <button onClick={() => handleDelete(file.name)}>Borrar</button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-gray-500 text-xl mt-4">Acciones</p>

      <div className="flex justify-between mt-4">
        <input
          type="text"
          placeholder="Nombre del nuevo archivo"
          id="filename"
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          onClick={() => {
            const filename = (
              document.getElementById("filename") as HTMLInputElement
            ).value;
            handleCreate(checkFileName(filename));
          }}
        >
          Crear
        </button>
      </div>

      <button onClick={() => handleCreate("ficheroprueba.md")}>
        Crear fichero de prueba
      </button>

      {/* Subir fichero */}
    </div>
  );
}

export default SimpleFileList;
