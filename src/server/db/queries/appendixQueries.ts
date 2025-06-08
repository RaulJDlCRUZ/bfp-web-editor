export const insertAppendixQuery = `
  INSERT INTO appendices (appx_id, ap_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING appx_id;
`;

export const getAppendicesByTfgQuery = `
  SELECT * FROM appendices WHERE tfg = $1 ORDER BY number ASC;
`;
