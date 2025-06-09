import { PoolClient } from "pg";
import { insertChapterQuery } from "@db/queries/chapterQueries";

export async function insertOneChapter(
  client: PoolClient,
  chapter: { title: string; content: string },
  number: number,
  bfp_id: number
): Promise<void> {
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
  // console.log("Inserting chapter data:", chapterData);
  await client.query(insertChapterQuery, chapterData);
  console.log("OK, chapter inserted: ", number, chapter.title);
}

export async function insertChapters(
  client: PoolClient,
  chapter: Array<{ title: string; content: string }>,
  bfp_id: number
): Promise<void> {
  chapter.forEach(async (chapterData, number) => {
    await insertOneChapter(client, chapterData, number, bfp_id);
  });
}
