import fs from "fs";
import path from "path";

export function removeOldDoc(outputPath: string, file: string) {
  const filePath = path.join(outputPath, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    return;
  }
}
