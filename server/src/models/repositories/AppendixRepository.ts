import { BaseRepository } from "./BaseRepository";
import { Appendix } from "../entities/Appendix";
import * as appendixQueries from "../../../database/queries/appendixQueries.js"; // Mantener referencia temporal

export class AppendixRepository extends BaseRepository<Appendix> {
  constructor() {
    super("appendices");
  }

  async findById(id: number): Promise<Appendix | null> {
    // Usar queries existentes temporalmente
    return appendixQueries.getAppendixById(id);
  }

  async create(data: Partial<Appendix>): Promise<Appendix> {
    const appendixArray = data.toDbArray?.();
    if (!appendixArray || appendixArray.length === 0) {
      throw new Error("Invalid Appendix data provided for creation.");
    }
    const filteredAppendixArray = appendixArray.filter((item) => item !== null);
    return appendixQueries.insertAppendix(filteredAppendixArray);
  }

  async update(id: number, data: Partial<Appendix>): Promise<Appendix> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
