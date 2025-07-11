import { BaseRepository } from "./BaseRepository";
import { Tfg } from "../entities/Tfg";
import * as tfgQueries from "../../../database/queries/tfgQueries.js"; // Mantener referencia temporal

export class TfgRepository extends BaseRepository<Tfg> {
  constructor() {
    super("tfg");
  }

  async findById(id: number): Promise<Tfg | null> {
    // Usar queries existentes temporalmente
    const tfgFromDB = await tfgQueries.getTfgById(id);
    if (!tfgFromDB) {
      return null; // No TFG found with the given ID
    }
    return Tfg.fromDbRow(tfgFromDB); // Convert the row to a Tfg instance
  }

  async findByUserId(userId: number): Promise<Tfg> {
    const tfgFromDB = await tfgQueries.getTfgByUserId(userId);
    if (!tfgFromDB) {
      throw new Error(`TFG with user ID ${userId} not found.`);
    }
    return Tfg.fromDbRow(tfgFromDB); // Convert the row to a Tfg instance
  }

  async create(data: Partial<Tfg>): Promise<Tfg> {
    const tfgArray = data.toDbArray?.();
    if (!tfgArray || tfgArray.length === 0) {
      throw new Error("Invalid TFG data provided for creation.");
    }

    const response = await tfgQueries.insertTfg(tfgArray?.slice(1)); // Exclude bfp_id from the array (bfp_id is auto-generated)
    if (!response) {
      throw new Error("Failed to create new TFG (no response from query).");
    }

    console.log(response);

    const bfpId = parseInt(response.toString());
    if (isNaN(bfpId)) {
      throw new Error("Failed to create new TFG (response is NaN).");
    }

    const tfgFromDB = await tfgQueries.getTfgById(bfpId);
    return Tfg.fromDbRow(tfgFromDB); // Convert the row to a Tfg instance
  }

  async update(id: number, data: Partial<Tfg>): Promise<Tfg> {
    const existingTfg = await this.findById(id);
    if (!existingTfg) {
      throw new Error(`TFG with ID ${id} not found for update.`);
    }
    const dataArr = [
      data.title || existingTfg.title,
      data.subtitle || existingTfg.subtitle,
      data.tutor || existingTfg.tutor,
      data.cotutor || existingTfg.cotutor,
      data.department || existingTfg.department,
      data.language || existingTfg.language,
      data.csl || existingTfg.csl,
      data.month || existingTfg.month,
      data.year || parseInt(existingTfg.year.toString()),
      existingTfg.student, // userId remains unchanged
      existingTfg.bfp_id, // bfp_id remains unchanged
    ].map((value) => (value === undefined ? null : value));

    const response = await tfgQueries.updateTfg(id, dataArr);
    if (!response) {
      throw new Error(`TFG with ID ${id} not found for update.`);
    }
    // At this point, the id exists so we can safely cast and return the Tfg object
    return (await this.findById(id)) as Tfg;
  }

  async updateCsl(id: number, csl: string): Promise<Tfg> {
    const existingTfg = await this.findById(id);
    if (!existingTfg) {
      throw new Error(`TFG with ID ${id} not found for CSL update.`);
    }

    const response = await tfgQueries.updateCsl(id, csl);
    if (!response) {
      throw new Error(`TFG with ID ${id} not found for CSL update.`);
    }

    return (await this.findById(id)) as Tfg;
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
