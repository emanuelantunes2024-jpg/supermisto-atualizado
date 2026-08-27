import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

const titles: Record<string, string> = {
  '/admin': 'Painel Administrativo',
  '/admin/receitas': 'Receitas',
  '/admin/ingredientes': 'Ingredientes',
  '/admin/categorias': 'Categorias',
  '/admin/usuarios': 'Usuários',
  '/admin/planos': 'Planos',
  '/admin/assinaturas': 'Assinaturas',
  '/admin/central-de-renda': 'Central de Renda',
  '/admin/calculadoras': 'Calculadoras',
  '/admin/simulador': 'Simulador de Objetivos',
  '/admin/lista-de-compras': 'Lista de Compras',
  '/admin/favoritos': 'Favoritos',
  '/admin/novidades': 'Novidades',
  '/admin/banners': 'Banners / Destaques',
  '/admin/assistente-ia': 'Assistente IA',
  '/admin/comentarios': 'Comentários',
  '/admin/notificacoes': 'Notificações',
  '/admin/relatorios': 'Relatórios',
  '/admin/suporte': 'Suporte',
  '/admin/administradores': 'Administradores',
  '/admin/permissoes': 'Permissões',
  '/admin/logs': 'Logs do Sistema',
  '/admin/configuracoes': 'Configurações',
};

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'Painel Administrativo';

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar title={title} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
