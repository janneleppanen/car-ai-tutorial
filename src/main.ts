import Car from "./car";
import { NeuralNetwork } from "./network";
import Road from "./road";
import "./style.css";
import Visualizer from "./vizualizer";

const N = 100;

document.getElementById("save-button")?.addEventListener("click", save);
document.getElementById("discard-button")?.addEventListener("click", discard);

const roadCanvas = document.querySelector<HTMLCanvasElement>("#roadCanvas")!;
roadCanvas.width = 200;
const roadCtx = roadCanvas.getContext("2d")!;

const networkCanvas =
  document.querySelector<HTMLCanvasElement>("#networkCanvas")!;
networkCanvas.width = 400;
const networkCtx = networkCanvas.getContext("2d")!;

const road = new Road(roadCanvas.width / 2, roadCanvas.width * 0.9);
const cars = generateCars(N);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

let bestCar: Car = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    const bestBrain = JSON.parse(
      localStorage.getItem("bestBrain") || ""
    ) as NeuralNetwork;
    cars[i].brain = bestBrain;

    if (i != 0 && cars[i].brain) {
      NeuralNetwork.mutate(cars[i].brain as NeuralNetwork, 0.05);
    }
    console.log(cars[i].brain);
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar?.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n: number) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate() {
  roadCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  bestCar = cars.reduce((bestCar: Car, car: Car) => {
    return bestCar.y < car.y ? bestCar : car;
  }, cars[0]);

  roadCtx.save();
  roadCtx.translate(0, -bestCar.y + roadCanvas.height * 0.7);

  traffic.forEach((c) => c.update(road.borders, []));
  cars.forEach((car) => car.update(road.borders, traffic));

  road.draw(roadCtx);
  traffic.forEach((c) => c.draw(roadCtx, "tomato"));

  roadCtx.globalAlpha = 0.2;
  cars.forEach((car) => car.draw(roadCtx));
  roadCtx.globalAlpha = 1;
  bestCar.draw(roadCtx, "blue", true);

  roadCtx.restore();

  if (bestCar.brain) {
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
  }

  requestAnimationFrame(animate);
}
