import Car from "./car";
import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

canvas.width = 200;

const ctx = canvas.getContext("2d")!;
const car = new Car(100, 100, 20, 40);

car.draw(ctx);

animate();

function animate() {
  canvas.height = window.innerHeight;

  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}
