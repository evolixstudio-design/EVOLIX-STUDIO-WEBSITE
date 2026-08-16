// hero.js — 3D Flowing Card Choreography Engine
(function () {
  "use strict";

  const cards = document.querySelectorAll(".stack-card");
  const heroStack = document.querySelector(".hero-stack");
  const heroSection = document.querySelector(".hero");
  if (!cards.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const totalCards = cards.length;
  let progress = 0;
  const speed = 0.0032; // Smooth continuous 3D loop velocity
  let activeHoverCard = null;
  let isHeroVisible = true;
  let isLoopScheduled = false;

  // Mouse sway variables
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Detect mouse position for subtle interactive 3D perspective shift
  if (heroStack) {
    window.addEventListener("mousemove", (e) => {
      if (!isHeroVisible) return;
      const rect = heroStack.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetMouseX = (e.clientX - cx) / (rect.width / 2);
      targetMouseY = (e.clientY - cy) / (rect.height / 2);
    }, { passive: true });

    heroStack.addEventListener("mouseleave", () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  // IntersectionObserver to pause rendering when hero is out of view
  if ("IntersectionObserver" in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !isLoopScheduled) {
          isLoopScheduled = true;
          requestAnimationFrame(renderFrame);
        }
      });
    }, { threshold: 0.02 });
    observer.observe(heroSection);
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
      return { rx: 65, ry: 35, rz: 50 };
    } else if (w < 768) {
      return { rx: 85, ry: 45, rz: 70 };
    } else if (w < 1024) {
      return { rx: 140, ry: 75, rz: 110 };
    } else {
      return { rx: 215, ry: 115, rz: 150 };
    }
  }

  function renderFrame() {
    isLoopScheduled = false;
    if (!isHeroVisible) return;

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

      let x = Math.cos(theta) * rx;
      let y = Math.sin(theta) * ry + Math.cos(theta * 2) * (ry * 0.2);
      let z = Math.sin(theta + 0.35) * (rz * 0.7) - 30;

      let rotZ = Math.cos(theta - 0.4) * 12;
      let rotY = -Math.sin(theta) * 14;
      let rotX = Math.cos(theta * 2) * 6;

      const zNorm = (z + rz) / (rz * 2);
      let scale = 0.78 + zNorm * 0.32;
      let opacity = 0.75 + zNorm * 0.25;

      x += mouseX * 24;
      y += mouseY * 15;
      rotY += mouseX * 6;
      rotX -= mouseY * 6;

      let zIndex = Math.floor(2 + zNorm * 8);

      if (activeHoverCard === card) {
        z = 60;
        scale *= 1.12;
        zIndex = 100;
        opacity = 1.0;
        rotX = 0;
        rotY = 0;
      }

      card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity.toFixed(2);
    });

    isLoopScheduled = true;
    requestAnimationFrame(renderFrame);
  }

  isLoopScheduled = true;
  requestAnimationFrame(renderFrame);
})();
