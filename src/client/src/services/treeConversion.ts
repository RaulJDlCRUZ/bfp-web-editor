import {
  TreeNode,
  ArboristNode,
  restrictedFiles,
  restrictedDirectories,
} from "@/common/types";

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
      children:
        node.children?.map((child) => transformToArborist(child, id)) ?? [],
      data: node,
    };
  }
  return {
    id,
    name: node.name,
    restricted: isRestricted(id, node),
    data: node,
  };
}
