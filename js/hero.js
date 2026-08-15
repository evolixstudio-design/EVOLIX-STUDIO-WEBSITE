// hero.js — 3D Flowing Card Choreography Engine
(function () {
  const cards = document.querySelectorAll(".stack-card");
  const heroStack = document.querySelector(".hero-stack");
  if (!cards.length) return;

  const totalCards = cards.length;
  let progress = 0;
  const speed = 0.0032; // Smooth continuous 3D loop velocity
  let activeHoverCard = null;

  // Mouse sway variables
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Detect mouse position for subtle interactive 3D perspective shift
  if (heroStack) {
    window.addEventListener("mousemove", (e) => {
      const rect = heroStack.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetMouseX = (e.clientX - cx) / (rect.width / 2);
      targetMouseY = (e.clientY - cy) / (rect.height / 2);
    });

    heroStack.addEventListener("mouseleave", () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // Hover state handling
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      activeHoverCard = card;
    });
    card.addEventListener("mouseleave", () => {
      if (activeHoverCard === card) activeHoverCard = null;
    });
  });

  // Responsive 3D amplitudes
  function getAmplitudes() {
    const w = window.innerWidth;
    if (w < 480) {
      return { rx: 70, ry: 40, rz: 60 };
    } else if (w < 768) {
      return { rx: 95, ry: 50, rz: 80 };
    } else if (w < 1024) {
      return { rx: 160, ry: 90, rz: 130 };
    } else {
      return { rx: 245, ry: 135, rz: 190 };
    }
  }

  function renderFrame() {
    progress += speed;
    if (progress > Math.PI * 2 * 1000) progress -= Math.PI * 2 * 1000;

    // Smooth lerp for mouse sway
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    const amps = getAmplitudes();
    const rx = amps.rx;
    const ry = amps.ry;
    const rz = amps.rz;

    cards.forEach((card, i) => {
      // Phase offset for even distribution along 3D loop
      const theta = progress + (i * Math.PI * 2) / totalCards;

      // 3D Positions:
      // X: Horizontal flow across hero
      // Y: Vertical subtle figure-8 loop
      // Z: Depth (positive = in front of text, negative = behind text)
      let x = Math.cos(theta) * rx;
      let y = Math.sin(theta) * ry + Math.cos(theta * 2) * (ry * 0.22);
      let z = Math.sin(theta + 0.35) * rz;

      // 3D Rotations
      let rotZ = Math.cos(theta - 0.4) * 14;
      let rotY = -Math.sin(theta) * 16;
      let rotX = Math.cos(theta * 2) * 8;

      // Scale & Opacity based on depth (Z)
      const zNorm = (z + rz) / (rz * 2); // 0 (furthest) to 1 (closest)
      let scale = 0.76 + zNorm * 0.36;   // Scale ranges 0.76x -> 1.12x
      let opacity = 0.72 + zNorm * 0.28; // Opacity ranges 0.72 -> 1.0

      // Mouse sway application
      x += mouseX * 28;
      y += mouseY * 18;
      rotY += mouseX * 8;
      rotX -= mouseY * 8;

      // Z-Index relative to EVOLIX & STUDIO typography (which is at z-index: 10):
      // When z > 0: foreground cards appear IN FRONT OF text (z-index 15..35)
      // When z <= 0: background cards appear BEHIND text (z-index 1..8)
      let zIndex;
      if (z > 0) {
        zIndex = Math.floor(15 + zNorm * 20);
      } else {
        zIndex = Math.floor(1 + zNorm * 8);
      }

      // Hover override
      if (activeHoverCard === card) {
        z += 75;
        scale *= 1.1;
        zIndex = 100;
        opacity = 1.0;
        rotX = 0;
        rotY = 0;
      }

      card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity.toFixed(2);
    });

    requestAnimationFrame(renderFrame);
  }

  // Parallax scroll shift
  window.addEventListener("scroll", () => {
    const scContainer = document.getElementById("cardStackContainer");
    if (scContainer) {
      const scrollY = window.scrollY;
      scContainer.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`;
    }
  });

  requestAnimationFrame(renderFrame);
})();

