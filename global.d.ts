declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}

interface Window {
  webkitAudioContext: typeof AudioContext;
}