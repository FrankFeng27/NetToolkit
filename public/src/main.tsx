
import { configureStore } from "@reduxjs/toolkit";
import * as React from "react";
import { createRoot } from "react-dom/client";
import {Provider} from "react-redux";
import { Application as App } from "./App"
import { store } from "./store";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
      <App/>
  </Provider>
);


