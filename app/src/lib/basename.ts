/**
 * Works out the app's actual mount path from the current URL instead of
 * assuming it's always "/app" — GitHub Pages project sites serve this app
 * from "/<repo>/app/", and the repo segment shouldn't be hard-coded anywhere.
 */
export function detectBasename(): string {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const appIndex = segments.indexOf("app");
  if (appIndex === -1) return "/app";
  return "/" + segments.slice(0, appIndex + 1).join("/");
}

/**
 * The marketing site's root, one level up from the app mount ("/app" on a
 * user/org site, "/<repo>/app/" on a project site) — used for links that
 * navigate out of the SPA back to the static landing page.
 */
export function detectSiteRoot(): string {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const appIndex = segments.indexOf("app");
  const rootSegments = segments.slice(0, appIndex === -1 ? 0 : appIndex);
  return rootSegments.length ? "/" + rootSegments.join("/") + "/" : "/";
}
