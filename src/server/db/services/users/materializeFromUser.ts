import Pool from "@db/config/pool.js";
import { PoolClient } from "pg";

import { getUserByIdQuery } from "@db/queries/userQueries.js";
import { getTfgByUserIdQuery } from "@db/queries/tfgQueries.js";
import { getBasicInfoByTfgQuery } from "@db/queries/basicInfoQueries.js";
import { getChaptersByTfgQuery } from "@db/queries/chapterQueries.js";
import { getAppendicesByTfgQuery } from "@db/queries/appendixQueries.js";

import { User } from "@db/models/User.js";
import { TFG } from "@db/models/Tfg.js";
import { BasicInfo } from "@db/models/BasicInfo.js";
import { Chapter } from "@db/models/Chapter.js";
import { Appendix } from "@db/models/Appendix.js";

async function generateChapterFiles(
  client: PoolClient,
  bfp_id: number
): Promise<Chapter[]> {
  // Fetch chapters data
  const chaptersResult = await client.query(getChaptersByTfgQuery, [bfp_id]);
  if (chaptersResult.rows.length === 0) {
    throw new Error("Chapters not found for the TFG");
  }
  let chapters: Chapter[] = [];
  const chaptersData = chaptersResult.rows;
  for (const chapterData of chaptersData) {
    const chapter: Chapter = Chapter.fromDbRow(chapterData);
    console.log(
      `./chapters/<${chapter.number}> - ${chapter.ch_title}:\n
      ${chapter.content}`
    );
    chapters.push(chapter);
  }
  return chapters;
}

async function generateAppendixFiles(
  client: PoolClient,
  bfp_id: number
): Promise<Appendix[]> {
  // Fetch appendices data
  const appendicesResult = await client.query(getAppendicesByTfgQuery, [
    bfp_id,
  ]);
  if (appendicesResult.rows.length === 0) {
    throw new Error("Appendices not found for the TFG");
  }
  let appendices: Appendix[] = [];
  const appendicesData = appendicesResult.rows;
  for (const appendixData of appendicesData) {
    const appendix: Appendix = Appendix.fromDbRow(appendixData);
    console.log(
      `./appendices/<${appendix.number}> - ${appendix.ap_title}:\n
      ${appendix.content}`
    );
    appendices.push(appendix);
  }
  return appendices;
}

async function generateBasicFiiles(
  client: PoolClient,
  bfp_id: number
): Promise<BasicInfo> {
  // Fetch basic info data
  const basicInfoResult = await client.query(getBasicInfoByTfgQuery, [bfp_id]);
  if (basicInfoResult.rows.length === 0) {
    throw new Error("Basic info not found for the TFG");
  }
  const basicInfoData = basicInfoResult.rows[0];
  console.log("Basic info data:\n==========\n", basicInfoData);
  const basicInfo: BasicInfo = BasicInfo.fromDbRow(basicInfoData);
  console.log(`
    ./acknowledgements.md: ${basicInfo.acknowledgements}\n
    ./abstract.md: ${basicInfo.abstract}\n
    ./authorship.md: ${basicInfo.authorship}\n
    ./dedication.md: ${basicInfo.dedication}\n
    ./resumen.md: ${basicInfo.resumen}\n
    ./resources/bibliography/bibliography.bib: ${basicInfo.bibliography}\n
    `);

  return basicInfo;
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
    // console.log("User data:\n==========\n", userData);
    const user: User = User.fromDbRow(userData);
    console.log(user);

    // Fetch TFG data
    const tfgResult = await client.query(getTfgByUserIdQuery, [user.user_id]);
    if (tfgResult.rows.length === 0) {
      throw new Error("TFG not found for the user");
    }
    const tfgData = tfgResult.rows[0];
    // console.log("TFG data:\n==========\n", tfgData);
    const tfg: TFG = TFG.fromDbRow(tfgData);
    // const bfp_id = tfgData.bfp_id; // Assuming bfp_id is the primary key for TFG

    if (!tfg.bfp_id) {
      throw new Error(`${user.user_id}'s TFG does not have a valid bfp_id`);
    }

    // Fetch all data through functions
    const basicInfo = await generateBasicFiiles(client, tfg.bfp_id);
    // const chapters = await generateChapterFiles(client, tfg.bfp_id);
    // const appendices = await generateAppendixFiles(client, tfg.bfp_id);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error materializing TFG from user:", error);
  } finally {
    client.release();
  }
}

// THIS IS AN EXAMPLE (WITH TSX)
(async () => {
  try {
    const userID = "3";
    await materializeFromUser(userID);
  } catch (error) {
    console.error("Error in materializing TFG from user:", error);
  }
})();
