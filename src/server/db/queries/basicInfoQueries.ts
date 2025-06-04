export const insertBasicInfoQuery = `
  INSERT INTO basic_info (cfg_id, tfg, abstract, ack, autorship, dedications, resumen, bibliography)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
`;
