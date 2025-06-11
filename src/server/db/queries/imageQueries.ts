export const insertResourceQuery = `
    INSERT INTO images (filename, data, tfg)
    VALUES ($1, $2, $3)
    RETURNING img_id;
    `;

export const updateResourceQuery = `
    UPDATE images
    SET filename = $2,
    WHERE img_id = $1
    RETURNING img_id;
    `;
