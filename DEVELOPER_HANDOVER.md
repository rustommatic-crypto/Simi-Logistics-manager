
# AreaLine Neural Interface: Developer Handover

This document contains the final logic definitions and architecture notes for the AreaLine Driver App upgrade.

## 1. Key Terminology Changes
- **"On a Trip"**: Replaced "Waybill Trip" in the Movement selector (`components/Workspace.tsx`).
- **"Pilot"**: Throughout the app, drivers are referred to as Pilots to reflect their high-tier status in the AreaLine grid.

## 2. Vehicle Icon Mapping (`components/OrderClusters.tsx`)
A centralized function `getVehicleIcon` is exported and used globally. 
- `SALON` -> `Car` (Corrected ride-hailing icons)
- `BIKE` -> `Bike` (Dispatch services)
- `VAN/BUS` -> `BusFront`
- `TRUCK` -> `Truck`

## 3. Neural Architecture (Simi AI)
- **Model**: Uses `gemini-3-flash-preview` for real-time text parsing and `gemini-2.5-flash-preview-tts` for high-fidelity Nigerian-accented voice output.
- **System Instruction**: Hardcoded in `services/geminiService.ts` to ensure Simi maintains her "Big Sister" persona and uses street-smart Nigerian Pidgin.

## 4. Environment Requirements
- **API_KEY**: Must be provided in the environment as `process.env.API_KEY`.
- **Audio Context**: Browsers require a user gesture to start audio. The app uses a "Neural Handshake" (Sync Button) to initialize the `AmbientEngine` and `SimiAIService`.

## 5. Deployment Checklist
1. **GitHub Setup**: Initialize a standard Vite + React project.
2. **Icons**: Uses `lucide-react`.
3. **Styling**: Uses Tailwind CSS with a custom palette (AreaLine Red: `#E60000`).
4. **Permissions**: Ensure `camera`, `microphone`, and `geolocation` are requested in the manifest.
