import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from '@google/genai';
import { ambientEngine } from './ambientEngine';

export const AI_SYSTEM_INSTRUCTION = `
PERSONA: SIMI (THE AREA MANAGER). 
ROLE: You are the user's "Big Sister" in the logistics world.
TONE: Street-smart, helpful, expert in Nigerian transport corridors.
LANGUAGE: Nigerian Pidgin English mixed with professional logistics terms. 
Address the user as "Driver" or "Pilot". Be encouraging but firm about safety and money.
Specialty: You are the interface for AreaGPT, the neural grid that finds high-yield loads.
`;

let fallbackOutputCtx: AudioContext | null = null;
export const getOutputContext = () => {
  if (ambientEngine.ctx) return ambientEngine.ctx;
  if (!fallbackOutputCtx) {
    fallbackOutputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return fallbackOutputCtx;
};

let fallbackInputCtx: AudioContext | null = null;
export const getInputContext = () => {
  if (!fallbackInputCtx) {
    fallbackInputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  }
  return fallbackInputCtx;
};

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export class SimiAIService {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  async announceJob(text: string): Promise<string | undefined> {
    const prompt = `You are Simi, the sharp Nigerian Area Manager. Say this exact text using your characteristic helpful Nigerian Pidgin accent and professional rhythm: "${text}"`;
    
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            prebuiltVoiceConfig: { voiceName: 'Zephyr' } 
          } 
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }

  async broadcastNews(text: string): Promise<void> {
    await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Simi, broadcast this neural grid update: ${text}` }] }],
    });
  }

  async parseWhatsAppMessage(text: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Extract pickup, destination, and price from this logistics message: ${text}` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pickup: { type: Type.STRING },
            destination: { type: Type.STRING },
            price: { type: Type.NUMBER }
          }
        }
      }
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return null;
    }
  }

  async scoutAreaGPTLeads() {
    const prompt = `Act as Simi the Area Manager. Generate 3 realistic high-yield logistics leads for a driver in Nigeria. 
    IMPORTANT: Randomly assign realistic vehicle types to each lead: 'Bike', 'Van', 'Truck', or 'Car'. 
    Format as JSON array with properties: id, title, pickup, destination, price (number), type (Bike, Van, Truck, or Car).
    Make them sound like real urgent opportunities. Example: 'Urgent Spare Parts for Abuja'.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              pickup: { type: Type.STRING },
              destination: { type: Type.STRING },
              price: { type: Type.NUMBER },
              type: { type: Type.STRING, description: "Must be one of: Bike, Van, Truck, Car" }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      return [];
    }
  }

  connectLive(callbacks: {
    onopen: () => void;
    onmessage: (m: LiveServerMessage) => void;
    onerror: (e: any) => void;
    onclose: () => void;
  }) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        generationConfig: {
          temperature: 0.7,
        }
      }
    });
  }
}