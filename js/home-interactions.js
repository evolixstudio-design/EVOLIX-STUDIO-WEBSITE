function initTestimonials() {
  const slider = document.getElementById("testimonialSlider");
  if (!slider) return;

  const track = document.getElementById("testimonialTrack");
  const slides = [...track.querySelectorAll(".ts-slide")];
  const dots = [...slider.querySelectorAll(".ts-dot")];
  const indicator = document.getElementById("tsBracket");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let rotationTimer;
  let scrollTimer;
  let visible = false;
  let pointerActive = false;

  function showActive(index) {
    current = index;
    indicator.textContent = "[ " + String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0") + " ]";
    slides.forEach((slide, i) => {
      if (i !== index && slide.contains(document.activeElement)) track.focus({ preventScroll: true });
      slide.classList.toggle("active", i === index);
      slide.inert = i !== index;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  function scheduleRotation() {
    window.clearTimeout(rotationTimer);
    if (!visible || motion.matches || pointerActive || document.hidden || slider.matches(":hover, :focus-within")) return;
    rotationTimer = window.setTimeout(() => goTo(current + 1), 6500);
  }

  function goTo(index) {
    const next = (index + slides.length) % slides.length;
    const wrap = index < 0 || index >= slides.length;
    showActive(next);
    track.scrollTo({ left: slides[next].offsetLeft, behavior: motion.matches || wrap ? "auto" : "smooth" });
    scheduleRotation();
  }

  slider.querySelector("#tsPrevBtn").addEventListener("click", () => goTo(current - 1));
  slider.querySelector("#tsNextBtn").addEventListener("click", () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  track.addEventListener("keydown", event => {
    if (event.target !== track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    goTo(current + (event.key === "ArrowRight" ? 1 : -1));
  });

  track.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const next = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
      showActive(next);
      scheduleRotation();
    }, 130);
  }, { passive: true });

  track.addEventListener("pointerdown", () => {
    pointerActive = true;
    scheduleRotation();
  });

  function releasePointer() {
    if (!pointerActive) return;
    pointerActive = false;
    scheduleRotation();
  }

  window.addEventListener("pointerup", releasePointer);
  window.addEventListener("pointercancel", releasePointer);
  slider.addEventListener("mouseenter", scheduleRotation);
  slider.addEventListener("mouseleave", scheduleRotation);
  slider.addEventListener("focusin", scheduleRotation);
  slider.addEventListener("focusout", () => window.setTimeout(scheduleRotation, 0));
  document.addEventListener("visibilitychange", scheduleRotation);
  motion.addEventListener("change", scheduleRotation);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      scheduleRotation();
    }, { threshold: 0.1 }).observe(slider);
  } else {
    visible = true;
  }

  showActive(0);
  scheduleRotation();
}

function initContactLaunch() {
  const link = document.querySelector("#ctaSection .launch-card");
  if (!link) return;

  const state = document.documentElement.classList;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  link.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || motion.matches) return;
    event.preventDefault();
    if (state.contains("rocket-launching")) return;

    function navigate() {
      document.body.removeEventListener("animationend", onLaunchEnd);
      window.clearTimeout(fallback);
      try {
        sessionStorage.setItem("evolix-rocket-arrival", String(Date.now()));
      } catch {}
      window.location.assign(link.href);
    }

    function onLaunchEnd(animation) {
      if (animation.target !== document.body || animation.animationName !== "launch-page-out") return;
      navigate();
    }

    const fallback = window.setTimeout(navigate, 900);
    document.body.addEventListener("animationend", onLaunchEnd);
    state.add("rocket-launching");
  });

  window.addEventListener("pageshow", event => {
    if (event.persisted) state.remove("rocket-launching");
  });
}

initTestimonials();
initContactLaunch();
