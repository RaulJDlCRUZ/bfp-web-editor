/*

// WIP. Commented to avoid breaking the build

import {
  editableFiles,
  restrictedFiles,
  restrictedDirectories,
  hideCSL,
  hideDirectories,
} from "@/common/constants";
import { TreeNode, tfgiiNode, FileItem } from "@/common/types";

function getType(nodePath: string): "chapter" | "appendix" | "file" {
  if (nodePath.includes("appendices")) {
    return "appendix";
  } else if (nodePath.includes("chapters")) {
    return "chapter";
  } else {
    return "file";
  }
}

function extractOrder(filename: string): number {
  const slice: string = filename.slice(0, 2);
  if (slice === "XX") return 0;
  const order: number = parseInt(slice, 10);
  if (isNaN(order)) return 0;
  return order;
}


export function transformNewNode(
  node: TreeNode,
  basePath = ""
): tfgiiNode | null {
  const nodetype = getType(node.path);
  if (node.nodetype === "directory") {
    const nodeid = nodetype.slice(0, 2).toUpperCase() + node.name;
    if (hideDirectories[node.path]) {
      return {
        // Flatten children into the current level
        ...node,
        id: nodeid,
        type: node.nodetype,
        filetype: nodetype,
        route: basePath + node.path,
        order: null,
        ignored: true,
        edit: false,
        children: node.children
        ? node.children
        .map((child) => transformNewNode(child, basePath))
        .filter((child): child is tfgiiNode => child !== null)
        : [],
      };
    } else {
      return {
    ...node,
    id: nodeid,
    type: node.nodetype,
    filetype: nodetype,
    route: basePath + node.path,
    order: null,
    ignored: false,
    edit: false,
    children: node.children
    ? node.children
    .map((child) => transformNewNode(child, basePath))
    .filter((child): child is tfgiiNode => child !== null)
    : [],
      };
    }
  }
  
  if (node.nodetype === "file") {
    if (hideCSL[node.path]) {
      return null; // Skip this node
    }
  }
}

*/