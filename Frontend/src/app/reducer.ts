import { createReducer, on } from "@ngrx/store";
import { decrement, increment, reset } from "./action";

const initialState = 0;
const counterReducer = createReducer(
    initialState,
    on(increment, state => state + 1),
    on(decrement, state => state - 1),
    on(reset, state => 0)
)
export function reducer(state: number | undefined, action: any) {
    return counterReducer(state, action)
}