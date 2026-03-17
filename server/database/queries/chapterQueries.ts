import pool from "../config/db.js";

const insertChapterQuery = `
  INSERT INTO chapters (chapter_id, ch_title, number, is_omitted, original_number, content, tfg)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING chapter_id;
`;

const getChaptersByTfgQuery = `
  SELECT * FROM chapters WHERE tfg = $1 ORDER BY number ASC;
`;

const getChapterByIdQuery = `
  SELECT * FROM chapters WHERE chapter_id = $1;
`;

const getChapterByNumberAndTfgQuery = `
  SELECT * FROM chapters WHERE number = $1 AND tfg = $2;
`;

const updateChapterContentQuery = `
  UPDATE chapters
  SET content = $2
  WHERE chapter_id = $1
  RETURNING chapter_id, content;
`;

const updateChapterNameQuery = `
  UPDATE chapters
  SET ch_title = $2
  WHERE chapter_id = $1
  RETURNING chapter_id, ch_title;
`;

const deleteChapterQuery = `
  DELETE FROM chapters
  WHERE chapter_id = $1
`;

export async function insertChapter(
  chapterArray: (number | string | null)[]
): Promise<number> {
  const client = await pool.connect();
  try {
    console.log(chapterArray);
    const result = await client.query(insertChapterQuery, chapterArray);
    if (result.rows.length === 0) {
      throw new Error("Failed to insert chapter, no rows returned.");
    }
    const newChapId: number = result.rows[0].chapter_id;
    return newChapId;
  } catch (error) {
    console.error("Error inserting chapter:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getChaptersByTfg(
  tfg: number
): Promise<(string | number | null)[][]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getChaptersByTfgQuery, [tfg]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching chapters by TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getChapterById(
  chapter_id: number
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getChapterByIdQuery, [chapter_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching chapter by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getChapterByNumberAndTfg(
  number: number,
  tfg: number
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(getChapterByNumberAndTfgQuery, [
      number,
      tfg,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching chapter by number and TFG:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateChapterContent(
  chapter_id: number,
  content: string
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateChapterContentQuery, [
      chapter_id,
      content,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating chapter content:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateChapterName(
  chapter_id: number,
  ch_title: string
): Promise<(string | number | null)[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(updateChapterNameQuery, [
      chapter_id,
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

export async function deleteChapter(chapter_id: number) {
  const client = await pool.connect();
  try {
    await client.query(deleteChapterQuery, [chapter_id]);
    return true;
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  } finally {
    client.release();
  }
}
