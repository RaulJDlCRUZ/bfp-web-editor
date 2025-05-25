import { JSX, useState, useEffect } from "react";
import { useFileExplorerContext } from "@/hooks/FileExplorerHook";
import { imageExtensions } from "@/common/constants";
import TextArea from "./TextArea";
import ImageRenderer from "./ImageRenderer";
import ConfigForm from "./ConfigForm";

function ContentElector(): JSX.Element {
  const { selectedNode } = useFileExplorerContext();
  const typedImageExtensions: string[] = Object.keys(imageExtensions);
  const [contentType, setContentType] = useState<"text" | "image" | "cfg">(
    "text"
  );
  useEffect(() => {
    if (selectedNode) {
      if (
        selectedNode.name === "config.yaml" ||
        selectedNode.name === "config.json"
      ) {
        setContentType("cfg");
      } else {
        const extension = selectedNode.name.split(".").pop()?.toLowerCase();
        if (extension && typedImageExtensions.includes(extension)) {
          setContentType("image");
        } else {
          setContentType("text");
        }
      }
    }
  }, [selectedNode]);

  return (
    <div className="mt-8">
      {contentType === "cfg" && <ConfigForm />}
      {contentType === "text" && <TextArea />}
      {contentType === "image" && <ImageRenderer />}
    </div>
  );
}

export default ContentElector;
