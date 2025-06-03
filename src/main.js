import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Raycaster, Vector2 } from 'three'
import { createSolarSystem } from './solarSystem.js'
import { addStarField } from './starField.js'
import { createPlanetLabels } from './planetLabels.js'
import { createConstellations, updateConstellationLabels, toggleConstellations } from './constellations.js'
import { educationalContent, quizQuestions, celestialEvents, getNextCelestialEvent } from './educationalContent.js'

// User preferences storage
const USER_PREFS_KEY = 'solarSystemPrefs';

function saveUserPreferences() {
  const prefs = {
    simulationSpeed: simulationSpeedMultiplier,
    isPaused: isPaused,
    showLabels: showLabels,
    showOrbits: showOrbits,
    constellationsVisible: constellationsVisible
  };
  localStorage.setItem(USER_PREFS_KEY, JSON.stringify(prefs));
}

function loadUserPreferences() {
  try {
    const prefsStr = localStorage.getItem(USER_PREFS_KEY);
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      // Apply loaded preferences
      simulationSpeedMultiplier = prefs.simulationSpeed || 1.0;
      isPaused = prefs.isPaused || false;
      showLabels = prefs.showLabels !== undefined ? prefs.showLabels : true;
      showOrbits = prefs.showOrbits !== undefined ? prefs.showOrbits : true;
      constellationsVisible = prefs.constellationsVisible || false;
      
      // Update UI to reflect loaded preferences
      if (speedSlider) speedSlider.value = simulationSpeedMultiplier;
      if (speedValueSpan) speedValueSpan.textContent = `${simulationSpeedMultiplier.toFixed(1)}x`;
      if (playPauseButton) playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
      if (labelToggle) labelToggle.checked = showLabels;
      if (orbitToggle) orbitToggle.checked = showOrbits;
      if (constellationToggle) constellationToggle.checked = constellationsVisible;
    }
  } catch (err) {
    console.error('Error loading preferences:', err);
  }
}

// Scene setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 20, 50)

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.getElementById('canvas-container').appendChild(renderer.domElement)

// Lighting - Increase ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6) // Increased intensity and using white light
scene.add(ambientLight)

// Add directional light to enhance visibility of planets
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(1, 1, 1) // Position diagonally for good coverage
scene.add(directionalLight)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

const defaultMinZoom = 5; // Renamed for clarity
const defaultMaxZoom = 300; // Increased for better solar system overview
controls.minDistance = defaultMinZoom;
controls.maxDistance = defaultMaxZoom;
controls.maxPolarAngle = Math.PI / 1.5 // Keep looking somewhat down, not from below ecliptic

// Add stars and galaxy skybox to the background
const { skybox, starField } = addStarField(scene, 1000)

// Create solar system
const { sun, planets } = createSolarSystem(scene)

// Add planet labels
const planetLabels = createPlanetLabels(planets)
const planetMeshes = planets.map(p => p.mesh); // For raycasting

// Add constellations
const constellations = createConstellations(scene);

// Get reference to the planet info panel
const planetInfoDiv = document.getElementById('planet-info');

// Get references to the educational and quiz containers
const educationalOverlay = document.getElementById('educational-overlay');
const educationalContentElement = document.getElementById('educational-content');
const quizContainer = document.getElementById('quiz-container');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');

// Initialize state variables for new features
let showLabels = true;
let showOrbits = true;
let timeMultiplier = 1; // For time controls feature
let constellationsVisible = false;
let currentQuizIndex = 0;
let correctAnswerSelected = false;

// Responsive canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Add controls hint
const controlsHint = document.createElement('div')
controlsHint.className = 'controls-hint'
controlsHint.textContent = 'Use mouse to rotate, scroll to zoom'
document.getElementById('app').appendChild(controlsHint)

// Raycaster for click detection
const raycaster = new Raycaster();
const mouse = new Vector2();

// Camera Focusing State
let focusedPlanet = null;
const cameraFocusSpeed = 0.05; // Adjust for faster/slower camera transitions
const camOffsetVector = new THREE.Vector3(); // To store camera offset calculations
const desiredCameraPosition = new THREE.Vector3(); // To store desired camera position

const textureLoader = new THREE.TextureLoader();
const originalPlanetMaterials = new Map(); // To store original colors/materials

// Performance monitoring
let lastFrameTime = 0;
let frameCount = 0;
let lowPerformanceMode = false;
let fpsMonitorElement = null;

function displayPlanetInfo(planetData) {
  if (!planetInfoDiv) return;

  let html = `<h2>${planetData.name}</h2>`;
  html += `<p>${planetData.description}</p>`;
  html += '<h3>Details:</h3><ul>';
  for (const [key, value] of Object.entries(planetData.details)) {
    html += `<li><strong>${key}:</strong> ${value}</li>`;
  }
  html += '</ul>';

  // Add texture upload section if it's a planet (not the Sun)
  if (planetData.name.toLowerCase() !== 'sun') { // Assuming Sun might be clickable later
    html += '<div class="texture-upload-section">';
    html += `  <h4>Custom Texture for ${planetData.name}</h4>`;
    html += `  <input type="file" id="texture-upload-${planetData.name.toLowerCase()}" accept="image/png, image/jpeg, image/webp" style="margin-top: 10px;">`;
    html += `  <p id="texture-status-${planetData.name.toLowerCase()}" style="font-size: 0.9em; margin-top: 5px;"></p>`;
    html += '</div>';
  }

  planetInfoDiv.innerHTML = html;
  planetInfoDiv.style.display = 'block';

  // Add event listener for the new file input, if it was added
  if (planetData.name.toLowerCase() !== 'sun') {
    const textureUploadInput = document.getElementById(`texture-upload-${planetData.name.toLowerCase()}`);
    if (textureUploadInput) {
      textureUploadInput.addEventListener('change', (event) => handleTextureUpload(event, planetData), false);
    }
  }
}

function handleTextureUpload(event, planetObjectData) {
  const file = event.target.files[0];
  const statusElement = document.getElementById(`texture-status-${planetObjectData.name.toLowerCase()}`);

  if (!file) {
    if (statusElement) statusElement.textContent = 'No file selected.';
    return;
  }

  // PRD: Support for common image formats (PNG, JPG, WEBP) - handled by 'accept' attribute.
  // PRD: Resolution and file size limits for performance optimization.
  const fileSizeLimit = 5 * 1024 * 1024; // 5MB limit
  if (file.size > fileSizeLimit) {
    if (statusElement) statusElement.textContent = `File too large (max ${fileSizeLimit / (1024*1024)}MB).`;
    event.target.value = ''; // Clear the input
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    if (statusElement) statusElement.textContent = 'Loading texture...';
    
    textureLoader.load(
      e.target.result, // data URL
      (newTexture) => {
        const planetMesh = planets.find(p => p.name === planetObjectData.name)?.mesh;
        if (planetMesh) {
          // Store original material if not already stored
          if (!originalPlanetMaterials.has(planetObjectData.name)) {
            originalPlanetMaterials.set(planetObjectData.name, {
                color: planetMesh.material.color.getHex(),
                map: planetMesh.material.map // Could be null
            });
          }

          // Dispose old texture if it exists and is not the one we are re-applying
          if (planetMesh.material.map && planetMesh.material.map !== newTexture) {
            planetMesh.material.map.dispose();
          }
          
          planetMesh.material.map = newTexture;
          planetMesh.material.color.set(0xffffff); // Set color to white to show texture purely
          planetMesh.material.needsUpdate = true;
          if (statusElement) statusElement.textContent = `Texture applied to ${planetObjectData.name}.`;
          event.target.value = ''; // Clear the input after successful upload
        } else {
          if (statusElement) statusElement.textContent = 'Error: Planet mesh not found.';
        }
      },
      undefined, // onProgress callback (not used here)
      (error) => {
        console.error('Error loading texture:', error);
        if (statusElement) statusElement.textContent = 'Error loading texture. See console.';
      }
    );
  };
  reader.onerror = function () {
    if (statusElement) statusElement.textContent = 'Error reading file.';
    console.error("Error reading file: ", reader.error);
  };
  reader.readAsDataURL(file);
}

// Add a function to revert to original texture/color (Stretch goal or nice to have)
// function revertToOriginalTexture(planetName) { ... }

function onCanvasClick(event) {
  if (!renderer.domElement) return;

  const canvasBounds = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planetMeshes, false);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const clickedPlanetData = planets.find(p => p.mesh === clickedObject);
    if (clickedPlanetData) {
      displayPlanetInfo(clickedPlanetData);
      if (focusedPlanet !== clickedPlanetData) { // Only change focus if it's a new planet
        focusedPlanet = clickedPlanetData;
        // Adjust zoom limits for the focused planet
        controls.minDistance = Math.max(0.1, clickedPlanetData.radius * 1.2); // Don't get too close to surface, ensure > 0
        controls.maxDistance = clickedPlanetData.radius * 8 + 25; // Allow reasonable zoom out from planet
      }
    }
  } else {
    // Clicking on empty space unfocuses
    if (focusedPlanet) {
      focusedPlanet = null; // Stop camera pursuing a planet
      controls.minDistance = defaultMinZoom;
      controls.maxDistance = defaultMaxZoom;
      if (planetInfoDiv) {
        // Optionally clear or hide info panel, or show general info
        planetInfoDiv.innerHTML = '<h1>Solar System Explorer</h1><p>Click on a planet to learn more. Use mouse to navigate. <br> Select a planet to upload custom textures.</p>'; 
      }
    }
  }
}

// Add event listener to the canvas for clicks
if (renderer && renderer.domElement) {
    renderer.domElement.addEventListener('click', onCanvasClick, false);
}

// UI Control Elements & State
const playPauseButton = document.getElementById('play-pause-button');
const speedSlider = document.getElementById('speed-slider');
const speedValueSpan = document.getElementById('speed-value');

let isPaused = false;
// Initialize simulationSpeedMultiplier from slider's default value if elements exist
let simulationSpeedMultiplier = 1.0;
if (speedSlider) {
    simulationSpeedMultiplier = parseFloat(speedSlider.value);
}
if (speedValueSpan) {
    speedValueSpan.textContent = `${simulationSpeedMultiplier.toFixed(1)}x`;
}

// Event Listeners for controls
if (playPauseButton) {
    playPauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
        if (!isPaused) {
            // When unpausing, get a fresh delta to avoid a large jump.
            clock.getDelta(); 
        }
        saveUserPreferences();
    });
}

if (speedSlider && speedValueSpan) {
    speedSlider.addEventListener('input', () => {
        simulationSpeedMultiplier = parseFloat(speedSlider.value);
        speedValueSpan.textContent = `${simulationSpeedMultiplier.toFixed(1)}x`;
        saveUserPreferences();
    });
}

// Add event listeners for new UI elements
const labelToggle = document.getElementById('label-toggle');
const orbitToggle = document.getElementById('orbit-toggle');
const constellationToggle = document.getElementById('constellation-toggle');
const currentTimeBtn = document.getElementById('current-time');
const equinoxBtn = document.getElementById('equinox');
const solsticeBtn = document.getElementById('solstice');
const quizButton = document.getElementById('quiz-button');
const educationalButton = document.getElementById('educational-button');

// Toggle planet labels
if (labelToggle) {
    labelToggle.addEventListener('change', () => {
        showLabels = labelToggle.checked;
        planetLabels.forEach(label => {
            label.style.display = showLabels ? 'block' : 'none';
        });
        saveUserPreferences();
    });
}

// Toggle orbit paths
if (orbitToggle) {
    orbitToggle.addEventListener('change', () => {
        showOrbits = orbitToggle.checked;
        scene.traverse(object => {
            if (object instanceof THREE.Line && !(object.parent instanceof THREE.Group)) { // Exclude constellation lines
                object.visible = showOrbits;
            }
        });
        saveUserPreferences();
    });
}

// Toggle constellations
if (constellationToggle) {
    constellationToggle.addEventListener('change', () => {
        constellationsVisible = constellationToggle.checked;
        toggleConstellations(constellations, constellationsVisible);
        saveUserPreferences();
    });
}

// Time control buttons
if (currentTimeBtn) {
    currentTimeBtn.addEventListener('click', () => {
        timeMultiplier = 1;
        // Reset planet positions to current astronomical positions (simplified)
        planets.forEach(planet => {
            planet.currentAngle = Math.random() * Math.PI * 2; // Random for demo
        });
    });
}

if (equinoxBtn) {
    equinoxBtn.addEventListener('click', () => {
        const equinox = getNextCelestialEvent('equinox');
        showCelestialEventInfo(equinox);
    });
}

if (solsticeBtn) {
    solsticeBtn.addEventListener('click', () => {
        const solstice = getNextCelestialEvent('solstice');
        showCelestialEventInfo(solstice);
    });
}

// Educational button
if (educationalButton) {
    educationalButton.addEventListener('click', () => {
        displayRandomEducationalContent();
    });
}

// Quiz button
if (quizButton) {
    quizButton.addEventListener('click', () => {
        startQuizMode();
    });
}

// Close buttons for educational overlay and quiz
if (educationalOverlay) {
    const closeBtn = educationalOverlay.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            educationalOverlay.style.display = 'none';
        });
    }
}

if (quizContainer) {
    const skipBtn = document.getElementById('skip-question');
    const nextBtn = document.getElementById('next-question');
    const closeQuizBtn = document.getElementById('close-quiz');
    
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            showNextQuizQuestion();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNextQuizQuestion();
        });
    }
    
    if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', () => {
            quizContainer.style.display = 'none';
        });
    }
}

// Function to display celestial event information
function showCelestialEventInfo(event) {
    if (!educationalOverlay || !educationalContentElement) return;
    
    educationalContentElement.innerHTML = `
        <h3>${event.name} - ${event.date.toLocaleDateString()}</h3>
        <p>${event.description}</p>
        <p>This event occurs when Earth is at a specific position in its orbit around the Sun.</p>
    `;
    
    educationalOverlay.style.display = 'block';
    educationalOverlay.classList.add('fade-in');
}

// Function to display random educational content
function displayRandomEducationalContent() {
    if (!educationalOverlay || !educationalContentElement) return;
    
    const randomIndex = Math.floor(Math.random() * educationalContent.length);
    const content = educationalContent[randomIndex];
    
    educationalContentElement.innerHTML = `
        <h3>${content.title}</h3>
        <div>${content.content.replace(/\n/g, '<br>')}</div>
    `;
    
    educationalOverlay.style.display = 'block';
    educationalOverlay.classList.add('fade-in');
}

// Quiz functions
function startQuizMode() {
    if (!quizContainer) return;
    
    currentQuizIndex = Math.floor(Math.random() * quizQuestions.length);
    correctAnswerSelected = false;
    
    showQuizQuestion(currentQuizIndex);
    quizContainer.style.display = 'block';
}

function showQuizQuestion(index) {
    if (!quizQuestion || !quizOptions) return;
    
    const question = quizQuestions[index];
    quizQuestion.textContent = question.question;
    
    // Clear previous options
    quizOptions.innerHTML = '';
    
    // Add new options
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        
        optionDiv.addEventListener('click', () => {
            // Check if this is the correct answer
            if (option === question.correctAnswer) {
                optionDiv.classList.add('correct');
                correctAnswerSelected = true;
            } else {
                optionDiv.classList.add('incorrect');
                
                // Highlight the correct answer
                const options = quizOptions.querySelectorAll('.quiz-option');
                options.forEach(opt => {
                    if (opt.textContent === question.correctAnswer) {
                        opt.classList.add('correct');
                    }
                });
            }
            
            // Enable next button
            const nextBtn = document.getElementById('next-question');
            if (nextBtn) nextBtn.disabled = false;
        });
        
        quizOptions.appendChild(optionDiv);
    });
    
    // Disable next button until an answer is selected
    const nextBtn = document.getElementById('next-question');
    if (nextBtn) nextBtn.disabled = true;
}

function showNextQuizQuestion() {
    // Get a new random question that's different from the current one
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * quizQuestions.length);
    } while (newIndex === currentQuizIndex && quizQuestions.length > 1);
    
    currentQuizIndex = newIndex;
    correctAnswerSelected = false;
    
    showQuizQuestion(currentQuizIndex);
}

// Performance monitoring function
function monitorPerformance() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastFrameTime >= 1000) { // Update every second
    const fps = Math.round(frameCount * 1000 / (now - lastFrameTime));
    
    if (!fpsMonitorElement) {
      fpsMonitorElement = document.createElement('div');
      fpsMonitorElement.className = 'fps-monitor';
      document.getElementById('app').appendChild(fpsMonitorElement);
    }
    
    fpsMonitorElement.textContent = `${fps} FPS`;
    
    // Auto-adjust for performance
    if (fps < 30 && !lowPerformanceMode) {
      enableLowPerformanceMode();
    } else if (fps > 45 && lowPerformanceMode) {
      disableLowPerformanceMode();
    }
    
    frameCount = 0;
    lastFrameTime = now;
  }
}

function enableLowPerformanceMode() {
  lowPerformanceMode = true;
  // Reduce quality settings
  renderer.setPixelRatio(1);
  planets.forEach(planet => {
    if (planet.mesh.geometry) {
      const simplifiedGeometry = new THREE.SphereGeometry(planet.radius, 16, 16); // Lower resolution
      planet.mesh.geometry.dispose();
      planet.mesh.geometry = simplifiedGeometry;
    }
  });
  console.log('Low performance mode enabled');
}

function disableLowPerformanceMode() {
  lowPerformanceMode = false;
  // Restore quality settings
  renderer.setPixelRatio(window.devicePixelRatio);
  planets.forEach(planet => {
    if (planet.mesh.geometry) {
      const detailedGeometry = new THREE.SphereGeometry(planet.radius, 32, 32); // Higher resolution
      planet.mesh.geometry.dispose();
      planet.mesh.geometry = detailedGeometry;
    }
  });
  console.log('Low performance mode disabled');
}

// Animation loop
const clock = new THREE.Clock(); 
const orbitalSpeedConstant = 0.2; // Base factor for orbital speeds, adjust for overall pace vs multiplier

function animate() {
  requestAnimationFrame(animate); // Always request the next frame

  const deltaTime = clock.getDelta();
  
  // Monitor performance
  monitorPerformance();

  // 1. Handle smooth camera focusing if active
  if (focusedPlanet && focusedPlanet.mesh) { 
    const planetActualPosition = focusedPlanet.mesh.position;
    
    controls.target.lerp(planetActualPosition, cameraFocusSpeed);

    // Dynamic viewDistance based on planet size, ensures it respects the new min/max somewhat implicitly
    // The actual zoom after transition will be bounded by controls.minDistance / maxDistance set above.
    let viewDistance = focusedPlanet.radius * 2.5 + Math.max(10, focusedPlanet.radius * 2.0);
    viewDistance = Math.max(controls.minDistance, Math.min(viewDistance, controls.maxDistance * 0.8)); // Clamp view distance by new limits
    
    // Calculate desired camera position: maintain current offset direction from new target, at new distance
    camOffsetVector.subVectors(camera.position, controls.target); // Get current offset from (lerping) target
    camOffsetVector.setLength(viewDistance); // Adjust length of this offset
    desiredCameraPosition.copy(controls.target).add(camOffsetVector); // Apply to (lerping) target

    camera.position.lerp(desiredCameraPosition, cameraFocusSpeed);

    // Stop focusing when close enough to prevent jitter and allow user control.
    if (camera.position.distanceTo(desiredCameraPosition) < 0.1 && 
        controls.target.distanceTo(planetActualPosition) < 0.1) {
      controls.target.copy(planetActualPosition); 
      camera.position.copy(desiredCameraPosition); 
      // Do not set focusedPlanet = null here if we want camera to stay locked onto it via OrbitControls target
      // focusedPlanet = null; // Original: this stops lerping. Fine. But then zoom limits might need reset on next click away.
      // The current unfocus logic (click background) handles resetting zoom limits. So this is fine.
      focusedPlanet = null;
    }
  }

  // 2. Update OrbitControls (applies user input AND new programmatic target/position)
  controls.update();

  // 3. Update simulation if not paused
  if (!isPaused) {
    // Planet axial rotation and orbital motion
    planets.forEach(planet => {
      // Axial rotation (existing)
      planet.mesh.rotation.y += planet.rotationSpeed; // This is a per-frame increment
    
      // Orbital motion
      const angularSpeed = (1 / planet.orbitalPeriod) * orbitalSpeedConstant * simulationSpeedMultiplier * timeMultiplier;
      planet.currentAngle += angularSpeed * deltaTime;
  
      planet.mesh.position.x = planet.distance * Math.cos(planet.currentAngle);
      const uninclined_z = planet.distance * Math.sin(planet.currentAngle);
      planet.mesh.position.y = uninclined_z * Math.sin(planet.orbitInclination);
      planet.mesh.position.z = uninclined_z * Math.cos(planet.orbitInclination);
      
      // Update satellites (moons) if they exist
      if (planet.satellites) {
        planet.satellites.forEach(satellite => {
          // Axial rotation for the satellite
          satellite.mesh.rotation.y += satellite.rotationSpeed;
          
          // Orbital motion for the satellite
          const satelliteAngularSpeed = (1 / satellite.orbitalPeriod) * orbitalSpeedConstant * simulationSpeedMultiplier * 5 * timeMultiplier;
          satellite.currentAngle += satelliteAngularSpeed * deltaTime;
          
          // Rotate the pivot around the parent planet
          satellite.pivot.rotation.y = satellite.currentAngle;
        });
      }
    })
    
    // Sun rotation
    sun.rotation.y += 0.001; // This is a per-frame increment
    
    // Rotate the galaxy skybox
    if (skybox) {
      skybox.rotation.y += 0.0001; // Very slow rotation for the galaxy background
    }
  }
  
  // 4. Update planet labels (always update, even if paused, as camera can move)
  if (showLabels) {
    planetLabels.forEach((label, index) => {
      const planet = planets[index]
      const position = planet.mesh.position.clone()
      position.project(camera)
      
      const x = (position.x * 0.5 + 0.5) * window.innerWidth
      const y = -(position.y * 0.5 - 0.5) * window.innerHeight
      
      label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      
      // Hide labels that are behind the camera
      label.style.display = position.z < 1 ? 'block' : 'none'
    })
  } else {
    // Hide all labels if showLabels is false
    planetLabels.forEach(label => {
      label.style.display = 'none';
    });
  }
  
  // 5. Update constellation labels
  updateConstellationLabels(constellations, camera, constellationsVisible);
  
  renderer.render(scene, camera)
}

// Initialize features and load user preferences
function initializeFeatures() {
  // Apply user preferences
  loadUserPreferences();
  
  // Hide all constellations initially
  toggleConstellations(constellations, constellationsVisible);
  
  // Set initial visibility of orbit paths based on preferences
  if (!showOrbits) {
    scene.traverse(object => {
      if (object instanceof THREE.Line && !(object.parent instanceof THREE.Group)) {
        object.visible = false;
      }
    });
  }
  
  // Update UI elements to match preferences
  if (labelToggle) labelToggle.checked = showLabels;
  if (orbitToggle) orbitToggle.checked = showOrbits;
  if (constellationToggle) constellationToggle.checked = constellationsVisible;
}

// Initialize features before starting the animation loop
initializeFeatures();
animate();
