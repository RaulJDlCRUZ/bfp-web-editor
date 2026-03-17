/**
 * BaseService class that provides a common structure for services.
 * It is designed to be extended by specific service classes that handle business logic.
 * @module BaseService
 * @version 1.0.0
 * @template T - The type of the entity that the service will handle.
 */

export abstract class BaseService<T> {
  protected repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }
}
