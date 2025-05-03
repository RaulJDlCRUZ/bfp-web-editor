import { useContext } from "react";
import { FileExplorerContext } from "@/context/FileExplorerContext";

export function useFileExplorerContext() {
  const context = useContext(FileExplorerContext);
  if (context === undefined) {
    throw new Error(
      "useFileExplorerContext must be used within a FileExplorerProvider"
    );
  }
  return context;
}
