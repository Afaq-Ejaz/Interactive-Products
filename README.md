# CM Punjab E-Scooty — 3D Interactive Showcase

Welcome to the 3D Interactive Digital Twin for the Government of Punjab's CM Green Initiative!

## 🚀 Live Demo

**[Click here to view the 3D Scooty Showcase live!](https://Afaq-Ejaz.github.io/Interactive-Products/Scooty/)**
*(Make sure GitHub Pages is enabled in your repository settings).*

## About the Project
This project is a high-performance, web-based 3D digital twin of the electric scooty (2026 Model) designed for the CM Punjab Green Initiative. It allows users to interactively explore the scooter's specifications, toggle features like the LED headlamp, and run the 1000W BLDC motor.

### Features
*   **Interactive 3D Model:** Rotate, zoom, and pan around the scooter.
*   **Live Telemetry:** Digital display of the current speed.
*   **Component Inspection:** Click on spec cards to automatically focus the camera on specific parts (Battery Pack, Rear Drive, Suspension, Cockpit).
*   **Customization:** Switch between Midnight Black and Pastel Pink color schemes.
*   **Functional Lighting:** Toggle the LED headlamp and taillight.

## How to Run Locally

Because this project uses modern ES Modules (`type="module"`), you cannot simply double-click the `index.html` file. You need to serve it using a local web server.

1.  Clone this repository.
2.  Navigate to the `Scooty` directory.
3.  Start a local server. For example, if you have Python installed:
    ```bash
    python -m http.server 8000
    ```
    Or using Node.js:
    ```bash
    npx serve
    ```
4.  Open `http://localhost:8000` in your web browser.

## Built With
*   Vanilla HTML, CSS, JavaScript
*   [Three.js](https://threejs.org/) (for 3D rendering and OrbitControls)

---
*Developed for the CM Punjab Green Initiative • Phase 2*
