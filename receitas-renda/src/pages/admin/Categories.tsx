import { AdminCrudTable } from '../../components/admin/AdminCrudTable';
import type { Category } from '../../lib/types';

const iconOptions = ['book', 'wheat', 'grid', 'heart', 'sparkle', 'storefront', 'star'].map((v) => ({ label: v, value: v }));

export default function AdminCategories() {
  return (
    <AdminCrudTable<Category>
      table="categories"
      entity="categories"
      permission="recipes.manage"
      orderBy="sort_order"
      ascending
      searchKeys={['name']}
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'slug', label: 'Slug' },
        { key: 'icon', label: 'Ícone' },
        { key: 'sort_order', label: 'Ordem' },
      ]}
      fields={[
        { key: 'name', label: 'Nome', type: 'text', required: true },
        { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
        { key: 'icon', label: 'Ícone', type: 'select', options: iconOptions },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'sort_order', label: 'Ordem de exibição', type: 'number' },
      ]}
      emptyValues={{ name: '', slug: '', icon: 'book', description: '', sort_order: 0 }}
    />
  );
}
