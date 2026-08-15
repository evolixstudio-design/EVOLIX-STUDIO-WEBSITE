/**
 * Evolix — 3D Cylindrical Wheel-Spin Engine
 * Renders items onto a true 3D rotating cylinder drum in real-time
 */
(function () {
  function initWheel() {
    var stage = document.getElementById("wheelStageContainer");
    var viewport = document.getElementById("wheelViewport");
    var cylinder = document.getElementById("wheelCylinder");
    if (!viewport || !cylinder) return;

    var rows = Array.prototype.slice.call(cylinder.querySelectorAll(".wheel-row"));
    if (rows.length === 0) return;

    var totalItems = rows.length;
    var angleStep = 360 / totalItems;

    var currentAngle = 0;
    var autoSpeed = 0.22; // Degrees per frame
    var velocity = 0;
    var isDragging = false;
    var isHovered = false;
    var lastY = 0;
    var radius = 290;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function updateRadius() {
      var w = window.innerWidth;
      if (w <= 480) {
        radius = 180;
      } else if (w <= 768) {
        radius = 220;
      } else if (w <= 1024) {
        radius = 260;
      } else {
        radius = 290;
      }
      render();
    }

    function render() {
      for (var i = 0; i < totalItems; i++) {
        var row = rows[i];
        // Calculate angle of this item around the 360-degree cylinder
        var itemAngle = (i * angleStep + currentAngle) % 360;
        if (itemAngle < 0) itemAngle += 360;

        // Normalize angle to -180 .. +180 relative to direct front (0 deg)
        var normAngle = itemAngle;
        if (normAngle > 180) normAngle -= 360;

        var rad = (normAngle * Math.PI) / 180;
        var cosVal = Math.cos(rad);

        // Hide items behind the back hemisphere
        if (cosVal <= 0.04) {
          row.style.opacity = "0";
          row.style.visibility = "hidden";
          row.style.pointerEvents = "none";
          continue;
        }

        row.style.visibility = "visible";
        row.style.pointerEvents = "auto";

        // Smooth lighting/opacity dropoff towards the top and bottom rims
        var opacity = Math.pow(cosVal, 0.65);
        row.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);

        // True 3D cylinder position:
        // Center alignment + Rotate around X-axis + Push outward by cylinder radius R
        row.style.transform = "translate(-50%, -50%) rotateX(" + (-normAngle).toFixed(2) + "deg) translateZ(" + radius + "px)";
      }
    }

    function tick() {
      if (!reduceMotion) {
        if (!isDragging) {
          if (!isHovered) {
            currentAngle = (currentAngle + autoSpeed) % 360;
          }
          if (Math.abs(velocity) > 0.005) {
            currentAngle = (currentAngle + velocity) % 360;
            velocity *= 0.93; // Smooth inertia friction
          }
        }
      }

      render();
      requestAnimationFrame(tick);
    }

    // Event Listeners for Dragging & Interaction
    viewport.addEventListener("mousedown", function (e) {
      isDragging = true;
      lastY = e.clientY;
      velocity = 0;
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      var dy = e.clientY - lastY;
      lastY = e.clientY;
      var angleDelta = (dy / radius) * 57.3;
      currentAngle -= angleDelta;
      velocity = -angleDelta * 0.35;
    });

    window.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
      }
    });

    // Touch events for mobile
    viewport.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        lastY = e.touches[0].clientY;
        velocity = 0;
      }
    }, { passive: true });

    window.addEventListener("touchmove", function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      var dy = e.touches[0].clientY - lastY;
      lastY = e.touches[0].clientY;
      var angleDelta = (dy / radius) * 57.3;
      currentAngle -= angleDelta;
      velocity = -angleDelta * 0.35;
    }, { passive: true });

    window.addEventListener("touchend", function () {
      isDragging = false;
    });

    // Mouse wheel scroll to spin cylinder
    viewport.addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = e.deltaY;
      velocity += (delta / radius) * 12;
    }, { passive: false });

    // Hover pause
    viewport.addEventListener("mouseenter", function () {
      isHovered = true;
    });
    viewport.addEventListener("mouseleave", function () {
      isHovered = false;
    });

    window.addEventListener("resize", updateRadius);
    updateRadius();
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWheel);
  } else {
    initWheel();
  }
})();
