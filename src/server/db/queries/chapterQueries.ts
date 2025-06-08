export const insertChapterQuery = `
  INSERT INTO chapters (chapter_id, ch_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING chapter_id;
`;

export const getChaptersByTfgQuery = `
  SELECT * FROM chapters WHERE tfg = $1 ORDER BY number ASC;
`;
