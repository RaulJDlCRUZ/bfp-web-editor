import {
  editableFiles,
  restrictedFiles,
  restrictedDirectories,
  allowNewDirectories,
  hideCSL,
  hideDirectories,
} from "@/common/constants";

import { TreeNode, ArboristNode, FileItem } from "@/common/types";

function getType(nodePath: string): "chapter" | "appendix" | "setup" | "other" {
  if (nodePath.includes("appendices")) return "appendix";
  if (nodePath.includes("chapters")) return "chapter";
  return "other";
}

function extractOrder(filename: string): number {
  const slice: string = filename.slice(0, 2);
  if (slice === "XX") return 0;
  const order: number = parseInt(slice, 10);
  if (isNaN(order)) return 0;
  return order;
}

function isRestricted(fid: string, node: TreeNode): boolean {
  // Check if the node is a file and if it is restricted
  if (node.nodetype === "file") {
    return !!restrictedFiles[node.path] || !!restrictedFiles[fid];
  }
  // Same for directories
  if (node.nodetype === "directory") {
    return !!restrictedDirectories[fid];
  }
  return false;
}

function isEditable(nodePath: string): boolean {
  // return !!editableFiles[node.path] || !!editableFiles[fid];
  // return node.path in editableFiles || fid in editableFiles;
  // return !!editableFiles[nodePath];
  return nodePath in editableFiles;
}

function isAbleToCreateDirectory(fid: string, node: TreeNode): boolean {
  // Check if the node is a directory and if it is allowed to create a new directory
  if (node.nodetype !== "directory") return false;
  return !!allowNewDirectories[fid];
}

// Función recursiva para transformar el árbol de backend a formato Arborist
export function transformToArborist(
  node: TreeNode,
  basePath = ""
): ArboristNode {
  const id = `${basePath}/${node.name}`;
  if (node.nodetype === "directory") {
    return {
      id,
      name: node.name,
      nodename: node.name,
      nodetype: "directory",
      order: null,
      restricted: isRestricted(id, node),
      ableMkdir: isAbleToCreateDirectory(id, node),
      edit: false,
      children:
        node.children?.map((child) => transformToArborist(child, id)) ?? [],
      metadata: node,
    };
  }
  // It's a file, so we need to check first if it's a setup file
  const nodePath = node.path;
  const editable = isEditable(nodePath);
  return {
    id,
    name: node.name,
    nodename: node.name,
    nodetype: editable ? "setup" : getType(nodePath),
    order: extractOrder(node.name),
    restricted: isRestricted(id, node),
    edit: editable,
    metadata: node,
  };
}
