export class Chapter {
  constructor(
    public chapter_id: string,
    public ch_title: string,
    public number: number,
    public is_omitted: boolean = false,
    public content: string,
    public tfg: number, // Foreign key to TFG
    public original_number?: number
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      chapter_id: this.chapter_id,
      ch_title: this.ch_title,
      number: this.number,
      content: this.content,
      tfg: this.tfg,
    };

    // console.log("Validación ch\n", this.toJSON());

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`[!V:CH]${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(
      this.chapter_id &&
      this.ch_title &&
      this.number !== undefined &&
      this.content &&
      this.tfg
    );
  }

  // 
  static fromDbRow(row: any): Chapter {
    if (!row) {
      throw new Error("[!V:CH]Row is undefined or null");
    }

    return new Chapter(
      row.chapter_id,
      row.ch_title,
      row.number,
      row.is_omitted === "true" || row.is_omitted === true, // Convert to boolean
      row.content,
      row.tfg,
      row.original_number !== null ? row.original_number : undefined // Convert null to undefined
    );
  }

  // (chapter_id, ch_title, number, is_omitted, original_number, content, tfg)
  toDbArray(): (number | string | null)[] {
    return [
      this.chapter_id,
      this.ch_title,
      this.number,
      String(this.is_omitted ?? false),
      this.original_number ?? null, // Si es undefined, se convierte en null
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
      original_number: this.original_number ?? null, // Si es undefined, se convierte en null
      content: this.content,
      tfg: this.tfg,
    };
  }
}
