/**
 * Converts a value to Buffer
 * @param v Value to convert
 * @returns Buffer
 */
export function toBuffer(v: string | object): Buffer {
  switch (typeof v) {
    case 'object': return Buffer.from(JSON.stringify(v));
    case 'string': return Buffer.from(v);
    default: return Buffer.from('');
  }
}

export function toJSON(v?: Buffer | string): object | undefined {
  switch (typeof v) {
    case 'string': return JSON.parse(v);
    case 'object': {
      if (v instanceof Buffer) return JSON.parse(v.toString());
    }
  }
}
