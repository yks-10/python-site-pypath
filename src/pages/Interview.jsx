import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Layout/Footer';

const CATEGORIES = [
  { id: 'all', label: 'All', color: '#9ca3af' },
  { id: 'basics', label: 'Basics', color: '#22c55e' },
  { id: 'oop', label: 'OOP', color: '#3b82f6' },
  { id: 'data-structures', label: 'Data Structures', color: '#facc15' },
  { id: 'advanced', label: 'Advanced', color: '#a855f7' },
  { id: 'concurrency', label: 'Concurrency', color: '#f97316' },
  { id: 'practical', label: 'Practical', color: '#06b6d4' },
];

const DIFFICULTY = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  medium: { label: 'Medium', color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.3)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

const QUESTIONS = [
  // ── Basics ──────────────────────────────────────────────────────────────
  {
    id: 1, category: 'basics', difficulty: 'easy',
    question: 'What are Python\'s key features?',
    answer: `Python is an interpreted, high-level, general-purpose language known for:
• Simple, readable syntax (uses indentation instead of braces)
• Dynamic typing — no need to declare variable types
• Automatic memory management via garbage collection
• Extensive standard library ("batteries included")
• Multi-paradigm: supports OOP, functional, and procedural styles
• First-class functions and closures
• Cross-platform compatibility`,
    code: null,
  },
  {
    id: 2, category: 'basics', difficulty: 'easy',
    question: 'What is the difference between a list and a tuple?',
    answer: `Lists are mutable (can be modified after creation), tuples are immutable.

Use a list when the collection will change; use a tuple for fixed data (e.g. coordinates, DB rows). Tuples are slightly faster and can be used as dict keys or set members because they're hashable.`,
    code: `my_list = [1, 2, 3]
my_list.append(4)       # OK ✓

my_tuple = (1, 2, 3)
my_tuple[0] = 99        # TypeError ✗

# Tuple as dict key (valid because it's hashable)
coords = {(0, 0): "origin", (1, 2): "point A"}`,
  },
  {
    id: 3, category: 'basics', difficulty: 'easy',
    question: 'What is the difference between "==" and "is"?',
    answer: `== checks value equality (do they hold the same value?).
"is" checks identity (do they point to the exact same object in memory?).

CPython interns small integers (-5 to 256) and short strings, so "is" can give surprising True results for those — but you should never rely on that.`,
    code: `a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  — same value
print(a is b)   # False — different objects

c = a
print(a is c)   # True  — same object`,
  },
  {
    id: 4, category: 'basics', difficulty: 'easy',
    question: 'What are *args and **kwargs?',
    answer: `*args collects extra positional arguments into a tuple.
**kwargs collects extra keyword arguments into a dict.

They allow functions to accept a variable number of arguments and are commonly used in decorators and wrapper functions.`,
    code: `def greet(*args, **kwargs):
    for name in args:
        print(f"Hello, {name}!")
    for key, val in kwargs.items():
        print(f"{key} = {val}")

greet("Alice", "Bob", lang="Python", year=2024)
# Hello, Alice!
# Hello, Bob!
# lang = Python
# year = 2024`,
  },
  {
    id: 5, category: 'basics', difficulty: 'medium',
    question: 'What are Python decorators and how do they work?',
    answer: `A decorator is a function that wraps another function to extend or modify its behaviour without changing its source code. Decorators use the @ syntax and rely on Python's first-class functions.

Under the hood, @decorator is just syntactic sugar for func = decorator(func).`,
    code: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

slow_sum(1_000_000)  # slow_sum took 0.0312s`,
  },
  {
    id: 6, category: 'basics', difficulty: 'easy',
    question: 'What is a lambda function?',
    answer: `A lambda is an anonymous single-expression function defined with the lambda keyword. It's useful for short, throwaway functions passed to higher-order functions like map(), filter(), and sorted().

Lambdas can't contain statements (no if/for blocks, no return), only a single expression.`,
    code: `# Named function
def square(x): return x ** 2

# Equivalent lambda
square = lambda x: x ** 2

# Common use-cases
nums = [3, 1, 4, 1, 5, 9]
print(sorted(nums, key=lambda x: -x))   # descending
print(list(filter(lambda x: x > 3, nums)))  # [4, 5, 9]`,
  },
  {
    id: 7, category: 'basics', difficulty: 'medium',
    question: 'What is the difference between shallow copy and deep copy?',
    answer: `Shallow copy creates a new object but inserts references to the nested objects of the original. Deep copy creates a new object and recursively copies all nested objects.

Use copy.copy() for shallow, copy.deepcopy() for deep.`,
    code: `import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)
shallow[0].append(99)
print(original)   # [[1, 2, 99], [3, 4]] — inner list mutated!

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0].append(99)
print(original)   # [[1, 2], [3, 4]] — unchanged`,
  },
  // ── OOP ─────────────────────────────────────────────────────────────────
  {
    id: 8, category: 'oop', difficulty: 'medium',
    question: 'What are __init__ and __new__ in Python classes?',
    answer: `__new__ creates and returns the instance (called first).
__init__ initialises the instance after it's created (called second).

You rarely override __new__ except when subclassing immutable types (int, str, tuple) or implementing singletons.`,
    code: `class MyClass:
    def __new__(cls, *args, **kwargs):
        print("Creating instance")
        return super().__new__(cls)

    def __init__(self, value):
        print("Initialising instance")
        self.value = value

obj = MyClass(42)
# Creating instance
# Initialising instance`,
  },
  {
    id: 9, category: 'oop', difficulty: 'medium',
    question: 'What is the difference between @classmethod and @staticmethod?',
    answer: `@classmethod receives the class (cls) as its first argument — it can access and modify class state, and it works with inheritance correctly (cls refers to the subclass, not the base class).

@staticmethod receives no implicit first argument — it's just a regular function namespaced inside the class. Use it for utility logic that doesn't need class or instance state.`,
    code: `class Temperature:
    unit = "Celsius"

    @classmethod
    def set_unit(cls, unit):
        cls.unit = unit   # modifies class state

    @staticmethod
    def to_fahrenheit(c):
        return c * 9/5 + 32   # pure utility

Temperature.set_unit("Kelvin")
print(Temperature.unit)             # Kelvin
print(Temperature.to_fahrenheit(100))  # 212.0`,
  },
  {
    id: 10, category: 'oop', difficulty: 'medium',
    question: 'What is MRO (Method Resolution Order) in Python?',
    answer: `MRO is the order in which Python looks for a method in a class hierarchy during inheritance. Python uses the C3 Linearization algorithm, which ensures a consistent, predictable left-to-right depth-first order.

Use ClassName.__mro__ or ClassName.mro() to inspect it.`,
    code: `class A:
    def hello(self): print("A")

class B(A):
    def hello(self): print("B")

class C(A):
    def hello(self): print("C")

class D(B, C): pass

D().hello()          # B — B comes before C in MRO
print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)`,
  },
  {
    id: 11, category: 'oop', difficulty: 'hard',
    question: 'What are Python descriptors?',
    answer: `A descriptor is any object that defines __get__, __set__, or __delete__. Descriptors power Python's attribute lookup — properties, class/static methods, and slots are all built on them.

Data descriptors define both __get__ and __set__ (or __delete__); non-data descriptors only define __get__.`,
    code: `class Positive:
    """Descriptor that enforces positive values."""
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive")
        obj.__dict__[self.name] = value

class Circle:
    radius = Positive()

c = Circle()
c.radius = 5    # OK
c.radius = -1   # ValueError: radius must be positive`,
  },
  // ── Data Structures ─────────────────────────────────────────────────────
  {
    id: 12, category: 'data-structures', difficulty: 'easy',
    question: 'What is the time complexity of common dict operations?',
    answer: `Python dicts are hash tables. Average-case:
• get / set / delete → O(1)
• "in" operator      → O(1)
• iteration          → O(n)

Worst-case is O(n) due to hash collisions, but this is extremely rare with Python's well-designed hash function.`,
    code: `d = {"a": 1, "b": 2, "c": 3}

# O(1) average
print(d["a"])       # 1
d["d"] = 4          # O(1) insert
del d["b"]          # O(1) delete
print("c" in d)     # True — O(1) lookup

# O(n)
for key, val in d.items():
    print(key, val)`,
  },
  {
    id: 13, category: 'data-structures', difficulty: 'medium',
    question: 'When would you use collections.deque over a list?',
    answer: `Use deque when you need O(1) appends and pops from both ends. Lists only have O(1) append/pop at the right end — inserting or removing from the left is O(n) because every element shifts.

deque is ideal for queues (FIFO), sliding window algorithms, and BFS in graph traversals.`,
    code: `from collections import deque

dq = deque([1, 2, 3])
dq.appendleft(0)    # O(1) — list would be O(n)
dq.popleft()        # O(1) — list would be O(n)
print(dq)           # deque([1, 2, 3])

# Sliding window of last N items
window = deque(maxlen=3)
for x in range(6):
    window.append(x)
print(window)       # deque([3, 4, 5], maxlen=3)`,
  },
  {
    id: 14, category: 'data-structures', difficulty: 'medium',
    question: 'What are list comprehensions and when should you avoid them?',
    answer: `List comprehensions are a concise, Pythonic way to build lists. They're faster than a for-loop + append because the interpreter can optimise the inner loop.

Avoid them when:
• The logic is complex enough to hurt readability
• You only need to iterate once (use a generator expression instead)
• The resulting list is huge (wastes memory vs a generator)`,
    code: `# List comprehension
squares = [x**2 for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Nested comprehension (matrix transpose)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
transposed = [[row[i] for row in matrix] for i in range(3)]

# Generator expression (lazy — no list built in memory)
total = sum(x**2 for x in range(1_000_000))`,
  },
  {
    id: 15, category: 'data-structures', difficulty: 'hard',
    question: 'How does Python\'s sort work and what is its time complexity?',
    answer: `Python uses Timsort — a hybrid of merge sort and insertion sort optimised for real-world data that is often partially sorted.

• Time: O(n log n) worst and average case, O(n) best case (already sorted)
• Space: O(n)
• Stable: equal elements maintain their original order

list.sort() sorts in-place; sorted() returns a new list.`,
    code: `data = [(2, "b"), (1, "c"), (1, "a"), (3, "d")]

# Sort by first element, then second (stable sort preserves ties)
data.sort(key=lambda x: (x[0], x[1]))
print(data)
# [(1, 'a'), (1, 'c'), (2, 'b'), (3, 'd')]

# Reverse sort
data.sort(key=lambda x: x[0], reverse=True)

# Equivalent with sorted() (returns new list)
result = sorted(data, key=lambda x: x[0])`,
  },
  // ── Advanced ────────────────────────────────────────────────────────────
  {
    id: 16, category: 'advanced', difficulty: 'medium',
    question: 'What are generators and how do they differ from regular functions?',
    answer: `A generator function contains at least one yield statement. Calling it returns a generator object (an iterator). Values are produced lazily — one at a time — so the entire sequence never lives in memory at once.

Unlike a regular function that runs to completion, a generator is paused at each yield and resumed on the next next() call.`,
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
print([next(gen) for _ in range(8)])
# [0, 1, 1, 2, 3, 5, 8, 13]

# Memory-efficient processing of large files
def read_chunks(filepath, size=4096):
    with open(filepath, "rb") as f:
        while chunk := f.read(size):
            yield chunk`,
  },
  {
    id: 17, category: 'advanced', difficulty: 'hard',
    question: 'What is the GIL and how does it affect Python programs?',
    answer: `The Global Interpreter Lock (GIL) is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It simplifies memory management (reference counting) but prevents true CPU-parallelism in threads.

Impact:
• I/O-bound tasks — threads work fine (GIL is released during I/O)
• CPU-bound tasks — use multiprocessing or concurrent.futures.ProcessPoolExecutor to bypass the GIL
• Python 3.13+ introduces an experimental "no-GIL" build`,
    code: `# CPU-bound: use multiprocessing
from multiprocessing import Pool

def square(n): return n * n

with Pool(4) as pool:
    results = pool.map(square, range(1_000_000))

# I/O-bound: threads are fine
import threading, requests

def fetch(url):
    return requests.get(url).status_code

threads = [threading.Thread(target=fetch, args=(url,))
           for url in ["https://python.org"] * 5]
for t in threads: t.start()
for t in threads: t.join()`,
  },
  {
    id: 18, category: 'advanced', difficulty: 'hard',
    question: 'What are metaclasses in Python?',
    answer: `A metaclass is the class of a class — it controls how classes themselves are created, just like classes control how instances are created. The default metaclass is type.

Metaclasses are useful for: enforcing coding standards, auto-registering subclasses, adding methods to all classes in a hierarchy, and ORMs (like Django models).`,
    code: `class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "connected"

db1 = Database()
db2 = Database()
print(db1 is db2)   # True — same instance`,
  },
  {
    id: 19, category: 'advanced', difficulty: 'medium',
    question: 'What are context managers and how do you create one?',
    answer: `A context manager implements __enter__ and __exit__ to manage resources (files, locks, DB connections) with a guaranteed cleanup step, even if an exception occurs. Use the with statement to invoke one.

You can also create a context manager with @contextlib.contextmanager and a generator function.`,
    code: `# Class-based context manager
class ManagedFile:
    def __init__(self, path):
        self.path = path

    def __enter__(self):
        self.file = open(self.path, "w")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()
        return False  # don't suppress exceptions

# Generator-based (simpler)
from contextlib import contextmanager

@contextmanager
def managed_file(path):
    f = open(path, "w")
    try:
        yield f
    finally:
        f.close()

with managed_file("out.txt") as f:
    f.write("hello")`,
  },
  {
    id: 20, category: 'advanced', difficulty: 'medium',
    question: 'What is the difference between @property and a regular attribute?',
    answer: `A regular attribute stores a value directly in the instance dict. A @property computes or validates the value on access, acting like an attribute from the outside but running code internally.

Properties are ideal for: lazy computation, validation on set, computed/derived fields, and maintaining backwards compatibility when refactoring.`,
    code: `class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):   # computed on-demand
        import math
        return math.pi * self._radius ** 2

c = Circle(5)
print(c.area)    # 78.53...
c.radius = -1    # ValueError`,
  },
  // ── Concurrency ─────────────────────────────────────────────────────────
  {
    id: 21, category: 'concurrency', difficulty: 'medium',
    question: 'What is the difference between threading and multiprocessing?',
    answer: `threading — multiple threads share the same memory space and GIL. Great for I/O-bound work (network, disk). Low overhead but limited by the GIL for CPU tasks.

multiprocessing — spawns separate processes with their own memory and GIL. True CPU parallelism. Higher overhead (process startup, IPC). Use for CPU-bound work.`,
    code: `# I/O-bound → threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request

urls = ["https://python.org", "https://pypi.org"]
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(urllib.request.urlopen, urls))

# CPU-bound → multiprocessing
from concurrent.futures import ProcessPoolExecutor

def crunch(n): return sum(i*i for i in range(n))

with ProcessPoolExecutor() as ex:
    totals = list(ex.map(crunch, [10**6]*4))`,
  },
  {
    id: 22, category: 'concurrency', difficulty: 'hard',
    question: 'How does async/await work in Python?',
    answer: `async/await enables cooperative concurrency using an event loop (asyncio). A coroutine (defined with async def) can pause execution with await, yielding control back to the event loop so other coroutines can run.

Key points:
• Doesn't use threads — runs on a single thread
• Best for I/O-bound tasks with high concurrency (thousands of connections)
• Not suitable for CPU-bound tasks (use multiprocessing for those)`,
    code: `import asyncio

async def fetch(name, delay):
    print(f"Start {name}")
    await asyncio.sleep(delay)   # non-blocking wait
    print(f"Done  {name}")
    return name

async def main():
    # Run concurrently — total time ~2s, not 5s
    results = await asyncio.gather(
        fetch("A", 2),
        fetch("B", 1),
        fetch("C", 2),
    )
    print(results)

asyncio.run(main())`,
  },
  // ── Practical ────────────────────────────────────────────────────────────
  {
    id: 23, category: 'practical', difficulty: 'easy',
    question: 'How do you handle exceptions properly in Python?',
    answer: `Use try/except/else/finally. Catch specific exceptions rather than bare except, which swallows everything including KeyboardInterrupt and SystemExit.

• else block runs when no exception was raised
• finally always runs (cleanup code)
• Raise custom exceptions by subclassing Exception`,
    code: `class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    try:
        if amount > balance:
            raise InsufficientFundsError(
                f"Need {amount}, have {balance}"
            )
        balance -= amount
    except InsufficientFundsError as e:
        print(f"Error: {e}")
        return balance
    except (TypeError, ValueError) as e:
        print(f"Invalid input: {e}")
        return balance
    else:
        print("Withdrawal successful")
        return balance
    finally:
        print("Transaction complete")`,
  },
  {
    id: 24, category: 'practical', difficulty: 'medium',
    question: 'What are Python type hints and why use them?',
    answer: `Type hints (PEP 484) let you annotate variables, function arguments, and return values with their expected types. They are not enforced at runtime but enable:
• Static analysis with mypy / pyright
• Better IDE autocomplete and error detection
• Self-documenting code
• Easier refactoring`,
    code: `from typing import Optional
from collections.abc import Sequence

def find_user(
    users: list[dict[str, str]],
    name: str,
    default: Optional[str] = None,
) -> Optional[str]:
    for user in users:
        if user["name"] == name:
            return user["email"]
    return default

def first(items: Sequence[int]) -> int | None:
    return items[0] if items else None`,
  },
  {
    id: 25, category: 'practical', difficulty: 'medium',
    question: 'What are dataclasses and when should you use them?',
    answer: `@dataclass (PEP 557) automatically generates __init__, __repr__, and __eq__ from class-level field annotations. They reduce boilerplate for data-holding classes.

Use them instead of plain dicts for structured data, in place of namedtuples when you need mutability, or as a lighter alternative to attrs/pydantic for internal models.`,
    code: `from dataclasses import dataclass, field
from typing import ClassVar

@dataclass(order=True)   # also generates __lt__, __le__, etc.
class Point:
    x: float
    y: float
    label: str = ""
    history: list = field(default_factory=list)
    MAX_COORD: ClassVar[float] = 1e6

    def distance_to_origin(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

p1 = Point(3.0, 4.0)
print(p1)                   # Point(x=3.0, y=4.0, label='')
print(p1.distance_to_origin())  # 5.0`,
  },
  {
    id: 26, category: 'practical', difficulty: 'hard',
    question: 'How do you profile and optimise a slow Python script?',
    answer: `Step 1 — Measure first, don't guess:
• cProfile / profile for function-level profiling
• line_profiler for line-by-line
• memory_profiler for memory usage

Step 2 — Common optimisations:
• Replace loops with vectorised NumPy operations
• Use built-in functions (sum, map, filter) — they're implemented in C
• Avoid global variable lookups inside loops (assign to local)
• Use __slots__ for memory-heavy objects
• Cache expensive calls with functools.lru_cache`,
    code: `import cProfile
import pstats

# Profile a function
with cProfile.Profile() as pr:
    result = my_heavy_function()

stats = pstats.Stats(pr)
stats.sort_stats("cumulative")
stats.print_stats(10)   # top 10 functions

# Cache expensive pure functions
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

fib(100)   # instant after first call`,
  },
];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden mt-3" style={{ background: '#0d1117', border: '1px solid #2a3040' }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: '#161b27', borderBottom: '1px solid #2a3040' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] opacity-60" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] opacity-60" />
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-xs px-2 py-0.5 rounded transition-all"
          style={{
            background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(42,48,64,0.6)',
            color: copied ? '#22c55e' : '#6b7280',
            border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : '#2a3040'}`,
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed" style={{ color: '#e8eaf0' }}>
        {code.trim()}
      </pre>
    </div>
  );
}

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const diff = DIFFICULTY[q.difficulty];
  const cat = CATEGORIES.find(c => c.id === q.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl overflow-hidden border transition-colors duration-150"
      style={{ background: '#1a1f2e', borderColor: open ? '#3a4155' : '#2a3040' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
      >
        <span
          className="font-mono text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          {q.id}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-[#e8eaf0] leading-snug">{q.question}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded-full"
              style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}
            >
              {diff.label}
            </span>
            <span
              className="font-mono text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${cat?.color}15`, color: cat?.color, border: `1px solid ${cat?.color}40` }}
            >
              {cat?.label}
            </span>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#6b7280] flex-shrink-0 mt-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 border-t border-[#2a3040] pt-4">
              <pre
                className="font-mono text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: '#9ca3af' }}
              >
                {q.answer}
              </pre>
              {q.code && <CodeBlock code={q.code} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Interview() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (activeCategory !== 'all' && q.category !== activeCategory) return false;
      if (activeDifficulty !== 'all' && q.difficulty !== activeDifficulty) return false;
      if (search) {
        const s = search.toLowerCase();
        return q.question.toLowerCase().includes(s) || q.answer.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeCategory, activeDifficulty, search]);

  const counts = useMemo(() => {
    const c = { easy: 0, medium: 0, hard: 0 };
    filtered.forEach(q => c[q.difficulty]++);
    return c;
  }, [filtered]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-14"
      style={{ background: '#0f1117' }}
    >
      {/* Hero */}
      <div
        className="border-b border-[#2a3040] py-12"
        style={{ background: 'linear-gradient(180deg, #161b27 0%, #0f1117 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
            {QUESTIONS.length} Questions · Freshers to Senior
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-mono font-bold text-3xl sm:text-4xl text-[#e8eaf0] mb-3"
          >
            Python Interview Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono text-sm text-[#6b7280] max-w-xl mx-auto"
          >
            Curated questions covering basics, OOP, data structures, advanced topics, concurrency, and real-world practices. Click any question to reveal the answer.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-3 mt-6 flex-wrap"
          >
            {Object.entries(DIFFICULTY).map(([key, d]) => (
              <div
                key={key}
                className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: d.bg, color: d.color, border: `1px solid ${d.border}` }}
              >
                {QUESTIONS.filter(q => q.difficulty === key).length} {d.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-14 z-20 border-b border-[#2a3040]" style={{ background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full font-mono text-sm pl-8 pr-3 py-2 rounded-lg outline-none transition-colors"
              style={{ background: '#1a1f2e', color: '#e8eaf0', border: '1px solid #2a3040' }}
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveDifficulty('all')}
              className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: activeDifficulty === 'all' ? 'rgba(59,130,246,0.15)' : '#1a1f2e',
                color: activeDifficulty === 'all' ? '#60a5fa' : '#6b7280',
                border: `1px solid ${activeDifficulty === 'all' ? 'rgba(59,130,246,0.4)' : '#2a3040'}`,
              }}
            >
              All
            </button>
            {Object.entries(DIFFICULTY).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setActiveDifficulty(key)}
                className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: activeDifficulty === key ? d.bg : '#1a1f2e',
                  color: activeDifficulty === key ? d.color : '#6b7280',
                  border: `1px solid ${activeDifficulty === key ? d.border : '#2a3040'}`,
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: activeCategory === cat.id ? `${cat.color}18` : '#1a1f2e',
                color: activeCategory === cat.id ? cat.color : '#6b7280',
                border: `1px solid ${activeCategory === cat.id ? `${cat.color}50` : '#2a3040'}`,
              }}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {QUESTIONS.filter(q => q.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-mono text-4xl mb-3">🔍</div>
            <p className="font-mono text-sm text-[#6b7280]">No questions match your filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActiveDifficulty('all'); }}
              className="mt-4 font-mono text-xs text-[#3b82f6] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-[#6b7280]">
                {filtered.length} question{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </p>
              <div className="flex gap-2">
                {counts.easy > 0 && <span className="font-mono text-xs text-[#22c55e]">{counts.easy} easy</span>}
                {counts.medium > 0 && <span className="font-mono text-xs text-[#facc15]">{counts.medium} medium</span>}
                {counts.hard > 0 && <span className="font-mono text-xs text-[#ef4444]">{counts.hard} hard</span>}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map((q, i) => (
                <QuestionCard key={q.id} q={q} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </motion.div>
  );
}
