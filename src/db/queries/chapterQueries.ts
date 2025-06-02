export const inserChapterQuery = `
  INSERT INTO chapters (chapter_id, ch_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING chapter_id;
`;
