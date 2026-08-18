/**
 * @name: KokonutUI ShapeHero Interactive Movable Background Engine
 * Multi-axis parallax & interactive cursor physics for floating shapes
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  function initMovableShapes() {
    var backdrop = document.getElementById("shapeHeroBackdrop");
    if (!backdrop) return;

    var shapes = Array.prototype.slice.call(backdrop.querySelectorAll(".elegant-shape"));
    if (shapes.length === 0) return;

    var mouseX = 0;
    var mouseY = 0;
    var currentX = 0;
    var currentY = 0;
    var isRunning = true;
    var isLoopScheduled = false;

    // Per-shape depth, displacement scale, and rotation sensitivity
    var shapeConfigs = [
      { depthX: 45, depthY: 35, rotMult: -0.05 },
      { depthX: -60, depthY: -45, rotMult: 0.07 },
      { depthX: 32, depthY: -40, rotMult: 0.04 },
      { depthX: -38, depthY: 28, rotMult: -0.06 },
      { depthX: -52, depthY: 42, rotMult: 0.08 },
      { depthX: 28, depthY: -32, rotMult: -0.04 },
      { depthX: 42, depthY: 22, rotMult: 0.06 },
      { depthX: -22, depthY: -26, rotMult: -0.03 }
    ];

    function wakeLoop() {
      if (!isLoopScheduled && isRunning) {
        isLoopScheduled = true;
        requestAnimationFrame(renderLoop);
      }
    }

    function onMouseMove(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      wakeLoop();
    }

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        wakeLoop();
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // IntersectionObserver to pause when scrolled out of view
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isRunning = entry.isIntersecting;
          if (isRunning) {
            wakeLoop();
          }
        });
      }, { threshold: 0.02 });
      observer.observe(backdrop);
    }

    function renderLoop() {
      isLoopScheduled = false;
      if (!isRunning) return;

      var dx = mouseX - currentX;
      var dy = mouseY - currentY;

      // Smooth lerp easing towards cursor position
      currentX += dx * 0.08;
      currentY += dy * 0.08;

      shapes.forEach(function (shape, i) {
        var cfg = shapeConfigs[i % shapeConfigs.length];
        var tx = currentX * cfg.depthX;
        var ty = currentY * cfg.depthY;
        var extraRot = (currentX + currentY) * cfg.rotMult * 12;

        shape.style.transform =
          "translate3d(" +
          tx.toFixed(2) +
          "px, " +
          ty.toFixed(2) +
          "px, 0) rotate(calc(var(--rot, 0deg) + " +
          extraRot.toFixed(2) +
          "deg))";
      });

      // If still moving towards target, continue loop; otherwise sleep to save 100% CPU
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        isLoopScheduled = true;
        requestAnimationFrame(renderLoop);
      }
    }

    wakeLoop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMovableShapes);
  } else {
    initMovableShapes();
  }
})();
