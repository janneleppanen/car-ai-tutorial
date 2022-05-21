export type Point = {
  x: number;
  y: number;
};

export interface OffsetPoint extends Point {
  offset: number;
}
