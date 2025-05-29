export interface FileItem {
  name: string;
  path: string;
  nodetype: "file";
  filetype: string;
  selected?: boolean;
  size: number;
}

export interface DirectoryItem {
  name: string;
  path: string;
  nodetype: "directory";
  children?: TreeNode[];
}

export type TreeNode = FileItem | DirectoryItem;

export interface ArboristNode {
  id: string;
  hierarchy: number;
  name: string;
  nodename: string; // Not filename/dirname. This is the name of the node
  nodetype: "chapter" | "appendix" | "setup" | "other" | "directory";
  order: number | null;  
  restricted?: boolean;
  ableMkdir?: boolean;
  edit?: boolean;
  children?: ArboristNode[];
  metadata: TreeNode;
}