import { PoolClient } from "pg";
import { insertAppendixQuery } from "@db/queries/appendixQueries";

export async function insertOneAppendix(
  client: PoolClient,
  appendix: { title: string; content: string },
  number: number,
  bfp_id: number
): Promise<void> {
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
}

export async function insertAppendices(
  client: PoolClient,
  appendix: Array<{ title: string; content: string }>,
  bfp_id: number
): Promise<void> {
  appendix.forEach(async (appendixData, number) => {
    await insertOneAppendix(client, appendixData, number, bfp_id);
  });
}
