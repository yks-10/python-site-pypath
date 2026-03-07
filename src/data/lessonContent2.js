// Advanced, Expert, Mastery lesson content
// Merged into LESSONS in lessonContent.js via index.js

export const LESSONS_ADVANCED = {

  'advanced-functional-programming-closures': {
    readTime: 8,
    whatYoullLearn: [
      'Understand how closures capture free variables',
      'Use nonlocal to modify enclosing scope variables',
      'Build factory functions using closures',
      'Understand when closures are preferable to classes',
      'Avoid common closure pitfalls in loops',
    ],
    content: `
## What is a Closure?

A closure is a function that remembers the variables from the enclosing scope where it was defined, even after that scope has finished executing:

\`\`\`python
def make_counter(start=0):
    count = start              # free variable — captured by inner function

    def increment(step=1):
        nonlocal count         # tell Python we want to modify the enclosing count
        count += step
        return count

    return increment

counter = make_counter(10)
print(counter())    # 11
print(counter())    # 12
print(counter(5))   # 17

# Each call to make_counter() creates an independent closure:
c1 = make_counter(0)
c2 = make_counter(100)
c1()   # 1
c2()   # 101
c1()   # 2  — c1 and c2 don't share state
\`\`\`

## Factory Functions

Closures are great for creating parameterized functions:

\`\`\`python
def make_multiplier(factor):
    """Returns a function that multiplies by factor."""
    def multiplier(x):
        return x * factor
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)
tenx = make_multiplier(10)

print(double(5))    # 10
print(triple(5))    # 15
print(list(map(tenx, [1, 2, 3])))  # [10, 20, 30]

# Validator factory:
def make_validator(min_val, max_val, name="value"):
    def validate(x):
        if not (min_val <= x <= max_val):
            raise ValueError(f"{name} must be in [{min_val}, {max_val}], got {x}")
        return x
    return validate

validate_age = make_validator(0, 150, "age")
validate_score = make_validator(0, 100, "score")

validate_age(25)     # ✓
validate_score(105)  # ValueError: score must be in [0, 100], got 105
\`\`\`

## The Loop Closure Trap

A common bug: closures in loops capture the variable reference, not the value:

\`\`\`python
# ✗ BUG: all functions use the final value of i
functions = []
for i in range(5):
    def f():
        return i
    functions.append(f)

print([f() for f in functions])   # [4, 4, 4, 4, 4] — all 4!

# ✓ FIX 1: capture with default argument
functions = []
for i in range(5):
    def f(x=i):    # x gets the CURRENT value of i at definition time
        return x
    functions.append(f)

print([f() for f in functions])   # [0, 1, 2, 3, 4] ✓

# ✓ FIX 2: use a factory function
def make_func(n):
    def f():
        return n
    return f

functions = [make_func(i) for i in range(5)]
print([f() for f in functions])   # [0, 1, 2, 3, 4] ✓
\`\`\`

## Closures vs Classes

Closures are a lightweight alternative to classes with a single method:

\`\`\`python
# Class approach
class Adder:
    def __init__(self, n):
        self.n = n
    def __call__(self, x):
        return x + self.n

add5 = Adder(5)
print(add5(10))   # 15

# Closure approach (simpler for single method)
def make_adder(n):
    def add(x):
        return x + n
    return add

add5 = make_adder(5)
print(add5(10))   # 15

# Use classes when you need: multiple methods, inheritance, state inspection
# Use closures when: one method, simple, no need for class machinery
\`\`\`

## Try It Yourself

\`\`\`python
# Write a make_logger(prefix) closure that:
# - Takes a prefix string (e.g., "[INFO]", "[ERROR]")
# - Returns a function that prints the prefix + message
# - Tracks a count of messages logged (accessible via .count attribute on the inner fn)

info = make_logger("[INFO]")
warn = make_logger("[WARN]")
info("Server started")     # [INFO] Server started
warn("Low memory")         # [WARN] Low memory
info("Request received")   # [INFO] Request received
print(info.count)          # 2
\`\`\`
`,
  },

  'advanced-functional-programming-higher-order-functions': {
    readTime: 7,
    whatYoullLearn: [
      'Pass functions as arguments to other functions',
      'Return functions from functions',
      'Compose functions using a compose() utility',
      'Use functools.partial for partial application',
      'Apply currying patterns in Python',
    ],
    content: `
## Functions as First-Class Objects

In Python, functions are objects — you can store them in variables, put them in lists, pass them to other functions, and return them:

\`\`\`python
def apply_twice(func, value):
    """Apply func to value twice."""
    return func(func(value))

def square(x):
    return x ** 2

print(apply_twice(square, 3))    # 81 (3² = 9, 9² = 81)
print(apply_twice(str.upper, "hello"))   # "HELLO" (already upper, stays upper)

# Store functions in data structures:
operations = {
    "add": lambda a, b: a + b,
    "sub": lambda a, b: a - b,
    "mul": lambda a, b: a * b,
}

def calculate(op_name, a, b):
    if op_name not in operations:
        raise ValueError(f"Unknown operation: {op_name}")
    return operations[op_name](a, b)

print(calculate("add", 5, 3))   # 8
\`\`\`

## Function Composition

Composition chains multiple functions: \`compose(f, g)(x) == f(g(x))\`:

\`\`\`python
def compose(*functions):
    """Compose functions right-to-left."""
    from functools import reduce
    def composed(x):
        return reduce(lambda v, f: f(v), reversed(functions), x)
    return composed

def double(x): return x * 2
def add_one(x): return x + 1
def square(x): return x ** 2

# compose(f, g)(x) means f(g(x)) — g runs first
double_then_add = compose(add_one, double)
print(double_then_add(5))   # add_one(double(5)) = add_one(10) = 11

pipeline = compose(str, square, add_one, double)
print(pipeline(3))   # str(square(add_one(double(3)))) = str(49) = "49"
\`\`\`

## functools.partial — Partial Application

\`partial\` creates a new function with some arguments pre-filled:

\`\`\`python
from functools import partial

def power(base, exponent):
    return base ** exponent

# Create specialized versions
square = partial(power, exponent=2)
cube = partial(power, exponent=3)
powers_of_2 = partial(power, 2)   # fix base=2, exponent is free

print(square(5))          # 25
print(cube(3))            # 27
print(powers_of_2(10))    # 1024

# Practical: pre-configure a function
import os
join_data_dir = partial(os.path.join, "/var/data")
print(join_data_dir("users.csv"))    # "/var/data/users.csv"
print(join_data_dir("logs/app.log")) # "/var/data/logs/app.log"
\`\`\`

## Try It Yourself

\`\`\`python
from functools import partial, reduce

# 1. Build a pipeline() function that applies a list of transformations:
def pipeline(data, *transforms):
    return reduce(lambda x, f: f(x), transforms, data)

result = pipeline(
    "  Hello, World!  ",
    str.strip,
    str.lower,
    lambda s: s.replace(",", ""),
    str.split,
)
print(result)   # ['hello', 'world!']

# 2. Use partial to create typed print functions:
# info = prints with "[INFO]" prefix, debug with "[DEBUG]", etc.
\`\`\`
`,
  },

  'advanced-advanced-oop-abstract-classes': {
    readTime: 8,
    whatYoullLearn: [
      'Define abstract base classes with the abc module',
      'Use @abstractmethod to enforce method implementation',
      'Create abstract properties',
      'Use ABCs for type checking without inheritance',
      'Design interface-like patterns in Python',
    ],
    content: `
## Abstract Base Classes

An abstract class cannot be instantiated directly — it's a contract that subclasses must fulfill. Use the \`abc\` module:

\`\`\`python
from abc import ABC, abstractmethod

class Shape(ABC):
    """Abstract base class for all shapes."""

    @abstractmethod
    def area(self) -> float:
        """Return the area of the shape."""
        ...

    @abstractmethod
    def perimeter(self) -> float:
        """Return the perimeter of the shape."""
        ...

    def describe(self) -> str:
        """Concrete method — shared by all subclasses."""
        return (f"{type(self).__name__}: "
                f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")

# Shape()  → TypeError: Can't instantiate abstract class Shape with abstract methods area, perimeter

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        import math
        return 2 * math.pi * self.radius

class Square(Shape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side ** 2

    def perimeter(self) -> float:
        return 4 * self.side

shapes = [Circle(5), Square(4), Circle(3)]
for shape in shapes:
    print(shape.describe())
\`\`\`

## Abstract Properties

\`\`\`python
from abc import ABC, abstractmethod

class Animal(ABC):
    @property
    @abstractmethod
    def sound(self) -> str:
        """The sound this animal makes."""
        ...

    @property
    @abstractmethod
    def legs(self) -> int:
        ...

    def speak(self):
        print(f"I say {self.sound}!")

class Dog(Animal):
    @property
    def sound(self) -> str:
        return "woof"

    @property
    def legs(self) -> int:
        return 4

class Snake(Animal):
    @property
    def sound(self) -> str:
        return "hiss"

    @property
    def legs(self) -> int:
        return 0

d = Dog()
d.speak()   # I say woof!
\`\`\`

## ABCs for Duck Typing Registration

Register classes that implement the interface without inheriting:

\`\`\`python
from abc import ABC, abstractmethod

class Drawable(ABC):
    @abstractmethod
    def draw(self) -> None: ...

class LegacyCircle:
    """Old class, can't modify, but implements draw()."""
    def draw(self):
        print("Drawing legacy circle")

# Register without inheritance:
Drawable.register(LegacyCircle)

lc = LegacyCircle()
print(isinstance(lc, Drawable))   # True  — because of register()
print(issubclass(LegacyCircle, Drawable))  # True
\`\`\`

## Try It Yourself

\`\`\`python
# Design an abstract Serializer class with:
# - abstract methods: serialize(data) → str, deserialize(text) → object
# - concrete method: roundtrip(data) that serializes then deserializes
# 
# Implement JSONSerializer and CSVSerializer subclasses.

from abc import ABC, abstractmethod
import json, csv, io

class Serializer(ABC):
    @abstractmethod
    def serialize(self, data) -> str: ...

    @abstractmethod
    def deserialize(self, text: str): ...

    def roundtrip(self, data):
        return self.deserialize(self.serialize(data))
\`\`\`
`,
  },

  'advanced-advanced-oop-static-class-methods-property': {
    readTime: 8,
    whatYoullLearn: [
      'Use @staticmethod for utility functions tied to a class',
      'Use @classmethod for alternative constructors and factory methods',
      'Create read-only and read-write properties with @property',
      'Add validation logic to setters',
      'Understand when to use each type',
    ],
    content: `
## @staticmethod — Utility Functions

Static methods belong to the class namespace but don't receive the instance (\`self\`) or class (\`cls\`). Use them for utility functions related to the class:

\`\`\`python
class Temperature:
    def __init__(self, celsius: float):
        self._celsius = celsius

    @staticmethod
    def celsius_to_fahrenheit(c: float) -> float:
        return c * 9/5 + 32

    @staticmethod
    def fahrenheit_to_celsius(f: float) -> float:
        return (f - 32) * 5/9

    def to_fahrenheit(self) -> float:
        return Temperature.celsius_to_fahrenheit(self._celsius)

    def __repr__(self):
        return f"Temperature({self._celsius}°C)"

# Call on the class — no instance needed:
print(Temperature.celsius_to_fahrenheit(100))   # 212.0
print(Temperature.fahrenheit_to_celsius(32))    # 0.0

# Also callable on instances:
t = Temperature(20)
print(t.celsius_to_fahrenheit(0))   # 32.0
\`\`\`

## @classmethod — Alternative Constructors

Class methods receive \`cls\` (the class itself) instead of \`self\`. Perfect for factory methods:

\`\`\`python
from datetime import datetime

class User:
    def __init__(self, name: str, email: str, created_at: datetime = None):
        self.name = name
        self.email = email
        self.created_at = created_at or datetime.now()

    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        """Create a User from a dictionary."""
        return cls(
            name=data["name"],
            email=data["email"],
            created_at=datetime.fromisoformat(data.get("created_at", datetime.now().isoformat()))
        )

    @classmethod
    def from_csv_row(cls, row: str) -> 'User':
        """Create a User from a comma-separated string."""
        name, email = row.strip().split(",")
        return cls(name.strip(), email.strip())

    def __repr__(self):
        return f"User({self.name!r}, {self.email!r})"

# Multiple construction paths:
u1 = User("Alice", "alice@example.com")
u2 = User.from_dict({"name": "Bob", "email": "bob@example.com"})
u3 = User.from_csv_row("Carol, carol@example.com")
\`\`\`

## @property — Controlled Attribute Access

Properties let you use method logic behind attribute syntax:

\`\`\`python
class Circle:
    def __init__(self, radius: float):
        self.radius = radius   # calls the setter below!

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float) -> None:
        if value < 0:
            raise ValueError(f"Radius must be non-negative, got {value}")
        self._radius = value

    @property
    def area(self) -> float:
        """Read-only computed property."""
        import math
        return math.pi * self._radius ** 2

    @property
    def diameter(self) -> float:
        return self._radius * 2

    @diameter.setter
    def diameter(self, value: float) -> None:
        self.radius = value / 2   # delegates validation to radius setter

c = Circle(5)
print(c.area)       # 78.54... — no ()
c.radius = 10       # calls setter
c.diameter = 20     # calls diameter setter → radius setter
# c.radius = -1     # ValueError ✓
\`\`\`

## Try It Yourself

\`\`\`python
# Design a BankAccount class with:
# 1. balance as a read-only property (private _balance)
# 2. A deposit() method that validates amount > 0
# 3. A withdraw() method that validates sufficient funds
# 4. @classmethod from_opening_deposit(cls, owner, amount) 
# 5. @staticmethod format_currency(amount) → "$1,234.56"
\`\`\`
`,
  },

  'advanced-advanced-oop-multiple-inheritance-mro': {
    readTime: 8,
    whatYoullLearn: [
      'Use multiple inheritance to combine behaviors',
      'Understand the C3 linearization algorithm for MRO',
      'Inspect MRO with __mro__ and mro()',
      'Call parent methods correctly with super() in MI',
      'Apply mixins as a safe multiple inheritance pattern',
    ],
    content: `
## Multiple Inheritance

Python supports inheriting from multiple base classes. The most common use is **mixins** — small classes that add specific capabilities:

\`\`\`python
class Flyable:
    def fly(self):
        print(f"{self.name} is flying!")

class Swimmable:
    def swim(self):
        print(f"{self.name} is swimming!")

class Walkable:
    def walk(self):
        print(f"{self.name} is walking!")

class Duck(Flyable, Swimmable, Walkable):
    def __init__(self, name):
        self.name = name
    
    def quack(self):
        print("Quack!")

donald = Duck("Donald")
donald.fly()    # Donald is flying!
donald.swim()   # Donald is swimming!
donald.walk()   # Donald is walking!
donald.quack()  # Quack!
\`\`\`

## Method Resolution Order (MRO)

When multiple classes define the same method, Python uses **C3 linearization** to determine which one to call:

\`\`\`python
class A:
    def hello(self):
        return "A"

class B(A):
    def hello(self):
        return f"B → {super().hello()}"

class C(A):
    def hello(self):
        return f"C → {super().hello()}"

class D(B, C):
    def hello(self):
        return f"D → {super().hello()}"

d = D()
print(d.hello())     # "D → B → C → A"
print(D.__mro__)     # (<class D>, <class B>, <class C>, <class A>, <class object>)
print(D.mro())       # same, as list
\`\`\`

## Mixins — The Recommended Pattern

Mixins are small, focused classes designed to be composed:

\`\`\`python
class TimestampMixin:
    """Adds created_at and updated_at timestamps."""
    from datetime import datetime
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.created_at = self.__class__.datetime.now()
        self.updated_at = self.created_at
    
    def touch(self):
        from datetime import datetime
        self.updated_at = datetime.now()

class ValidatorMixin:
    """Adds validation support."""
    
    def validate(self):
        for field, validator in getattr(self, '_validators', {}).items():
            value = getattr(self, field, None)
            if not validator(value):
                raise ValueError(f"Validation failed for {field}: {value!r}")
        return True

class ReprMixin:
    """Auto-generates __repr__ from public attributes."""
    
    def __repr__(self):
        attrs = {k: v for k, v in self.__dict__.items() if not k.startswith('_')}
        attr_str = ", ".join(f"{k}={v!r}" for k, v in attrs.items())
        return f"{type(self).__name__}({attr_str})"

class Product(TimestampMixin, ValidatorMixin, ReprMixin):
    _validators = {
        "price": lambda x: x is not None and x >= 0,
        "name": lambda x: x and len(x) >= 1,
    }
    
    def __init__(self, name, price):
        super().__init__()   # MRO ensures TimestampMixin.__init__ is called
        self.name = name
        self.price = price

p = Product("Widget", 9.99)
print(p)            # Product(name='Widget', price=9.99, created_at=...)
p.validate()        # ✓
\`\`\`

## Try It Yourself

\`\`\`python
# Create a logging mixin and a caching mixin, then combine them
# in a class that uses both.

class LoggingMixin:
    """Logs method calls."""
    pass  # use __init_subclass__ or __getattribute__ to log calls

class CachingMixin:
    """Caches method return values."""
    pass

class DataFetcher(LoggingMixin, CachingMixin):
    def fetch(self, url):
        # simulate network request
        import time; time.sleep(0.01)
        return f"Data from {url}"
\`\`\`
`,
  },

  'advanced-concurrency-threading': {
    readTime: 9,
    whatYoullLearn: [
      'Create and start threads with threading.Thread',
      'Share data safely using Lock and RLock',
      'Use Thread pools with concurrent.futures',
      'Understand the GIL and its impact',
      'Identify and fix race conditions',
    ],
    content: `
## Creating Threads

\`threading.Thread\` lets you run code concurrently. Threads share memory — be careful with shared state:

\`\`\`python
import threading
import time

def download_file(url, delay):
    """Simulate downloading a file."""
    print(f"Starting download: {url}")
    time.sleep(delay)   # simulate network I/O
    print(f"Finished: {url} ({delay}s)")

urls = [("file1.txt", 2), ("file2.txt", 1), ("file3.txt", 3)]

# Sequential: takes 2+1+3 = 6 seconds
# ...

# Concurrent with threads: takes ~3 seconds (longest download)
threads = []
for url, delay in urls:
    t = threading.Thread(target=download_file, args=(url, delay))
    threads.append(t)
    t.start()

# Wait for all threads to finish
for t in threads:
    t.join()

print("All downloads complete!")
\`\`\`

## Race Conditions and Locks

Without synchronization, concurrent threads can corrupt shared state:

\`\`\`python
import threading

# ✗ RACE CONDITION — counter is unpredictably wrong
counter = 0

def increment_unsafe():
    global counter
    for _ in range(100_000):
        counter += 1   # NOT atomic: read, add, write

threads = [threading.Thread(target=increment_unsafe) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)   # Probably NOT 500000!

# ✓ FIXED with Lock
counter = 0
lock = threading.Lock()

def increment_safe():
    global counter
    for _ in range(100_000):
        with lock:    # acquire lock, release in finally
            counter += 1

threads = [threading.Thread(target=increment_safe) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)   # Always 500000 ✓
\`\`\`

## Thread Pool with concurrent.futures

The high-level \`ThreadPoolExecutor\` is the modern way to run threads:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def fetch_url(url):
    response = requests.get(url, timeout=10)
    return url, response.status_code, len(response.content)

urls = [
    "https://python.org",
    "https://github.com",
    "https://stackoverflow.com",
]

# Process results as they complete (fastest first):
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(fetch_url, url): url for url in urls}
    for future in as_completed(futures):
        url, status, size = future.result()
        print(f"{url}: {status} ({size} bytes)")
\`\`\`

## The GIL — Global Interpreter Lock

Python's GIL ensures only one thread executes Python bytecode at a time. This means:
- **I/O-bound work** (downloads, file reads): threads help — GIL is released during I/O
- **CPU-bound work** (calculations): threads DON'T help — use multiprocessing instead

\`\`\`python
import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def cpu_work(n):
    return sum(i**2 for i in range(n))

# Threads: GIL prevents true parallelism for CPU work
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_work, [5_000_000]*4))

# Processes: bypass GIL entirely (each has own GIL)
with ProcessPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_work, [5_000_000]*4))  # ~4x faster on 4 cores
\`\`\`

## Try It Yourself

\`\`\`python
# Build a thread-safe counter class:
import threading

class Counter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()
    
    def increment(self, amount=1):
        with self._lock:
            self._value += amount
    
    def decrement(self, amount=1):
        with self._lock:
            self._value -= amount
    
    @property
    def value(self):
        return self._value

# Test it with 10 threads, each incrementing 10000 times
c = Counter()
threads = [threading.Thread(target=lambda: [c.increment() for _ in range(10000)])
           for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(c.value)  # Always 100000
\`\`\`
`,
  },

  'advanced-concurrency-multiprocessing': {
    readTime: 8,
    whatYoullLearn: [
      'Create processes with multiprocessing.Process',
      'Use process pools with Pool and ProcessPoolExecutor',
      'Share data between processes with Queue and Pipe',
      'Avoid pickling errors with multiprocessing',
      'Choose between threading and multiprocessing',
    ],
    content: `
## multiprocessing vs threading

multiprocessing creates separate OS processes — each with its own Python interpreter and memory. No GIL, so CPU-bound tasks truly run in parallel:

\`\`\`python
import multiprocessing as mp
import time

def cpu_intensive(n):
    """CPU-bound: squares numbers up to n."""
    return sum(i * i for i in range(n))

if __name__ == "__main__":   # REQUIRED for multiprocessing on Windows/macOS
    # Sequential
    start = time.time()
    results = [cpu_intensive(10_000_000) for _ in range(4)]
    print(f"Sequential: {time.time()-start:.2f}s")

    # Parallel with 4 processes
    start = time.time()
    with mp.Pool(processes=4) as pool:
        results = pool.map(cpu_intensive, [10_000_000] * 4)
    print(f"Parallel: {time.time()-start:.2f}s")   # ~4x faster on 4 cores
\`\`\`

## Process Pools

\`\`\`python
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor

def process_image(filename):
    """Simulate image processing (CPU-intensive)."""
    import time
    time.sleep(0.1)
    return f"processed_{filename}"

files = [f"image_{i}.jpg" for i in range(20)]

# Pool.map — simple, blocks until all done
with mp.Pool() as pool:
    results = pool.map(process_image, files)

# Pool.starmap — for functions with multiple arguments
def resize(filename, width, height):
    return f"resized_{filename}_{width}x{height}"

args = [(f, 800, 600) for f in files]
with mp.Pool() as pool:
    results = pool.starmap(resize, args)

# ProcessPoolExecutor (concurrent.futures) — more Pythonic
with ProcessPoolExecutor(max_workers=4) as executor:
    futures = list(executor.map(process_image, files))
\`\`\`

## Inter-Process Communication

Processes can't share memory directly — use Queue or Pipe:

\`\`\`python
import multiprocessing as mp

def producer(queue, items):
    for item in items:
        queue.put(item)
    queue.put(None)   # sentinel to signal completion

def consumer(queue):
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"Processing: {item}")

if __name__ == "__main__":
    q = mp.Queue()
    items = list(range(10))

    p1 = mp.Process(target=producer, args=(q, items))
    p2 = mp.Process(target=consumer, args=(q,))

    p1.start(); p2.start()
    p1.join(); p2.join()
\`\`\`

## Try It Yourself

\`\`\`python
# Use ProcessPoolExecutor to parallelize a word count over multiple files:
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from collections import Counter

def count_words(filepath):
    text = Path(filepath).read_text()
    return Counter(text.lower().split())

if __name__ == "__main__":
    files = list(Path(".").glob("*.txt"))
    with ProcessPoolExecutor() as ex:
        counters = list(ex.map(count_words, files))
    total = sum(counters, Counter())
    print(total.most_common(10))
\`\`\`
`,
  },

  'advanced-concurrency-asyncio': {
    readTime: 10,
    whatYoullLearn: [
      'Write async functions with async def and await',
      'Run coroutines with asyncio.run()',
      'Run multiple coroutines concurrently with asyncio.gather()',
      'Use async context managers and async iterators',
      'Handle errors in async code',
    ],
    content: `
## Async/Await Fundamentals

asyncio enables **cooperative multitasking** — a single thread switches between tasks when one is waiting for I/O:

\`\`\`python
import asyncio

async def fetch_data(url: str, delay: float) -> str:
    """Simulate an async HTTP request."""
    print(f"Starting fetch: {url}")
    await asyncio.sleep(delay)   # yield control while "waiting"
    print(f"Done: {url}")
    return f"Data from {url}"

async def main():
    # Run one at a time (sequential — NOT the point of async)
    r1 = await fetch_data("api/users", 1.0)
    r2 = await fetch_data("api/posts", 1.5)
    # Total: 2.5 seconds

asyncio.run(main())
\`\`\`

## asyncio.gather() — True Concurrency

\`gather()\` runs multiple coroutines concurrently:

\`\`\`python
import asyncio
import time

async def fetch(url, delay):
    await asyncio.sleep(delay)
    return f"Data from {url}"

async def main():
    start = time.time()

    # All three run concurrently — total time ≈ max(1.0, 1.5, 2.0) = 2s
    results = await asyncio.gather(
        fetch("api/users", 1.0),
        fetch("api/posts", 1.5),
        fetch("api/comments", 2.0),
    )

    print(f"Took: {time.time()-start:.2f}s")  # ~2.0s (not 4.5s!)
    for result in results:
        print(result)

asyncio.run(main())
\`\`\`

## Error Handling in Async Code

\`\`\`python
import asyncio

async def might_fail(n):
    await asyncio.sleep(0.1)
    if n == 2:
        raise ValueError(f"Task {n} failed!")
    return f"Task {n} succeeded"

async def main():
    # gather() raises on first exception by default
    try:
        results = await asyncio.gather(
            might_fail(1),
            might_fail(2),
            might_fail(3),
        )
    except ValueError as e:
        print(f"Caught: {e}")

    # Use return_exceptions=True to collect all results and exceptions:
    results = await asyncio.gather(
        might_fail(1),
        might_fail(2),
        might_fail(3),
        return_exceptions=True
    )
    for r in results:
        if isinstance(r, Exception):
            print(f"Error: {r}")
        else:
            print(r)

asyncio.run(main())
\`\`\`

## Async Context Managers

\`\`\`python
import asyncio

class AsyncDB:
    async def __aenter__(self):
        print("Connecting to database...")
        await asyncio.sleep(0.1)   # simulate connection
        return self

    async def __aexit__(self, exc_type, exc, tb):
        print("Closing database connection")
        await asyncio.sleep(0.01)  # simulate cleanup

    async def query(self, sql):
        await asyncio.sleep(0.05)  # simulate query
        return [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]

async def main():
    async with AsyncDB() as db:
        users = await db.query("SELECT * FROM users")
        print(users)

asyncio.run(main())
\`\`\`

## Try It Yourself

\`\`\`python
import asyncio
import random

async def slow_task(task_id: int) -> str:
    """Simulate a task with random duration."""
    duration = random.uniform(0.5, 2.0)
    await asyncio.sleep(duration)
    return f"Task {task_id} done in {duration:.2f}s"

async def main():
    # Run 5 tasks concurrently, print as they complete
    tasks = [asyncio.create_task(slow_task(i)) for i in range(5)]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(result)

asyncio.run(main())
\`\`\`
`,
  },

  'advanced-context-managers-with-statement-custom': {
    readTime: 7,
    whatYoullLearn: [
      'Implement __enter__ and __exit__ for custom context managers',
      'Use contextlib.contextmanager as a simpler alternative',
      'Suppress exceptions in __exit__',
      'Stack multiple context managers',
      'Apply context managers for resource management and testing',
    ],
    content: `
## The Context Manager Protocol

Context managers implement \`__enter__\` (setup) and \`__exit__\` (teardown). The \`with\` statement calls these automatically:

\`\`\`python
class Timer:
    """Context manager that times a block of code."""
    import time

    def __enter__(self):
        self.start = self.__class__.time.perf_counter()
        return self   # value bound to 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = self.__class__.time.perf_counter() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False  # False = don't suppress exceptions

import time
with Timer() as t:
    time.sleep(0.1)
    result = sum(range(1_000_000))
# Elapsed: 0.1234s
\`\`\`

## contextlib.contextmanager

The \`@contextmanager\` decorator turns a generator function into a context manager — simpler than writing a class:

\`\`\`python
from contextlib import contextmanager
import tempfile, os

@contextmanager
def temp_file(suffix=".txt"):
    """Create a temporary file, yield its path, then delete it."""
    fd, path = tempfile.mkstemp(suffix=suffix)
    try:
        os.close(fd)
        yield path      # everything before yield = __enter__
    finally:
        os.unlink(path) # everything after yield = __exit__ (always runs)

with temp_file(".csv") as path:
    with open(path, "w") as f:
        f.write("name,score\\n")
    print(f"Temp file exists: {os.path.exists(path)}")  # True
# File is automatically deleted after the with block
print(f"Deleted: {not os.path.exists(path)}")  # True

@contextmanager
def transaction(db):
    """Database transaction context manager."""
    db.begin()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
\`\`\`

## Suppressing Exceptions

Return \`True\` from \`__exit__\` to suppress the exception:

\`\`\`python
from contextlib import contextmanager, suppress

# contextlib.suppress is a built-in exception suppressor
with suppress(FileNotFoundError):
    os.remove("nonexistent_file.txt")   # no error raised!

# Custom suppressor:
@contextmanager
def ignore(*exception_types):
    try:
        yield
    except exception_types:
        pass   # suppress and continue

with ignore(KeyError, IndexError):
    d = {}
    value = d["missing"]   # silently ignored
\`\`\`

## Try It Yourself

\`\`\`python
from contextlib import contextmanager

# 1. Write a context manager 'cd(path)' that:
#    - Changes to the given directory on entry
#    - Returns to the original directory on exit (even if an exception occurs)

@contextmanager
def cd(path):
    import os
    original = os.getcwd()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(original)

# 2. Write a context manager 'capture_output()' that captures
#    everything printed to stdout and returns it as a string.
\`\`\`
`,
  },

  'advanced-type-hinting-typing-module-generics-protocols': {
    readTime: 8,
    whatYoullLearn: [
      'Annotate functions and variables with type hints',
      'Use Optional, Union, and Literal',
      'Write generic functions with TypeVar',
      'Define structural subtypes with Protocol',
      'Run a type checker with mypy',
    ],
    content: `
## Basic Type Hints

Type hints make code self-documenting and enable static analysis:

\`\`\`python
from typing import Optional, Union, List, Dict, Tuple, Set

# Variable annotations
name: str = "Alice"
age: int = 30
scores: list[float] = [8.5, 9.0, 7.5]  # Python 3.9+: built-in generics

# Function annotations
def greet(name: str, times: int = 1) -> str:
    return (name + " ") * times

def find_user(user_id: int) -> Optional[str]:
    """Returns None if user not found."""
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

def parse(value: Union[str, int, float]) -> float:
    return float(value)

# Python 3.10+: use X | Y instead of Union[X, Y]
def parse_modern(value: str | int | float) -> float:
    return float(value)
\`\`\`

## Generics with TypeVar

TypeVar creates type variables for writing generic functions that work with any type while preserving type information:

\`\`\`python
from typing import TypeVar, List

T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')

def first(items: list[T]) -> T | None:
    """Return first element or None."""
    return items[0] if items else None

# The return type matches the input element type:
x: int | None = first([1, 2, 3])       # x is int | None
s: str | None = first(["a", "b"])       # s is str | None

def zip_dicts(keys: list[K], values: list[V]) -> dict[K, V]:
    return dict(zip(keys, values))

result = zip_dicts(["a", "b"], [1, 2])   # dict[str, int]

# Generic class
from typing import Generic

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()

int_stack: Stack[int] = Stack()
int_stack.push(42)
\`\`\`

## Protocols — Structural Typing

Protocol defines an interface through structure (what methods/attributes something has) rather than inheritance:

\`\`\`python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...
    def area(self) -> float: ...

class Circle:
    def __init__(self, r: float): self.r = r
    def draw(self) -> None: print(f"Circle r={self.r}")
    def area(self) -> float:
        import math; return math.pi * self.r**2

class Square:
    def __init__(self, s: float): self.s = s
    def draw(self) -> None: print(f"Square s={self.s}")
    def area(self) -> float: return self.s**2

def render(shape: Drawable) -> None:
    shape.draw()
    print(f"  Area: {shape.area():.2f}")

# Both work — no inheritance from Drawable required!
render(Circle(5))
render(Square(4))

print(isinstance(Circle(3), Drawable))   # True (runtime_checkable)
\`\`\`

## Try It Yourself

\`\`\`python
from typing import TypeVar, Callable

T = TypeVar('T')
R = TypeVar('R')

# Add complete type hints to this pipeline function:
def pipeline(data: list[T], *transforms) -> list:
    result = data
    for transform in transforms:
        result = [transform(item) for item in result]
    return result

# After adding hints, mypy should be happy with:
numbers = pipeline([1, 2, 3, 4, 5],
                   lambda x: x * 2,
                   str)
\`\`\`
`,
  },

  'advanced-testing-unittest': {
    readTime: 7,
    whatYoullLearn: [
      'Write test cases using unittest.TestCase',
      'Use setUp() and tearDown() for test fixtures',
      'Apply assertion methods: assertEqual, assertRaises, etc.',
      'Organize tests into test suites',
      'Run tests from the command line',
    ],
    content: `
## Writing Your First Test

\`unittest\` is Python's built-in testing framework. Tests go in methods starting with \`test_\`:

\`\`\`python
# calculator.py
def add(a, b): return a + b
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# test_calculator.py
import unittest
from calculator import add, divide

class TestAdd(unittest.TestCase):
    def test_positive_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_negative_numbers(self):
        self.assertEqual(add(-1, -2), -3)

    def test_zero(self):
        self.assertEqual(add(0, 5), 5)
        self.assertEqual(add(5, 0), 5)

class TestDivide(unittest.TestCase):
    def test_normal_division(self):
        self.assertAlmostEqual(divide(10, 3), 3.333, places=3)

    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            divide(10, 0)

    def test_exact_division(self):
        self.assertEqual(divide(10, 2), 5.0)

if __name__ == "__main__":
    unittest.main()   # run with: python test_calculator.py
                      # or: python -m unittest test_calculator
\`\`\`

## setUp and tearDown

\`\`\`python
import unittest
import tempfile
import os

class TestFileProcessor(unittest.TestCase):
    def setUp(self):
        """Called before EACH test method."""
        self.temp_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.temp_dir, "test.txt")
        with open(self.test_file, "w") as f:
            f.write("hello world\\nfoo bar\\n")

    def tearDown(self):
        """Called after EACH test method — cleanup."""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_word_count(self):
        from my_module import word_count
        result = word_count(self.test_file)
        self.assertEqual(result["hello"], 1)
        self.assertEqual(result["world"], 1)

    def test_line_count(self):
        from my_module import line_count
        self.assertEqual(line_count(self.test_file), 2)
\`\`\`

## Key Assertion Methods

\`\`\`python
class TestAssertions(unittest.TestCase):
    def test_equality(self):
        self.assertEqual(1 + 1, 2)
        self.assertNotEqual(1 + 1, 3)
        self.assertAlmostEqual(3.14159, 3.14, places=2)

    def test_truth(self):
        self.assertTrue(bool([1, 2, 3]))
        self.assertFalse(bool([]))
        self.assertIsNone(None)
        self.assertIsNotNone("hello")

    def test_membership(self):
        self.assertIn("a", ["a", "b", "c"])
        self.assertNotIn("d", ["a", "b", "c"])

    def test_types(self):
        self.assertIsInstance(42, int)
        self.assertIsInstance("hi", (str, bytes))

    def test_collections(self):
        self.assertListEqual([1, 2, 3], [1, 2, 3])
        self.assertDictEqual({"a": 1}, {"a": 1})
        self.assertSetEqual({1, 2}, {2, 1})

    def test_exceptions(self):
        with self.assertRaises(ValueError) as ctx:
            int("not a number")
        self.assertIn("invalid literal", str(ctx.exception))
\`\`\`

## Try It Yourself

\`\`\`python
# Write tests for this Stack class:
class Stack:
    def __init__(self): self._items = []
    def push(self, item): self._items.append(item)
    def pop(self):
        if not self._items: raise IndexError("Stack is empty")
        return self._items.pop()
    def peek(self):
        if not self._items: raise IndexError("Stack is empty")
        return self._items[-1]
    def __len__(self): return len(self._items)

# Tests to write:
# - push increases size
# - pop returns correct value and decreases size
# - pop on empty raises IndexError
# - peek returns top without removing
# - peek on empty raises IndexError
\`\`\`
`,
  },

  'advanced-testing-pytest': {
    readTime: 7,
    whatYoullLearn: [
      'Write simple test functions (no classes required)',
      'Use fixtures for reusable test setup',
      'Parametrize tests to run with multiple inputs',
      'Use markers to categorize tests',
      'Capture output and monkeypatch in tests',
    ],
    content: `
## pytest Basics

pytest is more concise than unittest — tests are plain functions:

\`\`\`python
# test_calculator.py
from calculator import add, divide
import pytest

def test_add_positives():
    assert add(2, 3) == 5

def test_add_negatives():
    assert add(-1, -2) == -3

def test_divide_normal():
    assert divide(10, 2) == pytest.approx(5.0)

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError, match="Cannot divide"):
        divide(10, 0)

# Run with: pytest test_calculator.py -v
# Run all:  pytest
\`\`\`

## Fixtures

Fixtures provide reusable setup/teardown via dependency injection:

\`\`\`python
import pytest
from pathlib import Path

@pytest.fixture
def temp_dir(tmp_path):
    """pytest provides tmp_path automatically."""
    return tmp_path

@pytest.fixture
def sample_data():
    """Reusable test data."""
    return {"users": [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"},
    ]}

@pytest.fixture
def database():
    """Setup/teardown with yield."""
    db = connect_to_test_db()
    db.create_tables()
    yield db             # test runs here
    db.drop_tables()     # teardown (like finally)
    db.close()

def test_process_users(sample_data):
    result = process_users(sample_data["users"])
    assert len(result) == 2
    assert result[0]["name"] == "Alice"

def test_db_insert(database):
    database.insert({"id": 3, "name": "Carol"})
    assert database.count() == 3
\`\`\`

## Parametrize — Test Multiple Cases

\`\`\`python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
# Runs 4 separate test cases!

@pytest.mark.parametrize("text, expected", [
    ("hello", "HELLO"),
    ("WORLD", "WORLD"),
    ("", ""),
    ("Python 3", "PYTHON 3"),
])
def test_uppercase(text, expected):
    assert text.upper() == expected
\`\`\`

## Monkeypatching

\`\`\`python
import pytest

def get_system_time():
    import time
    return time.time()

def test_time_function(monkeypatch):
    """Replace time.time() with a fixed value in tests."""
    monkeypatch.setattr("time.time", lambda: 1000.0)
    assert get_system_time() == 1000.0

def test_env_variable(monkeypatch):
    """Set an environment variable for just this test."""
    monkeypatch.setenv("API_KEY", "test-key-123")
    import os
    assert os.environ["API_KEY"] == "test-key-123"
\`\`\`

## Try It Yourself

\`\`\`python
# Write pytest tests for a URL shortener function:
def shorten(url: str, max_length: int = 20) -> str:
    if len(url) <= max_length:
        return url
    return url[:max_length-3] + "..."

# Use @pytest.mark.parametrize to test:
# - Short URLs unchanged
# - Long URLs truncated with "..."
# - Exact length boundary (max_length)
# - Custom max_length
# - Empty string edge case
\`\`\`
`,
  },

  'advanced-testing-mocking': {
    readTime: 8,
    whatYoullLearn: [
      'Mock objects with unittest.mock.Mock and MagicMock',
      'Patch functions and classes with @patch decorator',
      'Verify calls with assert_called_with',
      'Set return values and side effects',
      'Mock external APIs and file systems',
    ],
    content: `
## Why Mock?

Mocking replaces real objects (databases, APIs, file systems, clocks) with controlled fakes during testing — making tests fast, reliable, and isolated:

\`\`\`python
from unittest.mock import Mock, MagicMock, patch

# Basic Mock — records all calls and attribute access
m = Mock()
m.method(1, 2, key="val")
print(m.method.call_count)              # 1
m.method.assert_called_with(1, 2, key="val")  # passes
m.method.assert_called_once()           # passes

# Set return values
m.get_user.return_value = {"name": "Alice", "id": 1}
result = m.get_user(1)
print(result)   # {"name": "Alice", "id": 1}

# MagicMock also mocks magic methods (__len__, __iter__, etc.)
mm = MagicMock()
mm.__len__.return_value = 5
print(len(mm))   # 5
\`\`\`

## @patch — Replace Real Objects in Tests

\`\`\`python
import requests
from unittest.mock import patch, Mock

def get_user_count(api_url: str) -> int:
    """Function under test — calls the real API."""
    response = requests.get(f"{api_url}/users")
    response.raise_for_status()
    return len(response.json())

class TestGetUserCount:
    @patch("requests.get")   # replaces requests.get for the duration of this test
    def test_normal(self, mock_get):
        # Configure the mock's behavior
        mock_response = Mock()
        mock_response.json.return_value = [{"id": 1}, {"id": 2}, {"id": 3}]
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        result = get_user_count("https://api.example.com")
        assert result == 3
        mock_get.assert_called_once_with("https://api.example.com/users")

    @patch("requests.get")
    def test_api_failure(self, mock_get):
        mock_get.side_effect = requests.ConnectionError("Network unreachable")
        with pytest.raises(requests.ConnectionError):
            get_user_count("https://api.example.com")
\`\`\`

## Side Effects

\`side_effect\` lets you make a mock raise exceptions or return different values on successive calls:

\`\`\`python
from unittest.mock import Mock, patch

# Raise an exception
mock_db = Mock()
mock_db.query.side_effect = TimeoutError("Query timed out")

# Different values on successive calls
mock_random = Mock()
mock_random.randint.side_effect = [4, 2, 7, 1]   # returns in sequence
print(mock_random.randint(1, 10))   # 4
print(mock_random.randint(1, 10))   # 2
print(mock_random.randint(1, 10))   # 7

# Side effect as a function (called with the same args)
def validate_side_effect(value):
    if value < 0:
        raise ValueError(f"Negative value: {value}")
    return value * 2

mock_calc = Mock()
mock_calc.process.side_effect = validate_side_effect
\`\`\`

## Try It Yourself

\`\`\`python
# Test this function by mocking open() to avoid real file I/O:
def read_config(path: str) -> dict:
    import json
    with open(path) as f:
        return json.load(f)

# Hint: use unittest.mock.mock_open
from unittest.mock import patch, mock_open
import json

def test_read_config():
    config_data = {"host": "localhost", "port": 8080}
    mock_file = mock_open(read_data=json.dumps(config_data))

    with patch("builtins.open", mock_file):
        result = read_config("config.json")

    assert result == config_data
\`\`\`
`,
  },

  'advanced-logging-debugging-logging-module': {
    readTime: 7,
    whatYoullLearn: [
      'Set up logging with basicConfig and getLogger',
      'Use different log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL',
      'Configure handlers to write to files and console',
      'Use formatters for structured log output',
      'Configure per-module logging',
    ],
    content: `
## Why Use logging Instead of print?

\`print()\` is for user output. \`logging\` is for diagnostic messages — it adds level filtering, timestamps, caller info, and destinations (file, network, etc.) without changing your code:

\`\`\`python
import logging

# Basic configuration (do once at app startup)
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)   # per-module logger

logger.debug("Processing started")        # DEBUG
logger.info("User logged in: alice")       # INFO
logger.warning("Low disk space: 5GB left") # WARNING
logger.error("Database connection failed") # ERROR
logger.critical("System out of memory")   # CRITICAL
\`\`\`

## Log Levels

\`\`\`python
# Level hierarchy (highest = most severe):
# CRITICAL (50) — system about to crash
# ERROR    (40) — something failed, but program continues
# WARNING  (30) — unexpected but handled
# INFO     (20) — normal milestones (user login, job start)
# DEBUG    (10) — detailed diagnostic info (only for dev)
# NOTSET   (0)  — inherit from parent

# Setting level filters what gets logged:
logging.basicConfig(level=logging.INFO)
# DEBUG messages are suppressed; INFO and above appear
\`\`\`

## Handlers and Formatters

\`\`\`python
import logging

logger = logging.getLogger("myapp")
logger.setLevel(logging.DEBUG)

# Console handler — INFO and above
console = logging.StreamHandler()
console.setLevel(logging.INFO)
console.setFormatter(logging.Formatter(
    "%(levelname)s: %(message)s"
))

# File handler — DEBUG and above (captures everything)
file_handler = logging.FileHandler("app.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter(
    "%(asctime)s %(name)s %(levelname)s: %(message)s"
))

logger.addHandler(console)
logger.addHandler(file_handler)

logger.debug("This goes to file only")
logger.info("This goes to both console and file")
logger.error("Error logged in both places")
\`\`\`

## Structured Logging with Extra Context

\`\`\`python
import logging

logger = logging.getLogger(__name__)

# Add context with extra=
logger.info("User action", extra={"user_id": 42, "action": "login"})

# Use LoggerAdapter for persistent context
class RequestAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        return f"[request={self.extra['request_id']}] {msg}", kwargs

request_logger = RequestAdapter(logger, {"request_id": "abc-123"})
request_logger.info("Processing request")
request_logger.error("Request failed")
\`\`\`

## Try It Yourself

\`\`\`python
# Set up a logging configuration that:
# 1. Logs DEBUG+ to a rotating file (max 1MB, keep 3 backups)
# 2. Logs WARNING+ to the console
# 3. Uses a structured format with timestamp, level, module, message

from logging.handlers import RotatingFileHandler
import logging

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    # your setup here
    return logger

logger = setup_logging()
logger.debug("Debug message")
logger.warning("This appears on console too")
\`\`\`
`,
  },

  'advanced-logging-debugging-pdb': {
    readTime: 6,
    whatYoullLearn: [
      'Set breakpoints with breakpoint() built-in',
      'Step through code with n, s, c commands',
      'Inspect variables and the call stack',
      'Use post-mortem debugging for crashes',
      'Use pdb inside conditional breakpoints',
    ],
    content: `
## Starting the Debugger

Python 3.7+ has the built-in \`breakpoint()\` function — no imports needed:

\`\`\`python
def process_data(data):
    result = []
    for item in data:
        breakpoint()   # execution pauses here, drops into pdb
        processed = transform(item)
        result.append(processed)
    return result
\`\`\`

## Essential pdb Commands

\`\`\`
(Pdb) Commands:
  n (next)     — execute current line, step OVER function calls
  s (step)     — step INTO function calls
  c (continue) — run until next breakpoint
  q (quit)     — abort execution
  
  l (list)     — show surrounding code (default: 11 lines)
  l 1,20       — show lines 1-20
  
  p expr       — print the value of an expression
  pp expr      — pretty-print (for dicts/lists)
  
  w (where)    — show call stack (current position highlighted)
  u (up)       — move up one stack frame
  d (down)     — move down one stack frame
  
  b 42         — set breakpoint at line 42
  b func       — set breakpoint at function entry
  b            — list all breakpoints
  cl 1         — clear breakpoint 1
  
  h (help)     — show all commands
  h n          — help for specific command
\`\`\`

\`\`\`python
# Example debugging session:
def buggy_function(items):
    total = 0
    for i, item in enumerate(items):
        breakpoint()      # pause here
        # In pdb:
        # (Pdb) p i       → 0
        # (Pdb) p item    → 'apple'
        # (Pdb) p items   → ['apple', 'banana', 'cherry']
        # (Pdb) n         → execute the next line
        total += item.price
    return total
\`\`\`

## Post-Mortem Debugging

Debug a crash without adding \`breakpoint()\` calls:

\`\`\`python
import pdb

def crashed_function():
    items = [1, 2, 3]
    return items[10]   # IndexError!

try:
    crashed_function()
except IndexError:
    pdb.post_mortem()   # drops into debugger at the point of crash

# Or run a script in post-mortem mode:
# python -m pdb -c continue my_script.py
# This runs the script and drops into pdb if it crashes
\`\`\`

## Conditional Breakpoints

\`\`\`python
for i, item in enumerate(large_list):
    if i == 500:               # only break on specific iteration
        breakpoint()
    process(item)

# Or use pdb condition syntax:
# (Pdb) b my_module.py:42, item == "special_value"
\`\`\`

## Try It Yourself

\`\`\`python
# This function has a bug — use pdb to find it:
def find_second_largest(numbers):
    if len(numbers) < 2:
        return None
    sorted_nums = sorted(numbers)
    return sorted_nums[-2]   # bug: doesn't handle duplicates

# Bug: find_second_largest([5, 5, 3]) returns 5 instead of 3
# Use breakpoint() to inspect sorted_nums at runtime and fix the bug.
\`\`\`
`,
  },

  // EXPERT TOPICS
  'expert-design-patterns-singleton-factory': {
    readTime: 9,
    whatYoullLearn: [
      'Implement the Singleton pattern using __new__',
      'Make Singleton thread-safe',
      'Build Factory Method and Abstract Factory patterns',
      'Know when to apply these patterns and when to avoid them',
      'Use module-level singletons as a simpler alternative',
    ],
    content: `
## Singleton Pattern

A Singleton ensures only one instance of a class exists:

\`\`\`python
class DatabaseConnection:
    """Thread-safe Singleton using __new__."""
    _instance = None
    _lock = __import__('threading').Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:           # double-checked locking
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, dsn: str = ""):
        if self._initialized:
            return                    # don't re-initialize
        self.dsn = dsn
        self.connection = None
        self._initialized = True

    def connect(self):
        if not self.connection:
            print(f"Connecting to {self.dsn}")
            self.connection = object()  # simulate connection

db1 = DatabaseConnection("postgresql://localhost/mydb")
db2 = DatabaseConnection()
print(db1 is db2)   # True — same instance!

# Simpler Python approach: use a module-level variable
# config.py
# _db = None
# def get_db():
#     global _db
#     if _db is None:
#         _db = DatabaseConnection()
#     return _db
\`\`\`

## Factory Method Pattern

Defines an interface for creating objects, letting subclasses decide which class to instantiate:

\`\`\`python
from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...

class EmailNotification(Notification):
    def __init__(self, email: str): self.email = email
    def send(self, message: str) -> None:
        print(f"Email to {self.email}: {message}")

class SMSNotification(Notification):
    def __init__(self, phone: str): self.phone = phone
    def send(self, message: str) -> None:
        print(f"SMS to {self.phone}: {message}")

class PushNotification(Notification):
    def __init__(self, token: str): self.token = token
    def send(self, message: str) -> None:
        print(f"Push to {self.token}: {message}")

class NotificationFactory:
    """Factory that creates notifications based on type."""

    _registry: dict[str, type] = {
        "email": EmailNotification,
        "sms": SMSNotification,
        "push": PushNotification,
    }

    @classmethod
    def create(cls, notification_type: str, **kwargs) -> Notification:
        if notification_type not in cls._registry:
            raise ValueError(f"Unknown type: {notification_type}")
        return cls._registry[notification_type](**kwargs)

    @classmethod
    def register(cls, name: str, notification_class: type) -> None:
        """Plugin-style registration — open/closed principle."""
        cls._registry[name] = notification_class

# Usage:
notif = NotificationFactory.create("email", email="alice@example.com")
notif.send("Your order shipped!")
\`\`\`

## Try It Yourself

\`\`\`python
# Implement an Abstract Factory for database drivers:
# - MySQLDriver and PostgreSQLDriver
# - Each driver has: connect(), execute(sql), close()
# - DatabaseDriverFactory.create("mysql" or "postgresql")
# - Both implement a common abstract base class

class DatabaseDriver(ABC):
    @abstractmethod
    def connect(self, dsn: str) -> None: ...

    @abstractmethod
    def execute(self, sql: str) -> list: ...

    @abstractmethod
    def close(self) -> None: ...
\`\`\`
`,
  },

  'expert-design-patterns-observer-strategy': {
    readTime: 8,
    whatYoullLearn: [
      'Implement the Observer pattern for event-driven code',
      'Use the Strategy pattern to swap algorithms at runtime',
      'Apply the Command pattern for undoable operations',
      'Understand the open/closed principle these patterns enable',
      'Recognize over-engineering and when to keep it simple',
    ],
    content: `
## Observer Pattern

Observer lets objects subscribe to events and be notified automatically:

\`\`\`python
from typing import Callable
from dataclasses import dataclass, field

@dataclass
class Event:
    name: str
    data: dict = field(default_factory=dict)

class EventEmitter:
    """Publish-subscribe event system."""

    def __init__(self):
        self._listeners: dict[str, list[Callable]] = {}

    def on(self, event_name: str, handler: Callable) -> None:
        """Subscribe to an event."""
        self._listeners.setdefault(event_name, []).append(handler)

    def off(self, event_name: str, handler: Callable) -> None:
        """Unsubscribe from an event."""
        if event_name in self._listeners:
            self._listeners[event_name].remove(handler)

    def emit(self, event_name: str, **data) -> None:
        """Fire an event, notifying all subscribers."""
        event = Event(event_name, data)
        for handler in self._listeners.get(event_name, []):
            handler(event)

# Usage
store = EventEmitter()

def on_order_placed(event):
    print(f"Processing payment for order {event.data['order_id']}")

def on_order_placed_email(event):
    print(f"Sending confirmation email for {event.data['order_id']}")

store.on("order.placed", on_order_placed)
store.on("order.placed", on_order_placed_email)
store.emit("order.placed", order_id="ORD-001", total=99.99)
\`\`\`

## Strategy Pattern

Strategy defines a family of algorithms and makes them interchangeable:

\`\`\`python
from abc import ABC, abstractmethod

class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list) -> list: ...

class BubbleSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        d = data.copy()
        n = len(d)
        for i in range(n):
            for j in range(n - i - 1):
                if d[j] > d[j+1]:
                    d[j], d[j+1] = d[j+1], d[j]
        return d

class QuickSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        if len(data) <= 1:
            return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        mid = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + mid + self.sort(right)

class PythonSortStrategy(SortStrategy):
    def sort(self, data: list) -> list:
        return sorted(data)   # just use Python's built-in

class Sorter:
    def __init__(self, strategy: SortStrategy = None):
        self._strategy = strategy or PythonSortStrategy()

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy

    def sort(self, data: list) -> list:
        return self._strategy.sort(data)

sorter = Sorter()
data = [5, 2, 8, 1, 9, 3]
print(sorter.sort(data))   # [1, 2, 3, 5, 8, 9]

# Swap algorithm at runtime:
sorter.set_strategy(BubbleSortStrategy())
print(sorter.sort(data))   # same result, different algorithm
\`\`\`

## Try It Yourself

\`\`\`python
# Implement a TextProcessor with pluggable formatting strategies:
# - PlainTextStrategy: return text as-is
# - UpperCaseStrategy: return text.upper()
# - TitleCaseStrategy: return text.title()
# - MarkdownBoldStrategy: wrap words in **bold**

# The processor should accept a list of strategies and apply them in sequence.
\`\`\`
`,
  },

  'expert-metaprogramming-metaclasses': {
    readTime: 10,
    whatYoullLearn: [
      'Understand that type is the metaclass of all classes',
      'Create a custom metaclass by subclassing type',
      'Use __init_subclass__ as a simpler alternative',
      'Intercept class creation to add behavior automatically',
      'See how ORMs and frameworks use metaclasses',
    ],
    content: `
## Classes Are Objects Too

In Python, everything is an object — including classes themselves. A class's type is called its **metaclass**:

\`\`\`python
class MyClass:
    pass

print(type(42))        # <class 'int'>
print(type("hello"))   # <class 'str'>
print(type(MyClass))   # <class 'type'>  ← classes are instances of type!

# type() with 3 args creates a class dynamically:
# type(name, bases, namespace)
Dog = type("Dog", (object,), {
    "sound": "woof",
    "speak": lambda self: print(self.sound),
})

d = Dog()
d.speak()   # woof
print(type(Dog))   # <class 'type'>
\`\`\`

## Custom Metaclass

A metaclass is a class whose instances are classes. Override \`__new__\` or \`__init__\` to customize class creation:

\`\`\`python
class SingletonMeta(type):
    """Metaclass that makes all classes using it into Singletons."""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Config(metaclass=SingletonMeta):
    def __init__(self):
        self.debug = False
        self.host = "localhost"

c1 = Config()
c2 = Config()
print(c1 is c2)   # True

class RegistryMeta(type):
    """Automatically register all subclasses."""
    registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # don't register the base class itself
            mcs.registry[name] = cls
        return cls

class Plugin(metaclass=RegistryMeta):
    pass

class JSONPlugin(Plugin): pass
class CSVPlugin(Plugin): pass
class XMLPlugin(Plugin): pass

print(RegistryMeta.registry)
# {'JSONPlugin': <class 'JSONPlugin'>, 'CSVPlugin': ..., 'XMLPlugin': ...}
\`\`\`

## __init_subclass__ — Simpler Alternative

For many use cases, \`__init_subclass__\` (Python 3.6+) is cleaner than a metaclass:

\`\`\`python
class Animal:
    _registry = {}

    def __init_subclass__(cls, sound=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if sound:
            cls.sound = sound
            Animal._registry[cls.__name__] = cls

class Dog(Animal, sound="woof"): pass
class Cat(Animal, sound="meow"): pass
class Duck(Animal, sound="quack"): pass

print(Animal._registry)  # {'Dog': ..., 'Cat': ..., 'Duck': ...}
print(Dog.sound)  # "woof"
\`\`\`

## Try It Yourself

\`\`\`python
# Create a metaclass ValidatedMeta that:
# 1. Finds all class attributes that start with 'validate_'
# 2. On instance creation (__call__), runs each validator
#    against the corresponding attribute

class ValidatedMeta(type):
    def __call__(cls, *args, **kwargs):
        instance = super().__call__(*args, **kwargs)
        # find and run validators
        for name, value in vars(cls).items():
            if name.startswith("validate_"):
                field = name[9:]  # strip "validate_"
                validator = value
                validator(instance, getattr(instance, field, None))
        return instance

class User(metaclass=ValidatedMeta):
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def validate_age(self, value):
        if value < 0 or value > 150:
            raise ValueError(f"Invalid age: {value}")

    def validate_name(self, value):
        if not value or not value.strip():
            raise ValueError("Name cannot be empty")
\`\`\`
`,
  },

  'expert-metaprogramming-introspection': {
    readTime: 7,
    whatYoullLearn: [
      'Use getattr, setattr, hasattr, delattr for dynamic attribute access',
      'Inspect objects with the inspect module',
      'Explore class structure with __dict__, __slots__, dir()',
      'Build generic serializers and validators using introspection',
      'Use vars() and callable() for dynamic dispatch',
    ],
    content: `
## Dynamic Attribute Access

\`getattr\`, \`setattr\`, \`hasattr\`, and \`delattr\` let you work with attributes dynamically at runtime:

\`\`\`python
class Config:
    def __init__(self):
        self.host = "localhost"
        self.port = 8080
        self.debug = False

config = Config()

# getattr(obj, name, default)
print(getattr(config, "host"))           # "localhost"
print(getattr(config, "timeout", 30))   # 30 (default, no AttributeError)

# setattr(obj, name, value)
setattr(config, "host", "production.example.com")
setattr(config, "ssl", True)   # can add new attributes!
print(config.host)  # "production.example.com"

# hasattr(obj, name)
print(hasattr(config, "port"))     # True
print(hasattr(config, "missing"))  # False

# delattr(obj, name)
delattr(config, "debug")
print(hasattr(config, "debug"))    # False

# Dynamic dispatch using getattr:
class Router:
    def get_users(self): return ["Alice", "Bob"]
    def get_posts(self): return ["Post 1", "Post 2"]

router = Router()
resource = "users"
method = getattr(router, f"get_{resource}", None)
if method and callable(method):
    print(method())   # ["Alice", "Bob"]
\`\`\`

## The inspect Module

\`inspect\` reveals the internals of live objects:

\`\`\`python
import inspect

def greet(name: str, times: int = 1) -> str:
    """Greet someone."""
    return (f"Hello, {name}! " * times).strip()

# Function signature
sig = inspect.signature(greet)
print(sig)          # (name: str, times: int = 1) -> str
print(sig.parameters)  # {'name': ..., 'times': ...}

for pname, param in sig.parameters.items():
    print(f"{pname}: default={param.default}, annotation={param.annotation}")

# Source code
print(inspect.getsource(greet))

# Class members
class MyClass:
    class_var = "hello"
    def method(self): pass
    @staticmethod
    def static_method(): pass

for name, obj in inspect.getmembers(MyClass):
    if not name.startswith("_"):
        print(name, type(obj).__name__)
\`\`\`

## Generic Serializer Using Introspection

\`\`\`python
def to_dict(obj) -> dict:
    """Serialize any object with public attributes to a dict."""
    return {
        key: value
        for key, value in vars(obj).items()
        if not key.startswith("_")
    }

def from_dict(cls, data: dict):
    """Deserialize a dict to a class instance."""
    instance = cls.__new__(cls)
    for key, value in data.items():
        setattr(instance, key, value)
    return instance

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 7)
d = to_dict(p)              # {'x': 3, 'y': 7}
p2 = from_dict(Point, d)   # Point instance with x=3, y=7
\`\`\`

## Try It Yourself

\`\`\`python
# Write a function 'call_method(obj, method_name, *args, **kwargs)'
# that safely calls a method by name, returning None if it doesn't exist.

def call_method(obj, method_name, *args, **kwargs):
    method = getattr(obj, method_name, None)
    if callable(method):
        return method(*args, **kwargs)
    return None

class Dog:
    def bark(self): return "Woof!"
    def sit(self): return "Sitting."

d = Dog()
print(call_method(d, "bark"))       # "Woof!"
print(call_method(d, "fly"))        # None (no error)
print(call_method(d, "sit"))        # "Sitting."
\`\`\`
`,
  },

  'expert-metaprogramming-descriptor-protocol': {
    readTime: 8,
    whatYoullLearn: [
      'Understand how descriptors power @property, @classmethod, @staticmethod',
      'Implement __get__, __set__, __delete__ for data descriptors',
      'Distinguish data descriptors from non-data descriptors',
      'Build reusable validation descriptors',
      'Apply descriptors for type checking and lazy loading',
    ],
    content: `
## What are Descriptors?

A descriptor is any object that defines \`__get__\`, \`__set__\`, or \`__delete__\`. They're the mechanism behind \`@property\`, \`@classmethod\`, \`@staticmethod\`, and ORM fields:

\`\`\`python
class Descriptor:
    """A simple non-data descriptor."""

    def __get__(self, obj, objtype=None):
        print(f"__get__ called: obj={obj}, type={objtype}")
        return 42

    # Data descriptor also defines __set__ (and optionally __delete__)

class MyClass:
    value = Descriptor()   # class attribute — the descriptor

obj = MyClass()
print(obj.value)     # __get__ called: obj=<MyClass...>, type=<class 'MyClass'>
                     # 42
print(MyClass.value) # __get__ called: obj=None, type=<class 'MyClass'>
                     # 42
\`\`\`

## Validation Descriptor

Reusable type-checking and range validation without repeating code:

\`\`\`python
class TypedAttribute:
    """Descriptor that enforces type constraints."""

    def __init__(self, name: str, expected_type: type):
        self.name = f"_{name}"
        self.expected_type = expected_type

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.name, None)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(
                f"Expected {self.expected_type.__name__}, "
                f"got {type(value).__name__}"
            )
        setattr(obj, self.name, value)

class RangedNumber:
    """Descriptor for a number within a range."""

    def __init__(self, name, min_val, max_val):
        self.name = f"_{name}"
        self.min = min_val
        self.max = max_val

    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return getattr(obj, self.name)

    def __set__(self, obj, value):
        if not (self.min <= value <= self.max):
            raise ValueError(f"Value {value} out of range [{self.min}, {self.max}]")
        setattr(obj, self.name, value)

class Person:
    name = TypedAttribute("name", str)
    age = RangedNumber("age", 0, 150)
    score = RangedNumber("score", 0.0, 100.0)

    def __init__(self, name, age, score):
        self.name = name    # calls TypedAttribute.__set__
        self.age = age      # calls RangedNumber.__set__
        self.score = score

p = Person("Alice", 30, 95.5)
# p.age = -5   # ValueError: Value -5 out of range [0, 150]
# p.name = 42  # TypeError: Expected str, got int
\`\`\`

## How @property Works Internally

\`@property\` is actually just a built-in descriptor:

\`\`\`python
# These two are equivalent:

# Using @property
class Circle1:
    def __init__(self, r): self._r = r

    @property
    def radius(self): return self._r

    @radius.setter
    def radius(self, v):
        if v < 0: raise ValueError()
        self._r = v

# Using a descriptor directly
class RadiusDescriptor:
    def __get__(self, obj, _=None):
        return obj._r if obj else self
    def __set__(self, obj, v):
        if v < 0: raise ValueError()
        obj._r = v

class Circle2:
    radius = RadiusDescriptor()
    def __init__(self, r): self.radius = r  # calls __set__
\`\`\`

## Try It Yourself

\`\`\`python
# Build a LazyProperty descriptor that:
# - Computes the value on first access
# - Caches it on the instance for subsequent accesses
# - Avoids recomputation

class LazyProperty:
    def __init__(self, func):
        self.func = func
        self.name = None

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None: return self
        # compute and cache if not already cached
        pass

class DataProcessor:
    def __init__(self, data):
        self.data = data

    @LazyProperty
    def processed(self):
        print("Computing...")   # should only print once
        return sorted(set(self.data))

dp = DataProcessor([3, 1, 4, 1, 5, 9, 2, 6])
print(dp.processed)  # "Computing..." then [1, 2, 3, 4, 5, 6, 9]
print(dp.processed)  # No "Computing..." — cached
\`\`\`
`,
  },

  'expert-memory-performance-profiling-caching': {
    readTime: 8,
    whatYoullLearn: [
      'Profile code with cProfile to find bottlenecks',
      'Benchmark precisely with the timeit module',
      'Cache expensive function results with functools.lru_cache',
      'Use Python 3.9+ functools.cache',
      'Understand time/space tradeoffs of caching',
    ],
    content: `
## cProfile — Finding Bottlenecks

Don't guess where your code is slow — measure it:

\`\`\`python
import cProfile
import pstats

def slow_fibonacci(n):
    if n < 2: return n
    return slow_fibonacci(n-1) + slow_fibonacci(n-2)

# Profile and print results
cProfile.run("slow_fibonacci(30)", sort="cumulative")

# More control:
profiler = cProfile.Profile()
profiler.enable()
result = slow_fibonacci(30)
profiler.disable()

stats = pstats.Stats(profiler)
stats.sort_stats("cumulative")
stats.print_stats(10)   # top 10 most expensive functions
\`\`\`

## timeit — Precise Benchmarking

\`timeit\` measures small code snippets accurately (runs them many times):

\`\`\`python
import timeit

# Quick one-liner
t = timeit.timeit("'-'.join(str(n) for n in range(100))", number=10000)
print(f"Generator: {t:.4f}s")

# Compare two approaches
approach_1 = timeit.timeit(
    "result = [x**2 for x in range(1000)]",
    number=1000
)
approach_2 = timeit.timeit(
    "result = list(map(lambda x: x**2, range(1000)))",
    number=1000
)
print(f"Comprehension: {approach_1:.4f}s")
print(f"map+lambda: {approach_2:.4f}s")

# With setup code:
setup = "import json; data = {'key': list(range(100))}"
encode = timeit.timeit("json.dumps(data)", setup=setup, number=10000)
print(f"JSON encode: {encode:.4f}s")
\`\`\`

## functools.lru_cache and cache

Cache expensive function results automatically:

\`\`\`python
from functools import lru_cache, cache
import time

# Without caching — recomputes every call
def fib_slow(n):
    if n < 2: return n
    return fib_slow(n-1) + fib_slow(n-2)

# With lru_cache — memoizes up to maxsize results
@lru_cache(maxsize=128)
def fib_cached(n):
    if n < 2: return n
    return fib_cached(n-1) + fib_cached(n-2)

start = time.time()
print(fib_slow(35))     # takes ~5 seconds
print(f"Slow: {time.time()-start:.2f}s")

start = time.time()
print(fib_cached(35))   # instant!
print(f"Cached: {time.time()-start:.5f}s")

# Python 3.9+: @cache is @lru_cache(maxsize=None)
@cache
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

# Cache info
print(fib_cached.cache_info())  # CacheInfo(hits=..., misses=..., maxsize=128, currsize=...)
fib_cached.cache_clear()        # invalidate cache
\`\`\`

## Memory Profiling

\`\`\`python
# Use sys.getsizeof for basic memory info
import sys

lst = list(range(1000))
gen = (x for x in range(1000))
print(sys.getsizeof(lst))   # ~8056 bytes
print(sys.getsizeof(gen))   # ~104 bytes — huge savings!

# __slots__ reduces per-instance memory
class WithoutSlots:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class WithSlots:
    __slots__ = ['x', 'y']  # no __dict__ per instance
    def __init__(self, x, y):
        self.x = x
        self.y = y

a = WithoutSlots(1, 2)
b = WithSlots(1, 2)
print(sys.getsizeof(a))  # ~48 bytes + __dict__ overhead
print(sys.getsizeof(b))  # ~56 bytes, no __dict__
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Profile these two approaches for building a large string,
#    then choose the faster one:
import timeit

def join_with_plus(n):
    result = ""
    for i in range(n):
        result += str(i)
    return result

def join_with_list(n):
    parts = []
    for i in range(n):
        parts.append(str(i))
    return "".join(parts)

# 2. Add @lru_cache to this function and verify it speeds up repeated calls:
def get_primes_up_to(n):
    """Return list of primes up to n (sieve of Eratosthenes)."""
    if n < 2: return []
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for j in range(i*i, n+1, i):
                sieve[j] = False
    return [i for i, p in enumerate(sieve) if p]
\`\`\`
`,
  },

  // MASTERY TOPICS
  'mastery-cpython-internals-bytecode-dis-module': {
    readTime: 9,
    whatYoullLearn: [
      'Understand that Python compiles to bytecode before running',
      'Use the dis module to inspect bytecode',
      'Understand code objects and their attributes',
      'Trace the CPython stack machine through opcodes',
      'Use bytecode knowledge to write more efficient Python',
    ],
    content: `
## Python Compilation Pipeline

Python doesn't interpret source code directly — it compiles it first:

\`\`\`
Source code (.py)
     ↓  parse
Abstract Syntax Tree (AST)
     ↓  compile
Bytecode (.pyc)
     ↓  execute
CPython VM (stack machine)
\`\`\`

\`\`\`python
import dis
import ast

source = """
def add(a, b):
    return a + b
"""

# See the AST
tree = ast.parse(source)
print(ast.dump(tree, indent=2))

# Compile to bytecode
code = compile(source, "<string>", "exec")
print(type(code))   # <class 'code'>
exec(code)
\`\`\`

## Disassembling with dis

\`\`\`python
import dis

def calculate(x, y):
    result = x * y + 10
    return result

dis.dis(calculate)
# Output:
#   2           0 LOAD_FAST    0 (x)
#               2 LOAD_FAST    1 (y)
#               4 BINARY_OP   5 (*)
#               8 LOAD_CONST  1 (10)
#              10 BINARY_OP   0 (+)
#              14 STORE_FAST  2 (result)
#   3          16 LOAD_FAST   2 (result)
#              18 RETURN_VALUE

# Column meanings:
# line number | offset (bytes) | opcode | arg | (arg name)
\`\`\`

## Code Objects

Every function has a code object (\`__code__\`) with metadata:

\`\`\`python
def greet(name, greeting="Hello"):
    message = f"{greeting}, {name}!"
    return message

co = greet.__code__
print(co.co_name)        # "greet"     — function name
print(co.co_varnames)    # ('name', 'greeting', 'message') — local var names
print(co.co_consts)      # (None, '!') — constants
print(co.co_argcount)    # 2           — number of positional args
print(co.co_stacksize)   # max stack depth needed
print(co.co_filename)    # source file
print(co.co_firstlineno) # first line number

# View raw bytecode
import dis
dis.show_code(greet)
\`\`\`

## Bytecode Insight: List Comprehension vs Loop

\`\`\`python
import dis

def with_loop(n):
    result = []
    for i in range(n):
        result.append(i * i)
    return result

def with_comprehension(n):
    return [i * i for i in range(n)]

dis.dis(with_loop)
dis.dis(with_comprehension)
# The comprehension uses LIST_APPEND (C-level, faster) vs the loop's CALL append
# This is why comprehensions are typically ~30% faster than equivalent loops
\`\`\`

## Try It Yourself

\`\`\`python
import dis

# 1. Disassemble these two equivalent functions and compare:
def version_a(data):
    return {k: v for k, v in data.items() if v > 0}

def version_b(data):
    result = {}
    for k, v in data.items():
        if v > 0:
            result[k] = v
    return result

dis.dis(version_a)
print("---")
dis.dis(version_b)

# 2. What bytecode does a walrus operator generate?
def uses_walrus(data):
    if n := len(data):
        return n
dis.dis(uses_walrus)
\`\`\`
`,
  },

  'mastery-cpython-internals-gil': {
    readTime: 8,
    whatYoullLearn: [
      'Understand what the GIL is and why it exists',
      'Know which operations release the GIL',
      'Understand why threads don\'t speed up CPU-bound Python code',
      'Use multiprocessing to bypass the GIL',
      'Learn about Python 3.13+ free-threaded mode',
    ],
    content: `
## What is the GIL?

The **Global Interpreter Lock** is a mutex in CPython that ensures only one thread executes Python bytecode at any moment. It exists to protect Python's reference-counting garbage collector from concurrent corruption:

\`\`\`python
# Why the GIL exists — reference counting safety:
import sys
x = [1, 2, 3]
print(sys.getrefcount(x))  # number of references to x

# Without the GIL, two threads could simultaneously modify
# refcounts, causing memory corruption or premature deallocation.
# The GIL serializes access to prevent this.
\`\`\`

## GIL and Threading

The GIL means true CPU parallelism is impossible with threads in CPython:

\`\`\`python
import threading
import time

def cpu_task(n):
    return sum(i**2 for i in range(n))

# With 1 thread: 1.0s
# With 4 threads: STILL ~1.0s (GIL prevents true parallelism!)
def run_threads(num_threads):
    start = time.time()
    threads = [threading.Thread(target=cpu_task, args=(5_000_000,))
               for _ in range(num_threads)]
    for t in threads: t.start()
    for t in threads: t.join()
    return time.time() - start

print(f"1 thread:  {run_threads(1):.2f}s")
print(f"4 threads: {run_threads(4):.2f}s")   # same or SLOWER due to GIL contention
\`\`\`

## When the GIL is Released

The GIL IS released during I/O operations, sleep, and C extensions:

\`\`\`python
import threading, requests, time

def io_task(url):
    # GIL is released during the HTTP request
    requests.get(url)

# I/O-bound work: threads DO help because GIL is released during I/O
urls = ["https://httpbin.org/delay/1"] * 4

start = time.time()
threads = [threading.Thread(target=io_task, args=(url,)) for url in urls]
for t in threads: t.start()
for t in threads: t.join()
print(f"Parallel I/O: {time.time()-start:.2f}s")  # ~1s (not 4s!)
\`\`\`

## Bypassing the GIL

\`\`\`python
from concurrent.futures import ProcessPoolExecutor
import time

def cpu_task(n):
    return sum(i**2 for i in range(n))

# multiprocessing: each process has its OWN GIL
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_task, [5_000_000]*4))
# ~4x faster on a 4-core machine!

# NumPy also releases the GIL for array operations:
import numpy as np
# np.dot(), np.sort() etc. release GIL and use multiple cores via BLAS
\`\`\`

## Python 3.13+ Free-Threaded Mode

\`\`\`python
# Python 3.13 introduces experimental free-threaded mode (no GIL):
# Build from source with --disable-gil, or use:
# python3.13t (the 't' build)

# Check if running without GIL:
import sys
print(sys._is_gil_enabled())   # False in free-threaded mode!

# This is experimental — many C extensions don't support it yet.
# Performance implications are still being studied.
\`\`\`

## Try It Yourself

\`\`\`python
# Demonstrate the GIL in action:
# 1. Write a CPU-bound task
# 2. Time it running sequentially, with threads, and with processes
# 3. Show that threads don't help but processes do

import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def heavy_computation(n):
    return sum(x ** 2 for x in range(n))

if __name__ == "__main__":
    N = 3_000_000
    COUNT = 4

    # Sequential
    # Threaded
    # Process-based
    # Compare and explain results
    pass
\`\`\`
`,
  },

  'mastery-cpython-internals-c-extensions': {
    readTime: 8,
    whatYoullLearn: [
      'Call C library functions with ctypes',
      'Use cffi for more ergonomic C interop',
      'Write a simple Cython extension for performance',
      'Understand when C extensions are worth writing',
      'Use existing C extensions (NumPy, Pillow, etc.)',
    ],
    content: `
## ctypes — Calling C from Python

\`ctypes\` is built-in and lets you call functions in shared C libraries:

\`\`\`python
import ctypes
import ctypes.util

# Load a C library
libc = ctypes.CDLL(ctypes.util.find_library("c"))

# Call C's printf
libc.printf(b"Hello from C! %d\\n", ctypes.c_int(42))

# Call C's math functions
libm = ctypes.CDLL(ctypes.util.find_library("m"))
libm.cos.restype = ctypes.c_double
libm.cos.argtypes = [ctypes.c_double]
import math
print(libm.cos(ctypes.c_double(0.0)))   # 1.0

# Work with C structs
class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_int), ("y", ctypes.c_int)]

p = Point(3, 7)
print(p.x, p.y)   # 3 7
\`\`\`

## Cython — Python with C Speed

Cython transpiles Python-like code to C for dramatic speedups:

\`\`\`python
# fib.pyx (Cython file)
def fib_python(int n):
    """Pure Python implementation."""
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b

# With Cython type declarations:
def fib_cython(int n):
    """Cython with type hints — much faster."""
    cdef int a = 0, b = 1, i
    if n < 2:
        return n
    for i in range(n - 1):
        a, b = b, a + b
    return b

# setup.py to compile:
# from setuptools import setup
# from Cython.Build import cythonize
# setup(ext_modules=cythonize("fib.pyx"))

# Build: python setup.py build_ext --inplace
# Import: from fib import fib_cython
# Speed: typically 10-100x faster for tight loops
\`\`\`

## When to Use C Extensions

\`\`\`python
# Profile first — 80/20 rule applies to performance too
# Only extend with C when:
# 1. The bottleneck is a tight CPU loop (not I/O)
# 2. Python-level optimization is exhausted
# 3. NumPy vectorization doesn't apply
# 4. You can't use PyPy/Cython instead

# Typical speedup factors (rough guide):
# Cython with types: 10-100x
# C extension (Python/C API): 10-500x
# C extension (Numba JIT): 10-200x (no C writing needed)

# Modern alternatives to writing C extensions:
import numba
@numba.jit(nopython=True)
def fib_numba(n):
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b
# Compiled to machine code on first call!
\`\`\`

## Try It Yourself

\`\`\`python
import ctypes, time

# 1. Use ctypes to call the C 'qsort' function to sort an integer array
# 2. Compare the speed to Python's sorted() for a large list
# 3. Reflect: is ctypes worth it here? (Probably not — Python's sort is already C!)

# ctypes qsort example:
import ctypes

COMPARE = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_void_p, ctypes.c_void_p)

def compare_ints(a, b):
    return ctypes.cast(a, ctypes.POINTER(ctypes.c_int))[0] - \\
           ctypes.cast(b, ctypes.POINTER(ctypes.c_int))[0]

libc = ctypes.CDLL(None)
\`\`\`
`,
  },

  'mastery-cpython-internals-jit-numba-pypy': {
    readTime: 7,
    whatYoullLearn: [
      'Accelerate Python functions with @numba.jit decorator',
      'Understand when Numba works and its limitations',
      'Know what PyPy is and when to use it',
      'Benchmark JIT vs CPython vs PyPy',
      'Choose the right tool for performance-critical Python',
    ],
    content: `
## Numba — JIT Compilation for Python

Numba compiles Python functions to native machine code using LLVM. Works best on numerical loops:

\`\`\`python
from numba import jit, njit
import numpy as np
import time

# @jit allows fallback to Python if type inference fails
# @njit (nopython=True) is strict — errors if can't compile to pure native code
@njit
def monte_carlo_pi(n_samples: int) -> float:
    """Estimate π using Monte Carlo sampling."""
    inside = 0
    for _ in range(n_samples):
        x = np.random.random()
        y = np.random.random()
        if x*x + y*y <= 1.0:
            inside += 1
    return 4.0 * inside / n_samples

# First call: compilation overhead (~0.5-2s)
pi = monte_carlo_pi(1_000_000)

# Subsequent calls: native speed
start = time.time()
pi = monte_carlo_pi(10_000_000)
print(f"π ≈ {pi:.6f}, took {time.time()-start:.3f}s")
# CPython: ~5-10s | Numba: ~0.05-0.1s → 100x faster!
\`\`\`

## NumPy + Numba for Arrays

\`\`\`python
from numba import njit
import numpy as np

@njit
def manual_dot(a, b):
    """Manual dot product — Numba makes this fast."""
    result = 0.0
    for i in range(len(a)):
        result += a[i] * b[i]
    return result

a = np.random.random(1_000_000)
b = np.random.random(1_000_000)

# Numba version vs NumPy built-in:
r1 = manual_dot(a, b)          # Numba JIT — comparable to np.dot
r2 = np.dot(a, b)               # NumPy (already C-optimized)
# np.dot is usually still faster for arrays — use Numba for complex loops
\`\`\`

## PyPy — Alternative Python Runtime

\`\`\`bash
# PyPy is a full Python implementation with a JIT compiler built in.
# Download from pypy.org

# Use exactly like CPython:
pypy3 my_script.py
pypy3 -m pytest tests/

# PyPy benchmarks (rough):
# Pure Python loops: 3-50x faster than CPython
# NumPy-heavy code: similar or slower (PyPy's numpy support is limited)
# I/O-bound code: similar
\`\`\`

\`\`\`python
# Code to benchmark (run under both CPython and PyPy):
import time

def benchmark_loop(n):
    total = 0
    for i in range(n):
        total += i * i
    return total

start = time.time()
result = benchmark_loop(50_000_000)
elapsed = time.time() - start
print(f"Result: {result}, Time: {elapsed:.3f}s")
# CPython 3.12: ~4s
# PyPy 7.3:    ~0.2s (20x faster!)
\`\`\`

## Choosing the Right Tool

\`\`\`
Problem                    → Solution
─────────────────────────────────────────────────────
Tight numeric loops        → Numba @njit
Matrix/array operations    → NumPy (already fast!)
General-purpose speedup    → PyPy
CPU-bound, no type issues  → Cython
Platform-specific C code   → ctypes / cffi
GPU computing              → CuPy / Numba CUDA
\`\`\`

## Try It Yourself

\`\`\`python
from numba import njit
import time

# Implement and benchmark these with and without @njit:

def sieve_python(n):
    """Sieve of Eratosthenes — returns primes up to n."""
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    return sum(is_prime)

@njit
def sieve_numba(n):
    # same implementation
    pass

# Benchmark both with n = 10_000_000
\`\`\`
`,
  },

  'mastery-distributed-computing-dask-ray-pyspark': {
    readTime: 9,
    whatYoullLearn: [
      'Use Dask for out-of-core parallel DataFrames',
      'Distribute tasks across cores/machines with Ray',
      'Process big data with PySpark RDDs and DataFrames',
      'Choose the right framework for your workload',
      'Understand the cluster computing mental model',
    ],
    content: `
## Dask — Parallel Pandas

Dask extends pandas and NumPy for datasets larger than RAM:

\`\`\`python
import dask.dataframe as dd
import pandas as pd

# Read a large CSV (only reads metadata until compute() is called)
df = dd.read_csv("large_dataset_*.csv")   # glob pattern

# Dask operations look just like pandas
filtered = df[df["age"] > 25]
grouped = filtered.groupby("city")["salary"].mean()

# Nothing has executed yet — Dask builds a task graph!
print(type(grouped))   # dask.dataframe.core.Series

# Actually compute (triggers parallel execution):
result = grouped.compute()   # returns a pandas Series
print(result)

# Works with multiple files in parallel:
# dask automatically partitions data across workers
df2 = dd.read_parquet("data/year=*/month=*/*.parquet")
\`\`\`

## Ray — Universal Distributed Computing

Ray scales Python from a laptop to a cluster:

\`\`\`python
import ray

ray.init()   # start local cluster (or connect to existing)

@ray.remote   # decorator makes this a "task" (runs in parallel)
def slow_function(x):
    import time
    time.sleep(1)
    return x * x

# Launch 10 tasks in parallel:
futures = [slow_function.remote(i) for i in range(10)]
results = ray.get(futures)   # wait for all, takes ~1s not 10s
print(results)

# Ray Actors — stateful distributed objects
@ray.remote
class Counter:
    def __init__(self):
        self.value = 0
    def increment(self):
        self.value += 1
    def get(self):
        return self.value

counter = Counter.remote()
for _ in range(5):
    counter.increment.remote()
print(ray.get(counter.get.remote()))   # 5

ray.shutdown()
\`\`\`

## PySpark — Big Data with Spark

\`\`\`python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, count

# Create Spark session
spark = SparkSession.builder \\
    .appName("PyPath Example") \\
    .getOrCreate()

# Read data (can be HDFS, S3, local)
df = spark.read.csv("sales.csv", header=True, inferSchema=True)

# Transformations (lazy — not executed yet)
result = df \\
    .filter(col("amount") > 100) \\
    .groupBy("region") \\
    .agg(
        count("*").alias("orders"),
        avg("amount").alias("avg_amount")
    ) \\
    .orderBy("avg_amount", ascending=False)

# Action — triggers execution across cluster
result.show(10)
result.write.parquet("output/region_summary")

spark.stop()
\`\`\`

## Choosing the Right Framework

\`\`\`
Workload                          → Framework
─────────────────────────────────────────────
pandas-like, >RAM, single machine → Dask
General parallel Python           → Ray, multiprocessing
ML distributed training           → Ray Train, Horovod
Petabyte-scale batch processing   → PySpark
Real-time streaming               → Flink, Spark Streaming
Scientific computing              → Dask Array, Ray
\`\`\`

## Try It Yourself

\`\`\`python
import ray

ray.init()

@ray.remote
def word_count(text):
    from collections import Counter
    return Counter(text.lower().split())

@ray.remote
def merge_counters(counter_list):
    from collections import Counter
    total = Counter()
    for c in counter_list:
        total.update(c)
    return total

# Process a list of texts in parallel and merge results:
texts = [
    "the quick brown fox jumps over the lazy dog",
    "to be or not to be that is the question",
    "all that glitters is not gold",
] * 1000  # simulate large dataset

# Use ray.get and ray.remote to parallelize the word count
futures = [word_count.remote(t) for t in texts]
counts = ray.get(futures)
merged = ray.get(merge_counters.remote(counts))
print(merged.most_common(5))

ray.shutdown()
\`\`\`
`,
  },

  'mastery-system-programming-subprocess-os-shutil': {
    readTime: 7,
    whatYoullLearn: [
      'Run external commands with subprocess.run() and Popen',
      'Capture stdout and stderr from subprocesses',
      'Stream output from long-running processes',
      'Manage files and directories with shutil',
      'Set environment variables for subprocesses',
    ],
    content: `
## subprocess.run() — The Modern Interface

\`subprocess.run()\` is the high-level, recommended way to run external commands:

\`\`\`python
import subprocess

# Basic run — output goes to console
result = subprocess.run(["ls", "-la"])
print(result.returncode)   # 0 = success

# Capture output
result = subprocess.run(
    ["python3", "--version"],
    capture_output=True,    # captures stdout and stderr
    text=True,              # decode bytes to string
)
print(result.stdout)   # "Python 3.12.x\\n"
print(result.returncode)  # 0

# Check=True: raise CalledProcessError if return code != 0
try:
    result = subprocess.run(
        ["git", "status"],
        capture_output=True,
        text=True,
        check=True,          # raises on non-zero exit
        cwd="/tmp/my_repo",  # run in this directory
    )
    print(result.stdout)
except subprocess.CalledProcessError as e:
    print(f"Command failed: {e.returncode}")
    print(f"Stderr: {e.stderr}")
\`\`\`

## Popen for Streaming and Interaction

\`\`\`python
import subprocess

# Stream output line by line (great for long-running processes):
with subprocess.Popen(
    ["tail", "-f", "/var/log/system.log"],
    stdout=subprocess.PIPE,
    text=True,
) as process:
    for line in process.stdout:
        print(line, end="")
        if "ERROR" in line:
            process.terminate()
            break

# Pipe data to stdin:
result = subprocess.run(
    ["sort", "-n"],
    input="5\\n3\\n1\\n4\\n2",
    capture_output=True,
    text=True,
)
print(result.stdout)  # "1\\n2\\n3\\n4\\n5\\n"
\`\`\`

## os Module for System Operations

\`\`\`python
import os

# Environment variables
path = os.environ.get("PATH", "")
api_key = os.environ.get("API_KEY")
os.environ["MY_VAR"] = "value"

# Current directory
print(os.getcwd())
os.chdir("/tmp")

# File/directory operations
print(os.listdir("."))
os.makedirs("deep/nested/dir", exist_ok=True)
os.rename("old_name.txt", "new_name.txt")
os.remove("file.txt")
os.rmdir("empty_dir")

# Process info
print(os.getpid())   # current process ID
print(os.cpu_count())  # number of CPUs

# Walk directory tree
for root, dirs, files in os.walk("/path/to/project"):
    for file in files:
        print(os.path.join(root, file))
\`\`\`

## shutil — High-Level File Operations

\`\`\`python
import shutil

# Copy files and directories
shutil.copy("source.txt", "dest.txt")          # copy file
shutil.copy2("source.txt", "dest.txt")         # copy with metadata
shutil.copytree("src_dir", "dst_dir")          # copy entire directory tree

# Move
shutil.move("old_path", "new_path")

# Delete
shutil.rmtree("directory_to_delete")           # delete directory tree

# Disk usage
total, used, free = shutil.disk_usage("/")
print(f"Free: {free // (1024**3)} GB")

# Archive
shutil.make_archive("backup", "zip", "/path/to/dir")  # create backup.zip
shutil.unpack_archive("backup.zip", "/extract/here")
\`\`\`

## Try It Yourself

\`\`\`python
import subprocess, os

# 1. Write a function that runs a Python script in a subprocess
#    and returns its output (or raises on error):

def run_script(path, *args, timeout=30):
    result = subprocess.run(
        ["python3", path, *args],
        capture_output=True,
        text=True,
        timeout=timeout,
        check=True,
    )
    return result.stdout

# 2. Write a function that recursively counts files by extension in a directory:
from pathlib import Path
from collections import Counter

def count_by_extension(directory):
    return Counter(p.suffix for p in Path(directory).rglob("*") if p.is_file())
\`\`\`
`,
  },

  'mastery-realtime-applications-websockets': {
    readTime: 8,
    whatYoullLearn: [
      'Build a WebSocket server with the websockets library',
      'Handle client connections and disconnections',
      'Implement a broadcast/pub-sub pattern',
      'Use FastAPI\'s built-in WebSocket support',
      'Handle WebSocket errors and reconnection',
    ],
    content: `
## WebSockets vs HTTP

WebSockets provide a persistent, bidirectional connection between client and server — perfect for real-time apps:

\`\`\`
HTTP:       Client → Server (request)
            Client ← Server (response)
            Connection closed.

WebSocket:  Client ↔ Server (persistent, bidirectional)
            Both sides can send at any time.
            Connection stays open.

Use cases: chat apps, live dashboards, collaborative editing,
           gaming, stock tickers, notifications.
\`\`\`

## Simple WebSocket Server with websockets

\`\`\`python
import asyncio
import websockets
import json

# Track all connected clients
clients: set = set()

async def handler(websocket):
    """Handle a single WebSocket connection."""
    clients.add(websocket)
    print(f"Client connected: {websocket.remote_address}")
    try:
        async for message in websocket:
            # Echo message back to all clients (broadcast)
            data = json.loads(message)
            response = json.dumps({
                "type": "message",
                "from": str(websocket.remote_address),
                "text": data.get("text", "")
            })
            # Broadcast to all connected clients
            if clients:
                await asyncio.gather(
                    *[client.send(response) for client in clients],
                    return_exceptions=True
                )
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        clients.discard(websocket)
        print(f"Client disconnected: {websocket.remote_address}")

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("WebSocket server listening on ws://localhost:8765")
        await asyncio.Future()   # run forever

asyncio.run(main())
\`\`\`

## FastAPI WebSockets

\`\`\`python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import list as List
import json

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)

    async def broadcast(self, message: str):
        for ws in self.active:
            await ws.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(ws: WebSocket, client_id: str):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            await manager.broadcast(
                json.dumps({"client": client_id, "message": data})
            )
    except WebSocketDisconnect:
        manager.disconnect(ws)
        await manager.broadcast(f"{client_id} left the chat")

# Run: uvicorn main:app --reload
\`\`\`

## Try It Yourself

\`\`\`python
import asyncio
import websockets
import json

# Build a simple notification service:
# - Server maintains a list of channels
# - Clients can subscribe to channels (send {"action":"subscribe","channel":"news"})
# - Server broadcasts to all subscribers when a message is published
# - Clients can publish to a channel (send {"action":"publish","channel":"news","message":"..."})

class NotificationServer:
    def __init__(self):
        self.subscriptions: dict[str, set] = {}  # channel → set of websockets

    async def handle(self, websocket):
        async for raw in websocket:
            msg = json.loads(raw)
            # implement subscribe and publish logic
            pass

async def main():
    server = NotificationServer()
    async with websockets.serve(server.handle, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())
\`\`\`
`,
  },

  'mastery-realtime-applications-celery-rabbitmq-kafka': {
    readTime: 8,
    whatYoullLearn: [
      'Understand task queues and why they\'re needed',
      'Create and execute Celery tasks',
      'Configure Celery with Redis or RabbitMQ brokers',
      'Use Kafka for event streaming with kafka-python',
      'Handle task failures with retries and dead letter queues',
    ],
    content: `
## Why Task Queues?

Task queues decouple work from web requests — slow operations run in background workers:

\`\`\`
Without queue:
  HTTP Request → Process (5s) → HTTP Response (user waits 5s)

With queue:
  HTTP Request → Queue task → HTTP Response (instant)
                              ↓ (background)
                         Worker processes task
                         Worker sends email/webhook/notification
\`\`\`

## Celery Basics

\`\`\`python
# tasks.py
from celery import Celery
import time

# Configure with Redis broker (install: pip install celery redis)
app = Celery("myapp",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)

@app.task
def send_email(to: str, subject: str, body: str):
    """Simulate sending an email (slow operation)."""
    print(f"Sending email to {to}...")
    time.sleep(2)   # simulate email service
    return {"sent": True, "to": to}

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def fetch_user_data(self, user_id: int):
    """Task with automatic retry on failure."""
    try:
        # simulate occasional API failure
        import random
        if random.random() < 0.3:
            raise ConnectionError("API temporarily unavailable")
        return {"user_id": user_id, "name": "Alice"}
    except ConnectionError as exc:
        raise self.retry(exc=exc)

# Start worker: celery -A tasks worker --loglevel=info
\`\`\`

\`\`\`python
# app.py (your web app)
from tasks import send_email, fetch_user_data

# Queue a task — returns immediately
result = send_email.delay("alice@example.com", "Welcome!", "Hello Alice!")
print(result.id)     # task ID for tracking

# Check status
print(result.status)   # "PENDING", "SUCCESS", "FAILURE"
print(result.ready())  # True when done
print(result.get(timeout=10))  # wait up to 10s for result

# Apply async with callback:
from celery import chain
workflow = chain(
    fetch_user_data.s(42),
    send_email.s("Subject", "Body"),  # gets user data as first arg
)
workflow.apply_async()
\`\`\`

## Kafka with kafka-python

\`\`\`python
from kafka import KafkaProducer, KafkaConsumer
import json

# Producer — publish events
producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

producer.send("user-events", {
    "event": "user.signup",
    "user_id": 42,
    "email": "alice@example.com",
    "timestamp": "2025-03-04T12:00:00Z",
})
producer.flush()

# Consumer — subscribe to events
consumer = KafkaConsumer(
    "user-events",
    bootstrap_servers=["localhost:9092"],
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    group_id="notification-service",
)

for message in consumer:
    event = message.value
    print(f"Received: {event['event']} for user {event['user_id']}")
    process_event(event)
\`\`\`

## Try It Yourself

\`\`\`python
# Design a Celery workflow for an image processing pipeline:
# 1. download_image(url) → returns local path
# 2. resize_image(path, width, height) → returns new path
# 3. add_watermark(path, text) → returns new path
# 4. upload_to_storage(path) → returns public URL

# Use celery chain() to connect these tasks.
# Add retry logic to download_image in case of network errors.

from celery import chain

@app.task(bind=True, max_retries=3)
def download_image(self, url):
    pass

@app.task
def resize_image(path, width, height):
    pass

@app.task
def add_watermark(path, text):
    pass

@app.task
def upload_to_storage(path):
    pass

# Trigger the pipeline:
workflow = chain(
    download_image.s("https://example.com/photo.jpg"),
    resize_image.s(800, 600),
    add_watermark.s("© PyPath 2025"),
    upload_to_storage.s(),
)
result = workflow.apply_async()
\`\`\`
`,
  },

  'mastery-ai-ml-specialization-deep-learning-frameworks': {
    readTime: 9,
    whatYoullLearn: [
      'Create and manipulate tensors in PyTorch',
      'Build neural networks with torch.nn.Module',
      'Write a training loop with optimizer and loss function',
      'Use Keras/TensorFlow for rapid model prototyping',
      'Understand the computation graph and backpropagation',
    ],
    content: `
## PyTorch Tensors

Tensors are the core data structure — like NumPy arrays but with GPU support and autograd:

\`\`\`python
import torch

# Create tensors
x = torch.tensor([1.0, 2.0, 3.0])
matrix = torch.zeros(3, 4)
random_t = torch.randn(2, 3)   # normal distribution

# Operations (same as NumPy)
y = x ** 2
z = torch.dot(x, x)

# GPU support
if torch.cuda.is_available():
    x_gpu = x.cuda()   # move to GPU
    y_gpu = x_gpu ** 2

# Autograd — automatic differentiation
x = torch.tensor([2.0], requires_grad=True)
y = x ** 3 + 2 * x

y.backward()   # compute gradients
print(x.grad)  # dy/dx = 3x² + 2 = 14.0 at x=2
\`\`\`

## Building Neural Networks

\`\`\`python
import torch
import torch.nn as nn

class MLP(nn.Module):
    """Multi-layer perceptron for classification."""

    def __init__(self, input_size, hidden_size, num_classes):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size // 2, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

model = MLP(input_size=784, hidden_size=256, num_classes=10)
print(model)

# Count parameters
total = sum(p.numel() for p in model.parameters())
print(f"Parameters: {total:,}")
\`\`\`

## The Training Loop

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Dummy dataset
X = torch.randn(1000, 784)
y = torch.randint(0, 10, (1000,))
dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=32, shuffle=True)

model = MLP(784, 256, 10)
optimizer = optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

for epoch in range(10):
    model.train()
    total_loss = 0
    correct = 0

    for batch_X, batch_y in loader:
        # Forward pass
        logits = model(batch_X)
        loss = criterion(logits, batch_y)

        # Backward pass
        optimizer.zero_grad()   # clear gradients
        loss.backward()         # compute gradients
        optimizer.step()        # update weights

        total_loss += loss.item()
        correct += (logits.argmax(1) == batch_y).sum().item()

    acc = correct / len(dataset)
    print(f"Epoch {epoch+1}: loss={total_loss/len(loader):.4f}, acc={acc:.3f}")
\`\`\`

## Keras for Quick Prototyping

\`\`\`python
import tensorflow as tf
from tensorflow import keras

# Sequential API — very readable
model = keras.Sequential([
    keras.layers.Dense(256, activation="relu", input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax"),
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()

# Train:
# model.fit(X_train, y_train, epochs=10, validation_split=0.1)
# model.evaluate(X_test, y_test)
# model.save("model.keras")
\`\`\`

## Try It Yourself

\`\`\`python
# Build a binary classifier with PyTorch to classify XOR patterns:
import torch
import torch.nn as nn

# XOR dataset:
X = torch.tensor([[0,0],[0,1],[1,0],[1,1]], dtype=torch.float32)
y = torch.tensor([0, 1, 1, 0], dtype=torch.float32).unsqueeze(1)

# A linear model can't solve XOR — you need hidden layers.
# Design and train an MLP that achieves >95% accuracy.
# (Hint: you need at least one hidden layer with non-linear activation)
\`\`\`
`,
  },

  'mastery-ai-ml-specialization-model-optimization': {
    readTime: 7,
    whatYoullLearn: [
      'Export PyTorch models to ONNX for deployment',
      'Quantize models to reduce size and increase speed',
      'Use TorchScript for production deployment',
      'Apply pruning to remove redundant weights',
      'Profile model inference with PyTorch profiler',
    ],
    content: `
## ONNX Export

ONNX (Open Neural Network Exchange) lets you deploy PyTorch models in other runtimes:

\`\`\`python
import torch
import torch.onnx

model = load_trained_model()
model.eval()

# Dummy input to trace the computation graph
dummy_input = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    opset_version=17,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}},  # variable batch size
)

# Verify and run with onnxruntime:
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("model.onnx")
input_data = np.random.randn(1, 3, 224, 224).astype(np.float32)
output = session.run(None, {"input": input_data})
print(output[0].shape)
\`\`\`

## Quantization

Reduce model size and speed up inference by using 8-bit integers instead of 32-bit floats:

\`\`\`python
import torch
from torch.quantization import quantize_dynamic

model = load_trained_model()
model.eval()

# Dynamic quantization — simplest, works on CPU
quantized = torch.quantization.quantize_dynamic(
    model,
    {torch.nn.Linear},   # quantize these layer types
    dtype=torch.qint8,
)

# Compare sizes
original_size = sum(p.numel() * 4 for p in model.parameters())
quant_size = sum(p.numel() for p in quantized.parameters())
print(f"Original: {original_size/1024:.1f}KB")
print(f"Quantized: ~{original_size/1024/4:.1f}KB (4x smaller)")

# Typically: 4x smaller, 2-4x faster, <1% accuracy loss
\`\`\`

## TorchScript

Compile PyTorch models to a static representation for production:

\`\`\`python
import torch

class MyModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = torch.nn.Linear(10, 2)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return torch.sigmoid(self.fc(x))

model = MyModel()

# Script the model (static analysis)
scripted = torch.jit.script(model)
# Or trace it (run with sample input)
traced = torch.jit.trace(model, torch.randn(1, 10))

# Save and load without Python
scripted.save("model_scripted.pt")
loaded = torch.jit.load("model_scripted.pt")

# Run inference without Python (in C++, mobile, etc.)
output = loaded(torch.randn(1, 10))
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Train a small model, export to ONNX, and verify the outputs match:
import torch
import torch.onnx
import onnxruntime as ort
import numpy as np

model = torch.nn.Sequential(
    torch.nn.Linear(4, 8),
    torch.nn.ReLU(),
    torch.nn.Linear(8, 3),
)
model.eval()

test_input = torch.randn(5, 4)
torch_output = model(test_input).detach().numpy()

# Export and run with ORT
torch.onnx.export(model, test_input, "test.onnx", opset_version=17)
session = ort.InferenceSession("test.onnx")
ort_output = session.run(None, {"input.1": test_input.numpy()})[0]

# Outputs should be close (floating point tolerance):
print(np.allclose(torch_output, ort_output, atol=1e-5))   # True
\`\`\`
`,
  },

  'mastery-cloud-deployment-dockerizing-python': {
    readTime: 8,
    whatYoullLearn: [
      'Write a production-quality Dockerfile for Python apps',
      'Use multi-stage builds to minimize image size',
      'Configure environment variables and secrets properly',
      'Use docker-compose for multi-service local development',
      'Apply Docker best practices: layers, caching, non-root users',
    ],
    content: `
## A Production Dockerfile

\`\`\`dockerfile
# Dockerfile — multi-stage build for a FastAPI app
# Stage 1: Build dependencies
FROM python:3.12-slim AS builder

WORKDIR /app

# Install build tools (only needed for compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \\
    gcc libpq-dev \\
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first — leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Production image (minimal)
FROM python:3.12-slim AS production

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Security: run as non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Environment
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PATH="/root/.local/bin:$PATH"

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \\
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## docker-compose for Local Development

\`\`\`yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379/0
    volumes:
      - .:/app          # hot reload in development
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]
      interval: 10s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
\`\`\`

## Environment Variables and Secrets

\`\`\`python
# config.py — never hardcode secrets
import os
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "PyPath"
    database_url: str
    secret_key: str
    redis_url: str = "redis://localhost:6379"
    debug: bool = False

    class Config:
        env_file = ".env"    # for local development
        env_file_encoding = "utf-8"

@lru_cache
def get_settings() -> Settings:
    return Settings()

# .env (never commit this to git!)
# DATABASE_URL=postgresql://user:pass@localhost/db
# SECRET_KEY=your-secret-key-here
\`\`\`

## Try It Yourself

\`\`\`dockerfile
# Write a Dockerfile for this FastAPI application:
# - Base: python:3.12-slim
# - Install: fastapi uvicorn[standard] pydantic
# - Copy: main.py
# - Run as non-root user
# - Expose port 8000
# - CMD: uvicorn main:app --host 0.0.0.0 --port 8000

# main.py:
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def root(): return {"status": "healthy"}
@app.get("/health")
def health(): return {"status": "ok"}

# Then:
# docker build -t myapp .
# docker run -p 8000:8000 myapp
# curl http://localhost:8000/health
\`\`\`
`,
  },

  'mastery-cloud-deployment-aws-lambda-gcp-functions': {
    readTime: 8,
    whatYoullLearn: [
      'Write AWS Lambda handlers in Python',
      'Configure triggers: API Gateway, S3, SQS, EventBridge',
      'Optimize cold starts and memory settings',
      'Deploy with the Serverless Framework or AWS SAM',
      'Write GCP Cloud Functions',
    ],
    content: `
## AWS Lambda Handler

A Lambda function is a single Python function that handles events:

\`\`\`python
# lambda_function.py
import json
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    AWS Lambda handler function.
    
    Args:
        event: dict — the event that triggered the Lambda
                      (from API Gateway, S3, SQS, etc.)
        context: LambdaContext — runtime info (function name, timeout, etc.)
    
    Returns:
        dict — response (for API Gateway triggers)
    """
    logger.info(f"Event: {json.dumps(event)}")
    logger.info(f"Remaining time: {context.get_remaining_time_in_millis()}ms")

    # API Gateway trigger
    http_method = event.get("httpMethod", "UNKNOWN")
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")

    # Process the request
    if http_method == "POST" and path == "/process":
        result = process_data(body)
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"result": result}),
        }

    return {
        "statusCode": 404,
        "body": json.dumps({"error": "Not found"}),
    }

def process_data(data: dict) -> dict:
    # Your business logic here
    return {"processed": True, "items": len(data)}
\`\`\`

## S3 Event Trigger

\`\`\`python
import boto3
import urllib.parse

s3 = boto3.client("s3")

def handler(event, context):
    """Triggered when a file is uploaded to S3."""
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(
            record["s3"]["object"]["key"],
            encoding="utf-8"
        )

        print(f"Processing: s3://{bucket}/{key}")

        # Read the uploaded file
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response["Body"].read().decode("utf-8")

        # Process and save result
        result = process(content)
        output_key = f"processed/{key}"
        s3.put_object(
            Bucket=bucket,
            Key=output_key,
            Body=result.encode("utf-8"),
        )
        print(f"Saved to: s3://{bucket}/{output_key}")
\`\`\`

## Lambda Best Practices

\`\`\`python
# 1. Initialize expensive resources outside the handler (reused across invocations)
import boto3
dynamodb = boto3.resource("dynamodb")  # connection pool reused!
table = dynamodb.Table(os.environ["TABLE_NAME"])

# 2. Use environment variables for configuration
DATABASE_URL = os.environ["DATABASE_URL"]
SECRET = os.environ["SECRET_KEY"]

# 3. Minimize package size (cold starts are proportional to package size)
# - Use Lambda Layers for large dependencies
# - Use only what you need (not entire pandas for a simple csv operation)

# 4. Handle errors properly
def handler(event, context):
    try:
        return process(event)
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        return {"statusCode": 400, "body": str(e)}
    except Exception as e:
        logger.exception(f"Unexpected error: {e}")
        raise  # re-raise to mark invocation as failed (enables retries)
\`\`\`

## Try It Yourself

\`\`\`python
# Write a Lambda function that:
# 1. Accepts POST requests via API Gateway
# 2. Receives a JSON body with {"text": "..."}
# 3. Counts the word frequency in the text
# 4. Returns the top 5 most common words as JSON
# 5. Returns 400 if the body is missing or invalid JSON

import json, logging
from collections import Counter

logger = logging.getLogger()

def handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")
        text = body.get("text", "")
        if not text:
            return {"statusCode": 400, "body": json.dumps({"error": "Missing 'text' field"})}
        # your word count logic here
    except json.JSONDecodeError:
        return {"statusCode": 400, "body": json.dumps({"error": "Invalid JSON"})}
\`\`\`
`,
  },

  'mastery-cloud-deployment-cicd-with-python': {
    readTime: 7,
    whatYoullLearn: [
      'Set up GitHub Actions workflows for Python projects',
      'Run pytest in CI with coverage reporting',
      'Build and push Docker images in CI',
      'Deploy automatically on successful main branch builds',
      'Use matrix builds to test multiple Python versions',
    ],
    content: `
## GitHub Actions for Python

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test (Python [[ matrix.python-version ]])
    runs-on: ubuntu-latest

    strategy:
      matrix:
        python-version: ["3.11", "3.12", "3.13"]

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python [[ matrix.python-version ]]
        uses: actions/setup-python@v5
        with:
          python-version: [[ matrix.python-version ]]

      - name: Cache pip dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: [[ runner.os ]]-pip-[[ hashFiles('requirements*.txt') ]]

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Lint with ruff
        run: ruff check .

      - name: Type check with mypy
        run: mypy src/

      - name: Run tests with coverage
        run: |
          pytest tests/ -v \\
            --cov=src \\
            --cov-report=xml \\
            --cov-report=term-missing \\
            --cov-fail-under=80

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: coverage.xml
\`\`\`

## Docker Build and Push

\`\`\`yaml
  build-and-push:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    needs: test         # only if tests pass
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: [[ github.actor ]]
          password: [[ secrets.GITHUB_TOKEN ]]

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/[[ github.repository ]]
          tags: |
            type=sha,prefix=sha-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: [[ steps.meta.outputs.tags ]]
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

## Deployment Step

\`\`\`yaml
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build-and-push
    environment: production   # requires manual approval if configured

    steps:
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: [[ secrets.DEPLOY_HOST ]]
          username: [[ secrets.DEPLOY_USER ]]
          key: [[ secrets.DEPLOY_SSH_KEY ]]
          script: |
            docker pull ghcr.io/[[ github.repository ]]:latest
            docker-compose -f /app/docker-compose.prod.yml up -d --no-deps api
            docker system prune -f
\`\`\`

## Try It Yourself

\`\`\`yaml
# Write a complete CI/CD workflow for a FastAPI project that:
# 1. Triggers on push to main and PRs
# 2. Runs tests with pytest and requires 85% coverage
# 3. Lints with ruff
# 4. On main push: builds Docker image and deploys to fly.io

# fly.io deployment step:
# - name: Deploy to Fly.io
#   uses: superfly/flyctl-actions/setup-flyctl@master
# - run: flyctl deploy --remote-only
#   env:
#     FLY_API_TOKEN: [[ secrets.FLY_API_TOKEN ]]
\`\`\`
`,
  },


  // ─────────────────────────────────────────────
  // INTERMEDIATE (added separately)
  // ─────────────────────────────────────────────

  'intermediate-advanced-data-structures-list-set-dict-comprehensions': {
    readTime: 9,
    whatYoullLearn: [
      'Write list comprehensions to replace verbose for loops',
      'Use conditional comprehensions to filter and transform',
      'Build sets and dicts with comprehensions',
      'Understand generator expressions and their memory benefits',
      'Know when comprehensions hurt readability',
    ],
    content: `
## List Comprehensions

A list comprehension creates a new list by applying an expression to each item in an iterable — all in one line:

\`\`\`python
# Traditional loop
squares = []
for x in range(10):
    squares.append(x ** 2)

# Comprehension: [expression for item in iterable]
squares = [x ** 2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With filtering: [expression for item in iterable if condition]
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# Transform strings
words = ["hello", "world", "python"]
upper = [w.upper() for w in words]
lengths = [len(w) for w in words]
\`\`\`

## Dict and Set Comprehensions

\`\`\`python
# Dict comprehension: {key_expr: val_expr for item in iterable}
squares_dict = {x: x**2 for x in range(1, 6)}
print(squares_dict)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Invert a dict
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}

# Filter a dict
scores = {"Alice": 90, "Bob": 65, "Carol": 85, "Dave": 55}
passing = {name: s for name, s in scores.items() if s >= 70}

# Set comprehension: {expr for item in iterable}
unique_lengths = {len(w) for w in ["cat", "dog", "elephant", "rat"]}
print(unique_lengths)  # {3, 8} — only unique lengths
\`\`\`

## Generator Expressions

Use parentheses instead of brackets — produces a lazy iterator instead of a list:

\`\`\`python
# List comprehension — creates entire list in memory
total_list = sum([x**2 for x in range(1_000_000)])

# Generator expression — lazy, uses almost no memory
total_gen = sum(x**2 for x in range(1_000_000))

# Use when you only need to iterate once or pass to a function
any_negative = any(x < 0 for x in [1, 2, -3, 4])  # True
all_positive = all(x > 0 for x in [1, 2, 3])       # True
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Given a list of words, create a dict mapping each word to its length,
#    but only for words with length > 3.
words = ["cat", "elephant", "dog", "python", "ai"]

# 2. Flatten a 2D matrix using a list comprehension:
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [item for row in matrix for item in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\`
`,
  },

  'intermediate-advanced-data-structures-nested-data-structures': {
    readTime: 8,
    whatYoullLearn: [
      'Navigate deeply nested lists and dicts',
      'Build and transform complex nested structures',
      'Flatten nested data safely',
      'Process JSON-like data from APIs',
      'Use recursion for tree-shaped data',
    ],
    content: `
## Working with Nested Structures

Real-world data (API responses, config files) is often nested:

\`\`\`python
user = {
    "id": 42,
    "name": "Alice",
    "address": {
        "city": "New York",
        "coords": {"lat": 40.7128, "lng": -74.0060}
    },
    "roles": ["admin", "editor"],
}

# Deep access
print(user["address"]["city"])               # "New York"
print(user["address"]["coords"]["lat"])      # 40.7128

# Safe deep access — chain .get() to avoid KeyError
lat = user.get("address", {}).get("coords", {}).get("lat")
\`\`\`

## Flattening Nested Lists

\`\`\`python
# Shallow flatten (one level deep)
nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat = [item for sublist in nested for item in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Deep flatten (arbitrary nesting)
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

deep = [1, [2, [3, [4, [5]]]]]
print(flatten(deep))   # [1, 2, 3, 4, 5]
\`\`\`

## Try It Yourself

\`\`\`python
# Given this nested company structure, write a function
# that returns a flat list of all employee names:
company = {
    "departments": [
        {
            "name": "Engineering",
            "teams": [
                {"name": "Backend",  "members": ["Alice", "Bob"]},
                {"name": "Frontend", "members": ["Carol", "Dave"]},
            ]
        },
    ]
}

def all_employees(company):
    return [
        member
        for dept in company["departments"]
        for team in dept["teams"]
        for member in team["members"]
    ]
\`\`\`
`,
  },

  'intermediate-functions-advanced-recursion': {
    readTime: 10,
    whatYoullLearn: [
      'Understand recursive function structure: base case and recursive case',
      'Trace the call stack through recursive calls',
      'Implement common recursive algorithms',
      'Avoid stack overflow with memoization',
      'Convert recursion to iteration when needed',
    ],
    content: `
## What is Recursion?

A recursive function calls itself with a smaller version of the problem. Every recursive function needs a **base case** (stops recursion) and a **recursive case** (progress toward base case):

\`\`\`python
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120
\`\`\`

## Memoization for Performance

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))   # Instant — without cache would take years!
\`\`\`

## Recursion on Trees

\`\`\`python
file_tree = {
    "name": "root", "type": "dir",
    "children": [
        {"name": "docs", "type": "dir", "children": [
            {"name": "readme.txt", "type": "file", "size": 1024},
        ]},
        {"name": "config.json", "type": "file", "size": 512},
    ]
}

def total_size(node):
    if node["type"] == "file":
        return node["size"]
    return sum(total_size(child) for child in node.get("children", []))

print(total_size(file_tree))   # 1536
\`\`\`

## Try It Yourself

\`\`\`python
# Implement a recursive function that flattens a nested list to any depth:
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, [4]], 5], 6]))  # [1, 2, 3, 4, 5, 6]
\`\`\`
`,
  },

  'intermediate-functions-advanced-args-kwargs': {
    readTime: 7,
    whatYoullLearn: [
      'Accept any number of positional args with *args',
      'Accept any number of keyword args with **kwargs',
      'Unpack sequences and dicts when calling functions',
      'Combine *args, **kwargs with regular parameters',
      'Use these patterns to write flexible APIs',
    ],
    content: `
## *args — Collecting Positional Arguments

\`*args\` collects extra positional arguments into a tuple:

\`\`\`python
def multiply(*args):
    result = 1
    for n in args:
        result *= n
    return result

print(multiply(2, 3))         # 6
print(multiply(2, 3, 4, 5))  # 120
\`\`\`

## **kwargs — Collecting Keyword Arguments

\`**kwargs\` collects extra keyword arguments into a dict:

\`\`\`python
def html_tag(tag, content, **attrs):
    attr_str = " ".join(f'{k}="{v}"' for k, v in attrs.items())
    if attr_str:
        return f"<{tag} {attr_str}>{content}</{tag}>"
    return f"<{tag}>{content}</{tag}>"

print(html_tag("a", "Click me", href="https://example.com", target="_blank"))
\`\`\`

## Unpacking When Calling

\`\`\`python
def add(a, b, c):
    return a + b + c

numbers = [1, 2, 3]
print(add(*numbers))   # same as add(1, 2, 3)

params = {"a": 10, "b": 20, "c": 30}
print(add(**params))   # same as add(a=10, b=20, c=30)
\`\`\`

## Try It Yourself

\`\`\`python
# Write a function 'merge_configs(*configs, **overrides)' that:
# 1. Accepts any number of dicts as positional args
# 2. Merges them left to right (later values win)
# 3. Applies any keyword overrides last

def merge_configs(*configs, **overrides):
    result = {}
    for config in configs:
        result.update(config)
    result.update(overrides)
    return result

base = {"host": "localhost", "port": 8080}
prod = {"host": "prod.example.com", "port": 443}
print(merge_configs(base, prod, debug=True))
\`\`\`
`,
  },

  'intermediate-functions-advanced-lambda': {
    readTime: 6,
    whatYoullLearn: [
      'Write anonymous functions with lambda',
      'Use lambdas with sorted(), map(), filter()',
      'Understand the single-expression limitation',
      'Know when lambdas improve and hurt readability',
    ],
    content: `
## Lambda Syntax

A \`lambda\` is an anonymous function defined in a single expression:

\`\`\`python
square = lambda x: x ** 2
print(square(5))   # 25

add = lambda a, b: a + b
print(add(3, 4))   # 7
\`\`\`

## Lambdas with Built-in Functions

The most common use is as the \`key=\` argument:

\`\`\`python
# Sort by second element
pairs = [(1, 'b'), (3, 'a'), (2, 'c')]
print(sorted(pairs, key=lambda x: x[1]))
# [(3, 'a'), (1, 'b'), (2, 'c')]

# Sort objects by attribute
people = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
]
youngest = min(people, key=lambda p: p["age"])
print(youngest["name"])   # "Bob"
\`\`\`

## Try It Yourself

\`\`\`python
# Sort this list of version strings correctly:
versions = ["1.10.0", "1.2.0", "1.9.1", "2.0.0", "1.11.0"]
# Natural sort: use tuple of ints as key
sorted_v = sorted(versions, key=lambda v: tuple(int(x) for x in v.split('.')))
print(sorted_v)  # ['1.2.0', '1.9.1', '1.10.0', '1.11.0', '2.0.0']
\`\`\`
`,
  },

  'intermediate-functions-advanced-map-filter-reduce': {
    readTime: 7,
    whatYoullLearn: [
      'Transform sequences with map()',
      'Select elements with filter()',
      'Aggregate sequences with functools.reduce()',
      'Understand lazy evaluation in map and filter',
    ],
    content: `
## map() — Transform Every Element

\`\`\`python
# Convert strings to integers
str_nums = ["1", "2", "3", "4"]
ints = list(map(int, str_nums))   # [1, 2, 3, 4]

# map with lambda
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))  # [2, 4, 6, 8, 10]
\`\`\`

## filter() — Keep Matching Elements

\`\`\`python
numbers = range(-5, 6)
positives = list(filter(lambda x: x > 0, numbers))
# [1, 2, 3, 4, 5]

# filter(None, ...) removes falsy values
mixed = [0, 1, "", "hello", None, [1, 2], False]
truthy = list(filter(None, mixed))
# [1, 'hello', [1, 2]]
\`\`\`

## reduce() — Aggregate to a Single Value

\`\`\`python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
total = reduce(lambda acc, x: acc + x, numbers)   # 15
product = reduce(lambda acc, x: acc * x, numbers) # 120

# Merge dicts
dicts = [{"a": 1}, {"b": 2}, {"c": 3}]
merged = reduce(lambda acc, d: {**acc, **d}, dicts)
# {"a": 1, "b": 2, "c": 3}
\`\`\`

## Try It Yourself

\`\`\`python
from functools import reduce

# Use map, filter, and reduce to:
# 1. Start with numbers 1–20
# 2. Keep only numbers divisible by 3
# 3. Square each
# 4. Find the product of all results

nums = range(1, 21)
divisible_by_3 = filter(lambda x: x % 3 == 0, nums)
squared = map(lambda x: x**2, divisible_by_3)
result = reduce(lambda acc, x: acc * x, squared)
print(result)  # 9*36*81*144*225*324 = ...
\`\`\`
`,
  },

  'intermediate-string-manipulation-slicing-formatting-regex': {
    readTime: 10,
    whatYoullLearn: [
      'Use advanced string slicing with step',
      'Format numbers with precision and alignment',
      'Write basic regular expression patterns',
      'Use re.search(), re.findall(), re.sub()',
      'Extract groups from regex matches',
    ],
    content: `
## Advanced Slicing

\`\`\`python
s = "Hello, Python World!"
print(s[::-1])      # "!dlroW nohtyP ,olleH" — reverse
print(s[7:13])      # "Python"
print(s[::2])       # every 2nd character

def is_palindrome(s):
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

print(is_palindrome("racecar"))   # True
\`\`\`

## Regular Expressions

\`\`\`python
import re

text = "Contact us at support@example.com or sales@company.org"

# findall — return all matches
emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
print(emails)  # ['support@example.com', 'sales@company.org']

# search — find first match (returns Match object)
m = re.search(r'(\w+)@(\w+)\.', text)
if m:
    print(m.group(1))   # "support"
    print(m.group(2))   # "example"

# sub — replace
clean = re.sub(r'\s+', ' ', "too   many    spaces")
print(clean)    # "too many spaces"
\`\`\`

## Common Patterns

\`\`\`python
import re

# Validate phone number
phone = "555-867-5309"
valid = bool(re.match(r'^\d{3}-\d{3}-\d{4}$', phone))

# Extract all numbers from text
text = "I have 3 cats and 12 fish"
numbers = re.findall(r'\d+', text)
print(numbers)   # ['3', '12']

# Named groups
date = "Today is 2025-03-15"
m = re.search(r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})', date)
print(m.group('year'), m.group('month'), m.group('day'))
\`\`\`

## Try It Yourself

\`\`\`python
import re

# 1. Write a function that validates an email address using regex
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# 2. Extract all URLs from text
text = "Visit https://python.org and http://github.com for info."
urls = re.findall(r'https?://\S+', text)
print(urls)
\`\`\`
`,
  },

  'intermediate-file-handling-reading-writing-files': {
    readTime: 8,
    whatYoullLearn: [
      'Open files in read, write, and append modes',
      'Read entire files, line by line, or in chunks',
      'Write text and binary data',
      'Use context managers (with open()) for safe file handling',
      'Handle file encoding correctly',
    ],
    content: `
## Opening Files

Always use the \`with\` statement — it automatically closes the file:

\`\`\`python
# Modes: 'r' read, 'w' write, 'a' append, 'b' binary
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()    # read entire file

with open("data.txt", "w", encoding="utf-8") as f:
    f.write("Hello, File!\n")
\`\`\`

## Reading Files

\`\`\`python
# Read line by line (memory-efficient)
with open("large_data.csv") as f:
    for line in f:
        process(line.rstrip('\n'))

# Read all lines
with open("poem.txt") as f:
    lines = f.read().splitlines()   # strips newlines
\`\`\`

## CSV and JSON

\`\`\`python
import csv, json

# Read CSV
with open("students.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])

# Read/Write JSON
with open("config.json") as f:
    config = json.load(f)

with open("data.json", "w") as f:
    json.dump({"key": "value"}, f, indent=2)
\`\`\`

## Try It Yourself

\`\`\`python
import string

def word_count(filename):
    counts = {}
    try:
        with open(filename, encoding="utf-8") as f:
            for line in f:
                words = line.lower().translate(
                    str.maketrans("", "", string.punctuation)
                ).split()
                for word in words:
                    counts[word] = counts.get(word, 0) + 1
    except FileNotFoundError:
        print(f"File not found: {filename}")
    return counts
\`\`\`
`,
  },

  'intermediate-file-handling-with-open-os-pathlib': {
    readTime: 8,
    whatYoullLearn: [
      'Use pathlib.Path for modern file system operations',
      'Navigate directories with / operator on Path objects',
      'List, create, move, and delete files and directories',
      'Use glob patterns to find files',
    ],
    content: `
## pathlib.Path

\`pathlib\` provides an object-oriented interface to file paths:

\`\`\`python
from pathlib import Path

# Create paths with / operator
p = Path.home() / "documents" / "report.pdf"
print(p.name)        # "report.pdf"
print(p.stem)        # "report"
print(p.suffix)      # ".pdf"
print(p.parent)      # home/documents

# Read/write text
p = Path("data.txt")
p.write_text("Hello, pathlib!", encoding="utf-8")
content = p.read_text(encoding="utf-8")
\`\`\`

## File System Operations

\`\`\`python
from pathlib import Path

# Create directories
Path("output/reports/2025").mkdir(parents=True, exist_ok=True)

# List and glob
project = Path(".")
python_files = list(project.rglob("*.py"))  # recursive glob

# Delete
Path("temp.txt").unlink(missing_ok=True)

import shutil
shutil.rmtree("build")   # delete directory tree
\`\`\`

## Try It Yourself

\`\`\`python
from pathlib import Path

def catalog_txt_files(directory):
    """Return dict mapping filename -> size for all .txt files."""
    p = Path(directory)
    if not p.is_dir():
        return {}
    return {f.name: f.stat().st_size for f in p.rglob("*.txt")}
\`\`\`
`,
  },

  'intermediate-modules-packages-importing-custom-modules': {
    readTime: 7,
    whatYoullLearn: [
      'Import standard library and third-party modules',
      'Create your own modules and packages',
      'Use __name__ == "__main__" correctly',
      'Understand the module search path',
    ],
    content: `
## Importing Modules

\`\`\`python
import math                         # module namespace
from math import sqrt, pi, ceil     # specific names
import numpy as np                  # alias (convention)
from pathlib import Path             # from package
\`\`\`

## Creating a Module

Any .py file is a module:

\`\`\`python
# utils.py
def clamp(value, min_val, max_val):
    return max(min_val, min(max_val, value))

def chunks(lst, size):
    for i in range(0, len(lst), size):
        yield lst[i:i + size]

if __name__ == "__main__":   # only runs when executed directly
    print(clamp(15, 0, 10))   # 10
\`\`\`

## Creating a Package

A package is a directory with \`__init__.py\`:

\`\`\`
myapp/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── user.py
└── utils/
    └── helpers.py
\`\`\`

\`\`\`python
from myapp.models.user import User
from myapp.utils.helpers import clamp
\`\`\`

## Try It Yourself

\`\`\`python
# Create a module 'geometry.py' with:
# - area_circle(r) → π r²
# - area_rectangle(w, h) → w * h
# - area_triangle(base, height) → 0.5 * base * height
# Include __name__ == "__main__" test cases.
import math

def area_circle(r): return math.pi * r**2
def area_rectangle(w, h): return w * h
def area_triangle(b, h): return 0.5 * b * h

if __name__ == "__main__":
    print(area_circle(5))         # 78.54
    print(area_rectangle(4, 6))   # 24
    print(area_triangle(3, 8))    # 12.0
\`\`\`
`,
  },

  'intermediate-modules-packages-venv-pip': {
    readTime: 7,
    whatYoullLearn: [
      'Create isolated virtual environments with venv',
      'Activate and deactivate virtual environments',
      'Install and manage packages with pip',
      'Freeze dependencies to requirements.txt',
    ],
    content: `
## Why Virtual Environments?

Without virtual environments, all packages install globally — different projects with conflicting dependencies break each other.

## Creating and Using venv

\`\`\`bash
# Create a virtual environment
python3 -m venv venv

# Activate:
source venv/bin/activate        # macOS/Linux
venv\\Scripts\\activate.bat      # Windows

# Your prompt changes: (venv) $
# Install packages
pip install requests flask

# Deactivate when done
deactivate
\`\`\`

## pip Usage

\`\`\`bash
pip install requests            # latest
pip install requests==2.31.0    # specific version
pip install --upgrade requests  # upgrade
pip uninstall requests
pip list                        # installed packages
pip show requests               # package details
\`\`\`

## requirements.txt

\`\`\`bash
# Freeze current environment
pip freeze > requirements.txt

# Install on another machine
pip install -r requirements.txt
\`\`\`

## Try It Yourself

\`\`\`bash
# 1. Create a new project directory and virtual environment
mkdir my_project && cd my_project
python3 -m venv venv
source venv/bin/activate

# 2. Install requests
pip install requests

# 3. Write a script that fetches a JSON API
# 4. Freeze to requirements.txt
pip freeze > requirements.txt

# 5. Add venv/ to .gitignore
echo "venv/" >> .gitignore
\`\`\`
`,
  },

  'intermediate-exception-handling-advanced-try-except-else-finally': {
    readTime: 8,
    whatYoullLearn: [
      'Use else for code that runs on success',
      'Use finally for guaranteed cleanup',
      'Chain exceptions with raise from',
      'Re-raise exceptions after logging',
      'Understand exception hierarchy',
    ],
    content: `
## The Complete try-except-else-finally

\`\`\`python
try:
    result = risky_operation()
except SpecificError as e:
    handle_error(e)
else:
    # Only runs if NO exception occurred in try
    use_result(result)
finally:
    # ALWAYS runs — exception or not, return or not
    cleanup()
\`\`\`

## finally — Guaranteed Cleanup

\`\`\`python
import threading
lock = threading.Lock()

def safe_operation():
    lock.acquire()
    try:
        return process()
    except Exception as e:
        log_error(e)
        raise
    finally:
        lock.release()   # ALWAYS released
\`\`\`

## Exception Chaining

\`\`\`python
class DatabaseError(Exception):
    pass

def get_user(user_id):
    try:
        return db.query(user_id)
    except ConnectionError as e:
        # Translate low-level error to domain-specific
        raise DatabaseError(f"Failed to fetch user {user_id}") from e
\`\`\`

## Try It Yourself

\`\`\`python
def file_to_int(path):
    """Read a file and return its content as integer."""
    try:
        f = open(path)
    except FileNotFoundError:
        print(f"File not found: {path}")
        return None
    else:
        try:
            value = int(f.read().strip())
            return value
        except ValueError:
            print("File doesn't contain a valid integer")
            return None
    finally:
        print("Done processing file")
\`\`\`
`,
  },

  'intermediate-exception-handling-advanced-custom-exceptions': {
    readTime: 7,
    whatYoullLearn: [
      'Create custom exception classes by subclassing Exception',
      'Add useful attributes and messages',
      'Design exception hierarchies for your domain',
      'Know when custom exceptions are worth creating',
    ],
    content: `
## Why Custom Exceptions?

Custom exceptions make your code's error conditions explicit and allow callers to handle them specifically:

\`\`\`python
class BankError(Exception):
    pass

class NegativeAmountError(BankError):
    pass

class InsufficientFundsError(BankError):
    def __init__(self, requested, available):
        self.requested = requested
        self.available = available
        super().__init__(
            f"Cannot withdraw {requested:.2f}: only {available:.2f} available"
        )

def withdraw(balance, amount):
    if amount < 0:
        raise NegativeAmountError(f"Amount must be positive, got {amount}")
    if amount > balance:
        raise InsufficientFundsError(requested=amount, available=balance)
    return balance - amount
\`\`\`

## Exception Hierarchies

\`\`\`python
# Users can catch at any level:
try:
    withdraw(100, 200)
except InsufficientFundsError as e:
    print(f"Specific error: {e.requested} > {e.available}")
except BankError:
    print("Some other bank error")
\`\`\`

## Try It Yourself

\`\`\`python
# Design a custom exception hierarchy for a task manager:
# - TaskError (base)
#   - TaskNotFoundError (has task_id attribute)
#   - TaskAlreadyCompleteError (has task_id and completed_at)
#   - InvalidPriorityError (has value and valid_values)

class TaskError(Exception):
    pass

class TaskNotFoundError(TaskError):
    def __init__(self, task_id):
        self.task_id = task_id
        super().__init__(f"Task {task_id} not found")
\`\`\`
`,
  },

  'intermediate-oop-inheritance-polymorphism': {
    readTime: 9,
    whatYoullLearn: [
      'Extend classes with single and multiple inheritance',
      'Override methods and use super() correctly',
      'Understand polymorphism and duck typing',
      'Use isinstance() and issubclass()',
    ],
    content: `
## Single Inheritance

\`\`\`python
import math

class Shape:
    def __init__(self, color="black"):
        self.color = color

    def area(self):
        raise NotImplementedError

    def describe(self):
        return f"A {self.color} {type(self).__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, radius, color="black"):
        super().__init__(color)
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width, height, color="black"):
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height
\`\`\`

## Polymorphism

\`\`\`python
shapes = [Circle(3), Rectangle(4, 5), Circle(7)]

# Each shape uses its own area() implementation
total = sum(shape.area() for shape in shapes)
shapes.sort(key=lambda s: s.area())

# Duck typing — any object with area() works:
class Square:
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2

shapes.append(Square(4))  # works without inheriting Shape!
\`\`\`

## Try It Yourself

\`\`\`python
# Create a class hierarchy for a simple game:
# - Entity: has name, hp, is_alive property (hp > 0)
# - Character(Entity): has level, attack()
# - Player(Character): has inventory list
# - Enemy(Character): has reward_xp

class Entity:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    @property
    def is_alive(self):
        return self.hp > 0
\`\`\`
`,
  },

  'intermediate-oop-encapsulation-dunder-methods': {
    readTime: 9,
    whatYoullLearn: [
      'Use _ and __ naming conventions for encapsulation',
      'Implement __str__ and __repr__',
      'Use __len__, __contains__, and __iter__',
      'Enable comparisons with __eq__ and @total_ordering',
      'Implement __call__ to make objects callable',
    ],
    content: `
## __str__ and __repr__

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    def __repr__(self):
        return f"Temperature({self._celsius!r})"

    def __str__(self):
        return f"{self._celsius:.1f}°C ({self._celsius * 9/5 + 32:.1f}°F)"

t = Temperature(100)
print(t)         # 100.0°C (212.0°F)  — uses __str__
print(repr(t))   # Temperature(100)    — uses __repr__
\`\`\`

## Container Methods

\`\`\`python
class Playlist:
    def __init__(self, name):
        self.name = name
        self._songs = []

    def add(self, song): self._songs.append(song)
    def __len__(self): return len(self._songs)
    def __contains__(self, song): return song in self._songs
    def __iter__(self): return iter(self._songs)
    def __getitem__(self, idx): return self._songs[idx]
    def __repr__(self): return f"Playlist({self.name!r}, {len(self)} songs)"
\`\`\`

## Comparison Methods

\`\`\`python
from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, name, gpa):
        self.name = name
        self.gpa = gpa

    def __eq__(self, other):
        return self.gpa == other.gpa if isinstance(other, Student) else NotImplemented

    def __lt__(self, other):
        return self.gpa < other.gpa if isinstance(other, Student) else NotImplemented

students = [Student("Bob", 3.5), Student("Alice", 3.8)]
print(sorted(students))   # sorted by GPA
\`\`\`
`,
  },

  'intermediate-iterators-generators-iter-next': {
    readTime: 8,
    whatYoullLearn: [
      'Understand the iterable vs iterator distinction',
      'Implement __iter__ and __next__ for custom iterators',
      'Use the StopIteration exception',
      'Build infinite iterators',
    ],
    content: `
## Iterables vs Iterators

An **iterable** is any object you can loop over. An **iterator** remembers position and returns the next item via \`__next__\`:

\`\`\`python
my_list = [1, 2, 3]
iterator = iter(my_list)   # get iterator

print(next(iterator))   # 1
print(next(iterator))   # 2
print(next(iterator))   # 3
next(iterator)          # StopIteration
\`\`\`

## Custom Iterator

\`\`\`python
class CountUp:
    def __init__(self, start, stop, step=1):
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.stop:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value

for n in CountUp(1, 5):
    print(n, end=" ")   # 1 2 3 4 5
\`\`\`

## Infinite Iterator

\`\`\`python
from itertools import islice

class Fibonacci:
    def __init__(self):
        self.a, self.b = 0, 1

    def __iter__(self): return self

    def __next__(self):
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        return value

first_10 = list(islice(Fibonacci(), 10))
print(first_10)   # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`
`,
  },

  'intermediate-iterators-generators-yield-generator-functions': {
    readTime: 9,
    whatYoullLearn: [
      'Write generator functions with yield',
      'Understand lazy evaluation and memory efficiency',
      'Build generator pipelines',
      'Use yield from for delegation',
    ],
    content: `
## Generator Functions

A generator function uses \`yield\` — it produces values lazily, one at a time:

\`\`\`python
def countdown(n):
    while n > 0:
        yield n        # suspend here, return value
        n -= 1

for n in countdown(5):
    print(n, end=" ")   # 5 4 3 2 1
\`\`\`

## Memory Efficiency

\`\`\`python
import sys

million_list = [x**2 for x in range(1_000_000)]   # ~8MB
million_gen = (x**2 for x in range(1_000_000))    # ~120 bytes!

print(sys.getsizeof(million_list))   # large
print(sys.getsizeof(million_gen))    # tiny
\`\`\`

## Generator Pipelines

\`\`\`python
def read_lines(filename):
    with open(filename) as f:
        yield from f

def grep(lines, pattern):
    import re
    for line in lines:
        if re.search(pattern, line):
            yield line

def head(lines, n):
    for i, line in enumerate(lines):
        if i >= n: break
        yield line

# Pipeline: nothing loaded into memory
pipeline = head(grep(read_lines("log.txt"), r"ERROR"), 10)
for line in pipeline:
    print(line)
\`\`\`

## Try It Yourself

\`\`\`python
# Generator that produces prime numbers infinitely:
def primes():
    found = []
    candidate = 2
    while True:
        if all(candidate % p != 0 for p in found):
            yield candidate
            found.append(candidate)
        candidate += 1

from itertools import islice
print(list(islice(primes(), 10)))  # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
\`\`\`
`,
  },

  'intermediate-standard-modules-math-random': {
    readTime: 6,
    whatYoullLearn: [
      'Use math module for numeric operations',
      'Generate random numbers with the random module',
      'Create reproducible results with seeds',
      'Choose random elements and shuffle sequences',
    ],
    content: `
## The math Module

\`\`\`python
import math

print(math.pi, math.e, math.inf)
print(math.sqrt(144))      # 12.0
print(math.floor(3.7))     # 3
print(math.ceil(3.2))      # 4
print(math.log(1000, 10))  # 3.0
print(math.factorial(10))  # 3628800
print(math.gcd(48, 36))    # 12
print(math.isclose(0.1 + 0.2, 0.3))   # True
\`\`\`

## The random Module

\`\`\`python
import random

print(random.random())          # [0.0, 1.0)
print(random.uniform(1, 10))    # [1.0, 10.0]
print(random.randint(1, 6))     # [1, 6] dice roll

items = ["red", "green", "blue"]
print(random.choice(items))     # one random element
print(random.sample(items, 2))  # 2 without replacement
random.shuffle(items)

# Seed for reproducibility
random.seed(42)
print(random.randint(1, 100))   # always same value
\`\`\`

## Secure Randomness

\`\`\`python
import secrets

# For tokens, passwords — not random.random()!
print(secrets.token_hex(32))     # 64-char hex
print(secrets.token_urlsafe(32)) # URL-safe token
print(secrets.randbelow(100))    # cryptographically secure [0, 100)
\`\`\`
`,
  },

  'intermediate-standard-modules-datetime': {
    readTime: 7,
    whatYoullLearn: [
      'Create date, time, and datetime objects',
      'Format dates with strftime() and parse with strptime()',
      'Calculate time differences with timedelta',
    ],
    content: `
## Core Classes

\`\`\`python
from datetime import date, time, datetime, timedelta

today = date.today()           # 2025-03-04
birthday = date(1990, 6, 15)

now = datetime.now()
event = datetime(2025, 12, 31, 23, 59, 59)
print(now.isoformat())        # "2025-03-04T14:30:45.123456"
\`\`\`

## Formatting and Parsing

\`\`\`python
from datetime import datetime

now = datetime.now()
print(now.strftime("%Y-%m-%d"))           # "2025-03-04"
print(now.strftime("%d/%m/%Y %H:%M"))     # "04/03/2025 14:30"
print(now.strftime("%A, %B %d, %Y"))      # "Tuesday, March 04, 2025"

# Parse string to datetime
parsed = datetime.strptime("2025-06-15 14:30", "%Y-%m-%d %H:%M")
\`\`\`

## timedelta — Date Arithmetic

\`\`\`python
from datetime import datetime, timedelta

now = datetime.now()
tomorrow = now + timedelta(days=1)
last_week = now - timedelta(weeks=1)

birthday = datetime(1990, 6, 15)
age_delta = now - birthday
print(f"Days lived: {age_delta.days}")
print(f"Years (approx): {age_delta.days // 365}")
\`\`\`

## Try It Yourself

\`\`\`python
from datetime import date, timedelta

# Calculate how many days until New Year's Day 2026
today = date.today()
new_year = date(2026, 1, 1)
days_left = (new_year - today).days
print(f"Days until New Year: {days_left}")
\`\`\`
`,
  },

  'intermediate-standard-modules-collections': {
    readTime: 8,
    whatYoullLearn: [
      'Count elements efficiently with Counter',
      'Use defaultdict to avoid KeyError',
      'Use deque for fast queue operations',
      'Create readable structured data with namedtuple',
    ],
    content: `
## Counter — Count Anything

\`\`\`python
from collections import Counter

text = "the quick brown fox jumps over the lazy dog the"
word_count = Counter(text.split())
print(word_count.most_common(3))   # [('the', 3), ...]
print(word_count["the"])           # 3
print(word_count["missing"])       # 0 — not KeyError!
\`\`\`

## defaultdict — Never Get KeyError

\`\`\`python
from collections import defaultdict

# Group items by first letter
words = ["apple", "ant", "banana", "bear", "cherry"]
groups = defaultdict(list)
for word in words:
    groups[word[0]].append(word)

print(dict(groups))
# {'a': ['apple', 'ant'], 'b': ['banana', 'bear'], 'c': ['cherry']}
\`\`\`

## deque — Fast Double-Ended Queue

\`\`\`python
from collections import deque

d = deque([1, 2, 3, 4, 5])
d.append(6)       # add right
d.appendleft(0)   # add left — O(1)!
d.popleft()       # remove left — O(1)!

# Fixed-size history
history = deque(maxlen=5)
for cmd in ["ls", "cd", "mkdir", "touch", "python", "pytest"]:
    history.append(cmd)
print(list(history))  # last 5 commands
\`\`\`

## Try It Yourself

\`\`\`python
from collections import Counter, defaultdict

# 1. Count word frequency, excluding words < 4 chars:
text = "to be or not to be that is the question"
counts = Counter(w for w in text.split() if len(w) >= 4)
print(counts.most_common(3))

# 2. Build graph as adjacency list:
edges = [("A","B"), ("A","C"), ("B","D"), ("C","D")]
graph = defaultdict(list)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)
print(dict(graph))
\`\`\`
`,
  },

  // ─── Advanced, Expert modules ───────────────────────────────────

  'advanced-advanced-modules-itertools': {
    readTime: 8,
    whatYoullLearn: [
      'Use count(), cycle(), repeat() for infinite iterators',
      'Chain, zip, and slice iterables with chain(), zip_longest(), islice()',
      'Generate combinations and permutations',
      'Filter and group data with filterfalse() and groupby()',
      'Build efficient data pipelines with itertools',
    ],
    content: `
## itertools — Powerful Iterator Building Blocks

The \`itertools\` module provides functions for creating and working with iterators efficiently:

\`\`\`python
import itertools

# Infinite iterators
counter = itertools.count(10, 2)         # 10, 12, 14, 16, ...
cycler = itertools.cycle(['A', 'B', 'C'])   # A, B, C, A, B, C, ...
repeater = itertools.repeat('x', 3)      # 'x', 'x', 'x'

# Take first 5 from infinite:
from itertools import islice
print(list(islice(counter, 5)))   # [10, 12, 14, 16, 18]

# Chaining iterables
a = [1, 2, 3]
b = [4, 5, 6]
c = [7, 8, 9]
print(list(itertools.chain(a, b, c)))   # [1..9]
print(list(itertools.chain.from_iterable([a, b, c])))  # same

# zip with unequal lengths
for x, y in itertools.zip_longest([1,2,3], [10,20], fillvalue=0):
    print(x, y)
# 1 10 / 2 20 / 3 0
\`\`\`

## Combinations and Permutations

\`\`\`python
import itertools

items = ['A', 'B', 'C', 'D']

# permutations — ordered, no repeat
perms = list(itertools.permutations(items, 2))
print(perms)   # [('A','B'), ('A','C'), ...] — 12 items

# combinations — unordered, no repeat
combs = list(itertools.combinations(items, 2))
print(combs)   # [('A','B'), ('A','C'), ...] — 6 items

# combinations_with_replacement — unordered, repeats allowed
combs_r = list(itertools.combinations_with_replacement(items, 2))
# 10 items: ('A','A'), ('A','B'), ...

# product — Cartesian product (nested loops)
for suit, rank in itertools.product(['♠','♥'], ['A','K','Q']):
    print(f"{rank}{suit}", end=" ")
# A♠ K♠ Q♠ A♥ K♥ Q♥
\`\`\`

## groupby and filterfalse

\`\`\`python
import itertools

# groupby — group consecutive elements by key
data = [
    ('Alice', 'Engineering'),
    ('Bob', 'Engineering'),
    ('Carol', 'Marketing'),
    ('Dave', 'Marketing'),
    ('Eve', 'Engineering'),  # Note: must sort first for groupby!
]
data.sort(key=lambda x: x[1])

for dept, members in itertools.groupby(data, key=lambda x: x[1]):
    print(f"{dept}: {[m[0] for m in members]}")

# filterfalse — keep elements where function returns False
evens = list(itertools.filterfalse(lambda x: x % 2 == 0, range(10)))
# Wait — filterfalse keeps where predicate is FALSE:
odds = list(itertools.filterfalse(lambda x: x % 2 == 0, range(10)))
print(odds)   # [1, 3, 5, 7, 9]

# accumulate — running totals
from itertools import accumulate
import operator
prices = [100, 200, 300, 400]
running_total = list(accumulate(prices))
print(running_total)   # [100, 300, 600, 1000]
\`\`\`

## Try It Yourself

\`\`\`python
import itertools

# 1. Generate all 52 playing cards using product():
suits = ['♠', '♥', '♦', '♣']
ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
deck = list(itertools.product(ranks, suits))
print(f"Deck has {len(deck)} cards")  # 52

# 2. Use groupby to count students per grade:
students = [('Alice','A'), ('Bob','B'), ('Carol','A'), ('Dave','C'), ('Eve','B')]
students.sort(key=lambda x: x[1])  # must sort first!
for grade, group in itertools.groupby(students, key=lambda x: x[1]):
    print(f"Grade {grade}: {list(group)}")
\`\`\`
`,
  },

  'advanced-advanced-modules-functools': {
    readTime: 7,
    whatYoullLearn: [
      'Cache expensive functions with lru_cache and cache',
      'Apply partial application with partial()',
      'Reduce sequences with reduce()',
      'Use total_ordering to generate comparison methods',
      'Write method-like decorators with wraps()',
    ],
    content: `
## functools — Higher-Order Function Tools

\`\`\`python
from functools import lru_cache, cache, partial, reduce, wraps, total_ordering

# lru_cache — memoize function results (Least Recently Used)
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2: return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(50))              # instant!
print(fibonacci.cache_info())     # CacheInfo(hits=97, misses=51, ...)
fibonacci.cache_clear()           # clear the cache

# @cache is @lru_cache(maxsize=None) — unlimited cache
@cache
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)
\`\`\`

## partial — Partial Application

\`\`\`python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))    # 25
print(cube(3))      # 27

# Pre-configure print with a prefix
import os
join_logs = partial(os.path.join, "/var/log/myapp")
print(join_logs("errors.log"))    # /var/log/myapp/errors.log
\`\`\`

## wraps — Preserving Metadata in Decorators

\`\`\`python
from functools import wraps
import time

def timer(func):
    @wraps(func)   # preserves func's __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    """Sum numbers from 0 to n."""
    return sum(range(n))

print(slow_sum.__name__)   # "slow_sum" (not "wrapper")
print(slow_sum.__doc__)    # "Sum numbers from 0 to n."
\`\`\`

## Try It Yourself

\`\`\`python
from functools import wraps, lru_cache, partial

# 1. Write a retry decorator that retries a function up to N times:
def retry(max_attempts=3, exceptions=(Exception,)):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt+1} failed: {e}, retrying...")
        return wrapper
    return decorator

# 2. Use @lru_cache on a function that computes nth power of 2:
@lru_cache
def power_of_2(n): return 2**n
\`\`\`
`,
  },

  'advanced-memory-management-garbage-collection': {
    readTime: 7,
    whatYoullLearn: [
      'Understand Python\'s reference counting garbage collector',
      'Use the gc module to manage collection',
      'Detect and break reference cycles',
      'Use weakref for cache-friendly references',
      'Profile memory usage with tracemalloc',
    ],
    content: `
## Reference Counting

Python's primary memory management is **reference counting** — each object tracks how many references point to it. When the count hits 0, the memory is freed immediately:

\`\`\`python
import sys

x = [1, 2, 3]
print(sys.getrefcount(x))   # 2 (variable + function arg)

y = x
print(sys.getrefcount(x))   # 3 (x, y, function arg)

del y
print(sys.getrefcount(x))   # 2 (x, function arg)

# Object is freed immediately when count reaches 0
x = None   # list [1,2,3] refcount → 0 → freed
\`\`\`

## Cyclic Garbage Collection

Reference counting can't handle cycles — the \`gc\` module handles those:

\`\`\`python
import gc

class Node:
    def __init__(self, name):
        self.name = name
        self.next = None

# Create a cycle: a → b → a
a = Node("a")
b = Node("b")
a.next = b
b.next = a    # cycle!

# Even with del a; del b, the cycle prevents immediate cleanup
# Python's gc module periodically finds and collects these

gc.collect()          # force a collection cycle
print(gc.get_count()) # (gen0, gen1, gen2) object counts
\`\`\`

## weakref — Weak References

Weak references don't increment the reference count — perfect for caches:

\`\`\`python
import weakref

class ExpensiveObject:
    def compute(self):
        return "result"

# Strong reference — keeps object alive
obj = ExpensiveObject()
strong_ref = obj

# Weak reference — doesn't keep object alive
weak = weakref.ref(obj)
print(weak())    # <ExpensiveObject ...>

del obj
del strong_ref   # refcount → 0 → object freed
print(weak())    # None — object was garbage collected

# WeakValueDictionary — auto-removes entries when objects are GC'd
cache = weakref.WeakValueDictionary()
\`\`\`

## Try It Yourself

\`\`\`python
import tracemalloc

# Profile memory usage:
tracemalloc.start()

# Code to profile
data = [list(range(1000)) for _ in range(1000)]

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')

for stat in top_stats[:3]:
    print(stat)

tracemalloc.stop()
\`\`\`
`,
  },

  'advanced-memory-management-shallow-vs-deep-copy': {
    readTime: 6,
    whatYoullLearn: [
      'Distinguish between assignment, shallow copy, and deep copy',
      'Use copy.copy() and copy.deepcopy() correctly',
      'Understand when each type of copy is needed',
      'Implement __copy__ and __deepcopy__ in custom classes',
    ],
    content: `
## The Three Levels of Copying

\`\`\`python
import copy

original = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Assignment — just another reference to the same object
assigned = original
assigned[0][0] = 99
print(original[0][0])   # 99 — same object!

# Reset
original = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Shallow copy — new outer list, but inner lists are SHARED
shallow = copy.copy(original)   # or original.copy() or original[:]
shallow[0][0] = 99
print(original[0][0])   # 99 — inner lists are still shared!

shallow.append([10, 11])
print(len(original))    # 3 — outer list is independent

# Reset
original = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Deep copy — completely independent at all levels
deep = copy.deepcopy(original)
deep[0][0] = 99
print(original[0][0])   # 1 — completely independent
\`\`\`

## When to Use Each

\`\`\`python
# Assignment: when you WANT to share the same object
a = [1, 2, 3]
b = a   # intentional sharing — mutations affect both

# Shallow copy: when the top-level container should be independent,
# but nested objects can be shared
config_base = {"host": "localhost", "features": ["auth", "logging"]}
config_dev = config_base.copy()
config_dev["host"] = "dev.example.com"   # safe — new string
config_dev["features"].append("debug")   # MUTATES SHARED list!

# Deep copy: when you need complete independence
import copy
config_prod = copy.deepcopy(config_base)
config_prod["features"].append("monitoring")  # safe — independent list
print(config_base["features"])  # unchanged
\`\`\`

## Custom __copy__ and __deepcopy__

\`\`\`python
import copy

class Config:
    def __init__(self, settings):
        self.settings = settings
        self._cache = {}   # don't copy the cache

    def __copy__(self):
        # Shallow copy: share settings, but fresh cache
        new = Config(self.settings)  # shares same settings dict
        return new

    def __deepcopy__(self, memo):
        # Deep copy: independent settings, fresh cache
        new = Config(copy.deepcopy(self.settings, memo))
        return new
\`\`\`

## Try It Yourself

\`\`\`python
import copy

# What does each print? Figure out before running:
a = {"x": [1, 2, 3]}
b = a.copy()
b["x"].append(4)
print(a["x"])   # ?

c = copy.deepcopy(a)
c["x"].append(5)
print(a["x"])   # ?
\`\`\`
`,
  },

  'expert-advanced-async-event-loop-tasks-futures': {
    readTime: 8,
    whatYoullLearn: [
      'Understand the asyncio event loop architecture',
      'Create and manage Task objects',
      'Use asyncio.wait() and asyncio.as_completed()',
      'Set timeouts with asyncio.wait_for()',
      'Cancel running tasks',
    ],
    content: `
## The Event Loop

asyncio uses a single-threaded **event loop** — it switches between coroutines when one is waiting for I/O:

\`\`\`python
import asyncio

async def main():
    loop = asyncio.get_event_loop()
    print(f"Running loop: {loop}")

    # Create tasks (scheduled for execution)
    task1 = asyncio.create_task(fetch("url1"))
    task2 = asyncio.create_task(fetch("url2"))

    # Wait for both
    result1 = await task1
    result2 = await task2

asyncio.run(main())
\`\`\`

## Tasks and Futures

\`\`\`python
import asyncio

async def work(n, delay):
    await asyncio.sleep(delay)
    return n * n

async def main():
    # asyncio.gather — wait for all, return in order
    results = await asyncio.gather(
        work(2, 1.0),
        work(3, 0.5),
        work(4, 1.5),
    )
    print(results)   # [4, 9, 16]

    # asyncio.wait — more control over completion
    tasks = [asyncio.create_task(work(i, 0.5)) for i in range(5)]
    done, pending = await asyncio.wait(tasks, timeout=0.7)
    print(f"Done: {len(done)}, Pending: {len(pending)}")

    # Cancel pending tasks
    for task in pending:
        task.cancel()

asyncio.run(main())
\`\`\`

## Timeouts

\`\`\`python
import asyncio

async def slow_operation():
    await asyncio.sleep(10)
    return "done"

async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
    except asyncio.TimeoutError:
        print("Operation timed out!")

asyncio.run(main())
\`\`\`

## as_completed — Process as They Finish

\`\`\`python
import asyncio, random

async def slow_task(task_id):
    delay = random.uniform(0.5, 2.0)
    await asyncio.sleep(delay)
    return f"Task {task_id} done in {delay:.2f}s"

async def main():
    tasks = [asyncio.create_task(slow_task(i)) for i in range(5)]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(result)   # printed as each completes

asyncio.run(main())
\`\`\`
`,
  },

  'expert-advanced-async-aiohttp-async-db': {
    readTime: 8,
    whatYoullLearn: [
      'Make async HTTP requests with aiohttp',
      'Use asyncpg for async PostgreSQL queries',
      'Manage connection pools in async code',
      'Handle async context managers',
      'Implement efficient async data fetching pipelines',
    ],
    content: `
## aiohttp — Async HTTP Requests

\`\`\`python
import asyncio
import aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        response.raise_for_status()
        return await response.json()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        return await asyncio.gather(*tasks)

urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
    "https://jsonplaceholder.typicode.com/posts/3",
]

results = asyncio.run(fetch_all(urls))
for r in results:
    print(r["title"])
\`\`\`

## asyncpg — Async PostgreSQL

\`\`\`python
import asyncio
import asyncpg

async def get_users():
    # Connection pool for efficient reuse
    pool = await asyncpg.create_pool(
        "postgresql://user:pass@localhost/mydb",
        min_size=5,
        max_size=20,
    )

    async with pool.acquire() as conn:
        # Parameterized query (safe from SQL injection)
        users = await conn.fetch(
            "SELECT id, name, email FROM users WHERE active = $1",
            True
        )
        for user in users:
            print(dict(user))

    await pool.close()

asyncio.run(get_users())
\`\`\`

## Try It Yourself

\`\`\`python
import asyncio
import aiohttp

async def download_urls(urls, concurrency=5):
    """Download URLs concurrently, limiting to N simultaneous requests."""
    semaphore = asyncio.Semaphore(concurrency)

    async def bounded_fetch(session, url):
        async with semaphore:
            async with session.get(url) as resp:
                return url, resp.status, len(await resp.read())

    async with aiohttp.ClientSession() as session:
        tasks = [bounded_fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    return results

# Use it:
urls = [f"https://httpbin.org/get?n={i}" for i in range(10)]
results = asyncio.run(download_urls(urls, concurrency=3))
for url, status, size in results:
    print(f"{url}: {status}, {size} bytes")
\`\`\`
`,
  },

  'expert-networking-socket-programming': {
    readTime: 8,
    whatYoullLearn: [
      'Create TCP client and server sockets',
      'Handle multiple clients with threads or select()',
      'Build a simple echo server',
      'Use UDP sockets for lightweight communication',
      'Handle socket errors and timeouts',
    ],
    content: `
## TCP Client and Server

\`\`\`python
# server.py
import socket

def run_server(host='127.0.0.1', port=9000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((host, port))
        server.listen(5)
        print(f"Server listening on {host}:{port}")

        while True:
            conn, addr = server.accept()
            print(f"Connection from {addr}")
            with conn:
                data = conn.recv(1024)
                if data:
                    print(f"Received: {data.decode()}")
                    conn.sendall(data.upper())  # echo back in uppercase
\`\`\`

\`\`\`python
# client.py
import socket

def send_message(message, host='127.0.0.1', port=9000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((host, port))
        client.sendall(message.encode())
        data = client.recv(1024)
        print(f"Response: {data.decode()}")

send_message("hello, server!")   # Response: HELLO, SERVER!
\`\`\`

## Multi-Client Server with Threading

\`\`\`python
import socket, threading

def handle_client(conn, addr):
    print(f"Connected: {addr}")
    with conn:
        while True:
            data = conn.recv(1024)
            if not data:
                break
            conn.sendall(data.upper())
    print(f"Disconnected: {addr}")

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', 9000))
    server.listen(10)

    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.daemon = True
        thread.start()
\`\`\`

## Try It Yourself

\`\`\`python
# Build a simple key-value store over TCP:
# - Client sends: "SET key value" or "GET key"
# - Server responds: "OK" for SET, "value" or "NOT FOUND" for GET
# - Use a dict on the server side for storage

import socket, threading

store = {}

def handle_client(conn, addr):
    with conn:
        while True:
            data = conn.recv(1024).decode().strip()
            if not data: break
            parts = data.split(maxsplit=2)
            cmd = parts[0].upper()
            if cmd == "SET" and len(parts) == 3:
                store[parts[1]] = parts[2]
                conn.sendall(b"OK\n")
            elif cmd == "GET" and len(parts) == 2:
                val = store.get(parts[1], "NOT FOUND")
                conn.sendall(f"{val}\n".encode())
\`\`\`
`,
  },

  'expert-networking-rest-apis-requests-httpx': {
    readTime: 7,
    whatYoullLearn: [
      'Make GET, POST, PUT, DELETE requests with requests',
      'Handle authentication, headers, and timeouts',
      'Use sessions for persistent connections',
      'Make async HTTP requests with httpx',
      'Handle rate limiting and retries',
    ],
    content: `
## requests — The Standard HTTP Library

\`\`\`python
import requests

# GET request
response = requests.get(
    "https://api.github.com/users/python",
    headers={"Accept": "application/vnd.github.v3+json"},
    timeout=10,
)
response.raise_for_status()   # raise on 4xx/5xx
data = response.json()
print(data["public_repos"])

# POST with JSON body
response = requests.post(
    "https://api.example.com/users",
    json={"name": "Alice", "email": "alice@example.com"},
    headers={"Authorization": "Bearer my-token"},
)

# Session for multiple requests to the same host
session = requests.Session()
session.headers.update({"Authorization": "Bearer my-token"})
session.timeout = 30

r1 = session.get("/users")
r2 = session.get("/posts")
session.close()
\`\`\`

## httpx — Modern Async HTTP

\`\`\`python
import httpx
import asyncio

# Sync (drop-in replacement for requests)
with httpx.Client(timeout=10) as client:
    response = client.get("https://api.github.com/users/python")
    print(response.json()["public_repos"])

# Async
async def fetch_many(urls):
    async with httpx.AsyncClient(timeout=30) as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

urls = [
    "https://jsonplaceholder.typicode.com/posts/1",
    "https://jsonplaceholder.typicode.com/posts/2",
]
results = asyncio.run(fetch_many(urls))
\`\`\`

## Try It Yourself

\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def make_session_with_retries(retries=3, backoff=0.3):
    """Create a requests session with automatic retry logic."""
    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff,
        status_forcelist=[500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

# Use it:
session = make_session_with_retries()
response = session.get("https://api.example.com/data", timeout=10)
\`\`\`
`,
  },

  'expert-data-handling-json-csv-xml-parsing': {
    readTime: 7,
    whatYoullLearn: [
      'Parse and generate JSON with the json module',
      'Read and write CSV with the csv module',
      'Parse XML with ElementTree',
      'Handle encoding issues gracefully',
      'Stream large JSON/CSV files efficiently',
    ],
    content: `
## JSON

\`\`\`python
import json

# Parse JSON string
data = json.loads('{"name": "Alice", "scores": [90, 85, 92]}')
print(data["name"])       # "Alice"
print(data["scores"][0])  # 90

# Generate JSON string
output = json.dumps({"key": "value", "number": 42}, indent=2)
print(output)

# Read/write files
with open("data.json") as f:
    config = json.load(f)

with open("output.json", "w") as f:
    json.dump(config, f, indent=2, default=str)  # default=str handles non-serializable types
\`\`\`

## CSV

\`\`\`python
import csv

# Read
with open("students.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], float(row["score"]))

# Write
students = [{"name": "Alice", "score": 90}, {"name": "Bob", "score": 85}]
with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(students)
\`\`\`

## XML with ElementTree

\`\`\`python
import xml.etree.ElementTree as ET

xml_str = """
<students>
    <student id="1">
        <name>Alice</name>
        <score>90</score>
    </student>
    <student id="2">
        <name>Bob</name>
        <score>85</score>
    </student>
</students>
"""

root = ET.fromstring(xml_str)
for student in root.findall("student"):
    sid = student.get("id")
    name = student.find("name").text
    score = student.find("score").text
    print(f"ID {sid}: {name} scored {score}")
\`\`\`

## Try It Yourself

\`\`\`python
import json

# Write a JSON streaming parser for large files:
def stream_json_array(filename):
    """Yield objects from a large JSON array file one at a time."""
    import ijson  # pip install ijson
    with open(filename, "rb") as f:
        for item in ijson.items(f, "item"):
            yield item

# Without ijson, process line-by-line JSON (JSONL format):
def stream_jsonl(filename):
    with open(filename, encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)
\`\`\`
`,
  },

  'expert-data-handling-serialization-pickle': {
    readTime: 6,
    whatYoullLearn: [
      'Serialize Python objects with pickle',
      'Understand pickle security risks',
      'Use marshal for bytecode serialization',
      'Compare pickle, json, and msgpack',
      'Implement custom __getstate__ and __setstate__',
    ],
    content: `
## pickle — Python Object Serialization

\`pickle\` can serialize almost any Python object — including custom classes, functions, and closures:

\`\`\`python
import pickle

# Serialize any Python object
data = {"model": "RandomForest", "accuracy": 0.95, "params": [100, 5]}
with open("model.pkl", "wb") as f:
    pickle.dump(data, f)

# Deserialize
with open("model.pkl", "rb") as f:
    loaded = pickle.load(f)
print(loaded["accuracy"])   # 0.95

# In memory
serialized = pickle.dumps(data)
restored = pickle.loads(serialized)
\`\`\`

## Security Warning

\`\`\`python
# NEVER unpickle data from untrusted sources!
# pickle.loads(malicious_data) can execute arbitrary code:

# Example of the danger (never do this with user input):
import os

class MaliciousClass:
    def __reduce__(self):
        return (os.system, ("rm -rf /",))  # would execute this!

# Safe alternatives for untrusted data:
# - json: plain data types only
# - msgpack: fast, safe binary format
# - protobuf: typed, schema-based
\`\`\`

## Custom Pickling

\`\`\`python
class MLModel:
    def __init__(self, weights, config):
        self.weights = weights
        self.config = config
        self._cache = {}   # don't serialize the cache

    def __getstate__(self):
        """Return state to pickle — exclude cache."""
        state = self.__dict__.copy()
        del state["_cache"]
        return state

    def __setstate__(self, state):
        """Restore from pickled state."""
        self.__dict__.update(state)
        self._cache = {}   # re-initialize cache

model = MLModel([0.1, 0.2, 0.3], {"lr": 0.01})
model._cache = {"expensive": "computation"}  # this won't be pickled

data = pickle.dumps(model)
restored = pickle.loads(data)
print(restored._cache)   # {} — cache was reset
\`\`\`
`,
  },

  'expert-databases-sqlite3': {
    readTime: 8,
    whatYoullLearn: [
      'Connect to SQLite databases and execute queries',
      'Use parameterized queries to prevent SQL injection',
      'Create, read, update, and delete records (CRUD)',
      'Use transactions and commit/rollback',
      'Query with context managers',
    ],
    content: `
## Connecting and Creating Tables

\`\`\`python
import sqlite3

# Connect (creates file if doesn't exist)
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        score REAL DEFAULT 0.0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
""")
conn.commit()

# Always use context manager:
with sqlite3.connect("app.db") as conn:
    conn.row_factory = sqlite3.Row   # access columns by name
    cursor = conn.cursor()
    # operations here auto-commit on success, rollback on exception
\`\`\`

## CRUD Operations

\`\`\`python
import sqlite3

with sqlite3.connect("app.db") as conn:
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # INSERT — always use parameterized queries (never f-strings!)
    cur.execute(
        "INSERT INTO users (name, email, score) VALUES (?, ?, ?)",
        ("Alice", "alice@example.com", 95.5)
    )
    print(f"Inserted user id: {cur.lastrowid}")

    # INSERT multiple rows
    users = [
        ("Bob", "bob@example.com", 82.0),
        ("Carol", "carol@example.com", 91.5),
    ]
    cur.executemany(
        "INSERT INTO users (name, email, score) VALUES (?, ?, ?)",
        users
    )

    # SELECT
    cur.execute("SELECT * FROM users WHERE score > ?", (80,))
    for row in cur.fetchall():
        print(dict(row))  # access by column name

    # UPDATE
    cur.execute("UPDATE users SET score = ? WHERE name = ?", (98.0, "Alice"))

    # DELETE
    cur.execute("DELETE FROM users WHERE score < ?", (75,))
\`\`\`

## Try It Yourself

\`\`\`python
import sqlite3

# Build a simple task tracker:
# - Table: tasks(id, title, done, created_at)
# - Functions: add_task(title), complete_task(id), list_tasks()

def setup_db(db_path="tasks.db"):
    with sqlite3.connect(db_path) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

def add_task(title, db_path="tasks.db"):
    with sqlite3.connect(db_path) as conn:
        conn.execute("INSERT INTO tasks (title) VALUES (?)", (title,))

def complete_task(task_id, db_path="tasks.db"):
    with sqlite3.connect(db_path) as conn:
        conn.execute("UPDATE tasks SET done=1 WHERE id=?", (task_id,))

def list_tasks(db_path="tasks.db"):
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        return [dict(r) for r in conn.execute("SELECT * FROM tasks")]
\`\`\`
`,
  },

  'expert-databases-orm-basics-sqlalchemy': {
    readTime: 9,
    whatYoullLearn: [
      'Define models with SQLAlchemy\'s declarative base',
      'Perform CRUD operations using the ORM',
      'Query with filter(), order_by(), and limit()',
      'Define relationships between models',
      'Use SQLAlchemy 2.0 style with select()',
    ],
    content: `
## Defining Models

\`\`\`python
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Session, relationship

engine = create_engine("sqlite:///app.db", echo=False)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    score = Column(Float, default=0.0)
    posts = relationship("Post", back_populates="author")

    def __repr__(self):
        return f"User(id={self.id}, name={self.name!r})"

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")

Base.metadata.create_all(engine)
\`\`\`

## CRUD Operations

\`\`\`python
from sqlalchemy.orm import Session
from sqlalchemy import select

with Session(engine) as session:
    # CREATE
    alice = User(name="Alice", email="alice@example.com", score=95.5)
    session.add(alice)
    session.add_all([
        User(name="Bob", email="bob@example.com", score=82.0),
        User(name="Carol", email="carol@example.com", score=91.5),
    ])
    session.commit()

    # READ — SQLAlchemy 2.0 style
    stmt = select(User).where(User.score > 85).order_by(User.score.desc())
    users = session.scalars(stmt).all()
    for user in users:
        print(user.name, user.score)

    # UPDATE
    alice = session.get(User, 1)
    alice.score = 98.0
    session.commit()

    # DELETE
    low_scorer = session.scalars(select(User).where(User.score < 80)).first()
    if low_scorer:
        session.delete(low_scorer)
        session.commit()
\`\`\`

## Try It Yourself

\`\`\`python
# Add a Post model with title, content, user_id
# Write a function that returns the top 3 users by post count

from sqlalchemy import func

def top_posters(session, n=3):
    stmt = (
        select(User.name, func.count(Post.id).label("post_count"))
        .join(Post, User.id == Post.author_id)
        .group_by(User.id)
        .order_by(func.count(Post.id).desc())
        .limit(n)
    )
    return session.execute(stmt).all()
\`\`\`
`,
  },

  'expert-packaging-setuptools-pypi': {
    readTime: 7,
    whatYoullLearn: [
      'Structure a Python package for distribution',
      'Write pyproject.toml with setuptools or flit',
      'Build source and wheel distributions',
      'Publish to PyPI and TestPyPI',
      'Use semantic versioning',
    ],
    content: `
## Package Structure

\`\`\`
mypackage/
├── pyproject.toml          # package metadata (replaces setup.py)
├── README.md
├── LICENSE
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
└── tests/
    └── test_core.py
\`\`\`

## pyproject.toml

\`\`\`toml
[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.backends.legacy:build"

[project]
name = "mypackage"
version = "0.1.0"
description = "A useful Python package"
readme = "README.md"
license = {file = "LICENSE"}
requires-python = ">=3.10"
authors = [
    {name = "Your Name", email = "you@example.com"}
]
keywords = ["python", "example"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
]
dependencies = [
    "requests>=2.28",
    "click>=8.0",
]

[project.optional-dependencies]
dev = ["pytest>=7", "black", "mypy"]

[project.scripts]
mypackage-cli = "mypackage.cli:main"

[project.urls]
Homepage = "https://github.com/you/mypackage"
\`\`\`

## Building and Publishing

\`\`\`bash
# Install build tools
pip install build twine

# Build distribution packages
python -m build
# Creates: dist/mypackage-0.1.0.tar.gz (source)
#          dist/mypackage-0.1.0-py3-none-any.whl (wheel)

# Upload to TestPyPI first (test your config)
twine upload --repository testpypi dist/*

# Upload to real PyPI
twine upload dist/*
\`\`\`

## Semantic Versioning

\`\`\`
MAJOR.MINOR.PATCH (e.g., 2.1.3)

MAJOR: Breaking changes (API incompatible)
MINOR: New features, backward compatible
PATCH: Bug fixes, backward compatible

Pre-releases: 1.0.0a1, 1.0.0b2, 1.0.0rc1
Development: 0.1.0.dev1
\`\`\`
`,
  },

  'expert-security-hashlib-secure-coding': {
    readTime: 7,
    whatYoullLearn: [
      'Hash data securely with hashlib',
      'Hash passwords safely with hashlib.scrypt or bcrypt',
      'Generate cryptographically secure tokens',
      'Avoid common security pitfalls',
      'Use the secrets module for security-critical operations',
    ],
    content: `
## hashlib — Cryptographic Hashing

\`\`\`python
import hashlib

# Hash a string (SHA-256)
data = "Hello, World!"
h = hashlib.sha256(data.encode()).hexdigest()
print(h)   # 64-char hex string

# SHA-3 (more modern)
h2 = hashlib.sha3_256(data.encode()).hexdigest()

# MD5 (NOT for security — use for checksums/deduplication only)
md5 = hashlib.md5(b"file content").hexdigest()

# File integrity check
def file_hash(path, algo="sha256"):
    h = hashlib.new(algo)
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()
\`\`\`

## Secure Password Hashing

\`\`\`python
import hashlib, os

# NEVER store plaintext passwords or use simple SHA-256!
# Use password-specific algorithms: scrypt, bcrypt, or Argon2

# scrypt (built-in Python 3.6+)
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    key = hashlib.scrypt(
        password.encode(),
        salt=salt,
        n=2**14,   # CPU/memory cost
        r=8,
        p=1,
    )
    # Store salt + hash together
    return salt.hex() + ":" + key.hex()

def verify_password(password: str, stored: str) -> bool:
    salt_hex, key_hex = stored.split(":")
    salt = bytes.fromhex(salt_hex)
    new_key = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
    return new_key.hex() == key_hex

# Or use bcrypt (pip install bcrypt) — industry standard
import bcrypt
hashed = bcrypt.hashpw(b"my-password", bcrypt.gensalt(rounds=12))
bcrypt.checkpw(b"my-password", hashed)   # True
\`\`\`

## Common Security Mistakes

\`\`\`python
import secrets

# ✗ Predictable tokens
import random
bad_token = str(random.randint(0, 999999))   # guessable!

# ✓ Cryptographically secure tokens
good_token = secrets.token_urlsafe(32)        # 32 bytes = 43 chars URL-safe

# ✓ Timing-safe comparison (prevents timing attacks)
import hmac
def secure_compare(a: str, b: str) -> bool:
    return hmac.compare_digest(a.encode(), b.encode())

# ✗ Timing-vulnerable comparison
# if user_token == expected_token:  # DON'T use == for secrets!
\`\`\`
`,
  },

  'expert-advanced-libraries-pandas-numpy': {
    readTime: 9,
    whatYoullLearn: [
      'Create and manipulate NumPy arrays',
      'Understand broadcasting and vectorized operations',
      'Load and explore data with pandas DataFrames',
      'Filter, group, and aggregate data',
      'Handle missing values and merge DataFrames',
    ],
    content: `
## NumPy — Numerical Computing

\`\`\`python
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))          # 3x4 matrix of zeros
c = np.ones((2, 3))
d = np.arange(0, 10, 0.5)    # like range() but returns array
e = np.linspace(0, 1, 100)   # 100 evenly spaced values in [0,1]
f = np.random.randn(1000)     # 1000 standard normal values

# Vectorized operations (no loop needed!)
prices = np.array([10, 20, 30, 40, 50])
discounted = prices * 0.9          # [9, 18, 27, 36, 45]
total = prices.sum()               # 150
mean = prices.mean()               # 30.0
std = prices.std()                 # 14.14...

# Broadcasting
matrix = np.arange(12).reshape(3, 4)   # 3x4 matrix
row_means = matrix.mean(axis=1, keepdims=True)  # shape (3,1)
normalized = matrix - row_means    # broadcast subtraction
\`\`\`

## pandas — Data Analysis

\`\`\`python
import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Carol", "Dave"],
    "dept": ["Eng", "Mkt", "Eng", "Mkt"],
    "salary": [95000, 75000, 92000, 78000],
    "score": [4.5, 3.8, 4.2, 3.5],
})

# Exploration
print(df.head())         # first 5 rows
print(df.describe())     # stats for numeric columns
print(df.dtypes)         # column types
print(df.shape)          # (rows, cols)

# Filtering
eng = df[df["dept"] == "Eng"]
high_earners = df[df["salary"] > 80000]
mask = (df["dept"] == "Eng") & (df["score"] > 4.0)
print(df[mask])

# GroupBy
dept_stats = df.groupby("dept").agg(
    avg_salary=("salary", "mean"),
    count=("name", "count"),
)
print(dept_stats)
\`\`\`

## Try It Yourself

\`\`\`python
import pandas as pd
import numpy as np

# 1. Create a DataFrame with 1000 rows of fake sales data
np.random.seed(42)
sales = pd.DataFrame({
    "month": np.random.choice(range(1, 13), 1000),
    "region": np.random.choice(["North", "South", "East", "West"], 1000),
    "amount": np.random.exponential(100, 1000),
})

# 2. Find the top region by total sales each month
monthly = sales.groupby(["month", "region"])["amount"].sum()
top_regions = monthly.groupby("month").idxmax()
print(top_regions)
\`\`\`
`,
  },

  'expert-advanced-libraries-matplotlib-seaborn': {
    readTime: 6,
    whatYoullLearn: [
      'Create line, bar, scatter, and histogram plots',
      'Customize axes, labels, and styles',
      'Use seaborn for statistical visualizations',
      'Save plots to files',
    ],
    content: `
## matplotlib — Core Plotting

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 2 * np.pi, 100)
plt.figure(figsize=(10, 4))
plt.plot(x, np.sin(x), label="sin(x)", color="blue", linewidth=2)
plt.plot(x, np.cos(x), label="cos(x)", color="red", linestyle="--")
plt.xlabel("x")
plt.ylabel("y")
plt.title("Sine and Cosine")
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("plot.png", dpi=150)
plt.show()

# Bar chart
categories = ["A", "B", "C", "D"]
values = [23, 45, 12, 67]
plt.bar(categories, values, color="steelblue", edgecolor="black")
plt.title("Bar Chart")
plt.show()
\`\`\`

## seaborn — Statistical Visualization

\`\`\`python
import seaborn as sns
import pandas as pd

# Load example dataset
df = sns.load_dataset("tips")

# Distribution
sns.histplot(df["total_bill"], bins=20, kde=True)
plt.show()

# Relationship
sns.scatterplot(data=df, x="total_bill", y="tip", hue="time")
plt.show()

# Box plot for groups
sns.boxplot(data=df, x="day", y="total_bill", hue="sex")
plt.show()

# Heatmap
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, cmap="coolwarm")
plt.show()
\`\`\`

## Try It Yourself

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Create a 2x2 subplot grid showing:
# 1. Sine wave
# 2. Random histogram
# 3. Bar chart of first 5 squares
# 4. Scatter plot of 50 random points

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
x = np.linspace(0, 2*np.pi, 100)
axes[0, 0].plot(x, np.sin(x))
axes[0, 1].hist(np.random.randn(1000), bins=30)
axes[1, 0].bar(range(1,6), [x**2 for x in range(1,6)])
axes[1, 1].scatter(*np.random.randn(2, 50))
plt.tight_layout()
plt.show()
\`\`\`
`,
  },

  'expert-advanced-libraries-flask-django-fastapi': {
    readTime: 8,
    whatYoullLearn: [
      'Build a REST API with FastAPI',
      'Use Pydantic models for request validation',
      'Create routes and handle path/query parameters',
      'Compare Flask, Django, and FastAPI',
      'Add middleware and dependency injection',
    ],
    content: `
## FastAPI — Modern, Fast Web Framework

\`\`\`python
# pip install fastapi uvicorn[standard]
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="PyPath API", version="1.0.0")

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    score: float = 0.0

# In-memory store
users: dict[int, User] = {}
next_id = 1

@app.get("/")
def root():
    return {"message": "PyPath API is running!"}

@app.get("/users", response_model=list[User])
def list_users(skip: int = 0, limit: int = 10):
    return list(users.values())[skip:skip+limit]

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]

@app.post("/users", response_model=User, status_code=201)
def create_user(user: User):
    global next_id
    user.id = next_id
    users[next_id] = user
    next_id += 1
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, user: User):
    if user_id not in users:
        raise HTTPException(404, "Not found")
    user.id = user_id
    users[user_id] = user
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    if user_id not in users:
        raise HTTPException(404, "Not found")
    del users[user_id]
    return {"deleted": True}

# Run: uvicorn main:app --reload
# Docs: http://localhost:8000/docs
\`\`\`

## Framework Comparison

\`\`\`
Framework  Strengths                         Best For
──────────────────────────────────────────────────────
Flask      Minimal, flexible, large ecosystem  Small APIs, microservices
Django     Full batteries, admin, ORM          Full web apps, CMS
FastAPI    Auto docs, async, type hints        Modern REST APIs, ML serving
\`\`\`

## Try It Yourself

\`\`\`python
# Add these endpoints to the FastAPI app above:
# 1. GET /users/search?q=alice — filter users by name substring
# 2. PATCH /users/{id}/score — update only the score field
# 3. GET /stats — return count, avg_score, max_score

from pydantic import BaseModel

class ScoreUpdate(BaseModel):
    score: float

@app.patch("/users/{user_id}/score")
def update_score(user_id: int, update: ScoreUpdate):
    if user_id not in users:
        raise HTTPException(404, "Not found")
    users[user_id].score = update.score
    return users[user_id]
\`\`\`
`,
  },

  'expert-advanced-libraries-scikit-learn-ml-basics': {
    readTime: 8,
    whatYoullLearn: [
      'Train classification and regression models with scikit-learn',
      'Split data into train/test sets',
      'Evaluate models with metrics',
      'Build preprocessing pipelines',
      'Understand the fit/predict API',
    ],
    content: `
## The scikit-learn API

scikit-learn has a consistent API: \`fit(X, y)\`, \`predict(X)\`, \`score(X, y)\`:

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target
print(f"Dataset: {X.shape}")   # (150, 4)
print(f"Classes: {iris.target_names}")   # ['setosa', 'versicolor', 'virginica']

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # fit AND transform
X_test_scaled = scaler.transform(X_test)          # transform ONLY

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(classification_report(y_test, y_pred, target_names=iris.target_names))
\`\`\`

## Pipelines

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

# Bundle preprocessing + model in a pipeline
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", SVC(kernel="rbf", C=1.0)),
])

# fit/predict on raw data — pipeline handles the rest
pipe.fit(X_train, y_train)
print(f"Pipeline accuracy: {pipe.score(X_test, y_test):.3f}")
\`\`\`

## Cross-Validation

\`\`\`python
from sklearn.model_selection import cross_val_score
import numpy as np

# 5-fold cross-validation
scores = cross_val_score(
    RandomForestClassifier(random_state=42),
    X, y,
    cv=5,
    scoring="accuracy",
)
print(f"CV scores: {scores}")
print(f"Mean: {scores.mean():.3f} +/- {scores.std():.3f}")
\`\`\`

## Try It Yourself

\`\`\`python
from sklearn.datasets import load_boston  # or make_regression
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, r2_score

# 1. Load a regression dataset
# 2. Split and scale
# 3. Train LinearRegression and Ridge
# 4. Compare MSE and R² scores
# 5. Plot actual vs predicted values with matplotlib
\`\`\`
`,
  },
};
