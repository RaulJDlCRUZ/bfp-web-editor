import { BaseRepository } from "./BaseRepository";
import { Image } from "../entities/Image";
import * as imageQueries from "../../../database/queries/imageQueries.js"; // Mantener referencia temporal
export class ImageRepository extends BaseRepository<Image> {
  constructor() {
    super("images");
  }

  async findAll(tfg: number): Promise<Image[]> {
    // Usar queries existentes temporalmente
    // return imageQueries.getAllImages(tfg);
    const response = await imageQueries.getAllImages(tfg);
    if (!response || response.length === 0) {
      throw new Error(`No images found for TFG ${tfg}.`);
    }
    const images: Image[] = [];
    for (const row of response) {
      if (row) {
        const image = Image.fromDbRow(row); // Convert each row to an Image instance
        images.push(image);
      }
    }
    return images; // Return the array of Image instances
  }

  async findById(id: number): Promise<Image | null> {
    // Usar queries existentes temporalmente
    // return imageQueries.getImageById(id);
    const imageFromDB = await imageQueries.getImageById(id);
    if (!imageFromDB || imageFromDB.length === 0) {
      return null; // No image found with the given ID
    }
    return Image.fromDbRow(imageFromDB); // Convert the row to an Image instance
  }

  async create(data: Partial<Image>): Promise<Image> {
    const imageArray = data.toDbArray?.();
    if (!imageArray || imageArray.length === 0) {
      throw new Error("Invalid Image data provided for creation.");
    }
    // return imageQueries.insertImage(imageArray);
    const newImgId = await imageQueries.insertImage(imageArray);
    if (!newImgId) {
      throw new Error("Failed to create new image (no response from query).");
    }
    const imageFromDB = await imageQueries.getImageById(newImgId);
    return Image.fromDbRow(imageFromDB); // Convert the row to an Image instance
  }

  /**
   * In case of images, the update method is used, mostly, to change the filename
   * and not the image content itself (but it could be extended to do so).
   * @param id
   * @param data with filename property (updated)
   * @returns Updated Image object
   * @throws Error if the filename is not provided or if the image with the given ID
   */
  async update(id: number, data: Partial<Image>): Promise<Image> {
    const filename = data.filename;
    if (!filename) {
      throw new Error("Filename is required for updating Image.");
    }
    const response = await imageQueries.updateImage(id, filename);
    if (!response) {
      throw new Error(`Image with ID ${id} not found for update.`);
    }
    const im: Image = data as Image;
    im.img_id = response;
    im.filename = filename;
    return im;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await imageQueries.deleteImage(id);
      return true; // Assuming deletion is successful, return true
    } catch (error) {
      console.error(`Error deleting image with ID ${id}:`, error);
      throw new Error(`Failed to delete image with ID ${id}.`);
    }
  }
}
