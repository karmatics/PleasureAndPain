class Simple3dShapes {
    static buildPrimitives(app, scene) {
      const THREE = app.THREE;
      const meshes = [];

      // Create a clean base plate for both objects to rest on
      const plateGeo = new THREE.BoxGeometry(2.0, 0.05, 1.0);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f1f,
        roughness: 0.6,
        metalness: 0.2
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.y = -0.025;
      scene.add(plate);
      meshes.push(plate);

      // --- 1. LIGHT BULB ASSEMBLY ---
      const bulbGroup = new THREE.Group();
      bulbGroup.position.set(-0.45, 0, 0);
      scene.add(bulbGroup);

      // Base Stand: simple cylinder
      const standGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.14, 32);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        metalness: 0.7,
        roughness: 0.3
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = 0.07;
      bulbGroup.add(stand);
      meshes.push(stand);

      // Socket Collar (metallic gold/brass thread)
      const collarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 32);
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0xcca625, // Brass color
        metalness: 0.9,
        roughness: 0.25
      });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.y = 0.18;
      bulbGroup.add(collar);
      meshes.push(collar);

      // Bulb Glass
      const bulbGlassGeo = new THREE.SphereGeometry(0.20, 32, 32);
      const bulbGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0.05,
        transmission: 0.95,
        thickness: 0.4,
        ior: 1.45,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.0
      });
      const bulbGlass = new THREE.Mesh(bulbGlassGeo, bulbGlassMat);
      bulbGlass.position.y = 0.39;
      bulbGlass.name = "bulb_glass";
      bulbGroup.add(bulbGlass);
      meshes.push(bulbGlass);

      // Bulb Neck (connecting base to glass)
      const neckGeo = new THREE.CylinderGeometry(0.14, 0.09, 0.10, 32);
      const neckMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        transmission: 0.9,
      });
      const neck = new THREE.Mesh(neckGeo, neckMat);
      neck.position.y = 0.27;
      bulbGroup.add(neck);
      meshes.push(neck);

      // Filament wires inside
      const filamentGroup = new THREE.Group();
      filamentGroup.position.y = 0.39;
      bulbGroup.add(filamentGroup);

      const wireGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.11, 8);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.9,
        roughness: 0.5
      });
      const wire1 = new THREE.Mesh(wireGeo, wireMat);
      wire1.position.set(-0.035, -0.05, 0);
      wire1.rotation.z = 0.18;
      const wire2 = new THREE.Mesh(wireGeo, wireMat);
      wire2.position.set(0.035, -0.05, 0);
      wire2.rotation.z = -0.18;
      filamentGroup.add(wire1, wire2);

      // Glowing filament core
      const coreGeo = new THREE.SphereGeometry(0.022, 16, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffaa44,
        emissive: new THREE.Color(0x331100),
        emissiveIntensity: 0.2,
        roughness: 0.1
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.015;
      core.name = "bulb_core";
      filamentGroup.add(core);

      // Soft glow helper (corona envelope)
      const glowGeo = new THREE.SphereGeometry(0.24, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffcc77,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.y = 0.39;
      glowMesh.name = "bulb_glow_envelope";
      bulbGroup.add(glowMesh);

      // PointLight placed inside the bulb
      const pointLight = new THREE.PointLight(0xffe2aa, 0.0, 5, 1.1);
      pointLight.position.set(-0.45, 0.40, 0);
      scene.add(pointLight);


      // --- 2. BUTTON ASSEMBLY ---
      const buttonGroup = new THREE.Group();
      buttonGroup.position.set(0.45, 0, 0);
      scene.add(buttonGroup);

      // Button Housing Base
      const housingGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.11, 32);
      const housingMat = new THREE.MeshStandardMaterial({
        color: 0x242424,
        roughness: 0.45,
        metalness: 0.3
      });
      const housing = new THREE.Mesh(housingGeo, housingMat);
      housing.position.y = 0.055;
      buttonGroup.add(housing);
      meshes.push(housing);

      // Metallic Ring Rim
      const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xdcdcdc,
        metalness: 0.85,
        roughness: 0.15
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.12;
      buttonGroup.add(ring);
      meshes.push(ring);

      // Plunger Cap
      const plungerGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.09, 32);
      const plungerMat = new THREE.MeshStandardMaterial({
        color: 0xdd2222, // Nice deep crimson cherry red button
        roughness: 0.25,
        metalness: 0.1,
        emissive: new THREE.Color(0x110000)
      });
      const plunger = new THREE.Mesh(plungerGeo, plungerMat);
      plunger.position.y = 0.16; // Rest position
      plunger.name = "button_plunger";
      buttonGroup.add(plunger);
      meshes.push(plunger);

      // Setup lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 0.75);
      mainLight.position.set(2.0, 4.0, 3.0);
      scene.add(mainLight);

      const secondaryLight = new THREE.DirectionalLight(0x90a0ff, 0.3);
      secondaryLight.position.set(-2.0, 1.5, -2.0);
      scene.add(secondaryLight);

      const grid = new THREE.GridHelper(6, 12, 0x444444, 0x222222);
      grid.visible = false;
      scene.add(grid);

      return {
        meshes,
        grid,
        bulbGlass,
        bulbCore: core,
        bulbGlowEnvelope: glowMesh,
        pointLight,
        buttonPlunger: plunger,
        buttonGroup,
        bulbGroup
      };
    }

  

  static createBulb(app, options = {}) {
      const THREE = app.THREE;
      const colorHex = options.color !== undefined ? options.color : 0xffaa00;
      const orientation = options.orientation || 'top';
      const position = options.position || { x: 0, y: 0, z: 0 };
      const scaleVal = options.scale !== undefined ? options.scale : 1.0;
      const subType = options.subType || 'standard';
      
      const bulbColor = new THREE.Color(colorHex);
      const bulbGroup = new THREE.Group();
      bulbGroup.position.set(position.x, position.y, position.z);
      
      if (typeof scaleVal === 'number') {
        bulbGroup.scale.set(scaleVal, scaleVal, scaleVal);
      } else if (scaleVal && typeof scaleVal.x === 'number') {
        bulbGroup.scale.set(scaleVal.x, scaleVal.y, scaleVal.z);
      }
      
      this.alignGroup(bulbGroup, orientation, THREE);
      
      let baseMesh, glassMesh, coreMesh, glowMesh, pointLight;

      if (subType === 'puck') {
        // --- SCI-FI HOCKEY PUCK ---
        const basePts = [];
        basePts.push(new THREE.Vector2(0.18, 0));       
        basePts.push(new THREE.Vector2(0.24, 0));       
        basePts.push(new THREE.Vector2(0.24, 0.04));    
        basePts.push(new THREE.Vector2(0.18, 0.04));    
        
        const baseGeo = new THREE.LatheGeometry(basePts, 64);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.8 });
        baseMesh = new THREE.Mesh(baseGeo, baseMat);
        bulbGroup.add(baseMesh);

        const puckPts = [];
        const R = 0.22, H = 0.12, CR = 0.04, segs = 16, r_hole = 0.0;
        
        puckPts.push(new THREE.Vector2(r_hole, 0)); 
        puckPts.push(new THREE.Vector2(R - CR, 0)); 
        for (let i = 1; i <= segs; i++) {
          const theta = -Math.PI / 2 + (i / segs) * (Math.PI / 2);
          puckPts.push(new THREE.Vector2(R - CR + CR * Math.cos(theta), CR + CR * Math.sin(theta)));
        }
        for (let i = 1; i <= segs; i++) {
          const theta = (i / segs) * (Math.PI / 2);
          puckPts.push(new THREE.Vector2(R - CR + CR * Math.cos(theta), H - CR + CR * Math.sin(theta)));
        }
        puckPts.push(new THREE.Vector2(r_hole, H)); 
        
        const glassGeo = new THREE.LatheGeometry(puckPts, 64);
        glassGeo.translate(0, 0.04, 0); 
        
        // Beautiful dark, colored, clear glass look when off
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: bulbColor.clone().multiplyScalar(0.6), 
          transparent: true, opacity: 0.9, roughness: 0.15, metalness: 0.1,
          transmission: 0.5, thickness: 0.2, ior: 1.5,
          emissive: new THREE.Color(0x000000), emissiveIntensity: 0.0 
        });
        
        glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.name = "bulb_glass";
        bulbGroup.add(glassMesh);

        const coreGeo = new THREE.TorusGeometry(0.12, 0.015, 16, 64);
        const coreMat = new THREE.MeshStandardMaterial({
          color: bulbColor, 
          emissive: new THREE.Color(0x000000), 
          emissiveIntensity: 0.0, 
          roughness: 0.1
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.y = 0.10;
        coreMesh.rotation.x = Math.PI / 2; 
        coreMesh.name = "bulb_core";
        bulbGroup.add(coreMesh);

        pointLight = new THREE.PointLight(bulbColor, 0.0, 3.0, 1.2);
        pointLight.position.set(0, 0.10, 0);
        bulbGroup.add(pointLight);

      } else if (subType === 'coil') {
        // --- STEAMPUNK HELICAL COIL ---
        const baseGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 32);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0xcc9933, metalness: 0.9, roughness: 0.2 });
        baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = 0.04;
        bulbGroup.add(baseMesh);

        const stemCurve = new THREE.SplineCurve([
          new THREE.Vector2(0.05, 0.08), new THREE.Vector2(0.04, 0.14),
          new THREE.Vector2(0.07, 0.18), new THREE.Vector2(0.0, 0.20)
        ]);
        const stemGeo = new THREE.LatheGeometry(stemCurve.getPoints(16), 32);
        const stemMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.9, ior: 1.2 });
        const stemMesh = new THREE.Mesh(stemGeo, stemMat);
        bulbGroup.add(stemMesh);

        const bulbCurve = new THREE.SplineCurve([
          new THREE.Vector2(0.09, 0.08), new THREE.Vector2(0.10, 0.16),
          new THREE.Vector2(0.18, 0.28), new THREE.Vector2(0.32, 0.42),
          new THREE.Vector2(0.36, 0.55), new THREE.Vector2(0.30, 0.68),
          new THREE.Vector2(0.18, 0.76), new THREE.Vector2(0.0, 0.78)   
        ]);
        const glassGeo = new THREE.LatheGeometry(bulbCurve.getPoints(48), 64);
        
        // Applied the puck's tinted acrylic material look to the coil bulb
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: bulbColor.clone().multiplyScalar(0.6), 
          transparent: true, opacity: 0.9, roughness: 0.15,
          transmission: 0.5, thickness: 0.01, ior: 1.1, 
          emissive: new THREE.Color(0x000000), emissiveIntensity: 0.0 
        });
        glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.name = "bulb_glass";
        bulbGroup.add(glassMesh);

        const points = [];
        points.push(new THREE.Vector3(-0.04, 0.16, 0));
        points.push(new THREE.Vector3(-0.15, 0.38, 0)); 
        points.push(new THREE.Vector3(-0.18, 0.48, 0)); 
        points.push(new THREE.Vector3(-0.16, 0.50, 0)); 
        
        const turns = 9; 
        const steps = 300;
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const x = -0.16 + t * 0.32; 
            const r = 0.075 * Math.pow(Math.sin(t * Math.PI), 0.2); 
            const angle = t * turns * Math.PI * 2 - Math.PI / 2;
            const y = 0.50 + r * Math.sin(angle);
            const z = r * Math.cos(angle);
            points.push(new THREE.Vector3(x, y, z));
        }
        
        points.push(new THREE.Vector3(0.16, 0.50, 0));
        points.push(new THREE.Vector3(0.18, 0.48, 0));
        points.push(new THREE.Vector3(0.15, 0.38, 0)); 
        points.push(new THREE.Vector3(0.04, 0.16, 0));

        const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
        // INCREASED RADIUS: from 0.005 to 0.009 (nearly double thickness)
        const coreGeo = new THREE.TubeGeometry(curve, 350, 0.009, 8, false);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x222222, 
          emissive: new THREE.Color(0x000000), 
          emissiveIntensity: 0.0, 
          roughness: 0.6, metalness: 0.8
        });
        
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.name = "bulb_core";
        bulbGroup.add(coreMesh);

        pointLight = new THREE.PointLight(bulbColor, 0.0, 4.0, 1.2);
        pointLight.position.set(0, 0.50, 0); 
        bulbGroup.add(pointLight);

      } else {
        // --- STANDARD BULB ---
        const baseGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.4 });
        const boxMesh = new THREE.Mesh(baseGeo, baseMat);
        boxMesh.position.y = 0.04;
        bulbGroup.add(boxMesh);
        
        const socketGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
        const socketMat = new THREE.MeshStandardMaterial({ color: 0xcc9933, metalness: 0.85, roughness: 0.2 });
        baseMesh = new THREE.Mesh(socketGeo, socketMat);
        baseMesh.position.y = 0.12;
        bulbGroup.add(baseMesh);
        
        const glassGeo = new THREE.SphereGeometry(0.16, 32, 32);
        
        // Applied the same tinted acrylic look to the standard bulb
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: bulbColor.clone().multiplyScalar(0.6), 
          transparent: true, opacity: 0.9, roughness: 0.15,
          transmission: 0.5, thickness: 0.3, ior: 1.45,
          emissive: new THREE.Color(0x000000), emissiveIntensity: 0.0
        });
        glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.y = 0.32;
        glassMesh.name = "bulb_glass";
        bulbGroup.add(glassMesh);
        
        const neckGeo = new THREE.CylinderGeometry(0.11, 0.08, 0.08, 24);
        const neckMat = new THREE.MeshPhysicalMaterial({ color: bulbColor, transparent: true, opacity: 0.4, transmission: 0.9 });
        const neckMesh = new THREE.Mesh(neckGeo, neckMat);
        neckMesh.position.y = 0.22;
        bulbGroup.add(neckMesh);
        
        const filamentGroup = new THREE.Group();
        filamentGroup.position.y = 0.32;
        bulbGroup.add(filamentGroup);
        
        const wireGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.09, 8);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
        const w1 = new THREE.Mesh(wireGeo, wireMat); w1.position.set(-0.03, -0.04, 0); w1.rotation.z = 0.15;
        const w2 = new THREE.Mesh(wireGeo, wireMat); w2.position.set(0.03, -0.04, 0); w2.rotation.z = -0.15;
        filamentGroup.add(w1, w2);
        
        const coreGeo = new THREE.SphereGeometry(0.02, 16, 16);
        const coreMat = new THREE.MeshStandardMaterial({
          color: bulbColor, emissive: new THREE.Color(0x000000), emissiveIntensity: 0.0, roughness: 0.1
        });
        coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.y = 0.01;
        coreMesh.name = "bulb_core";
        filamentGroup.add(coreMesh);
        
        pointLight = new THREE.PointLight(bulbColor, 0.0, 4.0, 1.2);
        pointLight.name = "bulb_light";
        pointLight.position.set(0, 0.32, 0);
        bulbGroup.add(pointLight);
      }
      
      app.scene.add(bulbGroup);
      
      return {
        group: bulbGroup,
        baseMesh, glassMesh, coreMesh, pointLight,
        color: bulbColor,
        subType: subType, 
        onClick: options.onClick || null
      };
    }

  static createButton(app, options = {}) {
      const THREE = app.THREE;
      const colorHex = options.color !== undefined ? options.color : 0xdd2222;
      const orientation = options.orientation || 'top';
      const position = options.position || { x: 0, y: 0, z: 0 };
      const scaleVal = options.scale !== undefined ? options.scale : 1.0;
      
      const btnColor = new THREE.Color(colorHex);
      const buttonGroup = new THREE.Group();
      buttonGroup.position.set(position.x, position.y, position.z);
      
      if (typeof scaleVal === 'number') buttonGroup.scale.set(scaleVal, scaleVal, scaleVal);
      else if (scaleVal && typeof scaleVal.x === 'number') buttonGroup.scale.set(scaleVal.x, scaleVal.y, scaleVal.z);
      
      this.alignGroup(buttonGroup, orientation, THREE);
      
      const baseGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.6, metalness: 0.2 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.04;
      buttonGroup.add(baseMesh);
      
      const collarGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.08, 32);
      const collarMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.18 });
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.position.y = 0.12;
      buttonGroup.add(collarMesh);
      
      const points = [];
      const segments = 12, r = 0.12, h = 0.07, shoulderRadius = r * 0.25;
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(r, 0));
      points.push(new THREE.Vector2(r, h * 0.6));
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * (Math.PI / 2);
        points.push(new THREE.Vector2(
          r - shoulderRadius + shoulderRadius * Math.cos(theta),
          (h - shoulderRadius) + shoulderRadius * Math.sin(theta)
        ));
      }
      points.push(new THREE.Vector2(0, h * 1.03));
      
      const plungerGeo = new THREE.LatheGeometry(points, 32);
      // Give the button a glassy, translucent physical material so it glows!
      const plungerMat = new THREE.MeshPhysicalMaterial({
        color: btnColor, roughness: 0.2, metalness: 0.1, transmission: 0.6,
        thickness: 0.1, emissive: new THREE.Color(0x000000), emissiveIntensity: 0.0
      });
      
      const plungerMesh = new THREE.Mesh(plungerGeo, plungerMat);
      plungerMesh.position.y = 0.15;
      plungerMesh.name = "button_plunger";
      buttonGroup.add(plungerMesh);

      const pointLight = new THREE.PointLight(btnColor, 0.0, 3.0, 1.2);
      pointLight.position.set(0, 0.10, 0);
      buttonGroup.add(pointLight);
      
      app.scene.add(buttonGroup);
      
      return {
        group: buttonGroup,
        baseMesh, collarMesh, plungerMesh, pointLight,
        color: btnColor,
        onClick: options.onClick || null
      };
    }

  static alignGroup(group, orientation, THREE) {
      group.quaternion.set(0, 0, 0, 1); // Reset rotation
      switch (orientation.toLowerCase()) {
        case 'top':
          break;
        case 'bottom':
          group.rotateX(Math.PI);
          break;
        case 'front':
          group.rotateX(Math.PI / 2);
          break;
        case 'back':
          group.rotateX(-Math.PI / 2);
          break;
        case 'left':
          group.rotateZ(Math.PI / 2);
          break;
        case 'right':
          group.rotateZ(-Math.PI / 2);
          break;
      }
    }
}

globalThis.Simple3dShapes = Simple3dShapes;
if (typeof module !== "undefined" && module.exports) module.exports = Simple3dShapes;
