import pool from "../config/pool.js";

const insertUserQuery = `
  INSERT INTO users (email, password, name, lastname1, lastname2, technology, phone)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING user_id;
`;

const getAllUsersQuery = `
  SELECT * FROM users
`;

const getUserByIdQuery = `
  SELECT * FROM users WHERE user_id = $1
`;

const getUserByEmailQuery = `
  SELECT * FROM users WHERE email = $1
`;

export async function insertUser(userArray: (string | number | null)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(insertUserQuery, userArray);
    if (result.rowCount === 0) {
      throw new Error("Failed to insert user data.");
    }
    return result.rows[0].user_id; // Return the generated user_id (to replace the empty string in User constructor)
  } catch (error) {
    console.error("Error inserting user data:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserById(id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(getUserByIdQuery, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(getUserByEmailQuery, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  } finally {
    client.release();
  }
}
