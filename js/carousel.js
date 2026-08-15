/**
 * Evolix — Interactive Project Image Carousel
 * Handles multiple project cards with next/prev buttons, dot pagination, and touch swipe.
 */
(function () {
  "use strict";

  function initCarousels() {
    var containers = Array.prototype.slice.call(document.querySelectorAll(".project-carousel-container"));
    if (containers.length === 0) return;

    containers.forEach(function (container) {
      var track = container.querySelector(".project-carousel-track");
      var slides = Array.prototype.slice.call(container.querySelectorAll(".carousel-slide"));
      var prevBtn = container.querySelector(".carousel-btn.prev");
      var nextBtn = container.querySelector(".carousel-btn.next");
      var dots = Array.prototype.slice.call(container.querySelectorAll(".carousel-dot"));

      if (!track || slides.length === 0) return;

      var currentIndex = 0;
      var totalSlides = slides.length;

      function update() {
        track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
        dots.forEach(function (dot, i) {
          if (i === currentIndex) dot.classList.add("active");
          else dot.classList.remove("active");
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % totalSlides;
          update();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
          update();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = i;
          update();
        });
      });

      // Touch swipe
      var startX = 0;
      container.addEventListener("touchstart", function (e) {
        if (e.touches && e.touches[0]) {
          startX = e.touches[0].clientX;
        }
      }, { passive: true });

      container.addEventListener("touchend", function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          var diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) currentIndex = (currentIndex + 1) % totalSlides;
            else currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            update();
          }
        }
      }, { passive: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousels);
  } else {
    initCarousels();
  }
})();
