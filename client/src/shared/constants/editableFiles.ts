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