import {
  editableFiles,
  restrictedFiles,
  restrictedDirectories,
  allowNewDirectories,
} from "@/common/constants";
import { TreeNode, ArboristNode, FileItem } from "@/common/types";

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

function isEditable(fid: string, node: FileItem): boolean {
  return !!editableFiles[node.path] || !!editableFiles[fid];
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
      restricted: isRestricted(id, node),
      ableMkdir: isAbleToCreateDirectory(id, node),
      edit: false,
      children:
        node.children?.map((child) => transformToArborist(child, id)) ?? [],
      data: node,
    };
  }
  return {
    id,
    name: node.name,
    restricted: isRestricted(id, node),
    edit: isEditable(id, node as FileItem),
    data: node,
  };
}
