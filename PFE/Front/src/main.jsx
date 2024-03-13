import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/es/integration/react";
import persistStore from "redux-persist/es/persistStore";

const persistedStore = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>loading....</div>} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
