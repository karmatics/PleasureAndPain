class GridWalker {
    constructor(app, mainApp) {
      this.app = app;
      this.mainApp = mainApp;
      this.walkerMesh = null;
      this.walkerLight = null;
      this.activeWalker = null;
      this.lastWalkerFrameTime = null;
    }

    ensureWalkerMesh() {
      if (!this.walkerMesh) {
        const THREE = this.app.THREE;
        const geo = new THREE.SphereGeometry(0.07, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffea00,
          toneMapped: false,
        });
        this.walkerMesh = new THREE.Mesh(geo, mat);
        this.walkerLight = new THREE.PointLight(0xffea00, 5.0, 2.0, 0.5);
        this.walkerMesh.add(this.walkerLight);
        this.app.scene.add(this.walkerMesh);
      }
    }

    destroy() {
      if (this.walkerMesh) {
        this.app.scene.remove(this.walkerMesh);
        this.walkerMesh = null;
      }
      this.activeWalker = null;
    }

    startFromButton(btn) {
      if (this.activeWalker) {
        this.activeWalker = null;
      }

      if (this.mainApp.bulbInstances) {
        this.mainApp.bulbInstances.forEach((b) => {
          b.isOn = false;
        });
      }

      let entryNeuron = null;
      let minDist = Infinity;
      this.mainApp.meshes.forEach((neuron) => {
        const d = neuron.position.distanceTo(btn.group.position);
        if (d < minDist) {
          minDist = d;
          entryNeuron = neuron;
        }
      });

      if (entryNeuron) {
        this.startFromNeuron(entryNeuron);
      }
    }

    startFromNeuron(startNeuron) {
      if (this.activeWalker) {
        this.activeWalker = null;
      }

      if (this.mainApp.bulbInstances) {
        this.mainApp.bulbInstances.forEach((b) => {
          b.isOn = false;
        });
      }

      this.ensureWalkerMesh();

      this.walkerMesh.position.copy(startNeuron.position);
      this.walkerMesh.visible = true;

      this.activeWalker = {
        currentNeuron: startNeuron,
        nextNeuron: null,
        history: [startNeuron],
        stepsRemaining: 150,
        lastDirection: null,
        progress: 0.0,
        isMoving: false,
      };

      this.lastWalkerFrameTime = performance.now();

      this.mainApp.setNeuronWarmth(startNeuron, 15);
      this.mainApp._applyStrengthAndOpacity();
    }

    rewardPunish(isReward) {
      let count = 0;

      this.mainApp.meshes.forEach((mesh) => {
        const warmth = mesh.userData.warmth || 0;
        if (warmth > 0) {
          count++;
          const delta = (warmth / 15.0) * 0.45;
          let strength =
            mesh.userData.strength !== undefined ? mesh.userData.strength : 1.0;

          if (isReward) {
            strength = Math.min(2.5, strength + delta);
          } else {
            strength = Math.max(0.1, strength - delta);
          }
          mesh.userData.strength = strength;
        }
      });

      this.mainApp._applyStrengthAndOpacity();
      return count;
    }

    update() {
      const THREE = this.app.THREE;
      if (!this.activeWalker) {
        this.lastWalkerFrameTime = null;
        return;
      }

      const walker = this.activeWalker;
      const clock = performance.now();
      if (!this.lastWalkerFrameTime) this.lastWalkerFrameTime = clock;
      const dt = clock - this.lastWalkerFrameTime;
      this.lastWalkerFrameTime = clock;

      if (!walker.isMoving) {
        const next = this._chooseNextNeuron(walker);
        if (!next) {
          if (this.walkerMesh) this.walkerMesh.visible = false;
          this.activeWalker = null;
          return;
        } else {
          walker.nextNeuron = next;
          walker.progress = 0.0;
          walker.isMoving = true;
          this.mainApp.setNeuronWarmth(next, 15);
          this.mainApp._applyStrengthAndOpacity();
        }
      }

      if (this.activeWalker && walker.isMoving && walker.nextNeuron) {
        const duration = Math.max(10, this.mainApp.speed);
        walker.progress += dt / duration;

        if (walker.progress >= 1.0) {
          walker.progress = 1.0;
        }

        if (this.walkerMesh) {
          this.walkerMesh.position.lerpVectors(
            walker.currentNeuron.position,
            walker.nextNeuron.position,
            walker.progress
          );
        }

        if (walker.progress >= 1.0) {
          const completedNeuron = walker.nextNeuron;
          this.mainApp.setNeuronWarmth(completedNeuron, 15);
          walker.history.push(completedNeuron);
          this.mainApp._applyStrengthAndOpacity();

          let reachedBulb = null;
          const closestBulbDist = this.mainApp.bulbDetectionRange || 1.2;
          this.mainApp.bulbInstances.forEach((bulb) => {
            const dist = bulb.group.position.distanceTo(
              completedNeuron.position
            );
            if (dist < closestBulbDist) {
              reachedBulb = bulb;
            }
          });

          if (reachedBulb) {
            reachedBulb.isOn = true;
            this.mainApp._playSwitchSound(true);
            if (this.walkerMesh) this.walkerMesh.visible = false;
            this.activeWalker = null;
          } else {
            walker.lastDirection = completedNeuron.position
              .clone()
              .sub(walker.currentNeuron.position)
              .normalize();
            walker.currentNeuron = completedNeuron;
            walker.isMoving = false;
            walker.stepsRemaining--;
            walker.nextNeuron = null;
          }
        }
      }
    }

    _chooseNextNeuron(walker) {
      const current = walker.currentNeuron;
      let neighbors = this.mainApp.findAdjacentSpheres(current);

      if (neighbors.length === 0) {
        const D = 0.16;
        const targetPos = current.position;
        this.mainApp.meshes.forEach((mesh) => {
          if (mesh !== current) {
            const dist = targetPos.distanceTo(mesh.position);
            if (dist > 0.02 && dist < D * 1.5) {
              neighbors.push(mesh);
            }
          }
        });
      }

      if (neighbors.length === 0 || walker.stepsRemaining <= 0) {
        return null;
      }

      const randChoice = this.mainApp.randomChoiceRatio !== undefined ? this.mainApp.randomChoiceRatio : 0.05;
      if (Math.random() < randChoice) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
      }

      let totalWeight = 0;
      const candidates = [];

      const backtrackPen = this.mainApp.backtrackPenalty !== undefined ? this.mainApp.backtrackPenalty : 3.5;
      const forwardBon = this.mainApp.forwardBonus !== undefined ? this.mainApp.forwardBonus : 1.8;

      neighbors.forEach((neighbor) => {
        let strength =
          neighbor.userData.strength !== undefined
            ? neighbor.userData.strength
            : 1.0;
        const warmth = neighbor.userData.warmth || 0;

        if (warmth > 5) {
          strength /= 2.5;
        }

        if (walker.lastDirection) {
          const dirToNeighbor = neighbor.position
            .clone()
            .sub(current.position)
            .normalize();
          const dotProduct = walker.lastDirection.dot(dirToNeighbor);

          if (dotProduct < -0.3) {
            strength /= backtrackPen;
          } else if (dotProduct > 0.5) {
            strength *= forwardBon;
          }
        }

        const weight = Math.pow(strength, this.mainApp.weightPow);
        if (weight > 0) {
          totalWeight += weight;
          candidates.push({ mesh: neighbor, cumulative: totalWeight });
        }
      });

      if (totalWeight === 0) {
        neighbors.forEach((neighbor) => {
          const strength =
            neighbor.userData.strength !== undefined
              ? neighbor.userData.strength
              : 1.0;
          const weight = Math.pow(strength, 2.0);
          totalWeight += weight;
          candidates.push({ mesh: neighbor, cumulative: totalWeight });
        });
      }

      if (totalWeight === 0) {
        return null;
      }

      const roll = Math.random() * totalWeight;
      let selected = candidates[0].mesh;
      for (const cand of candidates) {
        if (roll <= cand.cumulative) {
          selected = cand.mesh;
          break;
        }
      }

      return selected;
    }
  }

globalThis.GridWalker = GridWalker;
if (typeof module !== "undefined" && module.exports) module.exports = GridWalker;
