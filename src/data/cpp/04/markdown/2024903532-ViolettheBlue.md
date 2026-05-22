# Project Report — Violet the Blue

| | |
|---|---|
| **Student** | 2024903532 — Violet the Blue |
| **Submission** | On time |
| **Final Score** | 90 / 100 |

---

## Overall

A 斗破苍穹 (Battle Through the Heavens) RPG where Xiao Yan fights Nalan Yanran to honor the Three-Year Pact. The game is fully committed to its source material — Chinese-language dialogue, named attacks like 八极崩, items like 回气丹 and 玄铁重尺 — and that thematic consistency is its real strength. It's focused and complete. The main deductions are no inheritance hierarchy and a `playerTurn()` function that does too much.

---

## Sections

**Subject Requirements — 29 / 30**
- All required classes correctly implemented; both victory and defeat paths render narrative endings
- Rich README: full story background with Dou Qi Continent context, Nalan Yanran with HP/ATK/DEF stats, items listed with effects
- **End condition not stated in README** (−1) — win/loss conditions not explicitly described

**Clean Code — 36 / 40**
- Excellent scene decomposition: `run()` (5 lines), `executeCombat()` (9 lines), `introScene()` (7 lines), `pickupItems()` (12 lines), `finalConfrontation()` (18 lines), `calculateDamage()` (4 lines) — all appropriately sized
- `calculateDamage()` returns `std::max(1, base)` for proper minimum damage; `clearInput()` handles cin state correctly
- **`playerTurn()` at 63 lines** (−2) — handles three player-action branches AND includes the enemy counter-attack logic inline (lines 96–104); enemy attack should live in the declared `enemyTurn()` method

  Placing the enemy's attack inside `playerTurn()` means the combat flow cannot be changed independently for each side — if you want the enemy to sometimes skip a turn or get a double attack, you must restructure the entire 63-line function rather than modifying a focused `enemyTurn()`.

  ```cpp
  // Game.cpp:93 — enemy attack embedded at the end of playerTurn()
      if (!enemy_.isAlive()) return false;

      // Enemy Turn — this code belongs in enemyTurn()
      int dmg = calculateDamage(enemy_.getATK(), hero_.getDEF());
      if (defending) dmg = dmg / 2;
      if (dmg == 0) dmg = 1;
      hero_.takeDamage(dmg);
      std::cout << "<< 纳兰嫣然冷哼一声，风之极掠杀！萧炎受到 " << dmg << " 点伤害。\n";
  ```

- **`enemyTurn()` declared but unused** (−1 naming) — declared in Game.hh, but enemy attack is implemented inside `playerTurn()` — misleading interface

  A method declared in the header but never implemented creates a gap between the interface (what the class claims to do) and the reality (what it actually does), which confuses anyone reading the header and makes the code harder to maintain.

  ```cpp
  // Game.hh — enemyTurn() declared as a public method
  // Game.cpp:107 — executeCombat() calls playerTurn() in a loop; enemyTurn() is never called
  void Game::executeCombat() {
      while (hero_.isAlive() && enemy_.isAlive() && game_running_) {
          if (!playerTurn()) break;   // enemy attack happens inside playerTurn()
      }
  }
  // enemyTurn() exists in the header but has no call site anywhere
  ```

**Operator Overloading — 8 / 10**
- All four required operators correct and complete; `operator<<` (Item) is type-aware with a proper switch printing name, type string, and value; `operator<<` (Inventory) handles empty case in Chinese ("背包为空")
- No bonus overloads (−2)

  Two additional points were available for any operator that fits naturally in your code — `operator+=` for healing, `operator-=` for damage, `operator<` for comparing item values, or `operator+` for merging inventories are all common choices in an RPG.

**Heap / Dynamic Memory — 10 / 10**
- All state held by value: `Character hero_`, `Character enemy_`, `Inventory inventory_` in Game; Inventory uses `std::vector<Item>`. No raw owning pointers. Full marks.

**Inheritance — 0 / 10**
- Not used. Since `enemyTurn()` is declared but never called — the enemy's counter-attack lives inside `playerTurn()` — the natural fix is a `Combatant` base class with `Hero` and `NalanYanran` subclasses each overriding a virtual `takeTurn()`, letting `executeCombat()` call `hero_.takeTurn()` and `enemy_.takeTurn()` symmetrically and finally give `enemyTurn()` a real call site.

## Bonus

**Bonus score: 6 / 10**

Setting your game in 斗破苍穹 and committing to it fully — Chinese-language dialogue, named attacks like 八极崩, item names that fit the world (回气丹, 玄铁重尺, 粗布护甲) — gives this a coherence that generic fantasy RPGs rarely have. The victory line "三年之后，我必亲自上云岚宗，败你纳兰嫣然！" is a genuinely satisfying payoff.

The defend mechanic adding a real decision beyond just attacking is a small thing that makes each turn feel less automatic. It's a focused, complete game, and the care for the source material comes through clearly.

**Clean Code note:** The code is clean and well-structured for its scope — `calculateDamage()` returning `std::max(1, base)` with a variance roll, `clearInput()` handling cin state properly, and `executeCombat()` as a focused 9-line loop all reflect solid habits. The scene decomposition (`introScene` → `pickupItems` → `finalConfrontation` → `executeCombat`) maps directly to the game's narrative beats, which makes the flow genuinely easy to follow. The one inconsistency worth addressing is `enemyTurn()` being declared in Game.hh but the enemy attack actually living inside `playerTurn()` — the interface implies something that isn't there, which creates confusion for anyone reading the header.
