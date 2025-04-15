// Define types of files and possible operations
export interface File {
  name: string;
  selected?: boolean;
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
