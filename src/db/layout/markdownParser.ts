/* This function parses a markdown file into title and content.
Works with chapters and appendices. */
export function parseMarkdownFile(content: string) {
  const [titleLine, ...rest] = content.split("\n");
  const title = titleLine.replace(/^# /, "");
  const body = rest.join("\n").trim();

  return {
    title,
    content: body,
  };
}
