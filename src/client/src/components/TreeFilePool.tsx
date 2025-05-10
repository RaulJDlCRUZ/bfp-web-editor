import React, { useEffect, useRef, useState, JSX } from "react";
import axiosInstance from "@/services/axiosInstance";
import { transformToArborist } from "@/services/treeConversion";
import { fileIcons, ArboristNode } from "@/common/types";
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
  const [movingNode, setMovingNode] = useState<ArboristNode | null>(null);

  async function fetchTree(): Promise<void> {
    try {
      const response = await axiosInstance.get("/files");
      if (!response) {
        throw new Error("Error al obtener el árbol");
      }
      const transformed = transformToArborist(response.data);
      setTreeData([transformed]);
    } catch (error) {
      console.error("Error al cargar el árbol:", error);
    }
  }

  async function handleMoveMode(): Promise<void> {
    try {
      if (!movingNode) return;
      selectNode(null);
    } catch (error) {
      console.error("Error al intentar mover el archivo:", error);
    }
  }

  function handleSelect(nodes: NodeApi<ArboristNode>[]): void {
    if (nodes.length > 0) {
      const inputNode: ArboristNode = nodes[0].data;
      if (movingNode) {
        if (inputNode.data.nodetype !== "directory") return;
        const dest = inputNode.id + "/" + movingNode.name;
        if (movingNode.id === dest) {
          alert("No puedes mover el archivo a la misma carpeta");
          setMovingNode(null);
          selectNode(null);
          return;
        }
        handleMoveFile(movingNode, inputNode);
        setMovingNode(null);
        selectNode(null);
      }
      selectNode(inputNode);
      console.log("Seleccionado:", inputNode);
    } else {
      selectNode(null);
    }
  }

  async function handleMoveFile(
    origin: ArboristNode,
    destiny: ArboristNode
  ): Promise<void> {
    try {
      const oldPath = origin.id.split("/input/")[1] || "./";
      const newPath = destiny.id.split("/input/")[1] || "./";
      await axiosInstance
        .post("/files/move", {
          oldPath: oldPath,
          newPath: newPath,
        })
        .then(async () => {
          alert(`Archivo movido a ${newPath}/${origin.name}`);
          fetchTree();
        })
        .catch((err) => {
          alert(`Error al mover el archivo`);
          console.error(`Error al mover el archivo:`, err);
        });
    } catch (err) {
      alert(`Error al mover el archivo`);
      console.error(`Error al mover el archivo:`, err);
    }
  }

  async function handleRename(nodeToRename: ArboristNode): Promise<void> {
    // TODO: add rename support for directories
    if (nodeToRename.restricted || nodeToRename.data.nodetype === "directory")
      return;

    const newName = window.prompt(
      `Renombrar ${nodeToRename.name} a:`,
      nodeToRename.name
    );

    if (!newName || newName.trim() === "" || newName === nodeToRename.name) {
      return;
    }

    try {
      const file: string = nodeToRename.data.path;
      const checkedName: string = checkFileName(String(newName));
      axiosInstance
        .put("/files/rename", {
          oldFile: file,
          newFilename: checkedName,
        })
        .then(async () => {
          alert(`Archivo renombrado a ${newName}`);
          fetchTree();
        })
        .catch((err) => {
          alert(`Error al renombrar ${nodeToRename.name}`);
          console.error(`Error al renombrar ${nodeToRename.name}:`, err);
        });
    } catch (err) {
      alert(`Error al renombrar ${nodeToRename.name}`);
      console.error(`Error al renombrar ${nodeToRename.name}:`, err);
    }
  }

  function deselectAll(e: React.MouseEvent): void {
    e.stopPropagation(); // Evita la propagación del evento
    if (treeRef.current) {
      treeRef.current.deselectAll();
      setMovingNode(null);
      selectNode(null);
    }
  }

  function getIcon(node: ArboristNode): any {
    if (node.data.nodetype === "file") {
      return fileIcons[node.data.filetype] || "📄";
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
      await fetchTree();
    } catch (err) {
      alert(`Error al crear ${filename}`);
      console.error(`Error al crear ${filename}:`, err);
    }
  }

  function handleCreateDirectory(): void {
    const selectedNodeId = treeRef.current?.selectedNodes?.[0].id;
    if (!selectedNodeId) return;
    let path = selectedNodeId.split("/input")[0];
    const dirName = window.prompt("Enter the name of the new directory:");
    if (dirName && dirName.trim() !== "") {
      try {
        const checkedName = checkFileName(dirName);
        alert(`Directory ${checkedName} created`);
        axiosInstance.post("/files/mkdir", {
          name: checkedName,
          path: path,
        });
      } catch (err) {
        alert(`Error al crear ${dirName}`);
        console.error(`Error al crear ${dirName}:`, err);
      } finally {
        fetchTree();
      }
    }
  }

  async function handleDelete(nodeToDelete: ArboristNode): Promise<void> {
    if (nodeToDelete.restricted || nodeToDelete.data.nodetype === "directory")
      return;
    const filename = nodeToDelete.name;
    const file = nodeToDelete.data.path;
    if (!window.confirm(`¿Está seguro de que desea eliminar ${filename}?`)) {
      return;
    }
    try {
      await deleteFile(file);
      alert(`Archivo ${filename} eliminado con éxito`);
      await fetchTree();
    } catch (err) {
      alert(`Error al eliminar ${filename}`);
    }
  }

  useEffect(() => {
    setMovingNode(null);
    fetchTree();
  }, []);

  useEffect(() => {
    if (movingNode) {
      handleMoveMode();
    }
  }, [movingNode]);

  return (
    <div style={{ overflowY: "auto" }}>
      <Tree
        ref={treeRef}
        data={treeData}
        height={400}
        width="100%"
        rowHeight={24}
        padding={8}
        indent={24}
        disableMultiSelection={false}
        onSelect={handleSelect}
      >
        {({ node, style, dragHandle }) => {
          const arboristNode = node.data as ArboristNode;
          const isRestricted = arboristNode.restricted;
          const isEditable = arboristNode.edit;
          const treeitem = arboristNode.data;
          return (
            <div
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "0.5rem",
                borderRadius: "1px",
                userSelect: "none",
                backgroundColor: movingNode
                  ? treeitem.nodetype === "directory"
                    ? "#d0e7ff"
                    : "white"
                  : node.isSelected
                  ? isRestricted && !isEditable
                    ? "#ededed"
                    : "#edffe8"
                  : "white",
                cursor:
                  movingNode && treeitem.nodetype !== "directory"
                    ? "not-allowed"
                    : "pointer",
              }}
              ref={dragHandle}
            >
              <span
                style={{
                  fontWeight:
                    node.isSelected && !movingNode ? "bold" : "normal",
                  color:
                    movingNode && treeitem.nodetype !== "directory"
                      ? "#999"
                      : "#000",
                }}
              >
                {treeitem.nodetype === "directory"
                  ? "📁"
                  : getIcon(arboristNode)}{" "}
                {arboristNode.name}
              </span>
              <span
                style={{
                  visibility:
                    node.isSelected && !isRestricted && !movingNode
                      ? "visible"
                      : "hidden",
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
                    handleRename(arboristNode);
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (arboristNode.data.nodetype === "file") {
                      setMovingNode((prev) => {
                        if (prev?.id !== arboristNode.id) {
                          return arboristNode;
                        }
                        return prev;
                      });
                    }
                  }}
                >
                  Ⓜ️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(arboristNode);
                  }}
                  disabled={isRestricted}
                >
                  🗑️
                </button>
                {node.isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deselectAll(e);
                      setMovingNode(null);
                    }}
                  >
                    ❌
                  </button>
                )}
              </span>
              {treeitem.nodetype === "directory" &&
                node.isSelected &&
                !movingNode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateDirectory();
                    }}
                  >
                    ➕📁
                  </button>
                )}
            </div>
          );
        }}
      </Tree>

      <div className="flex justify-between items-center mt-4">
        {treeRef.current?.selectedNodes?.[0] && (
          <div className="tree-actions">
            <button
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded"
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
