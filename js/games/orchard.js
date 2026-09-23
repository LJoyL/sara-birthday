/* Perfect Picking - pick each fruit in the short moment it is ripe. */
(function () {
  var E = window.Engine;

  var DEFAULTS = {
    duration: 45,
    goal: 10,
    onTree: 4,
    ripenFrom: 0.3,
    ripenTo: 0.46,
    perfectFrom: 0.78,
    perfectTo: 1.02,
    overripeAt: 1.28,
    bellsPerPerfect: 60,
    bellsPerLate: 18,
    winBonus: 180,
    fruit: [
      { glyph: "🍊", name: "Valencia Orange" },
      { glyph: "🌸", name: "Orange Blossom" },
      { glyph: "🌺", name: "Carnation" },
      { glyph: "🌷", name: "Tulip" },
      { glyph: "🌿", name: "Maomao's Herb" },
      { glyph: "🍄", name: "Curious Mushroom" },
      { glyph: "🍑", name: "Peach" },
    ],
  };

  window.Games.orchard = {
    id: "orchard",
    icon: "🍑",
    nameKey: "orchard_name",
    shortKey: "orchard_short",
    titleKey: "orchard_title",
    descKey: "orchard_desc",
    hintKey: "orchard_hint",

    start: function (api) {
      var S = window.Settings.forGame("orchard", DEFAULTS);
      var DURATION = S.duration;
      var GOAL = S.goal;
      var RIPE_FROM = S.perfectFrom;
      var RIPE_TO = S.perfectTo;
      var GOOD_TO = S.overripeAt;

      var size = E.logicalSize(api.stage, 640);
      var W = size.w,
        H = size.h;
      var t = window.UI.t;

      var CANOPY_BOTTOM = H * 0.62;
      var fruits = [];
      var pops = [];
      var sparks = [];
      var perfect = 0;
      var late = 0;
      var picked = 0;
      var score = 0;
      var timeLeft = DURATION;
      var shownSecond = DURATION;
      var finished = false;
      var basket = { squash: 0 };

      function fruitOf(entry) {
        if (typeof entry === "string") return { glyph: entry, name: "" };
        return { glyph: entry.glyph, name: entry.name || "" };
      }

      var hintTimer = null;
      function flashName(name) {
        if (!name) return;
        api.setHint(name);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(function () {
          if (!finished) api.setHint(t("orchard_hint"));
        }, 1400);
      }

      function spawnFruit() {
        var tries = 0;
        var x, y;
        var fruit = fruitOf(E.pick(S.fruit));
        do {
          x = E.rand(60, W - 60);
          y = E.rand(70, CANOPY_BOTTOM - 40);
          tries++;
        } while (tries < 20 && tooClose(x, y));
        fruits.push({
          x: x,
          y: y,
          glyph: fruit.glyph,
          name: fruit.name,
          ripe: E.rand(0, 0.18),
          speed: E.rand(S.ripenFrom, S.ripenTo),
          sway: Math.random() * 6,
          gone: 0,
        });
      }

      function tooClose(x, y) {
        return fruits.some(function (f) {
          return Math.hypot(f.x - x, f.y - y) < 76;
        });
      }

      for (var i = 0; i < S.onTree; i++) spawnFruit();

      function updateHud() {
        api.setStats([
          {
            label: t("time"),
            value: Math.ceil(timeLeft) + "s",
            warn: timeLeft <= 10,
          },
          { label: t("orchard_perfect"), value: perfect + " / " + GOAL },
          { label: t("score"), value: String(score) },
        ]);
      }
      updateHud();

      function pop(x, y, text, color) {
        pops.push({ x: x, y: y, text: text, life: 0.9, color: color });
      }

      function sparkle(x, y, color) {
        for (var s = 0; s < 10; s++) {
          var a = Math.random() * Math.PI * 2;
          sparks.push({
            x: x,
            y: y,
            vx: Math.cos(a) * E.rand(40, 150),
            vy: Math.sin(a) * E.rand(40, 150),
            life: E.rand(0.3, 0.7),
            c: color,
          });
        }
      }

      function pick(x, y) {
        if (finished) return;
        var hit = null;
        var bestD = 999;
        fruits.forEach(function (f) {
          if (f.gone) return;
          var d = Math.hypot(f.x - x, f.y - y);
          if (d < 42 && d < bestD) {
            bestD = d;
            hit = f;
          }
        });
        if (!hit) {
          window.Sound.play("tap");
          return;
        }

        picked++;
        basket.squash = 0.25;
        flashName(hit.name);
        if (hit.ripe >= RIPE_FROM && hit.ripe <= RIPE_TO) {
          perfect++;
          score += 100;
          pop(hit.x, hit.y - 26, t("orchard_nice"), "#ffe9a8");
          sparkle(hit.x, hit.y, "#ffe066");
          window.Sound.play("catch");
        } else if (hit.ripe > RIPE_TO) {
          late++;
          score += 40;
          pop(hit.x, hit.y - 26, t("orchard_late"), "#ffd0a8");
          window.Sound.play("pop");
        } else {
          score += 10;
          pop(hit.x, hit.y - 26, t("orchard_early"), "#d9f0ff");
          window.Sound.play("pop");
        }
        updateHud();
        hit.gone = 0.001;
      }

      var engine = E.create(api.stage, {
        width: W,
        height: H,
        onPress: pick,

        update: function (dt) {
          if (finished) return;
          timeLeft -= dt;
          if (Math.ceil(timeLeft) !== shownSecond) {
            shownSecond = Math.ceil(timeLeft);
            updateHud();
          }
          if (timeLeft <= 0) {
            timeLeft = 0;
            finish();
            return;
          }

          if (basket.squash > 0)
            basket.squash = Math.max(0, basket.squash - dt);

          for (var i = fruits.length - 1; i >= 0; i--) {
            var f = fruits[i];
            f.sway += dt * 2;
            if (f.gone) {
              f.gone += dt;
              if (f.gone > 0.35) {
                fruits.splice(i, 1);
                spawnFruit();
              }
              continue;
            }
            f.ripe += f.speed * dt;
            if (f.ripe > GOOD_TO) {
              // left on the branch too long: it drops
              f.gone = 0.001;
              pop(f.x, f.y, "💧", "#c8b39a");
              window.Sound.play("miss");
            }
          }

          for (var p = pops.length - 1; p >= 0; p--) {
            pops[p].y -= 30 * dt;
            pops[p].life -= dt;
            if (pops[p].life <= 0) pops.splice(p, 1);
          }
          for (var s = sparks.length - 1; s >= 0; s--) {
            var sp = sparks[s];
            sp.x += sp.vx * dt;
            sp.y += sp.vy * dt;
            sp.vy += 200 * dt;
            sp.life -= dt;
            if (sp.life <= 0) sparks.splice(s, 1);
          }
        },

        draw: function (ctx) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, "#ffe8c9");
          sky.addColorStop(0.55, "#ffeede");
          sky.addColorStop(1, "#cdeeb0");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          // canopy
          ctx.fillStyle = "#6fbf5c";
          [
            [W * 0.2, 40, 150, 90],
            [W * 0.52, 10, 190, 110],
            [W * 0.84, 44, 150, 86],
            [W * 0.34, 96, 170, 90],
            [W * 0.7, 100, 170, 88],
          ].forEach(function (c) {
            ctx.beginPath();
            ctx.ellipse(c[0], c[1], c[2], c[3], 0, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.fillStyle = "rgba(255,255,255,0.14)";
          ctx.beginPath();
          ctx.ellipse(W * 0.45, 30, 220, 70, 0, 0, Math.PI * 2);
          ctx.fill();

          // trunks
          ctx.fillStyle = "#a9773f";
          [W * 0.16, W * 0.5, W * 0.86].forEach(function (x) {
            E.roundRect(
              ctx,
              x - 16,
              CANOPY_BOTTOM - 40,
              32,
              H - CANOPY_BOTTOM + 10,
              10,
            );
            ctx.fill();
          });

          // grass
          ctx.fillStyle = "#8fd67a";
          ctx.fillRect(0, H - 54, W, 54);
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.fillRect(0, H - 54, W, 6);

          // basket
          var bs = 1 + basket.squash * 0.5;
          E.emoji(ctx, "🧺", W / 2, H - 26, 40 * bs);

          fruits.forEach(function (f) {
            var gone = f.gone ? Math.min(1, f.gone / 0.35) : 0;
            var ripeT = E.clamp(f.ripe, 0, 1.3);
            var sizeF = 16 + ripeT * 20;
            var wob = Math.sin(f.sway) * 2;

            // stem
            ctx.strokeStyle = "#5c8f3f";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(f.x, f.y - sizeF * 0.7 + wob);
            ctx.lineTo(f.x - 2, f.y - sizeF * 0.7 - 14 + wob);
            ctx.stroke();

            // ripeness ring
            var ring =
              f.ripe >= RIPE_FROM && f.ripe <= RIPE_TO
                ? "#ffcf3f"
                : f.ripe > RIPE_TO
                  ? "#c58a5a"
                  : "rgba(255,255,255,0.55)";
            ctx.save();
            ctx.globalAlpha =
              (1 - gone) * (f.ripe >= RIPE_FROM && f.ripe <= RIPE_TO ? 1 : 0.7);
            ctx.strokeStyle = ring;
            ctx.lineWidth = f.ripe >= RIPE_FROM && f.ripe <= RIPE_TO ? 5 : 3;
            ctx.beginPath();
            ctx.arc(f.x, f.y + wob, sizeF * 0.85 + 6, 0, Math.PI * 2);
            ctx.stroke();
            if (f.ripe >= RIPE_FROM && f.ripe <= RIPE_TO) {
              ctx.globalAlpha = 0.25 * (1 - gone);
              ctx.fillStyle = "#ffcf3f";
              ctx.fill();
            }
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 1 - gone;
            ctx.translate(0, gone * 40);
            E.emoji(ctx, f.glyph, f.x, f.y + wob, sizeF * (1 + gone * 0.2));
            ctx.restore();
          });

          sparks.forEach(function (p) {
            ctx.globalAlpha = Math.max(0, p.life * 2);
            ctx.fillStyle = p.c;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          });

          pops.forEach(function (p) {
            ctx.globalAlpha = Math.max(0, p.life);
            E.label(ctx, p.text, p.x, p.y, 17, p.color);
            ctx.globalAlpha = 1;
          });
        },
      });

      function finish() {
        if (finished) return;
        finished = true;
        var won = perfect >= GOAL;
        var bells =
          perfect * S.bellsPerPerfect +
          late * S.bellsPerLate +
          (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: perfect,
            bells: bells,
            rows: [
              [t("orchard_perfect"), perfect + " / " + GOAL],
              [t("orchard_picked"), String(picked)],
              [t("score"), String(score)],
            ],
          });
        }, 350);
      }

      return {
        stop: function () {
          finished = true;
          engine.stop();
        },
      };
    },
  };
})();
