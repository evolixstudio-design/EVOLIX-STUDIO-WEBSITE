/**
 * @name: DynamicText
 * @description: KokonutUI Dynamic Text Cycler for "Let's build something" CTA
 * Smooth, legible, rhythmic phrase transitions triggered on scroll & continuously readable.
 */
(function () {
  "use strict";

  var phrases = [
    "Something Iconic.",
    "Something Bold.",
    "The Future.",
    "Next-Gen Tech.",
    "High-Impact Systems.",
    "Something Legendary."
  ];

  var DISPLAY_DURATION = 1650; // 1.65s per phrase for comfortable readability
  var TRANSITION_DURATION = 350; // 350ms smooth slide/fade

  function initDynamicText() {
    var ctaSections = Array.prototype.slice.call(
      document.querySelectorAll(".cta-headline-dynamic, .dynamic-cta-section")
    );
    if (ctaSections.length === 0) return;

    ctaSections.forEach(function (section) {
      var wordEl = section.querySelector(".dynamic-changing-word");
      if (!wordEl) return;

      var currentIndex = 0;
      var intervalId = null;
      var isTransitioning = false;

      function nextPhrase() {
        if (isTransitioning || !wordEl) return;
        isTransitioning = true;

        // 1. Slide up and fade out current word
        wordEl.classList.add("rolling-out");

        setTimeout(function () {
          // 2. Change text to next phrase (looping continuously)
          currentIndex = (currentIndex + 1) % phrases.length;
          wordEl.textContent = phrases[currentIndex];

          // 3. Prepare to enter from bottom
          wordEl.classList.remove("rolling-out");
          wordEl.classList.add("rolling-in");

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              // 4. Slide into center position
              wordEl.classList.remove("rolling-in");

              setTimeout(function () {
                isTransitioning = false;
              }, TRANSITION_DURATION);
            });
          });
        }, TRANSITION_DURATION * 0.7);
      }

      function startCycle() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextPhrase, DISPLAY_DURATION);
      }

      function stopCycle() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }

      function resetToIconic() {
        stopCycle();
        currentIndex = 0;
        isTransitioning = false;
        wordEl.classList.remove("rolling-out", "rolling-in");
        wordEl.textContent = phrases[0];
      }

      // Intersection Observer — activate when section is centered in viewport
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                if (!intervalId) {
                  // Ensure starting with phrase 0 "Something Iconic."
                  wordEl.textContent = phrases[0];
                  currentIndex = 0;
                  startCycle();
                }
              } else {
                resetToIconic();
              }
            });
          },
          { 
            // Shrink top and bottom trigger bounds by 25% each, so it only fires when in the middle of the screen
            rootMargin: "-25% 0px -25% 0px",
            threshold: 0.1
          }
        );

        observer.observe(section);
      } else {
        startCycle();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDynamicText);
  } else {
    initDynamicText();
  }
})();
