import { JSX, useState, useEffect } from "react";
import { useFileExplorerContext } from "@/controllers/hooks/FileExplorerHook";
import { imageExtensions } from "@/shared/constants/imageExtensions";

const BASE_BACKEND_URI = import.meta.env.VITE_BACKEND_BS_URI; // without api suffix

function ImageRenderer(): JSX.Element {
  const { selectedNode } = useFileExplorerContext();
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    if (selectedNode !== undefined) {
      const imagePath = selectedNode?.metadata.path;
      const newImageName = imagePath?.split("/resources/images/").pop(); // Pop ensures we get the last part of the path
      // const extension = newImageName?.split(".").pop()?.toLowerCase();
      setImageName(newImageName || "");
    }
  }, [selectedNode]); // Update dependency to selectedNode

  return (
    <div
      style={{ height: "400px" }} // Same as FileTree
      className="p-4 align-middle justify-center flex flex-col items-center"
    >
      {imageName && (
        <img
          src={`${BASE_BACKEND_URI}/images/${imageName}`}
          alt={`${imageName}`}
          className={`w-full h-full border border-gray-300 ${
            imageExtensions[imageName.split(".").pop()?.toLowerCase() || ""] ||
            "image-render-auto"
          }`}
        />
      )}
    </div>
  );
}

export default ImageRenderer;
