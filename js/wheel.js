/**
 * Evolix — 3D Cylindrical Wheel-Spin Engine
 * Renders items onto a true 3D rotating cylinder drum in real-time
 */
(function () {
  "use strict";

  function initWheel() {
    var stage = document.getElementById("wheelStageContainer");
    var viewport = document.getElementById("wheelViewport");
    var cylinder = document.getElementById("wheelCylinder");
    var wheelSection = document.getElementById("services-wheel");
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
    var isVisible = true;
    var isLoopScheduled = false;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("IntersectionObserver" in window && wheelSection) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !isLoopScheduled) {
            isLoopScheduled = true;
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(wheelSection);
    }

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
        var itemAngle = (i * angleStep + currentAngle) % 360;
        if (itemAngle < 0) itemAngle += 360;

        var normAngle = itemAngle;
        if (normAngle > 180) normAngle -= 360;

        var rad = (normAngle * Math.PI) / 180;
        var cosVal = Math.cos(rad);

        if (cosVal <= 0.04) {
          row.style.opacity = "0";
          row.style.visibility = "hidden";
          row.style.pointerEvents = "none";
          continue;
        }

        row.style.visibility = "visible";
        row.style.pointerEvents = "auto";

        var opacity = Math.pow(cosVal, 0.65);
        row.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);
        row.style.transform = "translate(-50%, -50%) rotateX(" + (-normAngle).toFixed(2) + "deg) translateZ(" + radius + "px)";
      }
    }

    function tick() {
      isLoopScheduled = false;
      if (!isVisible) return;

      if (!reduceMotion) {
        if (!isDragging) {
          if (!isHovered) {
            currentAngle = (currentAngle + autoSpeed) % 360;
          }
          if (Math.abs(velocity) > 0.005) {
            currentAngle = (currentAngle + velocity) % 360;
            velocity *= 0.93;
          }
        }
      }

      render();
      isLoopScheduled = true;
      requestAnimationFrame(tick);
    }

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
    }, { passive: true });

    window.addEventListener("mouseup", function () {
      if (isDragging) isDragging = false;
    });

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

    viewport.addEventListener("wheel", function (e) {
      var delta = e.deltaY;
      velocity += (delta / radius) * 8;
    }, { passive: true });

    viewport.addEventListener("mouseenter", function () { isHovered = true; });
    viewport.addEventListener("mouseleave", function () { isHovered = false; });

    window.addEventListener("resize", updateRadius, { passive: true });
    updateRadius();
    isLoopScheduled = true;
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWheel);
  } else {
    initWheel();
  }
})();
