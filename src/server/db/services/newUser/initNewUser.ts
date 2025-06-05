import pool from "../../config/pool";
import { constructTFG } from "./defaultTfgConstruct";
import { parseAcronymFile } from "../parse/acronymParser";
import { insertUserQuery } from "../../queries/userQueries";
import { insertTfgQuery } from "../../queries/tfgQueries";
import { insertBasicInfoQuery } from "../../queries/basicInfoQueries";
import { insertChapterQuery } from "../../queries/chapterQueries";
import { insertAppendixQuery } from "../../queries/appendixQueries";
import { insertResourceQuery } from "../../queries/imageQueries";
import { insertAcronymQuery } from "../../queries/acronymQueries";

import { User } from "../../models/User";
import { TFG } from "../../models/Tfg";
import { PoolClient } from "pg";

async function insertChapters(
  chapters: any,
  bfp_id: any,
  client: PoolClient
): Promise<void> {
  for (const [number, data] of Object.entries(chapters)) {
    const { title, content }: { title: string; content: string } = data as {
      title: string;
      content: string;
    };
    const chapter_id = (
      bfp_id +
      "_ch_" +
      title.toLowerCase().replace(/\s+/g, "_")
    ).slice(0, 64);
    const chapterData = [
      chapter_id,
      title,
      10 * parseInt(number), // This will help to swap values
      content,
      bfp_id,
    ];
    console.log("Inserting chapter data:", chapterData);
    await client.query(insertChapterQuery, chapterData);
  }
}

async function insertAppendices(
  appendices: any,
  bfp_id: any,
  client: PoolClient
): Promise<void> {
  for (const [number, data] of Object.entries(appendices)) {
    const { title, content }: { title: string; content: string } = data as {
      title: string;
      content: string;
    };
    const appendix_id = (
      bfp_id +
      "_ap_" +
      title.toLowerCase().replace(/\s+/g, "_")
    ).slice(0, 64);
    const appendixData = [
      appendix_id,
      title,
      10 * parseInt(number), // This will help to swap values
      content,
      bfp_id,
    ];
    console.log("Inserting appendix data:", appendixData);
    await client.query(insertAppendixQuery, appendixData);
  }
}

async function insertBasicInfo(
  client: PoolClient,
  basicInfoArray: (string | number | null)[]
): Promise<void> {
  console.log("Inserting basic info data:", basicInfoArray);
  const basicInfoResult = await client.query(
    insertBasicInfoQuery,
    basicInfoArray
  );
  if (basicInfoResult.rowCount === 0) {
    throw new Error("Failed to insert basic info data.");
  }
  console.log("Basic info data inserted successfully.");
}

async function insertTFGData(
  client: PoolClient,
  tfgArray: (string | number | null)[]
): Promise<any> {
  // Remove the first element (bfp_id) from the array
  const bfp_id = tfgArray.shift();
  console.log(`Inserting TFG ${bfp_id}:`, tfgArray);
  const tfgResult = await client.query(insertTfgQuery, tfgArray);
  if (tfgResult.rowCount === 0) {
    throw new Error("Failed to insert TFG data.");
  }
  console.log(
    "TFG data inserted successfully with bfp_id:",
    tfgResult.rows[0].bfp_id
  );
  return tfgResult.rows[0].bfp_id;
}

async function insertUserData(
  client: PoolClient,
  userArray: (string | number | null)[]
): Promise<any> {
  // Remove the first element (user_id) from the array
  const user_id = userArray.shift();
  console.log(`Inserting user ${user_id}: ${userArray}`);
  // Insert user data
  const userResult = await client.query(insertUserQuery, userArray);
  if (userResult.rowCount === 0) {
    throw new Error("Failed to insert user data.");
  }
  console.log("User data inserted successfully with user_id:", user_id);
  return userResult.rows[0].bfp_id;
}

/**
 * Creates a new user and initializes their TFG and basic info in the database.
 * @param {Object} userData - The user data to insert.
 * @param {Object} tfgData - The TFG data to insert.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the database operations.
 */

export async function initNewUser(userData: User, tfgData: TFG): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await insertUserData(client, userData.toArray());
    const data = await constructTFG();
    if (!data) {
      throw new Error("Failed to initialize user data.");
    }

    const chapters = data.chapters;
    const appendices = data.appendices;
    const setup = data.setupFiles;
    const acronyms = parseAcronymFile(setup.acronyms);
    const res = data.resources;
    const cfg = data.config;
    const bib = data.bibliography;

    // Ensure TFG data is correct before inserting
    tfgData.csl = cfg.Csl.split("/").pop().split(".")[0]; // Filename without route and extension
    tfgData.month = tfgData.month ? tfgData.month : "JUNIO"; // Assuming the creation of a TFG is in ordinary (June)
    tfgData.year = tfgData.year ? tfgData.year : new Date().getFullYear(); // Current year

    const bfp_id = await insertTFGData(client, tfgData.toArray());

    // Insert basic info data
    const basicInfoArray = [
      "cfg_" + userData.user_id, // cfg_id == user_id FOR THE MOMENT
      bfp_id,
      setup.abstract,
      setup.acknowledgements,
      setup.autorship,
      setup.dedication,
      setup.resumen,
      bib,
    ];
    await insertBasicInfo(client, basicInfoArray);

    // Insert acronyms (obtain iterator from acronyms object)
    for (const [key, meaning] of Object.entries(acronyms)) {
      await client.query(insertAcronymQuery, [key, bfp_id, meaning]);
    }

    // Insert chapters and appendices
    await insertChapters(chapters, bfp_id, client);
    await insertAppendices(appendices, bfp_id, client);

    // Insert resources (images)
    for (const [filename, data] of Object.entries(res)) {
      const img_id: number = Math.floor(Date.now() / 1000); // Unix epoch time as numeric ID (always unique)
      const resourceData = [img_id, filename, data, bfp_id];
      console.log("Inserting resource data:", resourceData);
      await client.query(insertResourceQuery, resourceData);
    }

    await client.query("COMMIT");
  } catch (error) {
    console.error("Error creating and initializing user:\n", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function createNewUser(
  userData: any,
  tfgData: any
): Promise<void> {
  try {
    const user = new User(
      userData.phone, // phone (optional)
      userData.email, // email
      userData.name, // name
      userData.password, // password
      userData.lastNames[0], // lastname1 (first element of lastNames array)
      userData.lastNames[1], // lastname2 (second element of lastNames array or empty string)
      userData.technology, // technology
      userData.phone // user_id (using phone as unique identifier)
    );

    const tfg = new TFG(
      Math.floor(Date.now() / 1000), // bfp_id (epoch time in seconds as unique identifier)
      tfgData.title, // title
      tfgData.tutor, // tutor
      tfgData.department, // department
      tfgData.language, // language
      "", // csl (default value, assuming it will be set later)
      tfgData.call.month, // month
      parseInt(tfgData.call.year), // year (converted to number)
      userData.phone, // student (using phone as unique identifier)
      tfgData.subtitle || null, // subtitle (default to null if not provided)
      tfgData.coTutor || null // cotutor (default to null if not provided)
    );

    if (user && tfg) {
      await initNewUser(user, tfg);
    } else {
      throw new Error("Failed to create User or TFG objects.");
    }
    console.log("New user and TFG initialized successfully.");
  } catch (error) {
    console.error("Error initializing new user:", error);
    throw error;
  }
}
