import { BaseRepository } from "./BaseRepository";
import { BasicInfo } from "../entities/BasicInfo";
import * as basicInfoQueries from "../../../database/queries/basicInfoQueries.js"; // Mantener referencia temporal

export class BasicInfoRepository extends BaseRepository<BasicInfo> {
  constructor() {
    super("basic_info");
  }

  async findById(id: number): Promise<BasicInfo | null> {
    // Usar queries existentes temporalmente
    return basicInfoQueries.getBasicInfoByTfg(id);
  }

  async create(data: Partial<BasicInfo>): Promise<BasicInfo> {
    const basicInfoArray = data.toDbArray?.();
    if (!basicInfoArray || basicInfoArray.length === 0) {
      throw new Error("Invalid BasicInfo data provided for creation.");
    }
    const filteredBasicInfoArray = basicInfoArray.filter(
      (item) => item !== null
    );
    return basicInfoQueries.insertBasicInfo(filteredBasicInfoArray);
  }

  async update(id: number, data: Partial<BasicInfo>): Promise<BasicInfo> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
