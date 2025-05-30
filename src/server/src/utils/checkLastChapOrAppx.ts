import fs from "fs";
import path from "path";
import { folderPath } from "../index.js";

// Obtenemos el número más alto de los archivos en un subdirectorio específico
// Posiblemente esta función quede deprecada por el SGBD que dicte el último number registrado
export function checkLastChapOrAppx(
  subfolder: "appendices" | "chapters"
): number | null {
  const targetFolder = path.join(folderPath, subfolder);
  if (!fs.existsSync(targetFolder)) {
    throw new Error(`Folder does not exist: ${targetFolder}`);
  }

  const files = fs.readdirSync(targetFolder);
  const numbers = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const prefix = file.slice(0, 2);
      return prefix !== "XX" ? parseInt(prefix, 10) : NaN;
    })
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b);

  for (let i = 1; i <= numbers.length; i++) {
    if (!numbers.includes(i)) {
      return i;
    }
  }

  return numbers.length > 0 ? Math.max(...numbers) + 1 : null;
}
