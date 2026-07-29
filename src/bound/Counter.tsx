import { CounterDisplay } from "../shared/CounterDisplay";
import { decrement, increment, selectCount } from "../shared/store";
import { useDispatch, useSelector } from "./hooks";

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <CounterDisplay
      count={count}
      onIncrement={() => dispatch(increment())}
      onDecrement={() => dispatch(decrement())}
    />
  );
}
