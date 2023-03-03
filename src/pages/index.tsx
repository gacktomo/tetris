import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FieldHeight,
  FieldWidth,
  Input,
  Mino,
  minoColorMap,
  minoShapeMap,
  MinoState,
  ReleasePosition,
  Rotation,
} from "@/constants";

const initField = new Array(FieldHeight)
  .fill(null)
  .map(() => new Array(FieldWidth).fill(Mino.None));

export default function Home() {
  const [field, setField] = useState<Mino[][]>(initField);
  const [displayField, setDisplayField] = useState<Mino[][]>(initField);
  const [inputQueue, setInputQueue] = useState<Input[]>([]);
  const [tick, setTick] = useState(0);
  const [currentMino, setCurrentMino] = useState<MinoState>({
    mino: Mino.None,
    rotation: Rotation.R0,
    x: 0,
    y: 0,
  });
  const isReleased = useMemo(() => currentMino.y >= 0, [currentMino]);

  const releaseMino = useCallback(() => {
    const minos = Object.values(Mino).filter((mino) => mino !== Mino.None);
    const mino = minos[Math.floor(Math.random() * minos.length)];
    setCurrentMino({ mino, rotation: Rotation.R0, x: ReleasePosition, y: -1 });
  }, []);

  const decisionInput = useCallback(() => {
    const actions = [
      new Array(4).fill(null).map(() => Input.Left),
      new Array(4).fill(null).map(() => Input.Right),
      [],
    ];
    setInputQueue((prev) => [
      ...prev,
      ...actions[Math.round(Math.random() * (actions.length - 1))],
    ]);
  }, []);

  const moveMino = useCallback(
    (input: Input) => {
      const newMinoState = { ...currentMino };
      switch (input) {
        case Input.Left:
          newMinoState.x -= 1;
          if (currentMino.y < 0) return;
          if (newMinoState.x < 0) return;
          break;
        case Input.Right:
          newMinoState.x += 1;
          if (currentMino.y < 0) return;
          if (newMinoState.x >= FieldWidth) return;
          break;
        case Input.RotateLeft:
          newMinoState.rotation = ((newMinoState.rotation - 1) % 4) as Rotation;
          break;
        case Input.RotateRight:
          newMinoState.rotation = ((newMinoState.rotation + 1) % 4) as Rotation;
          break;
        case Input.Down:
          newMinoState.y += 1;
          break;
      }
      const newField = field.map((row) => row.map((cell) => cell));
      const shape = minoShapeMap.get(currentMino.mino);
      if (!shape) return;
      for (const [y, row] of shape.entries()) {
        for (const [x, cell] of row.entries()) {
          if (cell === Mino.None) continue;
          const newY = newMinoState.y + y;
          const newX = newMinoState.x + x;
          if (newY >= FieldHeight || field[newY][newX] !== Mino.None) {
            if (input !== Input.Down) return;
            if (currentMino.y < 0) {
              console.log("Game Over");
              setField(initField);
              return;
            }
            setField(displayField);
            releaseMino();
            return;
          } else {
            newField[newY][newX] = cell;
          }
        }
      }
      setCurrentMino(newMinoState);
      setDisplayField(newField);
    },
    [currentMino, field, displayField, releaseMino]
  );

  useEffect(() => {
    releaseMino();
    setInterval(() => setTick(Math.random()), 33);
    setInterval(() => setInputQueue((prev) => [...prev, Input.Down]), 100);
  }, []);

  useEffect(() => {
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
        <div>
          {displayField.map((row, y) => {
            return (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  return (
                    <div
                      key={x}
                      style={{ backgroundColor: minoColorMap.get(cell) }}
                      className="w-5 h-5 border-2 border-white"
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
