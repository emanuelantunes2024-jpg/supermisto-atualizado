import { AdminCrudTable } from '../../components/admin/AdminCrudTable';
import type { Banner } from '../../lib/types';

export default function AdminBanners() {
  return (
    <AdminCrudTable<Banner>
      table="banners"
      entity="banners"
      permission="banners.manage"
      orderBy="sort_order"
      ascending
      searchKeys={['title']}
      columns={[
        { key: 'title', label: 'Título' },
        { key: 'position', label: 'Posição' },
        { key: 'is_active', label: 'Ativo', render: (r) => (r.is_active ? 'Sim' : 'Não') },
        { key: 'sort_order', label: 'Ordem' },
      ]}
      fields={[
        { key: 'title', label: 'Título', type: 'text', required: true },
        { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
        { key: 'image_url', label: 'Imagem (URL)', type: 'image' },
        { key: 'link_url', label: 'Link ao clicar', type: 'text' },
        { key: 'position', label: 'Posição', type: 'select', options: [
          { label: 'Início — banner escuro', value: 'home_hero' },
          { label: 'Início — banner de novidades', value: 'home_news' },
          { label: 'Topo do app', value: 'app_top' },
        ] },
        { key: 'sort_order', label: 'Ordem de exibição', type: 'number' },
        { key: 'is_active', label: 'Status', type: 'boolean' },
      ]}
      emptyValues={{ title: '', subtitle: '', image_url: '', link_url: '', position: 'home_hero', sort_order: 0, is_active: true }}
    />
  );
}
