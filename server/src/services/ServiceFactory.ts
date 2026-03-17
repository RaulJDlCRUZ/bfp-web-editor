/* Dependency Management */
import { UserService } from "./UserService";
// TODO ???: Importar otros servicios según sea necesario

export class ServiceFactory {
  private static userService: UserService;

  static getUserService(): UserService {
    if (!this.userService) {
      this.userService = new UserService();
    }
    return this.userService;
  }
}
