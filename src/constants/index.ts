export const Mino = {
  I: 0,
  O: 1,
  T: 2,
  S: 3,
  Z: 4,
  J: 5,
  L: 6,
  None: 7,
} as const;
export type Mino = typeof Mino[keyof typeof Mino];

export const Rotation = {
  R0: 0,
  R90: 1,
  R180: 2,
  R270: 3,
} as const;
export type Rotation = typeof Rotation[keyof typeof Rotation];

export const Input = {
  Left: 0,
  Right: 1,
  Down: 2,
  RotateLeft: 3,
  RotateRight: 4,
  Drop: 5,
} as const;
export type Input = typeof Input[keyof typeof Input];

export const minoColorMap = new Map<Mino, string>([
  [Mino.I, "#00ffff"],
  [Mino.O, "#ffff00"],
  [Mino.T, "#ff00ff"],
  [Mino.S, "#00ff00"],
  [Mino.Z, "#ff0000"],
  [Mino.J, "#0000ff"],
  [Mino.L, "#ffa500"],
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

export type MinoState = {
  mino: Mino;
  rotation: Rotation;
  x: number;
  y: number;
};

export const FieldHeight = 22;
export const FieldWidth = 10;
export const ReleasePosition = FieldWidth / 2 - 1;
