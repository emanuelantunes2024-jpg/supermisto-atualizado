// Infraestructura de idiomas. El idioma principal es ESPAÑOL (mercado europeo).
// Para agregar un idioma nuevo: sumar una clave al objeto DICCIONARIOS con las
// mismas entradas. El layout NO cambia con el idioma: solo se reemplaza el texto.

export const IDIOMAS = [
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
];

export const IDIOMA_POR_DEFECTO = 'es';

const DICCIONARIOS = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.recetas': 'Recetas',
    'nav.categorias': 'Categorías',
    'nav.buscar': 'Buscar',
    'nav.calculadoras': 'Calculadoras',
    'nav.lista': 'Lista de Compras',
    'nav.central': 'Central de Rendimiento',
    'nav.favoritos': 'Favoritos',
    'nav.colecciones': 'Mis Colecciones',
    'nav.novedades': 'Novedades',
    'nav.plan': 'Mi Plan',
    'nav.ia': 'Asistente IA',
    'nav.config': 'Configuración',
    'nav.salir': 'Salir',
    'nav.nuevo': 'Nuevo',
    'top.buscar': 'Buscar recetas, ingredientes...',
    'top.saludo': '¡Hola, Chef!',
    'home.titulo': '¿Qué quieres hacer hoy?',
    'home.a1': 'Encontrar una receta',
    'home.a1s': 'Explora miles de recetas',
    'home.a2': 'Quiero empezar a vender',
    'home.a2s': 'Recetas rentables para vender',
    'home.a3': 'Calcular costos',
    'home.a3s': 'Sepa cuánto va a gastar',
    'home.a4': 'Lista de compras',
    'home.a4s': 'Organice sus ingredientes',
    'home.a5': 'Planificar producción',
    'home.a5s': 'Planifique y organice su producción',
    'home.a6': 'Mis recetas',
    'home.a6s': 'Acceda a sus favoritas',
    'home.biblioteca': 'Biblioteca en expansión',
    'home.disponibles': 'recetas disponibles',
    'home.semanal': 'Nuevas recetas agregadas cada semana',
    'home.novedadesTit': '¡Novedades disponibles!',
    'home.novedadesTxt': 'recetas nuevas fueron agregadas esta semana.',
    'home.verNovedades': 'Ver novedades',
    'home.nuevasRecetas': 'Nuevas recetas',
    'home.agregadasSemana': 'Agregadas esta semana',
    'home.verTodas': 'Ver todas las novedades',
    'home.t1': 'Calculadora de Costos',
    'home.t1s': 'Calcula el costo de los ingredientes',
    'home.t2': 'Calculadora de Precios',
    'home.t2s': 'Descubre el precio ideal para vender',
    'home.t3': 'Central de Rendimiento',
    'home.t3s': 'Simula y planifica tus ganancias',
    'home.t4': 'Simulador de Objetivos',
    'home.t4s': 'Define metas y ve las posibilidades',
    'home.t5': 'Lista de Compras',
    'home.t5s': 'Organiza y optimiza tus compras',
    'home.t6': 'Asistente Inteligente',
    'home.t6s': 'Resuelve dudas y recibe sugerencias',
  },
  pt: {
    'nav.inicio': 'Início',
    'nav.recetas': 'Receitas',
    'nav.categorias': 'Categorias',
    'nav.buscar': 'Buscar',
    'nav.calculadoras': 'Calculadoras',
    'nav.lista': 'Lista de Compras',
    'nav.central': 'Central de Renda',
    'nav.favoritos': 'Favoritos',
    'nav.colecciones': 'Minhas Coleções',
    'nav.novedades': 'Novidades',
    'nav.plan': 'Meu Plano',
    'nav.ia': 'Assistente IA',
    'nav.config': 'Configurações',
    'nav.salir': 'Sair',
    'nav.nuevo': 'Novo',
    'top.buscar': 'Buscar receitas, ingredientes...',
    'top.saludo': 'Olá, Chef!',
    'home.titulo': 'O que você quer fazer hoje?',
    'home.a1': 'Encontrar uma receita',
    'home.a1s': 'Explore milhares de receitas',
    'home.a2': 'Quero começar a vender',
    'home.a2s': 'Receitas lucrativas para vender',
    'home.a3': 'Calcular custos',
    'home.a3s': 'Saiba quanto vai gastar',
    'home.a4': 'Lista de compras',
    'home.a4s': 'Organize seus ingredientes',
    'home.a5': 'Planejar produção',
    'home.a5s': 'Planeje e organize sua produção',
    'home.a6': 'Minhas receitas',
    'home.a6s': 'Acesse suas favoritas',
    'home.biblioteca': 'Biblioteca em expansão',
    'home.disponibles': 'receitas disponíveis',
    'home.semanal': 'Novas receitas adicionadas toda semana',
    'home.novedadesTit': 'Novidades disponíveis!',
    'home.novedadesTxt': 'novas receitas foram adicionadas esta semana.',
    'home.verNovedades': 'Ver novidades',
    'home.nuevasRecetas': 'Novas receitas',
    'home.agregadasSemana': 'Adicionadas esta semana',
    'home.verTodas': 'Ver todas as novidades',
    'home.t1': 'Calculadora de Custos',
    'home.t1s': 'Calcule o custo dos ingredientes',
    'home.t2': 'Calculadora de Preços',
    'home.t2s': 'Descubra o preço ideal para vender',
    'home.t3': 'Central de Renda',
    'home.t3s': 'Simule e planeje seus ganhos',
    'home.t4': 'Simulador de Objetivos',
    'home.t4s': 'Defina metas e veja as possibilidades',
    'home.t5': 'Lista de Compras',
    'home.t5s': 'Organize e otimize suas compras',
    'home.t6': 'Assistente Inteligente',
    'home.t6s': 'Tire dúvidas e receba sugestões',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.recetas': 'Recipes',
    'nav.categorias': 'Categories',
    'nav.buscar': 'Search',
    'nav.calculadoras': 'Calculators',
    'nav.lista': 'Shopping List',
    'nav.central': 'Earnings Center',
    'nav.favoritos': 'Favorites',
    'nav.colecciones': 'My Collections',
    'nav.novedades': "What's New",
    'nav.plan': 'My Plan',
    'nav.ia': 'AI Assistant',
    'nav.config': 'Settings',
    'nav.salir': 'Sign out',
    'nav.nuevo': 'New',
    'top.buscar': 'Search recipes, ingredients...',
    'top.saludo': 'Hi, Chef!',
    'home.titulo': 'What would you like to do today?',
    'home.a1': 'Find a recipe',
    'home.a1s': 'Explore thousands of recipes',
    'home.a2': 'I want to start selling',
    'home.a2s': 'Profitable recipes to sell',
    'home.a3': 'Calculate costs',
    'home.a3s': 'Know how much you will spend',
    'home.a4': 'Shopping list',
    'home.a4s': 'Organize your ingredients',
    'home.a5': 'Plan production',
    'home.a5s': 'Plan and organize your production',
    'home.a6': 'My recipes',
    'home.a6s': 'Access your favorites',
    'home.biblioteca': 'Growing library',
    'home.disponibles': 'recipes available',
    'home.semanal': 'New recipes added every week',
    'home.novedadesTit': 'New content available!',
    'home.novedadesTxt': 'new recipes were added this week.',
    'home.verNovedades': 'See what’s new',
    'home.nuevasRecetas': 'New recipes',
    'home.agregadasSemana': 'Added this week',
    'home.verTodas': 'See all updates',
    'home.t1': 'Cost Calculator',
    'home.t1s': 'Calculate your ingredient costs',
    'home.t2': 'Price Calculator',
    'home.t2s': 'Find the ideal price to sell',
    'home.t3': 'Earnings Center',
    'home.t3s': 'Simulate and plan your profit',
    'home.t4': 'Goal Simulator',
    'home.t4s': 'Set goals and see the options',
    'home.t5': 'Shopping List',
    'home.t5s': 'Organize and optimize your shopping',
    'home.t6': 'Smart Assistant',
    'home.t6s': 'Ask questions and get suggestions',
  },
};

const CLAVE = 'rr.idioma';

export function obtenerIdioma() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado && DICCIONARIOS[guardado]) return guardado;
  } catch {
    // almacenamiento no disponible
  }
  return IDIOMA_POR_DEFECTO;
}

export function guardarIdioma(code) {
  try {
    if (DICCIONARIOS[code]) localStorage.setItem(CLAVE, code);
  } catch {
    // almacenamiento no disponible
  }
}

/** Devuelve el texto de `clave` en el idioma activo, con respaldo al español. */
export function traducir(clave, idioma = obtenerIdioma()) {
  const dic = DICCIONARIOS[idioma] || DICCIONARIOS[IDIOMA_POR_DEFECTO];
  return dic[clave] ?? DICCIONARIOS[IDIOMA_POR_DEFECTO][clave] ?? clave;
}
