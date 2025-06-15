import pool from "../config/pool";

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

export async function insertTfg(tfgArray: (string | number | null)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertTfgQuery, tfgArray);
    if (result.rowCount === 0) {
      throw new Error("Failed to insert TFG data.");
    }
    return result.rows[0].bfp_id; // Return the generated bfp_id
  } catch (error) {
    console.error("Error inserting TFG data:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTfgById(id: number) {
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

export async function getTfgByUserId(userId: number) {
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
