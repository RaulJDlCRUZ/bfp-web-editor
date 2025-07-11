export class Image {
  constructor(
    public filename: string,
    public data: string, // Raw content of the image file
    public tfg: number, // Foreign key to TFG
    public img_id?: number
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      filename: this.filename,
      data: this.data,
      tfg: this.tfg,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(this.img_id && this.filename && this.data && this.tfg);
  }

  static fromDbRow(row: any): Image {
    return new Image(row.img_id, row.filename, row.data, row.tfg);
  }

  toDbArray(): (number | string)[] {
    return [this.img_id || "", this.filename, this.data, this.tfg];
  }

  toJSON(): object {
    return {
      img_id: this.img_id,
      filename: this.filename,
      data: this.data,
      tfg: this.tfg,
    };
  }
}
