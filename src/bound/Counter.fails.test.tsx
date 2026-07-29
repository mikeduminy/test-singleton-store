import { expect, describe, it } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { Counter } from "./Counter";

describe("Counter (singleton)", () => {
  it("should render the counter", async () => {
    await page.render(<Counter />);
    await expect.element(page.getByRole("status")).toHaveTextContent("0");
  });
  it("should increment the counter", async () => {
    await page.render(<Counter />);
    const count = page.getByRole("status");
    const incrementButton = page.getByRole("button", { name: "Increment" });
    await incrementButton.click();
    await expect.element(count).toHaveTextContent("1");
  });
  // fails when previous test has been run, we're using the same store and the state is not reset between tests
  it("should decrement the counter", async () => {
    await page.render(<Counter />);
    const count = page.getByRole("status");
    const decrementButton = page.getByRole("button", { name: "Decrement" });
    await decrementButton.click();
    await expect.element(count).toHaveTextContent("-1");
  });
});
