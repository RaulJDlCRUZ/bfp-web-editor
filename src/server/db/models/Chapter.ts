export class Chapter {
  constructor(
    public chapter_id: number,
    public ch_title: string,
    public number: number,
    public content: string,
    public tfg: number // Foreign key to TFG
  ) {}

  static fromDbRow(row: any): Chapter {
    return new Chapter(
      row.chapter_id,
      row.ch_title,
      row.number,
      row.content,
      row.tfg
    );
  }

  toArray(): (number | string)[] {
    return [
      this.chapter_id,
      this.ch_title,
      this.number,
      this.content,
      this.tfg,
    ];
  }
}
