/* Memory match - a DOM based mini-game (cards, not canvas). */
(function () {
  var SYMBOLS = ["🌸", "🍡", "🐱", "⭐", "🍜", "🎐", "🦊", "☕"];
  var PAIRS = SYMBOLS.length;
  var PAR_MOVES = 16;

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
    titleKey: "memory_title",
    descKey: "memory_desc",
    hintKey: "memory_hint",

    start: function (api) {
      var t = window.UI.t;
      var moves = 0;
      var found = 0;
      var seconds = 0;
      var busy = false;
      var finished = false;
      var first = null;

      var board = document.createElement("div");
      board.className = "memory-board";
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
        var movePenalty = Math.max(0, moves - PAR_MOVES) * 18;
        var timePenalty = Math.max(0, seconds - 60) * 4;
        var bells = Math.max(220, 800 - movePenalty - timePenalty);
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
