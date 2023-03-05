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
  Rotation,
  MoveStatus,
  rotationInputMap,
  initField,
  initMinoState,
} from "@/constants";
import { getContactCount, getMinoBag, getMinoBounds, getShape } from "@/utils";

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
    for (let x = -1; x < Width; x++) {
      let isBlocked = false;
      for (let y = 0; y < Height; y++) {
        if (isBlocked) break;
        for (const rotation of Object.values(Rotation)) {
          const newMinoState = { ...currentMino, x, y, rotation };
          const { status } = getMoveStatus(newMinoState);
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
            isBlocked = true;
          }
        }
      }
    }

    if (!bestMinoState) return;
    console.log({
      ...bestMinoState,
      mino: Object.entries(Mino).find(
        ([_, v]) => v === bestMinoState.mino
      )?.[0],
      contacts: getContactCount(bestMinoState, field),
    });
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
    if (tick % 3 === 0) {
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
