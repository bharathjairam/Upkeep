// Hero video: fade in once it can actually play, so there's no flash of a blank frame.
const heroVideo = document.getElementById("hero-video");
if (heroVideo) {
  heroVideo.addEventListener("loadeddata", () => heroVideo.classList.add("is-loaded"));
  if (heroVideo.readyState >= 2) heroVideo.classList.add("is-loaded");
}

// How-it-works tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("active", b === btn));
    tabPanels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
  });
});
