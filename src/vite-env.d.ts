
/// <reference types="vite/client" />

declare global {
  interface Window {
    UnicornStudio?: {
      init(): Promise<any>;
      destroy(): void;
    };
  }
}
