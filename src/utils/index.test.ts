import {
  Cell,
  Height,
  initField,
  initMinoState,
  Input,
  Mino,
  ReleasePosition,
  Rotation,
  Width,
} from "@/constants";
import {
  getMinoBounds,
  getContactCount,
  getShape,
  decisionInput,
} from "@/utils";

test("getMinoBounds", () => {
  const result = getMinoBounds({
    mino: Mino.I,
    rotation: Rotation.R270,
    x: 0,
    y: 18,
  });
  expect(result.top).toBe(18);
  expect(result.bottom).toBe(21);
});

describe("getContactCount", () => {
  test("Drop I mino to the right wall", () => {
    const { I, None } = Cell;
    const testField = [
      [None, None, None, None, None, None, None, None, I, None],
      [None, None, None, None, None, None, None, None, I, None],
      [None, None, None, None, None, None, None, None, I, None],
      [None, None, None, None, None, None, None, None, I, None],
    ];
    const field = [
      ...new Array(Height - testField.length)
        .fill(null)
        .map(() => new Array(Width).fill(None)),
      ...testField,
    ];
    const minoState = {
      ...initMinoState,
      mino: Mino.I,
      rotation: Rotation.R270,
    };
    const shape = getShape(minoState);

    const result = getContactCount(
      {
        ...minoState,
        x: Width - 1,
        y: Height - shape.length,
      },
      field
    );
    expect(result).toBe(9);
  });

  test("Drop I mino to the left wall", () => {
    const { I, None } = Cell;
    const testField = [
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
    ];
    const field = [
      ...new Array(Height - testField.length)
        .fill(null)
        .map(() => new Array(Width).fill(None)),
      ...testField,
    ];
    const minoState = {
      ...initMinoState,
      mino: Mino.I,
      rotation: Rotation.R270,
    };
    const shape = getShape(minoState);

    const result = getContactCount(
      {
        ...minoState,
        x: 1,
        y: Height - shape.length,
      },
      field
    );
    expect(result).toBe(9);
  });
});

describe("decisionInput", () => {
  test("Drop I mino to the left hall", () => {
    const { I, None } = Cell;
    const testField = [
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
      [I, None, I, None, None, None, None, None, None, None],
    ];
    const field = [
      ...new Array(Height - testField.length)
        .fill(null)
        .map(() => new Array(Width).fill(None)),
      ...testField,
    ];
    const minoState = {
      ...initMinoState,
      mino: Mino.I,
      rotation: Rotation.R270,
      x: ReleasePosition,
    };
    const result = decisionInput(minoState, field);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify([
        Input.RotateRight,
        Input.Left,
        Input.Left,
        Input.Left,
        Input.Left,
      ])
    );
  });

  test("Drop J mino to the left hall", () => {
    const { O, None } = Cell;
    const testField = [
      [None, O, O, None, None, None, None, None, None, None],
      [None, O, O, None, None, None, None, None, None, None],
    ];
    const field = [
      ...new Array(Height - testField.length)
        .fill(null)
        .map(() => new Array(Width).fill(None)),
      ...testField,
    ];
    const minoState = {
      ...initMinoState,
      mino: Mino.I,
      rotation: Rotation.R270,
      x: ReleasePosition,
    };
    const result = decisionInput(minoState, field);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify([
        Input.RotateLeft,
        Input.Left,
        Input.Left,
        Input.Left,
        Input.Left,
      ])
    );
  });
});
