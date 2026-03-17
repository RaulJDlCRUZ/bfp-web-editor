import pool from "../config/db.js";

const insertTfgQuery = `
  INSERT INTO tfg (title, subtitle, tutor, cotutor, department, language, csl, month, year, student)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING bfp_id;
`;

const getTfgByIdQuery = `
  SELECT * FROM tfg WHERE bfp_id = $1
`;

const getTfgByUserIdQuery = `
  SELECT * FROM tfg WHERE student = $1
`;

const updateTfgQuery = `
  UPDATE tfg
  SET title = $2, subtitle = $3, tutor = $4, cotutor = $5, department = $6, language = $7, csl = $8, month = $9, year = $10
  WHERE bfp_id = $1
  RETURNING *;
`;

const updateCslQuery = `
  UPDATE tfg
  SET csl = $2
  WHERE bfp_id = $1
  RETURNING *;
`;

export async function insertTfg(
  tfgArray: (string | number | null)[]
): Promise<number> {
  console.log("Inserting TFG data:", tfgArray);
  const client = await pool.connect();
  try {
    const result = await client.query(insertTfgQuery, tfgArray);
    if (result.rowCount === 0) {
      throw new Error("Failed to insert TFG data.");
    }
    const newBfpId: number = result.rows[0].bfp_id;
    return newBfpId; // Return the generated bfp_id (to replace the empty string in Tfg constructor)
  } catch (error) {
    console.error("Error inserting TFG data:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTfgById(
  id: number
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getTfgByIdQuery, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching TFG by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTfgByUserId(
  userId: number
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getTfgByUserIdQuery, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching TFG by user ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateTfg(
  tfgId: number,
  tfgData: (string | number | null)[]
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateTfgQuery, [tfgId, ...tfgData]);
    if (result.rowCount === 0) {
      throw new Error("Failed to update TFG data.");
    }
    return result.rows[0]; // Return the updated TFG data
  } catch (error) {
    console.error("Error updating TFG data:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCsl(
  tfgId: number,
  csl: string
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateCslQuery, [tfgId, csl]);
    if (result.rowCount === 0) {
      throw new Error("Failed to update TFG CSL.");
    }
    return result.rows[0]; // Return the updated TFG data
  } catch (error) {
    console.error("Error updating TFG CSL:", error);
    throw error;
  } finally {
    client.release();
  }
}
