import axiosInstance from "./axiosInstance";
import { FileItem } from "@/common/types";

export async function uploadFile(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Archivo subido:", res.data);
    // Aquí puedes refrescar el listado de ficheros o notificar al usuario
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    throw new Error("Error al subir el archivo");
  }
}

export async function fetchFiles(): Promise<FileItem[]> {
  try {
    const response = await axiosInstance.get("/tree");
    if (!response.data) {
      throw new Error("Error al obtener los archivos");
    }
    const files = await response.data.files;
    // Convert file names to objects with name and selected properties
    const fileObjects: FileItem[] = files.map((file: string) => ({
      name: file,
      selected: false,
    }));
    return fileObjects;
  } catch (error) {
    console.error("Error al cargar archivos:", error);
    throw error;
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

export async function deleteFile(filename: string): Promise<void> {
  try {
    await axiosInstance.delete(`/files/${filename}`);
  } catch (error) {
    console.error(`Error al eliminar archivo ${filename}:`, error);
    throw error;
  }
}
