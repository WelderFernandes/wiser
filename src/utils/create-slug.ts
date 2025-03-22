export function createSlug(text: string): string {
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents using Unicode normalization
  const slug = normalizedText
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (alphanumeric, underscore, hyphen)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
  return slug
}
