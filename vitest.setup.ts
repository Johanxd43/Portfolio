import { vi } from 'vitest';

class MockWorker {
  postMessage = vi.fn();
  terminate = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

vi.stubGlobal('Worker', MockWorker);

vi.stubGlobal('navigator', {
  onLine: true,
  serviceWorker: {
    register: vi.fn(),
    ready: Promise.resolve(),
    getRegistration: vi.fn(),
    controller: null,
  },
});

vi.stubGlobal('indexedDB', {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
});
