// Legacy e= is public frontend configuration obfuscation, not authentication.
// Its published interoperability key is intentionally public; no account key is used.
export const LEGACY_PUBLIC_CONFIG_KEY = new Uint8Array([104,116,116,105,115,104,101,114,101,57,54,48,55,50,56,49]);
const allowed = new Set(['name','day','date_range','start','end','font_color','bg_color','background','monday','sw','black','dd','vv','nocover','ru_name']);
export function rawParameter(search, name) {
  for (const pair of search.replace(/^\?/, '').split('&')) {
    const split = pair.indexOf('='), key = split < 0 ? pair : pair.slice(0, split);
    if (decodeURIComponent(key) === name) return decodeURIComponent(split < 0 ? '' : pair.slice(split + 1));
  }
  return null;
}
export async function decryptLegacyJSON(encoded, subtle = globalThis.crypto?.subtle) {
  if (!subtle) throw Error('secure_crypto_required');
  const ciphertext = Uint8Array.from(atob(encoded), ch => ch.charCodeAt(0));
  if (!ciphertext.length || ciphertext.length % 16) throw Error('invalid_legacy_config');
  const key = await subtle.importKey('raw', LEGACY_PUBLIC_CONFIG_KEY, {name:'AES-CBC'}, false, ['encrypt','decrypt']);
  const plain = new Uint8Array(ciphertext.length);
  // WebCrypto has no ECB primitive. CBC with zero IV decodes one ECB block;
  // an independently generated valid padding block permits the standard CBC
  // unpadding step without discarding or interpreting that data block.
  for (let offset = 0; offset < ciphertext.length; offset += 16) {
    const block = ciphertext.slice(offset, offset + 16);
    const suffix = new Uint8Array(await subtle.encrypt({name:'AES-CBC', iv:block}, key, new Uint8Array(0)));
    const input = new Uint8Array(32); input.set(block); input.set(suffix,16);
    plain.set(new Uint8Array(await subtle.decrypt({name:'AES-CBC', iv:new Uint8Array(16)}, key, input)), offset);
  }
  const padding = plain.at(-1);
  if (padding < 1 || padding > 16 || plain.slice(-padding).some(byte => byte !== padding)) throw Error('invalid_legacy_padding');
  const parsed = JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(plain.slice(0, -padding)));
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw Error('invalid_config_object');
  return parsed;
}
export async function readConfig(search) {
  const params = new URLSearchParams(search), result = Object.create(null);
  const encrypted = rawParameter(search, 'e');
  const decoded = encrypted ? await decryptLegacyJSON(encrypted) : Object.create(null);
  for (const key of allowed) {
    if (Object.hasOwn(decoded, key)) result[key] = decoded[key];
    if (params.has(key)) result[key] = params.get(key);
  }
  return result;
}
export function safeImageURL(value) {
  try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export const sourceSundayFirst = config => Boolean(config.sw) || (Object.hasOwn(config, 'monday') && !config.monday);
