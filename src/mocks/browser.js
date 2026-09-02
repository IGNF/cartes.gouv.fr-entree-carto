import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const scenarioName = import.meta.env.VITE_HTTP_MOCK_REQUEST_SCENARIO;
const handlersByScenario = new Map(Object.entries(handlers));
const runtimeHandlers = scenarioName ? (handlersByScenario.get(scenarioName) || []) : [];

export const worker = setupWorker(...runtimeHandlers);