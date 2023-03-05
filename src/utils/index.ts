import { Cell, Mino, minoShapeMap, MinoState } from "@/constants";

const minos = Object.values(Mino);

export const getMinoBag = () => {
  const newMinoBag = [...minos];
  for (let i = newMinoBag.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newMinoBag[i], newMinoBag[j]] = [newMinoBag[j], newMinoBag[i]];
  }
  return newMinoBag;
};

export const getMinoBounds = (minoState: MinoState) => {
  const shape = minoShapeMap.get(minoState.rotation)?.get(minoState.mino);
  if (!shape) {
    throw new Error("Invalid MinoState");
  }
  let top = -1;
  let bottom = 0;
  for (const [y, row] of shape.entries()) {
    for (const [x, cell] of row.entries()) {
      if (shape[y][x] !== Cell.None) {
        if (top < 0) top = y;
        bottom = y;
      }
    }
  }
  const { y } = minoState;
  return { top: top + y, bottom: bottom + y };
};
