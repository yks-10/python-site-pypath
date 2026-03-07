import { curriculum as allCurriculum } from '../../data/curriculum';
import LevelSection from './LevelSection';

export default function CurriculumTree({ progress = {}, searchQuery = '', filteredCurriculum }) {
  const base = filteredCurriculum || allCurriculum;

  const displayCurriculum = searchQuery
    ? base.filter(level =>
        level.sections.some(section =>
          section.topics.some(t =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subtopics?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        )
      )
    : base;

  return (
    <div>
      {displayCurriculum.map(level => (
        <LevelSection
          key={level.id}
          id={level.id}
          level={level}
          progress={progress}
          searchQuery={searchQuery}
        />
      ))}
      {displayCurriculum.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="font-mono text-[#9ca3af] text-sm">No topics match "{searchQuery}"</p>
          <p className="font-serif text-[#6b7280] text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
