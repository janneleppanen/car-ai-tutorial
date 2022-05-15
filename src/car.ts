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

    if (this.speed > 0) {
      this.speed = Math.min(this.speed, this.maxSpeed);
    } else {
      this.speed = Math.max(this.speed, -this.maxSpeed / 2);
    }

    this.speed *= this.friction;

    this.y -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}

export default Car;
