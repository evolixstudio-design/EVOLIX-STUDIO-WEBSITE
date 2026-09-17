import { useLanguage, LanguageSelector } from './i18n';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ArrowUpRight, ArrowCounterClockwise } from '@phosphor-icons/react';
import { PROJECTS } from './audit.mjs';
import { NOTE_ARTWORK } from './config';
export function Note({
  intro = false,
  onDone,
  className = ''
}) {
  const {
    t,
    language
  } = useLanguage();
  const host = useRef(null);
  const done = useRef(onDone);
  done.current = onDone;
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    let canceled = false,
      cleanup;
    import('./scene.js').then(({
      mountNote
    }) => {
      if (canceled) return;
      try {
        cleanup = mountNote(host.current, {
          intro,
          onDone: () => done.current?.()
        });
      } catch {
        setFallback(true);
      }
    }).catch(() => !canceled && setFallback(true));
    // The audit always opens, including on blocked WebGL or a slow module download.
    const timer = intro ? setTimeout(() => done.current?.(), 9000) : null;
    return () => {
      canceled = true;
      cleanup?.();
      clearTimeout(timer);
    };
  }, [intro]);
  return <div ref={host} className={`note-scene ${className}`} aria-hidden="true">{t(fallback && <div className="note-fallback real-note"><img src={NOTE_ARTWORK.back} alt={t("")} /><img src={NOTE_ARTWORK.front} alt={t("")} /></div>)}</div>;
}

// A functional progress connector: the travelling marker follows the route to the next question.
export function Connector({
  complete = false,
  next,
  onClick,
  direction = 1
}) {
  const {
    t,
    language
  } = useLanguage();
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const started = performance.now();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = now => {
      const width = canvas.clientWidth,
        height = canvas.clientHeight,
        dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      const left = width * .25,
        right = width * .75;
      const x0 = direction === 1 ? left : right,
        x1 = direction === 1 ? right : left;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.bezierCurveTo(x0, height * .65, x1, height * .35, x1, height);
      ctx.strokeStyle = complete ? '#a58abc' : '#d9d0e1';
      ctx.lineWidth = 2;
      ctx.setLineDash(complete ? [] : [5, 7]);
      ctx.stroke();
      if (complete) {
        const t = reduced ? 1 : Math.min((now - started) / 800, 1),
          u = 1 - t;
        const x = u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1;
        const y = 3 * u * u * t * height * .65 + 3 * u * t * t * height * .35 + t * t * t * height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#7950a9';
        ctx.fill();
        if (t < 1) raf = requestAnimationFrame(draw);
      }
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [complete, direction]);
  return <div className={`connector ${complete ? 'complete' : ''}`}><canvas ref={ref} aria-hidden="true" />{t(next && <button type="button" onClick={onClick} className="connector-label">{t(complete ? 'KEEP EVOLVING' : 'UP NEXT')} <span>{t(next)}</span><ArrowRight size={15} /></button>)}</div>;
}
export function ProjectCard({
  projectKey,
  industry
}) {
  const {
    t,
    language
  } = useLanguage();
  if (projectKey === 'website') {
    if (['Retail', 'E-commerce', 'Healthcare', 'Food & Beverage'].includes(industry)) projectKey = 'retail';
    if (['Trading', 'Construction', 'Manufacturing', 'Export/Import'].includes(industry)) projectKey = 'trading';
  }
  const project = PROJECTS[projectKey];
  const [failed, setFailed] = useState(false);
  return <div className="project-card"><div className="project-image">{t(!failed ? <img src={project.image} alt={`${project.name} — ${t("EVOLIX project preview")}`} loading="lazy" onError={() => setFailed(true)} /> : <div className="image-unavailable"><strong>{t(project.name)}</strong><span>{t("See the project on our portfolio")}</span></div>)}<span className="project-caption">{t("MADE BY EVOLIX")}</span></div><div className="project-info"><small>{t(project.type)}</small><a href={project.url} target="_blank" rel="noopener noreferrer">{t(project.name)}<ArrowUpRight size={20} /></a>{t(project.live && <a className="live-link" href={project.live} target="_blank" rel="noopener noreferrer">{t("Visit live project ")}<ArrowUpRight size={13} /></a>)}</div></div>;
}
export function ScoreRing({
  score
}) {
  const {
    t,
    language
  } = useLanguage();
  const [display, setDisplay] = useState(0);
  const medal = useRef(null);
  const [hasMedal, setHasMedal] = useState(false);
  useEffect(() => {
    let disposed = false,
      cleanup;
    import('./world.js').then(({
      createScoreMedal
    }) => {
      if (disposed) return;
      try {
        cleanup = createScoreMedal(medal.current, score);
        setHasMedal(true);
      } catch {}
    }).catch(() => {});
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [score]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(score);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = now => {
      const t = Math.max(0, Math.min((now - start) / 1100, 1));
      setDisplay(Math.round(score * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);
  return <div className={`score-ring ${hasMedal ? 'has-medal' : ''}`} role="img" aria-label={t(`Your EVOLIX Score is ${score} out of 100. Audit maximum 85.`)}><div className="score-medal" ref={medal} aria-hidden="true" />{t(!hasMedal && <svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="106" className="score-track" /><circle cx="120" cy="120" r="106" className="score-fill" strokeDasharray={`${display / 100 * 666} 666`} /></svg>)}<div className="score-digits" aria-hidden="true"><small>{t("YOUR EVOLIX SCORE")}</small><strong>{t(display)}<span>/100</span></strong><span className="score-caption">{t("A starting point for what\u2019s next.")}</span></div></div>;
}
export function Progress({
  answers,
  active,
  go,
  compact = false
}) {
  const {
    t,
    language
  } = useLanguage();
  const labels = ['Brand', 'Presence', 'Leads', 'Sales', 'Customers', 'Operations', 'Scale'];
  return <nav className={compact ? 'progress-compact' : 'progress-steps'} aria-label={t("Audit progress")}>{t(labels.map((label, i) => <button key={label} type="button" className={`${answers[i] !== null ? 'answered' : ''} ${i === active ? 'current' : ''}`} disabled={i > 0 && answers.slice(0, i).some(a => a === null)} onClick={() => go(i)} aria-label={t(`Question ${i + 1}: ${label}${answers[i] !== null ? ', answered' : ''}`)} aria-current={i === active ? 'step' : undefined}><span>{t(answers[i] !== null ? <Check size={compact ? 12 : 14} weight="bold" /> : String(i + 1).padStart(2, '0'))}</span>{t(!compact && <><span>{t(label)}</span><span className="step-state">{t(i === active ? 'YOU ARE HERE' : answers[i] !== null ? 'DONE' : '')}</span></>)}</button>))}</nav>;
}
