export class Acronym {
  constructor(
    public acronym: string,
    public tfg: number, // Foreign key to TFG
    public meaning: string
  ) {}

  static fromDbRow(row: any): Acronym {
    return new Acronym(row.acronym, row.tfg, row.meaning);
  }

  toArray(): (string | number)[] {
    return [this.acronym, this.tfg, this.meaning];
  }
}
