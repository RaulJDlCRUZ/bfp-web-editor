export class Appendix {
  constructor(
    public appx_id: string,
    public ap_title: string,
    public number: number,
    public is_omitted: boolean = false,
    public content: string,
    public tfg: number, // Foreign key to TFG
    public original_number?: number // Ahora es opcional
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      appx_id: this.appx_id,
      ap_title: this.ap_title,
      number: this.number,
      content: this.content,
      tfg: this.tfg,
    };

    // console.log("Validación ap\n", this.toJSON());

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`[!V:AP]${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(
      this.appx_id &&
      this.ap_title &&
      this.number !== undefined &&
      this.content &&
      this.tfg
    );
  }

  static fromDbRow(row: any): Appendix {
    if (!row) {
      throw new Error("[!V:AP]Row is undefined or null");
    }

    return new Appendix(
      row.appx_id,
      row.ap_title,
      row.number,
      row.is_omitted === "true" || row.is_omitted === true, // Convert to boolean
      row.content,
      row.tfg,
      row.original_number !== null ? row.original_number : undefined // Convert null to undefined
    );
  }

  toDbArray(): (number | string | null)[] {
    return [
      this.appx_id,
      this.ap_title,
      this.number,
      String(this.is_omitted ?? false),
      this.original_number ?? null, // Si es undefined, se convierte en null
      this.content,
      this.tfg,
    ];
  }

  toJSON(): object {
    return {
      appx_id: this.appx_id,
      ap_title: this.ap_title,
      number: this.number,
      is_omitted: this.is_omitted,
      original_number: this.original_number ?? null, // Si es undefined, se convierte en null
      content: this.content,
      tfg: this.tfg,
    };
  }
}
