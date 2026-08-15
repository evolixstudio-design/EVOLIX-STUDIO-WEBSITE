// ============================================================
// EVOLIX — WORK PAGE INTERACTION
// Large cursor/touch trail visual cards, project card reveals,
// and scroll-triggered animations.
// ============================================================

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ─── Silky smooth page headline entry ───
  var headline = document.querySelector(".work-hero-headline");
  var heroSub = document.querySelector(".work-hero-sub");

  if (window.gsap && !prefersReducedMotion) {
    if (headline) {
      gsap.fromTo(headline, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.85, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
    if (heroSub) {
      gsap.fromTo(heroSub, 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.75, delay: 0.15, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
  }

  // ─── Large Interactive Trail Cards in Hero ───
  var heroZone = document.getElementById("heroTrailZone");
  var heroSection = document.getElementById("workHero");
  if (!heroZone || !heroSection) return;

  var cardImages = [
    "/assets/hero-cards/01.png",
    "/assets/hero-cards/08.png",
    "/assets/hero-cards/06.png",
    "/assets/hero-cards/02.png",
    "/assets/hero-cards/05.png",
    "/assets/hero-cards/07.png",
    "/assets/hero-cards/03.png",
    "/assets/hero-cards/04.png",
    "/assets/hero-cards/09.png"
  ];

  var THROTTLE_MS = 120;
  var lastSpawn = 0;
  var cardIndex = 0;
  var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function spawnCard(x, y) {
    var card = document.createElement("div");
    card.className = "trail-card";
    
    var img = document.createElement("img");
    img.src = cardImages[cardIndex % cardImages.length];
    img.alt = "Portfolio Visual";
    img.loading = "eager";
    card.appendChild(img);
    heroZone.appendChild(card);
    cardIndex++;

    var rotation = (Math.random() - 0.5) * 26;

    if (window.gsap && !prefersReducedMotion) {
      // Center card on mouse (offset by half width ~140, half height ~100)
      gsap.set(card, {
        x: x - 140,
        y: y - 100,
        rotation: rotation,
        scale: 0.65,
        opacity: 0,
      });

      // Smooth expansion
      gsap.to(card, {
        scale: 1,
        opacity: 0.95,
        duration: 0.45,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });

      // Gentle drift and fade out
      var driftY = (Math.random() - 0.5) * 40 + 20;
      gsap.to(card, {
        opacity: 0,
        y: "+=" + driftY,
        duration: 0.8,
        delay: 0.65,
        ease: "power2.out",
        onComplete: function () {
          if (card.parentNode) card.parentNode.removeChild(card);
        }
      });
    } else {
      card.style.left = (x - 140) + "px";
      card.style.top = (y - 100) + "px";
      setTimeout(function () {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 1200);
    }
  }

  // Pre-populate hero with initial visual cards so hero looks rich immediately
  function seedInitialHeroCards() {
    if (prefersReducedMotion) return;
    var rect = heroSection.getBoundingClientRect();
    var width = rect.width || window.innerWidth;
    var height = rect.height || 600;

    var seeds = [
      { x: width * 0.72, y: height * 0.35, delay: 0.2 },
      { x: width * 0.55, y: height * 0.62, delay: 0.35 },
      { x: width * 0.82, y: height * 0.70, delay: 0.5 }
    ];

    seeds.forEach(function (seed) {
      setTimeout(function () {
        spawnCard(seed.x, seed.y);
      }, seed.delay * 1000);
    });
  }

  // Bind mouse / touch interactions
  if (!prefersReducedMotion) {
    if (isTouchDevice) {
      heroSection.addEventListener("touchmove", function (e) {
        var now = Date.now();
        if (now - lastSpawn < THROTTLE_MS) return;
        lastSpawn = now;
        var touch = e.touches[0];
        if (!touch) return;
        var rect = heroSection.getBoundingClientRect();
        var x = touch.clientX - rect.left;
        var y = touch.clientY - rect.top;
        spawnCard(x, y);
      }, { passive: true });
    } else {
      heroSection.addEventListener("mousemove", function (e) {
        var now = Date.now();
        if (now - lastSpawn < THROTTLE_MS) return;
        lastSpawn = now;
        var rect = heroSection.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        spawnCard(x, y);
      });
    }

    setTimeout(seedInitialHeroCards, 300);
  }

  // ─── Scroll-triggered reveal for project cards ───
  var entries = document.querySelectorAll(".project-entry");
  if (entries.length && window.gsap && !prefersReducedMotion) {
    gsap.set(entries, { y: 45, opacity: 0 });

    var observer = new IntersectionObserver(
      function (items) {
        items.forEach(function (item) {
          if (item.isIntersecting) {
            gsap.to(item.target, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "cubic-bezier(0.16, 1, 0.3, 1)",
            });
            observer.unobserve(item.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    entries.forEach(function (entry) {
      observer.observe(entry);
    });
  } else if (entries.length) {
    entries.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

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
              gsap.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
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

})();
