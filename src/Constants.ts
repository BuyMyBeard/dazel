import { TypeCollision } from "./Map";

  export const TILE_RESOLUTION = 16; //textures are 16 by 16
  export const SCALE_MULTIPLIER = 2;
  export const REAL_TILE_RESOLUTION = TILE_RESOLUTION * SCALE_MULTIPLIER;
  export const STAGE_WIDTH = 16 * TILE_RESOLUTION * SCALE_MULTIPLIER;
  export const STAGE_HEIGHT = 11 * TILE_RESOLUTION * SCALE_MULTIPLIER;

  export const COLLISION_SPECIFICATIONS: Array<[number, TypeCollision]> = [
    [13, "BottomRightTriangle"],
    [14, "Square"],
    [15, "BottomLeftTriangle"],
    [21, "TopRightTriangle"],
    [22, "Square"],
    [23, "TopLeftTriangle"],
    [30, "TopLeftTriangle"],
    [39, "BottomRightTriangle"],
    [40, "Square"],
    [47, "Square"],
    [48, "Square"],
    [49, "Square"],
    [50, "Square"],
    [51, "BottomRightTriangle"],
    [52, "BottomLeftTriangle"],
    [53, "TopRightTriangle"],
    [54, "Square"],
    [55, "TopLeftTriangle"],
    [56, "Square"],
    [64, "Square"],
    [65, "Square"],
    [66, "Square"],
    [67, "Square"],
    [68, "Square"],
    [69, "Square"],
    [70, "Square"],
    [71, "Square"],
    [73, "Square"],
    [74, "Square"],
    [75, "Square"],
    [76, "Square"],
    [77, "Square"],
    [78, "Square"],
    [79, "Square"],
    [81, "Square"],
    [82, "Square"],
    [83, "Square"],
    [84, "Square"],
    [85, "Square"],
    [86, "Square"],
    [88, "BottomRightTriangle"],
    [89, "Square"],
    [90, "BottomLeftTriangle"],
    [92, "Square"],
  ]