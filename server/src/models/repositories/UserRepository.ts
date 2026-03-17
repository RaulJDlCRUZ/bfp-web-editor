import { BaseRepository } from "./BaseRepository";
import { User } from "../entities/User";
import * as userQueries from "../../../database/queries/userQueries.js"; // Mantener referencia temporal

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async findById(id: number): Promise<User | null> {
    // Usar queries existentes temporalmente
    const userFromDB = await userQueries.getUserById(id);
    if (!userFromDB) {
      return null; // No user found with the given ID
    }
    return User.fromDbRow(userFromDB); // Convert the row to a User instance
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFromDB = await userQueries.getUserByEmail(email);
    if (!userFromDB) {
      return null; // No user found with the given email
    }
    return User.fromDbRow(userFromDB); // Convert the row to a User instance
  }

  async findAll(): Promise<User[]> {
    // Usar queries existentes temporalmente
    const response = await userQueries.getAllUsers();
    const users: User[] = [];
    for (const i of response) {
      if (i) {
        const user = User.fromDbRow(i); // Convert each row to a User instance
        users.push(user);
      }
    }
    return users; // Return the array of User instances
  }

  async create(data: Partial<User>): Promise<User> {
    // console.log(data);
    const userArray = data.toDbArray?.();
    console.log(userArray);
    if (!userArray || userArray.length === 0) {
      throw new Error("Invalid user data provided for creation.");
    }
    const newUserId = await userQueries.insertUser(userArray?.slice(1)); // Exclude user_id from the array (user_id is auto-generated)
    if (!newUserId) {
      throw new Error("Failed to create new user (no response from query).");
    }

    const userFromDB = await userQueries.getUserById(newUserId);
    return User.fromDbRow(userFromDB); // Convert the row to a User instance
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    // Implementar lógica de actualización aquí
    throw new Error("Method not implemented. Future work?");
  }

  async delete(id: number): Promise<boolean> {
    // Implementar lógica de eliminación aquí
    throw new Error("Method not implemented. Future work?");
  }
}
