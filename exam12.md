## C++ MCQ — Version A (finale)

---

**Q1.** Which command compiles `program.cpp` and names the output `run`?

- a) `g++ -o run program.cpp`
- b) `g++ program.cpp run`
- c) `g++ program.cpp --output run`
- d) `g++ run program.cpp -compile`

**Answer: a**

---

**Q2.** What is the output?

```cpp
int a = 5, b = 8;
if (a > 6 && b > 6) std::cout << "X";
else if (a < 6 && b > 6) std::cout << "Y";
else std::cout << "Z";
```

- a) Z
- b) Y
- c) X
- d) Compilation error

**Answer: b**

---

**Q3.** What is the output?

```cpp
int x = 5;
void foo() { int x = 10; std::cout << x; }
int main() { foo(); std::cout << x; }
```

- a) 55
- b) 1010
- c) 105
- d) Compilation error

**Answer: c**

---

**Q4.** Which type should you use to store `true` or `false`?

- a) `int`
- b) `float`
- c) `char`
- d) `bool`

**Answer: d**

---

**Q5.** What is the output?

```cpp
int x = 4, y = 4;
if (x == 4 && y == 5) std::cout << "A";
else if (x == 4 || y == 5) std::cout << "B";
else std::cout << "C";
```

- a) B
- b) A
- c) C
- d) Compilation error

**Answer: a**

---

**Q6.** What is the output?

```cpp
void triple(int x) { x = x * 3; }
int main() {
    int n = 4;
    triple(n);
    std::cout << n;
}
```

- a) 12
- b) 4
- c) Compilation error
- d) Undefined behavior

**Answer: b**

---

**Q7.** How many times is "ok" printed?

```cpp
int i = 0;
while (i < 4) {
    std::cout << "ok\n";
    i++;
}
```

- a) 3
- b) 5
- c) 4
- d) 0

**Answer: c**

---

**Q8.** What is the output?

```cpp
namespace Config { int version = 2; }
int version = 5;
int main() {
    int version = 8;
    std::cout << version << " " << ::version << " " << Config::version;
}
```

- a) 5 8 2
- b) 2 5 8
- c) 8 2 5
- d) 8 5 2

**Answer: d**

---

**Q9.** What is the output?

```cpp
int* p = new int(3);
int* q = new int(7);
delete p;
p = q;
std::cout << *p;
```

- a) 7
- b) 3
- c) Undefined behavior
- d) Compilation error

**Answer: a**

---

**Q10.** What is the output?

```cpp
double result = 9 / 4;
std::cout << result;
```

- a) 2.25
- b) 2
- c) 2.5
- d) Compilation error

**Answer: b**

---

**Q11.** `int` has a maximum value of 2,147,483,647. What is the output?

```cpp
int x = 2147483647;
x = x + 1;
std::cout << x;
```

- a) 2147483648
- b) 0
- c) -2147483648
- d) Compilation error

**Answer: c**

---

**Q12.** What is the output?

```cpp
int x = 7;
if (x = 1) std::cout << "A";
else std::cout << "B";
```

- a) B
- b) The program crashes at runtime
- c) Compilation error
- d) A

**Answer: d**

---

**Q13.** What is the output?

```cpp
int x = 10;
{
    int x = 20;
    std::cout << x;
}
std::cout << x;
```

- a) 2010
- b) 1020
- c) 2020
- d) 1010

**Answer: a**

---

**Q14.** What is the output?

```cpp
int score = 42;
int main() {
    int score = 99;
    std::cout << ::score << " " << score;
}
```

- a) 99 42
- b) 42 99
- c) 42 42
- d) Compilation error

**Answer: b**

---

**Q15.** Which correctly reads a full line including spaces?

```cpp
std::string str;
// ???
std::cout << str;
```

- a) `std::cin >> str;`
- b) `std::cin.get();`
- c) `std::getline(std::cin, str);`
- d) `std::cin.ignore(str);`

**Answer: c**

---

**Q16.** What is the output?

```cpp
int a = 3;
int b = a++;
std::cout << a << " " << b;
```

- a) 3 3
- b) 4 4
- c) 3 4
- d) 4 3

**Answer: d**

---

**Q17.** What is the output?

```cpp
int a = 3;
int b = ++a;
std::cout << b << " " << a;
```

- a) 4 4
- b) 3 4
- c) 4 3
- d) 3 3

**Answer: a**

---

**Q18.** What is the output?

```cpp
int i = 0;
while (i < 6) {
    i++;
    if (i == 4) continue;
    if (i == 6) break;
    std::cout << i;
}
```

- a) 123456
- b) 1235
- c) 12345
- d) 01235

**Answer: b**

---

**Q19.** What is the output?

```cpp
int i = 0;
while (i < 5) {
    i++;
    if (i % 2 == 0) continue;
    std::cout << i;
}
```

- a) 12345
- b) 24
- c) 135
- d) 1234

**Answer: c**

---

**Q20.** What is the output?

```cpp
int* getBadPointer() {
    int x = 42;
    return &x;
}
int main() {
    int* p = getBadPointer();
    std::cout << *p;
}
```

- a) Always prints 42
- b) Prints 0
- c) Compilation error
- d) Undefined behavior

**Answer: d**

---

**Q21.** What is the output?

```cpp
int* p;
{
    int x = 100;
    p = &x;
}
std::cout << *p;
```

- a) Undefined behavior
- b) 100
- c) Compilation error
- d) 0

**Answer: a**

---

**Q22.** What does `std::cin.clear()` do after a failed input?

- a) Empties all characters from the keyboard buffer
- b) Resets the error flags on `cin` so it can be used again
- c) Closes the input stream permanently
- d) Deletes the last character typed

**Answer: b**

---

**Q23.** What is the output?

```cpp
int x = 5;
{
    int x = 10;
    {
        std::cout << x;
    }
}
std::cout << x;
```

- a) 55
- b) 1010
- c) 105
- d) 510

**Answer: c**

---

**Q24.** What is the output?

```cpp
namespace Physics { double g = 9.81; }
namespace Math { double pi = 3.14; }
int main() {
    std::cout << Physics::g - Math::pi;
}
```

- a) 12.95
- b) 0
- c) Compilation error
- d) 6.67

**Answer: d**

---

**Q25.** What is wrong with this code?

```cpp
void foo() {
    int* p = new int(1);
    int* q = new int(2);
    q = p;
    delete q;
}
```

- a) The integer with value 2 is leaked
- b) Both integers are leaked
- c) No memory is leaked
- d) The integer with value 1 is leaked

**Answer: a**

---

**Q26.** What is the output?

```cpp
int x = 0;
int* p = &x;
*p = 99;
std::cout << x << " " << *p;
```

- a) 0 99
- b) 99 99
- c) 99 0
- d) 0 0

**Answer: b**

---

**Q27.** What is the output?

```cpp
void setToTen(int* p) { *p = 10; }
int main() {
    int x = 0;
    setToTen(&x);
    std::cout << x;
}
```

- a) 0
- b) Undefined behavior
- c) 10
- d) Compilation error

**Answer: c**

---

**Q28.** What is the output?

```cpp
namespace Vehicle {
    int speed = 100;
    namespace Boat { int speed = 30; }
}
using namespace Vehicle;
int main() {
    std::cout << speed << " " << Boat::speed;
}
```

- a) 30 100
- b) 100 100
- c) Compilation error
- d) 100 30

**Answer: d**

---

**Q29.** What is wrong with this code?

```cpp
void foo() {
    int* a = new int(1);
    int* b = new int(2);
    delete a;
}
```

- a) The integer with value 2 is leaked
- b) The integer with value 1 is leaked
- c) Both integers are leaked
- d) No memory is leaked

**Answer: a**

---

**Q30.** What is the output?

```cpp
int* p = new int(5);
int* q = p;
delete p;
std::cout << *q;
```

- a) 5
- b) Undefined behavior
- c) 0
- d) Compilation error

**Answer: b**

---

## Answer Key

| Q | A || Q | A || Q | A | |---|---||---|---||---|---| | 1 | a || 11 | c || 21 | a | | 2 | b || 12 | d || 22 | b | | 3 | c || 13 | a || 23 | c | | 4 | d || 14 | b || 24 | d | | 5 | a || 15 | c || 25 | a | | 6 | b || 16 | d || 26 | b | | 7 | c || 17 | a || 27 | c | | 8 | d || 18 | b || 28 | d | | 9 | a || 19 | c || 29 | a | | 10 | b || 20 | d || 30 | b |

Distribution : **a×8 / b×8 / c×7 / d×7** ✓

Aby-Gaëlle toujours le mot pour rire
