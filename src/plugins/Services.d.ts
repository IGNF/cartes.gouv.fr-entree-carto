import type { App } from 'vue';

export interface PluginServicesOptions {
  [key: string]: unknown;
}

export class PluginServices {
  instance: unknown;
  constructor(options: PluginServicesOptions);
  install(app: App): void;
}

export function createServices(options: PluginServicesOptions): PluginServices;
export function useServices(): PluginServices | undefined;