/* Sakura Island - game state, navigation and glue. */
(function () {
  var cfg = window.GAME_CONFIG;
  var t, esc;
  var SAVE_KEY = "sakura-island-save-v1";
  var GAME_IDS = ["bugs", "fishing", "memory", "rain"];

  var state = null;
  var currentGame = null;
  var currentGameId = null;

  /* ---------- save / load ------------------------------------------------ */

  function defaultState() {
    var games = {};
    GAME_IDS.forEach(function (id) {
      games[id] = { played: false, best: 0, won: false, plays: 0 };
    });
    var gifts = {};
    cfg.gifts.forEach(function (g) {
      gifts[g.id] = false;
    });
    return {
      version: 1,
      started: false,
      bells: 0,
      totalEarned: 0,
      games: games,
      gifts: gifts,
      seen: {},
      finaleSeen: false,
      muted: false,
      lang: cfg.lang,
    };
  }

  function load() {
    var base = defaultState();
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return base;
      var saved = JSON.parse(raw);
      if (!saved || saved.version !== base.version) return base;
      // merge so new games / gifts added later do not break old saves
      GAME_IDS.forEach(function (id) {
        if (saved.games && saved.games[id]) {
          base.games[id] = Object.assign(base.games[id], saved.games[id]);
        }
      });
      Object.keys(base.gifts).forEach(function (id) {
        if (saved.gifts && saved.gifts[id]) base.gifts[id] = true;
      });
      base.started = !!saved.started;
      base.bells = saved.bells || 0;
      base.totalEarned = saved.totalEarned || 0;
      base.seen = saved.seen || {};
      base.finaleSeen = !!saved.finaleSeen;
      base.muted = !!saved.muted;
      base.lang = saved.lang || cfg.lang;
      return base;
    } catch (e) {
      return base;
    }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      /* private mode: the island just forgets */
    }
  }

  /* ---------- helpers ------------------------------------------------------ */

  function el(id) {
    return document.getElementById(id);
  }

  function allGamesPlayed() {
    return GAME_IDS.every(function (id) {
      return state.games[id].played;
    });
  }

  function allGiftsClaimed() {
    return cfg.gifts.every(function (g) {
      return state.gifts[g.id];
    });
  }

  function canAffordAny() {
    return cfg.gifts.some(function (g) {
      return !state.gifts[g.id] && state.bells >= g.price;
    });
  }

  function setBells(value) {
    state.bells = Math.max(0, value);
    el("bells-amount").textContent = state.bells;
  }

  function addBells(amount) {
    setBells(state.bells + amount);
    state.totalEarned += Math.max(0, amount);
  }

  /* ---------- static text --------------------------------------------------- */

  function applyText() {
    cfg.lang = state.lang;
    t = window.UI.t;
    esc = window.UI.esc;

    document.documentElement.lang = cfg.lang;
    document.title = t("game_title");

    el("t-title").textContent = t("game_title");
    el("t-subtitle").textContent = t("game_subtitle");
    el("t-hello").textContent = t("title_hello");
    el("btn-start").textContent = state.started ? t("continue") : t("start");
    el("btn-reset").textContent = t("reset");
    el("btn-lang").textContent = cfg.lang === "fr" ? "EN" : "FR";

    el("map-hint").textContent = t("map_hint");
    GAME_IDS.forEach(function (id) {
      el("spot-" + id).querySelector(".spot-label").textContent = t(
        window.Games[id].nameKey,
      );
    });
    el("spot-shop").querySelector(".spot-label").textContent = t("shop");
    el("spot-plaza").querySelector(".spot-label").textContent =
      t("finale_title");

    el("btn-quit-game").textContent = t("quit");

    el("shop-title").textContent = t("shop_title");
    el("shop-intro").textContent = t("shop_intro");
    el("shop-foot").textContent = t("shop_empty_hint");
    el("btn-shop-back").textContent = t("back_to_island");

    el("passport-title").textContent = t("passport_title");
    el("passport-sub").textContent = t("passport_sub");
    el("btn-passport-back").textContent = t("back_to_island");

    el("finale-title").textContent = t("finale_title");
    el("btn-finale-back").textContent = t("finale_replay");

    el("dialogue-name").textContent = cfg.hostName;
    el("dialogue-avatar").textContent = cfg.hostIcon;
  }

  /* ---------- navigation ----------------------------------------------------- */

  function goMap() {
    stopGame();
    window.UI.stopFireworks();
    el("topbar").hidden = false;
    window.UI.showScreen("map");
    refreshMap();
  }

  function refreshMap() {
    el("shop-badge").hidden = !canAffordAny();
    el("spot-plaza").hidden = !allGiftsClaimed();
  }

  /* ---------- mini games ------------------------------------------------------ */

  function renderStats(stats) {
    var host = el("hud-stats");
    host.innerHTML = "";
    stats.forEach(function (s) {
      var span = document.createElement("span");
      span.className = "stat" + (s.warn ? " warn" : "");
      span.textContent = s.label + " " + s.value;
      host.appendChild(span);
    });
  }

  function stopGame() {
    if (currentGame && currentGame.stop) currentGame.stop();
    currentGame = null;
    currentGameId = null;
    el("game-stage").innerHTML = "";
    el("game-stage").classList.remove("stage-tall");
    el("hud-stats").innerHTML = "";
  }

  function openGame(id, skipIntro) {
    var def = window.Games[id];
    if (!def) return;
    stopGame();
    currentGameId = id;
    el("topbar").hidden = false;
    el("game-title").textContent = t(def.titleKey);
    el("game-hint").textContent = t(def.hintKey);
    window.UI.showScreen("game");
    window.Sound.unlock();

    var api = {
      stage: el("game-stage"),
      setStats: renderStats,
      setHint: function (text) {
        el("game-hint").textContent = text || t(def.hintKey);
      },
      finish: function (result) {
        handleFinish(id, result);
      },
    };

    var begin = function () {
      if (currentGameId !== id) return;
      currentGame = def.start(api);
    };

    if (!skipIntro && !state.games[id].played) {
      window.UI.say([t(def.descKey)], begin);
    } else {
      begin();
    }
  }

  function handleFinish(id, result) {
    var record = state.games[id];
    var isRecord = result.score > record.best;
    record.played = true;
    record.plays++;
    record.best = Math.max(record.best, result.score);
    record.won = record.won || !!result.won;
    addBells(result.bells);
    save();

    if (result.won) window.Sound.play("win");
    else window.Sound.play("lose");
    if (result.won) window.UI.confetti(70);

    var rows = (result.rows || [])
      .map(function (r) {
        return (
          '<div class="modal-row"><span>' +
          esc(r[0]) +
          "</span><span>" +
          esc(r[1]) +
          "</span></div>"
        );
      })
      .join("");

    rows +=
      '<div class="modal-row"><span>' +
      esc(t("you_earned")) +
      "</span><span>🔔 " +
      result.bells +
      "</span></div>";

    if (isRecord && record.plays > 1) {
      rows +=
        '<div class="modal-row"><span>🏅</span><span>' +
        esc(t("new_record")) +
        "</span></div>";
    }

    window.UI.openModal({
      html:
        '<div class="modal-emoji">' +
        (result.won ? "🎉" : "🍀") +
        "</div>" +
        "<h2>" +
        esc(result.won ? t("result_win") : t("result_lose")) +
        "</h2>" +
        "<p>" +
        esc(result.won ? t("result_win_sub") : t("result_lose_sub")) +
        "</p>" +
        '<div class="modal-rows">' +
        rows +
        "</div>",
      buttons: [
        {
          label: t("play_again"),
          onClick: function () {
            openGame(id, true);
          },
        },
        {
          label: t("back_to_island"),
          kind: "ghost",
          onClick: function () {
            goMap();
            afterEarning();
          },
        },
      ],
    });
  }

  /** Dialogue nudges that depend on progress. */
  function afterEarning() {
    if (!state.seen.firstBells && state.totalEarned > 0) {
      state.seen.firstBells = true;
      save();
      window.UI.say(t("dlg_first_bells"));
      return;
    }
    if (!state.seen.shopReady && canAffordAny() && !allGiftsClaimed()) {
      state.seen.shopReady = true;
      save();
      window.UI.say(t("dlg_shop_ready"));
      return;
    }
    if (!state.seen.allGames && allGamesPlayed()) {
      state.seen.allGames = true;
      save();
      window.UI.say(t("dlg_all_games"));
    }
  }

  /* ---------- shop -------------------------------------------------------------- */

  function openShop() {
    el("topbar").hidden = false;
    window.UI.showScreen("shop");
    renderShop();
  }

  function renderShop() {
    window.Gifts.renderShop(el("gift-grid"), state, {
      onRedeem: function (giftId) {
        var gift = window.Gifts.byId(giftId);
        if (state.bells < gift.price || state.gifts[giftId]) return;
        setBells(state.bells - gift.price);
        state.gifts[giftId] = true;
        save();
        renderShop();
        window.Gifts.unwrap(giftId, function () {
          renderShop();
          refreshMap();
          if (allGiftsClaimed() && !state.finaleSeen) {
            window.UI.toast("🎆 " + t("finale_ready"), 2600);
          }
        });
      },
      onView: function (giftId) {
        window.Gifts.view(giftId);
      },
    });
  }

  /* ---------- passport ------------------------------------------------------------ */

  function openPassport() {
    el("topbar").hidden = false;
    var grid = el("stamp-grid");
    grid.innerHTML = "";
    GAME_IDS.forEach(function (id) {
      var def = window.Games[id];
      var rec = state.games[id];
      var stamp = document.createElement("div");
      stamp.className = "stamp" + (rec.played ? " done" : "");
      stamp.innerHTML =
        '<div class="stamp-icon">' +
        def.icon +
        "</div>" +
        '<div class="stamp-name">' +
        esc(t(def.nameKey)) +
        "</div>" +
        '<div class="stamp-best">' +
        (rec.played
          ? esc(t("best")) + ": " + rec.best
          : esc(t("passport_not_yet"))) +
        "</div>";
      grid.appendChild(stamp);
    });

    var claimed = cfg.gifts.filter(function (g) {
      return state.gifts[g.id];
    }).length;

    el("passport-totals").innerHTML =
      "<span>🔔 " +
      esc(t("passport_total")) +
      ": " +
      state.totalEarned +
      "</span><span>🎁 " +
      esc(t("passport_gifts")) +
      ": " +
      claimed +
      " / " +
      cfg.gifts.length +
      "</span>";

    window.UI.showScreen("passport");
  }

  /* ---------- finale ---------------------------------------------------------------- */

  function openFinale() {
    var body = el("letter-body");
    body.innerHTML = "";
    window.UI.letterLines().forEach(function (line, i) {
      var p = document.createElement("p");
      p.textContent = line;
      p.style.animationDelay = 0.3 + i * 0.6 + "s";
      body.appendChild(p);
    });
    el("letter-sign").textContent = "— " + cfg.fromName + " 💛";
    window.UI.showScreen("finale");
    window.Sound.play("win");
    window.UI.fireworks(9000);
    state.finaleSeen = true;
    save();
  }

  function enterPlaza() {
    window.UI.say(t("dlg_finale"), openFinale);
    window.UI.showScreen("map");
  }

  /* ---------- wiring -------------------------------------------------------------------- */

  function bind() {
    el("btn-start").addEventListener("click", function () {
      window.Sound.unlock();
      window.Sound.play("pop");
      el("topbar").hidden = false;
      if (!state.started) {
        state.started = true;
        save();
        window.UI.showScreen("map");
        refreshMap();
        window.UI.say(t("dlg_welcome"));
      } else {
        goMap();
      }
    });

    el("btn-lang").addEventListener("click", function () {
      state.lang = state.lang === "fr" ? "en" : "fr";
      save();
      applyText();
      window.Sound.play("tap");
    });

    el("btn-reset").addEventListener("click", function () {
      if (!window.confirm(t("reset_confirm"))) return;
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (e) {
        /* nothing to forget */
      }
      window.location.reload();
    });

    el("btn-home").addEventListener("click", goMap);
    el("btn-passport").addEventListener("click", openPassport);
    el("btn-passport-back").addEventListener("click", goMap);
    el("btn-shop-back").addEventListener("click", goMap);
    el("btn-quit-game").addEventListener("click", function () {
      goMap();
    });
    el("btn-finale-back").addEventListener("click", goMap);

    el("btn-sound").addEventListener("click", function () {
      state.muted = !state.muted;
      window.Sound.setMuted(state.muted);
      el("sound-icon").textContent = state.muted ? "🔇" : "🔊";
      save();
      window.Sound.play("tap");
    });

    GAME_IDS.forEach(function (id) {
      el("spot-" + id).addEventListener("click", function () {
        window.Sound.play("pop");
        openGame(id);
      });
    });

    el("spot-shop").addEventListener("click", function () {
      window.Sound.play("pop");
      openShop();
    });

    el("spot-plaza").addEventListener("click", function () {
      window.Sound.play("pop");
      enterPlaza();
    });
  }

  /* ---------- boot -------------------------------------------------------------------------- */

  function boot() {
    state = load();
    window.UI.init();
    applyText();
    window.Sound.setMuted(state.muted);
    el("sound-icon").textContent = state.muted ? "🔇" : "🔊";
    setBells(state.bells);
    bind();
    window.UI.showScreen("title");
    el("topbar").hidden = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
