import { PoolClient } from "pg";
import { insertBasicInfoQuery } from "@db/queries/basicInfoQueries";

export async function insertBasicInfo(
  client: PoolClient,
  basicInfoArray: (string | number | null)[]
): Promise<void> {
  // console.log("Inserting basic info data:", basicInfoArray);
  const basicInfoResult = await client.query(
    insertBasicInfoQuery,
    basicInfoArray
  );
  if (basicInfoResult.rowCount === 0) {
    throw new Error("Failed to insert basic info data.");
  }
  console.log("Basic info data inserted successfully.");
}
