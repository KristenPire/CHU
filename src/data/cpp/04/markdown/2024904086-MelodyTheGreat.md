# Project Report — Melody The Great

| | |
|---|---|
| **Student** | 2024904086 — Melody |
| **Submission** | On time |
| **Final Score** | 88 / 100 |

---

## Overall

"Beast & Blade" is a polished RPG with a full status effects system (Burned, Frozen, Poisoned with turn tracking), weapon-type effectiveness against specific monster types, three hero classes with distinct equipment loadouts, and a shield defense mechanic. The padded box UI and hero selection screen make it play like a polished release. The main technical debt is a Rule of Three violation on Game (raw pointers with a destructor but no copy ctor/assign), and the CMakeLists.txt being in a subdirectory rather than the repo root.

---

## Sections

**Subject Requirements — 28 / 30**
- All five required classes present with all required methods; namespace BeastBlade wraps all classes cleanly
- Four enemies (Phoenix, Ice Dragon, Cobra, Shadow Dragon boss) with distinct special attacks and status effect application
- **CMakeLists.txt not at repo root** (−1) — located at project/CMakeLists.txt instead of repo root
- **README missing items section** (−1) — enemies and end condition listed, but items not described at all

**Clean Code — 28 / 40**
- Extensive decomposition: 30+ methods covering combat flow, attack flow, defense flow, status effects — combat split into combat/handleFrozenTurn/handleStatusEffects/processPlayerChoice/checkBattleEnd/executeEnemyTurn
- Trailing underscore consistent across all classes; namespace BeastBlade provides clean separation
- Inventory canonical form correct; Inventory::operator[] bonus overload for direct item access
- **Rule of Three violated on Game** (−4) — Game stores Character* hero_ and Enemy* currentEnemy_ with a destructor but no copy constructor or copy-assignment operator; copying Game would cause double-free UB

  When only the destructor is defined, the compiler generates a copy constructor and copy-assignment that copy the raw pointer values — so if Game is ever copied, both objects' destructors will call `delete` on the same address, corrupting the heap.

  ```cpp
  // Game.cpp:24-39 — constructor allocates; destructor deletes; no copy ctor/assign defined
  Game::Game()
      : hero_(nullptr), currentEnemy_(nullptr), gameRunning_(true), stage_(1) {}
  // ~Game() deletes hero_ and currentEnemy_ with null checks
  // Missing: Game(const Game&) and Game& operator=(const Game&)
  ```

- **Naming** (−3) — `using namespace std` in Character.cpp and Game.cpp; getDamageBonusAgainst() contains Chinese comment `///用到了吗` ("Is this used?") suggesting potentially dead code; no named constants for enemy stats, weapon bonuses, or status percentages

  A function with a comment asking "is this used?" is a maintenance trap — the next developer can't tell whether to keep it or delete it, and it will stay in the codebase indefinitely because no one is confident enough to remove it.

  ```cpp
  // Game.cpp — getDamageBonusAgainst() with uncertainty comment
  int Game::getDamageBonusAgainst(const Enemy& enemy) const {
      ///用到了吗   // "Is this used?"
      // ... weapon effectiveness calculation ...
  }
  ```

- **Style** (−2) — CMakeLists.txt in subdirectory; `using namespace std` mixed with explicit `using BeastBlade::...`; `static bool firstBattle` in exploreWorld() is function-local mutable state (should be a member); Game.cpp is 759 lines

  A function-local static variable is effectively global mutable state hidden inside a function — it makes the function's behavior depend on invisible side effects from previous calls, which breaks the ability to reset or replay the game without restarting the process.

  ```cpp
  // Game.cpp — exploreWorld() uses a function-local static for first-battle tracking
  void Game::exploreWorld() {
      static bool firstBattle = true;  // persists across calls; invisible to callers
      if (firstBattle) {
          // first-time setup
          firstBattle = false;
      }
      // ...
  }
  ```

**Operator Overloading — 10 / 10**
- All four required operators correctly implemented with full field coverage; operator<< (Character) shows active status with turn count; operator<< (Item) provides detailed type-specific output
- **Bonus: Inventory::operator[]** (const and non-const) — subscript access to items used in drawInventoryPreview()

**Heap / Dynamic Memory — 8 / 10**
- Game manages Character* hero_ and Enemy* currentEnemy_ via new/delete with destructor correctly cleaning both
- **Rule of Three violated** (−2) — destructor present but no copy constructor or copy-assignment operator; Inventory correctly uses STL vector

  The compiler-generated copy constructor for a class with raw pointer members does a shallow copy — both the original and the copy end up pointing to the same heap object, and whoever is destroyed first leaves the other holding a dangling pointer.

  ```cpp
  // Game.hh — hero_ and currentEnemy_ are raw pointers managed by ~Game()
  Character* hero_;          // deleted in ~Game()
  Enemy* currentEnemy_;      // deleted in ~Game()
  // No Game(const Game&) or Game& operator=(const Game&) defined
  ```

**Inheritance — 5 / 10**
- `Enemy : public Character` — valid is-a relationship; Enemy adds MonsterType enum and type-specific special attacks (phoenixAttack, iceDragonAttack, cobraAttack with status effects); randomAction() dispatches by type
- **No virtual dispatch** (−2) — specialAttack() and randomAction() are non-virtual; calling through Character* would not dispatch polymorphically; weapon effectiveness on Item rather than Enemy subclasses misses a cleaner design

  Non-virtual methods on a derived class are invisible through a base-class pointer — if `currentEnemy_` were ever stored as `Character*` instead of `Enemy*`, none of the special attacks or status effects would be reachable, making the entire Enemy subclass hierarchy inert.

  ```cpp
  // Enemy.hh — specialAttack() and randomAction() are regular (non-virtual) methods
  class Enemy : public Character {
  public:
      void specialAttack(Character& target, int defenderBonusDEF);  // not virtual
      void randomAction(Character& hero, int defenderBonusDEF);     // not virtual
      // Calling via Character* would call Character's version (or nothing)
  };
  ```

- **No virtual destructor on Character** (−2) — unsafe base class design; override keyword not used (−1)

  Without a virtual destructor on Character, deleting an Enemy object through a Character pointer calls only `~Character()` — any data members Enemy adds (like the MonsterType enum or status tracking) are not properly cleaned up, and the behaviour is undefined.

  ```cpp
  // Character.hh — no virtual destructor; Enemy inherits from Character
  class Character {
  public:
      // ~Character() not declared virtual
      // If code does: Character* p = new Enemy(...); delete p;
      // only ~Character() runs — undefined behaviour
  };
  ```

## Bonus

**Bonus score: 9 / 10**

A status effects system where Frozen skips your entire turn, Burned ticks HP every round, and Poisoned halves your effective stats — that's a real combat system, not just flavored damage. Layering weapon-type effectiveness on top of that (Bow vs Phoenix, Dagger vs Cobra) means every fight has a right answer and a wrong answer.

The padded box UI with aligned stat rows, the hero selection screen showing full class stats before you pick, three distinct hero loadouts — this plays like a polished release, not a coursework submission.

**Clean Code note:** The 30+ method decomposition in Game.cpp is impressive and shows real discipline in breaking combat into discrete phases (handleFrozenTurn, handleStatusEffects, processPlayerChoice, checkBattleEnd, executeEnemyTurn). The main technical debt is the Rule of Three violation on Game — hero_ and currentEnemy_ are raw pointers with a destructor but no copy constructor or assignment operator. Wrapping those in unique_ptr would fix it cleanly. The Chinese "is this used?" comment in getDamageBonusAgainst() is a small charm — honest uncertainty about live code is relatable.
