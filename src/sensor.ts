import Car from "./car";
import { lerp } from "./utils";

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

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.raySpread = Math.PI / 4;

    this.rays = [];
  }

  update() {
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
    this.rays.forEach((ray) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(ray[1].x, ray[1].y);
      ctx.stroke();
    });
  }
}

export default Sensor;
