export class BasicInfo {
  constructor(
    public cfg_id: string, // cfg_id == user_id FOR THE MOMENT
    public bfp_id: number,
    public abstract?: string,
    public acknowledgements?: string,
    public authorship?: string,
    public dedication?: string,
    public resumen?: string,
    public bibliography?: string
  ) {}
  
  static fromDbRow(row: any): BasicInfo {
    return new BasicInfo(
      row.cfg_id,
      row.bfp_id,
      row.abstract || null, // abstract can be null
      row.acknowledgements || null, // acknowledgements can be null
      row.authorship || null, // authorship can be null
      row.dedication || null, // dedication can be null
      row.resumen || null, // resumen can be null
      row.bibliography || null // bibliography can be null
    );
  }

  ToArray(): (string | number | null)[] {
    return [
      this.cfg_id,
      this.bfp_id,
      this.abstract ? this.abstract : null,
      this.acknowledgements ? this.acknowledgements : null,
      this.authorship ? this.authorship : null,
      this.dedication ? this.dedication : null,
      this.resumen ? this.resumen : null,
      this.bibliography ? this.bibliography : null,
    ];
  }
}
