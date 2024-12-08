import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const scenarioName = import.meta.env.VITE_HTTP_MOCK_REQUEST_SCENARIO;
const runtimeHandlers = handlers[scenarioName] || [];

export const worker = setupWorker(...runtimeHandlers);