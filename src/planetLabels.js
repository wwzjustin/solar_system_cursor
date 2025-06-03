export function createPlanetLabels(planets) {
  const planetLabels = planets.map(planet => {
    const label = document.createElement('div');
    label.className = 'planet-label';
    label.textContent = planet.name;
    label.style.position = 'absolute';
    label.style.top = '0';
    label.style.left = '0';
    label.style.transform = 'translate(-50%, -50%)';
    document.getElementById('app').appendChild(label);
    
    // When label is clicked, show more information about the planet
    label.addEventListener('click', () => {
      displayPlanetInfo(planet);
    });
    
    return label;
  });
  
  return planetLabels;
}

// Display planet information in the info panel
function displayPlanetInfo(planet) {
  const infoElement = document.getElementById('planet-info');
  
  // Create details for the planet
  let infoHTML = `
    <h2>${planet.name}</h2>
    <p><strong>Radius:</strong> ${planet.radius} (Earth = 1)</p>
    <p><strong>Distance from Sun:</strong> ${planet.distance} units</p>
  `;
  
  // Add additional information based on the planet
  switch(planet.name) {
    case 'Mercury':
      infoHTML += `<p>The smallest and innermost planet in the Solar System.</p>`;
      break;
    case 'Venus':
      infoHTML += `<p>Second planet from the Sun with a thick, toxic atmosphere.</p>`;
      break;
    case 'Earth':
      infoHTML += `<p>Our home planet and the only known place with life.</p>`;
      break;
    case 'Mars':
      infoHTML += `<p>The "Red Planet" with polar ice caps and evidence of ancient water.</p>`;
      break;
    case 'Jupiter':
      infoHTML += `<p>The largest planet with a distinctive Great Red Spot storm.</p>`;
      break;
    case 'Saturn':
      infoHTML += `<p>Known for its beautiful ring system made of ice particles.</p>`;
      break;
    case 'Uranus':
      infoHTML += `<p>An ice giant that rotates on its side like a rolling ball.</p>`;
      break;
    case 'Neptune':
      infoHTML += `<p>The windiest planet with speeds up to 2,100 km/h.</p>`;
      break;
  }
  
  // Display the information
  infoElement.innerHTML = infoHTML;
} 