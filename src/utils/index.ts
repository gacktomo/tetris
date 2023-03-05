import { Cell, Mino, minoShapeMap, MinoState } from "@/constants";

const minos = Object.values(Mino);

export const getShape = (minoState: MinoState) => {
  const shape = minoShapeMap.get(minoState.rotation)?.get(minoState.mino);
  if (!shape) {
    throw new Error("Invalid MinoState");
  }
  return shape;
};

export const getMinoBag = () => {
  const newMinoBag = [...minos];
  for (let i = newMinoBag.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newMinoBag[i], newMinoBag[j]] = [newMinoBag[j], newMinoBag[i]];
  }
  return newMinoBag;
};

export const getMinoBounds = (minoState: MinoState) => {
  let top = -1;
  let bottom = 0;
  const shape = getShape(minoState);
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

export const getContactCount = (minoState: MinoState, field: Cell[][]) => {
  const shape = getShape(minoState);
  let count = 0;
  for (const [y, row] of shape.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === Cell.None) continue;
      const cellY = y + minoState.y;
      const cellX = x + minoState.x;
      for (const [dy, dx] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const targetCell = (() => {
          if (!field[cellY + dy]) return Cell.Wall;
          if (field[cellY + dy]?.[cellX + dx]) {
            return field[cellY + dy][cellX + dx];
          } else if (minoState.mino === Mino.I) {
            return Cell.Wall;
          } else {
            return Cell.None;
          }
        })();
        const targetShapeCell = shape[y + dy]?.[x + dx] ?? Cell.None;
        if (targetCell !== Cell.None && targetShapeCell === Cell.None) {
          count++;
        }
      }
    }
  }
  return count;
};
