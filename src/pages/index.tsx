import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Cell,
  Height,
  Width,
  Input,
  Mino,
  cellColorMap,
  minoShapeMap,
  MinoState,
  ReleasePosition,
  Rotation,
  MoveStatus,
  rotationInputMap,
} from "@/constants";

const minos = Object.values(Mino);
const initField = new Array(Height)
  .fill(null)
  .map(() => new Array(Width).fill(Cell.None));
const initMinoState = {
  mino: Mino.I,
  rotation: Rotation.R0,
  x: ReleasePosition,
  y: -1,
};
const getMinoBag = () => {
  const newMinoBag = [...minos];
  for (let i = newMinoBag.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newMinoBag[i], newMinoBag[j]] = [newMinoBag[j], newMinoBag[i]];
  }
  return newMinoBag;
};
const getMinoBounds = (minoState: MinoState) => {
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

export default function Home() {
  const [field, setField] = useState<Cell[][]>(initField);
  const [displayField, setDisplayField] = useState<Cell[][]>(initField);
  const [inputQueue, setInputQueue] = useState<Input[]>([]);
  const [_, setMinoBag] = useState<Mino[]>([]);
  const [tick, setTick] = useState(0);
  const [pause, setPause] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const [currentMino, setCurrentMino] = useState<MinoState>(initMinoState);
  const isReleased = useMemo(() => currentMino.y >= 0, [currentMino]);

  const releaseMino = useCallback(() => {
    setMinoBag((prev) => {
      const newMinoBag = [...prev];
      const mino = newMinoBag.shift();
      if (mino !== undefined) {
        setCurrentMino({ ...initMinoState, mino });
      }
      if (newMinoBag.length < 7) {
        newMinoBag.push(...getMinoBag());
      }
      return newMinoBag;
    });
  }, []);

  const decisionInput = useCallback(() => {
    let bestMinoState = { ...currentMino, y: 0 };
    for (let x = 0; x < Width; x++) {
      let isBlocked = false;
      for (let y = 0; y < Height; y++) {
        if (isBlocked) break;
        for (const rotation of Object.values(Rotation)) {
          const newMinoState = { ...currentMino, x, y, rotation };
          const { status } = getMoveStatus(newMinoState);
          if (status === MoveStatus.Movable) {
            const { top, bottom } = getMinoBounds(bestMinoState);
            const { top: newTop, bottom: newBottom } =
              getMinoBounds(newMinoState);
            if (top <= newTop && bottom <= newBottom)
              bestMinoState = newMinoState;
          } else {
            isBlocked = true;
          }
        }
      }
    }

    if (!bestMinoState) return;
    console.log(getMinoBounds(bestMinoState));
    console.log(bestMinoState);
    const lowestColIndex = bestMinoState.x;
    const indexDiff = lowestColIndex - currentMino.x;
    setInputQueue((prev) => [
      ...prev,
      ...(rotationInputMap.get(bestMinoState.rotation) ?? []),
      ...new Array(Math.abs(indexDiff))
        .fill(null)
        .map(() => (indexDiff > 0 ? Input.Right : Input.Left)),
    ]);
  }, [currentMino, field]);

  const getMoveStatus = useCallback(
    (minoState: MinoState) => {
      const newField = field.map((row) => row.map((cell) => cell));
      const shape = minoShapeMap.get(minoState.rotation)?.get(minoState.mino);
      if (!shape) {
        throw new Error("Invalid MinoState");
      }
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
    },
    [field]
  );

  const placeMino = useCallback(() => {
    const deletedField = [];
    for (let y = Height - 1; y >= 0; y--) {
      const row = displayField[y];
      if (row.every((cell) => cell !== Cell.None)) continue;
      deletedField.unshift(row);
    }
    const delCount = Height - deletedField.length;
    const blank = new Array(delCount).fill(new Array(Width).fill(Cell.None));
    return { confirmedField: [...blank, ...deletedField], delCount };
  }, [displayField]);

  const moveMino = useCallback(
    (input: Input) => {
      const newMinoState = { ...currentMino };
      if (currentMino.y < 0 && input !== Input.Down) return;
      switch (input) {
        case Input.Left:
          newMinoState.x -= 1;
          if (newMinoState.x < 0) return;
          break;
        case Input.Right:
          newMinoState.x += 1;
          if (newMinoState.x >= Width) return;
          break;
        case Input.RotateLeft:
          newMinoState.rotation = ((currentMino.rotation + 3) % 4) as Rotation;
          break;
        case Input.RotateRight:
          newMinoState.rotation = ((currentMino.rotation + 1) % 4) as Rotation;
          break;
        case Input.Down:
          newMinoState.y += 1;
          break;
      }
      const shape = minoShapeMap
        .get(newMinoState.rotation)
        ?.get(currentMino.mino);
      if (!shape) return;

      const { status: moveStatus, movedField } = getMoveStatus(newMinoState);
      if (moveStatus === MoveStatus.Blocked) {
        if (input !== Input.Down) return;
        if (currentMino.y < 0) {
          console.log("Game Over");
          setField(initField);
          setLineCount(0);
          return;
        }
        const { confirmedField, delCount } = placeMino();
        setLineCount((prev) => prev + delCount);
        setField(confirmedField);
        releaseMino();
      } else {
        setCurrentMino(newMinoState);
        setDisplayField(movedField);
      }
    },
    [currentMino, field, displayField, releaseMino]
  );

  useEffect(() => {
    releaseMino();
    setInterval(() => setTick((prev) => (prev + 1) % 30), 33);
  }, []);

  useEffect(() => {
    if (pause) return;
    if (tick % 5 === 0) {
      setInputQueue((prev) => [...prev, Input.Down]);
    }
    if (inputQueue.length === 0) return;
    moveMino(inputQueue.shift() as Input);
  }, [tick]);

  useEffect(() => {
    if (isReleased === false) return;
    decisionInput();
  }, [isReleased]);

  return (
    <>
      <Head>
        <title>Tetris</title>
        <meta name="description" content="Tetris" />
      </Head>

      <main className={styles.main}>
        <p>Deleted Line: {lineCount}</p>
        <button onClick={() => setPause((prev) => !prev)}>
          {pause ? "Resume" : "Pause"}
        </button>
        <div>
          {displayField.map((row, y) => {
            return (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  return (
                    <div
                      key={x}
                      style={{
                        backgroundColor: cellColorMap.get(cell),
                        borderWidth: 1,
                      }}
                      className="w-5 h-5 border-white"
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
