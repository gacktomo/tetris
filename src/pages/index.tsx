import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import {
  FieldHeight,
  FieldWidth,
  Mino,
  minoColorMap,
  minoShapeMap,
  ReleasePosition,
  Rotation,
} from "@/constants";

const initField = new Array(FieldHeight)
  .fill(null)
  .map(() => new Array(FieldWidth).fill(Mino.None));

export default function Home() {
  const [field, setField] = useState<Mino[][]>(initField);
  const [displayField, setDisplayField] = useState<Mino[][]>(initField);
  const [currentMino, setCurrentMino] = useState<{
    mino: Mino;
    rotation: Rotation;
    x: number;
    y: number;
  }>({ mino: Mino.None, rotation: Rotation.R0, x: 0, y: 0 });

  const releaseMino = useCallback(() => {
    const minos = Object.values(Mino).filter(
      (mino) => mino !== Mino.None
    ) as Mino[];
    const mino = minos[Math.floor(Math.random() * minos.length)];
    setCurrentMino({ mino, rotation: Rotation.R0, x: ReleasePosition, y: -1 });
  }, []);

  const moveMino = () => {
    const newMinoState = { ...currentMino, y: currentMino.y + 1 };
    const newField = field.map((row) => row.map((cell) => cell));
    const shape = minoShapeMap.get(currentMino.mino);
    if (!shape) return;
    for (const [y, row] of shape.entries()) {
      for (const [x, cell] of row.entries()) {
        if (cell === Mino.None) continue;
        const newY = newMinoState.y + y;
        const newX = newMinoState.x + x;
        if (newY >= FieldHeight || field[newY][newX] !== Mino.None) {
          if (currentMino.y < 0) {
            alert("Game Over");
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
  };

  useEffect(() => {
    releaseMino();
  }, []);

  useEffect(() => {
    setTimeout(() => moveMino(), 100);
  }, [currentMino]);

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
