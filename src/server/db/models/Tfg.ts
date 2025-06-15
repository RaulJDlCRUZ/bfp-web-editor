// import pool from "@db/config/pool.js";

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
  ) {
    if (!title) {
      throw new Error("Title is required");
    }
    if (!tutor) {
      throw new Error("Tutor is required");
    }
    if (!department) {
      throw new Error("Department is required");
    }
    if (!language) {
      throw new Error("Language is required");
    }
    // TODO: Handle CSL later
    // if (!csl) {
    //   throw new Error("CSL is required");
    // }
    if (!month) {
      throw new Error("Month is required");
    }
    if (year === undefined || year === null) {
      throw new Error("Year is required");
    }
    if (student === undefined || student === null) {
      throw new Error("Student (user_id) is required");
    }
  }

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

  insertNewTFG(): TFG {
    if (!this.bfp_id) {
      throw new Error("bfp_id is not set. Cannot insert TFG.");
    }
    // CALL DATABASE HERE (INSERT INSTR.)
    // const tfgArray = this.toArray();
    return this; // Return the TFG instance for further operations
  }
}
