import axiosInstance from "./axiosInstance";

function validateExpression(expression: string): boolean {
  const regex = /^[a-zA-Z0-9_\-\.]+$/;
  return regex.test(expression);
}

export function checkFileName(filename: string): string {
  if (!validateExpression(filename)) {
    throw new Error("Nombre de archivo no válido");
  }
  // Comprobar si tiene extensión, si no, establecer .md por defecto
  if (!filename.includes(".")) {
    filename += ".md";
  }
  return filename;
}

export function checkDirectoryName(directory: string): string {
  if (!validateExpression(directory)) {
    throw new Error("Nombre de directorio no válido");
  }
  return directory;
}

export async function fetchFiles(): Promise<any> {
  try {
    const response = await axiosInstance.get("/files");
    if (!response || (response && !response.data))
      throw new Error("Error al obtener el árbol");
    return response.data;
  } catch (error) {
    console.error("Error al cargar archivos:", error);
    throw error;
  }
}

export async function renameFile(file: string, newName: string): Promise<void> {
  console.log(`Renombrando ${file} a ${newName} en el servidor...`);
  try {
    const response = await axiosInstance.put("/files/rename", {
      oldFile: file,
      newFilename: newName,
    });
    console.log(`Archivo ${file} renombrado a ${newName}`, response.data);
  } catch (err) {
    console.error(`Error al renombrar ${file}:`, err);
    throw new Error(`Error al renombrar ${file}`);
  }
}

export async function uploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axiosInstance.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Archivo subido:", res.data);
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    throw new Error("Error al subir el archivo");
  }
}

export async function createFile(filename: string): Promise<void> {
  try {
    const response = await axiosInstance.post(`/files/${filename}`);
    if (!response.data || !response.data.success) {
      throw new Error("Error al crear el archivo");
    }
    return response.data;
  } catch (error) {
    console.error(`Error al crear archivo ${filename}:`, error);
    throw error;
  }
}

export async function createDirectory(
  newDirName: string,
  destPath: string
): Promise<void> {
  try {
    const response = await axiosInstance.post("/files/mkdir", {
      name: newDirName,
      path: destPath,
    });
    if (!response.data || !response.data.success) {
      throw new Error("Error al crear el archivo");
    }
    return response.data;
  } catch (error) {
    console.error(`Error al crear el directorio ${newDirName}:`, error);
    throw error;
  }
}

export async function downloadFile(filename: string): Promise<Blob> {
  try {
    const response = await axiosInstance.get(`/files/${filename}`, {
      responseType: "blob", // Importante para descargar archivos binarios
    });
    if (!response.data) {
      throw new Error("Error al descargar el archivo");
    }
    return response.data;
  } catch (error) {
    console.error(`Error al descargar archivo ${filename}:`, error);
    throw error;
  }
}

export async function moveFile(oldFilePath: string, newFilePath: string): Promise<void> {
  try {
    const response = await axiosInstance.post("/files/move", {
      oldPath: oldFilePath.split("input/")[1] || "./",
      newPath: newFilePath.split("input/")[1] || "./",
    });
    if (!response.data || !response.data.success) {
      throw new Error("Error al mover el archivo");
    }
    return response.data;
  } catch (error) {
    console.error("Error al mover el archivo:", error);
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    await axiosInstance.delete(`/files/${filename}`);
  } catch (error) {
    console.error(`Error al eliminar archivo ${filename}:`, error);
    throw error;
  }
}
