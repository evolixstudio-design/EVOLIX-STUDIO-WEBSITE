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

  // ============================================
  // UNIVERSAL PROJECT LIGHTBOX MODAL CONTROLLER
  // ============================================
  function initLightbox() {
    var lightbox = document.getElementById("projectLightbox");
    if (!lightbox) return;

    var lightboxTitle = document.getElementById("lightboxTitle");
    var lightboxBadge = document.getElementById("lightboxBadge");
    var lightboxCounter = document.getElementById("lightboxCounter");
    var lightboxMainImg = document.getElementById("lightboxMainImg");
    var lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
    var lightboxNextBtn = document.getElementById("lightboxNextBtn");
    var lightboxThumbnails = document.getElementById("lightboxThumbnails");
    var lightboxCloseBtn = document.getElementById("lightboxCloseBtn");

    var currentImages = [];
    var currentImgIndex = 0;

    function openLightbox(title, badge, images, startIndex) {
      if (!lightbox || !images || images.length === 0) return;
      currentImages = images;
      currentImgIndex = startIndex || 0;

      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxBadge) lightboxBadge.textContent = badge || "Portfolio";

      // Build thumbnails
      if (lightboxThumbnails) {
        lightboxThumbnails.innerHTML = "";
        currentImages.forEach(function (src, idx) {
          var thumb = document.createElement("div");
          thumb.className = "lightbox-thumb" + (idx === currentImgIndex ? " active" : "");
          var img = document.createElement("img");
          img.src = src;
          img.alt = title + " - Image " + (idx + 1);
          thumb.appendChild(img);
          thumb.addEventListener("click", function (e) {
            e.stopPropagation();
            setLightboxImage(idx);
          });
          lightboxThumbnails.appendChild(thumb);
        });
      }

      setLightboxImage(currentImgIndex);
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function setLightboxImage(index) {
      if (!currentImages.length) return;
      currentImgIndex = (index + currentImages.length) % currentImages.length;

      if (lightboxMainImg) {
        lightboxMainImg.style.opacity = "0.3";
        lightboxMainImg.src = currentImages[currentImgIndex];
        lightboxMainImg.onload = function () {
          lightboxMainImg.style.opacity = "1";
        };
      }

      if (lightboxCounter) {
        lightboxCounter.textContent = (currentImgIndex + 1) + " / " + currentImages.length;
      }

      // Update active thumb
      if (lightboxThumbnails) {
        var thumbs = lightboxThumbnails.querySelectorAll(".lightbox-thumb");
        thumbs.forEach(function (th, i) {
          if (i === currentImgIndex) {
            th.classList.add("active");
            th.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          } else {
            th.classList.remove("active");
          }
        });
      }
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener("click", closeLightbox);
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        setLightboxImage(currentImgIndex - 1);
      });
    }

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        setLightboxImage(currentImgIndex + 1);
      });
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") setLightboxImage(currentImgIndex - 1);
      else if (e.key === "ArrowRight") setLightboxImage(currentImgIndex + 1);
    });

    // Bind click listeners to all project cards and carousels
    var projectCards = Array.prototype.slice.call(document.querySelectorAll(".featured-project-card"));
    projectCards.forEach(function (card) {
      var carouselContainer = card.querySelector(".project-carousel-container");
      var titleEl = card.querySelector(".project-card-title");
      var badgeEl = card.querySelector(".card-floating-badge");
      var title = titleEl ? titleEl.textContent.trim() : "Project Details";
      var badge = badgeEl ? badgeEl.textContent.trim() : "Live Project";

      var slideImgs = Array.prototype.slice.call(card.querySelectorAll(".carousel-slide img"));
      var imageUrls = slideImgs.map(function (img) { return img.getAttribute("src"); });

      if (carouselContainer) {
        carouselContainer.addEventListener("click", function (e) {
          if (e.target.closest(".carousel-btn") || e.target.closest(".carousel-indicators")) {
            return;
          }
          var activeSlide = carouselContainer.querySelector(".carousel-slide:hover") || slideImgs[0];
          var startIdx = 0;
          if (activeSlide) {
            var activeImg = activeSlide.querySelector("img") || activeSlide;
            var activeSrc = activeImg.getAttribute("src");
            startIdx = Math.max(0, imageUrls.indexOf(activeSrc));
          }
          openLightbox(title, badge, imageUrls, startIdx);
        });
      }

      if (titleEl) {
        titleEl.style.cursor = "pointer";
        titleEl.addEventListener("click", function () {
          openLightbox(title, badge, imageUrls, 0);
        });
      }
    });
  }

  function init() {
    initCarousels();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
