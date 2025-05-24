import axiosInstance from "./axiosInstance";

export async function getConfig(): Promise<Record<string, any>> {
  try {
    const response = await axiosInstance.get("/config");
    if (!response.data || !response.data.success) {
      throw new Error("Error al obtener la configuración");
    }
    return response.data.config;
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    throw error;
  }
}
export async function updateConfig(config: Record<string, any>): Promise<void> {
  try {
    const response = await axiosInstance.patch("/config", { config });
    if (!response.data || !response.data.success) {
      throw new Error("Error al actualizar la configuración");
    }
  } catch (error) {
    console.error("Error al actualizar la configuración:", error);
    throw error;
  }
}
