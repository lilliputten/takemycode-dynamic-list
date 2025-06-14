/** Quotes a string for psql expression */
export function quotePgStr(text: string) {
  return text.replace(/'/g, "''");
}
