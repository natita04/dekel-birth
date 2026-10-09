// The 16:08 birth circle, shared by the vertical timeline and the horizontal reel.
// When BIRTH_VIDEO is set (data.js) the circle becomes a button that opens the
// YouTube video in a lightbox.
function createMoment(slot) {
  const hasVideo = Boolean(BIRTH_VIDEO);
  const palm = document.querySelector(".hero .palm").cloneNode(true);

  const circle = document.createElement(hasVideo ? "button" : "div");
  circle.className = "moment" + (hasVideo ? " moment--playable" : "");
  if (hasVideo) circle.setAttribute("aria-label", "לצפייה בסרטון הלידה");
  circle.append(palm);
  circle.insertAdjacentHTML("beforeend", `
    <span class="moment__time">${BIRTH_TIME}</span>
    <span class="moment__title">דקל נולד</span>`);
  if (hasVideo) {
    circle.insertAdjacentHTML("beforeend", `
      <span class="play-pill">
        <svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" style="transform:scaleX(-1)"><path d="M1 1 L13 8 L1 15 Z" fill="#FFFFFF"/></svg>
        <span class="play-pill__text">לצפייה ברגע הלידה</span>
      </span>`);
    circle.addEventListener("click", (e) => {
      e.stopPropagation();
      openVideo(circle);
    });
  }
  slot.append(circle);
}

// One lightbox for the video, built on first use. Closing it removes the
// iframe, which also stops playback.
const videoBox = document.querySelector(".video-lightbox");
let videoOpener = null;

function openVideo(opener) {
  videoOpener = opener;
  videoBox.querySelector(".video-lightbox__frame").innerHTML = `
    <iframe src="https://www.youtube-nocookie.com/embed/${BIRTH_VIDEO.youtube}?autoplay=1&rel=0&playsinline=1"
      title="הרגע של דקל" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  videoBox.hidden = false;
  document.body.style.overflow = "hidden";
  videoBox.querySelector(".video-lightbox__close").focus();
}

function closeVideo() {
  if (videoBox.hidden) return;
  videoBox.hidden = true;
  videoBox.querySelector(".video-lightbox__frame").innerHTML = "";
  document.body.style.overflow = "";
  if (videoOpener) videoOpener.focus();
}

videoBox.querySelector(".video-lightbox__close").addEventListener("click", closeVideo);
videoBox.addEventListener("click", (e) => {
  if (e.target === videoBox) closeVideo();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideo();
});
