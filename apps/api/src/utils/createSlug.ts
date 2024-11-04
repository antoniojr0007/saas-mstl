export function createSlug(text: string): string {
  return text
    .toLowerCase() // Converte para minúsculas
    .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim() // Remove espaços extras no início e no final
    .replace(/\s+/g, '-') // Substitui espaços por hífens
}
