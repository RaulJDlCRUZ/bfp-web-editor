// Strategy Pattern
import { JSX, useState, useEffect } from "react";
import { useFileExplorerContext } from "@/hooks/FileExplorerHook";
import { imageExtensions } from "@/common/constants";
import TextArea from "./TextArea";
import ImageRenderer from "./ImageRenderer";

function ContentElector(): JSX.Element {
  const { selectedNode } = useFileExplorerContext();
  const typedImageExtensions: string[] = Object.keys(imageExtensions);
  const [contentType, setContentType] = useState<"text" | "image">("text");
  useEffect(() => {
    if (selectedNode) {
      const extension = selectedNode.name.split(".").pop()?.toLowerCase();
      if (extension && typedImageExtensions.includes(extension)) {
        setContentType("image");
      } else {
        setContentType("text");
      }
    }
  }, [selectedNode]);

  return (
    <div className="mt-8 h-2/8">
      {contentType === "text" && (
        <>
          {console.log("Rendering text content")}
          <TextArea />
        </>
      )}
      {contentType === "image" && (
        <>
          {console.log("Rendering image content")}
          <ImageRenderer />
        </>
      )}
    </div>
  );
}

export default ContentElector;
