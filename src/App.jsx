import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, X, CarFront, Cog, Fan, Settings2, Split, Disc3, Navigation2, ArrowDownUp, Thermometer, Wind, Cpu, Zap, GraduationCap, Wrench, CircleDot, Check, RotateCcw, Keyboard } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import ChassisViewer3D from './components/ChassisViewer3D.jsx';
import HeroCar from './components/HeroCar.jsx';
import EngineSimulator from './components/EngineSimulator.jsx';
import TransmissionSimulator from './components/TransmissionSimulator.jsx';
import DifferentialSimulator from './components/DifferentialSimulator.jsx';
import BrakeSimulator from './components/BrakeSimulator.jsx';
import SteeringSimulator from './components/SteeringSimulator.jsx';
import TurbochargerSimulator from './components/TurbochargerSimulator.jsx';
import SuspensionSimulator from './components/SuspensionSimulator.jsx';
import TyreGripSimulator from './components/TyreGripSimulator.jsx';
import CoolingLubricationSimulator from './components/CoolingLubricationSimulator.jsx';
import AerodynamicsSimulator from './components/AerodynamicsSimulator.jsx';
import ElectricalEcuSimulator from './components/ElectricalEcuSimulator.jsx';
import AudioEngineSynth from './components/AudioEngineSynth.jsx';
import EvVsIceComparison from './components/EvVsIceComparison.jsx';
import CarQuiz from './components/CarQuiz.jsx';
import AddonGarage from './components/AddonGarage.jsx';
import { lessons } from './data/lessons.js';
import { useIsMobile } from './lib/useMediaQuery.js';
import { useProgress, markVisited, clearProgress } from './lib/progress.js';

const TOPICS = [
  { id: 'chassis', group: 'Start here', component: ChassisViewer3D },
  { id: 'engine', group: 'Making power', component: EngineSimulator },
  { id: 'turbo', group: 'Making power', component: TurbochargerSimulator },
  { id: 'transmission', group: 'Making power', component: TransmissionSimulator },
  { id: 'differential', group: 'Making power', component: DifferentialSimulator },
  { id: 'brakes', group: 'On the road', component: BrakeSimulator },
  { id: 'steering', group: 'On the road', component: SteeringSimulator },
  { id: 'suspension', group: 'On the road', component: SuspensionSimulator },
  { id: 'grip', group: 'On the road', component: TyreGripSimulator },
  { id: 'cooling', group: 'Supporting systems', component: CoolingLubricationSimulator },
  { id: 'aero', group: 'Supporting systems', component: AerodynamicsSimulator },
  { id: 'electronics', group: 'Supporting systems', component: ElectricalEcuSimulator },
  { id: 'addons', group: 'Extensions', component: AddonGarage },
  { id: 'ev', group: 'Review', component: EvVsIceComparison },
  { id: 'quiz', group: 'Review', component: CarQuiz },
].map((topic, index) => ({ ...topic, ...lessons[topic.id], number: String(index + 1).padStart(2, '0') }));
const ICONS = { chassis: CarFront, engine: Cog, turbo: Fan, transmission: Settings2, differential: Split, brakes: Disc3, steering: Navigation2, suspension: ArrowDownUp, grip: CircleDot, cooling: Thermometer, aero: Wind, electronics: Cpu, addons: Wrench, ev: Zap, quiz: GraduationCap };
TOPICS.forEach(topic => { topic.Icon = ICONS[topic.id]; });
const GROUPS = [...new Set(TOPICS.map(topic => topic.group))];
const HOME = 'home';
const POWER_ROUTE = [
  { id: 'engine', label: 'Engine', note: 'Burns fuel to turn a shaft' },
  { id: 'transmission', label: 'Gearbox', note: 'Trades speed for force' },
  { id: 'chassis', label: 'Driveshaft', note: 'Carries it to the back' },
  { id: 'differential', label: 'Differential', note: 'Splits it between wheels' },
  { id: 'brakes', label: 'Wheels', note: 'Grip, steer, and stop' },
];
const LAST_LESSON_KEY = 'vroom:lastLesson';
const readLastLesson = () => { try { return TOPICS.find(topic => topic.id === localStorage.getItem(LAST_LESSON_KEY)); } catch { return undefined; } };
const readTopic = () => TOPICS.find(topic => `#${topic.id}` === window.location.hash)?.id || HOME;

function TopicNavigation({ active, onSelect, visited, className = '' }) {
  return <nav aria-label="Topics" className={`topic-navigation ${className}`}>
    {GROUPS.map(group => <div className="nav-group" key={group}>
      <p className="nav-group-label">{group}</p>
      <ul>
        {TOPICS.filter(topic => topic.group === group).map(topic => {
          const done = visited?.has(topic.id);
          return <li key={topic.id}>
          <a href={`#${topic.id}`} aria-label={`${topic.label}${done ? ', visited' : ''}`} aria-current={active === topic.id ? 'page' : undefined}
            data-done={done || undefined} onClick={event => { event.preventDefault(); onSelect(topic.id); }} className="topic-link">
            <span className="topic-icon" aria-hidden="true"><topic.Icon size={18} strokeWidth={1.75} /></span>
            <span className="topic-text"><span className="topic-label">{topic.label}</span><span className="topic-title">{topic.title}</span></span>
            <span className="topic-number" aria-hidden="true">{done ? <Check size={15} strokeWidth={2.5} /> : topic.number}</span>
          </a>
        </li>;
        })}
      </ul>
    </div>)}
  </nav>;
}

function Landing({ onSelect, mobile, visited }) {
  const doneCount = TOPICS.filter(topic => visited.has(topic.id)).length;
  const started = doneCount > 0;
  const complete = doneCount === TOPICS.length;
  const last = readLastLesson();
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">An interactive course · {TOPICS.length} lessons</p>
        <h1 id="hero-title" tabIndex={-1}>How a car really works.</h1>
        <p className="hero-lede">Take apart a Lexus IS300, then try the engine, gears, brakes, and more. No experience needed — each lesson takes a few minutes.</p>
        {started && <div className="hero-progress-meter" aria-label={`${doneCount} of ${TOPICS.length} lessons explored`}>
          <div className="progress-bar" aria-hidden="true"><span style={{ transform: `scaleX(${doneCount / TOPICS.length})` }} /></div>
          <p>{complete ? 'All lessons explored. Nice work.' : `${doneCount} of ${TOPICS.length} lessons explored`}</p>
        </div>}
        {!mobile && <div className="hero-actions">
          <button className="button button-primary" onClick={() => onSelect(started ? (last?.id || 'chassis') : 'chassis')}>{started && !complete ? 'Continue' : started ? 'Review lessons' : 'Start learning'} <ArrowRight size={16} aria-hidden="true" /></button>
          <a className="button button-secondary" href="#lessons">See all lessons</a>
        </div>}
      </div>
      <figure className="hero-visual">
        <HeroCar />
        <figcaption>
          <dl className="hero-spec">
            <div><dt>Engine</dt><dd>3.0 L six</dd></div>
            <div><dt>Power</dt><dd>215 hp</dd></div>
            <div><dt>Gearbox</dt><dd>5-speed</dd></div>
            <div><dt>Drive</dt><dd>Rear wheels</dd></div>
          </dl>
        </figcaption>
      </figure>
    </section>

    <section className="route" aria-labelledby="route-title">
      <p className="eyebrow">The big idea</p>
      <h2 id="route-title">Follow the power from fuel to road.</h2>
      <ol className="route-steps">
        {POWER_ROUTE.map((step, index) => <li key={step.label}>
          <a href={`#${step.id}`} onClick={event => { event.preventDefault(); onSelect(step.id); }}>
            <span className="route-index">{index + 1}</span>
            <strong>{step.label}</strong>
            <span>{step.note}</span>
          </a>
        </li>)}
      </ol>
    </section>

    <section className="lesson-index" id="lessons" aria-labelledby="lessons-title">
      <p className="eyebrow">Curriculum</p>
      <h2 id="lessons-title">Pick any lesson, or start at one.</h2>
      <nav aria-label="Topics" className="lesson-grid">
        {GROUPS.map(group => <div className="lesson-group" key={group}>
          <h3>{group}</h3>
          <ul>
            {TOPICS.filter(topic => topic.group === group).map(topic => {
              const done = visited.has(topic.id);
              return <li key={topic.id}>
              <a href={`#${topic.id}`} className="lesson-row" data-done={done || undefined} aria-label={`${topic.label}: ${topic.title}${done ? ' (visited)' : ''}`} onClick={event => { event.preventDefault(); onSelect(topic.id); }}>
                <span className="lesson-row-icon" aria-hidden="true"><topic.Icon size={18} strokeWidth={1.75} /></span>
                <span className="lesson-row-text"><span className="lesson-row-label">{topic.label}</span><span className="lesson-row-title">{topic.title}</span></span>
                <span className="lesson-row-number" aria-hidden="true">{done ? <Check size={16} strokeWidth={2.5} /> : topic.number}</span>
              </a>
            </li>;
            })}
          </ul>
        </div>)}
      </nav>
    </section>

    {!mobile && <section className="closing" aria-labelledby="closing-title">
      <h2 id="closing-title">{complete ? 'You have explored every lesson.' : 'Ready to look under the hood?'}</h2>
      <button className="button button-primary" onClick={() => onSelect(started ? (last?.id || 'chassis') : 'chassis')}>{started && !complete ? 'Continue where you left off' : started ? 'Review from lesson 01' : 'Start with lesson 01'} <ArrowRight size={16} aria-hidden="true" /></button>
      {started && <button className="progress-reset" onClick={clearProgress}><RotateCcw size={14} aria-hidden="true" />Reset progress</button>}
    </section>}
  </>;
}

// Lesson list. On a desktop it is a side panel opened from the header; on a phone it is a bottom sheet
// opened from the bottom bar, and the grabber at the top can be dragged down to close it.
function LessonsMenu({ open, onOpenChange, active, onSelect, focusAfterClose, mobile, trigger, visited }) {
  const panelRef = useRef(null);
  const drag = useRef(null);
  const onGrab = event => {
    drag.current = { y: event.clientY, t: performance.now(), dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    panelRef.current.style.transition = 'none';
  };
  const onDrag = event => {
    const d = drag.current;
    if (!d) return;
    d.dy = Math.max(0, event.clientY - d.y);
    panelRef.current.style.transform = `translateY(${d.dy}px)`;
  };
  const onRelease = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const panel = panelRef.current;
    panel.style.transition = '';
    // Close on a long drag or a quick flick; otherwise spring back.
    if (d.dy > 120 || d.dy / (performance.now() - d.t) > 0.5) onOpenChange(false);
    else panel.style.transform = '';
  };
  const grabber = mobile ? { onPointerDown: onGrab, onPointerMove: onDrag, onPointerUp: onRelease, onPointerCancel: onRelease } : {};
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {trigger}
    <Dialog.Portal>
      <Dialog.Overlay className="menu-overlay" />
      <Dialog.Content ref={panelRef} className={mobile ? 'menu-panel menu-sheet' : 'menu-panel'} onCloseAutoFocus={event => {
        if (focusAfterClose.current) { event.preventDefault(); document.getElementById('topic-title')?.focus({ preventScroll: true }); focusAfterClose.current = false; }
      }}>
        <div className="menu-heading" {...grabber}>
          {mobile && <span className="sheet-grabber" aria-hidden="true" />}
          <Dialog.Title>Lessons</Dialog.Title>
          <Dialog.Close className="icon-button" aria-label="Close navigation"><X size={18} /></Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">Choose a lesson to open it.</Dialog.Description>
        <TopicNavigation active={active} onSelect={onSelect} visited={visited} />
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

// Phone bottom bar: previous, the lesson list, and next, always within thumb reach.
function MobileDock({ isHome, index, active, onSelect, menu }) {
  if (isHome) {
    const last = readLastLesson();
    return <nav className="mobile-dock" aria-label="Lesson controls">
      {menu}
      <button className="dock-primary" onClick={() => onSelect(last?.id || 'chassis')}>
        {last ? <span><small>Continue</small>{last.label}</span> : 'Start learning'}<ArrowRight size={18} aria-hidden="true" />
      </button>
    </nav>;
  }
  const prev = TOPICS[index - 1], next = TOPICS[index + 1];
  return <nav className="mobile-dock" aria-label="Topic sequence">
    <button className="dock-step" aria-label={prev ? `Previous topic: ${prev.label}` : 'Back to home'} onClick={() => onSelect(prev?.id || HOME)}>
      <ArrowLeft size={20} aria-hidden="true" />
    </button>
    {menu}
    <button className="dock-step dock-next" aria-label={next ? `Next topic: ${next.label}` : 'Back to overview'} onClick={() => onSelect(next?.id || HOME)}>
      <span>{next ? 'Next' : 'Done'}</span><ArrowRight size={20} aria-hidden="true" />
    </button>
  </nav>;
}

const SHORTCUTS = [
  { keys: ['→', 'L'], label: 'Next lesson' },
  { keys: ['←', 'H'], label: 'Previous lesson' },
  { keys: ['Home'], label: 'Back to the overview' },
  { keys: ['?'], label: 'Show this list' },
  { keys: ['Esc'], label: 'Close a panel' },
];

// A quiet reference card for the keyboard shortcuts, opened with "?" or the
// header button. It is a modal dialog so Escape and focus handling come free.
function ShortcutsDialog({ open, onOpenChange }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="menu-overlay" />
      <Dialog.Content className="shortcuts-dialog">
        <div className="menu-heading">
          <Dialog.Title>Keyboard shortcuts</Dialog.Title>
          <Dialog.Close className="icon-button" aria-label="Close shortcuts"><X size={18} /></Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">A list of keyboard shortcuts for moving between lessons.</Dialog.Description>
        <dl className="shortcuts-list">
          {SHORTCUTS.map(row => <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.keys.map(k => <kbd key={k}>{k}</kbd>)}</dd>
          </div>)}
        </dl>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState(readTopic);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const headingRef = useRef(null);
  const focusAfterClose = useRef(false);
  const isHome = activeTab === HOME;
  const index = TOPICS.findIndex(topic => topic.id === activeTab);
  const active = TOPICS[index];
  const mobile = useIsMobile();
  const visited = useProgress();

  useEffect(() => {
    const sync = () => setActiveTab(readTopic());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);

  useEffect(() => {
    document.title = isHome ? 'Vroom · How a car really works' : `${active.label} · Vroom`;
    if (!isHome) {
      markVisited(active.id);
      if (active.id !== 'chassis') try { localStorage.setItem(LAST_LESSON_KEY, active.id); } catch { /* private mode */ }
    }
  }, [isHome, active]);

  const selectTopic = id => {
    focusAfterClose.current = menuOpen;
    setActiveTab(id);
    setMenuOpen(false);
    if (id === HOME) {
      if (window.location.hash) window.history.pushState(null, '', window.location.pathname);
    } else if (window.location.hash !== `#${id}`) {
      window.location.hash = id;
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      (document.getElementById('topic-title') || document.getElementById('hero-title'))?.focus({ preventScroll: true });
    });
  };

  // Keyboard shortcuts for quick navigation. Left/right page between lessons,
  // and "?" opens the shortcut list. Typing in a field or dragging a slider is
  // left alone, and modifier combos stay with the browser.
  useEffect(() => {
    const onKey = event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const el = event.target;
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.getAttribute?.('role') === 'slider');
      if (typing) return;
      if (event.key === '?' || (event.key === '/' && event.shiftKey)) { event.preventDefault(); setShortcutsOpen(v => !v); return; }
      if (shortcutsOpen) return;
      if (event.key === 'ArrowRight' || event.key === 'l') {
        event.preventDefault();
        selectTopic(isHome ? TOPICS[0].id : (TOPICS[index + 1]?.id || HOME));
      } else if (event.key === 'ArrowLeft' || event.key === 'h') {
        event.preventDefault();
        if (!isHome) selectTopic(index > 0 ? TOPICS[index - 1].id : HOME);
      } else if (event.key === 'Home' && !isHome) {
        event.preventDefault();
        selectTopic(HOME);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isHome, index, shortcutsOpen]);

  const Simulator = active?.component;
  const lessonsMenu = <LessonsMenu open={menuOpen} onOpenChange={setMenuOpen} active={activeTab} onSelect={selectTopic} focusAfterClose={focusAfterClose} mobile={mobile} visited={visited}
    trigger={<Dialog.Trigger className={mobile ? 'dock-menu' : 'menu-button'} aria-label="Toggle Navigation Menu">
      <Menu size={mobile ? 18 : 16} aria-hidden="true" />
      {mobile && !isHome ? <span><small>{active.number} of {TOPICS.length}</small>{active.label}</span> : 'Lessons'}
    </Dialog.Trigger>} />;

  return <div className={`app-shell ${isHome ? 'is-home' : 'is-lesson'} ${mobile ? 'is-mobile' : 'is-desktop'}`}>
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="app-header">
      <div className="app-header-inner">
        <a href="#" className="brand" aria-label="Vroom home" onClick={event => { event.preventDefault(); selectTopic(HOME); }}>
          <span className="brand-mark" aria-hidden="true" />Vroom
        </a>
        {!isHome && <span className="header-lesson" aria-hidden="true">{active.label}</span>}
        <div className="header-actions">
          {!isHome && <span className="header-progress" aria-label={`Lesson ${index + 1} of ${TOPICS.length}`}>{active.number}<span> / {TOPICS.length}</span></span>}
          {!mobile && <button className="icon-button shortcuts-button" aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)" onClick={() => setShortcutsOpen(true)}><Keyboard size={16} aria-hidden="true" /></button>}
          {!mobile && lessonsMenu}
        </div>
      </div>
      {!isHome && <div className="progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${(index + 1) / TOPICS.length})` }} /></div>}
    </header>

    <main id="main-content" tabIndex={-1}>
      {isHome ? <Landing onSelect={selectTopic} mobile={mobile} visited={visited} /> : <article className="lesson" key={activeTab}>
        <header className="lesson-header">
          <p className="eyebrow">Lesson {active.number} · {active.label}</p>
          <h1 id="topic-title" ref={headingRef} tabIndex={-1}>{active.title}</h1>
          <p className="lesson-lede">{active.description}</p>
        </header>

        <p className="lesson-tip"><strong>Try this</strong>{active.tip}</p>

        <div className="simulation-content">
          <Simulator />
          {activeTab === 'engine' && <AudioEngineSynth />}
        </div>

        {active.terms.length > 0 && <details className="lesson-vocabulary">
          <summary>What do these words mean?</summary>
          <dl>{active.terms.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
        </details>}

        {active.takeaway && <section className="lesson-takeaway" aria-labelledby="takeaway-title">
          <h2 id="takeaway-title">What to remember</h2>
          <p>{active.takeaway}</p>
          {active.source && <a href={active.source.url} target="_blank" rel="noopener noreferrer">{active.source.label} <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
        </section>}

        {!mobile && <nav className="topic-pagination" aria-label="Topic sequence">
          {index > 0
            ? <button className="pager pager-previous" aria-label={`Previous topic: ${TOPICS[index - 1].label}`} onClick={() => selectTopic(TOPICS[index - 1].id)}><ArrowLeft size={18} aria-hidden="true" /><span><small>Previous</small>{TOPICS[index - 1].label}</span></button>
            : <button className="pager pager-previous" aria-label="Back to home" onClick={() => selectTopic(HOME)}><ArrowLeft size={18} aria-hidden="true" /><span><small>Back</small>Home</span></button>}
          <button className="pager pager-next" aria-label={index === TOPICS.length - 1 ? 'Back to overview' : `Next topic: ${TOPICS[index + 1].label}`} onClick={() => selectTopic(TOPICS[index + 1]?.id || HOME)}><span><small>{index === TOPICS.length - 1 ? 'Finished' : 'Next'}</small>{TOPICS[index + 1]?.label || 'Back to overview'}</span><ArrowRight size={18} aria-hidden="true" /></button>
        </nav>}
      </article>}
    </main>
    {mobile && <MobileDock isHome={isHome} index={index} active={active} onSelect={selectTopic} menu={lessonsMenu} />}
    {!mobile && <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />}
    <footer className="app-footer"><span>Vroom</span><span>Simplified learning models · Independent enthusiast guide · Car model “Toyota Altezza 2001” by <a href="https://sketchfab.com/3d-models/draft-request-toyota-altezza-2001-0396aafda6294dc4843250d979783656" target="_blank" rel="noopener noreferrer">Chai</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></span></footer>
  </div>;
}
