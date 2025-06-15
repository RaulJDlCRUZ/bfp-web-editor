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
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      email: this.email,
      password: this.password,
      name: this.name,
      lastname1: this.lastname1,
      lastname2: this.lastname2,
      technology: this.technology,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(
      this.email &&
      this.password &&
      this.name &&
      this.lastname1 &&
      this.lastname2 &&
      this.technology
    );
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

  toDbArray(): (string | number | null)[] {
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

  toJSON(): object {
    return {
      user_id: this.user_id,
      email: this.email,
      name: this.name,
      lastname1: this.lastname1,
      lastname2: this.lastname2,
      technology: this.technology,
      phone: this.phone || null, // phone can be null
    };
  }
}
