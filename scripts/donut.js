export class AsciiDonut {
  constructor(pre, container) {
    this.pre = pre;
    this.container = container;

    this.width;
    this.height;
    this.chars = " .:-=+*#%@";

    this.R1; // espessura
    this.R2;    // raio

    this.rotationSpeedA = 0.03;
    this.rotationSpeedB = 0.015;

    this.A = 0;
    this.B = 0;
  }

  projectPoint(theta, phi) {
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const sinP = Math.sin(phi);
    const cosP = Math.cos(phi);

    const circleX = this.R2 + this.R1 * cosT;
    const circleY = this.R1 * sinT;

    const x =
      circleX * (Math.cos(this.B) * cosP + Math.sin(this.A) * Math.sin(this.B) * sinP) -
      circleY * Math.cos(this.A) * Math.sin(this.B);

    const y =
      circleX * (Math.sin(this.B) * cosP - Math.sin(this.A) * Math.cos(this.B) * sinP) +
      circleY * Math.cos(this.A) * Math.cos(this.B);

    const z =
      this.R2 + 4 + Math.cos(this.A) * circleX * sinP +
  circleY * Math.sin(this.A);

    return { x, y, z, sinT, cosT, sinP, cosP };
  }

  luminance({ sinT, cosT, sinP, cosP }) {
    return (
      cosP * cosT * Math.sin(this.B) -
      Math.cos(this.A) * cosT * sinP -
      Math.sin(this.A) * sinT +
      Math.cos(this.B) * (Math.cos(this.A) * sinT - cosT * Math.sin(this.A) * sinP)
    );
  }

  renderFrame() {

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    this.width = Math.round(screenWidth / 7.5);
    this.height = Math.round(screenHeight / 20);
    this.R1 = (screenWidth / 3000) + (screenHeight / 2000);
    this.R2 = (screenWidth / 300) + (screenHeight / 200);

    console.log(this.R1);

    const buffer = Array(this.width * this.height).fill(" ");
    const zBuffer = Array(this.width * this.height).fill(0);

    for (let theta = 0; theta < Math.PI * 2; theta += 0.07) {
      for (let phi = 0; phi < Math.PI * 2; phi += 0.025) {
        const p = this.projectPoint(theta, phi);
        const ooz = 1 / p.z;

        const xp = Math.floor(this.width / 2 + 30 * ooz * p.x);
        const yp = Math.floor(this.height / 2 - 15 * ooz * p.y);

        const idx = xp + yp * this.width;
        if (
          xp < 0 || xp >= this.width ||
          yp < 0 || yp >= this.height ||
          ooz <= zBuffer[idx]
        ) continue;

        zBuffer[idx] = ooz;

        const lum = this.luminance(p);
        const charIndex = Math.floor((lum + 1) * this.chars.length / 2);
        buffer[idx] = this.chars[Math.max(0, Math.min(this.chars.length - 1, charIndex))];
      }
    }

    this.pre.textContent = buffer
      .map((c, i) => ((i + 1) % this.width === 0 ? c + "\n" : c))
      .join("");

    this.A += this.rotationSpeedA;
    this.B += this.rotationSpeedB;
  }

  start() {
    setInterval(() => this.renderFrame(), 25);
  }
}