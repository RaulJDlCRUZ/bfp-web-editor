export class TFG {
  constructor(
    public title: string,
    public tutor: string,
    public department: string,
    public language: string,
    public csl: string,
    public month: string,
    public year: number,
    public student: number, // user_id == student
    public bfp_id?: number,
    public subtitle?: string | null,
    public cotutor?: string | null
  ) {}

  static fromDbRow(row: any): TFG {
    return new TFG(
      row.title,
      row.tutor,
      row.department,
      row.language,
      row.csl,
      row.month,
      row.year,
      row.student,
      row.bfp_id,
      row.subtitle || null, // subtitle can be null
      row.cotutor || null // cotutor can be null
    );
  }

  toArray(): (string | number | null)[] {
    return [
      this.bfp_id ? this.bfp_id : null, // bfp_id can be null
      this.title,
      this.subtitle ? this.subtitle : null,
      this.tutor,
      this.cotutor ? this.cotutor : null,
      this.department,
      this.language,
      this.csl,
      this.month,
      this.year,
      this.student,
    ];
  }
}
