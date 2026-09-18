class NetworkControlsUI {
    constructor(mainApp) {
      this.mainApp = mainApp;
      this.controlsDialog = null;
    }

    build() {
      const main = this.mainApp;
      const feedback = makeElement(
        'div',
        {
          style: {
            marginTop: '8px',
            fontSize: '11px',
            color: '#aaa',
            textAlign: 'center',
          },
        },
        'Ready.'
      );

      const totalNeuronsSpan = makeElement(
        'div',
        {
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#aed',
            marginBottom: '10px',
            textAlign: 'center',
            background: '#333',
            padding: '4px',
            borderRadius: '4px',
          },
        },
        `Total Neurons: ${main.meshes ? main.meshes.length : 0}`
      );

      let rebuildTimeout = null;
      const triggerRebuild = () => {
        if (rebuildTimeout) clearTimeout(rebuildTimeout);
        feedback.textContent = 'Calculating...';
        rebuildTimeout = setTimeout(() => {
          main._buildHexagonalGrid(false);
          totalNeuronsSpan.textContent = `Total Neurons: ${main.meshes.length}`;
          feedback.textContent = `Network rebuilt.`;
        }, 120);
      };

      const makeSliderRow = (
        labelText,
        key,
        min,
        max,
        step,
        isDirectParam = true
      ) => {
        const getVal = () => {
          if (isDirectParam) {
            return main.gridParams && main.gridParams[key] !== undefined
              ? main.gridParams[key]
              : min;
          } else {
            return main[key] !== undefined ? main[key] : min;
          }
        };

        const valSpan = makeElement(
          'span',
          { style: { float: 'right', fontWeight: 'bold', color: '#fff' } },
          getVal().toString()
        );
        const label = makeElement(
          'div',
          { style: { fontSize: '11px', color: '#ccc', marginBottom: '2px' } },
          [labelText, valSpan]
        );
        const slider = makeElement('input', {
          type: 'range',
          min: min.toString(),
          max: max.toString(),
          step: step.toString(),
          value: getVal().toString(),
          style: { width: '100%', marginBottom: '8px', accentColor: '#a9dfd1' },
        });
        slider.oninput = (e) => {
          const val = parseFloat(e.target.value);
          if (isDirectParam) {
            if (!main.gridParams) main.gridParams = {};
            main.gridParams[key] = val;
            valSpan.textContent = e.target.value;

            if (key === 'transparency') {
              main._updateNeuronOpacity();
            } else {
              triggerRebuild();
            }
          } else {
            main[key] = val;
            valSpan.textContent = e.target.value;
          }
        };
        return makeElement('div', { style: { marginBottom: '4px' } }, [
          label,
          slider,
        ]);
      };

      // Structural parameters
      const sliderA = makeSliderRow('Grid Width (nx)', 'nx', 1, 30, 1);
      const sliderB = makeSliderRow('Grid Height (ny)', 'ny', 1, 40, 1);
      const sliderC = makeSliderRow('Grid Length (nz)', 'nz', 1, 40, 1);
      const sliderRadius = makeSliderRow('Neuron Radius', 'radius', 0.01, 0.08, 0.01);
      const sliderTransparency = makeSliderRow(
        'Transparency',
        'transparency',
        0.0,
        0.95,
        0.05
      );

      // External Bulbs & Buttons
      const valSpanExt = makeElement(
        'span',
        { style: { float: 'right', fontWeight: 'bold', color: '#fff' } },
        main.externalCount.toString()
      );
      const labelExt = makeElement(
        'div',
        { style: { fontSize: '11px', color: '#ccc', marginBottom: '2px' } },
        ['External Bulbs/Buttons count', valSpanExt]
      );
      const sliderExt = makeElement('input', {
        type: 'range',
        min: '0',
        max: '30',
        step: '1',
        value: main.externalCount.toString(),
        style: { width: '100%', marginBottom: '8px', accentColor: '#a9dfd1' },
      });
      sliderExt.oninput = (e) => {
        const val = parseInt(e.target.value);
        main.externalCount = val;
        valSpanExt.textContent = e.target.value;
        main._spawnExternalElements(main.externalCount);
        feedback.textContent = `Spawned ${val} bulbs/buttons along network perimeter.`;
      };
      const sliderExtRow = makeElement(
        'div',
        { style: { marginBottom: '4px' } },
        [labelExt, sliderExt]
      );

      // Cooldown and Warmth decay sliders
      const sliderDecay = makeSliderRow(
        'Warmth Decay Rate (per tick)',
        'warmthDecay',
        1,
        5,
        1,
        false
      );
      const sliderCooldownInterval = makeSliderRow(
        'Cooldown Tick Period (ms)',
        'cooldownInterval',
        20,
        500,
        10,
        false
      );

      // Directionality parameter sliders
      const sliderBacktrack = makeSliderRow(
        'Directional Backtrack Penalty',
        'backtrackPenalty',
        1.0,
        15.0,
        0.5,
        false
      );
      const sliderForwardBonus = makeSliderRow(
        'Directional Forward Momentum',
        'forwardBonus',
        1.0,
        5.0,
        0.1,
        false
      );

      // Randomness, bias, and bulb proximity
      const sliderWeightPow = makeSliderRow(
        'Selection Bias Intensity (weightPow)',
        'weightPow',
        1,
        60,
        1,
        false
      );
      const sliderNoiseRandomness = makeSliderRow(
        'Noise (Random Choice Ratio)',
        'randomChoiceRatio',
        0.0,
        1.0,
        0.05,
        false
      );
      const sliderSpeed = makeSliderRow(
        'Walker Step Duration (ms)',
        'speed',
        10,
        300,
        10,
        false
      );
      const sliderBulbRange = makeSliderRow(
        'Bulb Proximity Trigger Range',
        'bulbDetectionRange',
        0.4,
        3.0,
        0.1,
        false
      );

      // Reinforcement learning buttons
      const btnReward = makeElement(
        'button',
        {
          style: {
            display: 'inline-block',
            width: '48%',
            marginRight: '4%',
            padding: '8px',
            background: '#2ecc71',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
          },
        },
        'Reward 👍'
      );
      btnReward.onclick = () => {
        const count = main.rewardPunish(true);
        feedback.textContent = `Applied reward to ${count} active path neurons.`;
      };

      const btnPunish = makeElement(
        'button',
        {
          style: {
            display: 'inline-block',
            width: '48%',
            padding: '8px',
            background: '#e74c3c',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '11px',
          },
        },
        'Punish 👎'
      );
      btnPunish.onclick = () => {
        const count = main.rewardPunish(false);
        feedback.textContent = `Applied punishment to ${count} active path neurons.`;
      };

      const reinforcementRow = makeElement(
        'div',
        { style: { margin: '8px 0', display: 'flex' } },
        [btnReward, btnPunish]
      );

      const terminologySelect = makeElement(
        'select',
        {
          style: {
            width: '100%',
            padding: '6px',
            marginBottom: '8px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
          },
        },
        [
          makeElement(
            'option',
            { value: 'punish/reward' },
            'Clinical (Punish / Reward)'
          ),
          makeElement(
            'option',
            { value: 'pain/pleasure' },
            'Sensory (Pain / Pleasure)'
          ),
          makeElement(
            'option',
            { value: 'happy/unhappy' },
            'Emotional (Make Unhappy / Happy)'
          ),
        ]
      );
      terminologySelect.onchange = (e) => {
        main.terminologyMode = e.target.value;
        if (main.terminologyMode === 'punish/reward') {
          btnReward.textContent = 'Reward 👍';
          btnPunish.textContent = 'Punish 👎';
        } else if (main.terminologyMode === 'pain/pleasure') {
          btnReward.textContent = 'Give Pleasure 🍯';
          btnPunish.textContent = 'Inflict Pain ⚡';
        } else {
          btnReward.textContent = 'Make Happy 😊';
          btnPunish.textContent = 'Make Unhappy 😢';
        }
      };

      const btnResetNetwork = makeElement(
        'button',
        {
          style: {
            display: 'block',
            width: '100%',
            padding: '6px',
            background: '#555',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
            marginTop: '8px',
          },
        },
        'Reset Neural Path Weights'
      );
      btnResetNetwork.onclick = () => {
        main.meshes.forEach((m) => {
          m.userData.strength = 1.0;
          main.setNeuronWarmth(m, 0);
        });
        main._applyStrengthAndOpacity();
        feedback.textContent = 'All network pathway strengths reset back to 1.0.';
      };

      const btnHighlight = makeElement(
        'button',
        {
          style: {
            display: 'block',
            margin: '8px auto 4px auto',
            width: '100%',
            padding: '6px',
            background: '#ffdd00',
            border: 'none',
            borderRadius: '4px',
            color: '#111',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        },
        '🔥 Trigger Walker Path'
      );
      btnHighlight.onclick = () => {
        main.triggerHighlightSequence();
        feedback.textContent = 'Walker started from input.';
      };

      const btnRandomize = makeElement(
        'button',
        {
          style: {
            display: 'block',
            margin: '4px auto',
            width: '100%',
            padding: '6px',
            background: '#444',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
          },
        },
        'Toggle Random Colors'
      );
      btnRandomize.onclick = () => {
        main._toggleRandomColors(feedback);
      };

      const btnRandomizeStrength = makeElement(
        'button',
        {
          style: {
            display: 'block',
            margin: '4px auto',
            width: '100%',
            padding: '6px',
            background: '#444',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
          },
        },
        'Toggle Random Strength'
      );
      btnRandomizeStrength.onclick = () => {
        main._toggleRandomStrength(feedback);
      };

      const btnBloom = makeElement(
        'button',
        {
          style: {
            display: 'block',
            margin: '4px auto',
            width: '100%',
            padding: '6px',
            background: '#444',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '11px',
          },
        },
        'Toggle Glow Effect'
      );
      btnBloom.onclick = () => {
        main._toggleBloom(feedback);
      };

      const content = makeElement('div', { style: { padding: '5px', maxHeight: '550px', overflowY: 'auto' } }, [
        totalNeuronsSpan,
        makeElement('div', { style: { fontWeight: 'bold', fontSize: '11px', color: '#9cf', marginBottom: '4px' } }, '1. Grid Geometry Structure'),
        sliderA,
        sliderB,
        sliderC,
        sliderRadius,
        sliderTransparency,
        sliderExtRow,
        makeElement('hr', { style: { borderColor: '#444', margin: '8px 0' } }),
        makeElement('div', { style: { fontWeight: 'bold', fontSize: '11px', color: '#9cf', marginBottom: '4px' } }, '2. Biological Cooldown Decay'),
        sliderDecay,
        sliderCooldownInterval,
        makeElement('hr', { style: { borderColor: '#444', margin: '8px 0' } }),
        makeElement('div', { style: { fontWeight: 'bold', fontSize: '11px', color: '#9cf', marginBottom: '4px' } }, '3. Walker Directionality'),
        sliderBacktrack,
        sliderForwardBonus,
        makeElement('hr', { style: { borderColor: '#444', margin: '8px 0' } }),
        makeElement('div', { style: { fontWeight: 'bold', fontSize: '11px', color: '#9cf', marginBottom: '4px' } }, '4. Weight Randomness & Setup'),
        sliderWeightPow,
        sliderNoiseRandomness,
        sliderSpeed,
        sliderBulbRange,
        makeElement('hr', { style: { borderColor: '#444', margin: '8px 0' } }),
        makeElement(
          'div',
          { style: { fontSize: '11px', color: '#bbb', fontWeight: 'bold' } },
          '5. Training & Reinforcement Actions:'
        ),
        terminologySelect,
        reinforcementRow,
        btnResetNetwork,
        makeElement('hr', { style: { borderColor: '#444', margin: '8px 0' } }),
        btnHighlight,
        btnRandomize,
        btnRandomizeStrength,
        btnBloom,
        feedback,
      ]);

      this.controlsDialog = UITools.makeDialog({
        env: main.env,
        title: 'Pleasure & Pain Network',
        contentElement: content,
        size: [280, 600],
        position: [20, 40],
        onGeometryChange: (boxInstance, geometry) => {
          if (geometry && geometry.inner) {
            feedback.textContent =
              'size: ' +
              geometry.inner.width.toFixed(0) +
              ' × ' +
              geometry.inner.height.toFixed(0);
          }
        },
      });

      return this.controlsDialog;
    }

    close() {
      if (this.controlsDialog && typeof this.controlsDialog.close === 'function') {
        try {
          this.controlsDialog.close();
        } catch (e) {}
      }
      this.controlsDialog = null;
    }
  }

globalThis.NetworkControlsUI = NetworkControlsUI;
if (typeof module !== "undefined" && module.exports) module.exports = NetworkControlsUI;
