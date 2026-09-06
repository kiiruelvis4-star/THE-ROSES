/**
 * Secure cryptographic hashing and verification for Little Roses Academy
 * Zero plaintext credentials stored in source code or production bundles.
 */

export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const a = hash[0],
        e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// SHA-256 Hashes of Authorized Administrative and Faculty Credentials
export const ADMIN_AUTH_HASHES = new Set([
  '06859f462ec1d083c6633abe48ac12e68750754cfae3e4a790d47c30d1ce4b66',
  'abcfe5656e14c7f65bbd1a1a5bbedd7b1ca69891ac512438f01359308a3d6f9e',
  'c80d48cdf383412347fdc7caec3d8327ec4d8fc0eb9fbba0f7e87a8bcb4a3da5'
]);

export const TEACHER_AUTH_HASHES: Record<string, string> = {
  elvis: '1956cba7e4742c4f8327d8abf8bfca62e179ea7bbb44a8eff5f89dc42dfa2083',
  fresiah: '02c2c7f85654540f136a90a8ddcce1fd24ecbc9393b507f61462f003fea4b6f6',
  kelvin: 'b597dd05895204d0213157a2ce7618884a2b95071cc6836f0e467411587a1094',
  liz: '5095c465e37184dc1e48e175b2b263f30b1d8878670d1b42a4a0405e1af038ed',
  'tr-elvis': '1956cba7e4742c4f8327d8abf8bfca62e179ea7bbb44a8eff5f89dc42dfa2083',
  'tr-fresiah': '02c2c7f85654540f136a90a8ddcce1fd24ecbc9393b507f61462f003fea4b6f6',
  'tr-kelvin': 'b597dd05895204d0213157a2ce7618884a2b95071cc6836f0e467411587a1094',
  'tr-liz': '5095c465e37184dc1e48e175b2b263f30b1d8878670d1b42a4a0405e1af038ed'
};

export const TEACHER_FALLBACK_HASHES = new Set([
  '01daa2f05d1381d751d942c56b085aa15e758935f53922a4d6a357635f6720af',
  'c3cbf4e3dbe9226091ff536befb668033efc1a4d52ea2b57be08fc223a47aa72',
  'ab56bba2af8c3b29745b5e76ca77d61991a3ed51023d2ff5d3bcc0a8c6fb0de4',
  '1956cba7e4742c4f8327d8abf8bfca62e179ea7bbb44a8eff5f89dc42dfa2083'
]);

export function verifyAdminHash(enteredPassword?: string): boolean {
  if (!enteredPassword || !enteredPassword.trim()) return false;
  const clean = enteredPassword.trim();
  const directHash = sha256(clean);
  if (ADMIN_AUTH_HASHES.has(directHash)) return true;

  const normalized = clean.replace(/[\s.]/g, '').toLowerCase();
  const normalizedHash = sha256(normalized);
  return ADMIN_AUTH_HASHES.has(normalizedHash);
}

export function verifyTeacherHash(enteredPassword?: string, teacherId?: string): boolean {
  if (!enteredPassword || !enteredPassword.trim()) return false;
  const clean = enteredPassword.trim();
  const directHash = sha256(clean);

  // 1. Check against specific teacher ID
  if (teacherId) {
    const norm = teacherId.toLowerCase().replace('tr-', '');
    const expectedHash = TEACHER_AUTH_HASHES[norm] || TEACHER_AUTH_HASHES[`tr-${norm}`];
    if (expectedHash && directHash === expectedHash) {
      return true;
    }
  }

  // 2. Check against any valid teacher hash
  for (const h of Object.values(TEACHER_AUTH_HASHES)) {
    if (directHash === h) return true;
  }

  // 3. Fallback hashes for normalized entries
  const normalized = clean.replace(/[\s,]/g, '').toLowerCase();
  const normalizedHash = sha256(normalized);
  return TEACHER_FALLBACK_HASHES.has(normalizedHash);
}
