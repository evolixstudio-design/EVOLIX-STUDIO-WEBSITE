// ============================================================
// EVOLIX — TRUE 3D VERTICAL CYLINDER WHEEL ENGINE
// Autonomous vertical 3D spin with items in one line
// Zero scroll trapping, smooth continuous rotation
// ============================================================

(function () {
  "use strict";

  var cylinder = document.getElementById("wheelCylinder");
  var viewport = document.getElementById("wheelViewport");
  var section = document.getElementById("wheelSection");
  if (!cylinder || !viewport) return;

  var rows = Array.prototype.slice.call(cylinder.querySelectorAll(".wheel-row"));
  var count = rows.length;
  if (!count) return;

  var angleStep = 360 / count;
  var currentAngle = 0;
  var targetAngle = 0;
  var speed = 0.28; // Autonomous vertical spin speed (deg/frame)
  var isHovered = false;
  var isVisible = true;
  var rafId = null;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Responsive radius calculation - decreased spacing for tighter, sleeker vertical cylinder
  function getRadius() {
    var vh = viewport.clientHeight || 420;
    var vw = window.innerWidth;
    if (vw < 600) return Math.max(130, vh * 0.44);
    if (vw < 900) return Math.max(165, vh * 0.50);
    return Math.max(205, vh * 0.56);
  }

  var radius = getRadius();

  window.addEventListener("resize", function () {
    radius = getRadius();
    renderWheel();
  }, { passive: true });

  // Update rows in 3D space around X-axis (Vertical Cylinder Drum)
  function renderWheel() {
    var rad = radius;

    for (var i = 0; i < count; i++) {
      var itemAngle = (currentAngle + i * angleStep) % 360;
      var normAngle = itemAngle < 0 ? itemAngle + 360 : itemAngle;

      // Radian angle from the front (0 deg is dead center front)
      var radAngle = (normAngle * Math.PI) / 180;
      var cosVal = Math.cos(radAngle); // +1 at front, -1 at back

      var row = rows[i];

      // Back of cylinder visibility & smooth fade
      if (cosVal < -0.2) {
        row.style.visibility = "hidden";
        row.style.opacity = "0";
        continue;
      }

      row.style.visibility = "visible";

      // Depth lighting: bright in center front, fading near top and bottom edges
      var opacity = Math.max(0.12, Math.pow(cosVal, 1.3));
      var scale = 0.75 + 0.25 * cosVal;

      row.style.opacity = opacity.toFixed(3);
      row.style.zIndex = Math.round((cosVal + 1) * 50);

      // 3D Transform around X-axis for vertical drum
      row.style.transform =
        "translate(-50%, -50%) rotateX(" +
        normAngle.toFixed(2) +
        "deg) translateZ(" +
        rad.toFixed(1) +
        "px) scale(" +
        scale.toFixed(3) +
        ")";
    }
  }

  var section = document.getElementById("services-wheel") || document.getElementById("wheelSection") || viewport;

  // Animation Loop (Autonomous, Smooth, 60fps - Never pauses on click or hover)
  function animate() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    if (!prefersReducedMotion) {
      targetAngle -= speed;
    }

    // Smooth damping lerp
    currentAngle += (targetAngle - currentAngle) * 0.1;
    renderWheel();

    rafId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (!rafId && isVisible) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // IntersectionObserver to sleep when offscreen
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startLoop();
          }
        });
      },
      { threshold: 0.02 }
    );
    observer.observe(section);
  }

  // Initial layout and start loop
  renderWheel();
  startLoop();
})();
