import Controls from "./controls";

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

  public controls: Controls;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.controls = new Controls();
  }

  update() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed !== 0) {
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}

export default Car;
