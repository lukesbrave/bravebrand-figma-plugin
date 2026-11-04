// Prebuilt API v1 module. Figma itself, in Buzz's browser pane beside the
// conversation. A Figma button in the conversation header opens it, and any
// figma.com link opens there too, each file in its own tab. The website sign-in
// is kept in its own named storage between opens and restarts.
export const inject = ["react", "panels", "browser"];

const HOME = "https://www.figma.com/files/recents-and-sharing";
const isFigma = (target) => {
  try {
    const url = new URL(target);
    return url.protocol === "https:" && /(^|\.)figma\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
};

export function apply(ctx) {
  const h = ctx.react.createElement;
  const browser = ctx.browser;
  const mark = h("svg", { width: 12, height: 18, viewBox: "0 0 38 57", "aria-hidden": true },
    h("path", { fill: "#1abcfe", d: "M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" }),
    h("path", { fill: "#0acf83", d: "M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" }),
    h("path", { fill: "#ff7262", d: "M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" }),
    h("path", { fill: "#f24e1e", d: "M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" }),
    h("path", { fill: "#a259ff", d: "M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" }));
  ctx.panels.register({
    id: "canvas",
    title: "Figma",
    matches: (target) => browser.available && isFigma(target),
    keepOpen: true,
    channelPlacement: "tab",
    channelLauncher: function Launcher({ pressed, toggle, available }) {
      if (!browser.available || !available()) return null;
      return h("button", {
        type: "button",
        title: "Open Figma",
        "aria-label": "Open Figma",
        "aria-pressed": !!pressed,
        onClick: () => toggle(HOME),
        style: { display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, padding: 0, border: 0, borderRadius: 8, cursor: "pointer",
          background: pressed ? "rgba(127,127,127,.2)" : "transparent" },
      }, mark);
    },
    component: ({ target }) => h(browser.View, { url: target, storage: "figma" }),
  });
}
