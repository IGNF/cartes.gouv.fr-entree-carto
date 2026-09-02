/**
 * Calcule le CRC-32 d'un tableau d'octets.
 * @param {Uint8Array} data
 * @returns {number}
 */
function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Construit un chunk PNG (longueur + type + données + CRC).
 * @param {string} type - Identifiant 4 caractères du chunk (ex: 'pHYs')
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
function buildPngChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  const length = data.length;

  const crcInput = new Uint8Array(4 + length);
  crcInput.set(typeBytes);
  crcInput.set(data, 4);
  const crc = crc32(crcInput);

  const chunk = new Uint8Array(4 + 4 + length + 4);
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, length, false);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  dv.setUint32(8 + length, crc, false);
  return chunk;
}

/**
 * Injecte les métadonnées DPI (chunk pHYs) dans un PNG encodé en data URL.
 * @param {string} dataUrl - Data URL image/png
 * @param {number} dpi - Résolution cible en DPI
 * @returns {Promise<string>} URL blob du PNG modifié
 */
export async function injectDpiInPng(dataUrl, dpi) {
  const ppm = Math.round(dpi / 0.0254); // pixels per meter

  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Chunk pHYs : 4 bytes X, 4 bytes Y, 1 byte unit (1 = metre)
  const phys = new Uint8Array(9);
  const view = new DataView(phys.buffer);
  view.setUint32(0, ppm, false);
  view.setUint32(4, ppm, false);
  view.setUint8(8, 1); // unit = metre

  const chunk = buildPngChunk('pHYs', phys);

  // Insérer après le chunk IHDR (offset 33)
  const result = new Uint8Array(bytes.length + chunk.length);
  result.set(bytes.slice(0, 33));
  result.set(chunk, 33);
  result.set(bytes.slice(33), 33 + chunk.length);

  const blob = new Blob([result], { type: 'image/png' });
  return URL.createObjectURL(blob);
}
