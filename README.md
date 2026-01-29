# AreaLine Neural Interface | Live Deployment Package

This repository contains the complete, frozen state of the **AreaLine Driver App Upgrade**. It is designed for high-performance, neural-driven logistics management in the Nigerian transport corridor.

## 🚀 Live Hosting Instructions (GitHub to Vercel)

For a seamless, high-performance experience, we recommend hosting on **Vercel** integrated with your **GitHub** repository.

1.  **Create a GitHub Repository**: Push all these files to a new private repository.
2.  **Connect to Vercel**:
    *   Sign in to [Vercel](https://vercel.com/) with GitHub.
    *   Click "Add New" -> "Project".
    *   Import your AreaLine repository.
3.  **Environment Variables**:
    *   In the Vercel dashboard, go to **Settings** -> **Environment Variables**.
    *   Add `API_KEY`: [Your Google Gemini API Key].
4.  **Deploy**: Click Deploy. Vercel will provide a production-ready HTTPS URL.

---

## 💰 Operational Costs & Fees (Estimated Monthly)

| Service | Estimated Cost | Notes |
| :--- | :--- | :--- |
| **Google Gemini API** | ~$10 - $20 | Based on ~100 daily active pilots. First $300 is usually free for new Cloud accounts. |
| **WhatsApp Business API** | ~$15 | First 1,000 service conversations/month are FREE. |
| **Vercel Hosting** | $20 | Pro Tier (Optional for high volume; Free tier works for startups). |
| **Domain (.com.ng)** | ~$5/year | Use a local registrar for better regional SEO. |

---

## 🛠️ Developer Handover Details

### 1. Neural Stability (429 Handling)
The app features a **Global Mutex Lock** in `services/geminiService.ts`. This prevents the "Neural Node Busy" error by ensuring only one Text-to-Speech (TTS) request is processed every 5 seconds, which is the safety threshold for current Gemini API quotas.

### 2. UI/UX Mapping
*   **Roaming Mode (Red)**: Uses `#E60000`. High intensity for active scouting.
*   **On a Trip (Blue)**: Uses `#3b82f6`. Calm and focused for long-haul stability.
*   **Cash Hunt (Gold)**: Uses `#f59e0b`. High contrast for money-making focus.
*   **WhatsApp Jobs**: The green button in `Workspace.tsx` has been significantly reduced in size to avoid interfering with primary movement controls.

### 3. API Integration
*   **WhatsApp**: The app is ready to receive structured JSON from a WhatsApp Webhook (Meta Cloud API).
*   **Simi Voice**: Maintains a Nigerian rhythm using the `VOICE_PHONETIC_HEADER` injection.

---

## 🔐 Go-Live Checklist
- [ ] **HTTPS Enforced**: Microphones and Audio Context will NOT work on HTTP. Ensure Vercel's SSL is active.
- [ ] **API Quota**: Ensure your Google Cloud Project has **Billing Enabled** to avoid Simi going silent.
- [ ] **Meta Verification**: Verify your WhatsApp Business number to increase message limits beyond the test tier.

**System Status: READY FOR PILOT LAUNCH.**