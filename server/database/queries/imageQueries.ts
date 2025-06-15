import pool from "../config/pool.js";

const insertResourceQuery = `
  INSERT INTO images (filename, data, tfg)
  VALUES ($1, $2, $3)
  RETURNING img_id;
  `;

const getImageByIdQuery = `
  SELECT * FROM images WHERE img_id = $1;
  `;

const updateResourceQuery = `
  UPDATE images
  SET filename = $2,
  WHERE img_id = $1
  RETURNING img_id;
  `;

export async function insertImage(imageArray: (number | string)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertResourceQuery, imageArray);
    return result.rows[0].img_id;
  } catch (error) {
    console.error("Error inserting image:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getImageById(img_id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getImageByIdQuery, [img_id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateImage(img_id: number, filename: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(updateResourceQuery, [img_id, filename]);
    return Number(result.rows[0].img_id);
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  } finally {
    client.release();
  }
}
