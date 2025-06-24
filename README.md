# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

🚀 Features
🌍 Flight Search: Search flights by origin, destination, and date.

🔁 Trip Types: One-way or round-trip options.

🔃 Sorting: Sort by price, duration, or number of stops.

📑 Pagination: Results displayed in pages of 5.

🔽 Expandable Rows: Click a row to view extra flight details.

💅 Material UI Styling: Clean, responsive interface.

📦 Context API: Manages global flight data across components.

### 🛠️ Tech Stack

React + Hooks

Material UI (MUI)

Context API for state management

Moment.js for date/time formatting

SkyScanner API (via RapidAPI or custom backend)

Vite (or CRA, depending on your setup)

### Folder structure

src/
├── api/
│ └── api.js
├── components/
│ ├── SearchForm.jsx
│ └── SearchResults.jsx
├── context/
│ └── FlightContext.js
├── utils/
│ └── getFlightDuration.js
└── App.jsx

### 🔧 Installation

git clone https://github.com/Flo-Adikwu/flight-search.git
cd flight-search-app
npm install
npm run dev
