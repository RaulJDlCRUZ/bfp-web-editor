import bcrypt from "bcrypt";
import pool from "@db/config/pool";

import { insertUserData } from "@db/services/insert_operations/insertUserData";
import { insertTFGData } from "@db/services/insert_operations/insertTfgData";
import { insertBasicInfo } from "@db/services/insert_operations/insertBasicInfo";
import { insertChapters } from "@db/services/insert_operations/insertChapters";
import { insertAppendices } from "@db/services/insert_operations/insertAppendices";
import { insertAcronyms } from "@db/services/insert_operations/insertAcronyms";
import { insertImages } from "@db/services/insert_operations/insertImage";

import { constructTFG } from "./defaultTfgConstruct";
import { parseAcronymFile } from "@db/services/parse/acronymParser";

import { User } from "@db/models/User";
import { TFG } from "@db/models/Tfg";
import { BasicInfo } from "@db/models/BasicInfo";
// import { Chapter } from "@db/models/Chapter";
// import { Appendix } from "@db/models/Appendix";
// import { Images } from "@db/models/Images";
// import { Acronym } from "@db/models/Acronym";

const MY_SALT: number = 10; // Salt rounds for bcrypt hashing

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
    const data = await constructTFG();
    if (!data) {
      throw new Error("Failed to initialize user data.");
    }
    await client.query("BEGIN");

    const chapters = data.chapters;
    const appendices = data.appendices;
    const setup = data.setupFiles;
    const acronyms = parseAcronymFile(setup.acronyms);
    const res = data.resources;
    const cfg = data.config;
    const bib = data.bibliography;

    console.log(setup);

    // Ensure TFG data is correct before inserting
    tfgData.csl = cfg.Csl.split("/").pop().split(".")[0]; // Filename without route and extension
    tfgData.month = tfgData.month ? tfgData.month : "JUNIO"; // Assuming the creation of a TFG is in ordinary (June)
    tfgData.year = tfgData.year ? tfgData.year : new Date().getFullYear(); // Current year

    const bfp_id = await insertTFGData(client, tfgData.toArray());

    const basicInfo = new BasicInfo(
      bfp_id,
      "cfg_" + userData.user_id, // cfg_id == user_id FOR THE MOMENT
      setup.abstract,
      setup.acknowledgements,
      setup.authorship,
      setup.dedication,
      setup.resumen,
      bib
    );

    const basicInfoArray = basicInfo.ToArray();
    await insertBasicInfo(client, basicInfoArray);

    // Insert acronyms (obtain iterator from acronyms object)
    await insertAcronyms(client, bfp_id, acronyms);

    // Insert chapters and appendices
    await insertChapters(client, chapters, bfp_id);
    await insertAppendices(client, appendices, bfp_id);

    // Insert resources (images)
    await insertImages(client, res, bfp_id);

    await client.query("COMMIT");
    console.log("TFG initialized successfully for user:", userData.user_id);
  } catch (error) {
    console.error("Error creating and initializing user:\n", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function createNewUser(userData: any): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, MY_SALT); // Hash the password with a salt round
    const user = new User(
      userData.email,
      hashedPassword, // Store the hashed password instead of the plain text password
      userData.name,
      userData.lastNames[0], // lastname1 (first element of lastNames array)
      userData.lastNames[1], // lastname2 (second element of lastNames array or empty string)
      userData.technology,
      undefined, // user_id should be provided by the RDBMS
      userData.phone || null // phone (default to null if not provided)
    );

    if (!user) {
      throw new Error("Failed to create User object.");
    }

    const client = await pool.connect();
    const new_user_id = await insertUserData(client, user.toArray());
    client.release();
    user.user_id = new_user_id; // Set the generated user_id to the User object
    console.log("New user created with user_id:", user.user_id);
    return user;
  } catch (error) {
    console.error("Error initializing new user:", error);
    throw error;
  }
}

export async function createNewTFG(
  new_user_id: number,
  tfgData: any
): Promise<TFG> {
  try {
    const tfg = new TFG(
      tfgData.title,
      tfgData.tutor,
      tfgData.department,
      tfgData.language,
      "", // csl (default value, assuming it will be set later)
      tfgData.call.month,
      parseInt(tfgData.call.year), // year (converted to number)
      new_user_id, // student (user_id)
      undefined, // bfp_id (default to null as is generated by the database)
      tfgData.subtitle || null, // subtitle (default to null if not provided)
      tfgData.coTutor || null // cotutor (default to null if not provided)
    );
    if (!tfg) {
      throw new Error("Failed to create TFG object.");
    }
    return tfg;
  } catch (error) {
    console.error("Error initializing new TFG:", error);
    throw error;
  }
}
