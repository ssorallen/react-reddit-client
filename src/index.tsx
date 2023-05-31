import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";

const root = document.getElementById("root");
if (root == null) throw new Error("Missing #root element in the DOM");

ReactDOM.createRoot(root).render(<App />);
