import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";

// imported context to pass data througout the application
import { AuthProvider } from "./context/AuthContext";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
