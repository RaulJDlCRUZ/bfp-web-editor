export class Acronym {
  constructor(
    public acronym: string,
    public tfg: number, // Foreign key to TFG
    public meaning: string,
    public id?: AcronymPk // It's optional as it doesn't exists in DB, but can be used for queries
  ) {
    this.validateRequired();
  }

  private static addPkIfNeeded(acronym: Acronym): void {
    acronym.id = acronym.id || new AcronymPk(acronym.acronym, acronym.tfg);
  }

  private validateRequired(): void {
    const requiredFields = {
      acronym: this.acronym,
      tfg: this.tfg,
      meaning: this.meaning,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }

    Acronym.addPkIfNeeded(this);
  }

  isComplete(): boolean {
    return !!(this.acronym && this.tfg !== undefined && this.meaning);
  }

  static fromDbRow(row: any): Acronym {
    return new Acronym(row.acronym, row.tfg, row.meaning);
  }

  toDbArray(): (string | number)[] {
    return [this.acronym, this.tfg, this.meaning];
  }

  toJSON(): object {
    return {
      acronym: this.acronym,
      tfg: this.tfg,
      meaning: this.meaning,
    };
  }
}

export class AcronymPk {
  constructor(
    public acronym: string,
    public tfg: number // Foreign key to TFG
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      acronym: this.acronym,
      tfg: this.tfg,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(this.acronym && this.tfg !== undefined);
  }

  toJSON(): object {
    return {
      acronym: this.acronym,
      tfg: this.tfg,
    };
  }

  static fromDbRow(row: any): AcronymPk {
    return new AcronymPk(row.acronym, row.tfg);
  }
}
