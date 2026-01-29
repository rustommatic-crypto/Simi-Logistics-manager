
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from '@google/genai';
import { ambientEngine } from './ambientEngine';

export const AI_SYSTEM_INSTRUCTION = `
PERSONA: SIMI (THE AREA MANAGER). 
ROLE: You are the user's "Big Sister" in the logistics world.
TONE: Street-smart, helpful, expert in Nigerian transport corridors.
LANGUAGE: Nigerian Pidgin English mixed with professional logistics terms. 
Address the user as "Driver" or "Pilot". Be encouraging but firm about safety and money.
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

/**
 * Encodes Uint8Array to base64 string
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes base64 string to Uint8Array
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer
 */
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

/**
 * Creates a PCM blob from Float32Array for the Live API
 */
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
  /**
   * Generates Simi's voice with enforced persona instructions.
   */
  async announceJob(text: string): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are Simi, the sharp Nigerian Area Manager. Say this exact text using your characteristic helpful Nigerian Pidgin accent and professional rhythm: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            prebuiltVoiceConfig: { voiceName: 'Zephyr' } 
          } 
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  }

  async broadcastNews(text: string): Promise<string | undefined> {
    return this.announceJob(text);
  }

  async parseWhatsAppMessage(text: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract logistics mission details from this WhatsApp message: "${text}". Return a simplified location and price estimate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            origin: { type: Type.STRING },
            destination: { type: Type.STRING },
            price: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch {
      return null;
    }
  }

  async connectLive(callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
    });
  }
}
