import { makeStore } from "../shared/store";
import { createBoundHooks } from "./bind";

export const store = makeStore();

export const { useStore, useDispatch, useSelector } = createBoundHooks(store);
