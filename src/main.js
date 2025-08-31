import { Road } from "./components/road.js";
import { Car } from "./components/car.js";
import { NeuralNetwork } from "./components/network.js";
import { Visualizer } from "./components/visualizer.js";
import { getRandomColor } from "./utils/helpers.js";

// Training state variables
let isPaused = false;
let simulationSpeed = 1;
let generation = 1;
let bestDistance = 0;
let generationStartTime = 0;
let maxGenerationTime = 20000; // 20 seconds max per generation
let noProgressTimeout = 5000; // 5 seconds without progress
let lastProgressTime = 0;
let bestDistanceThisGen = 0;

// Training control functions
function togglePause() {
  isPaused = !isPaused;
  const pauseButton = document.getElementById("pauseButton");
  pauseButton.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
  if (!isPaused) {
    animate();
  }
}

function updateSimulationSpeed() {
  const speedSlider = document.getElementById("speedSlider");
  const speedValue = document.getElementById("speedValue");
  simulationSpeed = parseInt(speedSlider.value);
  speedValue.textContent = simulationSpeed + "x";
}

// Update statistics display
function updateStats() {
  document.getElementById("generationCounter").textContent = generation;
  document.getElementById("bestDistance").textContent =
    Math.round(bestDistance);

  const activeCars = cars.filter((car) => !car.damaged).length;
  document.getElementById("activeCars").textContent = activeCars;

  const progressElement = document.getElementById("progressIndicator");
  if (progressElement) {
    const timeSinceProgress = performance.now() - lastProgressTime;
    if (timeSinceProgress > noProgressTimeout - 2000) {
      progressElement.textContent = "Stuck!";
      progressElement.style.color = "red";
    } else {
      progressElement.textContent = "Making progress";
      progressElement.style.color = "green";
    }
  }
}

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  if (!isPaused) {
    // Track generation time (only for the first frame of each speed step)
    if (generationStartTime === 0) {
      generationStartTime = time;
      lastProgressTime = time;
      bestDistanceThisGen = 0;
    }

    for (let i = 0; i < simulationSpeed; i++) {
      for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
      }
      for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
      }
    }

    bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
    bestDistance = Math.min(bestDistance, bestCar.y);

    // Track progress in current generation
    if (bestCar.y < bestDistanceThisGen) {
      bestDistanceThisGen = bestCar.y;
      lastProgressTime = time; // Update when we make progress
    }

    updateStats();

    // Check if we should end the generation (all crashed, timeout, or no progress)
    const activeCars = cars.filter((car) => !car.damaged).length;
    const generationDuration = time - generationStartTime;
    const timeSinceProgress = time - lastProgressTime;

    const shouldEndGeneration =
      activeCars === 0 || // All cars crashed
      generationDuration > maxGenerationTime || // Generation taking too long
      timeSinceProgress > noProgressTimeout; // No progress for too long

    if (shouldEndGeneration) {
      // Save the best brain before creating new generation
      const bestBrain = bestCar.brain;

      // Create new generation
      for (let i = 0; i < cars.length; i++) {
        // Reset car position and state
        cars[i].y = 100;
        cars[i].damaged = false;
        cars[i].speed = 0;
        cars[i].angle = 0;

        // For the first car, keep the best brain unchanged
        if (i === 0) {
          cars[i].brain = bestBrain;
        } else {
          // For other cars, mutate the best brain
          cars[i].brain = JSON.parse(JSON.stringify(bestBrain)); // Deep copy
          NeuralNetwork.mutate(cars[i].brain, 0.1); // Mutate with 10% rate
        }
      }

      generation++;
      bestDistance = 0; // Reset best distance for new generation
      generationStartTime = 0; // Reset for next generation
    }
  }

  // Rest of your drawing code remains the same...
  carCanvas.height = window.innerHeight - 20;
  networkCanvas.height = window.innerHeight - 20;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  if (!isPaused || simulationSpeed > 1) {
    requestAnimationFrame(animate);
  }
}

// Handle window resize
window.addEventListener("resize", () => {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCanvas.width = 200;
  networkCanvas.width = 300;
});

// Add event listeners for buttons
document.getElementById("saveButton").addEventListener("click", save);
document.getElementById("discardButton").addEventListener("click", discard);
document.getElementById("pauseButton").addEventListener("click", togglePause);
document
  .getElementById("speedSlider")
  .addEventListener("input", updateSimulationSpeed);

// Initialize speed display
updateSimulationSpeed();
