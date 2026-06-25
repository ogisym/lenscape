/* Server entry — koristi se SAMO tokom build-a (prerender).
   Za svaku rutu vraća gotov HTML i sadržaj <head>-a. */
import { renderToString } from "react-dom/server";
import App, { renderHead, ROUTES } from "./App.jsx";

export { ROUTES };

export function render(path) {
  const html = renderToString(<App path={path} />);
  const head = renderHead(path);
  return { html, head };
}
