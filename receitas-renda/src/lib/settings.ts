import { supabase } from './supabase';

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
  return (data?.value as T) ?? fallback;
}

export async function setSetting(key: string, value: unknown) {
  await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
}
