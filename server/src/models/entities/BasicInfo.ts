export class BasicInfo {
  constructor(
    public bfp_id: number,
    public cfg_id: string, // cfg_id ~= user_id FOR THE MOMENT
    public abstract?: string,
    public acknowledgements?: string,
    public authorship?: string,
    public dedication?: string,
    public resumen?: string,
    public bibliography?: string
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      bfp_id: this.bfp_id,
      cfg_id: this.cfg_id,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(this.bfp_id && this.cfg_id);
  }

  static fromDbRow(row: any): BasicInfo {
    return new BasicInfo(
      row.tfg, // Assuming 'tfg' is the BFP ID in the DB
      row.cfg_id,
      row.abstract || null, // abstract can be null
      row.acknowledgements || null, // acknowledgements can be null
      row.authorship || null, // authorship can be null
      row.dedication || null, // dedication can be null
      row.resumen || null, // resumen can be null
      row.bibliography || null // bibliography can be null
    );
  }

  toDbArray(): (string | number | null)[] {
    return [
      this.bfp_id,
      this.cfg_id,
      this.abstract ? this.abstract : null,
      this.acknowledgements ? this.acknowledgements : null,
      this.authorship ? this.authorship : null,
      this.dedication ? this.dedication : null,
      this.resumen ? this.resumen : null,
      this.bibliography ? this.bibliography : null,
    ];
  }

  toJSON(): object {
    return {
      bfp_id: this.bfp_id,
      cfg_id: this.cfg_id,
      abstract: this.abstract || null,
      acknowledgements: this.acknowledgements || null,
      authorship: this.authorship || null,
      dedication: this.dedication || null,
      resumen: this.resumen || null,
      bibliography: this.bibliography || null,
    };
  }
}
