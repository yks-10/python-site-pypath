// Expanded advanced/expert lessons — overrides short entries from lessonContent2.js

export const LESSONS_EXPERT_EXPANDED = {

  // ─── ADVANCED — expanded ─────────────────────────────────────────

  'advanced-memory-management-garbage-collection': {
    readTime: 9,
    whatYoullLearn: [
      'Understand Python\'s reference counting and when it is insufficient',
      'Know how the cyclic garbage collector finds and breaks reference cycles',
      'Identify and fix memory leaks caused by reference cycles',
      'Use weakref to hold references without preventing garbage collection',
      'Profile memory usage with tracemalloc and objgraph',
    ],
    content: `
## Reference Counting — Python\'s Primary GC Mechanism

Every Python object has a reference count — a counter of how many names/containers point to it. When the count drops to zero, the object is immediately deallocated:

\`\`\`python
import sys

# Create an object and watch its reference count
x = [1, 2, 3]
print(sys.getrefcount(x))   # 2 (x + the argument to getrefcount itself)

y = x                        # second reference
print(sys.getrefcount(x))   # 3

z = [x, x]                  # two more references
print(sys.getrefcount(x))   # 5 (x, y, z[0], z[1], + getrefcount arg)

del y                        # remove one reference
print(sys.getrefcount(x))   # 4

z = None                     # z removed → z[0] and z[1] gone → back to 2
print(sys.getrefcount(x))   # 2

# When refcount hits 0, memory is reclaimed IMMEDIATELY (in CPython):
del x
# [1, 2, 3] is freed immediately (no waiting for GC cycle)
\`\`\`

## The Cyclic Garbage Collector

Reference counting alone can't free **reference cycles** — objects that reference each other:

\`\`\`python
import gc

# Simple cycle — A refers to B refers to A:
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

a = Node("A")
b = Node("B")
a.next = b     # A → B
b.next = a     # B → A (cycle!)

# When we delete a and b:
del a, b
# Both nodes still have refcount = 1 (from each other's .next)
# Reference counting CAN'T free them!
# → Python's cyclic GC will eventually collect them

# Force a collection cycle:
gc.collect()
print(gc.collect())   # returns number of unreachable objects collected

# Monitor GC:
print(gc.get_threshold())  # (700, 10, 10) — generation thresholds
print(len(gc.get_objects()))  # all tracked objects

# Disable GC (use if you manage cycles manually):
gc.disable()
# ... do work ...
gc.enable()
\`\`\`

## Detecting Memory Leaks with tracemalloc

\`\`\`python
import tracemalloc

tracemalloc.start()    # start tracing allocations

# --- your code here ---
import json
data = [json.loads('{"x": 1}') for _ in range(100_000)]
# ----------------------

snapshot = tracemalloc.take_snapshot()
top = snapshot.statistics("lineno")[:5]
for stat in top:
    print(stat)
# Shows: filename:lineno — size in bytes, count of allocations

# Compare before/after to find leaks:
tracemalloc.start()
snap1 = tracemalloc.take_snapshot()
# ... potentially leaking code ...
snap2 = tracemalloc.take_snapshot()

diff = snap2.compare_to(snap1, "lineno")
for stat in diff[:5]:
    print(f"+{stat.size_diff/1024:.1f}KB at {stat.traceback}")
\`\`\`

## weakref — References Without Ownership

A weak reference lets you refer to an object without incrementing its reference count:

\`\`\`python
import weakref, gc

class HeavyObject:
    def __init__(self, name: str):
        self.name = name
        self.data = list(range(100_000))

    def __del__(self):
        print(f"{self.name} was garbage collected")

obj = HeavyObject("BigData")

# Strong reference — prevents GC:
strong_ref = obj
del obj
# "BigData was garbage collected" does NOT print — strong_ref keeps it alive

# Weak reference — doesn't prevent GC:
obj2 = HeavyObject("BigData2")
weak = weakref.ref(obj2)

print(weak())          # <HeavyObject 'BigData2'> — alive
print(weak().name)     # "BigData2"

del obj2               # no more strong refs!
gc.collect()
# "BigData2 was garbage collected" — freed immediately!
print(weak())          # None — referent is gone

# WeakValueDictionary — cache that doesn't prevent GC:
cache = weakref.WeakValueDictionary()
obj3 = HeavyObject("Cached")
cache["item"] = obj3
print("item" in cache)  # True

del obj3
gc.collect()
print("item" in cache)  # False — auto-cleaned!
\`\`\`

## __slots__ — Reducing Memory Per Object

\`\`\`python
import sys

class RegularPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class SlottedPoint:
    __slots__ = ("x", "y")   # declare fixed attributes
    def __init__(self, x, y):
        self.x = x
        self.y = y

rp = RegularPoint(1, 2)
sp = SlottedPoint(1, 2)

print(sys.getsizeof(rp))   # ~48 bytes (+ __dict__ overhead)
print(sys.getsizeof(rp.__dict__))   # ~232 bytes — the dict!
print(sys.getsizeof(sp))   # ~48 bytes — no __dict__!

# Slots eliminate the per-instance __dict__:
# hasattr(sp, "__dict__")  # False

# Memory saving for millions of objects:
n = 1_000_000
import tracemalloc
tracemalloc.start()
points_regular = [RegularPoint(i, i) for i in range(n)]
snap1 = tracemalloc.take_snapshot()
del points_regular

points_slotted = [SlottedPoint(i, i) for i in range(n)]
snap2 = tracemalloc.take_snapshot()
del points_slotted

# Slotted version typically uses 40-50% less memory for simple classes
\`\`\`

## Try It Yourself

\`\`\`python
import gc, weakref, sys

# 1. Create a reference cycle and verify the cyclic GC collects it:
class A:
    def __init__(self):
        self.partner = None
    def __del__(self):
        print(f"A {id(self)} collected")

gc.disable()   # prevent automatic collection

a = A()
b = A()
a.partner = b
b.partner = a
del a, b
print(f"Uncollected: {gc.collect()}")  # now collect manually

gc.enable()

# 2. Implement an object pool using weakrefs:
class ObjectPool:
    def __init__(self):
        self._pool = weakref.WeakValueDictionary()

    def get(self, key, factory):
        obj = self._pool.get(key)
        if obj is None:
            obj = factory()
            self._pool[key] = obj
        return obj

pool = ObjectPool()
obj_a = pool.get("session_1", lambda: {"data": "..."})
same = pool.get("session_1", lambda: {"data": "DIFFERENT"})
print(obj_a is same)   # True — returned the cached object

del obj_a, same
gc.collect()
# Now "session_1" is gone from the pool!
print(pool.get("session_1", lambda: "recreated"))  # "recreated"
\`\`\`
`,
  },

  // ─── EXPERT — expanded ────────────────────────────────────────────

  'expert-advanced-async-event-loop-tasks-futures': {
    readTime: 10,
    whatYoullLearn: [
      'Understand the asyncio event loop architecture',
      'Create and manage Tasks for concurrent coroutines',
      'Use asyncio.gather() and asyncio.wait() to run coroutines concurrently',
      'Work with Futures as low-level building blocks',
      'Handle task cancellation and timeouts correctly',
    ],
    content: `
## The Event Loop: How asyncio Works

asyncio runs a single-threaded **event loop** that manages coroutines, I/O events, and callbacks. At any moment, only one coroutine is executing — others are waiting on \`await\`:

\`\`\`python
import asyncio

# Coroutine: a function that can be paused and resumed
async def fetch_data(name: str, delay: float) -> str:
    print(f"{name}: starting")
    await asyncio.sleep(delay)   # yields control back to event loop
    print(f"{name}: done after {delay}s")
    return f"Data from {name}"

# Running a single coroutine:
result = asyncio.run(fetch_data("A", 1.0))   # Python 3.7+
print(result)   # "Data from A"

# asyncio.run() is the top-level entry point:
# 1. Creates an event loop
# 2. Runs the coroutine until it completes
# 3. Closes the loop
# Never call asyncio.run() inside an already-running loop (e.g., Jupyter uses %run instead)
\`\`\`

## Tasks — Concurrent Execution

A \`Task\` wraps a coroutine and schedules it to run concurrently on the event loop. Unlike awaiting directly, creating a Task starts it immediately:

\`\`\`python
import asyncio, time

async def fetch(name: str, delay: float) -> str:
    await asyncio.sleep(delay)
    return f"{name}: result"

async def sequential_demo():
    """Sequential — total time = sum of all delays."""
    start = time.perf_counter()
    r1 = await fetch("A", 1.0)   # wait 1s
    r2 = await fetch("B", 1.5)   # wait 1.5s
    r3 = await fetch("C", 0.5)   # wait 0.5s
    elapsed = time.perf_counter() - start
    print(f"Sequential: {elapsed:.1f}s")  # ≈ 3.0s

async def concurrent_demo():
    """Concurrent with gather — total time = max delay."""
    start = time.perf_counter()
    r1, r2, r3 = await asyncio.gather(
        fetch("A", 1.0),
        fetch("B", 1.5),
        fetch("C", 0.5),
    )
    elapsed = time.perf_counter() - start
    print(f"Concurrent: {elapsed:.1f}s")  # ≈ 1.5s!
    print(r1, r2, r3)

asyncio.run(concurrent_demo())
# Concurrent: 1.5s
# A: result  B: result  C: result
\`\`\`

## asyncio.gather() vs asyncio.wait()

\`\`\`python
import asyncio

async def task(name: str, delay: float, fail: bool = False) -> str:
    await asyncio.sleep(delay)
    if fail:
        raise ValueError(f"{name} failed!")
    return f"{name} done"

# gather() — runs all, returns results in order, raises on first failure
async def demo_gather():
    # Default: raises if ANY coroutine raises
    try:
        results = await asyncio.gather(
            task("A", 0.5),
            task("B", 1.0, fail=True),   # this fails
            task("C", 0.3),
        )
    except ValueError as e:
        print(f"One failed: {e}")   # "B failed!" — A and C may have been cancelled

    # With return_exceptions=True: failures become results, others continue
    results = await asyncio.gather(
        task("A", 0.5),
        task("B", 1.0, fail=True),
        task("C", 0.3),
        return_exceptions=True
    )
    for r in results:
        if isinstance(r, Exception):
            print(f"Failed: {r}")
        else:
            print(f"Success: {r}")
    # "A done", "ValueError: B failed!", "C done"

# wait() — more control: which are done vs pending
async def demo_wait():
    coros = [task("A", 0.5), task("B", 1.5), task("C", 0.3)]
    tasks = [asyncio.create_task(c) for c in coros]

    # Wait for first to complete:
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    for t in done:
        print(f"First done: {t.result()}")   # "C done" (fastest)
    for t in pending:
        t.cancel()   # cancel remaining

    # Wait with timeout:
    tasks2 = [asyncio.create_task(task("D", 2.0))]
    done, pending = await asyncio.wait(tasks2, timeout=1.0)
    if pending:
        print("Timed out, cancelling...")
        for t in pending:
            t.cancel()

asyncio.run(demo_gather())
asyncio.run(demo_wait())
\`\`\`

## Task Cancellation

\`\`\`python
import asyncio

async def long_running():
    try:
        print("Starting long task...")
        await asyncio.sleep(10)
        return "finished"
    except asyncio.CancelledError:
        print("Task was cancelled! Cleaning up...")
        # Cleanup code here (close files, connections, etc.)
        raise   # ALWAYS re-raise CancelledError!

async def main():
    task = asyncio.create_task(long_running())

    await asyncio.sleep(2)       # let it run for 2 seconds
    task.cancel()                 # request cancellation

    try:
        result = await task       # wait for it to acknowledge cancellation
    except asyncio.CancelledError:
        print("Task successfully cancelled")

asyncio.run(main())
# Starting long task...
# Task was cancelled! Cleaning up...
# Task successfully cancelled
\`\`\`

## Timeouts with asyncio.timeout() (Python 3.11+)

\`\`\`python
import asyncio

async def slow_operation():
    await asyncio.sleep(5)
    return "result"

# Python 3.11+ — asyncio.timeout():
async def with_timeout():
    try:
        async with asyncio.timeout(2.0):
            result = await slow_operation()
    except TimeoutError:
        print("Operation timed out!")

# Python 3.9+ — asyncio.wait_for():
async def with_wait_for():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
    except asyncio.TimeoutError:
        print("wait_for timed out!")

asyncio.run(with_timeout())
asyncio.run(with_wait_for())
\`\`\`

## Futures — Low-Level Primitives

\`Future\` represents a value that doesn\'t exist yet. Tasks are a special kind of Future:

\`\`\`python
import asyncio

async def set_future_result(future: asyncio.Future, value, delay: float):
    await asyncio.sleep(delay)
    future.set_result(value)

async def main():
    loop = asyncio.get_event_loop()
    future = loop.create_future()

    # Schedule something that will set the result:
    asyncio.create_task(set_future_result(future, "hello", 1.0))

    result = await future    # wait until result is set
    print(result)   # "hello"

    # Future states:
    f = loop.create_future()
    print(f.done())      # False — pending
    f.set_result(42)
    print(f.done())      # True — resolved
    print(f.result())    # 42

asyncio.run(main())
\`\`\`

## Semaphores for Concurrency Control

\`\`\`python
import asyncio, aiohttp

async def fetch_url(session, url: str, semaphore: asyncio.Semaphore) -> dict:
    async with semaphore:   # limit concurrent requests
        async with session.get(url) as response:
            return {"url": url, "status": response.status}

async def fetch_all(urls: list, max_concurrent: int = 10) -> list:
    """Fetch all URLs but no more than max_concurrent at once."""
    semaphore = asyncio.Semaphore(max_concurrent)
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url, semaphore) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

# asyncio.run(fetch_all(["https://example.com"] * 100, max_concurrent=5))
\`\`\`

## Try It Yourself

\`\`\`python
import asyncio, time

# 1. Implement a rate-limited task runner:
async def run_with_rate_limit(coros, rate_per_second: int):
    """Run coroutines but no more than rate_per_second per second."""
    semaphore = asyncio.Semaphore(rate_per_second)
    delay = 1.0 / rate_per_second

    async def limited(coro):
        async with semaphore:
            result = await coro
            await asyncio.sleep(delay)   # throttle
            return result

    return await asyncio.gather(*(limited(c) for c in coros))

# 2. Write a progress-tracking gather:
async def tracked_gather(*coros):
    """Like gather but prints progress as tasks complete."""
    total = len(coros)
    completed = 0
    results = [None] * total

    async def tracked(i, coro):
        nonlocal completed
        result = await coro
        completed += 1
        print(f"Progress: {completed}/{total} ({100*completed//total}%)")
        results[i] = result
        return result

    await asyncio.gather(*(tracked(i, c) for i, c in enumerate(coros)))
    return results

async def sample_task(n: int) -> int:
    await asyncio.sleep(n * 0.1)
    return n * 2

asyncio.run(tracked_gather(*(sample_task(i) for i in range(5))))
\`\`\`
`,
  },

  'expert-data-handling-serialization-pickle': {
    readTime: 8,
    whatYoullLearn: [
      'Serialize Python objects to binary format with pickle',
      'Understand what pickle can and cannot serialize',
      'Control pickling behavior with __reduce__ and __getstate__/__setstate__',
      'Use protocol versions for compatibility and performance',
      'Recognize security risks and use safer alternatives when appropriate',
    ],
    content: `
## What Is pickle?

\`pickle\` serializes almost any Python object to bytes and back. Unlike JSON (which only handles dicts/lists/strings/numbers), pickle handles classes, functions, lambdas, custom objects, numpy arrays, and more:

\`\`\`python
import pickle

# Serialize to bytes (pickling / marshaling)
data = {
    "name": "Alice",
    "scores": [95, 87, 92],
    "active": True,
    "config": {"timeout": 30, "retries": 3},
}

pickled = pickle.dumps(data)   # returns bytes
print(type(pickled))           # <class 'bytes'>
print(len(pickled))            # ~100 bytes

# Deserialize from bytes (unpickling / unmarshaling)
restored = pickle.loads(pickled)
print(restored == data)        # True

# To/from a file:
with open("data.pkl", "wb") as f:
    pickle.dump(data, f, protocol=pickle.HIGHEST_PROTOCOL)

with open("data.pkl", "rb") as f:
    loaded = pickle.load(f)

print(loaded == data)   # True
\`\`\`

## Protocol Versions

\`\`\`python
import pickle, sys

# Protocol 0  — ASCII, human-readable-ish, all Python versions
# Protocol 1  — binary, all Python versions
# Protocol 2  — new-style classes, Python 2.3+
# Protocol 3  — Python 3 bytes literals, Python 3.0+
# Protocol 4  — large objects, Python 3.4+
# Protocol 5  — out-of-band data, Python 3.8+

print(pickle.DEFAULT_PROTOCOL)   # 5 (Python 3.11)
print(pickle.HIGHEST_PROTOCOL)   # 5

# Specify protocol explicitly for cross-version compatibility:
pickled_p2 = pickle.dumps(data, protocol=2)   # compatible with Python 2/3
pickled_p5 = pickle.dumps(data, protocol=5)   # fastest, Python 3.8+ only

# Protocol 5 is typically smaller and faster:
print(f"Protocol 2: {len(pickled_p2)} bytes")
print(f"Protocol 5: {len(pickled_p5)} bytes")
\`\`\`

## What Can Be Pickled

\`\`\`python
import pickle

# ✓ CAN be pickled:
pickle.dumps(42)                          # integers
pickle.dumps(3.14)                        # floats
pickle.dumps("hello")                     # strings
pickle.dumps([1, 2, 3])                   # lists
pickle.dumps({"a": 1})                    # dicts
pickle.dumps((1, 2, 3))                   # tuples
pickle.dumps({1, 2, 3})                   # sets
pickle.dumps(None)                        # None
pickle.dumps(True)                        # booleans

# Custom classes — if defined at module level:
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)
pickled = pickle.dumps(p)
restored = pickle.loads(pickled)
print(restored.x, restored.y)    # 3 4

# Named functions:
def double(x): return x * 2
pickle.dumps(double)   # works if double is importable

# ✗ CANNOT be pickled:
import tempfile
f = tempfile.TemporaryFile()
# pickle.dumps(f)      # TypeError — file objects not picklable
# pickle.dumps(lambda x: x)  # AttributeError — lambda not picklable
# pickle.dumps(lambda x: x)  # fails because lambda has no __qualname__ for import
\`\`\`

## Customizing Pickling

\`\`\`python
import pickle

class Connection:
    """Database connection — can't be pickled directly."""

    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self._conn = self._connect()   # live connection — not picklable!

    def _connect(self):
        return object()   # simulate connection object

    def __getstate__(self) -> dict:
        """Return state to pickle — exclude unpicklable objects."""
        state = self.__dict__.copy()
        del state["_conn"]    # remove the live connection
        return state

    def __setstate__(self, state: dict) -> None:
        """Restore state from pickle — recreate unpicklable objects."""
        self.__dict__.update(state)
        self._conn = self._connect()  # reconnect on load

conn = Connection("db.example.com", 5432)
pickled = pickle.dumps(conn)
restored = pickle.loads(pickled)
print(restored.host, restored.port)  # db.example.com 5432
print(hasattr(restored, "_conn"))    # True — reconnected!

# Using __reduce__ for more control:
class MyRange:
    """Recreatable via __reduce__."""
    def __init__(self, start, stop):
        self.start = start
        self.stop = stop

    def __reduce__(self):
        """Return (callable, args) to reconstruct the object."""
        return (MyRange, (self.start, self.stop))

    def __repr__(self):
        return f"MyRange({self.start}, {self.stop})"

r = MyRange(1, 10)
restored = pickle.loads(pickle.dumps(r))
print(restored)   # MyRange(1, 10)
\`\`\`

## Security Warning

\`\`\`python
# ⚠️  NEVER unpickle data from untrusted sources!
# pickle.loads() can execute arbitrary code:

import pickle, os

# This is a malicious pickle payload (educational example):
class Evil:
    def __reduce__(self):
        return (os.system, ("echo SECURITY RISK",))

# malicious = pickle.dumps(Evil())
# pickle.loads(malicious)   # executes os.system()!

# Safe alternatives for external data exchange:
# - JSON: json.dumps() / json.loads() — no code execution possible
# - MessagePack: fast binary, no code execution
# - Protocol Buffers / Avro — typed, safe
# - SQLite / database — structured queries

# If you must use pickle with semi-trusted sources, consider:
import pickletools
safe_data = pickle.dumps({"key": "value"})
pickletools.dis(safe_data)   # inspect the pickle opcodes before loading
\`\`\`

## Practical Use Cases

\`\`\`python
import pickle
from pathlib import Path
from functools import lru_cache
import hashlib, json

class DiskCache:
    """Simple disk-based cache for expensive computations using pickle."""

    def __init__(self, cache_dir: str = ".cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

    def _key_path(self, key) -> Path:
        key_hash = hashlib.md5(pickle.dumps(key)).hexdigest()
        return self.cache_dir / f"{key_hash}.pkl"

    def get(self, key):
        path = self._key_path(key)
        if path.exists():
            with open(path, "rb") as f:
                return pickle.load(f)
        return None

    def set(self, key, value) -> None:
        path = self._key_path(key)
        with open(path, "wb") as f:
            pickle.dump(value, f, protocol=pickle.HIGHEST_PROTOCOL)

    def cached(self, func):
        """Decorator that caches function results on disk."""
        def wrapper(*args, **kwargs):
            key = (func.__qualname__, args, sorted(kwargs.items()))
            result = self.get(key)
            if result is None:
                result = func(*args, **kwargs)
                self.set(key, result)
            return result
        return wrapper

cache = DiskCache()

@cache.cached
def expensive_computation(n: int) -> list:
    print(f"Computing for n={n}...")
    return list(range(n * 1000))

result1 = expensive_computation(100)   # "Computing..."
result2 = expensive_computation(100)   # from cache, no print!
print(result1 == result2)              # True
\`\`\`

## shelve — Persistent Object Store

\`shelve\` provides a dict-like interface backed by pickle and a database file:

\`\`\`python
import shelve

# Like a persistent dict:
with shelve.open("my_shelf") as db:
    db["user"] = {"name": "Alice", "score": 95}
    db["config"] = {"debug": False, "timeout": 30}
    db["numbers"] = list(range(100))

# Later:
with shelve.open("my_shelf") as db:
    print(db["user"])     # {"name": "Alice", "score": 95}
    user = db["user"]
    user["score"] = 100
    db["user"] = user     # must reassign to persist changes!

    # Alternatively, use writeback=True to auto-persist:
with shelve.open("my_shelf", writeback=True) as db:
    db["user"]["score"] = 99   # automatically saved
\`\`\`

## Try It Yourself

\`\`\`python
import pickle
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class UserSession:
    user_id: int
    username: str
    login_time: datetime
    permissions: list = field(default_factory=list)
    _internal_counter: int = field(default=0, repr=False)

    def __getstate__(self):
        """Exclude the internal counter from pickling."""
        state = self.__dict__.copy()
        del state["_internal_counter"]
        return state

    def __setstate__(self, state):
        self.__dict__.update(state)
        self._internal_counter = 0   # reset on restore

session = UserSession(
    user_id=42,
    username="alice",
    login_time=datetime.now(),
    permissions=["read", "write"]
)
session._internal_counter = 999   # simulate runtime state

# Pickle and restore:
data = pickle.dumps(session, protocol=5)
restored = pickle.loads(data)

print(restored.username)           # "alice"
print(restored.permissions)        # ["read", "write"]
print(restored._internal_counter)  # 0 — reset!
print(restored.login_time)         # original datetime preserved
\`\`\`
`,
  },

  'expert-packaging-setuptools-pypi': {
    readTime: 10,
    whatYoullLearn: [
      'Understand the structure of a publishable Python package',
      'Configure a package with pyproject.toml (modern standard)',
      'Build source distributions and wheels with build',
      'Publish to PyPI and TestPyPI with twine',
      'Write proper package metadata, classifiers, and entry points',
    ],
    content: `
## Package vs Module vs Library

- **Module**: a single \`.py\` file
- **Package**: a directory with \`__init__.py\`
- **Distribution**: what you install with \`pip\` — contains packages/modules + metadata
- **Library**: a collection of useful packages (may be one distribution)

## Project Structure

\`\`\`
my_toolkit/                   ← project root (repository root)
├── pyproject.toml            ← build system config + package metadata
├── README.md                 ← used as long description on PyPI
├── LICENSE                   ← required for PyPI
├── CHANGELOG.md              ← version history
├── src/                      ← src layout (recommended)
│   └── my_toolkit/           ← the actual package
│       ├── __init__.py
│       ├── core.py
│       ├── utils.py
│       └── cli.py
└── tests/                    ← test files
    ├── test_core.py
    └── test_utils.py
\`\`\`

## pyproject.toml — Modern Packaging Standard (PEP 517/518)

\`\`\`toml
# pyproject.toml — replaces setup.py, setup.cfg, requirements.txt for a library

[build-system]
requires = ["setuptools>=68.0", "wheel"]
build-backend = "setuptools.backends.legacy:build"

[project]
name = "my-toolkit"                      # PyPI package name (use hyphens)
version = "1.2.0"
description = "A toolkit for Python developers"
authors = [{ name = "Alice Dev", email = "alice@example.com" }]
license = { text = "MIT" }
readme = "README.md"
requires-python = ">=3.10"

# Runtime dependencies:
dependencies = [
    "requests>=2.28,<3.0",
    "click>=8.0",
    "pydantic>=2.0",
]

# Optional dependencies (pip install my-toolkit[dev]):
[project.optional-dependencies]
dev = ["pytest>=7.0", "ruff", "mypy", "black"]
docs = ["sphinx", "sphinx-rtd-theme"]

# Package classifiers (https://pypi.org/classifiers/):
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Libraries :: Python Modules",
]

# Keywords shown on PyPI:
keywords = ["toolkit", "utilities", "developer-tools"]

# Project URLs (shown on PyPI sidebar):
[project.urls]
Homepage = "https://github.com/alice/my-toolkit"
Documentation = "https://my-toolkit.readthedocs.io"
"Bug Tracker" = "https://github.com/alice/my-toolkit/issues"
Changelog = "https://github.com/alice/my-toolkit/blob/main/CHANGELOG.md"

# CLI entry points — creates 'mytoolkit' command:
[project.scripts]
mytoolkit = "my_toolkit.cli:main"

# GUI entry points:
[project.gui-scripts]
mytoolkit-gui = "my_toolkit.gui:main"

# Setuptools-specific config:
[tool.setuptools.packages.find]
where = ["src"]    # look for packages in src/

[tool.setuptools.package-data]
"my_toolkit" = ["*.yaml", "templates/*.html"]  # include non-Python files
\`\`\`

## Package __init__.py — Public API

\`\`\`python
# src/my_toolkit/__init__.py
"""my-toolkit: A toolkit for Python developers."""

from .core import DataProcessor, Config
from .utils import format_bytes, slugify

__version__ = "1.2.0"
__author__ = "Alice Dev"
__all__ = ["DataProcessor", "Config", "format_bytes", "slugify"]

# Now users can do:
# from my_toolkit import DataProcessor   # instead of from my_toolkit.core import ...
# import my_toolkit; my_toolkit.__version__  # "1.2.0"
\`\`\`

## CLI Entry Point

\`\`\`python
# src/my_toolkit/cli.py
import click
from . import __version__
from .core import DataProcessor

@click.group()
@click.version_option(__version__)
def main():
    """my-toolkit: A toolkit for Python developers."""

@main.command()
@click.argument("input_file")
@click.option("--output", "-o", default="out.json", help="Output file path")
@click.option("--verbose", "-v", is_flag=True, help="Enable verbose output")
def process(input_file: str, output: str, verbose: bool):
    """Process INPUT_FILE and write results to OUTPUT."""
    if verbose:
        click.echo(f"Processing {input_file}...")
    processor = DataProcessor(input_file)
    result = processor.run()
    result.save(output)
    click.echo(f"✓ Done: {output}")

if __name__ == "__main__":
    main()
\`\`\`

## Building the Distribution

\`\`\`bash
# Install build tools
pip install build twine

# Build both sdist (.tar.gz) and wheel (.whl)
python -m build
# Creates:
# dist/
# ├── my_toolkit-1.2.0-py3-none-any.whl    ← wheel (fast install)
# └── my_toolkit-1.2.0.tar.gz              ← source distribution

# Inspect the wheel contents:
unzip -l dist/my_toolkit-1.2.0-py3-none-any.whl

# Check for PyPI issues before uploading:
twine check dist/*
\`\`\`

## Publishing to PyPI

\`\`\`bash
# 1. Create accounts on:
# - TestPyPI: https://test.pypi.org (safe playground)
# - PyPI:     https://pypi.org (real production)

# 2. Create API tokens (preferred over username/password):
# PyPI → Account Settings → API tokens → Add API token

# 3. Configure ~/.pypirc:
cat > ~/.pypirc << 'EOF'
[distutils]
index-servers = pypi testpypi

[pypi]
repository = https://upload.pypi.org/legacy/
username = __token__
password = pypi-AgEI...your-token...

[testpypi]
repository = https://test.pypi.org/legacy/
username = __token__
password = pypi-AgEI...test-token...
EOF
chmod 600 ~/.pypirc

# 4. Test on TestPyPI first:
twine upload --repository testpypi dist/*
pip install --index-url https://test.pypi.org/simple/ my-toolkit

# 5. Upload to real PyPI:
twine upload dist/*
pip install my-toolkit
\`\`\`

## Versioning — Semantic Versioning

Follow [semver.org](https://semver.org): \`MAJOR.MINOR.PATCH\`
- **MAJOR**: breaking changes (1.x.x → 2.0.0)
- **MINOR**: new features, backward compatible (1.2.x → 1.3.0)
- **PATCH**: bug fixes only (1.2.3 → 1.2.4)

\`\`\`bash
# Use bump2version to automate version bumps:
pip install bump2version

# .bumpversion.cfg:
# [bumpversion]
# current_version = 1.2.0
# commit = True
# tag = True
# [bumpversion:file:src/my_toolkit/__init__.py]
# [bumpversion:file:pyproject.toml]

bump2version patch   # 1.2.0 → 1.2.1 (commits + tags)
bump2version minor   # 1.2.1 → 1.3.0
bump2version major   # 1.3.0 → 2.0.0
\`\`\`

## Try It Yourself

\`\`\`bash
# Create a real (though small) package from scratch:

mkdir mycolor && cd mycolor
mkdir -p src/mycolor tests

# src/mycolor/__init__.py
cat > src/mycolor/__init__.py << 'PYEOF'
"""mycolor: Terminal color utilities."""
__version__ = "0.1.0"
from .ansi import red, green, blue, bold, reset
__all__ = ["red", "green", "blue", "bold", "reset"]
PYEOF

# src/mycolor/ansi.py
cat > src/mycolor/ansi.py << 'PYEOF'
def _wrap(code: int, text: str) -> str:
    return f"\\033[{code}m{text}\\033[0m"

def red(text: str) -> str: return _wrap(31, text)
def green(text: str) -> str: return _wrap(32, text)
def blue(text: str) -> str: return _wrap(34, text)
def bold(text: str) -> str: return _wrap(1, text)
def reset(text: str) -> str: return text
PYEOF

# Create pyproject.toml, build, and install locally:
pip install build
python -m build
pip install dist/mycolor-0.1.0-py3-none-any.whl
python -c "from mycolor import red, green; print(red('Error!'), green('OK'))"
\`\`\`
`,
  },

  'expert-advanced-libraries-matplotlib-seaborn': {
    readTime: 10,
    whatYoullLearn: [
      'Create publication-quality figures with matplotlib',
      'Understand the Figure/Axes architecture and when to use each approach',
      'Customize plots with colors, labels, annotations, and styles',
      'Use seaborn for statistical visualizations with less code',
      'Save figures in different formats for web, print, and presentations',
    ],
    content: `
## Matplotlib Architecture: Figure and Axes

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Two APIs — object-oriented (recommended) vs pyplot state machine:

# 1. Object-oriented (OO) — explicit, composable:
fig, ax = plt.subplots(figsize=(8, 5))   # figure + single axes
ax.plot([1, 2, 3], [4, 5, 6])
ax.set_title("My Plot")
ax.set_xlabel("X axis")
ax.set_ylabel("Y axis")

# 2. pyplot state machine — quick and dirty, fine for scripts:
plt.figure(figsize=(8, 5))
plt.plot([1, 2, 3], [4, 5, 6])
plt.title("My Plot")
plt.xlabel("X axis")
plt.ylabel("Y axis")

# Key components:
# Figure: the whole figure (canvas)  — fig.savefig("out.png")
# Axes:   the individual plot area   — ax.plot(), ax.set_*()
# Axis:   the x-axis or y-axis       — ax.xaxis, ax.yaxis
# Artist: everything drawn (Text, Line2D, Patch, ...) — ax.get_children()
\`\`\`

## Line Plots — Options and Customization

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 200)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Left: multiple lines with customization
ax = axes[0]
ax.plot(x, np.sin(x), label="sin(x)",  color="royalblue",  lw=2)
ax.plot(x, np.cos(x), label="cos(x)",  color="tomato",     lw=2, linestyle="--")
ax.plot(x, np.sin(2*x), label="sin(2x)", color="seagreen", lw=1.5, alpha=0.7)

ax.axhline(0, color="black", lw=0.5, ls="dotted")    # horizontal reference line
ax.axvline(np.pi, color="gray", lw=0.5, ls="dotted")  # vertical reference line
ax.fill_between(x, np.sin(x), 0, alpha=0.1, color="royalblue")  # shading

ax.set_xlim(0, 2*np.pi)
ax.set_xticks([0, np.pi/2, np.pi, 3*np.pi/2, 2*np.pi])
ax.set_xticklabels(["0", "π/2", "π", "3π/2", "2π"])
ax.legend(loc="upper right", fontsize=9)
ax.set_title("Trigonometric Functions")
ax.grid(True, alpha=0.3, ls="--")

# Right: scatter plot with size and color mapping
ax2 = axes[1]
n = 200
x_data = np.random.randn(n)
y_data = x_data * 0.8 + np.random.randn(n) * 0.5
colors = np.sqrt(x_data**2 + y_data**2)   # distance from origin

sc = ax2.scatter(x_data, y_data,
                  c=colors, cmap="viridis",
                  s=30, alpha=0.7, edgecolors="white", lw=0.3)
fig.colorbar(sc, ax=ax2, label="Distance from origin")
ax2.set_title("Colored Scatter Plot")
ax2.set_xlabel("X"); ax2.set_ylabel("Y")

plt.tight_layout()
plt.savefig("trig_scatter.png", dpi=150, bbox_inches="tight")
plt.show()
\`\`\`

## Bar Charts, Histograms, and Box Plots

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

# Bar chart
categories = ["Q1", "Q2", "Q3", "Q4"]
sales_2024 = [120, 145, 162, 198]
sales_2025 = [135, 170, 155, 220]
x = np.arange(len(categories))
width = 0.35

ax = axes[0]
bars1 = ax.bar(x - width/2, sales_2024, width, label="2024", color="steelblue", alpha=0.8)
bars2 = ax.bar(x + width/2, sales_2025, width, label="2025", color="coral", alpha=0.8)

# Add value labels on bars:
ax.bar_label(bars1, padding=2, fontsize=8)
ax.bar_label(bars2, padding=2, fontsize=8)

ax.set_xticks(x)
ax.set_xticklabels(categories)
ax.set_title("Quarterly Sales Comparison")
ax.legend()
ax.set_ylabel("Revenue ($K)")

# Histogram
data = np.concatenate([np.random.normal(170, 10, 500),
                        np.random.normal(155, 8, 300)])
axes[1].hist(data, bins=30, color="mediumpurple", edgecolor="white",
             alpha=0.8, density=True)
axes[1].set_title("Height Distribution")
axes[1].set_xlabel("Height (cm)")
axes[1].set_ylabel("Probability Density")

# Box plot
np.random.seed(42)
data_groups = {
    "Control": np.random.normal(70, 10, 100),
    "Treatment A": np.random.normal(85, 8, 100),
    "Treatment B": np.random.normal(80, 12, 100),
}
axes[2].boxplot(list(data_groups.values()),
                labels=list(data_groups.keys()),
                notch=True, patch_artist=True,
                boxprops=dict(facecolor="lightblue", alpha=0.7))
axes[2].set_title("Score Distribution by Group")
axes[2].set_ylabel("Score")

plt.tight_layout()
plt.savefig("multiplot.png", dpi=150)
plt.show()
\`\`\`

## Annotations and Styles

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

plt.style.use("seaborn-v0_8-whitegrid")   # apply a predefined style

fig, ax = plt.subplots(figsize=(10, 6))

# Plot S&P 500-like data
x = np.arange(100)
price = 100 * np.exp(np.cumsum(np.random.normal(0.003, 0.02, 100)))
ax.plot(x, price, color="steelblue", lw=2)

# Find and annotate max/min:
max_idx = np.argmax(price)
min_idx = np.argmin(price)

ax.annotate(f"Peak: \${price[max_idx]:.0f}",
            xy=(max_idx, price[max_idx]),
            xytext=(max_idx - 20, price[max_idx] + 10),
            arrowprops=dict(arrowstyle="->", color="green"),
            color="green", fontweight="bold")

ax.annotate(f"Trough: \${price[min_idx]:.0f}",
            xy=(min_idx, price[min_idx]),
            xytext=(min_idx + 5, price[min_idx] - 15),
            arrowprops=dict(arrowstyle="->", color="red"),
            color="red", fontweight="bold")

# Add a text box:
textstr = f"Final: \${price[-1]:.0f}\\nReturn: {(price[-1]/price[0]-1)*100:.1f}%"
ax.text(0.02, 0.97, textstr, transform=ax.transAxes,
        verticalalignment="top",
        bbox=dict(boxstyle="round", facecolor="wheat", alpha=0.5))

ax.set_title("Simulated Stock Price", fontsize=14, fontweight="bold")
ax.set_xlabel("Trading Day")
ax.set_ylabel("Price ($)")
fig.savefig("stock.png", dpi=150, bbox_inches="tight")
\`\`\`

## Seaborn — Statistical Visualization

Seaborn builds on matplotlib with a higher-level interface for statistical plots:

\`\`\`python
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

# Load a built-in dataset
df = sns.load_dataset("tips")   # restaurant tips data
print(df.head())

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 1. Distribution plot
sns.histplot(data=df, x="total_bill", hue="sex", multiple="stack",
             ax=axes[0][0], palette="pastel")
axes[0][0].set_title("Bill Distribution by Gender")

# 2. Box plot
sns.boxplot(data=df, x="day", y="total_bill", hue="smoker",
            ax=axes[0][1], palette="Set2", order=["Thur", "Fri", "Sat", "Sun"])
axes[0][1].set_title("Bill by Day and Smoking Status")

# 3. Regression plot
sns.regplot(data=df, x="total_bill", y="tip", ax=axes[1][0],
            scatter_kws={"alpha": 0.5}, line_kws={"color": "red"})
axes[1][0].set_title("Tip vs Bill (with regression)")

# 4. Heatmap — correlation matrix
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
            ax=axes[1][1], center=0, square=True)
axes[1][1].set_title("Correlation Matrix")

plt.tight_layout()
plt.savefig("seaborn_demo.png", dpi=150)
plt.show()
\`\`\`

## Saving and Exporting

\`\`\`python
# Different formats for different purposes:
fig.savefig("output.png",  dpi=300, bbox_inches="tight")  # raster, web
fig.savefig("output.pdf",  bbox_inches="tight")             # vector, LaTeX
fig.savefig("output.svg",  bbox_inches="tight")             # vector, web
fig.savefig("output.eps",  bbox_inches="tight")             # vector, print

# Transparent background:
fig.savefig("logo.png", transparent=True)

# Save to bytes (for web apps):
import io
buf = io.BytesIO()
fig.savefig(buf, format="png", dpi=150, bbox_inches="tight")
buf.seek(0)
png_bytes = buf.read()   # send as HTTP response
\`\`\`

## Try It Yourself

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

# Challenge: Create a dashboard with 4 subplots showing:
# 1. A time series with trend line
# 2. A pie chart of category proportions
# 3. A violin plot comparing distributions
# 4. A 2D histogram (hexbin or heatmap)

fig = plt.figure(figsize=(14, 10))
fig.suptitle("Data Analysis Dashboard", fontsize=16, fontweight="bold")

# 1. Time series
ax1 = fig.add_subplot(2, 2, 1)
days = np.arange(90)
sales = 100 + np.cumsum(np.random.randn(90) * 3) + days * 0.5
ax1.plot(days, sales, alpha=0.6, label="Daily Sales")
z = np.polyfit(days, sales, 1)
ax1.plot(days, np.poly1d(z)(days), "r--", label="Trend")
ax1.legend(); ax1.set_title("90-Day Sales Trend")

# 2. Pie chart
ax2 = fig.add_subplot(2, 2, 2)
sizes = [35, 25, 20, 15, 5]
labels = ["Electronics", "Clothing", "Food", "Books", "Other"]
ax2.pie(sizes, labels=labels, autopct="%1.0f%%", startangle=90)
ax2.set_title("Revenue by Category")

# 3-4: Continue on your own!
plt.tight_layout()
plt.savefig("dashboard.png", dpi=150, bbox_inches="tight")
\`\`\`
`,
  },

};
