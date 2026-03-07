// Full lesson content for all curriculum topics

export const LESSONS = {

  // ─────────────────────────────────────────────
  // BEGINNER
  // ─────────────────────────────────────────────

  'beginner-intro-to-python-installing-python-ides': {
    readTime: 8,
    whatYoullLearn: [
      'Install Python 3 on macOS, Windows, and Linux',
      'Set up VS Code with Python extensions',
      'Create and run your first Python script',
      'Understand the difference between the REPL and script files',
      'Install packages using pip',
    ],
    content: `
## Installing Python 3

Python 3 is the current, actively maintained version. Always use Python 3 — Python 2 reached end-of-life in 2020.

**macOS**: The cleanest way is via the official installer at python.org, or using Homebrew:

\`\`\`bash
# Using Homebrew (recommended for macOS)
brew install python@3.12

# Verify installation
python3 --version   # Python 3.12.x
pip3 --version      # pip 24.x
\`\`\`

**Windows**: Download the installer from python.org. During installation, **check "Add Python to PATH"** — this is critical. Then verify in Command Prompt:

\`\`\`bash
python --version    # Python 3.12.x
pip --version
\`\`\`

**Linux**: Python 3 is usually pre-installed. To install or upgrade:

\`\`\`bash
sudo apt update && sudo apt install python3 python3-pip  # Debian/Ubuntu
sudo dnf install python3 python3-pip                     # Fedora
\`\`\`

## Setting Up VS Code

VS Code is the most popular editor for Python development. After installing VS Code:

1. Open VS Code and press **Ctrl+Shift+X** (or Cmd+Shift+X on Mac)
2. Search for **"Python"** and install the extension by Microsoft
3. Search for **"Pylance"** and install it (advanced language server)
4. Open a \`.py\` file — VS Code will ask you to select a Python interpreter. Choose your Python 3 installation.

\`\`\`python
# Create a file called hello.py and write:
print("Hello, Python!")
print("Welcome to PyPath 🐍")

# Run it with the ▶ button in VS Code,
# or in the terminal:
# python3 hello.py
\`\`\`

## The Python REPL

The REPL (Read-Eval-Print Loop) is an interactive Python shell. Type \`python3\` in your terminal to enter it. It's great for quick experiments:

\`\`\`python
>>> 2 + 2
4
>>> name = "Python"
>>> f"Hello, {name}!"
'Hello, Python!'
>>> type(42)
<class 'int'>
>>> exit()   # or Ctrl+D to quit
\`\`\`

## Common Mistakes to Avoid

- **Python 2 vs 3 confusion**: If \`python\` runs Python 2 on your system, always use \`python3\` explicitly, or create an alias.
- **PATH not set on Windows**: If you get "python is not recognized", reinstall and check "Add to PATH".
- **Spaces in folder names**: Avoid installing Python in paths with spaces. It causes subtle issues with some tools.

## Try It Yourself

Install Python, open VS Code, create a file called \`hello.py\`, and write a script that prints:
1. Your name
2. The current Python version (hint: import the \`sys\` module and print \`sys.version\`)
3. "PyPath journey begins!"
`,
  },

  'beginner-intro-to-python-running-python-scripts': {
    readTime: 6,
    whatYoullLearn: [
      'Run Python scripts from the terminal',
      'Use the interactive REPL for quick experiments',
      'Pass command-line arguments to scripts',
      'Understand the __name__ == "__main__" guard',
      'Use shebang lines on Unix systems',
    ],
    content: `
## Running Scripts from the Terminal

A Python script is just a text file ending in \`.py\`. You run it by passing it to the \`python3\` command:

\`\`\`bash
# Create a file greet.py
python3 greet.py

# Pass arguments to your script
python3 greet.py Alice 30
\`\`\`

Inside your script, access arguments via the \`sys.argv\` list:

\`\`\`python
# greet.py
import sys

# sys.argv[0] is always the script name
# sys.argv[1], [2], ... are the arguments
if len(sys.argv) < 2:
    print("Usage: python3 greet.py <name>")
    sys.exit(1)

name = sys.argv[1]
print(f"Hello, {name}! Welcome to Python.")
\`\`\`

## Script Mode vs Module Mode

Python files can be both scripts (run directly) and modules (imported by other code). The \`__name__\` variable tells you which context you're in:

\`\`\`python
# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# This block ONLY runs when the file is executed directly,
# NOT when it's imported as a module
if __name__ == "__main__":
    print(f"2 + 3 = {add(2, 3)}")
    print(f"10 - 4 = {subtract(10, 4)}")
\`\`\`

\`\`\`bash
python3 calculator.py      # Prints results ✓
python3 -c "import calculator; print(calculator.add(5, 6))"  # 11, no extra output ✓
\`\`\`

## Shebang Lines (Unix/macOS)

A shebang line at the top of your script makes it directly executable on Unix systems:

\`\`\`python
#!/usr/bin/env python3
# The above line tells the shell which interpreter to use

print("This script is directly executable!")
\`\`\`

\`\`\`bash
chmod +x my_script.py    # make it executable
./my_script.py           # run without typing "python3"
\`\`\`

## Common Mistakes to Avoid

- **Wrong Python version**: On many systems, \`python\` is Python 2. Always use \`python3\` to be explicit.
- **Running from wrong directory**: If your script imports local modules, run it from the project root.
- **Forgetting \`__name__\` guard**: Without it, test code in your module runs when it's imported.

## Try It Yourself

Write a script \`args_demo.py\` that accepts any number of names as arguments and greets each one. If no arguments are given, print a usage message.

\`\`\`python
# Expected usage:
# python3 args_demo.py Alice Bob Charlie
# → Hello, Alice!
# → Hello, Bob!
# → Hello, Charlie!
\`\`\`
`,
  },

  'beginner-intro-to-python-python-syntax-comments-indentation': {
    readTime: 7,
    whatYoullLearn: [
      'Understand Python\'s indentation-as-structure rule',
      'Write single-line and multi-line comments',
      'Follow PEP 8 style conventions',
      'Use line continuation for long lines',
      'Avoid the most common syntax errors',
    ],
    content: `
## Indentation: Python\'s Structural Rule

In most languages, braces \`{}\` define code blocks. Python uses **indentation** instead — this is enforced by the interpreter, not just a style preference. Consistent indentation is mandatory.

\`\`\`python
# Correct: consistent 4-space indentation
def check_age(age):
    if age >= 18:
        print("Adult")
        if age >= 65:
            print("Senior")
    else:
        print("Minor")

# This causes IndentationError:
def broken():
    print("line 1")
  print("line 2")  # ← wrong indent level → ERROR
\`\`\`

The standard is **4 spaces per indent level**. Never mix tabs and spaces — Python 3 raises a \`TabError\` if you do.

## Comments

Comments explain your code's intent, not what it mechanically does. Python has two comment forms:

\`\`\`python
# Single-line comment: everything after # is ignored

x = 42  # Inline comment: after the code on the same line

# Multi-line comments use consecutive single-line comments:
# This function computes the nth Fibonacci number
# using an iterative approach for O(n) time complexity.
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

# Triple-quoted strings are NOT comments, but are used as docstrings:
def add(a, b):
    """Return the sum of a and b.
    
    Args:
        a: First number
        b: Second number
    
    Returns:
        The arithmetic sum a + b
    """
    return a + b
\`\`\`

## Line Continuation

Long lines can be split across multiple lines using a backslash \`\\\` or by wrapping in brackets:

\`\`\`python
# Backslash continuation (fragile — no space allowed after \\)
result = 1 + 2 + 3 + \
         4 + 5 + 6

# Bracket continuation (preferred — cleaner and safer)
result = (
    1 + 2 + 3 +
    4 + 5 + 6
)

# Multi-line function call
user = create_user(
    name="Alice",
    email="alice@example.com",
    role="admin",
    active=True,
)

# Multi-line import
from os.path import (
    join,
    dirname,
    abspath,
)
\`\`\`

## PEP 8 Key Rules

PEP 8 is Python's official style guide. The most important rules:

\`\`\`python
# ✓ snake_case for variables and functions
user_name = "Alice"
def calculate_total():
    pass

# ✓ PascalCase for classes
class UserAccount:
    pass

# ✓ SCREAMING_SNAKE_CASE for constants
MAX_RETRY_COUNT = 3
API_BASE_URL = "https://api.example.com"

# ✓ Two blank lines between top-level definitions
def function_one():
    pass


def function_two():
    pass

# ✓ Spaces around operators
x = 1 + 2        # ✓
x = 1+2          # ✗

# ✓ No space before colon in slices
items[1:3]       # ✓
items[1 : 3]     # ✗
\`\`\`

## Try It Yourself

Rewrite the following poorly-formatted code to be PEP 8 compliant:

\`\`\`python
def CALC(X,Y,operation):
 if operation=="add":
   return X+Y
 elif operation =="sub":
   return X-Y
 else:
  return None
\`\`\`
`,
  },

  'beginner-variables-data-types-strings-string-methods': {
    readTime: 11,
    whatYoullLearn: [
      'Create strings with single, double, and triple quotes',
      'Index and slice strings to extract substrings',
      'Use essential string methods: upper, lower, strip, split, join, replace',
      'Format strings with f-strings, .format(), and %',
      'Understand string immutability and its implications',
    ],
    content: `
## Creating Strings

Strings in Python are sequences of Unicode characters. They can be created with single quotes, double quotes, or triple quotes:

\`\`\`python
single = 'Hello'
double = "World"
both_work = "It's a great day"   # single quote inside double — no escaping needed
escaped = 'It\\'s fine too'       # escape with backslash

# Triple quotes for multi-line strings and docstrings
multiline = """
This spans
multiple lines
with actual newlines preserved.
"""

# Raw strings: backslashes are literal (great for regex and Windows paths)
path = r"C:\\Users\\Alice\\Documents"   # no need to double-escape
pattern = r"\\d{3}-\\d{4}"               # raw regex pattern
\`\`\`

## Indexing and Slicing

Strings are zero-indexed sequences. You can access individual characters or ranges:

\`\`\`python
s = "Python"
#    P y t h o n
#    0 1 2 3 4 5   (forward)
#   -6-5-4-3-2-1   (backward)

print(s[0])      # 'P'   — first character
print(s[-1])     # 'n'   — last character
print(s[2:5])    # 'tho' — slice [start:stop] (stop is exclusive)
print(s[:3])     # 'Pyt' — from start to index 3
print(s[3:])     # 'hon' — from index 3 to end
print(s[::-1])   # 'nohtyP' — reverse the string
print(s[::2])    # 'Pto' — every 2nd character
\`\`\`

## Essential String Methods

Strings have a rich method library. Since strings are **immutable**, every method returns a new string — the original is never modified:

\`\`\`python
text = "  Hello, World!  "

# Case methods
print(text.upper())         # "  HELLO, WORLD!  "
print(text.lower())         # "  hello, world!  "
print(text.title())         # "  Hello, World!  "
print(text.capitalize())    # "  hello, world!  " (only first char)
print(text.swapcase())      # "  hELLO, wORLD!  "

# Whitespace methods
print(text.strip())         # "Hello, World!"   (both sides)
print(text.lstrip())        # "Hello, World!  " (left only)
print(text.rstrip())        # "  Hello, World!" (right only)

# Search methods
print("World" in text)      # True
print(text.find("World"))   # 9 (index), or -1 if not found
print(text.count("l"))      # 3

# Modification methods
print(text.replace("World", "Python"))   # "  Hello, Python!  "
print("a,b,c".split(","))               # ['a', 'b', 'c']
print(",".join(["a", "b", "c"]))        # "a,b,c"

# Validation methods
print("42".isdigit())    # True
print("abc".isalpha())   # True
print("abc3".isalnum())  # True
print("  ".isspace())    # True
print("hello".startswith("he"))   # True
print("hello".endswith("lo"))     # True
\`\`\`

## String Formatting

Python has three string formatting systems. **f-strings are the preferred modern approach**:

\`\`\`python
name = "Alice"
score = 98.6
items = 3

# f-strings (Python 3.6+) — most readable
greeting = f"Hello, {name}! You scored {score:.1f}%"
# "Hello, Alice! You scored 98.6%"

# Format expressions directly in f-strings
print(f"2 + 2 = {2 + 2}")
print(f"{name.upper()!r}")          # repr: "'ALICE'"
print(f"{'center':^20}")            # center-aligned in 20 chars
print(f"{score:08.2f}")             # "00098.60"
print(f"{1_000_000:,}")             # "1,000,000" with commas

# .format() method (older but still common)
msg = "Hello, {}! You have {} items.".format(name, items)
msg2 = "Hello, {name}!".format(name="Bob")

# % formatting (oldest, avoid in new code)
msg3 = "Hello, %s! Score: %.1f" % (name, score)
\`\`\`

## Common Mistakes to Avoid

- **Strings are immutable**: \`s[0] = 'X'\` raises a \`TypeError\`. You must create a new string: \`s = 'X' + s[1:]\`.
- **Comparing with ==, not is**: Use \`s1 == s2\` to compare content. \`is\` compares identity (memory address).
- **Off-by-one in slices**: \`s[1:4]\` gives characters at indices 1, 2, 3 — NOT 4.
- **strip() doesn't modify in place**: \`s.strip()\` returns a new string. \`s = s.strip()\` is the correct pattern.

## Try It Yourself

Write a function \`title_case_sentence(s)\` that takes a string and returns it in title case, but leaves small words ("a", "an", "the", "in", "of", "and") lowercase unless they're the first word.

\`\`\`python
# Expected:
# title_case_sentence("the lord of the rings") → "The Lord of the Rings"
# title_case_sentence("a tale of two cities") → "A Tale of Two Cities"
\`\`\`
`,
  },

  'beginner-variables-data-types-booleans': {
    readTime: 6,
    whatYoullLearn: [
      'Use True and False in conditions and assignments',
      'Understand Python\'s truthiness rules for all data types',
      'Apply short-circuit evaluation with and/or',
      'Use bool() to explicitly convert values',
      'Avoid common boolean pitfalls',
    ],
    content: `
## True and False

Python's boolean type has exactly two values: \`True\` and \`False\` (capitalized). Booleans are actually a subclass of \`int\` — \`True == 1\` and \`False == 0\`.

\`\`\`python
# Boolean literals
is_active = True
is_deleted = False

# Booleans from comparisons
x = 10
print(x > 5)      # True
print(x == 5)     # False
print(x != 5)     # True
print(type(True)) # <class 'bool'>

# Booleans are ints under the hood
print(True + True)    # 2
print(True * 5)       # 5
print(False + 1)      # 1
print(int(True))      # 1
print(int(False))     # 0
\`\`\`

## Truthiness: Every Object Has a Boolean Value

Python evaluates any object in a boolean context (like an \`if\` statement). This is called **truthiness**:

\`\`\`python
# FALSY values — evaluate to False in boolean context:
bool(False)     # False
bool(None)      # False
bool(0)         # False  (int zero)
bool(0.0)       # False  (float zero)
bool("")        # False  (empty string)
bool([])        # False  (empty list)
bool(())        # False  (empty tuple)
bool({})        # False  (empty dict)
bool(set())     # False  (empty set)

# TRUTHY values — everything else:
bool(True)      # True
bool(1)         # True
bool(-1)        # True   (any non-zero number)
bool("a")       # True   (any non-empty string)
bool([0])       # True   (list with one item, even if that item is 0)
bool(" ")       # True   (a space is not empty!)

# Practical use: check if a container has items
items = [1, 2, 3]
if items:              # Pythonic ✓ — checks if list is non-empty
    print("Has items")

name = ""
if not name:           # Pythonic ✓ — checks if string is empty/falsy
    print("Name is missing")
\`\`\`

## Short-Circuit Evaluation

\`and\` and \`or\` don't just return \`True\`/\`False\` — they return one of their operands, evaluated lazily:

\`\`\`python
# 'and' returns the first falsy value, or the last value if all truthy
print(1 and 2)         # 2     (1 is truthy, so evaluate 2)
print(0 and 2)         # 0     (0 is falsy, stop here)
print("" and "hello")  # ""    (empty string is falsy)
print("a" and "b")     # "b"   (both truthy, return last)

# 'or' returns the first truthy value, or the last value if all falsy
print(0 or 5)          # 5     (0 is falsy, try 5)
print(3 or 5)          # 3     (3 is truthy, stop here)
print("" or "default") # "default"
print(None or 0 or "")  # ""   (all falsy, return last)

# Practical: default values (common Python idiom)
def greet(name=None):
    display_name = name or "Guest"   # use "Guest" if name is falsy
    print(f"Hello, {display_name}!")

greet("Alice")  # Hello, Alice!
greet()         # Hello, Guest!
greet("")       # Hello, Guest!  ← careful: empty string also triggers default

# Better: explicit None check when empty string is valid
def greet_v2(name=None):
    display_name = name if name is not None else "Guest"
    print(f"Hello, {display_name}!")
\`\`\`

## Common Mistakes to Avoid

- **Comparing booleans with ==**: Write \`if is_active:\` not \`if is_active == True:\`
- **Empty list vs None**: \`[]\` and \`None\` are both falsy but mean different things. Check explicitly when it matters: \`if x is None:\`
- **The is trap**: Never use \`is True\` or \`is False\` — use \`==\` or just the value itself.

## Try It Yourself

\`\`\`python
# What does each of these print? Work it out before running:
print(bool("False"))     # ?
print(bool([False]))     # ?
print(0 or [] or "hi")  # ?
print(1 and 2 and 3)    # ?
print(None or 0 or [])  # ?
\`\`\`
`,
  },

  'beginner-variables-data-types-type-casting': {
    readTime: 7,
    whatYoullLearn: [
      'Convert between int, float, str, and bool using built-in functions',
      'Understand the difference between implicit and explicit conversion',
      'Handle ValueError when conversions fail',
      'Use int() truncation vs round() for floats',
      'Write safe type conversion with error handling',
    ],
    content: `
## Explicit Type Conversion

Python doesn't implicitly convert between types (e.g., you can't add a string and a number). You must explicitly convert using built-in functions:

\`\`\`python
# str → int
age = int("25")           # 25
hex_val = int("ff", 16)   # 255 (base 16)
bin_val = int("1010", 2)  # 10  (base 2)

# str → float
price = float("9.99")     # 9.99
sci = float("1.5e3")      # 1500.0

# number → str
label = str(42)           # "42"
label2 = str(3.14)        # "3.14"

# int → float and back
x = float(7)              # 7.0
y = int(7.9)              # 7 — truncates (does NOT round!)
z = round(7.9)            # 8 — use round() for rounding
z2 = round(7.567, 2)      # 7.57 — round to 2 decimal places

# Any → bool
bool(0)         # False
bool("")        # False
bool(None)      # False
bool(42)        # True
bool("hello")   # True
\`\`\`

## What int() Truncates (Not Rounds)

This is a common source of bugs. \`int()\` always removes the decimal part toward zero:

\`\`\`python
int(9.9)    # 9   — not 10!
int(9.1)    # 9
int(-9.9)   # -9  — toward zero, not -10
int(-9.1)   # -9

# Use math.floor/ceil for floor/ceiling division
import math
math.floor(9.9)   # 9   — round toward -infinity
math.ceil(9.1)    # 10  — round toward +infinity
math.floor(-9.9)  # -10 — toward -infinity

# round() uses banker's rounding (round half to even):
round(0.5)  # 0  ← rounds to even!
round(1.5)  # 2  ← rounds to even!
round(2.5)  # 2  ← rounds to even!
\`\`\`

## Handling Conversion Errors

Conversions can fail if the input isn't a valid number. Always handle \`ValueError\`:

\`\`\`python
# Bad: will crash on invalid input
user_input = "not a number"
number = int(user_input)   # ValueError: invalid literal for int()

# Good: handle the error
def safe_int(value, default=0):
    """Convert value to int, returning default if conversion fails."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

print(safe_int("42"))      # 42
print(safe_int("3.7"))     # 0 — int() can't parse floats from strings
print(safe_int("abc"))     # 0
print(safe_int(None))      # 0

# For floats in strings, convert to float first:
def safe_number(value, default=0):
    try:
        return int(float(value))  # handles "3.7" → 3
    except (ValueError, TypeError):
        return default

print(safe_number("3.7"))   # 3
\`\`\`

## Type Checking

Use \`type()\` for exact type and \`isinstance()\` for flexible type checking:

\`\`\`python
x = 42
print(type(x))              # <class 'int'>
print(type(x) == int)       # True
print(isinstance(x, int))   # True
print(isinstance(x, (int, float)))  # True — accepts a tuple of types

# isinstance is preferred over type() because it respects inheritance
class MyInt(int):
    pass

y = MyInt(5)
print(type(y) == int)       # False — MyInt is not exactly int
print(isinstance(y, int))   # True  — MyInt IS-A int ✓
\`\`\`

## Common Mistakes to Avoid

- **int("3.7")**: Raises \`ValueError\`. Convert to float first: \`int(float("3.7"))\`.
- **Assuming round() rounds up at 0.5**: Python uses banker's rounding — 0.5 rounds to the nearest even number.
- **Using == to compare types**: Prefer \`isinstance()\` which handles inheritance correctly.

## Try It Yourself

Write a function \`parse_measurement(s)\` that accepts strings like \`"5"\`, \`"3.14"\`, \`"7 kg"\`, or \`"abc"\` and returns a float if possible, or 0.0 if not. Strip units by splitting on spaces.

\`\`\`python
parse_measurement("42")     # → 42.0
parse_measurement("3.14")   # → 3.14
parse_measurement("7 kg")   # → 7.0
parse_measurement("abc")    # → 0.0
\`\`\`
`,
  },

  'beginner-operators-arithmetic-comparison-logical': {
    readTime: 8,
    whatYoullLearn: [
      'Use all arithmetic operators including floor division and modulo',
      'Compare values with comparison operators',
      'Combine conditions with and, or, not',
      'Understand operator precedence',
      'Chain comparisons the Pythonic way',
    ],
    content: `
## Arithmetic Operators

Python provides seven arithmetic operators. Two are unique to Python's style:

\`\`\`python
a, b = 17, 5

print(a + b)    # 22   — addition
print(a - b)    # 12   — subtraction
print(a * b)    # 85   — multiplication
print(a / b)    # 3.4  — true division (always returns float in Python 3)
print(a // b)   # 3    — floor division (rounds DOWN, returns int)
print(a % b)    # 2    — modulo (remainder)
print(a ** b)   # 1419857 — exponentiation (a to the power b)

# Floor division rounds toward -infinity, not toward zero:
print(7 // 2)    # 3
print(-7 // 2)   # -4  (not -3!)

# Modulo keeps the sign of the divisor:
print(7 % 3)     # 1
print(-7 % 3)    # 2   (not -1!)

# Useful modulo patterns:
print(10 % 2 == 0)   # True  — check even
print(15 % 3 == 0)   # True  — check divisible by 3
hour = 25 % 24        # 1     — wrap around clock
\`\`\`

## Comparison Operators

Comparisons return \`True\` or \`False\`. Python lets you **chain** them like in mathematics:

\`\`\`python
x = 10

print(x == 10)    # True  — equals
print(x != 5)     # True  — not equals
print(x > 5)      # True  — greater than
print(x < 5)      # False — less than
print(x >= 10)    # True  — greater than or equal
print(x <= 10)    # True  — less than or equal

# Chained comparisons — unique and elegant in Python:
age = 25
print(18 <= age < 65)    # True  (adult working age)
# Equivalent to: (18 <= age) and (age < 65)

score = 85
grade = "B" if 80 <= score < 90 else "other"
print(grade)  # "B"

# Comparing strings (lexicographic order):
print("apple" < "banana")   # True
print("Z" < "a")            # True (uppercase < lowercase in ASCII)
\`\`\`

## Logical Operators

\`and\`, \`or\`, \`not\` combine boolean expressions:

\`\`\`python
age = 22
has_id = True
is_vip = False

# and: True only if BOTH are True
print(age >= 18 and has_id)        # True
print(age >= 18 and not has_id)    # False

# or: True if EITHER is True
print(age < 18 or is_vip)         # False
print(age >= 18 or is_vip)        # True

# not: inverts the boolean value
print(not True)      # False
print(not False)     # True
print(not is_vip)    # True

# Complex conditions
can_enter = age >= 18 and has_id
gets_discount = age < 25 or is_vip
print(f"Can enter: {can_enter}, Gets discount: {gets_discount}")
\`\`\`

## Operator Precedence

When multiple operators appear in one expression, Python follows precedence rules (PEMDAS-like):

\`\`\`python
# Highest to lowest precedence (partial list):
# ** (exponentiation)
# +x, -x, ~x (unary)
# *, /, //, %
# +, -
# comparisons (==, !=, <, >, <=, >=)
# not
# and
# or

print(2 + 3 * 4)       # 14  (not 20) — * before +
print((2 + 3) * 4)     # 20  — parentheses override
print(2 ** 3 ** 2)     # 512 — ** is right-associative: 2**(3**2) = 2**9
print(not True or True)  # True — not before or: (not True) or True

# When in doubt, use parentheses for clarity:
result = (a > 0) and (b > 0) or (c == 0)
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Without running, what does each line print?
print(10 // 3)
print(-10 // 3)
print(10 % 3)
print(2 ** 10)
print(1 + 2 == 3 and 4 > 3)

# 2. Write a one-liner that checks if n is between 1 and 100 inclusive
#    using chained comparisons.
n = 42
# your code here
\`\`\`
`,
  },

  'beginner-operators-assignment-operators': {
    readTime: 5,
    whatYoullLearn: [
      'Use augmented assignment operators (+=, -=, *=, etc.)',
      'Understand the walrus operator := for assignment expressions',
      'Assign multiple variables in one line',
      'Swap variables without a temporary variable',
    ],
    content: `
## Augmented Assignment Operators

These operators combine an operation and assignment into one step. They modify the variable in-place (for immutable types, they create a new object and rebind the name):

\`\`\`python
x = 10

x += 5     # x = x + 5  → 15
x -= 3     # x = x - 3  → 12
x *= 2     # x = x * 2  → 24
x /= 4     # x = x / 4  → 6.0  (note: becomes float)
x //= 2    # x = x // 2 → 3.0
x **= 3    # x = x ** 3 → 27.0
x %= 5     # x = x % 5  → 2.0

# Also works for strings and lists:
name = "Py"
name += "thon"    # "Python"

items = [1, 2]
items += [3, 4]   # [1, 2, 3, 4] — same as items.extend([3, 4])
\`\`\`

## Multiple Assignment

Python allows several convenient multi-assignment forms:

\`\`\`python
# Assign the same value to multiple variables
a = b = c = 0
print(a, b, c)    # 0 0 0

# Tuple unpacking — assign multiple variables at once
x, y, z = 1, 2, 3
print(x, y, z)    # 1 2 3

# Swap without a temp variable (Python's elegant idiom)
a, b = 10, 20
a, b = b, a       # swap!
print(a, b)       # 20 10

# Extended unpacking with * to capture remaining items
first, *rest = [1, 2, 3, 4, 5]
print(first)   # 1
print(rest)    # [2, 3, 4, 5]

*head, last = [1, 2, 3, 4, 5]
print(head)   # [1, 2, 3, 4]
print(last)   # 5

a, *middle, z = [1, 2, 3, 4, 5]
print(middle)  # [2, 3, 4]
\`\`\`

## The Walrus Operator :=

Python 3.8 introduced the **assignment expression** (walrus operator), which assigns AND returns a value in one step. It's useful to avoid calling a function twice:

\`\`\`python
import re

# Without walrus: call match() twice
data = "Hello, World!"
if re.search(r"World", data):
    m = re.search(r"World", data)
    print(m.group())

# With walrus: assign and test in one expression
if m := re.search(r"World", data):
    print(m.group())   # "World"

# Very useful in while loops to process chunks
data = b"some binary data stream"
chunk_size = 4

# Reading in chunks without walrus:
chunk = data[:chunk_size]
while chunk:
    print(chunk)
    data = data[chunk_size:]
    chunk = data[:chunk_size]

# Cleaner with walrus (common in real code):
numbers = [1, 4, 9, 16, 25, 36]
if any((found := n) > 20 for n in numbers):
    print(f"First number > 20: {found}")   # 25
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Use augmented assignment to build a running total
prices = [9.99, 14.50, 3.25, 22.00, 5.75]
total = 0
# Add each price to total using +=
# Then print the total

# 2. Use tuple unpacking to swap the first and last elements of a list
items = [1, 2, 3, 4, 5]
items[0], items[-1] = items[-1], items[0]
print(items)  # [5, 2, 3, 4, 1]
\`\`\`
`,
  },

  'beginner-operators-identity-membership-operators': {
    readTime: 6,
    whatYoullLearn: [
      'Distinguish == (equality) from is (identity)',
      'Use is and is not to test for None',
      'Check membership with in and not in',
      'Understand Python\'s object interning',
      'Avoid the "is vs ==" bug in production code',
    ],
    content: `
## Identity Operators: is and is not

\`==\` checks if two objects have the **same value**. \`is\` checks if they are the **exact same object** in memory (same \`id()\`):

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]   # same value, different object
c = a            # c points to the SAME object as a

print(a == b)    # True  — same value
print(a is b)    # False — different objects in memory
print(a is c)    # True  — same object
print(id(a), id(b), id(c))  # a and c share an id; b differs

# Mutating c also mutates a (they're the same object!)
c.append(4)
print(a)   # [1, 2, 3, 4]  ← a changed because c is a!
\`\`\`

## The Only Correct Use of \`is\`: None Checks

In production code, \`is\` is almost exclusively used to compare with \`None\`, \`True\`, and \`False\`:

\`\`\`python
result = None

# CORRECT way to check for None:
if result is None:
    print("No result yet")

if result is not None:
    print(f"Got: {result}")

# WRONG — works by accident due to interning, but unreliable:
if result == None:   # ← avoid this
    pass
\`\`\`

## Python Interning (Why \`is\` Sometimes Works with Strings/Ints)

Python caches ("interns") small integers (-5 to 256) and some strings for performance. This makes \`is\` appear to work, but **never rely on it**:

\`\`\`python
# Small integers are interned — same object:
x = 256
y = 256
print(x is y)    # True  (implementation detail!)

x = 257
y = 257
print(x is y)    # False (may vary by Python implementation)

# Strings: interned when they look like identifiers
s1 = "hello"
s2 = "hello"
print(s1 is s2)   # Usually True (but implementation-dependent!)

s1 = "hello world"  # spaces — might not be interned
s2 = "hello world"
print(s1 is s2)   # Undefined behavior — don't rely on this

# Always use == for value comparison:
print(s1 == s2)   # True ✓ — always correct
\`\`\`

## Membership Operators: in and not in

Test whether a value exists inside a container:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)       # True
print("mango" not in fruits)   # True

# Works with strings (substring check)
sentence = "The quick brown fox"
print("quick" in sentence)     # True
print("slow" not in sentence)  # True

# Works with dicts (checks keys, not values):
config = {"host": "localhost", "port": 8080}
print("host" in config)         # True
print("localhost" in config)    # False — checking keys, not values!
print("localhost" in config.values())  # True ✓

# Works with sets (O(1) lookup — very fast):
primes = {2, 3, 5, 7, 11, 13}
print(7 in primes)     # True
print(10 not in primes) # True

# Performance: list vs set for membership testing
big_list = list(range(1_000_000))
big_set = set(range(1_000_000))
# 999_999 in big_list → scans the whole list O(n)
# 999_999 in big_set  → hash lookup O(1)
\`\`\`

## Try It Yourself

\`\`\`python
# What prints? Figure it out before running.
x = [1, 2, 3]
y = x
y += [4]         # Note: += on a list mutates in place
print(x)         # ?
print(x is y)    # ?

a = (1, 2, 3)
b = a
b += (4,)        # Note: += on a tuple creates a NEW tuple
print(a)         # ?
print(a is b)    # ?
\`\`\`
`,
  },

  'beginner-input-output-input-print-formatting': {
    readTime: 7,
    whatYoullLearn: [
      'Read user input with input() and handle type conversion',
      'Use print() with sep, end, and file parameters',
      'Format output precisely with f-strings',
      'Align and pad output with format specifiers',
      'Build a simple interactive console program',
    ],
    content: `
## Reading Input with input()

\`input()\` pauses execution, displays a prompt, reads a line from stdin, and returns it as a **string**. Always convert it to the expected type:

\`\`\`python
# Basic input — always returns a string
name = input("What's your name? ")
print(f"Hello, {name}!")

# Convert to number
age_str = input("Your age: ")
age = int(age_str)       # raises ValueError if not numeric

# Safer pattern with error handling
while True:
    try:
        age = int(input("Enter your age: "))
        break    # exit loop if conversion succeeded
    except ValueError:
        print("Please enter a valid number.")

# Multiple values on one line
x, y = input("Enter two numbers separated by space: ").split()
x, y = int(x), int(y)
print(f"{x} + {y} = {x + y}")

# Or use map() for cleaner multi-value input:
a, b, c = map(int, input("Enter three integers: ").split())
\`\`\`

## print() Options

\`print()\` has useful keyword arguments for controlling output format:

\`\`\`python
# Default: space separator, newline at end
print("Hello", "World")           # Hello World

# Custom separator
print("Hello", "World", sep=", ") # Hello, World
print(1, 2, 3, sep=" → ")         # 1 → 2 → 3
print("a", "b", "c", sep="")      # abc

# Custom end (default is \\n)
print("Loading", end="")          # no newline
print("...", end=" ")
print("Done!")                    # Loading... Done!

# Print multiple items:
for i in range(5):
    print(i, end=" ")   # 0 1 2 3 4
print()                 # newline at the end

# Write to stderr
import sys
print("Error message", file=sys.stderr)
\`\`\`

## f-string Format Specifiers

F-strings support powerful format specifications using \`{value:spec}\`:

\`\`\`python
pi = 3.14159265358979
big = 1_234_567.89
name = "Python"
n = 42

# Number formatting
print(f"{pi:.2f}")          # "3.14"       (2 decimal places)
print(f"{pi:.5f}")          # "3.14159"    (5 decimal places)
print(f"{big:,.2f}")        # "1,234,567.89" (comma separator)
print(f"{n:08d}")           # "00000042"   (zero-padded to width 8)
print(f"{n:+d}")            # "+42"        (force sign)
print(f"{0.5:.1%}")         # "50.0%"      (as percentage)
print(f"{255:#x}")          # "0xff"       (hex with prefix)
print(f"{255:#010x}")       # "0x000000ff" (padded hex)
print(f"{big:.2e}")         # "1.23e+06"   (scientific notation)

# String alignment
print(f"{'left':<10}|")     # "left      |" (left-align in 10 chars)
print(f"{'right':>10}|")    # "     right|" (right-align)
print(f"{'center':^10}|")   # "  center  |" (center)
print(f"{'fill':*^10}|")    # "**fill****|" (center, filled with *)

# Formatting a table
headers = ["Name", "Score", "Grade"]
data = [("Alice", 95.5, "A"), ("Bob", 82.0, "B"), ("Carol", 78.3, "C")]

print(f"{'Name':<10} {'Score':>7} {'Grade':^5}")
print("-" * 26)
for name, score, grade in data:
    print(f"{name:<10} {score:>7.1f} {grade:^5}")
\`\`\`

## Try It Yourself

Build a simple tip calculator:

\`\`\`python
# 1. Ask for bill amount (float)
# 2. Ask for tip percentage (int: 10, 15, or 20)
# 3. Calculate and print a nicely formatted receipt:
#
#    Bill:      $45.50
#    Tip (15%): $ 6.83
#    Total:     $52.33
\`\`\`
`,
  },

  'beginner-conditionals-if-elif-else': {
    readTime: 8,
    whatYoullLearn: [
      'Write if, elif, and else branches',
      'Nest conditional statements appropriately',
      'Use the ternary (conditional) expression',
      'Handle multiple conditions with and/or',
      'Use match-case (Python 3.10+) for structural pattern matching',
    ],
    content: `
## The if Statement

The \`if\` statement is Python's core decision-making tool. The body executes only when the condition is truthy:

\`\`\`python
temperature = 28

if temperature > 30:
    print("It's hot outside!")
    print("Wear sunscreen.")
\`\`\`

## if-elif-else Chains

Use \`elif\` for multiple mutually-exclusive conditions. Python evaluates from top to bottom and executes the **first** matching branch:

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"    # This runs — score is 85
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")   # Grade: B

# Important: once a branch matches, the rest are skipped
# The order of elif matters!
x = 15
if x > 10:
    print("Over 10")    # This prints
elif x > 5:
    print("Over 5")     # This is NEVER reached (x > 10 already matched)
\`\`\`

## Nested Conditionals

You can nest \`if\` statements inside each other. However, avoid deep nesting — it makes code hard to read. Prefer early returns or combined conditions:

\`\`\`python
# Nested (works but gets messy quickly)
age = 25
has_license = True
has_insurance = True

if age >= 18:
    if has_license:
        if has_insurance:
            print("You can drive.")
        else:
            print("Get insurance first.")
    else:
        print("Get your license first.")
else:
    print("Too young to drive.")

# Better: combine conditions or use early exit
def can_drive(age, has_license, has_insurance):
    if age < 18:
        return "Too young to drive."
    if not has_license:
        return "Get your license first."
    if not has_insurance:
        return "Get insurance first."
    return "You can drive."

print(can_drive(25, True, True))
\`\`\`

## The Ternary Expression

Python's one-line conditional expression: \`value_if_true if condition else value_if_false\`

\`\`\`python
age = 20
label = "Adult" if age >= 18 else "Minor"
print(label)   # "Adult"

# Use in expressions
numbers = [1, -2, 3, -4, 5]
absolute = [n if n >= 0 else -n for n in numbers]
print(absolute)   # [1, 2, 3, 4, 5]

# Don't nest ternaries — hard to read
# x = a if cond1 else b if cond2 else c  ← avoid
\`\`\`

## match-case (Python 3.10+)

The \`match\` statement provides structural pattern matching — more powerful than a chain of \`elif\`:

\`\`\`python
command = "quit"

match command:
    case "quit" | "exit" | "q":
        print("Goodbye!")
    case "help":
        print("Available: quit, help, status")
    case "status":
        print("System running normally.")
    case _:           # wildcard — matches anything
        print(f"Unknown command: {command!r}")

# Match on structure (powerful for data):
point = (0, 5)
match point:
    case (0, 0):
        print("Origin")
    case (x, 0):
        print(f"On x-axis at {x}")
    case (0, y):
        print(f"On y-axis at {y}")
    case (x, y):
        print(f"Point at ({x}, {y})")
\`\`\`

## Try It Yourself

Write a function \`bmi_category(weight_kg, height_m)\` that calculates BMI and returns the category:
- Under 18.5 → "Underweight"
- 18.5–24.9 → "Normal weight"
- 25–29.9 → "Overweight"
- 30 or above → "Obese"

\`\`\`python
def bmi_category(weight_kg, height_m):
    bmi = weight_kg / (height_m ** 2)
    # your if-elif-else here
    pass
\`\`\`
`,
  },

  'beginner-loops-for-loop': {
    readTime: 9,
    whatYoullLearn: [
      'Iterate over lists, strings, tuples, and other iterables with for',
      'Use range() to generate numeric sequences',
      'Access both index and value using enumerate()',
      'Iterate multiple sequences in parallel with zip()',
      'Use the loop else clause',
    ],
    content: `
## The for Loop

Python's \`for\` loop iterates over any **iterable** — lists, strings, tuples, dictionaries, files, and more. It doesn't use an index counter by default:

\`\`\`python
# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
# apple
# banana
# cherry

# Iterate over a string (character by character)
for char in "Python":
    print(char, end=" ")   # P y t h o n

# Iterate over a dictionary
config = {"host": "localhost", "port": 8080, "debug": True}
for key in config:           # iterates over keys
    print(f"{key}: {config[key]}")

for key, value in config.items():   # unpack key-value pairs
    print(f"{key} = {value}")

for value in config.values():       # just values
    print(value)
\`\`\`

## range() for Numeric Iteration

\`range()\` generates a sequence of integers lazily (doesn't create a list in memory):

\`\`\`python
# range(stop)
for i in range(5):
    print(i, end=" ")   # 0 1 2 3 4

# range(start, stop)
for i in range(2, 7):
    print(i, end=" ")   # 2 3 4 5 6

# range(start, stop, step)
for i in range(0, 20, 5):
    print(i, end=" ")   # 0 5 10 15

# Count down with negative step
for i in range(10, 0, -1):
    print(i, end=" ")   # 10 9 8 7 6 5 4 3 2 1

# Sum of first 100 integers
total = sum(range(1, 101))   # 5050

# List of squares
squares = [x**2 for x in range(1, 6)]   # [1, 4, 9, 16, 25]
\`\`\`

## enumerate() — Index + Value

When you need the index AND value, use \`enumerate()\` instead of \`range(len(...))\`:

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# ✗ Unpythonic — using range(len(...))
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# ✓ Pythonic — use enumerate()
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# Start index at 1 instead of 0
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
# 1. apple
# 2. banana
# 3. cherry
\`\`\`

## zip() — Parallel Iteration

\`zip()\` lets you iterate over multiple sequences at once:

\`\`\`python
names = ["Alice", "Bob", "Carol"]
scores = [95, 82, 78]
grades = ["A", "B", "C"]

# Pair them up
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Three or more sequences
for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score} ({grade})")

# zip stops at the shortest — use zip_longest for unequal lengths
from itertools import zip_longest
a = [1, 2, 3]
b = ["a", "b"]
for x, y in zip_longest(a, b, fillvalue=None):
    print(x, y)   # 3, None at the end

# Build a dict from two lists
name_to_score = dict(zip(names, scores))
print(name_to_score)  # {'Alice': 95, 'Bob': 82, 'Carol': 78}
\`\`\`

## The loop else Clause

A \`for\` loop can have an \`else\` clause that runs **only if the loop completed without a \`break\`**:

\`\`\`python
def find_prime(numbers):
    for n in numbers:
        if n > 1:
            for i in range(2, n):
                if n % i == 0:
                    break    # n is not prime
            else:
                # Loop completed without break — n IS prime
                return n
    return None

print(find_prime([4, 6, 9, 11, 15]))   # 11
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Use zip() and enumerate() together to print a numbered table
#    of name, score pairs from these lists:
names = ["Diana", "Eve", "Frank"]
scores = [88, 91, 76]
# Expected:
# 1. Diana  → 88
# 2. Eve    → 91
# 3. Frank  → 76

# 2. Find the first number in range(2, 50) that is divisible by both 3 and 7
#    using a for-else pattern.
\`\`\`
`,
  },

  'beginner-loops-while-loop': {
    readTime: 7,
    whatYoullLearn: [
      'Write while loops with a condition',
      'Implement infinite loops with a break exit strategy',
      'Avoid infinite loops with correct variable updates',
      'Use while for input validation and retry patterns',
      'Understand the while-else clause',
    ],
    content: `
## The while Loop

A \`while\` loop repeats its body as long as a condition remains truthy. Unlike \`for\`, it doesn't iterate over a sequence — it runs until told to stop:

\`\`\`python
count = 0
while count < 5:
    print(count, end=" ")
    count += 1   # ← CRITICAL: must update the variable!
# 0 1 2 3 4

# Countdown
n = 10
while n > 0:
    print(n, end=" ")
    n -= 1
print("Blast off!")
\`\`\`

## The Classic Infinite Loop Pattern

A \`while True:\` loop runs forever until a \`break\` statement exits it. This is the standard pattern for menus and interactive programs:

\`\`\`python
# Interactive menu
while True:
    print("\\n1. Greet  2. Add  3. Quit")
    choice = input("Enter choice: ").strip()
    
    if choice == "1":
        name = input("Your name: ")
        print(f"Hello, {name}!")
    elif choice == "2":
        a = float(input("First number: "))
        b = float(input("Second number: "))
        print(f"{a} + {b} = {a + b}")
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Invalid choice, try again.")
\`\`\`

## Input Validation Pattern

\`while\` loops are perfect for retrying until the user provides valid input:

\`\`\`python
def get_positive_int(prompt):
    """Keep asking until the user enters a positive integer."""
    while True:
        try:
            value = int(input(prompt))
            if value > 0:
                return value
            print("Please enter a positive number.")
        except ValueError:
            print("That's not a valid integer. Try again.")

age = get_positive_int("Enter your age: ")
print(f"You are {age} years old.")
\`\`\`

## Avoiding Infinite Loops

The most common \`while\` bug is forgetting to update the loop variable:

\`\`\`python
# INFINITE LOOP — i never changes!
i = 0
while i < 5:
    print(i)
    # forgot: i += 1    ← loop runs forever

# Also watch out for off-by-one:
n = 5
while n > 0:
    print(n)
    n -= 1    # correctly decrements

# Implement a do-while equivalent (run body at least once):
while True:
    password = input("Enter password: ")
    if len(password) >= 8:
        break
    print("Password too short (minimum 8 characters).")
\`\`\`

## while-else

Like \`for\`, a \`while\` loop can have an \`else\` clause that runs only if the condition became False (not if you \`break\`):

\`\`\`python
def find_divisor(n, start=2):
    """Return a divisor of n, or None if n is prime."""
    divisor = start
    while divisor * divisor <= n:
        if n % divisor == 0:
            return divisor
        divisor += 1
    else:
        # Condition became False → no divisor found → n is prime
        return None

print(find_divisor(17))   # None (prime)
print(find_divisor(18))   # 2
\`\`\`

## Try It Yourself

\`\`\`python
# Implement a number-guessing game:
# 1. Pick a secret number between 1 and 100
# 2. Give the user unlimited guesses
# 3. Say "Too high" or "Too low" after each guess
# 4. Congratulate and show the number of guesses on success

import random
secret = random.randint(1, 100)
attempts = 0
# your while loop here
\`\`\`
`,
  },

  'beginner-loops-break-continue-pass': {
    readTime: 6,
    whatYoullLearn: [
      'Exit a loop early with break',
      'Skip the current iteration with continue',
      'Use pass as a placeholder in empty blocks',
      'Understand nested loop behavior with break',
      'Use the loop-else clause with break',
    ],
    content: `
## break — Exit Early

\`break\` immediately exits the innermost loop. Execution continues at the statement after the loop:

\`\`\`python
# Find the first negative number in a list
numbers = [3, 7, -2, 5, -8, 1]
for n in numbers:
    if n < 0:
        print(f"Found negative: {n}")
        break     # stop immediately, don't keep searching
else:
    print("No negatives found")   # runs only if no break occurred

# break in while:
target = 42
guess = 0
while True:
    guess += 1
    if guess == target:
        print(f"Found {target} after {guess} iterations!")
        break
\`\`\`

## continue — Skip to Next Iteration

\`continue\` skips the rest of the current iteration and jumps to the next one:

\`\`\`python
# Print only even numbers
for i in range(10):
    if i % 2 != 0:
        continue   # skip odd numbers
    print(i, end=" ")   # 0 2 4 6 8

# Filter and process: skip invalid entries
data = ["Alice", "", "Bob", None, "Carol", ""]
for entry in data:
    if not entry:          # skip empty/None
        continue
    print(entry.upper())  # process valid entries

# Compute sum, ignoring non-numeric values
mixed = [1, "a", 2, "b", 3, None, 4]
total = 0
for item in mixed:
    if not isinstance(item, (int, float)):
        continue
    total += item
print(f"Sum: {total}")   # 10
\`\`\`

## pass — Do Nothing Placeholder

\`pass\` is a no-op statement. Python requires at least one statement in a block — \`pass\` fills that requirement without doing anything:

\`\`\`python
# Placeholder for a function you'll implement later
def future_feature():
    pass   # TODO: implement this

# Empty class definition
class AbstractBase:
    pass

# Ignore specific exceptions
try:
    risky_operation()
except KeyboardInterrupt:
    pass   # silently ignore Ctrl+C

# Empty conditional branch
for item in data:
    if item == "skip_me":
        pass   # intentionally do nothing for this item
    else:
        process(item)
\`\`\`

## Nested Loops and break

\`break\` only exits the **innermost** loop. To break out of nested loops, use a flag variable or restructure into a function with \`return\`:

\`\`\`python
# break only exits the inner loop:
for i in range(3):
    for j in range(3):
        if i == j == 1:
            break          # exits inner loop only
        print(f"({i},{j})", end=" ")
    print()
# (0,0) (0,1) (0,2)
# (1,0)              ← broke out of inner at (1,1)
# (2,0) (2,1) (2,2)

# To break out of both, use a function:
def find_pair(matrix, target):
    for i, row in enumerate(matrix):
        for j, val in enumerate(row):
            if val == target:
                return (i, j)   # return exits the function entirely
    return None

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(find_pair(matrix, 5))   # (1, 1)
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Use continue to write a FizzBuzz that skips printing multiples of 5:
for i in range(1, 21):
    if i % 5 == 0:
        continue
    if i % 3 == 0:
        print("Fizz", end=" ")
    else:
        print(i, end=" ")

# 2. Find the first pair (i, j) where i*j == 24, with i < j,
#    both between 1 and 10. Use break appropriately.
\`\`\`
`,
  },

  'beginner-data-structures-basics-lists': {
    readTime: 10,
    whatYoullLearn: [
      'Create, access, and modify lists',
      'Use slicing to extract and replace sublists',
      'Apply essential list methods: append, extend, insert, remove, pop, sort',
      'Understand list mutability and aliasing',
      'Use list comprehensions for concise creation',
    ],
    content: `
## Creating and Accessing Lists

Lists are ordered, mutable sequences. They can hold items of any type, including other lists:

\`\`\`python
# Creation
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [42, "hello", 3.14, True, None]
nested = [[1, 2], [3, 4], [5, 6]]

# Indexing (zero-based)
print(numbers[0])     # 1
print(numbers[-1])    # 5 (last)
print(nested[1][0])   # 3 (row 1, col 0)

# Slicing — returns a NEW list
print(numbers[1:4])   # [2, 3, 4]
print(numbers[:3])    # [1, 2, 3]
print(numbers[2:])    # [3, 4, 5]
print(numbers[::-1])  # [5, 4, 3, 2, 1] (reversed copy)
print(numbers[::2])   # [1, 3, 5] (every 2nd)

# Slice assignment — replace a range
numbers[1:3] = [20, 30]
print(numbers)   # [1, 20, 30, 4, 5]
\`\`\`

## Modifying Lists

Lists are **mutable** — you can change them after creation:

\`\`\`python
items = [3, 1, 4, 1, 5, 9]

# Add items
items.append(2)          # [3, 1, 4, 1, 5, 9, 2] — at end
items.insert(0, 0)       # [0, 3, 1, 4, 1, 5, 9, 2] — at index
items.extend([6, 5, 3])  # [0, 3, 1, 4, 1, 5, 9, 2, 6, 5, 3] — add multiple

# Remove items
items.remove(1)          # removes FIRST occurrence of value 1
popped = items.pop()     # removes and returns LAST item
popped2 = items.pop(0)   # removes and returns item at index 0
del items[2]             # remove by index, no return value
items.clear()            # remove all items

# Other useful methods
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(numbers.count(1))        # 2 — count occurrences
print(numbers.index(5))        # 4 — first index of value
numbers.sort()                 # sort in-place
print(numbers)                 # [1, 1, 2, 3, 4, 5, 6, 9]
numbers.sort(reverse=True)     # descending
numbers.reverse()              # reverse in-place
copy = numbers.copy()          # shallow copy
\`\`\`

## Sorting

Python provides two sorting mechanisms:

\`\`\`python
data = [3, 1, 4, 1, 5, 9, 2, 6]

# sorted() — returns a NEW sorted list, original unchanged
new = sorted(data)               # [1, 1, 2, 3, 4, 5, 6, 9]
desc = sorted(data, reverse=True) # [9, 6, 5, 4, 3, 2, 1, 1]

# .sort() — sorts IN-PLACE, returns None
data.sort()                       # modifies data
print(data)                       # [1, 1, 2, 3, 4, 5, 6, 9]

# Sort by custom key
words = ["banana", "apple", "cherry", "date"]
words.sort(key=len)               # sort by length
print(words)                      # ['date', 'apple', 'banana', 'cherry']

people = [("Bob", 30), ("Alice", 25), ("Carol", 35)]
people.sort(key=lambda p: p[1])   # sort by age
print(people)   # [('Alice', 25), ('Bob', 30), ('Carol', 35)]
\`\`\`

## Aliasing vs Copying

Lists are **reference types** — assignment copies the reference, not the data:

\`\`\`python
a = [1, 2, 3]
b = a           # b IS the same list
b.append(4)
print(a)        # [1, 2, 3, 4] — a changed too!

# To copy, use:
c = a.copy()          # shallow copy
d = a[:]              # slice copy (same effect)
import copy
e = copy.deepcopy(a)  # deep copy (for nested lists)

c.append(99)
print(a)   # [1, 2, 3, 4] — a unchanged
print(c)   # [1, 2, 3, 4, 99]
\`\`\`

## Try It Yourself

\`\`\`python
# Given this list of student records:
students = [
    ("Alice", 92), ("Bob", 85), ("Carol", 91),
    ("Dave", 78), ("Eve", 95), ("Frank", 88)
]

# 1. Sort by score descending, print with rank
# 2. Find the average score
# 3. Filter out students who scored below 85
# 4. Get the top 3 using slicing after sorting
\`\`\`
`,
  },

  'beginner-data-structures-basics-tuples': {
    readTime: 7,
    whatYoullLearn: [
      'Create tuples with parentheses and understand single-element syntax',
      'Understand immutability and when to choose tuples over lists',
      'Use tuple packing and unpacking',
      'Use tuples as dictionary keys',
      'Work with named tuples for readable structured data',
    ],
    content: `
## Creating Tuples

Tuples are **ordered, immutable** sequences. Once created, their contents cannot be changed:

\`\`\`python
# Creation
empty = ()
single = (42,)       # IMPORTANT: trailing comma makes it a tuple!
single_wrong = (42)  # This is just the integer 42, not a tuple!
point = (3, 4)
rgb = (255, 128, 0)
mixed = (1, "hello", 3.14)

print(type(single))       # <class 'tuple'>
print(type(single_wrong)) # <class 'int'>

# Parentheses are optional — the comma creates the tuple
point = 3, 4         # same as (3, 4)
a, b, c = 1, 2, 3   # tuple packing and immediate unpacking
\`\`\`

## Immutability

Tuples cannot be modified after creation — this is their defining feature:

\`\`\`python
coords = (10, 20, 30)

print(coords[0])     # 10 — indexing works
print(coords[1:])    # (20, 30) — slicing works

# But modification raises TypeError:
# coords[0] = 99     # TypeError: 'tuple' object does not support item assignment
# coords.append(40)  # AttributeError: 'tuple' object has no attribute 'append'

# "Modifying" means creating a new tuple:
new_coords = (99,) + coords[1:]
print(new_coords)    # (99, 20, 30)
\`\`\`

## Tuple Unpacking

Unpacking lets you assign multiple variables from a tuple in one line:

\`\`\`python
point = (3, 7)
x, y = point
print(f"x={x}, y={y}")

# Swap variables — classic Python idiom
a, b = 10, 20
a, b = b, a
print(a, b)   # 20 10

# Nested unpacking
data = ((1, 2), (3, 4))
(a, b), (c, d) = data
print(a, b, c, d)  # 1 2 3 4

# Extended unpacking with *
first, *rest = (1, 2, 3, 4, 5)
print(first)   # 1
print(rest)    # [2, 3, 4, 5] — note: rest is a list, not a tuple

# Ignore values with _
_, important, _ = ("ignored", "keep this", "also ignored")
print(important)
\`\`\`

## When to Use Tuples vs Lists

\`\`\`python
# Use TUPLES for:
# 1. Heterogeneous data (different types, fixed structure)
person = ("Alice", 30, "Engineer")    # name, age, title

# 2. Data that shouldn't change (coordinates, RGB colors, config)
ORIGIN = (0, 0)
RED = (255, 0, 0)

# 3. Dictionary keys (lists can't be dict keys, tuples can)
distances = {
    ("New York", "LA"): 2800,
    ("London", "Paris"): 344,
}
print(distances[("London", "Paris")])   # 344

# 4. Function return values
def min_max(numbers):
    return min(numbers), max(numbers)   # returns a tuple

low, high = min_max([3, 1, 4, 1, 5, 9])
print(low, high)   # 1 9

# Use LISTS for:
# Homogeneous data that may grow/shrink/change
scores = [85, 92, 78, 91]   # list of scores — can append/remove
\`\`\`

## Named Tuples

For readable structured data without writing a full class:

\`\`\`python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(x=3, y=7)
print(p.x, p.y)     # 3 7 — access by name
print(p[0], p[1])   # 3 7 — access by index still works

# Named tuples are immutable like regular tuples
# p.x = 10  # raises AttributeError

# Very useful for returning structured data from functions:
Color = namedtuple("Color", ["r", "g", "b", "alpha"])
red = Color(255, 0, 0, 1.0)
print(red)          # Color(r=255, g=0, b=0, alpha=1.0)
print(red.r)        # 255
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Create a function that returns (min, max, average) of a list
def stats(numbers):
    pass   # return a tuple of three values

mn, mx, avg = stats([4, 2, 7, 1, 9, 3])
print(f"min={mn}, max={mx}, avg={avg:.2f}")

# 2. Use a dict with tuple keys to store a 3×3 grid:
grid = {}
for r in range(3):
    for c in range(3):
        grid[(r, c)] = r * 3 + c
print(grid[(1, 2)])   # should print 5
\`\`\`
`,
  },

  'beginner-data-structures-basics-sets': {
    readTime: 7,
    whatYoullLearn: [
      'Create sets with curly braces or set()',
      'Add and remove elements',
      'Perform set operations: union, intersection, difference, symmetric difference',
      'Use sets for fast membership testing and deduplication',
      'Understand frozenset for immutable sets',
    ],
    content: `
## Creating Sets

Sets are **unordered collections of unique elements**. They're optimized for membership testing and mathematical set operations:

\`\`\`python
# Creation
empty = set()          # NOT {} — that creates an empty dict!
numbers = {1, 2, 3, 4, 5}
letters = {"a", "b", "c", "a", "b"}   # duplicates removed
print(letters)    # {'a', 'b', 'c'} — order not guaranteed

# From an iterable
from_list = set([1, 2, 2, 3, 3, 4])
print(from_list)   # {1, 2, 3, 4}

# Deduplication — the most common use case:
data = [1, 2, 2, 3, 1, 4, 3, 5]
unique = list(set(data))
print(unique)   # [1, 2, 3, 4, 5] (order may vary)
\`\`\`

## Adding and Removing Elements

\`\`\`python
fruits = {"apple", "banana", "cherry"}

# Add single item
fruits.add("mango")        # {apple, banana, cherry, mango}
fruits.add("apple")        # no-op — apple already in set

# Add multiple items
fruits.update(["grape", "kiwi"])

# Remove items
fruits.remove("banana")    # raises KeyError if not found
fruits.discard("banana")   # safe — no error if not found
popped = fruits.pop()      # removes and returns an arbitrary element

# Clear all
fruits.clear()
\`\`\`

## Set Operations

Sets support all mathematical set operations, both as methods and operators:

\`\`\`python
A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

# Union — all elements in A or B (or both)
print(A | B)            # {1, 2, 3, 4, 5, 6, 7, 8}
print(A.union(B))       # same

# Intersection — elements in BOTH A and B
print(A & B)            # {4, 5}
print(A.intersection(B))

# Difference — in A but NOT in B
print(A - B)            # {1, 2, 3}
print(A.difference(B))

# Symmetric difference — in A or B but NOT both
print(A ^ B)                        # {1, 2, 3, 6, 7, 8}
print(A.symmetric_difference(B))

# Subset / Superset
C = {1, 2}
print(C.issubset(A))     # True — C ⊆ A
print(A.issuperset(C))   # True — A ⊇ C
print(A.isdisjoint(B))   # False — they share elements
print(A.isdisjoint({10, 11}))  # True — no shared elements
\`\`\`

## Sets vs Lists for Membership Testing

Sets use hash tables — membership testing is O(1) vs O(n) for lists:

\`\`\`python
# Fast lookup: use a set when testing "is X in collection?"
valid_users = {"alice", "bob", "carol", "dave"}

username = "alice"
if username in valid_users:   # O(1) hash lookup
    print("Access granted")

# vs list (O(n) scan):
# valid_list = ["alice", "bob", "carol", "dave"]
# if username in valid_list:  # scans up to 4 elements

# Real-world: find common elements between two datasets
dataset1 = set(range(1_000_000))
dataset2 = set(range(500_000, 1_500_000))
overlap = dataset1 & dataset2   # fast!
print(len(overlap))   # 500000
\`\`\`

## frozenset — Immutable Sets

\`frozenset\` is an immutable version of \`set\` — can be used as a dict key or set element:

\`\`\`python
fs = frozenset([1, 2, 3])
print(fs)           # frozenset({1, 2, 3})
# fs.add(4)         # AttributeError — immutable!

# Use as dict key (regular sets can't be dict keys)
graph = {
    frozenset({"A", "B"}): 5,   # edge between A and B with weight 5
    frozenset({"B", "C"}): 3,
}
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Given two lists of email addresses, find:
list1 = ["alice@x.com", "bob@x.com", "carol@x.com", "dave@x.com"]
list2 = ["carol@x.com", "dave@x.com", "eve@x.com", "frank@x.com"]

# a) Emails in both lists
# b) Emails only in list1
# c) All unique emails combined

# 2. Remove duplicates from this list while preserving order:
items = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
# hint: use a set to track seen items and a loop
\`\`\`
`,
  },

  'beginner-data-structures-basics-dictionaries': {
    readTime: 10,
    whatYoullLearn: [
      'Create, access, and modify dictionaries',
      'Use get(), setdefault(), and update() safely',
      'Iterate over keys, values, and items',
      'Build nested dictionaries for complex data',
      'Use dict comprehensions for concise creation',
    ],
    content: `
## Creating and Accessing Dictionaries

Dictionaries store **key-value pairs** with O(1) average lookup time. Keys must be immutable (strings, numbers, tuples):

\`\`\`python
# Creation
empty = {}
person = {"name": "Alice", "age": 30, "city": "New York"}

# Constructor
config = dict(host="localhost", port=8080, debug=True)

# Access by key
print(person["name"])      # "Alice"
# person["email"]          # KeyError if key doesn't exist!

# Safe access with get():
print(person.get("email"))            # None (no error)
print(person.get("email", "N/A"))     # "N/A" (default)

# Check if key exists
print("age" in person)     # True
print("email" in person)   # False
\`\`\`

## Adding and Modifying

\`\`\`python
inventory = {"apples": 5, "bananas": 3}

# Add or update a key
inventory["oranges"] = 10        # add new key
inventory["apples"] = 8          # update existing

# update() merges another dict
inventory.update({"grapes": 7, "apples": 12})
print(inventory)

# setdefault() — set only if key doesn't already exist
inventory.setdefault("kiwi", 0)   # adds kiwi: 0
inventory.setdefault("apples", 0) # apples stays 12 — won't overwrite

# Delete
del inventory["bananas"]
removed = inventory.pop("grapes")    # remove and return value
last = inventory.popitem()           # remove and return last (key, value) pair
\`\`\`

## Iterating

\`\`\`python
scores = {"Alice": 95, "Bob": 82, "Carol": 91}

# Iterate over keys (default)
for name in scores:
    print(name)

# Iterate over values
for score in scores.values():
    print(score)

# Iterate over key-value pairs (most common)
for name, score in scores.items():
    print(f"{name}: {score}")

# Sorted iteration
for name in sorted(scores):
    print(f"{name}: {scores[name]}")

# Sort by value
for name, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
    print(f"{name}: {score}")
# Carol: 91, Alice: 95... (descending)
\`\`\`

## Nested Dictionaries

\`\`\`python
# JSON-like nested structures
users = {
    "alice": {
        "email": "alice@example.com",
        "scores": [85, 92, 88],
        "active": True,
    },
    "bob": {
        "email": "bob@example.com",
        "scores": [70, 75, 80],
        "active": False,
    }
}

# Deep access
print(users["alice"]["email"])          # "alice@example.com"
print(users["alice"]["scores"][0])      # 85

# Safe deep access
email = users.get("carol", {}).get("email", "unknown")
print(email)   # "unknown" — no KeyError

# Building nested dicts programmatically
from collections import defaultdict
word_positions = defaultdict(list)  # default value is an empty list
for i, word in enumerate("the quick brown fox the quick".split()):
    word_positions[word].append(i)
print(dict(word_positions))
# {'the': [0, 4], 'quick': [1, 5], 'brown': [2], 'fox': [3]}
\`\`\`

## Dict Comprehensions

\`\`\`python
# Basic dict comprehension
squares = {x: x**2 for x in range(1, 6)}
print(squares)   # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# With condition
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}

# Invert a dictionary (swap keys and values)
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
print(inverted)  # {1: 'a', 2: 'b', 3: 'c'}

# Filter + transform
scores = {"Alice": 85, "Bob": 72, "Carol": 93, "Dave": 68}
passing = {name: score for name, score in scores.items() if score >= 75}
print(passing)   # {'Alice': 85, 'Carol': 93}
\`\`\`

## Try It Yourself

\`\`\`python
# 1. Count the frequency of each word in this text:
text = "to be or not to be that is the question to be"
# Expected: {'to': 3, 'be': 3, 'or': 1, ...}
# Hint: use dict.get() with a default of 0

# 2. Given a list of student dicts, create a new dict mapping
#    name → average score:
students = [
    {"name": "Alice", "scores": [90, 85, 92]},
    {"name": "Bob", "scores": [70, 78, 82]},
    {"name": "Carol", "scores": [95, 98, 91]},
]
# Expected: {'Alice': 89.0, 'Bob': 76.67, 'Carol': 94.67}
\`\`\`
`,
  },

  'beginner-functions-parameters-return-values': {
    readTime: 8,
    whatYoullLearn: [
      'Design functions with clear, well-named parameters',
      'Return single and multiple values',
      'Use type hints to document function signatures',
      'Understand pass-by-object-reference semantics',
      'Write pure functions and understand side effects',
    ],
    content: `
## Positional Parameters

Parameters define what a function expects. Arguments are the actual values passed when calling it:

\`\`\`python
def greet(first_name, last_name):   # parameters
    return f"Hello, {first_name} {last_name}!"

print(greet("John", "Doe"))          # arguments: positional
print(greet(last_name="Doe", first_name="John"))  # keyword arguments
\`\`\`

## Returning Values

Functions can return any value — or multiple values as a tuple:

\`\`\`python
def circle_metrics(radius):
    """Return area and circumference of a circle."""
    import math
    area = math.pi * radius ** 2
    circumference = 2 * math.pi * radius
    return area, circumference       # returns a tuple

# Unpack the tuple:
area, circ = circle_metrics(5)
print(f"Area: {area:.2f}, Circumference: {circ:.2f}")

# Or receive as tuple:
result = circle_metrics(5)
print(result[0])  # area

# None is returned if no return statement
def side_effect_only(data):
    data.append(99)   # modifies the list — no return needed

numbers = [1, 2, 3]
side_effect_only(numbers)
print(numbers)   # [1, 2, 3, 99]
\`\`\`

## Type Hints

Type hints (Python 3.5+) make function signatures self-documenting. They're optional at runtime but checked by tools like mypy and displayed in IDEs:

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

def get_extremes(numbers: list[float]) -> tuple[float, float]:
    return min(numbers), max(numbers)

# None return:
def log(message: str) -> None:
    print(f"[LOG] {message}")

# Optional (can be None or the type):
from typing import Optional
def find_user(user_id: int) -> Optional[str]:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)   # returns str or None
\`\`\`

## Pass-by-Object-Reference

Python passes objects by reference — mutations to mutable arguments affect the original:

\`\`\`python
def append_item(lst: list, item) -> None:
    lst.append(item)   # mutates the caller's list

numbers = [1, 2, 3]
append_item(numbers, 4)
print(numbers)   # [1, 2, 3, 4] — original was modified!

# Integers and strings are immutable — reassignment doesn't affect caller:
def try_to_change(x: int) -> None:
    x = 99   # creates a new local binding — caller's x is unchanged

n = 5
try_to_change(n)
print(n)   # 5 — unchanged

# To avoid mutating, work on a copy:
def safe_append(lst: list, item) -> list:
    """Return a new list with item added, original unchanged."""
    return lst + [item]

original = [1, 2, 3]
new_list = safe_append(original, 4)
print(original)  # [1, 2, 3] — unchanged
print(new_list)  # [1, 2, 3, 4]
\`\`\`

## Try It Yourself

\`\`\`python
# Write a function normalize(data) that:
# 1. Takes a list of numbers
# 2. Returns a new list where each value is scaled to [0, 1]
#    using the formula: (x - min) / (max - min)
# 3. Add type hints
# 4. Handle the edge case where all values are the same (avoid division by zero)

def normalize(data: list[float]) -> list[float]:
    pass

print(normalize([0, 5, 10, 15, 20]))  # [0.0, 0.25, 0.5, 0.75, 1.0]
print(normalize([7, 7, 7]))           # [0.0, 0.0, 0.0] or handle gracefully
\`\`\`
`,
  },

  'beginner-functions-default-keyword-arguments': {
    readTime: 7,
    whatYoullLearn: [
      'Set default parameter values',
      'Call functions with keyword arguments for clarity',
      'Use *args for variable positional arguments',
      'Use **kwargs for variable keyword arguments',
      'Understand the mutable default argument trap',
    ],
    content: `
## Default Parameter Values

Default values make parameters optional — callers can omit them:

\`\`\`python
def connect(host, port=8080, timeout=30, secure=False):
    print(f"Connecting to {host}:{port} (timeout={timeout}s, secure={secure})")

connect("example.com")                        # uses all defaults
connect("example.com", 443, secure=True)      # override port and secure
connect("example.com", timeout=60)            # only override timeout

# Rule: defaults must come AFTER non-default parameters
# def wrong(a=1, b):   # SyntaxError!
# def ok(a, b=1):      # ✓
\`\`\`

## The Mutable Default Argument Trap

**Never** use mutable objects (lists, dicts, sets) as default values:

\`\`\`python
# ✗ BUG: the list is created ONCE at definition time
def buggy_append(item, result=[]):
    result.append(item)
    return result

print(buggy_append(1))   # [1]
print(buggy_append(2))   # [1, 2] — NOT [2]! Same list reused!
print(buggy_append(3))   # [1, 2, 3]

# ✓ FIX: use None as default, create inside the function
def safe_append(item, result=None):
    if result is None:
        result = []
    result.append(item)
    return result

print(safe_append(1))   # [1]
print(safe_append(2))   # [2] ✓
\`\`\`

## *args — Variable Positional Arguments

\`*args\` collects any number of positional arguments into a **tuple**:

\`\`\`python
def sum_all(*args):
    """Accept any number of numeric arguments."""
    return sum(args)

print(sum_all(1, 2, 3))         # 6
print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all())                # 0

def log(level, *messages):
    """level is required, messages can be zero or more."""
    for msg in messages:
        print(f"[{level}] {msg}")

log("INFO", "Server started", "Listening on port 8080")
log("ERROR")   # no messages — that's fine

# Unpack a list into positional arguments with *
numbers = [1, 2, 3]
print(sum_all(*numbers))   # same as sum_all(1, 2, 3)
\`\`\`

## **kwargs — Variable Keyword Arguments

\`**kwargs\` collects any number of keyword arguments into a **dict**:

\`\`\`python
def create_user(**kwargs):
    """Accept any keyword arguments."""
    print(kwargs)   # it's a regular dict

create_user(name="Alice", age=30, city="NYC")
# {'name': 'Alice', 'age': 30, 'city': 'NYC'}

def configure(host, port=80, **options):
    """Required args, then optional keyword catch-all."""
    print(f"{host}:{port}")
    for key, value in options.items():
        print(f"  {key} = {value}")

configure("example.com", 443, ssl=True, timeout=60, retries=3)

# Unpack a dict into keyword arguments with **
settings = {"host": "localhost", "port": 5432}
configure(**settings)
\`\`\`

## Argument Order

All four argument types can be combined, but must follow this order:

\`\`\`python
# def func(positional, *args, keyword_only, **kwargs)

def full_signature(a, b, *args, keyword_only=True, **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"keyword_only={keyword_only}")
    print(f"kwargs={kwargs}")

full_signature(1, 2, 3, 4, keyword_only=False, extra="hello")
# a=1, b=2
# args=(3, 4)
# keyword_only=False
# kwargs={'extra': 'hello'}
\`\`\`

## Try It Yourself

\`\`\`python
# Write a function printf(template, *args, **kwargs) that:
# - Formats the template string with args and kwargs
# - Has an optional 'sep' keyword argument (default='\\n')
# - Prints the result (or writes to a custom 'file' kwarg)

printf("{} + {} = {}", 1, 2, 3)           # "1 + 2 = 3"
printf("{name} is {age}", name="Alice", age=30)  # "Alice is 30"
\`\`\`
`,
  },

  'beginner-basic-error-handling-try-except': {
    readTime: 8,
    whatYoullLearn: [
      'Catch and handle exceptions with try-except',
      'Catch specific exception types vs broad exceptions',
      'Access exception details with "as"',
      'Use try-except-else-finally',
      'Know when to catch exceptions and when to let them propagate',
    ],
    content: `
## Why Exceptions?

Exceptions are Python's way of signaling that something went wrong. An unhandled exception crashes the program with a traceback. \`try-except\` lets you handle errors gracefully:

\`\`\`python
# Without exception handling — crashes on bad input
def divide(a, b):
    return a / b

# divide(10, 0)   # ZeroDivisionError: division by zero
# divide("5", 2)  # TypeError: unsupported operand type

# With exception handling
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    return result

print(safe_divide(10, 2))   # 5.0
print(safe_divide(10, 0))   # Error: Cannot divide by zero → None
\`\`\`

## Catching Specific Exceptions

Always catch the **most specific** exception type you expect. Broad catches hide bugs:

\`\`\`python
def parse_and_divide(a_str, b_str):
    try:
        a = float(a_str)
        b = float(b_str)
        return a / b
    except ValueError as e:
        print(f"Invalid number: {e}")
        return None
    except ZeroDivisionError:
        print("Cannot divide by zero")
        return None
    except TypeError as e:
        print(f"Wrong type: {e}")
        return None

# Catch multiple exceptions with a tuple:
def read_config(path):
    try:
        with open(path) as f:
            return f.read()
    except (FileNotFoundError, PermissionError) as e:
        print(f"File error: {e}")
        return ""
\`\`\`

## try-except-else-finally

\`\`\`python
def process_file(filename):
    try:
        f = open(filename)         # might raise FileNotFoundError
    except FileNotFoundError:
        print(f"File not found: {filename}")
        return
    else:
        # Only runs if NO exception was raised in try
        content = f.read()
        print(f"Read {len(content)} bytes")
        f.close()
        return content
    finally:
        # ALWAYS runs — even if exception, even if return!
        print("Done processing (finally)")

# Finally is guaranteed — great for cleanup:
def risky_operation(data):
    lock = acquire_lock()
    try:
        result = process(data)
        return result
    except Exception as e:
        log_error(e)
        raise   # re-raise after logging
    finally:
        lock.release()   # ALWAYS release the lock
\`\`\`

## When NOT to Use try-except

\`\`\`python
# ✗ Don't use exception handling for normal control flow:
def has_item(lst, item):
    try:
        lst.index(item)
        return True
    except ValueError:
        return False

# ✓ Just use 'in':
def has_item(lst, item):
    return item in lst

# ✗ Never use bare except — catches EVERYTHING including KeyboardInterrupt:
try:
    do_something()
except:           # catches Ctrl+C, SystemExit, etc.!
    pass

# ✓ Catch Exception at most (still avoid if possible):
try:
    do_something()
except Exception as e:
    print(f"Something went wrong: {e}")

# ✓ Best: catch what you expect, let the rest propagate
try:
    value = int(user_input)
except ValueError:
    value = 0   # only handle the specific failure
\`\`\`

## Try It Yourself

\`\`\`python
# Write a function load_json_file(path) that:
# 1. Opens and reads the file
# 2. Parses the JSON content
# 3. Returns the parsed data, or None on any error
# 4. Prints a descriptive error message for each failure type

import json

def load_json_file(path):
    try:
        # open the file
        # parse the JSON
        # return the data
        pass
    except FileNotFoundError:
        pass
    except json.JSONDecodeError as e:
        pass
    except PermissionError:
        pass
    return None
\`\`\`
`,
  },
};
