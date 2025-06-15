import pool from "../config/pool.js";

const insertAcronymQuery = `
  INSERT INTO acronyms (acronym, tfg, meaning)
  VALUES ($1, $2, $3)
  RETURNING acronym_id`;

const getAcronymsByTfgQuery = `
  SELECT * FROM acronyms WHERE tfg = $1 ORDER BY acronym ASC;
`;

const getAcronymByIdQuery = `
  SELECT * FROM acronyms WHERE acronym_id = $1;
`;

const getAcronymByAcronymAndTfgQuery = `
  SELECT * FROM acronyms WHERE acronym = $1 AND tfg = $2;
`;

const deleteAcronymQuery = `
  DELETE FROM acronyms WHERE acronym_id = $1;
`;

export async function insertAcronym(acronymArray: (string | number)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertAcronymQuery, acronymArray);
    return result.rows[0].acronym_id; // Return the acronym_id of the inserted acronym
  } catch (error) {
    console.error("Error inserting acronym:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAcronymsByTfg(tfg: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAcronymsByTfgQuery, [tfg]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching acronyms by TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAcronymById(acronymId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAcronymByIdQuery, [acronymId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching acronym by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAcronymByAcronymAndTfg(acronym: string, tfg: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAcronymByAcronymAndTfgQuery, [
      acronym,
      tfg,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching acronym by acronym and TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAcronym(acronymId: number) {
  const client = await pool.connect();
  try {
    await client.query(deleteAcronymQuery, [acronymId]);
  } catch (error) {
    console.error("Error deleting acronym:", error);
    throw error;
  } finally {
    client.release();
  }
}
