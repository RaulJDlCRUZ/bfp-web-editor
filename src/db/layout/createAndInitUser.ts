import pool from "../pool";

export async function createAndInitUser(userData, tfgData, basicInfoData) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert user data
    const userInsertQuery = `
        INSERT INTO users (user_id, email, name, password, lastname1, lastname2, technology, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

    const userResult = await client.query(userInsertQuery, [
      userData.user_id,
      userData.email,
      userData.name,
      userData.password,
      userData.lastname1,
      userData.lastname2,
      userData.technology,
      userData.phone,
    ]);

    // Insert tfg data
    const tfgInsertQuery = `
        INSERT INTO tfg (title, tutor, department, language, csl, month, year, student)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        RETURNING bfp_id;
        `;
    const tfgResult = await client.query(tfgInsertQuery, [
      tfgData.title,
      tfgData.tutor,
      tfgData.department,
      tfgData.language,
      tfgData.csl,
      tfgData.month,
      tfgData.year,
      userData.user_id, // user_id == the student
    ]);
    const bfp_id = tfgResult.rows[0].bfp_id;

    // Insert basic info data
    const basicInfoInsertQuery = `
        INSERT INTO basic_info (cfg_id, tfg, abstract, ack, autorship, dedications, resumen, bibliography)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
    const basicInfoResult = await client.query(basicInfoInsertQuery, [
      userData.user_id, // cfg_id == user_id FOR THE MOMENT
      bfp_id,
      basicInfoData.abstract,
      basicInfoData.ack,
      basicInfoData.autorship,
      basicInfoData.dedications,
      basicInfoData.resumen,
      basicInfoData.bibliography,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
