// The 16:08 birth circle, shared by the vertical timeline and the horizontal reel.
// When BIRTH_VIDEO is set (data.js) the circle becomes a button that plays the
// video in its place.
function createMoment(slot, { onPlay, onStop } = {}) {
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
  }
  slot.append(circle);

  let player = null;

  function play() {
    player = document.createElement("div");
    player.className = "moment-video";
    player.innerHTML = `
      <video src="${BIRTH_VIDEO.src}" ${BIRTH_VIDEO.poster ? `poster="${BIRTH_VIDEO.poster}"` : ""} controls playsinline preload="metadata"></video>
      <button class="moment-video__close" aria-label="סגירת הסרטון">✕</button>`;
    const video = player.querySelector("video");
    player.querySelector(".moment-video__close").addEventListener("click", (e) => {
      e.stopPropagation();
      stop();
    });
    video.addEventListener("ended", stop);
    circle.replaceWith(player);
    slot.classList.add("is-playing");
    if (onPlay) onPlay();
    video.play().catch(() => {});
    video.focus();
  }

  function stop() {
    if (!player) return;
    const video = player.querySelector("video");
    video.pause();
    video.currentTime = 0;
    player.replaceWith(circle);
    player = null;
    slot.classList.remove("is-playing");
    if (onStop) onStop();
  }

  if (hasVideo) {
    circle.addEventListener("click", (e) => {
      e.stopPropagation();
      play();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") stop();
    });
  }

  return { stop, isPlaying: () => Boolean(player) };
}
