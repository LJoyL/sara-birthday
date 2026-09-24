/* Fossil Dig - a small deduction puzzle. Numbers count the fossils touching a tile. */
(function () {
  var DEFAULTS = {
    cols: 6,
    rows: 4,
    fossils: 5,
    digs: 13,
    goal: 4,
    bellsPerFossil: 80,
    bellsPerSpareDig: 12,
    winBonus: 240,
    treasures: [
      { glyph: "🪙", name: "Coin from the Mists" },
      { glyph: "💎", name: "Bead of Atium" },
      { glyph: "🌿", name: "Maomao's Herb" },
      { glyph: "🌸", name: "Pressed Flower" },
      { glyph: "🪭", name: "Fan from Seville" },
    ],
  };

  window.Games.dig = {
    id: "dig",
    icon: "🦴",
    nameKey: "dig_name",
    shortKey: "dig_short",
    titleKey: "dig_title",
    descKey: "dig_desc",
    hintKey: "dig_hint",

    start: function (api) {
      var t = window.UI.t;
      var S = window.Settings.forGame("dig", DEFAULTS);
      var COLS = S.cols;
      var ROWS = S.rows;
      var TREASURE = S.treasures;
      var total = COLS * ROWS;
      var FOSSILS = Math.max(1, Math.min(S.fossils, total));
      var DIGS = Math.max(1, Math.min(S.digs, total));
      var GOAL = Math.min(S.goal, FOSSILS);
      var buried = [];
      var dug = [];
      var found = 0;
      var digsLeft = DIGS;
      var finished = false;

      for (var i = 0; i < total; i++) {
        buried.push(null);
        dug.push(false);
      }

      var spots = [];
      for (var s = 0; s < total; s++) spots.push(s);
      for (var k = spots.length - 1; k > 0; k--) {
        var j = (Math.random() * (k + 1)) | 0;
        var tmp = spots[k];
        spots[k] = spots[j];
        spots[j] = tmp;
      }
      spots.slice(0, FOSSILS).forEach(function (index, n) {
        var raw = TREASURE[n % TREASURE.length];
        buried[index] =
          typeof raw === "string" ? { glyph: raw, name: "" } : raw;
      });

      var hintTimer = null;
      function flashName(name) {
        if (!name) return;
        api.setHint(name);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(function () {
          if (!finished) api.setHint(t("dig_hint"));
        }, 1600);
      }

      function neighbours(index) {
        var cx = index % COLS;
        var cy = (index / COLS) | 0;
        var list = [];
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            var nx = cx + dx;
            var ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
            list.push(ny * COLS + nx);
          }
        }
        return list;
      }

      function hintFor(index) {
        return neighbours(index).filter(function (n) {
          return buried[n];
        }).length;
      }

      var board = document.createElement("div");
      board.className = "dig-board";
      api.stage.innerHTML = "";
      api.stage.classList.add("stage-tall");
      api.stage.appendChild(board);

      function updateHud() {
        api.setStats([
          { label: t("dig_found"), value: found + " / " + FOSSILS },
          {
            label: t("dig_digs"),
            value: String(digsLeft),
            warn: digsLeft <= 3,
          },
        ]);
      }
      updateHud();

      var cells = [];
      for (var c = 0; c < total; c++) {
        (function (index) {
          var cell = document.createElement("button");
          cell.className = "dig-cell";
          cell.innerHTML = '<span class="dig-face">⛰️</span>';
          cell.addEventListener("click", function () {
            digAt(index, cell);
          });
          board.appendChild(cell);
          cells.push(cell);
        })(c);
      }

      function digAt(index, cell) {
        if (finished || dug[index] || digsLeft <= 0) return;
        dug[index] = true;
        digsLeft--;
        cell.classList.add("dug");

        if (buried[index]) {
          found++;
          cell.classList.add("fossil");
          cell.innerHTML =
            '<span class="dig-face">' + buried[index].glyph + "</span>";
          if (buried[index].name) cell.title = buried[index].name;
          flashName(buried[index].name);
          window.Sound.play("catch");
          var r = cell.getBoundingClientRect();
          window.UI.burst(r.left + r.width / 2, r.top + r.height / 2, 22, [
            "#ffe066",
            "#fff1a8",
            "#ffd6e8",
          ]);
        } else {
          var n = hintFor(index);
          cell.innerHTML =
            '<span class="dig-hint' +
            (n ? "" : " zero") +
            '">' +
            (n ? n : "·") +
            "</span>";
          window.Sound.play("dig");
        }

        updateHud();
        if (found >= FOSSILS || digsLeft <= 0) finish();
      }

      function revealAll() {
        cells.forEach(function (cell, index) {
          if (dug[index] || !buried[index]) return;
          cell.classList.add("missed");
          cell.innerHTML =
            '<span class="dig-face">' + buried[index].glyph + "</span>";
        });
      }

      function finish() {
        if (finished) return;
        finished = true;
        revealAll();
        var won = found >= GOAL;
        var bells =
          found * S.bellsPerFossil +
          digsLeft * S.bellsPerSpareDig +
          (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: found,
            bells: bells,
            rows: [
              [t("dig_found"), found + " / " + FOSSILS],
              [t("dig_digs"), String(digsLeft)],
            ],
          });
        }, 900);
      }

      return {
        stop: function () {
          finished = true;
        },
      };
    },
  };
})();
