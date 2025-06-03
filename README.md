# Interactive 3D Solar System

This project is an interactive 3D solar system visualization tool built with Three.js and Vite.

## Features

- 3D visualization of the solar system.
- Animated planetary orbits with adjustable speed.
- Camera controls for navigation (zoom, pan, rotate).
- Custom texture uploads for celestial bodies.
- Educational information panels for each planet.
- Responsive design for desktop and tablet.
- Performance optimizations.
- User preference saving via local storage.
- Time controls to view specific astronomical events.
- Toggleable constellation overlays.
- Educational quiz mode.

## Setup and Running Locally

1.  **Clone the repository (or ensure you are in the `Solar_system` directory if it's part of a larger project).**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or the next available port).

## Building for Production

To create a production build in the `dist` folder:

```bash
npm run build
```

## Deployment

This project is configured for deployment to GitHub Pages.

1.  Ensure `vite.config.js` has the correct `base` path (e.g., `'/your-repo-name/'`).
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```
    This will build the project and push the contents of the `dist` folder to the `gh-pages` branch.
3.  Configure GitHub Pages in your repository settings to serve from the `gh-pages` branch.

## Project Structure

-   `index.html`: Main HTML entry point.
-   `src/`: Contains the JavaScript and CSS source code.
    -   `main.js`: Main application logic, Three.js setup, event handling.
    -   `solarSystem.js`: Defines and creates the celestial bodies and their properties.
    -   `starField.js`: Creates the star background.
    -   `planetLabels.js`: Manages the display of planet labels.
    -   `constellations.js`: Manages constellation data and rendering.
    -   `educationalContent.js`: Contains data for educational overlays and the quiz.
    -   `style.css`: Main stylesheet.
-   `public/`: Static assets (e.g., textures).
    -   `textures/custom/`: Custom textures for planets, sun, moon, etc.
-   `vite.config.js`: Vite build configuration.
-   `package.json`: Project metadata and dependencies. 