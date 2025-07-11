import pool from "../config/db.js";

const insertResourceQuery = `
  INSERT INTO images (filename, data, tfg)
  VALUES ($1, $2, $3)
  RETURNING img_id;
  `;

const getImageByIdQuery = `
  SELECT * FROM images WHERE img_id = $1;
  `;

const getAllImagesByTfgQuery = `
  SELECT * FROM images WHERE tfg = $1;
  `;

const updateResourceQuery = `
  UPDATE images
  SET filename = $2,
  WHERE img_id = $1
  RETURNING img_id;
  `;

const deleteResourceQuery = `
  DELETE FROM images WHERE img_id = $1;
  `;

export async function insertImage(
  imageArray: (number | string)[]
): Promise<number> {
  const client = await pool.connect();
  try {
    imageArray.shift(); // Remove the first element (img_id) if it exists (not needed for insert)
    if (imageArray.length < 3) {
      throw new Error("Insufficient data provided for image insertion.");
    }
    const result = await client.query(insertResourceQuery, imageArray);
    const img_id: number = result.rows[0].img_id;
    if (!img_id) {
      throw new Error("Failed to insert image, img_id is null.");
    }
    return img_id;
  } catch (error) {
    console.error("Error inserting image:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getImageById(
  img_id: number
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getImageByIdQuery, [img_id]);
    if (result.rows.length === 0) {
      throw new Error(`Image with ID ${img_id} not found.`);
    }
    return result.rows[0]; // Return the first row as an array
  } catch (error) {
    console.error("Error fetching image by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllImages(
  tfg: number
): Promise<(string | number | null)[][]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getAllImagesByTfgQuery, [tfg]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching all images for TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateImage(
  img_id: number,
  filename: string
): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateResourceQuery, [img_id, filename]);
    const updatedImgId: number = result.rows[0].img_id;
    if (!updatedImgId) {
      throw new Error(`Failed to update image with ID ${img_id}.`);
    }
    return updatedImgId;
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteImage(img_id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(deleteResourceQuery, [img_id]);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  } finally {
    client.release();
  }
}
