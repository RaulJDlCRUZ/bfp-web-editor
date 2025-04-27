import { TreeNode, ArboristNode } from "@/common/types";

// Función recursiva para transformar el árbol de backend a formato Arborist
export function transformToArborist(node: TreeNode, basePath = ""): ArboristNode {
  const id = `${basePath}/${node.name}`;
  if (node.nodetype === "directory") {
    return {
      id,
      name: node.name,
      children:
        node.children?.map((child) => transformToArborist(child, id)) ?? [],
      data: node,
    };
  }
  return {
    id,
    name: node.name,
    data: node,
  };
}