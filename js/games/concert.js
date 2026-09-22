/* Saturday Night Concert - a four lane rhythm game. */
(function () {
  var E = window.Engine;

  var LANES = 4;
  var LANE_NOTES = [392.0, 523.25, 587.33, 783.99]; // G4 C5 D5 G5
  var LANE_COLORS = ["#ff9ec4", "#ffd166", "#8fd694", "#89cff0"];

  var DEFAULTS = {
    bpm: 104,
    bars: 16,
    leadIn: 2.4,
    travel: 1.55, // seconds a note needs to reach the line
    perfectWindow: 0.085,
    goodWindow: 0.17,
    accuracyToWin: 0.7,
    minNotesToWin: 20,
    bellsPerScore: 0.05,
    bellsPerCombo: 2,
    winBonus: 200,
    laneKeys: ["d", "f", "j", "k"],
    patterns: [
      [0, 1, 2, 3],
      [0, 2, 1, 3],
      [3, 2, 1, 0],
      [0, 3, 1, 2],
      [1, 1, 2, 2],
      [0, 0, 3, 3],
    ],
  };

  /** A simple, repeating chart so the song always feels like a song. */
  function buildChart(S) {
    var BEAT = 60 / S.bpm;
    var LEAD_IN = S.leadIn;
    var patterns = S.patterns;
    var chart = [];
    var beat = 0;
    for (var bar = 0; bar < S.bars; bar++) {
      var pattern = patterns[bar % patterns.length];
      for (var step = 0; step < 4; step++) {
        chart.push({ time: LEAD_IN + beat * BEAT, lane: pattern[step] });
        // a syncopated extra note every other bar keeps it interesting
        if (bar % 2 === 1 && step % 2 === 1) {
          chart.push({
            time: LEAD_IN + (beat + 0.5) * BEAT,
            lane: (pattern[step] + 2) % LANES,
          });
        }
        beat++;
      }
    }
    chart.sort(function (a, b) {
      return a.time - b.time;
    });
    chart.forEach(function (n) {
      n.hit = false;
      n.missed = false;
      n.judged = false;
    });
    return chart;
  }

  window.Games.concert = {
    id: "concert",
    icon: "🎸",
    nameKey: "concert_name",
    shortKey: "concert_short",
    titleKey: "concert_title",
    descKey: "concert_desc",
    hintKey: "concert_hint",

    start: function (api) {
      var S = window.Settings.forGame("concert", DEFAULTS);
      var LANE_KEYS = S.laneKeys;
      var BEAT = 60 / S.bpm;
      var LEAD_IN = S.leadIn;
      var TRAVEL = S.travel;
      var PERFECT_WINDOW = S.perfectWindow;
      var GOOD_WINDOW = S.goodWindow;
      var ACCURACY_TO_WIN = S.accuracyToWin;

      var size = E.logicalSize(api.stage, 640);
      var W = size.w,
        H = size.h;
      var t = window.UI.t;

      var STAGE_TOP = Math.min(120, H * 0.22);
      var HIT_Y = H - 64;
      var laneW = W / LANES;

      var chart = buildChart(S);
      var songEnd = chart[chart.length - 1].time + 2.2;
      var clock = 0;
      var perfect = 0;
      var good = 0;
      var missed = 0;
      var combo = 0;
      var stray = 0;
      var bestCombo = 0;
      var score = 0;
      var finished = false;
      var flashes = [0, 0, 0, 0];
      var pops = [];
      var lastBeat = -1;
      var shownJudged = -1;

      function accuracyNow() {
        var judged = perfect + good + missed + stray;
        return judged ? (perfect + good * 0.6) / judged : 1;
      }

      function updateHud() {
        var accuracy = Math.round(accuracyNow() * 100);
        api.setStats([
          { label: t("score"), value: String(score) },
          { label: t("concert_combo"), value: String(combo) },
          {
            label: t("concert_accuracy"),
            value: accuracy + "%",
            warn: accuracy < 60,
          },
        ]);
      }
      updateHud();

      function pop(lane, text, color) {
        pops.push({
          x: laneW * (lane + 0.5),
          y: HIT_Y - 40,
          text: text,
          color: color,
          life: 0.7,
        });
      }

      function judge(lane) {
        if (finished) return;
        flashes[lane] = 0.22;
        var best = null;
        var bestDt = 999;
        for (var i = 0; i < chart.length; i++) {
          var n = chart[i];
          if (n.lane !== lane || n.judged) continue;
          var dt = Math.abs(n.time - clock);
          if (dt < bestDt) {
            bestDt = dt;
            best = n;
          }
          if (n.time - clock > GOOD_WINDOW) break;
        }
        if (!best || bestDt > GOOD_WINDOW) {
          // swinging at nothing costs the combo, so mashing every lane never wins
          stray++;
          combo = 0;
          score = Math.max(0, score - 20);
          window.Sound.play("thud");
          updateHud();
          return;
        }
        best.judged = true;
        best.hit = true;
        if (bestDt <= PERFECT_WINDOW) {
          perfect++;
          score += 100 + Math.min(combo, 20) * 5;
          pop(lane, t("concert_perfect"), "#fff1a8");
        } else {
          good++;
          score += 50;
          pop(lane, t("concert_good"), "#d9f7c8");
        }
        combo++;
        bestCombo = Math.max(bestCombo, combo);
        window.Sound.note(LANE_NOTES[lane], 0.22);
        updateHud();
      }

      function onKey(e) {
        var key = String(e.key || "").toLowerCase();
        var lane = LANE_KEYS.indexOf(key);
        if (lane < 0) {
          if (key === "arrowleft") lane = 0;
          else if (key === "arrowup") lane = 1;
          else if (key === "arrowdown") lane = 2;
          else if (key === "arrowright") lane = 3;
        }
        if (lane < 0 || e.repeat) return;
        e.preventDefault();
        window.Sound.unlock();
        judge(lane);
      }
      window.addEventListener("keydown", onKey);

      var engine = E.create(api.stage, {
        width: W,
        height: H,
        onPress: function (x) {
          judge(E.clamp(Math.floor(x / laneW), 0, LANES - 1));
        },

        update: function (dt) {
          if (finished) return;
          clock += dt;

          var beatIndex = Math.floor((clock - LEAD_IN) / BEAT);
          if (beatIndex !== lastBeat && clock > LEAD_IN - BEAT) {
            lastBeat = beatIndex;
            window.Sound.play("tick");
          }

          for (var i = 0; i < chart.length; i++) {
            var n = chart[i];
            if (!n.judged && clock - n.time > GOOD_WINDOW) {
              n.judged = true;
              n.missed = true;
              missed++;
              combo = 0;
              pop(n.lane, t("concert_miss"), "#ffc2cf");
            }
          }
          var judged = perfect + good + missed + stray;
          if (judged !== shownJudged) {
            shownJudged = judged;
            updateHud();
          }

          for (var f = 0; f < LANES; f++) {
            if (flashes[f] > 0) flashes[f] = Math.max(0, flashes[f] - dt);
          }
          for (var p = pops.length - 1; p >= 0; p--) {
            pops[p].y -= 46 * dt;
            pops[p].life -= dt;
            if (pops[p].life <= 0) pops.splice(p, 1);
          }

          if (clock >= songEnd) finish();
        },

        draw: function (ctx) {
          var night = ctx.createLinearGradient(0, 0, 0, H);
          night.addColorStop(0, "#2f2a4a");
          night.addColorStop(0.6, "#4b3d63");
          night.addColorStop(1, "#6b4f72");
          ctx.fillStyle = night;
          ctx.fillRect(0, 0, W, H);

          // stars
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          for (var s = 0; s < 26; s++) {
            var sx = ((s * 97) % W) + 6;
            var sy = ((s * 53) % STAGE_TOP) + 6;
            var tw = 1 + Math.sin(clock * 2 + s) * 0.6;
            ctx.globalAlpha = 0.35 + Math.sin(clock * 2 + s) * 0.3;
            ctx.beginPath();
            ctx.arc(sx, sy, tw, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          // lanes
          for (var l = 0; l < LANES; l++) {
            ctx.fillStyle =
              l % 2 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)";
            ctx.fillRect(l * laneW, STAGE_TOP, laneW, H - STAGE_TOP);
            if (flashes[l] > 0) {
              ctx.globalAlpha = flashes[l] * 2.6;
              ctx.fillStyle = LANE_COLORS[l];
              ctx.fillRect(l * laneW, STAGE_TOP, laneW, H - STAGE_TOP);
              ctx.globalAlpha = 1;
            }
          }

          // performer
          var bounce = Math.sin(clock * (Math.PI / BEAT)) * 5;
          E.emoji(ctx, "🐶", W / 2 - 26, STAGE_TOP - 34 + bounce, 46);
          E.emoji(ctx, "🎸", W / 2 + 18, STAGE_TOP - 26 + bounce, 40, -0.3);
          E.emoji(ctx, "🎤", 42, STAGE_TOP - 30, 26);
          E.emoji(ctx, "🎶", W - 46, STAGE_TOP - 44 - bounce, 26);

          // hit line
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, HIT_Y);
          ctx.lineTo(W, HIT_Y);
          ctx.stroke();
          for (var h = 0; h < LANES; h++) {
            ctx.strokeStyle = LANE_COLORS[h];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(laneW * (h + 0.5), HIT_Y, 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            E.label(
              ctx,
              LANE_KEYS[h].toUpperCase(),
              laneW * (h + 0.5),
              H - 22,
              14,
              "rgba(255,255,255,0.7)",
            );
          }

          // notes
          chart.forEach(function (n) {
            if (n.judged && !n.missed) return;
            var progress = 1 - (n.time - clock) / TRAVEL;
            if (progress < 0 || progress > 1.25) return;
            var y = STAGE_TOP + (HIT_Y - STAGE_TOP) * progress;
            var x = laneW * (n.lane + 0.5);
            ctx.save();
            ctx.globalAlpha = n.missed ? 0.25 : 1;
            ctx.fillStyle = LANE_COLORS[n.lane];
            E.roundRect(ctx, x - 26, y - 13, 52, 26, 13);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.font = '700 16px "Baloo 2", system-ui, sans-serif';
            ctx.fillText("♪", x, y + 1);
            ctx.restore();
          });

          pops.forEach(function (p) {
            ctx.globalAlpha = Math.max(0, p.life * 1.4);
            E.label(ctx, p.text, p.x, p.y, 17, p.color);
            ctx.globalAlpha = 1;
          });

          if (combo >= 5) {
            E.label(
              ctx,
              combo + "x",
              W / 2,
              STAGE_TOP + 30,
              30,
              "rgba(255,255,255,0.85)",
            );
          }

          if (clock < LEAD_IN) {
            E.bubble(
              ctx,
              "🎵 " + Math.ceil(LEAD_IN - clock),
              W / 2,
              HIT_Y - 90,
              20,
            );
          }
        },
      });

      function finish() {
        if (finished) return;
        finished = true;
        var accuracy = accuracyNow();
        var won =
          accuracy >= ACCURACY_TO_WIN && perfect + good >= S.minNotesToWin;
        var bells =
          Math.round(score * S.bellsPerScore) +
          bestCombo * S.bellsPerCombo +
          (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: score,
            bells: bells,
            rows: [
              [t("concert_accuracy"), Math.round(accuracy * 100) + "%"],
              [
                t("concert_perfect") + " / " + t("concert_good"),
                perfect + " / " + good,
              ],
              [t("concert_combo"), String(bestCombo)],
            ],
          });
        }, 400);
      }

      return {
        stop: function () {
          finished = true;
          window.removeEventListener("keydown", onKey);
          engine.stop();
        },
      };
    },
  };
})();
