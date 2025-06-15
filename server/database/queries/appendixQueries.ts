import pool from "../config/pool.js";

const insertAppendixQuery = `
  INSERT INTO appendices (appx_id, ap_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING appx_id;
`;

const getAppendicesByTfgQuery = `
  SELECT * FROM appendices WHERE tfg = $1 ORDER BY number ASC;
`;

const getAppendixByIdQuery = `
  SELECT * FROM appendices WHERE appx_id = $1;
`;

const getAppendixByNumberAndTfgQuery = `
  SELECT * FROM appendices WHERE number = $1 AND tfg = $2;
`;

export async function insertAppendix(appendixArray: (number | string)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertAppendixQuery, appendixArray);
    return result.rows[0].appx_id;
  } catch (error) {
    console.error("Error inserting appendix:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAppendicesByTfg(tfg: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAppendicesByTfgQuery, [tfg]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching appendices by TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAppendixById(appx_id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAppendixByIdQuery, [appx_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching appendix by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAppendixByNumberAndTfg(number: number, tfg: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(getAppendixByNumberAndTfgQuery, [
      number,
      tfg,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching appendix by number and TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}
