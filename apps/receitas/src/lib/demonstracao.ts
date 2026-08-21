/**
 * Amostra pública do produto.
 *
 * A demonstração mostra só estas receitas — o restante da biblioteca fica
 * atrás do login. São escolhidas para representar categorias diferentes e
 * mostrar as ferramentas funcionando de verdade.
 */
export const RECEITAS_DEMONSTRACAO = [
  "brigadeiro-gourmet-tradicional",
  "bolo-de-cenoura-com-cobertura",
  "coxinha-de-frango-com-catupiry",
  "geladinho-gourmet-de-ninho",
  "pao-de-queijo-mineiro",
  "mousse-de-maracuja",
];

export function ehReceitaDaDemonstracao(slug: string): boolean {
  return RECEITAS_DEMONSTRACAO.includes(slug);
}
