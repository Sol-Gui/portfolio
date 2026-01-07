import * as Donut from "./scripts/donut.js";

console.log("oi");
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
console.log(screenWidth);
console.log(screenHeight)

const donut = new Donut.AsciiDonut(
  document.getElementById("donut"),
  document.querySelector(".donut-container")
);

donut.start();