import {
  Cell,
  Height,
  Input,
  Mino,
  minoShapeMap,
  MinoState,
  MoveStatus,
  Rotation,
  rotationInputMap,
  Width,
} from "@/constants";

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
          } else {
            return Cell.Wall;
          }
        })();
        const targetShapeCell = shape[y + dy]?.[x + dx] ?? Cell.None;
        if (targetCell !== Cell.None && targetShapeCell === Cell.None) {
          count++;
        }
        if (
          dy === 1 &&
          targetCell === Cell.None &&
          targetShapeCell === Cell.None
        ) {
          count -= 10;
        }
      }
    }
  }
  return count;
};

export const getMoveStatus = (minoState: MinoState, field: Cell[][]) => {
  const newField = field.map((row) => row.map((cell) => cell));
  const shape = getShape(minoState);
  for (const [y, row] of shape.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === Cell.None) continue;
      const newY = minoState.y + y;
      const newX = minoState.x + x;
      if (newY >= Height || newField[newY][newX] !== Cell.None) {
        return { status: MoveStatus.Blocked };
      }
      newField[newY][newX] = cell;
    }
  }
  return { status: MoveStatus.Movable, movedField: newField };
};

export const decisionInput = (
  currentMino: MinoState,
  field: Cell[][],
  hardDrop: boolean = true
) => {
  let bestMinoState = { ...currentMino, y: 0 };
  const rotations = Object.values(Rotation);
  for (let x = 0; x < Width; x++) {
    let isBlocked = false;
    const blockedRotations = new Set<Rotation>();
    for (let y = 0; y < Height; y++) {
      if (isBlocked) break;
      for (const rotation of rotations) {
        if (blockedRotations.has(rotation)) continue;
        const newMinoState = { ...currentMino, x, y, rotation };
        const { status } = getMoveStatus(newMinoState, field);
        if (status === MoveStatus.Movable) {
          const { bottom } = getMinoBounds(bestMinoState);
          const { bottom: newBottom } = getMinoBounds(newMinoState);
          const newCount = getContactCount(newMinoState, field);
          const bestCount = getContactCount(bestMinoState, field);
          if (bestCount < newCount) {
            bestMinoState = newMinoState;
          } else if (bestCount === newCount && bottom < newBottom) {
            bestMinoState = newMinoState;
          }
        } else {
          blockedRotations.add(rotation);
        }
      }
      if (blockedRotations.keys.length === rotations.length) {
        isBlocked = true;
      }
    }
  }

  if (!bestMinoState) return [];
  console.log({
    ...bestMinoState,
    mino: Object.entries(Mino).find(([_, v]) => v === bestMinoState.mino)?.[0],
    contacts: getContactCount(bestMinoState, field),
  });

  const lowestColIndex = bestMinoState.x;
  const indexDiff = lowestColIndex - currentMino.x;
  return [
    ...(rotationInputMap.get(bestMinoState.rotation) ?? []),
    ...new Array(Math.abs(indexDiff))
      .fill(null)
      .map(() => (indexDiff > 0 ? Input.Right : Input.Left)),
    ...(hardDrop ? [Input.Drop] : []),
  ];
};
