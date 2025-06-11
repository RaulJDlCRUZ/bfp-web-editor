import { PoolClient } from "pg";
import { insertAppendixQuery } from "@db/queries/appendixQueries";

export async function insertOneAppendix(
  client: PoolClient,
  appendix: { title: string; content: string },
  number: number,
  bfp_id: number
): Promise<void> {
  try {
    const appendix_id = (
      bfp_id +
      "_ap_" +
      appendix.title.toLowerCase().replace(/\s+/g, "_")
    ).slice(0, 64);
    const appendixData = [
      appendix_id,
      appendix.title,
      10 * number, // This will help to swap values
      appendix.content,
      bfp_id,
    ];
    // console.log("Inserting appendix data:", appendixData);
    await client.query(insertAppendixQuery, appendixData);
  } catch (error) {
    console.error("Error inserting appendix:", number, appendix.title, error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

export async function insertAppendices(
  client: PoolClient,
  appendices: Array<Record<number, { title: string; content: string }>>,
  bfp_id: number
): Promise<void> {
  for (const appendix of appendices) {
    const number = parseInt(String(Object.values(appendix)[0])); // Extract the key as the chapter number
    const appendixData = Object.values(appendix)[1]; // Access the value directly using the key
    try {
      await insertOneAppendix(client, appendixData, number, bfp_id);
    } catch (error) {
      console.error(
        "Error inserting appendices. Stopping execution at appendix:",
        number,
        appendixData.title,
        error
      );
    }
  }
}
