/* Bug catching - move the net, tap to swing. */
(function () {
  var E = window.Engine;

  var DEFAULTS = {
    duration: 45,
    goal: 12,
    onField: 6,
    netRadius: 36,
    fleeDistance: 110,
    bellsPerCatch: 45,
    winBonus: 150,
    bugs: [
      { glyph: "🦋", points: 1, speed: 52, name: "Flower Butterfly" },
      { glyph: "🐞", points: 1, speed: 44, name: "Ladybug" },
      { glyph: "🐝", points: 1, speed: 78, name: "Protein Bee" },
      { glyph: "🦗", points: 1, speed: 66, name: "Mist Cricket" },
      { glyph: "🐛", points: 1, speed: 30, name: "Herb Caterpillar" },
      { glyph: "🐰", points: 2, speed: 90, name: "Bad Bunny" },
    ],
  };

  window.Games.bugs = {
    id: "bugs",
    icon: "🦋",
    nameKey: "bugs_name",
    shortKey: "bugs_short",
    titleKey: "bugs_title",
    descKey: "bugs_desc",
    hintKey: "bugs_hint",

    start: function (api) {
      var S = window.Settings.forGame("bugs", DEFAULTS);
      var DURATION = S.duration;
      var GOAL = S.goal;
      var NET_R = S.netRadius;

      var size = E.logicalSize(api.stage, 640);
      var W = size.w,
        H = size.h;
      var t = window.UI.t;

      var bugs = [];
      var sparks = [];
      var flowers = [];
      var score = 0;
      var caught = 0;
      var timeLeft = DURATION;
      var net = { x: W / 2, y: H / 2, swing: 0 };
      var finished = false;
      var shownSecond = DURATION;

      for (var i = 0; i < 26; i++) {
        flowers.push({
          x: E.rand(10, W - 10),
          y: E.rand(60, H - 10),
          g: E.pick(["🌼", "🌸", "🌿", "🍀", "🌷"]),
          s: E.rand(12, 20),
        });
      }

      function spawnBug() {
        var kind = E.pick(S.bugs);
        var edge = (Math.random() * 4) | 0;
        var x = edge === 0 ? -20 : edge === 1 ? W + 20 : E.rand(20, W - 20);
        var y = edge === 2 ? -20 : edge === 3 ? H + 20 : E.rand(40, H - 20);
        var a = Math.random() * Math.PI * 2;
        bugs.push({
          kind: kind,
          x: x,
          y: y,
          vx: Math.cos(a) * kind.speed,
          vy: Math.sin(a) * kind.speed,
          turn: E.rand(0.4, 1.4),
          size: E.rand(24, 30),
          wob: Math.random() * 6,
        });
      }

      for (var b = 0; b < S.onField; b++) spawnBug();

      function updateHud() {
        api.setStats([
          {
            label: t("time"),
            value: Math.ceil(timeLeft) + "s",
            warn: timeLeft <= 10,
          },
          { label: t("bugs_caught"), value: caught + " / " + GOAL },
        ]);
      }
      updateHud();

      var hintTimer = null;
      function flashCatch(name) {
        api.setHint(t("bugs_caught") + ": " + name);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(function () {
          if (!finished) api.setHint(t("bugs_hint"));
        }, 1400);
      }

      function swing() {
        if (finished || net.swing > 0) return;
        // a tap should land where the finger is, not where the net lagged behind
        if (engine.pointer.inside) {
          net.x = engine.pointer.x;
          net.y = E.clamp(engine.pointer.y, 34, H - 14);
        }
        net.swing = 0.28;
        var hit = false;
        var named = "";
        for (var i = bugs.length - 1; i >= 0; i--) {
          var bug = bugs[i];
          var dx = bug.x - net.x,
            dy = bug.y - net.y;
          if (dx * dx + dy * dy < (NET_R + 8) * (NET_R + 8)) {
            bugs.splice(i, 1);
            caught++;
            score += bug.kind.points;
            hit = true;
            if (bug.kind.name) named = bug.kind.name;
            for (var s = 0; s < 12; s++) {
              var a = Math.random() * Math.PI * 2;
              sparks.push({
                x: bug.x,
                y: bug.y,
                vx: Math.cos(a) * E.rand(40, 160),
                vy: Math.sin(a) * E.rand(40, 160),
                life: E.rand(0.3, 0.7),
                c: E.pick(["#fff1a8", "#ffd166", "#ffffff"]),
              });
            }
            spawnBug();
          }
        }
        window.Sound.play(hit ? "catch" : "tap");
        if (named) flashCatch(named);
        updateHud();
      }

      var engine = E.create(api.stage, {
        width: W,
        height: H,
        onPress: swing,

        update: function (dt) {
          if (finished) return;

          timeLeft -= dt;
          if (timeLeft <= 0) {
            timeLeft = 0;
            finish();
          }
          if (Math.ceil(timeLeft) !== shownSecond) {
            shownSecond = Math.ceil(timeLeft);
            updateHud();
          }

          // net follows the pointer, arrows nudge it
          if (engine.pointer.inside) {
            net.x += (engine.pointer.x - net.x) * Math.min(1, dt * 26);
            net.y += (engine.pointer.y - net.y) * Math.min(1, dt * 26);
          }
          var ax = engine.axisX(),
            ay = engine.axisY();
          if (ax || ay) {
            net.x += ax * 320 * dt;
            net.y += ay * 320 * dt;
          }
          net.x = E.clamp(net.x, 14, W - 14);
          net.y = E.clamp(net.y, 34, H - 14);
          if (net.swing > 0) net.swing = Math.max(0, net.swing - dt);

          bugs.forEach(function (bug) {
            bug.turn -= dt;
            bug.wob += dt * 9;
            if (bug.turn <= 0) {
              bug.turn = E.rand(0.5, 1.6);
              var a = Math.random() * Math.PI * 2;
              bug.vx = Math.cos(a) * bug.kind.speed;
              bug.vy = Math.sin(a) * bug.kind.speed;
            }
            // flee from a nearby net
            var dx = bug.x - net.x,
              dy = bug.y - net.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < S.fleeDistance * S.fleeDistance && d2 > 1) {
              var d = Math.sqrt(d2);
              bug.vx += (dx / d) * 160 * dt * 4;
              bug.vy += (dy / d) * 160 * dt * 4;
              var sp = Math.hypot(bug.vx, bug.vy);
              var max = bug.kind.speed * 2.1;
              if (sp > max) {
                bug.vx = (bug.vx / sp) * max;
                bug.vy = (bug.vy / sp) * max;
              }
            }
            bug.x += bug.vx * dt;
            bug.y += bug.vy * dt;
            if (bug.x < 12) {
              bug.x = 12;
              bug.vx = Math.abs(bug.vx);
            }
            if (bug.x > W - 12) {
              bug.x = W - 12;
              bug.vx = -Math.abs(bug.vx);
            }
            if (bug.y < 34) {
              bug.y = 34;
              bug.vy = Math.abs(bug.vy);
            }
            if (bug.y > H - 12) {
              bug.y = H - 12;
              bug.vy = -Math.abs(bug.vy);
            }
          });

          for (var i = sparks.length - 1; i >= 0; i--) {
            var p = sparks[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 220 * dt;
            p.life -= dt;
            if (p.life <= 0) sparks.splice(i, 1);
          }
        },

        draw: function (ctx) {
          var g = ctx.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, "#bdf0a6");
          g.addColorStop(1, "#7fcf6c");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = "#cdefff";
          ctx.fillRect(0, 0, W, 44);
          ctx.fillStyle = "#a8e58f";
          ctx.beginPath();
          ctx.ellipse(W * 0.2, 52, 150, 26, 0, 0, Math.PI * 2);
          ctx.ellipse(W * 0.75, 50, 190, 28, 0, 0, Math.PI * 2);
          ctx.fill();

          flowers.forEach(function (f) {
            E.emoji(ctx, f.g, f.x, f.y, f.s);
          });

          bugs.forEach(function (bug) {
            ctx.save();
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = "#3c6b32";
            ctx.beginPath();
            ctx.ellipse(
              bug.x,
              bug.y + bug.size * 0.45,
              bug.size * 0.32,
              bug.size * 0.12,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fill();
            ctx.restore();
            E.emoji(
              ctx,
              bug.kind.glyph,
              bug.x,
              bug.y + Math.sin(bug.wob) * 2,
              bug.size,
              Math.sin(bug.wob) * 0.12,
            );
          });

          sparks.forEach(function (p) {
            ctx.globalAlpha = Math.max(0, p.life * 2);
            ctx.fillStyle = p.c;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          });

          // net
          var swingT = net.swing > 0 ? net.swing / 0.28 : 0;
          var angle = Math.sin(swingT * Math.PI) * 0.9;
          ctx.save();
          ctx.translate(net.x, net.y);
          ctx.rotate(angle);
          ctx.strokeStyle = "#a9773f";
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(0, NET_R - 4);
          ctx.lineTo(10, NET_R + 44);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, NET_R, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.28)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.65)";
          ctx.lineWidth = 1.5;
          for (var k = -2; k <= 2; k++) {
            ctx.beginPath();
            ctx.moveTo(
              k * 12,
              -Math.sqrt(Math.max(0, NET_R * NET_R - k * 12 * k * 12)),
            );
            ctx.lineTo(
              k * 12,
              Math.sqrt(Math.max(0, NET_R * NET_R - k * 12 * k * 12)),
            );
            ctx.stroke();
          }
          ctx.restore();

          if (timeLeft <= 10) {
            ctx.globalAlpha = 0.5 + Math.sin(performance.now() / 160) * 0.3;
            E.label(ctx, Math.ceil(timeLeft) + "", W / 2, 24, 26, "#e05b7a");
            ctx.globalAlpha = 1;
          }
        },
      });

      function finish() {
        if (finished) return;
        finished = true;
        var won = caught >= GOAL;
        var bells = caught * S.bellsPerCatch + (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: caught,
            bells: bells,
            rows: [
              [t("bugs_caught"), caught + " / " + GOAL],
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
