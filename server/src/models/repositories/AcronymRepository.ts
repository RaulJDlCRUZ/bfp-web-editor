import { BaseRepository } from "./BaseRepository";
import { Acronym } from "../entities/Acronym";
import * as acronymQueries from "../../../database/queries/acronymQueries.js"; // Mantener referencia temporal

export class AcronymRepository extends BaseRepository<Acronym> {
  constructor() {
    super("acronyms");
  }

  async findById(id: number): Promise<Acronym | null> {
    return acronymQueries.getAcronymById(id);
  }

  async findByAcronymAndTfg(
    acronym: string,
    tfg: number
  ): Promise<Acronym | null> {
    return acronymQueries.getAcronymByAcronymAndTfg(acronym, tfg);
  }

  async create(data: Partial<Acronym>): Promise<Acronym> {
    const acronymArray = data.toDbArray?.();
    if (!acronymArray || acronymArray.length === 0) {
      throw new Error("Invalid Acronym data provided for creation.");
    }
    const filteredAcronymArray = acronymArray.filter((item) => item !== null);
    return await acronymQueries.insertAcronym(filteredAcronymArray);
  }

  update(id: number, data: Partial<Acronym>): Promise<Acronym> {
    throw new Error("Method not implemented.");
  }
  async delete(id: number): Promise<boolean> {
    await acronymQueries.deleteAcronym(id);
    return true;
  }
}
