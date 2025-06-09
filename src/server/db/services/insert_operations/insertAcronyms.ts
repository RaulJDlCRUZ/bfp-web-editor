import { PoolClient } from "pg";
import { insertAcronymQuery } from "@db/queries/acronymQueries";

export async function insertOneAcronym(
  client: PoolClient,
  tfg: number,
  acronym: {
    key: string;
    meaning: string;
  }
): Promise<void> {
  await client.query(insertAcronymQuery, [acronym.key, tfg, acronym.meaning]);
}

export async function insertAcronyms(
  client: PoolClient,
  tfg: number,
  acronyms: Record<string, string>
): Promise<void> {
  for (const [key, meaning] of Object.entries(acronyms)) {
    const acronym = {
      key: key.trim().toUpperCase(),
      meaning: meaning.trim(),
    };
    await insertOneAcronym(client, tfg, acronym);
  }
}
