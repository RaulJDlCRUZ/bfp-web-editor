import { PoolClient } from "pg";
import { insertResourceQuery } from "@db/queries/imageQueries";

export async function insertOneImage(
  client: PoolClient,
  image: { filename: string; data: string },
  tfg: number
): Promise<void> {
  try {
    const resourceData = [image.filename, image.data, tfg];
    // console.log("Inserting resource data:", resourceData);
    await client.query(insertResourceQuery, resourceData);
  } catch (error) {
    console.error(`Error inserting image: ${image.filename}`, error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

/**
 *
 * @param client
 * @param res
 * @param tfg
 * Inserts multiple images into the database.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the insertion of any image.
 * @description Each image is an object with a filename and data. The function iterates over the array of images, extracting the filename and data, and calls insertOneImage for each image.
 * Similar with chapters, but here we can just use the filename to search the value as an array index.
 */
export async function insertImages(
  client: PoolClient,
  res: Array<Record<string, string>>,
  tfg: number
): Promise<void> {
  for (const image of res) {
    const filename = Object.values(image)[0];
    const data = image[Object.keys(image)[0]];
    const imageData = {
      filename: filename.trim(),
      data: data.trim(), // Ensure data is a string
    };
    try {
      await insertOneImage(client, imageData, tfg);
    } catch (error) {
      console.error(`Error inserting image: ${imageData.filename}`, error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  }
}
