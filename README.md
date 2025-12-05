# FoodFast Delivery Monorepo

FoodFast Delivery is a multi-surface application suite for a food ordering platform. This repository contains the customer-facing web app, dedicated admin and superadmin portals, a mock API powered by `json-server`, and an Expo-based mobile client.

## Repository structure
- `frontend/` – customer web experience (React + Vite).
- `admin/` – admin dashboard for order and menu management (React + Vite).
- `superadmin/` – superadmin console for higher-level controls (React + Vite).
- `backend/` – mock REST API backed by `json-server` reading from `dtb.json` on port 4000.
- `mobile/` – Expo/React Native client.

Each package manages its own dependencies; install and run commands should be executed inside the corresponding folder.

## Prerequisites
- **Node.js** 18+ and **npm** for the Vite apps and mock backend.
- **Expo CLI** (`npm install -g expo-cli`) or `npx expo` for the mobile app. An Android/iOS simulator or the Expo Go app is needed to view the mobile client.

## Setup and installation
Run the following in each project you plan to work on:

```bash
cd <project-folder>
npm install
```

## Running the applications
### Customer web app (`frontend`)
```bash
npm run dev      # start Vite dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint the codebase
```

### Admin portal (`admin`)
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Superadmin portal (`superadmin`)
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Mock API (`backend`)
```bash
npm run start    # serve dtb.json on http://localhost:4000
npm run dev      # equivalent local dev command
```

### Mobile app (`mobile`)
```bash
npm start        # launch Expo developer tools
npm run android  # build/run on Android emulator or device
npm run ios      # build/run on iOS simulator or device
npm run web      # run the web version via Expo
```

## Development tips
- Keep each app running from its own directory to avoid port conflicts.
- If you change mock data in `backend/dtb.json`, restart the json-server process.
- Refer to the individual app folders for more specific configuration or component code.
