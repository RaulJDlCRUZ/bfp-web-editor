export const insertAcronymQuery = `
    INSERT INTO acronyms (acronym, tfg, meaning)
    VALUES ($1, $2, $3)`;
