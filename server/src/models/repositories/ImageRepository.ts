import { BaseRepository } from "./BaseRepository";
import { Image } from "../entities/Image";
import * as imageQueries from "../../../database/queries/imageQueries.js"; // Mantener referencia temporal
export class ImageRepository extends BaseRepository<Image> {
  constructor() {
    super("images");
  }

  async findById(id: number): Promise<Image | null> {
    // Usar queries existentes temporalmente
    return imageQueries.getImageById(id);
  }

  async create(data: Partial<Image>): Promise<Image> {
    const imageArray = data.toDbArray?.();
    if (!imageArray || imageArray.length === 0) {
      throw new Error("Invalid Image data provided for creation.");
    }
    return imageQueries.insertImage(imageArray);
  }

  async update(id: number, data: Partial<Image>): Promise<Image> {
    throw new Error("Method not implemented.");
    // const filename = data.filename;
    // if (!filename) {
    //   throw new Error("Filename is required for updating Image.");
    // }
    // const response = await imageQueries.updateImage(id, filename);
    // if (!response) {
    //   throw new Error(`Image with ID ${id} not found for update.`);
    // }
    // const im: Image = data as Image;
    // im.img_id = response;
    // im.filename = filename;
    // return im;
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
