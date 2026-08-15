// ============================================================
// EVOLIX STUDIO — CONTACT & DISCOVERY ENGINE
// KokonutUI Canvas Particle FlowField Background,
// Rupee (₹) Budget Selector, Custom Amount, WhatsApp Dispatch & Studio Clocks.
// ============================================================

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // 1. KOKONUTUI CANVAS PARTICLE FLOW FIELD ENGINE
  // ============================================================
  var canvas = document.getElementById("flowFieldCanvas");
  var backdrop = document.getElementById("flowFieldBackdrop");

  var THEMES = {
    ember: {
      hueStart: 350,
      hueRange: 65,
      saturation: 98,
      lightness: 65,
      bg: "6, 3, 4",
      trailAlpha: 0.055,
    },
    aurora: {
      hueStart: 120,
      hueRange: 200,
      saturation: 95,
      lightness: 68,
      bg: "4, 6, 8",
      trailAlpha: 0.05,
    },
    ocean: {
      hueStart: 180,
      hueRange: 90,
      saturation: 95,
      lightness: 66,
      bg: "2, 5, 10",
      trailAlpha: 0.05,
    },
    light: {
      hueStart: 350,
      hueRange: 45,
      saturation: 90,
      lightness: 46,
      bg: "248, 249, 252",
      trailAlpha: 0.08,
    }
  };

  var currentThemeKey = "ember";

  function isLightTheme() {
    return document.documentElement.getAttribute("data-theme") === "light";
  }

  /**
   * Smooth organic 2D noise via multi-octave trigonometric series.
   * Returns an angle in radians that evolves continuously with time `t`.
   */
  function fieldAngle(x, y, t) {
    var s = 0.0025;
    return (
      Math.sin(x * s + t * 0.0007) * Math.PI +
      Math.cos(y * s + t * 0.0005) * Math.PI +
      Math.sin((x + y) * s * 0.6 + t * 0.0009) * Math.PI * 0.6 +
      Math.cos((x - y) * s * 0.4 + t * 0.0006) * Math.PI * 0.4
    );
  }

  function initFlowField() {
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var animId = 0;
    var time = 0;
    var particles = [];
    var mouse = { x: -1000, y: -1000, active: false };

    function getActiveConfig() {
      if (isLightTheme()) return THEMES.light;
      return THEMES[currentThemeKey] || THEMES.ember;
    }

    function getParticleCount() {
      var w = window.innerWidth;
      if (w <= 600) return 1200;
      if (w <= 1024) return 2200;
      return 3000;
    }

    function spawnParticle() {
      var cfg = getActiveConfig();
      var maxLife = 200 + Math.floor(Math.random() * 320);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.1 + Math.random() * 2.2,
        size: 0.85 + Math.random() * 1.35,
        brightness: 0.9 + Math.random() * 0.25,
        hue: cfg.hueStart + Math.random() * cfg.hueRange,
        life: Math.floor(Math.random() * maxLife),
        maxLife: maxLife,
      };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      var cfg = getActiveConfig();
      ctx.fillStyle = "rgb(" + cfg.bg + ")";
      ctx.fillRect(0, 0, width, height);

      var count = getParticleCount();
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push(spawnParticle());
      }
    }

    function render() {
      time++;
      var cfg = getActiveConfig();
      var light = isLightTheme();

      // 1. Trail fade step (source-over)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(" + cfg.bg + ", " + cfg.trailAlpha + ")";
      ctx.fillRect(0, 0, width, height);

      // 2. High-intensity particle glow step
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var angle = fieldAngle(p.x, p.y, time);

        // Subtle interactive mouse deflection
        if (mouse.active) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 1) {
            var pushAngle = Math.atan2(dy, dx);
            var force = (1 - dist / 150) * 0.85;
            angle += pushAngle * force;
          }
        }

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        // Respawn expired particle
        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = 0;
          p.hue = cfg.hueStart + Math.random() * cfg.hueRange;
          continue;
        }

        // Wrap viewport edges
        if (p.x < 0) p.x += width;
        else if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        else if (p.y > height) p.y -= height;

        // Life fade envelope
        var progress = p.life / p.maxLife;
        var fadeIn = Math.min(progress * 8, 1);
        var fadeOut = Math.min((1 - progress) * 6, 1);
        var alpha = fadeIn * fadeOut * 0.95;

        // Directional hue variation
        var hueMod = (p.hue + (angle / (Math.PI * 2)) * 75 + 360) % 360;
        var particleLightness = Math.min(96, cfg.lightness * p.brightness);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + hueMod + ", " + cfg.saturation + "%, " + particleLightness.toFixed(1) + "%, " + alpha.toFixed(3) + ")";
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      animId = requestAnimationFrame(render);
    }

    // Mouse flow listener
    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener("mouseleave", function () {
      mouse.active = false;
    });

    // Touch support for phones/tablets
    window.addEventListener("touchmove", function (e) {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener("touchend", function () {
      mouse.active = false;
    });

    // Theme Mutation Observer
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-theme") {
          var cfg = getActiveConfig();
          if (backdrop) {
            backdrop.style.background = "rgb(" + cfg.bg + ")";
          }
          // Clear and re-fill base
          ctx.fillStyle = "rgb(" + cfg.bg + ")";
          ctx.fillRect(0, 0, width, height);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    resize();
    window.addEventListener("resize", resize);

    if (!prefersReducedMotion) {
      render();
    } else {
      // Single static render for reduced motion
      render();
      cancelAnimationFrame(animId);
    }
  }

  // ============================================================
  // 2. DISCOVERY INTAKE FORM & VALIDATION ENGINE
  // ============================================================
  var form = document.getElementById("evolixContactForm");
  var clientNameInput = document.getElementById("clientName");
  var orgNameInput = document.getElementById("orgName");
  var mobileInput = document.getElementById("clientMobile");
  var locationInput = document.getElementById("clientLocation");
  var emailInput = document.getElementById("clientEmail");
  var briefInput = document.getElementById("projectBrief");

  var servicePills = Array.prototype.slice.call(document.querySelectorAll(".service-chip-btn"));
  var budgetPills = Array.prototype.slice.call(document.querySelectorAll(".budget-chip-btn"));
  var customBudgetWrapper = document.getElementById("customBudgetWrapper");
  var customBudgetInput = document.getElementById("customBudgetInput");

  var whatsappDirectBtn = document.getElementById("whatsappDirectBtn");
  var successOverlay = document.getElementById("inquirySuccessOverlay");
  var confirmName = document.getElementById("confirmName");
  var successSummaryBox = document.getElementById("successSummaryBox");
  var resetBtn = document.getElementById("resetInquiryBtn");

  var selectedServices = [];
  var selectedBudget = "₹50,000 – ₹1,00,000";

  // Service Pills Multi-select Toggle
  servicePills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      var sId = pill.getAttribute("data-service-id");
      var sColor = pill.getAttribute("data-color") || "#cc3f48";
      var sLabel = pill.querySelector(".chip-label").textContent.trim();

      if (pill.classList.contains("active")) {
        pill.classList.remove("active");
        selectedServices = selectedServices.filter(function (item) { return item.id !== sId; });
      } else {
        pill.classList.add("active");
        selectedServices.push({ id: sId, label: sLabel, color: sColor });
      }

      var errorServices = document.getElementById("errorServices");
      if (errorServices && selectedServices.length > 0) {
        errorServices.style.display = "none";
      }
    });
  });

  // Budget Pills Radio Toggle & Custom Input Handler
  budgetPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      budgetPills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");

      var bVal = pill.getAttribute("data-budget");
      if (bVal === "custom") {
        if (customBudgetWrapper) customBudgetWrapper.style.display = "block";
        if (customBudgetInput) {
          customBudgetInput.focus();
          selectedBudget = customBudgetInput.value.trim() ? "₹" + customBudgetInput.value.trim() : "Custom Budget (To be discussed)";
        }
      } else {
        if (customBudgetWrapper) customBudgetWrapper.style.display = "none";
        selectedBudget = bVal;
      }
    });
  });

  if (customBudgetInput) {
    customBudgetInput.addEventListener("input", function () {
      var val = customBudgetInput.value.trim().replace(/^₹\s*/, "");
      selectedBudget = val ? "₹" + val : "Custom Budget (To be discussed)";
    });
  }

  // Form Validation
  function validateForm() {
    var isValid = true;

    function checkField(input, errorId, condition) {
      var wrapper = input ? input.closest(".input-field-wrapper") : null;
      if (!condition) {
        if (wrapper) wrapper.classList.add("has-error");
        isValid = false;
      } else {
        if (wrapper) wrapper.classList.remove("has-error");
      }
    }

    checkField(clientNameInput, "errorName", clientNameInput.value.trim().length >= 2);
    checkField(orgNameInput, "errorOrg", orgNameInput.value.trim().length >= 2);
    checkField(mobileInput, "errorMobile", mobileInput.value.trim().length >= 6);
    checkField(locationInput, "errorLocation", locationInput.value.trim().length >= 2);

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    checkField(emailInput, "errorEmail", emailPattern.test(emailInput.value.trim()));

    var errorServices = document.getElementById("errorServices");
    if (selectedServices.length === 0) {
      if (errorServices) errorServices.style.display = "block";
      isValid = false;
    } else {
      if (errorServices) errorServices.style.display = "none";
    }

    return isValid;
  }

  // WhatsApp Message Generator
  function buildWhatsAppPayload() {
    var name = clientNameInput.value.trim() || "Prospective Client";
    var org = orgNameInput.value.trim() || "Not Specified";
    var mobile = mobileInput.value.trim() || "Not Specified";
    var location = locationInput.value.trim() || "Not Specified";
    var email = emailInput.value.trim() || "Not Specified";
    var brief = briefInput.value.trim() || "Ready to discuss scope on call.";

    var servicesList = selectedServices.length > 0
      ? selectedServices.map(function (s) { return "• " + s.label; }).join("\n")
      : "• General Project Discussion";

    var message = 
      "🚀 *New Project Inquiry — EVOLIX STUDIO*\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "👤 *Client Name:* " + name + "\n" +
      "🏢 *Organization / Brand:* " + org + "\n" +
      "📱 *Mobile / Phone:* " + mobile + "\n" +
      "📍 *Location:* " + location + "\n" +
      "✉️ *Email Address:* " + email + "\n\n" +
      "🛠️ *Services Required:*\n" + servicesList + "\n\n" +
      "💰 *Estimated Budget:* " + selectedBudget + "\n\n" +
      "📝 *Project Brief:*\n" + brief + "\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "Sent via evolix.agency discovery platform";

    return encodeURIComponent(message);
  }

  // Direct WhatsApp Button Handler
  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener("click", function () {
      var payload = buildWhatsAppPayload();
      var waUrl = "https://wa.me/919098173239?text=" + payload;
      window.open(waUrl, "_blank");
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm()) {
        var firstError = document.querySelector(".input-field-wrapper.has-error input, .input-field-wrapper.has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      // Populate Success Modal
      var name = clientNameInput.value.trim();
      var org = orgNameInput.value.trim();
      var mobile = mobileInput.value.trim();
      var location = locationInput.value.trim();
      var servicesText = selectedServices.map(function (s) { return s.label; }).join(", ");

      if (confirmName) confirmName.textContent = name;

      if (successSummaryBox) {
        successSummaryBox.innerHTML = 
          "<div><strong>Organization:</strong> " + org + "</div>" +
          "<div><strong>Contact:</strong> " + mobile + " (" + location + ")</div>" +
          "<div><strong>Selected Scope:</strong> " + servicesText + "</div>" +
          "<div><strong>Budget:</strong> " + selectedBudget + "</div>";
      }

      var payload = buildWhatsAppPayload();
      var waLink = document.getElementById("successWaLink");
      if (waLink) {
        waLink.href = "https://wa.me/919098173239?text=" + payload;
      }

      // Trigger Success Overlay
      if (successOverlay) {
        successOverlay.classList.add("active");
        if (window.gsap) {
          gsap.fromTo(
            ".success-card-content",
            { scale: 0.9, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
          );
        }
      }
    });
  }

  if (resetBtn && successOverlay) {
    resetBtn.addEventListener("click", function () {
      successOverlay.classList.remove("active");
      if (form) form.reset();
      selectedServices = [];
      servicePills.forEach(function (p) { p.classList.remove("active"); });
      if (customBudgetWrapper) customBudgetWrapper.style.display = "none";
    });
  }

  // ============================================================
  // 3. URL QUERY STRING PRE-SELECTION
  // ============================================================
  function handleUrlServicePreselection() {
    var urlParams = new URLSearchParams(window.location.search);
    var serviceParam = urlParams.get("service");
    if (!serviceParam) return;

    serviceParam = serviceParam.toLowerCase();
    var matchedPill = servicePills.find(function (pill) {
      var sId = pill.getAttribute("data-service-id");
      return sId && (sId.toLowerCase() === serviceParam || serviceParam.indexOf(sId) !== -1);
    });

    if (matchedPill) {
      setTimeout(function () {
        matchedPill.click();
        var formCard = document.getElementById("contactFormCard");
        if (formCard) {
          formCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
    }
  }

  // ============================================================
  // 4. LIVE STUDIO CLOCKS (IST, DUBAI GST, KUWAIT AST)
  // ============================================================
  var istClockEl = document.getElementById("istClock");
  var dubaiClockEl = document.getElementById("dubaiClock");
  var kuwaitClockEl = document.getElementById("kuwaitClock");

  function updateStudioClocks() {
    var now = new Date();

    // IST (India, UTC +5:30)
    var istOptions = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    if (istClockEl) istClockEl.textContent = new Intl.DateTimeFormat("en-US", istOptions).format(now);

    // Dubai (GST, UTC +4:00)
    var dubaiOptions = {
      timeZone: "Asia/Dubai",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    if (dubaiClockEl) dubaiClockEl.textContent = new Intl.DateTimeFormat("en-US", dubaiOptions).format(now);

    // Kuwait (AST, UTC +3:00)
    var kuwaitOptions = {
      timeZone: "Asia/Kuwait",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    if (kuwaitClockEl) kuwaitClockEl.textContent = new Intl.DateTimeFormat("en-US", kuwaitOptions).format(now);
  }

  setInterval(updateStudioClocks, 1000);
  updateStudioClocks();

  // ============================================================
  // INITIALIZE
  // ============================================================
  initFlowField();
  handleUrlServicePreselection();

})();
