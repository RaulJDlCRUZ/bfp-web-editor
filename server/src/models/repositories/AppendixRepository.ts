import { BaseRepository } from "./BaseRepository";
import { Appendix } from "../entities/Appendix";
import * as appendixQueries from "../../../database/queries/appendixQueries.js"; // Mantener referencia temporal

export class AppendixRepository extends BaseRepository<Appendix> {
  constructor() {
    super("appendices");
  }

  async findById(id: number): Promise<Appendix | null> {
    // Usar queries existentes temporalmente
    const appendixfromDB = await appendixQueries.getAppendixById(id);
    if (!appendixfromDB) {
      return null; // No appendix found with the given ID
    }
    return Appendix.fromDbRow(appendixfromDB); // Convert the row to an Appendix
  }

  async findAll(tfgId: number): Promise<Appendix[]> {
    // Usar queries existentes temporalmente
    const response = await appendixQueries.getAppendicesByTfg(tfgId);
    const appendices: Appendix[] = [];
    for (const i of response) {
      if (i) {
        const appendix = Appendix.fromDbRow(i); // Convert each row to an Appendix instance
        appendices.push(appendix);
      }
    }
    return appendices; // Return the array of Appendix instances
  }

  async create(data: Partial<Appendix>): Promise<Appendix> {
    const appendixArray = data.toDbArray?.();
    if (!appendixArray || appendixArray.length === 0) {
      throw new Error("Invalid Appendix data provided for creation.");
    }
    const newAppxId = await appendixQueries.insertAppendix(appendixArray);
    if (!newAppxId) {
      throw new Error(
        "Failed to create new appendix (no response from query)."
      );
    }
    const appendixFromDB = await appendixQueries.getAppendixById(newAppxId);
    return Appendix.fromDbRow(appendixFromDB); // Convert the row to an Appendix instance
  }

  async update(id: number, data: Partial<Appendix>): Promise<Appendix> {
    let existingAppendix = await this.findById(id);
    if (!existingAppendix) {
      throw new Error(`Appendix with ID ${id} not found for update.`);
    }
    /* Step 1: Check if the Appendix Title has changed */
    if (data.ap_title && data.ap_title !== existingAppendix.ap_title) {
      const response = await appendixQueries.updateAppendixName(
        id,
        data.ap_title
      );
      if (!response) {
        throw new Error(`Appendix with ID ${id} not found for update.`);
      }
      existingAppendix = await this.findById(id); // Refresh the existingAppendix object
      if (!existingAppendix) {
        throw new Error(`Appendix with ID ${id} not found after update.`);
      }
    }
    /* Step 2: Check if the content has changed */
    const content = data.content ? data.content : "";
    if (content === existingAppendix.content) {
      // If the content has not changed, we can skip the update
      return existingAppendix;
    }
    const response = await appendixQueries.updateAppendixContent(id, content);
    if (!response) {
      throw new Error(`Appendix with ID ${id} not found for update.`);
    }

    existingAppendix = await this.findById(id); // Refresh the existingAppendix object
    if (!existingAppendix) {
      throw new Error(`Appendix with ID ${id} not found after content update.`);
    }
    return existingAppendix; // Return the updated Appendix instance
  }

  async delete(id: number): Promise<boolean> {
    const response = await appendixQueries.deleteAppendix(id);
    if (!response) {
      throw new Error(`Appendix with ID ${id} not found for deletion.`);
    }
    return true; // Return true if the deletion was successful
  }
}
