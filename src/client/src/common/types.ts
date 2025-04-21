export interface FileItem {
  name: string;
  selected?: boolean;
  size: number;
  filetype: string;
  path: string;
  nodetype: 'file';
  // TODO: Add more properties as needed, e.g., content** or edition flags
}

export interface DirectoryItem {
  name: string;
  nodetype: 'directory';
  children?: TreeNode[];
};

export type TreeNode = FileItem | DirectoryItem;

export interface ArboristNode {
  id: string;
  name: string;
  children?: ArboristNode[];
  data: TreeNode;
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
  setDocumentData: (data: string) => void;
  // setDocumentData: React.Dispatch<React.SetStateAction<string | null>>;
}