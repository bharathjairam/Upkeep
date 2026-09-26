// Update these before deploying — see README.md
const GITHUB_OWNER = "YOUR_GITHUB_USERNAME";
const GITHUB_REPO = "YOUR_REPO_NAME";

const REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

document.getElementById("github-link").href = REPO_URL;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
}

function buildIssueTitle(action, data) {
  switch (action) {
    case "interest":
      return `Interest: ${data.name}`;
    case "feature":
      return `Feature: ${data.title}`;
    case "feedback":
      return `Feedback${data.name ? " from " + data.name : ""}`;
    default:
      return "New submission";
  }
}

function buildIssueBody(action, data) {
  switch (action) {
    case "interest":
      return [
        `**Name:** ${data.name}`,
        "",
        "**What excites them about this idea:**",
        data.reason,
      ].join("\n");
    case "feature":
      return [`**Proposed by:** ${data.title}`, "", data.description].join("\n");
    case "feedback":
      return [
        data.name ? `**From:** ${data.name}` : "**From:** Anonymous",
        "",
        data.feedback,
      ].join("\n");
    default:
      return "";
  }
}

function openIssue(action, labels, data) {
  const title = buildIssueTitle(action, data);
  const body = buildIssueBody(action, data);
  const params = new URLSearchParams({ title, body, labels });
  const url = `${REPO_URL}/issues/new?${params.toString()}`;
  window.open(url, "_blank", "noopener");
}

document.querySelectorAll(".action-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (GITHUB_OWNER === "YOUR_GITHUB_USERNAME") {
      showToast("Set GITHUB_OWNER / GITHUB_REPO in assets/js/app.js first.");
      return;
    }

    const action = form.dataset.action;
    const labels = form.dataset.labels || "";
    const data = Object.fromEntries(new FormData(form).entries());

    openIssue(action, labels, data);
    showToast("Opening GitHub to submit your issue…");
    form.reset();
  });
});
