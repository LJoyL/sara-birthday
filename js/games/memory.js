/* Memory match - a DOM based mini-game (cards, not canvas). */
(function () {
  var DEFAULTS = {
    parMoves: 16,
    parSeconds: 60,
    baseBells: 800,
    bellsPerExtraMove: 18,
    bellsPerExtraSecond: 4,
    minBells: 220,
    symbols: ["🌸", "🍣", "🥤", "🐰", "🌿", "🪙", "🦻", "💃"],
  };

  /** Keeps the board close to square whatever number of pairs is configured. */
  function gridCols(cards) {
    var start = Math.ceil(Math.sqrt(cards));
    for (var c = start; c <= cards; c++) {
      if (cards % c === 0) return c;
    }
    return start;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  window.Games.memory = {
    id: "memory",
    icon: "☕",
    nameKey: "memory_name",
    shortKey: "memory_short",
    titleKey: "memory_title",
    descKey: "memory_desc",
    hintKey: "memory_hint",

    start: function (api) {
      var t = window.UI.t;
      var S = window.Settings.forGame("memory", DEFAULTS);
      var SYMBOLS = S.symbols;
      var PAIRS = SYMBOLS.length;
      var PAR_MOVES = S.parMoves;
      var moves = 0;
      var found = 0;
      var seconds = 0;
      var busy = false;
      var finished = false;
      var first = null;

      var board = document.createElement("div");
      board.className = "memory-board";
      var cols = gridCols(PAIRS * 2);
      board.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
      board.style.gridTemplateRows =
        "repeat(" + Math.ceil((PAIRS * 2) / cols) + ", 1fr)";
      api.stage.innerHTML = "";
      api.stage.classList.add("stage-tall");
      api.stage.appendChild(board);

      var deck = shuffle(SYMBOLS.concat(SYMBOLS));

      function updateHud() {
        api.setStats([
          { label: t("memory_pairs"), value: found + " / " + PAIRS },
          { label: t("memory_moves"), value: String(moves) },
          { label: t("time"), value: seconds + "s" },
        ]);
      }

      var ticker = setInterval(function () {
        if (finished) return;
        seconds++;
        updateHud();
      }, 1000);

      deck.forEach(function (symbol) {
        var card = document.createElement("button");
        card.className = "card";
        card.innerHTML =
          '<span class="card-inner">' +
          '<span class="card-face card-back">🌸</span>' +
          '<span class="card-face card-front">' +
          symbol +
          "</span>" +
          "</span>";
        card.dataset.symbol = symbol;
        card.addEventListener("click", function () {
          flip(card);
        });
        board.appendChild(card);
      });

      function flip(card) {
        if (finished || busy) return;
        if (
          card.classList.contains("flipped") ||
          card.classList.contains("matched")
        )
          return;
        card.classList.add("flipped");
        window.Sound.play("pop");

        if (!first) {
          first = card;
          return;
        }

        moves++;
        updateHud();

        if (first.dataset.symbol === card.dataset.symbol) {
          var a = first,
            b = card;
          first = null;
          found++;
          setTimeout(function () {
            a.classList.add("matched");
            b.classList.add("matched");
            window.Sound.play("match");
            updateHud();
            if (found === PAIRS) finish();
          }, 260);
        } else {
          busy = true;
          var x = first,
            y = card;
          first = null;
          setTimeout(function () {
            x.classList.remove("flipped");
            y.classList.remove("flipped");
            window.Sound.play("tap");
            busy = false;
          }, 760);
        }
      }

      updateHud();

      function finish() {
        if (finished) return;
        finished = true;
        clearInterval(ticker);
        var movePenalty = Math.max(0, moves - PAR_MOVES) * S.bellsPerExtraMove;
        var timePenalty =
          Math.max(0, seconds - S.parSeconds) * S.bellsPerExtraSecond;
        var bells = Math.max(
          S.minBells,
          S.baseBells - movePenalty - timePenalty,
        );
        var perfect = moves <= PAR_MOVES + 4;
        setTimeout(function () {
          api.finish({
            won: true,
            score: PAIRS,
            bells: bells,
            rows: [
              [t("memory_moves"), String(moves)],
              [t("time"), seconds + "s"],
            ],
            extra: perfect ? "🏅" : null,
          });
        }, 500);
      }

      return {
        stop: function () {
          finished = true;
          clearInterval(ticker);
        },
      };
    },
  };
})();
