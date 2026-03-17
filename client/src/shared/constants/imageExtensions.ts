// For every admitted image extension, maps its corresponding render type (Tailwind CSS)
export const imageExtensions: { [extension: string]: string } = {
  jpg: "image-render-auto",
  jpeg: "image-render-auto",
  png: "image-render-pixel",
  gif: "image-render-auto",
  svg: "image-render-auto",
  bmp: "image-render-crisp",
};