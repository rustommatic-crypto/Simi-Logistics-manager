// Augment the NodeJS namespace to add API_KEY to process.env.
// This prevents the "Cannot redeclare block-scoped variable 'process'" error 
// that typically occurs when Node.js type definitions are already present in the project.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
