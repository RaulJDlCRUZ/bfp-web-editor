import pool from "../config/db.js";

const insertAcronymQuery = `
  INSERT INTO acronyms (acronym, tfg, meaning)
  VALUES ($1, $2, $3)
  RETURNING acronym, tfg`;

const getAcronymsByTfgQuery = `
  SELECT * FROM acronyms WHERE tfg = $1 ORDER BY acronym ASC;
`;

// As PK = (acronym, tfg), it's like find by id
const getAcronymByAcronymAndTfgQuery = `
  SELECT * FROM acronyms WHERE acronym = $1 AND tfg = $2;
`;

const updateAcronymQuery = `
  UPDATE acronyms
  SET meaning = $1
  WHERE acronym = $2 AND tfg = $3
  RETURNING acronym, tfg, meaning;
`;

const deleteAcronymQuery = `
  DELETE FROM acronyms WHERE acronym = $1 AND tfg = $2;
`;

export async function insertAcronym(
  acronymArray: (string | number)[]
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(insertAcronymQuery, acronymArray);
    if (result.rows.length === 0) {
      throw new Error("Failed to insert acronym, no rows returned.");
    }
    return result.rows[0]; // Return the complex PK from inserted acronym
  } catch (error) {
    console.error("Error inserting acronym:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAcronymsByTfg(
  tfg: number
): Promise<(string | number | null)[][]> {
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

export async function getAcronymByAcronymAndTfg(acronymId: {
  acronym: string;
  tfg: number;
}): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getAcronymByAcronymAndTfgQuery, [
      acronymId.acronym,
      acronymId.tfg,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching acronym by acronym and TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAcronym(
  acronymId: { acronym: string; tfg: number },
  data: Partial<{ acronym: string; meaning: string }>
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const { acronym, meaning } = data;
    const result = await client.query(updateAcronymQuery, [
      acronym,
      meaning,
      acronymId.tfg,
    ]);
    return result.rows[0]; // Return the updated acronym
  } catch (error) {
    console.error("Error updating acronym:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAcronym(acronymId: {
  acronym: string;
  tfg: number;
}): Promise<void> {
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
