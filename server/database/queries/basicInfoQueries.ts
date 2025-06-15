import pool from "../config/pool";

const insertBasicInfoQuery = `
  INSERT INTO basic_info (tfg, cfg_id, abstract, acknowledgements, authorship, dedication, resumen, bibliography)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING tfg, cfg_id;
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

export async function insertBasicInfo(basicInfoArray: (number | string)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertBasicInfoQuery, basicInfoArray);
    return result.rows[0].tfg; // Return tfg as strong key
  } catch (error) {
    console.error("Error inserting basic info:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getBasicInfoByTfg(tfg: number) {
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

export async function updateAbstract(tfg: number, abstract: string) {
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
) {
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

export async function updateAuthorship(tfg: number, authorship: string) {
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

export async function updateDedication(tfg: number, dedication: string) {
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

export async function updateResumen(tfg: number, resumen: string) {
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

export async function updateBibliography(tfg: number, bibliography: string) {
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
