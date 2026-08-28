// Gera uma nova senha de administrador (ou usa a que você passar) e o hash
// correspondente para colar em ADMIN_PASSWORD_HASH (Vercel → Settings →
// Environment Variables). A senha em texto puro NUNCA é salva em lugar
// nenhum — só aparece uma vez, aqui no terminal.
//
// Uso:
//   node scripts/gerar-senha-admin.mjs                 → gera senha aleatória
//   node scripts/gerar-senha-admin.mjs "minhaSenha123"  → usa a senha informada

import { scryptSync, randomBytes } from 'node:crypto';

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function senhaAleatoria(tamanho = 16) {
  return Array.from(randomBytes(tamanho), (b) => ALFABETO[b % ALFABETO.length]).join('');
}

const senha = process.argv[2] || senhaAleatoria();
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(senha, salt, 64).toString('hex');

console.log('\nSenha:              ', senha);
console.log('ADMIN_PASSWORD_HASH:', `${salt}:${hash}`);
console.log('\nCole o valor de ADMIN_PASSWORD_HASH na Vercel e guarde a senha em um lugar seguro.\n');
