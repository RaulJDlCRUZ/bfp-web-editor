import { useContext } from "react";
import {
  FileExplorerContext,
  FileExplorerContextType,
} from "@/controllers/context/FileExplorerContext";

export function useFileExplorerContext(): FileExplorerContextType {
  const context = useContext(FileExplorerContext);
  if (context === undefined) {
    throw new Error(
      "useFileExplorerContext must be used within a FileExplorerProvider"
    );
  }
  return context;
}
