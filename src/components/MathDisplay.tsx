import React from 'react';

// --- FANCY KOMPONENSEK ---
// Ha egy szám nevezetes törthöz közelít, akkor törtként jelenítjük meg

export const MatekTort = ({ n, d }: { n: string; d: string }) => (
  <span style={{ 
    display: 'inline-flex', 
    flexDirection: 'column', 
    verticalAlign: 'middle', 
    textAlign: 'center', 
    fontSize: '0.75em', 
    margin: '0 2px' 
  }}>
    <span style={{ borderBottom: '1px solid rgba(255,255,255,0.5)', padding: '0 2px', lineHeight: 1.2 }}>{n}</span>
    <span style={{ lineHeight: 1.2 }}>{d}</span>
  </span>
);

type FormatResult = 
  | { type: 'text'; val: string }
  | { type: 'frac'; n: string; d: string };

const _formatAbs = (val: number): FormatResult => {
  const EPSILON = 0.001;
  const abs = Math.abs(val);
  
  if (abs < EPSILON) return { type: 'text', val: "0" };
  if (Math.abs(abs - 1) < EPSILON) return { type: 'text', val: "1" };
  
  if (Math.abs(abs - 0.5) < EPSILON) return { type: 'frac', n: "1", d: "2" };
  if (Math.abs(abs - Math.SQRT1_2) < EPSILON) return { type: 'frac', n: "√2", d: "2" };
  if (Math.abs(abs - Math.sqrt(3)/2) < EPSILON) return { type: 'frac', n: "√3", d: "2" };
  
  return { type: 'text', val: abs.toFixed(3) };
};

// Ha sima szám akkor textként, ha tört akkor latexhez hasonló tört formában jelenítjük meg
export const ErtekMegjelenito = ({ value }: { value: number }) => {
  const data = _formatAbs(value);
  if (data.type === 'text') return <span>{data.val}</span>;
  return <MatekTort n={data.n} d={data.d} />;
};

export const KomplexSzam = ({ re, im }: { re: number; im: number }) => {
  const EPSILON = 0.001;
  const isReZero = Math.abs(re) < EPSILON;
  const isImZero = Math.abs(im) < EPSILON;

  if (isReZero && isImZero) return <span>0</span>;

  const reSign = re < -EPSILON ? "-" : "";
  
  // Az alábbi 2 if azt vizsgálja, ha van 0 tag akkor csak az egyiket jeleníti meg
  if (isImZero) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
        {reSign && <span style={{ marginRight: 2 }}>{reSign}</span>}
        <ErtekMegjelenito value={re} />
      </span>
    );
  }

  const absIm = Math.abs(im);
  const isUnitIm = Math.abs(absIm - 1) < EPSILON;

  // Csak képzetes rész
  if (isReZero) {
    const imSign = im < -EPSILON ? "-" : "";
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
        {imSign && <span style={{ marginRight: 2 }}>{imSign}</span>}
        {!isUnitIm && <ErtekMegjelenito value={im} />}
        <span>i</span>
      </span>
    );
  }

  // Mindkettő van
  const imSign = im < -EPSILON ? "-" : "+";
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
      {reSign && <span style={{ marginRight: 2 }}>{reSign}</span>}
      <ErtekMegjelenito value={re} />
      <span style={{ margin: '0 6px' }}>{imSign}</span>
      {!isUnitIm && <ErtekMegjelenito value={im} />}
      <span>i</span>
    </span>
  );
};
