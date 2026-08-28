-- Seeds — Central de Receitas & Renda
-- Rode depois da migration 0001_init.sql. Idempotente: pode rodar mais de uma vez
-- (usa on conflict / apaga e recria os vínculos de ingredientes).

-- =========================================================================
-- Permissões
-- =========================================================================
insert into public.permissions (code, label, category) values
  ('recipes.manage', 'Criar, editar e excluir receitas', 'conteúdo'),
  ('ingredients.manage', 'Gerenciar ingredientes e preços', 'conteúdo'),
  ('news.manage', 'Gerenciar novidades', 'conteúdo'),
  ('banners.manage', 'Gerenciar banners e destaques', 'conteúdo'),
  ('users.manage', 'Gerenciar usuários assinantes', 'pessoas'),
  ('admins.manage', 'Gerenciar administradores', 'pessoas'),
  ('permissions.manage', 'Gerenciar papéis e permissões', 'pessoas'),
  ('plans.manage', 'Gerenciar planos', 'financeiro'),
  ('subscriptions.manage', 'Gerenciar assinaturas', 'financeiro'),
  ('reports.view', 'Ver relatórios', 'financeiro'),
  ('comments.moderate', 'Moderar comentários', 'atendimento'),
  ('notifications.manage', 'Enviar notificações', 'atendimento'),
  ('support.manage', 'Gerenciar chamados de suporte', 'atendimento'),
  ('logs.view', 'Ver logs do sistema', 'sistema'),
  ('settings.manage', 'Alterar configurações gerais', 'sistema')
on conflict (code) do nothing;

-- =========================================================================
-- Papéis
-- =========================================================================
insert into public.roles (name, description) values
  ('Super Admin', 'Acesso total ao painel administrativo'),
  ('Admin', 'Gerencia conteúdo, pessoas e financeiro, exceto outros administradores'),
  ('Editor', 'Gerencia receitas, ingredientes, novidades e banners'),
  ('Suporte', 'Atende usuários, modera comentários e responde chamados')
on conflict (name) do nothing;

-- Super Admin: todas as permissões
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name = 'Super Admin'
on conflict do nothing;

-- Admin: tudo, exceto administradores e permissões
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name = 'Admin' and p.code not in ('admins.manage','permissions.manage')
on conflict do nothing;

-- Editor: conteúdo
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name = 'Editor' and p.code in ('recipes.manage','ingredients.manage','news.manage','banners.manage')
on conflict do nothing;

-- Suporte: atendimento + visão de usuários
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name = 'Suporte' and p.code in ('support.manage','comments.moderate','notifications.manage','users.manage')
on conflict do nothing;

-- =========================================================================
-- Categorias
-- =========================================================================
insert into public.categories (name, slug, icon, sort_order) values
  ('Doces', 'doces', 'sparkle', 1),
  ('Bolos', 'bolos', 'book', 2),
  ('Salgados', 'salgados', 'storefront', 3),
  ('Pães', 'paes', 'wheat', 4),
  ('Picolés e Sorvetes', 'picoles-e-sorvetes', 'star', 5),
  ('Tortas e Sobremesas', 'tortas-e-sobremesas', 'heart', 6),
  ('Outros', 'outros', 'grid', 7)
on conflict (slug) do nothing;

-- =========================================================================
-- Planos
-- =========================================================================
insert into public.plans (name, slug, price, billing_period, description, features, hotmart_offer_code, is_active, sort_order) values
  ('Gratuito', 'gratuito', 0, 'gratuito', 'Acesso limitado para experimentar a plataforma.',
    '["Acesso a receitas selecionadas","Calculadora de custos básica","1 coleção"]'::jsonb, null, true, 1),
  ('Mensal', 'mensal', 29.90, 'mensal', 'Acesso completo, renovação mensal.',
    '["Biblioteca completa de receitas","Todas as calculadoras","Central de Renda e Simulador","Coleções ilimitadas"]'::jsonb, 'oferta-mensal', true, 2),
  ('Anual', 'anual', 299.00, 'anual', 'Acesso completo com desconto anual.',
    '["Tudo do plano Mensal","2 meses grátis","Suporte prioritário"]'::jsonb, 'oferta-anual', true, 3),
  ('Vitalício', 'vitalicio', 497.00, 'vitalicio', 'Pagamento único, acesso para sempre.',
    '["Tudo do plano Anual","Atualizações vitalícias","Acesso a receitas exclusivas"]'::jsonb, 'oferta-vitalicio', true, 4)
on conflict (slug) do nothing;

-- =========================================================================
-- Ingredientes (nome, unidade, preço da embalagem, quantidade na embalagem)
-- =========================================================================
insert into public.ingredients (name, unit, package_price, package_quantity, supplier) values
  ('Farinha de trigo', 'g', 5.00, 1000, 'Atacadão'),
  ('Açúcar refinado', 'g', 4.50, 1000, 'Atacadão'),
  ('Ovos', 'unidade', 9.00, 12, 'Granja Local'),
  ('Leite integral', 'ml', 4.80, 1000, 'Atacadão'),
  ('Óleo de soja', 'ml', 7.50, 900, 'Atacadão'),
  ('Fermento em pó químico', 'g', 5.00, 100, 'Atacadão'),
  ('Fermento biológico seco', 'g', 9.00, 100, 'Atacadão'),
  ('Manteiga', 'g', 9.00, 200, 'Atacadão'),
  ('Chocolate em pó 50%', 'g', 8.00, 200, 'Atacadão'),
  ('Chocolate meio amargo (barra)', 'g', 28.00, 1000, 'Atacadão'),
  ('Leite condensado', 'g', 6.00, 395, 'Atacadão'),
  ('Creme de leite', 'g', 4.00, 200, 'Atacadão'),
  ('Leite em pó (tipo Ninho)', 'g', 18.00, 380, 'Atacadão'),
  ('Nutella', 'g', 25.00, 350, 'Atacadão'),
  ('Chocolate granulado', 'g', 6.00, 150, 'Atacadão'),
  ('Cream cheese', 'g', 14.00, 300, 'Atacadão'),
  ('Biscoito maisena', 'g', 6.00, 200, 'Atacadão'),
  ('Morango', 'g', 8.00, 300, 'Sacolão'),
  ('Frango (peito cozido e desfiado)', 'g', 18.00, 1000, 'Açougue'),
  ('Catupiry', 'g', 16.00, 300, 'Atacadão'),
  ('Farinha de rosca', 'g', 5.00, 300, 'Atacadão'),
  ('Palito de picolé', 'unidade', 5.00, 50, 'Loja de embalagens'),
  ('Sal refinado', 'g', 3.00, 1000, 'Atacadão'),
  ('Potinho descartável 200ml', 'unidade', 10.00, 25, 'Loja de embalagens')
on conflict do nothing;

-- =========================================================================
-- Novidades
-- =========================================================================
insert into public.news (title, slug, description, status, published_at) values
  ('Novas receitas de inverno', 'novas-receitas-de-inverno', '15 novas receitas deliciosas para aquecer seus dias frios.', 'published', now() - interval '2 days'),
  ('Especial Dia das Mães', 'especial-dia-das-maes', 'Coleção especial com receitas para o Dia das Mães.', 'published', now() - interval '20 days'),
  ('Novos picolés cremosos', 'novos-picoles-cremosos', 'Receitas refrescantes para você vender muito!', 'published', now() - interval '25 days')
on conflict (slug) do nothing;

-- =========================================================================
-- Banners
-- =========================================================================
insert into public.banners (title, subtitle, position, is_active, sort_order) values
  ('Biblioteca em expansão', 'Novas receitas adicionadas toda semana!', 'home_hero', true, 1),
  ('Novidades disponíveis!', 'Novas receitas foram adicionadas esta semana.', 'home_news', true, 2)
on conflict do nothing;

-- =========================================================================
-- Configurações padrão
-- =========================================================================
insert into public.settings (key, value) values
  ('site_name', '"Central de Receitas & Renda"'::jsonb),
  ('support_email', '"suporte@receitaserenda.com.br"'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('default_profit_margin', '70'::jsonb),
  ('income_center_budgets', '[30,50,100,300,500]'::jsonb),
  ('goal_simulator_default_income', '1500'::jsonb),
  ('goal_simulator_default_days', '5'::jsonb),
  ('ai_assistant_enabled', 'true'::jsonb),
  ('ai_assistant_welcome', '"Olá! Sou o Assistente IA da Central de Receitas & Renda."'::jsonb)
on conflict (key) do nothing;

-- =========================================================================
-- Receitas
-- =========================================================================

-- 1. Brigadeiro Gourmet de Ninho com Nutella
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Brigadeiro Gourmet de Ninho com Nutella', 'brigadeiro-gourmet-ninho-com-nutella', c.id, 'Fácil', 30, 50, 'unidades',
  'Brigadeiro cremoso com leite em pó e Nutella, enrolado em chocolate granulado.',
  '["Leve o leite condensado, o leite em pó e a manteiga ao fogo baixo, mexendo sempre.","Junte a Nutella e continue mexendo até desgrudar do fundo da panela.","Deixe esfriar, enrole as bolinhas e passe no chocolate granulado.","Coloque em forminhas de papel."]'::jsonb,
  'Unte as mãos com manteiga para enrolar sem grudar. Renda melhor se a massa descansar 1h na geladeira.',
  'Geladeira em recipiente fechado por até 7 dias.',
  'Panela funda, colher de pau ou espátula, forminhas de papel.',
  0.08, 0.05, 75, true, true, true
from public.categories c where c.slug = 'doces'
on conflict (slug) do nothing;

-- 2. Cheesecake de Morango
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Cheesecake de Morango', 'cheesecake-de-morango', c.id, 'Médio', 80, 12, 'fatias',
  'Base crocante de biscoito, recheio cremoso de cream cheese e cobertura de morango.',
  '["Triture o biscoito e misture com a manteiga derretida; forre o fundo de uma forma.","Bata o cream cheese com o açúcar e o creme de leite até ficar liso.","Despeje sobre a base e leve à geladeira por 4 horas.","Cozinhe os morangos com o leite condensado até formar uma calda e cubra o cheesecake."]'::jsonb,
  'Use cream cheese em temperatura ambiente para não empelotar.',
  'Geladeira por até 4 dias, bem coberto.',
  'Forma de fundo removível, batedeira, panela pequena.',
  1.20, 1.50, 65, true, false, true
from public.categories c where c.slug = 'tortas-e-sobremesas'
on conflict (slug) do nothing;

-- 3. Coxinha de Frango Catupiry
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Coxinha de Frango Catupiry', 'coxinha-de-frango-catupiry', c.id, 'Médio', 45, 40, 'unidades',
  'Massa lisa recheada com frango desfiado e catupiry, empanada e frita.',
  '["Leve o leite, a manteiga e a farinha ao fogo até formar uma massa lisa que desgruda da panela.","Misture o frango desfiado com o catupiry para o recheio.","Modele as coxinhas com a massa ainda morna, recheando com a mistura de frango.","Passe na farinha de rosca e frite em óleo quente até dourar."]'::jsonb,
  'Modele a massa ainda morna, ela endurece rápido. Congele antes de fritar para manter o formato.',
  'Congelador por até 3 meses (crua) ou geladeira por 2 dias (frita).',
  'Panela, fogão, fritadeira ou panela funda para fritura.',
  0.12, 0.10, 72, true, true, false
from public.categories c where c.slug = 'salgados'
on conflict (slug) do nothing;

-- 4. Bolo Chocolate Trufado
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Bolo Chocolate Trufado', 'bolo-chocolate-trufado', c.id, 'Médio', 90, 16, 'fatias',
  'Bolo de chocolate fofinho coberto com trufa cremosa de chocolate meio amargo.',
  '["Misture os ingredientes secos e depois os líquidos até obter uma massa homogênea.","Asse em forno pré-aquecido a 180°C por cerca de 40 minutos.","Para a trufa, derreta o chocolate com o creme de leite em banho-maria.","Desenforme o bolo frio e cubra com a trufa."]'::jsonb,
  'Fure o bolo com um palito antes de cobrir para a trufa penetrar mais.',
  'Geladeira por até 5 dias, tampado.',
  'Forma de bolo, forno, batedeira, banho-maria.',
  0.10, 0.15, 68, true, true, false
from public.categories c where c.slug = 'bolos'
on conflict (slug) do nothing;

-- 5. Picolé de Morango Cremoso
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Picolé de Morango Cremoso', 'picole-de-morango-cremoso', c.id, 'Fácil', 480, 30, 'unidades',
  'Picolé cremoso de morango, sem conservantes, pronto em 8 horas de congelamento.',
  '["Bata os morangos, o leite condensado e o creme de leite no liquidificador.","Despeje nas forminhas de picolé e insira os palitos.","Congele por pelo menos 8 horas.","Desenforme passando as forminhas rapidamente em água morna."]'::jsonb,
  'Use morangos bem maduros para um sabor mais intenso. Pode substituir por outras frutas.',
  'Freezer por até 2 meses.',
  'Liquidificador, forminhas de picolé, freezer.',
  0.20, 0.10, 70, true, false, true
from public.categories c where c.slug = 'picoles-e-sorvetes'
on conflict (slug) do nothing;

-- 6. Pão Caseiro Fofinho
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Pão Caseiro Fofinho', 'pao-caseiro-fofinho', c.id, 'Fácil', 180, 2, 'pães',
  'Pão caseiro macio, ótimo para vender fatiado ou inteiro.',
  '["Misture os ingredientes secos, depois os líquidos, até formar uma massa lisa.","Sove por 10 minutos e deixe descansar até dobrar de volume.","Modele os pães e deixe crescer novamente por 40 minutos.","Asse em forno pré-aquecido a 180°C por 30-35 minutos."]'::jsonb,
  'A água/leite deve estar morna para ativar bem o fermento biológico.',
  'Em saco plástico fechado por até 3 dias, ou congelado por até 1 mês.',
  'Forno, tigela grande, forma de pão.',
  0.30, 0.20, 60, true, false, false
from public.categories c where c.slug = 'paes'
on conflict (slug) do nothing;

-- 7. Bolo de Chocolate Brigadeiro
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Bolo de Chocolate Brigadeiro', 'bolo-de-chocolate-brigadeiro', c.id, 'Médio', 90, 20, 'porções',
  'Um bolo fofinho de chocolate com recheio e cobertura de brigadeiro. Perfeito para qualquer ocasião!',
  '["Bata os ovos, o açúcar e o óleo até esbranquiçar.","Adicione a farinha, o chocolate em pó e o fermento peneirados, alternando com o leite.","Asse em forno pré-aquecido a 180°C por 35-40 minutos.","Cubra o bolo frio com brigadeiro cremoso."]'::jsonb,
  'Peneire os secos para um bolo mais fofinho. Sirva em temperatura ambiente.',
  'Geladeira por até 5 dias, bem tampado.',
  'Forma de bolo, forno, batedeira, peneira.',
  0.10, 0.25, 70, true, true, false
from public.categories c where c.slug = 'bolos'
on conflict (slug) do nothing;

-- 8. Bolo no Pote
insert into public.recipes (title, slug, category_id, difficulty, prep_time_minutes, yield_quantity, yield_unit, description, instructions, tips, storage, equipment, packaging_cost, other_costs, profit_margin_percent, published, featured, is_new)
select 'Bolo no Pote', 'bolo-no-pote', c.id, 'Fácil', 60, 15, 'potes',
  'Camadas de bolo de chocolate, brigadeiro cremoso e cobertura de granulado, montadas em potinhos individuais.',
  '["Asse uma massa simples de bolo de chocolate e deixe esfriar.","Prepare um brigadeiro cremoso de colher.","Monte camadas de bolo esfarelado e brigadeiro em potinhos individuais.","Finalize com chocolate granulado e tampe."]'::jsonb,
  'Fure e regue o bolo com um pouco de leite para ficar ainda mais úmido.',
  'Geladeira por até 5 dias.',
  'Forma de bolo, forno, potinhos descartáveis com tampa.',
  0.60, 0.30, 73, true, false, false
from public.categories c where c.slug = 'bolos'
on conflict (slug) do nothing;

-- =========================================================================
-- Ingredientes de cada receita (apaga e recria para permitir re-rodar o seed)
-- =========================================================================
delete from public.recipe_ingredients where recipe_id in (select id from public.recipes where slug in (
  'brigadeiro-gourmet-ninho-com-nutella','cheesecake-de-morango','coxinha-de-frango-catupiry',
  'bolo-chocolate-trufado','picole-de-morango-cremoso','pao-caseiro-fofinho',
  'bolo-de-chocolate-brigadeiro','bolo-no-pote'
));

insert into public.recipe_ingredients (recipe_id, ingredient_id, base_quantity, display_label, sort_order)
select r.id, i.id, v.qty, v.label, v.ord from (values
  ('brigadeiro-gourmet-ninho-com-nutella','Leite condensado', 790, '2 latas', 1),
  ('brigadeiro-gourmet-ninho-com-nutella','Leite em pó (tipo Ninho)', 100, '1 xícara', 2),
  ('brigadeiro-gourmet-ninho-com-nutella','Nutella', 200, '1 pote pequeno', 3),
  ('brigadeiro-gourmet-ninho-com-nutella','Manteiga', 30, '2 colheres (sopa)', 4),
  ('brigadeiro-gourmet-ninho-com-nutella','Chocolate granulado', 150, 'para enrolar', 5),

  ('cheesecake-de-morango','Biscoito maisena', 200, '1 pacote', 1),
  ('cheesecake-de-morango','Manteiga', 80, '5 colheres (sopa)', 2),
  ('cheesecake-de-morango','Cream cheese', 600, '2 potes', 3),
  ('cheesecake-de-morango','Açúcar refinado', 150, '3/4 xícara', 4),
  ('cheesecake-de-morango','Creme de leite', 200, '1 caixa', 5),
  ('cheesecake-de-morango','Morango', 300, '1 bandeja', 6),
  ('cheesecake-de-morango','Leite condensado', 100, '1/4 lata', 7),

  ('coxinha-de-frango-catupiry','Frango (peito cozido e desfiado)', 500, '500g', 1),
  ('coxinha-de-frango-catupiry','Catupiry', 200, '1 pote pequeno', 2),
  ('coxinha-de-frango-catupiry','Farinha de trigo', 500, '3 1/2 xícaras', 3),
  ('coxinha-de-frango-catupiry','Leite integral', 500, '2 xícaras', 4),
  ('coxinha-de-frango-catupiry','Manteiga', 50, '3 colheres (sopa)', 5),
  ('coxinha-de-frango-catupiry','Farinha de rosca', 200, 'para empanar', 6),
  ('coxinha-de-frango-catupiry','Óleo de soja', 500, 'para fritar', 7),

  ('bolo-chocolate-trufado','Farinha de trigo', 300, '2 xícaras', 1),
  ('bolo-chocolate-trufado','Açúcar refinado', 300, '1 1/2 xícara', 2),
  ('bolo-chocolate-trufado','Chocolate em pó 50%', 150, '3/4 xícara', 3),
  ('bolo-chocolate-trufado','Ovos', 4, '4 unidades', 4),
  ('bolo-chocolate-trufado','Leite integral', 300, '1 1/4 xícara', 5),
  ('bolo-chocolate-trufado','Óleo de soja', 150, '3/4 xícara', 6),
  ('bolo-chocolate-trufado','Fermento em pó químico', 15, '1 colher (sopa)', 7),
  ('bolo-chocolate-trufado','Creme de leite', 300, '1 1/2 caixa', 8),
  ('bolo-chocolate-trufado','Chocolate meio amargo (barra)', 300, '300g', 9),

  ('picole-de-morango-cremoso','Morango', 600, '2 bandejas', 1),
  ('picole-de-morango-cremoso','Leite condensado', 395, '1 lata', 2),
  ('picole-de-morango-cremoso','Creme de leite', 400, '2 caixas', 3),
  ('picole-de-morango-cremoso','Palito de picolé', 30, '30 unidades', 4),

  ('pao-caseiro-fofinho','Farinha de trigo', 1000, '7 xícaras', 1),
  ('pao-caseiro-fofinho','Fermento biológico seco', 10, '1 sachê', 2),
  ('pao-caseiro-fofinho','Açúcar refinado', 50, '3 colheres (sopa)', 3),
  ('pao-caseiro-fofinho','Sal refinado', 10, '1 colher (chá)', 4),
  ('pao-caseiro-fofinho','Óleo de soja', 60, '4 colheres (sopa)', 5),
  ('pao-caseiro-fofinho','Leite integral', 300, '1 1/4 xícara', 6),
  ('pao-caseiro-fofinho','Ovos', 1, '1 unidade', 7),

  ('bolo-de-chocolate-brigadeiro','Farinha de trigo', 240, '2 xícaras (240g)', 1),
  ('bolo-de-chocolate-brigadeiro','Açúcar refinado', 180, '1 xícara (180g)', 2),
  ('bolo-de-chocolate-brigadeiro','Chocolate em pó 50%', 100, '1 xícara (100g)', 3),
  ('bolo-de-chocolate-brigadeiro','Ovos', 4, '4 unidades', 4),
  ('bolo-de-chocolate-brigadeiro','Leite integral', 240, '1 xícara (240ml)', 5),
  ('bolo-de-chocolate-brigadeiro','Óleo de soja', 120, '1/2 xícara (120ml)', 6),
  ('bolo-de-chocolate-brigadeiro','Fermento em pó químico', 10, '1 colher (sopa)', 7),

  ('bolo-no-pote','Farinha de trigo', 200, '1 1/3 xícara', 1),
  ('bolo-no-pote','Açúcar refinado', 200, '1 xícara', 2),
  ('bolo-no-pote','Chocolate em pó 50%', 80, '1/2 xícara', 3),
  ('bolo-no-pote','Ovos', 3, '3 unidades', 4),
  ('bolo-no-pote','Leite integral', 200, '1 xícara', 5),
  ('bolo-no-pote','Óleo de soja', 100, '1/2 xícara', 6),
  ('bolo-no-pote','Fermento em pó químico', 10, '1 colher (sopa)', 7),
  ('bolo-no-pote','Leite condensado', 395, '1 lata (recheio)', 8),
  ('bolo-no-pote','Creme de leite', 200, '1 caixa (recheio)', 9),
  ('bolo-no-pote','Chocolate granulado', 100, 'cobertura', 10),
  ('bolo-no-pote','Potinho descartável 200ml', 15, '15 unidades', 11)
) as v(recipe_slug, ingredient_name, qty, label, ord)
join public.recipes r on r.slug = v.recipe_slug
join public.ingredients i on i.name = v.ingredient_name;
