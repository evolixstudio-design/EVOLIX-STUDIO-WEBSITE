// ============================================================
// EVOLIX — 3D WORD ASSEMBLING PAGE LOADER
// Letters scatter and assemble into the page word with 3D physics
// ============================================================

(function () {
  "use strict";

  var loaderEl = document.getElementById("page-loader");
  if (!loaderEl) return;

  var wordEl = document.getElementById("loader-word");
  var pctEl = document.getElementById("loader-pct");
  var barEl = document.getElementById("loader-bar");
  var word = (document.body.getAttribute("data-page-word") || "EVOLIX").toUpperCase();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("loader-active");

  if (wordEl) {
    wordEl.innerHTML = "";
  }

  var spans = word.split("").map(function (ch) {
    var s = document.createElement("span");
    s.textContent = ch === " " ? "\u00A0" : ch;
    if (wordEl) wordEl.appendChild(s);
    return s;
  });

  var pageReady = false;
  var minTimeElapsed = false;
  var MIN_DISPLAY_MS = 480;

  function tryHide() {
    if (pageReady && minTimeElapsed) {
      hideLoader();
    }
  }

  function hideLoader() {
    if (window.gsap) {
      gsap.to(barEl, { width: "100%", duration: 0.18, ease: "power1.out" });
      if (pctEl) pctEl.textContent = "100%";

      gsap.delayedCall(0.18, function () {
        loaderEl.classList.add("loader-hidden");
        document.body.classList.remove("loader-active");
      });
    } else {
      if (barEl) barEl.style.width = "100%";
      if (pctEl) pctEl.textContent = "100%";
      setTimeout(function () {
        loaderEl.classList.add("loader-hidden");
        document.body.classList.remove("loader-active");
      }, 180);
    }
  }

  if (document.readyState === "complete") {
    pageReady = true;
  } else {
    window.addEventListener("load", function () {
      pageReady = true;
      tryHide();
    });
  }

  setTimeout(function () {
    minTimeElapsed = true;
    tryHide();
  }, MIN_DISPLAY_MS);

  // Safety fallback
  setTimeout(function () {
    pageReady = true;
    minTimeElapsed = true;
    hideLoader();
  }, 3000);

  if (reduceMotion || !window.gsap) {
    spans.forEach(function (s) {
      s.style.opacity = "0";
      s.style.transition = "opacity 0.3s ease";
    });
    requestAnimationFrame(function () {
      spans.forEach(function (s) { s.style.opacity = "1"; });
    });
    animateProgress(0.6);
    return;
  }

  // 3D scattered initial state for assembling letters
  spans.forEach(function (s) {
    gsap.set(s, {
      x: (Math.random() - 0.5) * 220,
      y: (Math.random() - 0.5) * 120,
      rotation: (Math.random() - 0.5) * 140,
      scale: 0.7 + Math.random() * 0.5,
      opacity: 0
    });
  });

  // Assembling animation
  gsap.to(spans, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    duration: 0.58,
    stagger: 0.035,
    ease: "back.out(1.5)"
  });

  animateProgress(0.85);

  function animateProgress(duration) {
    var counter = { val: 0 };
    if (window.gsap) {
      gsap.to(counter, {
        val: 98,
        duration: duration,
        ease: "power1.inOut",
        onUpdate: function () {
          var v = Math.round(counter.val);
          if (pctEl) pctEl.textContent = v + "%";
          if (barEl) barEl.style.width = v + "%";
        }
      });
    }
  }
})();
