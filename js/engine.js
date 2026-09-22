/* Minimal canvas engine shared by the mini-games:
   fixed logical resolution, rAF loop, pointer + keyboard input. */
(function () {
  var LOGICAL_W = 640;
  var LOGICAL_H = 400;

  /** Logical canvas size that matches the stage's real shape, so pixels stay square. */
  function logicalSize(stage, baseWidth) {
    var w = baseWidth || LOGICAL_W;
    var rect = stage.getBoundingClientRect();
    var aspect =
      rect.width > 0 && rect.height > 0
        ? rect.width / rect.height
        : w / LOGICAL_H;
    var h = Math.round(w / aspect);
    return { w: w, h: Math.max(300, Math.min(880, h)) };
  }

  function createEngine(stage, opts) {
    opts = opts || {};
    var width = opts.width || LOGICAL_W;
    var height = opts.height || LOGICAL_H;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    stage.innerHTML = "";
    stage.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var pointer = { x: width / 2, y: height / 2, down: false, inside: false };
    var keys = {};
    var running = true;
    var rafId = null;
    var last = 0;

    function toLocal(clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      return {
        x: ((clientX - r.left) / r.width) * width,
        y: ((clientY - r.top) / r.height) * height,
      };
    }

    function press(x, y) {
      if (opts.onPress) opts.onPress(x, y);
    }

    function onPointerMove(e) {
      var p = toLocal(e.clientX, e.clientY);
      pointer.x = Math.max(0, Math.min(width, p.x));
      pointer.y = Math.max(0, Math.min(height, p.y));
      pointer.inside = true;
    }

    function onPointerDown(e) {
      canvas.setPointerCapture &&
        e.pointerId != null &&
        canvas.setPointerCapture(e.pointerId);
      onPointerMove(e);
      pointer.down = true;
      window.Sound.unlock();
      press(pointer.x, pointer.y);
      e.preventDefault();
    }

    function onPointerUp() {
      pointer.down = false;
    }

    function onLeave() {
      pointer.inside = false;
      pointer.down = false;
    }

    function onKeyDown(e) {
      keys[e.key] = true;
      if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        e.preventDefault();
        press(pointer.x, pointer.y);
      }
      if (e.key.indexOf("Arrow") === 0) e.preventDefault();
    }

    function onKeyUp(e) {
      keys[e.key] = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function frame(now) {
      if (!running) return;
      var dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;
      if (opts.update) opts.update(dt);
      if (opts.draw) opts.draw(ctx, dt);
      rafId = requestAnimationFrame(frame);
    }

    last = performance.now();
    rafId = requestAnimationFrame(frame);

    var engine = {
      canvas: canvas,
      ctx: ctx,
      width: width,
      height: height,
      pointer: pointer,
      keys: keys,
      /** -1 / 0 / 1 from the arrow or WASD keys */
      axisX: function () {
        var v = 0;
        if (keys.ArrowLeft || keys.a || keys.q || keys.A) v -= 1;
        if (keys.ArrowRight || keys.d || keys.D) v += 1;
        return v;
      },
      axisY: function () {
        var v = 0;
        if (keys.ArrowUp || keys.w || keys.z || keys.W) v -= 1;
        if (keys.ArrowDown || keys.s || keys.S) v += 1;
        return v;
      },
      stop: function () {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      },
    };

    return engine;
  }

  /* ---------- tiny drawing helpers ------------------------------------- */

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function emoji(ctx, glyph, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    if (rotation) ctx.rotate(rotation);
    ctx.font = size + "px serif";
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }

  function label(ctx, text, x, y, size, color, weight) {
    ctx.save();
    ctx.font =
      (weight || 800) + " " + size + 'px "Baloo 2", system-ui, sans-serif';
    ctx.fillStyle = color || "#5a4433";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function bubble(ctx, text, x, y, size) {
    ctx.save();
    ctx.font = "800 " + size + 'px "Baloo 2", system-ui, sans-serif';
    var w = ctx.measureText(text).width + 26;
    var h = size + 16;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2);
    ctx.fill();
    ctx.fillStyle = "#5a4433";
    ctx.fillText(text, x, y + 1);
    ctx.restore();
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  window.Engine = {
    create: createEngine,
    logicalSize: logicalSize,
    roundRect: roundRect,
    emoji: emoji,
    label: label,
    bubble: bubble,
    rand: rand,
    pick: pick,
    clamp: clamp,
  };

  window.Games = window.Games || {};
})();
