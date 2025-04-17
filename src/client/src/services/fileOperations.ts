import axiosInstance from "./axiosInstance";
import { File } from "@/common/types";

export async function fetchFiles(): Promise<File[]> {
  try {
    const response = await axiosInstance.get("/files");
    if (!response.data || !response.data.files) {
      throw new Error("Error al obtener los archivos");
    }
    const files = await response.data.files;
    // Convert file names to objects with name and selected properties
    const fileObjects: File[] = files.map((file: string) => ({
      name: file,
      selected: false,
    }));
    return fileObjects;

  } catch (error) {
    console.error("Error al cargar archivos:", error);
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
