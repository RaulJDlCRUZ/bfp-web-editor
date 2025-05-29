// This interface is used to define the structure of the response from the server when compiling the document
export interface CompileButtonProps {
  setDocumentData: (data: string | null) => void;
}

export interface DropDownOption {
  operation: "download" | "delete" | "rename" | "move" | "info" | "upload" | "createDir";
  label: string;
  icon: any;
  onClick: () => void;
  disabled?: boolean;
}

export interface DropDownMenuProps {
  options: DropDownOption[];
}
