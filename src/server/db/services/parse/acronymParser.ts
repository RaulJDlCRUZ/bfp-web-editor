export function parseAcronymFile(content: string): Record<string, string> {
  const splitChar: string = ": ";
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  const acronyms: Record<string, string> = {};

  for (const line of lines) {
    const [acronym, definition] = line.split(splitChar);
    if (acronym && definition) {
      // Clean up the acronym and definition
      const cleanedAcronym = acronym.trim().toUpperCase();
      const cleanedDefinition = definition.trim();
      acronyms[cleanedAcronym] = cleanedDefinition;
    }
  }

  return acronyms;
}
