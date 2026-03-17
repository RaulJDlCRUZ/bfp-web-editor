import { BaseService } from "./BaseService";
import { UserRepository } from "../models/repositories/UserRepository";

import { User } from "../models/entities/User";

import { UserFormData } from "../shared/types/UserFormData";
import { validateUserFormData } from "../validators/UserValidator";

import bcrypt from "bcrypt";

const MY_SALT: number = 10; // Salt rounds for bcrypt hashing

export class UserService extends BaseService<User> {
  private userRepository: UserRepository;

  constructor() {
    super(new UserRepository());
    this.userRepository = new UserRepository();
  }

  convertUsrFormDataToUser(data: UserFormData): User {
    return new User(
      data.email,
      data.password,
      data.name,
      data.lastNames[0],
      data.lastNames[1],
      data.technology,
      undefined, // user_id should be provided by the RDBMS
      data.phone || null
    );
  }

  convertUserToFormData(user: User): UserFormData {
    return {
      email: user.email,
      password: user.password, // Note: This should not be exposed in a real application
      name: user.name,
      lastNames: [user.lastname1, user.lastname2],
      technology: user.technology,
      phone: user.phone ?? undefined,
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // Lógica migrada de db/services/new_user_operations/initNewUser.ts
  async createNewUser(data: UserFormData): Promise<User> {
    // Validaciones QUE LAS MOVERÍA A CONTROLADOR
    validateUserFormData(data);
    // Lógica de negocio
    const hashedPassword = await bcrypt.hash(data.password, MY_SALT);
    data.password = hashedPassword; // Store the hashed password
    const convUser = this.convertUsrFormDataToUser(data);

    if (!convUser.isComplete()) {
      throw new Error("User data is incomplete (CHECK VALIDATION).");
    }

    const response = await this.userRepository.create(convUser);
    console.log("Response from userRepository.create:\n", response);
    if (!response || !response.user_id) {
      throw new Error("Failed to create new user.");
    }

    convUser.user_id = response.user_id; // Set the generated user_id to the User object
    console.log("New user created with user_id:", convUser.user_id);
    return convUser;
  }

  async getUserWithTfg(uId: number): Promise<any> {
    // Migrar (o crear) lógica compleja de múltiples archivos de services
    // Es decir, aquí iría la materialización de un TFG (y entidades relacionadas) a partir de un usuario
    /* SI LO TRADUZCO A LO QUE TENGO, ES LA SIMULACIÓN DE MATERIALIZEFROMTFG POR CONSOLELOG QUE TENGO */
    throw new Error("Method not implemented.");
  }
}
