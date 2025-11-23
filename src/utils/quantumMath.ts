export type Complex = { re: number; im: number };

// --- KOMPLEXSZÁMOK SEGÉDFÜGGVÉNYEK (MATH HELPERS) ---
// https://stackoverflow.com/questions/15399340/how-to-calculate-with-complex-numbers-in-javascript
export const _complex = (re = 0, im = 0): Complex => ({ re, im });
export const _complexAdd = (a: Complex, b: Complex): Complex => _complex(a.re + b.re, a.im + b.im);
export const _complexMultiply = (a: Complex, b: Complex): Complex => _complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const _complexScale = (a: Complex, k: number): Complex => _complex(a.re * k, a.im * k);
export const _complexAbs = (a: Complex): number => Math.hypot(a.re, a.im);
export const _complexPhase = (a: Complex): number => Math.atan2(a.im, a.re);
export const _complexFromPolar = (r: number, angle: number): Complex => _complex(r * Math.cos(angle), r * Math.sin(angle));

// Normalizálás: Fontos, hogy a valószínűségek összege 1 legyen (|alpha|^2 + |beta|^2 = 1)
export const _normalizeState = ([alpha, beta]: [Complex, Complex]): [Complex, Complex] => {
  const norm = Math.hypot(_complexAbs(alpha), _complexAbs(beta));
  // Ha a 0 vektor jönne ki akkor visszaállunk alapállapotba.
  if (norm === 0) return [_complex(1, 0), _complex(0, 0)];
  return [_complexScale(alpha, 1 / norm), _complexScale(beta, 1 / norm)];
};

// Bloch-gömb szögekből (theta, phi) -> Állapotvektor (|phi>)
// Képlet: |phi> = cos(theta/2)|0> + e^(iφ) sin(theta/2)|1>
export const _anglesToState = (theta: number, phi: number): [Complex, Complex] => {
  const alpha = _complex(Math.cos(theta / 2), 0);
  const beta = _complexFromPolar(Math.sin(theta / 2), phi);
  return _normalizeState([alpha, beta]);
};

// Állapotvektor -> Bloch-gömb szögek
// Forrás: Nielsen & Chuang: Quantum Computation and Quantum Information (Eq. 1.13)
// Wikipedia: https://en.wikipedia.org/wiki/Bloch_sphere#Definition
// Képlet: |phi> = cos(theta/2)|0⟩ + e^(i*phi)sin(theta/2)|1⟩
export const _stateToAngles = ([alpha, beta]: [Complex, Complex]): { theta: number; phi: number } => {
  const [na, nb] = _normalizeState([alpha, beta]);

  // Theta kiszámítása az amplitúdóból: |alpha| = cos(theta/2) => theta = 2 * arccos(|alpha|)
  const theta = 2 * Math.acos(Math.min(1, Math.max(-1, _complexAbs(na))));
  const phaseDiff = _complexPhase(nb) - _complexPhase(na);
  const phi = ((phaseDiff % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  return { theta, phi };
};

// Unitér transzformáció
// |phi'⟩ = U * |phi⟩
export const _applyGate = (matrix: Complex[][], state: [Complex, Complex]): [Complex, Complex] => _normalizeState([
  _complexAdd(_complexMultiply(matrix[0][0], state[0]), _complexMultiply(matrix[0][1], state[1])),
  _complexAdd(_complexMultiply(matrix[1][0], state[0]), _complexMultiply(matrix[1][1], state[1]))
]);

// --- KAPUK ---
// A standard Pauli mátrixok és a Hadamard kapu
export const _KAPU_MATRIXOK: Record<string, Complex[][]> = {
  X: [
    [_complex(0, 0), _complex(1, 0)],
    [_complex(1, 0), _complex(0, 0)],
  ],
  Y: [
    [_complex(0, 0), _complex(0, -1)],
    [_complex(0, 1), _complex(0, 0)],
  ],
  Z: [ 
    [_complex(1, 0), _complex(0, 0)],
    [_complex(0, 0), _complex(-1, 0)],
  ],
  H: [
    [_complex(1 / Math.sqrt(2), 0), _complex(1 / Math.sqrt(2), 0)],
    [_complex(1 / Math.sqrt(2), 0), _complex(-1 / Math.sqrt(2), 0)],
  ],
};

// Forgató kapuk
export const _FORGATO_KAPUK: Record<string, (angle: number) => Complex[][]> = {
  Rx: (angle: number) => [
    [_complex(Math.cos(angle / 2), 0), _complex(0, -Math.sin(angle / 2))],
    [_complex(0, -Math.sin(angle / 2)), _complex(Math.cos(angle / 2), 0)],
  ],
  Ry: (angle: number) => [
    [_complex(Math.cos(angle / 2), 0), _complex(-Math.sin(angle / 2), 0)],
    [_complex(Math.sin(angle / 2), 0), _complex(Math.cos(angle / 2), 0)],
  ],
  Rz: (angle: number) => [
    [_complexFromPolar(1, -angle / 2), _complex(0, 0)],
    [_complex(0, 0), _complexFromPolar(1, angle / 2)],
  ],
};

// Szépség miatt, X --> Pauli-X stb.
export const _KAPU_NEVEK: Record<string, string> = {
  X: "Pauli-X",
  Y: "Pauli-Y",
  Z: "Pauli-Z",
  H: "Hadamard",
  Rx: "Forgatás X",
  Ry: "Forgatás Y",
  Rz: "Forgatás Z",
};

export const _KEZDO_ALLAPOT = { theta: 0, phi: 0 };
export const _DEFAULT_ROTATION = Math.PI / 2;

export const _varakozas = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
