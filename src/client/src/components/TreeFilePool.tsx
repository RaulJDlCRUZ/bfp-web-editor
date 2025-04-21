import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { TreeNode, fileIcons, ArboristNode } from "@/common/types";
import { NodeApi, Tree } from "react-arborist";

// Función para obtener el icono del nodo
function getIcon(node: TreeNode): any {
  if (node.nodetype === "file") {
    return fileIcons[node.filetype] || "📄";
  }
}

// Función recursiva para transformar el árbol de backend a formato Arborist
function transformToArborist(node: TreeNode, basePath = ""): ArboristNode {
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

const FileTree: React.FC = () => {
  const [treeData, setTreeData] = useState<ArboristNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar el árbol usando Promesas
  async function fetchTree(): Promise<void> {
    try {
      const response = await axiosInstance.get<TreeNode>("/tree");
      if (!response) {
        throw new Error("Error al obtener el árbol");
      }
      const transformed = transformToArborist(response.data);
      setTreeData([transformed]);
    } catch (error) {
      console.error("Error al cargar el árbol:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTree();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!treeData.length) return <div>No se pudo cargar el árbol.</div>;

  return (
    <div style={{ height: "600px" }}>
      <Tree
        data={treeData}
        // onMove={(nodes: any, target: any, index: any) => {
        //   console.log("Moved:", nodes, "to:", target, "at:", index);
        //   // axiosInstance.post("/move", { nodes, target, index });
        // }}
        // onMove={
        //   (info: {
        //     dragSource: NodeApi<ArboristNode> | null;
        //     dragTarget: NodeApi<ArboristNode> | null;
        //     index: number;
        //   }) => {
        //     const { dragSource, dragTarget, index } = info;
        //   }
        // }

        onSelect={(nodes: NodeApi<ArboristNode>[]) => {
          nodes.forEach((node) => {
            const file = node.data;
            console.log("Seleccionado:", file);
          });
        }}
        width="100%"
        rowHeight={32}
        padding={8}
        indent={20}
      >
        {({ node, style, dragHandle }) => {
          const arboristNode = node.data as ArboristNode;
          const item = arboristNode.data as TreeNode;
          // Here I'm able to personalize the node, add buttons, context menus, etc. here
          return (
            <div
              style={{
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "1rem",
              }}
              ref={dragHandle}
            >
              <span>
                {item.nodetype === "directory" ? "📁" : getIcon(item)}{" "}
                {arboristNode.name}
              </span>
              <span>
                <button
                  onClick={() => alert(`Renombrar: ${arboristNode.name}`)}
                >
                  ✏️
                </button>
                <button onClick={() => alert(`Eliminar: ${arboristNode.name}`)}>
                  🗑️
                </button>
                {/* Puedes reemplazar esto por un menú contextual */}
              </span>
            </div>
          );
        }}
      </Tree>
    </div>
  );
};

export default FileTree;
