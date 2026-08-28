// Países de origen de una receta, para mostrar la banderita junto al
// nombre. La bandera se arma a partir del código ISO de 2 letras (cada
// letra se traduce a su "regional indicator symbol" — así funciona el
// emoji de banderas en Unicode, sin necesidad de imágenes ni librerías).

export const PAISES = [
  { code: 'BR', nombre: 'Brasil' },
  { code: 'ES', nombre: 'España' },
  { code: 'AR', nombre: 'Argentina' },
  { code: 'MX', nombre: 'México' },
  { code: 'CO', nombre: 'Colombia' },
  { code: 'CL', nombre: 'Chile' },
  { code: 'PE', nombre: 'Perú' },
  { code: 'UY', nombre: 'Uruguay' },
  { code: 'PY', nombre: 'Paraguay' },
  { code: 'BO', nombre: 'Bolivia' },
  { code: 'EC', nombre: 'Ecuador' },
  { code: 'VE', nombre: 'Venezuela' },
  { code: 'US', nombre: 'Estados Unidos' },
  { code: 'IT', nombre: 'Italia' },
  { code: 'FR', nombre: 'Francia' },
  { code: 'JP', nombre: 'Japón' },
  { code: 'CN', nombre: 'China' },
  { code: 'IN', nombre: 'India' },
  { code: 'PT', nombre: 'Portugal' },
  { code: 'DE', nombre: 'Alemania' },
];

export function banderaDesdePais(code) {
  if (!code || code.length !== 2) return '';
  const base = 0x1f1e6; // regional indicator symbol letter A
  const letras = code
    .toUpperCase()
    .split('')
    .map((c) => c.codePointAt(0) - 65 + base);
  if (letras.some((n) => n < base || n > base + 25)) return '';
  return String.fromCodePoint(...letras);
}

export function nombrePais(code) {
  return PAISES.find((p) => p.code === code)?.nombre || '';
}
