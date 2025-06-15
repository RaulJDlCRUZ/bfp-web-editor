/**
 * This file defines the BaseRepository class, which serves as a base for all repository classes.
 * It provides a common interface for CRUD operations on database entities.
 *
 * @module BaseRepository
 * @version 1.0.0
 * @template T - The type of the entity that the service will handle.
 */

export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected getTableName(): string {
    return this.tableName;
  }

  protected async insertSingle(data: Partial<T>): Promise<T> {
    // Implementación común para inserción simple
    throw new Error("Method not implemented.");
  }

  protected async insertBatch(data: Partial<T>[]): Promise<T[]> {
    // Implementación común para inserción en lote
    throw new Error("Method not implemented.");
  }

  protected async insertFromMap(
    data: Record<number, Partial<T>>
  ): Promise<T[]> {
    // Implementación común para inserción desde mapa
    throw new Error("Method not implemented.");
  }

  protected async insertFromMapBatch(
    data: Array<Record<string, Partial<T>>>
  ): Promise<T[]> {
    // Implementación común para inserción desde mapa en lote
    throw new Error("Method not implemented.");
  }

  abstract findById(id: number): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number, data: Partial<T>): Promise<T>;
  abstract delete(id: number): Promise<boolean>;
}
