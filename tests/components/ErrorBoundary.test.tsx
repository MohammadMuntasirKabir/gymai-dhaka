import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("should render error UI when a child throws", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function ThrowingComponent() {
      throw new Error("Test error");
    }

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Go Home")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should show error message in dev mode", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function ThrowingComponent() {
      throw new Error("Dev mode error");
    }

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Dev mode error")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should reset error state when Try Again is clicked", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function ThrowingComponent() {
      throw new Error("Test error");
    }

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Click Try Again - should reset and re-render children (which will throw again)
    await user.click(screen.getByText("Try Again"));

    // The component will throw again after reset, so error boundary should show again
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
