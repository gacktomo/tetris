export enum Mino {
  I,
  O,
  T,
  S,
  Z,
  J,
  L,
  None,
}

export const minoColorMap = new Map<Mino, string>([
  [Mino.I, "cyan"],
  [Mino.O, "yellow"],
  [Mino.T, "purple"],
  [Mino.S, "green"],
  [Mino.Z, "red"],
  [Mino.J, "blue"],
  [Mino.L, "orange"],
  [Mino.None, "lightgrey"],
]);

export const minoShapeMap = new Map<Mino, Mino[][]>([
  [Mino.I, [[Mino.I], [Mino.I], [Mino.I], [Mino.I]]],
  [
    Mino.O,
    [
      [Mino.O, Mino.O],
      [Mino.O, Mino.O],
    ],
  ],
  [
    Mino.T,
    [
      [Mino.None, Mino.T, Mino.None],
      [Mino.T, Mino.T, Mino.T],
    ],
  ],
  [
    Mino.S,
    [
      [Mino.None, Mino.S, Mino.S],
      [Mino.S, Mino.S, Mino.None],
    ],
  ],
  [
    Mino.Z,
    [
      [Mino.Z, Mino.Z, Mino.None],
      [Mino.None, Mino.Z, Mino.Z],
    ],
  ],
  [
    Mino.J,
    [
      [Mino.J, Mino.None, Mino.None],
      [Mino.J, Mino.J, Mino.J],
    ],
  ],
  [
    Mino.L,
    [
      [Mino.None, Mino.None, Mino.L],
      [Mino.L, Mino.L, Mino.L],
    ],
  ],
]);

export const FieldHeight = 22;
export const FieldWidth = 10;
export const ReleasePosition = FieldWidth / 2 - 1;
