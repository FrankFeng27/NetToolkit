import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer/reducer";

export const store = configureStore({reducer}); // configureStore({reducer})
export type AppDispatch = typeof store.dispatch;