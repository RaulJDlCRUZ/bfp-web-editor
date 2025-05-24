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
  uploadFile,
} from "@/services/fileOperations";
import DropDownMenu from "./DropDown";
import Tooltip from "./Tooltips/Tooltipv2";

function TreeComponent(): JSX.Element {
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const [movingNode, setMovingNode] = useState<ArboristNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const treeRef = useRef<TreeApi<ArboristNode>>(null);
  const { selectNode } = useFileExplorerContext();

  function getNodeCount(firstnode: ArboristNode): number {
    let count = 0;
    if (firstnode.children) {
      for (const child of firstnode.children) {
        count += getNodeCount(child);
      }
    }
    return count + 1; // Contar el nodo actual
  }

  async function fetchTree(): Promise<void> {
    try {
      const data = await fetchFiles();
      const transformed = transformToArborist(data);
      setTreeData([transformed]);
      setNodeCount(getNodeCount(transformed));
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

  function handleUploadTrigger(): void {
    fileInputRef.current?.click();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
      alert(`Archivo ${file.name} subido con éxito`);
      await fetchTree();
    } catch (err) {
      alert(`Error al subir ${file.name}`);
      console.error(`Error al subir ${file.name}:`, err);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    const filename = window.prompt("Enter the name of the new file:");
    if (!filename || filename.trim() === "") {
      alert("File name cannot be empty");
      return;
    }
    try {
      // TODO: when adding file, consider matching folder
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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <Tooltip
        content="Agrega un fichero de tu equipo a la plantilla"
        position="bottom"
      >
        <button
          onClick={handleUploadTrigger}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            padding: "0px",
          }}
        >
          <b>Subir fichero ⏏️</b>
        </button>
      </Tooltip>
      <Tree
        ref={treeRef}
        data={treeData}
        width="100%"
        rowHeight={20}
        height={Math.min(nodeCount * 20, 400)}
        padding={0}
        indent={20}
        disableMultiSelection={false}
        onSelect={handleSelect}
      >
        {({ node, style, dragHandle }) => {
          const arboristNode = node.data as ArboristNode;
          const isRestricted = arboristNode.restricted;
          const isEditable = arboristNode.edit;
          const treeitem = arboristNode.metadata;
          const isSelected = node.isSelected;
          const isFile = treeitem.nodetype === "file";
          const isDirectory = treeitem.nodetype === "directory";
          const isChapterOrAppendix =
            treeitem.path.includes("chapters") ||
            treeitem.path.includes("appendices");
          const isCommented = treeitem.name.includes("XX");
          const isFirstChapter = treeitem.name.includes("01");

          return (
            <div
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                paddingRight: "0.5rem",
                margin: 0,
                position: "relative",
                borderRadius: "1px",
                userSelect: "none",
                fontSize: "14px",
                backgroundColor: movingNode
                  ? isDirectory
                    ? "#d0e7ff"
                    : "white"
                  : isSelected
                  ? isRestricted && !isEditable
                    ? "#ededed"
                    : "#edffe8"
                  : "white",
                cursor: movingNode && !isDirectory ? "not-allowed" : "pointer",
              }}
              ref={dragHandle}
            >
              {/* Contenido principal del nodo - lado izquierdo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0, // Permite que el texto se trunque si es necesario
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>
                  {isDirectory ? "📁" : getIcon(arboristNode)}
                </span>
                <span
                  style={{
                    textDecoration: isCommented ? "line-through" : "none",
                    fontStyle: isCommented ? "italic" : "normal",
                    fontWeight: isSelected && !movingNode ? "bold" : "normal",
                    color:
                      movingNode && !isDirectory
                        ? "#999"
                        : isCommented
                        ? "gray"
                        : "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {arboristNode.order ? arboristNode.order * 0.1 + ". " : ""}
                  {arboristNode.nodename
                    ? arboristNode.nodename
                    : arboristNode.name}
                </span>
              </div>

              {/* Contenedor de botones - lado derecho */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  flexShrink: 0, // Evita que los botones se compriman
                  marginLeft: "auto", // Empuja los botones hacia la derecha
                }}
              >
                {/* Botón crear directorio */}
                {isDirectory &&
                  isSelected &&
                  !movingNode &&
                  arboristNode.ableMkdir && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateDirectory(arboristNode);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                    >
                      ➕📁
                    </button>
                  )}
                {/* Botón crear archivo */}
                {isDirectory &&
                  isSelected &&
                  !movingNode &&
                  isChapterOrAppendix && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreate();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                    >
                      ➕📄
                    </button>
                  )}
                {/* Botón subir capítulo */}
                {isFile &&
                  isSelected &&
                  !isFirstChapter &&
                  isChapterOrAppendix && (
                    <Tooltip content="Subir capítulo" position="top">
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "2px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder("up", arboristNode);
                        }}
                      >
                        🔼
                      </button>
                    </Tooltip>
                  )}

                {/* Botón bajar capítulo */}
                {isFile && isSelected && isChapterOrAppendix && (
                  <Tooltip content="Bajar capítulo">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder("down", arboristNode);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                    >
                      🔽
                    </button>
                  </Tooltip>
                )}

                {/* Botón comentar capítulo */}
                {isFile &&
                  isSelected &&
                  isChapterOrAppendix &&
                  !isCommented && (
                    <Tooltip content="Comentar capítulo">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // alert(`Comentar capítulo ${treeitem.name}`);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "2px",
                        }}
                      >
                        🟥
                      </button>
                    </Tooltip>
                  )}

                {/* Botón des-comentar capítulo */}
                {isFile && isSelected && isChapterOrAppendix && isCommented && (
                  <Tooltip content="Des-comentar\ncapítulo">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // alert(`Des-comentar capítulo ${treeitem.name}`);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                    >
                      🟩
                    </button>
                  </Tooltip>
                )}

                {/* Botón deseleccionar */}
                {isSelected && (
                  <Tooltip content="Deseleccionar">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deselectAll(e);
                        setMovingNode(null);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        padding: "2px",
                      }}
                    >
                      ❌
                    </button>
                  </Tooltip>
                )}

                {/* Dropdown menu */}
                {isSelected && (
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
                        disabled: isSelected && !isRestricted && !movingNode,
                        onClick: () => handleRename(arboristNode),
                      },
                      {
                        operation: "move",
                        label: "Move",
                        icon: "Ⓜ️",
                        disabled: isSelected && !isRestricted && !movingNode,
                        onClick: () => {
                          if (isFile) {
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
                        disabled: isSelected && !isRestricted && !movingNode,
                        onClick: () => handleDelete(arboristNode),
                      },
                      {
                        operation: "info",
                        label: "Info",
                        icon: "ℹ️",
                        disabled: isSelected && isFile,
                        onClick: () => {
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
                )}
              </div>
            </div>
          );
        }}
      </Tree>
    </div>
  );
}
export default TreeComponent;
