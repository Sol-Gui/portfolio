import * as Donut from "./scripts/donut.js";

const donut = new Donut.AsciiDonut(
  document.getElementById("donut"),
  document.querySelector(".donut-container")
);

donut.start();