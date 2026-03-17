import { BaseService } from "./BaseService";

import { BasicInfoRepository } from "../models/repositories/BasicInfoRepository";
import { BasicInfo } from "../models/entities/BasicInfo";

import fs from "fs/promises";
import path from "path";

export class BasicInfoService extends BaseService<BasicInfo> {
  private basicInfoRepository: BasicInfoRepository;

  constructor() {
    super(new BasicInfoRepository());
    this.basicInfoRepository = new BasicInfoRepository();
  }

  async readSetupFiles(dir: string): Promise<Record<string, any>> {
    const basicInfo: Record<string, any> = {};
    // In alphabetical order
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const content = await fs.readFile(path.join(dir, file), "utf-8");
        // Store the setup file data in the object with its name as key
        basicInfo[file.split(".")[0]] = content;
      } else {
        // If it's not a markdown file, we can skip it or handle it differently
        console.warn(`Skipping non-markdown file: ${file}`);
      }
    }
    return basicInfo;
  }

  async readBibFile(bib_dir: string): Promise<string> {
    try {
      const bibContent = await fs.readFile(
        path.join(bib_dir, "bibliography.bib"),
        "utf-8"
      );
      return bibContent;
    } catch (error) {
      console.error("Error reading bibliography file:", error);
      throw new Error("Failed to read bibliography file");
    }
  }

  async createBasicInfo(data: Partial<BasicInfo>): Promise<BasicInfo> {
    const basicInfo = await this.basicInfoRepository.create(data);
    if (!basicInfo) {
      throw new Error("Failed to create basic information");
    }
    return basicInfo;
  }

  async getBasicInfoById(id: number): Promise<BasicInfo | null> {
    const basicInfo = await this.basicInfoRepository.findById(id);
    if (!basicInfo) {
      throw new Error(`Basic information with ID ${id} not found`);
    }
    return basicInfo;
  }

  async updateBasicInfo(
    id: number,
    data: Partial<BasicInfo>
  ): Promise<BasicInfo> {
    const updatedInfo = await this.basicInfoRepository.update(id, data);
    if (!updatedInfo) {
      throw new Error("Failed to update basic information");
    }
    return updatedInfo;
  }

  async deleteBasicInfo(id: number): Promise<boolean> {
    const deleted = await this.basicInfoRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete basic information with ID ${id}`);
    }
    return deleted;
  }
}
