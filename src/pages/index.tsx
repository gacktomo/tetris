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
} from "@/constants";

const initField = new Array(FieldHeight)
  .fill(null)
  .map(() => new Array(FieldWidth).fill(Mino.None));

export default function Home() {
  const [field, setField] = useState<Mino[][]>(initField);
  const [fallenField, setFallenField] = useState<Mino[][]>(initField);
  const displayField = field.map((row, y) => {
    return row.map((cell, x) => {
      return fallenField[y][x] === Mino.None ? cell : fallenField[y][x];
    });
  });

  const releaseMino = useCallback(() => {
    const minos = Object.values(Mino).filter(
      (mino) => mino !== Mino.None
    ) as Mino[];
    const mino = minos[Math.floor(Math.random() * minos.length)];
    setField((prevField) => {
      const newField = prevField.map((row) => row.map((cell) => cell));
      const shape = minoShapeMap.get(mino)!;
      for (const y in shape) {
        const row = shape[y];
        for (const x in row) {
          newField[y][ReleasePosition + Number(x)] = row[x];
        }
      }
      return newField;
    });
  }, []);

  const moveMino = useCallback(() => {
    setField((prevField) => {
      if (prevField[FieldHeight - 1].some((cell) => cell !== Mino.None)) {
        setFallenField(prevField);
        releaseMino();
        return initField;
      }
      const newField = fallenField.map((row) => row.map((cell) => cell));
      for (let i = 0; i < prevField.length - 1; i++) {
        newField[i + 1] = prevField[i];
      }
      return newField;
    });
  }, []);

  useEffect(() => {
    releaseMino();
    setInterval(() => moveMino(), 250);
  }, []);

  return (
    <>
      <Head>
        <title>Tetris</title>
        <meta name="description" content="Tetris" />
      </Head>

      <main className={styles.main}>
        <div className="">
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
