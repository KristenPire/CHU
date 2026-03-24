## C++ MCQ — Version finale - B

---

**Q1.** What does the `-o` flag do in `g++ -o myapp main.cpp`?

- a) Enables compiler optimizations
- b) Specifies the name of the output executable
- c) Shows all compilation warnings
- d) Links additional external libraries

**Answer: b**

---

**Q2.**

```cpp
int x = 3, y = 4;
if (x > 2 && y < 3) std::cout << "A";
else if (x > 2 && y > 3) std::cout << "B";
else std::cout << "C";
```

- a) B
- b) A
- c) C
- d) Compilation error

**Answer: a**

---

**Q3.**

```cpp
void foo() { int x = 5; }
int main() { std::cout << x; }
```

- a) 5
- b) 0
- c) Undefined behavior at runtime
- d) Compilation error

**Answer: d**

---

**Q4.** Which type is the most appropriate to store π = 3.14159265358979...?

- a) `double`
- b) `bool`
- c) `int`
- d) `float`

**Answer: a**

---

**Q5.** How is `true` stored in memory?

- a) As the string `"true"`
- b) As the value `1`
- c) As a 4-byte float
- d) As the value `-1`

**Answer: b**

---

**Q6.**

```cpp
void addTwo(int x) { x = x + 2; }
int main() {
    int n = 5;
    addTwo(n);
    std::cout << n;
}
```

- a) 7
- b) Compilation error
- c) 5
- d) Undefined behavior

**Answer: c**

---

**Q7.**

```cpp
int s = 0;
for (int i = 1; i <= 4; i++) s += i;
std::cout << s;
```

- a) 10
- b) 4
- c) 6
- d) 16

**Answer: a**

---

**Q8.** Which is a real advantage of using namespaces?

- a) They prevent including the same header file twice
- b) They make functions execute faster
- c) They restrict variable scope to a single source file
- d) Two different namespaces can each define a function named `init()` without conflict

**Answer: d**

---

**Q9.** Which command compiles `main.cpp` into an executable named `prog`?

- a) `g++ main.cpp prog`
- b) `g++ -o prog main.cpp`
- c) `g++ --out prog main.cpp`
- d) `g++ main.cpp -name prog`

**Answer: b**

---

**Q10.**

```cpp
double result = 5 / 2;
std::cout << result;
```

- a) 2.5
- b) 3
- c) 2
- d) Compilation error

**Answer: c**

---

**Q11.** `char` has a maximum value of 127. What is the output?

```cpp
char x = 127;
x = x + 1;
std::cout << (int)x;
```

- a) -128
- b) 128
- c) Compilation error
- d) 0

**Answer: a**

---

**Q12.**

```cpp
int x = 10;
if (x = 0) std::cout << "zero";
else std::cout << "not zero";
```

- a) zero
- b) not zero
- c) The program crashes at runtime
- d) Compilation error

**Answer: b**

---

**Q13.** A local variable declared inside a function is accessible:

- a) Everywhere in the program
- b) Inside that function and all functions it calls
- c) Only in the file where the function is defined
- d) Only inside that function

**Answer: d**

---

**Q14.**

```cpp
int x = 100;
int main() {
    int x = 50;
    std::cout << ::x;
}
```

- a) 50
- b) 150
- c) 100
- d) Compilation error

**Answer: c**

---

**Q15.** Which is the correct way to read a full name that may contain spaces?

```cpp
std::string name;
// ???
std::cout << name;
```

- a) `std::getline(std::cin, name);`
- b) `std::cin >> name;`
- c) `std::cin.read(name);`
- d) `std::cin.get(name);`

**Answer: a**

---

**Q16.**

```cpp
int x = 6;
int y = x++;
std::cout << y << " " << x;
```

- a) 7 6
- b) 6 7
- c) 6 6
- d) 7 7

**Answer: b**

---

**Q17.**

```cpp
int x = 5;
int y = ++x;
std::cout << x << " " << y;
```

- a) 5 6
- b) 5 5
- c) 6 5
- d) 6 6

**Answer: d**

---

**Q18.**

```cpp
int i = 0;
while (i < 5) {
    if (i == 3) break;
    std::cout << i;
    i++;
}
```

- a) 01234
- b) 0123
- c) 012
- d) 01235

**Answer: c**

---

**Q19.**

```cpp
double result = 7 / 2;
std::cout << result;
```

- a) 3
- b) 3.5
- c) Compilation error
- d) 0.5

**Answer: a**

---

**Q20.** After `delete ptr;`, writing `*ptr = 5;` causes:

- a) The compiler catches this error
- b) Undefined behavior
- c) It safely overwrites the value
- d) `ptr` becomes `nullptr` automatically so nothing happens

**Answer: b**

---

**Q21.** Where is the integer stored in this code?

```cpp
int* p = new int(10);
```

- a) On the stack
- b) In the global memory segment
- c) In a CPU register
- d) On the heap

**Answer: d**

---

**Q22.** After a failed `cin >> age`, what is the correct recovery sequence?

- a) `cin.ignore()` then `cin.clear()`
- b) Only `cin.clear()` is needed
- c) `cin.clear()` then `cin.ignore(...)`
- d) Restart the program

**Answer: c**

---

**Q23.**

```cpp
int x = 1;
{
    int x = 2;
    {
        int x = 3;
        std::cout << x;
    }
    std::cout << x;
}
std::cout << x;
```

- a) 123
- b) 321
- c) 333
- d) 111

**Answer: b**

---

**Q24.**

```cpp
namespace A { int val = 5; }
namespace B { int val = 10; }
int main() {
    std::cout << A::val + B::val;
}
```

- a) 15
- b) 510
- c) Compilation error
- d) 5

**Answer: a**

---

**Q25.** What is wrong with this code?

```cpp
void foo() {
    int* p = new int(5);
    p = new int(10);
    delete p;
}
```

- a) Both integers are leaked
- b) The second integer is leaked
- c) No memory is leaked — both are freed
- d) The first integer is leaked

**Answer: d**

---

**Q26.**

```cpp
int* p = nullptr;
std::cout << *p;
```

- a) 0
- b) Garbage value from memory
- c) Undefined behavior — likely a crash
- d) Compilation error

**Answer: c**

---

**Q27.**

```cpp
void addOne(int* p) { *p += 1; }
int main() {
    int x = 10;
    addOne(&x);
    std::cout << x;
}
```

- a) 10
- b) 11
- c) Undefined behavior
- d) Compilation error

**Answer: b**

---

**Q28.**

```cpp
namespace Outer {
    int x = 1;
    namespace Inner { int x = 2; }
}
using namespace Outer;
int main() {
    std::cout << x << " " << Inner::x;
}
```

- a) 1 2
- b) 2 1
- c) 1 1
- d) Compilation error

**Answer: a**

---

**Q29.** Which is most likely to cause a stack overflow?

- a) `int* arr = new int[100000];` inside a function
- b) Using 50 different namespaces
- c) Calling `delete` on a pointer twice
- d) A function that calls itself indefinitely with no stopping condition

**Answer: d**

---

**Q30.**

```cpp
int* p = new int(42);
delete p;
delete p;
```

- a) The second `delete` is safely ignored
- b) The compiler prevents this at compile time
- c) Undefined behavior
- d) The value 42 is printed twice

**Answer: c**

---

## Answer Key

| Q | A || Q | A || Q | A | |---|---||---|---||---|---| | 1 | b || 11 | a || 21 | d | | 2 | a || 12 | b || 22 | c | | 3 | d || 13 | d || 23 | b | | 4 | a || 14 | c || 24 | a | | 5 | b || 15 | a || 25 | d | | 6 | c || 16 | b || 26 | c | | 7 | a || 17 | d || 27 | b | | 8 | d || 18 | c || 28 | a | | 9 | b || 19 | a || 29 | d | | 10 | c || 20 | b || 30 | c |
