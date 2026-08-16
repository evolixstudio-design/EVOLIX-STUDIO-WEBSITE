// ============================================================
// EVOLIX — WORK PAGE INTERACTION
// Ambient floating visual cards, touch/cursor trail,
// category filters, and project lightbox controller.
// ============================================================

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── Silky smooth page headline entry ───
  var headline = document.querySelector(".work-hero-headline");

  if (window.gsap && !prefersReducedMotion && headline) {
    gsap.fromTo(headline, 
      { y: -30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.85, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }

  // ─── Hero Floating Visual Cards & Interactive Trail ───
  var heroZone = document.getElementById("heroTrailZone");
  var heroSection = document.getElementById("workHero");
  if (!heroZone || !heroSection) return;

  var cardImages = [
    "/assets/hero-cards/01.webp",
    "/assets/hero-cards/08.webp",
    "/assets/hero-cards/06.webp",
    "/assets/hero-cards/02.webp",
    "/assets/hero-cards/05.webp",
    "/assets/hero-cards/07.webp",
    "/assets/hero-cards/03.webp",
    "/assets/hero-cards/04.webp",
    "/assets/hero-cards/09.webp"
  ];

  var THROTTLE_MS = 100;
  var lastSpawn = 0;
  var cardIndex = 0;
  var isHeroVisible = true;

  // IntersectionObserver to pause work hero cards when out of viewport
  if ("IntersectionObserver" in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  function spawnCard(x, y, isAmbient) {
    if (!isHeroVisible) return;

    var card = document.createElement("div");
    card.className = "trail-card";
    
    var img = document.createElement("img");
    img.src = cardImages[cardIndex % cardImages.length];
    img.alt = "Evolix Showcase Visual";
    img.loading = "eager";
    card.appendChild(img);
    heroZone.appendChild(card);
    cardIndex++;

    var isMobile = window.innerWidth < 768;
    var halfW = isMobile ? 80 : 130;
    var halfH = isMobile ? 55 : 90;
    var rotation = (Math.random() - 0.5) * (isMobile ? 18 : 26);

    if (window.gsap && !prefersReducedMotion) {
      gsap.set(card, {
        x: x - halfW,
        y: y - halfH,
        rotation: rotation,
        scale: isAmbient ? 0.8 : 0.6,
        opacity: 0,
      });

      var duration = isAmbient ? 0.7 : 0.45;
      gsap.to(card, {
        scale: 1,
        opacity: isAmbient ? 0.85 : 0.95,
        duration: duration,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });

      var driftY = (Math.random() - 0.5) * 35 + 15;
      var delay = isAmbient ? 2.4 : 0.75;
      var fadeDuration = isAmbient ? 1.2 : 0.85;

      gsap.to(card, {
        opacity: 0,
        y: "+=" + driftY,
        duration: fadeDuration,
        delay: delay,
        ease: "power2.out",
        onComplete: function () {
          if (card.parentNode) card.parentNode.removeChild(card);
        }
      });
    } else {
      card.style.left = (x - halfW) + "px";
      card.style.top = (y - halfH) + "px";
      setTimeout(function () {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 1500);
    }
  }

  // ─── Ambient Continuous Loop so Hero is Always Alive (Mobile & Desktop) ───
  function runAmbientFloatingLoop() {
    if (prefersReducedMotion) return;

    function triggerAmbient() {
      if (isHeroVisible) {
        var rect = heroSection.getBoundingClientRect();
        var width = rect.width || window.innerWidth;
        var height = rect.height || 500;
        var isMobile = width < 768;

        // Pick positions around outer edges so center text stays clear
        var positions = isMobile ? [
          { x: width * 0.22, y: height * 0.28 },
          { x: width * 0.78, y: height * 0.32 },
          { x: width * 0.25, y: height * 0.72 },
          { x: width * 0.75, y: height * 0.68 }
        ] : [
          { x: width * 0.18, y: height * 0.38 },
          { x: width * 0.82, y: height * 0.36 },
          { x: width * 0.24, y: height * 0.66 },
          { x: width * 0.76, y: height * 0.64 }
        ];

        var pos = positions[Math.floor(Math.random() * positions.length)];
        var jitterX = (Math.random() - 0.5) * (isMobile ? 30 : 60);
        var jitterY = (Math.random() - 0.5) * (isMobile ? 25 : 50);

        spawnCard(pos.x + jitterX, pos.y + jitterY, true);
      }

      var nextDelay = (window.innerWidth < 768 ? 2200 : 1800) + Math.random() * 800;
      setTimeout(triggerAmbient, nextDelay);
    }

    // Seed initial cards on entry
    setTimeout(function () {
      var rect = heroSection.getBoundingClientRect();
      var w = rect.width || window.innerWidth;
      var h = rect.height || 500;
      spawnCard(w * 0.2, h * 0.38, true);
      setTimeout(function () { spawnCard(w * 0.8, h * 0.62, true); }, 600);
      setTimeout(triggerAmbient, 1800);
    }, 400);
  }

  runAmbientFloatingLoop();

  // ─── Interactive Mousemove & Touch Spawn ───
  function handlePointerMove(clientX, clientY) {
    var now = Date.now();
    if (now - lastSpawn < THROTTLE_MS) return;
    lastSpawn = now;

    var rect = heroSection.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      spawnCard(x, y, false);
    }
  }

  heroSection.addEventListener("mousemove", function (e) {
    if (!prefersReducedMotion) {
      handlePointerMove(e.clientX, e.clientY);
    }
  }, { passive: true });

  heroSection.addEventListener("touchmove", function (e) {
    if (!prefersReducedMotion && e.touches && e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ─── Interactive Category Filter Tabs ───
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-tab-btn"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll("#workProjectsGrid .featured-project-card"));

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var category = btn.getAttribute("data-filter");

        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        projectCards.forEach(function (card) {
          var cardCat = card.getAttribute("data-category");
          if (category === "all" || cardCat === category) {
            card.style.display = "flex";
            if (window.gsap && !prefersReducedMotion) {
              gsap.fromTo(card, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" });
            } else {
              card.style.opacity = "1";
            }
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // ─── Interactive Project Lightbox Modal Controller ───
  var lightbox = document.getElementById("projectLightbox");
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

  if (lightbox) {
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);

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
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") setLightboxImage(currentImgIndex - 1);
      else if (e.key === "ArrowRight") setLightboxImage(currentImgIndex + 1);
    });

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
          if (e.target.closest(".carousel-btn") || e.target.closest(".carousel-indicators")) return;
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

})();
