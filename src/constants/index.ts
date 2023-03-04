export const Cell = {
  I: 0,
  O: 1,
  T: 2,
  S: 3,
  Z: 4,
  J: 5,
  L: 6,
  None: 7,
} as const;
export type Cell = typeof Cell[keyof typeof Cell];

export const Mino = {
  I: 0,
  O: 1,
  T: 2,
  S: 3,
  Z: 4,
  J: 5,
  L: 6,
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

export const MoveStatus = {
  Movable: 0,
  Blocked: 1,
  GameOver: 2,
} as const;
export type MoveStatus = typeof MoveStatus[keyof typeof MoveStatus];

export const rotationInputMap = new Map<Rotation, Input[]>([
  [Rotation.R0, []],
  [Rotation.R90, [Input.RotateRight]],
  [Rotation.R180, [Input.RotateRight, Input.RotateRight]],
  [Rotation.R270, [Input.RotateLeft]],
]);

export const cellColorMap = new Map<Cell, string>([
  [Cell.I, "#00dddd"],
  [Cell.O, "#dddd00"],
  [Cell.T, "#dd00dd"],
  [Cell.S, "#00dd00"],
  [Cell.Z, "#dd0000"],
  [Cell.J, "#0000dd"],
  [Cell.L, "#dda500"],
  [Cell.None, "lightgrey"],
]);

const OMinoShape = [
  [Cell.O, Cell.O],
  [Cell.O, Cell.O],
];

export const minoShapeMapR0 = new Map<Mino, Cell[][]>([
  [
    Mino.I,
    [
      [Cell.I, Cell.I, Cell.I, Cell.I],
      [Cell.None, Cell.None, Cell.None, Cell.None],
    ],
  ],
  [Mino.O, OMinoShape],
  [
    Mino.T,
    [
      [Cell.None, Cell.T, Cell.None],
      [Cell.T, Cell.T, Cell.T],
      [Cell.None, Cell.None, Cell.None],
    ],
  ],
  [
    Mino.S,
    [
      [Cell.None, Cell.S, Cell.S],
      [Cell.S, Cell.S, Cell.None],
      [Cell.None, Cell.None, Cell.None],
    ],
  ],
  [
    Mino.Z,
    [
      [Cell.Z, Cell.Z, Cell.None],
      [Cell.None, Cell.Z, Cell.Z],
      [Cell.None, Cell.None, Cell.None],
    ],
  ],
  [
    Mino.J,
    [
      [Cell.J, Cell.None, Cell.None],
      [Cell.J, Cell.J, Cell.J],
      [Cell.None, Cell.None, Cell.None],
    ],
  ],
  [
    Mino.L,
    [
      [Cell.None, Cell.None, Cell.L],
      [Cell.L, Cell.L, Cell.L],
      [Cell.None, Cell.None, Cell.None],
    ],
  ],
]);

export const minoShapeMapR90 = new Map<Mino, Cell[][]>([
  [
    Mino.I,
    [
      [Cell.None, Cell.I],
      [Cell.None, Cell.I],
      [Cell.None, Cell.I],
      [Cell.None, Cell.I],
    ],
  ],
  [Mino.O, OMinoShape],
  [
    Mino.T,
    [
      [Cell.None, Cell.T, Cell.None],
      [Cell.None, Cell.T, Cell.T],
      [Cell.None, Cell.T, Cell.None],
    ],
  ],
  [
    Mino.S,
    [
      [Cell.None, Cell.S, Cell.None],
      [Cell.None, Cell.S, Cell.S],
      [Cell.None, Cell.None, Cell.S],
    ],
  ],
  [
    Mino.Z,
    [
      [Cell.None, Cell.None, Cell.Z],
      [Cell.None, Cell.Z, Cell.Z],
      [Cell.None, Cell.Z, Cell.None],
    ],
  ],
  [
    Mino.J,
    [
      [Cell.None, Cell.J, Cell.J],
      [Cell.None, Cell.J, Cell.None],
      [Cell.None, Cell.J, Cell.None],
    ],
  ],
  [
    Mino.L,
    [
      [Cell.None, Cell.L, Cell.None],
      [Cell.None, Cell.L, Cell.None],
      [Cell.None, Cell.L, Cell.L],
    ],
  ],
]);

export const minoShapeMapR180 = new Map<Mino, Cell[][]>([
  [
    Mino.I,
    [
      [Cell.None, Cell.None, Cell.None, Cell.None],
      [Cell.I, Cell.I, Cell.I, Cell.I],
    ],
  ],
  [Mino.O, OMinoShape],
  [
    Mino.T,
    [
      [Cell.None, Cell.None, Cell.None],
      [Cell.T, Cell.T, Cell.T],
      [Cell.None, Cell.T, Cell.None],
    ],
  ],
  [
    Mino.S,
    [
      [Cell.None, Cell.None, Cell.None],
      [Cell.None, Cell.S, Cell.S],
      [Cell.S, Cell.S, Cell.None],
    ],
  ],
  [
    Mino.Z,
    [
      [Cell.None, Cell.None, Cell.None],
      [Cell.Z, Cell.Z, Cell.None],
      [Cell.None, Cell.Z, Cell.Z],
    ],
  ],
  [
    Mino.J,
    [
      [Cell.None, Cell.None, Cell.None],
      [Cell.J, Cell.J, Cell.J],
      [Cell.None, Cell.None, Cell.J],
    ],
  ],
  [
    Mino.L,
    [
      [Cell.None, Cell.None, Cell.None],
      [Cell.L, Cell.L, Cell.L],
      [Cell.L, Cell.None, Cell.None],
    ],
  ],
]);

export const minoShapeMapR270 = new Map<Mino, Cell[][]>([
  [
    Mino.I,
    [
      [Cell.I, Cell.None],
      [Cell.I, Cell.None],
      [Cell.I, Cell.None],
      [Cell.I, Cell.None],
    ],
  ],
  [Mino.O, OMinoShape],
  [
    Mino.T,
    [
      [Cell.None, Cell.T, Cell.None],
      [Cell.T, Cell.T, Cell.None],
      [Cell.None, Cell.T, Cell.None],
    ],
  ],
  [
    Mino.S,
    [
      [Cell.S, Cell.None, Cell.None],
      [Cell.S, Cell.S, Cell.None],
      [Cell.None, Cell.S, Cell.None],
    ],
  ],
  [
    Mino.Z,
    [
      [Cell.None, Cell.Z, Cell.None],
      [Cell.Z, Cell.Z, Cell.None],
      [Cell.Z, Cell.None, Cell.None],
    ],
  ],
  [
    Mino.J,
    [
      [Cell.None, Cell.J, Cell.None],
      [Cell.None, Cell.J, Cell.None],
      [Cell.J, Cell.J, Cell.None],
    ],
  ],
  [
    Mino.L,
    [
      [Cell.L, Cell.L, Cell.None],
      [Cell.None, Cell.L, Cell.None],
      [Cell.None, Cell.L, Cell.None],
    ],
  ],
]);

export const minoShapeMap = new Map<Rotation, Map<Mino, Cell[][]>>([
  [Rotation.R0, minoShapeMapR0],
  [Rotation.R90, minoShapeMapR90],
  [Rotation.R180, minoShapeMapR180],
  [Rotation.R270, minoShapeMapR270],
]);

export type MinoState = {
  mino: Mino;
  rotation: Rotation;
  x: number;
  y: number;
};

export const Height = 22;
export const Width = 10;
export const ReleasePosition = Width / 2 - 1;
