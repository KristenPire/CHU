# Project Report — Robin The Wise

| | |
|---|---|
| **Student** | 2024902589 — Robin The Wise |
| **Submission** | On time |
| **Final Score** | 100 / 100 |

---

## Overall

SCREAMER is the most ambitious game in the batch — a horror survival game where you navigate a 5x5 room grid with a dying flashlight while something hunts you, collecting scattered notes that tell a creepy story in fragments. The multi-module architecture (World, IPlace, Input, Output, Recorder as separate translation units), flashlight battery mechanic, ANSI map visualization, and achievement system all go well beyond the assignment. The main technical gap is Inventory's operator<< being declared but never implemented, which costs 2 points directly.

---

## Sections

**Subject Requirements — 29 / 30**
- All 5 required classes fully implemented; rich Inventory helpers (removeFirstByType, bestWeaponDamage, armorBonus)
- Two distinct outcomes: player death (HP = 0 or flashlight dead) and victory (start generator)
- Student ID present in README; win/lose conditions explicitly listed with item values
- **Enemies not individually described in README** (−1) — listed only as "10 monsters" with no names or HP/ATK/DEF stats

**Clean Code — 34 / 40**
- Excellent multi-module decomposition: World, Place, IPlace interface, Input, Output, Recorder all as separate translation units
- Logic/display separation enforced throughout (UI::printPlayerAttack, UI::drawHUD, etc.)
- Leading underscore consistent on all private members across all classes; no `using namespace std`
- **\_flee() at ~35 lines** (−1) — inline validation logic mixed with flee/attack handling; extracting validateDestinationRoom() would focus it
- **explorationLoop() at ~46 lines with duplicated p/b cases** (−1) — item-use code duplicated between explorationLoop and battleLoop

  When the same item-use logic appears in both `explorationLoop` and `battleLoop`, fixing a bug in one branch leaves the other broken — a classic maintenance trap.

  ```cpp
  // Game.cpp — 'p' (potion) and 'b' (battery) cases exist in both loops
  // explorationLoop handles 'p'/'b' inline
  // battleLoop handles the same 'p'/'b' keys with near-identical code
  // A shared useItem(char cmd) helper would remove the duplication
  ```

**Operator Overloading — 4 / 10**
- operator<< (Character): prints name, HP/maxHP, ATK, DEF correctly
- operator== (Item): compares name and type (missing value field)
- **operator<< (Inventory) not implemented** (−2) — declared as friend in header but absent from all source files; would cause a linker error if called

  A declared-but-unimplemented function compiles silently but produces a linker error the first time it is called — the game only avoids crashing because `drawHUD` counts items directly instead of using `operator<<`.

  ```cpp
  // Inventory.cpp — operator<< is entirely absent from this file
  // The only inventory output is via Inventory::print() (line 72):
  void Inventory::print() const {
      if (_items.empty()) { std::cout << "Inventory is empty.\n"; return; }
      for (std::size_t i = 0; i < _items.size(); ++i)
          std::cout << "  - " << _items[i] << "\n";
  }
  // Inventory.hh declares: friend std::ostream& operator<<(std::ostream&, const Inventory&)
  // That friend is never defined anywhere in the project
  ```

- **operator<< (Item) incomplete** (−1) — delegates to toString() which shows name and description only; no explicit type label or value as separate fields

  Omitting the type and numeric value from `operator<<` means the operator cannot be used to show a player what an item does — they see the name and a description string but not the stat effect.

  ```cpp
  // Item.cpp:51 — toString() used by operator<<
  std::string Item::toString() const {
      return _name + " - " + _description;
  }
  std::ostream& operator<<(std::ostream& os, const Item& item) {
      os << item.toString();   // type and _value never printed
      return os;
  }
  ```

**Heap / Dynamic Memory — 9 / 10**
- Game stores `Player* _player` and `Enemy* _currentEnemy` as raw owning pointers; both deleted in ~Game(); copy = delete prevents double-free
- Inventory uses `std::vector<Item>` by value — no manual memory management needed
- **_player as raw owning pointer** (−1) — Player could be stored by value or as `std::unique_ptr<Player>`; raw pointer adds ownership complexity for no benefit

  A raw owning pointer requires manual `delete` in the destructor and makes exception safety harder — if the constructor throws after `new Player` but before storing it, the allocation leaks. `std::unique_ptr` handles both cases automatically.

  ```cpp
  // Game.cpp:7 — _player initialized to nullptr, allocated later in setup()
  Game::Game()
      : _player(nullptr), _currentEnemy(nullptr), ...
  // Game.cpp:21 — manual deletion required
  Game::~Game() {
      delete _player;
      delete _currentEnemy;
  }
  // std::unique_ptr<Player> _player; would handle this automatically
  ```

**Inheritance — 7 / 10**
- Player adds rich behavior: Inventory, flashlight mechanic, getAttackPower(), getDefensePower(), usePotion(), useBattery()
- Enemy adds `void attack(Player& player)` — meaningful enemy behavior
- Virtual destructor present; no object slicing (Game stores via pointers)
- **No virtual dispatch** (−2) — Character declares no virtual methods beyond destructor; Player and Enemy add methods but override nothing; inheritance used for code reuse only, not polymorphism

  Without virtual methods, a `Character*` cannot be used to call `Player::usePotion()` or `Enemy::attack()` — any code that holds a `Character*` must downcast to access the actual behavior, defeating the purpose of the hierarchy.

  ```cpp
  // Character.cpp:7 — constructor only; no virtual methods declared
  // virtual ~Character() is present, but no virtual attack(), no virtual takeTurn()
  // Enemy adds attack(Player&) and Player adds usePotion() as new methods,
  // not overrides — so Character& cannot dispatch to either
  ```

- **override keyword absent** (−1) — no non-destructor virtual methods to override

## Bonus

**Bonus score: 17 / 10**

SCREAMER is the most ambitious game in the batch. The horror survival concept — alone in the dark, navigating a 5x5 grid with a dying flashlight while something hunts you — is genuinely tense. The scattered notes telling a creepy story in fragments ("IT HUNTS THOSE WHO STARE", the diary entries, the emergency radio frequency) make chest-hunting feel rewarding beyond just loot.

The ANSI map, slowPrint animation, achievement system (EXTERMINATOR, ARCHIVIST), and glitch effect on the death screen are all polish that goes well beyond the assignment. This is a game you'd actually want to play.

**Clean Code note:**
The multi-module architecture is excellent — World, Place, IPlace, Input, Output, and Recorder all as separate translation units shows real structural thinking, and the logic/display separation is enforced throughout. The Inventory is particularly clean: STL vector by value, copy = delete, rich helpers like removeFirstByType and bestWeaponDamage. Method names like consumeTurnAndCheckFlashlight say exactly what they do. The main rough edges are \_flee() getting a bit long with inline validation logic mixed in, and the p/b item cases in explorationLoop and battleLoop duplicating each other — small extractions would clean those right up.
