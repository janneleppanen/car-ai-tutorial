import Car from "./car";
import { OffsetPoint } from "./types";
import { getIntersection, lerp } from "./utils";

type Point = {
  x: number;
  y: number;
};

class Sensor {
  public car: Car;
  public rayCount: number;
  public rayLength: number;
  public raySpread: number;
  public rays: Point[][];
  public readings: (OffsetPoint | undefined)[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.raySpread = Math.PI / 4;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Point[][]) {
    this.#castRays();
    this.readings = [];

    this.rays.forEach((ray) => {
      this.readings.push(this.#getReading(ray, roadBorders));
    });
  }

  #getReading(ray: Point[], roadBorders: Point[][]) {
    let touches: OffsetPoint[] = [];

    roadBorders.forEach((roadBorder) => {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorder[0],
        roadBorder[1]
      );
      if (touch) {
        touches.push(touch);
      }
    });

    if (touches.length === 0) {
      return undefined;
    }

    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((touch) => touch.offset === minOffset);
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const startPoint = { x: this.car.x, y: this.car.y };
      const endPoint = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([startPoint, endPoint]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rays.forEach((ray, index) => {
      let end: Point = ray[1];

      if (this.readings[index]) {
        end = this.readings[index] as Point;
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });
  }
}

export default Sensor;
