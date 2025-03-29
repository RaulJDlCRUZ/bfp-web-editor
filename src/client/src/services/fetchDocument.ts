import axiosInstance from "./axiosInstance";

async function fetchDocument() {
  try {
    const response = await axiosInstance.get("/runcompilation");
    if (response.data && response.data.result === "Compiled successfully!") {
      return response;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export default fetchDocument;
