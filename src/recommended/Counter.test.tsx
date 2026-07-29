import { expect, describe, it } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("should render the counter", async () => {
    await page.renderWithProvider(<Counter />);
    await expect.element(page.getByRole("status")).toHaveTextContent("0");
  });
  it("should increment the counter", async () => {
    await page.renderWithProvider(<Counter />);
    const count = page.getByRole("status");
    const incrementButton = page.getByRole("button", { name: "Increment" });
    await incrementButton.click();
    await expect.element(count).toHaveTextContent("1");
  });
  it("should decrement the counter", async () => {
    await page.renderWithProvider(<Counter />);
    const count = page.getByRole("status");
    const decrementButton = page.getByRole("button", { name: "Decrement" });
    await decrementButton.click();
    await expect.element(count).toHaveTextContent("-1");
  });
});
