import type { App } from 'vue';

export interface PluginMatomoOptions {
  [key: string]: unknown;
}

export class PluginMatomo {
  options: PluginMatomoOptions;
  constructor(options: PluginMatomoOptions);
  install(app: App): void;
}

export function createMatomo(options: PluginMatomoOptions): PluginMatomo;
export function useMatomo(): PluginMatomo | undefined;