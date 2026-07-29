import { expect, describe, it, beforeEach, vi } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { makeStore, type AppStore } from "../shared/store";

// we can't do doMock in beforeEach because vi.resetModules() isn't good enough - the browser does its own ESM caching
// thus, hoisted mutable object
const mockedHooksState = vi.hoisted(() => ({
  store: null as AppStore | null,
}));

vi.mock("./hooks", async (importActual): Promise<typeof import("./hooks")> => {
  const actual = await importActual<typeof import("./hooks")>();

  return {
    ...actual,
    get store() {
      return mockedHooksState.store!;
    },
    // can't do ...createBoundHooks(mockedHooksState.store) because it'll close over the store at the time of the mock, and we want to be able to reset it in beforeEach
    useStore: () => mockedHooksState.store!,
    useDispatch: () => mockedHooksState.store!.dispatch,
    useSelector: (selector, isEqual) =>
      useSyncExternalStoreWithSelector(
        // oxlint-disable-next-line typescript/unbound-method
        mockedHooksState.store!.subscribe,
        // oxlint-disable-next-line typescript/unbound-method
        mockedHooksState.store!.getState,
        // oxlint-disable-next-line typescript/unbound-method
        mockedHooksState.store!.getState,
        selector,
        isEqual,
      ),
  };
});

import { Counter } from "./Counter";

describe("Counter (with mocking)", () => {
  beforeEach(() => {
    mockedHooksState.store = makeStore();
  });
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
  it("should decrement the counter", async () => {
    await page.render(<Counter />);
    const count = page.getByRole("status");
    const decrementButton = page.getByRole("button", { name: "Decrement" });
    await decrementButton.click();
    await expect.element(count).toHaveTextContent("-1");
  });
});
