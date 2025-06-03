import * as THREE from 'three';

// Constellation data - coordinates are simplified for visualization purposes
const constellationData = [
  {
    name: 'Ursa Major (Big Dipper)',
    stars: [
      { x: 100, y: 50, z: -200 },
      { x: 90, y: 55, z: -205 },
      { x: 80, y: 53, z: -210 },
      { x: 70, y: 48, z: -215 },
      { x: 60, y: 40, z: -220 },
      { x: 65, y: 35, z: -225 },
      { x: 70, y: 30, z: -230 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
    ]
  },
  {
    name: 'Orion',
    stars: [
      { x: -80, y: 60, z: -200 }, // Betelgeuse
      { x: -75, y: 70, z: -200 }, // Bellatrix
      { x: -70, y: 50, z: -200 }, // Shoulder
      { x: -65, y: 45, z: -200 }, // Alnilam (Belt)
      { x: -60, y: 40, z: -200 }, // Alnitak (Belt)
      { x: -55, y: 35, z: -200 }, // Mintaka (Belt)
      { x: -50, y: 20, z: -200 }, // Rigel
      { x: -45, y: 25, z: -200 }  // Saiph
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 3]
    ]
  },
  {
    name: 'Cassiopeia',
    stars: [
      { x: 50, y: 100, z: -250 },
      { x: 60, y: 110, z: -250 },
      { x: 70, y: 105, z: -250 },
      { x: 80, y: 115, z: -250 },
      { x: 90, y: 105, z: -250 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    name: 'Cygnus (Northern Cross)',
    stars: [
      { x: -60, y: 120, z: -220 },
      { x: -60, y: 110, z: -220 },
      { x: -60, y: 100, z: -220 },
      { x: -60, y: 90, z: -220 },
      { x: -60, y: 80, z: -220 },
      { x: -70, y: 100, z: -220 },
      { x: -50, y: 100, z: -220 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6]
    ]
  },
  {
    name: 'Lyra',
    stars: [
      { x: -20, y: 120, z: -230 }, // Vega
      { x: -25, y: 115, z: -230 },
      { x: -15, y: 115, z: -230 },
      { x: -25, y: 110, z: -230 },
      { x: -15, y: 110, z: -230 }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 4]
    ]
  }
];

// Create 3D objects for constellations
export function createConstellations(scene) {
  const constellationObjects = [];
  
  constellationData.forEach(constellation => {
    const constellationGroup = new THREE.Group();
    constellationGroup.name = constellation.name;
    
    // Create stars
    const starGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const starMeshes = constellation.stars.map((star, index) => {
      const mesh = new THREE.Mesh(starGeometry, starMaterial);
      mesh.position.set(star.x, star.y, star.z);
      constellationGroup.add(mesh);
      return mesh;
    });
    
    // Create lines between stars
    constellation.lines.forEach(line => {
      const start = constellation.stars[line[0]];
      const end = constellation.stars[line[1]];
      
      const points = [];
      points.push(new THREE.Vector3(start.x, start.y, start.z));
      points.push(new THREE.Vector3(end.x, end.y, end.z));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xccccff, 
        transparent: true, 
        opacity: 0.6 
      });
      
      const line3D = new THREE.Line(lineGeometry, lineMaterial);
      constellationGroup.add(line3D);
    });
    
    // Add label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'constellation-label';
    labelDiv.textContent = constellation.name;
    labelDiv.style.display = 'none';
    document.body.appendChild(labelDiv);
    
    // Calculate center position for label
    const centerPos = { x: 0, y: 0, z: 0 };
    constellation.stars.forEach(star => {
      centerPos.x += star.x;
      centerPos.y += star.y;
      centerPos.z += star.z;
    });
    
    centerPos.x /= constellation.stars.length;
    centerPos.y /= constellation.stars.length;
    centerPos.z /= constellation.stars.length;
    
    const labelPos = new THREE.Vector3(centerPos.x, centerPos.y, centerPos.z);
    
    constellationObjects.push({
      name: constellation.name,
      group: constellationGroup,
      stars: starMeshes,
      label: labelDiv,
      labelPosition: labelPos
    });
    
    // Add to scene but hide initially
    constellationGroup.visible = false;
    scene.add(constellationGroup);
  });
  
  return constellationObjects;
}

// Update constellation labels based on camera position
export function updateConstellationLabels(constellations, camera, visible) {
  constellations.forEach(constellation => {
    // Hide all if not visible
    if (!visible) {
      constellation.label.style.display = 'none';
      return;
    }
    
    // Project the position to screen coordinates
    const position = constellation.labelPosition.clone();
    position.project(camera);
    
    // Convert to screen coordinates
    const x = (position.x * 0.5 + 0.5) * window.innerWidth;
    const y = -(position.y * 0.5 - 0.5) * window.innerHeight;
    
    // Update label position
    constellation.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    
    // Show label only if it's in front of the camera
    constellation.label.style.display = position.z < 1 ? 'block' : 'none';
  });
}

// Toggle visibility of constellations
export function toggleConstellations(constellations, visible) {
  constellations.forEach(constellation => {
    constellation.group.visible = visible;
  });
} 