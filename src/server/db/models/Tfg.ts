export class TFG {
  constructor(
    public bfp_id: number,
    public title: string,
    public tutor: string,
    public department: string,
    public language: string,
    public csl: string,
    public month: string,
    public year: number,
    public student: string, // user_id == student
    public subtitle?: string | null,
    public cotutor?: string | null
  ) {}

  static fromDbRow(row: any): TFG {
    return new TFG(
      row.bfp_id,
      row.title,
      row.subtitle || null, // subtitle can be null
      row.tutor,
      row.cotutor || null, // cotutor can be null
      row.department,
      row.language,
      row.csl,
      row.month,
      row.year,
      row.student
    );
  }

  toArray(): (string | number | null)[] {
    return [
      this.bfp_id,
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
