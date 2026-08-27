import { AdminCrudTable } from '../../components/admin/AdminCrudTable';
import { formatBRL } from '../../lib/calc';
import type { Ingredient } from '../../lib/types';

export default function AdminIngredients() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-600">
        Altere o preço da embalagem de um ingrediente e o custo de todas as receitas que o usam é recalculado automaticamente, no app e no painel.
      </p>
      <AdminCrudTable<Ingredient>
        table="ingredients"
        entity="ingredients"
        permission="ingredients.manage"
        orderBy="name"
        ascending
        searchKeys={['name', 'supplier']}
        columns={[
          { key: 'name', label: 'Ingrediente' },
          { key: 'unit', label: 'Unidade' },
          { key: 'package_price', label: 'Preço da embalagem', render: (r) => formatBRL(r.package_price) },
          { key: 'package_quantity', label: 'Qtd. na embalagem', render: (r) => `${r.package_quantity} ${r.unit}` },
          { key: 'price_per_unit', label: 'Custo por unidade', render: (r) => formatBRL(r.price_per_unit) },
          { key: 'supplier', label: 'Fornecedor' },
        ]}
        fields={[
          { key: 'name', label: 'Nome', type: 'text', required: true },
          { key: 'unit', label: 'Unidade (g, ml, unidade…)', type: 'text', required: true },
          { key: 'package_price', label: 'Preço da embalagem (R$)', type: 'number' },
          { key: 'package_quantity', label: 'Quantidade na embalagem', type: 'number', hint: 'Ex: 1000 (para 1kg de farinha em gramas)' },
          { key: 'supplier', label: 'Fornecedor', type: 'text' },
        ]}
        emptyValues={{ name: '', unit: 'g', package_price: 0, package_quantity: 1, supplier: '' }}
      />
    </div>
  );
}
