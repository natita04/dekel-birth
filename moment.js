// The 16:08 birth circle, shared by the vertical timeline and the horizontal reel.
function createMoment(slot) {
  const circle = document.createElement("div");
  circle.className = "moment";
  circle.append(document.querySelector(".hero .palm").cloneNode(true));
  circle.insertAdjacentHTML("beforeend", `
    <span class="moment__time">${BIRTH_TIME}</span>
    <span class="moment__title">דקל נולד</span>`);
  slot.append(circle);
}
