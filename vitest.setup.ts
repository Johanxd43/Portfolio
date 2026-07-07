import '@testing-library/jest-dom';
import { vi } from 'vitest';

process.env.VITE_SUPABASE_URL = 'http://localhost';
process.env.VITE_SUPABASE_ANON_KEY = 'dummy-key';
process.env.VITE_OPENROUTER_API_KEY = 'dummy-openrouter-key';

// Mocks
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mocks de APIs del navegador
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de Worker
class MockWorker {
  url: string;
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;

  constructor(stringUrl: string) {
    this.url = stringUrl;
  }

  postMessage(msg: any) {
    // Simular procesamiento asíncrono
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data: { type: 'success', data: {} } }));
      }
    }, 0);
  }

  terminate() {}
}

window.Worker = MockWorker as any;

// Mock de IndexedDB
const mockIDBRequest = {
  onsuccess: null,
  onerror: null,
  result: {},
};

const mockIDBObjectStore = {
  put: vi.fn().mockReturnValue(mockIDBRequest),
  get: vi.fn().mockReturnValue(mockIDBRequest),
  delete: vi.fn().mockReturnValue(mockIDBRequest),
  clear: vi.fn().mockReturnValue(mockIDBRequest),
  createIndex: vi.fn(),
};

const mockIDBTransaction = {
  objectStore: vi.fn().mockReturnValue(mockIDBObjectStore),
  oncomplete: null,
  onerror: null,
};

const mockIDBDatabase = {
  transaction: vi.fn().mockReturnValue(mockIDBTransaction),
  createObjectStore: vi.fn().mockReturnValue(mockIDBObjectStore),
  close: vi.fn(),
};

const mockIndexedDB = {
  open: vi.fn().mockReturnValue({
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    result: mockIDBDatabase,
  }),
  deleteDatabase: vi.fn().mockReturnValue({
    onsuccess: null,
    onerror: null,
  }),
};

Object.defineProperty(window, 'indexedDB', {
  value: mockIndexedDB,
});

// Mock de navigator
Object.defineProperty(window, 'navigator', {
  value: {
    hardwareConcurrency: 4,
    deviceMemory: 8,
    userAgent: 'node',
  },
  configurable: true,
});

// Mock de Notification
Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  },
  configurable: true,
});
