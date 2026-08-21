-- ============================================================================
-- CENTRAL DE RECEITAS & RENDA — carga inicial do catálogo
--
-- GERADO AUTOMATICAMENTE por scripts/gerar-seed.mjs. Não edite à mão:
-- altere os arquivos em src/data e rode `npm run gerar:seed` de novo.
--
-- Gerado em: 2026-08-21T05:20:24.797Z
-- Conteúdo:  116 insumos, 9 categorias, 55 receitas.
--
-- Rode este arquivo DEPOIS da migração 0001_estrutura_inicial.sql.
-- Pode ser reaplicado: tudo usa UPSERT.
-- ============================================================================


-- ---------------------------------------------------------------- insumos
insert into public.insumos (chave, nome, unidade_base, embalagem, embalagem_rotulo, preco_ref, secao) values
  ('leite-condensado', 'Leite condensado', 'g', 395, 'lata de 395 g', 7.5, 'mercearia'),
  ('creme-de-leite', 'Creme de leite', 'g', 200, 'caixa de 200 g', 4.5, 'mercearia'),
  ('acucar-refinado', 'Açúcar refinado', 'g', 1000, 'pacote de 1 kg', 5, 'mercearia'),
  ('acucar-cristal', 'Açúcar cristal', 'g', 1000, 'pacote de 1 kg', 4.5, 'mercearia'),
  ('acucar-confeiteiro', 'Açúcar de confeiteiro', 'g', 500, 'pacote de 500 g', 7.5, 'mercearia'),
  ('farinha-trigo', 'Farinha de trigo', 'g', 1000, 'pacote de 1 kg', 5.5, 'mercearia'),
  ('farinha-trigo-fermentada', 'Farinha de trigo com fermento', 'g', 1000, 'pacote de 1 kg', 6.5, 'mercearia'),
  ('amido-milho', 'Amido de milho', 'g', 500, 'caixa de 500 g', 8, 'mercearia'),
  ('fuba', 'Fubá', 'g', 500, 'pacote de 500 g', 4, 'mercearia'),
  ('polvilho-doce', 'Polvilho doce', 'g', 500, 'pacote de 500 g', 7, 'mercearia'),
  ('polvilho-azedo', 'Polvilho azedo', 'g', 500, 'pacote de 500 g', 7.5, 'mercearia'),
  ('oleo-soja', 'Óleo de soja', 'ml', 900, 'garrafa de 900 ml', 8, 'mercearia'),
  ('fermento-quimico', 'Fermento em pó', 'g', 100, 'pote de 100 g', 6, 'mercearia'),
  ('fermento-biologico', 'Fermento biológico seco', 'g', 10, 'sachê de 10 g', 3, 'mercearia'),
  ('sal', 'Sal', 'g', 1000, 'pacote de 1 kg', 3, 'mercearia'),
  ('chocolate-po', 'Chocolate em pó 50%', 'g', 200, 'pacote de 200 g', 12, 'mercearia'),
  ('achocolatado', 'Achocolatado em pó', 'g', 400, 'pote de 400 g', 9, 'mercearia'),
  ('cacau-po', 'Cacau em pó 100%', 'g', 200, 'pacote de 200 g', 18, 'mercearia'),
  ('leite-po', 'Leite em pó integral', 'g', 400, 'pacote de 400 g', 18, 'mercearia'),
  ('coco-ralado', 'Coco ralado', 'g', 100, 'pacote de 100 g', 6, 'mercearia'),
  ('leite-coco', 'Leite de coco', 'ml', 200, 'vidro de 200 ml', 5.5, 'mercearia'),
  ('aveia', 'Aveia em flocos', 'g', 200, 'pacote de 200 g', 7, 'mercearia'),
  ('amendoim', 'Amendoim torrado', 'g', 500, 'pacote de 500 g', 14, 'mercearia'),
  ('castanha-caju', 'Castanha de caju', 'g', 200, 'pacote de 200 g', 24, 'mercearia'),
  ('nozes', 'Nozes picadas', 'g', 100, 'pacote de 100 g', 18, 'mercearia'),
  ('gelatina-incolor', 'Gelatina sem sabor', 'g', 12, 'caixa de 12 g', 6, 'mercearia'),
  ('gelatina-sabor', 'Gelatina em pó (sabor)', 'g', 25, 'caixa de 25 g', 3.5, 'mercearia'),
  ('biscoito-maisena', 'Biscoito maisena', 'g', 400, 'pacote de 400 g', 7, 'mercearia'),
  ('biscoito-chocolate', 'Biscoito de chocolate', 'g', 130, 'pacote de 130 g', 6.5, 'mercearia'),
  ('vinagre', 'Vinagre', 'ml', 500, 'garrafa de 500 ml', 4, 'mercearia'),
  ('extrato-tomate', 'Extrato de tomate', 'g', 340, 'lata de 340 g', 5, 'mercearia'),
  ('molho-tomate', 'Molho de tomate', 'g', 340, 'sachê de 340 g', 3.5, 'mercearia'),
  ('farinha-rosca', 'Farinha de rosca', 'g', 500, 'pacote de 500 g', 9, 'mercearia'),
  ('trigo-quibe', 'Trigo para quibe', 'g', 500, 'pacote de 500 g', 9.5, 'mercearia'),
  ('essencia-baunilha', 'Essência de baunilha', 'ml', 30, 'vidro de 30 ml', 6, 'mercearia'),
  ('mel', 'Mel', 'g', 300, 'pote de 300 g', 22, 'mercearia'),
  ('cafe-soluvel', 'Café solúvel', 'g', 50, 'vidro de 50 g', 12, 'mercearia'),
  ('canela-po', 'Canela em pó', 'g', 30, 'pote de 30 g', 5, 'mercearia'),
  ('cravo', 'Cravo-da-índia', 'g', 20, 'pote de 20 g', 5, 'mercearia'),
  ('erva-doce', 'Erva-doce', 'g', 20, 'pote de 20 g', 4.5, 'mercearia'),
  ('caldo-galinha', 'Caldo de galinha', 'g', 57, 'caixa com 6 tabletes', 4.5, 'mercearia'),
  ('azeite', 'Azeite de oliva', 'ml', 500, 'garrafa de 500 ml', 28, 'mercearia'),
  ('tapioca-granulada', 'Tapioca granulada', 'g', 500, 'pacote de 500 g', 8, 'mercearia'),
  ('doce-leite', 'Doce de leite', 'g', 400, 'pote de 400 g', 14, 'mercearia'),
  ('creme-avela', 'Creme de avelã', 'g', 140, 'pote de 140 g', 15, 'mercearia'),
  ('suco-po', 'Suco em pó', 'g', 25, 'sachê de 25 g', 1.5, 'mercearia'),
  ('emulsificante', 'Emulsificante para sorvete', 'g', 200, 'pote de 200 g', 12, 'confeitaria'),
  ('liga-neutra', 'Liga neutra', 'g', 100, 'pote de 100 g', 11, 'confeitaria'),
  ('ameixa-seca', 'Ameixa seca sem caroço', 'g', 200, 'pacote de 200 g', 14, 'mercearia'),
  ('acucar-mascavo', 'Açúcar mascavo', 'g', 500, 'pacote de 500 g', 9, 'mercearia'),
  ('bicarbonato', 'Bicarbonato de sódio', 'g', 100, 'pote de 100 g', 4.5, 'mercearia'),
  ('farinha-mandioca', 'Farinha de mandioca', 'g', 500, 'pacote de 500 g', 6, 'mercearia'),
  ('macarrao', 'Macarrão', 'g', 500, 'pacote de 500 g', 5.5, 'mercearia'),
  ('massa-lasanha', 'Massa de lasanha', 'g', 500, 'pacote de 500 g', 9, 'mercearia'),
  ('massa-pastel', 'Massa de pastel', 'g', 500, 'pacote de 500 g', 8.5, 'mercearia'),
  ('oregano', 'Orégano', 'g', 30, 'pote de 30 g', 5, 'mercearia'),
  ('noz-moscada', 'Noz-moscada', 'g', 20, 'pote de 20 g', 7, 'mercearia'),
  ('palmito', 'Palmito em conserva', 'g', 300, 'vidro de 300 g', 16, 'mercearia'),
  ('salsicha', 'Salsicha', 'g', 500, 'pacote de 500 g', 12, 'carnes'),
  ('queijo-coalho', 'Queijo coalho', 'g', 500, 'peça de 500 g', 30, 'laticinios'),
  ('abobora', 'Abóbora', 'g', 1000, '1 kg', 5, 'hortifruti'),
  ('berinjela', 'Berinjela', 'g', 500, '500 g', 7, 'hortifruti'),
  ('pimenta-dedo-moca', 'Pimenta dedo-de-moça', 'g', 100, 'pacote de 100 g', 6, 'hortifruti'),
  ('milho-verde-espiga', 'Milho verde em espiga', 'un', 6, 'pacote com 6', 12, 'hortifruti'),
  ('abacate', 'Abacate', 'un', 1, 'unidade', 7, 'hortifruti'),
  ('goiaba', 'Goiabada', 'g', 300, 'barra de 300 g', 9, 'mercearia'),
  ('amido-tapioca', 'Goma de tapioca hidratada', 'g', 500, 'pacote de 500 g', 8, 'mercearia'),
  ('leite', 'Leite integral', 'ml', 1000, 'caixa de 1 L', 5, 'laticinios'),
  ('manteiga', 'Manteiga', 'g', 200, 'pote de 200 g', 11, 'laticinios'),
  ('margarina', 'Margarina', 'g', 500, 'pote de 500 g', 8.5, 'laticinios'),
  ('ovo', 'Ovos', 'un', 12, 'cartela com 12', 12, 'laticinios'),
  ('requeijao', 'Requeijão cremoso', 'g', 200, 'copo de 200 g', 8, 'laticinios'),
  ('catupiry', 'Requeijão tipo catupiry', 'g', 200, 'bisnaga de 200 g', 11, 'laticinios'),
  ('cream-cheese', 'Cream cheese', 'g', 150, 'pote de 150 g', 12, 'laticinios'),
  ('queijo-mussarela', 'Queijo mussarela', 'g', 500, 'peça de 500 g', 24, 'laticinios'),
  ('queijo-minas', 'Queijo minas padrão', 'g', 500, 'peça de 500 g', 26, 'laticinios'),
  ('queijo-parmesao', 'Queijo parmesão ralado', 'g', 100, 'pacote de 100 g', 9, 'laticinios'),
  ('iogurte-natural', 'Iogurte natural', 'g', 170, 'pote de 170 g', 4, 'laticinios'),
  ('creme-leite-fresco', 'Creme de leite fresco', 'ml', 500, 'caixa de 500 ml', 22, 'laticinios'),
  ('chocolate-granulado', 'Chocolate granulado', 'g', 500, 'pacote de 500 g', 15, 'confeitaria'),
  ('granulado-macio', 'Granulado macio', 'g', 500, 'pacote de 500 g', 22, 'confeitaria'),
  ('chocolate-meio-amargo', 'Chocolate meio amargo', 'g', 1000, 'barra de 1 kg', 58, 'confeitaria'),
  ('chocolate-ao-leite', 'Chocolate ao leite', 'g', 1000, 'barra de 1 kg', 56, 'confeitaria'),
  ('chocolate-branco', 'Chocolate branco', 'g', 1000, 'barra de 1 kg', 60, 'confeitaria'),
  ('chantilly', 'Chantilly', 'ml', 1000, 'caixa de 1 L', 20, 'confeitaria'),
  ('corante', 'Corante alimentício', 'ml', 10, 'vidro de 10 ml', 5, 'confeitaria'),
  ('confeitos', 'Confeitos coloridos', 'g', 100, 'pote de 100 g', 8, 'confeitaria'),
  ('morango', 'Morango', 'g', 300, 'bandeja de 300 g', 12, 'hortifruti'),
  ('banana', 'Banana', 'un', 12, 'dúzia', 8, 'hortifruti'),
  ('cenoura', 'Cenoura', 'g', 1000, '1 kg', 6, 'hortifruti'),
  ('limao', 'Limão', 'un', 6, 'pacote com 6', 5, 'hortifruti'),
  ('laranja', 'Laranja', 'un', 12, 'dúzia', 9, 'hortifruti'),
  ('maracuja', 'Maracujá', 'un', 6, 'pacote com 6', 12, 'hortifruti'),
  ('abacaxi', 'Abacaxi', 'un', 1, 'unidade', 8, 'hortifruti'),
  ('manga', 'Manga', 'un', 1, 'unidade', 5, 'hortifruti'),
  ('uva', 'Uva', 'g', 500, 'bandeja de 500 g', 14, 'hortifruti'),
  ('batata', 'Batata', 'g', 1000, '1 kg', 6, 'hortifruti'),
  ('cebola', 'Cebola', 'g', 1000, '1 kg', 6.5, 'hortifruti'),
  ('alho', 'Alho', 'g', 100, 'cabeça de 100 g', 4, 'hortifruti'),
  ('tomate', 'Tomate', 'g', 1000, '1 kg', 8, 'hortifruti'),
  ('cheiro-verde', 'Cheiro-verde', 'g', 100, 'maço de 100 g', 3.5, 'hortifruti'),
  ('milho-verde', 'Milho verde em conserva', 'g', 200, 'lata de 200 g', 4.5, 'mercearia'),
  ('azeitona', 'Azeitona picada', 'g', 200, 'vidro de 200 g', 8, 'mercearia'),
  ('peito-frango', 'Peito de frango', 'g', 1000, '1 kg', 18, 'carnes'),
  ('carne-moida', 'Carne moída', 'g', 1000, '1 kg', 32, 'carnes'),
  ('presunto', 'Presunto fatiado', 'g', 200, 'pacote de 200 g', 9, 'carnes'),
  ('calabresa', 'Linguiça calabresa', 'g', 400, 'peça de 400 g', 16, 'carnes'),
  ('forminha-doce', 'Forminha de papel para doces', 'un', 100, 'pacote com 100', 8, 'embalagens'),
  ('pote-250', 'Pote plástico 250 ml com tampa', 'un', 50, 'pacote com 50', 32, 'embalagens'),
  ('pote-180', 'Pote plástico 180 ml com tampa', 'un', 50, 'pacote com 50', 26, 'embalagens'),
  ('saco-picole', 'Saquinho para picolé', 'un', 100, 'pacote com 100', 12, 'embalagens'),
  ('saco-geladinho', 'Saquinho para geladinho', 'un', 100, 'pacote com 100', 9, 'embalagens'),
  ('palito-picole', 'Palito de picolé', 'un', 100, 'pacote com 100', 7, 'embalagens'),
  ('caixa-bolo', 'Caixa para bolo', 'un', 10, 'pacote com 10', 25, 'embalagens'),
  ('embalagem-salgado', 'Embalagem para salgados', 'un', 100, 'pacote com 100', 18, 'embalagens'),
  ('saco-pao', 'Saco de papel para pão', 'un', 100, 'pacote com 100', 14, 'embalagens')
on conflict (chave) do update set
  nome = excluded.nome,
  unidade_base = excluded.unidade_base,
  embalagem = excluded.embalagem,
  embalagem_rotulo = excluded.embalagem_rotulo,
  preco_ref = excluded.preco_ref,
  secao = excluded.secao;

-- ------------------------------------------------------------- categorias
insert into public.categorias (slug, nome, descricao, icone, cor, ordem) values
  ('bolos', 'Bolos', 'Caseiros, recheados, de festa, no pote e gelados.', 'bolo', 'bg-amber-100 text-amber-600', 1),
  ('doces', 'Doces', 'Brigadeiros, beijinhos, trufas, bombons e doces no pote.', 'doce', 'bg-brand-100 text-brand-600', 2),
  ('salgados', 'Salgados', 'Coxinhas, risoles, bolinhas, quibes, empadas e esfihas.', 'salgado', 'bg-orange-100 text-orange-600', 3),
  ('paes', 'Pães', 'Caseiros, de forma, doces, recheados e integrais.', 'pao', 'bg-yellow-100 text-yellow-700', 4),
  ('sorvetes-picoles', 'Sorvetes e Picolés', 'Sorvetes cremosos, picolés, geladinhos e sacolés.', 'picole', 'bg-pink-100 text-pink-600', 5),
  ('sobremesas', 'Sobremesas', 'Mousses, pudins, pavês, tortas e cheesecakes.', 'sobremesa', 'bg-purple-100 text-purple-600', 6),
  ('massas-pizzas', 'Massas e Pizzas', 'Pizzas, lasanhas, nhoques e massas recheadas.', 'pizza', 'bg-red-100 text-red-600', 7),
  ('biscoitos-cookies', 'Biscoitos e Cookies', 'Cookies, amanteigados, recheados e biscoitos caseiros.', 'biscoito', 'bg-lime-100 text-lime-700', 8),
  ('geleias-molhos', 'Geleias, Molhos e Conservas', 'Geleias, molhos, conservas, pastas e antepastos.', 'conserva', 'bg-emerald-100 text-emerald-700', 9)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  icone = excluded.icone,
  cor = excluded.cor,
  ordem = excluded.ordem;

-- ---------------------------------------------------------- subcategorias
insert into public.subcategorias (categoria_slug, nome, ordem) values
  ('bolos', 'Bolos caseiros', 0),
  ('bolos', 'Bolos simples', 1),
  ('bolos', 'Bolos de chocolate', 2),
  ('bolos', 'Bolos de frutas', 3),
  ('bolos', 'Bolos recheados', 4),
  ('bolos', 'Bolos de festa', 5),
  ('bolos', 'Bolos no pote', 6),
  ('bolos', 'Mini bolos', 7),
  ('bolos', 'Bolos gelados', 8),
  ('bolos', 'Massas de bolo', 9),
  ('bolos', 'Recheios', 10),
  ('bolos', 'Coberturas', 11),
  ('bolos', 'Decoração', 12),
  ('bolos', 'Bolos para vender', 13),
  ('doces', 'Brigadeiros', 0),
  ('doces', 'Beijinhos', 1),
  ('doces', 'Trufas', 2),
  ('doces', 'Bombons', 3),
  ('doces', 'Doces gourmet', 4),
  ('doces', 'Doces de festa', 5),
  ('doces', 'Doces no pote', 6),
  ('doces', 'Caramelos', 7),
  ('doces', 'Balas', 8),
  ('doces', 'Doces para vender', 9),
  ('salgados', 'Coxinhas', 0),
  ('salgados', 'Risoles', 1),
  ('salgados', 'Bolinhas de queijo', 2),
  ('salgados', 'Quibes', 3),
  ('salgados', 'Empadas', 4),
  ('salgados', 'Esfihas', 5),
  ('salgados', 'Salgados assados', 6),
  ('salgados', 'Salgados fritos', 7),
  ('salgados', 'Massas para salgados', 8),
  ('salgados', 'Salgados para festas', 9),
  ('salgados', 'Salgados para vender', 10),
  ('paes', 'Pão caseiro', 0),
  ('paes', 'Pão de forma', 1),
  ('paes', 'Pães doces', 2),
  ('paes', 'Pães recheados', 3),
  ('paes', 'Pães integrais', 4),
  ('paes', 'Massas fermentadas', 5),
  ('paes', 'Pães para vender', 6),
  ('sorvetes-picoles', 'Sorvetes', 0),
  ('sorvetes-picoles', 'Sorvetes cremosos', 1),
  ('sorvetes-picoles', 'Sorvetes de frutas', 2),
  ('sorvetes-picoles', 'Sorvetes para vender', 3),
  ('sorvetes-picoles', 'Picolés', 4),
  ('sorvetes-picoles', 'Picolés cremosos', 5),
  ('sorvetes-picoles', 'Picolés de frutas', 6),
  ('sorvetes-picoles', 'Geladinhos', 7),
  ('sorvetes-picoles', 'Sacolés', 8),
  ('sorvetes-picoles', 'Sobremesas congeladas', 9),
  ('sorvetes-picoles', 'Bases', 10),
  ('sorvetes-picoles', 'Caldas', 11),
  ('sorvetes-picoles', 'Coberturas', 12),
  ('sobremesas', 'Mousses', 0),
  ('sobremesas', 'Pudins', 1),
  ('sobremesas', 'Pavês', 2),
  ('sobremesas', 'Tortas', 3),
  ('sobremesas', 'Cheesecakes', 4),
  ('sobremesas', 'Sobremesas geladas', 5),
  ('sobremesas', 'Sobremesas no pote', 6),
  ('sobremesas', 'Sobremesas para festas', 7),
  ('massas-pizzas', 'Pizzas', 0),
  ('massas-pizzas', 'Massas', 1),
  ('massas-pizzas', 'Lasanhas', 2),
  ('massas-pizzas', 'Nhoques', 3),
  ('massas-pizzas', 'Massas recheadas', 4),
  ('massas-pizzas', 'Molhos', 5),
  ('biscoitos-cookies', 'Biscoitos caseiros', 0),
  ('biscoitos-cookies', 'Cookies', 1),
  ('biscoitos-cookies', 'Biscoitos amanteigados', 2),
  ('biscoitos-cookies', 'Biscoitos recheados', 3),
  ('biscoitos-cookies', 'Biscoitos para vender', 4),
  ('geleias-molhos', 'Geleias', 0),
  ('geleias-molhos', 'Molhos', 1),
  ('geleias-molhos', 'Conservas', 2),
  ('geleias-molhos', 'Pastas', 3),
  ('geleias-molhos', 'Antepastos', 4)
on conflict (categoria_slug, nome) do update set ordem = excluded.ordem;

-- --------------------------------------------------------------- receitas

-- Brigadeiro Gourmet Tradicional
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'brigadeiro-gourmet-tradicional', 'Brigadeiro Gourmet Tradicional', 'O brigadeiro de festa com ponto firme de enrolar, brilho de chocolate e textura sedosa. É a receita que mais se vende em caixinhas e bandejas de encomenda.',
  'doces', 'Brigadeiros', null,
  30, 'facil', 50,
  'unidades', '[{"texto":"Junte o leite condensado, o chocolate em pó peneirado e a manteiga em uma panela de fundo grosso, fora do fogo. Misture até dissolver todo o pó — isso evita bolinhas depois."},{"texto":"Leve ao fogo médio-baixo mexendo sem parar com uma espátula, sempre raspando o fundo e as laterais da panela."},{"texto":"Cozinhe por cerca de 12 minutos, até a massa desgrudar do fundo e você conseguir ver o fundo da panela por 2 segundos ao passar a espátula."},{"texto":"Desligue o fogo, acrescente o creme de leite e misture bem por 1 minuto. Ele dá o brilho e a maciez do brigadeiro gourmet."},{"texto":"Despeje em um prato untado com manteiga, cubra com filme plástico em contato com a massa e deixe esfriar por 2 horas em temperatura ambiente."},{"texto":"Unte as mãos com manteiga, enrole bolinhas de cerca de 15 g, passe no granulado e acomode nas forminhas."}]'::jsonb, '["O ponto certo é o que sustenta a bolinha: se ficar mole, volte ao fogo por mais 2 minutos.","Chocolate em pó 50% cacau dá sabor bem mais intenso do que achocolatado — é ele que justifica o preço de gourmet.","Para encomendas, enrole no dia anterior e mantenha em local fresco e seco, longe da geladeira."]'::jsonb,
  'Em temperatura ambiente, em recipiente fechado e local fresco, por até 4 dias. Refrigerado, até 8 dias — mas retire 1 hora antes de servir para voltar à textura macia.', '["Panela de fundo grosso","Espátula de silicone","Prato untado","Filme plástico"]'::jsonb, '{"brigadeiro","chocolate","festa","doce para vender","clássico"}',
  '{"familia","festa","encomenda","venda","delivery"}', 'doces', true,
  null, 0.7,
  34.03, '2026-05-04', null,
  true, true, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de brigadeiro-gourmet-tradicional
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'leite-condensado', 2, 'lata', 790, null, null, false, 0),
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'chocolate-po', 4, 'colher (sopa)', 48, null, null, false, 1),
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 2),
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'chocolate-granulado', 200, 'g', 200, 'Finalização', null, false, 4),
  ((select id from public.receitas where slug = 'brigadeiro-gourmet-tradicional'), 'forminha-doce', 50, 'unidade', 50, 'Finalização', null, false, 5);

-- Brigadeiro de Ninho com Nutella
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'brigadeiro-de-ninho-com-nutella', 'Brigadeiro de Ninho com Nutella', 'Brigadeiro branco de leite em pó com recheio cremoso de avelã no centro. É o doce de maior valor agregado da linha e o campeão de encomenda para festas.',
  'doces', 'Doces gourmet', null,
  30, 'medio', 40,
  'unidades', '[{"texto":"Coloque o creme de avelã em um saco de confeitar e faça 40 gotinhas sobre um prato forrado com papel-manteiga. Leve ao congelador por 40 minutos até endurecerem."},{"texto":"Em uma panela fria, misture o leite condensado, o leite em pó peneirado e a manteiga até formar um creme liso."},{"texto":"Leve ao fogo baixo mexendo sem parar por cerca de 10 minutos, até desgrudar do fundo da panela."},{"texto":"Fora do fogo, incorpore o creme de leite e misture por 1 minuto. Espalhe em um prato untado, cubra com filme e resfrie por 2 horas."},{"texto":"Pegue uma porção da massa, achate na palma da mão, coloque uma gota congelada de avelã no centro e feche, modelando a bolinha."},{"texto":"Passe no leite em pó e coloque nas forminhas. Sirva no mesmo dia para o centro ficar cremoso."}]'::jsonb, '["Congelar o recheio é o segredo: sem isso ele vaza e o doce perde o formato.","Use leite em pó integral no acabamento — o desnatado deixa o doce com aspecto opaco.","Este é o doce ideal para subir o ticket médio: cobra-se de 2 a 3 vezes o preço do brigadeiro comum."]'::jsonb,
  'Até 3 dias em temperatura ambiente, em pote fechado. Não congele o doce pronto: o leite em pó do acabamento umedece ao descongelar.', '["Panela de fundo grosso","Saco de confeitar","Papel-manteiga","Espátula"]'::jsonb, '{"ninho","nutella","gourmet","doce para vender","festa"}',
  '{"festa","encomenda","venda","delivery"}', 'doces', true,
  null, 0.75,
  38.23, '2026-08-18', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de brigadeiro-de-ninho-com-nutella
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'leite-condensado', 1, 'lata', 395, null, null, false, 0),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'leite-po', 6, 'colher (sopa)', 60, null, null, false, 1),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'manteiga', 1, 'colher (sopa)', 15, null, null, false, 2),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'creme-avela', 140, 'g', 140, 'Recheio', null, false, 4),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'leite-po', 100, 'g', 100, 'Finalização', null, false, 5),
  ((select id from public.receitas where slug = 'brigadeiro-de-ninho-com-nutella'), 'forminha-doce', 40, 'unidade', 40, 'Finalização', null, false, 6);

-- Beijinho de Coco Cremoso
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'beijinho-de-coco', 'Beijinho de Coco Cremoso', 'O par obrigatório do brigadeiro em qualquer festa. Leva coco ralado na massa e no acabamento, com ponto de enrolar firme e sabor de coco de verdade.',
  'doces', 'Doces de festa', null,
  25, 'facil', 45,
  'unidades', '[{"texto":"Misture o leite condensado, o coco ralado e a manteiga em uma panela de fundo grosso ainda fora do fogo."},{"texto":"Cozinhe em fogo médio-baixo, mexendo sem parar, por cerca de 12 minutos, até a massa desgrudar do fundo."},{"texto":"Desligue, junte o creme de leite e misture bem para deixar o doce cremoso."},{"texto":"Transfira para um prato untado, cubra com filme em contato com a massa e deixe esfriar por 2 horas."},{"texto":"Enrole bolinhas com as mãos untadas e passe no coco ralado reservado."}]'::jsonb, '["Coco ralado úmido e adoçado deixa a massa mole: prefira o coco ralado seco, sem açúcar.","Um cravo-da-índia por cima é o acabamento tradicional, mas avise o cliente para retirar antes de comer."]'::jsonb,
  'Até 4 dias em temperatura ambiente, em recipiente fechado, ou 8 dias sob refrigeração.', '["Panela de fundo grosso","Espátula de silicone","Prato untado"]'::jsonb, '{"beijinho","coco","festa","doce para vender"}',
  '{"familia","festa","encomenda","venda"}', 'doces', true,
  null, 0.7,
  36.75, '2026-05-12', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de beijinho-de-coco
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'beijinho-de-coco');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'leite-condensado', 2, 'lata', 790, null, null, false, 0),
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'coco-ralado', 100, 'g', 100, null, null, false, 1),
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 2),
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'coco-ralado', 100, 'g', 100, 'Finalização', null, false, 4),
  ((select id from public.receitas where slug = 'beijinho-de-coco'), 'forminha-doce', 45, 'unidade', 45, 'Finalização', null, false, 5);

-- Trufa de Chocolate Meio Amargo
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'trufa-de-chocolate-meio-amargo', 'Trufa de Chocolate Meio Amargo', 'Ganache firme de chocolate meio amargo banhada em casquinha crocante. Doce de alto valor por unidade, com validade longa e ótimo para vender embalado.',
  'doces', 'Trufas', null,
  60, 'medio', 30,
  'unidades', '[{"texto":"Pique os 300 g de chocolate da ganache e derreta em banho-maria ou no micro-ondas, em intervalos de 30 segundos, mexendo entre eles."},{"texto":"Aqueça o creme de leite sem ferver e despeje sobre o chocolate derretido. Misture do centro para fora até formar um creme liso e brilhante."},{"texto":"Incorpore a manteiga, cubra com filme em contato e leve à geladeira por 3 horas, até firmar."},{"texto":"Modele bolinhas de cerca de 15 g com as mãos frias e volte ao congelador por 20 minutos."},{"texto":"Derreta os 400 g de chocolate do banho e faça a temperagem: leve dois terços a 45 °C, junte o terço restante picado e mexa até chegar a 30 °C."},{"texto":"Banhe cada bolinha com auxílio de um garfo, retire o excesso e deixe secar sobre papel-manteiga em local fresco."}]'::jsonb, '["Sem temperagem a casquinha fica opaca e derrete na mão. É esse passo que separa a trufa caseira da trufa de venda.","Trabalhe em ambiente abaixo de 22 °C. Em dia quente, faça a banha de manhã cedo.","Variações de recheio (maracujá, café, limão) usam a mesma base e permitem cobrar mais caro pelo sortido."]'::jsonb,
  'Até 20 dias em local fresco e seco, longe da luz, em embalagem individual. Refrigerada, até 30 dias, sempre em pote hermético para não pegar cheiro.', '["Termômetro culinário","Tigela para banho-maria","Garfo para banho","Papel-manteiga"]'::jsonb, '{"trufa","chocolate","gourmet","doce para vender","presente"}',
  '{"festa","encomenda","venda","delivery"}', 'doces', true,
  0.15, 0.8,
  50.42, '2026-06-02', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de trufa-de-chocolate-meio-amargo
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'trufa-de-chocolate-meio-amargo');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'trufa-de-chocolate-meio-amargo'), 'chocolate-meio-amargo', 300, 'g', 300, 'Ganache', null, false, 0),
  ((select id from public.receitas where slug = 'trufa-de-chocolate-meio-amargo'), 'creme-de-leite', 1, 'caixa', 200, 'Ganache', null, false, 1),
  ((select id from public.receitas where slug = 'trufa-de-chocolate-meio-amargo'), 'manteiga', 1, 'colher (sopa)', 15, 'Ganache', null, false, 2),
  ((select id from public.receitas where slug = 'trufa-de-chocolate-meio-amargo'), 'chocolate-meio-amargo', 400, 'g', 400, 'Banho', null, false, 3);

-- Bombom Aberto de Morango
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bombom-aberto-de-morango', 'Bombom Aberto de Morango', 'Morango inteiro sobre creme branco em pote, coberto com chocolate. Vende muito bem por WhatsApp e é montado em poucos minutos por unidade.',
  'doces', 'Doces no pote', null,
  40, 'facil', 12,
  'potes', '[{"texto":"Cozinhe o leite condensado com o leite em pó em fogo baixo por 8 minutos, mexendo sempre, até engrossar levemente."},{"texto":"Fora do fogo, junte o creme de leite e misture. Deixe amornar completamente antes de montar."},{"texto":"Lave e seque muito bem os morangos. Corte ao meio os maiores e mantenha alguns inteiros para o topo."},{"texto":"Distribua o creme branco nos potes, preenchendo cerca de dois terços da altura."},{"texto":"Arrume os morangos sobre o creme, encostados na parede do pote para aparecerem por fora."},{"texto":"Derreta o chocolate, deixe amornar e cubra os morangos. Leve à geladeira por 30 minutos antes de fechar os potes."}]'::jsonb, '["Morango molhado solta água e estraga o pote em horas: seque um a um com papel-toalha.","Monte no máximo 24 horas antes da entrega e mantenha refrigerado o tempo todo.","Potes de 180 ml dão margem melhor que os de 250 ml e o cliente percebe o mesmo valor."]'::jsonb,
  'Refrigerado a 4 °C por até 3 dias. Não congele: o morango murcha ao descongelar.', '["Panela","Potes com tampa","Papel-toalha"]'::jsonb, '{"morango","pote","chocolate","doce para vender","delivery"}',
  '{"encomenda","venda","delivery"}', 'doces', true,
  null, 0.7,
  61.74, '2026-08-16', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bombom-aberto-de-morango
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bombom-aberto-de-morango');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'leite-condensado', 1, 'lata', 395, 'Creme branco', null, false, 0),
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'leite-po', 6, 'colher (sopa)', 60, 'Creme branco', null, false, 1),
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'creme-de-leite', 1, 'caixa', 200, 'Creme branco', null, false, 2),
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'morango', 600, 'g', 600, 'Montagem', null, false, 3),
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'chocolate-ao-leite', 300, 'g', 300, 'Cobertura', null, false, 4),
  ((select id from public.receitas where slug = 'bombom-aberto-de-morango'), 'pote-180', 12, 'unidade', 12, 'Montagem', null, false, 5);

-- Palha Italiana Cremosa
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'palha-italiana-cremosa', 'Palha Italiana Cremosa', 'Brigadeiro cremoso misturado com biscoito quebrado, cortado em quadrados. Rende muito, custa pouco por unidade e sai rápido em feiras e bazares.',
  'doces', 'Doces para vender', null,
  25, 'facil', 24,
  'unidades', '[{"texto":"Faça um brigadeiro mole: cozinhe o leite condensado, o chocolate em pó e a manteiga por cerca de 8 minutos, ponto bem mais mole que o de enrolar."},{"texto":"Desligue e misture o creme de leite."},{"texto":"Quebre os biscoitos grosseiramente com as mãos, deixando pedaços irregulares — é isso que dá a textura da palha."},{"texto":"Misture os biscoitos ao brigadeiro ainda morno, sem amassar demais."},{"texto":"Espalhe em uma forma forrada com papel-manteiga, nivelando com as costas de uma colher. Leve à geladeira por 2 horas."},{"texto":"Corte em quadrados de 4 cm, passe no açúcar refinado e embale individualmente."}]'::jsonb, '["Biscoito triturado fino vira massa e perde a graça: quebre com a mão, nunca no processador.","É a receita de melhor margem para começar com pouco dinheiro — o biscoito rende volume barato."]'::jsonb,
  'Até 5 dias em temperatura ambiente, em pote fechado, ou 10 dias refrigerada.', '["Panela","Forma retangular","Papel-manteiga","Faca grande"]'::jsonb, '{"palha italiana","biscoito","barato","doce para vender"}',
  '{"familia","venda","encomenda"}', 'doces', true,
  0.18, 0.75,
  37.04, '2026-07-08', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de palha-italiana-cremosa
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'palha-italiana-cremosa');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'leite-condensado', 2, 'lata', 790, null, null, false, 0),
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'chocolate-po', 6, 'colher (sopa)', 72, null, null, false, 1),
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 2),
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'biscoito-maisena', 400, 'g', 400, null, null, false, 4),
  ((select id from public.receitas where slug = 'palha-italiana-cremosa'), 'acucar-refinado', 50, 'g', 50, 'Finalização', null, false, 5);

-- Brigadeiro Branco de Leite Ninho
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'brigadeiro-branco-de-leite-ninho', 'Brigadeiro Branco de Leite Ninho', 'Brigadeiro branco cremoso, feito com leite em pó de qualidade. É o par do brigadeiro tradicional nas caixinhas e o preferido de quem não gosta de chocolate.',
  'doces', 'Brigadeiros', null,
  25, 'facil', 45,
  'unidades', '[{"texto":"Misture o leite condensado, o leite em pó peneirado e a manteiga em uma panela fria, até dissolver por completo."},{"texto":"Leve ao fogo baixo mexendo sem parar. O brigadeiro branco queima com muita facilidade: não aumente o fogo."},{"texto":"Cozinhe por cerca de 10 minutos, até desgrudar do fundo da panela."},{"texto":"Fora do fogo, junte o creme de leite e misture por 1 minuto."},{"texto":"Espalhe em prato untado, cubra com filme em contato e deixe esfriar por 2 horas."},{"texto":"Enrole bolinhas de 15 g, passe no leite em pó e acomode nas forminhas."}]'::jsonb, '["Fogo baixo do começo ao fim: o leite em pó caramela rápido e o doce fica com pontinhos escuros.","Passe no leite em pó só na hora de servir; feito com antecedência, o acabamento umedece."]'::jsonb,
  'Até 4 dias em temperatura ambiente, em pote fechado, ou 8 dias refrigerado.', '["Panela de fundo grosso","Peneira","Espátula"]'::jsonb, '{"brigadeiro branco","leite ninho","festa","doce para vender"}',
  '{"familia","festa","encomenda","venda","delivery"}', 'doces', true,
  null, 0.75,
  34.65, '2026-08-20', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de brigadeiro-branco-de-leite-ninho
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'leite-condensado', 2, 'lata', 790, null, null, false, 0),
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'leite-po', 10, 'colher (sopa)', 100, null, null, false, 1),
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 2),
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'leite-po', 120, 'g', 120, 'Finalização', null, false, 4),
  ((select id from public.receitas where slug = 'brigadeiro-branco-de-leite-ninho'), 'forminha-doce', 45, 'unidade', 45, 'Finalização', null, false, 5);

-- Casadinho de Doce de Leite
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'casadinho-de-doce-de-leite', 'Casadinho de Doce de Leite', 'Dois biscoitos amanteigados unidos por doce de leite, com a borda passada no coco. Custo baixo por unidade, validade longa e ótima aceitação em festas.',
  'doces', 'Doces de festa', null,
  70, 'medio', 40,
  'unidades', '[{"texto":"Bata a manteiga com o açúcar até formar um creme claro e aerado."},{"texto":"Junte os ovos e bata mais 1 minuto. Incorpore a farinha, o amido e o fermento peneirados."},{"texto":"Una a massa com as mãos, embrulhe em filme e leve à geladeira por 30 minutos."},{"texto":"Abra a massa com 5 mm e corte discos de 3 cm. Asse a 180 °C por 12 minutos, sem deixar dourar demais."},{"texto":"Deixe esfriar completamente sobre uma grade."},{"texto":"Una os biscoitos dois a dois com doce de leite firme e role a lateral no coco ralado."}]'::jsonb, '["Doce de leite mole escorre pelas bordas: use um de consistência firme, próprio para rechear.","Recheie no máximo 2 dias antes da entrega — depois disso o biscoito amolece."]'::jsonb,
  'Até 7 dias em pote hermético. Os biscoitos sem recheio duram 15 dias.', '["Batedeira","Rolo de massa","Cortador redondo","Grade"]'::jsonb, '{"casadinho","doce de leite","biscoito","festa","doce para vender"}',
  '{"festa","encomenda","venda"}', 'doces', true,
  0.1, 0.8,
  41.85, '2026-08-19', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de casadinho-de-doce-de-leite
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'casadinho-de-doce-de-leite');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'manteiga', 200, 'g', 200, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'acucar-refinado', 150, 'g', 150, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'ovo', 2, 'unidade', 2, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'farinha-trigo', 400, 'g', 400, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'amido-milho', 100, 'g', 100, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'fermento-quimico', 1, 'colher (chá)', 5, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'doce-leite', 400, 'g', 400, 'Recheio', null, false, 6),
  ((select id from public.receitas where slug = 'casadinho-de-doce-de-leite'), 'coco-ralado', 100, 'g', 100, 'Finalização', null, false, 7);

-- Cocada Cremosa de Forno
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'cocada-cremosa-de-forno', 'Cocada Cremosa de Forno', 'Cocada macia assada em travessa e cortada em quadrados. Leva poucos ingredientes, rende muito e é uma das melhores margens da categoria.',
  'doces', 'Doces para vender', null,
  50, 'facil', 30,
  'unidades', '[{"texto":"Aqueça o forno a 180 °C e unte uma travessa retangular média."},{"texto":"Misture todos os ingredientes em uma tigela, sem bater — só até ficar homogêneo."},{"texto":"Despeje na travessa e alise a superfície."},{"texto":"Asse por 35 minutos, até a superfície dourar e o centro ficar firme ao toque."},{"texto":"Espere esfriar completamente antes de cortar em quadrados de 4 cm."}]'::jsonb, '["Cortar quente esfarela tudo: espere esfriar de verdade, de preferência algumas horas.","Uma pitada de canela por cima antes de assar dá aroma e valoriza a apresentação."]'::jsonb,
  'Até 5 dias em temperatura ambiente, em pote fechado, ou 10 dias refrigerada.', '["Travessa retangular","Tigela","Espátula"]'::jsonb, '{"cocada","coco","barato","doce para vender","assado"}',
  '{"familia","venda","encomenda","delivery"}', 'doces', true,
  0.12, 0.85,
  39.75, '2026-07-14', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de cocada-cremosa-de-forno
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'cocada-cremosa-de-forno');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'cocada-cremosa-de-forno'), 'coco-ralado', 200, 'g', 200, null, null, false, 0),
  ((select id from public.receitas where slug = 'cocada-cremosa-de-forno'), 'leite-condensado', 2, 'lata', 790, null, null, false, 1),
  ((select id from public.receitas where slug = 'cocada-cremosa-de-forno'), 'leite-coco', 200, 'ml', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'cocada-cremosa-de-forno'), 'ovo', 2, 'unidade', 2, null, null, false, 3),
  ((select id from public.receitas where slug = 'cocada-cremosa-de-forno'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 4);

-- Brigadeiro de Churros
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'brigadeiro-de-churros', 'Brigadeiro de Churros', 'Brigadeiro de doce de leite com canela, recheado com um centro cremoso e passado no açúcar com canela. Sabor de churros no formato de docinho de festa.',
  'doces', 'Doces gourmet', null,
  35, 'medio', 35,
  'unidades', '[{"texto":"Faça gotas com os 150 g de doce de leite do recheio sobre papel-manteiga e leve ao congelador por 40 minutos."},{"texto":"Cozinhe o leite condensado com o doce de leite, a manteiga e a canela em fogo baixo, mexendo sempre, por 12 minutos."},{"texto":"Fora do fogo, junte o creme de leite. Espalhe em prato untado, cubra e resfrie por 2 horas."},{"texto":"Misture o açúcar com a canela da finalização em um prato raso."},{"texto":"Abra uma porção da massa na mão, coloque uma gota congelada no centro e feche em bolinha."},{"texto":"Passe no açúcar com canela e coloque nas forminhas."}]'::jsonb, '["Passar no açúcar com canela só perto da entrega: o açúcar derrete com o tempo e o doce fica molhado.","É um dos doces de maior valor percebido — funciona muito bem em caixas sortidas."]'::jsonb,
  'Até 3 dias em temperatura ambiente, em pote fechado.', '["Panela de fundo grosso","Saco de confeitar","Papel-manteiga"]'::jsonb, '{"churros","doce de leite","canela","gourmet","doce para vender"}',
  '{"festa","encomenda","venda","delivery"}', 'doces', true,
  null, 0.8,
  29.77, '2026-08-21', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de brigadeiro-de-churros
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'brigadeiro-de-churros');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'leite-condensado', 1, 'lata', 395, null, null, false, 0),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'doce-leite', 200, 'g', 200, null, null, false, 1),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'manteiga', 1, 'colher (sopa)', 15, null, null, false, 2),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'canela-po', 1, 'colher (chá)', 3, null, null, false, 3),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 4),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'doce-leite', 150, 'g', 150, 'Recheio', null, false, 5),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'acucar-refinado', 80, 'g', 80, 'Finalização', null, false, 6),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'canela-po', 2, 'colher (chá)', 6, 'Finalização', null, false, 7),
  ((select id from public.receitas where slug = 'brigadeiro-de-churros'), 'forminha-doce', 35, 'unidade', 35, 'Finalização', null, false, 8);

-- Pé de Moleque Caseiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pe-de-moleque-caseiro', 'Pé de Moleque Caseiro', 'Amendoim torrado em caramelo de rapadura, cortado em pedaços. Doce de festa junina que vende o ano inteiro e tem validade longa.',
  'doces', 'Caramelos', null,
  40, 'medio', 30,
  'unidades', '[{"texto":"Torre o amendoim em frigideira seca por 8 minutos, mexendo sempre. Deixe esfriar e retire a pele esfregando entre as mãos."},{"texto":"Leve os dois açúcares ao fogo médio com 100 ml de água, sem mexer, até formar um caramelo dourado."},{"texto":"Junte a manteiga e mexa. Acrescente o amendoim e misture bem."},{"texto":"Fora do fogo, adicione o bicarbonato: a mistura vai crescer e clarear. É isso que deixa o doce quebradiço, e não duro como pedra."},{"texto":"Despeje sobre uma superfície untada, espalhe com espátula e deixe firmar por 10 minutos."},{"texto":"Corte em pedaços ainda morno, com faca grande."}]'::jsonb, '["Caramelo mexido açucara e vira areia. Deixe o açúcar derreter sozinho, girando só a panela.","Corte antes de esfriar por completo, senão ele quebra irregular.","Cuidado: o caramelo passa de 150 °C e queima a pele com facilidade. Use pegador e trabalhe devagar."]'::jsonb,
  'Até 30 dias em pote hermético, longe da umidade. Não refrigere: umedece e gruda.', '["Frigideira","Panela de fundo grosso","Espátula","Faca grande"]'::jsonb, '{"pé de moleque","amendoim","festa junina","caramelo","doce para vender"}',
  '{"festa","venda","encomenda"}', 'doces', true,
  0.12, 0.8,
  25.83, '2026-06-24', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pe-de-moleque-caseiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pe-de-moleque-caseiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pe-de-moleque-caseiro'), 'amendoim', 500, 'g', 500, null, null, false, 0),
  ((select id from public.receitas where slug = 'pe-de-moleque-caseiro'), 'acucar-mascavo', 300, 'g', 300, null, null, false, 1),
  ((select id from public.receitas where slug = 'pe-de-moleque-caseiro'), 'acucar-refinado', 200, 'g', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'pe-de-moleque-caseiro'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 3),
  ((select id from public.receitas where slug = 'pe-de-moleque-caseiro'), 'bicarbonato', 1, 'colher (chá)', 4, null, null, false, 4);

-- Olho de Sogra
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'olho-de-sogra', 'Olho de Sogra', 'Ameixa recheada com beijinho e passada no açúcar cristal. Doce de festa clássico, com boa margem e visual que se destaca na bandeja.',
  'doces', 'Doces de festa', null,
  40, 'facil', 30,
  'unidades', '[{"texto":"Cozinhe o leite condensado com o coco e a manteiga por 12 minutos em fogo baixo, até dar ponto de enrolar."},{"texto":"Espalhe em prato untado, cubra e deixe esfriar por 2 horas."},{"texto":"Abra cada ameixa pela lateral, sem separar as metades."},{"texto":"Modele bolinhas pequenas de beijinho e encaixe dentro da ameixa, deixando o branco aparecendo."},{"texto":"Passe no açúcar cristal e coloque nas forminhas."}]'::jsonb, '["Ameixas muito secas rasgam: se estiverem duras, deixe 10 minutos de molho em água morna e seque bem.","O contraste do branco com o escuro da ameixa é o apelo do doce — não cubra o recheio por completo."]'::jsonb,
  'Até 5 dias em temperatura ambiente, em pote fechado.', '["Panela de fundo grosso","Prato untado","Faca pequena"]'::jsonb, '{"olho de sogra","ameixa","coco","festa","doce para vender"}',
  '{"festa","encomenda","venda"}', 'doces', true,
  null, 0.75,
  38.18, '2026-07-02', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de olho-de-sogra
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'olho-de-sogra');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'leite-condensado', 1, 'lata', 395, null, null, false, 0),
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'coco-ralado', 100, 'g', 100, null, null, false, 1),
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'manteiga', 1, 'colher (sopa)', 15, null, null, false, 2),
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'ameixa-seca', 300, 'g', 300, null, null, false, 3),
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'acucar-cristal', 100, 'g', 100, 'Finalização', null, false, 4),
  ((select id from public.receitas where slug = 'olho-de-sogra'), 'forminha-doce', 30, 'unidade', 30, 'Finalização', null, false, 5);

-- Bolo de Chocolate com Brigadeiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-chocolate-brigadeiro', 'Bolo de Chocolate com Brigadeiro', 'Um bolo fofinho de chocolate com recheio e cobertura de brigadeiro. Perfeito para qualquer ocasião e o pedido mais comum de encomenda de aniversário.',
  'bolos', 'Bolos recheados', null,
  90, 'medio', 20,
  'porções', '[{"titulo":"Massa","texto":"Aqueça o forno a 180 °C. Unte e enfarinhe uma forma redonda de 24 cm."},{"titulo":"Massa","texto":"Bata no liquidificador os ovos, o leite e o óleo por 1 minuto."},{"titulo":"Massa","texto":"Em uma tigela, peneire a farinha, o açúcar e o chocolate em pó. Despeje a mistura líquida e misture com um fouet apenas até ficar homogêneo — bater demais deixa o bolo pesado."},{"titulo":"Massa","texto":"Incorpore o fermento com uma espátula, em movimentos suaves de baixo para cima."},{"titulo":"Massa","texto":"Asse por 40 minutos. O palito espetado no centro deve sair com farelinhos úmidos, não molhado."},{"titulo":"Recheio","texto":"Faça o brigadeiro: cozinhe o leite condensado, o chocolate em pó e a manteiga por 10 minutos em fogo baixo, mexendo sempre. Fora do fogo, junte o creme de leite."},{"titulo":"Montagem","texto":"Espere o bolo esfriar por completo e corte em duas camadas com uma faca de serra."},{"titulo":"Montagem","texto":"Recheie com metade do brigadeiro ainda morno, cubra com a outra camada e espalhe o restante por cima. Finalize com granulado."}]'::jsonb, '["Corte o bolo frio: quente, ele esfarela e as camadas desmontam.","Para encomenda, monte na véspera e guarde em caixa fechada — o bolo fica mais úmido no dia seguinte.","Uma calda simples de leite com açúcar pincelada na massa garante umidade em bolos de festa."]'::jsonb,
  'Coberto, em temperatura ambiente, por 2 dias. Refrigerado, até 5 dias — retire 30 minutos antes de servir. A massa sem recheio congela bem por 3 meses.', '["Forma de 24 cm","Liquidificador","Fouet","Espátula","Faca de serra"]'::jsonb, '{"bolo","chocolate","brigadeiro","aniversário","festa"}',
  '{"familia","festa","encomenda","venda"}', 'bolos', true,
  0.1, 0.7,
  47.3, '2026-05-02', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-chocolate-brigadeiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'farinha-trigo', 2, 'xícara (chá)', 240, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'acucar-refinado', 1, 'xícara (chá)', 180, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'chocolate-po', 1, 'xícara (chá)', 90, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'ovo', 4, 'unidade', 4, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'leite-condensado', 2, 'lata', 790, 'Recheio e cobertura', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'chocolate-po', 7, 'colher (sopa)', 84, 'Recheio e cobertura', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'manteiga', 2, 'colher (sopa)', 30, 'Recheio e cobertura', null, false, 9),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'creme-de-leite', 1, 'caixa', 200, 'Recheio e cobertura', null, false, 10),
  ((select id from public.receitas where slug = 'bolo-de-chocolate-brigadeiro'), 'chocolate-granulado', 150, 'g', 150, 'Recheio e cobertura', null, false, 11);

-- Bolo de Cenoura com Cobertura de Chocolate
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-cenoura-com-cobertura', 'Bolo de Cenoura com Cobertura de Chocolate', 'O bolo caseiro mais vendido do Brasil: massa amarelinha e fofa, com cobertura de chocolate que endurece levemente por cima. Custo baixo e saída garantida em fatias.',
  'bolos', 'Bolos caseiros', null,
  60, 'facil', 16,
  'fatias', '[{"texto":"Aqueça o forno a 180 °C e unte uma forma retangular média."},{"texto":"Descasque as cenouras, corte em rodelas e bata no liquidificador com os ovos e o óleo até formar um creme liso, sem pedaços."},{"texto":"Transfira para uma tigela, junte o açúcar e misture. Acrescente a farinha peneirada aos poucos."},{"texto":"Adicione o fermento por último, misturando delicadamente com a espátula."},{"texto":"Despeje na forma e asse por 35 a 40 minutos, até dourar e passar no teste do palito."},{"titulo":"Cobertura","texto":"Leve ao fogo baixo o açúcar, o chocolate em pó, o leite e a manteiga. Mexa por 4 minutos até engrossar levemente."},{"texto":"Despeje a cobertura sobre o bolo ainda morno, para que ela escorra e cubra toda a superfície."}]'::jsonb, '["Bater a cenoura crua no liquidificador com o óleo é o que dá a cor viva — cenoura cozida escurece a massa.","Vendendo em fatias embaladas individualmente, a margem fica bem acima da do bolo inteiro."]'::jsonb,
  'Coberto, em temperatura ambiente, por 3 dias, ou refrigerado por até 6 dias.', '["Liquidificador","Forma retangular","Espátula","Panela pequena"]'::jsonb, '{"cenoura","bolo caseiro","chocolate","barato","fatia"}',
  '{"familia","venda","encomenda","delivery"}', 'bolos', true,
  0.35, 0.75,
  20.71, '2026-05-06', null,
  true, false, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-cenoura-com-cobertura
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'cenoura', 300, 'g', 300, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'acucar-refinado', 2, 'xícara (chá)', 360, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'farinha-trigo', 2.5, 'xícara (chá)', 300, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'acucar-refinado', 4, 'colher (sopa)', 48, 'Cobertura', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'chocolate-po', 4, 'colher (sopa)', 48, 'Cobertura', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'leite', 4, 'colher (sopa)', 60, 'Cobertura', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-de-cenoura-com-cobertura'), 'manteiga', 2, 'colher (sopa)', 30, 'Cobertura', null, false, 9);

-- Bolo no Pote de Chocolate com Morango
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-no-pote-chocolate-morango', 'Bolo no Pote de Chocolate com Morango', 'Camadas de massa de chocolate, creme e morango dentro do pote. É a receita que mais se vende por WhatsApp: fácil de transportar, entregar e cobrar.',
  'bolos', 'Bolos no pote', null,
  75, 'facil', 15,
  'potes', '[{"texto":"Prepare a massa: bata no liquidificador os ovos, o leite e o óleo; misture aos secos peneirados e finalize com o fermento."},{"texto":"Asse em forma retangular a 180 °C por 30 minutos. Deixe esfriar completamente."},{"texto":"Faça o creme: cozinhe o leite condensado com o leite em pó por 6 minutos em fogo baixo e, fora do fogo, junte o creme de leite. Espere esfriar."},{"texto":"Corte a massa fria em cubos ou use um cortador do diâmetro do pote para tirar discos."},{"texto":"Monte na ordem: massa, creme, morango picado, massa, creme e morango no topo."},{"texto":"Feche os potes e leve à geladeira por no mínimo 4 horas antes de entregar."}]'::jsonb, '["Não encha até a borda: o creme precisa de espaço para a tampa fechar sem transbordar.","Padronize o peso de cada pote em uma balança — cliente que recebe potes diferentes reclama.","Etiqueta com sabor e data de validade profissionaliza a entrega e ajuda a cobrar mais."]'::jsonb,
  'Refrigerado por até 4 dias. Com morango, consuma em 3 dias para manter a aparência.', '["Forma retangular","Liquidificador","Potes de 250 ml","Balança"]'::jsonb, '{"bolo no pote","morango","chocolate","delivery","doce para vender"}',
  '{"encomenda","venda","delivery"}', 'bolos', true,
  null, 0.7,
  54.14, '2026-08-14', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-no-pote-chocolate-morango
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'farinha-trigo', 2, 'xícara (chá)', 240, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'acucar-refinado', 1, 'xícara (chá)', 180, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'chocolate-po', 0.75, 'xícara (chá)', 68, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'leite-condensado', 1, 'lata', 395, 'Creme', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'leite-po', 5, 'colher (sopa)', 50, 'Creme', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'creme-de-leite', 1, 'caixa', 200, 'Creme', null, false, 9),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'morango', 450, 'g', 450, 'Montagem', null, false, 10),
  ((select id from public.receitas where slug = 'bolo-no-pote-chocolate-morango'), 'pote-250', 15, 'unidade', 15, 'Montagem', null, false, 11);

-- Bolo de Fubá Cremoso
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-fuba-cremoso', 'Bolo de Fubá Cremoso', 'Massa que se separa sozinha no forno: base cremosa embaixo e topo dourado por cima. Ingredientes baratíssimos e sabor de fogão a lenha.',
  'bolos', 'Bolos simples', null,
  65, 'facil', 12,
  'fatias', '[{"texto":"Aqueça o forno a 180 °C e unte bem uma forma retangular."},{"texto":"Bata no liquidificador o leite, o fubá, o açúcar, a farinha, o queijo, os ovos e a manteiga por 3 minutos."},{"texto":"Acrescente o fermento e a erva-doce e bata só por mais 5 segundos, o suficiente para incorporar."},{"texto":"Despeje na forma. A massa fica bem líquida — é assim mesmo."},{"texto":"Asse por 45 minutos, até a superfície ficar dourada e firme ao toque. O interior continua cremoso."},{"texto":"Espere amornar antes de cortar, para o creme assentar."}]'::jsonb, '["Não abra o forno nos primeiros 30 minutos: a massa precisa separar as camadas sem choque de temperatura.","É o bolo de menor custo por fatia da categoria — ótimo para começar vendendo no trabalho ou na vizinhança."]'::jsonb,
  'Refrigerado por até 4 dias, coberto. Sirva em temperatura ambiente ou levemente aquecido.', '["Liquidificador","Forma retangular"]'::jsonb, '{"fubá","bolo cremoso","barato","café da tarde","caseiro"}',
  '{"familia","venda","delivery"}', 'bolos', true,
  0.35, 0.8,
  21, '2026-06-20', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-fuba-cremoso
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-fuba-cremoso');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'leite', 3, 'xícara (chá)', 720, null, null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'fuba', 1, 'xícara (chá)', 150, null, null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'acucar-refinado', 2, 'xícara (chá)', 360, null, null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'farinha-trigo', 0.5, 'xícara (chá)', 60, null, null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'queijo-parmesao', 50, 'g', 50, null, null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'ovo', 3, 'unidade', 3, null, null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'manteiga', 2, 'colher (sopa)', 30, null, null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'fermento-quimico', 1, 'colher (sopa)', 12, null, null, false, 7),
  ((select id from public.receitas where slug = 'bolo-de-fuba-cremoso'), 'erva-doce', 1, 'colher (chá)', 3, null, null, true, 8);

-- Bolo Gelado de Coco
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-gelado-de-coco', 'Bolo Gelado de Coco', 'Fatias embrulhadas em papel-alumínio, encharcadas de leite de coco adocicado. Aguenta bem o transporte e é campeão de venda em praia, escola e evento.',
  'bolos', 'Bolos gelados', null,
  80, 'facil', 20,
  'unidades', '[{"texto":"Bata as claras em neve e reserve — é o que deixa a massa leve o bastante para absorver a calda."},{"texto":"Bata as gemas com o açúcar e o óleo, junte o leite e a farinha peneirada alternadamente."},{"texto":"Incorpore as claras em neve e, por fim, o fermento, com movimentos delicados."},{"texto":"Asse em forma retangular grande a 180 °C por 35 minutos."},{"texto":"Misture o leite condensado, o leite de coco e o leite. Fure o bolo ainda morno com um garfo e regue com toda a calda."},{"texto":"Deixe absorver por 1 hora, corte em 20 retângulos, passe no coco ralado e embrulhe cada um em papel-alumínio."},{"texto":"Leve à geladeira por no mínimo 4 horas antes de vender."}]'::jsonb, '["A calda tem que ir no bolo morno: frio, ele não absorve e a fatia fica seca por dentro.","Embrulhado, o bolo gelado viaja bem em caixa térmica — por isso funciona tão bem em venda de rua."]'::jsonb,
  'Refrigerado por até 5 dias, embrulhado. Congelado, até 2 meses; descongele na geladeira.', '["Batedeira","Forma retangular grande","Papel-alumínio","Garfo"]'::jsonb, '{"bolo gelado","coco","venda na rua","barato","evento"}',
  '{"venda","delivery","encomenda"}', 'bolos', true,
  0.2, 0.8,
  34.97, '2026-07-01', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-gelado-de-coco
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-gelado-de-coco');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'ovo', 4, 'unidade', 4, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'acucar-refinado', 2, 'xícara (chá)', 360, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'farinha-trigo', 3, 'xícara (chá)', 360, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'leite-condensado', 1, 'lata', 395, 'Calda', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'leite-coco', 200, 'ml', 200, 'Calda', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'leite', 1, 'xícara (chá)', 240, 'Calda', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-gelado-de-coco'), 'coco-ralado', 100, 'g', 100, 'Finalização', null, false, 9);

-- Bolo Red Velvet com Cream Cheese
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-red-velvet', 'Bolo Red Velvet com Cream Cheese', 'Massa aveludada vermelha com cobertura de cream cheese levemente ácida. É o bolo de festa de maior valor percebido — cobra-se bem acima do bolo comum.',
  'bolos', 'Bolos de festa', null,
  100, 'avancado', 20,
  'porções', '[{"texto":"Aqueça o forno a 175 °C e forre duas formas de 20 cm com papel-manteiga."},{"texto":"Bata os ovos com o açúcar até clarear, junte o óleo em fio e depois o iogurte e o corante."},{"texto":"Peneire a farinha com o cacau e incorpore aos poucos, alternando, sem bater demais."},{"texto":"Misture o vinagre ao fermento e junte por último: a reação é o que dá o miolo aveludado."},{"texto":"Divida entre as formas e asse por 30 minutos. Desenforme ainda mornos e resfrie sobre grade."},{"titulo":"Cobertura","texto":"Bata a manteiga em ponto pomada com o açúcar de confeiteiro até esbranquiçar. Junte o cream cheese gelado e bata só até unir — bater demais talha o creme."},{"texto":"Nivele os bolos, recheie, cubra e alise com espátula. Refrigere por 1 hora antes de cortar."}]'::jsonb, '["Corante em gel dá cor viva com pouca quantidade; o líquido precisa de muito volume e altera a massa.","O cream cheese precisa estar gelado e a manteiga em ponto pomada — temperaturas trocadas fazem a cobertura desandar.","Cobre por porção, não por bolo: é o produto com melhor margem da linha de festas."]'::jsonb,
  'Refrigerado por até 4 dias, em caixa fechada. Sirva 30 minutos após retirar da geladeira. A massa sem cobertura congela por 2 meses.', '["Batedeira","Duas formas de 20 cm","Papel-manteiga","Espátula de confeiteiro","Grade"]'::jsonb, '{"red velvet","cream cheese","bolo de festa","gourmet","casamento"}',
  '{"festa","encomenda","venda"}', 'bolos', true,
  0.1, 0.75,
  55.77, '2026-08-11', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-red-velvet
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-red-velvet');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'farinha-trigo', 2.5, 'xícara (chá)', 300, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'acucar-refinado', 1.5, 'xícara (chá)', 270, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'cacau-po', 2, 'colher (sopa)', 20, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'oleo-soja', 1, 'xícara (chá)', 240, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'iogurte-natural', 170, 'g', 170, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'corante', 10, 'ml', 10, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'vinagre', 1, 'colher (sopa)', 15, 'Massa', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'cream-cheese', 300, 'g', 300, 'Cobertura', null, false, 9),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'manteiga', 100, 'g', 100, 'Cobertura', null, false, 10),
  ((select id from public.receitas where slug = 'bolo-red-velvet'), 'acucar-confeiteiro', 300, 'g', 300, 'Cobertura', null, false, 11);

-- Bolo Formigueiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-formigueiro', 'Bolo Formigueiro', 'Massa branca fofinha salpicada de chocolate granulado, que derrete no forno e forma os pontinhos. Bolo de lanche que agrada criança e adulto.',
  'bolos', 'Bolos simples', null,
  55, 'facil', 14,
  'fatias', '[{"texto":"Aqueça o forno a 180 °C e unte uma forma com furo central."},{"texto":"Bata a manteiga com o açúcar por 4 minutos, até formar um creme claro."},{"texto":"Junte os ovos um a um, batendo bem entre cada adição."},{"texto":"Acrescente a farinha peneirada alternando com o leite, começando e terminando pela farinha."},{"texto":"Incorpore o fermento e, por último, o granulado, misturando com espátula em movimentos leves."},{"texto":"Asse por 40 minutos. Faça o teste do palito antes de tirar."}]'::jsonb, '["Granulado misturado com a batedeira ligada some na massa: incorpore à mão, no fim.","Passar o granulado por um pouco de farinha antes de misturar ajuda a não afundar tudo no fundo."]'::jsonb,
  '3 dias coberto em temperatura ambiente ou 6 dias refrigerado.', '["Batedeira","Forma com furo central","Espátula"]'::jsonb, '{"formigueiro","granulado","bolo caseiro","lanche","barato"}',
  '{"familia","venda","delivery"}', 'bolos', true,
  0.35, 0.8,
  22.82, '2026-08-20', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-formigueiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-formigueiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'ovo', 3, 'unidade', 3, null, null, false, 0),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'acucar-refinado', 1.5, 'xícara (chá)', 270, null, null, false, 1),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'manteiga', 100, 'g', 100, null, null, false, 2),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'leite', 1, 'xícara (chá)', 240, null, null, false, 3),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'farinha-trigo', 2.5, 'xícara (chá)', 300, null, null, false, 4),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'fermento-quimico', 1, 'colher (sopa)', 12, null, null, false, 5),
  ((select id from public.receitas where slug = 'bolo-formigueiro'), 'chocolate-granulado', 150, 'g', 150, null, null, false, 6);

-- Bolo de Laranja com Calda
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-laranja-com-calda', 'Bolo de Laranja com Calda', 'Bolo úmido feito com a laranja inteira batida e regado com calda cítrica. Aroma forte, custo baixo e ótima saída no café da tarde.',
  'bolos', 'Bolos de frutas', null,
  60, 'facil', 14,
  'fatias', '[{"texto":"Corte uma laranja em pedaços com casca, retire as sementes e a parte branca central, que amarga."},{"texto":"Bata no liquidificador a laranja em pedaços, o suco da outra, os ovos, o óleo e o açúcar por 3 minutos."},{"texto":"Transfira para a tigela, junte a farinha peneirada e misture. Incorpore o fermento por último."},{"texto":"Asse em forma untada a 180 °C por 40 minutos."},{"titulo":"Calda","texto":"Ferva o suco das duas laranjas com o açúcar por 5 minutos, até encorpar levemente."},{"texto":"Fure o bolo ainda morno com um garfo e regue com a calda quente."}]'::jsonb, '["A parte branca da laranja é o que amarga. Vale o minuto extra para retirá-la.","A calda entra no bolo morno: frio, ela escorre e o bolo fica seco."]'::jsonb,
  '3 dias em temperatura ambiente, coberto, ou 6 dias refrigerado.', '["Liquidificador","Forma","Panela pequena","Garfo"]'::jsonb, '{"laranja","bolo úmido","cítrico","café da tarde","barato"}',
  '{"familia","venda","encomenda","delivery"}', 'bolos', true,
  0.35, 0.8,
  16.64, '2026-07-18', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-laranja-com-calda
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-laranja-com-calda');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'laranja', 2, 'unidade', 2, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'acucar-refinado', 2, 'xícara (chá)', 360, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'farinha-trigo', 2.5, 'xícara (chá)', 300, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'laranja', 2, 'unidade', 2, 'Calda', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-laranja-com-calda'), 'acucar-refinado', 100, 'g', 100, 'Calda', null, false, 7);

-- Bolo de Milho Cremoso
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-milho-cremoso', 'Bolo de Milho Cremoso', 'Bolo de milho verde batido no liquidificador, com miolo úmido e casquinha dourada. Campeão de junho, mas vende bem o ano inteiro.',
  'bolos', 'Bolos simples', null,
  60, 'facil', 12,
  'fatias', '[{"texto":"Escorra o milho e bata no liquidificador com o leite, o leite condensado, os ovos e a manteiga por 3 minutos."},{"texto":"Junte o fubá e o coco e bata mais 1 minuto, até ficar bem liso."},{"texto":"Acrescente o fermento e pulse só para incorporar."},{"texto":"Despeje em forma untada e enfarinhada com fubá."},{"texto":"Asse a 180 °C por 45 minutos, até a superfície ficar dourada e firme."},{"texto":"Espere amornar antes de desenformar: quente, o bolo cremoso quebra."}]'::jsonb, '["Bater bem o milho é o segredo da textura: pedaços grandes deixam o bolo arenoso.","Use milho em conserva escorrido, sem a água da lata — ela deixa a massa aguada."]'::jsonb,
  'Refrigerado por até 5 dias, coberto. Sirva em temperatura ambiente.', '["Liquidificador","Forma","Espátula"]'::jsonb, '{"milho","festa junina","cremoso","sem farinha","barato"}',
  '{"familia","festa","venda","delivery"}', 'bolos', true,
  0.35, 0.8,
  36.2, '2026-06-12', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-milho-cremoso
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-milho-cremoso');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'milho-verde', 3, 'lata', 600, null, null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'leite', 1, 'xícara (chá)', 240, null, null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'ovo', 3, 'unidade', 3, null, null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'manteiga', 3, 'colher (sopa)', 45, null, null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'fuba', 0.5, 'xícara (chá)', 75, null, null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'coco-ralado', 50, 'g', 50, null, null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-milho-cremoso'), 'fermento-quimico', 1, 'colher (sopa)', 12, null, null, false, 7);

-- Mini Bolos Decorados
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'mini-bolos-decorados', 'Mini Bolos Decorados', 'Bolinhos individuais de massa branca com cobertura colorida. Formato de alto valor por unidade, perfeito para lembrancinha e festa infantil.',
  'bolos', 'Mini bolos', null,
  70, 'medio', 24,
  'unidades', '[{"texto":"Bata a manteiga com o açúcar por 5 minutos, até ficar bem claro e fofo."},{"texto":"Junte os ovos um a um e a baunilha."},{"texto":"Alterne farinha peneirada e leite, começando e terminando pela farinha. Incorpore o fermento."},{"texto":"Distribua em forminhas de cupcake até dois terços e asse a 180 °C por 20 minutos."},{"titulo":"Cobertura","texto":"Bata a manteiga em ponto pomada com o açúcar de confeiteiro por 6 minutos, até esbranquiçar. Divida e tinja com corante."},{"texto":"Espere os bolinhos esfriarem por completo, confeite com bico pitanga e finalize com confeitos."}]'::jsonb, '["Cobertura em bolinho morno derrete e escorre. Espere esfriar de verdade.","Uma cor só, bem-feita, vende mais que várias cores mal aplicadas.","Cobre por unidade: o mini bolo tem margem bem melhor que a fatia de bolo grande."]'::jsonb,
  '3 dias em temperatura ambiente, em caixa fechada. Não refrigere: resseca a massa.', '["Batedeira","Forminhas de cupcake","Saco de confeitar","Bico pitanga"]'::jsonb, '{"mini bolo","cupcake","festa infantil","lembrancinha","decorado"}',
  '{"festa","encomenda","venda","delivery"}', 'bolos', true,
  0.4, 0.8,
  54.37, '2026-08-18', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de mini-bolos-decorados
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'mini-bolos-decorados');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'manteiga', 200, 'g', 200, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'acucar-refinado', 300, 'g', 300, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'ovo', 4, 'unidade', 4, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'farinha-trigo', 400, 'g', 400, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'essencia-baunilha', 5, 'ml', 5, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'manteiga', 150, 'g', 150, 'Cobertura', null, false, 7),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'acucar-confeiteiro', 400, 'g', 400, 'Cobertura', null, false, 8),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'corante', 5, 'ml', 5, 'Cobertura', null, false, 9),
  ((select id from public.receitas where slug = 'mini-bolos-decorados'), 'confeitos', 80, 'g', 80, 'Cobertura', null, false, 10);

-- Bolo no Pote de Ninho com Abacaxi
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-no-pote-de-ninho-com-abacaxi', 'Bolo no Pote de Ninho com Abacaxi', 'Camadas de massa branca, creme de leite ninho e abacaxi caramelizado. Sabor que se destaca no cardápio de bolo no pote e usa fruta barata.',
  'bolos', 'Bolos no pote', null,
  80, 'facil', 15,
  'potes', '[{"texto":"Prepare a massa branca: bata ovos, leite e óleo, junte aos secos peneirados e finalize com o fermento. Asse a 180 °C por 30 minutos."},{"texto":"Descasque o abacaxi, corte em cubos pequenos e leve ao fogo com o açúcar por 15 minutos, até secar a água e caramelizar levemente. Deixe esfriar."},{"texto":"Faça o creme: cozinhe o leite condensado com o leite em pó por 6 minutos e, fora do fogo, junte o creme de leite. Espere esfriar."},{"texto":"Corte a massa fria em cubos."},{"texto":"Monte: massa, creme, abacaxi, massa, creme e abacaxi por cima."},{"texto":"Feche e refrigere por no mínimo 4 horas antes de entregar."}]'::jsonb, '["Abacaxi cru solta muita água e azeda o pote em um dia. Cozinhar não é opcional aqui.","Deixe o abacaxi esfriar por completo antes de montar, senão o creme talha."]'::jsonb,
  'Refrigerado por até 4 dias.', '["Forma retangular","Liquidificador","Panela","Potes de 250 ml"]'::jsonb, '{"bolo no pote","abacaxi","leite ninho","delivery","doce para vender"}',
  '{"encomenda","venda","delivery"}', 'bolos', true,
  null, 0.7,
  41.01, '2026-08-07', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-no-pote-de-ninho-com-abacaxi
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'farinha-trigo', 2, 'xícara (chá)', 240, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'acucar-refinado', 1, 'xícara (chá)', 180, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'oleo-soja', 0.5, 'xícara (chá)', 120, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'fermento-quimico', 1, 'colher (sopa)', 12, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'leite-condensado', 1, 'lata', 395, 'Creme', null, false, 6),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'leite-po', 6, 'colher (sopa)', 60, 'Creme', null, false, 7),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'creme-de-leite', 1, 'caixa', 200, 'Creme', null, false, 8),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'abacaxi', 1, 'unidade', 1, 'Abacaxi', null, false, 9),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'acucar-refinado', 100, 'g', 100, 'Abacaxi', null, false, 10),
  ((select id from public.receitas where slug = 'bolo-no-pote-de-ninho-com-abacaxi'), 'pote-250', 15, 'unidade', 15, 'Montagem', null, false, 11);

-- Bolo de Banana com Aveia
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolo-de-banana-com-aveia', 'Bolo de Banana com Aveia', 'Bolo úmido de banana com aveia e canela, sem cobertura. Atende quem procura opção mais nutritiva e aproveita banana madura demais para comer.',
  'bolos', 'Bolos caseiros', null,
  55, 'facil', 12,
  'fatias', '[{"texto":"Amasse 4 bananas com um garfo e reserve as outras 2 para cobrir o bolo."},{"texto":"Misture as bananas amassadas com os ovos, o açúcar mascavo e o óleo."},{"texto":"Junte a aveia, a farinha e a canela. Incorpore o fermento por último."},{"texto":"Despeje na forma untada e cubra com as bananas restantes fatiadas."},{"texto":"Polvilhe canela e açúcar mascavo por cima e asse a 180 °C por 40 minutos."}]'::jsonb, '["Quanto mais madura a banana, mais doce e úmido o bolo — é a receita ideal para aproveitar as escuras.","Sem cobertura, ele viaja bem e é uma boa opção para vender em marmita de lanche."]'::jsonb,
  '3 dias em temperatura ambiente ou 6 refrigerado. Congela bem por 2 meses.', '["Tigela","Garfo","Forma retangular"]'::jsonb, '{"banana","aveia","saudável","café da manhã","barato"}',
  '{"familia","venda","delivery"}', 'bolos', true,
  0.35, 0.8,
  23.33, '2026-07-26', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolo-de-banana-com-aveia
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolo-de-banana-com-aveia');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'banana', 6, 'unidade', 6, null, null, false, 0),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'ovo', 3, 'unidade', 3, null, null, false, 1),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'acucar-mascavo', 200, 'g', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'oleo-soja', 0.5, 'xícara (chá)', 120, null, null, false, 3),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'aveia', 150, 'g', 150, null, null, false, 4),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'farinha-trigo', 1.5, 'xícara (chá)', 180, null, null, false, 5),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'canela-po', 1, 'colher (chá)', 3, null, null, false, 6),
  ((select id from public.receitas where slug = 'bolo-de-banana-com-aveia'), 'fermento-quimico', 1, 'colher (sopa)', 12, null, null, false, 7);

-- Coxinha de Frango com Catupiry
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'coxinha-de-frango-com-catupiry', 'Coxinha de Frango com Catupiry', 'Massa cozida lisa, recheio de frango desfiado cremoso e requeijão no centro. É o salgado de festa mais pedido e o carro-chefe de quem vende salgados por encomenda.',
  'salgados', 'Coxinhas', null,
  120, 'medio', 40,
  'unidades', '[{"titulo":"Recheio","texto":"Cozinhe o peito de frango em água com sal por 25 minutos. Reserve 2 xícaras do caldo do cozimento e desfie a carne."},{"titulo":"Recheio","texto":"Refogue a cebola e o alho picados, junte o extrato de tomate e o frango desfiado. Tempere, acrescente o cheiro-verde e deixe esfriar."},{"titulo":"Massa","texto":"Ferva o leite com 2 xícaras do caldo reservado, a manteiga e o caldo de galinha."},{"titulo":"Massa","texto":"Com o líquido fervendo, despeje toda a farinha de uma vez e mexa com força e sem parar até a massa desgrudar do fundo e formar uma bola lisa."},{"titulo":"Massa","texto":"Transfere para a bancada e sove ainda morna por 5 minutos, até ficar homogênea. Cubra com um pano enquanto trabalha."},{"titulo":"Modelagem","texto":"Pegue porções de 40 g, abra na palma da mão, coloque o recheio e um pouco de catupiry no centro e feche modelando a gota."},{"titulo":"Empanamento","texto":"Passe pelos ovos batidos e depois na farinha de rosca, pressionando de leve para aderir."},{"titulo":"Fritura","texto":"Frite em óleo a 170 °C, poucas por vez, até dourar por igual. Escorra sobre papel-toalha em pé, para não achatar."}]'::jsonb, '["Massa que gruda na mão precisa de mais cozimento na panela, não de mais farinha — farinha crua deixa gosto.","Óleo muito quente doura por fora e deixa a massa crua por dentro. Sem termômetro, teste com um pedacinho de massa: deve subir borbulhando em 3 segundos.","Congele cruas e empanadas: fritas na hora, garantem entrega quentinha e reduzem a perda."]'::jsonb,
  'Cruas e congeladas por até 3 meses — frite direto do congelador, sem descongelar. Fritas, consuma no mesmo dia.', '["Panela grande","Panela para fritura","Escumadeira","Papel-toalha"]'::jsonb, '{"coxinha","frango","catupiry","salgado para vender","festa"}',
  '{"familia","festa","encomenda","venda","delivery"}', 'salgados', true,
  0.18, 0.7,
  62.94, '2026-08-17', null,
  true, true, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de coxinha-de-frango-com-catupiry
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'peito-frango', 700, 'g', 700, 'Recheio', null, false, 0),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'cebola', 150, 'g', 150, 'Recheio', null, false, 1),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'alho', 15, 'g', 15, 'Recheio', null, false, 2),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'extrato-tomate', 2, 'colher (sopa)', 40, 'Recheio', null, false, 3),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'cheiro-verde', 30, 'g', 30, 'Recheio', null, false, 4),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'catupiry', 200, 'g', 200, 'Recheio', null, false, 5),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'farinha-trigo', 4, 'xícara (chá)', 480, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'leite', 2, 'xícara (chá)', 480, 'Massa', null, false, 7),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'manteiga', 2, 'colher (sopa)', 30, 'Massa', null, false, 8),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'caldo-galinha', 2, 'tablete', 19, 'Massa', null, false, 9),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'ovo', 2, 'unidade', 2, 'Empanamento', null, false, 10),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'farinha-rosca', 300, 'g', 300, 'Empanamento', null, false, 11),
  ((select id from public.receitas where slug = 'coxinha-de-frango-com-catupiry'), 'oleo-soja', 1500, 'ml', 1500, 'Fritura', null, false, 12);

-- Risole de Carne
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'risole-de-carne', 'Risole de Carne', 'Massa de leite cozida, recheio de carne moída bem temperado e formato de meia-lua. Rende muito por quilo de massa e é dos salgados de menor custo por unidade.',
  'salgados', 'Risoles', null,
  90, 'medio', 45,
  'unidades', '[{"titulo":"Recheio","texto":"Refogue a cebola e o alho, junte a carne moída e cozinhe até secar toda a água."},{"titulo":"Recheio","texto":"Acrescente o molho de tomate e cozinhe por 10 minutos até apurar. Finalize com azeitona e cheiro-verde e deixe esfriar por completo."},{"titulo":"Massa","texto":"Ferva o leite com a manteiga e o sal. Junte a farinha de uma vez e mexa vigorosamente até formar uma bola que desgruda da panela."},{"titulo":"Massa","texto":"Sove sobre a bancada até ficar lisa. Trabalhe ainda morna e sempre coberta."},{"titulo":"Modelagem","texto":"Abra a massa com rolo até 3 mm e corte discos com um copo ou cortador de 8 cm."},{"titulo":"Modelagem","texto":"Coloque uma colher de recheio no centro, dobre em meia-lua e sele bem as bordas pressionando com o garfo."},{"titulo":"Empanamento","texto":"Passe no ovo batido e na farinha de rosca. Frite a 170 °C até dourar."}]'::jsonb, '["Recheio quente derrete a massa e abre o salgado na fritura: espere esfriar sempre.","Selar mal é o que faz o risole estourar no óleo. Aperte a borda inteira com o garfo.","Reaproveite as sobras da massa aberta juntando e abrindo de novo, sem desperdício."]'::jsonb,
  'Crus e congelados por até 3 meses. Frite direto do congelador em óleo a 165 °C.', '["Rolo de massa","Cortador redondo","Panela para fritura","Garfo"]'::jsonb, '{"risole","carne moída","salgado para vender","festa","barato"}',
  '{"festa","encomenda","venda","delivery"}', 'salgados', true,
  0.18, 0.75,
  61.09, '2026-06-14', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de risole-de-carne
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'risole-de-carne');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'risole-de-carne'), 'carne-moida', 500, 'g', 500, 'Recheio', null, false, 0),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'cebola', 120, 'g', 120, 'Recheio', null, false, 1),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'alho', 12, 'g', 12, 'Recheio', null, false, 2),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'molho-tomate', 340, 'g', 340, 'Recheio', null, false, 3),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'azeitona', 80, 'g', 80, 'Recheio', null, false, 4),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'cheiro-verde', 30, 'g', 30, 'Recheio', null, false, 5),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'leite', 3, 'xícara (chá)', 720, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'farinha-trigo', 3, 'xícara (chá)', 360, 'Massa', null, false, 7),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'manteiga', 2, 'colher (sopa)', 30, 'Massa', null, false, 8),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'sal', 1, 'colher (chá)', 6, 'Massa', null, false, 9),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'ovo', 2, 'unidade', 2, 'Empanamento', null, false, 10),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'farinha-rosca', 300, 'g', 300, 'Empanamento', null, false, 11),
  ((select id from public.receitas where slug = 'risole-de-carne'), 'oleo-soja', 1500, 'ml', 1500, 'Fritura', null, false, 12);

-- Bolinha de Queijo
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'bolinha-de-queijo', 'Bolinha de Queijo', 'Bolinha crocante por fora com queijo derretido dentro. Massa simples, modelagem rápida e uma das melhores relações entre custo e preço de venda dos salgados.',
  'salgados', 'Bolinhas de queijo', null,
  70, 'facil', 50,
  'unidades', '[{"texto":"Ferva o leite com a manteiga e o caldo de galinha."},{"texto":"Junte a farinha de uma vez e mexa sem parar até a massa desgrudar do fundo da panela."},{"texto":"Adicione o parmesão e sove a massa morna na bancada até ficar lisa."},{"texto":"Corte a mussarela em cubos de 1,5 cm."},{"texto":"Pegue porções de 20 g de massa, achate, coloque um cubo de queijo no centro e feche em bolinha bem vedada."},{"texto":"Empane no ovo e na farinha de rosca e frite a 170 °C até dourar uniformemente."}]'::jsonb, '["Bolinha mal fechada vaza queijo e suja o óleo inteiro. Role entre as palmas até não ver emenda.","Empanar duas vezes (ovo, farinha, ovo, farinha) deixa a casquinha mais crocante e segura melhor o queijo."]'::jsonb,
  'Cruas e congeladas por até 3 meses. Fritas, sirva na hora.', '["Panela de fundo grosso","Panela para fritura","Escumadeira"]'::jsonb, '{"bolinha de queijo","salgado para vender","festa","fácil"}',
  '{"festa","encomenda","venda","delivery"}', 'salgados', true,
  0.18, 0.8,
  56.03, '2026-06-28', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de bolinha-de-queijo
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'bolinha-de-queijo');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'leite', 2, 'xícara (chá)', 480, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'farinha-trigo', 2, 'xícara (chá)', 240, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'manteiga', 2, 'colher (sopa)', 30, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'caldo-galinha', 1, 'tablete', 10, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'queijo-parmesao', 50, 'g', 50, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'queijo-mussarela', 400, 'g', 400, 'Recheio', null, false, 5),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'ovo', 2, 'unidade', 2, 'Empanamento', null, false, 6),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'farinha-rosca', 250, 'g', 250, 'Empanamento', null, false, 7),
  ((select id from public.receitas where slug = 'bolinha-de-queijo'), 'oleo-soja', 1200, 'ml', 1200, 'Fritura', null, false, 8);

-- Empada de Frango
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'empada-de-frango', 'Empada de Frango', 'Massa amanteigada que desmancha na boca com recheio cremoso de frango. Assada, não frita: dá para produzir grande quantidade de uma vez no forno.',
  'salgados', 'Empadas', null,
  100, 'medio', 30,
  'unidades', '[{"titulo":"Recheio","texto":"Cozinhe e desfie o frango. Refogue com cebola e alho, junte o molho de tomate e cozinhe por 10 minutos."},{"titulo":"Recheio","texto":"Dissolva o amido em um pouco de água, junte ao refogado e mexa até engrossar. Fora do fogo, misture o requeijão e a azeitona. Deixe esfriar."},{"titulo":"Massa","texto":"Misture a farinha com o sal e a manteiga gelada em cubos, esfregando com as pontas dos dedos até formar uma farofa."},{"titulo":"Massa","texto":"Junte os ovos e una a massa sem sovar. Embrulhe em filme e leve à geladeira por 30 minutos."},{"titulo":"Montagem","texto":"Forre as forminhas com massa, preencha com o recheio frio e feche com um disco de massa, selando as bordas."},{"texto":"Pincele com gema e asse a 180 °C por 30 minutos, até dourar."}]'::jsonb, '["Manteiga gelada e mão rápida: massa amassada demais fica dura em vez de esfarelar.","Assar em forminhas de alumínio permite entregar na própria forma e cobrar como produto acabado."]'::jsonb,
  'Assadas, 3 dias refrigeradas — aqueça no forno antes de servir. Cruas e montadas, congelam por 2 meses; asse direto do congelador acrescentando 10 minutos.', '["Forminhas de empada","Pincel culinário","Assadeira"]'::jsonb, '{"empada","frango","assado","salgado para vender","festa"}',
  '{"festa","encomenda","venda","delivery"}', 'salgados', true,
  0.2, 0.7,
  46.8, '2026-07-16', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de empada-de-frango
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'empada-de-frango');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'empada-de-frango'), 'farinha-trigo', 4, 'xícara (chá)', 480, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'manteiga', 200, 'g', 200, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'ovo', 2, 'unidade', 2, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'sal', 1, 'colher (chá)', 6, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'peito-frango', 500, 'g', 500, 'Recheio', null, false, 4),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'cebola', 100, 'g', 100, 'Recheio', null, false, 5),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'alho', 10, 'g', 10, 'Recheio', null, false, 6),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'molho-tomate', 340, 'g', 340, 'Recheio', null, false, 7),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'requeijao', 200, 'g', 200, 'Recheio', null, false, 8),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'amido-milho', 1, 'colher (sopa)', 12, 'Recheio', null, false, 9),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'azeitona', 60, 'g', 60, 'Recheio', null, false, 10),
  ((select id from public.receitas where slug = 'empada-de-frango'), 'ovo', 1, 'unidade', 1, 'Finalização', null, false, 11);

-- Quibe Frito Recheado com Queijo
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'quibe-frito', 'Quibe Frito Recheado com Queijo', 'Massa de trigo para quibe com carne moída e hortelã, recheada de queijo. Salgado diferente no cardápio, com boa margem e ótima aceitação em bares e eventos.',
  'salgados', 'Quibes', null,
  90, 'medio', 30,
  'unidades', '[{"texto":"Deixe o trigo de molho em água fria por 1 hora. Escorra e aperte bem com as mãos para tirar todo o excesso de água."},{"texto":"Bata a cebola e o alho no processador e misture ao trigo com a carne moída, o cheiro-verde e o sal."},{"texto":"Amasse com as mãos por 5 minutos até formar uma massa homogênea e que sustenta o formato."},{"texto":"Leve à geladeira por 30 minutos — massa gelada modela muito melhor."},{"texto":"Modele porções de 50 g em formato oval, coloque um palito de mussarela no centro e feche com cuidado."},{"texto":"Frite em óleo a 170 °C até ficarem escuros e firmes. Escorra em papel-toalha."}]'::jsonb, '["Trigo mal escorrido é o erro clássico: a massa desmancha na fritura. Aperte até não pingar mais água.","Molhe as mãos com água gelada para modelar sem grudar."]'::jsonb,
  'Crus e congelados por até 3 meses. Fritos, consuma no mesmo dia.', '["Processador ou liquidificador","Peneira","Panela para fritura"]'::jsonb, '{"quibe","carne","árabe","salgado para vender"}',
  '{"festa","encomenda","venda"}', 'salgados', true,
  0.2, 0.7,
  57.56, '2026-07-22', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de quibe-frito
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'quibe-frito');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'quibe-frito'), 'trigo-quibe', 400, 'g', 400, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'quibe-frito'), 'carne-moida', 500, 'g', 500, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'quibe-frito'), 'cebola', 150, 'g', 150, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'quibe-frito'), 'alho', 12, 'g', 12, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'quibe-frito'), 'cheiro-verde', 40, 'g', 40, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'quibe-frito'), 'sal', 2, 'colher (chá)', 12, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'quibe-frito'), 'queijo-mussarela', 300, 'g', 300, 'Recheio', null, false, 6),
  ((select id from public.receitas where slug = 'quibe-frito'), 'oleo-soja', 1200, 'ml', 1200, 'Fritura', null, false, 7);

-- Esfiha Aberta de Carne
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'esfiha-aberta-de-carne', 'Esfiha Aberta de Carne', 'Massa macia de fermentação com recheio de carne temperada com limão. Assada em grandes fornadas, é um dos salgados mais rentáveis por unidade produzida.',
  'salgados', 'Esfihas', null,
  150, 'medio', 30,
  'unidades', '[{"titulo":"Massa","texto":"Dissolva o fermento no leite morno com o açúcar e espere 10 minutos espumar."},{"titulo":"Massa","texto":"Junte o ovo, o óleo, o sal e a farinha aos poucos. Sove por 10 minutos até a massa ficar lisa e soltar da mão."},{"titulo":"Massa","texto":"Cubra e deixe crescer por 1 hora, até dobrar de volume."},{"titulo":"Recheio","texto":"Pique a cebola e o tomate bem miúdos e misture crus com a carne, o extrato, o suco dos limões e sal."},{"titulo":"Recheio","texto":"Deixe o recheio descansar 20 minutos e escorra o líquido antes de usar — senão a massa fica encharcada."},{"titulo":"Montagem","texto":"Divida a massa em bolinhas de 40 g, abra discos de 10 cm e espalhe uma colher de recheio, deixando 1 cm de borda."},{"texto":"Asse a 220 °C por 15 a 18 minutos, até a borda dourar."}]'::jsonb, '["O recheio vai cru: ele cozinha no forno e mantém a suculência.","Forno bem quente é essencial. Forno morno resseca a massa antes de dourar."]'::jsonb,
  'Assadas, 3 dias refrigeradas. Congeladas depois de assadas, até 2 meses — reaqueça no forno a 180 °C por 8 minutos.', '["Tigela grande","Assadeiras","Rolo de massa","Pano de prato"]'::jsonb, '{"esfiha","carne","assado","árabe","salgado para vender"}',
  '{"venda","encomenda","delivery","festa"}', 'salgados', true,
  0.2, 0.75,
  41.58, '2026-08-05', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de esfiha-aberta-de-carne
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'esfiha-aberta-de-carne');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'farinha-trigo', 5, 'xícara (chá)', 600, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'leite', 1.5, 'xícara (chá)', 360, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'fermento-biologico', 10, 'g', 10, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'acucar-refinado', 2, 'colher (sopa)', 24, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'oleo-soja', 4, 'colher (sopa)', 60, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'ovo', 1, 'unidade', 1, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'sal', 1, 'colher (chá)', 6, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'carne-moida', 600, 'g', 600, 'Recheio', null, false, 7),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'cebola', 300, 'g', 300, 'Recheio', null, false, 8),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'tomate', 300, 'g', 300, 'Recheio', null, false, 9),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'limao', 2, 'unidade', 2, 'Recheio', null, false, 10),
  ((select id from public.receitas where slug = 'esfiha-aberta-de-carne'), 'extrato-tomate', 2, 'colher (sopa)', 40, 'Recheio', null, false, 11);

-- Pão Caseiro Fofinho
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pao-caseiro-fofinho', 'Pão Caseiro Fofinho', 'Pão de leite macio, com miolo branco e casca fina. A receita base de quem quer começar a vender pão: ingredientes baratos e duas fornadas por dia.',
  'paes', 'Pão caseiro', null,
  180, 'medio', 4,
  'pães', '[{"texto":"Aqueça o leite até ficar morno (nunca quente: acima de 40 °C ele mata o fermento). Dissolva o fermento e o açúcar e espere 10 minutos espumar."},{"texto":"Junte os ovos, a manteiga amolecida e metade da farinha. Misture, acrescente o sal e o restante da farinha aos poucos."},{"texto":"Sove na bancada por 12 minutos, até a massa ficar lisa e elástica. Ela deve soltar da mão sem grudar."},{"texto":"Cubra e deixe crescer em local morno por 1 hora, até dobrar de volume."},{"texto":"Divida em 4 partes, modele os pães e coloque em formas untadas. Deixe crescer por mais 40 minutos."},{"texto":"Asse a 180 °C por 30 minutos, até dourar. Pincele manteiga na casca ainda quente para deixá-la macia."}]'::jsonb, '["O ponto da sova é o teste da membrana: estique um pedaço da massa entre os dedos; se afinar sem rasgar, está pronta.","Em dia frio, deixe a massa crescer dentro do forno desligado com uma xícara de água quente ao lado.","Pão caseiro vende melhor quentinho, no fim da tarde. Programe a segunda fornada para esse horário."]'::jsonb,
  '3 dias em saco plástico fechado, em temperatura ambiente. Congelado, até 3 meses — descongele em temperatura ambiente e aqueça no forno por 5 minutos.', '["Formas de pão","Tigela grande","Pano de prato","Pincel"]'::jsonb, '{"pão","caseiro","fermentação","barato","pão para vender"}',
  '{"familia","venda","encomenda","delivery"}', 'paes', true,
  0.14, 0.7,
  17.04, '2026-08-13', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pao-caseiro-fofinho
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pao-caseiro-fofinho');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'farinha-trigo', 1000, 'g', 1000, null, null, false, 0),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'leite', 2, 'xícara (chá)', 480, null, null, false, 1),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'fermento-biologico', 10, 'g', 10, null, null, false, 2),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'acucar-refinado', 4, 'colher (sopa)', 48, null, null, false, 3),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'manteiga', 60, 'g', 60, null, null, false, 4),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'ovo', 2, 'unidade', 2, null, null, false, 5),
  ((select id from public.receitas where slug = 'pao-caseiro-fofinho'), 'sal', 2, 'colher (chá)', 12, null, null, false, 6);

-- Pão de Queijo Mineiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pao-de-queijo-mineiro', 'Pão de Queijo Mineiro', 'Casquinha crocante e interior elástico, feito com polvilho e queijo minas. Congela cru e assa direto: é o produto ideal para vender por saquinho congelado.',
  'paes', 'Pães para vender', null,
  60, 'facil', 50,
  'unidades', '[{"texto":"Misture os dois polvilhos em uma tigela grande."},{"texto":"Ferva o leite com o óleo e o sal e despeje de uma vez sobre o polvilho. Misture com uma colher — a massa vai empelotar, é normal."},{"texto":"Espere amornar e sove com as mãos até a massa ficar homogênea."},{"texto":"Junte os ovos um a um, sovando bem entre cada adição."},{"texto":"Acrescente os queijos ralados e sove até formar uma massa lisa que desgruda das mãos."},{"texto":"Enrole bolinhas de 25 g e asse a 200 °C por 20 minutos, até dourar levemente. Não abra o forno nos primeiros 12 minutos."}]'::jsonb, '["A escaldadura do polvilho com líquido fervente é obrigatória: é ela que dá elasticidade ao pão de queijo.","Congele as bolinhas cruas espalhadas em bandeja e só depois ensaque — assim não grudam umas nas outras.","Vendido congelado em saquinhos de 500 g, dispensa entrega quente e amplia muito o alcance."]'::jsonb,
  'Crus e congelados por até 3 meses. Asse direto do congelador, acrescentando 5 minutos.', '["Tigela grande","Assadeira","Ralador"]'::jsonb, '{"pão de queijo","polvilho","congelado","minas","pão para vender"}',
  '{"familia","venda","encomenda","delivery"}', 'paes', true,
  0.14, 0.75,
  54.68, '2026-06-10', null,
  true, false, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pao-de-queijo-mineiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pao-de-queijo-mineiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'polvilho-azedo', 500, 'g', 500, null, null, false, 0),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'polvilho-doce', 250, 'g', 250, null, null, false, 1),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'leite', 1.5, 'xícara (chá)', 360, null, null, false, 2),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'oleo-soja', 0.5, 'xícara (chá)', 120, null, null, false, 3),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'ovo', 4, 'unidade', 4, null, null, false, 4),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'queijo-minas', 400, 'g', 400, null, null, false, 5),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'queijo-parmesao', 100, 'g', 100, null, null, false, 6),
  ((select id from public.receitas where slug = 'pao-de-queijo-mineiro'), 'sal', 1, 'colher (chá)', 6, null, null, false, 7);

-- Pão Doce Recheado com Creme
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pao-doce-recheado', 'Pão Doce Recheado com Creme', 'Massa doce macia com creme de confeiteiro, no formato tradicional de padaria. Valor agregado alto sobre uma massa de custo baixo.',
  'paes', 'Pães doces', null,
  200, 'avancado', 16,
  'unidades', '[{"titulo":"Creme","texto":"Misture as gemas, o açúcar e o amido. Junte o leite morno aos poucos e leve ao fogo baixo mexendo até engrossar."},{"titulo":"Creme","texto":"Finalize com a baunilha, cubra com filme em contato e resfrie completamente."},{"titulo":"Massa","texto":"Ative o fermento no leite morno com uma colher do açúcar por 10 minutos."},{"titulo":"Massa","texto":"Junte o restante do açúcar, os ovos, o sal e a farinha. Sove por 10 minutos, incorpore a manteiga e sove mais 8 minutos, até a massa ficar sedosa."},{"titulo":"Massa","texto":"Deixe crescer por 1h30, até dobrar."},{"titulo":"Montagem","texto":"Divida em 16 porções, abra cada uma, coloque o creme frio no centro e feche bem, deixando a emenda para baixo."},{"texto":"Deixe crescer por mais 50 minutos, pincele gema e asse a 180 °C por 20 minutos."}]'::jsonb, '["Recheie sempre com creme frio: quente, ele amolece a massa e vaza no forno.","A manteiga entra depois da farinha já hidratada — no início, ela atrapalha a formação do glúten."]'::jsonb,
  '2 dias em temperatura ambiente, embalado. Refrigerado, 4 dias — por causa do creme, não deixe fora da geladeira em dia quente.', '["Batedeira com gancho ou bancada","Assadeiras","Pincel","Filme plástico"]'::jsonb, '{"pão doce","creme","padaria","pão para vender"}',
  '{"venda","encomenda","delivery","familia"}', 'paes', true,
  0.14, 0.75,
  27.35, '2026-07-28', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pao-doce-recheado
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pao-doce-recheado');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'farinha-trigo', 800, 'g', 800, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'leite', 1.5, 'xícara (chá)', 360, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'acucar-refinado', 150, 'g', 150, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'fermento-biologico', 10, 'g', 10, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'manteiga', 100, 'g', 100, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'ovo', 3, 'unidade', 3, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'sal', 1, 'colher (chá)', 6, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'leite', 500, 'ml', 500, 'Creme', null, false, 7),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'acucar-refinado', 100, 'g', 100, 'Creme', null, false, 8),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'amido-milho', 40, 'g', 40, 'Creme', null, false, 9),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'ovo', 2, 'unidade', 2, 'Creme', null, false, 10),
  ((select id from public.receitas where slug = 'pao-doce-recheado'), 'essencia-baunilha', 5, 'ml', 5, 'Creme', null, false, 11);

-- Pão de Forma Integral
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pao-de-forma-integral', 'Pão de Forma Integral', 'Pão de forma com farinha integral e aveia, de miolo firme para fatiar. Atende o público que procura opção mais nutritiva e paga mais por isso.',
  'paes', 'Pães integrais', null,
  190, 'medio', 2,
  'pães', '[{"texto":"Ative o fermento no leite morno com o mel por 10 minutos."},{"texto":"Misture a farinha, a aveia e o sal. Junte o líquido e o óleo e sove por 12 minutos."},{"texto":"A massa integral fica mais pesada e um pouco pegajosa: resista à tentação de colocar muita farinha extra."},{"texto":"Deixe crescer por 1h20, coberta."},{"texto":"Divida em duas, modele em cilindros e coloque em formas de pão untadas. Deixe crescer mais 50 minutos."},{"texto":"Asse a 180 °C por 35 minutos. O pão está pronto quando soa oco ao bater no fundo."}]'::jsonb, '["Espere esfriar completamente antes de fatiar: pão quente esmaga sob a faca.","Fatie e congele com papel entre as fatias para tirar só o que for usar."]'::jsonb,
  '4 dias embalado em temperatura ambiente, ou 3 meses congelado, já fatiado.', '["Duas formas de pão","Tigela grande","Faca de serra"]'::jsonb, '{"pão integral","aveia","saudável","pão de forma"}',
  '{"familia","venda","encomenda"}', 'paes', true,
  0.14, 0.7,
  20.95, '2026-06-25', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pao-de-forma-integral
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pao-de-forma-integral');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'farinha-trigo', 600, 'g', 600, null, null, false, 0),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'aveia', 200, 'g', 200, null, null, false, 1),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'leite', 2, 'xícara (chá)', 480, null, null, false, 2),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'fermento-biologico', 10, 'g', 10, null, null, false, 3),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'mel', 3, 'colher (sopa)', 60, null, null, false, 4),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'oleo-soja', 4, 'colher (sopa)', 60, null, null, false, 5),
  ((select id from public.receitas where slug = 'pao-de-forma-integral'), 'sal', 2, 'colher (chá)', 12, null, null, false, 6);

-- Pão de Batata Recheado com Requeijão
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pao-de-batata-recheado', 'Pão de Batata Recheado com Requeijão', 'Massa fofíssima de batata com requeijão no recheio. Um dos itens de padaria com maior giro e ótima aceitação em lanchonetes e encomendas.',
  'paes', 'Pães recheados', null,
  170, 'medio', 20,
  'unidades', '[{"texto":"Cozinhe as batatas, escorra e amasse ainda quentes até virar um purê liso. Deixe amornar."},{"texto":"Ative o fermento no leite morno com o açúcar."},{"texto":"Misture o purê, o fermento ativado, os ovos, a manteiga, o sal e a farinha aos poucos. Sove por 10 minutos."},{"texto":"Deixe crescer por 1 hora, coberta."},{"texto":"Divida em porções de 60 g, abra na mão, coloque uma colher de requeijão gelado e feche muito bem."},{"texto":"Deixe crescer por 40 minutos, pincele gema e asse a 180 °C por 20 minutos."}]'::jsonb, '["Requeijão gelado, quase firme, é mais fácil de fechar dentro da massa. Se preferir, congele porções antes.","Batata cozida com casca absorve menos água e deixa a massa menos grudenta."]'::jsonb,
  '2 dias em temperatura ambiente ou 4 refrigerado. Congelados assados, até 2 meses.', '["Espremedor de batatas","Assadeiras","Pincel"]'::jsonb, '{"pão de batata","requeijão","recheado","padaria","pão para vender"}',
  '{"venda","encomenda","delivery","festa"}', 'paes', true,
  0.14, 0.75,
  36.47, '2026-08-08', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pao-de-batata-recheado
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pao-de-batata-recheado');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'batata', 500, 'g', 500, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'farinha-trigo', 700, 'g', 700, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'leite', 1, 'xícara (chá)', 240, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'fermento-biologico', 10, 'g', 10, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'acucar-refinado', 3, 'colher (sopa)', 36, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'manteiga', 80, 'g', 80, 'Massa', null, false, 5),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'ovo', 2, 'unidade', 2, 'Massa', null, false, 6),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'sal', 2, 'colher (chá)', 12, 'Massa', null, false, 7),
  ((select id from public.receitas where slug = 'pao-de-batata-recheado'), 'requeijao', 400, 'g', 400, 'Recheio', null, false, 8);

-- Picolé de Morango Cremoso
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'picole-de-morango-cremoso', 'Picolé de Morango Cremoso', 'Picolé de fruta com leite condensado e creme de leite, textura macia mesmo congelado. Custo baixíssimo por unidade e venda rápida no verão.',
  'sorvetes-picoles', 'Picolés cremosos', null,
  30, 'facil', 30,
  'unidades', '[{"texto":"Higienize os morangos e bata no liquidificador com o leite, o leite condensado e o leite em pó."},{"texto":"Junte o creme de leite e bata por mais 30 segundos."},{"texto":"Acrescente o emulsificante e bata na batedeira por 5 minutos, até a mistura clarear e ganhar volume — é isso que deixa o picolé cremoso e não duro como gelo."},{"texto":"Preencha as formas ou os saquinhos até três quartos da altura."},{"texto":"Leve ao congelador por 40 minutos, espete os palitos quando a mistura estiver semifirme e volte ao congelador."},{"texto":"Congele por no mínimo 6 horas antes de desenformar."}]'::jsonb, '["Sem emulsificante o picolé fica com cristais de gelo. É um item barato que muda completamente o produto.","Embale e etiquete assim que desenformar: picolé exposto ao ar congela ressecado.","No verão, é a receita de retorno mais rápido: baixo investimento inicial e venda diária."]'::jsonb,
  'Congelado a -18 °C por até 3 meses, sempre embalado individualmente.', '["Liquidificador","Batedeira","Formas de picolé ou saquinhos","Freezer"]'::jsonb, '{"picolé","morango","verão","barato","picolé para vender"}',
  '{"venda","delivery","familia"}', 'picoles', true,
  null, 0.8,
  46.8, '2026-08-19', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de picole-de-morango-cremoso
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'picole-de-morango-cremoso');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'morango', 600, 'g', 600, null, null, false, 0),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'leite', 2, 'xícara (chá)', 480, null, null, false, 3),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'leite-po', 4, 'colher (sopa)', 40, null, null, false, 4),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'emulsificante', 1, 'colher (sopa)', 15, null, null, false, 5),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'saco-picole', 30, 'unidade', 30, 'Embalagem', null, false, 6),
  ((select id from public.receitas where slug = 'picole-de-morango-cremoso'), 'palito-picole', 30, 'unidade', 30, 'Embalagem', null, false, 7);

-- Geladinho Gourmet de Leite Ninho
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'geladinho-gourmet-de-ninho', 'Geladinho Gourmet de Leite Ninho', 'O geladinho de saquinho na versão cremosa e gourmet. Custo mínimo por unidade, produção em série e é o produto mais fácil de vender no bairro.',
  'sorvetes-picoles', 'Geladinhos', null,
  25, 'facil', 40,
  'unidades', '[{"texto":"Bata todos os ingredientes no liquidificador por 3 minutos, até dissolver completamente o leite em pó."},{"texto":"Deixe a mistura descansar 10 minutos para a espuma baixar — espuma vira gelo quebradiço."},{"texto":"Com auxílio de um funil ou garrafa, encha os saquinhos até dois terços."},{"texto":"Dê um nó firme em cada saquinho, batendo antes para tirar o ar de dentro."},{"texto":"Deite os geladinhos em bandeja no congelador por 8 horas, sem empilhar na primeira noite."}]'::jsonb, '["Encher com garrafa pet cortada ao meio como funil acelera muito a produção em série.","Sabores como maracujá, morango e chocolate usam a mesma base — basta trocar a fruta ou o pó.","É a porta de entrada clássica: com menos de R$ 50 dá para montar a primeira produção completa."]'::jsonb,
  'Congelado por até 3 meses.', '["Liquidificador","Funil ou garrafa","Saquinhos próprios","Freezer"]'::jsonb, '{"geladinho","sacolé","ninho","barato","começar a vender"}',
  '{"venda","delivery"}', 'geladinhos', true,
  null, 0.85,
  30.1, '2026-08-15', null,
  true, false, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de geladinho-gourmet-de-ninho
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'geladinho-gourmet-de-ninho');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'leite', 1000, 'ml', 1000, null, null, false, 0),
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'leite-po', 200, 'g', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'creme-de-leite', 1, 'caixa', 200, null, null, false, 3),
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'acucar-refinado', 100, 'g', 100, null, null, false, 4),
  ((select id from public.receitas where slug = 'geladinho-gourmet-de-ninho'), 'saco-geladinho', 40, 'unidade', 40, 'Embalagem', null, false, 5);

-- Sorvete Cremoso de Chocolate
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'sorvete-cremoso-de-chocolate', 'Sorvete Cremoso de Chocolate', 'Sorvete de massa feito sem sorveteira, com liga neutra e emulsificante. Rende potes de 2 litros com custo muito abaixo do sorvete industrializado.',
  'sorvetes-picoles', 'Sorvetes cremosos', null,
  40, 'medio', 2,
  'potes de 2 L', '[{"texto":"Aqueça metade do leite e dissolva o açúcar, o chocolate em pó e o leite em pó. Não deixe ferver."},{"texto":"Junte o restante do leite frio e a liga neutra, batendo com fouet para não empelotar."},{"texto":"Leve ao congelador por 3 horas, até ficar semicongelado — firme nas bordas e mole no centro."},{"texto":"Bata na batedeira por 8 minutos, adicionando o emulsificante no meio do processo. A massa deve dobrar de volume e ficar bem clara."},{"texto":"Incorpore o creme de leite batendo por mais 2 minutos."},{"texto":"Distribua nos potes, tampe e congele por no mínimo 8 horas."}]'::jsonb, '["O batimento é o que incorpora ar e dá o rendimento: sorvete pouco batido rende menos e fica duro.","Liga neutra evita cristais; emulsificante dá cremosidade. Não substitua um pelo outro.","Potes de 2 L são o formato de melhor margem para vender em casa ou por delivery."]'::jsonb,
  'Congelado a -18 °C por até 3 meses, em pote bem vedado.', '["Batedeira","Fouet","Potes de 2 L","Freezer"]'::jsonb, '{"sorvete","chocolate","sem sorveteira","sorvete para vender"}',
  '{"familia","venda","encomenda","delivery"}', 'sorvetes', true,
  3.2, 0.7,
  42.8, '2026-07-04', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de sorvete-cremoso-de-chocolate
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'leite', 1000, 'ml', 1000, null, null, false, 0),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'leite-po', 200, 'g', 200, null, null, false, 1),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'acucar-refinado', 300, 'g', 300, null, null, false, 2),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'chocolate-po', 150, 'g', 150, null, null, false, 3),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'creme-de-leite', 2, 'caixa', 400, null, null, false, 4),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'liga-neutra', 10, 'g', 10, null, null, false, 5),
  ((select id from public.receitas where slug = 'sorvete-cremoso-de-chocolate'), 'emulsificante', 30, 'g', 30, null, null, false, 6);

-- Picolé Natural de Frutas
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'picole-de-frutas-natural', 'Picolé Natural de Frutas', 'Picolé de fruta com água e açúcar, sem leite. É a opção mais barata de produzir e atende quem procura produto sem lactose.',
  'sorvetes-picoles', 'Picolés de frutas', null,
  25, 'facil', 30,
  'unidades', '[{"texto":"Descasque e pique as frutas. Bata no liquidificador com 500 ml de água filtrada."},{"texto":"Faça uma calda dissolvendo o açúcar em 200 ml de água quente e deixe esfriar."},{"texto":"Misture a calda fria ao suco batido e acerte o doce a gosto. Junte o suco do limão, que realça a fruta e conserva a cor."},{"texto":"Preencha as formas, congele por 40 minutos e espete os palitos."},{"texto":"Congele por 6 horas antes de desenformar e embalar."}]'::jsonb, '["Fruta madura demais fermenta rápido: use fruta no ponto e produza no mesmo dia.","Coar a mistura deixa o picolé com aparência mais limpa e profissional."]'::jsonb,
  'Congelado por até 3 meses, embalado individualmente.', '["Liquidificador","Peneira","Formas de picolé","Freezer"]'::jsonb, '{"picolé","fruta","sem lactose","barato","verão"}',
  '{"venda","delivery","familia"}', 'picoles', true,
  null, 0.85,
  25.78, '2026-07-12', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de picole-de-frutas-natural
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'picole-de-frutas-natural');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'abacaxi', 1, 'unidade', 1, null, null, false, 0),
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'manga', 2, 'unidade', 2, null, null, false, 1),
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'acucar-refinado', 250, 'g', 250, null, null, false, 2),
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'limao', 1, 'unidade', 1, null, null, false, 3),
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'saco-picole', 30, 'unidade', 30, 'Embalagem', null, false, 4),
  ((select id from public.receitas where slug = 'picole-de-frutas-natural'), 'palito-picole', 30, 'unidade', 30, 'Embalagem', null, false, 5);

-- Açaí Cremoso Caseiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'acai-cremoso-caseiro', 'Açaí Cremoso Caseiro', 'Base de açaí batida com banana para dar cremosidade sem precisar de máquina. Vendido em copo com acompanhamentos, tem margem alta por porção.',
  'sorvetes-picoles', 'Sobremesas congeladas', null,
  20, 'facil', 10,
  'porções', '[{"texto":"Congele as bananas descascadas e em rodelas por no mínimo 6 horas."},{"texto":"Bata a polpa de açaí congelada com as bananas no processador, sem adicionar líquido."},{"texto":"Junte o leite condensado e o leite em pó e bata até formar um creme espesso e homogêneo."},{"texto":"Prove e ajuste o doce. Se quiser mais firmeza, leve ao congelador por 1 hora antes de servir."},{"texto":"Monte nos copos alternando o creme com aveia e os acompanhamentos escolhidos."}]'::jsonb, '["Banana congelada é o truque que substitui a máquina de açaí. Sem ela, o creme fica ralo.","Os acompanhamentos (granola, leite condensado, morango) são o que permite cobrar mais por copo — ofereça combos."]'::jsonb,
  'Congelado por até 1 mês. Depois de montado com acompanhamentos, sirva na hora.', '["Processador potente","Copos com tampa","Freezer"]'::jsonb, '{"açaí","copo","delivery","verão","para vender"}',
  '{"venda","delivery","familia"}', 'sorvetes', true,
  null, 0.75,
  28.9, '2026-08-06', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de acai-cremoso-caseiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'acai-cremoso-caseiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'banana', 6, 'unidade', 6, null, null, false, 0),
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'leite-po', 100, 'g', 100, null, null, false, 2),
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'suco-po', 2, 'sachê', 50, null, 'sabor uva ou guaraná, para reforçar a cor', false, 3),
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'aveia', 100, 'g', 100, 'Acompanhamento', null, false, 4),
  ((select id from public.receitas where slug = 'acai-cremoso-caseiro'), 'pote-250', 10, 'unidade', 10, 'Embalagem', null, false, 5);

-- Sorvete de Maracujá de Três Ingredientes
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'sorvete-de-maracuja-tres-ingredientes', 'Sorvete de Maracujá de Três Ingredientes', 'Sorvete rápido que fica pronto no liquidificador, com o azedinho do maracujá equilibrando o doce. Ideal para quem está começando e não tem batedeira.',
  'sorvetes-picoles', 'Sorvetes de frutas', null,
  15, 'facil', 8,
  'porções', '[{"texto":"Bata a polpa de dois maracujás no liquidificador e coe para separar as sementes."},{"texto":"Bata o suco coado com o leite condensado e o creme de leite por 2 minutos."},{"texto":"Junte a polpa dos outros dois maracujás com sementes, misturando com uma colher — elas dão textura e aparência de artesanal."},{"texto":"Distribua nos potes e congele por 6 horas."}]'::jsonb, '["Maracujá muito ácido pede um pouco mais de leite condensado: prove antes de congelar, porque o frio reduz a percepção do doce.","É a receita que melhor mostra o cálculo de custo funcionando: três itens e rendimento previsível."]'::jsonb,
  'Congelado por até 2 meses em pote fechado.', '["Liquidificador","Peneira","Potes com tampa"]'::jsonb, '{"sorvete","maracujá","rápido","3 ingredientes","fácil"}',
  '{"familia","venda","delivery"}', 'sorvetes', true,
  null, 0.75,
  28.66, '2026-06-30', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de sorvete-de-maracuja-tres-ingredientes
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'sorvete-de-maracuja-tres-ingredientes');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'sorvete-de-maracuja-tres-ingredientes'), 'maracuja', 4, 'unidade', 4, null, null, false, 0),
  ((select id from public.receitas where slug = 'sorvete-de-maracuja-tres-ingredientes'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'sorvete-de-maracuja-tres-ingredientes'), 'creme-de-leite', 2, 'caixa', 400, null, null, false, 2),
  ((select id from public.receitas where slug = 'sorvete-de-maracuja-tres-ingredientes'), 'pote-180', 8, 'unidade', 8, 'Embalagem', null, false, 3);

-- Pudim de Leite Condensado sem Furinhos
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pudim-de-leite-condensado', 'Pudim de Leite Condensado sem Furinhos', 'O pudim clássico com textura lisa e calda de caramelo escura. O segredo está em não bater o ar na mistura e assar em banho-maria com temperatura baixa.',
  'sobremesas', 'Pudins', null,
  120, 'medio', 12,
  'fatias', '[{"titulo":"Calda","texto":"Leve o açúcar ao fogo médio em uma panela seca, sem mexer, até derreter e ficar dourado. Junte 100 ml de água quente com cuidado e mexa até dissolver."},{"titulo":"Calda","texto":"Despeje na forma de pudim, girando para cobrir o fundo e as laterais."},{"titulo":"Pudim","texto":"Bata os ovos, o leite condensado e o leite no liquidificador em velocidade baixa por 1 minuto — bater forte incorpora ar e é isso que faz os furinhos."},{"texto":"Passe a mistura por uma peneira ao despejar na forma. Isso retira a espuma e qualquer resíduo de clara."},{"texto":"Cubra a forma com papel-alumínio e asse em banho-maria a 180 °C por 1h20."},{"texto":"Espere esfriar e leve à geladeira por no mínimo 6 horas antes de desenformar."}]'::jsonb, '["Pudim desenformado quente quebra. A paciência de 6 horas na geladeira é parte da receita.","Para soltar, passe a forma rapidamente em água quente e desenforme com um movimento firme.","Vendido em fatias no pote, tem margem melhor que o pudim inteiro e facilita o delivery."]'::jsonb,
  'Refrigerado por até 5 dias, coberto. Não congele: a textura vira borracha.', '["Forma de pudim com furo central","Liquidificador","Peneira","Assadeira para banho-maria"]'::jsonb, '{"pudim","leite condensado","clássico","sobremesa para vender"}',
  '{"familia","festa","encomenda","venda"}', 'sobremesas', true,
  0.3, 0.75,
  30.05, '2026-05-20', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pudim-de-leite-condensado
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pudim-de-leite-condensado');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pudim-de-leite-condensado'), 'leite-condensado', 2, 'lata', 790, 'Pudim', null, false, 0),
  ((select id from public.receitas where slug = 'pudim-de-leite-condensado'), 'leite', 790, 'ml', 790, 'Pudim', null, false, 1),
  ((select id from public.receitas where slug = 'pudim-de-leite-condensado'), 'ovo', 6, 'unidade', 6, 'Pudim', null, false, 2),
  ((select id from public.receitas where slug = 'pudim-de-leite-condensado'), 'acucar-refinado', 300, 'g', 300, 'Calda', null, false, 3);

-- Cheesecake de Morango
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'cheesecake-de-morango', 'Cheesecake de Morango', 'Base crocante de biscoito, recheio de cream cheese e cobertura de morango. É a sobremesa de maior valor percebido para encomendas de aniversário e datas especiais.',
  'sobremesas', 'Cheesecakes', null,
  80, 'medio', 12,
  'fatias', '[{"titulo":"Base","texto":"Triture os biscoitos, misture com a manteiga derretida e forre o fundo de uma forma de aro removível, pressionando bem. Leve à geladeira."},{"titulo":"Creme","texto":"Hidrate a gelatina em 5 colheres de água fria por 5 minutos e dissolva no micro-ondas por 15 segundos."},{"titulo":"Creme","texto":"Bata o cream cheese com o leite condensado, o creme de leite e o suco do limão até ficar liso. Junte a gelatina dissolvida ainda morna, batendo."},{"texto":"Despeje sobre a base e leve à geladeira por 4 horas."},{"titulo":"Cobertura","texto":"Cozinhe metade dos morangos picados com o açúcar por 8 minutos. Junte o amido dissolvido em água e mexa até engrossar. Deixe esfriar."},{"texto":"Cubra a cheesecake com a calda fria e arrume os morangos frescos restantes por cima."}]'::jsonb, '["Gelatina quente demais talha o creme: espere amornar antes de incorporar.","Cobertura quente derrete o creme. Ela precisa estar completamente fria.","É a sobremesa que melhor justifica preço premium: apresente sempre uma foto da fatia cortada."]'::jsonb,
  'Refrigerada por até 4 dias. A base sem cobertura congela por 1 mês.', '["Forma de aro removível","Batedeira","Processador","Panela pequena"]'::jsonb, '{"cheesecake","morango","gourmet","sobremesa para vender","festa"}',
  '{"festa","encomenda","venda","delivery"}', 'sobremesas', true,
  0.3, 0.75,
  105, '2026-08-12', null,
  true, true, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de cheesecake-de-morango
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'cheesecake-de-morango');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'biscoito-maisena', 250, 'g', 250, 'Base', null, false, 0),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'manteiga', 100, 'g', 100, 'Base', null, false, 1),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'cream-cheese', 600, 'g', 600, 'Creme', null, false, 2),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'leite-condensado', 1, 'lata', 395, 'Creme', null, false, 3),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'creme-de-leite', 1, 'caixa', 200, 'Creme', null, false, 4),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'gelatina-incolor', 12, 'g', 12, 'Creme', null, false, 5),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'limao', 1, 'unidade', 1, 'Creme', null, false, 6),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'morango', 600, 'g', 600, 'Cobertura', null, false, 7),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'acucar-refinado', 100, 'g', 100, 'Cobertura', null, false, 8),
  ((select id from public.receitas where slug = 'cheesecake-de-morango'), 'amido-milho', 1, 'colher (sopa)', 12, 'Cobertura', null, false, 9);

-- Pavê de Chocolate
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pave-de-chocolate', 'Pavê de Chocolate', 'Camadas de biscoito embebido, creme branco e brigadeiro mole. Sobremesa de travessa que rende muitas porções com custo baixo — clássica de festa de família.',
  'sobremesas', 'Pavês', null,
  50, 'facil', 15,
  'porções', '[{"titulo":"Creme branco","texto":"Cozinhe o leite condensado, o leite, as gemas e o amido em fogo baixo, mexendo sempre, até engrossar. Deixe amornar."},{"titulo":"Creme de chocolate","texto":"Cozinhe o leite condensado com o chocolate em pó por 8 minutos e, fora do fogo, junte o creme de leite."},{"texto":"Molhe rapidamente os biscoitos no leite — mergulho de 1 segundo, senão desmancham."},{"texto":"Monte na travessa: biscoito, creme branco, biscoito, creme de chocolate, terminando com o creme de chocolate."},{"texto":"Leve à geladeira por no mínimo 6 horas para as camadas assentarem."}]'::jsonb, '["Descansar de um dia para o outro melhora muito: o biscoito absorve o creme e vira bolo.","Em potes individuais, o pavê vira produto de delivery com margem melhor que a travessa."]'::jsonb,
  'Refrigerado por até 4 dias, coberto com filme.', '["Travessa retangular","Panela","Fouet"]'::jsonb, '{"pavê","chocolate","travessa","festa","barato"}',
  '{"familia","festa","encomenda","venda"}', 'sobremesas', true,
  0.52, 0.75,
  45.28, '2026-06-06', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pave-de-chocolate
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pave-de-chocolate');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'biscoito-maisena', 400, 'g', 400, 'Montagem', null, false, 0),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'leite', 500, 'ml', 500, 'Montagem', null, false, 1),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'leite-condensado', 1, 'lata', 395, 'Creme branco', null, false, 2),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'amido-milho', 2, 'colher (sopa)', 24, 'Creme branco', null, false, 3),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'leite', 500, 'ml', 500, 'Creme branco', null, false, 4),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'ovo', 2, 'unidade', 2, 'Creme branco', null, false, 5),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'leite-condensado', 1, 'lata', 395, 'Creme de chocolate', null, false, 6),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'chocolate-po', 5, 'colher (sopa)', 60, 'Creme de chocolate', null, false, 7),
  ((select id from public.receitas where slug = 'pave-de-chocolate'), 'creme-de-leite', 1, 'caixa', 200, 'Creme de chocolate', null, false, 8);

-- Mousse de Maracujá
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'mousse-de-maracuja', 'Mousse de Maracujá', 'Três ingredientes batidos no liquidificador e uma calda de maracujá por cima. Fica pronta em 10 minutos e é a sobremesa mais fácil de produzir em escala.',
  'sobremesas', 'Mousses', null,
  20, 'facil', 12,
  'porções', '[{"texto":"Bata a polpa de 3 maracujás e coe, reservando o suco concentrado."},{"texto":"Hidrate a gelatina em água fria e dissolva no micro-ondas."},{"texto":"Bata no liquidificador o suco, o leite condensado e o creme de leite por 2 minutos. Junte a gelatina e bata mais 20 segundos."},{"texto":"Distribua nos potes e leve à geladeira por 3 horas."},{"titulo":"Calda","texto":"Cozinhe a polpa dos outros 2 maracujás com o açúcar e 100 ml de água por 5 minutos. Deixe esfriar e cubra as mousses."}]'::jsonb, '["A gelatina é o que permite transportar e empilhar os potes sem a mousse escorrer.","Sem a calda por cima, o produto perde metade do apelo visual — ela não é opcional para venda."]'::jsonb,
  'Refrigerada por até 5 dias. Congela por 1 mês sem a calda.', '["Liquidificador","Peneira","Potes com tampa"]'::jsonb, '{"mousse","maracujá","rápido","sobremesa no pote","fácil"}',
  '{"familia","festa","venda","delivery","encomenda"}', 'sobremesas', true,
  null, 0.8,
  39.14, '2026-07-19', null,
  true, false, true
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de mousse-de-maracuja
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'mousse-de-maracuja');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'maracuja', 5, 'unidade', 5, null, null, false, 0),
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'leite-condensado', 1, 'lata', 395, null, null, false, 1),
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'creme-de-leite', 2, 'caixa', 400, null, null, false, 2),
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'gelatina-incolor', 12, 'g', 12, null, null, false, 3),
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'acucar-refinado', 80, 'g', 80, 'Calda', null, false, 4),
  ((select id from public.receitas where slug = 'mousse-de-maracuja'), 'pote-180', 12, 'unidade', 12, 'Embalagem', null, false, 5);

-- Torta de Limão no Pote
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'torta-de-limao-no-pote', 'Torta de Limão no Pote', 'Farofa de biscoito, creme de limão e merengue, montados no pote. Une o sabor da torta clássica com a praticidade de entrega do doce individual.',
  'sobremesas', 'Sobremesas no pote', null,
  45, 'facil', 12,
  'potes', '[{"texto":"Triture os biscoitos e misture com a manteiga derretida até formar uma farofa úmida."},{"texto":"Bata o leite condensado com o creme de leite e o suco dos limões coado. O creme engrossa sozinho pela acidez, em cerca de 2 minutos."},{"texto":"Monte nos potes: uma camada de farofa, uma camada generosa de creme e uma pitada de raspas de limão."},{"texto":"Derreta o chocolate branco, deixe amornar e faça um fio por cima de cada pote."},{"texto":"Refrigere por no mínimo 3 horas antes de entregar."}]'::jsonb, '["Coe o suco de limão: as sementes e o bagaço amargam o creme em poucas horas.","Raspe o limão antes de espremer — depois fica impossível."]'::jsonb,
  'Refrigerada por até 4 dias. Não congele: a base perde a crocância.', '["Processador","Potes com tampa","Ralador fino"]'::jsonb, '{"torta de limão","pote","delivery","sobremesa para vender"}',
  '{"encomenda","venda","delivery"}', 'sobremesas', true,
  null, 0.75,
  50.49, '2026-08-04', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de torta-de-limao-no-pote
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'torta-de-limao-no-pote');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'biscoito-maisena', 300, 'g', 300, 'Base', null, false, 0),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'manteiga', 100, 'g', 100, 'Base', null, false, 1),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'leite-condensado', 2, 'lata', 790, 'Creme', null, false, 2),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'creme-de-leite', 1, 'caixa', 200, 'Creme', null, false, 3),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'limao', 6, 'unidade', 6, 'Creme', null, false, 4),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'chocolate-branco', 150, 'g', 150, 'Finalização', null, false, 5),
  ((select id from public.receitas where slug = 'torta-de-limao-no-pote'), 'pote-180', 12, 'unidade', 12, 'Embalagem', null, false, 6);

-- Pizza Caseira de Massa Fina
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'pizza-caseira-massa-fina', 'Pizza Caseira de Massa Fina', 'Massa de fermentação lenta que fica crocante na borda e macia no centro. Rende bem, aceita qualquer cobertura e é excelente para venda em fins de semana.',
  'massas-pizzas', 'Pizzas', null,
  150, 'medio', 4,
  'pizzas', '[{"texto":"Dissolva o fermento e o açúcar em 600 ml de água morna e espere 10 minutos."},{"texto":"Misture a farinha com o sal, junte a água com fermento e o azeite. Sove por 12 minutos até a massa ficar lisa."},{"texto":"Deixe crescer por 1h30 coberta, ou leve à geladeira por 24 horas para sabor bem melhor."},{"texto":"Divida em 4 bolas, deixe descansar mais 30 minutos e abra com as mãos, do centro para a borda."},{"texto":"Pré-asse cada disco a 250 °C por 6 minutos, sem cobertura."},{"texto":"Cubra com molho, queijo e os complementos e asse por mais 8 minutos, até o queijo borbulhar."}]'::jsonb, '["Forno no máximo, sempre. Pizza caseira falha quase sempre por forno frio.","Pré-assar os discos permite atender pedidos em 10 minutos e é o que viabiliza vender em casa.","Discos pré-assados congelam por 2 meses — ótimo para vender pizza semipronta."]'::jsonb,
  'Discos pré-assados: 2 meses no congelador. Pizza pronta: consuma no dia.', '["Assadeira ou pedra refratária","Rolo ou mãos","Tigela grande"]'::jsonb, '{"pizza","massa","delivery","fim de semana"}',
  '{"familia","venda","delivery","encomenda"}', 'outros', true,
  2.5, 0.7,
  73.78, '2026-07-25', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de pizza-caseira-massa-fina
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'pizza-caseira-massa-fina');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'farinha-trigo', 1000, 'g', 1000, 'Massa', null, false, 0),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'fermento-biologico', 10, 'g', 10, 'Massa', null, false, 1),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'azeite', 60, 'ml', 60, 'Massa', null, false, 2),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'sal', 20, 'g', 20, 'Massa', null, false, 3),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'acucar-refinado', 1, 'colher (sopa)', 12, 'Massa', null, false, 4),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'molho-tomate', 680, 'g', 680, 'Cobertura', null, false, 5),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'queijo-mussarela', 800, 'g', 800, 'Cobertura', null, false, 6),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'tomate', 300, 'g', 300, 'Cobertura', null, false, 7),
  ((select id from public.receitas where slug = 'pizza-caseira-massa-fina'), 'azeitona', 100, 'g', 100, 'Cobertura', null, false, 8);

-- Lasanha à Bolonhesa
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'lasanha-a-bolonhesa', 'Lasanha à Bolonhesa', 'Camadas de massa, molho de carne e queijo, com bechamel cremoso. Prato de travessa que vende muito congelado, por encomenda de fim de semana.',
  'massas-pizzas', 'Lasanhas', null,
  110, 'medio', 10,
  'porções', '[{"texto":"Refogue cebola e alho, junte a carne moída e cozinhe até secar. Acrescente o molho e apure por 20 minutos."},{"texto":"Bechamel: derreta a manteiga, junte a farinha e cozinhe 2 minutos. Adicione o leite aos poucos, mexendo até engrossar. Tempere com sal e noz-moscada."},{"texto":"Cozinhe a massa conforme a embalagem, ou use massa fresca direto."},{"texto":"Monte alternando: molho de carne, massa, presunto e queijo, bechamel. Repita até acabar, terminando com bechamel e parmesão."},{"texto":"Asse coberta com papel-alumínio a 200 °C por 30 minutos. Retire o papel e doure por mais 15 minutos."},{"texto":"Espere 15 minutos antes de cortar, para as camadas firmarem."}]'::jsonb, '["Molho generoso é o que impede a massa de ressecar no forno. Não economize.","Para vender congelada, monte crua em embalagem de alumínio e oriente o cliente a assar por 50 minutos."]'::jsonb,
  'Montada e crua, congela por 3 meses. Assada, 3 dias na geladeira.', '["Travessa refratária ou de alumínio","Panelas","Fouet"]'::jsonb, '{"lasanha","carne","congelado","encomenda","almoço"}',
  '{"familia","encomenda","venda","delivery"}', 'outros', true,
  2.2, 0.65,
  112.6, '2026-06-18', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de lasanha-a-bolonhesa
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'lasanha-a-bolonhesa');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'carne-moida', 700, 'g', 700, 'Molho', null, false, 0),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'molho-tomate', 680, 'g', 680, 'Molho', null, false, 1),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'cebola', 150, 'g', 150, 'Molho', null, false, 2),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'alho', 15, 'g', 15, 'Molho', null, false, 3),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'leite', 1000, 'ml', 1000, 'Bechamel', null, false, 4),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'manteiga', 60, 'g', 60, 'Bechamel', null, false, 5),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'farinha-trigo', 60, 'g', 60, 'Bechamel', null, false, 6),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'queijo-mussarela', 500, 'g', 500, 'Montagem', null, false, 7),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'presunto', 400, 'g', 400, 'Montagem', null, false, 8),
  ((select id from public.receitas where slug = 'lasanha-a-bolonhesa'), 'queijo-parmesao', 100, 'g', 100, 'Montagem', null, false, 9);

-- Nhoque de Batata
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'nhoque-de-batata', 'Nhoque de Batata', 'Nhoque leve com pouca farinha, do jeito tradicional italiano feito no Brasil. Ingredientes de custo baixo e ótima aceitação na tradição do dia 29.',
  'massas-pizzas', 'Massas', null,
  70, 'medio', 6,
  'porções', '[{"texto":"Cozinhe as batatas com casca em água e sal até ficarem macias. Descasque ainda quentes e passe pelo espremedor."},{"texto":"Espalhe o purê na bancada para soltar o vapor e esfriar — purê quente pede mais farinha e deixa o nhoque duro."},{"texto":"Junte o ovo, o parmesão, o sal e a farinha aos poucos, misturando só até a massa desgrudar da mão."},{"texto":"Faça rolinhos de 2 cm e corte em pedaços de 2 cm. Passe cada um no garfo, se quiser as ranhuras."},{"texto":"Cozinhe em água fervente com sal: o nhoque está pronto quando sobe à superfície, cerca de 2 minutos."},{"texto":"Retire com escumadeira e sirva com o molho quente."}]'::jsonb, '["Quanto menos farinha, mais leve o nhoque. Vá acrescentando aos poucos e pare no ponto mínimo.","Congele cru sobre bandeja enfarinhada e depois ensaque: cozinha direto do congelador."]'::jsonb,
  'Cru e congelado, 2 meses. Cozido, consuma no dia.', '["Espremedor de batatas","Panela grande","Escumadeira"]'::jsonb, '{"nhoque","batata","massa","dia 29","barato"}',
  '{"familia","encomenda","venda"}', 'outros', true,
  2.2, 0.7,
  33.37, '2026-07-30', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de nhoque-de-batata
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'nhoque-de-batata');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'batata', 1000, 'g', 1000, null, null, false, 0),
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'farinha-trigo', 300, 'g', 300, null, null, false, 1),
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'ovo', 1, 'unidade', 1, null, null, false, 2),
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'queijo-parmesao', 50, 'g', 50, null, null, false, 3),
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'sal', 1, 'colher (chá)', 6, null, null, false, 4),
  ((select id from public.receitas where slug = 'nhoque-de-batata'), 'molho-tomate', 680, 'g', 680, 'Molho', null, false, 5);

-- Cookie Americano com Gotas de Chocolate
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'cookie-americano-gotas-chocolate', 'Cookie Americano com Gotas de Chocolate', 'Cookie grande, crocante na borda e macio no centro, com pedaços generosos de chocolate. Produto de alto valor unitário e validade longa — ideal para vender embalado.',
  'biscoitos-cookies', 'Cookies', null,
  45, 'facil', 24,
  'unidades', '[{"texto":"Bata a manteiga em ponto pomada com os dois açúcares por 4 minutos, até formar um creme claro e aerado."},{"texto":"Junte os ovos um a um e a baunilha, batendo bem entre cada adição."},{"texto":"Misture a farinha peneirada com o fermento e o sal e incorpore com espátula, sem bater."},{"texto":"Acrescente o chocolate picado grosseiramente."},{"texto":"Faça bolas de 45 g, coloque bem espaçadas na assadeira e leve à geladeira por 30 minutos — massa gelada espalha menos e fica mais alta."},{"texto":"Asse a 180 °C por 12 minutos. O centro parece cru ao sair, e é assim que deve ser: ele firma esfriando."}]'::jsonb, '["Cookie assado até ficar firme no forno vira biscoito duro depois de frio. Confie nos 12 minutos.","Chocolate picado de barra derrete em lascas irregulares e valoriza muito mais que gotas prontas.","Embalado individualmente com etiqueta, é um dos produtos de melhor margem para cafeterias e encomendas."]'::jsonb,
  '7 dias em pote hermético. A massa crua em bolinhas congela por 3 meses — asse direto do congelador com 2 minutos a mais.', '["Batedeira","Assadeiras","Espátula"]'::jsonb, '{"cookie","chocolate","cafeteria","para vender","presente"}',
  '{"venda","encomenda","delivery","familia"}', 'outros', true,
  0.25, 0.75,
  41.08, '2026-08-02', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de cookie-americano-gotas-chocolate
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'cookie-americano-gotas-chocolate');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'manteiga', 200, 'g', 200, null, null, false, 0),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'acucar-cristal', 150, 'g', 150, null, null, false, 1),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'acucar-refinado', 100, 'g', 100, null, null, false, 2),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'ovo', 2, 'unidade', 2, null, null, false, 3),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'essencia-baunilha', 5, 'ml', 5, null, null, false, 4),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'farinha-trigo', 400, 'g', 400, null, null, false, 5),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'fermento-quimico', 1, 'colher (chá)', 5, null, null, false, 6),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'sal', 0.5, 'colher (chá)', 3, null, null, false, 7),
  ((select id from public.receitas where slug = 'cookie-americano-gotas-chocolate'), 'chocolate-meio-amargo', 300, 'g', 300, null, null, false, 8);

-- Biscoito Amanteigado de Maisena
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'biscoito-amanteigado-de-maisena', 'Biscoito Amanteigado de Maisena', 'Biscoito que desmancha na boca, feito com amido de milho. Custo baixíssimo, rende muitas unidades e é um clássico de venda em potes e latas.',
  'biscoitos-cookies', 'Biscoitos amanteigados', null,
  40, 'facil', 60,
  'unidades', '[{"texto":"Bata a manteiga com o açúcar até formar um creme claro."},{"texto":"Junte os ovos e a baunilha e bata mais 1 minuto."},{"texto":"Misture o amido, a farinha e o fermento peneirados. Una com as mãos até formar uma massa macia que não gruda."},{"texto":"Coloque em saco de confeitar com bico pitanga e faça rosetas na assadeira, ou modele bolinhas achatadas com o garfo."},{"texto":"Asse a 180 °C por 12 a 15 minutos. Os biscoitos devem ficar claros: dourados demais perdem a maciez."},{"texto":"Espere esfriar completamente na assadeira antes de mover — quentes, eles quebram."}]'::jsonb, '["Se a massa estiver mole demais para modelar, leve à geladeira por 20 minutos.","Recheados com doce de leite e unidos dois a dois, viram um produto de venda bem mais caro."]'::jsonb,
  '15 dias em pote hermético, longe da umidade.', '["Batedeira","Saco de confeitar","Assadeiras"]'::jsonb, '{"biscoito","maisena","amanteigado","barato","para vender"}',
  '{"familia","venda","encomenda"}', 'outros', true,
  0.1, 0.8,
  28.55, '2026-06-16', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de biscoito-amanteigado-de-maisena
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'manteiga', 200, 'g', 200, null, null, false, 0),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'acucar-refinado', 150, 'g', 150, null, null, false, 1),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'ovo', 2, 'unidade', 2, null, null, false, 2),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'amido-milho', 400, 'g', 400, null, null, false, 3),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'farinha-trigo', 200, 'g', 200, null, null, false, 4),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'fermento-quimico', 1, 'colher (chá)', 5, null, null, false, 5),
  ((select id from public.receitas where slug = 'biscoito-amanteigado-de-maisena'), 'essencia-baunilha', 5, 'ml', 5, null, null, false, 6);

-- Biscoito de Polvilho Assado
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'biscoito-de-polvilho-assado', 'Biscoito de Polvilho Assado', 'Sequinho, leve e sem glúten, no formato de argolinha. Vende bem em pacotinhos para lanche e tem uma das validades mais longas do catálogo.',
  'biscoitos-cookies', 'Biscoitos caseiros', null,
  60, 'medio', 80,
  'unidades', '[{"texto":"Ferva o leite com o óleo e 100 ml de água e o sal."},{"texto":"Despeje sobre o polvilho e misture bem — a massa fica granulada, é normal."},{"texto":"Quando amornar, junte os ovos um a um, sovando até obter uma massa lisa e maleável."},{"texto":"Faça rolinhos finos e una as pontas formando argolinhas."},{"texto":"Asse a 200 °C por 20 a 25 minutos, até inflarem e ficarem sequinhos, com pouca cor."},{"texto":"Deixe esfriar dentro do forno desligado com a porta entreaberta, para secarem por completo."}]'::jsonb, '["Biscoito de polvilho murcha se guardado ainda morno. A secagem no forno desligado é obrigatória.","Guarde em pote de vidro bem fechado: qualquer umidade tira a crocância."]'::jsonb,
  '20 dias em pote hermético. Se amolecer, volte ao forno a 150 °C por 5 minutos.', '["Panela","Assadeiras","Pote hermético"]'::jsonb, '{"polvilho","sem glúten","biscoito","lanche","para vender"}',
  '{"venda","delivery","familia"}', 'outros', true,
  0.08, 0.8,
  19.25, '2026-07-10', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de biscoito-de-polvilho-assado
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'biscoito-de-polvilho-assado');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'polvilho-azedo', 500, 'g', 500, null, null, false, 0),
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'oleo-soja', 150, 'ml', 150, null, null, false, 1),
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'leite', 200, 'ml', 200, null, null, false, 2),
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'ovo', 3, 'unidade', 3, null, null, false, 3),
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'sal', 1, 'colher (chá)', 6, null, null, false, 4),
  ((select id from public.receitas where slug = 'biscoito-de-polvilho-assado'), 'queijo-parmesao', 50, 'g', 50, null, null, true, 5);

-- Geleia de Morango Caseira
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'geleia-de-morango-caseira', 'Geleia de Morango Caseira', 'Geleia com pedaços de fruta, sem pectina industrial. Vende muito bem em potinhos como produto artesanal e acompanha pães e queijos.',
  'geleias-molhos', 'Geleias', null,
  60, 'facil', 4,
  'potes de 250 ml', '[{"texto":"Higienize os morangos, retire as folhas e corte os maiores ao meio."},{"texto":"Misture com o açúcar e o suco dos limões e deixe macerar por 1 hora, até soltar bastante líquido."},{"texto":"Leve ao fogo médio e cozinhe por cerca de 40 minutos, mexendo de vez em quando e retirando a espuma da superfície."},{"texto":"Teste o ponto: pingue um pouco em um prato gelado; se enrugar ao empurrar com o dedo, está pronta."},{"texto":"Envase ainda quente em potes esterilizados, feche e vire de cabeça para baixo por 10 minutos para criar vácuo."}]'::jsonb, '["O limão não é só sabor: a acidez é o que faz a geleia dar ponto sem pectina.","Esterilize os potes fervendo por 15 minutos. É esse cuidado que dá validade longa ao produto vendido.","Rótulo com data de fabricação e validade é exigência básica para vender conserva."]'::jsonb,
  'Pote fechado e com vácuo: 6 meses em local fresco e escuro. Depois de aberto, 30 dias na geladeira.', '["Panela de fundo grosso","Potes de vidro com tampa","Prato para teste do ponto"]'::jsonb, '{"geleia","morango","artesanal","conserva","presente"}',
  '{"familia","venda","encomenda","delivery"}', 'outros', true,
  null, 0.75,
  46.93, '2026-07-06', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de geleia-de-morango-caseira
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'geleia-de-morango-caseira');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'geleia-de-morango-caseira'), 'morango', 1000, 'g', 1000, null, null, false, 0),
  ((select id from public.receitas where slug = 'geleia-de-morango-caseira'), 'acucar-cristal', 600, 'g', 600, null, null, false, 1),
  ((select id from public.receitas where slug = 'geleia-de-morango-caseira'), 'limao', 2, 'unidade', 2, null, null, false, 2),
  ((select id from public.receitas where slug = 'geleia-de-morango-caseira'), 'pote-250', 4, 'unidade', 4, 'Embalagem', null, false, 3);

-- Molho de Tomate Caseiro
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'molho-de-tomate-caseiro', 'Molho de Tomate Caseiro', 'Molho encorpado feito com tomate fresco, que congela bem em porções. Base de pizzas, massas e lasanhas — reduz custo em toda a linha de produção salgada.',
  'geleias-molhos', 'Molhos', null,
  80, 'facil', 6,
  'porções de 250 ml', '[{"texto":"Faça um X na base de cada tomate e mergulhe em água fervente por 1 minuto. Passe para água gelada e retire a pele."},{"texto":"Corte, retire as sementes e pique a polpa."},{"texto":"Refogue a cebola no azeite até ficar transparente, junte o alho e cozinhe mais 1 minuto sem deixar queimar."},{"texto":"Acrescente o tomate, o sal e o açúcar, que corrige a acidez. Cozinhe em fogo baixo por 50 minutos."},{"texto":"Bata parte do molho no liquidificador se quiser textura mais lisa, ou deixe rústico."}]'::jsonb, '["Congele em porções de 250 ml: é a medida de uma pizza ou de uma panela de massa.","Produzir o próprio molho reduz sensivelmente o custo de quem vende pizza ou lasanha em escala."]'::jsonb,
  '5 dias na geladeira ou 6 meses congelado, em porções.', '["Panela grande","Liquidificador","Potes para congelar"]'::jsonb, '{"molho","tomate","base","congelar","economia"}',
  '{"familia","encomenda"}', 'outros', false,
  null, 0.6,
  21.52, '2026-06-08', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de molho-de-tomate-caseiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'molho-de-tomate-caseiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'tomate', 2000, 'g', 2000, null, null, false, 0),
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'cebola', 200, 'g', 200, null, null, false, 1),
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'alho', 20, 'g', 20, null, null, false, 2),
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'azeite', 60, 'ml', 60, null, null, false, 3),
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'acucar-refinado', 1, 'colher (chá)', 5, null, null, false, 4),
  ((select id from public.receitas where slug = 'molho-de-tomate-caseiro'), 'sal', 2, 'colher (chá)', 12, null, null, false, 5);

-- Doce de Leite Caseiro Cremoso
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  'doce-de-leite-caseiro', 'Doce de Leite Caseiro Cremoso', 'Doce de leite feito do zero, com ponto de espalhar. Serve de recheio para bolos e biscoitos e também é vendido em potinhos como produto próprio.',
  'geleias-molhos', 'Pastas', null,
  90, 'medio', 3,
  'potes de 250 ml', '[{"texto":"Leve o leite e o açúcar a uma panela larga e de fundo grosso, em fogo médio."},{"texto":"Deixe ferver mexendo de vez em quando nos primeiros 30 minutos, sempre raspando o fundo."},{"texto":"Quando começar a encorpar e mudar de cor, passe a mexer com frequência — a partir daí queima com facilidade."},{"texto":"Cozinhe por cerca de 1h10 no total, até o doce escurecer e o fundo da panela aparecer ao passar a colher."},{"texto":"Para ponto de espalhar, retire um pouco antes: ele engrossa bastante ao esfriar."},{"texto":"Envase quente em potes esterilizados."}]'::jsonb, '["Panela larga acelera a evaporação e reduz o tempo de fogão pela metade.","Se empelotar, bata rapidamente com o mixer ainda quente.","Uma pitada de bicarbonato no início ajuda a escurecer e a dar o sabor de doce de leite tradicional."]'::jsonb,
  'Pote fechado esterilizado: 3 meses em local fresco. Aberto: 20 dias na geladeira.', '["Panela larga de fundo grosso","Colher de pau","Potes de vidro"]'::jsonb, '{"doce de leite","recheio","artesanal","conserva"}',
  '{"familia","venda","encomenda"}', 'outros', true,
  null, 0.75,
  14.42, '2026-05-28', null,
  true, false, false
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de doce-de-leite-caseiro
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = 'doce-de-leite-caseiro');

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values
  ((select id from public.receitas where slug = 'doce-de-leite-caseiro'), 'leite', 2000, 'ml', 2000, null, null, false, 0),
  ((select id from public.receitas where slug = 'doce-de-leite-caseiro'), 'acucar-refinado', 500, 'g', 500, null, null, false, 1),
  ((select id from public.receitas where slug = 'doce-de-leite-caseiro'), 'pote-250', 3, 'unidade', 3, 'Embalagem', null, false, 2);

-- ============================================================================
-- Conferência rápida (o resultado deve bater com os números do cabeçalho)
-- ============================================================================
-- select count(*) as insumos from public.insumos;
-- select count(*) as receitas from public.receitas where publicada;
-- select count(*) as ingredientes from public.receita_ingredientes;

