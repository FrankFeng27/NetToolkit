
import { configureStore } from "@reduxjs/toolkit";
import * as React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import { Application as App } from "./App"
// import reducer from "./reducer";

const store = configureStore({reducer: {}}); // configureStore({reducer})

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
      <App/>
  </Provider>, rootElement
);


