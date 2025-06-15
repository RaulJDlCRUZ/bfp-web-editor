import { BaseRepository } from "./BaseRepository";
import { User } from "../entities/User";
import * as userQueries from "../../../database/queries/userQueries.js"; // Mantener referencia temporal

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async findById(id: number): Promise<User | null> {
    // Usar queries existentes temporalmente
    return userQueries.getUserById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return userQueries.getUserByEmail(email);
  }

  async create(data: Partial<User>): Promise<User> {
    const userArray = data.toDbArray?.();
    if (!userArray || userArray.length === 0) {
      throw new Error("Invalid user data provided for creation.");
    }
    return userQueries.insertUser(userArray);
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    // Implementar lógica de actualización aquí
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented.");
  }
}
