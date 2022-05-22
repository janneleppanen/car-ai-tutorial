import Controls from "./controls";
import Sensor from "./sensor";
import { Point } from "./types";
import { polysIntersect } from "./utils";

type ControlType = "KEYS" | "DUMMY";

class Car {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public speed: number = 0;
  public acceleration: number = 0.2;
  public friction: number = 0.95;
  public angle: number = 0;
  public maxSpeed: number;

  public sensor?: Sensor;
  public controls: Controls;
  public polygon: Point[] = [];
  public damaged = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: ControlType,
    maxSpeed: number = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxSpeed = maxSpeed;

    if (controlType === "KEYS") {
      this.sensor = new Sensor(this);
    }
    this.controls = new Controls(controlType);
  }

  update(roadBorders: Point[][], traffic: Car[]) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string = "blue") {
    ctx.fillStyle = this.damaged ? "gray" : color;

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }

    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
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

  private assessDamage(roadBorders: Point[][], traffic: Car[]) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }

    return false;
  }
}

export default Car;
