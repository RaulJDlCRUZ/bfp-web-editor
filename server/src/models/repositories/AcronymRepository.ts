import { BaseRepository } from "./BaseRepository";
import { Acronym, AcronymPk } from "../entities/Acronym";
import * as acronymQueries from "../../../database/queries/acronymQueries.js"; // Mantener referencia temporal

export class AcronymRepository extends BaseRepository<Acronym> {
  constructor() {
    super("acronyms");
  }

  async findById(id: number): Promise<Acronym | null> {
    throw new Error(
      "Acronym uses a complex PK. Please use findByAcronymAndTfg instead."
    );
  }

  async update(id: number, data: Partial<Acronym>): Promise<Acronym> {
    throw new Error(
      "Acronym uses a complex PK. Please use updateByAcronymPk instead."
    );
  }

  async delete(id: number): Promise<boolean> {
    throw new Error(
      "Acronym uses a complex PK. Please use deleteByAcronymAndTFG instead."
    );
  }

  async findByAcronymAndTfg(id: AcronymPk): Promise<Acronym | null> {
    const acronymId = {
      acronym: id.acronym,
      tfg: id.tfg,
    };
    const acronymFromDB = await acronymQueries.getAcronymByAcronymAndTfg(
      acronymId
    );
    if (!acronymFromDB || acronymFromDB.length === 0) {
      return null;
    }
    return Acronym.fromDbRow(acronymFromDB); // Convert the row to an Acronym instance
  }

  async findAll(tfg: number): Promise<Acronym[]> {
    const response = await acronymQueries.getAcronymsByTfg(tfg);
    if (!response || response.length === 0) {
      throw new Error(`No acronyms found for TFG ${tfg}.`);
    }
    const acronyms: Acronym[] = [];
    for (const row of response) {
      if (row) {
        const acronym = Acronym.fromDbRow(row); // Convert each row to an Acronym instance
        acronyms.push(acronym);
      }
    }
    return acronyms; // Return the array of Acronym instances
  }

  async create(data: Partial<Acronym>): Promise<Acronym> {
    // The acronym object includes TFG reference
    const acronymArray = data.toDbArray?.();
    if (!acronymArray || acronymArray.length === 0) {
      throw new Error("Invalid Acronym data provided for creation.");
    }
    // const filteredAcronymArray = acronymArray.filter((item) => item !== null);
    // return await acronymQueries.insertAcronym(filteredAcronymArray);
    const response: any = await acronymQueries.insertAcronym(acronymArray);
    if (!response) {
      throw new Error("Failed to create new acronym (no response from query).");
    }

    const acr = typeof response.acronym === "string" ? response.acronym : null;
    const tfg = typeof response.tfg === "number" ? response.tfg : null;

    if (acr === null || tfg === null) {
      throw new Error("Invalid response format: acronym or tfg is null.");
    }

    const id = new AcronymPk(acr, tfg);
    console.log("Created Acronym PK:", acr, tfg);

    const acronymFromDB = await acronymQueries.getAcronymByAcronymAndTfg(id);
    return Acronym.fromDbRow(acronymFromDB); // Convert the row to an Acronym instance
  }

  async updateByAcronymPk(
    id: AcronymPk,
    data: Partial<Acronym>
  ): Promise<Acronym> {
    const existingAcronym = await this.findByAcronymAndTfg(id);
    if (!existingAcronym) {
      throw new Error(`Acronym with ID ${id} not found for update.`);
    }

    const acrDataToUpd = {
      acronym: data.acronym || existingAcronym.acronym,
      meaning: data.meaning || existingAcronym.meaning,
    };

    const response: any = await acronymQueries.updateAcronym(id, acrDataToUpd);
    if (!response) {
      throw new Error("Failed to create new acronym (no response from query).");
    }

    const acr = typeof response.acronym === "string" ? response.acronym : null;
    const tfg = typeof response.tfg === "number" ? response.tfg : null;

    if (acr === null || tfg === null) {
      throw new Error("Invalid response format: acronym or tfg is null.");
    }

    const newAcrPk = new AcronymPk(acr, tfg);
    console.log("Updated Acronym PK:", acr, tfg);

    // At this point, the id exists so we can safely cast and return the Acronym object
    return (await this.findByAcronymAndTfg(newAcrPk)) as Acronym;
  }

  async deleteByAcronymAndTFG(id: AcronymPk): Promise<boolean> {
    await acronymQueries.deleteAcronym(id);
    return true;
  }
}
