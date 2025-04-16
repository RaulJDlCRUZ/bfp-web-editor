// Define types of files and possible operations
export interface File {
  name: string;
  selected?: boolean;
}

export interface FileItem {
  name: string;
  size: number;
  type: string;
  // TODO: Add more properties as needed, e.g., content** or edition flags
}

export interface FileListProps {
  files: { name: string; selected?: boolean }[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  onSelect: (filename: string, selected: boolean) => void;
}

export interface FileOperation {
  operation: "delete" | "update" | "add";
  file: string;
  error?: string;
}

export interface UpdateOperations {
  deletions: string[];
  updates: { filename: string; content: string }[];
  additions: { filename: string; content: string }[];
}

export interface ApiResponse {
  success: boolean;
  operations?: {
    total: number;
    successful: number;
    failed: number;
  };
  details?: {
    success: FileOperation[];
    errors: FileOperation[];
  };
  files?: string[];
  error?: string;
}

// This interface is used to define the structure of the response from the server when compiling the document
export interface CompileButtonProps {
  setDocumentData: (data: string) => void;
}