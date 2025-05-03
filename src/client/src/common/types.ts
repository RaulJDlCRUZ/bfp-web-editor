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
  restricted?: boolean;
  edit?: boolean;
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

// This dictionary restricts the files tha cannot be selected to move, rename, erase...
// According to: https://www.felixalbertos.com/resources/downloads/tfg_template.html
export const restrictedFiles: { [extension: string]: boolean } = {
"config.yaml": true,
"/input/resources/bibliography/bibliography.bib": true,
"/input/resources/csl/acm-sig-proceedings.csl": true,
"/input/resources/csl/iso690-author-date-cs.csl": true,
"/input/resources/csl/iso690-numeric-en.csl": true,
"/input/abstract.md": true,
"/input/acknowledgements.md": true,
"/input/acronyms.md": true,
"/input/authorship.md": true,
"/input/dedication.md": true,
"/input/resumen.md": true,
};

export const restrictedDirectories: { [directory: string]: boolean } = {
"/input": true,
"/input/appendices": true,
"/input/chapters": true,
"/input/resources": true,
"/input/resources/csl": true,
"/input/resources/bibliography": true,
"/input/resources/images": true, // Not their content
};

// This dictionary specifies which files are restricted but can be edited
// According to: https://www.felixalbertos.com/resources/downloads/tfg_template.html
export const editableFiles: { [extension: string]: boolean } = {
  "config.yaml": true,
  "/input/resources/bibliography/bibliography.bib": true,
  "/input/abstract.md": true,
  "/input/acknowledgements.md": true,
  "/input/acronyms.md": true,
  "/input/authorship.md": true,
  "/input/dedication.md": true,
  "/input/resumen.md": true,
  };

// This interface is used to define the structure of the response from the server when compiling the document
export interface CompileButtonProps {
  setDocumentData: (data: string) => void;
  // setDocumentData: React.Dispatch<React.SetStateAction<string | null>>;
}