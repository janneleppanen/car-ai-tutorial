import Car from "./car";
import Road from "./road";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

canvas.width = 200;

const ctx = canvas.getContext("2d")!;
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 600, 20, 40);

car.draw(ctx);

animate();

function animate() {
  canvas.height = window.innerHeight;

  car.update();
  road.draw(ctx);
  car.draw(ctx);
  requestAnimationFrame(animate);
}
