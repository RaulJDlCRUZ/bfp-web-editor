import { insertAcronymQuery } from "@db/queries/acronymQueries";
import Insert, { InsertFromArrayRecordString } from "@db/utils/Insert";

export class User {
  constructor(
    private insert: Insert,
    public email: string,
    public password: string,
    public name: string,
    public lastname1: string,
    public lastname2: string,
    public technology: string,
    public user_id?: number,
    public phone?: number | null,
  ) {
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (!name) {
      throw new Error("Name is required");
    }
    if (!lastname1) {
      throw new Error("First last name is required");
    }
    if (!lastname2) {
      throw new Error("Second last name is required");
    }
    if (!technology) {
      throw new Error("Technology is required");
    }
  }

  static fromDbRow(row: any): User {
    return new User(
      row.email,
      row.password,
      row.name,
      row.lastname1,
      row.lastname2,
      row.technology,
      row.user_id,
      row.phone || null // phone can be null
    );

  }
  
  toArray(): (string | number | null)[] {
    const a = [
      this.user_id ? this.user_id : null,
      this.email,
      this.password,
      this.name,
      this.lastname1,
      this.lastname2,
      this.technology,
      this.phone ? this.phone : null,
    ];
    //!!!!! Asumimos que es una función para obtejer el array de la clase y despues insertarlo
    this.insert = New InsertFromArrayRecordString(a);
    return a;
  }

  
}
