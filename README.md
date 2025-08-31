# 🚗 Self-Driving Car Simulation with Neural Networks

A sophisticated simulation of self-driving cars using neural networks implemented entirely from scratch in JavaScript. This project demonstrates how artificial intelligence can learn to navigate roads and avoid obstacles through evolutionary algorithms.

---

## 🌟 Features

- **🤖 Neural Network Implementation** - Built from scratch without external libraries
- **🧬 Genetic Algorithm** - Cars evolve across generations using selection, crossover, and mutation
- **📡 Sensor System** - Ray-casting technology for environment detection
- **👀 Real-time Visualization** - Watch the neural network make decisions
- **⚙️ Training Controls** - Adjust simulation speed, pause/resume, and monitor statistics
- **💾 Save/Load System** - Preserve trained models across sessions
- **🎯 Adaptive Learning** - Fitness-based selection for continuous improvement

---

## 🚀 Live Demo

Try it here\! - Note: Add your deployment link once hosted

---

## 🏗️ How It Works

### Neural Network Architecture

```javascript
Input Layer (5 nodes) → Hidden Layer (6 nodes) → Output Layer (4 nodes)
```

- **Inputs:** Sensor readings from the car's environment
- **Outputs:** Control decisions (forward, left, right, reverse)

### Genetic Algorithm

- **Evaluation:** Cars are scored based on distance traveled and speed
- **Selection:** Top performers are selected as parents for the next generation
- **Crossover:** Neural networks from parents are combined
- **Mutation:** Random changes introduce new behaviors
- **Replacement:** New generation replaces the previous one

### Sensor System

Cars use ray-casting to detect:

- Road boundaries
- Other vehicles
- Obstacles

---

## 🛠️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/self-driving-car.git
cd self-driving-car
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Open your browser

Navigate to `http://localhost:9000`

---

## 📖 Usage

### Basic Controls

- **💾 Save Button:** Save the current best neural network
- **🗑️ Discard Button:** Reset training and start fresh
- **⏸️ Pause/Resume:** Temporarily halt the simulation
- **Speed Slider:** Adjust simulation speed (1x to 10x)

### Training Process

1.  The simulation starts with 100 randomly initialized cars
2.  Cars that perform well (travel far and fast) are selected
3.  Their neural networks are combined and mutated
4.  The process repeats across generations
5.  Eventually, cars learn to navigate the road effectively

### Interpreting the Visualization

- **Left Canvas:** Simulation environment with cars and sensors
- **Right Canvas:** Neural network visualization of the best performer
- **Yellow Lines:** Sensor rays detecting the environment
- **Network Lines:** Connection weights (red = negative, blue = positive)

---

## 🧪 Customization

### Adjusting Simulation Parameters

Modify `src/main.js` to change:

```javascript
const N = 100; // Population size
const mutationRate = 0.1; // Mutation intensity
const trafficDensity = 7; // Number of traffic cars
```

### Modifying Neural Network Architecture

Edit `src/components/car.js`:

```javascript
this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
// Change to [this.sensor.rayCount, 8, 6, 4] for additional layers
```

### Creating New Road layouts

Extend `src/components/road.js` to add:

- Curves
- Intersections
- Obstacles
- Multiple lanes

---

## 📊 Performance Metrics

The simulation tracks several key metrics:

- **Generation:** Current evolution cycle
- **Best Distance:** Furthest traveled by any car
- **Active Cars:** Number of non-damaged vehicles
- **Fitness Score:** Composite performance measure

---

## 🔧 Technical Details

### Built With

- Vanilla JavaScript (ES6+)
- HTML5 Canvas for rendering
- Webpack for module bundling
- LocalStorage for data persistence

### Algorithms Implemented

- Feedforward Neural Networks
- Genetic Algorithm with Fitness-Proportionate Selection
- Uniform Crossover Operation
- Gaussian Mutation
- Ray-Casting for Collision Detection
- Linear Interpolation (Lerp)

---

## 🚦 Future Enhancements

Potential improvements for the project:

- Additional road layouts and obstacles
- Multiple environments with varying difficulty
- Advanced visualization of training history
- Parameter tuning interface
- Vehicle-to-vehicle communication
- Reinforcement learning integration

---

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

---

## 🙏 Acknowledgments

- Inspired by the concept of neuroevolution
- Built for educational purposes to demonstrate AI principles
- Thanks to the JavaScript community for excellent resources
