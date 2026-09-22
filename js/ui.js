/* Shared UI helpers: text, screens, dialogue, toasts, modals, particles. */
(function () {
  var cfg = window.GAME_CONFIG;

  /* ---------- text ---------------------------------------------------- */

  function pack() {
    return window.GAME_TEXT[cfg.lang] || window.GAME_TEXT.en;
  }

  function fill(str) {
    return String(str)
      .replace(/\{name\}/g, cfg.playerName)
      .replace(/\{host\}/g, cfg.hostName)
      .replace(/\{from\}/g, cfg.fromName);
  }

  function t(key) {
    var value = pack()[key];
    if (value === undefined) value = window.GAME_TEXT.en[key];
    if (value === undefined) return key;
    if (Array.isArray(value)) return value.map(fill);
    return fill(value);
  }

  function giftText(id) {
    var byLang = window.GIFT_TEXT[cfg.lang] || window.GIFT_TEXT.en;
    var entry = byLang[id] || window.GIFT_TEXT.en[id] || {};
    return {
      name: fill(entry.name || id),
      tagline: fill(entry.tagline || ""),
      note: fill(entry.note || ""),
    };
  }

  function letterLines() {
    var lines = window.LETTER_TEXT[cfg.lang] || window.LETTER_TEXT.en;
    return lines.map(fill);
  }

  /* ---------- screens --------------------------------------------------- */

  function showScreen(id) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle("active", screens[i].id === "screen-" + id);
    }
    window.scrollTo(0, 0);
  }

  /* ---------- dialogue -------------------------------------------------- */

  var dlgEl, dlgText, dlgNext, dlgAvatar, dlgName;
  var dlgQueue = [];
  var dlgDone = null;
  var typing = null;
  var typedFull = "";

  function initDialogue() {
    dlgEl = document.getElementById("dialogue");
    dlgText = document.getElementById("dialogue-text");
    dlgNext = document.getElementById("dialogue-next");
    dlgAvatar = document.getElementById("dialogue-avatar");
    dlgName = document.getElementById("dialogue-name");
    dlgAvatar.textContent = cfg.hostIcon;
    dlgName.textContent = cfg.hostName;
    dlgEl.addEventListener("click", advanceDialogue);
  }

  function typeLine(line) {
    clearInterval(typing);
    typedFull = line;
    dlgText.textContent = "";
    dlgNext.style.visibility = "hidden";
    var i = 0;
    typing = setInterval(function () {
      i++;
      dlgText.textContent = line.slice(0, i);
      if (i % 3 === 0) window.Sound.play("blip");
      if (i >= line.length) {
        clearInterval(typing);
        typing = null;
        dlgNext.style.visibility = "visible";
      }
    }, 22);
  }

  function advanceDialogue() {
    if (typing) {
      clearInterval(typing);
      typing = null;
      dlgText.textContent = typedFull;
      dlgNext.style.visibility = "visible";
      return;
    }
    if (dlgQueue.length) {
      typeLine(dlgQueue.shift());
    } else {
      dlgEl.hidden = true;
      var cb = dlgDone;
      dlgDone = null;
      if (cb) cb();
    }
  }

  function say(lines, onDone) {
    dlgQueue = (Array.isArray(lines) ? lines : [lines]).slice();
    dlgDone = onDone || null;
    dlgEl.hidden = false;
    advanceDialogue();
  }

  /* ---------- toast ------------------------------------------------------ */

  var toastWrap;

  function toast(text, ms) {
    if (!toastWrap) {
      toastWrap = document.createElement("div");
      toastWrap.className = "toast-wrap";
      document.body.appendChild(toastWrap);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = text;
    toastWrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 350);
    }, ms || 1800);
  }

  /* ---------- modal ------------------------------------------------------- */

  var modalEl, modalCard;

  function initModal() {
    modalEl = document.getElementById("modal");
    modalCard = document.getElementById("modal-card");
  }

  /**
   * openModal({ html, buttons: [{ label, kind, onClick }], onMount })
   */
  function openModal(opts) {
    modalCard.innerHTML = opts.html || "";
    if (opts.buttons && opts.buttons.length) {
      var row = document.createElement("div");
      row.className = "modal-actions";
      opts.buttons.forEach(function (b) {
        var btn = document.createElement("button");
        btn.className = "btn" + (b.kind === "ghost" ? " btn-ghost" : "");
        btn.textContent = b.label;
        btn.addEventListener("click", function () {
          window.Sound.play("tap");
          if (b.keepOpen !== true) closeModal();
          if (b.onClick) b.onClick();
        });
        row.appendChild(btn);
      });
      modalCard.appendChild(row);
    }
    modalEl.hidden = false;
    if (opts.onMount) opts.onMount(modalCard);
  }

  function closeModal() {
    modalEl.hidden = true;
    modalCard.innerHTML = "";
  }

  /* ---------- particles (confetti + fireworks) ------------------------------ */

  var fx,
    fxCtx,
    parts = [],
    fxRunning = false,
    lastFx = 0;
  var COLORS = [
    "#ff9ec4",
    "#ffd166",
    "#8fd694",
    "#89cff0",
    "#c9a7ff",
    "#fff1a8",
  ];

  function initFx() {
    fx = document.getElementById("fx-canvas");
    fxCtx = fx.getContext("2d");
    resizeFx();
    window.addEventListener("resize", resizeFx);
  }

  function resizeFx() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = Math.floor(window.innerWidth * dpr);
    fx.height = Math.floor(window.innerHeight * dpr);
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function fxLoop(now) {
    if (!fxRunning) return;
    var dt = Math.min((now - lastFx) / 1000 || 0, 0.05);
    lastFx = now;
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.rot += p.spin * dt;
      if (p.life <= 0 || p.y > window.innerHeight + 40) {
        parts.splice(i, 1);
        continue;
      }
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.globalAlpha = Math.max(0, Math.min(1, p.life));
      fxCtx.fillStyle = p.color;
      if (p.round) {
        fxCtx.beginPath();
        fxCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        fxCtx.fill();
      } else {
        fxCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      fxCtx.restore();
    }
    if (!parts.length) {
      fxRunning = false;
      fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    requestAnimationFrame(fxLoop);
  }

  function startFx() {
    if (fxRunning) return;
    fxRunning = true;
    lastFx = performance.now();
    requestAnimationFrame(fxLoop);
  }

  function confetti(amount) {
    var n = amount || 90;
    for (var i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 120,
        vy: 60 + Math.random() * 160,
        g: 180,
        size: 7 + Math.random() * 9,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * 6,
        spin: (Math.random() - 0.5) * 8,
        life: 3 + Math.random() * 2,
        round: Math.random() < 0.3,
      });
    }
    startFx();
  }

  function burst(x, y, amount, colors) {
    var n = amount || 40;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var s = 60 + Math.random() * 220;
      parts.push({
        x: x,
        y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        g: 140,
        size: 5 + Math.random() * 7,
        color: (colors || COLORS)[
          (Math.random() * (colors || COLORS).length) | 0
        ],
        rot: Math.random() * 6,
        spin: (Math.random() - 0.5) * 10,
        life: 1.2 + Math.random() * 1.2,
        round: true,
      });
    }
    startFx();
  }

  var fireworksTimer = null;

  function fireworks(durationMs) {
    var stop = Date.now() + (durationMs || 6000);
    clearInterval(fireworksTimer);
    fireworksTimer = setInterval(function () {
      if (Date.now() > stop) {
        clearInterval(fireworksTimer);
        fireworksTimer = null;
        return;
      }
      burst(
        window.innerWidth * (0.15 + Math.random() * 0.7),
        window.innerHeight * (0.12 + Math.random() * 0.4),
        46,
      );
      window.Sound.play("firework");
    }, 750);
    burst(window.innerWidth / 2, window.innerHeight * 0.3, 60);
  }

  function stopFireworks() {
    clearInterval(fireworksTimer);
    fireworksTimer = null;
  }

  /* ---------- falling petals (decoration) ------------------------------------- */

  function startPetals() {
    var host = document.getElementById("petals");
    var glyphs = ["🌸", "🌸", "🌺", "✿", "❀"];
    setInterval(function () {
      if (document.hidden) return;
      if (host.childElementCount > 18) return;
      var el = document.createElement("span");
      el.className = "petal";
      el.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      el.style.left = Math.random() * 100 + "vw";
      el.style.fontSize = 11 + Math.random() * 14 + "px";
      el.style.setProperty(
        "--dx",
        (Math.random() * 160 - 80).toFixed(0) + "px",
      );
      el.style.setProperty(
        "--rot",
        (Math.random() * 720 - 360).toFixed(0) + "deg",
      );
      var dur = 9 + Math.random() * 8;
      el.style.animationDuration = dur + "s";
      host.appendChild(el);
      setTimeout(
        function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        },
        dur * 1000 + 200,
      );
    }, 900);
  }

  /* ---------- misc -------------------------------------------------------------- */

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function init() {
    initDialogue();
    initModal();
    initFx();
    startPetals();
  }

  window.UI = {
    init: init,
    t: t,
    fill: fill,
    giftText: giftText,
    letterLines: letterLines,
    showScreen: showScreen,
    say: say,
    toast: toast,
    openModal: openModal,
    closeModal: closeModal,
    confetti: confetti,
    burst: burst,
    fireworks: fireworks,
    stopFireworks: stopFireworks,
    esc: esc,
  };
})();
