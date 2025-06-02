export class Images {
  constructor(
    public img_id: number,
    public filename: string,
    public data: string, // Raw content of the image file
    public tfg: number // Foreign key to TFG
  ) {}

  static fromDbRow(row: any): Images {
    return new Images(row.img_id, row.filename, row.data, row.tfg);
  }

  toArray(): (number | string)[] {
    return [this.img_id, this.filename, this.data, this.tfg];
  }
}
