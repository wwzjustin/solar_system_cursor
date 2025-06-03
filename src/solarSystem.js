import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader(); // Instantiate loader once

// Planet data with realistic relative scales (but not distances)
const planetData = [
  { 
    name: 'Mercury', 
    radius: 0.38, 
    distance: 10, 
    color: 0xaaa9ad, // Fallback color if texture fails
    texturePath: 'textures/custom/2k_mercury.jpg',
    rotationSpeed: 0.004, // Axial rotation
    orbitInclination: 0.1221730476, // Radians (approx 7.00 degrees)
    orbitalPeriod: 0.2408467, // Relative to Earth years
    currentAngle: Math.random() * Math.PI * 2, // Initial orbital angle
    description: 'The smallest planet in our solar system and closest to the Sun, known for its extreme temperature variations.',
    details: {
      'Diameter': '4,879 km',
      'Mass': '0.055 Earths',
      'Surface Temperature': '-173 to 427 °C',
      'Orbital Period ( вокруг Солнца)': '88 Earth days',
      'Moons': '0'
    }
  },
  { 
    name: 'Venus', 
    radius: 0.95, 
    distance: 15, 
    color: 0xe39e1c, 
    texturePath: 'textures/custom/2k_venus_surface.jpg',
    rotationSpeed: 0.002,
    orbitInclination: 0.0593411946, // Radians (approx 3.40 degrees)
    orbitalPeriod: 0.61519726,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'Known for its thick, toxic atmosphere and intense heat, Venus is often called Earth\'s \'sister planet\'.',
    details: {
      'Diameter': '12,104 km',
      'Mass': '0.815 Earths',
      'Surface Temperature': '465 °C (average)',
      'Orbital Period': '225 Earth days',
      'Moons': '0'
    }
  },
  { 
    name: 'Earth', 
    radius: 1, 
    distance: 20, 
    color: 0x6b93d6, 
    texturePath: 'textures/custom/2k_earth_daymap.jpg',
    rotationSpeed: 0.01,
    orbitInclination: 0, // Reference plane
    orbitalPeriod: 1.0,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'Our home planet, the only place known to harbor life, with vast oceans and diverse ecosystems.',
    details: {
      'Diameter': '12,742 km',
      'Mass': '1 Earth',
      'Surface Temperature': '-88 to 58 °C',
      'Orbital Period': '365.25 Earth days',
      'Moons': '1 (The Moon)'
    },
    satellites: [
      {
        name: 'Moon',
        radius: 0.27, // Relative to Earth
        distance: 2.5, // Distance from parent planet
        color: 0xaaaaaa,
        texturePath: 'textures/custom/2k_moon.jpg',
        rotationSpeed: 0.003,
        orbitalPeriod: 0.0748, // In Earth years (27.3 days)
        currentAngle: Math.random() * Math.PI * 2
      }
    ]
  },
  { 
    name: 'Mars', 
    radius: 0.53, 
    distance: 25, 
    color: 0xc1440e,
    texturePath: 'textures/custom/2k_mars.jpg',
    rotationSpeed: 0.008,
    orbitInclination: 0.0322888591, // Radians (approx 1.85 degrees)
    orbitalPeriod: 1.8808158,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'The \'Red Planet\', known for its rusty appearance, polar ice caps, and potential for past microbial life.',
    details: {
      'Diameter': '6,779 km',
      'Mass': '0.107 Earths',
      'Surface Temperature': '-63 °C (average)',
      'Orbital Period': '687 Earth days',
      'Moons': '2 (Phobos & Deimos)'
    }
  },
  { 
    name: 'Jupiter', 
    radius: 11.2, 
    distance: 35, 
    color: 0xd8ca9d, 
    texturePath: 'textures/custom/2k_jupiter.jpg',
    rotationSpeed: 0.02,
    orbitInclination: 0.0227764907, // Radians (approx 1.30 degrees)
    orbitalPeriod: 11.862615,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'The largest planet in our solar system, a gas giant with a Great Red Spot and numerous moons.',
    details: {
      'Diameter': '139,820 km',
      'Mass': '317.8 Earths',
      'Cloud Top Temperature': '-145 °C (average)',
      'Orbital Period': '11.86 Earth years',
      'Moons': '95 (known, including Ganymede, Callisto, Io, Europa)'
    }
  },
  { 
    name: 'Saturn', 
    radius: 9.45, 
    distance: 47, 
    color: 0xead6b8, 
    texturePath: 'textures/custom/2k_saturn.jpg',
    rotationSpeed: 0.018,
    orbitInclination: 0.043353952, // Radians (approx 2.48 degrees)
    orbitalPeriod: 29.447498,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'Famous for its stunning ring system, Saturn is another gas giant with a diverse collection of moons.',
    details: {
      'Diameter': '116,460 km',
      'Mass': '95.2 Earths',
      'Cloud Top Temperature': '-178 °C (average)',
      'Orbital Period': '29.45 Earth years',
      'Moons': '146 (known, including Titan, Rhea, Enceladus)'
    },
    rings: {
      innerRadius: 10.8, // Values relative to Saturn's radius
      outerRadius: 15.5,
      texturePath: 'textures/custom/2k_saturn_ring_alpha.png'
    }
  },
  { 
    name: 'Uranus', 
    radius: 4.0, 
    distance: 58, 
    color: 0xc1d0d9, 
    texturePath: 'textures/custom/2k_uranus.jpg',
    rotationSpeed: 0.012,
    orbitInclination: 0.0134390352, // Radians (approx 0.77 degrees)
    orbitalPeriod: 84.016846,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'An ice giant with a unique sideways rotation, Uranus has a faint ring system and numerous moons.',
    details: {
      'Diameter': '50,724 km',
      'Mass': '14.5 Earths',
      'Cloud Top Temperature': '-214 °C (average)',
      'Orbital Period': '84 Earth years',
      'Moons': '27 (known, including Titania, Oberon, Miranda)'
    }
  },
  { 
    name: 'Neptune', 
    radius: 3.88, 
    distance: 68, 
    color: 0x3f54ba, 
    texturePath: 'textures/custom/2k_neptune.jpg',
    rotationSpeed: 0.01,
    orbitInclination: 0.0308923278, // Radians (approx 1.77 degrees)
    orbitalPeriod: 164.79132,
    currentAngle: Math.random() * Math.PI * 2,
    description: 'The most distant planet from the Sun, Neptune is an ice giant known for its strong winds and deep blue color.',
    details: {
      'Diameter': '49,244 km',
      'Mass': '17.1 Earths',
      'Cloud Top Temperature': '-218 °C (average)',
      'Orbital Period': '164.8 Earth years',
      'Moons': '14 (known, including Triton)'
    }
  }
];

export function createSolarSystem(scene) {
  // Create Sun
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunTexture = textureLoader.load('textures/custom/2k_sun.jpg');
  
  // Make sun brighter with emissive properties
  const sunMaterial = new THREE.MeshBasicMaterial({ 
    map: sunTexture, 
    color: 0xffffff,
    emissive: 0xffaa00, // Add a warm emissive glow
    emissiveIntensity: 0.8 // Control the strength of the glow
  });
  
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  
  // Increase point light from the sun for better planet illumination
  const sunLight = new THREE.PointLight(0xffffff, 2.5, 400); // Increased intensity and range
  sun.add(sunLight);
  
  // Create planets and their orbits
  const planets = planetData.map(planet => {
    // Create planet mesh
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    let material;
    if (planet.texturePath) {
      const planetTexture = textureLoader.load(planet.texturePath);
      
      // Use MeshStandardMaterial for better light response
      material = new THREE.MeshStandardMaterial({ 
        map: planetTexture, 
        color: 0xffffff,
        metalness: 0.1,  // Low metalness for non-metallic appearance
        roughness: 0.5,  // Medium roughness for better light scattering
        emissive: 0x222222, // Slight emissive property to ensure visibility
        emissiveIntensity: 0.1
      });
    } else {
      material = new THREE.MeshStandardMaterial({ 
        color: planet.color,
        metalness: 0.1,
        roughness: 0.5,
        emissive: 0x222222,
        emissiveIntensity: 0.1
      });
    }
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position planet based on initial angle and inclination
    mesh.position.x = planet.distance * Math.cos(planet.currentAngle);
    const uninclined_z = planet.distance * Math.sin(planet.currentAngle);
    mesh.position.y = uninclined_z * Math.sin(planet.orbitInclination);
    mesh.position.z = uninclined_z * Math.cos(planet.orbitInclination);
    
    scene.add(mesh);
    
    // Create orbit path
    const orbitPath = createOrbitPath(planet.distance, planet.orbitInclination);
    scene.add(orbitPath);
    
    // Add satellites (moons) if they exist
    let satellites = [];
    if (planet.satellites) {
      satellites = planet.satellites.map(satellite => {
        const satelliteGeometry = new THREE.SphereGeometry(satellite.radius, 32, 32);
        let satelliteMaterial;
        
        if (satellite.texturePath) {
          const satelliteTexture = textureLoader.load(satellite.texturePath);
          satelliteMaterial = new THREE.MeshStandardMaterial({ 
            map: satelliteTexture, 
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.5,
            emissive: 0x222222,
            emissiveIntensity: 0.1
          });
        } else {
          satelliteMaterial = new THREE.MeshStandardMaterial({ 
            color: satellite.color,
            metalness: 0.1,
            roughness: 0.5,
            emissive: 0x222222,
            emissiveIntensity: 0.1
          });
        }
        
        const satelliteMesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        
        // Initial position around parent planet
        satelliteMesh.position.x = satellite.distance;
        
        // Create a pivot for the satellite to orbit around
        const pivot = new THREE.Object3D();
        pivot.add(satelliteMesh);
        mesh.add(pivot); // Add the pivot to the planet
        
        // Create orbit path for the satellite
        const satelliteOrbitPath = createOrbitPath(satellite.distance, 0);
        mesh.add(satelliteOrbitPath);
        
        return {
          ...satellite,
          mesh: satelliteMesh,
          pivot: pivot
        };
      });
    }
    
    // Add rings if they exist (e.g., for Saturn)
    let rings = null;
    if (planet.rings) {
      const ringGeometry = new THREE.RingGeometry(
        planet.radius * planet.rings.innerRadius,
        planet.radius * planet.rings.outerRadius,
        64
      );
      
      // Custom UV mapping for ring texture
      const pos = ringGeometry.attributes.position;
      const v3 = new THREE.Vector3();
      const uv = new Float32Array(pos.count * 2);
      
      for (let i = 0; i < pos.count; i++){
        v3.fromBufferAttribute(pos, i);
        const norm = v3.length();
        const ratio = (norm - planet.radius * planet.rings.innerRadius) / 
                      (planet.radius * planet.rings.outerRadius - planet.radius * planet.rings.innerRadius);
        
        uv[i * 2] = ratio;
        uv[i * 2 + 1] = 0.5;
      }
      
      ringGeometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      
      // Use texture with alpha channel for the rings - make rings brighter
      const ringTexture = textureLoader.load(planet.rings.texturePath);
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        emissive: 0x555555,
        emissiveIntensity: 0.2
      });
      
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2; // Make rings horizontal
      mesh.add(ringMesh);
      
      rings = {
        mesh: ringMesh,
        innerRadius: planet.radius * planet.rings.innerRadius,
        outerRadius: planet.radius * planet.rings.outerRadius
      };
    }
    
    return {
      ...planet,
      mesh,
      satellites,
      rings,
      originalMaterialDetails: { // Store details needed to revert for dynamic texture upload system
        color: planet.color, // The original color before any texture
        map: planet.texturePath ? material.map : null // The initially loaded map
      }
    };
  });
  
  return { sun, planets };
}

function createOrbitPath(radius, inclinationInRadians) {
  const segments = 128;
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitPositions = new Float32Array(segments * 3);
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2; // This is the orbital angle theta
    const R_cos_theta = Math.cos(angle) * radius;
    const R_sin_theta = Math.sin(angle) * radius;

    orbitPositions[i * 3]     = R_cos_theta;                                    // X
    orbitPositions[i * 3 + 1] = R_sin_theta * Math.sin(inclinationInRadians);   // Y
    orbitPositions[i * 3 + 2] = R_sin_theta * Math.cos(inclinationInRadians);   // Z
  }
  
  orbitGeometry.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));
  
  // Make orbit paths more visible
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x6688cc, transparent: true, opacity: 0.6 });
  return new THREE.Line(orbitGeometry, orbitMaterial);
} 