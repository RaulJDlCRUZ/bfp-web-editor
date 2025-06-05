export class Appendix {
  constructor(
    public appx_id: number,
    public ap_title: string,
    public number: number,
    public is_omitted: boolean = false,
    public original_number: number,
    public content: string,
    public tfg: number // Foreign key to TFG
  ) {}

  static fromDbRow(row: any): Appendix {
    return new Appendix(
      row.appx_id,
      row.ap_title,
      row.number,
      row.is_omitted,
      row.original_number,
      row.content,
      row.tfg
    );
  }

  toArray(): (number | string)[] {
    return [this.appx_id, this.ap_title, this.number, this.content, this.tfg];
  }
}
