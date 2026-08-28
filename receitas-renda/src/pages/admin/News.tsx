import { AdminCrudTable } from '../../components/admin/AdminCrudTable';
import type { News } from '../../lib/types';

export default function AdminNews() {
  return (
    <AdminCrudTable<News>
      table="news"
      entity="news"
      permission="news.manage"
      searchKeys={['title']}
      columns={[
        { key: 'title', label: 'Título' },
        { key: 'status', label: 'Status', render: (r) => (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {r.status === 'published' ? 'Publicado' : 'Rascunho'}
          </span>
        ) },
        { key: 'published_at', label: 'Publicado em', render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString('pt-BR') : '—' },
      ]}
      fields={[
        { key: 'title', label: 'Título', type: 'text', required: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'image_url', label: 'Imagem (URL)', type: 'image' },
        { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Rascunho', value: 'draft' }, { label: 'Publicado', value: 'published' }] },
        { key: 'published_at', label: 'Data de publicação', type: 'text', hint: 'Formato: 2024-05-10' },
      ]}
      emptyValues={{ title: '', slug: '', description: '', image_url: '', status: 'draft', published_at: new Date().toISOString().slice(0, 10) }}
    />
  );
}
