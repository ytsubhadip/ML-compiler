/**
 * Swarm.js - High-Performance 3D Particles Swarm Engine
 * Developed by Antigravity - WebGL & Creative Coding Specialist
 */

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("swarm-canvas");
    if (!canvas) return;

    // --- HUD DOM Setup ---
    const hud = document.createElement("div");
    hud.className = "swarm-hud-panel";
    hud.innerHTML = `
        <div class="swarm-hud-title">
            <i class="fa-brands fa-magento"></i>
            <span id="swarm-title">Swarm Simulation</span>
        </div>
        <p class="swarm-hud-desc" id="swarm-desc">Initializing particle workspace...</p>
        <div class="swarm-controls-list" id="swarm-controls"></div>
    `;
    document.body.appendChild(hud);

    // Dynamic HUD Styling
    const style = document.createElement("style");
    style.textContent = `
        .swarm-hud-panel {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 320px;
            background: rgba(20, 22, 28, 0.45);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            color: #f3f4f6;
            font-family: "Outfit", sans-serif;
            z-index: 100;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
            gap: 14px;
            transition: all 0.3s ease;
        }
        .swarm-hud-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: #2ec866;
            margin: 0;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .swarm-hud-desc {
            font-size: 0.82rem;
            color: #9ca3af;
            margin: 0;
            line-height: 1.4;
        }
        .swarm-controls-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            padding-top: 12px;
        }
        .swarm-control-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .swarm-control-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #d1d5db;
            display: flex;
            justify-content: space-between;
        }
        .swarm-control-val {
            color: #2ec866;
            font-family: monospace;
            font-weight: 600;
        }
        .swarm-control-slider {
            width: 100%;
            accent-color: #2ec866;
            background: rgba(255, 255, 255, 0.08);
            height: 4px;
            border-radius: 2px;
            outline: none;
            border: none;
            cursor: pointer;
        }
        .swarm-annotation {
            position: absolute;
            transform: translate(-50%, -100%);
            background: rgba(13, 15, 18, 0.85);
            border: 1px solid rgba(46, 200, 102, 0.3);
            color: #2ec866;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.72rem;
            font-weight: 600;
            font-family: "Outfit", sans-serif;
            pointer-events: none;
            z-index: 90;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            margin-top: -10px;
        }
        .swarm-annotation::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 4px 4px 0;
            border-style: solid;
            border-color: rgba(13, 15, 18, 0.85) transparent;
        }
    `;
    document.head.appendChild(style);

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Simulation Parameters
    const count = 22000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Initialize random positions to start
    for (let j = 0; j < count * 3; j++) {
        positions[j] = (Math.random() - 0.5) * 50;
        colors[j] = 1.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture (Soft circular radial gradient point)
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
        size: 0.45,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: texture
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Control State & Cache Management ---
    const controlsContainer = document.getElementById("swarm-controls");
    const activeSliders = {}; 
    const currentFrameSliderValues = {}; // Decoupled cache to avoid 20,000 DOM reads/frame
    const annotationsList = {};

    function addControl(id, label, min, max, initialValue) {
        // Return from current frame cache if available
        if (currentFrameSliderValues[id] !== undefined) {
            return currentFrameSliderValues[id];
        }

        // If slider not in DOM, build it
        if (!activeSliders[id]) {
            const wrap = document.createElement("div");
            wrap.className = "swarm-control-item";
            wrap.innerHTML = `
                <div class="swarm-control-label">
                    <span>${label}</span>
                    <span class="swarm-control-val" id="val-${id}">${initialValue}</span>
                </div>
                <input type="range" class="swarm-control-slider" id="slide-${id}" 
                       min="${min}" max="${max}" step="${(max - min) / 100}" value="${initialValue}">
            `;
            controlsContainer.appendChild(wrap);

            const input = wrap.querySelector("input");
            const valLabel = wrap.querySelector(`#val-${id}`);
            
            activeSliders[id] = input;
            currentFrameSliderValues[id] = initialValue;

            input.addEventListener("input", (e) => {
                const val = parseFloat(e.target.value);
                valLabel.textContent = val.toFixed(2);
                currentFrameSliderValues[id] = val;
            });
        }

        // Return latest DOM value
        return parseFloat(activeSliders[id].value);
    }

    function setInfo(title, description) {
        document.getElementById("swarm-title").textContent = title;
        document.getElementById("swarm-desc").textContent = description;
    }

    function annotate(id, positionVector, labelText) {
        // Store annotation targets to render post-particle-update
        annotationsList[id] = { position: positionVector.clone(), text: labelText };
    }

    // Reusable structures to prevent O(N) loop allocations (Strict performance rule 1)
    const targetVector = new THREE.Vector3();
    const colorObject = new THREE.Color();
    const tempProjVector = new THREE.Vector3();

    // Cache slider values once at start of frame
    function preCacheSliders() {
        for (const id in activeSliders) {
            currentFrameSliderValues[id] = parseFloat(activeSliders[id].value);
        }
    }

    // Update floating absolute annotations in DOM
    function updateAnnotations() {
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        for (const id in annotationsList) {
            const item = annotationsList[id];
            
            // Project the 3D annotation vector to 2D screen spaces
            tempProjVector.copy(item.position);
            tempProjVector.project(camera);

            const x = (tempProjVector.x * widthHalf) + widthHalf;
            const y = -(tempProjVector.y * heightHalf) + heightHalf;

            // Check if within viewport boundary
            if (tempProjVector.z < 1) {
                let elem = document.getElementById(`anno-${id}`);
                if (!elem) {
                    elem = document.createElement("div");
                    elem.id = `anno-${id}`;
                    elem.className = "swarm-annotation";
                    elem.textContent = item.text;
                    document.body.appendChild(elem);
                }
                elem.style.left = `${x}px`;
                elem.style.top = `${y}px`;
                elem.style.display = "block";
            } else {
                const elem = document.getElementById(`anno-${id}`);
                if (elem) elem.style.display = "none";
            }
        }
    }

    // --- Particle Swarm Creative Code Update Loop ---
    function updateParticles(time) {
        const positionAttr = geometry.attributes.position.array;
        const colorAttr = geometry.attributes.color.array;

        // Populate slider caches
        preCacheSliders();

        for (let i = 0; i < count; i++) {
            // Highly optimized creative algorithm (hyper-dimensional tesseract breathing)
            const scale = addControl("scale", "Quantum Scale", 10, 45, 24);
            const speed = addControl("speed", "Warp Speed", 0.1, 2.5, 0.75);
            const dimension = addControl("dimension", "Chaos Factor", 0.5, 4.0, 1.35);

            const t = time * speed;
            
            // Spherical coordinate maps
            const phi = i * 0.13 + t;
            const theta = i * 0.0075 + t * 0.5;

            // Multi-dimensional attractor breathing
            const r = (1.5 + Math.sin(theta * dimension + t) * 0.5) * scale;
            
            // Double attractor rotation fields
            const x = Math.cos(phi) * Math.sin(theta) * r;
            const y = Math.sin(phi) * Math.sin(theta) * r;
            const z = Math.cos(theta) * r + Math.sin(phi * 2 + t) * (scale * 0.2);

            targetVector.set(x, y, z);

            // Set dynamic transition colors (Green student to blue teacher spectrums)
            const hue = ((i / count) + (time * 0.03)) % 1.0;
            colorObject.setHSL(hue, 0.85, 0.5);

            // Annotations & HUD info on index 0
            if (i === 0) {
                setInfo(
                    "Hyperdimensional Attractor Swarm",
                    "A real-time WebGL simulation of 22,000+ spatial coordinates morphing in a high-dimensional state space attractor. Interactive sliders map quantum structures dynamically."
                );
                annotate("center", new THREE.Vector3(0, 0, 0), "Quantum Center");
                annotate("attractor-head", targetVector, "Attractor Head");
            }

            // Write straight to float attributes arrays
            const idx3 = i * 3;
            positionAttr[idx3] = targetVector.x;
            positionAttr[idx3 + 1] = targetVector.y;
            positionAttr[idx3 + 2] = targetVector.z;

            colorAttr[idx3] = colorObject.r;
            colorAttr[idx3 + 1] = colorObject.g;
            colorAttr[idx3 + 2] = colorObject.b;
        }

        // Notify Three.js to push fresh data to GPU buffers
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    // --- Main Render Frame Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Parallax rotate the camera for high immersive 3D depths
        points.rotation.y = time * 0.04;
        points.rotation.x = Math.sin(time * 0.02) * 0.08;

        // Perform calculation
        updateParticles(time);

        // Render WebGL points
        renderer.render(scene, camera);

        // Position annotations
        updateAnnotations();
    }

    animate();

    // --- Responsive Resize handling ---
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
