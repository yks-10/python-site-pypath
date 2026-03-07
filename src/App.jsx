import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useProgress } from './hooks/useProgress';
import TopNav from './components/Layout/TopNav';
import Landing from './pages/Landing';
import CurriculumPage from './pages/Curriculum';
import TopicDetail from './pages/TopicDetail';
import Dashboard from './pages/Dashboard';
import Compiler from './pages/Compiler';
import Interview from './pages/Interview';

export default function App() {
  const location = useLocation();
  const {
    progress,
    markComplete,
    markIncomplete,
    completedTopics,
    totalCompleted,
    streak,
    longestStreak,
    lastActivityDate,
    resetProgress,
  } = useProgress();

  return (
    <div className="min-h-screen" style={{ background: '#0f1117', color: '#e8eaf0' }}>
      <TopNav totalCompleted={totalCompleted} />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Landing totalCompleted={totalCompleted} />}
          />
          <Route
            path="/curriculum"
            element={<CurriculumPage progress={progress} />}
          />
          <Route
            path="/topic/:id"
            element={
              <TopicDetail
                progress={progress}
                onMarkComplete={markComplete}
                onMarkIncomplete={markIncomplete}
              />
            }
          />
          <Route
            path="/compiler"
            element={<Compiler />}
          />
          <Route
            path="/interview"
            element={<Interview />}
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                progress={progress}
                completedTopics={completedTopics}
                streak={streak}
                longestStreak={longestStreak}
                lastActivityDate={lastActivityDate}
                onReset={resetProgress}
              />
            }
          />
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen pt-14 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono font-bold text-6xl text-[#3b82f6] mb-4">404</div>
                  <h2 className="font-mono text-xl text-[#e8eaf0] mb-4">Page not found</h2>
                  <a
                    href="/"
                    className="font-mono text-sm text-[#3b82f6] hover:underline"
                  >
                    ← Back to home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
