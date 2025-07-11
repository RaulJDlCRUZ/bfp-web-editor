import { BaseService } from "./BaseService";
import { ImageRepository } from "../models/repositories/ImageRepository";
import { Image } from "../models/entities/Image";

import fs from "fs/promises";
import path from "path";

export class ImageService extends BaseService<Image> {
  private imageRepository: ImageRepository;

  constructor() {
    super(new ImageRepository());
    this.imageRepository = new ImageRepository();
  }

  /**
   *
   * @param res_path The path to the resources directory containing image files.
   * @returns A record where keys are filenames and values are the raw binary content of the files.
   */
  async readResources(res_path: string): Promise<Record<string, any>> {
    const resources: Record<string, any> = {};
    const files = await fs.readdir(res_path);
    for (const file of files) {
      const filePath = path.join(res_path, file);
      try {
        const content = await fs.readFile(filePath);
        resources[file] = content; // Store the raw binary content of the file
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
    return resources;
  }

  async findById(id: number): Promise<Image | null> {
    return await this.imageRepository.findById(id);
  }

  async createNewImage(data: Partial<Image>): Promise<Image> {
    // if (!data.isComplete()) {
    //   throw new Error("Image data is incomplete (CHECK VALIDATION).");
    // }

    const response = await this.imageRepository.create(data);
    if (!response || !response.img_id) {
      throw new Error("Failed to create new image.");
    }

    console.log(`New image created with file: ${data.filename}`);
    return response;
  }

  async getAllImages(tfg: number): Promise<Image[]> {
    return await this.imageRepository.findAll(tfg);
  }
}
