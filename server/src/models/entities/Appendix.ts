export class Appendix {
  constructor(
    public appx_id: number,
    public ap_title: string,
    public number: number,
    public is_omitted: boolean = false,
    public original_number: number,
    public content: string,
    public tfg: number // Foreign key to TFG
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      appx_id: this.appx_id,
      ap_title: this.ap_title,
      number: this.number,
      original_number: this.original_number,
      content: this.content,
      tfg: this.tfg,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(
      this.appx_id &&
      this.ap_title &&
      this.number !== undefined &&
      this.original_number !== undefined &&
      this.content &&
      this.tfg
    );
  }

  static fromDbRow(row: any): Appendix {
    return new Appendix(
      row.appx_id,
      row.ap_title,
      row.number,
      row.is_omitted,
      row.original_number,
      row.content,
      row.tfg
    );
  }

  toDbArray(): (number | string)[] {
    return [this.appx_id, this.ap_title, this.number, this.content, this.tfg];
  }

  toJSON(): object {
    return {
      appx_id: this.appx_id,
      ap_title: this.ap_title,
      number: this.number,
      is_omitted: this.is_omitted,
      original_number: this.original_number,
      content: this.content,
      tfg: this.tfg,
    };
  }
}
