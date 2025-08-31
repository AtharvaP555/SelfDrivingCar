import { lerp } from "../utils/helpers.js";

export class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  static crossover(network1, network2) {
    const offspring = JSON.parse(JSON.stringify(network1));

    for (let i = 0; i < offspring.levels.length; i++) {
      const level = offspring.levels[i];
      const parent2Level = network2.levels[i];

      // Crossover weights
      for (let j = 0; j < level.weights.length; j++) {
        for (let k = 0; k < level.weights[j].length; k++) {
          // 50% chance to take from parent2
          if (Math.random() > 0.5) {
            level.weights[j][k] = parent2Level.weights[j][k];
          }
        }
      }

      // Crossover biases
      for (let j = 0; j < level.biases.length; j++) {
        if (Math.random() > 0.5) {
          level.biases[j] = parent2Level.biases[j];
        }
      }
    }

    return offspring;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        // More intelligent mutation: sometimes large, sometimes small changes
        if (Math.random() < 0.1) {
          // 10% chance: big mutation
          level.biases[i] += (Math.random() * 2 - 1) * amount * 2;
        } else if (Math.random() < 0.3) {
          // 20% chance: small mutation
          level.biases[i] += (Math.random() * 2 - 1) * amount * 0.5;
        }
        // 70% chance: no mutation to this bias
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          if (Math.random() < 0.1) {
            level.weights[i][j] += (Math.random() * 2 - 1) * amount * 2;
          } else if (Math.random() < 0.3) {
            level.weights[i][j] += (Math.random() * 2 - 1) * amount * 0.5;
          }
        }
      }
    });
  }
}

export class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}
