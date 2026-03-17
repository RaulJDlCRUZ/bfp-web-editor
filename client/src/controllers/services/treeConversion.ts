import { editableFiles } from "@/shared/constants/editableFiles";
import { restrictedFiles } from "@/shared/constants/restrictedFiles";
import { restrictedDirectories } from "@/shared/constants/restrictedDirectories";
import { allowNewDirectories } from "@/shared/constants/allowNewDirectories";
import { prettySetupFiles } from "@/shared/constants/prettySetupFiles";
import { nodeOrder } from "@/shared/constants/nodeOrder";

import { TreeNode, ArboristNode } from "@/shared/types/types";

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

// Función para simplificar el árbol de ArboristNode para la interfaz
export function SimplifyTree(base: ArboristNode): ArboristNode[] {
  const client_tree: ArboristNode[] = [];
  const ch: ArboristNode[] = base.children ?? [];
  if (ch.length === 0) return [base];

  /* PASO 1: ARCHIVOS DE SETUP VAN PRIMERO EN LA MEMORIA */
  let setup_nodes: ArboristNode[] = ch.filter((n) => n.nodetype === "setup");
  if (setup_nodes) {
    for (const setup_node of setup_nodes) {
      const key = setup_node.name.toLowerCase().split(".")[0];
      if (key in nodeOrder) {
        setup_node.hierarchy = nodeOrder[key];
      }
    }
  }

  // Ordenamos los nodos setup por su atributo hierarchy de menor a mayor
  setup_nodes.sort((a, b) => (a.hierarchy ?? 1000) - (b.hierarchy ?? 1000));

  // Añadimos los nodos setup al árbol simplificado
  client_tree.push(...setup_nodes);

  /* PASO 2: CAPÍTULOS Y ANEXOS */
  let chapter_nodes: ArboristNode[] = ch.filter(
    (n) => n.nodetype === "directory" && n.nodename === "chapters"
  );

  chapter_nodes[0].hierarchy = nodeOrder["chapters"];
  chapter_nodes[0].nodename = "Chapters";

  let appendix_nodes: ArboristNode[] = ch.filter(
    (n) => n.nodetype === "directory" && n.nodename === "appendices"
  );

  appendix_nodes[0].hierarchy = nodeOrder["appendices"];
  appendix_nodes[0].nodename = "Appendices";

  client_tree.push(...chapter_nodes, ...appendix_nodes);

  let resources_n: ArboristNode[] =
    ch.filter((n) => n.name.toLowerCase() === "resources")[0].children ?? [];

  /* PASO 3: BIBLIOGRAFÍA COMO NODO ÚNICO */
  let bib_node: ArboristNode | undefined = resources_n.find(
    (n) =>
      n.nodetype === "directory" &&
      n.name.toLowerCase().includes("bibliography")
  );
  if (bib_node && bib_node.children) {
    const bib_file_node: ArboristNode = bib_node.children[0];
    bib_file_node.hierarchy = nodeOrder["bibliography"];
    client_tree.push(bib_file_node);
  }

  /* PASO 4: RECURSOS ADICIONALES E.G IMAGES */
  let images: ArboristNode | undefined = resources_n.find(
    (n) => n.nodetype === "directory" && n.name.toLowerCase().includes("images")
  );
  if (images) {
    images.hierarchy = nodeOrder["images"] ?? 1000; // Asignamos un valor por defecto si no está definido
    images.nodename = "Images & Other Resources";
    client_tree.push(images);
  }

  return client_tree;
}

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
      hierarchy: -1,
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
    hierarchy: -1,
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
