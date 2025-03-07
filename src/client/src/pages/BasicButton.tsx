import React from "react";
// import axios from "../services/axiosInstance.ts"; // Usamos instancia base

const BasicButton: React.FC = () => {
  const handleClick = async () => {
    const resultDiv = document.getElementById("result");
    let newTab: Window | null = null;
    try {
      // MUST FIX: Abrir una nueva pestaña antes de la solicitud para evitar el bloqueo del navegador
      newTab = window.open("", "_blank");
      if (newTab === null) {
        throw new Error("No se pudo abrir una nueva pestaña");
      }
      const respuesta = await fetch("http://localhost:3000/runcompilation");
      const data = await respuesta.json();
      if (resultDiv) {
        resultDiv.textContent = data.result;
      }

      // Redirigir la nueva pestaña al PDF si existe
      if (data.pdf) {
        newTab.location.href = `http://localhost:3000${data.pdf}`;
      } else {
        newTab.close();
      }
    } catch (error: any) {
      if (resultDiv) {
        resultDiv.textContent = `Error: ${error.message}`;
      }
      if (newTab) {
        newTab.close();
      }
    }
  };

  return (
    <div>
      <button id="compileButton" onClick={handleClick}>
        Obtener PDF
      </button>
      <pre id="result"></pre>
    </div>
  );
};

export default BasicButton;
