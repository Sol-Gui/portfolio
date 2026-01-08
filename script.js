import * as Donut from "./scripts/donut.js";
import { initProjectsModal } from "./scripts/projects-modal.js";

const donut = new Donut.AsciiDonut(
  document.getElementById("donut")
);

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
});

donut.start();
initProjectsModal();
