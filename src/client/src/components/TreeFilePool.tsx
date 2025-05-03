import React, { useEffect, useRef, useState, JSX } from "react";
import axiosInstance from "@/services/axiosInstance";
import { transformToArborist } from "@/services/treeConversion";
import { TreeNode, fileIcons, ArboristNode } from "@/common/types";
import { NodeApi, Tree, TreeApi } from "react-arborist";
import {
  createFile,
  downloadFile,
  deleteFile,
  checkFileName,
} from "@/services/fileOperations";
import FileUploader from "./FileUploader";
import { useFileExplorerContext } from "@/hooks/FileExplorerHook";

function TreeComponent(): JSX.Element {
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const treeRef = useRef<TreeApi<ArboristNode>>(null);
  const { selectNode } = useFileExplorerContext();

  async function fetchTree(): Promise<void> {
    try {
      const response = await axiosInstance.get<TreeNode>("/tree");
      if (!response) {
        throw new Error("Error al obtener el árbol");
      }
      const transformed = transformToArborist(response.data);
      setTreeData([transformed]);
    } catch (error) {
      console.error("Error al cargar el árbol:", error);
    }
  }

  function deselectAll(e: React.MouseEvent): void {
    e.stopPropagation(); // Evita la propagación del evento
    if (treeRef.current) {
      treeRef.current.deselectAll();
      selectNode(null);
    }
  }

  function getIcon(node: TreeNode): any {
    if (node.nodetype === "file") {
      return fileIcons[node.filetype] || "📄";
    }
  }

  function handleSelect(nodes: NodeApi<ArboristNode>[]): void {
    const filteredNodes = nodes.filter(
      (node) =>
        !(node.data as ArboristNode).restricted ||
        ((node.data as ArboristNode).restricted &&
          (node.data as ArboristNode).edit)
    );
    if (filteredNodes.length > 0) {
      const node = filteredNodes[0];
      selectNode(node.data);
      const file = node.data;
      console.log("Seleccionado:", file);
    } else {
      selectNode(null);
    }
  }

  async function handleDownload(filename: string): Promise<void> {
    try {
      const blob = await downloadFile(filename);
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert(`Archivo ${filename} se descargará en breve`);
    } catch (err) {
      alert(`Error al descargar ${filename}`);
      console.error(`Error al descargar ${filename}:`, err);
    }
  }

  async function handleCreate(): Promise<void> {
    const filename = checkFileName(
      (document.getElementById("filename") as HTMLInputElement).value
    );
    try {
      const result = await createFile(filename);
      console.log(result);
      alert(`Archivo ${filename} creado con éxito`);
      // Let the server to re-generate the structure and refresh the tree data
      await fetchTree();
    } catch (err) {
      alert(`Error al crear ${filename}`);
      console.error(`Error al crear ${filename}:`, err);
    }
  }

  async function handleDelete(nodeToDelete: ArboristNode): Promise<void> {
    if (nodeToDelete.restricted || nodeToDelete.data.nodetype === "directory")
      return;
    const filename = nodeToDelete.name;
    const deleteID = nodeToDelete.id;
    const file = nodeToDelete.data.path;
    // TODO: Confirmación antes de eliminar (¿window.confirm o similar?)
    if (!window.confirm(`¿Está seguro de que desea eliminar ${filename}?`)) {
      return;
    }
    try {
      await deleteFile(file);
      alert(`Archivo ${filename} eliminado con éxito`);
      setTreeData((prev: ArboristNode[]) => {
        const updateTree = (nodes: ArboristNode[]): ArboristNode[] => {
          return nodes
            .map((node) => {
              if (node.children) {
                return {
                  ...node,
                  children: updateTree(
                    node.children.filter(
                      (child) => child.id !== nodeToDelete.id
                    )
                  ),
                };
              }
              return node;
            })
            .filter((node) => node.id !== deleteID);
        };
        return updateTree(prev);
      });
    } catch (err) {
      alert(`Error al eliminar ${filename}`);
    }
  }

  useEffect(() => {
    fetchTree();
  }, []);

  return (
    <div style={{ overflowY: "auto" }}>
      <Tree
        ref={treeRef}
        data={treeData}
        width="100%"
        rowHeight={32}
        padding={8}
        indent={24}
        disableMultiSelection={false}
        onSelect={handleSelect}
      >
        {({ node, style, dragHandle }) => {
          const arboristNode = node.data as ArboristNode;
          const item = arboristNode.data as TreeNode;
          const isRestricted = arboristNode.restricted;
          const isEditable = arboristNode.edit;
          return (
            <div
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "1rem",
                backgroundColor: node.isSelected
                  ? isRestricted && !isEditable
                    ? "white" // or white to not highlight
                    : "#edffe8" // Light green for selected nodes
                  : "white",
                borderRadius: "1px",
                userSelect: "none",
              }}
              ref={dragHandle}
            >
              <span>
                {item.nodetype === "directory" ? "📁" : getIcon(item)}{" "}
                {arboristNode.name}
              </span>
              <span
                style={{
                  visibility:
                    node.isSelected && !isRestricted ? "visible" : "hidden",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(arboristNode.name);
                  }}
                >
                  ⬇️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Renombrar: ${arboristNode.name}`);
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(arboristNode);
                  }}
                  disabled={isRestricted}
                  style={{
                    cursor: isRestricted ? "not-allowed" : "pointer",
                    opacity: isRestricted ? 0.5 : 1,
                  }}
                >
                  🗑️
                </button>
              </span>
            </div>
          );
        }}
      </Tree>
      <div className="flex justify-between items-center mt-4">
        {selectNode.length > 0 && (
          <div className="tree-actions">
            <button
              className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
              onClick={deselectAll}
            >
              Deselect
            </button>
          </div>
        )}
        <div className="ml-auto">
          <FileUploader />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {/* Create an horizontal line */}
        <input
          type="text"
          placeholder="Enter filename..."
          id="filename"
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default TreeComponent;
