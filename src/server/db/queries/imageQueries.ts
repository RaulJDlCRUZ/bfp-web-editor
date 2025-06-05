export const insertResourceQuery = `
    INSERT INTO images (filename, data, tfg)
    VALUES ($1, $2, $3)
    RETURNING img_id;
    `;
