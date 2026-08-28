import { AdminCrudTable } from '../../components/admin/AdminCrudTable';
import type { Notification } from '../../lib/types';

export default function AdminNotifications() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-600">Deixe "Usuário" em branco para enviar uma notificação global, visível para todos os assinantes.</p>
      <AdminCrudTable<Notification>
        table="notifications"
        entity="notifications"
        permission="notifications.manage"
        searchKeys={['title']}
        columns={[
          { key: 'title', label: 'Título' },
          { key: 'type', label: 'Tipo' },
          { key: 'user_id', label: 'Destino', render: (r) => (r.user_id ? 'Usuário específico' : 'Todos os usuários') },
          { key: 'read', label: 'Lida', render: (r) => (r.read ? 'Sim' : 'Não') },
        ]}
        fields={[
          { key: 'title', label: 'Título', type: 'text', required: true },
          { key: 'message', label: 'Mensagem', type: 'textarea', required: true },
          { key: 'type', label: 'Tipo', type: 'select', options: [
            { label: 'Informação', value: 'info' },
            { label: 'Novidade', value: 'news' },
            { label: 'Assinatura', value: 'subscription' },
            { label: 'Alerta', value: 'warning' },
          ] },
          { key: 'user_id', label: 'ID do usuário (opcional)', type: 'text', hint: 'Deixe vazio para enviar a todos' },
        ]}
        emptyValues={{ title: '', message: '', type: 'info', user_id: null }}
      />
    </div>
  );
}
