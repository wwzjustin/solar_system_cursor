import * as THREE from 'three';

export function addStarField(scene, starCount = 1000) {
  // Create a skybox using the milky way texture
  const textureLoader = new THREE.TextureLoader();
  const galaxyTexture = textureLoader.load('textures/custom/2k_stars_milky_way.jpg');
  
  // Create a large sphere to represent the galaxy
  const skyboxGeometry = new THREE.SphereGeometry(200, 32, 32);
  // Flip the geometry inside out so we can see the texture from inside
  skyboxGeometry.scale(-1, 1, 1);
  
  // Adjust the skybox material to be darker to make planets stand out more
  const skyboxMaterial = new THREE.MeshBasicMaterial({
    map: galaxyTexture,
    side: THREE.BackSide, // Render on the inside
    color: 0x444466,  // Add a slight blue tint and darken the galaxy background
  });
  
  const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  scene.add(skybox);
  
  // We'll also keep some stars for additional depth
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  
  // Generate random positions for each star
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Place stars in a large sphere around the scene
    const radius = 150 + Math.random() * 40; // Stars between 150-190 units away
    const theta = Math.random() * Math.PI * 2; // Random angle in XZ plane
    const phi = Math.acos(2 * Math.random() - 1); // Random angle in Y
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Make individual stars brighter
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5, // Slightly larger stars
    transparent: true,
    opacity: 0.8, // More opaque stars
    sizeAttenuation: true
  });
  
  // Create the star field as a points object
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
  
  return { skybox, starField };
} 