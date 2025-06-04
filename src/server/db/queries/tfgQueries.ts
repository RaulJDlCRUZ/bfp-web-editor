export const insertTfgQuery = `
  INSERT INTO tfg (bfp_id, title, subtitle, tutor, cotutor, department, language, csl, month, year, student)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING bfp_id;
`;

export const getTfgByIdQuery = `
  SELECT * FROM tfg WHERE bfp_id = $1
`;

export const getTfgByUserIdQuery = `
  SELECT * FROM tfg WHERE student = $1
`;
