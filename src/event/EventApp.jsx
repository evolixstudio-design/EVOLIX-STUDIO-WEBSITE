import { useLanguage, LanguageSelector } from './i18n';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, ArrowUpRight, ArrowCounterClockwise, Check, CheckCircle, Clock, ShieldCheck, Sparkle, LockSimple, WhatsappLogo, X, Lightbulb, FlagCheckered, Globe } from '@phosphor-icons/react';
import { QUESTIONS, INDUSTRIES, calculateAudit, validateLead, whatsappUrl } from './audit.mjs';
import { LANGUAGES } from './translations.mjs';
import { Note, Connector, ProjectCard, ScoreRing, Progress } from './components';
import { WEBSITE_URL } from './config';
import { JourneyExperience } from './JourneyExperience';
import { BrandMark, LOGO_URL } from './BrandMark';
const STORAGE = 'evolix-audit-v1';
const blankLead = {
  name: '',
  business: '',
  phone: '+91 ',
  industry: '',
  website: '',
  consent: false
};
const newId = () => crypto.randomUUID();
function readState() {
  try {
    const state = JSON.parse(sessionStorage.getItem(STORAGE));
    if (!state || !Array.isArray(state.answers) || state.answers.length !== 7 || state.answers.some(a => a !== null && (!Number.isInteger(a) || a < 0 || a > 3))) return null;
    if (!Number.isInteger(state.unlocked) || state.unlocked < 0 || state.unlocked > 7 || state.answers.slice(0, state.unlocked).some(a => a === null)) return null;
    if (!Number.isInteger(state.active) || state.active < 0 || state.active > state.unlocked) return null;
    if (state.result) calculateAudit(state.answers);
    return state;
  } catch {
    return null;
  }
}
function scrollToId(id, focus = true) {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === 'results') el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });else window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  if (focus) el.querySelector('[tabindex="-1"]')?.focus({
    preventScroll: true
  });
}
export function App() {
  const {
    t,
    language,
    setLanguage
  } = useLanguage();
  const saved = useRef(readState()).current;
  const [answers, setAnswers] = useState(saved?.answers || Array(7).fill(null));
  const [unlocked, setUnlocked] = useState(saved?.unlocked || 0);
  const [active, setActive] = useState(saved?.active || 0);
  const [lead, setLead] = useState(saved?.lead || blankLead);
  const [result, setResult] = useState(saved?.result ? calculateAudit(saved.answers) : null);
  const [sessionId, setSessionId] = useState(saved?.sessionId || newId);
  const [submissionId, setSubmissionId] = useState(saved?.submissionId || newId);
  const [intro, setIntro] = useState(!saved && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [replay, setReplay] = useState(0);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [revealing, setRevealing] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [languagePrompt, setLanguagePrompt] = useState(false);
  const tracked = useRef(new Set(saved?.events || []));
  const completed = answers.filter(a => a !== null).length;
  const track = useCallback(event => {
    if (tracked.current.has(event)) return;
    tracked.current.add(event);
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        event
      }),
      keepalive: true
    }).catch(() => {});
    window.dispatchEvent(new CustomEvent('evolix:analytics', {
      detail: {
        event
      }
    }));
  }, [sessionId]);
  useEffect(() => {
    track('audit_viewed');
  }, [track]);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify({
        answers,
        unlocked,
        active,
        lead,
        result: Boolean(result),
        sessionId,
        submissionId,
        events: [...tracked.current]
      }));
    } catch {}
  }, [answers, unlocked, active, lead, result, sessionId, submissionId]);
  useEffect(() => {
    if (saved) requestAnimationFrame(() => scrollToId(saved.result ? 'results' : saved.active === 7 ? 'details' : `question-${Math.min(saved.active || 0, saved.unlocked)}`, false));
  }, []);
  useEffect(() => {
    document.body.style.overflow = intro || privacy || resetOpen || revealing || languagePrompt ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [intro, privacy, resetOpen, revealing, languagePrompt]);
  useEffect(() => {
    const listener = () => {
      const hash = location.hash;
      if (hash === '#result' && result) scrollToId('results');else if (hash === '#details' && unlocked === 7 && !result) {
        setActive(7);
        scrollToId('details');
      } else {
        const match = hash.match(/^#q([1-7])$/);
        if (match && !result) {
          const i = Number(match[1]) - 1;
          if (i <= unlocked) {
            setActive(i);
            scrollToId(`question-${i}`);
          }
        }
      }
    };
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [unlocked, result]);
  const finishIntro = useCallback(() => {
    setIntro(false);
    track('audit_started');
    if (!result) {
      if (!sessionStorage.getItem('evolix-lang-prompted')) {
        setLanguagePrompt(true);
        sessionStorage.setItem('evolix-lang-prompted', 'true');
      }
      requestAnimationFrame(() => window.scrollTo({
        top: 0,
        behavior: 'instant'
      }));
    }
  }, [track, active, result]);
  const go = i => {
    if (result || i > unlocked) return;
    setActive(i);
    history.pushState(null, '', i === 7 ? '#details' : `#q${i + 1}`);
    requestAnimationFrame(() => scrollToId(i === 7 ? 'details' : `question-${i}`));
  };
  const choose = (i, answer) => {
    track('audit_started');
    setAnswers(prev => prev.map((a, j) => j === i ? answer : a));
    setSubmissionId(newId());
  };
  const next = i => {
    if (answers[i] === null) return;
    track(`question_${i + 1}_completed`);
    setUnlocked(Math.max(unlocked, i + 1));
    if (i === 6) track('lead_form_viewed');
    setActive(i + 1);
    history.pushState(null, '', i === 6 ? '#details' : `#q${i + 2}`);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(i === 6 ? 'details' : `question-${i + 1}`)));
  };
  const changeLead = (key, value) => {
    setLead({
      ...lead,
      [key]: value
    });
    setSubmissionId(newId());
  };
  const submit = async e => {
    e.preventDefault();
    if (busyRef.current) return;
    const checked = validateLead(lead);
    setErrors(checked.errors);
    if (!checked.valid) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      // 1. Calculate result instantly on frontend
      const result = calculateAudit(answers);
      
      // 2. Start background save (fire and forget)
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          sessionId,
          answers,
          lead: checked.lead
        })
      }).catch(err => console.error("Background save failed:", err));

      // 3. Play animation and show result instantly
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setRevealing(true);
        await new Promise(resolve => setTimeout(resolve, 1400));
      }
      setRevealing(false);
      setLead(checked.lead);
      setResult(result);
      track('lead_form_submitted');
      track('score_revealed');
      history.pushState(null, '', '#result');
      requestAnimationFrame(() => scrollToId('results'));
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  };
  const restart = () => {
    setAnswers(Array(7).fill(null));
    setLead(blankLead);
    setUnlocked(0);
    setActive(0);
    setResult(null);
    setSessionId(newId());
    setSubmissionId(newId());
    tracked.current = new Set();
    setResetOpen(false);
    setErrors({});
    history.replaceState(null, '', '/event');
    requestAnimationFrame(() => scrollToId('question-0'));
  };
  const edit = () => {
    setResult(null);
    setSubmissionId(newId());
    setActive(0);
    history.pushState(null, '', '#q1');
    requestAnimationFrame(() => scrollToId('question-0'));
  };
  const closeModal = () => {
    setPrivacy(false);
    setResetOpen(false);
  };
  return <>
    <a className="skip-content" href="#main">{t("Skip to the audit")}</a>
    <header className="site-header"><a className="brand-link" href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" aria-label={t("Visit EVOLIX Studio")}><BrandMark /></a><span className="header-center">{t("BUSINESS EVOLUTION AUDIT")}</span><LanguageSelector /></header>
    {t(!result && <div className="mobile-progress"><span>{t(String(Math.min(active + 1, 7)).padStart(2, '0'))} <span>/ 07</span></span><Progress answers={answers} active={active} go={go} compact /><span>{t(completed === 7 ? 'COMPLETE' : 'YOUR JOURNEY')}</span></div>)}
    <main id="main" className={result ? 'results-layout' : 'experience-layout'}>
      {t(!result ? <JourneyExperience answers={answers} active={active} unlocked={unlocked} choose={choose} next={next} go={go} replay={() => {
        setReplay(v => v + 1);
        setIntro(true);
      }}>
        {t(active === 7 && <section id="details" data-step={7} className="details-section" aria-labelledby="details-title"><div className="station"><span className="station-number"><FlagCheckered size={22} /></span><div><span className="eyebrow">{t("THE FINAL STEP")}</span><span>{t("Your business snapshot")}</span></div><span className="complete-tag"><Check size={13} /> 7 / 7</span></div><div className="question-card lead-card"><span className="eyebrow">{t("ALL SEVEN ANSWERS. ALL YOUR POTENTIAL.")}</span><h2 id="details-title" tabIndex={-1}>{t("Your EVOLIX Score")}<br />{t("is ready.")}</h2><p className="muted">{t("Add your business details to reveal your score and three next steps.")}</p><form onSubmit={submit} noValidate><div className="form-grid">{t([['name', 'Your name', 'Your full name', 'name'], ['business', 'Business name', 'Your business name', 'organization'], ['phone', 'WhatsApp number', '+91 98765 43210', 'tel']].map(([key, label, placeholder, autoComplete]) => <div className={`field field-${key}`} key={key}><label htmlFor={key}>{t(label)} <span>*</span></label><input id={key} name={key} type={key === 'phone' ? 'tel' : 'text'} autoComplete={autoComplete} value={lead[key]} placeholder={t(placeholder)} maxLength={key === 'name' ? 80 : key === 'business' ? 120 : 24} required aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} onChange={e => changeLead(key, e.target.value)} />{t(errors[key] && <span className="field-error" id={`${key}-error`}>{t(errors[key])}</span>)}</div>))}<div className="field"><label htmlFor="industry">{t("Industry ")}<span>*</span></label><select id="industry" value={lead.industry} required aria-invalid={Boolean(errors.industry)} aria-describedby={errors.industry ? 'industry-error' : undefined} onChange={e => changeLead('industry', e.target.value)}><option value="">{t("Select your industry")}</option>{t(INDUSTRIES.map(x => <option value={x} key={x}>{t(x)}</option>))}</select>{t(errors.industry && <span className="field-error" id="industry-error">{t(errors.industry)}</span>)}</div><div className="field full"><label htmlFor="website">{t("Website / Instagram ")}<span className="optional">{t("Optional")}</span></label><input id="website" value={lead.website} maxLength={250} placeholder={t("yourbusiness.com or @yourbusiness")} aria-invalid={Boolean(errors.website)} onChange={e => changeLead('website', e.target.value)} />{t(errors.website && <span className="field-error">{t(errors.website)}</span>)}</div></div><label className="consent"><input type="checkbox" checked={lead.consent} aria-invalid={Boolean(errors.consent)} onChange={e => changeLead('consent', e.target.checked)} /><span>{t("I agree to receive my audit result and relevant business recommendations from EVOLIX.")}</span></label>{t(errors.consent && <p className="field-error">{t(errors.consent)}</p>)}<p className="privacy-note"><LockSimple size={13} />{t(" Your details are collected by EVOLIX Studio. ")}<button type="button" onClick={() => setPrivacy(true)}>{t("How we use them")}</button></p>{t(errors.form && <p className="submit-error" role="alert">{t(errors.form)}</p>)}<button className="primary-button full-width" type="submit" disabled={busy}>{t(busy ? 'Preparing your roadmap…' : 'Reveal my EVOLIX Score')}{t(busy ? <span className="spinner" /> : <ArrowRight size={20} />)}</button></form><button className="back-button form-back" onClick={() => go(6)}><ArrowLeft size={16} />{t(" Review my last answer")}</button></div></section>)}
      </JourneyExperience> : <section id="results" aria-labelledby="result-title"><div className="result-top"><span className="eyebrow"><CheckCircle size={16} />{t(" YOUR BUSINESS SNAPSHOT")}</span><button className="text-button" onClick={edit}><ArrowLeft size={15} />{t(" Review answers")}</button></div><div className="result-hero"><div className="result-words"><span className="result-greeting">{t("A fresh perspective for ")}{lead.business}.</span><h1 id="result-title" tabIndex={-1}>{t(result.band.headline)}</h1><p>{t(result.band.copy)}</p><span className="band-pill"><span className="live-dot" />{t(result.band.label)}</span></div><div className="score-panel"><ScoreRing score={result.score} /><p>{t("Self-assessment \xB7 Maximum achievable score: 85")}</p></div></div><div className="snapshot-grid"><div><span className="eyebrow">{t("YOUR STRONGEST AREA")}</span><strong>{t(QUESTIONS[result.strongest].area)}</strong><span>{t("A strength to build on.")}</span></div><div><span className="eyebrow">{t(result.allStrong ? 'YOUR NEXT OPPORTUNITY' : 'YOUR BIGGEST OPPORTUNITY')}</span><strong>{t(result.allStrong ? 'Conversion intelligence' : QUESTIONS[result.opportunities[0]].area)}</strong><span>{t(result.allStrong ? 'Explore the next advantage.' : 'A useful place to start.')}</span></div><div><span className="eyebrow">{t(result.allStrong ? 'ANOTHER NEXT STEP' : 'SECOND OPPORTUNITY')}</span><strong>{t(result.allStrong ? 'Connected reporting' : QUESTIONS[result.opportunities[1]].area)}</strong><span>{t("Keep the momentum going.")}</span></div></div><details className="breakdown"><summary>{t("See your seven-area breakdown ")}<span>+</span></summary><div>{t(QUESTIONS.map((q, i) => <div className="area-bar" key={q.area}><span>{t(q.area)}</span><meter min="0" max="100" value={result.strengths[i]}>{t(result.strengths[i])}%</meter><strong>{t(result.strengths[i])}%</strong></div>))}</div><p>{t("Areas use the same answer-level scale for fair comparison. Overall points follow the weighted audit and are capped at 85.")}</p></details><div className="recommendations-heading"><div><span className="eyebrow">{t("YOUR PERSONAL EVOLUTION ROADMAP")}</span><h2>{t("Three moves.")}<br /><em>{t("More possibility.")}</em></h2></div><p>{t("Based on your answers, here\u2019s where you could go next\u2014and how we can help you get there.")}</p></div><div className="recommendations">{t(result.recommendations.map((rec, i) => <article className="recommendation" key={rec.title}><div className="recommendation-text"><span className="recommendation-number">0{t(i + 1)}</span><span className="eyebrow">{t(rec.area)}</span><h3>{t(rec.title)}</h3><p>{t(rec.copy)}</p><div className="how-we-help"><Sparkle size={18} /><p>{t(rec.help)}</p></div></div><ProjectCard projectKey={rec.project} industry={lead.industry} /></article>))}</div><section className="journey-cta"><span className="eyebrow">{t("YOUR BUSINESS ISN\u2019T FINISHED EVOLVING.")}</span><h2>{t("Let\u2019s write your")}<br /><em>{t("next chapter.")}</em></h2><p>{t("Turn your score into a practical roadmap.")}<br />{t("Start a conversation with the people who can help.")}</p><a className="primary-button whatsapp-button" href={whatsappUrl(result, lead, language)} target="_blank" rel="noopener noreferrer" onClick={() => {
            track('roadmap_cta_clicked');
            track('whatsapp_opened');
          }}><WhatsappLogo size={22} />{t(" Start your journey with EVOLIX")}<ArrowUpRight size={18} /></a><a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="website-button">{t("Visit our website ")}<ArrowUpRight size={16} /></a><span className="cta-footnote">{t("Your message opens in WhatsApp. You choose when to send.")}</span></section><div className="restart-row"><button className="text-button" onClick={() => setResetOpen(true)}><ArrowCounterClockwise size={16} />{t(" Start a new audit")}</button></div></section>)}
    </main>
    <footer className="site-footer"><div><a className="brand-link" href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" aria-label={t("Visit EVOLIX Studio")}><BrandMark /></a><span>{t("Evolve what\u2019s next.")}</span></div><p>{t("Your EVOLIX Score is a quick self-assessment based on your answers, not a certified business evaluation. Scores are capped at 85/100.")}</p><button className="text-button" onClick={() => setPrivacy(true)}>{t("Privacy")}</button><button className="text-button mobile-replay" onClick={() => {
        setReplay(v => v + 1);
        setIntro(true);
      }}>{t("Replay intro")}</button></footer>
    {t(revealing && <div className="score-reveal" role="status" aria-live="polite"><div className="reveal-orbit" aria-hidden="true">{t(Array.from({
          length: 7
        }, (_, i) => <span key={i} style={{
          '--i': i
        }} />))}<img className="reveal-logo" src={LOGO_URL} width="70" height="86" alt={t("")} /></div><span className="eyebrow">{t("SEVEN ANSWERS. ONE CLEARER PICTURE.")}</span><h2>{t("Your next chapter")}<br /><em>{t("is taking shape.")}</em></h2><p>{t("Bringing your score and recommendations together")}</p></div>)}
    {t(intro && <div className="intro-overlay" role="dialog" aria-modal="true" aria-label={t("Welcome to your EVOLIX journey")} onKeyDown={e => {
      if (e.key === 'Escape') finishIntro();
      if (e.key === 'Tab') e.preventDefault();
    }}><div className="intro-top"><BrandMark /><button className="skip-intro" autoFocus onClick={finishIntro}>{t("Skip intro ")}<ArrowRight size={17} /></button></div><div className="intro-heading"><span className="eyebrow">{t("ONE SMALL MOMENT OF CURIOSITY.")}</span><h2>{t("A whole new")}<br /><em>{t("perspective.")}</em></h2></div><Note key={replay} intro onDone={finishIntro} /><div className="intro-bottom"><span>{t("YOUR NEXT CHAPTER IS ABOUT TO BEGIN")}</span><div className="intro-progress" /></div></div>)}
    {t((privacy || resetOpen) && <div className="modal-backdrop" onClick={e => {
      if (e.target === e.currentTarget) closeModal();
    }}><dialog open className="info-modal" aria-modal="true" aria-labelledby="modal-title" onKeyDown={e => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab') {
          const buttons = [...e.currentTarget.querySelectorAll('button,a')];
          const first = buttons[0],
            last = buttons.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }}><button autoFocus className="modal-close" onClick={closeModal} aria-label={t("Close dialog")}><X size={22} /></button>{t(privacy ? <><ShieldCheck size={32} /><h2 id="modal-title">{t("Your details, with care.")}</h2><p>{t("EVOLIX Studio collects your name, business details, WhatsApp number, answers and consent to prepare your audit result and discuss relevant recommendations with you.")}</p><p>{t("Your information is saved when you reveal your score. Your in-progress answers and contact details stay in this browser tab so you can continue after a refresh.")}</p><p>{t("We record basic audit milestones to understand whether this experience is useful. Your contact details are not included in those events.")}</p><p>{t("For access, correction or deletion, contact ")}<a href="mailto:evolixstudio@gmail.com">evolixstudio@gmail.com</a>.</p></> : <><ArrowCounterClockwise size={30} /><h2 id="modal-title">{t("Start a fresh chapter?")}</h2><p>{t("This clears your answers and result from this browser tab. Your previously submitted audit remains with EVOLIX.")}</p><button className="primary-button full-width" onClick={restart}>{t("Start a new audit ")}<ArrowRight size={17} /></button><button className="text-button" onClick={closeModal}>{t("Keep my result")}</button></>)}</dialog></div>)}
    {t(languagePrompt && <div className="modal-backdrop" onClick={e => {
      if (e.target === e.currentTarget) setLanguagePrompt(false);
    }}><dialog open className="info-modal" aria-modal="true" aria-labelledby="lang-modal-title" style={{ textAlign: 'center' }}>
        <Globe size={48} weight="light" style={{ margin: '0 auto 1rem', color: '#7950a9' }} />
        <h2 id="lang-modal-title">Choose your language</h2>
        <p>You can change this later from the menu.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
          {LANGUAGES.map(lang => (
            <button key={lang.code} className={`primary-button ${language === lang.code ? '' : 'outline'}`} onClick={() => { 
              setLanguage(lang.code);
              setLanguagePrompt(false);
            }}>
              {lang.label}
            </button>
          ))}
        </div>
    </dialog></div>)}
  </>;
}
