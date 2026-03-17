import pool from "../config/db.js";

const insertAppendixQuery = `
  INSERT INTO appendices (appx_id, ap_title, number, is_omitted, original_number, content, tfg)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
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

const updateAppendixContentQuery = `
  UPDATE appendices
  SET content = $2
  WHERE appx_id = $1
  RETURNING appx_id, content;
`;

const updateAppendixNameQuery = `
  UPDATE appendices
  SET ap_title = $2
  WHERE appx_id = $1
  RETURNING appx_id, ap_title;
`;

const deleteAppendixQuery = `
  DELETE FROM appendices
  WHERE appx_id = $1
`;

export async function insertAppendix(
  appendixArray: (number | string | null)[]
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(insertAppendixQuery, appendixArray);
    if (result.rows.length === 0) {
      throw new Error("Failed to insert appendix, no rows returned.");
    }
    const newAppxId: number = result.rows[0].appx_id;
    return newAppxId;
  } catch (error) {
    console.error("Error inserting appendix:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAppendicesByTfg(
  tfg: number
): Promise<(string | number | null)[][]> {
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

export async function getAppendixById(
  appx_id: number
): Promise<(string | number | null)[]> {
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

export async function getAppendixByNumberAndTfg(
  number: number,
  tfg: number
): Promise<(string | number | null)[]> {
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

export async function updateAppendixContent(
  appx_id: number,
  content: string
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAppendixContentQuery, [
      appx_id,
      content,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating appendix content:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAppendixName(
  appx_id: number,
  ch_title: string
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAppendixNameQuery, [
      appx_id,
      ch_title,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating chapter name:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAppendix(appx_id: number) {
  const client = await pool.connect();
  try {
    await client.query(deleteAppendixQuery, [appx_id]);
    return true;
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  } finally {
    client.release();
  }
}
