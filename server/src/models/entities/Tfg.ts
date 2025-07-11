export class Tfg {
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
  ) {
    this.validateRequired();
  }

  private validateRequired(): void {
    const requiredFields = {
      title: this.title,
      tutor: this.tutor,
      department: this.department,
      language: this.language,
      month: this.month,
      year: this.year,
      student: this.student,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        throw new Error(`${field} is required`);
      }
    }
  }

  isComplete(): boolean {
    return !!(
      this.title &&
      this.tutor &&
      this.department &&
      this.language &&
      this.month &&
      this.year &&
      this.student
    );
  }

  static fromDbRow(row: any): Tfg {
    return new Tfg(
      row.title,
      row.tutor,
      row.department,
      row.language,
      row.csl,
      row.month,
      row.year,
      row.student,
      row.bfp_id,
      row.subtitle || null,
      row.cotutor || null
    );
  }

  toDbArray(): (string | number | null)[] {
    return [
      this.bfp_id || null,
      this.title,
      this.subtitle || null,
      this.tutor,
      this.cotutor || null,
      this.department,
      this.language,
      this.csl,
      this.month,
      this.year,
      this.student,
    ];
  }

  toJSON(): object {
    return {
      bfp_id: this.bfp_id,
      title: this.title,
      subtitle: this.subtitle,
      tutor: this.tutor,
      cotutor: this.cotutor,
      department: this.department,
      language: this.language,
      csl: this.csl,
      month: this.month,
      year: this.year,
      student: this.student,
    };
  }
}
