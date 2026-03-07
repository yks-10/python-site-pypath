import { useState, useMemo, useCallback } from 'react';
import { allTopics } from '../data/curriculum';

const normalize = str => str.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

const score = (topic, query) => {
  const q = normalize(query);
  const title = normalize(topic.title);
  const section = normalize(topic.sectionTitle);
  const level = normalize(topic.levelLabel);
  const subtopics = (topic.subtopics || []).map(normalize).join(' ');

  let s = 0;
  if (title.startsWith(q)) s += 100;
  else if (title.includes(q)) s += 60;
  if (section.includes(q)) s += 30;
  if (level.includes(q)) s += 20;
  if (subtopics.includes(q)) s += 40;

  // Partial word match
  const words = q.split(' ').filter(Boolean);
  words.forEach(word => {
    if (title.includes(word)) s += 15;
    if (subtopics.includes(word)) s += 10;
  });

  return s;
};

export function useSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    return allTopics
      .map(topic => ({ topic, score: score(topic, query) }))
      .filter(({ score: s }) => s > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(({ topic }) => topic);
  }, [query]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, results, clearSearch, hasResults: results.length > 0 };
}
