export const restrictedDirectories: { [directory: string]: boolean } = {
  "input/": true,
  "input/appendices": true,
  "input/chapters": true,
  "input/resources": true,
  "input/resources/csl": true,
  "input/resources/bibliography": true,
  "input/resources/images": true, // Not their content
};