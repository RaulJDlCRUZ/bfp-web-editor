export class Chapter {
  constructor(
    public chapter_id: number,
    public ch_title: string,
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
      chapter_id: this.chapter_id,
      ch_title: this.ch_title,
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
      this.chapter_id &&
      this.ch_title &&
      this.number !== undefined &&
      this.original_number !== undefined &&
      this.content &&
      this.tfg
    );
  }

  static fromDbRow(row: any): Chapter {
    return new Chapter(
      row.chapter_id,
      row.ch_title,
      row.number,
      row.is_omitted,
      row.original_number,
      row.content,
      row.tfg
    );
  }

  toDbArray(): (number | string)[] {
    return [
      this.chapter_id,
      this.ch_title,
      this.number,
      this.content,
      this.tfg,
    ];
  }

  toJSON(): object {
    return {
      chapter_id: this.chapter_id,
      ch_title: this.ch_title,
      number: this.number,
      is_omitted: this.is_omitted,
      original_number: this.original_number,
      content: this.content,
      tfg: this.tfg,
    };
  }
}
