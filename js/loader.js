(function () {
  var loaderEl = document.getElementById('page-loader');
  if (!loaderEl) return;

  var wordEl = document.getElementById('loader-word');
  var pctEl = document.getElementById('loader-pct');
  var barEl = document.getElementById('loader-bar');
  var word = (document.body.getAttribute('data-page-word') || 'EVOLIX').toUpperCase();
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('loader-active');

  var spans = word.split('').map(function (ch) {
    var s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    wordEl.appendChild(s);
    return s;
  });

  var pageReady = false;
  var minTimeElapsed = false;
  var MIN_DISPLAY_MS = 800;

  function tryHide() {
    if (pageReady && minTimeElapsed) hideLoader();
  }

  function hideLoader() {
    if (window.gsap) {
      gsap.to(barEl, { width: '100%', duration: 0.2, ease: 'power1.out' });
      if (pctEl) pctEl.textContent = '100%';
      gsap.delayedCall(0.2, function () {
        loaderEl.classList.add('loader-hidden');
        document.body.classList.remove('loader-active');
      });
    } else {
      if (barEl) barEl.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';
      setTimeout(function () {
        loaderEl.classList.add('loader-hidden');
        document.body.classList.remove('loader-active');
      }, 200);
    }
  }

  if (document.readyState === 'complete') {
    pageReady = true;
  } else {
    window.addEventListener('load', function () {
      pageReady = true;
      tryHide();
    });
  }

  setTimeout(function () {
    minTimeElapsed = true;
    tryHide();
  }, MIN_DISPLAY_MS);

  // Safety fallback in case of slow resources
  setTimeout(function () {
    pageReady = true;
    minTimeElapsed = true;
    hideLoader();
  }, 4000);

  if (reduceMotion || !window.gsap) {
    spans.forEach(function (s) {
      s.style.opacity = '0';
      s.style.transition = 'opacity 0.4s ease';
    });
    requestAnimationFrame(function () {
      spans.forEach(function (s) { s.style.opacity = '1'; });
    });
    animateProgress(0.8);
    return;
  }

  spans.forEach(function (s) {
    gsap.set(s, {
      x: (Math.random() - 0.5) * 240,
      y: (Math.random() - 0.5) * 140,
      rotation: (Math.random() - 0.5) * 160,
      opacity: 0
    });
  });

  gsap.to(spans, {
    x: 0, y: 0, rotation: 0, opacity: 1,
    duration: 0.65,
    stagger: 0.04,
    ease: 'back.out(1.4)',
    onComplete: startIdleLoopIfNeeded
  });

  animateProgress(1.8);

  function animateProgress(duration) {
    var counter = { val: 0 };
    if (window.gsap) {
      gsap.to(counter, {
        val: 96,
        duration: duration,
        ease: 'power1.inOut',
        onUpdate: function () {
          var v = Math.round(counter.val);
          if (pctEl) pctEl.textContent = v + '%';
          if (barEl) barEl.style.width = v + '%';
        }
      });
    }
  }

  function startIdleLoopIfNeeded() {
    (function loop() {
      if (pageReady && minTimeElapsed) return;
      if (!window.gsap) return;
      gsap.to(spans, {
        x: function () { return (Math.random() - 0.5) * 24; },
        y: function () { return (Math.random() - 0.5) * 14; },
        rotation: function () { return (Math.random() - 0.5) * 16; },
        duration: 0.4,
        stagger: 0.025,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
        onComplete: function () {
          if (!(pageReady && minTimeElapsed)) {
            gsap.delayedCall(0.3, loop);
          }
        }
      });
    })();
  }
})();
