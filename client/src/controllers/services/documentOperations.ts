import axiosInstance from "./axios/apiInstance";

export async function fetchDocument() {
  try {
    const response = await axiosInstance.get("/doc/compile");
    if (response.data && response.data.result === "OK") {
      return response;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export async function printDocument() {
  try {
    const response = await axiosInstance.get("/doc/result");
    if (response.data) {
      const blob = new Blob([response.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}