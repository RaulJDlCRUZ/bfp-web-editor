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
