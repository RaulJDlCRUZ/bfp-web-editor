export const insertResourceQuery = `
    INSERT INTO images (img_id, filename, data, tfg)
    VALUES ($1, $2, $3, $4)
    `;
