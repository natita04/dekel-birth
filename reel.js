// Desktop view: every photo on one horizontal axis, chapter title + time on top.
// Mobile keeps the vertical timeline (app.js).
const desktop = matchMedia("(min-width: 900px)");
const track = document.querySelector(".reel-track");
const axis = document.querySelector(".reel-axis");
const titleEl = document.querySelector(".reel-title");
const timeEl = document.querySelector(".reel-time");

const slides = [];
STORY.forEach((chapter, ci) => {
  if (chapter.birth) {
    slides.push({ birth: true, chapter: ci, title: chapter.title, time: BIRTH_TIME });
  } else {
    chapter.photos.forEach((p) => slides.push({ ...p, chapter: ci, title: chapter.title }));
  }
});

const head = document.querySelector(".reel-head");
const PHOTO_RATIO = 1013 / 698; // the video takes a photo-sized slot
let moment = null;

const slideEls = slides.map((s, i) => {
  const el = document.createElement("div");
  el.className = "slide" + (s.birth ? " slide-birth" : "");
  if (s.birth) {
    moment = createMoment(el, {
      onPlay: () => {
        el.dataset.ratio = PHOTO_RATIO;
        relayout();
      },
      onStop: () => {
        delete el.dataset.ratio;
        relayout();
      },
    });
  } else {
    const [w, h] = SIZES[s.file];
    el.dataset.ratio = w / h;
    el.innerHTML = `<img src="photos/thumb/${s.file}" alt="" width="${w}" height="${h}" loading="${i < 4 ? "eager" : "lazy"}" decoding="async">`;
  }
  el.addEventListener("click", () => goTo(i));
  track.append(el);
  return el;
});

// Axis: one segment per chapter, one dot per slide
const dots = [];
STORY.forEach((chapter, ci) => {
  const seg = document.createElement("div");
  seg.className = "axis-seg" + (chapter.birth ? " axis-birth" : "");
  const count = chapter.birth ? 1 : chapter.photos.length;
  seg.style.flexGrow = chapter.birth ? 0 : count;
  const row = document.createElement("div");
  row.className = "axis-dots";
  slides.forEach((s, i) => {
    if (s.chapter !== ci) return;
    const dot = document.createElement("button");
    dot.className = "axis-dot";
    dot.setAttribute("aria-label", `${s.title} ${s.time}`);
    dot.addEventListener("click", () => goTo(i));
    row.append(dot);
    dots[i] = dot;
  });
  seg.append(row);
  axis.append(seg);
});

// Size each slide to the stage, keeping the photo's proportions
function layout() {
  const stageW = track.clientWidth;
  const h = Math.min(track.clientHeight, 900);
  slideEls.forEach((el) => {
    if (el.classList.contains("slide-birth") && !el.dataset.ratio) {
      const size = Math.min(h * 0.8, stageW * 0.85);
      el.style.width = el.style.height = `${size}px`;
      return;
    }
    const ratio = Number(el.dataset.ratio);
    const w = Math.min(h * ratio, stageW * 0.88);
    el.style.width = `${w}px`;
    el.style.height = `${w / ratio}px`;
  });
  // room on both ends so the first and last slides can sit in the middle
  const first = slideEls[0].offsetWidth;
  const last = slideEls[slideEls.length - 1].offsetWidth;
  track.style.paddingInlineStart = `${(stageW - first) / 2}px`;
  track.style.paddingInlineEnd = `${(stageW - last) / 2}px`;
}

function centerOffset(el) {
  const t = track.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return r.left + r.width / 2 - (t.left + t.width / 2);
}

function goTo(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  track.scrollBy({ left: centerOffset(slideEls[i]), behavior: "smooth" });
}

let active = -1;
function setActive(i) {
  if (i === active) return;
  const prev = slides[active];
  if (prev && prev.birth && moment) moment.stop();
  active = i;
  const s = slides[i];
  slideEls.forEach((el, n) => el.classList.toggle("active", n === i));
  dots.forEach((d, n) => {
    d.classList.toggle("active", n === i);
    d.classList.toggle("seen", n < i);
  });
  if (!prev || prev.title !== s.title) {
    titleEl.classList.remove("swap");
    void titleEl.offsetWidth;
    titleEl.classList.add("swap");
    titleEl.textContent = s.title;
  }
  timeEl.textContent = s.time;
  // on the birth slide the head shows only the date kicker
  head.classList.toggle("is-birth", Boolean(s.birth));
}

// A relayout (resize, video open/close) shifts the scroll for a moment;
// ignore that so it doesn't look like the visitor moved to another slide.
let settling = false;

function findActive() {
  if (settling) return;
  let best = 0;
  let bestDist = Infinity;
  slideEls.forEach((el, i) => {
    const d = Math.abs(centerOffset(el));
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  setActive(best);
}

let ticking = false;
track.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    findActive();
    ticking = false;
  });
}, { passive: true });

// RTL: "next" sits on the left
document.querySelector(".reel-next").addEventListener("click", () => goTo(active + 1));
document.querySelector(".reel-prev").addEventListener("click", () => goTo(active - 1));
document.addEventListener("keydown", (e) => {
  if (!desktop.matches) return;
  if (e.key === "ArrowLeft") goTo(active + 1);
  if (e.key === "ArrowRight") goTo(active - 1);
});

function relayout() {
  if (!desktop.matches) return;
  settling = true;
  layout();
  track.scrollBy({ left: centerOffset(slideEls[active]) });
  setTimeout(() => {
    track.scrollBy({ left: centerOffset(slideEls[active]) });
    settling = false;
  }, 300);
}
window.addEventListener("resize", relayout);
desktop.addEventListener("change", relayout);

setActive(0);
relayout();
