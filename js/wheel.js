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

  // Responsive radius calculation based on viewport height/width
  function getRadius() {
    var vh = viewport.clientHeight || 500;
    var vw = window.innerWidth;
    if (vw < 600) return Math.max(160, vh * 0.58);
    if (vw < 900) return Math.max(210, vh * 0.65);
    return Math.max(260, vh * 0.72);
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
      var sinVal = Math.sin(radAngle); // +1 at top, -1 at bottom

      var row = rows[i];

      // Back of cylinder visibility & smooth fade
      if (cosVal < -0.2) {
        row.style.visibility = "hidden";
        row.style.opacity = "0";
        row.style.pointerEvents = "none";
        continue;
      }

      row.style.visibility = "visible";

      // Depth lighting: bright in center front, fading near top and bottom edges
      var opacity = Math.max(0.12, Math.pow(cosVal, 1.3));
      var scale = 0.7 + 0.3 * cosVal;

      row.style.opacity = opacity.toFixed(3);
      row.style.pointerEvents = cosVal > 0.4 ? "auto" : "none";
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

  // Animation Loop (Autonomous, Smooth, 60fps)
  function animate() {
    if (isVisible) {
      if (!isHovered && !prefersReducedMotion) {
        targetAngle -= speed;
      }

      // Smooth damping lerp
      currentAngle += (targetAngle - currentAngle) * 0.1;
      renderWheel();
    }
    rafId = requestAnimationFrame(animate);
  }

  // Pause on hover
  viewport.addEventListener("mouseenter", function () {
    isHovered = true;
  });

  viewport.addEventListener("mouseleave", function () {
    isHovered = false;
  });

  // Touch pause for mobile
  viewport.addEventListener("touchstart", function () {
    isHovered = true;
  }, { passive: true });

  viewport.addEventListener("touchend", function () {
    isHovered = false;
  }, { passive: true });

  // IntersectionObserver to sleep when offscreen
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(section || viewport);
  }

  // Initial layout and start loop
  renderWheel();
  rafId = requestAnimationFrame(animate);
})();
