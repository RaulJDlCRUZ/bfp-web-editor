import { BaseService } from "./BaseService";

import { AppendixRepository } from "../models/repositories/AppendixRepository";
import { Appendix } from "../models/entities/Appendix";

export class AppendixService extends BaseService<Appendix> {
  private appendixRepository: AppendixRepository;

  constructor() {
    super(new AppendixRepository());
    this.appendixRepository = new AppendixRepository();
  }

  async findById(id: number): Promise<Appendix | null> {
    return await this.appendixRepository.findById(id);
  }

  async findAll(tfgId: number): Promise<Appendix[]> {
    return await this.appendixRepository.findAll(tfgId);
  }

  async create(data: Partial<Appendix>): Promise<Appendix> {
    return await this.appendixRepository.create(data);
  }

  async update(id: number, data: Partial<Appendix>): Promise<Appendix> {
    const existingAppendix = await this.appendixRepository.findById(id);
    if (!existingAppendix) {
      throw new Error(`Appendix with ID ${id} not found for update.`);
    }
    return await this.appendixRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return await this.appendixRepository.delete(id);
  }
}
