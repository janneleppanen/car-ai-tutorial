import Car from "./car";
import Road from "./road";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

canvas.width = 200;

const ctx = canvas.getContext("2d")!;
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 600, 20, 40, "AI", 4);
const traffic = [new Car(road.getLaneCenter(1), 400, 20, 40, "DUMMY")];

animate();

function animate() {
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  traffic.forEach((c) => c.update(road.borders, []));
  car.update(road.borders, traffic);

  road.draw(ctx);
  traffic.forEach((c) => c.draw(ctx, "tomato"));
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
