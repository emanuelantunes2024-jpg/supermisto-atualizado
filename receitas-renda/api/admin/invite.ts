// Convida um novo administrador para o /admin. Só quem já tem a permissão
// "admins.manage" pode chamar este endpoint — validado no servidor, nunca
// confiando apenas no que a interface esconde.
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const authHeader = req.headers.authorization as string | undefined;
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Token de acesso ausente.' });
    return;
  }

  const supabase = getSupabaseAdmin();

  const { data: caller, error: authError } = await supabase.auth.getUser(token);
  if (authError || !caller.user) {
    res.status(401).json({ error: 'Sessão inválida.' });
    return;
  }

  const { data: hasPermission } = await supabase.rpc('has_permission', { uid: caller.user.id, perm: 'admins.manage' });
  if (!hasPermission) {
    res.status(403).json({ error: 'Você não tem permissão para convidar administradores.' });
    return;
  }

  const { name, email, role_id } = req.body || {};
  if (!name || !email || !role_id) {
    res.status(400).json({ error: 'Informe nome, e-mail e papel.' });
    return;
  }

  const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name },
  });
  if (inviteError || !invited.user) {
    res.status(400).json({ error: inviteError?.message ?? 'Falha ao criar o convite.' });
    return;
  }

  const { error: insertError } = await supabase.from('admins').insert({
    id: invited.user.id,
    name,
    email,
    role_id,
    status: 'active',
  });
  if (insertError) {
    res.status(400).json({ error: insertError.message });
    return;
  }

  res.status(200).json({ ok: true, id: invited.user.id });
}
