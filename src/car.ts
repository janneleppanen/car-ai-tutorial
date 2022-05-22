import Controls from "./controls";
import Sensor from "./sensor";
import { Point } from "./types";

class Car {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public speed: number = 0;
  public acceleration: number = 0.2;
  public maxSpeed: number = 3;
  public friction: number = 0.95;
  public angle: number = 0;

  public sensor: Sensor;
  public controls: Controls;
  public polygon: Point[] = [];

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders: Point[][]) {
    this.move();
    this.polygon = this.createPolygon();
    this.sensor.update(roadBorders);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();

    this.sensor.draw(ctx);
  }

  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (Math.abs(this.speed) > 0.5) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    if (this.speed > 0) {
      this.speed = Math.min(this.speed, this.maxSpeed);
    } else {
      this.speed = Math.max(this.speed, -this.maxSpeed / 2);
    }

    this.speed *= this.friction;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }
}

export default Car;
