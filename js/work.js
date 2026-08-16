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

  var cardIndex = 0;
  var isHeroVisible = true;
  var activeCards = [];
  var MAX_ACTIVE_CARDS = 4; // At most 3-4 images in the cursor trail
  var lastX = 0;
  var lastY = 0;
  var MIN_MOVE_DIST = 50; // Distance in pixels before spawning next card

  // IntersectionObserver to pause work hero cards when out of viewport
  if ("IntersectionObserver" in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  function removeCardSmoothly(card) {
    if (!card) return;
    if (card._autoTimer) {
      clearTimeout(card._autoTimer);
      card._autoTimer = null;
    }
    if (window.gsap && !prefersReducedMotion) {
      gsap.to(card, {
        scale: 0.75,
        opacity: 0,
        y: "+=18",
        duration: 0.3,
        ease: "power2.in",
        onComplete: function () {
          if (card.parentNode) card.parentNode.removeChild(card);
        }
      });
    } else {
      if (card.parentNode) card.parentNode.removeChild(card);
    }
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
    var rotation = (Math.random() - 0.5) * (isMobile ? 18 : 24);

    if (window.gsap && !prefersReducedMotion) {
      gsap.set(card, {
        x: x - halfW,
        y: y - halfH,
        rotation: rotation,
        scale: isAmbient ? 0.8 : 0.6,
        opacity: 0,
      });

      // Quick snappy spring pop
      gsap.to(card, {
        scale: 1,
        opacity: isAmbient ? 0.85 : 0.95,
        duration: 0.28,
        ease: "back.out(1.3)",
      });

      if (!isAmbient) {
        activeCards.push(card);

        // Maintain at most 3-4 images in the cursor trail
        while (activeCards.length > MAX_ACTIVE_CARDS) {
          var oldCard = activeCards.shift();
          removeCardSmoothly(oldCard);
        }

        // Safety fade out after 1.1s if cursor stops
        card._autoTimer = setTimeout(function () {
          var idx = activeCards.indexOf(card);
          if (idx !== -1) activeCards.splice(idx, 1);
          removeCardSmoothly(card);
        }, 1100);
      } else {
        // Ambient background cards
        gsap.to(card, {
          opacity: 0,
          y: "+=25",
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out",
          onComplete: function () {
            if (card.parentNode) card.parentNode.removeChild(card);
          }
        });
      }
    } else {
      card.style.left = (x - halfW) + "px";
      card.style.top = (y - halfH) + "px";
      setTimeout(function () {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 900);
    }
  }

  // ─── Ambient Floating Loop (Mobile & Desktop) ───
  function runAmbientFloatingLoop() {
    if (prefersReducedMotion) return;

    function triggerAmbient() {
      if (isHeroVisible && activeCards.length === 0) {
        var rect = heroSection.getBoundingClientRect();
        var width = rect.width || window.innerWidth;
        var height = rect.height || 500;
        var isMobile = width < 768;

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

      var nextDelay = (window.innerWidth < 768 ? 2400 : 2000) + Math.random() * 800;
      setTimeout(triggerAmbient, nextDelay);
    }

    setTimeout(function () {
      var rect = heroSection.getBoundingClientRect();
      var w = rect.width || window.innerWidth;
      var h = rect.height || 500;
      spawnCard(w * 0.2, h * 0.38, true);
      setTimeout(function () { spawnCard(w * 0.8, h * 0.62, true); }, 500);
      setTimeout(triggerAmbient, 1800);
    }, 350);
  }

  runAmbientFloatingLoop();

  // ─── Interactive Mousemove & Touch Spawn with Distance Threshold ───
  function handlePointerMove(clientX, clientY) {
    var rect = heroSection.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    var dist = Math.hypot(x - lastX, y - lastY);
    if (dist >= MIN_MOVE_DIST) {
      lastX = x;
      lastY = y;
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
  var lightboxDeliverables = document.getElementById("lightboxDeliverables");
  var lightboxDescription = document.getElementById("lightboxDescription");
  var lightboxMainImg = document.getElementById("lightboxMainImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxBackdrop = document.getElementById("lightboxBackdrop");
  var lightboxCta = document.getElementById("lightboxCta");

  var PROJECT_DETAILS = {
    remedies: {
      title: "Indian Remedies",
      badge: "Full-Stack E-Commerce",
      desc: "Comprehensive digital transformation for an Ayurvedic wellness brand. Engineered a high-converting web storefront, product packaging identity, and custom CMS architecture.",
      deliverables: ["Custom UI/UX", "High-Speed Headless Frontend", "Payment Gateway & Analytics", "Mobile Optimization"],
      image: "/assets/projects/web.webp",
      cta: "/contact.html?service=website"
    },
    elytek: {
      title: "Elytek Tech",
      badge: "Brand Identity & Web",
      desc: "Sleek hardware identity and product showcase website for an innovative smart-tech company, blending precision 3D renders with interactive interfaces.",
      deliverables: ["Brand Strategy & Guidelines", "3D CGI Product Renders", "Responsive Web App", "Interactive 3D Stage"],
      image: "/assets/projects/branding.webp",
      cta: "/contact.html?service=branding"
    },
    shieldmax: {
      title: "Shield Max",
      badge: "Amazon Premium A+",
      desc: "Top-tier Amazon Enhanced Brand Content (EBC) modules, comparison tables, and infographic storyboards driving record listing conversion rates.",
      deliverables: ["A+ Brand Story Modules", "Comparison Matrix", "Mobile-First Graphics", "Listing Architecture"],
      image: "/assets/projects/amazon.webp",
      cta: "/contact.html?service=amazon"
    },
    sonora: {
      title: "Sonora Elite",
      badge: "Product Photography & CGI",
      desc: "Precision studio lighting, macro hardware stills, and 3D visual effects for a luxury audio electronics line.",
      deliverables: ["4K Studio Stills", "Lifestyle Staging", "Exploded View CGI", "Post Retouching"],
      image: "/assets/projects/photo.webp",
      cta: "/contact.html?service=photography"
    },
    hyperion: {
      title: "Hyperion Operations",
      badge: "Custom ERP & Automation",
      desc: "Custom inventory management portal and logistics automation suite handling multi-channel orders with sub-second response times.",
      deliverables: ["Custom ERP Architecture", "Inventory Dashboard", "Webhook Automation", "Role-Based Access"],
      image: "/assets/projects/software.webp",
      cta: "/contact.html?service=software"
    },
    arcadia: {
      title: "Arcadia Collective",
      badge: "Performance Marketing",
      desc: "Multi-channel paid media campaign, performance funnel design, and data-driven ad creative generating 4.2x ROAS in 90 days.",
      deliverables: ["Meta & Google Ad Strategy", "Conversion Funnels", "Creative Ad Sets", "Attribution Analytics"],
      image: "/assets/projects/marketing.webp",
      cta: "/contact.html?service=marketing"
    }
  };

  function openLightbox(projectKey) {
    var data = PROJECT_DETAILS[projectKey];
    if (!data || !lightbox) return;

    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxBadge) lightboxBadge.textContent = data.badge;
    if (lightboxDescription) lightboxDescription.textContent = data.desc;
    if (lightboxMainImg) {
      lightboxMainImg.src = data.image;
      lightboxMainImg.alt = data.title;
    }
    if (lightboxCta) lightboxCta.href = data.cta;

    if (lightboxDeliverables) {
      lightboxDeliverables.innerHTML = "";
      data.deliverables.forEach(function (d) {
        var span = document.createElement("span");
        span.className = "lb-tag";
        span.textContent = d;
        lightboxDeliverables.appendChild(span);
      });
    }

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  var triggerBtns = Array.prototype.slice.call(document.querySelectorAll(".open-project-modal-btn"));
  triggerBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var key = btn.getAttribute("data-project-key");
      openLightbox(key);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
})();
