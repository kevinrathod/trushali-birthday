import { useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import config from './config/birthdayConfig.js';
import { PAGES } from './config/pages.js';
import { useProgress } from './context/ProgressContext.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import Page01Login from './pages/Page01Login.jsx';
import Page02Welcome from './pages/Page02Welcome.jsx';
import Page03Game from './pages/Page03Game.jsx';
import Page04Letter from './pages/Page04Letter.jsx';
import Page05Gallery from './pages/Page05Gallery.jsx';
import Page06Compliments from './pages/Page06Compliments.jsx';
import Page07Gift from './pages/Page07Gift.jsx';
import Page08Cake from './pages/Page08Cake.jsx';
import Page09Message from './pages/Page09Message.jsx';
import Page10Finale from './pages/Page10Finale.jsx';

const COMPONENTS = [
  Page01Login, Page02Welcome, Page03Game, Page04Letter, Page05Gallery,
  Page06Compliments, Page07Gift, Page08Cake, Page09Message, Page10Finale,
];

// Keeps visitors on the pages they have unlocked (refresh / typed URL / back button safe).
function Guard({ index, children }) {
  const { state } = useProgress();
  const { pathname } = useLocation();
  // A page that is already animating out (the URL has moved on) must never redirect.
  if (pathname !== PAGES[index].path) return children;
  if (index > 0 && !state.loggedIn) return <Navigate to={PAGES[0].path} replace />;
  if (index > state.unlocked) return <Navigate to={PAGES[Math.max(state.unlocked, 1)].path} replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  // Apply theme colours from the config file as CSS variables.
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(config.theme).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <MusicPlayer />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {COMPONENTS.map((Page, i) => (
            <Route
              key={PAGES[i].path}
              path={PAGES[i].path}
              element={
                <Guard index={i}>
                  <Page />
                </Guard>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </MotionConfig>
  );
}
