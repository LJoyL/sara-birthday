/* Fishing - cast, wait for the bite, reel it in at the right moment. */
(function () {
  var E = window.Engine;

  var DEFAULTS = {
    goal: 5,
    casts: 8,
    biteWindow: 0.95,
    waitFrom: 1.4,
    waitTo: 4.2,
    winBonus: 200,
    fish: [
      { glyph: "🍣", chance: 28, bells: 60, name: "Salmon Nigiri" },
      { glyph: "🐟", chance: 18, bells: 50, name: "Cádiz Sardine" },
      { glyph: "🐠", chance: 16, bells: 70, name: "Tuna Sashimi" },
      { glyph: "🦐", chance: 12, bells: 80, name: "Sweet Shrimp" },
      { glyph: "🍳", chance: 10, bells: 65, name: "Tamago" },
      { glyph: "🐙", chance: 7, bells: 110, name: "Octopus Nigiri" },
      { glyph: "🦀", chance: 5, bells: 120, name: "Galician Crab" },
      { glyph: "🪙", chance: 3, bells: 170, name: "Coin from the Mists" },
      { glyph: "💎", chance: 1, bells: 240, name: "Bead of Atium" },
    ],
  };

  function rollFish(fish) {
    var total = fish.reduce(function (sum, f) {
      return sum + f.chance;
    }, 0);
    var r = Math.random() * total;
    for (var i = 0; i < fish.length; i++) {
      r -= fish[i].chance;
      if (r <= 0) return fish[i];
    }
    return fish[0];
  }

  window.Games.fishing = {
    id: "fishing",
    icon: "🎣",
    nameKey: "fishing_name",
    shortKey: "fishing_short",
    titleKey: "fishing_title",
    descKey: "fishing_desc",
    hintKey: "fishing_hint",

    start: function (api) {
      var S = window.Settings.forGame("fishing", DEFAULTS);
      var GOAL = S.goal;
      var CASTS = S.casts;

      var size = E.logicalSize(api.stage, 640);
      var W = size.w,
        H = size.h;
      var t = window.UI.t;

      var WATER_Y = Math.round(H * 0.47);
      var state = "idle"; // idle | cast | wait | bite | result
      var timer = 0;
      var caught = 0;
      var castsLeft = CASTS;
      var bells = 0;
      var finished = false;
      var message = t("fishing_cast_prompt");

      function setMessage(text) {
        message = text;
        api.setHint(text);
      }
      var bobber = { x: 420, y: WATER_Y + 60, t: 0, shake: 0 };
      var castFrom = { x: 190, y: WATER_Y - 46 };
      var flight = 0;
      var pendingFish = null;
      var lastCatch = null;
      var ripples = [];
      var shadow = { x: 420, y: WATER_Y + 60, a: 0 };

      function updateHud() {
        api.setStats([
          { label: t("fishing_fish"), value: caught + " / " + GOAL },
          {
            label: t("fishing_casts"),
            value: String(castsLeft),
            warn: castsLeft <= 2,
          },
        ]);
      }
      updateHud();
      api.setHint(message);

      function addRipple(x, y) {
        ripples.push({ x: x, y: y, r: 4, life: 1 });
      }

      function cast() {
        state = "cast";
        flight = 0;
        bobber.x = E.rand(300, W - 80);
        bobber.y = E.clamp(WATER_Y + E.rand(40, 150), WATER_Y + 34, H - 44);
        pendingFish = rollFish(S.fish);
        timer = E.rand(S.waitFrom, S.waitTo);
        setMessage("");
        window.Sound.play("tap");
      }

      function startWait() {
        state = "wait";
        setMessage(t("fishing_wait"));
        window.Sound.play("splash");
        addRipple(bobber.x, bobber.y);
        shadow.x = bobber.x + E.rand(-70, 70);
        shadow.y = bobber.y + E.rand(-30, 30);
        shadow.a = 0;
      }

      function bite() {
        state = "bite";
        timer = S.biteWindow;
        bobber.shake = 1;
        setMessage(t("fishing_bite"));
        window.Sound.play("bite");
        addRipple(bobber.x, bobber.y);
      }

      function resolve(success) {
        castsLeft--;
        if (success) {
          caught++;
          bells += pendingFish.bells;
          lastCatch = pendingFish;
          setMessage(
            t("fishing_caught") +
              " " +
              pendingFish.name +
              " " +
              pendingFish.glyph,
          );
          window.Sound.play("reel");
          window.Sound.play("catch");
        } else {
          lastCatch = null;
          setMessage(t("fishing_missed"));
          window.Sound.play("miss");
        }
        state = "result";
        timer = 1.7;
        bobber.shake = 0;
        updateHud();
      }

      function press() {
        if (finished) return;
        if (state === "idle") cast();
        else if (state === "wait") resolve(false);
        else if (state === "bite") resolve(true);
        else if (state === "result") nextCast();
      }

      function nextCast() {
        if (caught >= GOAL || castsLeft <= 0) {
          finish();
          return;
        }
        state = "idle";
        setMessage(t("fishing_cast_prompt"));
        lastCatch = null;
      }

      var engine = E.create(api.stage, {
        width: W,
        height: H,
        onPress: press,

        update: function (dt) {
          if (finished) return;
          bobber.t += dt;
          shadow.a += dt;

          if (state === "cast") {
            flight = Math.min(1, flight + dt * 1.6);
            if (flight >= 1) startWait();
          } else if (state === "wait") {
            timer -= dt;
            if (timer <= 0) bite();
          } else if (state === "bite") {
            timer -= dt;
            if (timer <= 0) resolve(false);
          } else if (state === "result") {
            timer -= dt;
            if (timer <= 0) nextCast();
          }

          if (bobber.shake > 0)
            bobber.shake = Math.max(0, bobber.shake - dt * 0.6);

          for (var i = ripples.length - 1; i >= 0; i--) {
            ripples[i].r += 55 * dt;
            ripples[i].life -= dt * 1.1;
            if (ripples[i].life <= 0) ripples.splice(i, 1);
          }
        },

        draw: function (ctx) {
          // sky + bank
          var sky = ctx.createLinearGradient(0, 0, 0, WATER_Y);
          sky.addColorStop(0, "#cdefff");
          sky.addColorStop(1, "#e8fbe5");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, WATER_Y);

          ctx.fillStyle = "#9adf83";
          ctx.fillRect(0, WATER_Y - 70, W, 74);
          ctx.fillStyle = "#ffe9b8";
          ctx.fillRect(0, WATER_Y - 8, W, 12);

          E.emoji(ctx, "🌳", 60, WATER_Y - 96, 54);
          E.emoji(ctx, "🌸", 520, WATER_Y - 92, 44);
          E.emoji(ctx, "🌿", 300, WATER_Y - 24, 24);
          E.emoji(ctx, "🪨", 400, WATER_Y - 28, 22);

          // water
          var water = ctx.createLinearGradient(0, WATER_Y, 0, H);
          water.addColorStop(0, "#7fd4e8");
          water.addColorStop(1, "#3ba7c9");
          ctx.fillStyle = water;
          ctx.fillRect(0, WATER_Y, W, H - WATER_Y);

          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.lineWidth = 3;
          for (var w = 0; w < 5; w++) {
            var yy = WATER_Y + 26 + w * 40;
            ctx.beginPath();
            for (var x = 0; x <= W; x += 16) {
              var yv = yy + Math.sin(x / 42 + bobber.t * 1.4 + w) * 4;
              if (x === 0) ctx.moveTo(x, yv);
              else ctx.lineTo(x, yv);
            }
            ctx.stroke();
          }

          ripples.forEach(function (r) {
            ctx.globalAlpha = Math.max(0, r.life) * 0.7;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, r.r, r.r * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
          });

          // fish shadow circling the bobber while waiting
          if (state === "wait" || state === "bite") {
            var sx = shadow.x + Math.cos(shadow.a * 1.6) * 26;
            var sy = shadow.y + Math.sin(shadow.a * 1.2) * 12;
            if (state === "bite") {
              sx = bobber.x - 16;
              sy = bobber.y + 6;
            }
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = "#123c4a";
            ctx.beginPath();
            ctx.ellipse(
              sx,
              sy,
              17,
              8,
              Math.sin(shadow.a) * 0.3,
              0,
              Math.PI * 2,
            );
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          // angler
          drawAngler(ctx, castFrom.x, WATER_Y - 12);

          // line + bobber
          var bx = bobber.x,
            by = bobber.y;
          if (state === "cast") {
            bx = castFrom.x + 52 + (bobber.x - castFrom.x - 52) * flight;
            by =
              castFrom.y -
              90 * Math.sin(Math.PI * flight) +
              (bobber.y - castFrom.y) * flight;
          }
          if (state !== "idle") {
            ctx.strokeStyle = "rgba(255,255,255,0.85)";
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(castFrom.x + 52, castFrom.y);
            ctx.quadraticCurveTo((castFrom.x + bx) / 2, by - 60, bx, by);
            ctx.stroke();

            var dip =
              state === "bite"
                ? Math.sin(bobber.t * 34) * 5
                : Math.sin(bobber.t * 2.4) * 2.5;
            ctx.fillStyle = "#ff5f7e";
            ctx.beginPath();
            ctx.arc(bx, by + dip, 8, Math.PI, 0);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(bx, by + dip, 8, 0, Math.PI);
            ctx.fill();
            ctx.strokeStyle = "#5a4433";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(bx, by + dip, 8, 0, Math.PI * 2);
            ctx.stroke();

            if (state === "bite") {
              E.bubble(ctx, "!", bx, by - 34, 22);
            }
          }

          if (state === "result" && lastCatch) {
            E.emoji(
              ctx,
              lastCatch.glyph,
              bx,
              by - 46 - Math.sin(bobber.t * 4) * 4,
              44,
            );
          }

          if (message) E.bubble(ctx, message, W / 2, 26, 17);
        },
      });

      function drawAngler(ctx, x, groundY) {
        var bobY = Math.sin(bobber.t * 2) * 1.5;
        ctx.save();
        ctx.translate(x, groundY + bobY);
        // shadow
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = "#33502c";
        ctx.beginPath();
        ctx.ellipse(0, 4, 26, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // dress
        ctx.fillStyle = "#ff9ec4";
        E.roundRect(ctx, -18, -46, 36, 48, 14);
        ctx.fill();
        // head
        ctx.fillStyle = "#ffe0c4";
        ctx.beginPath();
        ctx.arc(0, -62, 21, 0, Math.PI * 2);
        ctx.fill();
        // hair
        ctx.fillStyle = "#6b4a3a";
        ctx.beginPath();
        ctx.arc(0, -66, 21, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-20, -56, 7, 17, 0.2, 0, Math.PI * 2);
        ctx.ellipse(20, -56, 7, 17, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // flower clip
        E.emoji(ctx, "🌸", 17, -76, 16);
        // face
        ctx.fillStyle = "#5a4433";
        ctx.beginPath();
        ctx.arc(-7, -60, 2.4, 0, Math.PI * 2);
        ctx.arc(7, -60, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e0849f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -54, 5, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        // arms + rod
        ctx.strokeStyle = "#ffe0c4";
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(12, -34);
        ctx.lineTo(26, -26);
        ctx.stroke();
        ctx.strokeStyle = "#a9773f";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(20, -20);
        ctx.lineTo(52, -34);
        ctx.stroke();
        ctx.restore();
      }

      function finish() {
        if (finished) return;
        finished = true;
        var won = caught >= GOAL;
        var total = bells + (won ? S.winBonus : 0);
        setTimeout(function () {
          api.finish({
            won: won,
            score: caught,
            bells: total,
            rows: [
              [t("fishing_fish"), caught + " / " + GOAL],
              [t("fishing_casts"), String(castsLeft)],
            ],
          });
        }, 300);
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
