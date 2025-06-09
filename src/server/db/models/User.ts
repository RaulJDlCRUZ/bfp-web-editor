export class User {
  constructor(
    public email: string,
    public password: string,
    public name: string,
    public lastname1: string,
    public lastname2: string,
    public technology: string,
    public user_id?: number,
    public phone?: number | null
  ) {}

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
    return [
      this.user_id ? this.user_id : null,
      this.email,
      this.password,
      this.name,
      this.lastname1,
      this.lastname2,
      this.technology,
      this.phone ? this.phone : null,
    ];
  }
}
