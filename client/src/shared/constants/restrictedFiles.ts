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