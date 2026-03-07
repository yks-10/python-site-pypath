// Expanded lesson content — replaces short versions in lessonContent2.js
// ALL_LESSONS in allLessons.js spreads this last, so these keys take priority.

export const LESSONS_EXPANDED = {

  // ─── INTERMEDIATE: Expanded ─────────────────────────────────────

  'intermediate-advanced-data-structures-nested-data-structures': {
    readTime: 9,
    whatYoullLearn: [
      'Navigate deeply nested lists and dictionaries with confidence',
      'Build and transform complex nested structures from scratch',
      'Flatten nested data at any depth using recursion',
      'Process real JSON API responses with nested fields',
      'Write safe deep-access helpers that never raise KeyError',
    ],
    content: `
## What Are Nested Data Structures?

In the real world, data is rarely flat. A user has an address, which has coordinates. An order has line items, each with a product, which has variants. Python\\'s built-in \`list\` and \`dict\` can be nested arbitrarily deep to represent these structures:

\`\`\`python
# A JSON-like user profile (common in REST APIs)
user = {
    "id": 42,
    "name": "Alice",
    "address": {
        "street": "123 Main St",
        "city": "New York",
        "coords": {"lat": 40.7128, "lng": -74.0060}
    },
    "roles": ["admin", "editor"],
    "settings": {
        "theme": "dark",
        "notifications": {"email": True, "sms": False},
    }
}
\`\`\`

## Navigating Nested Dicts

Access nested values by chaining square brackets:

\`\`\`python
# Direct access — raises KeyError if any key is missing
print(user["address"]["city"])               # "New York"
print(user["address"]["coords"]["lat"])       # 40.7128
print(user["settings"]["notifications"]["email"])  # True

# Safe access with .get() — no KeyError, returns None by default
city = user.get("address", {}).get("city")
lat  = user.get("address", {}).get("coords", {}).get("lat")
print(lat)   # 40.7128

sms = user.get("settings", {}).get("notifications", {}).get("sms", False)
print(sms)   # False (uses default if missing at any level)

# Reusable deep_get helper
def deep_get(obj, *keys, default=None):
    """Safely access a deeply nested value."""
    for key in keys:
        if isinstance(obj, dict):
            obj = obj.get(key, default)
        elif isinstance(obj, (list, tuple)) and isinstance(key, int):
            obj = obj[key] if 0 <= key < len(obj) else default
        else:
            return default
    return obj

print(deep_get(user, "address", "coords", "lng"))   # -74.0060
print(deep_get(user, "address", "zip_code"))         # None
print(deep_get(user, "roles", 0))                    # "admin"
\`\`\`

## Modifying Nested Structures

\`\`\`python
# Update a nested value
user["settings"]["theme"] = "light"
user["settings"]["notifications"]["sms"] = True
user["address"]["coords"] = {"lat": 34.0522, "lng": -118.2437}

# Add a new nested key safely
user.setdefault("preferences", {})["language"] = "en"
user.setdefault("preferences", {})["timezone"] = "America/New_York"

# Deep update — merge two nested dicts
def deep_update(base, updates):
    """Recursively merge 'updates' into 'base'."""
    for key, value in updates.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            deep_update(base[key], value)
        else:
            base[key] = value
    return base

overrides = {"settings": {"theme": "system", "font_size": 14}}
deep_update(user, overrides)
print(user["settings"])
# {"theme": "system", "notifications": {...}, "font_size": 14}
# Notice: notifications was PRESERVED (not overwritten)
\`\`\`

## Flattening Nested Lists

\`\`\`python
# One level deep — list comprehension
nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
flat = [item for sublist in nested for item in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Equivalent with itertools (memory-efficient)
from itertools import chain
flat = list(chain.from_iterable(nested))

# Arbitrary depth — recursive function
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

deep = [1, [2, [3, [4, [5]], 6], 7], 8]
print(flatten(deep))   # [1, 2, 3, 4, 5, 6, 7, 8]

# Generator version (memory-efficient for large structures)
def flatten_gen(lst):
    for item in lst:
        if isinstance(item, list):
            yield from flatten_gen(item)
        else:
            yield item

print(list(flatten_gen(deep)))   # [1, 2, 3, 4, 5, 6, 7, 8]
\`\`\`

## Processing Real API Responses

\`\`\`python
# Typical paginated API response
api_response = {
    "status": "ok",
    "page": 1,
    "per_page": 3,
    "total": 9,
    "data": [
        {
            "id": 1,
            "user": {"name": "Alice", "dept": "Eng"},
            "scores": [85, 90, 92],
            "metadata": {"tags": ["python", "ml"], "priority": "high"},
        },
        {
            "id": 2,
            "user": {"name": "Bob", "dept": "Mkt"},
            "scores": [70, 75, 80],
            "metadata": {"tags": ["excel", "crm"], "priority": "low"},
        },
        {
            "id": 3,
            "user": {"name": "Carol", "dept": "Eng"},
            "scores": [95, 98, 91],
            "metadata": {"tags": ["python", "data"], "priority": "high"},
        },
    ]
}

# Extract summaries with comprehension
summaries = [
    {
        "name": record["user"]["name"],
        "dept": record["user"]["dept"],
        "avg_score": sum(record["scores"]) / len(record["scores"]),
        "tags": record["metadata"]["tags"],
    }
    for record in api_response["data"]
    if record["metadata"]["priority"] == "high"
]

for s in sorted(summaries, key=lambda x: x["avg_score"], reverse=True):
    print(f"{s['name']} ({s['dept']}): {s['avg_score']:.1f} — {', '.join(s['tags'])}")
\`\`\`

## Nested Structures in Practice: Config Merging

\`\`\`python
# Build a layered configuration system
DEFAULT_CONFIG = {
    "server": {"host": "localhost", "port": 8080, "debug": False},
    "database": {"host": "localhost", "port": 5432, "pool_size": 5},
    "logging": {"level": "INFO", "format": "json"},
}

DEV_OVERRIDES = {
    "server": {"debug": True},
    "logging": {"level": "DEBUG"},
}

PROD_OVERRIDES = {
    "server": {"host": "api.example.com", "port": 443},
    "database": {"host": "db.example.com", "pool_size": 20},
}

import copy

def build_config(*override_layers):
    config = copy.deepcopy(DEFAULT_CONFIG)
    for overrides in override_layers:
        deep_update(config, overrides)
    return config

dev_config = build_config(DEV_OVERRIDES)
prod_config = build_config(PROD_OVERRIDES)
print(dev_config["server"])    # debug=True, host=localhost
print(prod_config["server"])   # host=api.example.com, port=443
\`\`\`

## Try It Yourself

\`\`\`python
# Given this nested company structure, complete the exercises:
company = {
    "name": "TechCorp",
    "departments": [
        {
            "name": "Engineering",
            "budget": 500000,
            "teams": [
                {"name": "Backend",  "size": 8,  "lead": "Alice", "stack": ["Python", "PostgreSQL"]},
                {"name": "Frontend", "size": 5,  "lead": "Bob",   "stack": ["React", "TypeScript"]},
            ]
        },
        {
            "name": "Data",
            "budget": 300000,
            "teams": [
                {"name": "Analytics", "size": 4, "lead": "Carol", "stack": ["Python", "Spark"]},
            ]
        }
    ]
}

# 1. Get a flat list of all team leads
leads = [team["lead"]
         for dept in company["departments"]
         for team in dept["teams"]]

# 2. Get total headcount per department
for dept in company["departments"]:
    total = sum(team["size"] for team in dept["teams"])
    print(f"{dept['name']}: {total} people")

# 3. Find all teams using Python
python_teams = [
    team["name"]
    for dept in company["departments"]
    for team in dept["teams"]
    if "Python" in team["stack"]
]
print(f"Python teams: {python_teams}")
\`\`\`
`,
  },

  'intermediate-functions-advanced-recursion': {
    readTime: 11,
    whatYoullLearn: [
      'Identify base cases and recursive cases in any problem',
      'Trace the call stack through multiple levels of recursion',
      'Implement classic algorithms: factorial, Fibonacci, binary search',
      'Use memoization with @lru_cache to eliminate redundant calls',
      'Know when to use iteration instead of recursion',
    ],
    content: `
## The Two Rules of Recursion

Every correct recursive function has exactly two parts:
1. **Base case** — a condition that stops the recursion and returns a value directly
2. **Recursive case** — calls itself with a *smaller* or *simpler* version of the problem, making progress toward the base case

Without a base case → infinite recursion → \`RecursionError\`
Without progress → never reaches the base case → same problem

\`\`\`python
def factorial(n: int) -> int:
    # Base case: factorial(0) = factorial(1) = 1
    if n <= 1:
        return 1
    # Recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)

# Call stack for factorial(4):
# factorial(4) → 4 * factorial(3)
#                    → 3 * factorial(2)
#                         → 2 * factorial(1)
#                              → 1  (base case)
#                         → 2 * 1 = 2
#                    → 3 * 2 = 6
#               → 4 * 6 = 24
print(factorial(4))   # 24
\`\`\`

## Tracing the Call Stack

Use \`print\` indentation to visualize recursion depth:

\`\`\`python
def factorial_traced(n: int, depth: int = 0) -> int:
    indent = "  " * depth
    print(f"{indent}factorial({n}) called")
    if n <= 1:
        print(f"{indent}→ returns 1 (base case)")
        return 1
    result = n * factorial_traced(n - 1, depth + 1)
    print(f"{indent}→ returns {n} × ... = {result}")
    return result

factorial_traced(4)
# factorial(4) called
#   factorial(3) called
#     factorial(2) called
#       factorial(1) called
#       → returns 1 (base case)
#     → returns 2 × ... = 2
#   → returns 3 × ... = 6
# → returns 4 × ... = 24
\`\`\`

## Fibonacci: Naive vs Memoized

Naive recursion for Fibonacci has exponential time complexity O(2ⁿ) because it recomputes the same values repeatedly:

\`\`\`python
# ✗ Naive — extremely slow for large n
def fib_naive(n: int) -> int:
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

# fib_naive(40) calls fib_naive(1) over 100 million times!

# ✓ Memoized with @lru_cache — O(n) time, O(n) space
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

import time
start = time.perf_counter()
print(fib(100))   # 354224848179261915075 — instant!
print(f"Time: {time.perf_counter()-start:.6f}s")

# Cache stats
print(fib.cache_info())  # CacheInfo(hits=98, misses=101, ...)

# ✓ Iterative — O(n) time, O(1) space (best for large n)
def fib_iter(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib_iter(1000))   # handles huge numbers easily
\`\`\`

## Classic Recursive Algorithms

\`\`\`python
# Binary search — divide and conquer
def binary_search(arr: list, target: int, low: int = 0, high: int = None) -> int:
    """Return index of target, or -1 if not found."""
    if high is None:
        high = len(arr) - 1

    if low > high:
        return -1                    # base case: not found

    mid = (low + high) // 2
    if arr[mid] == target:
        return mid                   # base case: found!
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, high)
    else:
        return binary_search(arr, target, low, mid - 1)

data = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(data, 7))    # 3
print(binary_search(data, 6))    # -1

# Power function — fast exponentiation O(log n)
def power(base: float, exp: int) -> float:
    """Compute base^exp in O(log exp) multiplications."""
    if exp == 0:
        return 1                     # base case: x^0 = 1
    if exp < 0:
        return 1 / power(base, -exp)
    if exp % 2 == 0:
        half = power(base, exp // 2)
        return half * half           # x^(2k) = (x^k)^2
    return base * power(base, exp - 1)

print(power(2, 10))    # 1024.0
print(power(2, 0))     # 1.0
print(power(2, -3))    # 0.125
\`\`\`

## Recursion on Tree Structures

Recursion shines on tree-shaped data because every subtree is a smaller version of the same structure:

\`\`\`python
# File system tree
tree = {
    "name": "project",
    "type": "dir",
    "children": [
        {"name": "src", "type": "dir", "children": [
            {"name": "main.py",   "type": "file", "size": 2048},
            {"name": "utils.py",  "type": "file", "size": 1024},
        ]},
        {"name": "tests", "type": "dir", "children": [
            {"name": "test_main.py", "type": "file", "size": 512},
        ]},
        {"name": "README.md", "type": "file", "size": 256},
    ]
}

def total_size(node: dict) -> int:
    """Sum the size of all files recursively."""
    if node["type"] == "file":
        return node["size"]                          # base case
    return sum(total_size(child) for child in node.get("children", []))

def find_files(node: dict, extension: str) -> list:
    """Find all files with a given extension."""
    if node["type"] == "file":
        if node["name"].endswith(extension):
            return [node["name"]]                    # base case
        return []
    # Flatten results from all children
    return [f for child in node.get("children", [])
            for f in find_files(child, extension)]

def print_tree(node: dict, indent: int = 0) -> None:
    """Pretty-print the tree structure."""
    prefix = "  " * indent
    icon = "📁" if node["type"] == "dir" else "📄"
    print(f"{prefix}{icon} {node['name']}")
    for child in node.get("children", []):
        print_tree(child, indent + 1)

print(f"Total size: {total_size(tree)} bytes")
print(f"Python files: {find_files(tree, '.py')}")
print_tree(tree)
\`\`\`

## Avoiding Stack Overflow

Python\\'s default recursion limit is 1000. For deep recursion, use iteration or increase the limit:

\`\`\`python
import sys
print(sys.getrecursionlimit())   # 1000

# Temporarily increase for legitimate deep recursion:
sys.setrecursionlimit(10000)

# Better: convert tail recursion to iteration
# Recursive (O(n) stack space):
def sum_recursive(lst, acc=0):
    if not lst:
        return acc
    return sum_recursive(lst[1:], acc + lst[0])

# Iterative (O(1) stack space):
def sum_iterative(lst):
    return sum(lst)   # or: acc = 0; for x in lst: acc += x; return acc

# For truly deep recursion, use an explicit stack:
def flatten_iterative(nested):
    """Flatten without recursion using an explicit stack."""
    stack = [nested]
    result = []
    while stack:
        item = stack.pop()
        if isinstance(item, list):
            stack.extend(reversed(item))   # push children (reversed for correct order)
        else:
            result.append(item)
    return result
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Implement merge sort recursively:
def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr                    # base case
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

print(merge_sort([5, 2, 8, 1, 9, 3, 7, 4, 6]))
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 2. Write a recursive function that counts the total number
#    of items in a nested list (at any depth):
def count_items(lst):
    pass
    # count_items([1, [2, [3, 4], 5], 6]) → 6
\`\`\`
`,
  },

  'intermediate-functions-advanced-args-kwargs': {
    readTime: 8,
    whatYoullLearn: [
      'Collect unlimited positional args with *args into a tuple',
      'Collect unlimited keyword args with **kwargs into a dict',
      'Unpack sequences and dicts when calling functions',
      'Enforce keyword-only parameters with a bare *',
      'Write flexible function wrappers using both *args and **kwargs',
    ],
    content: `
## The Problem *args and **kwargs Solve

What if you need a function that accepts a variable number of arguments — like Python\\'s built-in \`print()\`? That\\'s what \`*args\` and \`**kwargs\` are for.

\`\`\`python
# How does print() accept any number of arguments?
print("a", "b", "c")          # 3 args
print("hello")                 # 1 arg
print("x", "y", sep="-")       # 2 positional + 1 keyword

# Your own version:
def my_print(*args, sep=" ", end="\\n", **kwargs):
    output = sep.join(str(a) for a in args)
    print(output, end=end)  # delegates to real print
\`\`\`

## *args — Variable Positional Arguments

\`*args\` collects any number of extra positional arguments into a **tuple**:

\`\`\`python
def sum_all(*args: float) -> float:
    """Accept any number of numbers and return their sum."""
    print(f"args type: {type(args)}")   # <class 'tuple'>
    return sum(args)

print(sum_all(1, 2, 3))              # 6
print(sum_all(1, 2, 3, 4, 5, 6))    # 21
print(sum_all())                      # 0

# Mix required params with *args — required come FIRST
def log(level: str, *messages: str, separator: str = " | ") -> None:
    """Level is required; any number of messages follows."""
    print(f"[{level}] {separator.join(messages)}")

log("INFO", "Server started", "Port 8080 open")
log("ERROR", "DB connection failed")
log("DEBUG")   # no messages — that's fine too
\`\`\`

## **kwargs — Variable Keyword Arguments

\`**kwargs\` collects any number of extra keyword arguments into a **dict**:

\`\`\`python
def create_html_element(tag: str, content: str, **attrs) -> str:
    """Build an HTML element with any attributes."""
    print(f"attrs type: {type(attrs)}")   # <class 'dict'>
    attr_str = " ".join(f'{k.rstrip("_")}="{v}"' for k, v in attrs.items())
    if attr_str:
        return f"<{tag} {attr_str}>{content}</{tag}>"
    return f"<{tag}>{content}</{tag}>"

print(create_html_element("a", "Click", href="https://pypath.dev", target="_blank"))
# <a href="https://pypath.dev" target="_blank">Click</a>

print(create_html_element("p", "Hello!", class_="intro", id="main"))
# <p class="intro" id="main">Hello!</p>
# Note: class_ avoids conflict with Python keyword 'class'

def configure(host: str, port: int = 8080, **options) -> dict:
    """Start with required params, then accept arbitrary options."""
    return {"host": host, "port": port, **options}

cfg = configure("localhost", 443, ssl=True, timeout=30, max_retries=3)
print(cfg)
# {'host': 'localhost', 'port': 443, 'ssl': True, 'timeout': 30, 'max_retries': 3}
\`\`\`

## Unpacking When Calling

The \`*\` and \`**\` operators also work in reverse — unpacking sequences/dicts into function arguments:

\`\`\`python
def add(a: int, b: int, c: int) -> int:
    return a + b + c

# Unpack a list/tuple into positional args
numbers = [1, 2, 3]
print(add(*numbers))          # same as add(1, 2, 3) → 6

t = (10, 20, 30)
print(add(*t))                 # 60

# Unpack a dict into keyword args
params = {"a": 100, "b": 200, "c": 300}
print(add(**params))           # 600

# Mix both
print(add(*[1, 2], **{"c": 3}))  # 6

# Useful for extending function calls with stored defaults:
base_options = {"timeout": 30, "retries": 3}
response = requests.get(url, **base_options, headers={"Auth": "token"})
\`\`\`

## Argument Order Rules

When combining all four parameter types, they must appear in this exact order:

\`\`\`python
# def func(positional, /, normal, *args, keyword_only, **kwargs)
#   ↑ positional-only   ↑ normal   ↑ var positional   ↑ var keyword

def full_example(a, b, *args, kw_only=True, **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"kw_only={kw_only}")
    print(f"kwargs={kwargs}")

full_example(1, 2, 3, 4, kw_only=False, extra="hello")
# a=1, b=2
# args=(3, 4)
# kw_only=False
# kwargs={'extra': 'hello'}

# Bare * enforces keyword-only (no *args collected):
def keyword_required(name: str, *, verbose: bool = False) -> str:
    if verbose:
        print(f"Processing: {name}")
    return name.upper()

keyword_required("alice")             # OK
keyword_required("alice", verbose=True)  # OK
# keyword_required("alice", True)     # TypeError! verbose must be keyword
\`\`\`

## Writing Function Wrappers

\`*args\` and \`**kwargs\` are essential for writing decorators and wrappers that forward all arguments:

\`\`\`python
import time, functools

def timer(func):
    """Decorator that times any function with any signature."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)  # forward ALL args exactly as received
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}({args}, {kwargs}) took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def complex_operation(n: int, factor: float = 1.0, *, verbose: bool = False) -> float:
    """A function with a rich signature."""
    import math
    result = sum(math.sqrt(i) for i in range(n)) * factor
    if verbose:
        print(f"Result: {result:.2f}")
    return result

complex_operation(100000, factor=2.5, verbose=True)
# Result: 211072.95
# complex_operation((100000,), {'factor': 2.5, 'verbose': True}) took 0.0123s
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Write a function 'merge_configs' that:
#    - Accepts any number of config dicts as positional args
#    - Accepts keyword overrides as **kwargs
#    - Merges left-to-right (later values win)
#    - Returns the merged dict

def merge_configs(*configs, **overrides):
    result = {}
    for cfg in configs:
        result.update(cfg)
    result.update(overrides)
    return result

base = {"host": "localhost", "port": 8080, "debug": False}
prod = {"host": "prod.example.com", "port": 443}
result = merge_configs(base, prod, debug=True, timeout=30)
print(result)
# {"host": "prod.example.com", "port": 443, "debug": True, "timeout": 30}

# 2. Write a 'retry' wrapper using *args/**kwargs:
def retry(max_attempts=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt+1} failed: {e}")
        return wrapper
    return decorator
\`\`\`
`,
  },

  'intermediate-functions-advanced-lambda': {
    readTime: 7,
    whatYoullLearn: [
      'Write anonymous single-expression functions with lambda',
      'Use lambdas as key= arguments to sorted(), min(), max()',
      'Apply lambdas with map() and filter() for transformations',
      'Understand the single-expression limitation and when to use def instead',
      'Recognize Pythonic alternatives to complex lambdas',
    ],
    content: `
## What Is a Lambda?

A \`lambda\` is a small anonymous function defined in a single expression. It\\'s syntactic sugar for a simple \`def\` — useful when you need a short function as an argument but don\\'t want to name it:

\`\`\`python
# Normal function
def square(x):
    return x ** 2

# Equivalent lambda
square = lambda x: x ** 2

print(square(5))     # 25
print(type(square))  # <class 'function'> — same type as def

# Multi-argument lambda
add = lambda a, b: a + b
print(add(3, 4))     # 7

# Lambda with default argument
greet = lambda name="World": f"Hello, {name}!"
print(greet())           # "Hello, World!"
print(greet("Python"))   # "Hello, Python!"

# Immediately invoked (IIFE pattern — rare in Python):
result = (lambda x, y: x ** y)(2, 10)
print(result)   # 1024
\`\`\`

## Lambdas with sorted(), min(), max()

The most common use — lambdas as the \`key=\` argument:

\`\`\`python
# Sort by a specific field
people = [
    {"name": "Carol", "age": 35, "salary": 92000},
    {"name": "Alice", "age": 28, "salary": 85000},
    {"name": "Bob",   "age": 42, "salary": 110000},
    {"name": "Dave",  "age": 28, "salary": 78000},
]

# Sort by age
by_age = sorted(people, key=lambda p: p["age"])
# [Alice(28), Dave(28), Carol(35), Bob(42)]

# Sort by age, then salary descending (multi-key sort)
by_age_salary = sorted(people, key=lambda p: (p["age"], -p["salary"]))
# Dave(28, 78k) comes AFTER Alice(28, 85k) because -85000 < -78000
for p in by_age_salary:
    print(f"{p['name']}: {p['age']}, \${p['salary']:,}")

# Find the youngest / highest paid
youngest = min(people, key=lambda p: p["age"])
richest  = max(people, key=lambda p: p["salary"])
print(f"Youngest: {youngest['name']}")   # Alice or Dave (tie)
print(f"Richest:  {richest['name']}")    # Bob

# Sort strings by last word
sentences = ["The quick fox", "A slow turtle", "The fast hare"]
by_last_word = sorted(sentences, key=lambda s: s.split()[-1])
print(by_last_word)   # sorted by: fox, hare, turtle
\`\`\`

## Lambdas with map() and filter()

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map() — apply function to every element
doubled   = list(map(lambda x: x * 2, numbers))
as_strings = list(map(str, numbers))        # existing function, no lambda needed
formatted  = list(map(lambda x: f"item_{x:03d}", numbers))
print(formatted[:3])   # ['item_001', 'item_002', 'item_003']

# filter() — keep elements where function is truthy
evens  = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4, 6, 8, 10]
odds   = list(filter(lambda x: x % 2 != 0, numbers))

# Combine: filter then map
even_squares = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers)))
# [4, 16, 36, 64, 100]

# EQUIVALENT list comprehension (usually more readable):
even_squares = [x**2 for x in numbers if x % 2 == 0]
\`\`\`

## Sorting Version Strings and Tuples

\`\`\`python
# Natural sort for version strings
versions = ["1.10.0", "1.2.0", "1.9.1", "2.0.0", "1.11.0"]

# Wrong: lexicographic sort puts "1.10" before "1.9"
print(sorted(versions))
# ['1.10.0', '1.11.0', '1.2.0', '1.9.1', '2.0.0']  ← WRONG!

# Correct: sort by tuple of ints
print(sorted(versions, key=lambda v: tuple(int(x) for x in v.split("."))))
# ['1.2.0', '1.9.1', '1.10.0', '1.11.0', '2.0.0']  ← CORRECT

# Case-insensitive sort
words = ["Banana", "apple", "Cherry", "date"]
print(sorted(words, key=str.lower))    # str.lower is cleaner than lambda s: s.lower()

# Sort by multiple criteria
students = [("Alice", 90), ("Bob", 85), ("Carol", 90), ("Dave", 85)]
# Sort by score descending, then name ascending
result = sorted(students, key=lambda s: (-s[1], s[0]))
print(result)   # [('Alice', 90), ('Carol', 90), ('Bob', 85), ('Dave', 85)]
\`\`\`

## When NOT to Use Lambda

\`\`\`python
# ✗ Complex logic — use def
complicated = lambda x: x**2 if x > 0 else -x if x < 0 else 0
# This is hard to read and can't have a docstring or type hints

# ✓ Named function is clearer
def transform(x: float) -> float:
    """Square positives, negate negatives, zero stays zero."""
    if x > 0:
        return x ** 2
    elif x < 0:
        return -x
    return 0

# ✗ Assigning lambda to a name violates PEP 8
multiply = lambda a, b: a * b   # ← just use def!

# ✓ Use def when storing in a variable
def multiply(a, b):
    return a * b

# ✓ Lambda shines: inline as argument, simple expression, no name needed
data.sort(key=lambda item: (item.priority, item.created_at))
filtered = filter(lambda x: x > 0, values)
\`\`\`

## operator module: Cleaner Alternatives

\`\`\`python
from operator import attrgetter, itemgetter, methodcaller

# Instead of lambda p: p["age"]
by_age = sorted(people, key=itemgetter("age"))      # dict key

# Instead of lambda p: p.age
by_age = sorted(objects, key=attrgetter("age"))      # object attribute

# Instead of lambda s: s.upper()
upper_names = list(map(methodcaller("upper"), names))

# itemgetter with multiple keys (faster than lambda)
by_age_name = sorted(people, key=itemgetter("age", "name"))
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Sort these file records by extension, then by size descending:
files = [
    {"name": "report.pdf", "size": 5000},
    {"name": "data.csv",   "size": 12000},
    {"name": "image.png",  "size": 800},
    {"name": "notes.txt",  "size": 300},
    {"name": "backup.csv", "size": 8000},
    {"name": "photo.png",  "size": 2100},
]
# Hint: lambda f: (f["name"].rsplit(".", 1)[-1], -f["size"])

# 2. Use map() and lambda to create slugs from titles:
titles = ["Introduction to Python", "Data Structures & Algorithms", "REST APIs with FastAPI"]
# Expected: ["introduction-to-python", "data-structures--algorithms", "rest-apis-with-fastapi"]
slugs = list(map(lambda t: t.lower().replace(" ", "-"), titles))
\`\`\`
`,
  },

  'intermediate-functions-advanced-map-filter-reduce': {
    readTime: 8,
    whatYoullLearn: [
      'Transform every element in a sequence with map()',
      'Select elements matching a condition with filter()',
      'Aggregate a sequence into a single value with reduce()',
      'Understand lazy evaluation — map and filter return iterators',
      'Choose between these functions and list comprehensions idiomatically',
    ],
    content: `
## map() — Transform Every Element

\`map(function, iterable)\` applies a function to every element, returning a **lazy iterator** (no computation until you consume it):

\`\`\`python
# Basic map with lambda
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)   # [2, 4, 6, 8, 10]

# map with an existing function (no lambda needed)
strings = ["1", "2", "3", "4", "5"]
ints = list(map(int, strings))   # pass function name directly
print(ints)     # [1, 2, 3, 4, 5]

# map with multiple iterables — stops at shortest
a = [1, 2, 3]
b = [10, 20, 30]
sums = list(map(lambda x, y: x + y, a, b))
print(sums)   # [11, 22, 33]

# Equivalent with zip + comprehension (often clearer):
sums = [x + y for x, y in zip(a, b)]

# map is LAZY — nothing executes until iterated
big_list = range(10_000_000)
mapped = map(lambda x: x**2, big_list)  # instant — no computation yet
first_5 = [next(mapped) for _ in range(5)]  # only 5 values computed
\`\`\`

## filter() — Keep Matching Elements

\`filter(function, iterable)\` returns only the elements for which the function returns \`True\`:

\`\`\`python
numbers = [-3, -1, 0, 1, 2, 5, -2, 8]

# Keep positives
positives = list(filter(lambda x: x > 0, numbers))
print(positives)   # [1, 2, 5, 8]

# filter(None, iterable) — removes falsy values
mixed = [0, 1, "", "hello", None, [], [1, 2], False, True]
truthy = list(filter(None, mixed))
print(truthy)   # [1, 'hello', [1, 2], True]

# Filter a list of dicts
users = [
    {"name": "Alice", "active": True,  "score": 90},
    {"name": "Bob",   "active": False, "score": 85},
    {"name": "Carol", "active": True,  "score": 78},
    {"name": "Dave",  "active": True,  "score": 65},
]
active_users = list(filter(lambda u: u["active"], users))
high_scorers = list(filter(lambda u: u["active"] and u["score"] >= 80, users))

# Equivalent comprehension (usually preferred for complex conditions):
high_scorers = [u for u in users if u["active"] and u["score"] >= 80]

# filter also supports callable objects (not just lambdas):
def is_valid_email(email: str) -> bool:
    return "@" in email and "." in email.split("@")[-1]

emails = ["alice@example.com", "not-valid", "bob@test.org", "broken@"]
valid = list(filter(is_valid_email, emails))
print(valid)   # ['alice@example.com', 'bob@test.org']
\`\`\`

## reduce() — Aggregate to One Value

\`functools.reduce(function, iterable, initial=None)\` applies a function cumulatively, left to right, reducing the sequence to a single value:

\`\`\`python
from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Sum — reduce((((1+2)+3)+4)+5)
total = reduce(lambda acc, x: acc + x, numbers)
print(total)   # 15

# The same as:
# Step 1: acc=1, x=2  → 3
# Step 2: acc=3, x=3  → 6
# Step 3: acc=6, x=4  → 10
# Step 4: acc=10, x=5 → 15

# With initial value
total_with_start = reduce(lambda acc, x: acc + x, numbers, 100)
print(total_with_start)   # 115 (starts from 100)

# Maximum (prefer max() in real code):
maximum = reduce(lambda a, b: a if a > b else b, numbers)
print(maximum)   # 5

# Flatten a list of lists
nested = [[1, 2], [3, 4], [5, 6]]
flat = reduce(lambda acc, lst: acc + lst, nested, [])
print(flat)   # [1, 2, 3, 4, 5, 6]

# Merge dicts (left to right)
configs = [{"host": "localhost"}, {"port": 8080}, {"debug": True}]
merged = reduce(lambda acc, d: {**acc, **d}, configs, {})
print(merged)   # {'host': 'localhost', 'port': 8080, 'debug': True}

# Build a factorial using reduce (educational — use math.factorial in production):
factorial = reduce(lambda acc, x: acc * x, range(1, 6), 1)
print(factorial)   # 120
\`\`\`

## Chaining map + filter + reduce

These three functions can be composed into powerful data pipelines:

\`\`\`python
from functools import reduce

# Pipeline: start → filter → transform → aggregate
sales = [
    {"product": "Widget", "amount": 150.0, "region": "US"},
    {"product": "Gadget", "amount": 75.0,  "region": "EU"},
    {"product": "Widget", "amount": 200.0, "region": "US"},
    {"product": "Doohickey", "amount": 50.0, "region": "US"},
    {"product": "Gadget", "amount": 125.0, "region": "EU"},
]

# Total US Widget revenue
us_widget_total = reduce(
    lambda acc, x: acc + x,
    map(
        lambda s: s["amount"],
        filter(lambda s: s["region"] == "US" and s["product"] == "Widget", sales)
    ),
    0
)
print(f"US Widget revenue: \${us_widget_total:.2f}")   # $350.00

# EQUIVALENT with comprehension (much clearer!):
us_widget_total = sum(
    s["amount"]
    for s in sales
    if s["region"] == "US" and s["product"] == "Widget"
)
\`\`\`

## map/filter vs Comprehensions — When to Use Which

\`\`\`python
# Prefer COMPREHENSIONS when:
# - The logic involves conditions (filter + map together)
# - The transformation is more than a one-liner
# - Readability matters to your team

squares = [x**2 for x in range(10) if x % 2 == 0]   # ← clearest

# Prefer MAP when:
# - You have an existing function to apply (no lambda overhead)
# - You're working with large data and want lazy evaluation
# - You need to apply a function to multiple parallel iterables

import json
parsed = list(map(json.loads, json_strings))   # ← cleaner than a comprehension

# Prefer FILTER when:
# - filter(None, iterable) to remove falsy values (idiomatic)
# - You have an existing validator function to reuse

cleaned = list(filter(None, [0, "a", "", None, "b"]))  # ← idiomatic

# Prefer REDUCE when:
# - Custom fold/accumulation that no built-in handles
# - Building merged data structures progressively
\`\`\`

## Try It Yourself

\`\`\`python
from functools import reduce

data = [
    {"name": "Alice", "scores": [85, 90, 92], "dept": "Engineering"},
    {"name": "Bob",   "scores": [70, 75, 80], "dept": "Marketing"},
    {"name": "Carol", "scores": [95, 98, 91], "dept": "Engineering"},
    {"name": "Dave",  "scores": [60, 65, 70], "dept": "Marketing"},
    {"name": "Eve",   "scores": [88, 84, 91], "dept": "Engineering"},
]

# 1. Use map() to add an "average" key to each record
enriched = list(map(lambda r: {**r, "average": sum(r["scores"]) / len(r["scores"])}, data))

# 2. Use filter() to keep only Engineering employees with avg >= 90
top_eng = list(filter(
    lambda r: r["dept"] == "Engineering" and r["average"] >= 90,
    enriched
))

# 3. Use reduce() to find the highest average across all filtered employees
best_avg = reduce(lambda acc, r: max(acc, r["average"]), top_eng, 0)
print(f"Highest avg in top Engineering: {best_avg:.1f}")
\`\`\`
`,
  },

  'intermediate-string-manipulation-slicing-formatting-regex': {
    readTime: 11,
    whatYoullLearn: [
      'Master advanced string slicing: start, stop, step, and negative indices',
      'Format numbers with precision, alignment, sign, and padding using f-strings',
      'Write regular expressions with common metacharacters',
      'Use re.search(), re.findall(), re.sub(), and re.compile() effectively',
      'Extract data from text using capturing groups and named groups',
    ],
    content: `
## Advanced String Slicing

Slicing extracts a substring from a string using \`s[start:stop:step]\`:

\`\`\`python
s = "Hello, Python World!"
#    0123456789...         (forward indices)
#    ...         -1-2-3... (backward from end)

# Basic slices
print(s[7:13])      # "Python"   — from index 7 up to (not including) 13
print(s[-6:])       # "World!"   — last 6 characters
print(s[:5])        # "Hello"    — first 5 characters
print(s[7:13:2])    # "Pto"      — every 2nd char of "Python"
print(s[::-1])      # "!dlroW nohtyP ,olleH" — reversed

# Step tricks
text = "abcdefghij"
print(text[::2])     # "acegi"  — every other char (even indices)
print(text[1::2])    # "bdfhj"  — every other char (odd indices)
print(text[::-2])    # "jhfdb"  — every other char, reversed

# Real-world uses
isbn = "978-0-13-468599-1"
digits_only = isbn.replace("-", "")
print(digits_only[:-1])    # all but check digit
print(digits_only[-1])     # check digit

def is_palindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome("A man a plan a canal Panama"))   # True
print(is_palindrome("racecar"))                        # True
print(is_palindrome("hello"))                          # False

# Rotate a string by n positions
def rotate(s: str, n: int) -> str:
    n %= len(s)
    return s[n:] + s[:n]

print(rotate("abcdef", 2))    # "cdefab"
print(rotate("abcdef", -2))   # "efabcd"
\`\`\`

## Advanced f-string Formatting

F-strings support a rich mini-language inside \`{value:format_spec}\`:

\`\`\`python
pi = 3.14159265358979
big_num = 1_234_567.89
name = "Python"
n = 42

# Number precision
print(f"{pi:.2f}")          # "3.14"       — 2 decimal places
print(f"{pi:.5f}")          # "3.14159"
print(f"{pi:.4e}")          # "3.1416e+00" — scientific notation
print(f"{pi:.2%}")          # "314.16%"    — as percentage
print(f"{big_num:,.2f}")    # "1,234,567.89" — thousands separator
print(f"{big_num:_.2f}")    # "1_234_567.89" — underscore separator

# Integer formatting
print(f"{n:08d}")           # "00000042"   — zero-padded to 8 wide
print(f"{n:+d}")            # "+42"        — force sign
print(f"{255:#x}")          # "0xff"       — hex with prefix
print(f"{255:#010x}")       # "0x000000ff" — zero-padded hex
print(f"{0b1010:08b}")      # "00001010"   — binary, 8 wide
print(f"{255:o}")           # "377"        — octal

# String alignment
print(f"{'left':<10}|")     # "left      |"
print(f"{'right':>10}|")    # "     right|"
print(f"{'center':^10}|")   # "  center  |"
print(f"{'fill':*^10}|")    # "***fill***|"
print(f"{'fill':-^10}|")    # "---fill---|"

# Format expressions and calls inside f-strings
items = [3, 1, 4, 1, 5, 9]
print(f"Max: {max(items)}, Sum: {sum(items)}, Avg: {sum(items)/len(items):.1f}")
print(f"Name upper: {name.upper()!r}")     # !r for repr
print(f"Pi repr: {pi!r}")                  # includes full precision

# Formatting a table
print(f"{'Name':<12} {'Score':>8} {'Grade':^6}")
print("-" * 28)
data = [("Alice", 95.5, "A"), ("Bob", 82.0, "B"), ("Carol", 78.3, "C")]
for name, score, grade in data:
    print(f"{name:<12} {score:>8.1f} {grade:^6}")
\`\`\`

## Regular Expressions

Regex is a pattern language for matching text. Python\\'s \`re\` module implements it:

\`\`\`python
import re

# Quick reference:
# .     any char except newline     \d   digit [0-9]
# *     0 or more                   \w   word char [a-zA-Z0-9_]
# +     1 or more                   \s   whitespace
# ?     0 or 1 (optional)           \b   word boundary
# {n}   exactly n                   ^    start of string
# {n,m} n to m                      $    end of string
# [abc] any of a, b, c              |    or
# [^ab] NOT a or b                  ()   capturing group

text = "Alice scored 95 and Bob scored 82 on 2025-03-04"

# re.findall — returns all matches as a list
numbers = re.findall(r'\d+', text)
print(numbers)    # ['95', '82', '2025', '03', '04']

names = re.findall(r'[A-Z][a-z]+', text)
print(names)      # ['Alice', 'Bob', 'March']

# re.search — find first match anywhere (returns Match object or None)
m = re.search(r'(\d{4})-(\d{2})-(\d{2})', text)
if m:
    print(m.group(0))    # "2025-03-04" — full match
    print(m.group(1))    # "2025"        — group 1
    print(m.group(2))    # "03"          — group 2
    print(m.span())      # (38, 48)      — start, end positions

# re.match — match ONLY at the start of the string
if re.match(r'Alice', text):
    print("Starts with Alice!")

# re.sub — search and replace
clean = re.sub(r'\s+', ' ', "too   many    spaces")
print(clean)    # "too many spaces"

censored = re.sub(r'\b\d+\b', '**', text)
print(censored)  # "Alice scored ** and Bob scored ** on ****-**-**"
\`\`\`

## Capturing Groups and Named Groups

\`\`\`python
import re

# Extracting emails from text
email_pattern = re.compile(
    r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    re.IGNORECASE
)
text = "Contact us at support@example.com or SALES@COMPANY.ORG"
emails = email_pattern.findall(text)
print(emails)   # ['support@example.com', 'SALES@COMPANY.ORG']

# Named groups — much more readable than positional groups
log_line = "2025-03-04 14:30:45 ERROR Database connection failed"
log_pattern = re.compile(
    r'(?P<date>\d{4}-\d{2}-\d{2})\s+'
    r'(?P<time>\d{2}:\d{2}:\d{2})\s+'
    r'(?P<level>\w+)\s+'
    r'(?P<message>.+)'
)

m = log_pattern.match(log_line)
if m:
    print(m.group("date"))     # "2025-03-04"
    print(m.group("level"))    # "ERROR"
    print(m.group("message"))  # "Database connection failed"
    print(m.groupdict())       # {'date': ..., 'time': ..., 'level': ..., 'message': ...}

# finditer — like findall but returns Match objects with position info
text = "Price: $14.99, Sale: $9.99, Tax: $1.50"
for m in re.finditer(r'\\\$(\d+\.\d{2})', text):
    print(f"Found \${m.group(1)} at position {m.start()}")
\`\`\`

## Practical Patterns

\`\`\`python
import re

def validate_email(email: str) -> bool:
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

def validate_phone(phone: str) -> bool:
    return bool(re.match(r'^\+?1?\s*[-.(]?\d{3}[-.)]\s*\d{3}[-. ]\d{4}$', phone))

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)     # remove non-word chars
    text = re.sub(r'[-\s]+', '-', text)       # replace spaces/hyphens
    return text.strip('-')

print(slugify("Hello, World! This is a Test"))  # "hello-world-this-is-a-test"
print(slugify("  Python 3.12  "))               # "python-312"

def extract_urls(text: str) -> list:
    return re.findall(r'https?://\\S+', text)  # simplified: match non-whitespace

text = "Visit https://python.org and http://docs.python.org/3/ for docs."
print(extract_urls(text))
\`\`\`

## Try It Yourself

\`\`\`python
import re

# 1. Parse log lines and extract structured data
logs = [
    "2025-03-04 14:30:45 INFO  [app.main] Server started on port 8080",
    "2025-03-04 14:31:02 ERROR [app.db]   Connection timeout after 30s",
    "2025-03-04 14:31:15 WARN  [app.auth] Failed login attempt from 192.168.1.42",
]

pattern = re.compile(
    r'(?P<date>\\d{4}-\\d{2}-\\d{2})\\s+(?P<time>\\d{2}:\\d{2}:\\d{2})\\s+'
    r'(?P<level>\\w+)\\s+\\[(?P<module>[^\\]]+)\\]\\s+(?P<message>.+)'
)

parsed = [m.groupdict() for log in logs if (m := pattern.match(log))]
errors = [p for p in parsed if p["level"] == "ERROR"]
print(f"Found {len(errors)} error(s):")
for e in errors:
    print(f"  {e['time']} [{e['module']}] {e['message']}")

# 2. Format a table of products with aligned columns:
products = [("Widget Pro", 19.99, 1243), ("Gadget Mini", 5.49, 8921), ("Doohickey", 149.99, 47)]
print(f"\n{'Product':<15} {'Price':>10} {'Stock':>8}")
print("-" * 35)
for name, price, stock in products:
    flag = " ⚠️" if stock < 100 else ""
    print(f"{name:<15} {price:>10,.2f} {stock:>8,}{flag}")
\`\`\`
`,
  },

  'intermediate-file-handling-reading-writing-files': {
    readTime: 9,
    whatYoullLearn: [
      'Open files safely with context managers (with open())',
      'Read files completely, line by line, or in binary chunks',
      'Write and append text and binary data to files',
      'Handle encoding correctly for international text',
      'Process CSV and JSON files using the standard library',
    ],
    content: `
## Why Context Managers for Files?

Opening a file creates a system resource. If your code crashes before calling \`f.close()\`, the file stays open — leading to resource leaks, data corruption, or locked files. The \`with\` statement guarantees cleanup:

\`\`\`python
# ✗ Fragile — f.close() might never run
f = open("data.txt", "r")
content = f.read()
process(content)   # if this raises, f is never closed!
f.close()

# ✓ Safe — file is always closed, even if an exception occurs
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
    process(content)
# f is closed here, no matter what happened inside

# Multiple files in one with:
with open("input.txt") as src, open("output.txt", "w") as dst:
    dst.write(src.read().upper())
\`\`\`

## File Modes

\`\`\`python
# Text modes (default encoding depends on OS — always specify!)
open("file.txt", "r")    # read (default) — raises FileNotFoundError if missing
open("file.txt", "w")    # write — creates or OVERWRITES
open("file.txt", "a")    # append — creates or adds to end
open("file.txt", "x")    # exclusive create — raises FileExistsError if exists
open("file.txt", "r+")   # read+write — file must exist

# Binary modes (add 'b')
open("image.png", "rb")  # read binary
open("data.bin", "wb")   # write binary

# Always specify encoding for text files:
open("readme.md", "r", encoding="utf-8")        # recommended
open("legacy.txt", "r", encoding="latin-1")     # for old files
open("file.txt", "r", encoding="utf-8-sig")     # handles BOM from Windows
\`\`\`

## Reading Files

\`\`\`python
# 1. Read everything at once (fine for small files)
with open("config.txt", encoding="utf-8") as f:
    text = f.read()
    print(f"Read {len(text)} characters")

# 2. Read line by line (memory-efficient for large files)
with open("server.log", encoding="utf-8") as f:
    for line in f:              # file object is an iterator over lines
        line = line.rstrip('\n')  # remove trailing newline
        if "ERROR" in line:
            print(line)

# 3. Read all lines into a list
with open("poem.txt", encoding="utf-8") as f:
    lines = f.read().splitlines()   # strips newlines cleanly
    # OR: lines = f.readlines()      # keeps \n at end of each line

# 4. Read in chunks (for very large files or network streams)
def process_large_file(path: str, chunk_size: int = 65536) -> None:
    """Read a binary file in 64KB chunks."""
    with open(path, "rb") as f:
        while chunk := f.read(chunk_size):
            process_chunk(chunk)

# 5. Random access with seek/tell
with open("data.bin", "rb") as f:
    f.seek(100)                  # move to byte 100
    data = f.read(50)            # read 50 bytes
    position = f.tell()          # current position: 150
    f.seek(0)                    # rewind to start
    f.seek(-10, 2)               # 10 bytes from end
\`\`\`

## Writing Files

\`\`\`python
# Write text
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.write("Second line\n")
    f.writelines(["three\n", "four\n", "five\n"])  # list of strings

# Write many lines efficiently
lines = [f"Item {i}: value={i**2}" for i in range(1000)]
with open("items.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

# Append to an existing file
import datetime
with open("app.log", "a", encoding="utf-8") as f:
    timestamp = datetime.datetime.now().isoformat()
    f.write(f"{timestamp} INFO Server restarted\n")

# Write binary
with open("data.bin", "wb") as f:
    f.write(bytes([0x00, 0xFF, 0x42, 0x13]))
    import struct
    f.write(struct.pack(">I", 1234567890))  # big-endian unsigned int

# Atomic write (write to temp, then rename — prevents partial writes)
import tempfile, os, pathlib

def atomic_write(path: str, content: str) -> None:
    """Write atomically — either the whole content or nothing."""
    dir_ = os.path.dirname(os.path.abspath(path))
    fd, tmp_path = tempfile.mkstemp(dir=dir_)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
        os.replace(tmp_path, path)   # atomic on POSIX
    except Exception:
        os.unlink(tmp_path)
        raise
\`\`\`

## CSV Files

\`\`\`python
import csv

# Read CSV — DictReader is usually the right choice
with open("students.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print(f"Columns: {reader.fieldnames}")
    students = list(reader)   # list of dicts

# Access by column name (not index)
for student in students:
    name = student["name"]
    score = float(student["score"])

# Write CSV
students = [
    {"name": "Alice", "score": 95.5, "grade": "A"},
    {"name": "Bob",   "score": 82.0, "grade": "B"},
]
with open("grades.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score", "grade"])
    writer.writeheader()
    writer.writerows(students)

# Handle special cases
with open("data.csv", newline="") as f:
    reader = csv.reader(f, delimiter="\t", quotechar="'")  # TSV with single quotes
    for row in reader:
        print(row)
\`\`\`

## JSON Files

\`\`\`python
import json
from pathlib import Path

# Read
with open("config.json", encoding="utf-8") as f:
    config = json.load(f)

# Alternative using pathlib (no explicit open needed):
config = json.loads(Path("config.json").read_text(encoding="utf-8"))

# Write with indentation
data = {
    "users": [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}],
    "count": 2,
    "updated": "2025-03-04",
}
with open("output.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False, sort_keys=True)

# Handle non-serializable types
import datetime
def json_serializer(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

with open("output.json", "w") as f:
    json.dump({"timestamp": datetime.datetime.now()}, f, default=json_serializer)
\`\`\`

## Try It Yourself

\`\`\`python
import csv, json
from pathlib import Path

# 1. Write a function that reads a CSV file and returns
#    a list of dicts, with numeric columns automatically converted:

def read_csv_typed(path: str) -> list:
    """Read CSV and auto-convert numeric values."""
    def try_convert(value):
        try:
            return int(value)
        except ValueError:
            try:
                return float(value)
            except ValueError:
                return value

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [
            {k: try_convert(v) for k, v in row.items()}
            for row in reader
        ]

# 2. Write a function that converts a CSV file to a JSON file:
def csv_to_json(csv_path: str, json_path: str) -> None:
    data = read_csv_typed(csv_path)
    Path(json_path).write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
\`\`\`
`,
  },

  'intermediate-file-handling-with-open-os-pathlib': {
    readTime: 9,
    whatYoullLearn: [
      'Use pathlib.Path for modern, readable file system operations',
      'Navigate and manipulate paths with the / operator',
      'Check if files and directories exist before accessing them',
      'List, create, move, copy, and delete files and directories',
      'Find files recursively using glob patterns',
    ],
    content: `
## Why pathlib Instead of os.path?

Before Python 3.4, file paths were just strings and required the \`os.path\` module:

\`\`\`python
# Old way with os.path (still works, often seen in older codebases)
import os
path = os.path.join(os.path.expanduser("~"), "documents", "report.pdf")
name = os.path.basename(path)          # "report.pdf"
dir_ = os.path.dirname(path)           # "/home/user/documents"
ext  = os.path.splitext(name)[1]       # ".pdf"
exists = os.path.exists(path)           # True/False

# Modern way with pathlib (Python 3.4+)
from pathlib import Path
path = Path.home() / "documents" / "report.pdf"   # / joins path components!
name = path.name                        # "report.pdf"
dir_ = path.parent                      # Path object, not string
ext  = path.suffix                      # ".pdf"
exists = path.exists()                  # True/False
\`\`\`

## Creating Path Objects

\`\`\`python
from pathlib import Path

# From string
p1 = Path("/usr/local/bin/python3")
p2 = Path("relative/path/to/file.txt")  # relative to CWD

# Current directory and home directory
cwd = Path.cwd()
home = Path.home()

# Joining paths with / operator
config = home / ".config" / "myapp" / "settings.json"
log_dir = Path("/var") / "log" / "myapp"

# From multiple components
reports = Path("/", "var", "data", "reports")   # same as Path("/var/data/reports")

# Useful properties
p = Path("/home/alice/projects/myapp/src/main.py")
print(p.name)       # "main.py"       — filename with extension
print(p.stem)       # "main"          — filename without extension
print(p.suffix)     # ".py"           — extension (with dot)
print(p.suffixes)   # ['.py']         — all extensions (e.g. ['.tar', '.gz'])
print(p.parent)     # /home/alice/projects/myapp/src
print(p.parents[1]) # /home/alice/projects/myapp — grandparent
print(p.parts)      # ('/', 'home', 'alice', 'projects', 'myapp', 'src', 'main.py')
print(p.root)       # "/"
print(p.drive)      # "" (on Unix), "C:" (on Windows)
print(p.is_absolute())  # True
print(p.stem.upper() + p.suffix)  # "MAIN.py"

# Change parts of a path
new_path = p.with_name("utils.py")    # /home/.../src/utils.py
new_ext  = p.with_suffix(".pyi")      # /home/.../src/main.pyi
new_stem = p.with_stem("app")         # /home/.../src/app.py  (3.9+)
\`\`\`

## Checking and Reading

\`\`\`python
from pathlib import Path

p = Path("data/config.json")

# Existence checks
print(p.exists())     # True if path exists at all
print(p.is_file())    # True if it exists and is a regular file
print(p.is_dir())     # True if it exists and is a directory
print(p.is_symlink()) # True if it's a symbolic link

# File metadata
if p.exists():
    stat = p.stat()
    print(f"Size: {stat.st_size:,} bytes")
    import datetime
    mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
    print(f"Modified: {mtime:%Y-%m-%d %H:%M:%S}")

# Read/write text and bytes
text = p.read_text(encoding="utf-8")        # read entire file
p.write_text("new content\n", encoding="utf-8")  # write entire file

data = p.read_bytes()                         # read as bytes
p.write_bytes(b"\x00\x01\x02")

# Resolve: make path absolute and resolve symlinks
resolved = Path("../relative/../path").resolve()
print(resolved)   # absolute, normalized path

# Make path relative to another
full = Path("/home/alice/projects/myapp/src/main.py")
rel = full.relative_to("/home/alice/projects")
print(rel)   # myapp/src/main.py
\`\`\`

## Creating, Moving, and Deleting

\`\`\`python
from pathlib import Path
import shutil

# Create directory
Path("output").mkdir()                              # raises if already exists
Path("output/data/processed").mkdir(parents=True, exist_ok=True)  # all in one

# Rename / Move (within same filesystem)
old = Path("draft.txt")
new = old.rename("final.txt")                       # same directory
moved = old.rename(Path("archive") / "draft.txt")   # different directory

# Copy (use shutil for copying — pathlib doesn't have copy)
shutil.copy("source.txt", "dest.txt")              # copies file
shutil.copy2("source.txt", "dest.txt")             # copies with metadata
shutil.copytree("src_dir", "dst_dir")              # copies entire directory

# Delete
Path("temp.txt").unlink(missing_ok=True)           # delete file (no error if missing)
Path("empty_dir").rmdir()                           # delete empty directory
shutil.rmtree("build_dir")                          # delete directory and all contents

# Touch (create empty file or update timestamp)
Path("log.txt").touch(exist_ok=True)

# Atomic rename (safe for concurrent writes)
import tempfile, os
def safe_write(path: Path, content: str) -> None:
    tmp = path.with_suffix(".tmp")
    tmp.write_text(content, encoding="utf-8")
    tmp.rename(path)   # atomic on POSIX
\`\`\`

## Listing and Globbing

\`\`\`python
from pathlib import Path

project = Path(".")

# List direct children
for item in project.iterdir():
    kind = "DIR " if item.is_dir() else "FILE"
    print(f"{kind} {item.name}")

# Glob — find files matching a pattern (* = any chars in one level)
py_files = list(project.glob("*.py"))                  # .py in current dir only
md_files = list(project.glob("docs/*.md"))             # .md in docs/

# Recursive glob — ** crosses directory boundaries
all_py = list(project.rglob("*.py"))                   # all .py recursively
all_tests = list(project.rglob("test_*.py"))           # test files anywhere
large_files = [f for f in project.rglob("*")
               if f.is_file() and f.stat().st_size > 1_000_000]

# Sorted and filtered iteration
for py_file in sorted(project.rglob("*.py")):
    size = py_file.stat().st_size
    rel = py_file.relative_to(project)
    print(f"{rel}: {size:,} bytes")

# Count files by extension
from collections import Counter
ext_counts = Counter(
    f.suffix.lower()
    for f in project.rglob("*")
    if f.is_file()
)
print(ext_counts.most_common(5))
\`\`\`

## os.path for Legacy Compatibility

\`\`\`python
import os, os.path

# Common os.path functions (prefer pathlib for new code):
path = os.path.join("home", "alice", "doc.txt")   # platform-aware join
print(os.path.abspath("."))                         # absolute path
print(os.path.expanduser("~"))                      # home directory
print(os.path.expandvars("$HOME/data"))             # expand env vars
print(os.path.splitext("data.tar.gz"))              # ('data.tar', '.gz')
print(os.path.isfile(path))                         # True/False
print(os.path.getsize(path))                        # file size in bytes

# Walk directory tree (no pathlib equivalent):
for root, dirs, files in os.walk("project"):
    # Modify dirs in-place to control traversal
    dirs[:] = [d for d in dirs if not d.startswith(".")]  # skip hidden
    for file in files:
        full_path = os.path.join(root, file)
        print(full_path)
\`\`\`

## Try It Yourself

\`\`\`python
from pathlib import Path
import shutil, json

# 1. Write a function that builds an inventory of all files
#    under a directory, returning a dict of {relative_path: size_in_bytes}
def file_inventory(root: str) -> dict:
    base = Path(root)
    return {
        str(f.relative_to(base)): f.stat().st_size
        for f in base.rglob("*")
        if f.is_file()
    }

# 2. Write a function that organizes files in a directory
#    by moving them into subdirectories named by extension:
def organize_by_extension(directory: str) -> None:
    base = Path(directory)
    for file in base.iterdir():
        if file.is_file() and file.suffix:
            ext_dir = base / file.suffix.lstrip(".")
            ext_dir.mkdir(exist_ok=True)
            file.rename(ext_dir / file.name)
            print(f"Moved {file.name} → {ext_dir.name}/")
\`\`\`
`,
  },

  'intermediate-modules-packages-importing-custom-modules': {
    readTime: 9,
    whatYoullLearn: [
      'Import modules with different forms of the import statement',
      'Create Python modules and understand the __name__ variable',
      'Organize code into packages with __init__.py',
      'Control what gets exported with __all__',
      'Understand the module search path and how to customize it',
    ],
    content: `
## The Four Forms of Import

\`\`\`python
# 1. Import the whole module — access names via module.name
import math
print(math.sqrt(16))     # 4.0
print(math.pi)           # 3.14159...

# 2. Import specific names — access without prefix
from math import sqrt, pi, ceil
print(sqrt(25))          # 5.0 — no math. prefix needed

# 3. Import with an alias — rename for brevity
import numpy as np                   # industry convention
import pandas as pd                  # industry convention
from datetime import datetime as dt  # shorten long name

# 4. Import all — avoid in production code!
from math import *   # imports everything not starting with _
# ✗ Pollutes namespace, unclear where names come from

# Best practice: prefer explicit imports
from pathlib import Path
from typing import Optional, Union, List
\`\`\`

## Creating Your Own Module

Any \`.py\` file is a module. The filename (without \`.py\`) is the module name:

\`\`\`python
# validators.py
"""Input validation utilities."""

import re

EMAIL_RE = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')

def is_email(value: str) -> bool:
    """Return True if value is a valid email address."""
    return bool(EMAIL_RE.match(value))

def is_positive_int(value) -> bool:
    """Return True if value is a positive integer."""
    try:
        return int(value) > 0
    except (TypeError, ValueError):
        return False

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Return value clamped to [min_val, max_val]."""
    return max(min_val, min(max_val, value))

# This block ONLY runs when the file is executed directly (not imported):
if __name__ == "__main__":
    # Quick self-test
    assert is_email("alice@example.com") is True
    assert is_email("not-an-email") is False
    assert is_positive_int(5) is True
    assert is_positive_int(-1) is False
    assert clamp(15, 0, 10) == 10
    print("All tests passed!")
\`\`\`

\`\`\`python
# main.py — use the module
from validators import is_email, clamp
import validators  # can also access as module

print(is_email("alice@example.com"))    # True
print(validators.clamp(-5, 0, 100))     # 0

# __name__ in imported module is "validators" (not "__main__")
# So the if __name__ == "__main__" block does NOT run
\`\`\`

## The __name__ Variable Explained

\`\`\`python
# demo.py
print(f"__name__ is: {__name__}")

def greet():
    print("Hello from demo.py!")

if __name__ == "__main__":
    greet()
    print("Running as a script")
\`\`\`

\`\`\`bash
$ python3 demo.py
# __name__ is: __main__
# Hello from demo.py!
# Running as a script

$ python3 -c "import demo"
# __name__ is: demo
# (the if block does NOT run)
\`\`\`

## Creating a Package

A **package** is a directory containing an \`__init__.py\` file, allowing you to organize modules hierarchically:

\`\`\`
myapp/
├── __init__.py           # makes myapp a package
├── models/
│   ├── __init__.py       # makes models a subpackage
│   ├── user.py
│   └── product.py
├── utils/
│   ├── __init__.py
│   ├── validators.py
│   └── formatters.py
└── api/
    ├── __init__.py
    └── routes.py
\`\`\`

\`\`\`python
# myapp/__init__.py — expose the public API
from .models.user import User
from .models.product import Product
from .utils.validators import is_email

# Users can now do:
# from myapp import User, is_email
# instead of:
# from myapp.models.user import User
# from myapp.utils.validators import is_email

__version__ = "1.0.0"
__all__ = ["User", "Product", "is_email"]   # controls 'from myapp import *'
\`\`\`

\`\`\`python
# myapp/models/user.py
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str

    def __post_init__(self):
        if "@" not in self.email:
            raise ValueError(f"Invalid email: {self.email!r}")
\`\`\`

## Import Styles and Relative Imports

\`\`\`python
# Inside myapp/api/routes.py:

# Absolute imports (recommended):
from myapp.models.user import User
from myapp.utils.validators import is_email

# Relative imports (within the same package):
from ..models.user import User          # .. = parent package (myapp)
from ..utils.validators import is_email
from .helpers import format_response    # . = same package (api)

# Why relative? Relocatable — doesn't depend on package name
\`\`\`

## The Module Search Path

When you \`import mymodule\`, Python searches these locations in order:

\`\`\`python
import sys

# sys.path is the list of directories Python searches:
for path in sys.path:
    print(path)
# 1. '' or the script directory (current directory)
# 2. PYTHONPATH environment variable directories
# 3. Installation-dependent defaults (site-packages, stdlib, ...)

# Add a directory temporarily:
sys.path.insert(0, "/path/to/my/modules")
import mymodule   # now finds it

# Permanent: set PYTHONPATH environment variable
# export PYTHONPATH=/path/to/my/modules:$PYTHONPATH

# Find where a module lives:
import requests
print(requests.__file__)   # /path/to/site-packages/requests/__init__.py

# Reload a module after changes (useful in interactive sessions):
import importlib
importlib.reload(mymodule)
\`\`\`

## __all__ — Controlling the Public API

\`\`\`python
# mypackage/utils.py

__all__ = ["clamp", "truncate"]   # only these are exported with 'from utils import *'
                                    # also documents the public API

def clamp(value, min_val, max_val):
    return max(min_val, min(max_val, value))

def truncate(text, max_len, ellipsis="..."):
    if len(text) <= max_len:
        return text
    return text[:max_len - len(ellipsis)] + ellipsis

def _internal_helper():   # prefixed with _ — not exported, private by convention
    pass
\`\`\`

## Try It Yourself

\`\`\`python
# Create a package structure:
# geometry/
# ├── __init__.py       (exports: circle, rectangle, triangle)
# ├── circle.py         (area, circumference)
# ├── rectangle.py      (area, perimeter, is_square)
# └── triangle.py       (area, perimeter, classify)

# circle.py
import math

def area(radius: float) -> float:
    """Area of a circle: π r²"""
    return math.pi * radius ** 2

def circumference(radius: float) -> float:
    """Circumference of a circle: 2πr"""
    return 2 * math.pi * radius

if __name__ == "__main__":
    r = 5
    print(f"Circle r={r}: area={area(r):.2f}, circ={circumference(r):.2f}")

# geometry/__init__.py
from . import circle, rectangle, triangle
__version__ = "0.1.0"
\`\`\`
`,
  },

  'intermediate-modules-packages-venv-pip': {
    readTime: 9,
    whatYoullLearn: [
      'Understand why virtual environments are essential',
      'Create, activate, and deactivate virtual environments with venv',
      'Install, upgrade, and uninstall packages with pip',
      'Freeze dependencies and reproduce environments with requirements.txt',
      'Understand modern alternatives: pyenv, pipenv, poetry, and uv',
    ],
    content: `
## The Problem: Global Python Is a Mess

Without virtual environments, all packages install globally into your Python installation. This causes three problems:

\`\`\`
Project A needs requests==2.28.0
Project B needs requests==2.31.0
→ You can only have ONE installed globally!

Project C needs Django==3.2 (Python 3.8 support)
Project D needs Django==4.2 (Python 3.10+)
→ Conflicting requirements!

Deploying to production: what packages are installed?
→ "Works on my machine" syndrome
\`\`\`

**Solution**: Each project gets its own isolated Python environment with its own packages.

## Creating and Activating venv

\`\`\`bash
# Create virtual environment (venv is built into Python 3)
cd my_project/
python3 -m venv venv          # creates venv/ directory

# The venv/ directory contains:
# venv/bin/python3            — isolated Python interpreter
# venv/bin/pip                — isolated pip
# venv/lib/python3.x/         — installed packages go here
# venv/pyvenv.cfg             — records Python version

# Activate — changes PATH so venv/bin comes first
source venv/bin/activate        # macOS / Linux
venv\\Scripts\\activate.bat      # Windows CMD
venv\\Scripts\\Activate.ps1     # Windows PowerShell
. venv/bin/activate             # short form (macOS/Linux)

# Prompt changes: (venv) $ ← you know you're in a venv!
(venv) $ which python3          # .../my_project/venv/bin/python3
(venv) $ python3 -c "import sys; print(sys.prefix)"  # .../venv

# Deactivate when done
(venv) $ deactivate
$ which python3                 # back to system Python
\`\`\`

## pip — Package Manager

\`\`\`bash
# Install packages
pip install requests                   # latest stable version
pip install "requests>=2.28,<3.0"      # version range
pip install requests==2.31.0           # exact version
pip install "django[argon2]"           # with extras/optional deps
pip install git+https://github.com/org/repo.git  # from git

# Upgrade
pip install --upgrade requests         # upgrade to latest
pip install --upgrade pip              # upgrade pip itself (do this first!)

# Uninstall
pip uninstall requests                 # remove one package
pip uninstall -r requirements.txt      # remove all listed

# Inspect
pip list                               # all installed packages
pip list --outdated                    # packages with newer versions
pip show requests                      # details: version, location, deps
pip check                              # verify no broken dependencies

# Download without installing (for offline use)
pip download -r requirements.txt -d ./wheels/
pip install --no-index --find-links ./wheels/ -r requirements.txt
\`\`\`

## requirements.txt — Reproducible Environments

\`\`\`bash
# Freeze exact versions of everything installed
pip freeze > requirements.txt

# requirements.txt looks like:
# certifi==2024.2.2
# charset-normalizer==3.3.2
# idna==3.6
# requests==2.31.0
# urllib3==2.2.1

# Install exactly these versions on another machine:
pip install -r requirements.txt
\`\`\`

Real-world projects often have multiple requirements files:

\`\`\`
requirements/
├── base.txt        # packages needed in production
├── dev.txt         # dev tools (testing, linting) — includes base.txt
└── test.txt        # test-only packages
\`\`\`

\`\`\`
# requirements/base.txt
requests>=2.28,<3.0
click>=8.0
pydantic>=2.0

# requirements/dev.txt
-r base.txt          # include base
pytest>=7.0
ruff
mypy
black

# requirements/test.txt
-r base.txt
pytest>=7.0
pytest-cov
factory-boy
\`\`\`

## .gitignore — What NOT to Commit

\`\`\`bash
# Always add these to .gitignore:
cat >> .gitignore << 'EOF'
# Python virtual environments
venv/
.venv/
env/
.env/

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# Distribution / packaging
dist/
build/
*.egg-info/

# Test coverage
.coverage
htmlcov/

# IDEs
.vscode/
.idea/
*.swp
EOF
\`\`\`

## Modern Tools

\`\`\`bash
# pyenv — manage multiple Python versions
pyenv install 3.12.0
pyenv local 3.12.0   # set Python version for this directory

# uv — ultra-fast pip + venv replacement (Rust-powered, 2024)
pip install uv
uv venv                         # create venv (10x faster than venv)
uv pip install requests         # install (100x faster than pip)
uv pip compile requirements.in  # pin all deps

# poetry — dependency management + packaging
poetry new myproject
poetry add requests "django>=4.0"
poetry add --dev pytest
poetry install                  # install all deps
poetry run python main.py       # run in venv

# pipenv — combines pip + venv
pipenv install requests
pipenv install --dev pytest
pipenv run python main.py
\`\`\`

## Workflow for a New Project

\`\`\`bash
# 1. Create project directory
mkdir my_api && cd my_api

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Upgrade pip first
pip install --upgrade pip

# 4. Install dependencies
pip install fastapi "uvicorn[standard]" pydantic sqlalchemy

# 5. Save requirements
pip freeze > requirements.txt

# 6. Add to .gitignore
echo "venv/" >> .gitignore

# 7. When a teammate clones your repo:
# git clone ...
# cd my_api
# python3 -m venv venv
# source venv/bin/activate
# pip install -r requirements.txt
\`\`\`

## Try It Yourself

\`\`\`bash
# Exercise: Create a complete isolated environment

# 1. Make a new directory and enter it
mkdir pypath_practice && cd pypath_practice

# 2. Create a virtual environment and activate it
python3 -m venv venv && source venv/bin/activate

# 3. Install httpx and rich
pip install httpx rich

# 4. Write fetch.py that uses both:
cat > fetch.py << 'PYEOF'
import httpx
from rich import print
from rich.table import Table

r = httpx.get("https://jsonplaceholder.typicode.com/users")
users = r.json()[:5]

table = Table("ID", "Name", "Email", "City")
for u in users:
    table.add_row(str(u["id"]), u["name"], u["email"], u["address"]["city"])
print(table)
PYEOF
python3 fetch.py

# 5. Freeze and verify
pip freeze > requirements.txt
cat requirements.txt
\`\`\`
`,
  },

  'intermediate-exception-handling-advanced-try-except-else-finally': {
    readTime: 9,
    whatYoullLearn: [
      'Use the else clause for code that only runs on success',
      'Use finally for guaranteed resource cleanup',
      'Chain exceptions with raise ... from to preserve context',
      'Re-raise exceptions after logging without losing the traceback',
      'Understand exception groups and ExceptionGroup (Python 3.11+)',
    ],
    content: `
## The Full try-except-else-finally Structure

Each clause has a distinct role:

\`\`\`python
try:
    # Code that might raise an exception
    result = risky_operation()

except ValueError as e:
    # Handle ValueError specifically
    print(f"Value error: {e}")

except (TypeError, KeyError) as e:
    # Handle multiple exception types the same way
    print(f"Type or key error: {e}")

except Exception as e:
    # Catch-all for unexpected exceptions (use sparingly)
    print(f"Unexpected error: {type(e).__name__}: {e}")
    raise   # re-raise — don't silently swallow unexpected errors

else:
    # Only runs if try completed WITHOUT any exception
    # Separates "success" logic from "error" logic
    process_result(result)

finally:
    # ALWAYS runs — exception or not, return or not, break or not
    cleanup_resources()
\`\`\`

## The else Clause — Success Path

\`else\` makes it crystal clear which code is "happy path" and which is "error handling":

\`\`\`python
def parse_config(path: str) -> dict:
    # Without else — try block contains too much:
    try:
        f = open(path)
        import json
        return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

    # With else — clear separation of opening vs processing:
def parse_config_v2(path: str) -> dict:
    try:
        f = open(path, encoding="utf-8")
    except FileNotFoundError:
        print(f"Config not found: {path}, using defaults")
        return {}
    else:
        # Only runs if open() succeeded
        try:
            import json
            return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in {path}: {e}")
            return {}
        finally:
            f.close()   # always close the file

# More Pythonic with context manager:
def parse_config_v3(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            import json
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return {}
\`\`\`

## finally — Guaranteed Cleanup

\`finally\` runs no matter what: exception, return, break, or continue. Essential for releasing resources:

\`\`\`python
import threading, time

lock = threading.Lock()

def thread_safe_update(data: dict, key: str, value) -> None:
    lock.acquire()
    try:
        data[key] = value
        if value is None:
            raise ValueError("Value cannot be None")
        # ... more processing ...
        return True
    except ValueError:
        del data[key]   # rollback
        raise           # re-raise after cleanup
    finally:
        lock.release()  # ALWAYS released — no deadlocks

# Prove finally runs even through return:
def demonstrate_finally() -> str:
    try:
        return "from try"           # executes, but...
    finally:
        print("finally ran!")       # ← this STILL prints!
        # If finally also has a return, it OVERRIDES the try's return:
        # return "from finally"  # would override "from try"

result = demonstrate_finally()
# Output: "finally ran!"
print(result)   # "from try"

# Database transaction pattern
class Database:
    def begin(self): print("BEGIN")
    def commit(self): print("COMMIT")
    def rollback(self): print("ROLLBACK")

def transfer_funds(db: Database, from_acc: int, to_acc: int, amount: float) -> None:
    db.begin()
    try:
        debit(from_acc, amount)
        credit(to_acc, amount)
        db.commit()
    except Exception:
        db.rollback()
        raise   # propagate the error after rolling back
    finally:
        release_connection(db)  # always release, even after rollback or commit
\`\`\`

## Exception Chaining — raise ... from

When handling one exception causes another, use \`raise NewError() from original_error\` to preserve the full context:

\`\`\`python
class ConfigError(Exception):
    """Application-level configuration error."""

class APIError(Exception):
    """Application-level API error."""

def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            import json
            return json.load(f)
    except FileNotFoundError as e:
        # Translate OS error to domain error, keeping original cause
        raise ConfigError(f"Config file missing: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid config format in {path}") from e

def get_user(user_id: int) -> dict:
    try:
        import urllib.request
        with urllib.request.urlopen(f"https://api.example.com/users/{user_id}") as r:
            import json
            return json.load(r)
    except Exception as e:
        raise APIError(f"Failed to fetch user {user_id}") from e

# When printed, Python shows the full chain:
# APIError: Failed to fetch user 42
#
# The above exception was the direct cause of the following exception:
# urllib.error.URLError: <urlopen error [Errno 61] Connection refused>

# Suppress the chain with 'from None' (when original error is irrelevant):
try:
    validate_input(data)
except (ValueError, TypeError):
    raise APIError("Invalid request data") from None  # hides implementation detail
\`\`\`

## Re-raising Exceptions

\`\`\`python
import logging

logger = logging.getLogger(__name__)

def process_payment(payment_data: dict) -> dict:
    try:
        result = payment_gateway.charge(payment_data)
        return result
    except PaymentDeclined as e:
        # Expected failure — log at WARNING, let caller handle
        logger.warning("Payment declined: %s", e)
        raise   # re-raise unchanged
    except Exception as e:
        # Unexpected failure — log at ERROR with traceback
        logger.exception("Unexpected payment error for data: %s", payment_data)
        raise   # re-raise unchanged — don't swallow unexpected errors

# raise vs raise e — use bare 'raise' to preserve original traceback!
try:
    risky()
except ValueError as e:
    log_error(e)
    raise      # ✓ preserves original traceback
    # raise e  # ✗ creates new traceback starting from this line
\`\`\`

## Python 3.11+: ExceptionGroup

Python 3.11 introduced \`ExceptionGroup\` for handling multiple simultaneous exceptions:

\`\`\`python
# ExceptionGroup — when multiple independent operations fail
import asyncio

async def failing_tasks():
    raise ExceptionGroup("multiple failures", [
        ValueError("bad value"),
        TypeError("wrong type"),
        KeyError("missing key"),
    ])

# except* syntax handles groups by type
async def main():
    try:
        await failing_tasks()
    except* ValueError as eg:
        print(f"Value errors: {eg.exceptions}")
    except* TypeError as eg:
        print(f"Type errors: {eg.exceptions}")
    except* KeyError as eg:
        print(f"Key errors: {eg.exceptions}")
\`\`\`

## Try It Yourself

\`\`\`python
# Write a robust file_processor() function that:
# 1. Opens a file (handle FileNotFoundError)
# 2. Reads and parses JSON content (handle json.JSONDecodeError)
# 3. Validates the parsed data has required fields (handle KeyError)
# 4. Processes the data (your business logic)
# 5. Logs all steps in finally
# 6. Chains exceptions with 'raise ... from' for domain clarity

import json, logging

logger = logging.getLogger(__name__)

class ProcessingError(Exception):
    pass

def file_processor(path: str, required_fields: list) -> dict:
    log_entries = []
    try:
        log_entries.append("Opening file")
        with open(path, encoding="utf-8") as f:
            log_entries.append("Parsing JSON")
            data = json.load(f)

        log_entries.append("Validating fields")
        for field in required_fields:
            if field not in data:
                raise KeyError(f"Required field missing: {field!r}")

    except FileNotFoundError as e:
        raise ProcessingError(f"File not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ProcessingError(f"Invalid JSON in {path}: {e}") from e
    except KeyError as e:
        raise ProcessingError(f"Validation failed: {e}") from e
    else:
        log_entries.append("Processing data")
        return process(data)
    finally:
        logger.debug("File processor steps: %s", log_entries)
\`\`\`
`,
  },

  'intermediate-exception-handling-advanced-custom-exceptions': {
    readTime: 9,
    whatYoullLearn: [
      'Create custom exception classes by subclassing Exception',
      'Add meaningful attributes and formatted error messages',
      'Design domain-specific exception hierarchies',
      'Know when to create custom exceptions vs use built-ins',
      'Document exceptions in docstrings and type hints',
    ],
    content: `
## Why Custom Exceptions?

Generic built-in exceptions lose context. \`ValueError: invalid amount\` tells you nothing specific; \`NegativeAmountError(amount=-50)\` tells you exactly what went wrong and with what value:

\`\`\`python
# ✗ Generic — caller can't distinguish these two cases:
def withdraw(balance, amount):
    if amount < 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")

try:
    withdraw(100, -50)
except ValueError as e:
    print(e)  # "Amount must be positive" — but HOW do I handle it?

# ✓ Custom — each failure has its own type and data:
class BankError(Exception):
    """Base class for all bank-related errors."""

class NegativeAmountError(BankError):
    """Raised when amount is negative."""
    def __init__(self, amount: float):
        self.amount = amount
        super().__init__(f"Amount must be positive, got {amount}")

class InsufficientFundsError(BankError):
    """Raised when withdrawal exceeds balance."""
    def __init__(self, requested: float, available: float):
        self.requested = requested
        self.available = available
        self.shortfall = requested - available
        super().__init__(
            f"Cannot withdraw \${requested:.2f}: "
            f"only \${available:.2f} available "
            f"(\${self.shortfall:.2f} short)"
        )

def withdraw(balance: float, amount: float) -> float:
    if amount < 0:
        raise NegativeAmountError(amount)
    if amount > balance:
        raise InsufficientFundsError(requested=amount, available=balance)
    return balance - amount

try:
    withdraw(100, 250)
except InsufficientFundsError as e:
    print(e.shortfall)   # 150.0 — structured data, not string parsing!
    print(str(e))        # "Cannot withdraw $250.00: only $100.00 available ($150.00 short)"
\`\`\`

## Anatomy of a Well-Designed Exception

\`\`\`python
class HTTPError(Exception):
    """Raised when an HTTP request returns an error status code.

    Attributes:
        status_code: The HTTP status code (e.g., 404, 500)
        url: The URL that was requested
        message: Optional error message from the response body
        response: The full response object (if available)

    Raises:
        HTTPError: Automatically raised by request() for 4xx/5xx responses.
    """

    def __init__(
        self,
        status_code: int,
        url: str,
        message: str = "",
        response=None,
    ):
        self.status_code = status_code
        self.url = url
        self.message = message
        self.response = response
        super().__init__(
            f"HTTP {status_code} for {url}"
            + (f": {message}" if message else "")
        )

    @property
    def is_client_error(self) -> bool:
        """True for 4xx responses (client caused the error)."""
        return 400 <= self.status_code < 500

    @property
    def is_server_error(self) -> bool:
        """True for 5xx responses (server caused the error)."""
        return self.status_code >= 500

    @property
    def is_not_found(self) -> bool:
        return self.status_code == 404

    @property
    def is_unauthorized(self) -> bool:
        return self.status_code == 401

# Usage
try:
    raise HTTPError(404, "https://api.example.com/users/99", "User not found")
except HTTPError as e:
    if e.is_not_found:
        print(f"Resource missing at {e.url}")
    elif e.is_server_error:
        print(f"Server problem ({e.status_code}), retry later")
    print(f"Status: {e.status_code}")
\`\`\`

## Building an Exception Hierarchy

Design a hierarchy that mirrors your domain. Callers can catch at the right level:

\`\`\`python
# Domain: Database library exceptions
class DBError(Exception):
    """Base exception for all database errors."""

class ConnectionError(DBError):
    """Cannot connect to the database."""
    def __init__(self, host: str, port: int, reason: str = ""):
        self.host = host
        self.port = port
        super().__init__(f"Cannot connect to {host}:{port}" + (f": {reason}" if reason else ""))

class QueryError(DBError):
    """Error executing a SQL query."""
    def __init__(self, query: str, error: str):
        self.query = query
        self.error = error
        super().__init__(f"Query failed: {error}\nQuery: {query[:200]}")

class NotFoundError(DBError):
    """No record matches the given criteria."""
    def __init__(self, table: str, criteria: dict):
        self.table = table
        self.criteria = criteria
        super().__init__(f"No record in {table!r} matching {criteria}")

class DuplicateError(DBError):
    """A record with the same unique key already exists."""
    def __init__(self, table: str, key: str, value):
        self.table = table
        self.key = key
        self.value = value
        super().__init__(f"Duplicate {key}={value!r} in {table!r}")

# Caller can catch at different levels of specificity:
try:
    db.find("users", {"id": 99})
except NotFoundError as e:
    # Handle missing record specifically
    create_default_user(e.criteria)
except QueryError as e:
    # Handle query syntax errors
    log_query_error(e.query, e.error)
except DBError as e:
    # Handle any database error
    show_generic_error(str(e))
\`\`\`

## When to Create Custom Exceptions

\`\`\`python
# ✓ Create custom exceptions when:

# 1. Callers need to distinguish different failure modes programmatically
class RateLimitError(APIError):
    def __init__(self, retry_after: int):
        self.retry_after = retry_after
        super().__init__(f"Rate limited. Retry after {retry_after}s")

# 2. Error objects carry domain-relevant data
class ValidationError(Exception):
    def __init__(self, errors: dict[str, list[str]]):
        self.errors = errors  # {"field": ["error1", "error2"]}
        msg = "; ".join(f"{k}: {', '.join(v)}" for k, v in errors.items())
        super().__init__(msg)

# 3. You're building a library or framework — callers need a stable API

# ✗ DON'T create custom exceptions for:
# - One-off errors that callers won't handle specifically
# - When a built-in exception is semantically correct
#   (ValueError, TypeError, KeyError, FileNotFoundError are often enough)

# Rule of thumb: if callers will write 'except YourError', create it.
# If they'll just catch Exception, don't bother.
\`\`\`

## Documenting Exceptions

\`\`\`python
from typing import Optional

def fetch_user(user_id: int, timeout: float = 30.0) -> dict:
    """Fetch a user record from the API.

    Args:
        user_id: The unique user identifier. Must be positive.
        timeout: Request timeout in seconds. Default is 30s.

    Returns:
        A dict containing user data: id, name, email, created_at.

    Raises:
        ValueError: If user_id is not positive.
        NotFoundError: If no user with the given ID exists.
        RateLimitError: If the API rate limit is exceeded.
        APIError: For any other API error.
        TimeoutError: If the request exceeds the timeout.
    """
    if user_id <= 0:
        raise ValueError(f"user_id must be positive, got {user_id}")
    # ... implementation ...
\`\`\`

## Try It Yourself

\`\`\`python
# Build a complete exception hierarchy for a file-based task manager:

class TaskError(Exception):
    """Base exception for task manager errors."""

class TaskNotFoundError(TaskError):
    """No task exists with the given ID."""
    def __init__(self, task_id: int):
        self.task_id = task_id
        super().__init__(f"No task found with ID {task_id}")

class TaskAlreadyCompleteError(TaskError):
    """Task is already marked complete."""
    def __init__(self, task_id: int, completed_at: str):
        self.task_id = task_id
        self.completed_at = completed_at
        super().__init__(f"Task {task_id} was completed on {completed_at}")

class InvalidPriorityError(TaskError):
    """Priority value is not in the allowed set."""
    VALID = {"low", "medium", "high", "critical"}

    def __init__(self, value: str):
        self.value = value
        self.valid_values = self.VALID
        super().__init__(
            f"Invalid priority {value!r}. "
            f"Must be one of: {', '.join(sorted(self.VALID))}"
        )

# Now implement TaskManager that raises these appropriately:
class TaskManager:
    def __init__(self):
        self._tasks = {}

    def add(self, task_id: int, title: str, priority: str = "medium") -> None:
        if priority not in InvalidPriorityError.VALID:
            raise InvalidPriorityError(priority)
        self._tasks[task_id] = {"title": title, "priority": priority, "done": False}

    def complete(self, task_id: int) -> None:
        if task_id not in self._tasks:
            raise TaskNotFoundError(task_id)
        if self._tasks[task_id]["done"]:
            raise TaskAlreadyCompleteError(task_id, "earlier today")
        self._tasks[task_id]["done"] = True
\`\`\`
`,
  },

  'intermediate-oop-inheritance-polymorphism': {
    readTime: 10,
    whatYoullLearn: [
      'Create child classes that extend parent classes with inheritance',
      'Override methods and call parent implementations with super()',
      'Use polymorphism so different objects respond to the same interface',
      'Apply duck typing — "if it walks like a duck and quacks like a duck..."',
      'Use isinstance() and issubclass() for type-safe operations',
    ],
    content: `
## Single Inheritance

Inheritance lets a child class reuse and extend a parent class. The child *is-a* specialized version of the parent:

\`\`\`python
import math

class Shape:
    """Abstract base: every shape has a color and can describe itself."""

    def __init__(self, color: str = "black"):
        self.color = color

    def area(self) -> float:
        """Return the area. Subclasses must override this."""
        raise NotImplementedError(f"{type(self).__name__} must implement area()")

    def perimeter(self) -> float:
        raise NotImplementedError(f"{type(self).__name__} must implement perimeter()")

    def describe(self) -> str:
        """Concrete method — shared by ALL subclasses unchanged."""
        return (f"A {self.color} {type(self).__name__}: "
                f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")

class Circle(Shape):
    def __init__(self, radius: float, color: str = "black"):
        super().__init__(color)   # call Shape.__init__(color)
        if radius <= 0:
            raise ValueError(f"Radius must be positive, got {radius}")
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius

    def scale(self, factor: float) -> "Circle":
        """Return a new Circle scaled by factor."""
        return Circle(self.radius * factor, self.color)

class Rectangle(Shape):
    def __init__(self, width: float, height: float, color: str = "black"):
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)

    @property
    def is_square(self) -> bool:
        return math.isclose(self.width, self.height)

class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float, color: str = "black"):
        super().__init__(color)
        if a + b <= c or b + c <= a or a + c <= b:
            raise ValueError("Invalid triangle: violates triangle inequality")
        self.a, self.b, self.c = a, b, c

    def area(self) -> float:
        # Heron's formula
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))

    def perimeter(self) -> float:
        return self.a + self.b + self.c

c = Circle(5, "red")
r = Rectangle(4, 6, "blue")
t = Triangle(3, 4, 5, "green")

print(c.describe())   # A red Circle: area=78.54, perimeter=31.42
print(r.describe())   # A blue Rectangle: area=24.00, perimeter=20.00
print(t.describe())   # A green Triangle: area=6.00, perimeter=12.00
\`\`\`

## Polymorphism — One Interface, Many Behaviors

Polymorphism lets you write code that works on any object with the right interface — without caring about the specific type:

\`\`\`python
shapes = [Circle(3), Rectangle(4, 5), Triangle(3, 4, 5), Circle(7), Rectangle(2, 8)]

# Polymorphic call — each shape uses its own area() implementation
total_area = sum(shape.area() for shape in shapes)
print(f"Total area: {total_area:.2f}")

# Sort by area — works because ALL shapes implement area()
shapes.sort(key=lambda s: s.area())
for shape in shapes:
    print(f"{type(shape).__name__:12} area={shape.area():.2f}")

# Functions that operate on any Shape:
def find_largest(shapes: list) -> Shape:
    return max(shapes, key=lambda s: s.area())

def total_perimeter(shapes: list) -> float:
    return sum(s.perimeter() for s in shapes)

print(f"Largest: {find_largest(shapes).describe()}")
\`\`\`

## Duck Typing — Structural Polymorphism

Python\\'s polymorphism doesn\\'t require formal inheritance. If an object has the right methods, it works:

\`\`\`python
class EllipseApproximation:
    """Doesn't inherit from Shape, but walks and quacks like one."""

    def __init__(self, a: float, b: float):
        self.a = a   # semi-major axis
        self.b = b   # semi-minor axis

    def area(self) -> float:
        return math.pi * self.a * self.b

    def perimeter(self) -> float:
        # Ramanujan's approximation
        h = ((self.a - self.b) / (self.a + self.b)) ** 2
        return math.pi * (self.a + self.b) * (1 + 3*h / (10 + math.sqrt(4 - 3*h)))

e = EllipseApproximation(5, 3)
shapes.append(e)

# Works! EllipseApproximation IS usable wherever Shape is expected
# because it has area() and perimeter() — no inheritance needed
print(f"Total area now: {sum(s.area() for s in shapes):.2f}")
\`\`\`

## Method Resolution Order (MRO) and super()

\`\`\`python
class Vehicle:
    def __init__(self, make: str, year: int):
        self.make = make
        self.year = year

    def start(self) -> str:
        return f"{self.make} engine starts"

    def info(self) -> str:
        return f"{self.year} {self.make}"

class Car(Vehicle):
    def __init__(self, make: str, year: int, doors: int = 4):
        super().__init__(make, year)   # call parent __init__ — ALWAYS do this!
        self.doors = doors

    def start(self) -> str:
        base = super().start()   # call parent method, extend it
        return f"{base} (Car with {self.doors} doors)"

    def info(self) -> str:
        return f"{super().info()}, {self.doors} doors"

class ElectricCar(Car):
    def __init__(self, make: str, year: int, battery_kwh: float):
        super().__init__(make, year)   # calls Car.__init__ which calls Vehicle.__init__
        self.battery_kwh = battery_kwh

    def start(self) -> str:
        return f"{self.make} electric motor hums silently"

    def range_km(self) -> float:
        return self.battery_kwh * 6   # rough estimate

tesla = ElectricCar("Tesla", 2025, 100)
print(tesla.start())         # Tesla electric motor hums silently
print(tesla.info())          # 2025 Tesla, 4 doors (inherited from Car)
print(ElectricCar.__mro__)   # (ElectricCar, Car, Vehicle, object)
\`\`\`

## isinstance() and issubclass() for Type-Safe Code

\`\`\`python
def describe_vehicle(v) -> None:
    print(f"Make: {v.make}")           # works on any vehicle

    if isinstance(v, ElectricCar):
        print(f"Range: {v.range_km():.0f}km")   # electric-specific
    elif isinstance(v, Car):
        print(f"Doors: {v.doors}")               # car-specific

    print(isinstance(v, Vehicle))    # True for all
    print(issubclass(Car, Vehicle))  # True — Car IS-A Vehicle
    print(issubclass(Car, ElectricCar))  # False — reversed!

# isinstance is preferred over type() because it handles inheritance:
class SportsCar(Car): pass
sc = SportsCar("Ferrari", 2025, 2)
print(type(sc) == Car)             # False — it's SportsCar, not Car
print(isinstance(sc, Car))         # True  — SportsCar IS-A Car ✓
print(isinstance(sc, Vehicle))     # True  — SportsCar IS-A Vehicle ✓
\`\`\`

## Try It Yourself

\`\`\`python
# Build a simple content management system:

class Content:
    """Base class for all content types."""
    def __init__(self, title: str, author: str):
        self.title = title
        self.author = author
        import datetime
        self.created_at = datetime.date.today()

    def render(self) -> str:
        raise NotImplementedError

    def summary(self) -> str:
        return f"[{type(self).__name__}] {self.title!r} by {self.author}"

class Article(Content):
    def __init__(self, title, author, body: str, tags: list = None):
        super().__init__(title, author)
        self.body = body
        self.tags = tags or []

    def render(self) -> str:
        return f"# {self.title}\n\n{self.body}\n\nTags: {', '.join(self.tags)}"

    @property
    def word_count(self) -> int:
        return len(self.body.split())

class Video(Content):
    def __init__(self, title, author, url: str, duration_sec: int):
        super().__init__(title, author)
        self.url = url
        self.duration_sec = duration_sec

    def render(self) -> str:
        mins, secs = divmod(self.duration_sec, 60)
        return f"[VIDEO] {self.title} ({mins}:{secs:02d}) → {self.url}"

class Podcast(Content):
    def __init__(self, title, author, audio_url: str, episode: int):
        super().__init__(title, author)
        self.audio_url = audio_url
        self.episode = episode

    def render(self) -> str:
        return f"[PODCAST EP.{self.episode:03d}] {self.title} — {self.audio_url}"

# Polymorphic rendering:
feed = [
    Article("Python Tips", "Alice", "Use f-strings for formatting.", ["python", "tips"]),
    Video("Async Python", "Bob", "https://yt.be/abc", 1820),
    Podcast("Talk Python", "Michael", "https://pod.cast/ep42", 42),
]

for content in feed:
    print(content.render())     # each uses its own render()
    print(content.summary())    # inherited from Content
    print()
\`\`\`
`,
  },

  'intermediate-oop-encapsulation-dunder-methods': {
    readTime: 10,
    whatYoullLearn: [
      'Apply Python\'s encapsulation conventions: public, _protected, __private',
      'Implement __str__ and __repr__ for human-readable and developer-friendly output',
      'Make objects behave like containers with __len__, __contains__, __iter__, __getitem__',
      'Enable comparison operators with __eq__, __lt__, and @functools.total_ordering',
      'Make objects callable with __call__ and support context managers with __enter__/__exit__',
    ],
    content: `
## Encapsulation Conventions

Python doesn\\'t enforce access control at the language level. Instead, it uses naming conventions:

\`\`\`python
class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner           # PUBLIC: use freely
        self._balance = balance      # PROTECTED: convention says "treat with care"
        self.__pin = "1234"          # PRIVATE: name-mangled to _BankAccount__pin

    # Controlled access via property
    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self._balance:
            raise ValueError(f"Insufficient funds: \${self._balance:.2f} available")
        self._balance -= amount

acc = BankAccount("Alice", 1000)
print(acc.owner)          # "Alice" — public
print(acc.balance)        # 1000.0  — via property
print(acc._balance)       # 1000.0  — works, but convention says DON'T

# Name mangling: double underscore becomes _ClassName__attr
# acc.__pin              # AttributeError!
print(acc._BankAccount__pin)   # "1234" — accessible but ugly — don't do this!
\`\`\`

## __repr__ and __str__

Every class should define these two methods:
- \`__repr__\`: unambiguous string for developers (aim to be recreatable)
- \`__str__\`: human-friendly string for end users

\`\`\`python
from datetime import date

class Task:
    def __init__(self, title: str, due: date, priority: int = 2):
        self.title = title
        self.due = due
        self.priority = priority
        self.done = False

    def __repr__(self) -> str:
        """Unambiguous — ideally eval()-able to recreate the object."""
        return (f"Task({self.title!r}, "
                f"due=date({self.due.year}, {self.due.month}, {self.due.day}), "
                f"priority={self.priority})")

    def __str__(self) -> str:
        """Human-readable — for end users."""
        status = "✓" if self.done else "○"
        priority_label = {1: "🔴", 2: "🟡", 3: "🟢"}.get(self.priority, "⚪")
        return f"{status} {priority_label} {self.title} (due: {self.due})"

    def __bool__(self) -> bool:
        """Truthiness: True if task is not done."""
        return not self.done

t = Task("Write tests", date(2025, 3, 10), priority=1)
print(t)          # ○ 🔴 Write tests (due: 2025-03-10)    — str()
print(repr(t))    # Task('Write tests', due=date(2025, 3, 10), priority=1) — repr()
t                 # In REPL: uses repr()

if t:             # uses __bool__
    print("Task is still pending")
\`\`\`

## Container Dunder Methods

Make your objects behave like built-in containers:

\`\`\`python
class Playlist:
    """A music playlist that behaves like a smart list."""

    def __init__(self, name: str):
        self.name = name
        self._songs: list[str] = []

    def add(self, song: str) -> "Playlist":
        """Add a song and return self for chaining."""
        if song in self._songs:
            raise ValueError(f"{song!r} is already in the playlist")
        self._songs.append(song)
        return self  # enables chaining: p.add("A").add("B")

    def remove(self, song: str) -> None:
        self._songs.remove(song)   # raises ValueError if not found

    # Container interface:
    def __len__(self) -> int:
        return len(self._songs)          # len(playlist)

    def __contains__(self, song: str) -> bool:
        return song in self._songs       # "song" in playlist

    def __iter__(self):
        return iter(self._songs)         # for song in playlist

    def __getitem__(self, index):
        return self._songs[index]        # playlist[0], playlist[1:3]

    def __setitem__(self, index: int, song: str) -> None:
        self._songs[index] = song        # playlist[0] = "New Song"

    def __delitem__(self, index: int) -> None:
        del self._songs[index]           # del playlist[0]

    def __reversed__(self):
        return reversed(self._songs)     # reversed(playlist)

    def __add__(self, other: "Playlist") -> "Playlist":
        """Merge two playlists: playlist1 + playlist2."""
        merged = Playlist(f"{self.name} + {other.name}")
        merged._songs = self._songs + [s for s in other._songs if s not in self._songs]
        return merged

    def __repr__(self) -> str:
        return f"Playlist({self.name!r}, {len(self)} songs)"

    def __str__(self) -> str:
        songs_str = "\n  ".join(f"{i+1}. {s}" for i, s in enumerate(self._songs))
        return f"Playlist: {self.name}\n  {songs_str}"

p = Playlist("Favorites")
(p.add("Bohemian Rhapsody")
  .add("Hotel California")
  .add("Stairway to Heaven"))

print(len(p))                          # 3
print("Hotel California" in p)         # True
print(p[0])                            # "Bohemian Rhapsody"
for song in p:                         # iteration
    print(f"  ♫ {song}")
print(p[1:])                           # ['Hotel California', 'Stairway to Heaven']
\`\`\`

## Comparison Operators with @total_ordering

\`\`\`python
from functools import total_ordering

@total_ordering   # generates __le__, __gt__, __ge__ from __eq__ + __lt__
class Version:
    """Semantic version number: major.minor.patch"""

    def __init__(self, version_str: str):
        parts = version_str.strip("v").split(".")
        self.major, self.minor, self.patch = (int(p) for p in parts)

    def __repr__(self) -> str:
        return f"Version('{self}')"

    def __str__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) == (other.major, other.minor, other.patch)

    def __lt__(self, other) -> bool:
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor, self.patch) < (other.major, other.minor, other.patch)

    def __hash__(self) -> int:
        return hash((self.major, self.minor, self.patch))

versions = [Version("1.10.0"), Version("1.2.0"), Version("2.0.0"), Version("1.9.1")]
print(sorted(versions))          # [1.2.0, 1.9.1, 1.10.0, 2.0.0]
print(max(versions))             # 2.0.0
print(Version("1.2.0") < Version("1.10.0"))  # True
\`\`\`

## __call__ — Making Objects Callable

\`\`\`python
class Validator:
    """A callable validator that can be reused and composed."""

    def __init__(self, min_val: float = None, max_val: float = None):
        self.min_val = min_val
        self.max_val = max_val

    def __call__(self, value: float) -> bool:
        """Validators are callable: validator(42) instead of validator.validate(42)."""
        if self.min_val is not None and value < self.min_val:
            return False
        if self.max_val is not None and value > self.max_val:
            return False
        return True

    def __repr__(self) -> str:
        return f"Validator(min={self.min_val}, max={self.max_val})"

age_validator = Validator(min_val=0, max_val=150)
score_validator = Validator(min_val=0, max_val=100)

print(age_validator(25))    # True  — __call__ invoked
print(age_validator(200))   # False
print(callable(age_validator))  # True — has __call__

# Use validators as key/filter functions (they look like functions!):
data = [25, -1, 35, 200, 18, 150]
valid_ages = list(filter(age_validator, data))
print(valid_ages)   # [25, 35, 18, 150]
\`\`\`

## Try It Yourself

\`\`\`python
from functools import total_ordering

# Implement a Money class:
@total_ordering
class Money:
    """Represents a monetary amount with currency."""

    def __init__(self, amount: float, currency: str = "USD"):
        self.amount = round(amount, 2)
        self.currency = currency.upper()

    def __repr__(self): ...
    def __str__(self): ...   # e.g., "$42.00" or "€15.99"
    def __eq__(self, other): ...
    def __lt__(self, other): ...
    def __add__(self, other): ...   # raise if different currencies
    def __sub__(self, other): ...
    def __mul__(self, factor: float): ...  # scale by a factor
    def __neg__(self): ...  # negate: -money
    def __bool__(self): ...  # False if amount is 0

# Expected behavior:
wallet = Money(100, "USD")
tax = Money(8.75, "USD")
total = wallet + tax        # Money(108.75, "USD")
print(total)                # "$108.75"
print(wallet > tax)         # True
print(bool(Money(0, "USD")))  # False
\`\`\`
`,
  },

  'intermediate-iterators-generators-iter-next': {
    readTime: 9,
    whatYoullLearn: [
      'Understand the iterable vs iterator distinction at a deep level',
      'Implement __iter__ and __next__ to create stateful custom iterators',
      'Use StopIteration correctly',
      'Build infinite iterators and control them with itertools.islice',
      'Separate the iterable from its iterator for reusability',
    ],
    content: `
## Iterables, Iterators, and the Iteration Protocol

Python\\'s \`for\` loop is built on a simple protocol. Understanding it unlocks powerful custom iteration patterns:

\`\`\`python
# For loop is syntactic sugar — under the hood:
for x in [1, 2, 3]:
    print(x)

# Is exactly equivalent to:
_iterable = [1, 2, 3]
_iterator = iter(_iterable)      # calls _iterable.__iter__()
while True:
    try:
        x = next(_iterator)      # calls _iterator.__next__()
        print(x)
    except StopIteration:
        break

# Key distinction:
# ITERABLE: has __iter__() that returns an iterator
# ITERATOR: has __next__() that returns next value (or raises StopIteration)
# A ITERATOR is also an ITERABLE (its __iter__ returns self)

# Lists are iterable but NOT iterators:
lst = [1, 2, 3]
it = iter(lst)           # create iterator from iterable
print(type(lst))         # <class 'list'>   — iterable only
print(type(it))          # <class 'list_iterator'> — iterator

# You can iterate a list multiple times (fresh iterator each time):
for x in lst: print(x)   # works
for x in lst: print(x)   # works again — new iterator created

# But an iterator can only be iterated ONCE:
it = iter([1, 2, 3])
list(it)   # [1, 2, 3]
list(it)   # []  — exhausted!
\`\`\`

## Building a Custom Iterator

Implement \`__iter__\` (returns \`self\`) and \`__next__\` (returns next value or raises \`StopIteration\`):

\`\`\`python
class CountDown:
    """Counts down from start to stop (inclusive)."""

    def __init__(self, start: int, stop: int = 0, step: int = 1):
        if step <= 0:
            raise ValueError("step must be positive")
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self   # iterator returns itself

    def __next__(self) -> int:
        if self.current < self.stop:
            raise StopIteration      # signal end of sequence
        value = self.current
        self.current -= self.step
        return value

    def __len__(self) -> int:
        """Optional — allows len() on the iterator."""
        return max(0, (self.current - self.stop) // self.step + 1)

# Use in for loop:
for n in CountDown(10, 0, 2):
    print(n, end=" ")   # 10 8 6 4 2 0

# Use with built-in functions (all work with any iterator):
countdown = CountDown(5, 1)
print(list(countdown))    # [5, 4, 3, 2, 1]
print(sum(CountDown(100)))        # 5050
print(max(CountDown(10, step=3))) # 10
print(min(CountDown(10)))         # 0

# Tuple/set unpacking:
a, b, c = CountDown(3, 1)
print(a, b, c)   # 3 2 1
\`\`\`

## Infinite Iterators

Iterators don\\'t need an end — they just never raise \`StopIteration\`. Use \`itertools.islice\` to take a finite slice:

\`\`\`python
from itertools import islice

class Fibonacci:
    """Generates Fibonacci numbers forever."""

    def __init__(self):
        self.a, self.b = 0, 1

    def __iter__(self):
        return self

    def __next__(self) -> int:
        value = self.a
        self.a, self.b = self.b, self.a + self.b
        return value

fib = Fibonacci()
print(list(islice(fib, 10)))    # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
print(next(fib))                 # 55 — continues where we left off

# Find first Fibonacci number > 1000:
fib2 = Fibonacci()
result = next(f for f in fib2 if f > 1000)
print(result)   # 1597

class PrimeNumbers:
    """Infinite iterator of prime numbers using a simple sieve."""

    def __init__(self):
        self._found: list[int] = []
        self._candidate = 2

    def __iter__(self):
        return self

    def __next__(self) -> int:
        while True:
            if all(self._candidate % p != 0 for p in self._found):
                self._found.append(self._candidate)
                self._candidate += 1
                return self._found[-1]
            self._candidate += 1

primes = PrimeNumbers()
print(list(islice(primes, 10)))   # [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
\`\`\`

## Separating Iterable from Iterator (Reusable)

A class that\\'s its own iterator can only be iterated once. For reusable iteration, separate the container (iterable) from its cursor (iterator):

\`\`\`python
class NumberRange:
    """Reusable iterable — can be iterated multiple times."""

    def __init__(self, start: int, stop: int, step: int = 1):
        self.start = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        # Return a FRESH iterator each time!
        return NumberRangeIterator(self.start, self.stop, self.step)

    def __len__(self) -> int:
        return max(0, (self.stop - self.start + self.step - 1) // self.step)

class NumberRangeIterator:
    """Stateful iterator for NumberRange — advances once and is exhausted."""

    def __init__(self, current: int, stop: int, step: int):
        self.current = current
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self   # iterator is also iterable

    def __next__(self) -> int:
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += self.step
        return value

r = NumberRange(1, 10, 2)
print(list(r))   # [1, 3, 5, 7, 9]
print(list(r))   # [1, 3, 5, 7, 9] — same result! fresh iterator each time
print(len(r))    # 5

for x in r:      # works perfectly
    for y in r:  # nested — outer and inner have independent iterators!
        pass
\`\`\`

## The iter() Built-in — Two-Argument Form

\`iter(callable, sentinel)\` creates an iterator that calls the callable until it returns the sentinel:

\`\`\`python
# Read a file in 8KB chunks until EOF (b""):
with open("large_file.bin", "rb") as f:
    for chunk in iter(lambda: f.read(8192), b""):
        process(chunk)

# Roll a die until you get a 6:
import random
die_rolls = list(iter(lambda: random.randint(1, 6), 6))
print(f"Rolled before getting 6: {die_rolls}")

# Read user input until "quit":
# for line in iter(input, "quit"):
#     process(line)
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Implement a CycleIterator that repeats a sequence endlessly:
class CycleIterator:
    def __init__(self, iterable):
        self._data = list(iterable)
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if not self._data:
            raise StopIteration
        value = self._data[self._index % len(self._data)]
        self._index += 1
        return value

from itertools import islice
cycle = CycleIterator(["A", "B", "C"])
print(list(islice(cycle, 8)))   # ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B']

# 2. Implement a TakeWhile iterator that yields items while condition is True:
class TakeWhile:
    def __init__(self, predicate, iterable):
        self._pred = predicate
        self._iter = iter(iterable)
        self._done = False

    def __iter__(self):
        return self

    def __next__(self):
        if self._done:
            raise StopIteration
        value = next(self._iter)   # propagates StopIteration if exhausted
        if not self._pred(value):
            self._done = True
            raise StopIteration
        return value

print(list(TakeWhile(lambda x: x < 5, [1, 2, 3, 4, 5, 6, 7])))  # [1, 2, 3, 4]
\`\`\`
`,
  },

  'intermediate-iterators-generators-yield-generator-functions': {
    readTime: 10,
    whatYoullLearn: [
      'Write generator functions using yield and understand how execution is suspended',
      'Use send() to communicate values into a running generator',
      'Compose generator pipelines for memory-efficient data processing',
      'Delegate to sub-generators with yield from',
      'Compare generator expressions to list comprehensions for memory and performance',
    ],
    content: `
## How Generators Work

A generator function contains \`yield\`. When called, it returns a generator object but doesn\\'t execute the body. Execution proceeds lazily — suspending at each \`yield\` and resuming on the next \`next()\` call:

\`\`\`python
def count_up(start: int, stop: int, step: int = 1):
    """Generator that counts from start to stop."""
    print(f"Generator started: start={start}")
    current = start
    while current <= stop:
        print(f"About to yield {current}")
        yield current        # suspend here, return value to caller
        print(f"Resumed after yielding {current}")
        current += step
    print("Generator finished")

gen = count_up(1, 4)         # NO execution yet!
print("Created generator")

print(next(gen))   # "Generator started..." → "About to yield 1" → 1
print(next(gen))   # "Resumed..." → "About to yield 2" → 2
print(next(gen))   # "Resumed..." → "About to yield 3" → 3
print(next(gen))   # "Resumed..." → "About to yield 4" → 4
# next(gen)        # "Generator finished" → StopIteration!

# For loop handles StopIteration automatically:
for n in count_up(1, 5):
    print(n, end=" ")   # 1 2 3 4 5
\`\`\`

## Memory Efficiency: Generators vs Lists

\`\`\`python
import sys

# List comprehension — ALL values computed and stored immediately
squares_list = [x**2 for x in range(1_000_000)]
print(f"List size: {sys.getsizeof(squares_list):,} bytes")  # ~8,000,000 bytes!

# Generator expression — values computed ON DEMAND, one at a time
squares_gen = (x**2 for x in range(1_000_000))
print(f"Generator size: {sys.getsizeof(squares_gen)} bytes")  # ~104 bytes!

# Both produce the same values, but generator uses almost no memory:
print(sum(squares_list) == sum(squares_gen))  # True

# Rule: prefer generator expressions when:
# 1. You only iterate once
# 2. The dataset is large
# 3. You pass it to sum(), any(), all(), max(), min(), etc.

total = sum(x**2 for x in range(1_000_000))  # no brackets needed inside sum()!
has_negative = any(x < 0 for x in data)
all_positive = all(x > 0 for x in data)
\`\`\`

## Practical Generators

\`\`\`python
from pathlib import Path

# Read a large file line by line without loading it into memory
def read_lines(path: str):
    """Yield lines from a file one at a time."""
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip('\n')

# Generate Fibonacci numbers on demand
def fibonacci():
    """Infinite Fibonacci sequence."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Generate data in batches
def batches(iterable, size: int):
    """Split an iterable into fixed-size batches."""
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:       # yield last partial batch
        yield batch

data = range(10)
for batch in batches(data, 3):
    print(batch)
# [0, 1, 2]
# [3, 4, 5]
# [6, 7, 8]
# [9]

# Generate sliding windows
def windows(iterable, n: int):
    """Yield overlapping windows of size n."""
    from collections import deque
    buf = deque(maxlen=n)
    for item in iterable:
        buf.append(item)
        if len(buf) == n:
            yield tuple(buf)

print(list(windows([1, 2, 3, 4, 5], 3)))
# [(1,2,3), (2,3,4), (3,4,5)]
\`\`\`

## Generator Pipelines

Chain generators together — each stage processes one item at a time. No intermediate lists needed:

\`\`\`python
def read_file(path: str):
    with open(path) as f:
        yield from f

def grep(lines, pattern: str):
    """Keep only lines matching the pattern."""
    import re
    compiled = re.compile(pattern, re.IGNORECASE)
    for line in lines:
        if compiled.search(line):
            yield line

def strip_lines(lines):
    """Remove whitespace from each line."""
    for line in lines:
        yield line.strip()

def head(lines, n: int):
    """Take only the first n lines."""
    for i, line in enumerate(lines):
        if i >= n:
            break
        yield line

def add_line_numbers(lines):
    """Prepend line number to each line."""
    for i, line in enumerate(lines, 1):
        yield f"{i:4d}: {line}"

# Build a pipeline — no data flows until consumed
pipeline = add_line_numbers(
    head(
        strip_lines(
            grep(
                read_file("server.log"),
                r"error|exception|fail"
            )
        ),
        20
    )
)

# Print results as they're generated — minimal memory usage
for line in pipeline:
    print(line)
\`\`\`

## yield from — Delegation

\`yield from\` delegates to another generator, forwarding values and return values:

\`\`\`python
def flatten(nested):
    """Flatten a nested list structure to any depth."""
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # delegate to recursive call
        else:
            yield item

data = [1, [2, [3, 4], 5], [6, 7], 8]
print(list(flatten(data)))   # [1, 2, 3, 4, 5, 6, 7, 8]

# yield from also works for chaining generators:
def chain(*iterables):
    """Yield all items from each iterable in sequence."""
    for it in iterables:
        yield from it

print(list(chain([1,2], [3,4], [5,6])))  # [1, 2, 3, 4, 5, 6]

# Generator that delegates to sub-generators based on condition:
def process_items(items):
    for item in items:
        if isinstance(item, str):
            yield from process_strings([item])
        elif isinstance(item, (int, float)):
            yield from process_numbers([item])

def process_strings(strings):
    for s in strings:
        yield s.upper()

def process_numbers(numbers):
    for n in numbers:
        yield n ** 2

print(list(process_items(["hello", 3, "world", 4])))
# ['HELLO', 9, 'WORLD', 16]
\`\`\`

## send() — Two-Way Communication

Generators can receive values via \`send()\`, making them coroutines:

\`\`\`python
def running_average():
    """Receive numbers via send(), yield running average."""
    total = 0
    count = 0
    average = None
    while True:
        value = yield average   # yield current average AND receive new value
        if value is None:
            break
        total += value
        count += 1
        average = total / count

avg_gen = running_average()
next(avg_gen)           # prime the generator (advance to first yield)

print(avg_gen.send(10))   # 10.0
print(avg_gen.send(20))   # 15.0
print(avg_gen.send(30))   # 20.0
print(avg_gen.send(40))   # 25.0
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Write a generator that reads a CSV file and yields rows as dicts:
import csv

def csv_rows(path: str):
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        yield from reader  # delegates to DictReader iterator

# 2. Build a complete data pipeline:
# read_csv → filter active users → extract names → batch into groups of 5

def active_users(rows):
    for row in rows:
        if row.get("active", "").lower() == "true":
            yield row

def extract_field(rows, field: str):
    for row in rows:
        yield row[field]

# Pipeline (assuming users.csv with columns: name, email, active):
# pipeline = batches(
#     extract_field(active_users(csv_rows("users.csv")), "name"),
#     size=5
# )
# for batch in pipeline:
#     send_batch_email(batch)

# 3. Implement a generator-based tokenizer:
def tokenize(text: str):
    """Yield tokens (words) from text, skipping punctuation."""
    import re
    for match in re.finditer(r'[a-zA-Z]+', text.lower()):
        yield match.group()

text = "Hello, World! Python generators are powerful."
print(list(tokenize(text)))
# ['hello', 'world', 'python', 'generators', 'are', 'powerful']
\`\`\`
`,
  },

  'intermediate-standard-modules-math-random': {
    readTime: 8,
    whatYoullLearn: [
      'Use mathematical constants and functions from the math module',
      'Understand floating-point limitations and use math.isclose() correctly',
      'Generate pseudorandom numbers for simulations and games',
      'Seed random for reproducible results in testing',
      'Use the secrets module for cryptographically secure randomness',
    ],
    content: `
## The math Module — Beyond Basic Arithmetic

\`\`\`python
import math

# Mathematical constants
print(math.pi)     # 3.141592653589793  — π
print(math.e)      # 2.718281828459045  — Euler's number
print(math.tau)    # 6.283185307179586  — 2π (full circle in radians)
print(math.inf)    # inf                — positive infinity
print(math.nan)    # nan                — not a number

# Rounding functions (each has different behavior!)
x = 3.7
print(math.floor(x))    # 3   — round toward −∞ (largest int ≤ x)
print(math.ceil(x))     # 4   — round toward +∞ (smallest int ≥ x)
print(math.trunc(x))    # 3   — round toward 0 (remove decimal)
print(round(x))         # 4   — round to nearest (banker's rounding for .5)

# Negative numbers — floor vs trunc differ!
print(math.floor(-3.7))   # -4  (toward −∞)
print(math.trunc(-3.7))   # -3  (toward 0)
print(math.ceil(-3.7))    # -3  (toward +∞)
\`\`\`

## Powers, Roots, and Logarithms

\`\`\`python
import math

# Powers and roots
print(math.sqrt(144))        # 12.0   — square root
print(math.pow(2, 10))       # 1024.0 — float power (prefer ** for ints)
print(math.isqrt(17))        # 4      — integer square root (Python 3.8+)
print(2 ** 32)               # 4294967296 — int power (exact, no float!)
print(math.hypot(3, 4))      # 5.0   — √(3²+4²) — Euclidean distance
print(math.hypot(1, 1, 1))   # 1.732 — 3D distance from origin (3.8+)

# Logarithms
print(math.log(math.e))        # 1.0    — natural log (base e)
print(math.log(1000, 10))      # 3.0    — log base 10
print(math.log10(1000))        # 3.0    — same, more precise
print(math.log2(1024))         # 10.0   — log base 2
print(math.log1p(0.0001))      # accurate for values close to 0
print(math.exp(1))             # 2.718  — e^x
print(math.expm1(0.0001))      # accurate for values close to 0
\`\`\`

## Trigonometry and Geometry

\`\`\`python
import math

# Trig functions work in RADIANS, not degrees!
angle_degrees = 45
angle_radians = math.radians(angle_degrees)   # convert
print(math.sin(angle_radians))     # 0.7071... — sin(45°)
print(math.cos(angle_radians))     # 0.7071...
print(math.tan(angle_radians))     # 1.0

# Inverse trig
print(math.degrees(math.asin(0.5)))  # 30.0
print(math.degrees(math.atan2(1, 1)))  # 45.0 — atan2 handles quadrants

# Common geometry
def circle_area(radius): return math.pi * radius**2
def distance(x1, y1, x2, y2): return math.hypot(x2-x1, y2-y1)

print(f"Circle r=5: area={circle_area(5):.4f}")
print(f"Distance (0,0)→(3,4): {distance(0,0,3,4):.1f}")
\`\`\`

## Floating-Point Comparison with math.isclose()

Never use \`==\` to compare floats! Use \`math.isclose()\`:

\`\`\`python
import math

# Floating-point arithmetic is not exact:
print(0.1 + 0.2)           # 0.30000000000000004 — not 0.3!
print(0.1 + 0.2 == 0.3)    # False — WRONG comparison!

# math.isclose() handles this correctly:
print(math.isclose(0.1 + 0.2, 0.3))          # True ✓
print(math.isclose(0.1 + 0.2, 0.3, rel_tol=1e-9))  # True — relative tolerance
print(math.isclose(0.000001, 0.0000011, abs_tol=1e-6))  # True — absolute tolerance

# Parameters:
# rel_tol: max relative difference (default 1e-9 = 0.0000001%)
# abs_tol: max absolute difference (default 0.0)

# Other useful math functions
print(math.factorial(10))    # 3628800
print(math.gcd(48, 36))      # 12  — greatest common divisor
print(math.lcm(4, 6))        # 12  — least common multiple (3.9+)
print(math.perm(5, 2))       # 20  — permutations P(5,2) = 5!/(5-2)!
print(math.comb(5, 2))       # 10  — combinations C(5,2) = 5!/(2!·3!)
print(math.isfinite(1/0.1))  # True
print(math.isnan(float('nan')))  # True
print(math.copysign(5, -3))  # -5.0  — magnitude of first, sign of second
\`\`\`

## The random Module — Pseudorandom Numbers

\`random\` generates pseudorandom numbers — deterministic but statistically random:

\`\`\`python
import random

# Float in [0.0, 1.0)
print(random.random())            # e.g., 0.7453

# Float in [a, b]
print(random.uniform(1.5, 5.0))  # e.g., 3.284

# Integer in [a, b] inclusive
print(random.randint(1, 6))      # dice roll: 1, 2, 3, 4, 5, or 6
print(random.randrange(0, 10, 2))  # even number: 0, 2, 4, 6, or 8

# Gaussian (normal) distribution
print(random.gauss(mu=170, sigma=10))   # height distribution
print(random.normalvariate(0, 1))       # standard normal

# Sequences
items = ["apple", "banana", "cherry", "date", "elderberry"]
print(random.choice(items))             # one random element
print(random.choices(items, k=3))       # 3 with replacement (duplicates OK)
print(random.sample(items, k=3))        # 3 without replacement (no duplicates)

random.shuffle(items)                    # shuffle in-place
print(items)                            # random order

# Weighted random choice
fruits = ["apple", "banana", "cherry"]
weights = [10, 3, 1]   # apple is 10x more likely than cherry
for _ in range(5):
    print(random.choices(fruits, weights=weights, k=1)[0])
\`\`\`

## Seeding for Reproducibility

\`\`\`python
import random

# Seed makes random deterministic — same seed = same sequence
random.seed(42)
print([random.randint(1, 10) for _ in range(5)])  # always [2, 1, 5, 4, 4]

random.seed(42)  # reset
print([random.randint(1, 10) for _ in range(5)])  # [2, 1, 5, 4, 4] again!

# Use for:
# - Unit tests (reproducible random behavior)
# - Scientific simulations (reproduce results)
# - Machine learning (reproducible train/test splits)

# DON'T seed in production — you want actual randomness there
\`\`\`

## secrets — Cryptographically Secure Randomness

For security-sensitive operations, \`random\` is NEVER appropriate — it\\'s predictable:

\`\`\`python
import secrets

# Secure random integers
print(secrets.randbelow(100))      # [0, 100) — cryptographically secure
print(secrets.choice([1,2,3,4,5])) # secure choice

# Secure tokens (session IDs, API keys, password reset tokens)
token_hex = secrets.token_hex(32)       # 64-char hexadecimal string
token_url = secrets.token_urlsafe(32)   # 43-char URL-safe base64 string
token_bytes = secrets.token_bytes(32)   # 32 raw bytes

print(f"Session token: {token_url}")   # e.g., "3TiBhnosis0HpKGHeHiKm..."

# Generate a random password
import string
alphabet = string.ascii_letters + string.digits + "!@#$%"
password = ''.join(secrets.choice(alphabet) for _ in range(16))
print(f"Secure password: {password}")

# Timing-safe comparison (prevents timing attacks!)
import hmac
def secure_compare(a: str, b: str) -> bool:
    """Compare two strings in constant time."""
    return hmac.compare_digest(a.encode(), b.encode())
\`\`\`

## Try It Yourself

\`\`\`python
import random, math

# 1. Monte Carlo estimation of π:
def estimate_pi(n_samples: int) -> float:
    """Estimate π using Monte Carlo sampling."""
    inside = sum(
        1 for _ in range(n_samples)
        if random.random()**2 + random.random()**2 <= 1.0
    )
    return 4 * inside / n_samples

random.seed(42)
for n in [1000, 10000, 100000, 1000000]:
    estimate = estimate_pi(n)
    error = abs(estimate - math.pi)
    print(f"n={n:8,}: π ≈ {estimate:.5f} (error: {error:.5f})")

# 2. Simulate rolling 2 dice 10,000 times and plot the distribution:
random.seed(0)
from collections import Counter
rolls = Counter(random.randint(1,6) + random.randint(1,6) for _ in range(10_000))
print("\nDice sum distribution:")
for total in range(2, 13):
    count = rolls[total]
    bar = "█" * (count // 50)
    print(f"{total:2d}: {count:5d} {bar}")
\`\`\`
`,
  },

  'intermediate-standard-modules-datetime': {
    readTime: 9,
    whatYoullLearn: [
      'Create and inspect date, time, and datetime objects',
      'Format datetimes with strftime() and parse strings with strptime()',
      'Perform date arithmetic with timedelta',
      'Work with time zones using the zoneinfo module (Python 3.9+)',
      'Build practical date utilities: age calculation, business days, countdowns',
    ],
    content: `
## The datetime Module — Four Core Classes

\`\`\`python
from datetime import date, time, datetime, timedelta, timezone

# date — represents a calendar date (year, month, day)
today = date.today()              # current local date
birthday = date(1990, 6, 15)      # specific date
print(today)                      # "2025-03-04"
print(birthday)                   # "1990-06-15"
print(birthday.year)              # 1990
print(birthday.month)             # 6
print(birthday.day)               # 15
print(birthday.weekday())         # 0=Mon, 1=Tue, ..., 6=Sun
print(birthday.strftime("%A"))    # "Saturday"
print(birthday.isoformat())       # "1990-06-15"

# time — represents a time of day (hour, minute, second, microsecond)
noon = time(12, 0, 0)
meeting = time(14, 30, 45, 500_000)  # 2:30:45.5 PM
print(noon)                       # "12:00:00"
print(meeting.hour, meeting.minute)  # 14  30
print(meeting.isoformat())        # "14:30:45.500000"

# datetime — combines date + time
now = datetime.now()              # current local datetime (naive — no tz)
utcnow = datetime.utcnow()        # current UTC (naive)
event = datetime(2025, 12, 31, 23, 59, 59)
print(now.isoformat())            # "2025-03-04T14:30:45.123456"
print(event.date())               # date(2025, 12, 31)
print(event.time())               # time(23, 59, 59)
print(event.timestamp())          # Unix timestamp (float)

# Convert from timestamp
dt = datetime.fromtimestamp(1709560000)
print(dt)   # local time for that timestamp
\`\`\`

## Formatting and Parsing

\`\`\`python
from datetime import datetime

now = datetime.now()

# strftime — format datetime as string
# Common format codes:
# %Y = 4-digit year   %y = 2-digit year
# %m = month (01-12)  %B = full month name  %b = abbreviated
# %d = day (01-31)    %A = full weekday     %a = abbreviated
# %H = hour 24h       %I = hour 12h         %p = AM/PM
# %M = minute         %S = second           %f = microseconds
# %Z = timezone name  %z = UTC offset       %j = day of year

print(now.strftime("%Y-%m-%d"))                # "2025-03-04"
print(now.strftime("%d/%m/%Y"))                # "04/03/2025"
print(now.strftime("%B %d, %Y"))               # "March 04, 2025"
print(now.strftime("%A, %B %d, %Y %I:%M %p")) # "Tuesday, March 04, 2025 02:30 PM"
print(now.strftime("%Y-%m-%dT%H:%M:%S"))       # ISO 8601: "2025-03-04T14:30:45"

# strptime — parse string to datetime (inverse of strftime)
dt1 = datetime.strptime("2025-06-15 14:30:00", "%Y-%m-%d %H:%M:%S")
dt2 = datetime.strptime("15/06/2025", "%d/%m/%Y")
dt3 = datetime.strptime("March 15, 2025", "%B %d, %Y")

# ISO format parsing (Python 3.7+)
dt4 = datetime.fromisoformat("2025-06-15T14:30:00")
dt5 = datetime.fromisoformat("2025-06-15")       # date only → 00:00:00
print(dt4, dt5)
\`\`\`

## timedelta — Date Arithmetic

\`\`\`python
from datetime import datetime, timedelta, date

now = datetime.now()

# Create timedeltas
one_day = timedelta(days=1)
two_weeks = timedelta(weeks=2)
ninety_minutes = timedelta(minutes=90)
precise = timedelta(days=3, hours=12, minutes=30, seconds=15)

# Arithmetic
tomorrow = now + one_day
yesterday = now - one_day
two_weeks_ago = now - two_weeks

# Difference between dates/datetimes
birthday = datetime(1990, 6, 15)
lived = now - birthday
print(f"Days lived: {lived.days:,}")               # e.g., 12,680
print(f"Total seconds: {int(lived.total_seconds()):,}")
print(f"Age in years: {lived.days // 365}")

# Find a future date
deadline = date.today() + timedelta(days=30)
print(f"Deadline: {deadline.strftime('%B %d, %Y')}")

# timedelta components:
td = timedelta(days=10, hours=14, minutes=30)
print(td.days)             # 10
print(td.seconds)          # 52200  (14h30m in seconds, not total seconds!)
print(td.total_seconds())  # 918600.0 (actual total seconds)

# Comparison
early = timedelta(hours=2)
late  = timedelta(hours=10)
print(early < late)    # True
print(late - early)    # 0:08:00 (8 hours)
\`\`\`

## Time Zones with zoneinfo (Python 3.9+)

\`\`\`python
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo   # Python 3.9+

# Naive datetime: no timezone info
naive = datetime.now()
print(naive.tzinfo)      # None

# Aware datetime: has timezone info
utc_now = datetime.now(timezone.utc)
ny_now = datetime.now(ZoneInfo("America/New_York"))
tokyo_now = datetime.now(ZoneInfo("Asia/Tokyo"))
london_now = datetime.now(ZoneInfo("Europe/London"))

print(utc_now.isoformat())     # "2025-03-04T14:30:45+00:00"
print(ny_now.isoformat())      # "2025-03-04T09:30:45-05:00"

# Convert between timezones
london_event = datetime(2025, 6, 15, 14, 0, 0, tzinfo=ZoneInfo("Europe/London"))
ny_time = london_event.astimezone(ZoneInfo("America/New_York"))
tokyo_time = london_event.astimezone(ZoneInfo("Asia/Tokyo"))
print(f"London 2pm = {ny_time.strftime('%I:%M %p')} New York = {tokyo_time.strftime('%I:%M %p')} Tokyo")

# Attach timezone to a naive datetime
naive = datetime(2025, 3, 4, 14, 0)
aware = naive.replace(tzinfo=ZoneInfo("America/New_York"))

# List available timezones
from zoneinfo import available_timezones
zones = sorted(available_timezones())
us_zones = [z for z in zones if z.startswith("America/")]
print(f"US zones: {len(us_zones)}")
\`\`\`

## Practical Date Utilities

\`\`\`python
from datetime import date, timedelta

def calculate_age(birthday: date) -> int:
    """Calculate age in full years as of today."""
    today = date.today()
    years = today.year - birthday.year
    # Subtract 1 if birthday hasn't occurred yet this year
    if (today.month, today.day) < (birthday.month, birthday.day):
        years -= 1
    return years

print(calculate_age(date(1990, 6, 15)))   # 34 (in 2025)

def business_days_between(start: date, end: date) -> int:
    """Count business days (Mon-Fri) between two dates."""
    days = 0
    current = start
    while current < end:
        if current.weekday() < 5:   # 0=Mon ... 4=Fri
            days += 1
        current += timedelta(days=1)
    return days

def next_weekday(d: date, weekday: int) -> date:
    """Return the next occurrence of a weekday (0=Mon, 6=Sun)."""
    days_ahead = weekday - d.weekday()
    if days_ahead <= 0:  # already past this weekday this week
        days_ahead += 7
    return d + timedelta(days=days_ahead)

today = date.today()
next_monday = next_weekday(today, 0)
print(f"Next Monday: {next_monday}")

def days_until_event(event_date: date) -> int:
    """Days from today until a future date."""
    delta = event_date - date.today()
    return max(0, delta.days)

new_year = date(2026, 1, 1)
print(f"Days until New Year: {days_until_event(new_year)}")
\`\`\`

## Try It Yourself

\`\`\`python
from datetime import datetime, date, timedelta

# 1. Parse a log file timestamp and check if it's within the last 24 hours:
log_timestamp = "2025-03-04 13:45:22"
log_dt = datetime.strptime(log_timestamp, "%Y-%m-%d %H:%M:%S")
now = datetime.now()
is_recent = (now - log_dt) < timedelta(hours=24)
print(f"Recent log: {is_recent}")

# 2. Calculate the date of Easter Sunday for a given year (Spencer's algorithm):
def easter(year: int) -> date:
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19*a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2*e + 2*i - h - k) % 7
    m = (a + 11*h + 22*l) // 451
    month = (h + l - 7*m + 114) // 31
    day = ((h + l - 7*m + 114) % 31) + 1
    return date(year, month, day)

for year in range(2025, 2030):
    e = easter(year)
    print(f"Easter {year}: {e.strftime('%B %d, %Y')}")
\`\`\`
`,
  },

  'intermediate-standard-modules-collections': {
    readTime: 9,
    whatYoullLearn: [
      'Count elements efficiently with Counter including arithmetic operations',
      'Avoid KeyError with defaultdict and understand its factory function',
      'Use deque for efficient queue and sliding window operations',
      'Create readable structured records with namedtuple and typing.NamedTuple',
      'Use OrderedDict for order-dependent operations',
    ],
    content: `
## Counter — Counting Made Easy

\`Counter\` is a dict subclass specialized for counting. Missing keys return 0 instead of raising \`KeyError\`:

\`\`\`python
from collections import Counter

# Count elements from any iterable
words = "the quick brown fox jumps over the lazy dog the".split()
word_count = Counter(words)
print(word_count)
# Counter({'the': 3, 'quick': 1, 'brown': 1, 'fox': 1, ...})

print(word_count["the"])      # 3
print(word_count["missing"])  # 0  — NOT KeyError!
print(word_count.total())     # 9  — sum of all counts (3.10+)

# Most common elements
print(word_count.most_common(3))   # [('the', 3), ('quick', 1), ('brown', 1)]
print(word_count.most_common()[:-4:-1])  # 3 least common

# Count characters
char_count = Counter("abracadabra")
print(char_count.most_common())
# [('a', 5), ('b', 2), ('r', 2), ('c', 1), ('d', 1)]

# Update and subtract
more_words = Counter(["the", "fox", "fox"])
word_count.update(more_words)     # add counts
word_count.subtract(["the"])      # subtract counts (allows negatives!)
print(word_count.most_common(3))  # fox now has more count

# Arithmetic on counters:
c1 = Counter(a=3, b=1, c=2)
c2 = Counter(a=1, b=2, d=4)
print(c1 + c2)    # Counter({'a': 4, 'c': 2, 'b': 3, 'd': 4}) — add
print(c1 - c2)    # Counter({'a': 2, 'c': 2}) — subtract (drops ≤0)
print(c1 & c2)    # Counter({'a': 1, 'b': 1}) — min (intersection)
print(c1 | c2)    # Counter({'a': 3, 'b': 2, 'c': 2, 'd': 4}) — max (union)

# Convert to list of (element, count) pairs
elements = list(word_count.elements())  # repeats each element count times
print(sorted(elements))
\`\`\`

## defaultdict — Automatic Default Values

\`defaultdict\` calls a factory function to create default values for missing keys, eliminating verbose \`setdefault\` and \`in\` checks:

\`\`\`python
from collections import defaultdict

# Without defaultdict — verbose
groups = {}
for word in ["apple", "ant", "banana", "bear", "cherry"]:
    key = word[0]
    if key not in groups:
        groups[key] = []
    groups[key].append(word)

# With defaultdict — clean
groups = defaultdict(list)   # factory: list()
for word in ["apple", "ant", "banana", "bear", "cherry"]:
    groups[word[0]].append(word)   # no KeyError!

print(dict(groups))
# {'a': ['apple', 'ant'], 'b': ['banana', 'bear'], 'c': ['cherry']}

# Other useful factories:
word_lengths = defaultdict(int)       # missing keys start at 0
for word in words:
    word_lengths[len(word)] += 1

nested_dict = defaultdict(dict)       # missing keys are empty dicts
deep = defaultdict(lambda: defaultdict(list))  # nested defaultdict

# Build an inverted index (word → list of document IDs)
documents = {
    1: "the quick brown fox",
    2: "the lazy dog",
    3: "brown dog and fox",
}
index = defaultdict(list)
for doc_id, text in documents.items():
    for word in text.split():
        index[word].append(doc_id)

print(dict(index["fox"]))     # [1, 3]
print(dict(index["the"]))     # [1, 2]
\`\`\`

## deque — Efficient Double-Ended Queue

\`list\` is O(1) at the right end but O(n) at the left. \`deque\` is O(1) at BOTH ends:

\`\`\`python
from collections import deque

# Basic operations
d = deque([1, 2, 3, 4, 5])
d.append(6)          # add to right: [1,2,3,4,5,6]   O(1)
d.appendleft(0)      # add to left:  [0,1,2,3,4,5,6] O(1)
d.pop()              # remove right: [0,1,2,3,4,5]    O(1)
d.popleft()          # remove left:  [1,2,3,4,5]      O(1)

d.extend([6, 7])     # add multiple to right
d.extendleft([-1, -2])  # add to left (note: reversed order!)

d.rotate(2)          # rotate right: last 2 elements move to front
d.rotate(-1)         # rotate left

# Fixed-size deque — auto-discards oldest when full
recent = deque(maxlen=5)
for i in range(10):
    recent.append(i)
    print(list(recent))   # always shows last 5
# [5, 6, 7, 8, 9]

# Sliding window average
def moving_average(data, n: int):
    """Yield moving averages of window size n."""
    window = deque(maxlen=n)
    for x in data:
        window.append(x)
        if len(window) == n:
            yield sum(window) / n

prices = [10, 12, 11, 13, 15, 14, 16, 18, 17, 19]
averages = list(moving_average(prices, 3))
print([f"{a:.1f}" for a in averages])
# ['11.0', '12.0', '13.0', '14.0', '15.0', '16.0', '17.0', '18.0']

# BFS using deque (O(1) popleft makes it efficient)
def bfs(graph: dict, start: str) -> list:
    """Breadth-first search — deque is critical for O(1) queue operations."""
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()          # O(1) — NOT O(n) like list.pop(0)!
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order
\`\`\`

## namedtuple and typing.NamedTuple

Create readable, lightweight data structures without a full class:

\`\`\`python
from collections import namedtuple

# Classic namedtuple
Point = namedtuple("Point", ["x", "y"])
Color = namedtuple("Color", "r g b alpha")   # space-separated string also works

p = Point(3, 7)
print(p.x, p.y)    # 3 7 — attribute access
print(p[0], p[1])  # 3 7 — index access still works
print(p)           # Point(x=3, y=7) — nice repr

# Immutable like tuples:
# p.x = 10  # AttributeError!

# Create with defaults (Python 3.6.1+)
Point3D = namedtuple("Point3D", ["x", "y", "z"], defaults=[0])
p3 = Point3D(1, 2)     # z defaults to 0
print(p3)              # Point3D(x=1, y=2, z=0)

# Convert to dict or make a modified copy:
print(p._asdict())         # {'x': 3, 'y': 7}
p_new = p._replace(x=10)  # Point(x=10, y=7)

# Modern approach: typing.NamedTuple (has type hints and default values)
from typing import NamedTuple

class Employee(NamedTuple):
    name: str
    department: str
    salary: float
    active: bool = True    # default value!

emp = Employee("Alice", "Engineering", 95000)
print(emp)                 # Employee(name='Alice', department='Engineering', salary=95000, active=True)
print(emp.name)            # "Alice"
print(emp._asdict())       # {'name': 'Alice', ...}
print(emp.salary > 80000)  # True

# Sort by salary:
team = [
    Employee("Alice", "Eng", 95000),
    Employee("Bob", "Mkt", 75000),
    Employee("Carol", "Eng", 92000),
]
team.sort(key=lambda e: e.salary, reverse=True)
for e in team:
    print(f"{e.name}: \${e.salary:,}")
\`\`\`

## OrderedDict — When Order Matters

In Python 3.7+, regular dicts maintain insertion order. \`OrderedDict\` adds order-specific operations:

\`\`\`python
from collections import OrderedDict

# Move items to the start or end
od = OrderedDict([("a", 1), ("b", 2), ("c", 3)])
od.move_to_end("a")          # "a" goes to end: b, c, a
od.move_to_end("c", last=False)  # "c" goes to start: c, b, a

# popitem from either end
od.popitem(last=True)   # removes last item: a
od.popitem(last=False)  # removes first item: c

# LRU Cache implementation (educational):
class LRUCache(OrderedDict):
    """Least Recently Used cache with max capacity."""

    def __init__(self, capacity: int):
        super().__init__()
        self.capacity = capacity

    def get(self, key) -> object:
        if key not in self:
            return None
        self.move_to_end(key)  # mark as recently used
        return self[key]

    def put(self, key, value) -> None:
        self[key] = value
        self.move_to_end(key)
        if len(self) > self.capacity:
            self.popitem(last=False)  # remove least recently used

cache = LRUCache(3)
cache.put("a", 1); cache.put("b", 2); cache.put("c", 3)
cache.get("a")       # "a" is now most recently used
cache.put("d", 4)    # evicts "b" (least recently used)
print(list(cache.keys()))   # ['c', 'a', 'd']
\`\`\`

## Try It Yourself

\`\`\`python
from collections import Counter, defaultdict, deque
from typing import NamedTuple

# 1. Write a word frequency analyzer:
def analyze_text(text: str) -> dict:
    """Return a dict with word count, unique words, and top 5 words."""
    words = text.lower().split()
    counts = Counter(words)
    return {
        "total_words": len(words),
        "unique_words": len(counts),
        "top_5": counts.most_common(5),
        "most_common": counts.most_common(1)[0][0],
    }

# 2. Build a graph and find all paths using BFS:
graph = defaultdict(list)
edges = [("A","B"), ("A","C"), ("B","D"), ("C","D"), ("D","E")]
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)

# Find shortest path from A to E:
def shortest_path(graph, start, end):
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

print(shortest_path(dict(graph), "A", "E"))   # ['A', 'B', 'D', 'E'] or ['A', 'C', 'D', 'E']
\`\`\`
`,
  },

  // ─── REMAINING SHORT LESSONS — EXPERT LEVEL ──────────────────────

  'advanced-advanced-modules-functools': {
    readTime: 9,
    whatYoullLearn: [
      'Eliminate redundant calls with @lru_cache and @cache memoization',
      'Fix decorator metadata preservation with @wraps',
      'Create specialized function variants with partial()',
      'Build custom comparison keys with cmp_to_key()',
      'Use reduce() for fold/accumulate operations',
    ],
    content: `
## functools: Tools for Working with Functions

\`functools\` provides higher-order functions and tools for creating and modifying other functions. It sits at the heart of Python\\'s functional programming toolkit.

\`\`\`python
from functools import lru_cache, cache, wraps, partial, reduce, cmp_to_key, total_ordering
import time

# ─── lru_cache ────────────────────────────────────────────────────────────────
# Memoizes function results — caches up to 'maxsize' most recent calls

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

start = time.perf_counter()
print(fibonacci(50))        # instant — 12586269025
print(time.perf_counter() - start)

# Inspect the cache:
print(fibonacci.cache_info())   # CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)
fibonacci.cache_clear()          # clear the cache

# @cache — equivalent to @lru_cache(maxsize=None), unbounded (Python 3.9+)
@cache
def fib_unbounded(n: int) -> int:
    if n < 2:
        return n
    return fib_unbounded(n - 1) + fib_unbounded(n - 2)

print(fib_unbounded(100))   # 354224848179261915075 — no maxsize eviction

# lru_cache on methods — requires hashable 'self':
class DataFetcher:
    def __init__(self, base_url: str):
        self.base_url = base_url

    @lru_cache(maxsize=64)
    def get_user(self, user_id: int) -> dict:
        # Expensive API call cached by user_id
        import urllib.request, json
        url = f"{self.base_url}/users/{user_id}"
        # with urllib.request.urlopen(url) as r:
        #     return json.load(r)
        return {"id": user_id, "name": f"User{user_id}"}  # simulated
\`\`\`

## @wraps — Preserving Function Metadata

When writing decorators, \`@wraps\` copies the wrapped function\\'s metadata (\`__name__\`, \`__doc__\`, \`__annotations__\`, etc.) to the wrapper:

\`\`\`python
from functools import wraps
import time, logging

logger = logging.getLogger(__name__)

def timed(func):
    """Decorator: measure and log execution time."""
    @wraps(func)   # WITHOUT @wraps, func.__name__ would be "wrapper"!
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        logger.debug("%s took %.4fs", func.__name__, elapsed)
        return result
    return wrapper

def retry(max_attempts: int = 3, delay: float = 0.5, exceptions=(Exception,)):
    """Decorator factory: retry on failure."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exc = e
                    if attempt < max_attempts - 1:
                        time.sleep(delay * (2 ** attempt))  # exponential backoff
            raise last_exc
        return wrapper
    return decorator

@timed
@retry(max_attempts=3, exceptions=(ConnectionError, TimeoutError))
def fetch_data(url: str) -> bytes:
    """Fetch data from URL with automatic retry."""
    import urllib.request
    with urllib.request.urlopen(url, timeout=5) as r:
        return r.read()

# Metadata is preserved:
print(fetch_data.__name__)   # "fetch_data" (not "wrapper")
print(fetch_data.__doc__)    # "Fetch data from URL with automatic retry."
\`\`\`

## partial() — Pre-fill Function Arguments

\`partial(func, *args, **kwargs)\` creates a new function with some arguments pre-filled:

\`\`\`python
from functools import partial

# Basic use
def power(base: float, exponent: float) -> float:
    return base ** exponent

square = partial(power, exponent=2)
cube   = partial(power, exponent=3)

print(square(5))    # 25.0
print(cube(3))      # 27.0
print([square(x) for x in range(1, 6)])  # [1, 4, 9, 16, 25]

# partial with built-ins
import operator
double = partial(operator.mul, 2)
print(list(map(double, [1, 2, 3, 4, 5])))  # [2, 4, 6, 8, 10]

# Useful for creating specialized versions of generic functions:
import json
pretty_json = partial(json.dumps, indent=2, sort_keys=True, ensure_ascii=False)
compact_json = partial(json.dumps, separators=(",", ":"))

data = {"name": "Alice", "city": "Tokyo", "score": 95}
print(pretty_json(data))
print(compact_json(data))

# Partial in event handlers and callbacks:
def handle_button_click(button_id: str, event) -> None:
    print(f"Button {button_id} clicked: {event}")

# Bind different IDs to the same handler:
ok_handler     = partial(handle_button_click, "ok")
cancel_handler = partial(handle_button_click, "cancel")
# gui.bind(ok_button, "click", ok_handler)
# gui.bind(cancel_button, "click", cancel_handler)
\`\`\`

## reduce() — Fold a Sequence

\`reduce(func, iterable, initial=None)\` applies a two-argument function cumulatively:

\`\`\`python
from functools import reduce
import operator

numbers = [1, 2, 3, 4, 5]

# Sum via reduce (use sum() in practice)
total = reduce(operator.add, numbers)    # 15
total = reduce(operator.add, numbers, 100)  # 115 (starts from 100)

# Product
product = reduce(operator.mul, numbers, 1)  # 120

# Compose functions: apply f1, then f2, then f3
def compose(*functions):
    """Return a function that applies all functions right-to-left."""
    def composed(arg):
        return reduce(lambda v, f: f(v), reversed(functions), arg)
    return composed

import math
process = compose(str, int, math.sqrt, abs)
print(process(-16))     # str(int(sqrt(abs(-16)))) → "4"

# Deep dict merge:
configs = [
    {"host": "localhost", "port": 8080},
    {"debug": True},
    {"port": 443, "ssl": True},
]
merged = reduce(lambda acc, d: {**acc, **d}, configs, {})
print(merged)   # {'host': 'localhost', 'port': 443, 'debug': True, 'ssl': True}
\`\`\`

## cmp_to_key — Legacy Comparison Functions

\`\`\`python
from functools import cmp_to_key

# Python 2 style: cmp(a,b) returns negative, 0, positive
# Python 3 only uses key= in sorted(), so use cmp_to_key to adapt

def compare_versions(v1: str, v2: str) -> int:
    """Compare semantic version strings."""
    parts1 = [int(x) for x in v1.split(".")]
    parts2 = [int(x) for x in v2.split(".")]
    for p1, p2 in zip(parts1, parts2):
        if p1 != p2:
            return p1 - p2
    return len(parts1) - len(parts2)

versions = ["1.10.0", "1.2.1", "2.0.0", "1.2.0", "1.9.3"]
sorted_versions = sorted(versions, key=cmp_to_key(compare_versions))
print(sorted_versions)   # ['1.2.0', '1.2.1', '1.9.3', '1.10.0', '2.0.0']
\`\`\`

## Try It Yourself

\`\`\`python
from functools import lru_cache, wraps, partial, reduce
import time

# 1. Implement a disk-backed memoize decorator using @wraps:
def disk_memoize(func):
    """Cache function results on disk across program runs."""
    import pickle, hashlib
    from pathlib import Path
    cache_dir = Path(".func_cache")
    cache_dir.mkdir(exist_ok=True)

    @wraps(func)
    def wrapper(*args, **kwargs):
        key = pickle.dumps((func.__qualname__, args, sorted(kwargs.items())))
        cache_file = cache_dir / f"{hashlib.md5(key).hexdigest()}.pkl"
        if cache_file.exists():
            return pickle.loads(cache_file.read_bytes())
        result = func(*args, **kwargs)
        cache_file.write_bytes(pickle.dumps(result))
        return result

    return wrapper

@disk_memoize
def slow_computation(n: int) -> int:
    time.sleep(1)  # simulate slow work
    return n ** 2

print(slow_computation(5))   # 25 (slow first time)
print(slow_computation(5))   # 25 (instant from cache)

# 2. Use partial() to create a URL builder:
def build_url(scheme: str, host: str, path: str = "/", **params) -> str:
    query = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
    base = f"{scheme}://{host}{path}"
    return f"{base}?{query}" if query else base

api_url = partial(build_url, "https", "api.example.com")
search_url = partial(api_url, "/search")
print(api_url("/users", page=1, limit=20))
print(search_url(q="python", sort="relevance"))
\`\`\`
`,
  },

  'expert-advanced-async-aiohttp-async-db': {
    readTime: 10,
    whatYoullLearn: [
      'Make concurrent HTTP requests with aiohttp ClientSession',
      'Handle timeouts, retries, and error responses in async HTTP',
      'Connect to PostgreSQL asynchronously with asyncpg',
      'Use connection pools for efficient database access',
      'Combine async HTTP + async DB in a complete data pipeline',
    ],
    content: `
## aiohttp — Async HTTP Client and Server

\`aiohttp\` provides an async HTTP client (and server). Unlike \`requests\` which blocks, aiohttp yields control back to the event loop while waiting for network I/O:

\`\`\`python
import asyncio
import aiohttp
import time

# Always reuse a single ClientSession across requests
# (creates a connection pool internally)
async def fetch_one(session: aiohttp.ClientSession, url: str) -> dict:
    """Fetch a single URL and return parsed JSON."""
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
        resp.raise_for_status()   # raise ClientResponseError for 4xx/5xx
        return await resp.json()

async def fetch_many_sequential(urls: list) -> list:
    """Sequential — total time = sum of all request times."""
    async with aiohttp.ClientSession() as session:
        results = []
        for url in urls:
            results.append(await fetch_one(session, url))
        return results

async def fetch_many_concurrent(urls: list) -> list:
    """Concurrent — total time = max single request time."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

# Benchmark:
urls = [f"https://jsonplaceholder.typicode.com/posts/{i}" for i in range(1, 11)]

async def main():
    start = time.perf_counter()
    results = await fetch_many_concurrent(urls)
    elapsed = time.perf_counter() - start
    successes = sum(1 for r in results if isinstance(r, dict))
    print(f"Fetched {successes}/{len(urls)} in {elapsed:.2f}s")

asyncio.run(main())
# Typical: 10 requests in ~0.5s (vs ~5s sequential)
\`\`\`

## Rate Limiting and Retry Logic

\`\`\`python
import asyncio, aiohttp
from asyncio import Semaphore

async def fetch_with_retry(
    session: aiohttp.ClientSession,
    url: str,
    semaphore: Semaphore,
    max_retries: int = 3,
    backoff: float = 1.0,
) -> dict:
    """Fetch with rate limiting, retry, and exponential backoff."""
    async with semaphore:
        for attempt in range(max_retries):
            try:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    if resp.status == 429:   # Too Many Requests
                        retry_after = float(resp.headers.get("Retry-After", backoff))
                        print(f"Rate limited, waiting {retry_after}s...")
                        await asyncio.sleep(retry_after)
                        continue
                    resp.raise_for_status()
                    return await resp.json()
            except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                if attempt == max_retries - 1:
                    raise
                wait = backoff * (2 ** attempt)
                print(f"Attempt {attempt+1} failed: {e}. Retrying in {wait}s...")
                await asyncio.sleep(wait)

async def bulk_fetch(urls: list, rate_per_second: int = 5) -> list:
    """Fetch all URLs, limited to rate_per_second concurrent requests."""
    semaphore = Semaphore(rate_per_second)
    connector = aiohttp.TCPConnector(limit=100, limit_per_host=20)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [fetch_with_retry(session, url, semaphore) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)
\`\`\`

## POST, headers, and JSON payloads

\`\`\`python
import asyncio, aiohttp, json

API_BASE = "https://jsonplaceholder.typicode.com"

async def create_post(session: aiohttp.ClientSession, title: str, body: str, user_id: int) -> dict:
    """Create a new post via POST request."""
    payload = {"title": title, "body": body, "userId": user_id}
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer my-api-token",
    }
    async with session.post(
        f"{API_BASE}/posts",
        json=payload,         # auto-serializes and sets Content-Type
        headers=headers,
    ) as resp:
        resp.raise_for_status()
        result = await resp.json()
        print(f"Created post ID: {result.get('id')}")
        return result

async def update_post(session: aiohttp.ClientSession, post_id: int, **fields) -> dict:
    """Partial update via PATCH."""
    async with session.patch(
        f"{API_BASE}/posts/{post_id}",
        json=fields,
    ) as resp:
        resp.raise_for_status()
        return await resp.json()

async def main():
    async with aiohttp.ClientSession() as session:
        post = await create_post(session, "Hello async!", "Content here.", 1)
        updated = await update_post(session, post["id"], title="Updated Title")
        print(updated)

asyncio.run(main())
\`\`\`

## asyncpg — Async PostgreSQL

\`asyncpg\` is a fast, pure-Python async PostgreSQL client:

\`\`\`python
import asyncio
import asyncpg   # pip install asyncpg

# Connect and run queries
async def basic_queries():
    conn = await asyncpg.connect(
        host="localhost",
        port=5432,
        database="mydb",
        user="postgres",
        password="secret",
    )

    # Create table
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Insert — use $1, $2, ... for parameters (prevents SQL injection)
    await conn.execute(
        "INSERT INTO users(name, email) VALUES($1, $2)",
        "Alice", "alice@example.com"
    )

    # Fetch multiple rows
    rows = await conn.fetch("SELECT id, name, email FROM users ORDER BY id")
    for row in rows:
        print(dict(row))   # row acts like a dict: row["name"]

    # Fetch one
    row = await conn.fetchrow("SELECT * FROM users WHERE email = $1", "alice@example.com")
    print(row["name"])   # "Alice"

    # Fetch a single value
    count = await conn.fetchval("SELECT COUNT(*) FROM users")
    print(f"Users: {count}")

    await conn.close()

asyncio.run(basic_queries())
\`\`\`

## Connection Pooling with asyncpg

\`\`\`python
import asyncio
import asyncpg

async def create_pool() -> asyncpg.Pool:
    """Create a connection pool for the lifetime of the application."""
    return await asyncpg.create_pool(
        dsn="postgresql://postgres:secret@localhost:5432/mydb",
        min_size=2,        # minimum idle connections
        max_size=20,       # maximum concurrent connections
        max_queries=50000, # recycle connection after 50k queries
        command_timeout=30,
    )

async def get_users_by_score(pool: asyncpg.Pool, min_score: float) -> list:
    """Fetch using a connection from the pool."""
    async with pool.acquire() as conn:  # get connection, return when done
        rows = await conn.fetch(
            "SELECT * FROM users WHERE score >= $1 ORDER BY score DESC",
            min_score,
        )
        return [dict(r) for r in rows]

async def insert_users_batch(pool: asyncpg.Pool, users: list[dict]) -> int:
    """Batch insert using a transaction."""
    async with pool.acquire() as conn:
        async with conn.transaction():   # rollback on exception
            await conn.executemany(
                "INSERT INTO users(name, email, score) VALUES($1, $2, $3)",
                [(u["name"], u["email"], u["score"]) for u in users]
            )
            return len(users)

async def main():
    pool = await create_pool()
    try:
        users = [
            {"name": "Bob",   "email": "bob@example.com",   "score": 85.0},
            {"name": "Carol", "email": "carol@example.com", "score": 92.0},
        ]
        count = await insert_users_batch(pool, users)
        print(f"Inserted {count} users")

        results = await get_users_by_score(pool, 80.0)
        for user in results:
            print(f"{user['name']}: {user['score']}")
    finally:
        await pool.close()

asyncio.run(main())
\`\`\`

## Try It Yourself

\`\`\`python
import asyncio, aiohttp

# Build a complete async data pipeline:
# 1. Fetch N users from JSONPlaceholder API concurrently
# 2. For each user, fetch their posts concurrently
# 3. Return a dict mapping user name → post count

async def get_user_post_counts(n_users: int = 5) -> dict:
    BASE = "https://jsonplaceholder.typicode.com"

    async with aiohttp.ClientSession() as session:
        # Step 1: fetch all users
        async with session.get(f"{BASE}/users") as r:
            all_users = await r.json()
        users = all_users[:n_users]

        # Step 2: fetch posts for each user concurrently
        async def user_posts(user):
            async with session.get(f"{BASE}/posts?userId={user['id']}") as r:
                posts = await r.json()
                return user["name"], len(posts)

        results = await asyncio.gather(*[user_posts(u) for u in users])
        return dict(results)

counts = asyncio.run(get_user_post_counts(5))
for name, count in sorted(counts.items(), key=lambda x: -x[1]):
    print(f"{name}: {count} posts")
\`\`\`
`,
  },

  'expert-networking-socket-programming': {
    readTime: 10,
    whatYoullLearn: [
      'Create TCP clients and servers using the socket module',
      'Handle multiple concurrent clients with threading',
      'Build a UDP client/server for low-latency messaging',
      'Use select() for non-blocking I/O multiplexing',
      'Understand common networking patterns: echo, chat, request/response',
    ],
    content: `
## Sockets: The Foundation of Network Programming

A socket is a communication endpoint. Two sockets on different machines (or the same machine) form a connection over a network. Python\\'s \`socket\` module gives direct access to the BSD socket API:

\`\`\`python
import socket

# Socket types:
# AF_INET  — IPv4 addresses (most common)
# AF_INET6 — IPv6 addresses
# SOCK_STREAM — TCP (reliable, ordered, connected)
# SOCK_DGRAM  — UDP (fast, unreliable, connectionless)

# TCP Client — connect to a server and exchange data
def tcp_client(host: str, port: int, message: str) -> str:
    """Send a message and receive a response."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((host, port))               # establish TCP connection
        sock.sendall(message.encode("utf-8"))    # send all bytes
        chunks = []
        while True:
            chunk = sock.recv(4096)              # receive up to 4096 bytes
            if not chunk:
                break                            # server closed the connection
            chunks.append(chunk)
        return b"".join(chunks).decode("utf-8")

# response = tcp_client("example.com", 80, "GET / HTTP/1.0\\r\\n\\r\\n")
# print(response[:500])
\`\`\`

## TCP Echo Server

\`\`\`python
import socket, threading

def handle_client(conn: socket.socket, addr: tuple) -> None:
    """Handle a single client in its own thread."""
    print(f"[{addr}] Connected")
    try:
        while True:
            data = conn.recv(1024)
            if not data:
                break                          # client disconnected
            print(f"[{addr}] Received: {data.decode()!r}")
            conn.sendall(data)                 # echo back
    except ConnectionResetError:
        print(f"[{addr}] Connection reset")
    finally:
        conn.close()
        print(f"[{addr}] Disconnected")

def echo_server(host: str = "localhost", port: int = 9000) -> None:
    """Multi-threaded TCP echo server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((host, port))
        server.listen(5)   # queue up to 5 pending connections
        print(f"Echo server listening on {host}:{port}")

        while True:
            conn, addr = server.accept()    # blocks until client connects
            thread = threading.Thread(target=handle_client, args=(conn, addr))
            thread.daemon = True            # threads die when main program exits
            thread.start()
            print(f"Active connections: {threading.active_count() - 1}")

# Run server in background for testing:
# threading.Thread(target=echo_server, daemon=True).start()
\`\`\`

## Framing Protocol — Handling Incomplete Messages

TCP is a stream protocol — messages may arrive in fragments. You need a framing protocol to know where each message ends:

\`\`\`python
import socket, struct

# Length-prefixed framing: send message length as a 4-byte header, then the message
def send_message(sock: socket.socket, message: bytes) -> None:
    """Send a length-prefixed message."""
    header = struct.pack(">I", len(message))    # 4-byte big-endian length
    sock.sendall(header + message)

def recv_message(sock: socket.socket) -> bytes:
    """Receive a complete length-prefixed message."""
    # 1. Read the 4-byte header
    header = _recv_exactly(sock, 4)
    if not header:
        return b""
    length = struct.unpack(">I", header)[0]
    # 2. Read exactly 'length' bytes
    return _recv_exactly(sock, length)

def _recv_exactly(sock: socket.socket, n: int) -> bytes:
    """Read exactly n bytes from a socket."""
    data = b""
    while len(data) < n:
        chunk = sock.recv(n - len(data))
        if not chunk:
            raise ConnectionError("Connection closed mid-message")
        data += chunk
    return data

# Usage:
# with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
#     sock.connect(("localhost", 9000))
#     send_message(sock, b"Hello, World!")
#     response = recv_message(sock)
\`\`\`

## UDP Client/Server

UDP is connectionless — faster but unreliable (packets may be lost, reordered, or duplicated):

\`\`\`python
import socket

# UDP server
def udp_server(host: str = "localhost", port: int = 9001) -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as server:
        server.bind((host, port))
        print(f"UDP server on {host}:{port}")
        while True:
            data, addr = server.recvfrom(1024)   # returns data AND sender address
            print(f"From {addr}: {data.decode()}")
            server.sendto(data.upper(), addr)     # send back uppercased

# UDP client
def udp_client(host: str = "localhost", port: int = 9001, message: str = "hello") -> str:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
        client.settimeout(5.0)   # important! UDP has no connection — set a timeout
        client.sendto(message.encode(), (host, port))
        data, _ = client.recvfrom(1024)
        return data.decode()

# Use cases for UDP:
# - DNS queries
# - Game state updates (slight loss is OK)
# - Video/audio streaming
# - Monitoring/metrics (high volume, loss acceptable)
\`\`\`

## Non-Blocking Sockets with select()

\`select()\` monitors multiple sockets for readability/writability without threads:

\`\`\`python
import socket, select

def multiplexed_server(host: str = "localhost", port: int = 9002) -> None:
    """Handle multiple clients in a single thread using select()."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((host, port))
    server.listen(5)
    server.setblocking(False)

    inputs = [server]   # sockets we're reading from
    print(f"Multiplexed server on {host}:{port}")

    while inputs:
        readable, _, exceptional = select.select(inputs, [], inputs, timeout=1.0)

        for sock in readable:
            if sock is server:
                # New connection
                conn, addr = server.accept()
                conn.setblocking(False)
                inputs.append(conn)
                print(f"[{addr}] Connected")
            else:
                # Existing client
                data = sock.recv(1024)
                if data:
                    print(f"Received: {data.decode()!r}")
                    sock.sendall(data)     # echo
                else:
                    # Client disconnected
                    inputs.remove(sock)
                    sock.close()

        for sock in exceptional:
            inputs.remove(sock)
            sock.close()
\`\`\`

## Higher-Level: socketserver Module

\`\`\`python
import socketserver

class EchoHandler(socketserver.BaseRequestHandler):
    """The request handler class for the echo server."""

    def handle(self):
        """Called for each incoming connection."""
        data = self.request.recv(1024).strip()
        print(f"{self.client_address[0]} wrote: {data}")
        self.request.sendall(data)

# ThreadingTCPServer: each client in a new thread
server = socketserver.ThreadingTCPServer(("localhost", 9003), EchoHandler)
server.allow_reuse_address = True
print("Server started. Ctrl-C to stop.")
# server.serve_forever()   # run until interrupted
\`\`\`

## Try It Yourself

\`\`\`python
import socket, threading, json

# Build a JSON-RPC style request/response server:
class JSONRPCHandler(socketserver.BaseRequestHandler):
    METHODS = {
        "add": lambda args: sum(args),
        "multiply": lambda args: args[0] * args[1],
        "echo": lambda args: args[0],
        "uppercase": lambda args: args[0].upper(),
    }

    def handle(self):
        data = self.request.recv(4096).decode("utf-8")
        try:
            request = json.loads(data)
            method = request.get("method")
            args = request.get("args", [])

            if method not in self.METHODS:
                response = {"error": f"Unknown method: {method}"}
            else:
                result = self.METHODS[method](args)
                response = {"result": result, "method": method}
        except json.JSONDecodeError:
            response = {"error": "Invalid JSON"}

        self.request.sendall(json.dumps(response).encode())

# Test it:
def json_rpc_call(method: str, *args, host="localhost", port=9004) -> dict:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall(json.dumps({"method": method, "args": list(args)}).encode())
        return json.loads(s.recv(4096).decode())

# server = socketserver.ThreadingTCPServer(("localhost", 9004), JSONRPCHandler)
# threading.Thread(target=server.serve_forever, daemon=True).start()
# print(json_rpc_call("add", 1, 2, 3, 4, 5))      # {"result": 15, "method": "add"}
# print(json_rpc_call("uppercase", "hello world")) # {"result": "HELLO WORLD", ...}
\`\`\`
`,
  },

  'expert-networking-rest-apis-requests-httpx': {
    readTime: 9,
    whatYoullLearn: [
      'Make HTTP requests with requests and the modern httpx library',
      'Handle authentication: API keys, OAuth tokens, and custom auth',
      'Inspect responses: status, headers, JSON, and raw content',
      'Manage sessions, cookies, and persistent connections',
      'Use httpx for async HTTP requests alongside aiohttp',
    ],
    content: `
## requests — The Pythonic HTTP Library

\`requests\` wraps Python\\'s \`urllib\` in an elegant, human-friendly API:

\`\`\`python
import requests

BASE = "https://jsonplaceholder.typicode.com"

# ─── GET ────────────────────────────────────────────────────────────────────
response = requests.get(f"{BASE}/posts/1")

# Check status:
print(response.status_code)     # 200
print(response.ok)               # True (2xx status code)
response.raise_for_status()     # raises requests.HTTPError for 4xx/5xx

# Access response content:
data = response.json()           # parse JSON body → dict/list
text = response.text             # string (decoded by Content-Type charset)
raw = response.content           # bytes

# Response metadata:
print(response.headers["Content-Type"])   # "application/json; charset=utf-8"
print(response.elapsed.total_seconds())   # request duration
print(response.url)                        # final URL (after redirects)

# ─── Query parameters ───────────────────────────────────────────────────────
params = {"userId": 1, "limit": 5}
posts = requests.get(f"{BASE}/posts", params=params).json()
# → GET /posts?userId=1&limit=5

# ─── POST ───────────────────────────────────────────────────────────────────
new_post = requests.post(
    f"{BASE}/posts",
    json={"title": "Hello", "body": "World", "userId": 1},
    headers={"Authorization": "Bearer my-token"},
).json()
print(new_post)  # {"id": 101, "title": "Hello", ...}

# ─── PUT / PATCH / DELETE ───────────────────────────────────────────────────
requests.put(f"{BASE}/posts/1", json={"title": "Updated"}).raise_for_status()
requests.patch(f"{BASE}/posts/1", json={"title": "Patched"}).raise_for_status()
requests.delete(f"{BASE}/posts/1").raise_for_status()
\`\`\`

## Sessions — Persist State Across Requests

\`\`\`python
import requests

# Session: keeps connection alive + reuses headers/auth/cookies
with requests.Session() as session:
    session.headers.update({
        "Authorization": "Bearer my-api-token",
        "User-Agent": "MyApp/1.0",
        "Accept": "application/json",
    })

    # All requests share headers and use the same TCP connection pool
    user = session.get("https://api.github.com/user").json()
    repos = session.get("https://api.github.com/user/repos").json()
    print(f"User: {user.get('login')}, Repos: {len(repos)}")

# Cookies persist automatically within a session:
with requests.Session() as s:
    s.post("https://httpbin.org/cookies/set?theme=dark")
    resp = s.get("https://httpbin.org/cookies")
    print(resp.json())   # {"cookies": {"theme": "dark"}}
\`\`\`

## Authentication

\`\`\`python
import requests
from requests.auth import HTTPBasicAuth, HTTPDigestAuth

# Basic Auth
r = requests.get("https://api.example.com", auth=("user", "password"))
r = requests.get("https://api.example.com", auth=HTTPBasicAuth("user", "pass"))

# Token / Bearer Auth — use a session header:
session = requests.Session()
session.headers["Authorization"] = "Bearer eyJhbGciOi..."

# Custom auth class:
class APIKeyAuth(requests.auth.AuthBase):
    """Attach an API key as a query parameter."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    def __call__(self, r: requests.PreparedRequest) -> requests.PreparedRequest:
        r.url = f"{r.url}&api_key={self.api_key}" if "?" in r.url else f"{r.url}?api_key={self.api_key}"
        return r

# session.auth = APIKeyAuth("my-secret-key")
\`\`\`

## Error Handling and Timeouts

\`\`\`python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def make_session_with_retry(
    retries: int = 3,
    backoff: float = 0.3,
    status_forcelist: tuple = (500, 502, 503, 504),
) -> requests.Session:
    """Create a session with automatic retry logic."""
    session = requests.Session()
    retry_strategy = Retry(
        total=retries,
        backoff_factor=backoff,    # 0.3, 0.6, 1.2 seconds between retries
        status_forcelist=status_forcelist,
        allowed_methods=["HEAD", "GET", "OPTIONS", "DELETE"],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

session = make_session_with_retry()

try:
    response = session.get(
        "https://api.example.com/data",
        timeout=(3.05, 10),   # (connect_timeout, read_timeout)
    )
    response.raise_for_status()
    data = response.json()
except requests.exceptions.ConnectTimeout:
    print("Connection timed out")
except requests.exceptions.ReadTimeout:
    print("Server did not respond in time")
except requests.exceptions.HTTPError as e:
    print(f"HTTP {e.response.status_code}: {e}")
except requests.exceptions.ConnectionError as e:
    print(f"Network error: {e}")
\`\`\`

## httpx — Modern HTTP Client with Async Support

\`httpx\` is a modern replacement for \`requests\` with the same API but adds async, HTTP/2, and better type hints:

\`\`\`python
import httpx

# Synchronous (same API as requests):
with httpx.Client() as client:
    r = client.get("https://jsonplaceholder.typicode.com/posts/1")
    print(r.json())

# Asynchronous (uses asyncio):
import asyncio

async def fetch_async():
    async with httpx.AsyncClient() as client:
        # Concurrent requests with asyncio.gather:
        tasks = [
            client.get(f"https://jsonplaceholder.typicode.com/posts/{i}")
            for i in range(1, 6)
        ]
        responses = await asyncio.gather(*tasks)
        return [r.json() for r in responses]

posts = asyncio.run(fetch_async())
print(f"Fetched {len(posts)} posts concurrently")

# HTTP/2 support:
with httpx.Client(http2=True) as client:
    r = client.get("https://httpbin.org/get")
    print(r.http_version)   # "HTTP/2"

# Streaming large responses:
async def stream_large_file(url: str) -> bytes:
    async with httpx.AsyncClient() as client:
        async with client.stream("GET", url) as r:
            r.raise_for_status()
            data = b""
            async for chunk in r.aiter_bytes(chunk_size=65536):
                data += chunk
                print(f"Downloaded {len(data):,} bytes", end="\\r")
    return data
\`\`\`

## Try It Yourself

\`\`\`python
import requests, httpx, asyncio, time

# 1. Implement a simple API wrapper class:
class GitHubAPI:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: str = None):
        self.session = requests.Session()
        if token:
            self.session.headers["Authorization"] = f"token {token}"
        self.session.headers["Accept"] = "application/vnd.github.v3+json"

    def get_user(self, username: str) -> dict:
        r = self.session.get(f"{self.BASE_URL}/users/{username}")
        r.raise_for_status()
        return r.json()

    def get_repos(self, username: str, sort: str = "stars") -> list:
        r = self.session.get(
            f"{self.BASE_URL}/users/{username}/repos",
            params={"sort": sort, "per_page": 10},
        )
        r.raise_for_status()
        return r.json()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.session.close()

# Usage:
with GitHubAPI() as gh:
    user = gh.get_user("python")
    print(f"Name: {user.get('name')}, Followers: {user.get('followers')}")
    repos = gh.get_repos("python")
    for repo in repos[:3]:
        print(f"  {repo['name']}: ★{repo['stargazers_count']}")
\`\`\`
`,
  },

  'expert-data-handling-json-csv-xml-parsing': {
    readTime: 9,
    whatYoullLearn: [
      'Parse, validate, and transform complex JSON structures',
      'Read and write CSV with quoting, dialects, and DictReader/DictWriter',
      'Parse XML documents with ElementTree and extract data with XPath-like queries',
      'Handle large files efficiently with streaming parsers',
      'Convert between formats: JSON ↔ CSV, CSV ↔ XML, etc.',
    ],
    content: `
## JSON — Beyond the Basics

\`\`\`python
import json
from datetime import datetime, date
from decimal import Decimal
from pathlib import Path
import re

# ─── Loading with error handling ─────────────────────────────────────────────
def load_json_safe(path: str) -> dict:
    """Load JSON with detailed error reporting."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Config file not found: {path}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in {path}: line {e.lineno}, col {e.colno}: {e.msg}")

# ─── Custom serialization for non-standard types ──────────────────────────────
class JSONEncoder(json.JSONEncoder):
    """Extended encoder: handles datetime, date, Decimal, set, Path."""
    def default(self, obj):
        if isinstance(obj, datetime):
            return {"__type__": "datetime", "value": obj.isoformat()}
        if isinstance(obj, date):
            return {"__type__": "date", "value": obj.isoformat()}
        if isinstance(obj, Decimal):
            return {"__type__": "decimal", "value": str(obj)}
        if isinstance(obj, set):
            return sorted(obj)   # serialize as sorted list
        if isinstance(obj, Path):
            return str(obj)
        return super().default(obj)

data = {
    "user": "Alice",
    "created": datetime.now(),
    "balance": Decimal("1234.56"),
    "tags": {"python", "asyncio", "ml"},
    "config_path": Path("/etc/app/config.json"),
}
serialized = json.dumps(data, cls=JSONEncoder, indent=2)
print(serialized)

# Custom deserialization:
def object_hook(d: dict):
    """Reconstruct custom types from JSON dicts."""
    if "__type__" in d:
        t = d["__type__"]
        if t == "datetime":
            return datetime.fromisoformat(d["value"])
        if t == "date":
            return date.fromisoformat(d["value"])
        if t == "decimal":
            return Decimal(d["value"])
    return d

restored = json.loads(serialized, object_pairs_hook=lambda pairs: object_hook(dict(pairs)))
\`\`\`

## Streaming Large JSON with ijson

\`\`\`python
# For large JSON files (100MB+), use ijson to stream-parse:
# pip install ijson

import ijson

def count_items_in_large_json(path: str, key_path: str = "items.item") -> int:
    """Count items in a large JSON array without loading the whole file."""
    count = 0
    with open(path, "rb") as f:
        for item in ijson.items(f, key_path):
            count += 1
    return count

# Process each item one at a time:
# with open("huge.json", "rb") as f:
#     for record in ijson.items(f, "data.item"):
#         process(record)   # only one record in memory at a time
\`\`\`

## CSV — Robust Handling

\`\`\`python
import csv
from pathlib import Path
from io import StringIO

# ─── DictReader / DictWriter ─────────────────────────────────────────────────
rows = [
    {"name": "Alice", "score": "95.5", "grade": "A"},
    {"name": "Bob",   "score": "82.0", "grade": "B"},
    {"name": "Carol", "score": "78.3", "grade": "C"},
]

# Write
with open("grades.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score", "grade"],
                             extrasaction="ignore")   # ignore unknown keys
    writer.writeheader()
    writer.writerows(rows)

# Read with type conversion
def read_csv_typed(path: str) -> list[dict]:
    """Read CSV and auto-convert numeric columns."""
    def convert(value: str):
        for cast in (int, float):
            try:
                return cast(value)
            except ValueError:
                pass
        return value   # keep as string

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [{k: convert(v) for k, v in row.items()} for row in reader]

typed = read_csv_typed("grades.csv")
for row in typed:
    print(f"{row['name']}: {row['score']:.1f} ({type(row['score']).__name__})")

# ─── Dialects — TSV, custom delimiters ───────────────────────────────────────
# Register a custom dialect:
csv.register_dialect("tsv", delimiter="\\t", quoting=csv.QUOTE_MINIMAL)

with open("data.tsv", "w", newline="") as f:
    writer = csv.writer(f, dialect="tsv")
    writer.writerows([["Alice", 95], ["Bob", 82]])

# ─── Handle tricky CSV: embedded newlines, quotes ────────────────────────────
tricky_csv = '''name,bio
Alice,"Loves Python, and
multiline text"
Bob,"He said ""hello"" to me"
'''
reader = csv.DictReader(StringIO(tricky_csv))
for row in reader:
    print(row["name"], "→", row["bio"][:30].replace("\\n", "\\\\n"))
\`\`\`

## XML — ElementTree

\`\`\`python
import xml.etree.ElementTree as ET

# ─── Parse XML ───────────────────────────────────────────────────────────────
xml_data = """<?xml version="1.0" encoding="UTF-8"?>
<library>
    <book id="1" genre="fiction">
        <title>The Pragmatic Programmer</title>
        <author>Andrew Hunt</author>
        <price currency="USD">45.99</price>
        <tags><tag>programming</tag><tag>software</tag></tags>
    </book>
    <book id="2" genre="science">
        <title>Python Cookbook</title>
        <author>David Beazley</author>
        <price currency="USD">59.99</price>
        <tags><tag>python</tag><tag>recipes</tag></tags>
    </book>
</library>
"""

root = ET.fromstring(xml_data)   # from string
# root = ET.parse("library.xml").getroot()  # from file

# Navigate:
print(root.tag)   # "library"
for book in root.findall("book"):
    book_id   = book.get("id")            # attribute
    title     = book.findtext("title")    # text content of child
    author    = book.findtext("author")
    price     = float(book.findtext("price") or 0)
    currency  = book.find("price").get("currency")
    tags      = [t.text for t in book.findall("tags/tag")]
    print(f"[{book_id}] {title} by {author} — {currency}{price:.2f} ({', '.join(tags)})")

# ─── Build XML ───────────────────────────────────────────────────────────────
def build_catalog(books: list[dict]) -> ET.Element:
    root = ET.Element("catalog")
    root.set("version", "1.0")
    for book in books:
        book_elem = ET.SubElement(root, "book", id=str(book["id"]))
        ET.SubElement(book_elem, "title").text = book["title"]
        ET.SubElement(book_elem, "price").text = str(book["price"])
    return root

catalog = build_catalog([{"id": 1, "title": "Python Tricks", "price": 34.99}])
ET.indent(catalog, space="  ")           # pretty-print indentation (3.9+)
print(ET.tostring(catalog, encoding="unicode"))
\`\`\`

## Format Conversion

\`\`\`python
import json, csv, xml.etree.ElementTree as ET
from io import StringIO

def csv_to_json(csv_text: str) -> str:
    """Convert CSV string to JSON array string."""
    reader = csv.DictReader(StringIO(csv_text))
    return json.dumps(list(reader), indent=2)

def json_to_csv(json_text: str) -> str:
    """Convert JSON array string to CSV string."""
    records = json.loads(json_text)
    if not records:
        return ""
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=records[0].keys())
    writer.writeheader()
    writer.writerows(records)
    return output.getvalue()

def xml_to_json(xml_text: str, record_tag: str) -> str:
    """Extract records from XML and convert to JSON."""
    root = ET.fromstring(xml_text)
    records = []
    for elem in root.iter(record_tag):
        record = dict(elem.attrib)            # attributes
        for child in elem:
            record[child.tag] = child.text    # child elements
        records.append(record)
    return json.dumps(records, indent=2)
\`\`\`

## Try It Yourself

\`\`\`python
import json, csv, xml.etree.ElementTree as ET
from io import StringIO

# 1. Build a multi-format data export utility:
class DataExporter:
    def __init__(self, records: list[dict]):
        self.records = records

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.records, indent=indent, ensure_ascii=False)

    def to_csv(self) -> str:
        if not self.records:
            return ""
        out = StringIO()
        writer = csv.DictWriter(out, fieldnames=self.records[0].keys())
        writer.writeheader()
        writer.writerows(self.records)
        return out.getvalue()

    def to_xml(self, root_tag: str = "data", item_tag: str = "item") -> str:
        root = ET.Element(root_tag)
        for record in self.records:
            item = ET.SubElement(root, item_tag)
            for key, value in record.items():
                child = ET.SubElement(item, key)
                child.text = str(value)
        ET.indent(root, space="  ")
        return ET.tostring(root, encoding="unicode", xml_declaration=True)

data = [{"name": "Alice", "score": 95, "grade": "A"},
        {"name": "Bob",   "score": 82, "grade": "B"}]
exporter = DataExporter(data)
print(exporter.to_json())
print(exporter.to_csv())
# print(exporter.to_xml())
\`\`\`
`,
  },

  'expert-databases-orm-basics-sqlalchemy': {
    readTime: 10,
    whatYoullLearn: [
      'Define SQLAlchemy models with declarative syntax',
      'Create, read, update, and delete records with session CRUD operations',
      'Define relationships: one-to-many, many-to-many',
      'Write queries with filter, order_by, join, and aggregations',
      'Use SQLAlchemy 2.0 style with select() statements',
    ],
    content: `
## SQLAlchemy: Python\\'s Most Powerful ORM

SQLAlchemy maps Python classes to database tables. Instead of writing SQL strings, you work with Python objects — but you retain full control of the generated SQL:

\`\`\`python
from sqlalchemy import create_engine, String, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session
from datetime import datetime
from typing import Optional

# Create database engine
engine = create_engine(
    "sqlite:///app.db",           # SQLite for development
    # "postgresql://user:pass@localhost/dbname",  # PostgreSQL for production
    echo=False,                    # Set True to log all SQL statements
)

class Base(DeclarativeBase):
    """Base class for all models."""

# Define models:
class User(Base):
    __tablename__ = "users"

    id:         Mapped[int]      = mapped_column(Integer, primary_key=True)
    name:       Mapped[str]      = mapped_column(String(100), nullable=False)
    email:      Mapped[str]      = mapped_column(String(200), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active:  Mapped[bool]     = mapped_column(default=True)

    # One-to-many: one user has many posts
    posts: Mapped[list["Post"]] = relationship("Post", back_populates="author",
                                                cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"User(id={self.id}, name={self.name!r})"

class Post(Base):
    __tablename__ = "posts"

    id:         Mapped[int]           = mapped_column(Integer, primary_key=True)
    title:      Mapped[str]           = mapped_column(String(200), nullable=False)
    content:    Mapped[str]           = mapped_column(String, nullable=False)
    score:      Mapped[float]         = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime]      = mapped_column(DateTime, default=datetime.utcnow)
    user_id:    Mapped[int]           = mapped_column(ForeignKey("users.id"))

    # Many-to-one: many posts belong to one user
    author: Mapped["User"] = relationship("User", back_populates="posts")

    def __repr__(self) -> str:
        return f"Post(id={self.id}, title={self.title!r})"

# Create all tables:
Base.metadata.create_all(engine)
\`\`\`

## CRUD Operations

\`\`\`python
from sqlalchemy import select, update, delete

# ─── CREATE ─────────────────────────────────────────────────────────────────
with Session(engine) as session:
    # Create users
    alice = User(name="Alice", email="alice@example.com")
    bob   = User(name="Bob",   email="bob@example.com")
    session.add_all([alice, bob])
    session.flush()   # assign IDs without committing

    # Create posts linked to a user
    post1 = Post(title="Python Tips", content="Use f-strings!", user_id=alice.id, score=4.5)
    post2 = Post(title="Async Guide", content="asyncio is great.", user_id=alice.id, score=4.8)
    session.add_all([post1, post2])

    session.commit()   # write all to database
    print(f"Alice ID: {alice.id}, Post IDs: {post1.id}, {post2.id}")

# ─── READ ────────────────────────────────────────────────────────────────────
with Session(engine) as session:
    # Fetch by primary key:
    user = session.get(User, 1)
    print(user.name, user.email)

    # Fetch with filter:
    stmt = select(User).where(User.email == "alice@example.com")
    alice = session.scalars(stmt).first()   # one or None

    # All active users, sorted:
    stmt = select(User).where(User.is_active == True).order_by(User.name)
    users = session.scalars(stmt).all()     # list of User objects

    # Eager load relationships (N+1 prevention):
    from sqlalchemy.orm import selectinload
    stmt = select(User).options(selectinload(User.posts))
    for user in session.scalars(stmt):
        print(f"{user.name}: {len(user.posts)} posts")

# ─── UPDATE ──────────────────────────────────────────────────────────────────
with Session(engine) as session:
    # Update a single object:
    user = session.get(User, 1)
    user.name = "Alice Smith"
    session.commit()

    # Bulk update (more efficient for many rows):
    stmt = update(User).where(User.is_active == True).values(name="[Active] " + User.name)
    session.execute(stmt)
    session.commit()

# ─── DELETE ──────────────────────────────────────────────────────────────────
with Session(engine) as session:
    user = session.get(User, 2)
    session.delete(user)   # cascade deletes posts too (cascade="all, delete-orphan")
    session.commit()
\`\`\`

## Queries: filter, join, aggregation

\`\`\`python
from sqlalchemy import select, func, and_, or_, desc

with Session(engine) as session:

    # WHERE with multiple conditions:
    stmt = select(Post).where(
        and_(Post.score >= 4.0, Post.title.contains("Python"))
    )
    posts = session.scalars(stmt).all()

    # OR condition:
    stmt = select(User).where(
        or_(User.name.startswith("A"), User.email.endswith(".org"))
    )

    # JOIN — get posts with their authors:
    stmt = (
        select(Post, User)
        .join(User, Post.user_id == User.id)
        .where(User.is_active == True)
        .order_by(desc(Post.score))
    )
    for post, user in session.execute(stmt):
        print(f"{user.name}: '{post.title}' (score={post.score})")

    # Aggregate — count posts per user:
    stmt = (
        select(User.name, func.count(Post.id).label("post_count"))
        .join(Post, User.id == Post.user_id, isouter=True)   # LEFT JOIN
        .group_by(User.id)
        .having(func.count(Post.id) > 0)
        .order_by(desc("post_count"))
    )
    for name, count in session.execute(stmt):
        print(f"{name}: {count} posts")

    # Pagination:
    page, per_page = 1, 10
    stmt = select(Post).order_by(Post.created_at).offset((page-1)*per_page).limit(per_page)
    posts = session.scalars(stmt).all()
\`\`\`

## Many-to-Many Relationships

\`\`\`python
from sqlalchemy import Table, Column

# Association table (no model needed for pure join tables)
post_tags = Table(
    "post_tags",
    Base.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id",  ForeignKey("tags.id"),  primary_key=True),
)

class Tag(Base):
    __tablename__ = "tags"
    id:   Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)

    posts: Mapped[list["Post"]] = relationship("Post", secondary=post_tags, back_populates="tags")

# Add .tags to Post:
# tags: Mapped[list["Tag"]] = relationship("Tag", secondary=post_tags, back_populates="posts")

# Usage:
with Session(engine) as session:
    tag_python = Tag(name="python")
    tag_async  = Tag(name="async")
    session.add_all([tag_python, tag_async])

    post = session.get(Post, 1)
    post.tags = [tag_python, tag_async]   # assign tags
    session.commit()

    # Query posts by tag:
    stmt = select(Post).join(Post.tags).where(Tag.name == "python")
    python_posts = session.scalars(stmt).all()
\`\`\`

## Try It Yourself

\`\`\`python
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session

engine = create_engine("sqlite:///:memory:", echo=False)
Base.metadata.create_all(engine)

# Seed data:
with Session(engine) as s:
    users = [User(name=n, email=f"{n.lower()}@x.com") for n in ["Alice", "Bob", "Carol"]]
    s.add_all(users)
    s.flush()
    posts = [
        Post(title=f"{u.name}'s post {i}", content="...", user_id=u.id, score=80+i*3)
        for u in users for i in range(1, 4)
    ]
    s.add_all(posts)
    s.commit()

# Query: top 3 users by average post score:
with Session(engine) as s:
    stmt = (
        select(User.name, func.avg(Post.score).label("avg_score"))
        .join(Post)
        .group_by(User.id)
        .order_by(func.avg(Post.score).desc())
        .limit(3)
    )
    for name, avg in s.execute(stmt):
        print(f"{name}: avg={avg:.1f}")
\`\`\`
`,
  },

  'expert-security-hashlib-secure-coding': {
    readTime: 9,
    whatYoullLearn: [
      'Hash data securely with SHA-256, SHA-3, and BLAKE2 using hashlib',
      'Store and verify passwords correctly with bcrypt or argon2',
      'Generate cryptographically secure tokens with secrets',
      'Sign and verify data integrity with HMAC',
      'Apply OWASP-aligned secure coding practices in Python',
    ],
    content: `
## hashlib — Cryptographic Hash Functions

A hash function converts arbitrary data to a fixed-size digest. The same input always produces the same output, but it\\'s computationally infeasible to reverse:

\`\`\`python
import hashlib

# Available algorithms (hashlib.algorithms_guaranteed):
print(sorted(hashlib.algorithms_guaranteed))
# 'blake2b', 'blake2s', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'sha3_256', ...

# SHA-256 (most common for general use)
data = b"Hello, Python security!"
digest = hashlib.sha256(data).hexdigest()
print(digest)   # 64 hex characters

# Using update() for large data (memory-efficient):
h = hashlib.sha256()
with open("large_file.bin", "rb") as f:
    for chunk in iter(lambda: f.read(65536), b""):
        h.update(chunk)
file_hash = h.hexdigest()
print(f"SHA-256: {file_hash}")

# SHA-3 (newer, no length extension attacks):
sha3 = hashlib.sha3_256(data).hexdigest()

# BLAKE2 (fast, secure, variable-length output):
blake = hashlib.blake2b(data, digest_size=32).hexdigest()   # 32-byte output
blake_keyed = hashlib.blake2b(data, key=b"secret-key-16ch", digest_size=32).hexdigest()

# MD5 and SHA-1 — NEVER use for security, only for checksums/fingerprints:
md5 = hashlib.md5(data).hexdigest()    # vulnerable to collision attacks!
\`\`\`

## Password Hashing — NEVER use plain hashlib

Plain hashing (even SHA-256) is insecure for passwords because attackers can precompute rainbow tables. Use a slow, salted hash function:

\`\`\`python
# Option 1: bcrypt (industry standard)
# pip install bcrypt
import bcrypt

def hash_password(password: str) -> bytes:
    """Hash a password — always returns different bytes (random salt)."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))

def verify_password(password: str, hashed: bytes) -> bool:
    """Verify a password against its hash — constant-time comparison."""
    return bcrypt.checkpw(password.encode("utf-8"), hashed)

hashed = hash_password("my-s3cr3t-p@ss")
print(verify_password("my-s3cr3t-p@ss", hashed))   # True
print(verify_password("wrong-password", hashed))     # False

# Option 2: argon2-cffi (winner of Password Hashing Competition)
# pip install argon2-cffi
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher(time_cost=2, memory_cost=65536, parallelism=2)

hashed = ph.hash("my-s3cr3t-p@ss")
try:
    ph.verify(hashed, "my-s3cr3t-p@ss")   # OK — returns True
    print("Password correct!")
except VerifyMismatchError:
    print("Wrong password!")

# Check if rehashing is needed (e.g., after increasing time_cost):
if ph.check_needs_rehash(hashed):
    hashed = ph.hash("my-s3cr3t-p@ss")  # rehash with new parameters

# Option 3: hashlib.scrypt (built-in, no external library):
import os
salt = os.urandom(16)
hashed_pw = hashlib.scrypt(b"my-s3cr3t-p@ss", salt=salt, n=16384, r=8, p=1)
\`\`\`

## HMAC — Message Authentication Codes

HMAC ensures data integrity AND authenticity (that it came from someone with the key):

\`\`\`python
import hmac, hashlib, time, struct, base64

SECRET_KEY = b"my-32-byte-secret-key-here!!!!!!"  # use os.urandom(32) in practice

def create_signature(data: bytes) -> str:
    """Sign data with HMAC-SHA256."""
    sig = hmac.new(SECRET_KEY, data, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(sig).decode()

def verify_signature(data: bytes, signature: str) -> bool:
    """Verify HMAC signature — MUST use compare_digest for constant-time comparison."""
    expected = create_signature(data)
    # compare_digest prevents timing attacks:
    return hmac.compare_digest(expected, signature)

# Create a signed message:
message = b'{"user_id": 42, "action": "reset_password"}'
sig = create_signature(message)
print(f"Signature: {sig}")

# Verify:
print(verify_signature(message, sig))                  # True
print(verify_signature(b"tampered message", sig))      # False

# Time-limited tokens (TOTP-like):
def create_time_token(user_id: int, expires_in: int = 3600) -> str:
    """Create a time-limited token that expires in expires_in seconds."""
    expires_at = int(time.time()) + expires_in
    payload = struct.pack(">QI", user_id, expires_at)
    sig = hmac.new(SECRET_KEY, payload, hashlib.sha256).hexdigest()
    return base64.urlsafe_b64encode(payload + sig.encode()).decode()

def verify_time_token(token: str) -> int | None:
    """Verify a time-limited token. Returns user_id or None if invalid/expired."""
    try:
        raw = base64.urlsafe_b64decode(token)
        payload, sig_bytes = raw[:12], raw[12:]
        user_id, expires_at = struct.unpack(">QI", payload)
        expected_sig = hmac.new(SECRET_KEY, payload, hashlib.sha256).hexdigest().encode()
        if not hmac.compare_digest(sig_bytes, expected_sig):
            return None    # tampered
        if time.time() > expires_at:
            return None    # expired
        return user_id
    except Exception:
        return None
\`\`\`

## secrets — Cryptographically Secure Tokens

\`\`\`python
import secrets, string

# Generate secure tokens for sessions, API keys, password reset links:
session_id   = secrets.token_hex(32)       # 64-char hex string
api_key      = secrets.token_urlsafe(32)   # 43-char URL-safe base64
reset_token  = secrets.token_bytes(32)     # raw bytes

# Generate a secure random password:
alphabet = string.ascii_letters + string.digits + "!@#%^&*"
password = "".join(secrets.choice(alphabet) for _ in range(20))

# Secure random number (use instead of random.randint for security):
otp = secrets.randbelow(1_000_000)   # 6-digit OTP [0, 999999]
otp_str = f"{otp:06d}"               # zero-padded: "042839"
\`\`\`

## Secure Coding Practices

\`\`\`python
import subprocess, shlex, pathlib, re

# ─── SQL Injection Prevention ─────────────────────────────────────────────────
import sqlite3
conn = sqlite3.connect(":memory:")

# ✗ VULNERABLE — never format SQL with user input:
# user_input = "' OR '1'='1"
# query = f"SELECT * FROM users WHERE name = '{user_input}'"  # SQL injection!

# ✓ SAFE — always use parameterized queries:
name = "Alice'; DROP TABLE users;--"   # malicious input
cursor = conn.execute("SELECT * FROM users WHERE name = ?", (name,))
# The ? parameter is safely escaped — no injection possible

# ─── Path Traversal Prevention ────────────────────────────────────────────────
def safe_read_file(user_filename: str, base_dir: str = "/var/www/static") -> bytes:
    """Prevent path traversal: ensure file is within base_dir."""
    base = pathlib.Path(base_dir).resolve()
    requested = (base / user_filename).resolve()
    if not str(requested).startswith(str(base)):
        raise ValueError(f"Path traversal attempt: {user_filename!r}")
    return requested.read_bytes()

# ─── Command Injection Prevention ─────────────────────────────────────────────
# ✗ VULNERABLE:
# filename = "file.txt; rm -rf /"
# os.system(f"cat {filename}")   # shell injection!

# ✓ SAFE — pass args as a list:
def safe_grep(pattern: str, filepath: str) -> str:
    """Run grep safely without shell injection."""
    result = subprocess.run(
        ["grep", "-n", pattern, filepath],   # list, not string
        capture_output=True, text=True, timeout=10,
        check=False   # don't raise on non-zero exit (grep returns 1 for no match)
    )
    return result.stdout

# ─── Timing Attack Prevention ─────────────────────────────────────────────────
import hmac

def check_api_key(provided: str, expected: str) -> bool:
    """Compare API keys in constant time to prevent timing attacks."""
    return hmac.compare_digest(
        provided.encode("utf-8"),
        expected.encode("utf-8"),
    )
\`\`\`

## Try It Yourself

\`\`\`python
import hashlib, hmac, secrets, time, json, base64

# Build a simple JWT-like token system:
SECRET = secrets.token_bytes(32)

def create_token(payload: dict, expires_in: int = 3600) -> str:
    """Create a signed token containing a JSON payload."""
    payload = {**payload, "exp": int(time.time()) + expires_in, "iat": int(time.time())}
    data = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET, data.encode(), hashlib.sha256).hexdigest()
    return f"{data}.{sig}"

def decode_token(token: str) -> dict | None:
    """Verify and decode a token. Returns payload or None if invalid/expired."""
    try:
        data, sig = token.rsplit(".", 1)
        expected_sig = hmac.new(SECRET, data.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        payload = json.loads(base64.urlsafe_b64decode(data).decode())
        if payload["exp"] < time.time():
            return None   # expired
        return payload
    except Exception:
        return None

# Test:
token = create_token({"user_id": 42, "role": "admin"})
print(f"Token: {token[:50]}...")
decoded = decode_token(token)
print(f"Decoded: {decoded}")
print(f"Tampered: {decode_token(token + 'x')}")  # None
\`\`\`
`,
  },

  'expert-advanced-libraries-pandas-numpy': {
    readTime: 10,
    whatYoullLearn: [
      'Create and manipulate NumPy arrays with vectorized operations',
      'Load, filter, transform, and aggregate data with pandas DataFrames',
      'Avoid loops — use vectorized operations for 100x speedups',
      'Handle missing data, duplicates, and data type issues',
      'Combine DataFrames with merge, join, and concat',
    ],
    content: `
## NumPy — Vectorized Numerical Computing

NumPy provides the \`ndarray\` — a typed, homogeneous, fixed-size array — and hundreds of optimized mathematical operations:

\`\`\`python
import numpy as np

# Create arrays:
a = np.array([1, 2, 3, 4, 5])           # 1D from list
b = np.arange(0, 10, 2)                  # [0, 2, 4, 6, 8]
c = np.linspace(0, 1, 5)                 # [0, 0.25, 0.5, 0.75, 1.0]
zeros = np.zeros((3, 4))                  # 3x4 matrix of 0.0
ones  = np.ones((2, 3), dtype=np.int32)  # 2x3 matrix of int 1
rand  = np.random.randn(100)              # 100 standard normal samples

# Array properties:
matrix = np.array([[1,2,3],[4,5,6],[7,8,9]])
print(matrix.shape)    # (3, 3)
print(matrix.dtype)    # int64
print(matrix.ndim)     # 2 (dimensions)
print(matrix.size)     # 9 (total elements)
print(matrix.nbytes)   # 72 (bytes: 9 * 8)

# Vectorized operations — NO loops needed:
x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
print(x * 2)           # [2, 4, 6, 8, 10]
print(x ** 2)          # [1, 4, 9, 16, 25]
print(np.sqrt(x))      # [1, 1.41, 1.73, 2.00, 2.24]
print(np.sin(x))       # element-wise sin
print(x + x[::-1])     # [6, 6, 6, 6, 6]

# Compare: Python loop vs NumPy (1M elements):
import time
n = 1_000_000
lst = list(range(n))
arr = np.arange(n, dtype=float)

start = time.perf_counter()
result = [x**2 for x in lst]
print(f"Loop: {time.perf_counter()-start:.4f}s")

start = time.perf_counter()
result = arr ** 2
print(f"NumPy: {time.perf_counter()-start:.4f}s")
# NumPy is typically 50-200x faster!
\`\`\`

## NumPy Indexing, Slicing, and Broadcasting

\`\`\`python
import numpy as np

a = np.array([[1, 2, 3, 4],
              [5, 6, 7, 8],
              [9,10,11,12]])

# Indexing:
print(a[1, 2])          # 7 — row 1, col 2
print(a[0])             # [1, 2, 3, 4] — first row
print(a[:, 1])          # [2, 6, 10] — second column
print(a[1:, 2:])        # [[7,8], [11,12]] — submatrix

# Boolean indexing:
data = np.random.randn(100)
positive = data[data > 0]           # all positive values
outliers = data[np.abs(data) > 2]   # values more than 2 std devs away
data[data < 0] = 0                  # clip negatives to 0

# Broadcasting — operations between arrays of different shapes:
row = np.array([1, 2, 3])           # shape (3,)
col = np.array([[10], [20], [30]])  # shape (3, 1)
result = row + col                  # shape (3, 3) — broadcast!
# [[11,12,13],
#  [21,22,23],
#  [31,32,33]]

# Statistics:
print(data.mean(), data.std(), data.min(), data.max())
print(np.percentile(data, [25, 50, 75]))  # quartiles
print(np.corrcoef(data[:50], data[50:]))  # correlation matrix
\`\`\`

## pandas — Tabular Data Analysis

\`\`\`python
import pandas as pd
import numpy as np

# Create a DataFrame:
df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "dept":   ["Eng", "Mkt", "Eng", "HR", "Eng"],
    "salary": [95000, 72000, 88000, 65000, 105000],
    "years":  [5, 3, 7, 2, 9],
    "active": [True, True, False, True, True],
})

# Inspect:
print(df.shape)        # (5, 5)
print(df.dtypes)       # column types
print(df.info())       # memory usage + types
print(df.describe())   # count, mean, std, min, quartiles, max

# Select columns:
print(df["name"])               # Series
print(df[["name", "salary"]])   # DataFrame
print(df.salary)                # attribute access (watch out — conflicts possible)

# Select rows:
print(df[df["salary"] > 80000])                          # boolean filter
print(df[(df["dept"] == "Eng") & (df["active"])])        # AND condition
print(df[df["dept"].isin(["Eng", "Mkt"])])               # isin
print(df.loc[df["salary"].idxmax()])                     # row with max salary
print(df.nlargest(3, "salary"))                          # top 3 by salary
\`\`\`

## Data Transformation and GroupBy

\`\`\`python
import pandas as pd

# Add computed columns — VECTORIZED, no loops:
df["salary_k"] = df["salary"] / 1000
df["experience"] = pd.cut(df["years"], bins=[0,3,6,100], labels=["Junior","Mid","Senior"])
df["bonus"]      = df["salary"] * df["years"].apply(lambda y: 0.1 if y > 5 else 0.05)

# String operations (vectorized):
df["name_upper"] = df["name"].str.upper()
df["email"]      = df["name"].str.lower() + "@company.com"

# GroupBy aggregation:
by_dept = df.groupby("dept").agg(
    headcount = ("name", "count"),
    avg_salary = ("salary", "mean"),
    total_salary = ("salary", "sum"),
    max_years = ("years", "max"),
)
print(by_dept.round(0).sort_values("avg_salary", ascending=False))

# Multiple aggregations in one call:
stats = df.groupby("dept")["salary"].describe()
print(stats)

# Transform — same index as original, useful for computing group-relative values:
df["salary_vs_dept_avg"] = df.groupby("dept")["salary"].transform(
    lambda x: (x - x.mean()) / x.std()
)
\`\`\`

## Merging and Handling Missing Data

\`\`\`python
import pandas as pd, numpy as np

# Merge (JOIN):
employees = pd.DataFrame({
    "emp_id": [1, 2, 3, 4],
    "name": ["Alice", "Bob", "Carol", "Dave"],
    "dept_id": [10, 20, 10, 30],
})
departments = pd.DataFrame({
    "dept_id": [10, 20],
    "dept_name": ["Engineering", "Marketing"],
})

# INNER JOIN — only matching rows:
merged = employees.merge(departments, on="dept_id", how="inner")
# LEFT JOIN — all employees, NULL if no matching dept:
merged_all = employees.merge(departments, on="dept_id", how="left")

# concat — stack DataFrames vertically or horizontally:
q1 = pd.DataFrame({"month": ["Jan", "Feb", "Mar"], "sales": [100, 120, 110]})
q2 = pd.DataFrame({"month": ["Apr", "May", "Jun"], "sales": [130, 115, 140]})
full_year = pd.concat([q1, q2], ignore_index=True)

# Missing data:
df_with_nans = pd.DataFrame({
    "a": [1, None, 3, None, 5],
    "b": [10, 20, None, 40, 50],
})
print(df_with_nans.isna().sum())        # count missing per column
print(df_with_nans.isna().sum().sum())  # total missing

df_filled = df_with_nans.fillna({"a": 0, "b": df_with_nans["b"].mean()})
df_dropped = df_with_nans.dropna()           # drop any row with NaN
df_ffill = df_with_nans.ffill()             # forward fill
\`\`\`

## Try It Yourself

\`\`\`python
import pandas as pd, numpy as np

np.random.seed(42)

# Build a sales analysis pipeline:
# 1. Generate synthetic data
dates = pd.date_range("2025-01-01", periods=180, freq="D")
products = ["Widget", "Gadget", "Doohickey"]
df = pd.DataFrame({
    "date":     np.random.choice(dates, 500),
    "product":  np.random.choice(products, 500),
    "quantity": np.random.randint(1, 50, 500),
    "unit_price": np.random.uniform(5.0, 100.0, 500).round(2),
    "region":   np.random.choice(["North", "South", "East", "West"], 500),
})
df["revenue"] = df["quantity"] * df["unit_price"]
df["month"] = df["date"].dt.to_period("M")

# 2. Monthly revenue by product
monthly = df.groupby(["month", "product"])["revenue"].sum().unstack(fill_value=0)
print(monthly.tail())

# 3. Top 3 products by total revenue
top = df.groupby("product")["revenue"].sum().nlargest(3)
print(top)

# 4. Regional breakdown — % share
regional = df.groupby("region")["revenue"].sum()
print((regional / regional.sum() * 100).round(1).sort_values(ascending=False))
\`\`\`
`,
  },

  'expert-advanced-libraries-flask-django-fastapi': {
    readTime: 10,
    whatYoullLearn: [
      'Build a REST API with Flask including routes, request parsing, and JSON responses',
      'Understand when to choose Flask, Django, or FastAPI for your project',
      'Create a FastAPI app with automatic OpenAPI docs and type validation',
      'Define Pydantic models for request/response validation in FastAPI',
      'Add middleware, error handlers, and dependency injection',
    ],
    content: `
## Choosing the Right Framework

| Framework | Best For | Strengths | When to Avoid |
|-----------|----------|-----------|---------------|
| **Flask** | APIs, microservices | Minimal, flexible, full control | Large apps with many features (Django is better) |
| **Django** | Full web apps | Admin UI, ORM, auth, batteries-included | Simple APIs (too much overhead) |
| **FastAPI** | Modern APIs | Async, auto docs, validation, fast | Legacy codebases, teams unfamiliar with async |

## Flask — Microframework

\`\`\`python
from flask import Flask, request, jsonify, abort
from functools import wraps

app = Flask(__name__)

# In-memory "database" for demonstration
users = {
    1: {"id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin"},
    2: {"id": 2, "name": "Bob",   "email": "bob@example.com",   "role": "user"},
}

# Simple auth decorator:
def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ")
        if not token or token != "secret-token":
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return wrapper

# Routes:
@app.route("/api/users", methods=["GET"])
@require_auth
def list_users():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    all_users = list(users.values())
    start = (page - 1) * limit
    return jsonify({
        "users": all_users[start:start+limit],
        "total": len(all_users),
        "page": page,
    })

@app.route("/api/users/<int:user_id>", methods=["GET"])
@require_auth
def get_user(user_id: int):
    user = users.get(user_id)
    if user is None:
        abort(404, description=f"User {user_id} not found")
    return jsonify(user)

@app.route("/api/users", methods=["POST"])
@require_auth
def create_user():
    data = request.get_json()
    if not data or "name" not in data or "email" not in data:
        abort(400, description="name and email are required")
    new_id = max(users) + 1
    user = {"id": new_id, "name": data["name"], "email": data["email"], "role": "user"}
    users[new_id] = user
    return jsonify(user), 201

@app.route("/api/users/<int:user_id>", methods=["PATCH"])
@require_auth
def update_user(user_id: int):
    if user_id not in users:
        abort(404)
    data = request.get_json() or {}
    users[user_id].update({k: v for k, v in data.items() if k != "id"})
    return jsonify(users[user_id])

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
@require_auth
def delete_user(user_id: int):
    if user_id not in users:
        abort(404)
    del users[user_id]
    return "", 204

# Error handlers:
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "message": str(e)}), 404

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad Request", "message": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
\`\`\`

## FastAPI — Modern, Fast, Type-Safe

\`\`\`python
from fastapi import FastAPI, HTTPException, Depends, Query, Path
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Annotated
from datetime import datetime

app = FastAPI(
    title="User Management API",
    description="A sample CRUD API with FastAPI",
    version="1.0.0",
)

# ─── Pydantic Models ──────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")
    role: str = Field("user", pattern="^(user|admin|moderator)$")

    @validator("name")
    def name_must_have_space(cls, v):
        if len(v.split()) < 2:
            raise ValueError("Full name required (first and last)")
        return v.title()

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True   # Pydantic v2: allows ORM model input

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None

# In-memory store:
users_db: dict[int, dict] = {}
next_id: int = 1

# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/users", response_model=list[UserResponse])
async def list_users(
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    role: Optional[str] = None,
):
    """List users with pagination and optional role filter."""
    results = list(users_db.values())
    if role:
        results = [u for u in results if u.get("role") == role]
    return results[skip : skip + limit]

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    """Create a new user. Email must be unique."""
    global next_id
    if any(u["email"] == user.email for u in users_db.values()):
        raise HTTPException(409, detail=f"Email {user.email!r} already registered")
    new_user = {
        "id": next_id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": datetime.utcnow(),
    }
    users_db[next_id] = new_user
    next_id += 1
    return new_user

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: Annotated[int, Path(ge=1)]):
    if user_id not in users_db:
        raise HTTPException(404, detail=f"User {user_id} not found")
    return users_db[user_id]

@app.patch("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, updates: UserUpdate):
    if user_id not in users_db:
        raise HTTPException(404, detail=f"User {user_id} not found")
    update_data = updates.model_dump(exclude_unset=True)  # only set fields
    users_db[user_id].update(update_data)
    return users_db[user_id]

@app.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: int):
    if user_id not in users_db:
        raise HTTPException(404, detail=f"User {user_id} not found")
    del users_db[user_id]

# Run with: uvicorn main:app --reload
# Automatic docs at: http://localhost:8000/docs
\`\`\`

## FastAPI Dependency Injection

\`\`\`python
from fastapi import FastAPI, Depends, Header, HTTPException

# Dependencies are just functions — FastAPI resolves them automatically
async def get_current_user(authorization: str = Header(None)):
    """Extract user from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, detail="Missing or invalid Authorization header")
    token = authorization.removeprefix("Bearer ")
    # In production: verify JWT, look up user in DB
    if token != "valid-token":
        raise HTTPException(401, detail="Invalid token")
    return {"id": 1, "name": "Alice", "role": "admin"}

async def require_admin(user = Depends(get_current_user)):
    """Require admin role."""
    if user["role"] != "admin":
        raise HTTPException(403, detail="Admin access required")
    return user

# Use dependencies in routes:
@app.get("/admin/stats")
async def admin_stats(user = Depends(require_admin)):
    return {"message": f"Hello, {user['name']}!", "total_users": len(users_db)}
\`\`\`

## Try It Yourself

\`\`\`python
# Build a minimal URL shortener with FastAPI + in-memory store:
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
import secrets, re

app = FastAPI(title="URL Shortener")
url_store: dict[str, str] = {}  # short_code → original_url

class URLCreate(BaseModel):
    url: str
    custom_code: str | None = None

class URLResponse(BaseModel):
    short_code: str
    original_url: str
    short_url: str

@app.post("/shorten", response_model=URLResponse)
async def shorten_url(data: URLCreate, base_url: str = "https://short.ly"):
    if data.custom_code:
        if not re.match(r'^[a-zA-Z0-9_-]{3,20}$', data.custom_code):
            raise HTTPException(400, "Custom code must be 3-20 alphanumeric chars")
        if data.custom_code in url_store:
            raise HTTPException(409, "Custom code already in use")
        code = data.custom_code
    else:
        code = secrets.token_urlsafe(6)[:8]   # 8-char random code
        while code in url_store:
            code = secrets.token_urlsafe(6)[:8]
    url_store[code] = data.url
    return URLResponse(short_code=code, original_url=data.url, short_url=f"{base_url}/{code}")

@app.get("/{code}", status_code=307)
async def redirect(code: str):
    if code not in url_store:
        raise HTTPException(404, f"Short URL '{code}' not found")
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url=url_store[code])
\`\`\`
`,
  },

  'expert-advanced-libraries-scikit-learn-ml-basics': {
    readTime: 10,
    whatYoullLearn: [
      'Split data into train/test sets and evaluate model performance',
      'Train and compare classification and regression models',
      'Preprocess features: scaling, encoding, imputation',
      'Build ML pipelines that prevent data leakage',
      'Tune hyperparameters with cross-validation and grid search',
    ],
    content: `
## The scikit-learn Workflow

Every scikit-learn model follows the same interface: \`fit(X_train, y_train)\`, \`predict(X_test)\`, \`score(X_test, y_test)\`:

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris, load_diabetes, make_classification
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (accuracy_score, classification_report,
                              confusion_matrix, mean_squared_error, r2_score)
import warnings
warnings.filterwarnings("ignore")

# Load a dataset:
iris = load_iris(as_frame=True)
X = iris.data       # features: DataFrame (150 samples × 4 features)
y = iris.target     # labels: 0, 1, 2 (setosa, versicolor, virginica)

# Split into train (80%) and test (20%):
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y,        # keep class proportions the same in both splits
)
print(f"Train: {len(X_train)}, Test: {len(X_test)}")
\`\`\`

## Classification

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier

# Define multiple models to compare:
models = {
    "Logistic Regression": LogisticRegression(max_iter=200),
    "Random Forest":       RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting":   GradientBoostingClassifier(random_state=42),
    "SVM (RBF)":           SVC(kernel="rbf", C=1.0),
    "K-NN (k=5)":          KNeighborsClassifier(n_neighbors=5),
}

results = {}
for name, model in models.items():
    # Scale features (important for distance-based and linear models):
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    results[name] = acc
    print(f"{name:<25} accuracy={acc:.4f}")

best = max(results, key=results.get)
print(f"\nBest: {best} ({results[best]:.4f})")

# Detailed metrics for the best model:
model = RandomForestClassifier(n_estimators=100, random_state=42)
scaler = StandardScaler()
model.fit(scaler.fit_transform(X_train), y_train)
y_pred = model.predict(scaler.transform(X_test))
print(classification_report(y_test, y_pred, target_names=iris.target_names))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
\`\`\`

## Regression

\`\`\`python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

diabetes = load_diabetes()
X, y = diabetes.data, diabetes.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

regressors = {
    "Linear":           LinearRegression(),
    "Ridge (L2)":       Ridge(alpha=1.0),
    "Lasso (L1)":       Lasso(alpha=0.1),
    "Random Forest":    RandomForestRegressor(n_estimators=100, random_state=42),
    "Gradient Boost":   GradientBoostingRegressor(n_estimators=100, random_state=42),
}

for name, model in regressors.items():
    scaler = StandardScaler()
    model.fit(scaler.fit_transform(X_train), y_train)
    y_pred = model.predict(scaler.transform(X_test))
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2   = r2_score(y_test, y_pred)
    print(f"{name:<20} RMSE={rmse:.2f}, R²={r2:.4f}")
\`\`\`

## Pipelines — Preventing Data Leakage

A Pipeline ensures preprocessing is fit only on training data — preventing data leakage (where test data info contaminates training):

\`\`\`python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# Without pipeline — DATA LEAKAGE:
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)  # ← WRONG! fit on ALL data including test!
# X_train, X_test = train_test_split(X_scaled, ...)

# With pipeline — CORRECT:
pipeline = Pipeline([
    ("scaler", StandardScaler()),         # Step 1: scale features
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42)),
])

# fit/predict work seamlessly:
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
print(f"Pipeline accuracy: {accuracy_score(y_test, y_pred):.4f}")

# Cross-validation on the whole pipeline (correct!):
cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
print(f"CV scores: {cv_scores.round(4)}")
print(f"CV mean: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
\`\`\`

## Handling Mixed Data Types

\`\`\`python
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# Mixed dataset:
df = pd.DataFrame({
    "age":      [25, 32, np.nan, 45, 28, 60],
    "salary":   [50000, 80000, 95000, np.nan, 60000, 120000],
    "city":     ["NYC", "LA", "NYC", "Chicago", "LA", "NYC"],
    "degree":   ["BS", "MS", "PhD", "BS", np.nan, "MS"],
    "promoted": [0, 1, 1, 0, 0, 1],   # target
})

X = df.drop("promoted", axis=1)
y = df["promoted"]

numeric_features = ["age", "salary"]
categorical_features = ["city", "degree"]

# Define transformations per column type:
numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),   # fill NaN with median
    ("scaler", StandardScaler()),
])
categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),  # fill NaN with mode
    ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
])

preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features),
])

# Full pipeline:
full_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=50, random_state=42)),
])

full_pipeline.fit(X, y)
print("Predictions:", full_pipeline.predict(X))
\`\`\`

## Hyperparameter Tuning

\`\`\`python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier

# Grid search — exhaustive (use for small grids):
param_grid = {
    "classifier__n_estimators": [50, 100, 200],
    "classifier__max_depth": [None, 5, 10],
    "classifier__min_samples_split": [2, 5],
}

grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1,        # use all CPU cores
    verbose=1,
)
grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")
print(f"Test score: {grid_search.score(X_test, y_test):.4f}")
\`\`\`

## Try It Yourself

\`\`\`python
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report

# 1. Generate a synthetic classification problem:
X, y = make_classification(
    n_samples=1000, n_features=20, n_informative=10,
    n_redundant=5, n_clusters_per_class=2,
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Build and evaluate a pipeline:
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)),
])
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred))

# 3. Cross-validation:
cv_scores = cross_val_score(pipeline, X, y, cv=10, scoring="roc_auc")
print(f"ROC-AUC: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# 4. Feature importance:
clf = pipeline.named_steps["clf"]
importances = clf.feature_importances_
top5 = sorted(enumerate(importances), key=lambda x: -x[1])[:5]
print("Top 5 features:", [(f"feature_{i}", f"{imp:.4f}") for i, imp in top5])
\`\`\`
`,
  },

};
