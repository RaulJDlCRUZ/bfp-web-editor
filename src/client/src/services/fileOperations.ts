import axiosInstance from "./axios/apiInstance";

function validateExpression(expression: string): boolean {
  const regex = /^[a-zA-Z0-9_\-\.]+$/;
  return regex.test(expression);
}

export function checkFileName(filename: string): string {
  if (!validateExpression(filename)) {
    throw new Error("Nombre de archivo no válido");
  }
  return filename;
}

export function checkDirectoryName(directory: string): string {
  if (!validateExpression(directory)) {
    throw new Error("Nombre de directorio no válido");
  }
  return directory;
}

export async function fetchFileListing(): Promise<any> {
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
  try {
    const checkedName: string = checkFileName(String(newName));
    const trimFile = file.split("input/")[1];
    const response = await axiosInstance.put("/files/rename", {
      oldFile: trimFile,
      newFilename: checkedName,
    });
    console.log(`Archivo ${file} renombrado a ${checkedName}`, response.data);
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

export async function createFile(
  filename: string,
  new_element: string
): Promise<void> {
  try {
    let checkedFileName: string = checkFileName(String(filename));
    // Comprobar si tiene extensión, si no, establecer .md por defecto
    if (!checkedFileName.includes(".")) {
      checkedFileName += ".md";
    }
    const response = await axiosInstance.post(`/files/${checkedFileName}`, {
      mode: new_element,
    });
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
    const checkedDirName: string = checkDirectoryName(String(newDirName));
    const trimPath = destPath.split("input/")[1] || "./";
    const response = await axiosInstance.post("/files/mkdir", {
      name: checkedDirName,
      path: trimPath,
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
    const trimFile = filename.split("input/")[1] || "./";
    const response = await axiosInstance.get(`/files/${trimFile}`, {
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

export async function moveFile(
  oldFilePath: string,
  newFilePath: string
): Promise<void> {
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
    const trimFile = filename.split("input/")[1] || "./";
    await axiosInstance.delete(`/files/${trimFile}`);
  } catch (error) {
    console.error(`Error al eliminar archivo ${filename}:`, error);
    throw error;
  }
}

export async function deleteDirectory(directory: string): Promise<void> {
  try {
    const trimDir = directory.split("input/")[1] || "./";
    const response = await axiosInstance.post("/files/rmdir", {
      path: trimDir,
    });
    if (!response.data || !response.data.success) {
      throw new Error("Error al eliminar el directorio");
    }
    console.log(`Directorio ${directory} eliminado`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar directorio ${directory}:`, error);
    throw error;
  }
}

export function upElement(): void {
  // TODO:
}

// TODO: Remove Directory
