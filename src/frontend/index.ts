import { createElement, renderReactDOM } from "./deps.ts";
import App from "./components/App.tsx";

renderReactDOM(
  createElement(App()),
  document.querySelector("#main"),
);
