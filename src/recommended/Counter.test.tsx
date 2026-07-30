import { expect, describe, it } from "vite-plus/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "../../test/setup";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("should render the counter", () => {
    renderWithProvider(<Counter />);
    expect(screen.getByRole("status")).toHaveTextContent("0");
  });
  it("should increment the counter", async () => {
    renderWithProvider(<Counter />);
    const user = userEvent.setup();
    const count = screen.getByRole("status");
    const incrementButton = screen.getByRole("button", { name: "Increment" });
    await user.click(incrementButton);
    expect(count).toHaveTextContent("1");
  });
  it("should decrement the counter", async () => {
    renderWithProvider(<Counter />);
    const user = userEvent.setup();
    const count = screen.getByRole("status");
    const decrementButton = screen.getByRole("button", { name: "Decrement" });
    await user.click(decrementButton);
    expect(count).toHaveTextContent("-1");
  });
});
