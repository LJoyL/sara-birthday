/* Rainy Day Dash - catch the good things, dodge the storm. */
(function () {
  var E = window.Engine;

  var DEFAULTS = {
    duration: 60,
    goal: 350,
    hearts: 3,
    mercySeconds: 1.2,
    catchWidth: 38,
    dodgeWidth: 24,
    spawnFrom: 0.34,
    spawnTo: 0.72,
    bellsPerPoint: 1.2,
    winBonus: 200,
    items: [
      { glyph: "☂️", points: 30, chance: 34, good: true },
      { glyph: "🍂", points: 15, chance: 26, good: true },
      { glyph: "🌸", points: 20, chance: 16, good: true },
      { glyph: "⭐", points: 60, chance: 8, good: true },
      { glyph: "⚡", points: 0, chance: 13, good: false },
    ],
  };

  function rollItem(items) {
    var total = items.reduce(function (sum, item) {
      return sum + item.chance;
    }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < items.length; i++) {
      r -= items[i].chance;
      if (r <= 0) return items[i];
    }
    return items[0];
  }

  window.Games.rain = {
    id: "rain",
    icon: "🌧️",
    nameKey: "rain_name",
    shortKey: "rain_short",
    titleKey: "rain_title",
    descKey: "rain_desc",
    hintKey: "rain_hint",

    start: function (api) {
      var S = window.Settings.forGame("rain", DEFAULTS);
      var DURATION = S.duration;
      var GOAL = S.goal;

      var size = E.logicalSize(api.stage, 640);
      var W = size.w,
        H = size.h;
      var t = window.UI.t;
      var GROUND = H - 46;

      var player = { x: W / 2, y: GROUND, w: 46, hurt: 0, tilt: 0, step: 0 };
      var items = [];
      var drops = [];
      var pops = [];
      var score = 0;
      var hearts = S.hearts;
      var timeLeft = DURATION;
      var spawnIn = 0.6;
      var finished = false;
      var shownSecond = DURATION;

      for (var d = 0; d < 90; d++) {
        drops.push({
          x: Math.random() * W,
          y: Math.random() * H,
          len: E.rand(8, 20),
          sp: E.rand(420, 700),
        });
      }

      function updateHud() {
        api.setStats([
          {
            label: t("time"),
            value: Math.ceil(timeLeft) + "s",
            warn: timeLeft <= 10,
          },
          { label: t("score"), value: score + " / " + GOAL },
          {
            label: t("lives"),
            value: "❤️".repeat(hearts) || "—",
            warn: hearts <= 1,
          },
        ]);
      }
      updateHud();

      function spawn() {
        var kind = rollItem(S.items);
        items.push({
          kind: kind,
          x: E.rand(30, W - 30),
          y: -30,
          vy: E.rand(120, 200) + (DURATION - timeLeft) * 1.6,
          spin: E.rand(-1.4, 1.4),
          rot: 0,
          size: kind.good ? 30 : 34,
        });
      }

      function pop(x, y, text, color) {
        pops.push({ x: x, y: y, text: text, life: 0.9, color: color });
      }

      var engine = E.create(api.stage, {
        width: W,
        height: H,

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

          // movement: pointer first, keys as fallback
          var target = null;
          if (engine.pointer.inside) target = engine.pointer.x;
          var ax = engine.axisX();
          if (ax) target = player.x + ax * 60;
          if (target !== null) {
            var dx = target - player.x;
            var move = E.clamp(dx, -420 * dt, 420 * dt);
            player.x += move;
            player.tilt = E.clamp(dx / 60, -0.3, 0.3);
            if (Math.abs(move) > 0.5) player.step += Math.abs(move) * 0.06;
          } else {
            player.tilt *= 0.9;
          }
          player.x = E.clamp(player.x, 26, W - 26);
          if (player.hurt > 0) player.hurt -= dt;

          spawnIn -= dt;
          if (spawnIn <= 0) {
            spawn();
            spawnIn =
              E.rand(S.spawnFrom, S.spawnTo) *
              (0.6 + (timeLeft / DURATION) * 0.7);
          }

          for (var i = items.length - 1; i >= 0; i--) {
            var it = items[i];
            it.y += it.vy * dt;
            it.rot += it.spin * dt;
            var dy = it.y - (player.y - 34);
            // generous reach for treats, forgiving hitbox for lightning
            var reachX = it.kind.good ? S.catchWidth : S.dodgeWidth;
            var reachTop = it.kind.good ? -28 : -18;
            var reachBottom = it.kind.good ? 32 : 24;
            if (
              Math.abs(it.x - player.x) < reachX &&
              dy > reachTop &&
              dy < reachBottom
            ) {
              items.splice(i, 1);
              if (it.kind.good) {
                score += it.kind.points;
                pop(it.x, it.y, "+" + it.kind.points, "#ffe9a8");
                window.Sound.play("coin");
                updateHud();
              } else if (player.hurt <= 0) {
                hearts--;
                player.hurt = S.mercySeconds;
                pop(player.x, player.y - 60, "-1 ❤️", "#ffb4c4");
                window.Sound.play("hurt");
                updateHud();
                if (hearts <= 0) {
                  finish();
                  return;
                }
              }
              continue;
            }
            if (it.y > H + 40) items.splice(i, 1);
          }

          for (var p = pops.length - 1; p >= 0; p--) {
            pops[p].y -= 34 * dt;
            pops[p].life -= dt;
            if (pops[p].life <= 0) pops.splice(p, 1);
          }

          drops.forEach(function (r) {
            r.y += r.sp * dt;
            r.x -= 60 * dt;
            if (r.y > H) {
              r.y = -10;
              r.x = Math.random() * W;
            }
            if (r.x < 0) r.x += W;
          });
        },

        draw: function (ctx) {
          var sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, "#6d86a8");
          sky.addColorStop(0.55, "#9fb4cc");
          sky.addColorStop(1, "#c9dce8");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = "rgba(255,255,255,0.35)";
          for (var c = 0; c < 4; c++) {
            var cx = ((c * 190 + performance.now() / 90) % (W + 240)) - 120;
            ctx.beginPath();
            ctx.ellipse(cx, 40 + c * 9, 70, 22, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.strokeStyle = "rgba(255,255,255,0.45)";
          ctx.lineWidth = 1.6;
          drops.forEach(function (r) {
            ctx.beginPath();
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x - 4, r.y + r.len);
            ctx.stroke();
          });

          // ground
          ctx.fillStyle = "#7ec06a";
          ctx.fillRect(0, GROUND - 6, W, H - GROUND + 6);
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          for (var q = 0; q < 6; q++) {
            var px =
              ((q * 137 + 40) % W) + Math.sin(performance.now() / 900 + q) * 4;
            ctx.beginPath();
            ctx.ellipse(px, GROUND + 16, 26, 6, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          items.forEach(function (it) {
            if (!it.kind.good) {
              ctx.save();
              ctx.globalAlpha = 0.35;
              ctx.fillStyle = "#fff59a";
              ctx.beginPath();
              ctx.arc(it.x, it.y, 22, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            E.emoji(ctx, it.kind.glyph, it.x, it.y, it.size, it.rot);
          });

          drawPlayer(ctx);

          pops.forEach(function (p) {
            ctx.globalAlpha = Math.max(0, p.life);
            E.label(ctx, p.text, p.x, p.y, 18, p.color);
            ctx.globalAlpha = 1;
          });

          if (score >= GOAL) {
            E.bubble(ctx, "🎉 " + t("goal") + " ✓", W / 2, 22, 16);
          }
        },
      });

      function drawPlayer(ctx) {
        var blink = player.hurt > 0 && Math.floor(player.hurt * 12) % 2 === 0;
        if (blink) return;
        var bounce = Math.abs(Math.sin(player.step)) * 3;
        ctx.save();
        ctx.translate(player.x, player.y - bounce);
        ctx.rotate(player.tilt * 0.3);
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = "#2f4a28";
        ctx.beginPath();
        ctx.ellipse(0, 2 + bounce, 24, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // boots
        ctx.fillStyle = "#ffd166";
        E.roundRect(ctx, -15, -12, 12, 14, 5);
        ctx.fill();
        E.roundRect(ctx, 3, -12, 12, 14, 5);
        ctx.fill();
        // raincoat
        ctx.fillStyle = "#8fc8ff";
        E.roundRect(ctx, -19, -52, 38, 46, 15);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        E.roundRect(ctx, -19, -52, 38, 12, 10);
        ctx.fill();
        // head + hood
        ctx.fillStyle = "#ffe0c4";
        ctx.beginPath();
        ctx.arc(0, -66, 19, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8fc8ff";
        ctx.beginPath();
        ctx.arc(0, -70, 21, Math.PI * 1.05, Math.PI * 2.05);
        ctx.fill();
        ctx.fillStyle = "#5a4433";
        ctx.beginPath();
        ctx.arc(-6, -64, 2.3, 0, Math.PI * 2);
        ctx.arc(6, -64, 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e0849f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -58, 4.5, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      function finish() {
        if (finished) return;
        finished = true;
        var won = score >= GOAL && hearts > 0;
        var bells =
          Math.round(score * S.bellsPerPoint) + (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: score,
            bells: bells,
            rows: [
              [t("score"), score + " / " + GOAL],
              [t("lives"), "❤️".repeat(hearts) || "—"],
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
