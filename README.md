# Property Management App

A static, frontend-only page for pitching the Property Management App idea and letting
interested people take action on it — no backend, hosted free on GitHub Pages. Every
action (register interest, suggest a feature, give feedback) opens a pre-filled GitHub
Issue on this repo, so all discussion happens in public, standard GitHub Issues.

## Before deploying

1. Edit `assets/js/app.js` and set:
   ```js
   const GITHUB_OWNER = "your-github-username";
   const GITHUB_REPO = "your-repo-name";
   ```
2. Edit `index.html` — replace the placeholder pitch under **The idea** with your actual
   plan for the app (target users, core workflows, what problem it solves).
3. Make sure the repo's **Issues** tab is enabled (Settings → Features → Issues).

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repo.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Pick the `main` branch and `/ (root)` folder, then **Save**.
5. Your site will be live at `https://<username>.github.io/<repo>/` within a minute or two.

## How submissions work

Forms don't POST anywhere — there's no backend. On submit, the page builds a GitHub
"new issue" URL with the title/body/labels filled in from the form and opens it in a new
tab. The visitor reviews it on GitHub and clicks **Submit new issue** themselves (this
requires a free GitHub account). The matching templates in `.github/ISSUE_TEMPLATE/` also
let people file the same structured issues directly from the repo's Issues tab.

## Structure

```
index.html                        Landing page + action forms + UI kit showcase
assets/css/styles.css             Design tokens and components
assets/js/app.js                  Form → GitHub Issue logic (edit OWNER/REPO here)
.github/ISSUE_TEMPLATE/*.yml      Native GitHub issue forms matching each action
```
