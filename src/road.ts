import { lerp } from "./utils";

class Road {
  public x: number;
  public width: number;
  public laneCount: number;
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;

  constructor(x: number, width: number, laneCount: number = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 100000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  getLaneCenter(laneIndex: number) {
    const lineWidth = this.width / this.laneCount;
    return (
      this.left +
      lineWidth / 2 +
      lineWidth * Math.min(laneIndex, this.laneCount - 1)
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i < this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}

export default Road;
