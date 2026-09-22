/* Tiny WebAudio sound box - no audio files needed. */
(function () {
  var ctx = null;
  var muted = false;

  function ensure() {
    if (muted) return null;
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime + start;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function slide(from, to, dur, type, gain) {
    var c = ensure();
    if (!c) return;
    var t0 = c.currentTime;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(gain || 0.16, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, gain) {
    var c = ensure();
    if (!c) return;
    var frames = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, frames, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    var src = c.createBufferSource();
    var g = c.createGain();
    var filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    g.gain.value = gain || 0.14;
    src.buffer = buf;
    src.connect(filter).connect(g).connect(c.destination);
    src.start();
  }

  var sounds = {
    pop: function () {
      tone(660, 0, 0.09, "triangle", 0.16);
    },
    tap: function () {
      tone(420, 0, 0.06, "square", 0.07);
    },
    blip: function () {
      tone(880, 0, 0.05, "sine", 0.05);
    },
    catch: function () {
      tone(740, 0, 0.09, "triangle", 0.16);
      tone(988, 0.07, 0.12, "triangle", 0.14);
    },
    miss: function () {
      slide(300, 120, 0.25, "sawtooth", 0.1);
    },
    splash: function () {
      noise(0.35, 0.12);
    },
    bite: function () {
      tone(1200, 0, 0.07, "square", 0.12);
      tone(1200, 0.12, 0.07, "square", 0.12);
    },
    reel: function () {
      slide(200, 900, 0.4, "triangle", 0.12);
    },
    match: function () {
      tone(659, 0, 0.1, "sine", 0.14);
      tone(880, 0.09, 0.16, "sine", 0.13);
    },
    hurt: function () {
      slide(400, 90, 0.3, "square", 0.12);
    },
    coin: function () {
      tone(988, 0, 0.07, "square", 0.1);
      tone(1319, 0.06, 0.12, "square", 0.09);
    },
    win: function () {
      [523, 659, 784, 1047].forEach(function (f, i) {
        tone(f, i * 0.11, 0.3, "triangle", 0.15);
      });
    },
    lose: function () {
      [440, 392, 330].forEach(function (f, i) {
        tone(f, i * 0.13, 0.3, "triangle", 0.12);
      });
    },
    gift: function () {
      [523, 587, 659, 784, 880, 1047].forEach(function (f, i) {
        tone(f, i * 0.09, 0.35, "sine", 0.14);
      });
    },
    firework: function () {
      noise(0.5, 0.1);
      tone(180, 0, 0.3, "sine", 0.1);
    },
  };

  window.Sound = {
    play: function (name) {
      if (muted) return;
      var fn = sounds[name];
      if (fn) {
        try {
          fn();
        } catch (e) {
          /* audio is a nice-to-have */
        }
      }
    },
    setMuted: function (value) {
      muted = !!value;
    },
    isMuted: function () {
      return muted;
    },
    unlock: function () {
      ensure();
    },
  };
})();
