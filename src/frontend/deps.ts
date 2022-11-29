export {
  createContext,
  createElement,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "https://esm.sh/react@18.2.0";

export type {
  ChangeEvent,
  FunctionComponent,
  ReactNode,
} from "https://esm.sh/react@18.2.0";

import { createElement, Fragment } from "https://esm.sh/react@18.2.0";

export { render as renderReactDOM } from "https://esm.sh/react-dom@18.2.0";

(globalThis as any).React = {
  createElement,
  Fragment,
};
