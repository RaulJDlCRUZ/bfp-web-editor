import pool from "../config/pool.js";

const insertChapterQuery = `
  INSERT INTO chapters (chapter_id, ch_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING chapter_id;
`;

const getChaptersByTfgQuery = `
  SELECT * FROM chapters WHERE tfg = $1 ORDER BY number ASC;
`;

const getChapterByIdQuery = `
  SELECT content FROM chapters WHERE chapter_id = $1;
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

export async function insertChapter(chapterArray: (number | string)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertChapterQuery, chapterArray);
    return result.rows[0].chapter_id;
  } catch (error) {
    console.error("Error inserting chapter:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getChaptersByTfg(tfg: number) {
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

export async function getChapterById(chapter_id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getChapterByIdQuery, [chapter_id]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching chapter by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateChapterContent(
  chapter_id: number,
  content: string
) {
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

export async function updateChapterName(chapter_id: number, ch_title: string) {
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
