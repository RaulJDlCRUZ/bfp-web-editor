/* Adapted from: https://www.material-tailwind.com/docs/html/textarea */
import { JSX, useState, useEffect } from "react";
import { useFileExplorerContext } from "@/controllers/hooks/FileExplorerHook";

function TextArea(): JSX.Element {
  const { selectedNode, fileContent, saveFile, reloadContent } =
    useFileExplorerContext();
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("-");

  async function handleSave() {
    try {
      await saveFile(content);
      alert("Archivo guardado con éxito");
    } catch (error) {
      alert("Error al guardar el archivo");
    }
  }

  function handleCancel() {
    reloadContent();
    setContent(fileContent || ""); // Ensure content is updated after reload
  }

  useEffect(() => {
    if (selectedNode && selectedNode.nodetype !== "directory") {
      setFilename(
        `${
          selectedNode.order
            ? (selectedNode.nodetype === "appendix"
                ? String.fromCharCode(64 + selectedNode.order * 0.1) // Obtengo la letra correspondiente
                : selectedNode.order * 0.1) + ". "
            : ""
        } ${selectedNode.nodename}` || ""
      );
      if (
        selectedNode.metadata.nodetype !== "directory" &&
        selectedNode.metadata.filetype !== "pdf"
      ) {
        setContent(fileContent || "");
      } else if (selectedNode.metadata.name.endsWith("pdf")) {
        setContent(
          "Los documentos PDF no están disponibles para su previsualización. Por favor, descargue el archivo para verlo."
        );
        setFilename(`${selectedNode.metadata.name}`);
      }
    }
  }, [fileContent, selectedNode]);

  return (
    <div className="flex flex-col items-start justify-start h-full">
      <div className="w-full flex justify-center items-center mb-2">
        <span
          className={`text-lg font-bold ${
            !selectedNode ||
            selectedNode.metadata.nodetype === "directory" ||
            selectedNode.metadata.filetype === "pdf"
              ? "text-gray-900/50"
              : "text-gray-900"
          }`}
        >
          {filename}
        </span>
      </div>
      <div
        style={{ height: "calc(100vh * 0.5)" }}
        className="resize-none md:resize w-full h-auto"
      >
        <textarea
          className="w-full h-full p-3 border border-gray-300 rounded-none resize-none font-mono focus:outline-none focus:ring-1 focus:ring-gray-900"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={
            !selectedNode ||
            selectedNode.metadata.nodetype === "directory" ||
            selectedNode.metadata.filetype === "pdf"
          }
          placeholder={selectedNode ? "" : "Select a file to start working"}
        ></textarea>
      </div>
      <div className="flex justify-end w-full py-1.5">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 text-s font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-sm select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleCancel}
            disabled={
              !selectedNode ||
              selectedNode.metadata.nodetype === "directory" ||
              selectedNode.metadata.filetype === "pdf"
            }
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !selectedNode ||
              selectedNode.metadata.nodetype === "directory" ||
              selectedNode.metadata.filetype === "pdf"
            }
            className="select-none rounded-sm bg-gray-900 py-2 px-4 text-center align-middle text-s font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextArea;
