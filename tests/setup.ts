import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
// @ts-expect-error - partial mock of IntersectionObserver
class MockIntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {}
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock import.meta.env
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_API_URL: "",
      VITE_NEON_AUTH_URL: "http://localhost:3001/auth",
      DEV: true,
    },
  },
});
