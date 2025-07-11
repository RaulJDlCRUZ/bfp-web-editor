import pool from "../config/db.js";

const insertBasicInfoQuery = `
  INSERT INTO basic_info (tfg, cfg_id, abstract, acknowledgements, authorship, dedication, resumen, bibliography)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING tfg;
`;

const getTfgByCfgIdQuery = `
  SELECT tfg FROM basic_info WHERE cfg_id = $1;
`;

const getBasicInfoByTfgQuery = `
  SELECT * FROM basic_info WHERE tfg = $1;
`;

const updateAbstractQuery = `
  UPDATE basic_info
  SET abstract = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateAcknowledgementsQuery = `
  UPDATE basic_info
  SET acknowledgements = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateAuthorshipQuery = `
  UPDATE basic_info
  SET authorship = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateDedicationQuery = `
  UPDATE basic_info
  SET dedication = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateResumenQuery = `
  UPDATE basic_info
  SET resumen = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateBibliographyQuery = `
  UPDATE basic_info
  SET bibliography = $2
  WHERE tfg = $1
  RETURNING tfg;
`;

const updateAllBasicInfoQuery = `
  UPDATE basic_info
  SET cfg_id = $2, abstract = $3, acknowledgements = $4,
      authorship = $5, dedication = $6, resumen = $7, bibliography = $8
  WHERE tfg = $1
  RETURNING tfg;
`;

const removeBasicInfoQuery = `
  DELETE FROM basic_info WHERE tfg = $1
  RETURNING tfg;
`;

export async function insertBasicInfo(
  basicInfoArray: (number | string)[]
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(insertBasicInfoQuery, basicInfoArray);
    if (result.rows.length === 0) {
      throw new Error("Failed to insert basic info, no rows returned.");
    }
    const tfg: number = result.rows[0].tfg;
    return tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error inserting basic info:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTfgByCfgId(cfg_id: string): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(getTfgByCfgIdQuery, [cfg_id]);
    if (result.rows.length === 0) {
      throw new Error(`No TFG found for CFG ID: ${cfg_id}`);
    }
    const tfg: number = result.rows[0].tfg;
    return tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error fetching TFG by CFG ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getBasicInfoByTfg(
  tfg: number
): Promise<(string | number | null) | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(getBasicInfoByTfgQuery, [tfg]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching basic info by TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAbstract(
  tfg: number,
  abstract: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAbstractQuery, [tfg, abstract]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating abstract:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAcknowledgements(
  tfg: number,
  acknowledgements: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAcknowledgementsQuery, [
      tfg,
      acknowledgements,
    ]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating acknowledgements:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAuthorship(
  tfg: number,
  authorship: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAuthorshipQuery, [tfg, authorship]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating authorship:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateDedication(
  tfg: number,
  dedication: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateDedicationQuery, [tfg, dedication]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating dedication:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateResumen(
  tfg: number,
  resumen: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateResumenQuery, [tfg, resumen]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating resumen:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateBibliography(
  tfg: number,
  bibliography: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateBibliographyQuery, [
      tfg,
      bibliography,
    ]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating bibliography:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAllBasicInfo(
  tfg: number,
  cfg_id: string,
  abstract: string | null,
  acknowledgements: string | null,
  authorship: string | null,
  dedication: string | null,
  resumen: string | null,
  bibliography: string | null
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateAllBasicInfoQuery, [
      tfg,
      cfg_id,
      abstract,
      acknowledgements,
      authorship,
      dedication,
      resumen,
      bibliography,
    ]);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error updating all basic info:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function removeBasicInfo(tfg: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(removeBasicInfoQuery, [tfg]);
    return true;
  } catch (error) {
    console.error("Error removing basic info:", error);
    throw error;
  } finally {
    client.release();
  }
}
