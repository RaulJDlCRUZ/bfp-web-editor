// This dictionary maps file extensions to their corresponding icons
export const fileIcons: { [extension: string]: string } = {
  pdf: "📄",
  jpg: "🖼️",
  jpeg: "🖼️",
  png: "🖼️",
  gif: "🖼️",
  svg: "🖼️",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  txt: "📃",
  md: "📃",
  zip: "🗜️",
  rar: "🗜️",
  bib: "📚",
  json: "🗃️",
};

// This dictionary specifies which files are restricted but can be edited
// According to: https://www.felixalbertos.com/resources/downloads/tfg_template.html
export const editableFiles: { [extension: string]: boolean } = {
  "config.yaml": true,
  "input/resources/bibliography/bibliography.bib": true,
  "input/abstract.md": true,
  "input/acknowledgements.md": true,
  "input/acronyms.md": true,
  "input/authorship.md": true,
  "input/dedication.md": true,
  "input/resumen.md": true,
};

// This dictionary restricts the files tha cannot be selected to move, rename, erase...
// According to: https://www.felixalbertos.com/resources/downloads/tfg_template.html
export const restrictedFiles: { [extension: string]: boolean } = {
  "config.yaml": true,
  "input/resources/bibliography/bibliography.bib": true,
  "input/resources/csl/acm-sig-proceedings.csl": true,
  "input/resources/csl/iso690-author-date-cs.csl": true,
  "input/resources/csl/iso690-numeric-en.csl": true,
  "input/abstract.md": true,
  "input/acknowledgements.md": true,
  "input/acronyms.md": true,
  "input/authorship.md": true,
  "input/dedication.md": true,
  "input/resumen.md": true,
};

export const restrictedDirectories: { [directory: string]: boolean } = {
  "input/": true,
  "input/appendices": true,
  "input/chapters": true,
  "input/resources": true,
  "input/resources/csl": true,
  "input/resources/bibliography": true,
  "input/resources/images": true, // Not their content
};

export const allowNewDirectories: { [directory: string]: boolean } = {
  "input/resources/images": true,
};

// CSL files that are not shown in the file explorer
export const hideCSL: { [extension: string]: boolean } = {
  "/input/resources/csl/acm-sig-proceedings.csl": true,
  "/input/resources/csl/iso690-author-date-cs.csl": true,
  "/input/resources/csl/iso690-numeric-en.csl": true,
};

// Directories that are not shown in the file explorer
export const hideDirectories: { [directory: string]: boolean } = {
  "/input/": true,
  "/input/resources/bibliography": true,
  "/input/resources/csl": true,
};

// ! Probablemennte sea movido o eliminado al implementarse la BD
export const prettySetupFiles: { [extension: string]: string } = {
  "input/config.yaml": "Config",
  "input/resources/bibliography/bibliography.bib": "Bibliography",
  "input/abstract.md": "Abstract",
  "input/acknowledgements.md": "Acknowledgements",
  "input/acronyms.md": "Acronyms",
  "input/authorship.md": "Authorship",
  "input/dedication.md": "Dedication",
  "input/resumen.md": "Summary (ES)",
};
