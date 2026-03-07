import { ALL_LESSONS } from './allLessons.js';

export const LEVELS = {
  beginner: { id: 'beginner', label: 'Beginner', emoji: '🟢', color: '#22c55e', tailwind: 'level-beginner', order: 1 },
  intermediate: { id: 'intermediate', label: 'Intermediate', emoji: '🟡', color: '#facc15', tailwind: 'level-intermediate', order: 2 },
  advanced: { id: 'advanced', label: 'Advanced', emoji: '🔵', color: '#3b82f6', tailwind: 'level-advanced', order: 3 },
  expert: { id: 'expert', label: 'Expert', emoji: '🔴', color: '#ef4444', tailwind: 'level-expert', order: 4 },
  mastery: { id: 'mastery', label: 'Mastery', emoji: '🟣', color: '#a855f7', tailwind: 'level-mastery', order: 5 },
};

const makeId = (level, section, topic) =>
  `${level}-${section.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export const LESSON_CONTENT = {
  'beginner-variables-data-types-numbers-int-float-complex': {
    title: 'Variables & Data Types',
    readTime: 12,
    whatYoullLearn: [
      'Declare and assign variables in Python',
      'Understand numeric types: int, float, and complex',
      'Work with strings and string methods',
      'Convert between data types using type casting',
      'Understand Python\'s dynamic typing system',
    ],
    content: `
## What Are Variables?

In Python, a variable is a named reference to a value stored in memory. Unlike statically typed languages, Python uses **dynamic typing** — you don't declare a type; Python infers it at runtime. This makes Python expressive and flexible, but requires discipline to avoid type-related bugs.

Variable names must start with a letter or underscore, contain only letters, digits, and underscores, and are case-sensitive. By convention, Python uses \`snake_case\` for variable names.

\`\`\`python
# Variable assignment
name = "Alice"
age = 30
height = 5.9
is_active = True

# Multiple assignment
x = y = z = 0

# Tuple unpacking
first, second, third = 1, 2, 3

print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))  # <class 'float'>
\`\`\`

## Numeric Types

Python has three built-in numeric types: **int** (whole numbers), **float** (decimal numbers), and **complex** (numbers with a real and imaginary part).

Integers in Python have **unlimited precision** — they grow as large as your memory allows. Floats are IEEE 754 double-precision numbers, which means they have precision limits that can cause subtle bugs.

\`\`\`python
# Integer operations
a = 1_000_000  # underscores for readability
b = 0xFF       # hexadecimal: 255
c = 0b1010     # binary: 10
d = 0o17       # octal: 15

# Float precision issue (important!)
print(0.1 + 0.2)         # 0.30000000000000004 — NOT 0.3
print(round(0.1 + 0.2, 1))  # 0.3 — use round() to fix

# Complex numbers
z = 3 + 4j
print(z.real)   # 3.0
print(z.imag)   # 4.0
print(abs(z))   # 5.0 (magnitude)
\`\`\`

## Type Casting

Python provides built-in functions to convert between types. Always be cautious: converting a float to int **truncates** (doesn't round) the decimal part.

\`\`\`python
# Type conversion
x = int("42")        # str → int: 42
y = float("3.14")    # str → float: 3.14
z = str(100)         # int → str: "100"
b = bool(0)          # int → bool: False
b2 = bool("hello")   # str → bool: True (non-empty = truthy)

# Truncation vs rounding
print(int(9.9))      # 9  — truncates, NOT rounds!
print(round(9.9))    # 10 — use round() for rounding

# Safe type checking
value = "123"
if value.isdigit():
    num = int(value)
    print(f"Converted: {num}")
\`\`\`

## Common Mistakes to Avoid

- **Float precision**: Never use \`==\` to compare floats directly. Use \`abs(a - b) < epsilon\` or the \`math.isclose()\` function.
- **Mutable defaults**: Never use mutable objects (lists, dicts) as default parameter values.
- **Integer division**: In Python 3, \`/\` always returns a float. Use \`//\` for integer (floor) division.
- **Implicit type conversion**: Python does NOT implicitly convert types between \`str\` and numeric. \`"5" + 5\` raises a \`TypeError\`.

## Try It Yourself

Write a program that asks the user for their birth year and calculates their approximate age. Handle the case where the user enters a non-numeric value gracefully.

\`\`\`python
# Challenge solution template
current_year = 2025
birth_year_str = input("Enter your birth year: ")

# Your code here: convert, validate, and calculate age
\`\`\`
`,
  },

  'beginner-functions-defining-calling': {
    title: 'Functions: Defining & Calling',
    readTime: 10,
    whatYoullLearn: [
      'Define and call functions using def',
      'Understand parameters, arguments, and return values',
      'Use default and keyword arguments',
      'Understand variable scope (local vs global)',
      'Write clean, reusable, single-purpose functions',
    ],
    content: `
## Defining Functions

A function is a reusable block of code that performs a specific task. In Python, you define functions using the \`def\` keyword. Functions promote the **DRY (Don't Repeat Yourself)** principle — write logic once, use it everywhere.

A well-designed function does one thing, does it clearly, and has a descriptive name in \`snake_case\`. The function body is indented, and a **docstring** (triple-quoted string) should document what the function does.

\`\`\`python
def greet(name):
    """Return a personalized greeting message."""
    return f"Hello, {name}! Welcome to PyPath."

# Calling the function
message = greet("Alice")
print(message)  # Hello, Alice! Welcome to PyPath.

# Functions without return implicitly return None
def say_hello():
    print("Hello!")

result = say_hello()  # prints "Hello!"
print(result)         # None
\`\`\`

## Parameters and Arguments

Python offers several ways to pass arguments: **positional**, **keyword**, **default**, and **variable-length** (\`*args\`, \`**kwargs\`).

\`\`\`python
# Default arguments (must come after required ones)
def power(base, exponent=2):
    """Raise base to the given power. Default: square."""
    return base ** exponent

print(power(3))      # 9  (uses default exponent=2)
print(power(3, 3))   # 27 (positional)
print(power(exponent=4, base=2))  # 16 (keyword, order doesn't matter)

# Mixing argument types
def create_profile(name, age, *, city="Unknown", active=True):
    """The * forces city and active to be keyword-only."""
    return {
        "name": name,
        "age": age,
        "city": city,
        "active": active
    }

profile = create_profile("Bob", 25, city="New York")
print(profile)
\`\`\`

## Scope: Where Variables Live

Python uses the **LEGB rule** to resolve variable names: **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in. A variable defined inside a function is local to that function and not visible outside.

\`\`\`python
total = 0  # global variable

def add_to_total(amount):
    global total        # declare intent to modify global
    total += amount

def calculate(x, y):
    result = x + y      # 'result' is local — dies when function ends
    return result

add_to_total(10)
add_to_total(5)
print(total)  # 15

# Prefer returning values over mutating globals:
def better_add(current_total, amount):
    return current_total + amount

total = better_add(total, 20)
print(total)  # 35
\`\`\`

## Common Mistakes to Avoid

- **Mutable default arguments**: \`def add_item(item, lst=[])\` is a notorious Python trap. The same list is reused across calls. Use \`None\` as default and create the list inside the function.
- **Missing return**: If a function should produce a value but you forget \`return\`, it silently returns \`None\`.
- **Side effects**: Functions that modify external state (globals, files, UI) are harder to test. Prefer pure functions that only depend on their inputs.

## Try It Yourself

Write a function \`fizzbuzz(n)\` that returns a list of strings from 1 to n where: multiples of 3 are "Fizz", multiples of 5 are "Buzz", multiples of both are "FizzBuzz", and everything else is the number as a string.

\`\`\`python
def fizzbuzz(n):
    # Your implementation here
    pass

print(fizzbuzz(15))
# Expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz']
\`\`\`
`,
  },

  'intermediate-oop-classes-objects': {
    title: 'Object-Oriented Programming',
    readTime: 18,
    whatYoullLearn: [
      'Create classes and instantiate objects',
      'Use __init__ for initialization and self for instance references',
      'Define instance methods, class methods, and static methods',
      'Implement inheritance and method overriding',
      'Apply encapsulation with properties',
      'Use dunder methods to make objects Pythonic',
    ],
    content: `
## Classes and Objects

Object-Oriented Programming (OOP) organizes code around **objects** — bundles of data (attributes) and behavior (methods). A **class** is the blueprint; an **object** (instance) is a concrete realization of that blueprint.

Python's OOP is elegant: everything is an object, including functions, classes, and modules themselves. \`self\` is just a convention for the first parameter of instance methods — it refers to the current object.

\`\`\`python
class BankAccount:
    """Represents a simple bank account."""
    
    # Class variable — shared by ALL instances
    bank_name = "PyBank"
    
    def __init__(self, owner: str, balance: float = 0.0):
        # Instance variables — unique to each object
        self.owner = owner
        self._balance = balance   # underscore: "private by convention"
        self._transactions = []
    
    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self._balance += amount
        self._transactions.append(("deposit", amount))
    
    def withdraw(self, amount: float) -> float:
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount
        self._transactions.append(("withdrawal", amount))
        return amount
    
    @property
    def balance(self) -> float:
        """Read-only balance property."""
        return self._balance
    
    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self._balance:.2f})"

# Usage
account = BankAccount("Alice", 1000)
account.deposit(500)
print(account.balance)  # 1500.0
print(account)          # BankAccount(owner='Alice', balance=1500.00)
\`\`\`

## Inheritance

Inheritance allows a class to **inherit** attributes and methods from a parent class, then extend or override them. Python supports multiple inheritance, and uses the **MRO (Method Resolution Order)** to determine which method to call.

\`\`\`python
class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound
    
    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"
    
    def __str__(self) -> str:
        return f"Animal({self.name})"

class Dog(Animal):
    def __init__(self, name: str, breed: str):
        super().__init__(name, "Woof")   # call parent __init__
        self.breed = breed
    
    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"
    
    # Override parent method
    def speak(self) -> str:
        base = super().speak()
        return f"{base} *wags tail*"

class Cat(Animal):
    def __init__(self, name: str):
        super().__init__(name, "Meow")
    
    def purr(self) -> str:
        return f"{self.name} purrs..."

dog = Dog("Rex", "Labrador")
cat = Cat("Whiskers")

animals = [dog, cat]
for animal in animals:
    print(animal.speak())   # polymorphism in action

print(dog.fetch("ball"))
print(isinstance(dog, Animal))  # True — Dog IS-A Animal
\`\`\`

## Dunder Methods (Magic Methods)

Dunder (double underscore) methods let your objects integrate naturally with Python's syntax and built-in functions. They make your classes feel like first-class Python citizens.

\`\`\`python
class Vector:
    """2D vector with full operator support."""
    
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    
    def __add__(self, other: 'Vector') -> 'Vector':
        return Vector(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar: float) -> 'Vector':
        return Vector(self.x * scalar, self.y * scalar)
    
    def __abs__(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5
    
    def __eq__(self, other: 'Vector') -> bool:
        return self.x == other.x and self.y == other.y
    
    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1 + v2)    # Vector(4, 6)
print(v1 * 3)     # Vector(3, 6)
print(abs(v2))    # 5.0
print(v1 == v1)   # True
\`\`\`

## Common Mistakes to Avoid

- **Forgetting \`self\`**: Instance methods must have \`self\` as the first parameter. Without it, Python will throw a \`TypeError\` when the method is called.
- **Mutating class variables through instances**: If you do \`obj.class_var = value\`, you create an instance variable that *shadows* the class variable. This rarely leads to the behavior you want.
- **Not calling \`super().__init__()\`**: In inherited classes, always call the parent constructor to properly initialize inherited attributes.
- **Overusing inheritance**: Prefer **composition** (an object *has* another object) over deep inheritance chains. "Favor composition over inheritance."

## Try It Yourself

Build a \`Stack\` class that uses a Python list internally. It should support \`push(item)\`, \`pop()\`, \`peek()\` (view top without removing), \`is_empty()\`, and \`__len__()\`. Make it raise an appropriate exception when popping or peeking an empty stack.

\`\`\`python
class Stack:
    def __init__(self):
        self._items = []
    
    # Implement the methods here...

stack = Stack()
stack.push(1)
stack.push(2)
print(stack.peek())   # 2
print(len(stack))     # 2
print(stack.pop())    # 2
\`\`\`
`,
  },

  'intermediate-decorators-function-class-decorators': {
    title: 'Decorators',
    readTime: 15,
    whatYoullLearn: [
      'Understand functions as first-class objects',
      'Write and apply function decorators',
      'Use functools.wraps to preserve metadata',
      'Create decorators that accept arguments',
      'Understand class decorators',
      'Apply real-world decorators: timing, caching, retry logic',
    ],
    content: `
## Functions as First-Class Objects

To understand decorators, you first need to understand that in Python, **functions are first-class objects** — they can be passed as arguments, returned from other functions, and assigned to variables. This is the foundation of decorators.

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Functions are objects — you can assign them
say_hi = greet
print(say_hi("Alice"))  # Hello, Alice!

# Functions can be passed as arguments
def apply(func, value):
    return func(value)

print(apply(str.upper, "python"))  # PYTHON

# Functions can be returned from other functions
def make_multiplier(factor):
    def multiplier(n):          # inner function (closure)
        return n * factor       # captures 'factor' from outer scope
    return multiplier           # returns the inner function

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))  # 10
print(triple(5))  # 15
\`\`\`

## Writing Your First Decorator

A **decorator** is a function that takes a function as input, wraps it with additional behavior, and returns the wrapped function. The \`@syntax\` is syntactic sugar for \`func = decorator(func)\`.

\`\`\`python
import time
import functools

def timer(func):
    """Decorator that measures function execution time."""
    @functools.wraps(func)   # preserves original function metadata
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        elapsed = (end - start) * 1000
        print(f"⏱  {func.__name__} ran in {elapsed:.2f}ms")
        return result
    return wrapper

@timer
def slow_sum(n):
    """Sum numbers from 0 to n."""
    return sum(range(n))

result = slow_sum(1_000_000)
# ⏱  slow_sum ran in 42.18ms
print(result)  # 499999500000

# functools.wraps ensures docstring/name are preserved:
print(slow_sum.__name__)  # 'slow_sum' (not 'wrapper')
print(slow_sum.__doc__)   # 'Sum numbers from 0 to n.'
\`\`\`

## Decorators with Arguments

Sometimes you want a decorator that accepts its own configuration. This requires **three levels of nesting**: the outer function accepts decorator arguments, returns a decorator, which wraps the target function.

\`\`\`python
import functools
import time

def retry(max_attempts=3, delay=1.0, exceptions=(Exception,)):
    """Retry a function on failure with configurable attempts and delay."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts:
                        print(f"Attempt {attempt} failed: {e}. Retrying in {delay}s...")
                        time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator

import random

@retry(max_attempts=3, delay=0.1, exceptions=(ValueError,))
def flaky_function():
    """This function randomly fails."""
    if random.random() < 0.7:
        raise ValueError("Random failure!")
    return "Success!"

# Stacking decorators (applied bottom-up)
@timer
@retry(max_attempts=2, delay=0)
def unstable_request():
    if random.random() < 0.5:
        raise ConnectionError("Network error")
    return "Data received"
\`\`\`

## Common Mistakes to Avoid

- **Forgetting \`functools.wraps\`**: Without it, the wrapper function replaces the original's \`__name__\`, \`__doc__\`, and other metadata. This breaks introspection, logging, and documentation tools.
- **Not forwarding args**: Your wrapper must accept and pass \`*args, **kwargs\` to the original function, or you'll break callers that pass arguments.
- **Decorator order matters**: \`@A @B def f()\` means \`f = A(B(f))\`. The bottom decorator is applied first. This matters when decorators interact (e.g., \`@timer @retry\` vs \`@retry @timer\`).
- **Mutating shared state**: If your decorator uses mutable state (like a counter), be careful in multithreaded contexts — use threading locks.

## Try It Yourself

Write a \`memoize\` decorator that caches the results of a function based on its arguments. Test it with a recursive Fibonacci function to verify it dramatically speeds up computation.

\`\`\`python
def memoize(func):
    cache = {}
    
    @functools.wraps(func)
    def wrapper(*args):
        # Your implementation here
        pass
    
    return wrapper

@memoize
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

print(fib(50))  # Should be fast even for large n!
\`\`\`
`,
  },
};

const placeholder = (title, points, subtopics) => ({
  title,
  subtopics: subtopics || [],
  readTime: 8,
  whatYoullLearn: points || [
    `Understand core concepts of ${title}`,
    `Apply ${title} in practical scenarios`,
    `Recognize common patterns and pitfalls`,
    'Write clean, idiomatic Python code',
  ],
  content: `
## ${title}

${(points || [`Core concepts of ${title}`, `Practical applications`, `Common patterns`]).map(p => `- ${p}`).join('\n')}

*Full lesson content is available — make sure lessonContent.js is loaded correctly.*
`,
});

const rawCurriculum = [
  // ═══════════════════════════════════════════════════════════
  // BEGINNER
  // ═══════════════════════════════════════════════════════════
  {
    id: 'beginner',
    level: 'beginner',
    title: 'Beginner',
    subtitle: 'Python Foundations',
    description: 'Start your Python journey. No prior experience needed.',
    icon: '🐍',
    sections: [
      {
        id: 'intro-to-python',
        title: 'Introduction to Python',
        topics: [
          {
            id: makeId('beginner', 'intro-to-python', 'installing-python-ides'),
            title: 'Installing Python & IDEs',
            subtopics: ['Python 3 installation', 'VS Code setup', 'PyCharm overview', 'pip basics'],
            ...placeholder('Installing Python & IDEs', ['Install Python 3 on any OS', 'Set up VS Code with Python extensions', 'Configure a virtual environment', 'Run your first script']),
          },
          {
            id: makeId('beginner', 'intro-to-python', 'running-python-scripts'),
            title: 'Running Python Scripts',
            subtopics: ['REPL vs script mode', 'python command', 'Shebang lines', 'Script arguments'],
            ...placeholder('Running Python Scripts', ['Use the Python REPL interactively', 'Run .py files from the terminal', 'Pass arguments to scripts', 'Understand script vs module mode']),
          },
          {
            id: makeId('beginner', 'intro-to-python', 'python-syntax-comments-indentation'),
            title: 'Python Syntax, Comments & Indentation',
            subtopics: ['Indentation rules', 'Single/multi-line comments', 'Semicolons (rare)', 'Line continuation'],
            ...placeholder('Python Syntax, Comments & Indentation', ['Write syntactically correct Python', 'Use comments effectively', 'Understand indentation as structure', 'Follow PEP 8 style basics']),
          },
        ],
      },
      {
        id: 'variables-data-types',
        title: 'Variables & Data Types',
        topics: [
          {
            id: makeId('beginner', 'variables-data-types', 'numbers-int-float-complex'),
            title: 'Numbers (int, float, complex)',
            subtopics: ['int precision', 'float precision issues', 'complex numbers', 'Numeric literals'],
            ...LESSON_CONTENT['beginner-variables-data-types-numbers-int-float-complex'],
          },
          {
            id: makeId('beginner', 'variables-data-types', 'strings-string-methods'),
            title: 'Strings & String Methods',
            subtopics: ['String literals', 'Indexing/slicing', 'upper/lower/strip', 'split/join/replace', 'String formatting'],
            ...placeholder('Strings & String Methods', ['Create and manipulate strings', 'Use essential string methods', 'Format strings with f-strings', 'Understand string immutability']),
          },
          {
            id: makeId('beginner', 'variables-data-types', 'booleans'),
            title: 'Booleans',
            subtopics: ['True/False', 'Truthy/falsy values', 'bool() function', 'Short-circuit evaluation'],
            ...placeholder('Booleans', ['Understand Python truthiness', 'Use booleans in conditions', 'Know which values are falsy', 'Leverage short-circuit evaluation']),
          },
          {
            id: makeId('beginner', 'variables-data-types', 'type-casting'),
            title: 'Type Casting',
            subtopics: ['int()/float()/str()/bool()', 'Implicit vs explicit', 'Conversion errors', 'Safe casting patterns'],
            ...placeholder('Type Casting', ['Convert between Python types', 'Handle conversion errors', 'Understand implicit conversions', 'Use type() and isinstance()']),
          },
        ],
      },
      {
        id: 'operators',
        title: 'Operators',
        topics: [
          {
            id: makeId('beginner', 'operators', 'arithmetic-comparison-logical'),
            title: 'Arithmetic, Comparison & Logical',
            subtopics: ['+,-,*,/,//,%,**', '==,!=,<,>,<=,>=', 'and/or/not', 'Operator precedence'],
            ...placeholder('Arithmetic, Comparison & Logical Operators', ['Use all Python arithmetic operators', 'Compare values with comparison operators', 'Combine conditions with logical operators', 'Understand operator precedence']),
          },
          {
            id: makeId('beginner', 'operators', 'assignment-operators'),
            title: 'Assignment Operators',
            subtopics: ['=, +=, -=, *=', '/=, //=, %=', '**=, &=, |=', 'Walrus operator :='],
            ...placeholder('Assignment Operators', ['Use augmented assignment operators', 'Write concise updates with +=, -=', 'Use the walrus operator :=', 'Understand in-place modification']),
          },
          {
            id: makeId('beginner', 'operators', 'identity-membership-operators'),
            title: 'Identity & Membership Operators',
            subtopics: ['is / is not', 'in / not in', 'id() function', 'None comparisons'],
            ...placeholder('Identity & Membership Operators', ['Distinguish == from is', 'Check membership with in', 'Understand Python object identity', 'Compare with None correctly']),
          },
        ],
      },
      {
        id: 'input-output',
        title: 'Input & Output',
        topics: [
          {
            id: makeId('beginner', 'input-output', 'input-print-formatting'),
            title: 'input() and print() Formatting',
            subtopics: ['input() basics', 'f-strings', '.format()', '% formatting', 'print() sep/end'],
            ...placeholder('input() and print() Formatting', ['Read user input with input()', 'Format output with f-strings', 'Use print() options', 'Handle type conversion of input']),
          },
        ],
      },
      {
        id: 'conditionals',
        title: 'Conditional Statements',
        topics: [
          {
            id: makeId('beginner', 'conditionals', 'if-elif-else'),
            title: 'if, elif, else',
            subtopics: ['Basic if/else', 'elif chains', 'Nested conditionals', 'Ternary expression'],
            ...placeholder('if, elif, else', ['Write conditional logic', 'Handle multiple branches', 'Nest conditions appropriately', 'Use ternary expressions']),
          },
        ],
      },
      {
        id: 'loops',
        title: 'Loops',
        topics: [
          {
            id: makeId('beginner', 'loops', 'for-loop'),
            title: 'for Loop',
            subtopics: ['range()', 'Iterating over sequences', 'enumerate()', 'zip()'],
            ...placeholder('for Loop', ['Iterate over any sequence', 'Use range() for numeric loops', 'Enumerate with index', 'Combine sequences with zip()']),
          },
          {
            id: makeId('beginner', 'loops', 'while-loop'),
            title: 'while Loop',
            subtopics: ['while condition', 'Infinite loops', 'Loop invariants', 'do-while pattern'],
            ...placeholder('while Loop', ['Write condition-based loops', 'Avoid infinite loops', 'Implement do-while patterns', 'Update loop variables correctly']),
          },
          {
            id: makeId('beginner', 'loops', 'break-continue-pass'),
            title: 'break, continue, pass',
            subtopics: ['break to exit', 'continue to skip', 'pass as placeholder', 'Loop else clause'],
            ...placeholder('break, continue, pass', ['Exit loops early with break', 'Skip iterations with continue', 'Use pass as a placeholder', 'Use the loop else clause']),
          },
        ],
      },
      {
        id: 'data-structures-basics',
        title: 'Data Structures (Basics)',
        topics: [
          {
            id: makeId('beginner', 'data-structures-basics', 'lists'),
            title: 'Lists',
            subtopics: ['Creating lists', 'Indexing/slicing', 'append/remove/pop', 'List methods', 'Sorting'],
            ...placeholder('Lists', ['Create and manipulate lists', 'Use slicing and indexing', 'Apply common list methods', 'Sort and search lists']),
          },
          {
            id: makeId('beginner', 'data-structures-basics', 'tuples'),
            title: 'Tuples',
            subtopics: ['Immutability', 'Packing/unpacking', 'Named tuples', 'When to use tuples'],
            ...placeholder('Tuples', ['Understand tuple immutability', 'Use tuple unpacking', 'Know when to choose tuples over lists', 'Work with named tuples']),
          },
          {
            id: makeId('beginner', 'data-structures-basics', 'sets'),
            title: 'Sets',
            subtopics: ['Set creation', 'add/remove', 'Set operations (union/intersection)', 'frozenset'],
            ...placeholder('Sets', ['Create and modify sets', 'Perform set operations', 'Use sets for deduplication', 'Understand set ordering']),
          },
          {
            id: makeId('beginner', 'data-structures-basics', 'dictionaries'),
            title: 'Dictionaries',
            subtopics: ['Key-value pairs', 'get()/setdefault()', 'keys()/values()/items()', 'Nested dicts'],
            ...placeholder('Dictionaries', ['Create and access dictionaries', 'Use dictionary methods', 'Iterate over dicts', 'Work with nested dictionaries']),
          },
        ],
      },
      {
        id: 'functions',
        title: 'Functions',
        topics: [
          {
            id: makeId('beginner', 'functions', 'defining-calling'),
            title: 'Defining & Calling Functions',
            subtopics: ['def keyword', 'return statement', 'Function scope', 'Docstrings'],
            ...LESSON_CONTENT['beginner-functions-defining-calling'],
          },
          {
            id: makeId('beginner', 'functions', 'parameters-return-values'),
            title: 'Parameters & Return Values',
            subtopics: ['Positional args', 'Multiple return values', 'Type hints', 'None returns'],
            ...placeholder('Parameters & Return Values', ['Design functions with clear parameters', 'Return single and multiple values', 'Use type hints for clarity', 'Handle None return cases']),
          },
          {
            id: makeId('beginner', 'functions', 'default-keyword-arguments'),
            title: 'Default & Keyword Arguments',
            subtopics: ['Default values', 'Keyword-only args', '*args/**kwargs', 'Argument order rules'],
            ...placeholder('Default & Keyword Arguments', ['Set default parameter values', 'Call functions with keyword args', 'Use *args for variable positional args', 'Use **kwargs for variable keyword args']),
          },
        ],
      },
      {
        id: 'basic-error-handling',
        title: 'Basic Error Handling',
        topics: [
          {
            id: makeId('beginner', 'basic-error-handling', 'try-except'),
            title: 'try, except',
            subtopics: ['try/except syntax', 'Exception types', 'except as e', 'Bare except (avoid)'],
            ...placeholder('try, except', ['Catch and handle exceptions', 'Use specific exception types', 'Access exception info with as', 'Avoid catching all exceptions blindly']),
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // INTERMEDIATE
  // ═══════════════════════════════════════════════════════════
  {
    id: 'intermediate',
    level: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Core Programming',
    description: 'Go deeper. Write clean, reusable, Pythonic code.',
    icon: '⚡',
    sections: [
      {
        id: 'advanced-data-structures',
        title: 'Advanced Data Structures',
        topics: [
          {
            id: makeId('intermediate', 'advanced-data-structures', 'list-set-dict-comprehensions'),
            title: 'List, Set & Dict Comprehensions',
            subtopics: ['List comprehensions', 'Set comprehensions', 'Dict comprehensions', 'Conditional comprehensions', 'Generator expressions'],
            ...placeholder('List, Set & Dict Comprehensions', ['Write concise list comprehensions', 'Build sets and dicts with comprehensions', 'Add conditions to comprehensions', 'Compare performance vs loops']),
          },
          {
            id: makeId('intermediate', 'advanced-data-structures', 'nested-data-structures'),
            title: 'Nested Data Structures',
            subtopics: ['Nested lists/dicts', 'Deep access patterns', 'Flattening structures', 'json-like data'],
            ...placeholder('Nested Data Structures', ['Navigate deeply nested structures', 'Build complex data models', 'Flatten and transform nested data', 'Apply to real JSON-like data']),
          },
        ],
      },
      {
        id: 'functions-advanced',
        title: 'Functions (Advanced)',
        topics: [
          {
            id: makeId('intermediate', 'functions-advanced', 'recursion'),
            title: 'Recursion',
            subtopics: ['Base case & recursive case', 'Stack frames', 'sys.setrecursionlimit', 'Tail recursion'],
            ...placeholder('Recursion', ['Write recursive functions', 'Identify base and recursive cases', 'Avoid stack overflows', 'Convert recursion to iteration']),
          },
          {
            id: makeId('intermediate', 'functions-advanced', 'args-kwargs'),
            title: '*args and **kwargs',
            subtopics: ['Variable positional args', 'Variable keyword args', 'Unpacking with * and **', 'Combining arg types'],
            ...placeholder('*args and **kwargs', ['Accept variable number of arguments', 'Pass args to other functions', 'Unpack sequences and dicts', 'Write flexible function signatures']),
          },
          {
            id: makeId('intermediate', 'functions-advanced', 'lambda'),
            title: 'Lambda Functions',
            subtopics: ['lambda syntax', 'Single expression limit', 'With sorted/filter/map', 'When to avoid lambda'],
            ...placeholder('Lambda Functions', ['Write anonymous one-line functions', 'Use lambdas with higher-order functions', 'Know when lambdas hurt readability', 'Replace lambdas with def when needed']),
          },
          {
            id: makeId('intermediate', 'functions-advanced', 'map-filter-reduce'),
            title: 'Map, Filter & Reduce',
            subtopics: ['map()', 'filter()', 'functools.reduce()', 'vs comprehensions'],
            ...placeholder('Map, Filter & Reduce', ['Transform sequences with map()', 'Filter sequences with filter()', 'Accumulate with reduce()', 'Choose between map/filter vs comprehensions']),
          },
        ],
      },
      {
        id: 'string-manipulation',
        title: 'String Manipulation',
        topics: [
          {
            id: makeId('intermediate', 'string-manipulation', 'slicing-formatting-regex'),
            title: 'Slicing, Formatting & Regex',
            subtopics: ['Advanced slicing', 'String templates', 'Regular expressions (re)', 'Pattern matching'],
            ...placeholder('Slicing, Formatting & Regex', ['Use advanced string slicing', 'Format with precision', 'Write basic regex patterns', 'Extract data with groups']),
          },
        ],
      },
      {
        id: 'file-handling',
        title: 'File Handling',
        topics: [
          {
            id: makeId('intermediate', 'file-handling', 'reading-writing-files'),
            title: 'Reading & Writing Files',
            subtopics: ['open() modes', 'read/readline/readlines', 'write/writelines', 'Binary files'],
            ...placeholder('Reading & Writing Files', ['Open files in different modes', 'Read entire files or line by line', 'Write and append to files', 'Handle binary data']),
          },
          {
            id: makeId('intermediate', 'file-handling', 'with-open-os-pathlib'),
            title: 'with open(), os & pathlib',
            subtopics: ['Context managers for files', 'os.path functions', 'pathlib.Path API', 'File system operations'],
            ...placeholder('with open(), os & pathlib', ['Use context managers for safe file handling', 'Navigate file systems with os.path', 'Use the modern pathlib API', 'Create, move, and delete files']),
          },
        ],
      },
      {
        id: 'modules-packages',
        title: 'Modules & Packages',
        topics: [
          {
            id: makeId('intermediate', 'modules-packages', 'importing-custom-modules'),
            title: 'Importing & Custom Modules',
            subtopics: ['import statement', 'from ... import', '__name__ == "__main__"', 'Circular imports'],
            ...placeholder('Importing & Custom Modules', ['Import standard and third-party modules', 'Create your own modules', 'Use __name__ guard', 'Organize code into packages']),
          },
          {
            id: makeId('intermediate', 'modules-packages', 'venv-pip'),
            title: 'Virtual Environments & pip',
            subtopics: ['venv creation', 'activate/deactivate', 'pip install/freeze', 'requirements.txt'],
            ...placeholder('Virtual Environments & pip', ['Create isolated virtual environments', 'Install packages with pip', 'Freeze dependencies', 'Share projects with requirements.txt']),
          },
        ],
      },
      {
        id: 'exception-handling-advanced',
        title: 'Exception Handling (Advanced)',
        topics: [
          {
            id: makeId('intermediate', 'exception-handling-advanced', 'try-except-else-finally'),
            title: 'try-except-else-finally',
            subtopics: ['else block usage', 'finally for cleanup', 'Exception chaining', 'raise/raise from'],
            ...placeholder('try-except-else-finally', ['Use else for success paths', 'Use finally for cleanup', 'Chain exceptions with raise from', 'Re-raise exceptions properly']),
          },
          {
            id: makeId('intermediate', 'exception-handling-advanced', 'custom-exceptions'),
            title: 'Custom Exceptions',
            subtopics: ['Subclassing Exception', 'Custom attributes', 'Exception hierarchies', 'Best practices'],
            ...placeholder('Custom Exceptions', ['Create domain-specific exceptions', 'Add useful attributes to exceptions', 'Design exception hierarchies', 'Know when to use custom exceptions']),
          },
        ],
      },
      {
        id: 'oop',
        title: 'Object-Oriented Programming',
        topics: [
          {
            id: makeId('intermediate', 'oop', 'classes-objects'),
            title: 'Classes & Objects',
            subtopics: ['class definition', '__init__', 'Instance vs class vars', 'Object creation'],
            ...LESSON_CONTENT['intermediate-oop-classes-objects'],
          },
          {
            id: makeId('intermediate', 'oop', 'inheritance-polymorphism'),
            title: 'Inheritance & Polymorphism',
            subtopics: ['super()', 'Method overriding', 'isinstance/issubclass', 'Duck typing'],
            ...placeholder('Inheritance & Polymorphism', ['Extend classes with inheritance', 'Override parent methods', 'Apply polymorphism patterns', 'Understand duck typing']),
          },
          {
            id: makeId('intermediate', 'oop', 'encapsulation-dunder-methods'),
            title: 'Encapsulation & Dunder Methods',
            subtopics: ['Name mangling', '__str__/__repr__', '__len__/__contains__', '__eq__/__lt__'],
            ...placeholder('Encapsulation & Dunder Methods', ['Protect internal state', 'Make objects printable', 'Support len() and in operator', 'Enable comparison between objects']),
          },
        ],
      },
      {
        id: 'iterators-generators',
        title: 'Iterators & Generators',
        topics: [
          {
            id: makeId('intermediate', 'iterators-generators', 'iter-next'),
            title: 'iter() and next()',
            subtopics: ['Iterable protocol', '__iter__/__next__', 'StopIteration', 'Custom iterators'],
            ...placeholder('iter() and next()', ['Understand the iteration protocol', 'Implement __iter__ and __next__', 'Create custom iterators', 'Use iterators with for loops']),
          },
          {
            id: makeId('intermediate', 'iterators-generators', 'yield-generator-functions'),
            title: 'yield & Generator Functions',
            subtopics: ['yield keyword', 'Generator objects', 'Lazy evaluation', 'send() and throw()'],
            ...placeholder('yield & Generator Functions', ['Write generator functions', 'Understand lazy evaluation', 'Use generators for memory efficiency', 'Chain generators together']),
          },
        ],
      },
      {
        id: 'decorators',
        title: 'Decorators',
        topics: [
          {
            id: makeId('intermediate', 'decorators', 'function-class-decorators'),
            title: 'Function & Class Decorators',
            subtopics: ['@syntax', 'functools.wraps', 'Decorators with args', 'Stacking decorators', 'Class decorators'],
            ...LESSON_CONTENT['intermediate-decorators-function-class-decorators'],
          },
        ],
      },
      {
        id: 'standard-modules',
        title: 'Standard Library Modules',
        topics: [
          {
            id: makeId('intermediate', 'standard-modules', 'math-random'),
            title: 'math & random',
            subtopics: ['math.sqrt/log/pi', 'math.floor/ceil', 'random.random()', 'random.choice/shuffle'],
            ...placeholder('math & random', ['Use math module for numeric operations', 'Generate random numbers and choices', 'Understand floating point math', 'Seed random for reproducibility']),
          },
          {
            id: makeId('intermediate', 'standard-modules', 'datetime'),
            title: 'datetime',
            subtopics: ['date/time/datetime objects', 'timedelta', 'strftime/strptime', 'Timezone basics'],
            ...placeholder('datetime', ['Create and compare dates', 'Format and parse date strings', 'Calculate time differences', 'Work with time zones']),
          },
          {
            id: makeId('intermediate', 'standard-modules', 'collections'),
            title: 'collections',
            subtopics: ['Counter', 'defaultdict', 'OrderedDict', 'deque', 'namedtuple'],
            ...placeholder('collections Module', ['Count items with Counter', 'Use defaultdict to avoid KeyError', 'Use deque for fast queues', 'Create structured data with namedtuple']),
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ADVANCED
  // ═══════════════════════════════════════════════════════════
  {
    id: 'advanced',
    level: 'advanced',
    title: 'Advanced',
    subtitle: 'Professional Python',
    description: 'Write production-quality Python used by professionals.',
    icon: '🔧',
    sections: [
      {
        id: 'functional-programming',
        title: 'Functional Programming',
        topics: [
          {
            id: makeId('advanced', 'functional-programming', 'closures'),
            title: 'Closures',
            subtopics: ['Free variables', 'nonlocal keyword', 'Factory functions', 'Closure vs class'],
            ...placeholder('Closures', ['Understand how closures capture variables', 'Use nonlocal for enclosing scope', 'Build factory functions', 'Compare closures to classes']),
          },
          {
            id: makeId('advanced', 'functional-programming', 'higher-order-functions'),
            title: 'Higher-Order Functions',
            subtopics: ['Functions as arguments', 'Function composition', 'Partial application', 'Currying'],
            ...placeholder('Higher-Order Functions', ['Pass functions as arguments', 'Compose functions', 'Use functools.partial', 'Implement currying patterns']),
          },
        ],
      },
      {
        id: 'advanced-oop',
        title: 'Advanced OOP',
        topics: [
          {
            id: makeId('advanced', 'advanced-oop', 'abstract-classes'),
            title: 'Abstract Classes (abc)',
            subtopics: ['ABC module', '@abstractmethod', 'Abstract properties', 'Interfaces pattern'],
            ...placeholder('Abstract Classes (abc)', ['Define abstract base classes', 'Force subclass implementation', 'Use abstract properties', 'Design interface-like patterns']),
          },
          {
            id: makeId('advanced', 'advanced-oop', 'static-class-methods-property'),
            title: 'Static Methods, Class Methods & @property',
            subtopics: ['@staticmethod', '@classmethod', '@property', 'Setter/deleter'],
            ...placeholder('Static Methods, Class Methods & @property', ['Use @staticmethod for utility functions', 'Use @classmethod for alternative constructors', 'Create properties with getter/setter', 'Validate attributes with setters']),
          },
          {
            id: makeId('advanced', 'advanced-oop', 'multiple-inheritance-mro'),
            title: 'Multiple Inheritance & MRO',
            subtopics: ['MRO algorithm', 'C3 linearization', 'super() in MI', 'Diamond problem'],
            ...placeholder('Multiple Inheritance & MRO', ['Use multiple inheritance safely', 'Understand method resolution order', 'Trace MRO with __mro__', 'Avoid common MI pitfalls']),
          },
        ],
      },
      {
        id: 'concurrency',
        title: 'Concurrency & Parallelism',
        topics: [
          {
            id: makeId('advanced', 'concurrency', 'threading'),
            title: 'threading',
            subtopics: ['Thread creation', 'Thread synchronization', 'Lock/RLock', 'Thread pools'],
            ...placeholder('threading', ['Create and manage threads', 'Synchronize with locks', 'Use thread pools', 'Avoid race conditions']),
          },
          {
            id: makeId('advanced', 'concurrency', 'multiprocessing'),
            title: 'multiprocessing',
            subtopics: ['Process creation', 'Process pools', 'Shared memory', 'Queue/Pipe'],
            ...placeholder('multiprocessing', ['Bypass the GIL with processes', 'Use process pools for CPU tasks', 'Share data between processes', 'Use Queues for IPC']),
          },
          {
            id: makeId('advanced', 'concurrency', 'asyncio'),
            title: 'asyncio',
            subtopics: ['async/await syntax', 'Event loop', 'Coroutines', 'asyncio.gather'],
            ...placeholder('asyncio', ['Write async/await coroutines', 'Run concurrent I/O tasks', 'Use asyncio.gather', 'Handle async errors']),
          },
        ],
      },
      {
        id: 'advanced-modules',
        title: 'Advanced Standard Modules',
        topics: [
          {
            id: makeId('advanced', 'advanced-modules', 'itertools'),
            title: 'itertools',
            subtopics: ['chain/cycle/repeat', 'combinations/permutations', 'groupby', 'islice'],
            ...placeholder('itertools', ['Combine iterables with chain', 'Generate combinations and permutations', 'Group data with groupby', 'Slice iterators with islice']),
          },
          {
            id: makeId('advanced', 'advanced-modules', 'functools'),
            title: 'functools',
            subtopics: ['lru_cache', 'partial', 'reduce', 'total_ordering', 'wraps'],
            ...placeholder('functools', ['Cache results with lru_cache', 'Create partial functions', 'Use total_ordering', 'Apply wraps in decorators']),
          },
        ],
      },
      {
        id: 'memory-management',
        title: 'Memory Management',
        topics: [
          {
            id: makeId('advanced', 'memory-management', 'garbage-collection'),
            title: 'Garbage Collection',
            subtopics: ['Reference counting', 'gc module', 'Cyclic garbage', 'weakref'],
            ...placeholder('Garbage Collection', ['Understand reference counting', 'Control garbage collection', 'Handle circular references', 'Use weak references']),
          },
          {
            id: makeId('advanced', 'memory-management', 'shallow-vs-deep-copy'),
            title: 'Shallow vs Deep Copy',
            subtopics: ['copy.copy()', 'copy.deepcopy()', 'Mutation hazards', 'Custom __copy__'],
            ...placeholder('Shallow vs Deep Copy', ['Understand shallow vs deep copy', 'Use the copy module correctly', 'Avoid mutation bugs', 'Implement custom copy behavior']),
          },
        ],
      },
      {
        id: 'context-managers',
        title: 'Context Managers',
        topics: [
          {
            id: makeId('advanced', 'context-managers', 'with-statement-custom'),
            title: 'with Statement & Custom Context Managers',
            subtopics: ['__enter__/__exit__', 'contextlib.contextmanager', 'Multiple contexts', 'Exception suppression'],
            ...placeholder('Custom Context Managers', ['Write __enter__ and __exit__', 'Use @contextmanager decorator', 'Open multiple contexts', 'Suppress exceptions in __exit__']),
          },
        ],
      },
      {
        id: 'type-hinting',
        title: 'Type Hinting',
        topics: [
          {
            id: makeId('advanced', 'type-hinting', 'typing-module-generics-protocols'),
            title: 'typing Module, Generics & Protocols',
            subtopics: ['List/Dict/Optional', 'Union/Tuple/Any', 'TypeVar & Generics', 'Protocol class'],
            ...placeholder('typing Module, Generics & Protocols', ['Annotate functions and variables', 'Use Optional and Union', 'Write generic functions', 'Define structural subtypes with Protocol']),
          },
        ],
      },
      {
        id: 'testing',
        title: 'Testing',
        topics: [
          {
            id: makeId('advanced', 'testing', 'unittest'),
            title: 'unittest',
            subtopics: ['TestCase class', 'setUp/tearDown', 'assert methods', 'Test discovery'],
            ...placeholder('unittest', ['Write test cases with TestCase', 'Set up and tear down test state', 'Use assert methods', 'Run test suites']),
          },
          {
            id: makeId('advanced', 'testing', 'pytest'),
            title: 'pytest',
            subtopics: ['pytest functions', 'Fixtures', 'Parametrize', 'Plugins'],
            ...placeholder('pytest', ['Write simple test functions', 'Use fixtures for reusable setup', 'Parametrize for multiple test cases', 'Use popular plugins']),
          },
          {
            id: makeId('advanced', 'testing', 'mocking'),
            title: 'Mocking',
            subtopics: ['unittest.mock', 'Mock/MagicMock', 'patch decorator', 'Side effects'],
            ...placeholder('Mocking', ['Mock external dependencies', 'Use patch to substitute objects', 'Set return values and side effects', 'Verify mock was called']),
          },
        ],
      },
      {
        id: 'logging-debugging',
        title: 'Logging & Debugging',
        topics: [
          {
            id: makeId('advanced', 'logging-debugging', 'logging-module'),
            title: 'logging Module',
            subtopics: ['Log levels', 'Handlers & formatters', 'Logger hierarchy', 'File logging'],
            ...placeholder('logging Module', ['Set up structured logging', 'Use different log levels', 'Configure handlers and formatters', 'Implement log rotation']),
          },
          {
            id: makeId('advanced', 'logging-debugging', 'pdb'),
            title: 'pdb Debugger',
            subtopics: ['breakpoint()', 'pdb commands', 'Post-mortem debugging', 'ipdb'],
            ...placeholder('pdb Debugger', ['Set breakpoints with breakpoint()', 'Step through code with pdb', 'Inspect variables at runtime', 'Debug crashes with post-mortem']),
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // EXPERT
  // ═══════════════════════════════════════════════════════════
  {
    id: 'expert',
    level: 'expert',
    title: 'Expert',
    subtitle: 'Real-World Python',
    description: 'Build production systems, APIs, and data pipelines.',
    icon: '🏆',
    sections: [
      {
        id: 'design-patterns',
        title: 'Design Patterns',
        topics: [
          {
            id: makeId('expert', 'design-patterns', 'singleton-factory'),
            title: 'Singleton & Factory',
            subtopics: ['Singleton implementation', 'Thread-safe Singleton', 'Factory Method', 'Abstract Factory'],
            ...placeholder('Singleton & Factory Patterns', ['Implement Singleton correctly', 'Use Factory for object creation', 'Make patterns thread-safe', 'Avoid Singleton pitfalls']),
          },
          {
            id: makeId('expert', 'design-patterns', 'observer-strategy'),
            title: 'Observer & Strategy',
            subtopics: ['Observer/Event system', 'Strategy pattern', 'Command pattern', 'Template Method'],
            ...placeholder('Observer & Strategy Patterns', ['Build event-driven systems', 'Swap algorithms at runtime', 'Decouple components with Observer', 'Use Strategy for flexible behavior']),
          },
        ],
      },
      {
        id: 'metaprogramming',
        title: 'Metaprogramming',
        topics: [
          {
            id: makeId('expert', 'metaprogramming', 'metaclasses'),
            title: 'Metaclasses',
            subtopics: ['type() as metaclass', 'Custom __new__/__init__', 'Class creation hooks', '__init_subclass__'],
            ...placeholder('Metaclasses', ['Understand type as the metaclass', 'Create custom metaclasses', 'Hook into class creation', 'Use for ORMs and frameworks']),
          },
          {
            id: makeId('expert', 'metaprogramming', 'introspection'),
            title: 'Introspection (getattr, setattr, hasattr)',
            subtopics: ['getattr/setattr', 'hasattr/delattr', 'inspect module', '__dict__/__slots__'],
            ...placeholder('Introspection', ['Dynamically access attributes', 'Use the inspect module', 'Explore objects at runtime', 'Build generic utilities']),
          },
          {
            id: makeId('expert', 'metaprogramming', 'descriptor-protocol'),
            title: 'Descriptor Protocol',
            subtopics: ['__get__/__set__/__delete__', 'Data vs non-data', 'Property implementation', 'ORMs use descriptors'],
            ...placeholder('Descriptor Protocol', ['Implement descriptors', 'Distinguish data and non-data descriptors', 'Understand how @property works internally', 'Build validation descriptors']),
          },
        ],
      },
      {
        id: 'memory-performance',
        title: 'Memory & Performance',
        topics: [
          {
            id: makeId('expert', 'memory-performance', 'profiling-caching'),
            title: 'Profiling & Caching',
            subtopics: ['cProfile', 'timeit', 'line_profiler', 'lru_cache/cache'],
            ...placeholder('Profiling & Caching', ['Profile code with cProfile', 'Benchmark with timeit', 'Cache expensive calls with lru_cache', 'Identify and fix bottlenecks']),
          },
        ],
      },
      {
        id: 'advanced-async',
        title: 'Advanced Async',
        topics: [
          {
            id: makeId('expert', 'advanced-async', 'event-loop-tasks-futures'),
            title: 'Event Loop, Tasks & Futures',
            subtopics: ['asyncio event loop', 'Task creation', 'Future objects', 'Cancellation'],
            ...placeholder('Event Loop, Tasks & Futures', ['Control the event loop', 'Create and manage Tasks', 'Use Future for lower-level control', 'Cancel running tasks']),
          },
          {
            id: makeId('expert', 'advanced-async', 'aiohttp-async-db'),
            title: 'aiohttp & Async DB Clients',
            subtopics: ['aiohttp client', 'Async context managers', 'asyncpg/aiosqlite', 'Connection pooling'],
            ...placeholder('aiohttp & Async DB Clients', ['Make async HTTP requests', 'Query databases asynchronously', 'Use connection pools', 'Handle async errors']),
          },
        ],
      },
      {
        id: 'networking',
        title: 'Networking',
        topics: [
          {
            id: makeId('expert', 'networking', 'socket-programming'),
            title: 'Socket Programming',
            subtopics: ['TCP/UDP sockets', 'Server/client pattern', 'Non-blocking sockets', 'SSL/TLS'],
            ...placeholder('Socket Programming', ['Create TCP/UDP servers', 'Write socket clients', 'Use non-blocking I/O', 'Add SSL encryption']),
          },
          {
            id: makeId('expert', 'networking', 'rest-apis-requests-httpx'),
            title: 'REST APIs (requests & httpx)',
            subtopics: ['HTTP methods', 'Auth headers', 'Session management', 'Async with httpx'],
            ...placeholder('REST APIs with requests & httpx', ['Make GET/POST/PUT/DELETE requests', 'Handle authentication', 'Use sessions for efficiency', 'Make async requests with httpx']),
          },
        ],
      },
      {
        id: 'data-handling',
        title: 'Data Handling',
        topics: [
          {
            id: makeId('expert', 'data-handling', 'json-csv-xml-parsing'),
            title: 'JSON, CSV & XML Parsing',
            subtopics: ['json module', 'csv module', 'xml.etree.ElementTree', 'Data validation'],
            ...placeholder('JSON, CSV & XML Parsing', ['Parse and generate JSON', 'Read and write CSV files', 'Parse XML with ElementTree', 'Validate parsed data']),
          },
          {
            id: makeId('expert', 'data-handling', 'serialization-pickle'),
            title: 'Serialization (pickle)',
            subtopics: ['pickle protocol', 'pickle.dumps/loads', 'Security warning', 'marshal/shelve'],
            ...placeholder('Serialization with pickle', ['Serialize Python objects', 'Deserialize safely', 'Understand pickle security risks', 'Use shelve for persistence']),
          },
        ],
      },
      {
        id: 'databases',
        title: 'Database Interaction',
        topics: [
          {
            id: makeId('expert', 'databases', 'sqlite3'),
            title: 'sqlite3',
            subtopics: ['Connection & cursor', 'CRUD operations', 'Transactions', 'Row factories'],
            ...placeholder('sqlite3', ['Connect to SQLite databases', 'Execute CRUD operations', 'Use transactions', 'Map rows to objects']),
          },
          {
            id: makeId('expert', 'databases', 'orm-basics-sqlalchemy'),
            title: 'ORM Basics (SQLAlchemy)',
            subtopics: ['Declarative models', 'Session management', 'Querying', 'Relationships'],
            ...placeholder('ORM Basics with SQLAlchemy', ['Define models declaratively', 'Create and query records', 'Define relationships', 'Use sessions properly']),
          },
        ],
      },
      {
        id: 'packaging',
        title: 'Packaging & Distribution',
        topics: [
          {
            id: makeId('expert', 'packaging', 'setuptools-pypi'),
            title: 'setuptools & PyPI',
            subtopics: ['pyproject.toml', 'setup.cfg', 'Building distributions', 'Publishing to PyPI'],
            ...placeholder('setuptools & PyPI', ['Configure a package with pyproject.toml', 'Build source and wheel distributions', 'Upload to TestPyPI', 'Publish to PyPI']),
          },
        ],
      },
      {
        id: 'security',
        title: 'Security',
        topics: [
          {
            id: makeId('expert', 'security', 'hashlib-secure-coding'),
            title: 'hashlib & Secure Coding',
            subtopics: ['hashlib hashing', 'secrets module', 'OWASP basics', 'SQL injection prevention'],
            ...placeholder('hashlib & Secure Coding', ['Hash data with hashlib', 'Generate secure tokens', 'Prevent injection attacks', 'Follow secure coding practices']),
          },
        ],
      },
      {
        id: 'advanced-libraries',
        title: 'Advanced Libraries',
        topics: [
          {
            id: makeId('expert', 'advanced-libraries', 'pandas-numpy'),
            title: 'pandas & numpy',
            subtopics: ['numpy arrays', 'pandas DataFrames', 'Vectorized operations', 'Data cleaning'],
            ...placeholder('pandas & numpy', ['Create and manipulate arrays', 'Work with DataFrames', 'Use vectorized operations', 'Clean and transform data']),
          },
          {
            id: makeId('expert', 'advanced-libraries', 'matplotlib-seaborn'),
            title: 'matplotlib & seaborn',
            subtopics: ['Basic plots', 'Subplots', 'Statistical plots', 'Styling'],
            ...placeholder('matplotlib & seaborn', ['Create line, bar, scatter plots', 'Use subplots layout', 'Generate statistical visualizations', 'Style plots professionally']),
          },
          {
            id: makeId('expert', 'advanced-libraries', 'flask-django-fastapi'),
            title: 'Flask, Django & FastAPI',
            subtopics: ['Flask routing', 'Django MVT', 'FastAPI async endpoints', 'Choosing a framework'],
            ...placeholder('Flask, Django & FastAPI', ['Build REST endpoints with Flask', 'Understand Django MVT architecture', 'Write async APIs with FastAPI', 'Choose the right framework']),
          },
          {
            id: makeId('expert', 'advanced-libraries', 'scikit-learn-ml-basics'),
            title: 'scikit-learn & ML Basics',
            subtopics: ['Estimator API', 'Train/test split', 'Classification & regression', 'Model evaluation'],
            ...placeholder('scikit-learn & ML Basics', ['Use the scikit-learn Estimator API', 'Split data for training and testing', 'Train classifiers and regressors', 'Evaluate model performance']),
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MASTERY
  // ═══════════════════════════════════════════════════════════
  {
    id: 'mastery',
    level: 'mastery',
    title: 'Mastery',
    subtitle: 'Cutting Edge & Specialized',
    description: 'Push Python to its limits. Internals, distributed systems, AI/ML.',
    icon: '🌌',
    sections: [
      {
        id: 'cpython-internals',
        title: 'CPython Internals',
        topics: [
          {
            id: makeId('mastery', 'cpython-internals', 'bytecode-dis-module'),
            title: 'Bytecode & dis Module',
            subtopics: ['compile()/dis.dis()', 'Code objects', 'Stack machine', 'LOAD/STORE opcodes'],
            ...placeholder('Bytecode & dis Module', ['Inspect bytecode with dis', 'Understand code objects', 'Trace stack machine execution', 'Optimize for bytecode efficiency']),
          },
          {
            id: makeId('mastery', 'cpython-internals', 'gil'),
            title: 'The GIL (Global Interpreter Lock)',
            subtopics: ['GIL mechanics', 'Impact on threading', 'CPU-bound vs I/O-bound', 'Free-threaded Python 3.13+'],
            ...placeholder('The GIL', ['Understand why the GIL exists', 'Know when GIL matters', 'Work around GIL for CPU tasks', 'Learn about free-threaded Python']),
          },
          {
            id: makeId('mastery', 'cpython-internals', 'c-extensions'),
            title: 'C Extensions',
            subtopics: ['Python/C API', 'ctypes/cffi', 'Cython basics', 'Extension modules'],
            ...placeholder('C Extensions', ['Use ctypes to call C code', 'Write simple Cython extensions', 'Use the Python/C API', 'Profile C extension performance']),
          },
          {
            id: makeId('mastery', 'cpython-internals', 'jit-numba-pypy'),
            title: 'JIT: Numba & PyPy',
            subtopics: ['@numba.jit', 'PyPy runtime', 'JIT limitations', 'Benchmarking'],
            ...placeholder('JIT with Numba & PyPy', ['Accelerate with @numba.jit', 'Run code on PyPy', 'Benchmark JIT vs CPython', 'Know JIT limitations']),
          },
        ],
      },
      {
        id: 'distributed-computing',
        title: 'Distributed Computing',
        topics: [
          {
            id: makeId('mastery', 'distributed-computing', 'dask-ray-pyspark'),
            title: 'Dask, Ray & PySpark',
            subtopics: ['Dask DataFrames', 'Ray remote', 'PySpark RDDs', 'Choosing a framework'],
            ...placeholder('Dask, Ray & PySpark', ['Use Dask for parallel DataFrames', 'Distribute tasks with Ray', 'Process big data with PySpark', 'Choose the right framework']),
          },
        ],
      },
      {
        id: 'system-programming',
        title: 'Advanced System Programming',
        topics: [
          {
            id: makeId('mastery', 'system-programming', 'subprocess-os-shutil'),
            title: 'subprocess, os & shutil',
            subtopics: ['subprocess.run()', 'Popen for streaming', 'os.environ', 'shutil for files'],
            ...placeholder('subprocess, os & shutil', ['Run external commands', 'Capture process output', 'Manage environment variables', 'Copy and move files']),
          },
        ],
      },
      {
        id: 'realtime-applications',
        title: 'Real-Time Applications',
        topics: [
          {
            id: makeId('mastery', 'realtime-applications', 'websockets'),
            title: 'WebSockets',
            subtopics: ['websockets library', 'FastAPI WebSockets', 'Broadcast patterns', 'Heartbeat/ping'],
            ...placeholder('WebSockets', ['Build WebSocket servers', 'Handle bidirectional communication', 'Implement broadcast patterns', 'Manage connections']),
          },
          {
            id: makeId('mastery', 'realtime-applications', 'celery-rabbitmq-kafka'),
            title: 'Celery, RabbitMQ & Kafka',
            subtopics: ['Celery tasks', 'Broker setup', 'Kafka consumers', 'Dead letter queues'],
            ...placeholder('Celery, RabbitMQ & Kafka', ['Create Celery task queues', 'Configure message brokers', 'Consume Kafka topics', 'Handle failures with DLQ']),
          },
        ],
      },
      {
        id: 'ai-ml-specialization',
        title: 'AI/ML Specialization',
        topics: [
          {
            id: makeId('mastery', 'ai-ml-specialization', 'deep-learning-frameworks'),
            title: 'Deep Learning Frameworks',
            subtopics: ['PyTorch tensors', 'Neural network layers', 'Training loop', 'TensorFlow/Keras'],
            ...placeholder('Deep Learning Frameworks', ['Create tensors in PyTorch', 'Build neural network layers', 'Write a training loop', 'Use Keras for rapid prototyping']),
          },
          {
            id: makeId('mastery', 'ai-ml-specialization', 'model-optimization'),
            title: 'Model Optimization',
            subtopics: ['Quantization', 'Pruning', 'ONNX export', 'TorchScript'],
            ...placeholder('Model Optimization', ['Quantize models for deployment', 'Prune unnecessary weights', 'Export to ONNX format', 'Compile with TorchScript']),
          },
        ],
      },
      {
        id: 'cloud-deployment',
        title: 'Cloud & Deployment',
        topics: [
          {
            id: makeId('mastery', 'cloud-deployment', 'dockerizing-python'),
            title: 'Dockerizing Python Apps',
            subtopics: ['Dockerfile best practices', 'Multi-stage builds', 'docker-compose', 'Alpine images'],
            ...placeholder('Dockerizing Python Apps', ['Write optimized Dockerfiles', 'Use multi-stage builds', 'Orchestrate with docker-compose', 'Use slim base images']),
          },
          {
            id: makeId('mastery', 'cloud-deployment', 'aws-lambda-gcp-functions'),
            title: 'AWS Lambda & GCP Functions',
            subtopics: ['Lambda handler', 'Event sources', 'Cold starts', 'GCP Cloud Functions'],
            ...placeholder('AWS Lambda & GCP Functions', ['Write Lambda handler functions', 'Configure event triggers', 'Optimize cold start times', 'Deploy to GCP Functions']),
          },
          {
            id: makeId('mastery', 'cloud-deployment', 'cicd-with-python'),
            title: 'CI/CD with Python',
            subtopics: ['GitHub Actions', 'pytest in CI', 'Docker builds in CI', 'Automated deployment'],
            ...placeholder('CI/CD with Python', ['Set up GitHub Actions workflows', 'Run tests in CI pipelines', 'Build and push Docker images', 'Automate deployments']),
          },
        ],
      },
    ],
  },
];

// Merge ALL_LESSONS content into each topic by matching topic.id
// This replaces placeholder content with real lesson content where available
const enrichedCurriculum = rawCurriculum.map(level => ({
  ...level,
  sections: level.sections.map(section => ({
    ...section,
    topics: section.topics.map(topic => {
      const lessonData = ALL_LESSONS[topic.id];
      return lessonData ? { ...topic, ...lessonData } : topic;
    }),
  })),
}));

// Flatten all topics for search and navigation
export const allTopics = enrichedCurriculum.flatMap(level =>
  level.sections.flatMap(section =>
    section.topics.map(topic => ({
      ...topic,
      levelId: level.id,
      levelLabel: level.title,
      levelColor: LEVELS[level.level].color,
      sectionId: section.id,
      sectionTitle: section.title,
    }))
  )
);

export const curriculum = enrichedCurriculum;

export const getTopicById = id => allTopics.find(t => t.id === id);

export const getAdjacentTopics = (topicId) => {
  const idx = allTopics.findIndex(t => t.id === topicId);
  return {
    prev: idx > 0 ? allTopics[idx - 1] : null,
    next: idx < allTopics.length - 1 ? allTopics[idx + 1] : null,
  };
};

export const totalTopics = allTopics.length;
