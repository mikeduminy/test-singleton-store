import { expect, describe, it } from "vite-plus/test";
import { makeResettableStore, increment, selectCount } from "./store";

describe("makeResettableStore", () => {
  it("resets state back to initial", () => {
    const store = makeResettableStore();
    store.dispatch(increment());
    expect(selectCount(store.getState())).toBe(1);

    store.resetState();
    expect(selectCount(store.getState())).toBe(0);
  });

  it("makes a dispatch captured before reset a no-op on the current state", () => {
    const store = makeResettableStore();

    // simulates a component/thunk that captured `dispatch` before an `await`
    const staleDispatch = store.dispatch;

    store.resetState();
    staleDispatch(increment()); // lands in the orphaned, discarded inner store

    expect(selectCount(store.getState())).toBe(0);

    // the current dispatch reference still works normally
    store.dispatch(increment());
    expect(selectCount(store.getState())).toBe(1);
  });

  it("a dispatch that resolves after a real await, post-reset, doesn't corrupt the current state", async () => {
    const store = makeResettableStore();
    const staleDispatch = store.dispatch; // captured e.g. by a component before an await

    // this async work is still in flight when the test boundary (resetState) hits
    const pendingWork = (async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      staleDispatch(increment());
    })();

    store.resetState();
    await pendingWork; // let the stale dispatch actually fire, after reset

    expect(selectCount(store.getState())).toBe(0);
  });

  it("a thunk's own dispatch argument stays bound to the store it started in", async () => {
    const store = makeResettableStore();

    const thunkFinished = new Promise<void>((resolve) => {
      store.dispatch((dispatch: typeof store.dispatch) => {
        setTimeout(() => {
          dispatch(increment());
          resolve();
        }, 10);
      });
    });

    store.resetState();
    await thunkFinished; // let the stale dispatch actually fire, after reset

    expect(selectCount(store.getState())).toBe(0);
  });
});
