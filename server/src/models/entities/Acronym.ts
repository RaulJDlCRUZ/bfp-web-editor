export class Acronym {
  constructor(
    public acronym: string,
    public tfg: number, // Foreign key to TFG
    public meaning: string
  ) {
    this.validateRequired();
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
