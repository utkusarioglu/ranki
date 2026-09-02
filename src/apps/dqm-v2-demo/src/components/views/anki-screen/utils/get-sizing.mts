export function getSizing(
  padding: number,
  aspect: number,
  scale: number,
  reservedWidth: number,
  reservedHeight: number,
) {
  const PAD = padding;
  const S = scale;
  const A = aspect;
  const RW = reservedWidth;
  const RH = reservedHeight;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cw = W - RW - PAD * 2;
  const ch = H - RH - PAD * 2;

  let dw: number;
  let dh: number;

  if (cw / ch > A) {
    dh = ch;
    dw = ch * A;
  } else {
    dw = cw;
    dh = cw / A;
  }

  dw = dw * S;
  dh = dh * S;

  const dl = (cw - dw) / 2 + PAD;
  const dt = (ch - dh) / 2 + PAD;

  return { height: dh, left: dl, top: dt, width: dw };
}
