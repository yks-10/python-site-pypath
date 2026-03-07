import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'pypath_progress';
const STREAK_KEY = 'pypath_streak';

const getInitialProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const getStreakData = () => {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? JSON.parse(stored) : { streak: 0, lastDate: null, longestStreak: 0 };
  } catch {
    return { streak: 0, lastDate: null, longestStreak: 0 };
  }
};

const today = () => new Date().toISOString().split('T')[0];
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export function useProgress() {
  const [progress, setProgress] = useState(getInitialProgress);
  const [streakData, setStreakData] = useState(getStreakData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // localStorage full or unavailable
    }
  }, [progress]);

  const updateStreak = useCallback(() => {
    setStreakData(prev => {
      const todayStr = today();
      const yesterdayStr = yesterday();
      let newStreak = prev.streak;

      if (prev.lastDate === todayStr) {
        return prev; // already counted today
      } else if (prev.lastDate === yesterdayStr) {
        newStreak = prev.streak + 1;
      } else if (prev.lastDate !== todayStr) {
        newStreak = 1; // reset streak
      }

      const updated = {
        streak: newStreak,
        lastDate: todayStr,
        longestStreak: Math.max(newStreak, prev.longestStreak || 0),
      };

      try {
        localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
      } catch {
        //
      }

      return updated;
    });
  }, []);

  const markComplete = useCallback((topicId) => {
    setProgress(prev => {
      if (prev[topicId]?.completed) return prev;
      const updated = {
        ...prev,
        [topicId]: {
          completed: true,
          completedAt: new Date().toISOString(),
        },
      };
      return updated;
    });
    updateStreak();
  }, [updateStreak]);

  const markIncomplete = useCallback((topicId) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[topicId];
      return updated;
    });
  }, []);

  const isComplete = useCallback((topicId) => {
    return !!progress[topicId]?.completed;
  }, [progress]);

  const completedTopics = Object.entries(progress)
    .filter(([, v]) => v.completed)
    .map(([id, v]) => ({ id, completedAt: v.completedAt }))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const completedByLevel = useCallback((levelId, allTopicsForLevel) => {
    return allTopicsForLevel.filter(t => progress[t.id]?.completed).length;
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({});
    setStreakData({ streak: 0, lastDate: null, longestStreak: 0 });
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STREAK_KEY);
    } catch {
      //
    }
  }, []);

  return {
    progress,
    markComplete,
    markIncomplete,
    isComplete,
    completedTopics,
    completedByLevel,
    totalCompleted: completedTopics.length,
    streak: streakData.streak,
    longestStreak: streakData.longestStreak,
    lastActivityDate: streakData.lastDate,
    resetProgress,
  };
}
