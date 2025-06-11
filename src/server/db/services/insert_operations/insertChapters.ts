import { PoolClient } from "pg";
import { insertChapterQuery } from "@db/queries/chapterQueries";

export async function insertOneChapter(
  client: PoolClient,
  chapter: { title: string; content: string },
  number: number,
  bfp_id: number
): Promise<void> {
  try {
    console.log("insert one chapter: ", chapter);
    const chapter_id = (
      bfp_id +
      "_ch_" +
      chapter.title.toLowerCase().replace(/\s+/g, "_")
    ).slice(0, 64);
    const chapterData = [
      chapter_id,
      chapter.title,
      10 * number, // This will help to swap values
      chapter.content,
      bfp_id,
    ];
    await client.query(insertChapterQuery, chapterData);
    console.log("OK, chapter inserted: ", number, chapter.title);
  } catch (error) {
    console.error("Error inserting chapter:", number, chapter.title, error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

/**
 *
 * @param client
 * @param chapters
 * @param bfp_id
 *
 * Inserts multiple chapters into the database. Every chapter is an object with a number as the key and an object containing title and content as the value.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the insertion of any chapter.
 * @description Every number must be parsed into a flat string, a we know Record[0] is the number. Then, we parse it into an integer.
 */
export async function insertChapters(
  client: PoolClient,
  chapters: Array<Record<number, { title: string; content: string }>>,
  bfp_id: number
): Promise<void> {
  for (const chapter of chapters) {
    const number = parseInt(String(Object.values(chapter)[0])); // Extract the key as the chapter number
    const chapterData = Object.values(chapter)[1]; // Access the value directly using the key
    try {
      await insertOneChapter(client, chapterData, number, bfp_id);
    } catch (error) {
      console.error(
        "Error inserting chapters. Stopping execution at chapter:",
        number,
        chapterData.title,
        error
      );
    }
  }
}
