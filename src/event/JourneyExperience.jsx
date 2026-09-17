import { useLanguage, LanguageSelector } from './i18n';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, ArrowsOutSimple, ArrowsInSimple, HandSwipeRight, ArrowCounterClockwise, Sparkle, LockSimple } from '@phosphor-icons/react';
import { QUESTIONS } from './audit.mjs';
export function JourneyExperience({
  answers,
  active,
  unlocked,
  choose,
  next,
  go,
  replay,
  children
}) {
  const {
    t,
    language
  } = useLanguage();
  const host = useRef(null),
    world = useRef(null),
    jump = useRef(null),
    timer = useRef(null),
    latest = useRef({
      active,
      unlocked
    });
  latest.current = {
    active,
    unlocked
  };
  const [travelling, setTravelling] = useState(false),
    [destination, setDestination] = useState(active),
    [overview, setOverview] = useState(false),
    [ready, setReady] = useState(false),
    [fallback, setFallback] = useState(false);
  const current = Math.min(active, 6),
    question = QUESTIONS[current],
    isDetails = active === 7;
  useEffect(() => {
    let disposed = false;
    import('./world.js').then(({
      createJourneyWorld
    }) => {
      if (disposed) return;
      try {
        world.current = createJourneyWorld(host.current, {
          step: latest.current.active,
          unlocked: latest.current.unlocked,
          onStation: i => jump.current?.(i),
          onReady: () => setReady(true)
        });
      } catch (error) {
        setFallback(true);
        setReady(true);
      }
    }).catch(() => {
      if (!disposed) {
        setFallback(true);
        setReady(true);
      }
    });
    return () => {
      disposed = true;
      world.current?.dispose();
      world.current = null;
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    world.current?.setStep(active);
    setOverview(false);
  }, [active]);
  useEffect(() => {
    world.current?.setUnlocked(unlocked);
  }, [unlocked]);
  const travel = (to, advance = false) => {
    if (travelling || to === active || to > 7) return;
    setOverview(false);
    world.current?.setOverview(false);
    world.current?.setStep(to);
    setDestination(to);
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
      advance ? next(active) : go(to);
      return;
    }
    setTravelling(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    timer.current = setTimeout(() => {
      advance ? next(active) : go(to);
      setTravelling(false);
    }, 1280);
  };
  jump.current = i => {
    if (i <= unlocked) travel(i);
  };
  const select = j => {
    choose(current, j);
    world.current?.acknowledge();
  };
  return <div className={`experience-shell ${travelling ? 'is-travelling' : ''} ${isDetails ? 'at-destination' : ''} ${overview ? 'is-overview' : ''}`}>
    <div className="world-viewport" ref={host} role="region" aria-label={t("Interactive 3D journey. Drag to change the view. Use the numbered buttons to visit unlocked stops.")}>
      {t(!ready && <div className="world-loading"><span className="spinner" />{t(" Preparing your 3D path")}</div>)}
      {t(fallback && <div className="world-fallback"><img src="/assets/event/note/front.webp" alt={t("Your EVOLIX campaign note")} /></div>)}
    </div>
    <div className="world-toolbar"><span className="world-eyebrow"><span />{t(" THE EVOLUTION JOURNEY")}</span><button onClick={() => {
        const value = !overview;
        setOverview(value);
        world.current?.setOverview(value);
      }} aria-pressed={overview} disabled={!ready || fallback || travelling}>{t(overview ? <ArrowsInSimple size={15} /> : <ArrowsOutSimple size={15} />)} {t(overview ? 'Back to my stop' : 'Explore the map')}</button></div>
    <div className="world-story" aria-hidden="true"><span className="story-chapter">{t((travelling ? destination : active) === 7 ? 'YOUR RESULTS' : `QUESTION ${String((travelling ? destination : active) + 1).padStart(2, '0')} / 07`)}</span><h1>{t(travelling ? 'A little further.' : isDetails ? 'Your next chapter.' : question.title)}</h1><span className="story-caption">{t(travelling ? 'Follow the path. Find your possibility.' : isDetails ? 'Seven answers. A clearer way forward.' : 'Every answer opens a new possibility.')}</span></div>
    <div className="world-controls"><span><HandSwipeRight size={17} />{t(" Drag the scene to look around")}</span><button onClick={replay}><ArrowCounterClockwise size={15} />{t(" Replay your note")}</button></div>
    <div className="experience-panel" inert={travelling ? true : undefined}>
      <nav className="experience-progress" aria-label={t("Journey stops")}>{t(QUESTIONS.map((q, i) => <button key={q.area} disabled={i > unlocked || travelling} onClick={() => travel(i)} aria-current={(travelling ? destination : active) === i ? 'step' : undefined} aria-label={t(`Visit stop ${i + 1}: ${q.area}${answers[i] !== null ? ', answered' : ''}`)} className={`${(travelling ? destination : active) === i ? 'current' : ''} ${answers[i] !== null ? 'done' : ''}`}><span>{t(String(i + 1).padStart(2, '0'))}</span></button>))}<span className="progress-finish"><Sparkle size={15} /></span></nav>
      <div className="travel-caption" role="status">{t(travelling && <><span className="travel-number">{t(destination === 7 ? '✓' : String(destination + 1).padStart(2, '0'))}</span><small>{t(destination === 7 ? 'SEVEN ANSWERS COMPLETE' : `QUESTION ${destination + 1} OF 7`)}</small><strong>{t(destination === 7 ? 'Your business snapshot' : QUESTIONS[destination]?.area)}</strong></>)}</div>
      {t(isDetails ? children : <section id={`question-${current}`} className="experience-question" aria-labelledby={`title-${current}`} key={current}>
        <div className="experience-chapter"><span>{t("QUESTION ")}{t(String(current + 1).padStart(2, '0'))} <span>/ 07</span></span><span>{t(question.area)}</span></div>
        <h2 id={`title-${current}`} tabIndex={-1}>{t(question.question)}</h2>
        <fieldset className="experience-answers"><legend className="sr-only">{t(question.question)}</legend>{t(question.answers.map((text, j) => <label className={`experience-answer ${answers[current] === j ? 'selected' : ''}`} key={j}><input type="radio" name={`q${current}`} value={j} checked={answers[current] === j} onChange={() => select(j)} /><span className="choice-key">{t(String.fromCharCode(65 + j))}</span><span className="choice-copy">{t(text)}</span><span className="choice-check">{t(answers[current] === j && <Check size={16} weight="bold" />)}</span></label>))}</fieldset>
        <div className="experience-actions"><button className="experience-back" disabled={current === 0} onClick={() => travel(current - 1)} aria-label={t("Go to the previous stop")}><ArrowLeft size={20} /></button><button className="experience-next" disabled={answers[current] === null || travelling} onClick={() => travel(current + 1, true)}>{t(current === 6 ? 'Submit & see my score' : 'Submit & continue')}<ArrowRight size={20} /></button></div>
        <p className="experience-hint" aria-live="polite">{t(answers[current] !== null ? <><Check size={13} /> {t(question.area)}{t(" captured. Your next stop awaits.")}</> : <>{t("Choose what feels closest to your business today.")}</>)}</p>
      </section>)}
    </div>
    <div className="experience-bottom"><span>{t("EVOLVE WHAT\u2019S NEXT.")}</span><span>{t("7 QUESTIONS \xB7 ABOUT 2 MINUTES")}</span><span>{t("A FRESH PERSPECTIVE, JUST FOR YOU.")}</span></div>
  </div>;
}
