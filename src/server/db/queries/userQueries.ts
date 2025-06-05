export const insertUserQuery = `
  INSERT INTO users (email, name, password, lastname1, lastname2, technology, phone)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING user_id;
`;

export const getAllUsersQuery = `
  SELECT * FROM users
`;

export const getUserByIdQuery = `
  SELECT * FROM users WHERE user_id = $1
`;

export const getUserByEmailQuery = `
  SELECT * FROM users WHERE email = $1
`;
