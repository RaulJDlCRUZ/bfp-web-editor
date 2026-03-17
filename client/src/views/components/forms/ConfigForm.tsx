import { JSX, useState, useContext } from "react";
import { useFileExplorerContext } from "@/controllers/hooks/FileExplorerHook";
import { updateConfig } from "@/controllers/services/configOperations";

function ConfigForm(): JSX.Element {
  const { fileContent, reloadContent } = useFileExplorerContext();
  const [content, setContent] = useState("");

  if (!fileContent || typeof fileContent !== "object") {
    return (
      <div className="mt-8 h-2/8">
        <p className="text-gray-500 text-sm">
          No configuration data available or invalid format.
        </p>
      </div>
    );
  }

  function handleCancel() {
    reloadContent();
    setContent(fileContent || ""); // Ensure content is updated after reload
  }

  async function handleSave() {
    try {
      const formData = new FormData(
        document.querySelector("form") as HTMLFormElement
      );
      const updatedContent: Record<string, any> = {};
      formData.forEach((value, key) => {
        updatedContent[key] = value;
      });
      // console.log("Updated Content:", updatedContent);
      await updateConfig(updatedContent);
      alert("Archivo guardado con éxito");
    } catch (error) {
      alert("Error al aplicar la configuración");
    }
  }

  return (
    <div
      style={{
        height: "calc(100vh * 0.5)",
      }}
    >
      <form className="mt-8 h-2/8 grid grid-cols-2 gap-4">
        {Object.entries(fileContent).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label htmlFor={key} className="block text-gray-700 font-bold mb-2">
              {key}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              defaultValue={value as string}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
      </form>
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 text-s font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-sm select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          type="button"
          className="select-none rounded-sm bg-gray-900 py-2 px-4 text-center align-middle text-s font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}

export default ConfigForm;
