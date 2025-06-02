export const inserAppendixQuery = `
  INSERT INTO appendices (appx_id, ap_title, number, content, tfg)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING appx_id;
`;
