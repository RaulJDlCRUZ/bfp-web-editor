import { BaseRepository } from "./BaseRepository";
import { TFG } from "../entities/Tfg";
import * as tfgQueries from "../../../database/queries/tfgQueries.js"; // Mantener referencia temporal

export class TfgRepository extends BaseRepository<TFG> {
  constructor() {
    super("tfg");
  }

  async findById(id: number): Promise<TFG | null> {
    // Usar queries existentes temporalmente
    return tfgQueries.getTfgById(id);
  }

  async create(data: Partial<TFG>): Promise<TFG> {
    const tfgArray = data.toDbArray?.();
    if (!tfgArray || tfgArray.length === 0) {
      throw new Error("Invalid TFG data provided for creation.");
    }
    return tfgQueries.insertTfg(tfgArray);
  }

  async update(id: number, data: Partial<TFG>): Promise<TFG> {
    // Implementar lógica de actualización aquí
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
