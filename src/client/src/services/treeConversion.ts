import {
  editableFiles,
  restrictedFiles,
  restrictedDirectories,
  allowNewDirectories,
  prettySetupFiles,
  // hideCSL,
  // hideDirectories,
} from "@/common/constants";

import { TreeNode, ArboristNode } from "@/common/types";

function getType(nodePath: string): "chapter" | "appendix" | "setup" | "other" {
  // Nos aseguramos que el número de ocurrencias de "/" sea 2, para evitar que se cuelen archivos de subcarpetas (length es 3 si hay 2 "/")
  const slashCount = nodePath.split("/").length - 1;

  if (
    nodePath.includes("appendices") &&
    slashCount === 2 &&
    nodePath.endsWith(".md")
  )
    return "appendix";
  if (
    nodePath.includes("chapters") &&
    slashCount === 2 &&
    nodePath.endsWith(".md")
  )
    return "chapter";
  return "other";
}

function isRestricted(type: string, nodePath: string): boolean {
  // Check if the node is a file and if it is restricted
  if (type === "file") {
    return !!restrictedFiles[nodePath];
  }
  // Same for directories
  if (type === "directory") {
    return !!restrictedDirectories[nodePath];
  }
  return false;
}

function isEditable(nodePath: string): boolean {
  return nodePath in editableFiles;
}

function isAbleToCreateDirectory(type: string, nodePath: string): boolean {
  // Check if the node is a directory and if it is allowed to create a new directory
  if (type !== "directory") return false;
  return (
    nodePath in allowNewDirectories || !(nodePath in restrictedDirectories)
  );
}

// otra func, sobre transformToArborist <--- SEA LA QUE SE VEA EN EL CLIENTE


// Función recursiva para transformar el árbol de backend a formato Arborist
export function transformToArborist(
  node: TreeNode | any, // Me permite usar TreeNode y, si procede, campos adicionales
  basePath: string = ""
): ArboristNode {
  const id = `${basePath}/${node.name}`;
  const nodePath = node.path;
  const nodeType = node.nodetype;
  if (nodeType === "directory") {
    return {
      id,
      name: node.name,
      nodename: node.name,
      nodetype: "directory",
      order: null,
      restricted: isRestricted(nodeType, nodePath),
      ableMkdir: isAbleToCreateDirectory(nodeType, nodePath),
      edit: false,
      children:
        node.children?.map((child: TreeNode | any) =>
          transformToArborist(child, id)
        ) ?? [],
      metadata: node,
    };
  }
  // It's a file, so we need to check first if it's a setup file
  const editable = isEditable(nodePath);
  const nodetype = editable ? "setup" : getType(nodePath);
  return {
    id,
    name: node.name,
    nodename: nodetype.includes("setup")
      ? prettySetupFiles[nodePath]
      : node.friendlyname,
    nodetype: nodetype,
    order: node.order ?? null,
    restricted: isRestricted(nodeType, nodePath),
    edit: editable,
    metadata: node,
  };
}
