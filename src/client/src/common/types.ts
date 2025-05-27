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

// export interface tfgiiNode {
//   id: string;
//   name: string; // Not filename/dirname. This is the name of the node
//   nodetype: "chapter" | "appendix" | "setup" | "other";
//   filetype: "file" | "directory";
//   order: number | null;
//   metadata: ArboristNode;
// }

// This interface is used to define the structure of the response from the server when compiling the document
export interface CompileButtonProps {
  setDocumentData: (data: string | null) => void;
}

export interface DropDownOption {
  operation: "download" | "delete" | "rename" | "move" | "info";
  label: string;
  icon: any;
  onClick: () => void;
  disabled?: boolean;
}

export interface DropDownMenuProps {
  options: DropDownOption[];
}
