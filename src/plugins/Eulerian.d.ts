import type { App } from 'vue';

export interface EulerianOptions {
  verbose?: boolean;
  domain?: string;
  site?: {
    environment?: string;
    entity?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export class Eulerian {
  constructor(options: EulerianOptions);
  options: EulerianOptions;
  key: string;
  status: boolean;

  load(): Promise<void>;
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getKey(): string;
  setKey(key: string): void;
  hasKey(): boolean;
  install(app: App): void;
}

export function createEulerian(options: EulerianOptions): Eulerian;
export function useEulerian(): Eulerian | undefined;