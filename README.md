# User Interview Survey App

This is a React-based adaptive survey application designed to collect user interview data efficiently.
The survey questions adapt based on user responses to minimize the number of questions asked.

## Features
- **Adaptive Survey Logic**: Skips irrelevant sections based on previous answers (e.g., if "No" to Mutual Funds, MF details are skipped).
- **Clean UI**: Simple, card-based interface with progress tracking.
- **Data Collection**: Logs responses to the console upon submission (can be connected to a backend).

## Tech Stack
- React
- Vite
- CSS (Custom responsive design)

## How to Run
1.  Navigate to the project directory:
    ```bash
    cd /Users/ankurgarg/Survey
    ```
2.  Install dependencies (if not already installed):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the link shown in the terminal (usually http://localhost:5173).

## Project Structure
- `src/App.jsx`: Main application logic and survey structure.
- `src/index.css`: Styles for the application.
- `src/main.jsx`: Entry point.
