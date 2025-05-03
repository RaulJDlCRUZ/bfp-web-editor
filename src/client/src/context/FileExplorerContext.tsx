import React, { createContext, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { ArboristNode } from "@/common/types";

interface FileExplorerContextType {
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

  async function fetchFileContent(node: ArboristNode): Promise<void> {
    if (!node || node.data.nodetype === "directory") return;

    try {
      const response = await axiosInstance.get(`/files/${node.data.path}`);
      if (!response) {
        throw new Error("Error fetching file content");
      }
      const content = await response.data;
      setFileContent(content);
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("");
    }
  }

  async function saveFile(newContent: string): Promise<void> {
    if (!selectedNode || selectedNode.data.nodetype === "directory") return;

    try {
      await axiosInstance.patch(`/files/${selectedNode.data.path}`, {
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
    fetchFileContent(node!);
  }

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
