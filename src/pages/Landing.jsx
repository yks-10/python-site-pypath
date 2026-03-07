import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { curriculum, allTopics, LEVELS } from '../data/curriculum';
import Footer from '../components/Layout/Footer';

function AnimatedNumber({ target, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration: 1.5, ease: [0.4, 0, 0.2, 1] });
      return controls.stop;
    }
  }, [inView, target]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const LEVEL_DATA = [
  {
    id: 'beginner',
    title: 'Beginner',
    subtitle: 'Python Foundations',
    icon: '🟢',
    color: '#22c55e',
    gradient: 'from-green-500/10 to-transparent',
    border: 'rgba(34,197,94,0.3)',
    topics: ['Syntax & Variables', 'Data Types', 'Loops & Conditionals', 'Functions'],
    topicCount: curriculum.find(l => l.id === 'beginner')?.sections.reduce((a, s) => a + s.topics.length, 0) || 0,
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Core Programming',
    icon: '🟡',
    color: '#facc15',
    gradient: 'from-yellow-500/10 to-transparent',
    border: 'rgba(250,204,21,0.3)',
    topics: ['OOP', 'Decorators', 'Generators', 'File I/O'],
    topicCount: curriculum.find(l => l.id === 'intermediate')?.sections.reduce((a, s) => a + s.topics.length, 0) || 0,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'Professional Python',
    icon: '🔵',
    color: '#3b82f6',
    gradient: 'from-blue-500/10 to-transparent',
    border: 'rgba(59,130,246,0.3)',
    topics: ['Concurrency', 'Type Hinting', 'Testing', 'Metaclasses'],
    topicCount: curriculum.find(l => l.id === 'advanced')?.sections.reduce((a, s) => a + s.topics.length, 0) || 0,
  },
  {
    id: 'expert',
    title: 'Expert',
    subtitle: 'Real-World Python',
    icon: '🔴',
    color: '#ef4444',
    gradient: 'from-red-500/10 to-transparent',
    border: 'rgba(239,68,68,0.3)',
    topics: ['Design Patterns', 'APIs & DBs', 'Data Science', 'Packaging'],
    topicCount: curriculum.find(l => l.id === 'expert')?.sections.reduce((a, s) => a + s.topics.length, 0) || 0,
  },
  {
    id: 'mastery',
    title: 'Mastery',
    subtitle: 'Cutting Edge',
    icon: '🟣',
    color: '#a855f7',
    gradient: 'from-purple-500/10 to-transparent',
    border: 'rgba(168,85,247,0.3)',
    topics: ['CPython Internals', 'Distributed Computing', 'AI/ML', 'Cloud'],
    topicCount: curriculum.find(l => l.id === 'mastery')?.sections.reduce((a, s) => a + s.topics.length, 0) || 0,
  },
];

const CODE_SNIPPET = `# Your Python journey starts here
def master_python(skill_level="beginner"):
    """
    Transform from curious coder
    to Python architect.
    """
    topics = load_curriculum(skill_level)
    
    for concept in topics:
        learn(concept)       # understand deeply
        practice(concept)    # code daily
        build(concept)       # apply in projects
    
    return Developer(
        skills=["backend", "data", "ml"],
        confidence=float("inf"),
        path="PyPath 🐍"
    )

master_python()  # Let's go.`;

function HeroCodeBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-20"
        style={{ background: 'radial-gradient(circle at center, #3b82f6, transparent 70%)' }}
      />
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: '#0d1117',
          border: '1px solid #2a3040',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b border-[#2a3040]"
          style={{ background: '#161b27' }}
        >
          <span className="w-3 h-3 rounded-full bg-[#ef4444] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#facc15] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#22c55e] opacity-70" />
          <span className="ml-auto font-mono text-xs text-[#6b7280]">pypath.py</span>
        </div>
        {/* Code */}
        <pre className="p-5 overflow-x-auto font-mono text-sm leading-relaxed">
          {CODE_SNIPPET.split('\n').map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="flex"
            >
              <span className="select-none w-8 text-right text-[#3a4155] mr-4 flex-shrink-0">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: colorize(line) }} />
            </motion.div>
          ))}
        </pre>
      </div>
    </motion.div>
  );
}

function colorize(line) {
  // Single quotes in span style attributes prevent the string regex from
  // accidentally matching and corrupting previously-inserted span tags.
  return line
    .replace(/(&|<|>)/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
    .replace(/(#.*$)/g, "<span style='color:#6b7280'>$1</span>")
    .replace(/\b(def|return|for|in|import)\b/g, "<span style='color:#a855f7'>$1</span>")
    .replace(/\b(load_curriculum|learn|practice|build|master_python|Developer)\b/g, "<span style='color:#60a5fa'>$1</span>")
    .replace(/\b(float)\b/g, "<span style='color:#facc15'>$1</span>")
    .replace(/"([^"]*)"/g, "<span style='color:#86efac'>\"$1\"</span>");
}

export default function Landing({ totalCompleted = 0 }) {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const firstTopicId = allTopics[0]?.id;
  const totalTopics = allTopics.length;

  return (
    <div className="min-h-screen" style={{ background: '#0f1117' }}>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-14 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 dot-bg opacity-40" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60a5fa',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              Free Python Curriculum — {totalTopics}+ Topics
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-mono font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            >
              <span className="text-[#e8eaf0]">Master Python.</span>
              <br />
              <span className="text-gradient-blue">One concept</span>
              <br />
              <span className="text-[#e8eaf0]">at a time.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif text-lg text-[#9ca3af] leading-relaxed mb-8 max-w-xl"
            >
              A structured, beautifully crafted curriculum that takes you from writing your first
              <code className="font-mono text-sm text-[#a5d6ff] mx-1 px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.1)' }}>print("hello")</code>
              to understanding CPython internals and shipping production systems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate(firstTopicId ? `/topic/${firstTopicId}` : '/curriculum')}
                className="flex items-center gap-2 font-mono font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                Start Learning →
              </button>
              <button
                onClick={() => navigate('/curriculum')}
                className="flex items-center gap-2 font-mono text-sm px-6 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(42,48,64,0.5)',
                  color: '#9ca3af',
                  border: '1px solid #3a4155',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#e8eaf0';
                  e.currentTarget.style.borderColor = '#4a5168';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.borderColor = '#3a4155';
                }}
              >
                View Curriculum
              </button>
            </motion.div>

            {/* Progress indicator if user has started */}
            {totalCompleted > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center gap-3 font-mono text-sm"
              >
                <div className="flex-1 max-w-[200px] h-1.5 rounded-full bg-[#2a3040] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(totalCompleted / totalTopics) * 100}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
                    }}
                  />
                </div>
                <span className="text-[#22c55e]">{totalCompleted}/{totalTopics} complete</span>
              </motion.div>
            )}
          </div>

          {/* Right column: code block */}
          <HeroCodeBlock />
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-[#6b7280]">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[#2a3040]" style={{ background: '#161b27' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { target: totalTopics, suffix: '+', label: 'Topics', sublabel: 'in depth', color: '#3b82f6' },
              { target: 5, suffix: '', label: 'Skill Levels', sublabel: 'Beginner → Mastery', color: '#facc15' },
              { target: 100, suffix: '%', label: 'Free', sublabel: 'always & forever', color: '#22c55e' },
              { target: 3, suffix: '', label: 'Full Lessons', sublabel: 'with code & challenges', color: '#a855f7' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="font-mono font-bold text-4xl sm:text-5xl mb-1"
                  style={{ color: stat.color }}
                >
                  <AnimatedNumber target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="font-mono font-semibold text-sm text-[#e8eaf0]">{stat.label}</div>
                <div className="font-mono text-xs text-[#6b7280] mt-0.5">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-3">
              5 Learning Tracks
            </h2>
            <p className="font-serif text-[#9ca3af] text-lg max-w-xl mx-auto">
              Follow the complete roadmap or jump to any level. Every track is carefully
              structured and interconnected.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {LEVEL_DATA.map((level, i) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}
                onClick={() => navigate(`/curriculum#${level.id}`)}
                className="cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200"
                style={{
                  background: '#1a1f2e',
                  borderColor: level.border,
                }}
              >
                <div
                  className="h-1.5"
                  style={{ background: level.color }}
                />
                <div className="p-5">
                  <div className="text-3xl mb-3">{level.icon}</div>
                  <h3 className="font-mono font-bold text-base text-[#e8eaf0] mb-0.5">{level.title}</h3>
                  <p className="font-mono text-xs text-[#9ca3af] mb-3">{level.subtitle}</p>
                  <div
                    className="font-mono text-xs px-2 py-1 rounded-full inline-block mb-4"
                    style={{ background: `${level.color}15`, color: level.color }}
                  >
                    {level.topicCount} topics
                  </div>
                  <ul className="space-y-1.5">
                    {level.topics.map(topic => (
                      <li key={topic} className="flex items-center gap-1.5 font-mono text-xs text-[#9ca3af]">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: level.color }} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/curriculum')}
              className="font-mono text-sm px-6 py-3 rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(42,48,64,0.5)',
                color: '#9ca3af',
                border: '1px solid #3a4155',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e8eaf0'; e.currentTarget.style.borderColor = '#4a5168'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#3a4155'; }}
            >
              View full curriculum →
            </button>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-20 border-t border-[#2a3040]" style={{ background: '#161b27' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono font-bold text-2xl sm:text-3xl text-center text-[#e8eaf0] mb-12"
          >
            Built for serious learners
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '📖',
                title: 'Deep Lesson Content',
                desc: 'Not surface-level overviews. Every topic includes conceptual explanation, multiple code examples, pitfalls, and a challenge to test your understanding.',
              },
              {
                icon: '⌨️',
                title: 'Interactive Code Editor',
                desc: 'Write and run Python concepts directly in your browser with a full-featured CodeMirror editor. Syntax highlighted, indentation-aware.',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                desc: 'Mark topics complete, track your streak, and visualize your journey through 5 levels with animated progress rings on your dashboard.',
              },
              {
                icon: '🔍',
                title: 'Instant Search',
                desc: 'Fuzzy search across all 200+ topics and subtopics. Hit ⌘K anywhere. Navigate results with arrow keys and Enter.',
              },
              {
                icon: '🗺️',
                title: 'Visual Roadmap',
                desc: 'See the complete curriculum tree at a glance. Collapsible sections, color-coded levels, and breadcrumb navigation keep you oriented.',
              },
              {
                icon: '📱',
                title: 'Mobile Responsive',
                desc: 'Learn on any device. Optimized layouts for phone, tablet, and desktop. Collapsible sidebar, touch-friendly navigation.',
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-xl border border-[#2a3040] hover:border-[#3a4155] transition-colors"
                style={{ background: '#1a1f2e' }}
              >
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="font-mono font-semibold text-sm text-[#e8eaf0] mb-2">{feat.title}</h3>
                <p className="font-serif text-sm text-[#9ca3af] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.08), transparent)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-6xl mb-6">🐍</div>
            <h2 className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-4">
              Ready to become a
              <span className="text-gradient-blue"> Python developer</span>?
            </h2>
            <p className="font-serif text-lg text-[#9ca3af] mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of learners working through the most comprehensive free Python
              curriculum available. Start at any level, go at your own pace.
            </p>
            <button
              onClick={() => navigate(firstTopicId ? `/topic/${firstTopicId}` : '/curriculum')}
              className="inline-flex items-center gap-2 font-mono font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              Begin Your Journey →
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
