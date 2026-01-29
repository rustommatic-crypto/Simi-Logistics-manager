
# AreaLine Neural Interface: Live Deployment Manual

This guide outlines the "Last Mile" steps required to transition the AreaLine app from the current simulation environment to a Production-Grade live platform.

---

## 1. Google Gemini API (Simi's Brain)
Simi is powered by Google Gemini (Flash 3 & 2.5).

### Billing & Tiers:
- **Free Tier**: 15 requests/min (Good for testing, but Simi will "lag" in a live environment).
- **Pay-as-you-go (Recommended)**: 
  - $0.075 per 1M input tokens.
  - $0.30 per 1M output tokens.
  - **Budgeting**: $10/month is sufficient for a fleet of ~50 pilots.
- **Setup**:
  1. Go to [Google AI Studio](https://aistudio.google.com/).
  2. Create a Project and enable **Billing** via Google Cloud Console.
  3. Replace the `process.env.API_KEY` with your Production Key.

---

## 2. Meta WhatsApp Cloud API (The Bridge)
This is how Simi intercepts orders from WhatsApp messages.

### Setup Process:
1. **Meta App**: Create a "Business" app at [developers.facebook.com](https://developers.facebook.com/).
2. **Phone Number**: Add a dedicated number (cannot be used on the standard WhatsApp App).
3. **Webhook Verification**: 
   - Your backend MUST handle the `GET` request from Meta for the Verification Token.
   - Use a unique string (e.g., `AreaLine_Neural_2025`) as your verify token.
4. **Permanent Token**: Generate a permanent token in Meta Business Settings (System User) to avoid session expiry issues.

### Pricing (Meta's Fees):
Meta charges per 24-hour conversation:
- **Service**: ~First 1,000 per month are **FREE** (Customer support/queries).
- **Utility**: ~$0.005 per conversation (Order confirmations).
- **Simi Intercepts**: Since Simi "listens" to groups, ensure you only reply when necessary to avoid unnecessary conversation fees.

---

## 3. Deployment Infrastructure
For a low-latency neural experience:
- **Hosting**: Vercel or Netlify (Best for React/Tailwind).
- **Backend Service**: Supabase or Firebase (To store Pilot manifests and earnings).
- **SSL Certificate**: **MANDATORY**. Mobile browsers (Chrome/Safari) will block the microphone and audio context if the site is not served over HTTPS.

---

## 4. Technical "Knots" to Tie
- **WebSocket Gateway**: Build a small Node.js server that listens to Meta's Webhook, runs the text through Gemini for intent extraction, and pushes the result to the Pilot's Grid via WebSockets (e.g., `Socket.io`).
- **Simi Voice Persistence**: Ensure the `VOICE_PHONETIC_HEADER` is included in all production prompts in `geminiService.ts` to maintain the Nigerian accent.
- **Mobile UI Fixes**: All headers now use `display-font` and responsive sizing to prevent text overflow on small devices.

---

## 5. Estimated Monthly Running Costs (Start-up)
| Service | Estimated Cost (50 Pilots) |
| :--- | :--- |
| **Google Gemini API** | ~$10.00 |
| **Meta WhatsApp API** | ~$15.00 (After free tier) |
| **Hosting (Vercel Pro)** | $20.00 |
| **Total** | **~$45.00 / month** |
