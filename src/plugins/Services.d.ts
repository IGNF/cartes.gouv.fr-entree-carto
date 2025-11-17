import type { App } from 'vue';

export interface PluginServicesOptions {
  [key: string]: any;
}

export class PluginServices {
  instance: any;
  constructor(options: PluginServicesOptions);
  install(app: App): void;
}

export function createServices(options: PluginServicesOptions): PluginServices;
export function useServices(): PluginServices | undefined;