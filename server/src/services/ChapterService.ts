import { BaseService } from "./BaseService";

import { ChapterRepository } from "../models/repositories/ChapterRepository";
import { Chapter } from "../models/entities/Chapter";

export class ChapterService extends BaseService<Chapter> {
  private chapterRepository: ChapterRepository;

  constructor() {
    super(new ChapterRepository());
    this.chapterRepository = new ChapterRepository();
  }

  async findAll(tfg: number): Promise<Chapter[]> {
    return await this.chapterRepository.findAll(tfg);
  }

  async findById(id: number): Promise<Chapter | null> {
    return await this.chapterRepository.findById(id);
  }

  async create(data: Partial<Chapter>): Promise<Chapter> {
    return await this.chapterRepository.create(data);
  }

  async update(id: number, data: Partial<Chapter>): Promise<Chapter> {
    const existingChapter = await this.chapterRepository.findById(id);
    if (!existingChapter) {
      throw new Error(`Appendix with ID ${id} not found for update.`);
    }
    return await this.chapterRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return await this.chapterRepository.delete(id);
  }
}
