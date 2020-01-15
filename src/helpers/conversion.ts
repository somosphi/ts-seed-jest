/**
 * Converts a value to Buffer
 * @param v Value to convert
 * @returns Buffer
 */
export function toBuffer(v: string | JSON): Buffer {
  switch (typeof v) {
    case 'object': return Buffer.from(JSON.stringify(v));
    case 'string': return Buffer.from(v);
    default: return Buffer.from('');
  }
}
