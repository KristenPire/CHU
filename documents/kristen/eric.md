## C++ MCQ — Version B (100 pts)

**Final Grade: 87 / 100**

---

**Labs 8–11: Structures, Multi-file Projects, Classes, Canonical Form & Operator Overloading**

> All code assumes `#include <iostream>` and `#include <string>` are present. C++14.

---

**Q1.** (4 pts) Which is the correct include guard for `student.hh`? D — Correct

- a)

```cpp
#guard STUDENT_HH
// declarations
#endguard
```

- b)

```cpp
#include_once "student.hh"
// declarations
```

- c)

```cpp
#define STUDENT_HH
// declarations
#undef STUDENT_HH
```

- d)

```cpp
#pragma once
// declarations
```

---

**Q2.** (3 pts) Which is true about the `this` pointer?B — Correct

- a) It must be declared as a parameter in every method
- b) It points to the object that called the method
- c) It only exists inside constructors
- d) It points to the class definition, not an object

---

**Q3.** (3 pts) What problem do include guards prevent?D — Wrong (correct: c)

- a) Header files being modified by other files
- b) Functions being called more than once at runtime
- c) Same declarations processed twice, causing redefinition errors
- d) Linking errors between .cpp files

---

**Q4.** (3 pts) Which is **NOT** a benefit of .hh/.cpp separation?A — Correct

- a) Makes the program faster at runtime
- b) Only changed .cpp files need recompilation
- c) Multiple .cpp files can share declarations
- d) Separates interface from implementation

---

**Q5.** (3 pts) Which belongs in a .cpp file, **NOT** a .hh file?D — Correct

- a) Structure definitions
- b) Function prototypes
- c) Include guards
- d) Function implementations (bodies)

---

**Q6.** (4 pts) What does `return *this;` do at the end of a method?B — Correct

- a) Deletes the object and frees memory
- b) Returns a reference to the current object
- c) Creates and returns a new copy of the object
- d) Returns the address of the first member

---

**Q7.** (3 pts) Given `Player p; Player* ptr = &p;`, which accesses `score`?C — Correct

- a) `ptr.score`
- b) `ptr::score`
- c) `ptr->score`
- d) `*ptr.score`

---

**Q8.** (4 pts) What is the error?C — Wrong (correct: a)

```cpp
namespace Game {
    struct Player { std::string name; int hp; };
    void heal(Player& p, int amount);
}

int main() {
    Player hero = {"Warrior", 100};
    heal(hero, 20);
}
```

- a) `Player` and `heal` need `Game::` in `main()`
- b) `{"Warrior", 100}` is invalid initialization
- c) `heal` cannot take a reference parameter
- d) A namespace cannot contain structs and functions

---

**Q9.** (3 pts) Which expression prints the department name?B — Correct

```cpp
struct Department { std::string name; int floor; };
struct Employee   { std::string name; Department dept; };
Employee e = {"Bob", {"Engineering", 3}};
```

- a) `std::cout << e.name;`
- b) `std::cout << e.dept.name;`
- c) `std::cout << Department.name;`
- d) `std::cout << e->dept.name;`

---

**Q10.** (3 pts) Which statement about structs is **FALSE**?C — Correct

- a) Members are public by default
- b) A function can return a struct by value
- c) A struct must have a constructor to be used
- d) `->` accesses members through a pointer

---

**Q11.** (3 pts) What is `player.points` after calling `reset`?A — Correct

```cpp
struct Score { int points; };

void reset(Score s) { s.points = 0; }

int main() {
    Score player = {100};
    reset(player);
}
```

- a) 100 — the function received a copy
- b) 0 — the function modified the original
- c) Undefined — the struct is destroyed after the call
- d) Compilation error — structs cannot be passed

---

**Q12.** (4 pts) What is `r.height`?D — Correct

```cpp
struct Rect { int width; int height; };
Rect r = {10, 20};
```

- a) 0
- b) 10
- c) Undefined
- d) 20

---

**Q13.** (3 pts) Which line calls the **assignment operator** (not copy constructor)?C — Wrong (correct: d)

```cpp
Vec a(1, 2);       // Line 1
Vec b = a;          // Line 2
Vec c(a);           // Line 3
Vec d(3, 4);       // Line 4
d = a;              // Line 5
```

- a) Line 2
- b) Line 3
- c) Line 4
- d) Line 5

---

**Q14.** (3 pts) **(multiple answers possible)** Which are part of the orthodox canonical form?ACD — Correct

- a) Copy constructor
- b) Parameterized constructor (`MyClass(int value)`)
- c) Destructor
- d) Copy assignment operator (`operator=`)

---

**Q15.** (4 pts) What is wrong with this copy constructor?C — Correct

```cpp
class Num {
public:
    Num(Num other) { /* ... */ }
};
```

- a) Constructor name must differ from class name
- b) No error — this is valid
- c) Parameter should be `const Num& other`
- d) Constructor should return `Num`

---

**Q16.** (3 pts) What happens when `d = d` runs?A — Wrong (correct: d)

```cpp
class Data {
    int* arr;
public:
    Data(int n) { arr = new int[n]; }
    ~Data() { delete[] arr; }
    Data& operator=(const Data& other) {
        delete[] arr;
        arr = new int[5];
        for (int i = 0; i < 5; i++) arr[i] = other.arr[i];
        return *this;
    }
};

int main() { Data d(5); d = d; }
```

- a) Data is safely copied
- b) Compilation error
- c) Assignment is silently skipped
- d) `arr` is deleted, then `other.arr` (same memory) is read — undefined behavior

---

**Q17.** (4 pts) A class has `int* data` from `new`. What must a custom copy constructor do that the default does not?A — Correct

- a) Allocate new memory and copy the values
- b) Set `data` to `nullptr` in the copy
- c) Delete the original's data before copying
- d) Call the destructor of the source object

---

**Q18.** (4 pts) In which order are destructors called for local variables?B — Correct

- a) Same order as creation (first created → first destroyed)
- b) Reverse order (last created → first destroyed)
- c) Alphabetical order of variable names
- d) Undefined — depends on the compiler

---

**Q19.** (3 pts) Which is the **postfix** increment operator?B — Correct

- a) `Num& operator++() { val++; return *this; }`
- b) `Num operator++(int) { Num old = *this; val++; return old; }`
- c) `Num operator++() { val++; return *this; }`
- d) `Num& operator++(int) { val++; return *this; }`

---

**Q20.** (4 pts) Which declares `operator<<` so `std::cout << point` works?C — Correct

- a) `void operator<<(const Point& p);`
- b) `std::ostream& Point::operator<<(std::ostream& os);`
- c) `friend std::ostream& operator<<(std::ostream& os, const Point& p);`
- d) `Point& operator<<(std::ostream& os, const Point& p);`

---

**Q21.** (4 pts) Which pair is a valid function overload?B — Correct

- a)

```cpp
int calculate(int a);
double calculate(int a);
```

- b)

```cpp
void print(int x);
void print(double x);
```

- c)

```cpp
int getValue();
int getValue();
```

- d)

```cpp
void process(int a);
int process(int a);
```

---

**Q22.** (3 pts) **(multiple answers possible)** Which operators CAN be overloaded?ACD — Correct

- a) `+` (addition)
- b) `.` (member access)
- c) `==` (comparison)
- d) `<<` (stream output)

---

**Q23.** (3 pts) What does postfix `a++` return?A — Correct

- a) The value before incrementing (old value)
- b) The value after incrementing (new value)
- c) A reference to `a`
- d) Nothing — returns `void`

---

**Q24.** (3 pts) Which line compiles?D — Correct

```cpp
class Student {
    std::string name;
    int grade;
public:
    Student(std::string n, int g) : name(n), grade(g) {}
    std::string getName() const { return name; }
    int getGrade() const { return grade; }
};
Student s("Li Wei", 85);
```

- a) `std::cout << s.name;`
- b) `s.grade = 100;`
- c) `s.name = "Alice";`
- d) `std::cout << s.getName();`

---

**Q25.** (4 pts) Which method can be declared `const`?C — Correct

- a) `void setAge(int a) { age = a; }`
- b) `void reset() { age = 0; name = ""; }`
- c) `int getAge() { return age; }`
- d) `void increment() { count++; }`

---

**Q26.** (3 pts) What happens when you compile this?A — Correct

```cpp
struct A { int x; };
class B  { int x; };

int main() {
    A a; a.x = 10;
    B b; b.x = 10;
}
```

- a) `b.x` fails — class members are private by default
- b) Both compile fine
- c) `a.x` fails — struct members are private by default
- d) Both fail — constructors are required first

---

**Q27.** (3 pts) What is the error?D — Correct

```cpp
class Circle {
    double radius;
public:
    void Circle(double r) { radius = r; }
};
```

- a) Constructors cannot have parameters
- b) Should use `this->radius`
- c) `radius` should be initialized in the class definition
- d) Constructors have no return type — remove `void`

---

**Q28.** (3 pts) What is the error?A — Correct

```cpp
class Timer {
    int seconds;
public:
    Timer(int seconds) { seconds = seconds; }
};
```

- a) `seconds = seconds` assigns parameter to itself — member never set
- b) Parameter cannot share a name with a member
- c) Must use an initializer list instead
- d) No error — member is correctly set

---

**Q29.** (3 pts) A `Student` needs an address (city, zip) and a name. An `Address` class exists. Which design is best?B — Correct

- a)

```cpp
class Student {
    std::string city;
    int zip;
    std::string name;
};
```

- b)

```cpp
class Student {
    Address address;
    std::string name;
};
```

- c)

```cpp
class Student : public Address {
    std::string name;
};
```

- d)

```cpp
class Student {
    std::string data[3];
};
```

---

**Q30.** (3 pts) What does this setter prevent?C — Correct

```cpp
class Student {
    int grade;
public:
    void setGrade(int g) {
        if (g >= 0 && g <= 100) grade = g;
    }
};
```

- a) Grade being read by other classes
- b) Memory leaks on destruction
- c) Grades outside 0–100 being stored
- d) Constructor being called twice
