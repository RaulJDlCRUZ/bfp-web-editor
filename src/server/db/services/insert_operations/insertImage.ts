import { PoolClient } from "pg";
import { insertResourceQuery } from "@db/queries/imageQueries";

export async function insertOneImage(
  client: PoolClient,
  image: { filename: string; data: string },
  tfg: number
): Promise<void> {
  const resourceData = [image.filename, image.data, tfg];
  // console.log("Inserting resource data:", resourceData);
  await client.query(insertResourceQuery, resourceData);
}

export async function insertImages(
  client: PoolClient,
  res: Record<string, string>,
  tfg: number
): Promise<void> {
  for (const [filename, data] of Object.entries(res)) {
    const image = {
      filename: filename.trim(),
      data: data.trim(), // TypeError: data.trim is not a function
    };
    // console.log(`Inserting image: ${image.filename}`);
    await insertOneImage(client, image, tfg);
  }
}
