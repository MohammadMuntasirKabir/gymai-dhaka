import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";

describe("Button", () => {
  it("should render children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should apply primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button.className).toContain("bg-[var(--color-accent)]");
  });

  it("should apply secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText("Secondary");
    expect(button.className).toContain("bg-[var(--color-card)]");
  });

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText("Ghost");
    expect(button.className).toContain("text-[var(--color-muted)]");
  });

  it("should apply size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small").className).toContain("px-3");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText("Medium").className).toContain("px-5");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large").className).toContain("px-8");
  });

  it("should be disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("should forward additional props", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText("Submit")).toHaveAttribute("type", "submit");
  });

  it("should merge custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByText("Custom").className).toContain("custom-class");
  });
});

describe("Card", () => {
  it("should render children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("should apply default variant", () => {
    render(<Card>Default</Card>);
    expect(screen.getByText("Default").className).toContain(
      "bg-[var(--color-card)]",
    );
  });

  it("should apply bordered variant", () => {
    render(<Card variant="bordered">Bordered</Card>);
    const card = screen.getByText("Bordered");
    expect(card.className).toContain("border");
  });

  it("should merge custom className", () => {
    render(<Card className="custom">Custom</Card>);
    expect(screen.getByText("Custom").className).toContain("custom");
  });
});

describe("Select", () => {
  const options = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("should render a select element with options", () => {
    render(<Select id="test-select" options={options} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("should render a label when provided", () => {
    render(<Select id="test-select" label="Choose" options={options} />);
    expect(screen.getByLabelText("Choose")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(
      <Select id="test-select" options={options} error="Required field" />,
    );
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("should call onChange handler", async () => {
    const { userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select id="test-select" options={options} onChange={onChange} />,
    );
    await user.selectOptions(screen.getByRole("combobox"), "b");
    expect(onChange).toHaveBeenCalled();
  });
});

describe("Textarea", () => {
  it("should render a textarea element", () => {
    render(<Textarea id="test-textarea" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render a label when provided", () => {
    render(<Textarea id="test-textarea" label="Description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(
      <Textarea id="test-textarea" error="This field is required" />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should set rows attribute", () => {
    render(<Textarea id="test-textarea" rows={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });
});
