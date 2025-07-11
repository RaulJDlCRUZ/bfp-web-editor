import { BaseRepository } from "./BaseRepository";
import { BasicInfo } from "../entities/BasicInfo";
import * as basicInfoQueries from "../../../database/queries/basicInfoQueries.js"; // Mantener referencia temporal

export class BasicInfoRepository extends BaseRepository<BasicInfo> {
  constructor() {
    super("basic_info");
  }

  async findById(id: number): Promise<BasicInfo | null> {
    // Usar queries existentes temporalmente
    const basicInfofromDB = await basicInfoQueries.getBasicInfoByTfg(id);
    if (!basicInfofromDB) {
      return null;
    }
    return BasicInfo.fromDbRow(basicInfofromDB); // Convert the row to a BasicInfo instance
  }

  async create(data: Partial<BasicInfo>): Promise<BasicInfo> {
    const basicInfoArray = data.toDbArray?.();
    if (!basicInfoArray || basicInfoArray.length === 0) {
      throw new Error("Invalid BasicInfo data provided for creation.");
    }
    if (
      basicInfoArray.some(
        (value) => value === null || value === undefined || value === ""
      )
    ) {
      throw new Error("BasicInfo data contains empty or invalid values.");
    }

    const filteredBasicInfoArray = basicInfoArray.filter(
      (value) => value !== null && value !== undefined
    );
    const response = await basicInfoQueries.insertBasicInfo(
      filteredBasicInfoArray
    );
    if (!response || isNaN(response)) {
      throw new Error(
        "Failed to create new BasicInfo (no response from query or NaN)."
      );
    }

    const basicInfoFromDB = await basicInfoQueries.getBasicInfoByTfg(response);
    console.log(basicInfoFromDB);
    return BasicInfo.fromDbRow(basicInfoFromDB); // Convert the row to a BasicInfo instance
  }

  async update(id: number, data: Partial<BasicInfo>): Promise<BasicInfo> {
    let actualBI: BasicInfo | null = await this.findById(id);
    if (!actualBI) {
      throw new Error(`BasicInfo with ID ${id} not found.`);
    }

    if (data.abstract && data.abstract !== actualBI.abstract) {
      await this.updateAbstract(id, data.abstract);
      actualBI.abstract = data.abstract;
    }
    if (
      data.acknowledgements &&
      data.acknowledgements !== actualBI.acknowledgements
    ) {
      await this.updateAcknowledgements(id, data.acknowledgements);
      actualBI.acknowledgements = data.acknowledgements;
    }
    if (data.authorship && data.authorship !== actualBI.authorship) {
      await this.updateAuthorship(id, data.authorship);
      actualBI.authorship = data.authorship;
    }
    if (data.dedication && data.dedication !== actualBI.dedication) {
      await this.updateDedication(id, data.dedication);
      actualBI.dedication = data.dedication;
    }
    if (data.resumen && data.resumen !== actualBI.resumen) {
      await this.updateResumen(id, data.resumen);
      actualBI.resumen = data.resumen;
    }
    if (data.bibliography && data.bibliography !== actualBI.bibliography) {
      await this.updateBibliography(id, data.bibliography);
      actualBI.bibliography = data.bibliography;
    }

    return actualBI;
  }

  async updateAbstract(id: number, abstract: string): Promise<BasicInfo> {
    // return basicInfoQueries.updateAbstract(id, abstract);
    const updatedBasicInfoId = await basicInfoQueries.updateAbstract(
      id,
      abstract
    );
    if (!updatedBasicInfoId) {
      throw new Error(`Failed to update abstract for BasicInfo with ID ${id}`);
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async updateAcknowledgements(
    id: number,
    acknowledgements: string
  ): Promise<BasicInfo> {
    // return basicInfoQueries.updateAcknowledgements(id, acknowledgements);
    const updatedBasicInfoId = await basicInfoQueries.updateAcknowledgements(
      id,
      acknowledgements
    );
    if (!updatedBasicInfoId) {
      throw new Error(
        `Failed to update acknowledgements for BasicInfo with ID ${id}`
      );
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async updateAuthorship(id: number, authorship: string): Promise<BasicInfo> {
    // return basicInfoQueries.updateAuthorship(id, authorship);
    const updatedBasicInfoId = await basicInfoQueries.updateAuthorship(
      id,
      authorship
    );
    if (!updatedBasicInfoId) {
      throw new Error(
        `Failed to update authorship for BasicInfo with ID ${id}`
      );
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async updateDedication(id: number, dedication: string): Promise<BasicInfo> {
    // return basicInfoQueries.updateDedication(id, dedication);
    const updatedBasicInfoId = await basicInfoQueries.updateDedication(
      id,
      dedication
    );
    if (!updatedBasicInfoId) {
      throw new Error(
        `Failed to update dedication for BasicInfo with ID ${id}`
      );
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async updateResumen(id: number, resumen: string): Promise<BasicInfo> {
    // return basicInfoQueries.updateResumen(id, resumen);
    const updatedBasicInfoId = await basicInfoQueries.updateResumen(
      id,
      resumen
    );
    if (!updatedBasicInfoId) {
      throw new Error(`Failed to update resumen for BasicInfo with ID ${id}`);
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async updateBibliography(
    id: number,
    bibliography: string
  ): Promise<BasicInfo> {
    // return basicInfoQueries.updateBibliography(id, bibliography);
    const updatedBasicInfoId = await basicInfoQueries.updateBibliography(
      id,
      bibliography
    );
    if (!updatedBasicInfoId) {
      throw new Error(
        `Failed to update bibliography for BasicInfo with ID ${id}`
      );
    }
    const bi = await this.findById(updatedBasicInfoId);
    if (!bi) {
      throw new Error(
        `BasicInfo with ID ${updatedBasicInfoId} not found after update.`
      );
    }
    return bi;
  }

  async delete(id: number): Promise<boolean> {
    // return basicInfoQueries.removeBasicInfo(id);
    const deletedBasicInfoId = await basicInfoQueries.removeBasicInfo(id);
    if (!deletedBasicInfoId) {
      throw new Error(`Failed to delete BasicInfo with ID ${id}`);
    }
    return true; // Assuming deletion was successful if no error was thrown
  }
}
