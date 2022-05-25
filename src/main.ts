import Car from "./car";
import Road from "./road";
import "./style.css";
import Visualizer from "./vizualizer";

const roadCanvas = document.querySelector<HTMLCanvasElement>("#roadCanvas")!;
roadCanvas.width = 200;
const roadCtx = roadCanvas.getContext("2d")!;

const networkCanvas =
  document.querySelector<HTMLCanvasElement>("#networkCanvas")!;
networkCanvas.width = 400;
const networkCtx = networkCanvas.getContext("2d")!;

const road = new Road(roadCanvas.width / 2, roadCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 600, 20, 40, "AI", 4);
const traffic = [new Car(road.getLaneCenter(1), 400, 20, 40, "DUMMY")];

animate();

function animate() {
  roadCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  roadCtx.save();
  roadCtx.translate(0, -car.y + roadCanvas.height * 0.7);

  traffic.forEach((c) => c.update(road.borders, []));
  car.update(road.borders, traffic);

  road.draw(roadCtx);
  traffic.forEach((c) => c.draw(roadCtx, "tomato"));
  car.draw(roadCtx);

  roadCtx.restore();

  if (car.brain) {
    Visualizer.drawNetwork(networkCtx, car.brain);
  }

  requestAnimationFrame(animate);
}
