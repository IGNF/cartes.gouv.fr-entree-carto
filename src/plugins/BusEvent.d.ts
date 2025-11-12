import type { App } from 'vue';

export type BusEventCallback = (data?: any) => void;

export interface BusEventOptions {
  [key: string]: any;
}

export class BusEvent {
  constructor(options?: BusEventOptions);

  emitter: any;

  addEventListener(eventName: string, callback: BusEventCallback): void;
  removeEventLstener(eventName: string, callback: BusEventCallback): void;
  dispatchEvent(eventName: string, data?: any): void;
  install(app: App): void;
}

export function createBusEvent(options?: BusEventOptions): BusEvent;
export function useBusEvent(): BusEvent | undefined;