// ============================================================
// EVOLIX — SERVICES INTERACTIVE ORCHESTRATION
// Master-detail transitions, fullscreen kinetic viewport drop,
// showreel placeholder, video showcase, and marquee controls.
// ============================================================

(function () {
  "use strict";

  // ===== SERVICE DATA REPOSITORY =====
  var SERVICES_DATA = [
    {
      index: "01",
      name: "Website Development",
      tag: "Web & Digital",
      scope: "Service Deep Dive",
      lead: "We engineer ultra-fast, visually stunning websites that turn visitors into loyal customers. From headless e-commerce architectures and marketing landing pages to full-scale web platforms, every site is crafted with obsessive attention to speed, responsiveness, SEO, and visual elegance.",
      deliverables: [
        "Custom UX/UI Design & Wireframing",
        "High-Performance Responsive Frontend",
        "Modern Web Applications & Next.js",
        "E-Commerce & High-Conversion Checkouts",
        "CMS Integration & Headless Architecture",
        "SEO & Core Web Vitals Optimization"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/06.png",
      videoSrc: "",
      captionTitle: "Web Development Platform",
      captionSub: "Engineered by Evolix Studio",
      badge: "Interactive Preview",
      spec1: "Resolution: 4K Retina",
      spec2: "Tech: Next.js + GSAP"
    },
    {
      index: "02",
      name: "Branding",
      tag: "Visual Identity",
      scope: "Service Deep Dive",
      lead: "We build distinct, memorable brand identities that command attention in crowded markets. We define your brand story, visual language, typography scales, color systems, and comprehensive design guidelines to ensure consistency across every physical and digital touchpoint.",
      deliverables: [
        "Logo & Wordmark Identity Design",
        "Typography & Color Systems",
        "Comprehensive Brand Guidelines",
        "Packaging & Print Collateral",
        "Social Media Identity Kits",
        "Brand Strategy & Market Positioning"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/02.png",
      videoSrc: "",
      captionTitle: "Brand Identity Design",
      captionSub: "Identity System by Evolix",
      badge: "Brand Identity System",
      spec1: "Format: Vector + Design Tokens",
      spec2: "Scope: Complete Identity System"
    },
    {
      index: "03",
      name: "Amazon A+ Content",
      tag: "Marketplace & E-Com",
      scope: "Service Deep Dive",
      lead: "Transform casual Amazon scrollers into confident buyers. We craft high-impact A+ Content modules, comparison charts, premium product infographics, and brand stories that drive search visibility, lower return rates, and maximize conversion rates.",
      deliverables: [
        "Premium A+ Brand Story Modules",
        "Technical Comparison Grids",
        "High-Impact Infographic Stacks",
        "Conversion-Optimized Sales Copy",
        "Mobile-First Amazon Compliant Assets",
        "Competitor & Category Benchmarking"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/08.png",
      videoSrc: "",
      captionTitle: "Amazon A+ Enhanced Content",
      captionSub: "Listing Architecture by Evolix",
      badge: "Amazon Conversion Grid",
      spec1: "Standard: Amazon Premium A+",
      spec2: "Optimization: Mobile-First"
    },
    {
      index: "04",
      name: "Product Photography",
      tag: "Studio & Visuals",
      scope: "Service Deep Dive",
      lead: "High-definition studio photography tailored for hardware, electronics, and retail products. We handle creative direction, custom lighting setups, macro detail captures, lifestyle staging, and master retouching to make your physical products shine.",
      deliverables: [
        "High-Resolution Studio Stills",
        "360° Interactive Product Rotations",
        "Lifestyle & In-Context Shoot Direction",
        "Macro Hardware Detail Captures",
        "Multi-Angle Amazon & E-Com Sets",
        "High-End Retouching & Color Grading"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/01.png",
      videoSrc: "",
      captionTitle: "Studio Product Photography",
      captionSub: "Visual Production by Evolix",
      badge: "Studio Product Capture",
      spec1: "Camera: Phase One / Sony Alpha",
      spec2: "Output: 8K Retouched Stills"
    },
    {
      index: "05",
      name: "Custom Software",
      tag: "Engineering & Ops",
      scope: "Service Deep Dive",
      lead: "Custom-built software engineered to solve your operational bottlenecks. Whether you need a proprietary inventory dashboard, customer ordering portal, multi-system API integration, or automated business workflows, we deliver reliable software that scales with your growth.",
      deliverables: [
        "Internal Ops & ERP Dashboards",
        "Real-Time Inventory Management",
        "Customer Portals & Web Platforms",
        "Automated Business Workflows",
        "Custom REST/GraphQL API Integrations",
        "Real-Time Business Intelligence & Analytics"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/07.png",
      videoSrc: "",
      captionTitle: "Custom Software Architecture",
      captionSub: "Engineered by Evolix Studio",
      badge: "Custom Engineering Stack",
      spec1: "Architecture: Cloud Native",
      spec2: "Security: Enterprise Encryption"
    },
    {
      index: "06",
      name: "Digital Marketing",
      tag: "Growth & Paid Media",
      scope: "Service Deep Dive",
      lead: "Performance-driven digital marketing campaigns designed to scale your business profitably. We combine data-driven paid advertising (Meta, Google, TikTok), creative ad assets, precision targeting, and high-converting sales funnels to maximize your return on ad spend.",
      deliverables: [
        "Full-Funnel Paid Ads (Google, Meta, TikTok)",
        "High-Conversion Landing Page Funnels",
        "Data-Driven CRO & A/B Testing",
        "Retargeting & Automated Retention Flows",
        "High-Performance Ad Creative & Copy",
        "Live ROAS & Attribution Analytics"
      ],
      mediaType: "image",
      mediaSrc: "/assets/hero-cards/03.png",
      videoSrc: "",
      captionTitle: "Digital Growth Campaign",
      captionSub: "Media Strategy by Evolix",
      badge: "Paid Growth Engine",
      spec1: "Channels: Meta, Google, TikTok",
      spec2: "Tracking: Server-Side Attribution"
    }
  ];

  // ===== DOM ELEMENTS =====
  var overviewStage = document.getElementById("servicesOverviewStage");
  var servicesHeader = document.getElementById("servicesHeader");
  var showreelCard = document.getElementById("servicesShowreel");
  var allServicesReel = document.getElementById("allServicesReel");
  var showreelPlayBtn = document.getElementById("showreelPlayBtn");
  var servicesListWrapper = document.getElementById("servicesListWrapper");
  var listItems = Array.prototype.slice.call(document.querySelectorAll(".svc-item"));

  // Kinetic Viewport Overlay
  var kineticOverlay = document.getElementById("kineticOverlay");
  var kineticCard = document.getElementById("kineticCard");
  var kineticNum = document.getElementById("kineticNum");
  var kineticName = document.getElementById("kineticName");

  // Detail View Replacement Stage
  var detailStage = document.getElementById("servicesDetailStage");
  var backBtn = document.getElementById("backToListBtn");
  var detailPills = Array.prototype.slice.call(document.querySelectorAll(".pill-btn"));
  var prevBtn = document.getElementById("prevServiceBtn");
  var nextBtn = document.getElementById("nextServiceBtn");
  var pageCounter = document.getElementById("pageCounter");

  // Detail View Dynamic Content
  var detailInfoCol = document.getElementById("detailInfoCol");
  var detailMediaCol = document.getElementById("detailMediaCol");
  var detailTag = document.getElementById("detailTag");
  var detailTitle = document.getElementById("detailTitle");
  var detailLead = document.getElementById("detailLead");
  var deliverablesList = document.getElementById("deliverablesList");
  var posterImage = document.getElementById("posterImage");
  var serviceVideo = document.getElementById("serviceVideo");
  var badgeText = document.getElementById("badgeText");
  var captionTitle = document.getElementById("captionTitle");
  var specChip1 = document.getElementById("specChip1");
  var specChip2 = document.getElementById("specChip2");
  var videoToggleBtn = document.getElementById("videoToggleBtn");

  // Bottom Rows & Marquee
  var moreRows = Array.prototype.slice.call(document.querySelectorAll(".svc-more-row"));
  var marquee = document.getElementById("svcMarquee");

  // ===== STATE =====
  var currentIndex = 0;
  var currentView = "overview";
  var busy = false;
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== POPULATE DETAIL VIEW WITH SERVICE DATA =====
  function populateDetailView(index) {
    var data = SERVICES_DATA[index];
    if (!data) return;

    currentIndex = index;

    if (detailTag) detailTag.textContent = data.tag;
    if (detailTitle) detailTitle.textContent = data.name;
    if (detailLead) detailLead.textContent = data.lead;

    // Deliverables list
    if (deliverablesList) {
      deliverablesList.innerHTML = "";
      data.deliverables.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = '<span class="bullet">✦</span> ' + item;
        deliverablesList.appendChild(li);
      });
    }

    // Media Poster
    if (posterImage) {
      posterImage.src = data.mediaSrc;
      posterImage.alt = data.name;
    }

    // Service Video
    if (serviceVideo) {
      if (data.videoSrc) {
        serviceVideo.src = data.videoSrc;
        serviceVideo.style.display = "block";
        serviceVideo.play().catch(function () {});
      } else {
        serviceVideo.style.display = "none";
        serviceVideo.pause();
      }
    }

    // Badges and specs
    if (badgeText) badgeText.textContent = data.badge;
    if (captionTitle) captionTitle.textContent = data.captionTitle;
    if (specChip1) specChip1.textContent = data.spec1;
    if (specChip2) specChip2.textContent = data.spec2;

    // Counter & Pills active state
    if (pageCounter) {
      pageCounter.textContent = (index + 1 < 10 ? "0" : "") + (index + 1) + " / 06";
    }

    detailPills.forEach(function (pill, i) {
      if (i === index) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    var serviceSlugs = ["web", "branding", "amazon", "photography", "software", "marketing"];
    var detailCta = document.querySelector(".detail-cta-btn");
    if (detailCta) {
      detailCta.href = "/contact.html?service=" + (serviceSlugs[index] || "web");
    }
  }

  // ============================================================
  // CINEMATIC TRANSITION SEQUENCE (PREMIUM & CENTERED)
  // ============================================================
  function activateServiceWithKineticDrop(targetIndex) {
    if (busy) return;
    busy = true;

    // Pin viewport to top of page
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });

    var data = SERVICES_DATA[targetIndex];
    if (!data) {
      busy = false;
      return;
    }

    // Reset and populate kinetic card text & number
    if (kineticNum) kineticNum.textContent = data.index;
    if (kineticName) {
      kineticName.textContent = data.name;
      kineticName.classList.remove("highlight");
    }

    // Fallback for reduced-motion or environments without GSAP
    if (prefersReducedMotion || typeof gsap === "undefined") {
      overviewStage.style.display = "none";
      populateDetailView(targetIndex);
      detailStage.style.display = "block";
      currentView = "detail";
      busy = false;
      return;
    }

    // Scenario A: Transitioning from OVERVIEW to DETAIL VIEW
    if (currentView === "overview") {
      var tl = gsap.timeline({
        onComplete: function () {
          currentView = "detail";
          busy = false;
        }
      });

      // 1. Fade out overview stage smoothly
      tl.to([servicesHeader, showreelCard, servicesListWrapper], {
        opacity: 0,
        y: -30,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.inOut"
      }, 0);

      // Hide overview container
      tl.set(overviewStage, { display: "none" });

      // 2. Service text glides in from TOP VIEWPORT (-60vh) directly into center
      tl.set(kineticOverlay, { visibility: "visible", opacity: 1 });
      tl.fromTo(
        kineticCard,
        { y: "-60vh", opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );

      // 3. Highlight the service text
      tl.add(function () {
        if (kineticName) kineticName.classList.add("highlight");
      }, "+=0.06");

      // Hold in dead-center focus
      tl.to(kineticCard, { scale: 1.03, duration: 0.3, ease: "sine.inOut" });

      // 4. Move down off-screen (+60vh) smoothly
      tl.to(kineticCard, {
        y: "60vh",
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        ease: "power3.in"
      }, "+=0.18");

      // Hide overlay
      tl.set(kineticOverlay, { visibility: "hidden", opacity: 0 });

      // 5. Populate detail data & Reveal split view
      tl.call(function () {
        populateDetailView(targetIndex);
      });

      tl.set(detailStage, { display: "block", opacity: 1 });

      // Left Column (Description & Deliverables) enters
      tl.fromTo(
        detailInfoCol,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
      );

      // Right Column (Video & Media Showcase) enters
      tl.fromTo(
        detailMediaCol,
        { scale: 0.93, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "<0.08"
      );
    } 
    // Scenario B: Already in DETAIL VIEW, switching services via pills/pagination
    else {
      var tlSwitch = gsap.timeline({
        onComplete: function () {
          busy = false;
        }
      });

      // Smoothly collapse current detail view
      tlSwitch.to(detailInfoCol, { x: -35, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      tlSwitch.to(detailMediaCol, { scale: 0.96, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      tlSwitch.set(detailStage, { display: "none" });

      // Kinetic title transition
      tlSwitch.set(kineticOverlay, { visibility: "visible", opacity: 1 });
      tlSwitch.fromTo(
        kineticCard,
        { y: "-60vh", opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );

      tlSwitch.add(function () {
        if (kineticName) kineticName.classList.add("highlight");
      }, "+=0.06");

      tlSwitch.to(kineticCard, { scale: 1.03, duration: 0.25, ease: "sine.inOut" });

      tlSwitch.to(kineticCard, {
        y: "60vh",
        opacity: 0,
        scale: 0.97,
        duration: 0.55,
        ease: "power3.in"
      }, "+=0.15");

      tlSwitch.set(kineticOverlay, { visibility: "hidden", opacity: 0 });

      // Populate new service and reveal split view
      tlSwitch.call(function () {
        populateDetailView(targetIndex);
      });

      tlSwitch.set(detailStage, { display: "block", opacity: 1 });

      tlSwitch.fromTo(
        detailInfoCol,
        { x: -45, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
      );

      tlSwitch.fromTo(
        detailMediaCol,
        { scale: 0.94, opacity: 0, y: 25 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "<0.08"
      );
    }
  }

  // ============================================================
  // BACK TO OVERVIEW LIST VIEW
  // ============================================================
  function returnToOverview() {
    if (busy || currentView === "overview") return;
    busy = true;

    if (prefersReducedMotion || typeof gsap === "undefined") {
      detailStage.style.display = "none";
      overviewStage.style.display = "block";
      [servicesHeader, showreelCard, servicesListWrapper].forEach(function (el) {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      currentView = "overview";
      busy = false;
      return;
    }

    var tlBack = gsap.timeline({
      onComplete: function () {
        currentView = "overview";
        busy = false;
      }
    });

    // Fade out detail view
    tlBack.to(detailStage, {
      opacity: 0,
      y: 25,
      duration: 0.35,
      ease: "power2.in"
    });

    tlBack.set(detailStage, { display: "none" });
    tlBack.set(overviewStage, { display: "block" });

    // Stagger Header, Showreel, and Service rows back in
    tlBack.fromTo(
      servicesHeader,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
    );

    tlBack.fromTo(
      showreelCard,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
      "-=0.3"
    );

    tlBack.fromTo(
      listItems,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 0.55,
        ease: "power3.out",
        clearProps: "all"
      },
      "-=0.3"
    );
  }

  // ============================================================
  // EVENT BINDINGS
  // ============================================================

  // 1. Service List Items Click & Keyboard
  listItems.forEach(function (item) {
    var idx = parseInt(item.getAttribute("data-index"), 10);

    item.addEventListener("click", function () {
      activateServiceWithKineticDrop(idx);
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateServiceWithKineticDrop(idx);
      }
    });
  });

  // 2. Back to Overview Button
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      returnToOverview();
    });
  }

  // 3. Detail Switcher Pills
  detailPills.forEach(function (pill) {
    var idx = parseInt(pill.getAttribute("data-index"), 10);
    pill.addEventListener("click", function () {
      if (idx !== currentIndex) {
        activateServiceWithKineticDrop(idx);
      }
    });
  });

  // 4. Previous / Next Pagination Buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      var prevIdx = (currentIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length;
      activateServiceWithKineticDrop(prevIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      var nextIdx = (currentIndex + 1) % SERVICES_DATA.length;
      activateServiceWithKineticDrop(nextIdx);
    });
  }

  // 5. Showreel Play/Pause Toggle
  if (showreelPlayBtn && allServicesReel) {
    showreelPlayBtn.addEventListener("click", function () {
      if (allServicesReel.paused) {
        allServicesReel.play().then(function () {
          allServicesReel.style.display = "block";
          showreelPlayBtn.classList.add("playing");
        }).catch(function () {
          showreelPlayBtn.classList.toggle("playing");
        });
      } else {
        allServicesReel.pause();
        showreelPlayBtn.classList.remove("playing");
      }
    });
  }

  // 6. Service Video Play/Pause Toggle
  if (videoToggleBtn && serviceVideo) {
    videoToggleBtn.addEventListener("click", function () {
      if (serviceVideo.paused) {
        serviceVideo.play();
        videoToggleBtn.classList.remove("paused");
      } else {
        serviceVideo.pause();
        videoToggleBtn.classList.add("paused");
      }
    });
  }

  // 7. Bottom "More Services" Rows
  moreRows.forEach(function (row) {
    var idx = parseInt(row.getAttribute("data-target-index"), 10);

    row.addEventListener("click", function (e) {
      e.preventDefault();
      var hero = document.getElementById("servicesHero");
      if (hero) {
        hero.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }

      setTimeout(function () {
        activateServiceWithKineticDrop(idx);
      }, prefersReducedMotion ? 0 : 450);
    });
  });

  // 8. Global Keyboard (Escape to return to overview)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && currentView === "detail") {
      returnToOverview();
    }
  });

  // 9. Marquee Hover Pause
  if (marquee) {
    var track = marquee.querySelector(".marquee-track");
    if (track) {
      marquee.addEventListener("mouseenter", function () {
        track.style.animationPlayState = "paused";
      });
      marquee.addEventListener("mouseleave", function () {
        track.style.animationPlayState = "running";
      });
    }
  }

  // 10. URL Query & Hash Deep-linking (Keeps Viewport firmly at Top)
  var urlParams = new URLSearchParams(window.location.search);
  var queryParam = (urlParams.get("service") || "").toLowerCase();
  var hash = window.location.hash.toLowerCase().replace("#", "");
  var target = queryParam || hash;

  var hashMap = {
    web: 0,
    website: 0,
    webdesign: 0,
    development: 0,
    branding: 1,
    brand: 1,
    amazon: 2,
    aplus: 2,
    photography: 3,
    photo: 3,
    software: 4,
    custom: 4,
    marketing: 5,
    digital: 5
  };

  if (target && typeof hashMap[target] !== "undefined") {
    window.scrollTo(0, 0);
    setTimeout(function () {
      window.scrollTo(0, 0);
      activateServiceWithKineticDrop(hashMap[target]);
    }, 120);
  }

  // ============================================
  // 11. INTERACTIVE MOVABLE SHAPEHERO ENGINE
  // Multi-axis parallax & interactive cursor physics
  // ============================================
  function initMovableShapes() {
    var shapes = Array.prototype.slice.call(document.querySelectorAll(".elegant-shape"));
    if (shapes.length === 0) return;

    var mouseX = 0;
    var mouseY = 0;
    var currentX = 0;
    var currentY = 0;
    var isRunning = true;

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

    function onMouseMove(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    function renderLoop() {
      if (!isRunning) return;

      // Smooth lerp easing towards cursor position
      currentX += (mouseX - currentX) * 0.065;
      currentY += (mouseY - currentY) * 0.065;

      shapes.forEach(function (shape, i) {
        var cfg = shapeConfigs[i % shapeConfigs.length];
        var tx = currentX * cfg.depthX;
        var ty = currentY * cfg.depthY;
        var extraRot = (currentX + currentY) * cfg.rotMult * 12;

        shape.style.transform = "translate3d(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px, 0) rotate(calc(var(--rot, 0deg) + " + extraRot.toFixed(2) + "deg))";
      });

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMovableShapes);
  } else {
    initMovableShapes();
  }

})();
