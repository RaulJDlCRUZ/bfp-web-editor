import Pool from "../../config/pool.js";
import { getUserByIdQuery } from "../../queries/userQueries.js";
import { getTfgByUserIdQuery } from "../../queries/tfgQueries.js";

async function generateChapterFiles() {
  
}

export async function materializeFromUser(userID: string): Promise<void> {
  // This function will materialize the TFG from the user ID
  // It will get the user data, TFG data, and other related information
  const client = await Pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch user data
    const userResult = await client.query(getUserByIdQuery, [userID]);
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }
    const userData = userResult.rows[0];
    console.log("User data:\n==========\n", userData);

    // Fetch TFG data
    const tfgResult = await client.query(getTfgByUserIdQuery, [userID]);
    if (tfgResult.rows.length === 0) {
      throw new Error("TFG not found for the user");
    }
    const tfgData = tfgResult.rows[0];
    console.log("TFG data:\n==========\n", tfgData);

    const bfp_id = tfgData.bfp_id; // Assuming bfp_id is the primary key for TFG

    // Fetch basic info data
    const basicInfoResult = await client.query(
      "SELECT * FROM basic_info WHERE tfg = $1",
      [bfp_id]
    );
    if (basicInfoResult.rows.length === 0) {
      throw new Error("Basic info not found for the TFG");
    }
    const basicInfoData = basicInfoResult.rows[0];
    console.log("Basic info data:\n==========\n", basicInfoData);

    // Fetch other related data as needed
    // For example, chapters, appendices, resources, etc.

    // Here you can implement the logic to materialize the TFG
    // For example, creating files, directories, etc.

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error materializing TFG from user:", error);
  } finally {
    client.release();
  }
}
