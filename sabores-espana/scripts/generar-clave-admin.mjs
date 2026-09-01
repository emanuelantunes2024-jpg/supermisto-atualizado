#!/usr/bin/env node
// Genera el hash de la contraseña inicial del panel admin (ADMIN_PASSWORD_HASH).
// Uso: node scripts/generar-clave-admin.mjs [contraseña]
// Sin argumento, genera una contraseña aleatoria segura.

import { scryptSync, randomBytes } from 'node:crypto';

const senha = process.argv[2] || randomBytes(9).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(senha, salt, 64).toString('hex');

console.log('\nContraseña (guardala en un lugar seguro, no se vuelve a mostrar):');
console.log('  ' + senha);
console.log('\nADMIN_PASSWORD_HASH (pegalo en Vercel → Settings → Environment Variables):');
console.log('  ' + `${salt}:${hash}`);
console.log('');
