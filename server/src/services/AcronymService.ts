import { BaseService } from "./BaseService";
import { AcronymRepository } from "../models/repositories/AcronymRepository";
import { Acronym, AcronymPk } from "../models/entities/Acronym";

export class AcronymService extends BaseService<Acronym> {
  private acronymRepository: AcronymRepository;

  constructor() {
    super(new AcronymRepository());
    this.acronymRepository = new AcronymRepository();
  }

  /**
   * Parses the content of an acronym file and returns an object
   * @param content - The content of the acronym file as a string.
   * The file is expected to have lines in the format "ACRONYM: Definition".
   * @returns An object where keys are acronyms and values are their definitions.
   */
  parseAcronymFile(content: string): Record<string, string> {
    const splitChar: string = ": ";
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    const acronyms: Record<string, string> = {};

    for (const line of lines) {
      const [acronym, definition] = line.split(splitChar);
      if (acronym && definition) {
        // Clean up the acronym and definition
        const cleanedAcronym = acronym.trim().toUpperCase();
        const cleanedDefinition = definition.trim();
        acronyms[cleanedAcronym] = cleanedDefinition;
      }
    }

    return acronyms;
  }

  async findById(id: AcronymPk): Promise<Acronym | null> {
    return await this.acronymRepository.findByAcronymAndTfg(id);
  }

  async findAll(tfg: number): Promise<Acronym[]> {
    return await this.acronymRepository.findAll(tfg);
  }

  async createNewAcronym(data: Acronym): Promise<Acronym> {
    if (!data.isComplete()) {
      throw new Error("Acronym data is incomplete (CHECK VALIDATION).");
    }

    const response = await this.acronymRepository.create(data);
    if (!response || (!response.acronym && !response.tfg)) {
      throw new Error("Failed to create new acronym.");
    }

    console.log(
      `New acronym created: TFG: ${data.tfg}, Acronym: ${data.acronym}`
    );
    return data;
  }

  async update(data: Acronym): Promise<Acronym> {
    try {
      const acrPk = data.id || new AcronymPk(data.acronym, data.tfg);
      if (!acrPk.isComplete()) {
        throw new Error("Acronym data is incomplete (CHECK VALIDATION).");
      }

      const existingAcronym = await this.acronymRepository.findByAcronymAndTfg(
        acrPk
      );
      if (!existingAcronym) {
        throw new Error(`Acronym ${data.acronym} not found for update.`);
      }

      const updatedAcronym = await this.acronymRepository.updateByAcronymPk(
        acrPk,
        data
      );

      if (!updatedAcronym) {
        throw new Error(`Failed to update acronym with TFG ${data.tfg}.`);
      }

      return updatedAcronym;
    } catch (error) {
      console.error("Error updating acronym:", error);
      throw new Error(`Failed to update acronym: ${error}`);
    }
  }

  async deleteById(id: AcronymPk): Promise<boolean> {
    try {
      const existingAcronym = await this.acronymRepository.findByAcronymAndTfg(
        id
      );
      if (!existingAcronym) {
        throw new Error(`Acronym with ID ${id} not found for deletion.`);
      }

      const deleted = await this.acronymRepository.deleteByAcronymAndTFG(id);
      if (!deleted) {
        throw new Error(`Failed to delete acronym with ID ${id}.`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting acronym:", error);
      throw new Error(`Failed to delete acronym: ${error}`);
    }
  }
}
