import { BaseRepository } from "./BaseRepository";
import { Chapter } from "../entities/Chapter";
import * as chapterQueries from "../../../database/queries/chapterQueries.js"; // Mantener referencia temporal

export class ChapterRepository extends BaseRepository<Chapter> {
  constructor() {
    super("chapters");
  }

  async findById(id: number): Promise<Chapter | null> {
    // Usar queries existentes temporalmente
    return chapterQueries.getChapterById(id);
  }

  async create(data: Partial<Chapter>): Promise<Chapter> {
    const chapterArray = data.toDbArray?.();
    if (!chapterArray || chapterArray.length === 0) {
      throw new Error("Invalid Chapter data provided for creation.");
    }
    return chapterQueries.insertChapter(chapterArray);
  }

  async update(id: number, data: Partial<Chapter>): Promise<Chapter> {
    throw new Error("Method not implemented.");
    // const content = data.content ? data.content : "";
    // const response = await chapterQueries.updateChapterContent(id, content);
    // if (!response) {
    //   throw new Error(`Chapter with ID ${id} not found for update.`);
    // }
    // const chapter: Chapter = data as Chapter;
    // chapter.chapter_id = response.chapter_id;
    // chapter.content = content;
    // return chapter;
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
