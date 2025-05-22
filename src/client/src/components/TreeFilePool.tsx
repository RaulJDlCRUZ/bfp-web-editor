import React, { useEffect, useRef, useState, JSX } from "react";
import { NodeApi, Tree, TreeApi } from "react-arborist";
import { ArboristNode } from "@/common/types";
import { fileIcons } from "@/common/constants";
import { useFileExplorerContext } from "@/hooks/FileExplorerHook";
import { transformToArborist } from "@/services/treeConversion";
import {
  createFile,
  downloadFile,
  deleteFile,
  createDirectory,
  renameFile,
  fetchFiles,
  moveFile,
} from "@/services/fileOperations";
import FileUploader from "./FileUploader";
import DropDownMenu from "./DropDown";
import Tooltip from "./Tooltips/Tooltip";

function TreeComponent(): JSX.Element {
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const treeRef = useRef<TreeApi<ArboristNode>>(null);
  const { selectNode } = useFileExplorerContext();
  const [movingNode, setMovingNode] = useState<ArboristNode | null>(null);

  async function fetchTree(): Promise<void> {
    try {
      const data = await fetchFiles();
      const transformed = transformToArborist(data);
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
        if (inputNode.metadata.nodetype !== "directory") return;
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

  async function handleReorder(
    operation: "up" | "down",
    node: ArboristNode
  ): Promise<void> {
    if (operation === "up") {
      try {
        const prevNode = treeRef.current
          ?.get(node.id)
          ?.parent?.children?.find(
            (child) =>
              child.data.metadata.nodetype === node.metadata.nodetype &&
              child.data.order !== null &&
              node.order !== null &&
              child.data.order === node.order - 10
          )?.data;
        if (!prevNode) {
          console.error(
            `prevNode not found ${node.nodetype}. Check treeData and order values.`
          );
          return;
        }
        console.log("prevNode found:", prevNode);
        // If I move logic to services, I call function here (WIP)
        // prevNode.order ? prevNode.order + 5 : null;
        // node.order ? node.order - 10 : null;
        let prevSlice = prevNode.name.slice(0, 2);
        let newSlice = node.name.slice(0, 2);
        await renameFile(node.metadata.path, prevSlice + node.name.slice(2));
        await renameFile(
          prevNode.metadata.path,
          newSlice + prevNode.name.slice(2)
        );
        // prevNode.order ? prevNode.order + 5 : null;
        // renameFile(prevNode)
      } catch (error) {
        console.error("Error al mover el archivo:", error);
      }
    } else if (operation === "down") {
      try {
        const nextNode = treeRef.current
          ?.get(node.id)
          ?.parent?.children?.find(
            (child) =>
              child.data.metadata.nodetype === node.metadata.nodetype &&
              child.data.order !== null &&
              node.order !== null &&
              child.data.order === node.order + 10
          )?.data;
        if (!nextNode) {
          console.error(
            `nextNode not found ${node.nodetype}. Check treeData and order values.`
          );
          return;
        }
        console.log("nextNode found:", nextNode);
        // If I move logic to services, I call function here (WIP)
        // nextNode.order ? nextNode.order - 5 : null;
        // node.order ? node.order + 10 : null;
        let prevSlice = node.name.slice(0, 2);
        let newSlice = nextNode.name.slice(0, 2);
        await renameFile(node.metadata.path, newSlice + node.name.slice(2));
        await renameFile(
          nextNode.metadata.path,
          prevSlice + nextNode.name.slice(2)
        );
      } catch (error) {
        console.error("Error al mover el archivo:", error);
      }
    }
    await fetchTree();
  }

  async function handleMoveFile(
    origin: ArboristNode,
    destiny: ArboristNode
  ): Promise<void> {
    const dest = destiny.metadata.path + "/" + origin.name;
    if (origin.metadata.path === dest) {
      alert("No puedes mover el archivo a la misma carpeta");
      setMovingNode(null);
      selectNode(null);
      return;
    }
    try {
      const oldPath = origin.metadata.path;
      const newPath = destiny.metadata.path;
      await moveFile(oldPath, newPath);
      alert(`Archivo movido a ${newPath}/${origin.name}`);
      await fetchTree();
    } catch (err) {
      alert(`Error al mover el archivo`);
      console.error(`Error al mover el archivo:`, err);
    }
  }

  async function handleRename(nodeToRename: ArboristNode): Promise<void> {
    // TODO: add rename support for directories
    if (
      nodeToRename.restricted ||
      nodeToRename.metadata.nodetype === "directory"
    )
      return;

    const newName = window.prompt(
      `Renombrar ${nodeToRename.name} a:`,
      nodeToRename.name
    );

    if (!newName || newName.trim() === "" || newName === nodeToRename.name) {
      return;
    }

    try {
      const file: string = nodeToRename.metadata.path;
      await renameFile(file, newName);
      alert(`Archivo ${nodeToRename.name} renombrado a ${newName}`);
      selectNode(null);
      await fetchTree();
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
    if (node.metadata.nodetype === "file") {
      return fileIcons[node.metadata.filetype] || "📄";
    }
  }

  async function handleDownload(nodeToDownload: ArboristNode): Promise<void> {
    const file = nodeToDownload.metadata.path;
    const name = nodeToDownload.name;
    try {
      const blob = await downloadFile(file);
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert(`Archivo ${name} se descargará en breve`);
    } catch (err) {
      alert(`Error al descargar ${name}`);
      console.error(`Error al descargar ${name}:`, err);
    }
  }

  async function handleCreate(): Promise<void> {
    const filename: string = (
      document.getElementById("filename") as HTMLInputElement
    ).value;
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

  async function handleCreateDirectory(sourceDir: ArboristNode): Promise<void> {
    const dirName = window.prompt("Enter the name of the new directory:");
    if (!dirName || dirName.trim() === "") {
      alert("Directory name cannot be empty");
      return;
    }
    try {
      const path = sourceDir.metadata.path;
      await createDirectory(dirName, path);
      alert(`Directory ${dirName} created successfully`);
      await fetchTree();
    } catch (err) {
      alert(`Error al crear ${dirName}`);
      console.error(`Error al crear ${dirName}:`, err);
    }
  }

  async function handleDelete(nodeToDelete: ArboristNode): Promise<void> {
    if (
      nodeToDelete.restricted ||
      nodeToDelete.metadata.nodetype === "directory"
    )
      return;
    const filename = nodeToDelete.name;
    const file = nodeToDelete.metadata.path;
    if (!window.confirm(`¿Está seguro de que desea eliminar ${filename}?`)) {
      return;
    }
    try {
      await deleteFile(file);
      alert(`Archivo ${filename} eliminado con éxito`);
      selectNode(null);
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
    <div
      style={{ overflow: "visible" }}>
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
          const treeitem = arboristNode.metadata;
          return (
            <div
              style={{
                ...style,
                // fontFamily: "Arial, sans-serif",
                fontSize: "14px",
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
              <span>
                {treeitem.nodetype === "directory"
                  ? "📁"
                  : getIcon(arboristNode)}{" "}
                <span
                  style={{
                    textDecoration: node.data.name.startsWith("XX")
                      ? "line-through"
                      : "none",
                    fontStyle: node.data.name.startsWith("XX")
                      ? "italic"
                      : "normal",
                    fontWeight:
                      node.isSelected && !movingNode ? "bold" : "normal",
                    color:
                      movingNode && treeitem.nodetype !== "directory"
                        ? "#999"
                        : node.data.name.startsWith("XX")
                        ? "gray"
                        : "#000",
                  }}
                >
                  {arboristNode.order ? arboristNode.order * 0.1 + ". " : ""}
                  {arboristNode.nodename
                    ? arboristNode.nodename
                    : arboristNode.name}
                </span>
              </span>
              <span>
                {treeitem.nodetype === "directory" &&
                  node.isSelected &&
                  !movingNode &&
                  arboristNode.ableMkdir && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateDirectory(arboristNode);
                      }}
                    >
                      ➕📁
                    </button>
                  )}
                {
                  // TODO: Replace 01 Logic to detect, using a queue, if 1st chapter or appendix
                  treeitem.nodetype === "file" &&
                    node.isSelected &&
                    !treeitem.name.includes("01") &&
                    (treeitem.path.includes("chapters") ||
                      treeitem.path.includes("appendices")) && (
                      <Tooltip
                        hint={"Subir capítulo"}
                        children={
                          <button
                            onClick={() => {
                              // e.stopPropagation();
                              // alert(`Subir capítulo ${treeitem.name}`);
                              handleReorder("up", arboristNode);
                            }}
                          >
                            🔼
                          </button>
                        }
                      ></Tooltip>
                    )
                }
                {
                  // TODO: Replace 01 Logic to detect, using a queue, if last chapter or appendix
                  treeitem.nodetype === "file" &&
                    node.isSelected &&
                    (treeitem.path.includes("chapters") ||
                      treeitem.path.includes("appendices")) && (
                      <Tooltip
                        hint={"Bajar capítulo"}
                        children={
                          <button
                            onClick={() => {
                              // e.stopPropagation();
                              // alert(`Bajar capítulo ${treeitem.name}`);
                              handleReorder("down", arboristNode);
                            }}
                          >
                            🔽
                          </button>
                        }
                      ></Tooltip>
                    )
                }
                {
                  // TODO: Implement logic
                  treeitem.nodetype === "file" &&
                    node.isSelected &&
                    (treeitem.path.includes("chapters") ||
                      treeitem.path.includes("appendices")) &&
                    !treeitem.name.includes("XX") && (
                      <Tooltip hint={"Comentar capítulo"}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // alert(`Comentar capítulo ${treeitem.name}`);
                          }}
                        >
                          🟥
                        </button>
                      </Tooltip>
                    )
                }
                {
                  // TODO: Implement logic
                  treeitem.nodetype === "file" &&
                    node.isSelected &&
                    (treeitem.path.includes("chapters") ||
                      treeitem.path.includes("appendices")) &&
                    treeitem.name.includes("XX") && (
                      <Tooltip hint={"Des-comentar\ncapítulo"}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // alert(`Des-comentar capítulo ${treeitem.name}`);
                          }}
                        >
                          🟩
                        </button>
                      </Tooltip>
                    )
                }
                {node.isSelected && (
                  <>
                    <Tooltip
                      hint={"Deseleccionar"}
                      children={
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deselectAll(e);
                            setMovingNode(null);
                          }}
                        >
                          ❌
                        </button>
                      }
                    ></Tooltip>
                    <DropDownMenu
                      options={[
                        {
                          operation: "download",
                          label: "Download",
                          icon: "⬇️",
                          onClick: () => handleDownload(arboristNode),
                        },
                        {
                          operation: "rename",
                          label: "Rename",
                          icon: "✏️",
                          disabled:
                            node.isSelected && !isRestricted && !movingNode,
                          onClick: () => handleRename(arboristNode),
                        },
                        {
                          operation: "move",
                          label: "Move",
                          icon: "Ⓜ️",
                          disabled:
                            node.isSelected && !isRestricted && !movingNode,
                          onClick: () => {
                            if (arboristNode.metadata.nodetype === "file") {
                              setMovingNode((prev) => {
                                if (prev?.id !== arboristNode.id) {
                                  return arboristNode;
                                }
                                return prev;
                              });
                            }
                          },
                        },
                        {
                          operation: "delete",
                          label: "Delete",
                          icon: "🗑️",
                          disabled:
                            node.isSelected && !isRestricted && !movingNode,
                          onClick: () => handleDelete(arboristNode),
                        },
                        {
                          operation: "info",
                          label: "Info",
                          icon: "ℹ️",
                          disabled:
                            node.isSelected && treeitem.nodetype === "file",
                          onClick: () => {
                            // Aquí como opcional, me gustaría incluir el número de palabras si es un capítulo o anexo
                            alert(
                              `Info:\n
                                -${arboristNode.name}\n
                                -${arboristNode.metadata.path}\n
                                -${arboristNode.metadata.nodetype}\n
                                -${arboristNode.order}
                              `
                            );
                          },
                        },
                      ]}
                    />
                  </>
                )}
              </span>
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

      <Tooltip
        children={<span>Hover me</span>}
        hint={treeRef.current?.selectedNodes?.[0]?.data.name || "No hay nada"}
      ></Tooltip>
    </div>
  );
}

export default TreeComponent;
