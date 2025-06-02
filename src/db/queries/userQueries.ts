export const insertUserQuery = `
  INSERT INTO users (user_id, email, name, password, lastname1, lastname2, technology, phone)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`;
