/** Utilidades de texto usadas no servidor e no navegador. */

/**
 * Remove acentos e caixa, para comparações tolerantes ao que o usuário digita:
 * "PÃO" e "pao" passam a bater com "Pão".
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
