import pool from "../config/pool";
import { constructTFG } from "./tfgConstruct";
import { parseAcronymFile } from "./acronymParser";
import { insertUserQuery } from "../queries/userQueries";
import { insertTfgQuery } from "../queries/tfgQueries";
import { insertBasicInfoQuery } from "../queries/basicInfoQueries";
import { inserChapterQuery } from "../queries/chapterQueries";
import { inserAppendixQuery } from "../queries/appendixQueries";
import { insertResourceQuery } from "../queries/imageQueries";
import { insertAcronymQuery } from "../queries/acronymQueries";

import { User } from "../models/User";
import { TFG } from "../models/Tfg";

/**
 * Creates a new user and initializes their TFG and basic info in the database.
 * @param {Object} userData - The user data to insert.
 * @param {Object} tfgData - The TFG data to insert.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the database operations.
 */

// name, lastname1, lastname2, email, passwd, technology, phone?, title, subtitle?, language, tutor, cotutor?, department
export async function createAndInitUser(
  userData: User,
  tfgData: TFG
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert user data
    const userResult = await client.query(insertUserQuery, userData.toArray());

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

    // Insert tfg data
    tfgData.csl = cfg.Csl.split("/").pop().split(".")[0]; // Filename without route and extension
    tfgData.month = "JUNIO"; // Assuming the creation of a TFG is in ordinary (June)
    tfgData.year = new Date().getFullYear(); // Current year

    console.log("Inserting TFG data:", tfgData.toArray());

    const tfgResult = await client.query(insertTfgQuery, tfgData.toArray());
    const bfp_id = tfgResult.rows[0].bfp_id;

    // Insert basic info data
    const basicInfoResult = await client.query(insertBasicInfoQuery, [
      userData.user_id, // cfg_id == user_id FOR THE MOMENT
      bfp_id,
      setup.abstract,
      setup.acknowledgements,
      setup.autorship,
      setup.dedication,
      setup.resumen,
      bib,
    ]);

    // Insert acronyms (obtain iterator from acronyms object)
    for (const [key, meaning] of Object.entries(acronyms)) {
      await client.query(insertAcronymQuery, [key, bfp_id, meaning]);
    }

    // Insert chapters
    const chapter_wildcard: string = "# ";
    const ch_wc_l: number = chapter_wildcard.length;
    for (const [number, data] of Object.entries(chapters)) {
      const title = String(data).split("\n")[0].slice(ch_wc_l).trim();
      const chapter_id = (
        bfp_id +
        "_ch_" +
        title.toLowerCase().replace(/\s+/g, "_")
      ).slice(0, 64);
      const chapterData = [chapter_id, title, parseInt(number), data, bfp_id];
      console.log("Inserting chapter data:", chapterData);
      await client.query(inserChapterQuery, chapterData);
    }

    // Insert appendices
    for (const [number, data] of Object.entries(appendices)) {
      const title = String(data).split("\n")[0].slice(ch_wc_l).trim();
      const appendix_id = (
        bfp_id +
        "_ap_" +
        title.toLowerCase().replace(/\s+/g, "_")
      ).slice(0, 64);
      const appendixData = [appendix_id, title, parseInt(number), data, bfp_id];
      console.log("Inserting appendix data:", appendixData);
      await client.query(inserAppendixQuery, appendixData);
    }

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

const exampleUser = new User(
  "12345",
  "John",
  "Doe",
  "Smith",
  "john.doe@example.com",
  "securepassword",
  "Computer Science"
);

const exampleTFG = new TFG(
  0, // bfp_id
  "Example TFG Title", // title
  "Dr. Jane Tutor", // tutor
  "Engineering", // department
  "English", // language
  "example.csl", // csl
  "JUNIO", // month
  2026, // year
  exampleUser.user_id, // student
  "Example TFG Subtitle", // subtitle
  "Dr. John Cotutor" // cotutor
);

(async () => {
  try {
    await createAndInitUser(exampleUser, exampleTFG);
    console.log("User and TFG created successfully.");
  } catch (error) {
    console.error("Failed to create user and TFG:", error);
  }
})();
