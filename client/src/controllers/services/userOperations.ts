import axiosInstance from "./axios/apiInstance";

export async function CreateUserFromForm(data: any): Promise<void> {
  try {
    const response = await axiosInstance.post("/users", data);
    if (response.status !== 201) { // CREATION SUCCESSFUL CODE
      throw new Error("Error al crear el usuario");
    }
    console.log("Usuario creado exitosamente:", response.data);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}
