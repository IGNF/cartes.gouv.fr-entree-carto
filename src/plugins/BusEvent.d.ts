import type { App } from 'vue';

export type BusEventCallback = (data?: unknown) => void;

export interface BusEventOptions {
  [key: string]: unknown;
}

export class BusEvent {
  constructor(options?: BusEventOptions);

  emitter: unknown;

  addEventListener(eventName: string, callback: BusEventCallback): void;
  removeEventListener(eventName: string, callback: BusEventCallback): void;
  dispatchEvent(eventName: string, data?: unknown): void;
  install(app: App): void;
}

export function createBusEvent(options?: BusEventOptions): BusEvent;
export function useBusEvent(): BusEvent | undefined;