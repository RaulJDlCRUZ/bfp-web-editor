export const insertChapterQuery = `
  INSERT INTO chapters (chapter_id, ch_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING chapter_id;
`;

export const getChaptersByTfgQuery = `
  SELECT * FROM chapters WHERE tfg = $1 ORDER BY number ASC;
`;

export const getChapterByIdQuery = `
  SELECT content FROM chapters WHERE chapter_id = $1;
`;

export const updateChapterContentQuery = `
  UPDATE chapters
  SET content = $2
  WHERE chapter_id = $1
  RETURNING chapter_id, content;
`;

export const updateChapterNameQuery = `
  UPDATE chapters
  SET ch_title = $2
  WHERE chapter_id = $1
  RETURNING chapter_id, ch_title;
`;

export const deleteChapterQuery = `
  DELETE FROM chapters
  WHERE chapter_id = $1
`;
