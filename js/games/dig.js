/* Fossil Dig - a small deduction puzzle. Numbers count the fossils touching a tile. */
(function () {
  var COLS = 6;
  var ROWS = 4;
  var FOSSILS = 5;
  var DIGS = 13;
  var GOAL = 4;
  var TREASURE = ["🦴", "🦕", "🐚", "🗿", "💎"];

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
      var total = COLS * ROWS;
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
        buried[index] = TREASURE[n % TREASURE.length];
      });

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
            '<span class="dig-face">' + buried[index] + "</span>";
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
            '<span class="dig-face">' + buried[index] + "</span>";
        });
      }

      function finish() {
        if (finished) return;
        finished = true;
        revealAll();
        var won = found >= GOAL;
        var bells = found * 170 + digsLeft * 25 + (won ? 180 : 0);
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
