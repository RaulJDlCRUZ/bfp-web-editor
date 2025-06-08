export const insertBasicInfoQuery = `
  INSERT INTO basic_info (tfg, cfg_id, abstract, acknowledgements, authorship, dedication, resumen, bibliography)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;

export const getBasicInfoByTfgQuery = `
  SELECT * FROM basic_info WHERE tfg = $1
`;
