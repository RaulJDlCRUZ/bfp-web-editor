import React, { useEffect, useRef, useState, JSX } from "react";
import { NodeApi, Tree, TreeApi } from "react-arborist";
import { ArboristNode } from "@/common/types";
import { fileIcons } from "@/common/constants";
import { useFileExplorerContext } from "@/hooks/FileExplorerHook";
import { SimplifyTree, transformToArborist } from "@/services/treeConversion";
import {
  createFile,
  createFile2,
  downloadFile,
  deleteFile,
  deleteDirectory,
  createDirectory,
  renameFile,
  fetchFileListing,
  moveFile,
  uploadFile,
  renameChapterOrAppendix,
} from "@/services/fileOperations";
import { getConfigNode } from "@/services/configOperations";
import DropDownMenu from "../DropDown/NodeDropDown";
import Tooltip from "../Tooltips/Tooltipv2";
import styles from "./TreeFilePool.module.css";

function TreeComponent(): JSX.Element {
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const [movingNode, setMovingNode] = useState<ArboristNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const treeRef = useRef<TreeApi<ArboristNode>>(null);
  const { selectNode } = useFileExplorerContext();

  function getNodeCount(tree: ArboristNode[]): number {
    let count = 0;
    for (const node of tree) {
      if (node.children) {
        count += getNodeCount(node.children);
      }
      count += 1; // Contar el nodo actual
    }
    return count;
  }

  async function fetchTree(): Promise<void> {
    try {
      const data = await fetchFileListing();
      const transformed = SimplifyTree(transformToArborist(data));
      setTreeData(transformed);
      const node_c = getNodeCount(transformed);
      setNodeCount(node_c);
      console.log(node_c);
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
      console.log("Nodo de árbol sel.:", inputNode);
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
        await renameFile(
          node.metadata.path,
          prevSlice + node.name.slice(2),
          null
        );
        await renameFile(
          prevNode.metadata.path,
          newSlice + prevNode.name.slice(2),
          null
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
        await renameFile(
          node.metadata.path,
          newSlice + node.name.slice(2),
          null
        );
        await renameFile(
          nextNode.metadata.path,
          prevSlice + nextNode.name.slice(2),
          null
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

  async function handleRenamePrompt(nodeToRename: ArboristNode): Promise<void> {
    if (nodeToRename.restricted) return;
    const newName = window.prompt(
      `Renombrar ${nodeToRename.name} a:`,
      nodeToRename.name
    );

    if (!newName || newName.trim() === "" || newName === nodeToRename.name) {
      return;
    }

    await handleRename(nodeToRename, newName);
  }

  async function handleRenameChapOrAppxPrompt(
    nodeToRename: ArboristNode
  ): Promise<void> {
    if (nodeToRename.restricted) return;
    const newName = window.prompt(
      `Renombrar [${nodeToRename.nodetype}] ${nodeToRename.name} a:`,
      nodeToRename.nodename
    );

    if (!newName || newName.trim() === "" || newName === nodeToRename.name) {
      return;
    }

    await RenameChapOrAppx(nodeToRename, newName);
    selectNode(null);
    await fetchTree();
  }

  async function handleRename(
    nodeToRename: ArboristNode,
    newName: string
  ): Promise<void> {
    if (nodeToRename.restricted) return;

    try {
      const file: string = nodeToRename.metadata.path;
      await renameFile(file, newName, null);
      alert(`Archivo ${nodeToRename.name} renombrado a ${newName}`);
      selectNode(null);
      await fetchTree();
    } catch (err) {
      alert(`Error al renombrar ${nodeToRename.name}`);
      console.error(`Error al renombrar ${nodeToRename.name}:`, err);
    }
  }

  async function RenameChapOrAppx(
    nodeToRename: ArboristNode,
    newTitle: string
  ): Promise<void> {
    if (nodeToRename.restricted) return;

    try {
      const file: string = nodeToRename.metadata.path;
      await renameChapterOrAppendix(file, newTitle);
      alert(`Capítulo/Apéndice ${nodeToRename.name} renombrado a ${newTitle}`);
      selectNode(null);
      await fetchTree();
    } catch (err) {
      alert(`Error al renombrar ${nodeToRename.name}`);
      console.error(`Error al renombrar ${nodeToRename.name}:`, err);
    }
  }

  async function handleComment(nodeToComm: ArboristNode): Promise<void> {
    if (nodeToComm.restricted) return;

    try {
      const file: string = nodeToComm.metadata.path;
      await renameFile(file, nodeToComm.name, "comment");
      await fetchTree();
      selectNode(null);
    } catch (error) {
      alert(`Error al comentar ${nodeToComm.name}`);
      console.error(`Error al comentar ${nodeToComm.name}:`, error);
    }
  }

  async function handleUnComment(nodeToUnComm: ArboristNode): Promise<void> {
    if (nodeToUnComm.restricted) return;

    try {
      const file: string = nodeToUnComm.metadata.path;
      await renameFile(file, nodeToUnComm.name, "uncomment");
      selectNode(null);
      await fetchTree();
    } catch (error) {
      alert(`Error al des-comentar ${nodeToUnComm.name}`);
      console.error(`Error al des-comentar ${nodeToUnComm.name}:`, error);
    }
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

  function handleUploadTrigger(): void {
    fileInputRef.current?.click();
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

  async function handleCreateFile2(new_element: string): Promise<void> {
    const filename = window.prompt(`Enter the name of the new ${new_element}:`);
    if (!filename || filename.trim() === "") {
      alert("File name cannot be empty");
      return;
    }

    try {
      const result = await createFile2(filename, new_element);
      console.log(result);
      alert(`Archivo ${filename} creado con éxito`);
      await fetchTree();
    } catch (err) {
      alert(`Error al crear ${filename}`);
      console.error(`Error al crear ${filename}:`, err);
    }
  }

  async function handleCreateFile(new_element: string): Promise<void> {
    const filename = window.prompt("Enter the name of the new file:");
    if (!filename || filename.trim() === "") {
      alert("File name cannot be empty");
      return;
    }
    try {
      // TODO: when adding file, consider matching folder
      const result = await createFile(filename, new_element);
      console.log(result);
      alert(`Archivo ${filename} creado con éxito`);
      await fetchTree();
    } catch (err) {
      alert(`Error al crear ${filename}`);
      console.error(`Error al crear ${filename}:`, err);
    }
  }

  async function handleDeleteDirectory(
    nodeToDelete: ArboristNode
  ): Promise<void> {
    if (nodeToDelete.restricted) return;
    const dirname = nodeToDelete.name;
    const dir = nodeToDelete.metadata.path;
    if (
      !window.confirm(
        `¿Está seguro de que desea eliminar ${dirname} y su contenido?`
      )
    ) {
      return;
    }
    try {
      await deleteDirectory(dir);
      alert(`Directorio ${dirname} eliminado con éxito`);
      selectNode(null);
      await fetchTree();
    } catch (err) {
      alert(`Error al eliminar ${dirname}`);
    }
  }

  async function handleDeleteFile(nodeToDelete: ArboristNode): Promise<void> {
    if (nodeToDelete.restricted) return;
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

  async function handleDelete(nodeToDelete: ArboristNode): Promise<void> {
    if (nodeToDelete.metadata.nodetype === "directory") {
      await handleDeleteDirectory(nodeToDelete);
    } else {
      await handleDeleteFile(nodeToDelete);
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
    <div className={styles.treeContainer}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className={styles.fileInput}
      />
      <div className={styles.toolBarContainer}>
        <Tooltip content="Revisar configuración del TFG" position="bottom">
          <button
            className={`${styles.buttoolBarButtonton} ${
              movingNode
                ? styles.toolBarButtonNotAllowed
                : styles.toolBarButtonPointer
            }`}
            disabled={!!movingNode}
            onClick={async () => {
              const cfg = transformToArborist(await getConfigNode());
              selectNode(cfg);
            }}
          >
            <b>Config ⚙️</b>
          </button>
        </Tooltip>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Tree
          ref={treeRef}
          data={treeData}
          width="100%"
          rowHeight={20}
          height={Math.min(nodeCount * 20, 400)} // Limita la altura máxima a 400px
          padding={0}
          indent={20}
          disableMultiSelection={false}
          onSelect={handleSelect}
        >
          {({ node, style, dragHandle }) => {
            const arboristNode = node.data as ArboristNode;
            const isSelected = node.isSelected;
            const isRestricted = arboristNode.restricted;
            const isEditable = arboristNode.edit;
            const treeitem = arboristNode.metadata;
            const isFile = treeitem.nodetype === "file";
            const isDirectory = treeitem.nodetype === "directory";
            const isChapterOrAppendix =
              treeitem.path.includes("chapters") ||
              treeitem.path.includes("appendices");
            const isCommented = treeitem.name.includes("XX");
            const isFirstChapter = treeitem.name.includes("01");

            return (
              <div
                style={{ ...style }} // Mantiene el estilo definido arriba
                ref={dragHandle}
                className={`${styles.treeNode} ${
                  movingNode
                    ? isDirectory
                      ? styles.treeNodeMovingToDirectory
                      : styles.treeNodeDefBackground
                    : isSelected
                    ? isRestricted && !isEditable
                      ? styles.treeNodeRestricted
                      : styles.treeNodeSelected
                    : styles.treeNodeDefBackground
                } ${
                  movingNode && !isDirectory
                    ? styles.treeNodeButtonNotAllowed
                    : styles.treeNodeButtonPointer
                } `}
              >
                {/* Contenido principal del nodo - lado izquierdo */}
                <div className={styles.treeItemContent}>
                  <span className={styles.treeItemIcon}>
                    {isDirectory ? "📁" : getIcon(arboristNode)}
                  </span>
                  <span
                    className={`${styles.treeItemText} ${
                      isCommented
                        ? styles.treeItemTextDecorationCommented
                        : styles.treeItemTextDecStandard
                    }
                    ${
                      isCommented
                        ? styles.treeItemFontCommented
                        : styles.treeItemFontStandard
                    } ${
                      isSelected && !movingNode
                        ? styles.treeItemFontWeightSelected
                        : styles.treeItemFontWeightNS
                    } ${
                      movingNode && !isDirectory
                        ? styles.treeItemFontColorMoving
                        : isCommented
                        ? styles.treeItemFontColorCommented
                        : isSelected
                        ? styles.treeItemFontColorSelected
                        : styles.treeItemFontColorStandard
                    }
                    
                    `}
                  >
                    {arboristNode.order
                      ? (arboristNode.nodetype === "appendix"
                          ? String.fromCharCode(64 + arboristNode.order * 0.1) // Obtengo la letra correspondiente
                          : arboristNode.order * 0.1) + ". "
                      : ""}
                    {arboristNode.nodename
                      ? arboristNode.nodename
                      : arboristNode.name}
                  </span>
                </div>

                {/* Contenedor de botones - lado derecho */}
                <div className={styles.treeItemButtonContainer}>
                  {/* Botón crear archivo */}
                  {isDirectory &&
                    isSelected &&
                    !movingNode &&
                    isChapterOrAppendix && (
                      <button
                        className={styles.treeItemIconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (arboristNode.name.includes("chapters")) {
                            handleCreateFile2("chapters");
                          } else {
                            handleCreateFile2("appendices");
                          }
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
                          className={styles.treeItemIconButton}
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
                        className={styles.treeItemIconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReorder("down", arboristNode);
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
                          className={styles.treeItemIconButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            // alert(`Comentar capítulo ${treeitem.name}`);
                            // handleRename(arboristNode, arboristNode.name.replace(/^\d{2}/, "XX"));
                            handleComment(arboristNode);
                          }}
                        >
                          🟥
                        </button>
                      </Tooltip>
                    )}

                  {/* Botón des-comentar capítulo */}
                  {isFile &&
                    isSelected &&
                    isChapterOrAppendix &&
                    isCommented && (
                      <Tooltip content="Des-comentar\ncapítulo">
                        <button
                          className={styles.treeItemIconButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: crear funciones intermedias para que se asigne el último número de capítulo EN BACKEND
                            // alert(`Des-comentar capítulo ${treeitem.name}`);
                            handleUnComment(arboristNode);
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
                        className={styles.treeItemIconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          deselectAll(e);
                          setMovingNode(null);
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
                          operation: "upload",
                          label: "Upload",
                          icon: "⏏️",
                          disabled:
                            isSelected &&
                            isDirectory &&
                            !movingNode &&
                            !isChapterOrAppendix,
                          onClick: handleUploadTrigger,
                        },
                        {
                          operation: "createDir",
                          label: "Create Directory",
                          icon: "📂",
                          disabled:
                            isDirectory &&
                            isSelected &&
                            !movingNode &&
                            arboristNode.ableMkdir &&
                            !isChapterOrAppendix,
                          onClick: () => handleCreateDirectory(arboristNode),
                        },
                        {
                          operation: "download",
                          label: "Download",
                          icon: "⬇️",
                          disabled:
                            isSelected && (isChapterOrAppendix || !isDirectory),
                          onClick: () => handleDownload(arboristNode),
                        },
                        {
                          operation: "rename",
                          label: "Rename",
                          icon: "✏️",
                          disabled: isSelected && !isRestricted && !movingNode,
                          onClick: () =>
                            isChapterOrAppendix
                              ? handleRenameChapOrAppxPrompt(arboristNode)
                              : handleRenamePrompt(arboristNode),
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
    </div>
  );
}
export default TreeComponent;
