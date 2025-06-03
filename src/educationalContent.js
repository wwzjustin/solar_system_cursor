// Educational content for overlays
export const educationalContent = [
  {
    id: 'planets',
    title: 'The Planets',
    content: `Our solar system consists of eight planets orbiting around the Sun. In order from the Sun, they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
    
    The inner four planets (Mercury, Venus, Earth, and Mars) are known as terrestrial planets because they have rocky surfaces. The outer four planets (Jupiter, Saturn, Uranus, and Neptune) are gas giants, primarily composed of hydrogen and helium.
    
    Pluto was considered the ninth planet until 2006 when it was reclassified as a dwarf planet by the International Astronomical Union.`
  },
  {
    id: 'sun',
    title: 'The Sun',
    content: `The Sun is the star at the center of our solar system. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun radiates energy mainly as light, ultraviolet, and infrared radiation, and is the most important source of energy for life on Earth.
    
    Some interesting facts about the Sun:
    - It accounts for 99.86% of the mass in the solar system
    - It has a diameter of about 1.39 million kilometers (864,000 miles)
    - Its surface temperature is approximately 5,500°C (10,000°F)
    - The Sun's core reaches temperatures of 15 million °C (27 million °F)`
  },
  {
    id: 'orbits',
    title: 'Planetary Orbits',
    content: `Planets orbit the Sun in elliptical (oval-shaped) paths, with the Sun at one focus of the ellipse. This discovery was first made by Johannes Kepler in the early 17th century.
    
    Kepler's laws of planetary motion:
    1. The orbit of each planet is an ellipse with the Sun at one focus
    2. A line joining a planet and the Sun sweeps out equal areas during equal intervals of time
    3. The square of the orbital period of a planet is proportional to the cube of the semi-major axis of its orbit
    
    The closer a planet is to the Sun, the faster it moves in its orbit. Mercury, the closest planet to the Sun, travels at an average speed of 47.4 km/s (29.4 mi/s), while Neptune, the furthest planet, moves at just 5.4 km/s (3.4 mi/s).`
  },
  {
    id: 'moons',
    title: 'Moons and Satellites',
    content: `Moons are natural satellites that orbit planets. Our solar system has over 200 known moons, with the gas giants having the most. Jupiter has at least 95 moons, while Saturn has 146, Uranus has 27, and Neptune has 14.
    
    Earth has one moon, simply called "the Moon." Mars has two small moons named Phobos and Deimos. Mercury and Venus have no moons.
    
    Some notable moons include:
    - Earth's Moon: The fifth largest moon in the solar system
    - Ganymede (Jupiter): The largest moon in the solar system, larger than Mercury
    - Titan (Saturn): The only moon with a substantial atmosphere
    - Europa (Jupiter): Believed to have a subsurface ocean of liquid water
    - Enceladus (Saturn): Has geysers that shoot water into space`
  },
  {
    id: 'constellations',
    title: 'Constellations',
    content: `Constellations are groups of stars that form recognizable patterns in the night sky. Ancient civilizations connected these stars to create imaginary pictures, often representing mythological figures, animals, or objects.
    
    There are 88 officially recognized constellations covering the entire celestial sphere. Some of the most well-known constellations include:
    
    - Ursa Major (Great Bear): Contains the Big Dipper asterism
    - Orion (The Hunter): Notable for Orion's Belt, three bright stars in a row
    - Cassiopeia: Easily recognizable by its W or M shape
    - Cygnus (The Swan): Also known as the Northern Cross
    - Lyra (The Lyre): Contains Vega, one of the brightest stars in the night sky
    
    Constellations were historically used for navigation and tracking the seasons, and today they help astronomers map the night sky.`
  },
  {
    id: 'celestial-events',
    title: 'Celestial Events',
    content: `Our solar system is dynamic, with many recurring astronomical events:
    
    - Solstices and Equinoxes: Mark the changing of seasons as Earth orbits the Sun
    - Eclipses: Solar eclipses occur when the Moon blocks the Sun; lunar eclipses happen when Earth's shadow falls on the Moon
    - Meteor Showers: Occur when Earth passes through debris left by comets
    - Planetary Conjunctions: When two or more planets appear very close to each other in the sky
    - Transits: When a planet passes directly between Earth and the Sun (like Venus and Mercury)
    
    The equinox occurs twice a year (around March 20 and September 23) when day and night are of approximately equal length. The solstice also happens twice yearly (around June 21 and December 21), marking the longest and shortest days of the year.`
  }
];

// Quiz questions for educational quiz mode
export const quizQuestions = [
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mercury", "Mars"],
    correctAnswer: "Mercury"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Jupiter", "Saturn", "Neptune"],
    correctAnswer: "Jupiter"
  },
  {
    question: "How many known moons does Jupiter have?",
    options: ["67", "79", "82", "95"],
    correctAnswer: "95"
  },
  {
    question: "Which planet is known for its beautiful rings?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: "Saturn"
  },
  {
    question: "The Sun is a:",
    options: ["Planet", "Star", "Asteroid", "Meteor"],
    correctAnswer: "Star"
  },
  {
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Mercury", "Venus", "Mars", "Jupiter"],
    correctAnswer: "Mars"
  },
  {
    question: "How many planets in our solar system have rings?",
    options: ["1", "2", "4", "6"],
    correctAnswer: "4"
  },
  {
    question: "Earth's orbit around the Sun takes approximately:",
    options: ["30 days", "365 days", "24 hours", "12 months"],
    correctAnswer: "365 days"
  },
  {
    question: "Which of these is NOT a terrestrial planet?",
    options: ["Mercury", "Venus", "Neptune", "Mars"],
    correctAnswer: "Neptune"
  },
  {
    question: "What is the hottest planet in our solar system?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctAnswer: "Venus"
  },
  {
    question: "Which constellation contains the Big Dipper?",
    options: ["Orion", "Ursa Major", "Cassiopeia", "Cygnus"],
    correctAnswer: "Ursa Major"
  },
  {
    question: "What causes the seasons on Earth?",
    options: ["Distance from the Sun", "Earth's axial tilt", "The Moon's gravity", "Solar flares"],
    correctAnswer: "Earth's axial tilt"
  },
  {
    question: "Which planet rotates on its side?",
    options: ["Earth", "Mars", "Uranus", "Venus"],
    correctAnswer: "Uranus"
  },
  {
    question: "What is the largest moon in our solar system?",
    options: ["Europa", "Titan", "Ganymede", "Earth's Moon"],
    correctAnswer: "Ganymede"
  },
  {
    question: "How many stars are in our solar system?",
    options: ["1", "8", "9", "Thousands"],
    correctAnswer: "1"
  }
];

// Time events for the time controls feature
export const celestialEvents = [
  {
    name: "Spring Equinox",
    date: new Date(new Date().getFullYear(), 2, 20), // March 20
    description: "Day and night are of approximately equal length. The Sun crosses the celestial equator going northward."
  },
  {
    name: "Summer Solstice",
    date: new Date(new Date().getFullYear(), 5, 21), // June 21
    description: "The longest day of the year in the Northern Hemisphere. The Sun reaches its highest position in the sky."
  },
  {
    name: "Autumn Equinox",
    date: new Date(new Date().getFullYear(), 8, 23), // September 23
    description: "Day and night are of approximately equal length. The Sun crosses the celestial equator going southward."
  },
  {
    name: "Winter Solstice",
    date: new Date(new Date().getFullYear(), 11, 21), // December 21
    description: "The shortest day of the year in the Northern Hemisphere. The Sun reaches its lowest position in the sky."
  }
];

// Function to get the next celestial event
export function getNextCelestialEvent(type) {
  const today = new Date();
  
  // Filter events by type if specified
  let events = celestialEvents;
  if (type === 'equinox') {
    events = celestialEvents.filter(e => e.name.includes('Equinox'));
  } else if (type === 'solstice') {
    events = celestialEvents.filter(e => e.name.includes('Solstice'));
  }
  
  // Find the next event
  const futureEvents = events.filter(event => event.date > today);
  
  if (futureEvents.length > 0) {
    return futureEvents[0]; // Return the nearest future event
  } else {
    // If no future events this year, get the first event of next year
    const nextYearEvent = {...events[0]};
    nextYearEvent.date = new Date(today.getFullYear() + 1, 
                                  nextYearEvent.date.getMonth(), 
                                  nextYearEvent.date.getDate());
    return nextYearEvent;
  }
} 