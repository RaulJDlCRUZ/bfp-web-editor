import { BaseRepository } from "./BaseRepository";
import { Chapter } from "../entities/Chapter";
import * as chapterQueries from "../../../database/queries/chapterQueries.js"; // Mantener referencia temporal

export class ChapterRepository extends BaseRepository<Chapter> {
  constructor() {
    super("chapters");
  }

  async findById(id: number): Promise<Chapter | null> {
    // Usar queries existentes temporalmente
    const chapterfromDB = await chapterQueries.getChapterById(id);
    if (!chapterfromDB) {
      return null; // No chapter found with the given ID
    }
    return Chapter.fromDbRow(chapterfromDB); // Convert the row to a Chapter
  }

  async findAll(tfgId: number): Promise<Chapter[]> {
    // Usar queries existentes temporalmente
    const response = await chapterQueries.getChaptersByTfg(tfgId);
    const chapters: Chapter[] = [];
    for (const i of response) {
      if (i) {
        const chapter = Chapter.fromDbRow(i); // Convert each row to a Chapter instance
        chapters.push(chapter);
      }
    }
    return chapters; // Return the array of Chapter instances
  }

  async create(data: Partial<Chapter>): Promise<Chapter> {
    const chapterArray = data.toDbArray?.();
    if (!chapterArray || chapterArray.length === 0) {
      throw new Error("Invalid Chapter data provided for creation.");
    }
    const newChapId = await chapterQueries.insertChapter(chapterArray);
    if (!newChapId) {
      throw new Error("Failed to create new chapter (no response from query).");
    }
    console.log("Chapter inserted with ID:", newChapId);
    const chapterFromDB = await chapterQueries.getChapterById(newChapId);
    return Chapter.fromDbRow(chapterFromDB); // Convert the row to a Chapter instance
  }

  async update(id: number, data: Partial<Chapter>): Promise<Chapter> {
    let existingChapter = await this.findById(id);
    if (!existingChapter) {
      throw new Error(`Chapter with ID ${id} not found for update.`);
    }
    /* Step 1: Check if the Chapter Title has changed */
    if (data.ch_title && data.ch_title !== existingChapter.ch_title) {
      const response = await chapterQueries.updateChapterName(
        id,
        data.ch_title
      );
      if (!response) {
        throw new Error(`Chapter with ID ${id} not found for update.`);
      }
      existingChapter.ch_title = data.ch_title; // Update the title in the existing instance
    }
    existingChapter = await this.findById(id); // Refresh the existing chapter instance
    if (!existingChapter) {
      throw new Error(`Chapter with ID ${id} not found after update.`);
    }
    /* Step 2: Check if the Chapter Content has changed */
    const content = data.content ? data.content : "";
    if (content === existingChapter.content) {
      // If the content has not changed, we can skip the update
      return existingChapter; // Return the existing instance without changes
    }
    const response = await chapterQueries.updateChapterContent(id, content);
    if (!response) {
      throw new Error(`Chapter with ID ${id} not found for update.`);
    }
    existingChapter = await this.findById(id); // Refresh the existing chapter instance
    if (!existingChapter) {
      throw new Error(`Chapter with ID ${id} not found after update.`);
    }
    return existingChapter; // Return the updated chapter instance
  }

  async delete(id: number): Promise<boolean> {
    const response = await chapterQueries.deleteChapter(id);
    if (!response) {
      throw new Error(`Chapter with ID ${id} not found for deletion.`);
    }
    return true; // Assuming the delete operation returns true on success
  }
}
