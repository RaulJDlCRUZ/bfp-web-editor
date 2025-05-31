import React, { createContext, useState, useEffect, useRef } from "react";
import axiosInstance from "@/services/axios/apiInstance";
import { ArboristNode } from "@/common/types";

export interface FileExplorerContextType {
  selectedNode: ArboristNode | null;
  fileContent: string;
  selectNode: (node: ArboristNode | null) => void;
  saveFile: (content: string) => Promise<void>;
  reloadContent: () => void;
}

export const FileExplorerContext = createContext<
  FileExplorerContextType | undefined
>(undefined);

export const FileExplorerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedNode, setSelectedNode] = useState<ArboristNode | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  // Guarda el path anterior para detectar cambios
  const prevPathRef = useRef<string | undefined>(undefined);

  async function fetchFileContent(node: ArboristNode): Promise<void> {
    if (
      !node ||
      node.metadata.nodetype === "directory" ||
      node.metadata.filetype === "pdf"
    )
      return;

    try {
      if (node.metadata.name === "config.yaml") {
        const response = await axiosInstance.get("/config");
        if (!response) throw new Error("Error fetching file content");
        setFileContent(response.data);
        return;
      } else {
        const queryPath: string = node.metadata.path.split("input/")[1];
        const response = await axiosInstance.get(`/files/${queryPath}`);
        if (!response) throw new Error("Error fetching file content");
        setFileContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("");
    }
  }

  async function saveFile(newContent: string): Promise<void> {
    if (!selectedNode || selectedNode.metadata.nodetype === "directory") return;
    try {
      const queryPath: string = selectedNode.metadata.path.split("input/")[1];
      await axiosInstance.patch(`/files/${queryPath}`, {
        content: newContent,
      });
      setFileContent(newContent);
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  function reloadContent(): void {
    if (selectedNode) {
      fetchFileContent(selectedNode);
    }
  }

  function selectNode(node: ArboristNode | null): void {
    setSelectedNode(node);
  }

  // Detecta cambios en el path del nodo seleccionado
  useEffect(() => {
    const currentPath = selectedNode?.metadata.path;
    if (currentPath && prevPathRef.current !== currentPath) {
      fetchFileContent(selectedNode!);
    }
    prevPathRef.current = currentPath;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.metadata.path]);

  const providerValue: FileExplorerContextType = {
    selectedNode,
    fileContent,
    selectNode,
    saveFile,
    reloadContent,
  };

  return (
    <FileExplorerContext.Provider value={providerValue}>
      {children}
    </FileExplorerContext.Provider>
  );
};
