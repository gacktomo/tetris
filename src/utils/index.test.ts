import { Mino, Rotation } from "@/constants";
import { getMinoBounds } from "@/utils";

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
