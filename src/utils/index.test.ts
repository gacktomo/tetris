import {
  Cell,
  Height,
  initField,
  initMinoState,
  Mino,
  Rotation,
  Width,
} from "@/constants";
import { getMinoBounds, getContactCount, getShape } from "@/utils";

test("Check getMinoBounds", () => {
  const result = getMinoBounds({
    mino: Mino.I,
    rotation: Rotation.R270,
    x: 0,
    y: 18,
  });
  expect(result.top).toBe(18);
  expect(result.bottom).toBe(21);
});

test("getContactCount", () => {
  it("Drop I mino to the right wall", () => {
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

  it("Drop I mino to the left wall", () => {
    const { O, None } = Cell;
    const testField = [
      [None, None, None, None, None, None, None, None, None, None],
      [None, None, None, None, None, None, None, None, None, None],
      [O, O, None, None, None, None, None, None, None, None],
      [O, O, None, None, None, None, None, None, None, None],
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
});
