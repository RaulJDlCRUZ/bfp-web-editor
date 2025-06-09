import { PoolClient } from "pg";
import { insertTfgQuery } from "@db/queries/tfgQueries";

export async function insertTFGData(
  client: PoolClient,
  tfgArray: (string | number | null)[]
): Promise<number> {
  // Remove the first element (bfp_id) from the array
  let bfp_id = tfgArray.shift();
  console.log(`Inserting TFG `, tfgArray);
  const tfgResult = await client.query(insertTfgQuery, tfgArray);
  if (tfgResult.rowCount === 0) {
    throw new Error("Failed to insert TFG data.");
  }
  bfp_id = tfgResult.rows[0].bfp_id; // Get the generated bfp_id
  console.log("TFG data inserted successfully with bfp_id:", bfp_id);
  return Number(bfp_id);
}
