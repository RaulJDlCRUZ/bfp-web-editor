export interface FileItem {
  name: string;
  selected?: boolean;
  size: number;
  filetype: string;
  path: string;
  nodetype: 'file';
}

export interface DirectoryItem {
  name: string;
  path: string;
  nodetype: 'directory';
  children?: TreeNode[];
};

export type TreeNode = FileItem | DirectoryItem;

export interface ArboristNode {
  id: string;
  name: string;
  restricted?: boolean;
  edit?: boolean;
  children?: ArboristNode[];
  data: TreeNode;
}

export interface tfgiiNode {
  id: string;
  name: string;
  type: 'chapter' | 'appendix' | 'file';
  route: string;
  order: number;
  ignored?: boolean;
  edit?: boolean;
  children?: tfgiiNode[];
}

// This dictionary maps file extensions to their corresponding icons
export const fileIcons: { [extension: string]: string } = {
  pdf: '📄',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  txt: '📃',
  md: '📃',
  zip: '🗜️',
  rar: '🗜️',
  bib: '📚',
  json: '🗃️',
};

// This interface is used to define the structure of the response from the server when compiling the document
export interface CompileButtonProps {
  setDocumentData: (data: string | null) => void;
}