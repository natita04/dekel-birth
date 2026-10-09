const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// "45 דקות לפני" / "שעה ו-10 דקות אחרי"
function relativeToBirth(time) {
  const diff = toMinutes(time) - toMinutes(BIRTH_TIME);
  if (diff === 0) return "הרגע שבו נולד";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const hours = h === 0 ? "" : h === 1 ? "שעה" : h === 2 ? "שעתיים" : `${h} שעות`;
  const mins = m === 0 ? "" : m === 1 ? "דקה" : `${m} דקות`;
  const span = hours && mins ? `${hours} ו-${mins}` : hours || mins;
  return `${span} ${diff < 0 ? "לפני" : "אחרי"}`;
}

const timeline = document.getElementById("story");
const allPhotos = [];

STORY.forEach((chapter, ci) => {
  const section = document.createElement("section");

  if (chapter.birth) {
    section.className = "birth reveal";
    section.innerHTML = `
      <div class="birth-time">${BIRTH_TIME}</div>
      <h2>${chapter.title}</h2>
      <p>${chapter.text}</p>`;
    timeline.append(section);
    return;
  }

  section.className = "chapter";
  const num = ["א", "ב", "ג", "ד", "ה", "ו", "ז"][STORY.slice(0, ci).filter((c) => !c.birth).length];
  section.innerHTML = `
    <header class="chapter-head reveal">
      <span class="chapter-num">פרק ${num}׳</span>
      <h2>${chapter.title}</h2>
      <p>${chapter.text}</p>
    </header>`;

  chapter.photos.forEach((p) => {
    const index = allPhotos.length;
    allPhotos.push(p);
    const fig = document.createElement("figure");
    fig.className = "moment reveal";
    const stamp = p.time
      ? `<figcaption><time>${p.time}</time><span>${relativeToBirth(p.time)}</span></figcaption>`
      : "";
    fig.innerHTML = `
      <button class="photo" aria-label="הגדלה">
        <img src="photos/thumb/${p.file}" alt="" loading="lazy" decoding="async">
      </button>${stamp}`;
    fig.querySelector("button").addEventListener("click", () => openLightbox(index));
    section.append(fig);
  });

  timeline.append(section);
});

// Gentle fade-in on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }),
  { rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Lightbox
const lb = document.querySelector(".lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector("figcaption");
let current = 0;

function show(i) {
  current = (i + allPhotos.length) % allPhotos.length;
  const p = allPhotos[current];
  lbImg.src = `photos/full/${p.file}`;
  lbCap.textContent = p.time ? `${p.time} · ${relativeToBirth(p.time)}` : "";
  // preload the neighbours so swiping feels instant
  [current - 1, current + 1].forEach((n) => {
    const q = allPhotos[(n + allPhotos.length) % allPhotos.length];
    new Image().src = `photos/full/${q.file}`;
  });
}

function openLightbox(i) {
  show(i);
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lb.hidden = true;
  document.body.style.overflow = "";
}

lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
lb.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
lb.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target.tagName === "FIGURE") closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  // RTL: left arrow moves forward in the story
  if (e.key === "ArrowLeft") show(current + 1);
  if (e.key === "ArrowRight") show(current - 1);
});

let touchX = null;
lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx > 0 ? 1 : -1));
  touchX = null;
});
