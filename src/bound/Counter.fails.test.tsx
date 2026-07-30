import { expect, describe, it } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("Counter (singleton)", () => {
  it("should render the counter", () => {
    render(<Counter />);
    expect(screen.getByRole("status")).toHaveTextContent("0");
  });
  it("should increment the counter", async () => {
    render(<Counter />);
    const user = userEvent.setup();
    const count = screen.getByRole("status");
    const incrementButton = screen.getByRole("button", { name: "Increment" });
    await user.click(incrementButton);
    expect(count).toHaveTextContent("1");
  });
  // fails when previous test has been run, we're using the same store and the state is not reset between tests
  it("should fail to decrement the counter", async () => {
    render(<Counter />);
    const user = userEvent.setup();
    const count = screen.getByRole("status");
    const decrementButton = screen.getByRole("button", { name: "Decrement" });
    await user.click(decrementButton);
    expect(count).toHaveTextContent("-1");
  });
});
